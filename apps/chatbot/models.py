"""
MiniLab - Chatbot Models
MiniBot sohbet geçmişi ve ayarları.
"""
from django.db import models
from django.conf import settings


class ChatSession(models.Model):
    """
    Sohbet oturumu.
    """
    child = models.ForeignKey(
        'accounts.ChildProfile',
        on_delete=models.CASCADE,
        related_name='chat_sessions',
        verbose_name='Çocuk',
        blank=True,
        null=True
    )

    # User referansı da ekleyelim (fallback için)
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='chat_sessions',
        verbose_name='Kullanıcı',
        blank=True,
        null=True
    )

    started_at = models.DateTimeField(
        auto_now_add=True,
        verbose_name='Başlangıç'
    )

    ended_at = models.DateTimeField(
        blank=True,
        null=True,
        verbose_name='Bitiş'
    )

    is_active = models.BooleanField(
        default=True,
        verbose_name='Aktif'
    )

    # Bağlam (hangi sayfada/deneyde başladı)
    context_type = models.CharField(
        max_length=50,
        blank=True,
        verbose_name='Bağlam Tipi',
        help_text='experiment, story, general'
    )

    context_id = models.PositiveIntegerField(
        blank=True,
        null=True,
        verbose_name='Bağlam ID'
    )

    class Meta:
        verbose_name = 'Sohbet Oturumu'
        verbose_name_plural = 'Sohbet Oturumları'
        ordering = ['-started_at']

    def __str__(self):
        name = self.child.nickname if self.child else (self.user.username if self.user else 'Anonim')
        return f"{name} - {self.started_at.strftime('%d.%m.%Y %H:%M')}"


class ChatMessage(models.Model):
    """
    Sohbet mesajları.
    """
    ROLE_CHOICES = [
        ('user', 'Çocuk'),
        ('assistant', 'MiniBot'),
        ('system', 'Sistem'),
    ]

    session = models.ForeignKey(
        ChatSession,
        on_delete=models.CASCADE,
        related_name='messages',
        verbose_name='Oturum',
        blank=True,
        null=True
    )

    # Doğrudan user referansı (session olmadan da mesaj kaydedebilmek için)
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='chat_messages',
        verbose_name='Kullanıcı',
        blank=True,
        null=True
    )

    role = models.CharField(
        max_length=20,
        choices=ROLE_CHOICES,
        default='user',
        verbose_name='Rol'
    )

    # Basit is_user alanı (True = kullanıcı mesajı, False = bot mesajı)
    is_user = models.BooleanField(
        default=True,
        verbose_name='Kullanıcı Mesajı'
    )

    # Mesaj içeriği (content yerine message da olabilir)
    message = models.TextField(
        verbose_name='Mesaj',
        blank=True,
        default=''
    )

    content = models.TextField(
        verbose_name='Mesaj İçeriği',
        blank=True,
        default=''
    )

    # Sesli mesaj mı?
    is_voice = models.BooleanField(
        default=False,
        verbose_name='Sesli Mesaj'
    )

    # TTS ile okunsun mu?
    should_speak = models.BooleanField(
        default=True,
        verbose_name='Sesli Okuma'
    )

    # Emoji/görsel içeriyor mu?
    has_emoji = models.BooleanField(
        default=False,
        verbose_name='Emoji İçeriyor'
    )

    created_at = models.DateTimeField(
        auto_now_add=True,
        verbose_name='Gönderildi'
    )

    class Meta:
        verbose_name = 'Sohbet Mesajı'
        verbose_name_plural = 'Sohbet Mesajları'
        ordering = ['created_at']

    def __str__(self):
        msg = self.message or self.content
        sender = "Çocuk" if self.is_user else "MiniBot"
        return f"{sender}: {msg[:50]}"

    def save(self, *args, **kwargs):
        # content ve message senkronizasyonu
        if self.message and not self.content:
            self.content = self.message
        elif self.content and not self.message:
            self.message = self.content

        # is_user ve role senkronizasyonu
        if self.is_user:
            self.role = 'user'
        else:
            self.role = 'assistant'

        super().save(*args, **kwargs)


class MiniBotHint(models.Model):
    """
    MiniBot ipuçları - Belirli sayfalarda/deneylerde gösterilecek hazır ipuçları.
    """
    TRIGGER_CHOICES = [
        ('experiment_start', 'Deney Başlangıcı'),
        ('experiment_stuck', 'Takılma'),
        ('experiment_complete', 'Deney Tamamlama'),
        ('idle', 'Hareketsizlik'),
        ('first_visit', 'İlk Ziyaret'),
    ]

    trigger = models.CharField(
        max_length=30,
        choices=TRIGGER_CHOICES,
        verbose_name='Tetikleyici'
    )

    # Hangi deney/kategori için
    experiment = models.ForeignKey(
        'experiments.Experiment',
        on_delete=models.CASCADE,
        blank=True,
        null=True,
        related_name='hints',
        verbose_name='Deney'
    )

    category = models.ForeignKey(
        'experiments.Category',
        on_delete=models.CASCADE,
        blank=True,
        null=True,
        related_name='hints',
        verbose_name='Kategori'
    )

    message = models.TextField(
        verbose_name='Mesaj'
    )

    # Görsel/animasyon
    animation = models.CharField(
        max_length=50,
        blank=True,
        choices=[
            ('wave', 'El Sallama'),
            ('bounce', 'Zıplama'),
            ('think', 'Düşünme'),
            ('celebrate', 'Kutlama'),
        ],
        verbose_name='Animasyon'
    )

    delay_seconds = models.PositiveIntegerField(
        default=5,
        verbose_name='Gecikme (sn)',
        help_text='Kaç saniye sonra gösterilsin'
    )

    order = models.PositiveIntegerField(
        default=0,
        verbose_name='Öncelik'
    )

    is_active = models.BooleanField(
        default=True,
        verbose_name='Aktif'
    )

    class Meta:
        verbose_name = 'MiniBot İpucu'
        verbose_name_plural = 'MiniBot İpuçları'
        ordering = ['trigger', 'order']

    def __str__(self):
        return f"{self.get_trigger_display()} - {self.message[:30]}"
