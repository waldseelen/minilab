"""
Gezegen Keşfi quiz'ini veritabanına ekleyen script
"""
import os
import sys
import django

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings.dev')
django.setup()

from apps.experiments.models import Category, Experiment

def add_solar_quiz():
    # Astronomi kategorisini bul
    try:
        astro = Category.objects.get(slug='astronomi')
    except Category.DoesNotExist:
        print("❌ Astronomi kategorisi bulunamadı!")
        return

    # Deney zaten varsa güncelle, yoksa oluştur
    experiment, created = Experiment.objects.update_or_create(
        slug='gezegen-kesfi',
        defaults={
            'category': astro,
            'title': 'Gezegen Keşfi',
            'short_description': 'Güneş Sistemindeki gezegenleri keşfet ve öğren!',
            'description': '''
Uzay yolculuğuna hazır mısın? Bu keşifte Güneş Sistemindeki
gezegenleri tanıyacak ve özelliklerin öğreneceksin! 🚀

🌍 Bu macerade:
- Her gezegenin özel bilgisini öğreneceksin
- Sorulara doğru cevap vererek puan kazanacaksın
- Uzay hakkında ilginç gerçekleri keşfedeceksin

Her doğru cevap seni yeni bir gezegene götürür!
            '''.strip(),
            'experiment_type': 'simulation',
            'difficulty': 'easy',
            'pixi_script': 'solar_quiz.js',
            'points': 25,
            'estimated_time': 8,
            'learning_objectives': '''Güneş Sistemi gezegenlerini tanıma
Gezegen özelliklerini öğrenme
Uzay ve astronomi bilgisi
Görsel hafıza ve hatırlama''',
            'parent_info': '''
Bu aktivite, çocuğunuzun uzay ve astronomi merakını besler.
Gezegenler hakkında temel bilgiler edinir ve bilim dünyasına
ilgi duyar. Gece gökyüzünü birlikte gözlemleyerek bu öğrendiklerini
pekiştirebilirsiniz!
            '''.strip(),
            'order': 2,
            'is_active': True,
            'is_featured': True,
        }
    )

    if created:
        print(f"✅ '{experiment.title}' deneyi oluşturuldu!")
    else:
        print(f"♻️ '{experiment.title}' deneyi güncellendi!")

    print(f"   Kategori: {experiment.category.name}")
    print(f"   Zorluk: {experiment.get_difficulty_display()}")
    print(f"   Puan: {experiment.points}")
    print(f"   Script: {experiment.pixi_script}")

if __name__ == '__main__':
    print("🌍 Gezegen Keşfi quiz'i ekleniyor...\n")
    add_solar_quiz()
    print("\n✨ İşlem tamamlandı!")
