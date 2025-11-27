"""
MiniLab - Story Mode V2 Models
Gelişmiş hikaye modları: Kart eşleştirme, kelime oyunu, bilgi kartları
"""
from django.db import models


class LearningCard(models.Model):
    """
    Öğrenme kartları - Flash card tarzı bilgi kartları.
    """
    CARD_CATEGORIES = [
        ('animals', '🐾 Hayvanlar'),
        ('plants', '🌱 Bitkiler'),
        ('space', '🚀 Uzay'),
        ('body', '🫀 Vücut'),
        ('weather', '🌤️ Hava'),
        ('colors', '🎨 Renkler'),
        ('shapes', '🔷 Şekiller'),
        ('numbers', '🔢 Sayılar'),
        ('science', '🔬 Bilim'),
        ('nature', '🌿 Doğa'),
    ]

    title = models.CharField(
        max_length=100,
        verbose_name='Kart Başlığı'
    )

    category = models.CharField(
        max_length=20,
        choices=CARD_CATEGORIES,
        verbose_name='Kategori'
    )

    front_text = models.CharField(
        max_length=200,
        verbose_name='Ön Yüz Metni',
        help_text='Kartın ön yüzünde gösterilecek soru/kelime'
    )

    back_text = models.TextField(
        verbose_name='Arka Yüz Metni',
        help_text='Kartın arka yüzünde gösterilecek cevap/açıklama'
    )

    image = models.ImageField(
        upload_to='cards/images/',
        blank=True,
        null=True,
        verbose_name='Kart Görseli'
    )

    emoji = models.CharField(
        max_length=10,
        default='📚',
        verbose_name='Emoji İkonu'
    )

    audio_pronunciation = models.FileField(
        upload_to='audio/cards/',
        blank=True,
        null=True,
        verbose_name='Sesli Telaffuz'
    )

    fun_fact = models.TextField(
        blank=True,
        verbose_name='Eğlenceli Bilgi',
        help_text='Karta ait ilginç bir bilgi'
    )

    difficulty = models.PositiveSmallIntegerField(
        default=1,
        choices=[(1, 'Kolay'), (2, 'Orta'), (3, 'Zor')],
        verbose_name='Zorluk'
    )

    is_active = models.BooleanField(default=True)
    order = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = 'Öğrenme Kartı'
        verbose_name_plural = 'Öğrenme Kartları'
        ordering = ['category', 'order', 'title']

    def __str__(self):
        return f"{self.emoji} {self.title}"


class MemoryMatchGame(models.Model):
    """
    Hafıza/Eşleştirme oyunu setleri.
    """
    GAME_TYPES = [
        ('image_match', '🖼️ Görsel Eşleştirme'),
        ('word_image', '📝 Kelime-Görsel'),
        ('emoji_word', '😊 Emoji-Kelime'),
        ('sound_image', '🔊 Ses-Görsel'),
        ('shadow_match', '👤 Gölge Eşleştirme'),
    ]

    title = models.CharField(
        max_length=100,
        verbose_name='Oyun Başlığı'
    )

    game_type = models.CharField(
        max_length=20,
        choices=GAME_TYPES,
        verbose_name='Oyun Türü'
    )

    description = models.TextField(
        blank=True,
        verbose_name='Açıklama'
    )

    grid_size = models.CharField(
        max_length=10,
        default='4x3',
        choices=[
            ('2x2', '2x2 (4 kart)'),
            ('2x3', '2x3 (6 kart)'),
            ('3x4', '3x4 (12 kart)'),
            ('4x4', '4x4 (16 kart)'),
            ('4x5', '4x5 (20 kart)'),
        ],
        verbose_name='Izgara Boyutu'
    )

    time_limit = models.PositiveIntegerField(
        default=120,
        verbose_name='Süre Limiti (saniye)'
    )

    points = models.PositiveIntegerField(
        default=15,
        verbose_name='Kazanılacak Puan'
    )

    difficulty = models.PositiveSmallIntegerField(
        default=1,
        choices=[(1, 'Kolay'), (2, 'Orta'), (3, 'Zor')],
        verbose_name='Zorluk'
    )

    is_active = models.BooleanField(default=True)
    order = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = 'Hafıza Oyunu'
        verbose_name_plural = 'Hafıza Oyunları'
        ordering = ['order', 'title']

    def __str__(self):
        return f"{self.title} ({self.get_game_type_display()})"


