"""
MiniLab - Accounts URLs
Kullanıcı işlemleri yönlendirmeleri.
"""
from django.urls import path
from . import views

app_name = 'accounts'

urlpatterns = [
    # Giriş/Çıkış
    path('giris/', views.login_view, name='login'),
    path('cikis/', views.logout_view, name='logout'),

    # Kayıt
    path('kayit/', views.register_view, name='register'),

    # Çocuk profili oluşturma
    path('cocuk-ekle/', views.add_child, name='add_child'),
    path('cocuk/<int:child_id>/duzenle/', views.edit_child, name='edit_child'),

    # Profil ayarları
    path('ayarlar/', views.settings_view, name='settings'),
    path('gecmis/', views.history_view, name='history'),
]
