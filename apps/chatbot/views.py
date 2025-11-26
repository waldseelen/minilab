"""
MiniLab - Chatbot Views
MiniBot sohbet görünümleri - Güvenli Çocuk Modu ile Gemini API Entegrasyonu.
"""
from django.shortcuts import render
from django.contrib.auth.decorators import login_required
from django.http import JsonResponse
from django.conf import settings
from .models import ChatMessage
import json
import re

# Google Gemini API
try:
    import google.generativeai as genai
    GEMINI_AVAILABLE = True
except ImportError:
    GEMINI_AVAILABLE = False


def filter_unsafe_content(message):
    """
    Mesajda güvensiz içerik var mı kontrol et.
    """
    message_lower = message.lower()
    blocked_keywords = getattr(settings, 'MINIBOT_BLOCKED_KEYWORDS', [])

    for keyword in blocked_keywords:
        if keyword in message_lower:
            return True, keyword
    return False, None


def get_safe_redirect_response():
    """
    Uygunsuz konularda güvenli yönlendirme yanıtları.
    """
    import random
    responses = [
        "Hmm, bunun yerine hayvanlar hakkında konuşsak nasıl olur? 🦁 En sevdiğin hayvan ne?",
        "Biliyor musun, uzayda çok ilginç şeyler var! 🚀 Gezegenler hakkında konuşalım mı?",
        "Sana bir bilmece sorayım mı? 🤔 Gökkuşağında kaç renk var?",
        "Dinozorları seviyor musun? 🦕 Sana onlar hakkında ilginç şeyler anlatabilirim!",
        "Hadi bir deney yapalım! 🔬 Su ve renkleri karıştırmayı denedin mi hiç?",
        "Böcekler çok ilginç canlılar! 🐛 Karıncaların ne kadar güçlü olduğunu biliyor musun?",
    ]
    return random.choice(responses)


def get_context_from_history(user):
    """
    Kullanıcının son sohbet geçmişinden bağlam oluştur.
    """
    try:
        recent_messages = ChatMessage.objects.filter(
            user=user
        ).order_by('-created_at')[:5]

        if recent_messages:
            context = "Son konuşmalar:\n"
            for msg in reversed(list(recent_messages)):
                role = "Çocuk" if msg.is_user else "MiniBot"
                context += f"{role}: {msg.message[:100]}\n"
            return context
    except:
        pass
    return ""


@login_required
def chat_view(request):
    """
    MiniBot sohbet sayfası.
    """
    # Son mesajları getir
    try:
        recent_messages = ChatMessage.objects.filter(
            user=request.user
        ).order_by('-created_at')[:20]
        messages_list = list(reversed(list(recent_messages)))
    except:
        messages_list = []

    context = {
        'page_title': 'MiniBot ile Sohbet',
        'messages': messages_list,
        'minibot_greeting': get_greeting_message(request.user),
    }
    return render(request, 'chatbot/chat.html', context)


def get_greeting_message(user):
    """
    Kullanıcıya özel karşılama mesajı.
    """
    import random

    # Kullanıcı adını al (varsa)
    name = getattr(user, 'first_name', '') or 'küçük kaşif'

    greetings = [
        f"Merhaba {name}! 🤖 Ben MiniBot! Bugün ne öğrenmek istersin?",
        f"Selam {name}! 🌟 Birlikte bilim yapmaya hazır mısın?",
        f"Hoş geldin {name}! 🚀 Sana ne anlatayım bugün?",
        f"Merhaba küçük bilim insanı! 🔬 Ben MiniBot, seninle tanıştığıma çok sevindim!",
    ]
    return random.choice(greetings)


@login_required
def send_message(request):
    """
    MiniBot'a mesaj gönder (AJAX).
    Güvenlik filtreleri ve Gemini API ile.
    """
    if request.method != 'POST':
        return JsonResponse({'error': 'Geçersiz istek'}, status=400)

    try:
        data = json.loads(request.body)
        user_message = data.get('message', '').strip()
    except json.JSONDecodeError:
        user_message = request.POST.get('message', '').strip()

    if not user_message:
        return JsonResponse({'error': 'Mesaj boş olamaz'}, status=400)

    # Mesaj uzunluk kontrolü (çocuklar uzun mesaj yazmaz)
    if len(user_message) > 500:
        user_message = user_message[:500]

    # Güvenlik filtresi
    is_unsafe, blocked_word = filter_unsafe_content(user_message)
    if is_unsafe:
        bot_response = get_safe_redirect_response()
    else:
        # Gemini API ile yanıt al
        bot_response = get_minibot_response(user_message, request.user)

    # Mesajları veritabanına kaydet
    try:
        # Kullanıcı mesajı
        ChatMessage.objects.create(
            user=request.user,
            message=user_message,
            is_user=True
        )
        # Bot yanıtı
        ChatMessage.objects.create(
            user=request.user,
            message=bot_response,
            is_user=False
        )
    except Exception as e:
        print(f"Mesaj kaydetme hatası: {e}")

    return JsonResponse({
        'success': True,
        'response': bot_response,
        'tts_enabled': True,  # Frontend'de TTS için
    })


