"""
MiniLab - Custom Admin Panel App
İçerik yönetimi için özel admin paneli.
"""
from django.apps import AppConfig


class AdminPanelConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'apps.admin_panel'
    verbose_name = 'Admin Panel'
