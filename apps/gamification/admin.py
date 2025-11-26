from django.contrib import admin
from .models import Badge, EarnedBadge, AvatarItem, OwnedAvatarItem, SurpriseEgg


@admin.register(Badge)
class BadgeAdmin(admin.ModelAdmin):
    list_display = ['icon', 'name', 'badge_type', 'rarity', 'requirement_type', 'points_reward', 'order', 'is_secret']
    list_filter = ['badge_type', 'rarity', 'is_secret']
    search_fields = ['name', 'description']
    prepopulated_fields = {'slug': ('name',)}
    ordering = ['order', 'name']


@admin.register(EarnedBadge)
class EarnedBadgeAdmin(admin.ModelAdmin):
    list_display = ['child', 'badge', 'earned_at', 'is_new']
    list_filter = ['badge', 'is_new', 'earned_at']
    search_fields = ['child__nickname', 'badge__name']


@admin.register(AvatarItem)
class AvatarItemAdmin(admin.ModelAdmin):
    list_display = ['name', 'item_type', 'price', 'is_free', 'is_default', 'order']
    list_filter = ['item_type', 'is_free', 'is_default']
    search_fields = ['name']
    ordering = ['item_type', 'order']


@admin.register(OwnedAvatarItem)
class OwnedAvatarItemAdmin(admin.ModelAdmin):
    list_display = ['child', 'item', 'purchased_at', 'is_equipped']
    list_filter = ['is_equipped', 'item__item_type']
    search_fields = ['child__nickname', 'item__name']


@admin.register(SurpriseEgg)
class SurpriseEggAdmin(admin.ModelAdmin):
    list_display = ['name', 'reward_type', 'star_dust_amount', 'rarity', 'weight']
    list_filter = ['reward_type', 'rarity']
    search_fields = ['name']