class MatchCard(models.Model):
    """
    Eşleştirme oyunu kartları.
    """
    game = models.ForeignKey(
        MemoryMatchGame,
        on_delete=models.CASCADE,
        related_name='cards',
        verbose_name='Oyun'
    )

    # Birinci kart (görsel/emoji/kelime)
    content_a = models.CharField(
        max_length=200,
        verbose_name='İçerik A',
        help_text='Emoji, kelime veya görsel URL'
    )

    content_a_type = models.CharField(
        max_length=20,
        choices=[
            ('emoji', 'Emoji'),
            ('text', 'Metin'),
            ('image', 'Görsel'),
            ('audio', 'Ses'),
        ],
        default='emoji',
        verbose_name='A Tipi'
    )

    # İkinci kart (eşleşen)
    content_b = models.CharField(
        max_length=200,
        verbose_name='İçerik B',
        help_text='Eşleşen içerik'
    )

    content_b_type = models.CharField(
        max_length=20,
        choices=[
            ('emoji', 'Emoji'),
            ('text', 'Metin'),
            ('image', 'Görsel'),
            ('audio', 'Ses'),
        ],
        default='text',
        verbose_name='B Tipi'
    )

    # Görsel dosyası (opsiyonel)
    image_a = models.ImageField(
        upload_to='memory_game/cards/',
        blank=True,
        null=True,
        verbose_name='Görsel A'
    )

    image_b = models.ImageField(
        upload_to='memory_game/cards/',
        blank=True,
        null=True,
        verbose_name='Görsel B'
    )

    order = models.PositiveIntegerField(default=0)

    class Meta:
        verbose_name = 'Eşleştirme Kartı'
        verbose_name_plural = 'Eşleştirme Kartları'
        ordering = ['game', 'order']

    def __str__(self):
        return f"{self.content_a} ↔ {self.content_b}"


class WordPuzzle(models.Model):
    """
    Kelime bulmaca oyunları.
    """
    PUZZLE_TYPES = [
        ('fill_blank', '📝 Boşluk Doldurma'),
        ('word_scramble', '🔀 Harf Karıştırma'),
        ('word_search', '🔍 Kelime Arama'),
        ('rhyme', '🎵 Kafiye Bulma'),
        ('opposite', '↔️ Zıt Anlamlı'),
    ]

    title = models.CharField(
        max_length=100,
        verbose_name='Bulmaca Başlığı'
    )

    puzzle_type = models.CharField(
        max_length=20,
        choices=PUZZLE_TYPES,
        verbose_name='Bulmaca Türü'
    )

    question = models.TextField(
        verbose_name='Soru/İpucu'
    )

    answer = models.CharField(
        max_length=100,
        verbose_name='Doğru Cevap'
    )

    hint = models.CharField(
        max_length=200,
        blank=True,
        verbose_name='İpucu'
    )

    emoji = models.CharField(
        max_length=10,
        default='❓',
        verbose_name='Emoji'
    )

    image = models.ImageField(
        upload_to='puzzles/images/',
        blank=True,
        null=True,
        verbose_name='Görsel İpucu'
    )

    difficulty = models.PositiveSmallIntegerField(
        default=1,
        choices=[(1, 'Kolay'), (2, 'Orta'), (3, 'Zor')],
        verbose_name='Zorluk'
    )

    points = models.PositiveIntegerField(
        default=10,
        verbose_name='Puan'
    )

    is_active = models.BooleanField(default=True)
    order = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = 'Kelime Bulmacası'
        verbose_name_plural = 'Kelime Bulmacaları'
        ordering = ['order', 'title']

    def __str__(self):
        return f"{self.emoji} {self.title}"


class InteractiveBook(models.Model):
    """
    İnteraktif resimli kitaplar - dokunarak keşfetme.
    """
    title = models.CharField(
        max_length=200,
        verbose_name='Kitap Başlığı'
    )

    slug = models.SlugField(unique=True)

    description = models.TextField(
        verbose_name='Açıklama'
    )

    cover_image = models.ImageField(
        upload_to='interactive_books/covers/',
        verbose_name='Kapak Görseli'
    )

    age_range = models.CharField(
        max_length=20,
        default='4-6',
        verbose_name='Yaş Aralığı'
    )

    estimated_time = models.PositiveIntegerField(
        default=10,
        verbose_name='Tahmini Süre (dk)'
    )

    points = models.PositiveIntegerField(
        default=25,
        verbose_name='Kazanılacak Puan'
    )

    is_active = models.BooleanField(default=True)
    order = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = 'İnteraktif Kitap'
        verbose_name_plural = 'İnteraktif Kitaplar'
        ordering = ['order', 'title']

    def __str__(self):
        return self.title


