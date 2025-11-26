"""
Mini Lab Kitaplığı - Örnek Hikaye Ekleme
Bitki Büyütme temalı bir hikaye oluşturur
"""
import os
import sys
import django

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings.dev')
django.setup()

from apps.storymode.models import Story, StoryPage, StoryChoice
from apps.experiments.models import Category

def create_plant_story():
    """Bitki Maceraları hikayesini oluştur."""

    # Biyoloji kategorisi
    try:
        biology = Category.objects.get(slug='biyoloji-saglik')
    except Category.DoesNotExist:
        print("❌ Biyoloji kategorisi bulunamadı!")
        return

    # Hikaye oluştur veya güncelle
    story, created = Story.objects.update_or_create(
        slug='bitki-maceralari',
        defaults={
            'title': 'Bitki Maceraları',
            'description': 'Küçük bir tohumun büyük macerası! Topraktan çıkıp güneşe ulaşmak için yolculuğa çık.',
            'category': biology,
            'estimated_time': 8,
            'points': 25,
            'order': 1,
            'is_active': True,
        }
    )

    if created:
        print(f"✅ '{story.title}' hikayesi oluşturuldu!")
    else:
        print(f"♻️ '{story.title}' hikayesi güncellendi!")
        # Eski sayfaları temizle
        story.pages.all().delete()

    # SAYFA 1 - Başlangıç
    page1 = StoryPage.objects.create(
        story=story,
        title='Tohumun Başlangıcı',
        content='''
Merhaba! Ben küçük bir tohumum 🌰. Toprak anne beni sıcak kucağında tutuyor.
Etrafım karanlık ama korkmuyor değilim! Çünkü büyük bir macera beni bekliyor.

Büyümek için neye ihtiyacım olduğunu biliyor musun?
        ''',
        science_fact='Tohumlar büyümek için su, sıcaklık ve oksijene ihtiyaç duyar.',
        animation='fade',
        is_start=True,
        order=1
    )

    # SAYFA 2A - Su Seçimi
    page2a = StoryPage.objects.create(
        story=story,
        title='İlk Yudumlar',
        content='''
Ah! Serin su damlacıklarını hissediyorum! 💧 Su beni içimden ıslatıyor.
Hücrelerim uyanıyor, canlanıyor! Kabuğum yumuşamaya başladı.

Şimdi ne yapmalıyım?
        ''',
        science_fact='Su, tohumun kabuğunu yumuşatır ve çimlenmeyi başlatır.',
        animation='slide',
        order=2
    )

    # SAYFA 2B - Güneş Seçimi (Erken)
    page2b = StoryPage.objects.create(
        story=story,
        title='Güneşi Bekliyorum',
        content='''
Güneş ışığını seviyorum ama... henüz çok erken! ☀️
Ben hala toprağın içindeyim. Önce su içmeli ve köklerimi salmamız lazım.

Tekrar deneyelim!
        ''',
        science_fact='Tohumlar önce su ile çimlenir, sonra güneş ışığına ihtiyaç duyar.',
        animation='bounce',
        order=3
    )

    # SAYFA 3 - Filiz
    page3 = StoryPage.objects.create(
        story=story,
        title='Filiz Çıkıyor',
        content='''
İşte! Küçük köküm topraktan aşağı iniyor 🌱, yeşil gövdem yukarı doğru uzanıyor.
Artık bir filizim! Toprak anneyi delip güneşe doğru yükseliyorum.

Gün ışığını görebiliyorum! Ne yapmalıyım?
        ''',
        science_fact='Filiz, topraktan çıkarak fotosentez yapmak için güneş ışığını arar.',
        animation='slide',
        order=4
    )

    # SAYFA 4 - Güneş Alımı
    page4 = StoryPage.objects.create(
        story=story,
        title='Güneşle Tanışma',
        content='''
Vay canına! Güneş ışığı ne kadar güzel! ☀️ Yapraklarım açıldı.
Işığı emerek enerji üretiyorum. Buna "fotosentez" diyorlar!

Yeşil yapraklarımla havadan karbon dioksit alıp, size oksijen veriyorum.
Siz nefes alırken bana teşekkür edebilirsiniz! 😊
        ''',
        science_fact='Bitkiler fotosentez yaparak güneş enerjisinden besin üretir ve oksijen salar.',
        animation='sparkle',
        order=5
    )

    # SAYFA 5 - Büyüme
    page5 = StoryPage.objects.create(
        story=story,
        title='Güçleniyorum',
        content='''
Her gün biraz daha büyüyorum! 🌿 Yapraklarım çoğalıyor, gövdem kalınlaşıyor.
Rüzgar geldiğinde esnek şekilde sallanıyorum.

Köklerimle sudan mineraller emiyorum. Güneşle enerji üretiyorum.
Ne kadar akıllı bir sistem değil mi?
        ''',
        science_fact='Bitkiler köklerinden su ve mineralleri emer, yapraklarıyla fotosentez yapar.',
        animation='bounce',
        order=6
    )

    # SAYFA 6 - Çiçek
    page6 = StoryPage.objects.create(
        story=story,
        title='Çiçek Açıyor',
        content='''
Ve işte... büyük an geldi! 🌸 Güzel bir çiçek açtım!
Renkli yapraklarımla arıları ve kelebekleri çağırıyorum.

Onlar beni ziyaret edip tozumu taşırken, ben de yeni tohumlar oluşturuyorum.
Böylece döngü devam ediyor! Hayat ne kadar harika!
        ''',
        science_fact='Çiçekler, böcekleri çekerek tozlaşır ve yeni tohumlar oluşturur.',
        animation='sparkle',
        is_ending=True,
        ending_type='good',
        order=7
    )

    # SEÇENEKLERİ OLUŞTUR

    # Sayfa 1 seçenekleri
    StoryChoice.objects.create(
        page=page1,
        text='💧 Su içmek istiyorum',
        icon='💧',
        next_page=page2a,
        is_correct=True,
        feedback='Doğru seçim! Su, bitkiler için çok önemli!',
        order=1
    )

    StoryChoice.objects.create(
        page=page1,
        text='☀️ Güneşe çıkmak istiyorum',
        icon='☀️',
        next_page=page2b,
        is_correct=False,
        feedback='Henüz erken! Önce su içmelisin.',
        order=2
    )

    # Sayfa 2A seçenekleri
    StoryChoice.objects.create(
        page=page2a,
        text='🌱 Filiz olmaya başla',
        icon='🌱',
        next_page=page3,
        is_correct=True,
        feedback='Evet! Artık büyüme zamanı!',
        order=1
    )

    # Sayfa 2B seçenekleri (Tekrar dene)
    StoryChoice.objects.create(
        page=page2b,
        text='🔄 Tekrar dene',
        icon='🔄',
        next_page=page1,
        is_correct=True,
        feedback='Harika! Baştan başlayalım.',
        order=1
    )

    # Sayfa 3 seçenekleri
    StoryChoice.objects.create(
        page=page3,
        text='☀️ Güneşe doğru uzanmaya devam et',
        icon='☀️',
        next_page=page4,
        is_correct=True,
        feedback='İşte bu! Güneş seni bekliyor!',
        order=1
    )

    # Sayfa 4 seçenekleri
    StoryChoice.objects.create(
        page=page4,
        text='🌿 Büyümeye devam et',
        icon='🌿',
        next_page=page5,
        is_correct=True,
        feedback='Harika! Güçleniyorsun!',
        order=1
    )

    # Sayfa 5 seçenekleri
    StoryChoice.objects.create(
        page=page5,
        text='🌸 Çiçek açmaya hazır ol',
        icon='🌸',
        next_page=page6,
        is_correct=True,
        feedback='Muhteşem! Son adım!',
        order=1
    )

    print(f"\n📖 Hikaye detayları:")
    print(f"   Sayfa sayısı: {story.pages.count()}")
    print(f"   Kategori: {story.category.name}")
    print(f"   Puan: {story.points}")
    print(f"   Süre: {story.estimated_time} dk")

if __name__ == '__main__':
    print("📚 Mini Lab Kitaplığı - Bitki Maceraları oluşturuluyor...\n")
    create_plant_story()
    print("\n✨ Hikaye başarıyla eklendi!")
