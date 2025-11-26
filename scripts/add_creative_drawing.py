"""
Yaratıcı Çizim aktivitesini veritabanına ekleyen script
"""
import os
import sys
import django

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings.dev')
django.setup()

from apps.experiments.models import Category, Experiment

def add_creative_drawing():
    # Sanat & Müzik kategorisini bul
    try:
        art = Category.objects.get(slug='sanat-muzik')
    except Category.DoesNotExist:
        print("❌ Sanat & Müzik kategorisi bulunamadı!")
        return

    # Deney zaten varsa güncelle, yoksa oluştur
    experiment, created = Experiment.objects.update_or_create(
        slug='yaratici-cizim',
        defaults={
            'category': art,
            'title': 'Yaratıcı Çizim Atölyesi',
            'short_description': 'Renkler ve şekillerle kendi sanat eserini oluştur!',
            'description': '''
Sanatçı ruhunu ortaya çıkar! Bu dijital atölyede renkleri ve
şekilleri kullanarak kendi eserini yaratabilirsin! 🎨

🖌️ Bu atölyede:
- Farklı renkleri keşfedeceksin
- Geometrik şekilleri kullanacaksın
- Yaratıcılığını sergileyeceksin
- Kendi sanat eserini oluşturacaksın

İstediğin gibi çiz, istediğin kadar dene! Sanat özgürlüktür!
            '''.strip(),
            'experiment_type': 'simulation',
            'difficulty': 'easy',
            'pixi_script': 'creative_drawing.js',
            'points': 15,
            'estimated_time': 10,
            'learning_objectives': '''Renk teorisi ve kombinasyonları
Geometrik şekilleri tanıma
Yaratıcılık ve hayal gücü
El-göz koordinasyonu''',
            'parent_info': '''
Bu aktivite, çocuğunuzun yaratıcılığını ve sanatsal ifade becerisini
geliştirir. Renkleri ve şekilleri tanır, düzenli kompozisyonlar oluşturur.
Gerçek boyalar ve kağıtlarla da benzer aktiviteler yapabilirsiniz!
            '''.strip(),
            'order': 1,
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
    print("🎨 Yaratıcı Çizim Atölyesi ekleniyor...\n")
    add_creative_drawing()
    print("\n✨ İşlem tamamlandı!")
