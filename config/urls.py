"""
MiniLab - URL Configuration
Ana URL yapılandırması.
"""
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    # Admin paneli
    path('admin/', admin.site.urls),

    # Ana sayfa
    path('', include('apps.dashboard.urls')),

    # Kullanıcı işlemleri
    path('hesap/', include('apps.accounts.urls')),

    # Deneyler
    path('deneyler/', include('apps.experiments.urls')),

    # Hikaye modu
    path('hikayeler/', include('apps.storymode.urls')),

    # MiniBot (Chatbot)
    path('minibot/', include('apps.chatbot.urls')),

    # Oyunlaştırma (rozetler, mağaza)
    path('oyun/', include('apps.gamification.urls')),

    # Özel Admin Paneli
    path('yonetim/', include('apps.admin_panel.urls')),

    # Ebeveyn Paneli
    path('ebeveyn/', include('apps.parent_panel.urls')),
]

# Development modunda static ve media dosyalarını serve et
if settings.DEBUG:
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATICFILES_DIRS[0] if settings.STATICFILES_DIRS else settings.STATIC_ROOT)
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

    # Browser reload için
    urlpatterns += [
        path("__reload__/", include("django_browser_reload.urls")),
    ]

# Admin panel özelleştirme
admin.site.site_header = "🧪 MiniLab Yönetim Paneli"
admin.site.site_title = "MiniLab Admin"
admin.site.index_title = "Hoş Geldiniz!"
