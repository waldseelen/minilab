"""
Bitki Büyütme Döngüsü deneyini veritabanına ekleyen script
"""
import os
import sys
import django

# Django setup
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings.dev')
django.setup()

from apps.experiments.models import Category, Experiment

def add_plant_growth_experiment():
    # Biyoloji kategorisini bul
    try:
        biology = Category.objects.get(slug='biyoloji-saglik')
    except Category.DoesNotExist:
        print("❌ Biyoloji & Sağlık kategorisi bulunamadı!")
        return

    # Deney zaten varsa güncelle, yoksa oluştur
    experiment, created = Experiment.objects.update_or_create(
        slug='bitki-buyume-dongusu',
        defaults={
            'category': biology,
            'title': 'Bitki Büyüme Döngüsü',
            'short_description': 'Tohumdan çiçeğe! Bitkilerin nasıl büyüdüğünü öğren.',
            'description': '''
Bitkiler nasıl büyür? Bu deneyde bir tohumu ekip, su ve güneş vererek
büyümesini izleyeceksin! Tohumdan filize, fileden çiçeğe kadar tüm
aşamaları göreceğiz.

🌱 Bitkiler büyümek için neye ihtiyaç duyar?
💧 Su
☀️ Güneş ışığı
🌍 Toprak

Her aşamada farklı ihtiyaçları olduğunu keşfedeceksin!
            '''.strip(),
            'experiment_type': 'simulation',
            'difficulty': 'easy',
            'pixi_script': 'plant_growth.js',
            'points': 15,
            'estimated_time': 5,
            'learning_objectives': '''Bitkilerin yaşam döngüsünü anlama
Su ve güneşin bitki büyümesindeki rolünü öğrenme
Tohum, filiz, olgun bitki ve çiçek aşamalarını tanıma
Sabır ve gözlem becerileri geliştirme''',
            'parent_info': '''
Bu deney, çocuğunuzun doğa ve yaşam döngüleri hakkında temel bilgileri
öğrenmesine yardımcı olur. Gerçek hayatta bir bitki yetiştirmeyi de
deneyebilirsiniz! Ev içinde fesleğen veya nane gibi kolay yetişen bitkiler
bu deney için harika bir tamamlayıcı olabilir.
            '''.strip(),
            'order': 3,
            'is_active': True,
            'is_featured': False,
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
    print("🌱 Bitki Büyütme Döngüsü deneyi ekleniyor...\n")
    add_plant_growth_experiment()
    print("\n✨ İşlem tamamlandı!")
