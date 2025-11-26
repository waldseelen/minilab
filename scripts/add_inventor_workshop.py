"""
Mucit Atölyesi deneyini veritabanına ekle.
"""
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings.dev')
django.setup()

from apps.experiments.models import Category, Experiment

def create_inventor_workshop():
    """Mucit Atölyesi deneyini oluştur."""

    # Kategoriyi al veya oluştur
    category, _ = Category.objects.get_or_create(
        slug='mucitlik-muhendislik',
        defaults={
            'name': 'Mucitlik & Mühendislik',
            'description': 'İcatlar yap, mühendislik projelerine katıl!',
            'icon': '🔧',
            'color': 'amber'
        }
    )

    # Deney oluştur
    experiment, created = Experiment.objects.get_or_create(
        slug='mucit-atolyesi',
        defaults={
            'title': 'Mucit Atölyesi',
            'short_description': 'Araçlar ve malzemeler kullanarak kendi icatlarını yap!',
            'description': """
🔨 **Mucit Atölyesi'ne Hoş Geldin!**

Araçlar ve malzemeler kullanarak kendi icatlarını yap! Tahta, metal, tekerlek ve yayları birleştirerek araba, oyuncak ve daha fazlasını oluşturabilirsin.

📋 **Nasıl Oynanır:**
1. Sol taraftan bir **araç** seç (çekiç, testere, tornavida veya anahtar)
2. Sağ taraftan **malzemeleri** (tahta, metal, tekerlek, yay) tezgaha sürükle
3. Farklı kombinasyonları deneyerek **icat** yap!

🚗 **Yapabileceğin İcatlar:**
- **Araba:** Tahta + Metal + 2 Tekerlek
- **Yaylı Oyuncak:** Tahta + Yay
- **Tekerli Kasa:** Metal + Tekerlek

💡 **İpuçları:**
- Her malzemeden sınırlı sayıda var
- Farklı kombinasyonları denemekten çekinme
- Her icat için ödül kazan!

🎯 **Öğrenme Hedefleri:**
Mühendislik düşüncesi, problem çözme, araç kullanımı, malzeme bilgisi, yaratıcılık
            """,
            'category': category,
            'difficulty': 'medium',
            'experiment_type': 'simulation',
            'pixi_script': 'inventor_workshop.js',
            'thumbnail': 'experiments/thumbnails/default.png'
        }
    )

    if created:
        print(f"✅ '{experiment.title}' deneyi oluşturuldu!")
        print(f"   Kategori: {category.name}")
        print(f"   Zorluk: {experiment.get_difficulty_display()}")
        print(f"   Script: {experiment.pixi_script}")
    else:
        print(f"⚠️  '{experiment.title}' zaten mevcut!")

    print("\n✨ İşlem tamamlandı!")

if __name__ == '__main__':
    create_inventor_workshop()
