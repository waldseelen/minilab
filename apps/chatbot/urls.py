"""
MiniLab - Chatbot URLs
MiniBot sohbet yönlendirmeleri.
"""
from django.urls import path
from . import views

app_name = 'chatbot'

urlpatterns = [
    # Sohbet sayfası
    path('', views.chat_view, name='chat'),

    # Mesaj gönder (AJAX)
    path('mesaj/', views.send_message, name='send_message'),

    # İpucu al (AJAX)
    path('ipucu/', views.get_hint, name='get_hint'),

    # TTS (Text-to-Speech)
    path('oku/', views.text_to_speech, name='tts'),

    # Sohbet geçmişini temizle
    path('temizle/', views.clear_history, name='clear_history'),
]
