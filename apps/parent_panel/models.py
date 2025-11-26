"""
MiniLab - Parent Panel Models
Ebeveyn paneli modelleri - Çocuk izleme, aktivite raporları, ebeveyn kontrolleri.
"""
from django.db import models
from django.conf import settings


class ParentChildLink(models.Model):
    """
    Ebeveyn-Çocuk bağlantısı.
    Bir ebeveyn birden fazla çocuğu takip edebilir.
    """
    parent = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='children_links',
        verbose_name='Ebeveyn'
    )

    child = models.ForeignKey(
        'accounts.ChildProfile',
        on_delete=models.CASCADE,
        related_name='parent_links',
        verbose_name='Çocuk'
    )

    # Bağlantı durumu
    is_verified = models.BooleanField(
        default=False,
        verbose_name='Doğrulanmış'
    )

    # Ebeveyn kontrolleri
    can_view_chat_history = models.BooleanField(
        default=True,
        verbose_name='Sohbet Geçmişini Görebilir'
    )

    can_view_activity = models.BooleanField(
        default=True,
        verbose_name='Aktiviteleri Görebilir'
    )

    # Bildirim tercihleri
    notify_on_badge = models.BooleanField(
        default=True,
        verbose_name='Rozet Kazanınca Bildir'
    )

    notify_on_experiment = models.BooleanField(
        default=True,
        verbose_name='Deney Tamamlayınca Bildir'
    )

    daily_report_email = models.BooleanField(
        default=False,
        verbose_name='Günlük Rapor E-postası'
    )

    created_at = models.DateTimeField(
        auto_now_add=True,
        verbose_name='Bağlantı Tarihi'
    )

    class Meta:
        verbose_name = 'Ebeveyn-Çocuk Bağlantısı'
        verbose_name_plural = 'Ebeveyn-Çocuk Bağlantıları'
        unique_together = ('parent', 'child')

    def __str__(self):
        return f"{self.parent.username} → {self.child.nickname}"


class ParentSettings(models.Model):
    """
    Ebeveyn ayarları - Her ebeveyn için genel tercihler.
    """
    parent = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='parent_settings',
        verbose_name='Ebeveyn'
    )

    # Zaman kısıtlamaları
    daily_time_limit = models.PositiveIntegerField(
        default=60,  # dakika
        verbose_name='Günlük Süre Limiti (dk)'
    )

    allowed_start_time = models.TimeField(
        default='08:00',
        verbose_name='İzin Verilen Başlangıç Saati'
    )

    allowed_end_time = models.TimeField(
        default='20:00',
        verbose_name='İzin Verilen Bitiş Saati'
    )

    # İçerik kısıtlamaları
    allow_chatbot = models.BooleanField(
        default=True,
        verbose_name='MiniBot Sohbete İzin Ver'
    )

    allow_voice_messages = models.BooleanField(
        default=True,
        verbose_name='Sesli Mesajlara İzin Ver'
    )

    # Bildirim tercihleri
    email_notifications = models.BooleanField(
        default=True,
        verbose_name='E-posta Bildirimleri'
    )

    push_notifications = models.BooleanField(
        default=True,
        verbose_name='Push Bildirimleri'
    )

    updated_at = models.DateTimeField(
        auto_now=True,
        verbose_name='Güncellenme'
    )

    class Meta:
        verbose_name = 'Ebeveyn Ayarları'
        verbose_name_plural = 'Ebeveyn Ayarları'

    def __str__(self):
        return f"{self.parent.username} Ayarları"