class BookPage(models.Model):
    """
    İnteraktif kitap sayfaları.
    """
    book = models.ForeignKey(
        InteractiveBook,
        on_delete=models.CASCADE,
        related_name='pages',
        verbose_name='Kitap'
    )

    page_number = models.PositiveIntegerField(
        verbose_name='Sayfa Numarası'
    )

    background_image = models.ImageField(
        upload_to='interactive_books/pages/',
        verbose_name='Arka Plan Görseli'
    )

    text_content = models.TextField(
        blank=True,
        verbose_name='Metin İçeriği'
    )

    text_position = models.CharField(
        max_length=20,
        default='bottom',
        choices=[
            ('top', 'Üstte'),
            ('bottom', 'Altta'),
            ('left', 'Solda'),
            ('right', 'Sağda'),
            ('center', 'Ortada'),
        ],
        verbose_name='Metin Pozisyonu'
    )

    audio = models.FileField(
        upload_to='audio/books/',
        blank=True,
        null=True,
        verbose_name='Sesli Okuma'
    )

    class Meta:
        verbose_name = 'Kitap Sayfası'
        verbose_name_plural = 'Kitap Sayfaları'
        ordering = ['book', 'page_number']
        unique_together = ['book', 'page_number']

    def __str__(self):
        return f"{self.book.title} - Sayfa {self.page_number}"


class InteractiveHotspot(models.Model):
    """
    Sayfadaki dokunulabilir alanlar.
    """
    HOTSPOT_TYPES = [
        ('info', '💡 Bilgi'),
        ('animation', '✨ Animasyon'),
        ('sound', '🔊 Ses'),
        ('quiz', '❓ Soru'),
        ('navigate', '➡️ Geçiş'),
    ]

    page = models.ForeignKey(
        BookPage,
        on_delete=models.CASCADE,
        related_name='hotspots',
        verbose_name='Sayfa'
    )

    hotspot_type = models.CharField(
        max_length=20,
        choices=HOTSPOT_TYPES,
        verbose_name='Tip'
    )

    # Pozisyon (yüzde olarak)
    x_position = models.FloatField(
        verbose_name='X Pozisyonu (%)'
    )

    y_position = models.FloatField(
        verbose_name='Y Pozisyonu (%)'
    )

    width = models.FloatField(
        default=10,
        verbose_name='Genişlik (%)'
    )

    height = models.FloatField(
        default=10,
        verbose_name='Yükseklik (%)'
    )

    # İçerik
    title = models.CharField(
        max_length=100,
        blank=True,
        verbose_name='Başlık'
    )

    content = models.TextField(
        blank=True,
        verbose_name='İçerik/Açıklama'
    )

    emoji = models.CharField(
        max_length=10,
        default='👆',
        verbose_name='Emoji'
    )

    # Ses dosyası
    audio = models.FileField(
        upload_to='audio/hotspots/',
        blank=True,
        null=True,
        verbose_name='Ses'
    )

    # Animasyon
    animation_class = models.CharField(
        max_length=50,
        blank=True,
        choices=[
            ('bounce', 'Zıplama'),
            ('shake', 'Sallanma'),
            ('spin', 'Dönme'),
            ('pulse', 'Nabız'),
            ('wiggle', 'Kıpırdama'),
        ],
        verbose_name='Animasyon'
    )

    is_visible = models.BooleanField(
        default=True,
        verbose_name='Görünür'
    )

    order = models.PositiveIntegerField(default=0)

    class Meta:
        verbose_name = 'Etkileşim Noktası'
        verbose_name_plural = 'Etkileşim Noktaları'
        ordering = ['page', 'order']

    def __str__(self):
        return f"{self.page} - {self.title or self.get_hotspot_type_display()}"


class StoryGameProgress(models.Model):
    """
    Hikaye ve oyun ilerlemesi.
    """
    child = models.ForeignKey(
        'accounts.ChildProfile',
        on_delete=models.CASCADE,
        related_name='story_game_progress',
        verbose_name='Çocuk'
    )

    # Genel istatistikler
    cards_learned = models.PositiveIntegerField(
        default=0,
        verbose_name='Öğrenilen Kartlar'
    )

    memory_games_played = models.PositiveIntegerField(
        default=0,
        verbose_name='Oynanan Hafıza Oyunları'
    )

    memory_games_won = models.PositiveIntegerField(
        default=0,
        verbose_name='Kazanılan Hafıza Oyunları'
    )

    puzzles_solved = models.PositiveIntegerField(
        default=0,
        verbose_name='Çözülen Bulmacalar'
    )

    books_completed = models.PositiveIntegerField(
        default=0,
        verbose_name='Tamamlanan Kitaplar'
    )

    # Toplam süreler
    total_reading_time = models.PositiveIntegerField(
        default=0,
        verbose_name='Toplam Okuma Süresi (dk)'
    )

    total_game_time = models.PositiveIntegerField(
        default=0,
        verbose_name='Toplam Oyun Süresi (dk)'
    )

    # Rozetler (JSON)
    earned_badges = models.JSONField(
        default=list,
        verbose_name='Kazanılan Rozetler'
    )

    # Son aktivite
    last_activity = models.DateTimeField(
        auto_now=True,
        verbose_name='Son Aktivite'
    )

    class Meta:
        verbose_name = 'Oyun İlerlemesi'
        verbose_name_plural = 'Oyun İlerlemeleri'

    def __str__(self):
        return f"{self.child.nickname} - Hikaye/Oyun İlerlemesi"