def get_minibot_response(message, user=None):
    """
    MiniBot yanıtı oluştur.
    Gelişmiş Gemini API entegrasyonu ile.
    """
    if GEMINI_AVAILABLE and getattr(settings, 'GEMINI_API_KEY', ''):
        try:
            genai.configure(api_key=settings.GEMINI_API_KEY)

            # Model ve ayarları al
            model_name = getattr(settings, 'GEMINI_MODEL', 'gemini-1.5-flash')
            generation_config = getattr(settings, 'GEMINI_GENERATION_CONFIG', {
                'temperature': 0.7,
                'max_output_tokens': 200,
            })
            safety_settings = getattr(settings, 'GEMINI_SAFETY_SETTINGS', None)

            # Persona'yı al (System Prompt)
            system_instruction = getattr(settings, 'MINIBOT_PERSONA', '')

            # Model oluştur
            model = genai.GenerativeModel(
                model_name=model_name,
                generation_config=generation_config,
                safety_settings=safety_settings,
                system_instruction=system_instruction  # System prompt buraya
            )

            # Sohbet geçmişi bağlamı
            history = []
            if user:
                # Son 5 mesajı al ve Gemini formatına çevir
                recent_messages = ChatMessage.objects.filter(
                    user=user
                ).order_by('-created_at')[:5]

                for msg in reversed(list(recent_messages)):
                    role = "user" if msg.is_user else "model"
                    history.append({"role": role, "parts": [msg.message]})

            # Chat oturumu başlat
            chat = model.start_chat(history=history)

            # Yanıt oluştur
            response = chat.send_message(message)

            if response and response.text:
                # Yanıtı temizle
                clean_response = clean_bot_response(response.text)

                # Döngü kontrolü: Eğer son yanıtla aynıysa değiştir
                if history and history[-1]['role'] == 'model' and history[-1]['parts'][0] == clean_response:
                    return "Bunu daha önce konuşmuştuk! 😅 Başka bir şey sormak ister misin? Mesela uzay hakkında? 🚀"

                return clean_response

        except Exception as e:
            print(f"Gemini API hatası: {e}")

    # Fallback: Akıllı yanıt sistemi
    return get_smart_fallback_response(message)


def clean_bot_response(response):
    """
    Bot yanıtını temizle ve formatla.
    """
    # Gereksiz boşlukları temizle
    response = response.strip()

    # Çok uzunsa kısalt
    if len(response) > 300:
        sentences = response.split('.')
        response = '. '.join(sentences[:3]) + '.'

    # Yetişkin dili içeriyorsa kontrol et
    unsafe_patterns = [
        r'\b(öl|kan|şiddet|savaş)\w*',
        r'\b(korkunç|korkutucu)\w*',
    ]

    for pattern in unsafe_patterns:
        if re.search(pattern, response, re.IGNORECASE):
            return get_safe_redirect_response()

    return response


