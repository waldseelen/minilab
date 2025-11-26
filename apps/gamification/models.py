"""
MiniLab - Gamification Models
Rozetler, Puanlar ve Avatar Öğeleri
"""
from django.db import models


class Badge(models.Model):
    """
    Kazanılabilir rozetler.
    """
    BADGE_TYPE_CHOICES = [
        ('achievement', 'Başarı'),
        ('streak', 'Seri'),
        ('category', 'Kategori Uzmanı'),
        ('special', 'Özel'),
    ]

    RARITY_CHOICES = [
        ('common', 'Yaygın'),
        ('rare', 'Nadir'),
        ('epic', 'Destansı'),
        ('legendary', 'Efsanevi'),
    ]

    name = models.CharField(
        max_length=100,
        verbose_name='Rozet Adı'
    )

    slug = models.SlugField(
        unique=True,
        verbose_name='URL Kodu'
    )

    description = models.TextField(
        verbose_name='Açıklama'
    )

    badge_type = models.CharField(
        max_length=20,
        choices=BADGE_TYPE_CHOICES,
        default='achievement',
        verbose_name='Rozet Tipi'
    )

    # Emoji ikon (template'de {{ badge.icon }} olarak kullanılır)
    icon = models.CharField(
        max_length=10,
        default='🏆',
        verbose_name='Rozet İkonu (Emoji)',
        help_text='Örn: 🔬, 🚀, 🧪, 👑'
    )

    # Opsiyonel görsel ikon
    icon_image = models.ImageField(
        upload_to='badges/',
        blank=True,
        null=True,
        verbose_name='Rozet Görseli (Opsiyonel)'
    )

    icon_locked = models.ImageField(
        upload_to='badges/locked/',
        blank=True,
        null=True,
        verbose_name='Kilitli Görsel'
    )

    rarity = models.CharField(
        max_length=20,
        choices=RARITY_CHOICES,
        default='common',
        verbose_name='Nadirlik'
    )

    # Kazanma koşulu
    requirement_type = models.CharField(
        max_length=50,
        verbose_name='Koşul Tipi',
        help_text='Örn: experiments_completed, streak_days, category_master'
    )

    requirement_value = models.PositiveIntegerField(
        default=1,
        verbose_name='Koşul Değeri',
        help_text='Örn: 5 deney, 7 gün seri'
    )

    requirement_category = models.ForeignKey(
        'experiments.Category',
        on_delete=models.SET_NULL,
        blank=True,
        null=True,
        verbose_name='İlgili Kategori'
    )

    points_reward = models.PositiveIntegerField(
        default=50,
        verbose_name='Puan Ödülü'
    )

    is_secret = models.BooleanField(
        default=False,
        verbose_name='Gizli Rozet'
    )

    order = models.PositiveIntegerField(
        default=0,
        verbose_name='Sıralama'
    )

    class Meta:
        verbose_name = 'Rozet'
        verbose_name_plural = 'Rozetler'
        ordering = ['order', 'name']

    def __str__(self):
        return self.name


class EarnedBadge(models.Model):
    """
    Çocukların kazandığı rozetler.
    """
    child = models.ForeignKey(
        'accounts.ChildProfile',
        on_delete=models.CASCADE,
        related_name='earned_badges',
        verbose_name='Çocuk'
    )

    badge = models.ForeignKey(
        Badge,
        on_delete=models.CASCADE,
        related_name='earners',
        verbose_name='Rozet'
    )

    earned_at = models.DateTimeField(
        auto_now_add=True,
        verbose_name='Kazanıldı'
    )

    is_new = models.BooleanField(
        default=True,
        verbose_name='Yeni (Görülmedi)'
    )

    class Meta:
        verbose_name = 'Kazanılan Rozet'
        verbose_name_plural = 'Kazanılan Rozetler'
        unique_together = ['child', 'badge']
        ordering = ['-earned_at']

    def __str__(self):
        return f"{self.child.nickname} - {self.badge.name}"


