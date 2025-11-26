"""
MiniLab - Parent Panel URLs
Ebeveyn paneli URL yönlendirmeleri.
"""
from django.urls import path
from . import views

app_name = 'parent_panel'

urlpatterns = [
    # Ana sayfa
    path('', views.dashboard, name='dashboard'),

    # Çocuk detay
    path('cocuk/<int:child_id>/', views.child_detail, name='child_detail'),

    # Aktivite günlüğü
    path('cocuk/<int:child_id>/aktiviteler/', views.activity_log, name='activity_log'),

    # Raporlar
    path('cocuk/<int:child_id>/raporlar/', views.reports, name='reports'),

    # Ayarlar
    path('ayarlar/', views.settings_view, name='settings'),

    # Çocuk yönetimi
    path('cocuk-ekle/', views.add_child, name='add_child'),
    path('cocuk-kaldir/<int:link_id>/', views.remove_child, name='remove_child'),

    # API
    path('api/cocuk/<int:child_id>/istatistikler/', views.api_child_stats, name='api_child_stats'),
]