def get_smart_fallback_response(message):
    """
    Gemini yokken akıllı fallback yanıtlar.
    Konu tespiti ile.
    """
    import random
    message_lower = message.lower()

    # Konu bazlı yanıtlar
    topic_responses = {
        # Hayvanlar
        ('hayvan', 'kedi', 'köpek', 'aslan', 'fil', 'kuş'): [
            "Hayvanları ben de çok seviyorum! 🐾 Onlar çok özel canlılar. Senin evcil hayvanın var mı?",
            "Vay, hayvanlara meraklısın! 🦁 Biliyor musun, aslanlar günde 20 saat uyuyabiliyor! İlginç değil mi?",
        ],
        # Uzay
        ('uzay', 'yıldız', 'gezegen', 'ay', 'güneş', 'roket'): [
            "Uzay çok büyük bir yer! 🚀 Milyonlarca yıldız var orada. En çok hangi gezegeni merak ediyorsun?",
            "Ay'ı görmek çok güzel, değil mi? 🌙 Biliyor musun, Ay'da hiç rüzgar yok! Bayrak bile sallanmaz!",
        ],
        # Dinozorlar
        ('dinozor', 'dino', 't-rex'): [
            "Dinozorlar çok çok eskiden yaşamış! 🦕 T-Rex'in dişleri muz kadar büyükmüş! Hangi dinozoru en çok seviyorsun?",
            "Dinozorlar süper ilginç! 🦖 Bazıları evimiz kadar büyükmüş! Onlar hakkında daha çok şey öğrenmek ister misin?",
        ],
        # Renkler
        ('renk', 'mavi', 'kırmızı', 'sarı', 'yeşil', 'gökkuşağı'): [
            "Renkler çok eğlenceli! 🌈 Biliyor musun, gökkuşağında 7 renk var! Sen kaçını sayabilirsin?",
            "Renkleri karıştırmak çok eğlenceli! 🎨 Mavi ve sarı karışırsa ne olur? Yeşil! 💚",
        ],
        # Su
        ('su', 'yağmur', 'deniz', 'okyanus', 'balık'): [
            "Su çok önemli! 💧 Bütün canlılar suya ihtiyaç duyar. Sen günde kaç bardak su içiyorsun?",
            "Okyanuslar çok büyük! 🌊 İçinde milyonlarca balık yaşıyor. En sevdiğin balık hangisi?",
        ],
        # Vücut
        ('vücut', 'kalp', 'beyin', 'göz', 'kulak', 'el'): [
            "Vücudumuz harika bir makine! 💪 Biliyor musun, kalbimiz hiç durmadan çalışır! Elini göğsüne koy, hissedebilir misin?",
            "Beynimiz süper güçlü bir bilgisayar gibi! 🧠 Her şeyi o kontrol eder. Şimdi ne düşünüyorsun?",
        ],
        # Yemek
        ('yemek', 'meyve', 'sebze', 'yiyecek', 'elma', 'portakal'): [
            "Sağlıklı yemekler bizi güçlü yapar! 🍎 Meyveler çok lezzetli. En sevdiğin meyve ne?",
            "Sebzeler süper güç verir! 🥕 Havuç yersen gözlerin çok iyi görür! Sen hangi sebzeleri seviyorsun?",
        ],
    }

    # Konu tespiti
    for keywords, responses in topic_responses.items():
        if any(keyword in message_lower for keyword in keywords):
            return random.choice(responses)

    # Soru mu kontrol et
    if '?' in message or any(q in message_lower for q in ['neden', 'nasıl', 'ne', 'kim', 'nerede', 'ne zaman']):
        curious_responses = [
            "Hmm, çok güzel bir soru! 🤔 Ben de düşünüyorum... Beraber araştıralım mı?",
            "Vay canına, meraklı bir kaşifsin! 🌟 Bu soruyu sormak çok akıllıca!",
            "İlginç bir soru! 🔬 Bilim insanları da böyle sorular sorar. Sen de bir bilim insanı mısın?",
        ]
        return random.choice(curious_responses)

    # Selamlama
    if any(word in message_lower for word in ['merhaba', 'selam', 'hey', 'sa', 'günaydın']):
        return "Merhaba küçük kaşif! 🤖 Ben MiniBot! Bugün ne öğrenmek istersin? Hayvanlar, uzay, dinozorlar... Hangisi olsun? 🚀"

    # Genel fallback
    general_responses = [
        "Vay canına, ne güzel bir konu! 🌟 Bana biraz daha anlatır mısın?",
        "Hmm, çok ilginç! 🤔 Bu konuda daha çok şey öğrenmek ister misin?",
        "Harika! 🎉 Sen gerçek bir bilim insanısın! Başka ne merak ediyorsun?",
        "Bu çok güzel! 💫 Birlikte daha çok şey keşfedelim mi?",
        "Merak etmek çok güzel bir şey! 🔬 Sormaya devam et küçük kaşif!",
    ]
    return random.choice(general_responses)


@login_required
def get_hint(request):
    """
    Bağlama göre ipucu al (AJAX).
    """
    context_type = request.GET.get('type', 'general')
    context_id = request.GET.get('id')

    hints = {
        'general': 'Merhaba! Ben MiniBot! 🤖 Sana yardım etmek için buradayım! Ne öğrenmek istersin?',
        'experiment': 'Bu deneyde çok eğlenceli şeyler yapacağız! 🔬 Dikkatli ol ve büyüklerinden yardım iste!',
        'story': 'Bir hikaye okumaya ne dersin? 📖 Ben sana yardım ederim!',
        'category': 'Bu kategoride çok ilginç şeyler var! 🌟 Hadi birlikte keşfedelim!',
        'shop': 'Mağazada çok güzel avatarlar var! 🛒 Puan kazanarak alabilirsin!',
    }

    return JsonResponse({
        'hint': hints.get(context_type, hints['general']),
        'animation': 'wave',
    })


@login_required
def text_to_speech(request):
    """
    Metni sese çevir (Web Speech API frontend'de yapılacak).
    Bu endpoint metin ve TTS ayarlarını döndürür.
    """
    text = request.GET.get('text', '')

    return JsonResponse({
        'text': text,
        'lang': 'tr-TR',
        'rate': 0.9,  # Çocuklar için biraz yavaş
        'pitch': 1.1,  # Biraz yüksek ton (daha çocuksu)
    })


@login_required
def clear_history(request):
    """
    Sohbet geçmişini temizle.
    """
    if request.method == 'POST':
        try:
            ChatMessage.objects.filter(user=request.user).delete()
            return JsonResponse({'success': True, 'message': 'Sohbet geçmişi temizlendi!'})
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)
    return JsonResponse({'error': 'Geçersiz istek'}, status=400)
