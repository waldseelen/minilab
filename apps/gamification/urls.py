"""
MiniLab - Gamification URLs
Oyunlaştırma, rozetler ve mağaza yönlendirmeleri.
"""
from django.urls import path
from . import views

app_name = 'gamification'

urlpatterns = [
    # Rozetler
    path('rozetler/', views.badges_view, name='badges'),

    # Avatar mağazası
    path('magaza/', views.shop_view, name='shop'),

    # Öğe satın al (AJAX)
    path('satin-al/<int:item_id>/', views.purchase_item, name='purchase_item'),

    # Avatar özelleştirme
    path('avatar/', views.customize_avatar, name='customize_avatar'),

    # Sürpriz Yumurta
    path('surpriz/', views.surprise_egg, name='surprise_egg'),
]
