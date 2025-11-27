"""
MiniLab - Ekran Süresi ve Yatma Zamanı Middleware
Çocuk hesapları için erişim kontrolü.
"""
from django.shortcuts import redirect, render
from django.urls import reverse
from django.utils import timezone
from django.db.models import Sum
from datetime import date

from apps.accounts.models import ChildProfile
from apps.parent_panel.models import ParentChildLink, ParentSettings, ActivityLog


class ScreenTimeMiddleware:
    """
    Çocukların ekran süresi ve izin verilen saatleri kontrol eder.
    Ebeveyn ayarlarına göre erişimi kısıtlar.
    """

    # Middleware'in kontrol ETMEYECEĞİ URL'ler
    EXEMPT_URLS = [
        '/hesap/giris/',
        '/hesap/cikis/',
        '/hesap/kayit/',
        '/admin/',
        '/static/',
        '/media/',
        '/api/ekran-suresi-kontrol/',
        '/api/aktivite-kaydet/',
        '/__debug__/',
    ]

    # Sadece bu URL pattern'lerinde kontrol yap
    PROTECTED_PATTERNS = [
        '/deneyler/',
        '/hikaye/',
        '/oyunlar/',
        '/sohbet/',
        '/panel/',
    ]

    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        # Muaf URL'leri atla
        path = request.path
        if any(path.startswith(url) for url in self.EXEMPT_URLS):
            return self.get_response(request)

        # Sadece giriş yapmış kullanıcıları kontrol et
        if not request.user.is_authenticated:
            return self.get_response(request)

        # Sadece çocuk hesaplarını kontrol et
        # Ebeveynin ilk çocuk profilini al
        child = ChildProfile.objects.filter(parent=request.user).first()
        if not child:
            return self.get_response(request)

        # Korumalı URL değilse atla
        if not any(path.startswith(pattern) for pattern in self.PROTECTED_PATTERNS):
            return self.get_response(request)

        # Ebeveyn bağlantısını bul
        parent_link = ParentChildLink.objects.filter(child=child).first()
        if not parent_link:
            return self.get_response(request)

        # Ebeveyn ayarlarını al
        try:
            settings = ParentSettings.objects.get(parent=parent_link.parent)
        except ParentSettings.DoesNotExist:
            return self.get_response(request)

        # Kontrol yap
        block_reason = self._check_restrictions(child, settings)

        if block_reason:
            # Engelleme sayfasını göster
            return render(request, 'parent_panel/blocked.html', {
                'reason': block_reason['reason'],
                'message': block_reason['message'],
                'child': child,
            })

        return self.get_response(request)

    def _check_restrictions(self, child, settings):
        """
        Kısıtlamaları kontrol et.
        Returns: None (izin verildi) veya {'reason': str, 'message': str}
        """
        now = timezone.localtime()
        current_time = now.time()

        # 1. Yatma zamanı kontrolü
        allowed_start = settings.allowed_start_time
        allowed_end = settings.allowed_end_time

        if allowed_start and allowed_end:
            if current_time < allowed_start:
                return {
                    'reason': 'bedtime',
                    'message': f"Günaydın! 🌅 MiniLab saat {allowed_start.strftime('%H:%M')}'de açılıyor. Biraz daha dinlen!"
                }
            if current_time > allowed_end:
                return {
                    'reason': 'bedtime',
                    'message': f"Yatma zamanı geldi! 🌙 MiniLab yarın saat {allowed_start.strftime('%H:%M')}'de tekrar açılacak. İyi geceler!"
                }

        # 2. Günlük süre kontrolü
        daily_limit = settings.daily_time_limit  # dakika

        if daily_limit > 0:
            today_usage = ActivityLog.objects.filter(
                child=child,
                created_at__date=date.today()
            ).aggregate(total=Sum('duration_seconds'))['total'] or 0

            today_minutes = today_usage // 60

            if today_minutes >= daily_limit:
                return {
                    'reason': 'time_limit',
                    'message': f'Bugünkü {daily_limit} dakikalık süren doldu! 🎮 Yarın tekrar harika deneyler seni bekliyor!'
                }

        return None
