"""
MiniLab - Experiments URLs
Deney sayfaları yönlendirmeleri.
"""
from django.urls import path
from . import views

app_name = 'experiments'

urlpatterns = [
    # Kategori listesi
    path('', views.category_list, name='category_list'),

    # Kategori detay (o kategorideki deneyler)
    path('kategori/<slug:slug>/', views.category_detail, name='category_detail'),

    # Öğrenme kartları görünümü
    path('kategori/<slug:slug>/kartlar/', views.learning_cards_view, name='learning_cards'),

    # Deney detay
    path('<slug:slug>/', views.experiment_detail, name='experiment_detail'),

    # Deney başlat (simülasyon sayfası)
    path('<slug:slug>/baslat/', views.start_experiment, name='start_experiment'),

    # Deney tamamla (AJAX)
    path('<slug:slug>/tamamla/', views.complete_experiment, name='complete_experiment'),

    # Deney sonu raporu
    path('<slug:slug>/rapor/', views.experiment_report, name='experiment_report'),
]
