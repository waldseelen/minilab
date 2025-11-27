"""
MiniBot Faz 4 Test Scripti
Duygu dostu iletişim, güvenlik filtreleri ve fallback sistemini test eder.
"""
import os
import sys
import django
from pathlib import Path

# Django setup
BASE_DIR = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(BASE_DIR))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from apps.chatbot.views import (
    get_safe_redirect_response,
    get_greeting_message,
    get_smart_fallback_response,
    filter_unsafe_content,
    clean_bot_response
)
from apps.accounts.models import User


def test_security_filter():
    """Güvenlik filtresini test et"""
    print("\n🛡️ GÜVENLİK FİLTRESİ TESTİ")
    print("=" * 60)

    test_cases = [
        ("Merhaba nasılsın?", False),
        ("Dinozorlar çok güzel", False),
        ("Öldürme oyunu oynayalım", True),
        ("Korkutucu bir film izledim", True),
        ("Şiddet dolu oyun", True),
        ("Adresim nedir?", True),
    ]

    for message, expected_blocked in test_cases:
        is_unsafe, keyword = filter_unsafe_content(message)
        status = "🔴 BLOKLANDı" if is_unsafe else "✅ GÜVENLİ"
        print(f"{status}: '{message}' {f'(Kelime: {keyword})' if keyword else ''}")

        if is_unsafe != expected_blocked:
            print(f"  ⚠️ HATA: Beklenen {expected_blocked}, bulunan {is_unsafe}")


def test_greeting_messages():
    """Karşılama mesajlarını test et"""
    print("\n👋 KARŞILAMA MESAJLARI TESTİ")
    print("=" * 60)

    # Dummy user oluştur
    try:
        user = User.objects.first()
        if not user:
            print("⚠️ Test için en az bir kullanıcı gerekli")
            return

        print(f"Kullanıcı: {user.username}")

        # 5 farklı karşılama mesajı al
        for i in range(5):
            greeting = get_greeting_message(user)
            print(f"{i+1}. {greeting}")

    except Exception as e:
        print(f"❌ Hata: {e}")


def test_fallback_responses():
    """Fallback yanıt sistemini test et"""
    print("\n💬 FALLBACK YANITLAR TESTİ")
    print("=" * 60)

    test_messages = [
        "Hayvanlar çok güzel",
        "Uzaya gitmek istiyorum",
        "Dinozorlar neden yok oldu?",
        "Gökkuşağı kaç renk?",
        "Üzgünüm bugün",
        "Yaptım! Başardım!",
        "Merhaba",
        "Teşekkür ederim",
        "Neden gökyüzü mavi?",
        "asdasd xyzabc",  # Anlamsız
    ]

    for message in test_messages:
        response = get_smart_fallback_response(message)
        print(f"\n📨 Mesaj: '{message}'")
        print(f"🤖 MiniBot: {response}")


def test_safe_redirect():
    """Güvenli yönlendirme yanıtlarını test et"""
    print("\n🔄 GÜVENLİ YÖNLENDİRME TESTİ")
    print("=" * 60)

    # 5 farklı yönlendirme mesajı al
    for i in range(5):
        response = get_safe_redirect_response()
        print(f"{i+1}. {response}")


def test_response_cleaning():
    """Yanıt temizleme fonksiyonunu test et"""
    print("\n🧹 YANIT TEMİZLEME TESTİ")
    print("=" * 60)

    test_responses = [
        "Bu çok güzel bir cevap!",
        "  Fazla boşluklu bir yanıt  ",
        "Bu çok uzun bir yanıt. " * 50,  # Çok uzun
        "Bu korkunç bir şey",  # Güvenli olmayan
        "Kan ve şiddet içeren bir yanıt",  # Güvenli olmayan
    ]

    for response in test_responses:
        cleaned = clean_bot_response(response)
        print(f"\n📝 Orijinal: '{response[:50]}...'")
        print(f"✨ Temiz: '{cleaned}'")
        print(f"   Uzunluk: {len(response)} → {len(cleaned)}")


def test_parent_inclusion():
    """Ebeveyn katılımı teşvikini test et"""
    print("\n👨‍👩‍👧 EBEVEYN KATILIMI TESTİ")
    print("=" * 60)

    parent_keywords = ['anne', 'baba', 'aile', 'birlikte', 'büyük']

    test_messages = [
        "Hayvanlar çok güzel",
        "Uzaya gitmek istiyorum",
        "Dinozorlar neden yok oldu?",
        "Renkler nasıl karışır?",
    ]

    for message in test_messages:
        response = get_smart_fallback_response(message)
        has_parent_ref = any(keyword in response.lower() for keyword in parent_keywords)

        status = "✅ Ebeveyn referansı VAR" if has_parent_ref else "ℹ️ Ebeveyn referansı YOK"
        print(f"\n{status}")
        print(f"📨 Mesaj: '{message}'")
        print(f"🤖 MiniBot: {response}")


def test_emotional_intelligence():
    """Duygusal zeka testi"""
    print("\n❤️ DUYGUSAL ZEKA TESTİ")
    print("=" * 60)

    emotional_messages = [
        "Çok mutluyum!",
        "Üzgünüm bugün",
        "Korkuyorum",
        "Yaptım! Başardım!",
        "Çok sevinçliyim",
    ]

    for message in emotional_messages:
        response = get_smart_fallback_response(message)
        print(f"\n📨 Duygusal Mesaj: '{message}'")
        print(f"🤖 MiniBot (Empatik): {response}")


def main():
    """Ana test fonksiyonu"""
    print("\n" + "=" * 60)
    print("🚀 MİNİBOT FAZ 4 TEST SÜİTİ")
    print("=" * 60)

    try:
        test_security_filter()
        test_greeting_messages()
        test_fallback_responses()
        test_safe_redirect()
        test_response_cleaning()
        test_parent_inclusion()
        test_emotional_intelligence()

        print("\n" + "=" * 60)
        print("✅ TÜM TESTLER TAMAMLANDI!")
        print("=" * 60)

    except Exception as e:
        print(f"\n❌ Test hatası: {e}")
        import traceback
        traceback.print_exc()


if __name__ == '__main__':
    main()
