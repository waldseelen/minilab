"""
MiniLab - Experiments Models
Deneyler, Kategoriler ve Öğrenme Kartları
"""
from django.db import models
from django.conf import settings


class Category(models.Model):
    """
    Deney kategorileri: Fizik, Kimya, Biyoloji, Astronomi, Teknoloji, Yapay Zeka
    """
    name = models.CharField(
        max_length=50,
        verbose_name='Kategori Adı'
    )

    slug = models.SlugField(
        unique=True,
        verbose_name='URL Kodu'
    )

    description = models.TextField(
        blank=True,
        verbose_name='Açıklama'
    )

    icon = models.CharField(
        max_length=50,
        default='🔬',
        verbose_name='İkon (Emoji)'
    )

    color = models.CharField(
        max_length=20,
        default='blue',
        verbose_name='Renk'
    )

    image = models.ImageField(
        upload_to='categories/',
        blank=True,
        null=True,
        verbose_name='Görsel'
    )

    order = models.PositiveIntegerField(
        default=0,
        verbose_name='Sıralama'
    )

    is_active = models.BooleanField(
        default=True,
        verbose_name='Aktif'
    )

    # Sesli okuma için
    audio_name = models.FileField(
        upload_to='audio/categories/',
        blank=True,
        null=True,
        verbose_name='Sesli İsim'
    )

    class Meta:
        verbose_name = 'Kategori'
        verbose_name_plural = 'Kategoriler'
        ordering = ['order', 'name']

    def __str__(self):
        return f"{self.icon} {self.name}"


