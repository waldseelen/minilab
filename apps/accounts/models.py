"""
MiniLab - Accounts Models
Kullanıcı yönetimi: Parent ve Child modelleri
"""
from django.contrib.auth.models import AbstractUser
from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator


class User(AbstractUser):
    """
    Temel kullanıcı modeli (Ebeveyn için).
    Django'nun AbstractUser'ından türetilmiş.
    """
    USER_TYPE_CHOICES = [
        ('parent', 'Ebeveyn'),
        ('child', 'Çocuk'),
    ]

    user_type = models.CharField(
        max_length=10,
        choices=USER_TYPE_CHOICES,
        default='parent',
        verbose_name='Kullanıcı Tipi'
    )

    phone = models.CharField(
        max_length=20,
        blank=True,
        null=True,
        verbose_name='Telefon'
    )

    avatar = models.ImageField(
        upload_to='avatars/',
        blank=True,
        null=True,
        verbose_name='Profil Fotoğrafı'
    )

    # Ebeveyn kontrol ayarları
    screen_time_limit = models.PositiveIntegerField(
        default=30,  # dakika
        verbose_name='Ekran Süresi Limiti (dk)',
        help_text='Günlük maksimum kullanım süresi (dakika)'
    )

    bedtime_mode_enabled = models.BooleanField(
        default=False,
        verbose_name='Yatma Zamanı Modu'
    )

    bedtime_hour = models.PositiveIntegerField(
        default=20,  # 20:00
        validators=[MinValueValidator(0), MaxValueValidator(23)],
        verbose_name='Yatma Saati'
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = 'Kullanıcı'
        verbose_name_plural = 'Kullanıcılar'

    def __str__(self):
        return f"{self.get_full_name() or self.username}"

    @property
    def is_parent(self):
        return self.user_type == 'parent'

    @property
    def is_child(self):
        return self.user_type == 'child'


class ChildProfile(models.Model):
    """
    Çocuk profili - Her ebeveynin birden fazla çocuğu olabilir.
    """
    GENDER_CHOICES = [
        ('erkek', 'Erkek'),
        ('kiz', 'Kız'),
        ('diger', 'Belirtmek İstemiyorum'),
    ]

    parent = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='children',
        verbose_name='Ebeveyn'
    )

    nickname = models.CharField(
        max_length=50,
        verbose_name='Takma Ad'
    )

    birth_date = models.DateField(
        blank=True,
        null=True,
        verbose_name='Doğum Tarihi'
    )

    age = models.PositiveIntegerField(
        default=5,
        validators=[MinValueValidator(3), MaxValueValidator(10)],
        verbose_name='Yaş'
    )

    gender = models.CharField(
        max_length=10,
        choices=GENDER_CHOICES,
        blank=True,
        verbose_name='Cinsiyet'
    )

    # Avatar özelleştirme
    avatar_body = models.CharField(
        max_length=50,
        default='scientist',
        verbose_name='Avatar Kıyafet'
    )

    avatar_color = models.CharField(
        max_length=20,
        default='blue',
        verbose_name='Avatar Renk'
    )

    avatar_accessory = models.CharField(
        max_length=50,
        blank=True,
        verbose_name='Avatar Aksesuar'
    )

    # Oyunlaştırma metrikleri
    star_dust = models.PositiveIntegerField(
        default=0,
        verbose_name='Yıldız Tozu (Puan)'
    )

    total_experiments = models.PositiveIntegerField(
        default=0,
        verbose_name='Toplam Deney'
    )

    current_streak = models.PositiveIntegerField(
        default=0,
        verbose_name='Günlük Seri'
    )

    longest_streak = models.PositiveIntegerField(
        default=0,
        verbose_name='En Uzun Seri'
    )

    last_activity = models.DateTimeField(
        blank=True,
        null=True,
        verbose_name='Son Aktivite'
    )

    # Tercihler
    favorite_category = models.CharField(
        max_length=50,
        blank=True,
        verbose_name='Favori Kategori'
    )

    sound_enabled = models.BooleanField(
        default=True,
        verbose_name='Ses Açık'
    )

    dark_mode = models.BooleanField(
        default=False,
        verbose_name='Gece Modu'
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = 'Çocuk Profili'
        verbose_name_plural = 'Çocuk Profilleri'
        ordering = ['nickname']

    def __str__(self):
        return f"{self.nickname} ({self.age} yaş)"

    def add_star_dust(self, amount):
        """Yıldız tozu ekle."""
        self.star_dust += amount
        self.save(update_fields=['star_dust'])

    def complete_experiment(self, points=10):
        """Deney tamamlandığında çağrılır."""
        self.total_experiments += 1
        self.add_star_dust(points)


class DailyLogin(models.Model):
    """
    Günlük giriş takibi - Sürpriz Yumurta ödülü için.
    """
    child = models.ForeignKey(
        ChildProfile,
        on_delete=models.CASCADE,
        related_name='daily_logins',
        verbose_name='Çocuk'
    )

    login_date = models.DateField(
        auto_now_add=True,
        verbose_name='Giriş Tarihi'
    )

    reward_claimed = models.BooleanField(
        default=False,
        verbose_name='Ödül Alındı'
    )

    reward_type = models.CharField(
        max_length=50,
        blank=True,
        verbose_name='Ödül Tipi'
    )

    reward_amount = models.PositiveIntegerField(
        default=0,
        verbose_name='Ödül Miktarı'
    )

    class Meta:
        verbose_name = 'Günlük Giriş'
        verbose_name_plural = 'Günlük Girişler'
        unique_together = ['child', 'login_date']
        ordering = ['-login_date']

    def __str__(self):
        return f"{self.child.nickname} - {self.login_date}"
