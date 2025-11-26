"""
MiniLab - Story Mode URLs
Hikaye modu yönlendirmeleri.
"""
from django.urls import path
from . import views

app_name = 'storymode'

urlpatterns = [
    # Hikaye listesi
    path('', views.story_list, name='story_list'),

    # Hikaye detay
    path('<slug:slug>/', views.story_detail, name='story_detail'),

    # Hikaye sayfası (okuma)
    path('<slug:slug>/sayfa/<int:page_order>/', views.story_page, name='story_page'),

    # Seçim yap (AJAX)
    path('<slug:slug>/secim/', views.make_choice, name='make_choice'),
]
