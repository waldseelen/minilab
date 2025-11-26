"""
MiniLab - Custom Admin Panel URLs
"""
from django.urls import path
from . import views

app_name = 'admin_panel'

urlpatterns = [
    # Dashboard
    path('', views.dashboard, name='dashboard'),

    # Kategoriler
    path('kategoriler/', views.categories, name='categories'),
    path('kategoriler/ekle/', views.add_category, name='add_category'),
    path('kategoriler/<int:pk>/duzenle/', views.edit_category, name='edit_category'),

    # Deneyler
    path('deneyler/', views.experiments, name='experiments'),
    path('deneyler/ekle/', views.add_experiment, name='add_experiment'),
    path('deneyler/<int:pk>/duzenle/', views.edit_experiment, name='edit_experiment'),

    # Bilgi Kartları
    path('kartlar/', views.learning_cards, name='learning_cards'),
    path('kartlar/ekle/', views.add_learning_card, name='add_learning_card'),
    path('kartlar/<int:pk>/duzenle/', views.edit_learning_card, name='edit_learning_card'),
    path('kartlar/<int:pk>/sil/', views.delete_learning_card, name='delete_learning_card'),

    # Kullanıcılar
    path('kullanicilar/', views.users, name='users'),
]
