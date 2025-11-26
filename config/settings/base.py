"""
MiniLab Django Settings - Base Configuration
Ortak ayarların bulunduğu dosya.
"""
import os
from pathlib import Path
from dotenv import load_dotenv

# .env dosyasını yükle
load_dotenv()

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent.parent

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = os.getenv('DJANGO_SECRET_KEY', 'django-insecure-change-this-in-production')

# Application definition
DJANGO_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
]

THIRD_PARTY_APPS = [
    'tailwind',
    'django_browser_reload',
]

LOCAL_APPS = [
    'apps.accounts',
    'apps.experiments',
    'apps.dashboard',
    'apps.gamification',
    'apps.storymode',
    'apps.chatbot',
    'apps.admin_panel',
    'apps.parent_panel',
]

INSTALLED_APPS = DJANGO_APPS + THIRD_PARTY_APPS + LOCAL_APPS

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'whitenoise.middleware.WhiteNoiseMiddleware',  # Static dosyalar için
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'config.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [BASE_DIR / 'templates'],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
                'apps.context_processors.star_dust_processor',
            ],
        },
    },
]

WSGI_APPLICATION = 'config.wsgi.application'

# Password validation
AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]

# Custom User Model
AUTH_USER_MODEL = 'accounts.User'

# Internationalization - Türkçe
LANGUAGE_CODE = 'tr-tr'
TIME_ZONE = 'Europe/Istanbul'
USE_I18N = True
USE_TZ = True

# Static files (CSS, JavaScript, Images)
STATIC_URL = '/static/'
STATICFILES_DIRS = [BASE_DIR / 'static']
STATIC_ROOT = BASE_DIR / 'staticfiles'

# Media files (User uploads)
MEDIA_URL = '/media/'
MEDIA_ROOT = BASE_DIR / 'media'

# Default primary key field type
DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# Tailwind CSS Configuration
TAILWIND_APP_NAME = 'theme'

# Gemini API Key (çevre değişkeninden)
GEMINI_API_KEY = os.getenv('GEMINI_API_KEY', 'AIzaSyB1EVzdN2BX1n8xG4gn6KChCfJxFVg0Vz4')

# MiniBot (AI) Ayarları - Güvenli Çocuk Modu (Türkçe Native - Gemini 2.5 Flash)
MINIBOT_PERSONA = """
🤖 SEN MİNİBOT'SUN - 4-6 yaş arası Türk çocukları için özel tasarlanmış, güvenli, eğitici ve eğlenceli bir bilim asistanısın!

🇹🇷 DİL AYARLARI:
- SADECE ve SADECE TÜRKÇE konuş. Hiçbir durumda İngilizce kelime kullanma.
- Doğal ve akıcı Türkçe kullan (örn: "Ne öğrenmek istersin?" yerine "Bugün ne keşfedelim?")
- Türk kültürüne uygun örnekler ver (örn: "lahmacun", "çay", "Boğaz Köprüsü", "Van Gölü")

📚 TEMEL KURALLAR:
1. **DOĞRULUK:** Her zaman GERÇEK ve DOĞRU bilimsel bilgiler ver. Uydurma cevaplar verme. Bilmiyorsan "Bunu henüz bilmiyorum ama birlikte öğrenebiliriz!" de.
2. **DİL SEVİYESİ:** Sadece 4-6 yaş seviyesinde, basit ve anlaşılır Türkçe kullan. Karmaşık kelimelerden kaçın.
3. **KISALIK:** Cevapların KISA ve ÖZ olsun (maksimum 2-3 cümle). Çocuklar uzun metinleri okuyamaz.
4. **POZİTİFLİK:** Her zaman neşeli, cesaretlendirici ve nazik ol.
5. **DÖNGÜ ENGELLEME:** Kendini tekrar etme. Eğer çocuk aynı şeyi sorarsa farklı bir şekilde anlat.

🛡️ GÜVENLİK KURALLARI (KESİNLİKLE UYULMALI):
- ASLA şiddet, korku, üzüntü, ölüm, savaş gibi konulardan bahsetme.
- ASLA yetişkin konularına girme.
- ASLA kişisel bilgi isteme.
- Tehlikeli konularda "Bunu büyüklerinle yapmalısın" uyarısı ver.

🎨 İLETİŞİM TARZI:
- Bol emoji kullan (her cümlede 1-2 tane). 🌟
- Çocuğa "küçük kaşif", "bilim insanı", "meraklı kedi" gibi sevecen hitaplar kullan.
- Soru sorarak sohbeti devam ettir (örn: "Peki sen ne düşünüyorsun?")
- Türkçe deyimler ve atasözleri kullanabilirsin (örn: "Damlaya damlaya göl olur 💧")

🔬 BİLİM KONULARI:
- Deneyleri adım adım anlat.
- "Neden?" sorularına mantıklı ve basit cevaplar ver.
- Türkiye'den örnekler ver (örn: "Kelebekler Nemrut Dağı'nda gezinir gibi...", "Deniz İstanbul Boğazı gibi...")

⚠️ ÖNEMLİ:
- Eğer çocuk anlamsız şeyler yazarsa, nazikçe konuyu bilime veya oyuna çek.
- Sürekli "Merhaba" deme, sohbete kaldığı yerden devam et.
- Çocuğun yazdıklarını onaylayarak başla (örn: "Vay canına!", "Harika soru!", "Çok meraklısın!")
"""

