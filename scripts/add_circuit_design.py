"""
Devre Tasarımı deneyini veritabanına ekle.
"""
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings.dev')
django.setup()

from apps.experiments.models import Category, Experiment

def create_circuit_design():
    """Devre Tasarımı deneyini oluştur."""

    # Kategoriyi al veya oluştur
    category, _ = Category.objects.get_or_create(
        slug='fizik-elektronik',
        defaults={
            'name': 'Fizik & Elektronik',
            'description': 'Elektrik, ışık ve enerji konularını keşfet!',
            'icon': '⚡',
            'color': 'indigo'
        }
    )

    # Deney oluştur
    experiment, created = Experiment.objects.get_or_create(
        slug='devre-tasarimi',
        defaults={
            'title': 'Devre Tasarımı',
            'short_description': 'Basit elektrik devresi elemanlarıyla devre oluştur!',
            'description': """
⚡ **Devre Tasarımı Laboratuvarına Hoş Geldin!**

Basit elektrik devre elemanlarını kullanarak kendi elektricitini oluştur! Pil, lamba, anahtar ve telleri birleştirerek lambayı yakmayı öğren.

📋 **Nasıl Oynanır:**
1. Sol panelden **devre elemanlarını** seç
2. Elemanları **devre tahtasına** sürükle ve yerleştir
3. **Pil + Lamba + Anahtar** kombinasyonunu oluştur
4. Lambanın yanmasını izle! 💡

⚡ **Devre Elemanları:**
- **🔋 Pil:** Elektrik enerjisi sağlar
- **💡 Lamba:** Elektrik enerjisini ışığa çevirir
- **⚡ Anahtar:** Devreyi açar/kapatır
- **➖ Tel:** Elektrik akımını iletir

💡 **Eğlenceli Bilgiler:**
- Elektrik akar su gibi akar! 🌊
- Pil elektriğin kaynağıdır 🔋
- Anahtar devreyi kontrol eder ⚡
- Lamba yandığında enerji ışığa dönüşür! ✨

🎯 **Öğrenme Hedefleri:**
Elektrik akımı, devre elemanları, enerji dönüşümü, sebep-sonuç ilişkisi
            """,
            'category': category,
            'difficulty': 'medium',
            'experiment_type': 'simulation',
            'pixi_script': 'circuit_design.js',
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
    create_circuit_design()
