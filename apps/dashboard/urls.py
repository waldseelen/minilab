"""
MiniLab - Dashboard URLs
Ana sayfa ve panel yönlendirmeleri.
"""
from django.urls import path
from . import views

app_name = 'dashboard'

urlpatterns = [
    # Ana sayfa (Landing Page)
    path('', views.landing_page, name='landing'),

    # Çocuk paneli
    path('panel/', views.child_dashboard, name='child_dashboard'),

    # Ebeveyn paneli
    path('ebeveyn/', views.parent_dashboard, name='parent_dashboard'),

    # Profil seçimi (birden fazla çocuk varsa)
    path('profil-sec/', views.select_profile, name='select_profile'),
]
