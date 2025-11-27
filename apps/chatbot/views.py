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
    Sakinleştirici, motive edici ve ebeveyn dostu.
    """
    import random
    responses = [
        # Hayvanlar
        "Hmm, bunun yerine hayvanlar hakkında konuşsak nasıl olur? 🦁 En sevdiğin hayvan ne? Annene de sorabilirsin!",
        "Vay canına! 🐾 Biliyor musun kediler günde 16 saat uyur! Sen hangi hayvanı merak ediyorsun?",

        # Uzay
        "Biliyor musun, uzayda çok ilginç şeyler var! 🚀 Gezegenler hakkında konuşalım mı? Babana da anlat sonra!",
        "Gökyüzüne baktın mı hiç? ⭐ Yıldızlar hakkında sana güzel şeyler anlatayım!",

        # Oyunlar ve Bilmeceler
        "Sana bir bilmece sorayım mı? 🤔 Gökkuşağında kaç renk var? Birlikte sayalım!",
        "Hadi bir oyun oynayalım! 🎮 Sana renkleri öğreteyim, çok eğlenceli!",

        # Dinozorlar
        "Dinozorları seviyor musun? 🦕 Sana onlar hakkında inanılmaz şeyler anlatabilirim! Çok meraklı bir çocuksun!",
        "Eskiden dinozorlar varmış! 🦖 T-Rex'in dişleri muz kadar büyükmüş! İlginç değil mi?",

        # Deneyler
        "Hadi bir deney yapalım! 🔬 Su ve renkleri karıştırmayı denedin mi hiç? Büyüklerin de yardım edebilir!",
        "Bilim deneyleri çok eğlenceli! 🧪 Sana güvenli bir deney göstereyim mi?",

        # Doğa
        "Böcekler çok ilginç canlılar! 🐛 Karıncaların ne kadar güçlü olduğunu biliyor musun? Kendi ağırlıklarının 50 katını taşıyabilirler!",
        "Bahçede hiç çiçek gördün mü? 🌸 Çiçeklerin renkleri nereden geliyor biliyor musun? Sana anlatayım!",

        # Mevsimler ve Hava
        "Dışarıda hava nasıl? 🌤️ Bulutları sever misin? Bulutların nasıl oluştuğunu anlatayım!",
        "Kış mı yaz mı daha çok seviyorsun? ⛄☀️ Her mevsim çok özel! Hangisini konuşalım?",

        # Aile ile aktiviteler
        "Annenle birlikte mutfakta deney yapabilirsin! 🍪 Kurabiye yaparken kimyayı öğrenebilirsin!",
        "Babanla birlikte gökyüzünü izleyin! 🌙 Ay'ı görebilir misiniz? Çok güzel!",
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
    except (ChatMessage.DoesNotExist, Exception) as e:
        # Mesaj geçmişi alınamadı
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
    except (ChatMessage.DoesNotExist, Exception) as e:
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
    Duygu dostu, motive edici ve samimi.
    """
    import random
    from datetime import datetime

    # Kullanıcı adını al (varsa)
    name = getattr(user, 'first_name', '') or 'küçük kaşif'

    # Günün saatine göre selam
    hour = datetime.now().hour
    if 6 <= hour < 12:
        time_greeting = "Günaydın"
    elif 12 <= hour < 18:
        time_greeting = "İyi günler"
    elif 18 <= hour < 22:
        time_greeting = "İyi akşamlar"
    else:
        time_greeting = "Merhaba"

    greetings = [
        # Klasik selamlar
        f"{time_greeting} {name}! 🤖 Ben MiniBot! Bugün ne keşfetmek istersin? Çok meraklı bir çocuksun!",
        f"Selam {name}! 🌟 Birlikte bilim yapmaya hazır mısın? Sen harika bir bilim insanısın!",
        f"Hoş geldin {name}! 🚀 Sana bugün çok güzel şeyler anlatacağım! Ne öğrenmek istersin?",

        # Motive edici
        f"Vay be {name}, yine geldin! 🎉 Sen gerçek bir meraklı kedisin! Bugün ne soracaksın bakalım?",
        f"Merhaba cesur astronot {name}! 👨‍🚀 Uzaydan mı yoksa hayvanlardan mı konuşalım bugün?",
        f"Sevgili {name}! 💫 Biliyor musun, soru sormak çok akıllıca bir şey! Sen de çok zekisin!",

        # Aile katılımı teşvik
        f"Merhaba {name}! 🏡 Bugün anneni veya babanı da aramıza katabilirsin! Birlikte öğrenmek daha eğlenceli!",
        f"Hoşgeldin {name}! 🤗 Ailenle birlikte bilim yapmayı sever misin? Sana birlikte yapabileceğiniz deneyler gösterebilirim!",

        # Neşeli ve samimi
        f"Yaaaay! {name} geldi! 🎊 Ben seni çok seviyorum! Bugün hangi konuyu merak ediyorsun?",
        f"Selaaaam {name}! 😊 Ne güzel ki buradasın! Birlikte harika şeyler öğreneceğiz!",
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
    Konu tespiti ile. Duygu dostu, motive edici ve ebeveyn katılımını teşvik eden.
    """
    import random
    message_lower = message.lower()

    # Konu bazlı yanıtlar - Geliştirilmiş
    topic_responses = {
        # Hayvanlar
        ('hayvan', 'kedi', 'köpek', 'aslan', 'fil', 'kuş', 'kelebek', 'karınca'): [
            "Hayvanları ben de çok seviyorum! 🐾 Onlar çok özel canlılar. Senin evcil hayvanın var mı? Annenle birlikte bir hayvan bakabilirsin!",
            "Vay, hayvanlara meraklısın! 🦁 Biliyor musun, aslanlar günde 20 saat uyuyabiliyor! Sen de öyle uyuyor musun? 😴",
            "Kelebekler çok güzel! 🦋 Onlar tırtılken kanatları yoktu! Babanla birlikte bahçede kelebek arayabilirsiniz!",
            "Karıncalar süper güçlü! 🐜 Kendi ağırlıklarının 50 katını taşıyabilirler! Sen gerçek bir hayvan uzmanısın! 💪",
        ],
        # Uzay
        ('uzay', 'yıldız', 'gezegen', 'ay', 'güneş', 'roket', 'astronot'): [
            "Uzay çok büyük bir yer! 🚀 Milyonlarca yıldız var orada. Akşam ailenle birlikte gökyüzüne bakın, çok güzel!",
            "Ay'ı görmek çok güzel, değil mi? 🌙 Biliyor musun, Ay'da hiç rüzgar yok! Bayrak bile sallanmaz! İlginç değil mi?",
            "Astronotlar çok cesur! 👨‍🚀 Sen de bir gün astronot olmak ister misin? Hayal etmek çok güzel!",
            "Güneş çok sıcak! ☀️ Ama biz onu seviyoruz çünkü ışık veriyor! Babana 'Güneş neden sıcak?' diye sor bakalım!",
        ],
        # Dinozorlar
        ('dinozor', 'dino', 't-rex', 'trex'): [
            "Dinozorlar çok çok eskiden yaşamış! 🦕 T-Rex'in dişleri muz kadar büyükmüş! Hangi dinozoru en çok seviyorsun?",
            "Dinozorlar süper ilginç! 🦖 Bazıları evimiz kadar büyükmüş! Annenle birlikte dinozor kitabı okuyabilirsiniz!",
            "Vay canına, dinozor meraklısı! 🦴 Biliyor musun bazı dinozorlar uçabiliyormuş! Sen de meraklı bir kaşifsin!",
        ],
        # Renkler ve Sanat
        ('renk', 'mavi', 'kırmızı', 'sarı', 'yeşil', 'gökkuşağı', 'boya'): [
            "Renkler çok eğlenceli! 🌈 Biliyor musun, gökkuşağında 7 renk var! Sen kaçını sayabilirsin? Birlikte sayalım!",
            "Renkleri karıştırmak çok eğlenceli! 🎨 Mavi ve sarı karışırsa ne olur? Yeşil! 💚 Büyüklerinle birlikte deneyin!",
            "Boyama yapmayı sever misin? 🖍️ Renkler çok güzel! Annenle birlikte resim yapabilirsin!",
        ],
        # Su ve Doğa
        ('su', 'yağmur', 'deniz', 'okyanus', 'balık', 'nehir'): [
            "Su çok önemli! 💧 Bütün canlılar suya ihtiyaç duyar. Sen günde kaç bardak su içiyorsun? Sağlıklı kalmak için su içmeliyiz!",
            "Okyanuslar çok büyük! 🌊 İçinde milyonlarca balık yaşıyor. Babanla birlikte denize gittiniz mi?",
            "Yağmur çok güzel! ☔ Bulutlar ağlıyor gibi, değil mi? Ama aslında su damlacıkları yağıyor! İlginç!",
        ],
        # Vücut ve Sağlık
        ('vücut', 'kalp', 'beyin', 'göz', 'kulak', 'el', 'diş'): [
            "Vücudumuz harika bir makine! 💪 Biliyor musun, kalbimiz hiç durmadan çalışır! Elini göğsüne koy, hissedebilir misin?",
            "Beynimiz süper güçlü bir bilgisayar gibi! 🧠 Her şeyi o kontrol eder. Sen çok zeki bir çocuksun!",
            "Dişlerimizi fırçalamak çok önemli! 🦷 Her gün fırçalıyor musun? Aferin sana! Mikroplardan korur!",
            "Gözlerimiz çok özel! 👀 Her şeyi görürüz! Annenle birlikte renkli şeylere bakın!",
        ],
        # Yemek ve Beslenme
        ('yemek', 'meyve', 'sebze', 'yiyecek', 'elma', 'portakal', 'havuç'): [
            "Sağlıklı yemekler bizi güçlü yapar! 🍎 Meyveler çok lezzetli. En sevdiğin meyve ne? Annenle birlikte yiyebilirsin!",
            "Sebzeler süper güç verir! 🥕 Havuç yersen gözlerin çok iyi görür! Sen hangi sebzeleri seviyorsun?",
            "Yemek yemek çok önemli! 🍽️ Büyümek için iyi yemek yemeliyiz! Ailenle birlikte yemek çok güzel, değil mi?",
        ],
        # Mevsimler
        ('mevsim', 'yaz', 'kış', 'sonbahar', 'ilkbahar', 'kar', 'çiçek'): [
            "Mevsimler çok güzel! 🌸 En sevdiğin mevsim hangisi? Her mevsim farklı ve özel!",
            "Kar çok eğlenceli! ⛄ Kışın kartopu oynamayı sever misin? Ailenle birlikte kardan adam yapabilirsiniz!",
            "İlkbaharda çiçekler açar! 🌺 Babanla birlikte bahçeye bakın, kaç çiçek sayabilirsiniz?",
        ],
    }

    # Konu tespiti
    for keywords, responses in topic_responses.items():
        if any(keyword in message_lower for keyword in keywords):
            return random.choice(responses)

    # Duygusal durumlar
    if any(word in message_lower for word in ['üzgün', 'ağla', 'korktu', 'korku', 'üzül']):
        comfort_responses = [
            "Üzülme canım! 🤗 Her şey düzelecek! Sen çok cesur bir çocuksun! Anneni veya babanı yanına çağırır mısın?",
            "Merak etme küçük kaşif! 💙 Ben buradayım! Sana güzel bir şey anlatayım mı? Seni mutlu edecek!",
        ]
        return random.choice(comfort_responses)

    # Başarı ifadeleri
    if any(word in message_lower for word in ['yaptı', 'başar', 'bitti', 'tamamla']):
        success_responses = [
            "BRAVO! 🎉 Sen harikasın! Başardın! Bunu annene anlat, çok sevinecek!",
            "Aferin sana! 🌟 Sen gerçek bir şampiyon! Çok gurur duyuyorum!",
        ]
        return random.choice(success_responses)

    # Soru mu kontrol et
    if '?' in message or any(q in message_lower for q in ['neden', 'nasıl', 'ne', 'kim', 'nerede', 'ne zaman', 'niye']):
        curious_responses = [
            "Hmm, çok güzel bir soru! 🤔 Meraklı çocuklar en akıllı çocuklardır! Beraber düşünelim!",
            "Vay canına, harika bir soru! 🌟 Bu soruyu sormak çok zekice! Sen gerçek bir bilim insanısın!",
            "İlginç bir soru! 🔬 Bilim insanları da böyle sorular sorar. Büyüklerinden de sor bakalım ne diyecekler!",
            "Ne kadar meraklısın! 💡 Merak eden öğrenir! Sen çok özel bir çocuksun!",
        ]
        return random.choice(curious_responses)

    # Selamlama
    if any(word in message_lower for word in ['merhaba', 'selam', 'hey', 'sa', 'günaydın', 'iyi akşam']):
        return "Merhaba küçük kaşif! 🤖 Ben MiniBot! Bugün ne öğrenmek istersin? Hayvanlar, uzay, dinozorlar... Hangisi olsun? Annen ve baban da katılabilir! 🚀"

    # Teşekkür
    if any(word in message_lower for word in ['teşekkür', 'sağol', 'eyv']):
        return "Rica ederim canım! 💙 Sen çok tatlısın! Ne zaman istersen konuşabiliriz! 🤗"

    # Genel fallback - Daha motive edici
    general_responses = [
        "Vay canına, ne güzel bir konu! 🌟 Bana biraz daha anlatır mısın? Seni dinlemek çok güzel!",
        "Hmm, çok ilginç! 🤔 Bu konuda daha çok şey öğrenmek ister misin? Birlikte araştıralım!",
        "Harika! 🎉 Sen gerçek bir bilim insanısın! Başka ne merak ediyorsun? Her sorun çok önemli!",
        "Bu çok güzel! 💫 Birlikte daha çok şey keşfedelim mi? Annenle birlikte deney yapabilirsin!",
        "Merak etmek çok güzel bir şey! 🔬 Sormaya devam et küçük kaşif! Sen çok akıllısın!",
        "Ne kadar zekisin! 🧠 Bunu konuşmak çok eğlenceli! Babanla da paylaş bu konuyu!",
        "Vay be! 👏 Sen her şeyi öğrenmek istiyorsun! Bu çok güzel! Devam et!",
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
