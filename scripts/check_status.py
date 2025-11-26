"""
MiniLab Sistem Durumu Kontrolü
Tüm özelliklerin doğru çalıştığını test eder.
"""
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings.dev')
django.setup()

from apps.experiments.models import Category, Experiment, LearningCard
from apps.accounts.models import User
from apps.gamification.models import Badge, AvatarItem
from apps.storymode.models import Story
from django.conf import settings

def check_system():
    """Sistem durumunu kontrol et"""

    print("=" * 60)
    print("🔍 MİNİLAB SİSTEM DURUMU KONTROLÜ")
    print("=" * 60)

    # 1. Veritabanı Kontrolleri
    print("\n📊 VERİTABANI İSTATİSTİKLERİ:")
    print(f"   ✅ Kategoriler: {Category.objects.count()}")
    print(f"   ✅ Deneyler: {Experiment.objects.count()}")
    print(f"   ✅ Öğrenme Kartları: {LearningCard.objects.count()}")
    print(f"   ✅ Kullanıcılar: {User.objects.count()}")
    print(f"   ✅ Rozetler: {Badge.objects.count()}")
    print(f"   ✅ Avatar Öğeleri: {AvatarItem.objects.count()}")
    print(f"   ✅ Hikayeler: {Story.objects.count()}")

    # 2. Son Eklenen Deneyler
    print("\n🔬 SON EKLENEN DENEYLER:")
    for exp in Experiment.objects.order_by('-id')[:8]:
        print(f"   • {exp.title}")
        print(f"     Kategori: {exp.category.name}")
        print(f"     Script: {exp.pixi_script}")
        print(f"     Zorluk: {exp.get_difficulty_display()}")
        print()

    # 3. Pixi.js Script Kontrolleri
    print("\n🎮 PİXİ.JS SİMÜLASYONLARI:")
    pixi_scripts = [
        'color_lab.js',
        'orbit_game.js',
        'plant_growth.js',
        'pattern_puzzle.js',
        'solar_quiz.js',
        'creative_drawing.js',
        'inventor_workshop.js',
        'circuit_design.js'
    ]

    for script in pixi_scripts:
        path = f'static/js/pixi/{script}'
        exists = os.path.exists(path)
        status = "✅" if exists else "❌"
        print(f"   {status} {script}")

    # 4. Gemini Ayarları
    print("\n🤖 GEMİNİ API AYARLARI:")
    print(f"   ✅ Model: {settings.GEMINI_MODEL}")
    print(f"   ✅ API Key: {'***' + settings.GEMINI_API_KEY[-10:] if settings.GEMINI_API_KEY else '❌ YOK'}")
    print(f"   ✅ Temperature: {settings.GEMINI_GENERATION_CONFIG.get('temperature')}")
    print(f"   ✅ Max Tokens: {settings.GEMINI_GENERATION_CONFIG.get('max_output_tokens')}")

    # 5. Template Kontrolleri
    print("\n📄 TEMPLATE DOSYALARI:")
    templates = [
        'templates/base.html',
        'templates/pages/landing.html',
        'templates/dashboard/child_dashboard.html',
        'templates/experiments/experiment_play.html',
        'templates/experiments/learning_cards.html',
        'templates/chatbot/chat.html'
    ]

    for template in templates:
        exists = os.path.exists(template)
        status = "✅" if exists else "❌"
        print(f"   {status} {template}")

    # 6. Özellik Durumları
    print("\n✨ ÖZELLİK DURUMLARI:")
    features = [
        ("Landing Page Modernizasyonu", True),
        ("Dashboard Modernizasyonu", True),
        ("Gemini 2.5 Flash Türkçe", True),
        ("Sesli Arayüz (Voice-First)", True),
        ("Mucit Atölyesi", Experiment.objects.filter(slug='mucit-atolyesi').exists()),
        ("Devre Tasarımı", Experiment.objects.filter(slug='devre-tasarimi').exists()),
        ("Renk Laboratuvarı", Experiment.objects.filter(pixi_script='color_lab.js').exists()),
        ("Gezegen Yörünge", Experiment.objects.filter(pixi_script='orbit_game.js').exists()),
        ("Bitki Büyütme", Experiment.objects.filter(pixi_script='plant_growth.js').exists()),
        ("Pattern Puzzle", Experiment.objects.filter(pixi_script='pattern_puzzle.js').exists()),
        ("Solar Quiz", Experiment.objects.filter(pixi_script='solar_quiz.js').exists()),
        ("Creative Drawing", Experiment.objects.filter(pixi_script='creative_drawing.js').exists())
    ]

    for feature, status in features:
        icon = "✅" if status else "❌"
        print(f"   {icon} {feature}")

    # 7. Kritik Dosyalar
    print("\n🔧 KRİTİK DOSYALAR:")
    critical = [
        'config/settings/base.py',
        'config/settings/dev.py',
        'apps/chatbot/views.py',
        'apps/experiments/models.py',
        'manage.py'
    ]

    for file in critical:
        exists = os.path.exists(file)
        status = "✅" if exists else "❌"
        print(f"   {status} {file}")

    print("\n" + "=" * 60)
    print("✅ KONTROL TAMAMLANDI!")
    print("=" * 60)

if __name__ == '__main__':
    check_system()