class Experiment(models.Model):
    """
    Interaktif bilim deneyleri.
    """
    DIFFICULTY_CHOICES = [
        ('easy', 'Kolay ⭐'),
        ('medium', 'Orta ⭐⭐'),
        ('hard', 'Zor ⭐⭐⭐'),
    ]

    TYPE_CHOICES = [
        ('simulation', 'Simülasyon (Pixi.js)'),
        ('video', 'Video'),
        ('interactive', 'İnteraktif Kart'),
        ('quiz', 'Quiz'),
    ]

    category = models.ForeignKey(
        Category,
        on_delete=models.CASCADE,
        related_name='experiments',
        verbose_name='Kategori'
    )

    title = models.CharField(
        max_length=100,
        verbose_name='Başlık'
    )

    slug = models.SlugField(
        unique=True,
        verbose_name='URL Kodu'
    )

    short_description = models.CharField(
        max_length=200,
        verbose_name='Kısa Açıklama'
    )

    description = models.TextField(
        verbose_name='Detaylı Açıklama'
    )

    experiment_type = models.CharField(
        max_length=20,
        choices=TYPE_CHOICES,
        default='simulation',
        verbose_name='Deney Tipi'
    )

    difficulty = models.CharField(
        max_length=10,
        choices=DIFFICULTY_CHOICES,
        default='easy',
        verbose_name='Zorluk'
    )

    # Görseller
    thumbnail = models.ImageField(
        upload_to='experiments/thumbnails/',
        verbose_name='Küçük Görsel'
    )

    cover_image = models.ImageField(
        upload_to='experiments/covers/',
        blank=True,
        null=True,
        verbose_name='Kapak Görseli'
    )

    # Simülasyon için
    pixi_script = models.CharField(
        max_length=100,
        blank=True,
        verbose_name='Pixi.js Script Dosyası',
        help_text='Örn: chemistry_mix.js'
    )

    # Video için
    video_url = models.URLField(
        blank=True,
        verbose_name='Video URL'
    )

    # Sesli anlatım
    audio_description = models.FileField(
        upload_to='audio/experiments/',
        blank=True,
        null=True,
        verbose_name='Sesli Açıklama'
    )

    # Puan ve süre
    points = models.PositiveIntegerField(
        default=10,
        verbose_name='Kazanılacak Puan'
    )

    estimated_time = models.PositiveIntegerField(
        default=5,
        verbose_name='Tahmini Süre (dk)'
    )

    # Öğrenme hedefleri
    learning_objectives = models.TextField(
        blank=True,
        verbose_name='Öğrenme Hedefleri',
        help_text='Her satıra bir hedef yazın'
    )

    # Ebeveyn için bilgi
    parent_info = models.TextField(
        blank=True,
        verbose_name='Ebeveyn Notu',
        help_text='Bu deneyle ilgili ebeveynlere not'
    )

    order = models.PositiveIntegerField(
        default=0,
        verbose_name='Sıralama'
    )

    is_active = models.BooleanField(
        default=True,
        verbose_name='Aktif'
    )

    is_featured = models.BooleanField(
        default=False,
        verbose_name='Öne Çıkan'
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = 'Deney'
        verbose_name_plural = 'Deneyler'
        ordering = ['category', 'order', 'title']

    def __str__(self):
        return f"{self.title} ({self.category.name})"

    @property
    def learning_objectives_list(self):
        """Öğrenme hedeflerini liste olarak döndür."""
        if self.learning_objectives:
            return [obj.strip() for obj in self.learning_objectives.split('\n') if obj.strip()]
        return []


class LearningCard(models.Model):
    """
    Öğrenme kartları - Tıklandığında dönen, sesli bilgi veren kartlar.
    """
    experiment = models.ForeignKey(
        Experiment,
        on_delete=models.CASCADE,
        related_name='learning_cards',
        verbose_name='Deney'
    )

    title = models.CharField(
        max_length=100,
        verbose_name='Kart Başlığı'
    )

    front_content = models.TextField(
        verbose_name='Ön Yüz İçerik'
    )

    back_content = models.TextField(
        verbose_name='Arka Yüz İçerik'
    )

    front_image = models.ImageField(
        upload_to='cards/front/',
        blank=True,
        null=True,
        verbose_name='Ön Yüz Görsel'
    )

    back_image = models.ImageField(
        upload_to='cards/back/',
        blank=True,
        null=True,
        verbose_name='Arka Yüz Görsel'
    )

    audio = models.FileField(
        upload_to='audio/cards/',
        blank=True,
        null=True,
        verbose_name='Sesli Okuma'
    )

    order = models.PositiveIntegerField(
        default=0,
        verbose_name='Sıralama'
    )

    class Meta:
        verbose_name = 'Öğrenme Kartı'
        verbose_name_plural = 'Öğrenme Kartları'
        ordering = ['experiment', 'order']

    def __str__(self):
        return f"{self.title} - {self.experiment.title}"


class ExperimentProgress(models.Model):
    """
    Çocuğun deney ilerleme durumu.
    """
    STATUS_CHOICES = [
        ('not_started', 'Başlanmadı'),
        ('in_progress', 'Devam Ediyor'),
        ('completed', 'Tamamlandı'),
    ]

    child = models.ForeignKey(
        'accounts.ChildProfile',
        on_delete=models.CASCADE,
        related_name='experiment_progress',
        verbose_name='Çocuk'
    )

    experiment = models.ForeignKey(
        Experiment,
        on_delete=models.CASCADE,
        related_name='progress',
        verbose_name='Deney'
    )

    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='not_started',
        verbose_name='Durum'
    )

    score = models.PositiveIntegerField(
        default=0,
        verbose_name='Puan'
    )

    attempts = models.PositiveIntegerField(
        default=0,
        verbose_name='Deneme Sayısı'
    )

    time_spent = models.PositiveIntegerField(
        default=0,
        verbose_name='Harcanan Süre (sn)'
    )

    started_at = models.DateTimeField(
        blank=True,
        null=True,
        verbose_name='Başlangıç'
    )

    completed_at = models.DateTimeField(
        blank=True,
        null=True,
        verbose_name='Tamamlanma'
    )

    class Meta:
        verbose_name = 'Deney İlerlemesi'
        verbose_name_plural = 'Deney İlerlemeleri'
        unique_together = ['child', 'experiment']

    def __str__(self):
        return f"{self.child.nickname} - {self.experiment.title}"
