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

    # Hikaye sıfırla
    path('<slug:slug>/sifirla/', views.reset_story, name='reset_story'),

    # === Faz 5: Yeni Özellikler ===
    # Hafıza Oyunu
    path('oyunlar/hafiza/', views.memory_game, name='memory_game'),

    # Öğrenme Kartları
    path('kartlar/', views.learning_cards, name='learning_cards'),
    path('kartlar/<str:category>/', views.learning_cards, name='learning_cards_category'),

    # API Endpoints
    path('api/kartlar/', views.api_get_cards, name='api_get_cards'),
    path('api/kartlar/<str:category>/', views.api_get_cards, name='api_get_cards_category'),
    path('api/hafiza-oyunlari/', views.api_get_memory_games, name='api_get_memory_games'),
]
