"""
MiniLab - Story Mode Models
İnteraktif bilim hikayeleri ve seçimli maceralar.
"""
from django.db import models


class Story(models.Model):
    """
    Ana hikaye modeli.
    """
    title = models.CharField(
        max_length=200,
        verbose_name='Hikaye Başlığı'
    )

    slug = models.SlugField(
        unique=True,
        verbose_name='URL Kodu'
    )

    description = models.TextField(
        verbose_name='Kısa Açıklama'
    )

    category = models.ForeignKey(
        'experiments.Category',
        on_delete=models.SET_NULL,
        blank=True,
        null=True,
        verbose_name='İlgili Kategori'
    )

    cover_image = models.ImageField(
        upload_to='stories/covers/',
        verbose_name='Kapak Görseli'
    )

    # Sesli anlatım
    audio_intro = models.FileField(
        upload_to='audio/stories/',
        blank=True,
        null=True,
        verbose_name='Sesli Giriş'
    )

    estimated_time = models.PositiveIntegerField(
        default=10,
        verbose_name='Tahmini Süre (dk)'
    )

    points = models.PositiveIntegerField(
        default=20,
        verbose_name='Kazanılacak Puan'
    )

    order = models.PositiveIntegerField(
        default=0,
        verbose_name='Sıralama'
    )

    is_active = models.BooleanField(
        default=True,
        verbose_name='Aktif'
    )

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = 'Hikaye'
        verbose_name_plural = 'Hikayeler'
        ordering = ['order', 'title']

    def __str__(self):
        return self.title

    @property
    def first_page(self):
        """İlk sayfayı döndür."""
        return self.pages.filter(is_start=True).first()


class StoryPage(models.Model):
    """
    Hikaye sayfaları - Her sayfa bir sahne.
    """
    story = models.ForeignKey(
        Story,
        on_delete=models.CASCADE,
        related_name='pages',
        verbose_name='Hikaye'
    )

    title = models.CharField(
        max_length=200,
        blank=True,
        verbose_name='Sayfa Başlığı'
    )

    content = models.TextField(
        verbose_name='İçerik',
        help_text='Çocuğa gösterilecek metin'
    )

    image = models.ImageField(
        upload_to='stories/pages/',
        blank=True,
        null=True,
        verbose_name='Sayfa Görseli'
    )

    # Sesli okuma
    audio = models.FileField(
        upload_to='audio/stories/pages/',
        blank=True,
        null=True,
        verbose_name='Sesli Okuma'
    )

    # Animasyon/efekt
    animation = models.CharField(
        max_length=50,
        blank=True,
        choices=[
            ('fade', 'Belirme'),
            ('slide', 'Kayma'),
            ('bounce', 'Zıplama'),
            ('sparkle', 'Parıltı'),
        ],
        verbose_name='Animasyon'
    )

    # Bilim bilgisi (bu sayfada öğretilen kavram)
    science_fact = models.TextField(
        blank=True,
        verbose_name='Bilim Bilgisi',
        help_text='Bu sayfada öğretilen bilimsel kavram'
    )

    is_start = models.BooleanField(
        default=False,
        verbose_name='Başlangıç Sayfası'
    )

    is_ending = models.BooleanField(
        default=False,
        verbose_name='Bitiş Sayfası'
    )

    # Bitiş türü
    ending_type = models.CharField(
        max_length=20,
        blank=True,
        choices=[
            ('good', 'İyi Son'),
            ('neutral', 'Nötr Son'),
            ('learning', 'Öğrenme Sonu'),
        ],
        verbose_name='Bitiş Türü'
    )

    order = models.PositiveIntegerField(
        default=0,
        verbose_name='Sıralama'
    )

    class Meta:
        verbose_name = 'Hikaye Sayfası'
        verbose_name_plural = 'Hikaye Sayfaları'
        ordering = ['story', 'order']

    def __str__(self):
        return f"{self.story.title} - Sayfa {self.order}"


class StoryChoice(models.Model):
    """
    Hikaye seçenekleri - Çocuğun yapabileceği tercihler.
    """
    page = models.ForeignKey(
        StoryPage,
        on_delete=models.CASCADE,
        related_name='choices',
        verbose_name='Sayfa'
    )

    text = models.CharField(
        max_length=200,
        verbose_name='Seçenek Metni'
    )

    # Seçenek görseli (opsiyonel)
    icon = models.CharField(
        max_length=50,
        blank=True,
        verbose_name='İkon (Emoji)'
    )

    # Bu seçenek hangi sayfaya götürür
    next_page = models.ForeignKey(
        StoryPage,
        on_delete=models.SET_NULL,
        blank=True,
        null=True,
        related_name='incoming_choices',
        verbose_name='Sonraki Sayfa'
    )

    # Doğru/yanlış seçenek mi (quiz tarzı hikayeler için)
    is_correct = models.BooleanField(
        default=True,
        verbose_name='Doğru Seçenek'
    )

    # Seçildiğinde gösterilecek geri bildirim
    feedback = models.CharField(
        max_length=200,
        blank=True,
        verbose_name='Geri Bildirim'
    )

    order = models.PositiveIntegerField(
        default=0,
        verbose_name='Sıralama'
    )

    class Meta:
        verbose_name = 'Hikaye Seçeneği'
        verbose_name_plural = 'Hikaye Seçenekleri'
        ordering = ['page', 'order']

    def __str__(self):
        return f"{self.page} - {self.text[:30]}"


class StoryProgress(models.Model):
    """
    Çocuğun hikaye ilerlemesi.
    """
    child = models.ForeignKey(
        'accounts.ChildProfile',
        on_delete=models.CASCADE,
        related_name='story_progress',
        verbose_name='Çocuk'
    )

    story = models.ForeignKey(
        Story,
        on_delete=models.CASCADE,
        related_name='progress',
        verbose_name='Hikaye'
    )

    current_page = models.ForeignKey(
        StoryPage,
        on_delete=models.SET_NULL,
        blank=True,
        null=True,
        verbose_name='Mevcut Sayfa'
    )

    is_completed = models.BooleanField(
        default=False,
        verbose_name='Tamamlandı'
    )

    ending_reached = models.CharField(
        max_length=20,
        blank=True,
        verbose_name='Ulaşılan Son'
    )

    started_at = models.DateTimeField(
        auto_now_add=True,
        verbose_name='Başlangıç'
    )

    completed_at = models.DateTimeField(
        blank=True,
        null=True,
        verbose_name='Tamamlanma'
    )

    class Meta:
        verbose_name = 'Hikaye İlerlemesi'
        verbose_name_plural = 'Hikaye İlerlemeleri'
        unique_together = ['child', 'story']

    def __str__(self):
        return f"{self.child.nickname} - {self.story.title}"


# V2 modellerini buradan export et - Django migration sistemi için gerekli
from .models_v2 import (
    LearningCard,
    MemoryMatchGame,
    MatchCard,
    WordPuzzle,
    InteractiveBook,
    BookPage,
    InteractiveHotspot,
    StoryGameProgress,
)