# MiniBot Güvenlik Filtreleri

# MiniBot Güvenlik Filtreleri
MINIBOT_BLOCKED_KEYWORDS = [
    'öldür', 'ölüm', 'kan', 'şiddet', 'savaş', 'silah',
    'korkunç', 'korkutucu', 'kâbus', 'hayalet',
    'küfür', 'kötü kelime', 'aptal', 'salak',
    'adres', 'telefon', 'şifre', 'para', 'kredi kartı',
]

# MiniBot Konu Yönlendirme
MINIBOT_SAFE_TOPICS = [
    'hayvanlar', 'bitkiler', 'uzay', 'gezegenler', 'yıldızlar',
    'renkler', 'gökkuşağı', 'su', 'hava', 'toprak',
    'dinozorlar', 'böcekler', 'kuşlar', 'balıklar',
    'mevsimler', 'yağmur', 'kar', 'güneş', 'ay',
    'vücut', 'beş duyu', 'yemekler', 'meyveler', 'sebzeler',
]

# Gemini Model Ayarları - Gemini 2.5 Flash (Native Turkish)
GEMINI_MODEL = 'gemini-2.0-flash-exp'  # En yeni ve hızlı model (2.5 Flash deneysel)
GEMINI_GENERATION_CONFIG = {
    'temperature': 0.8,  # Yaratıcı ve çocuk dostu
    'top_p': 0.95,
    'top_k': 40,
    'max_output_tokens': 250,  # Biraz daha uzun cevaplar için
    'response_mime_type': 'text/plain',
}

# Güvenlik Ayarları
GEMINI_SAFETY_SETTINGS = [
    {'category': 'HARM_CATEGORY_HARASSMENT', 'threshold': 'BLOCK_LOW_AND_ABOVE'},
    {'category': 'HARM_CATEGORY_HATE_SPEECH', 'threshold': 'BLOCK_LOW_AND_ABOVE'},
    {'category': 'HARM_CATEGORY_SEXUALLY_EXPLICIT', 'threshold': 'BLOCK_LOW_AND_ABOVE'},
    {'category': 'HARM_CATEGORY_DANGEROUS_CONTENT', 'threshold': 'BLOCK_LOW_AND_ABOVE'},
]

# Session ayarları
SESSION_COOKIE_AGE = 86400  # 1 gün
SESSION_SAVE_EVERY_REQUEST = True

# Login/Logout URL'leri
LOGIN_URL = '/hesap/giris/'
LOGIN_REDIRECT_URL = '/panel/'
LOGOUT_REDIRECT_URL = '/'
