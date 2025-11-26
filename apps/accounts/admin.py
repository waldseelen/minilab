"""
MiniLab - Accounts Admin
Kullanıcı yönetimi için admin paneli.
"""
from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User, ChildProfile, DailyLogin


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    list_display = ['username', 'email', 'user_type', 'is_active', 'created_at']
    list_filter = ['user_type', 'is_active', 'is_staff']
    search_fields = ['username', 'email', 'first_name', 'last_name']

    fieldsets = BaseUserAdmin.fieldsets + (
        ('MiniLab Ayarları', {
            'fields': ('user_type', 'phone', 'avatar', 'screen_time_limit',
                      'bedtime_mode_enabled', 'bedtime_hour')
        }),
    )


@admin.register(ChildProfile)
class ChildProfileAdmin(admin.ModelAdmin):
    list_display = ['nickname', 'parent', 'age', 'star_dust', 'total_experiments', 'current_streak']
    list_filter = ['age', 'gender', 'dark_mode', 'sound_enabled']
    search_fields = ['nickname', 'parent__username']

    fieldsets = (
        ('Temel Bilgiler', {
            'fields': ('parent', 'nickname', 'birth_date', 'age', 'gender')
        }),
        ('Avatar', {
            'fields': ('avatar_body', 'avatar_color', 'avatar_accessory')
        }),
        ('İstatistikler', {
            'fields': ('star_dust', 'total_experiments', 'current_streak',
                      'longest_streak', 'last_activity', 'favorite_category')
        }),
        ('Tercihler', {
            'fields': ('sound_enabled', 'dark_mode')
        }),
    )


@admin.register(DailyLogin)
class DailyLoginAdmin(admin.ModelAdmin):
    list_display = ['child', 'login_date', 'reward_claimed', 'reward_type', 'reward_amount']
    list_filter = ['reward_claimed', 'login_date']
    search_fields = ['child__nickname']