class AvatarItem(models.Model):
    """
    Avatar özelleştirme öğeleri.
    """
    ITEM_TYPE_CHOICES = [
        ('body', 'Kıyafet'),
        ('accessory', 'Aksesuar'),
        ('background', 'Arka Plan'),
        ('pet', 'Evcil Hayvan'),
    ]

    name = models.CharField(
        max_length=100,
        verbose_name='Öğe Adı'
    )

    item_type = models.CharField(
        max_length=20,
        choices=ITEM_TYPE_CHOICES,
        verbose_name='Öğe Tipi'
    )

    image = models.ImageField(
        upload_to='avatar_items/',
        verbose_name='Görsel'
    )

    preview_image = models.ImageField(
        upload_to='avatar_items/previews/',
        blank=True,
        null=True,
        verbose_name='Önizleme Görseli'
    )

    # Satın alma
    price = models.PositiveIntegerField(
        default=0,
        verbose_name='Fiyat (Yıldız Tozu)'
    )

    is_free = models.BooleanField(
        default=False,
        verbose_name='Ücretsiz'
    )

    is_default = models.BooleanField(
        default=False,
        verbose_name='Varsayılan'
    )

    # Kilit açma koşulu (rozet gerekebilir)
    required_badge = models.ForeignKey(
        Badge,
        on_delete=models.SET_NULL,
        blank=True,
        null=True,
        verbose_name='Gerekli Rozet'
    )

    order = models.PositiveIntegerField(
        default=0,
        verbose_name='Sıralama'
    )

    class Meta:
        verbose_name = 'Avatar Öğesi'
        verbose_name_plural = 'Avatar Öğeleri'
        ordering = ['item_type', 'order', 'name']

    def __str__(self):
        return f"{self.name} ({self.get_item_type_display()})"


class OwnedAvatarItem(models.Model):
    """
    Çocukların sahip olduğu avatar öğeleri.
    """
    child = models.ForeignKey(
        'accounts.ChildProfile',
        on_delete=models.CASCADE,
        related_name='owned_items',
        verbose_name='Çocuk'
    )

    item = models.ForeignKey(
        AvatarItem,
        on_delete=models.CASCADE,
        related_name='owners',
        verbose_name='Öğe'
    )

    purchased_at = models.DateTimeField(
        auto_now_add=True,
        verbose_name='Satın Alındı'
    )

    is_equipped = models.BooleanField(
        default=False,
        verbose_name='Kullanımda'
    )

    class Meta:
        verbose_name = 'Sahip Olunan Öğe'
        verbose_name_plural = 'Sahip Olunan Öğeler'
        unique_together = ['child', 'item']

    def __str__(self):
        return f"{self.child.nickname} - {self.item.name}"


class SurpriseEgg(models.Model):
    """
    Sürpriz Yumurta ödül havuzu.
    """
    REWARD_TYPE_CHOICES = [
        ('star_dust', 'Yıldız Tozu'),
        ('avatar_item', 'Avatar Öğesi'),
        ('badge', 'Rozet'),
    ]

    name = models.CharField(
        max_length=100,
        verbose_name='Ödül Adı'
    )

    reward_type = models.CharField(
        max_length=20,
        choices=REWARD_TYPE_CHOICES,
        verbose_name='Ödül Tipi'
    )

    # Yıldız tozu için
    star_dust_amount = models.PositiveIntegerField(
        default=0,
        verbose_name='Yıldız Tozu Miktarı'
    )

    # Avatar öğesi için
    avatar_item = models.ForeignKey(
        AvatarItem,
        on_delete=models.SET_NULL,
        blank=True,
        null=True,
        verbose_name='Avatar Öğesi'
    )

    # Rozet için
    badge = models.ForeignKey(
        Badge,
        on_delete=models.SET_NULL,
        blank=True,
        null=True,
        verbose_name='Rozet'
    )

    # Olasılık (ağırlık)
    weight = models.PositiveIntegerField(
        default=100,
        verbose_name='Olasılık Ağırlığı',
        help_text='Yüksek değer = daha sık çıkar'
    )

    rarity = models.CharField(
        max_length=20,
        default='common',
        choices=[
            ('common', 'Yaygın'),
            ('rare', 'Nadir'),
            ('epic', 'Epik'),
            ('legendary', 'Efsanevi'),
        ],
        verbose_name='Nadirlik'
    )

    class Meta:
        verbose_name = 'Sürpriz Yumurta Ödülü'
        verbose_name_plural = 'Sürpriz Yumurta Ödülleri'

    def __str__(self):
        return f"{self.name} ({self.get_rarity_display()})"