class ActivityLog(models.Model):
    """
    Çocuk aktivite günlüğü - Detaylı izleme için.
    """
    ACTIVITY_TYPES = [
        ('login', 'Giriş'),
        ('logout', 'Çıkış'),
        ('experiment_start', 'Deney Başlattı'),
        ('experiment_complete', 'Deney Tamamladı'),
        ('card_view', 'Kart Görüntüledi'),
        ('story_read', 'Hikaye Okudu'),
        ('chat_message', 'Sohbet Mesajı'),
        ('badge_earned', 'Rozet Kazandı'),
        ('avatar_purchase', 'Avatar Satın Aldı'),
        ('level_up', 'Seviye Atladı'),
    ]

    child = models.ForeignKey(
        'accounts.ChildProfile',
        on_delete=models.CASCADE,
        related_name='activity_logs',
        verbose_name='Çocuk'
    )

    activity_type = models.CharField(
        max_length=30,
        choices=ACTIVITY_TYPES,
        verbose_name='Aktivite Türü'
    )

    description = models.CharField(
        max_length=255,
        blank=True,
        verbose_name='Açıklama'
    )

    # İlgili içerik (opsiyonel)
    related_experiment = models.ForeignKey(
        'experiments.Experiment',
        on_delete=models.SET_NULL,
        blank=True,
        null=True,
        verbose_name='İlgili Deney'
    )

    related_story = models.ForeignKey(
        'storymode.Story',
        on_delete=models.SET_NULL,
        blank=True,
        null=True,
        verbose_name='İlgili Hikaye'
    )

    # Ekstra veri (JSON)
    extra_data = models.JSONField(
        default=dict,
        blank=True,
        verbose_name='Ekstra Veri'
    )

    # Zaman ve süre
    created_at = models.DateTimeField(
        auto_now_add=True,
        verbose_name='Tarih/Saat'
    )

    duration_seconds = models.PositiveIntegerField(
        default=0,
        verbose_name='Süre (saniye)'
    )

    class Meta:
        verbose_name = 'Aktivite Günlüğü'
        verbose_name_plural = 'Aktivite Günlükleri'
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.child.nickname} - {self.get_activity_type_display()} - {self.created_at.strftime('%d.%m.%Y %H:%M')}"


class DailyReport(models.Model):
    """
    Günlük aktivite özeti - Ebeveynler için otomatik rapor.
    """
    child = models.ForeignKey(
        'accounts.ChildProfile',
        on_delete=models.CASCADE,
        related_name='daily_reports',
        verbose_name='Çocuk'
    )

    date = models.DateField(
        verbose_name='Tarih'
    )

    # Aktivite istatistikleri
    total_time_minutes = models.PositiveIntegerField(
        default=0,
        verbose_name='Toplam Süre (dk)'
    )

    experiments_completed = models.PositiveIntegerField(
        default=0,
        verbose_name='Tamamlanan Deneyler'
    )

    cards_viewed = models.PositiveIntegerField(
        default=0,
        verbose_name='Görüntülenen Kartlar'
    )

    stories_read = models.PositiveIntegerField(
        default=0,
        verbose_name='Okunan Hikayeler'
    )

    chat_messages = models.PositiveIntegerField(
        default=0,
        verbose_name='Sohbet Mesajları'
    )

    points_earned = models.PositiveIntegerField(
        default=0,
        verbose_name='Kazanılan Puanlar'
    )

    badges_earned = models.PositiveIntegerField(
        default=0,
        verbose_name='Kazanılan Rozetler'
    )

    # En çok ilgilenilen konular
    top_categories = models.JSONField(
        default=list,
        blank=True,
        verbose_name='En Çok İlgilenilen Kategoriler'
    )

    # Notlar
    highlights = models.TextField(
        blank=True,
        verbose_name='Öne Çıkanlar'
    )

    created_at = models.DateTimeField(
        auto_now_add=True,
        verbose_name='Oluşturulma'
    )

    class Meta:
        verbose_name = 'Günlük Rapor'
        verbose_name_plural = 'Günlük Raporlar'
        unique_together = ('child', 'date')
        ordering = ['-date']

    def __str__(self):
        return f"{self.child.nickname} - {self.date.strftime('%d.%m.%Y')}"
