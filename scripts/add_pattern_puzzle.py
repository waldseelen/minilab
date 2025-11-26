"""
Mantık Bulmacası deneyini veritabanına ekleyen script
"""
import os
import sys
import django

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings.dev')
django.setup()

from apps.experiments.models import Category, Experiment

def add_pattern_puzzle():
    # Matematik & Mantık kategorisini bul
    try:
        math = Category.objects.get(slug='matematik-mantik')
    except Category.DoesNotExist:
        print("❌ Matematik & Mantık kategorisi bulunamadı!")
        return

    # Deney zaten varsa güncelle, yoksa oluştur
    experiment, created = Experiment.objects.update_or_create(
        slug='oruntuyu-bul',
        defaults={
            'category': math,
            'title': 'Örüntüyü Bul!',
            'short_description': 'Mantık ve örüntü bulma becerilerini geliştir!',
            'description': '''
Matematikte örüntüler çok önemlidir! Bu bulmacada renkler, şekiller
ve boyutlar bir sıra oluşturuyor. Senin görevin sıradaki elemanın
ne olacağını bulmak! 🧩

🎯 Bu oyunda:
- Renk örüntülerini keşfedeceksin
- Şekil dizilerini çözeceksin
- Boyut sıralamasını anlayacaksın

Her doğru cevap seni bir sonraki seviyeye götürür!
            '''.strip(),
            'experiment_type': 'simulation',
            'difficulty': 'easy',
            'pixi_script': 'pattern_puzzle.js',
            'points': 20,
            'estimated_time': 7,
            'learning_objectives': '''Örüntüleri tanıma ve tamamlama
Mantıksal düşünme becerileri
Dikkat ve gözlem gücü
Problem çözme stratejileri''',
            'parent_info': '''
Bu aktivite, çocuğunuzun matematiksel düşünme ve mantık becerilerini
geliştirir. Örüntü tanıma, matematik ve bilgisayar biliminin temelini
oluşturur. Günlük hayatta da örüntüleri fark etmesine yardımcı olabilirsiniz
(örn. takvim, mevsimler, müzik ritmleri).
            '''.strip(),
            'order': 1,
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
    print("🧩 Örüntü Bulmacası deneyi ekleniyor...\n")
    add_pattern_puzzle()
    print("\n✨ İşlem tamamlandı!")
