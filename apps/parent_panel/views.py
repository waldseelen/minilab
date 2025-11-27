"""
MiniLab - Parent Panel Views
Ebeveyn paneli görünümleri - Çocuk izleme, raporlar, ayarlar.
Profesyonel Phase 7 implementasyonu.
"""
from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from django.http import JsonResponse
from django.db.models import Sum, Count, Avg
from django.utils import timezone
from django.core.mail import send_mail
from django.template.loader import render_to_string
from django.conf import settings
from datetime import timedelta, date
import json

from apps.accounts.models import User, ChildProfile
from apps.experiments.models import ExperimentProgress, Experiment, Category
from apps.gamification.models import Badge, EarnedBadge
from apps.chatbot.models import ChatMessage
from .models import ParentChildLink, ParentSettings, ActivityLog, DailyReport


def is_parent(user):
    """Kullanıcının ebeveyn olup olmadığını kontrol et."""
    return user.user_type == 'parent' or ParentChildLink.objects.filter(parent=user).exists()


def get_week_day_names():
    """Türkçe hafta günleri."""
    return ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz']


@login_required
def dashboard(request):
    """
    Ebeveyn paneli ana sayfası.
    Genel bakış, çocukların durumu, son aktiviteler.
    """
    user = request.user

    # Ebeveyne bağlı çocukları getir
    children_links = ParentChildLink.objects.filter(parent=user).select_related('child')
    children = [link.child for link in children_links]

    # Eğer bağlı çocuk yoksa, ebeveynin çocuk profillerini kontrol et
    if not children:
        children = list(ChildProfile.objects.filter(parent=user))

    # Her çocuk için istatistikleri hesapla
    children_data = []
    total_experiments_week = 0
    total_badges_week = 0
    total_time_today = 0

    for child in children:
        # Son 7 gün aktiviteleri
        week_ago = timezone.now() - timedelta(days=7)

        # Tamamlanan deneyler
        experiments_completed = ExperimentProgress.objects.filter(
            child=child,
            status='completed',
            completed_at__gte=week_ago
        ).count()
        total_experiments_week += experiments_completed

        # Kazanılan rozetler
        badges_earned = EarnedBadge.objects.filter(
            child=child,
            earned_at__gte=week_ago
        ).count()
        total_badges_week += badges_earned

        # Son aktiviteler
        recent_activities = ActivityLog.objects.filter(
            child=child
        ).order_by('-created_at')[:5]

        # Bugünkü süre (varsa)
        today_time = ActivityLog.objects.filter(
            child=child,
            created_at__date=date.today()
        ).aggregate(total=Sum('duration_seconds'))['total'] or 0
        today_time_minutes = today_time // 60
        total_time_today += today_time_minutes

        children_data.append({
            'child': child,
            'experiments_completed': experiments_completed,
            'badges_earned': badges_earned,
            'total_points': child.total_points,
            'level': child.level,
            'today_time_minutes': today_time_minutes,
            'recent_activities': recent_activities,
        })

    # Ebeveyn ayarlarını getir (yoksa oluştur)
    settings_obj, created = ParentSettings.objects.get_or_create(parent=user)

    context = {
        'page_title': 'Ebeveyn Paneli',
        'children_data': children_data,
        'settings': settings_obj,
        'has_children': len(children) > 0,
        'total_experiments_week': total_experiments_week,
        'total_badges_week': total_badges_week,
        'total_time_today': total_time_today,
    }
    return render(request, 'parent_panel/dashboard.html', context)


@login_required
def child_detail(request, child_id):
    """
    Belirli bir çocuğun detaylı görünümü.
    İlerleme, aktiviteler, istatistikler.
    """
    user = request.user
    child = get_object_or_404(ChildProfile, id=child_id)

    # Yetki kontrolü
    is_authorized = (
        ParentChildLink.objects.filter(parent=user, child=child).exists() or
        (hasattr(user, 'child_profile') and user.child_profile == child) or
        user.is_staff
    )

    if not is_authorized:
        messages.error(request, 'Bu çocuğun bilgilerine erişim yetkiniz yok.')
        return redirect('parent_panel:dashboard')

    # Son 30 günlük veriler
    month_ago = timezone.now() - timedelta(days=30)
    week_ago = timezone.now() - timedelta(days=7)

    # Deney ilerlemeleri
    experiment_progress = ExperimentProgress.objects.filter(
        child=child
    ).select_related('experiment', 'experiment__category')

    completed_experiments = experiment_progress.filter(status='completed')
    in_progress_experiments = experiment_progress.filter(status='in_progress')

    # Kategori dağılımı
    category_stats = completed_experiments.values(
        'experiment__category__name',
        'experiment__category__icon'
    ).annotate(count=Count('id')).order_by('-count')[:5]

    # Rozetler
    earned_badges = EarnedBadge.objects.filter(child=child).select_related('badge')

    # Haftalık aktivite grafiği için veri (düzeltilmiş)
    weekly_activity = []
    day_names = get_week_day_names()
    for i in range(7):
        day = date.today() - timedelta(days=6-i)
        day_experiments = completed_experiments.filter(completed_at__date=day).count()
        weekly_activity.append({
            'day': day_names[day.weekday()],
            'date': day.strftime('%d.%m'),
            'count': day_experiments,
        })

    # Son sohbet mesajları (eğer izin varsa)
    chat_messages = []
    link = ParentChildLink.objects.filter(parent=user, child=child).first()
    can_view_chat = True

    if link:
        can_view_chat = link.can_view_chat_history
        if can_view_chat:
            try:
                chat_messages = ChatMessage.objects.filter(
                    user=child.user
                ).order_by('-created_at')[:20]
            except (AttributeError, ChatMessage.DoesNotExist) as e:
                # child.user yoksa veya mesaj bulunamadıysa
                pass

    context = {
        'page_title': f"{child.nickname}'in İlerlemesi",
        'child': child,
        'completed_count': completed_experiments.count(),
        'in_progress_count': in_progress_experiments.count(),
        'total_points': child.total_points,
        'level': child.level,
        'category_stats': list(category_stats),
        'earned_badges': earned_badges,
        'weekly_activity': json.dumps(weekly_activity),
        'chat_messages': chat_messages,
        'can_view_chat': can_view_chat,
    }
    return render(request, 'parent_panel/child_detail.html', context)


@login_required
def activity_log(request, child_id):
    """
    Çocuğun aktivite günlüğü.
    """
    user = request.user
    child = get_object_or_404(ChildProfile, id=child_id)

    # Yetki kontrolü
    is_authorized = (
        ParentChildLink.objects.filter(parent=user, child=child).exists() or
        user.is_staff
    )

    if not is_authorized:
        messages.error(request, 'Bu çocuğun bilgilerine erişim yetkiniz yok.')
        return redirect('parent_panel:dashboard')

    # Tarih filtresi
    date_filter = request.GET.get('date', 'week')

    if date_filter == 'today':
        start_date = timezone.now().replace(hour=0, minute=0, second=0)
    elif date_filter == 'week':
        start_date = timezone.now() - timedelta(days=7)
    elif date_filter == 'month':
        start_date = timezone.now() - timedelta(days=30)
    else:
        start_date = timezone.now() - timedelta(days=7)

    activities = ActivityLog.objects.filter(
        child=child,
        created_at__gte=start_date
    ).order_by('-created_at')

    context = {
        'page_title': f"{child.nickname}'in Aktiviteleri",
        'child': child,
        'activities': activities,
        'date_filter': date_filter,
    }
    return render(request, 'parent_panel/activity_log.html', context)


@login_required
def reports(request, child_id):
    """
    Günlük/haftalık raporlar.
    """
    user = request.user
    child = get_object_or_404(ChildProfile, id=child_id)

    # Yetki kontrolü
    is_authorized = (
        ParentChildLink.objects.filter(parent=user, child=child).exists() or
        user.is_staff
    )

    if not is_authorized:
        messages.error(request, 'Bu çocuğun bilgilerine erişim yetkiniz yok.')
        return redirect('parent_panel:dashboard')

    # Son 30 günlük raporlar
    reports_list = DailyReport.objects.filter(child=child).order_by('-date')[:30]

    # Özet istatistikler
    month_ago = timezone.now() - timedelta(days=30)
    monthly_stats = DailyReport.objects.filter(
        child=child,
        date__gte=month_ago.date()
    ).aggregate(
        total_time=Sum('total_time_minutes'),
        total_experiments=Sum('experiments_completed'),
        total_points=Sum('points_earned'),
        total_badges=Sum('badges_earned'),
    )

    context = {
        'page_title': f"{child.nickname}'in Raporları",
        'child': child,
        'reports': reports_list,
        'monthly_stats': monthly_stats,
    }
    return render(request, 'parent_panel/reports.html', context)


@login_required
def settings_view(request):
    """
    Ebeveyn ayarları sayfası.
    """
    user = request.user
    settings_obj, created = ParentSettings.objects.get_or_create(parent=user)

    if request.method == 'POST':
        # Ayarları güncelle
        settings_obj.daily_time_limit = int(request.POST.get('daily_time_limit', 60))
        settings_obj.allowed_start_time = request.POST.get('allowed_start_time', '08:00')
        settings_obj.allowed_end_time = request.POST.get('allowed_end_time', '20:00')
        settings_obj.allow_chatbot = request.POST.get('allow_chatbot') == 'on'
        settings_obj.allow_voice_messages = request.POST.get('allow_voice_messages') == 'on'
        settings_obj.email_notifications = request.POST.get('email_notifications') == 'on'
        settings_obj.save()

        messages.success(request, 'Ayarlar başarıyla güncellendi!')
        return redirect('parent_panel:settings')

    # Bağlı çocuklar
    children_links = ParentChildLink.objects.filter(parent=user).select_related('child')

    context = {
        'page_title': 'Ebeveyn Ayarları',
        'settings': settings_obj,
        'children_links': children_links,
    }
    return render(request, 'parent_panel/settings.html', context)


@login_required
def add_child(request):
    """
    Yeni çocuk ekle/bağla.
    """
    user = request.user

    if request.method == 'POST':
        # Çocuk ekleme mantığı
        child_username = request.POST.get('child_username', '').strip()

        if child_username:
            try:
                # Çocuk profilini doğrudan nickname ile bul
                child_profile = ChildProfile.objects.get(nickname=child_username)

                # Bağlantı oluştur
                link, created = ParentChildLink.objects.get_or_create(
                    parent=user,
                    child=child_profile,
                    defaults={'is_verified': False}
                )

                if created:
                    messages.success(request, f'{child_profile.nickname} başarıyla eklendi!')
                else:
                    messages.info(request, f'{child_profile.nickname} zaten ekli.')

            except ChildProfile.DoesNotExist:
                messages.error(request, 'Çocuk profili bulunamadı.')

        return redirect('parent_panel:settings')

    return redirect('parent_panel:settings')


@login_required
def remove_child(request, link_id):
    """
    Çocuk bağlantısını kaldır.
    """
    user = request.user
    link = get_object_or_404(ParentChildLink, id=link_id, parent=user)

    if request.method == 'POST':
        child_name = link.child.nickname
        link.delete()
        messages.success(request, f'{child_name} bağlantısı kaldırıldı.')

    return redirect('parent_panel:settings')


@login_required
def api_child_stats(request, child_id):
    """
    Çocuk istatistiklerini JSON olarak döndür (grafik için).
    """
    user = request.user
    child = get_object_or_404(ChildProfile, id=child_id)

    # Yetki kontrolü
    is_authorized = (
        ParentChildLink.objects.filter(parent=user, child=child).exists() or
        user.is_staff
    )

    if not is_authorized:
        return JsonResponse({'error': 'Yetkisiz erişim'}, status=403)

    # Son 7 günlük veriler
    weekly_data = []
    for i in range(7):
        day = date.today() - timedelta(days=6-i)

        day_completed = ExperimentProgress.objects.filter(
            child=child,
            status='completed',
            completed_at__date=day
        ).count()

        day_time = ActivityLog.objects.filter(
            child=child,
            created_at__date=day
        ).aggregate(total=Sum('duration_seconds'))['total'] or 0

        weekly_data.append({
            'date': day.strftime('%d.%m'),
            'experiments': day_completed,
            'time_minutes': day_time // 60,
        })

    # Kategori dağılımı
    category_data = ExperimentProgress.objects.filter(
        child=child,
        status='completed'
    ).values('experiment__category__name').annotate(
        count=Count('id')
    ).order_by('-count')[:5]

    return JsonResponse({
        'weekly': weekly_data,
        'categories': list(category_data),
        'total_points': child.total_points,
        'level': child.level,
    })


# ============================================
# Phase 7: Yeni API Endpoints
# ============================================

@login_required
def api_screen_time_check(request):
    """
    Ekran süresi ve yatma zamanı kontrolü API'si.
    Frontend'den periyodik olarak çağrılır.
    """
    child = None
    # Ebeveynin ilk çocuk profilini al
    child = ChildProfile.objects.filter(parent=request.user).first()
    if not child:
        return JsonResponse({
            'allowed': True,
            'message': None
        })

    # Ebeveyn ayarlarını bul
    parent_link = ParentChildLink.objects.filter(child=child).first()
    if not parent_link:
        return JsonResponse({
            'allowed': True,
            'message': None
        })

    try:
        parent_settings = ParentSettings.objects.get(parent=parent_link.parent)
    except ParentSettings.DoesNotExist:
        return JsonResponse({
            'allowed': True,
            'message': None
        })

    now = timezone.localtime()
    current_time = now.time()

    # Yatma zamanı kontrolü
    allowed_start = parent_settings.allowed_start_time
    allowed_end = parent_settings.allowed_end_time

    if allowed_start and allowed_end:
        if current_time < allowed_start:
            return JsonResponse({
                'allowed': False,
                'reason': 'bedtime',
                'message': f"Günaydın! Uygulama saat {allowed_start.strftime('%H:%M')}'de açılıyor. Biraz daha uyu!"
            })
        if current_time > allowed_end:
            return JsonResponse({
                'allowed': False,
                'reason': 'bedtime',
                'message': "Yatma zamanı geldi! Yarın görüşürüz. İyi geceler!"
            })

    # Günlük süre kontrolü
    daily_limit = parent_settings.daily_time_limit  # dakika cinsinden
    today_usage = ActivityLog.objects.filter(
        child=child,
        created_at__date=date.today()
    ).aggregate(total=Sum('duration_seconds'))['total'] or 0

    today_minutes = today_usage // 60
    remaining_minutes = max(0, daily_limit - today_minutes)

    if remaining_minutes <= 0:
        return JsonResponse({
            'allowed': False,
            'reason': 'time_limit',
            'message': 'Bugünkü kullanım süren doldu! Yarın tekrar gel.'
        })

    # Uyarı mesajları
    warning_message = None
    if remaining_minutes <= 5:
        warning_message = f'Son {remaining_minutes} dakikan kaldı!'
    elif remaining_minutes <= 10:
        warning_message = f'{remaining_minutes} dakikan kaldı. Deneyini bitirmeye hazırlan!'

    return JsonResponse({
        'allowed': True,
        'remaining_minutes': remaining_minutes,
        'used_minutes': today_minutes,
        'daily_limit': daily_limit,
        'warning': warning_message
    })


@login_required
def api_log_activity(request):
    """
    Aktivite süresi kaydetme API'si.
    Her dakika frontend'den çağrılır.
    """
    if request.method != 'POST':
        return JsonResponse({'error': 'POST gerekli'}, status=405)

    # Ebeveynin ilk çocuk profilini al
    child = ChildProfile.objects.filter(parent=request.user).first()
    if not child:
        return JsonResponse({'success': True})  # Sessizce geç

    try:
        data = json.loads(request.body)
        activity_type = data.get('activity_type', 'app_usage')
        duration_seconds = data.get('duration_seconds', 60)
        extra_data = data.get('extra_data', {})
    except (json.JSONDecodeError, KeyError):
        activity_type = 'app_usage'
        duration_seconds = 60
        extra_data = {}

    # Son aktiviteyi güncelle veya yeni oluştur
    recent = ActivityLog.objects.filter(
        child=child,
        activity_type=activity_type,
        created_at__gte=timezone.now() - timedelta(minutes=2)
    ).first()

    if recent:
        recent.duration_seconds += duration_seconds
        recent.save()
    else:
        ActivityLog.objects.create(
            child=child,
            activity_type=activity_type,
            duration_seconds=duration_seconds,
            extra_data=extra_data
        )

    return JsonResponse({'success': True})


@login_required
def weekly_summary_view(request, child_id):
    """
    Haftalık özet görünümü.
    "Bu hafta ne öğrendi?" kartı.
    """
    user = request.user
    child = get_object_or_404(ChildProfile, id=child_id)

    # Yetki kontrolü
    is_authorized = (
        ParentChildLink.objects.filter(parent=user, child=child).exists() or
        user.is_staff
    )

    if not is_authorized:
        messages.error(request, 'Bu çocuğun bilgilerine erişim yetkiniz yok.')
        return redirect('parent_panel:dashboard')

    week_ago = timezone.now() - timedelta(days=7)

    # Haftalık özet verileri
    completed_experiments = ExperimentProgress.objects.filter(
        child=child,
        status='completed',
        completed_at__gte=week_ago
    ).select_related('experiment', 'experiment__category')

    # Kategori bazlı özet
    category_summary = {}
    for progress in completed_experiments:
        cat = progress.experiment.category
        if cat.name not in category_summary:
            category_summary[cat.name] = {
                'name': cat.name,
                'icon': cat.icon,
                'count': 0,
                'experiments': []
            }
        category_summary[cat.name]['count'] += 1
        category_summary[cat.name]['experiments'].append(progress.experiment.title)

    # Kazanılan rozetler
    earned_badges = EarnedBadge.objects.filter(
        child=child,
        earned_at__gte=week_ago
    ).select_related('badge')

    # Toplam süre
    total_time = ActivityLog.objects.filter(
        child=child,
        created_at__gte=week_ago
    ).aggregate(total=Sum('duration_seconds'))['total'] or 0

    # MiniBot sohbet sayısı
    chat_count = 0
    try:
        chat_count = ChatMessage.objects.filter(
            user=child.user,
            created_at__gte=week_ago,
            is_user=True
        ).count()
    except (AttributeError, ChatMessage.DoesNotExist) as e:
        # child.user yoksa veya mesaj bulunamadıysa
        pass

    context = {
        'page_title': f"{child.nickname}'in Haftalık Özeti",
        'child': child,
        'category_summary': category_summary,
        'earned_badges': earned_badges,
        'total_experiments': completed_experiments.count(),
        'total_time_hours': total_time // 3600,
        'total_time_minutes': (total_time % 3600) // 60,
        'chat_count': chat_count,
        'week_start': (timezone.now() - timedelta(days=7)).strftime('%d.%m.%Y'),
        'week_end': timezone.now().strftime('%d.%m.%Y'),
    }
    return render(request, 'parent_panel/weekly_summary.html', context)


def send_weekly_summary_email(child, parent_email):
    """
    Haftalık özet e-postası gönder.
    Celery task olarak kullanılabilir.
    """
    week_ago = timezone.now() - timedelta(days=7)

    # Haftalık veriler
    completed_experiments = ExperimentProgress.objects.filter(
        child=child,
        status='completed',
        completed_at__gte=week_ago
    ).select_related('experiment', 'experiment__category')

    # Kategori özeti
    category_counts = {}
    for progress in completed_experiments:
        cat_name = progress.experiment.category.name
        category_counts[cat_name] = category_counts.get(cat_name, 0) + 1

    # Kazanılan rozetler
    earned_badges = EarnedBadge.objects.filter(
        child=child,
        earned_at__gte=week_ago
    ).select_related('badge')

    context = {
        'child': child,
        'total_experiments': completed_experiments.count(),
        'category_counts': category_counts,
        'earned_badges': earned_badges,
        'week_start': (timezone.now() - timedelta(days=7)).strftime('%d.%m.%Y'),
        'week_end': timezone.now().strftime('%d.%m.%Y'),
    }

    # E-posta içeriği
    subject = f"📊 {child.nickname}'in Haftalık MiniLab Özeti"

    try:
        html_message = render_to_string('parent_panel/email/weekly_summary.html', context)
        plain_message = f"""
        {child.nickname}'in Haftalık MiniLab Özeti

        Bu hafta {completed_experiments.count()} deney tamamlandı!

        Kategori Dağılımı:
        {chr(10).join([f'- {k}: {v} deney' for k, v in category_counts.items()])}

        Kazanılan Rozetler: {earned_badges.count()}

        MiniLab'da harika bir hafta geçirdiniz! 🎉
        """

        send_mail(
            subject=subject,
            message=plain_message,
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[parent_email],
            html_message=html_message,
            fail_silently=True,
        )
        return True
    except Exception as e:
        print(f"E-posta gönderme hatası: {e}")
        return False


@login_required
def api_send_test_email(request):
    """
    Test e-postası gönder (ebeveyn için).
    """
    if request.method != 'POST':
        return JsonResponse({'error': 'POST gerekli'}, status=405)

    user = request.user
    children_links = ParentChildLink.objects.filter(parent=user).select_related('child')

    if not children_links:
        return JsonResponse({
            'success': False,
            'error': 'Bağlı çocuk bulunamadı'
        })

    # İlk çocuk için test e-postası
    child = children_links.first().child

    success = send_weekly_summary_email(child, user.email)

    if success:
        return JsonResponse({
            'success': True,
            'message': f'Test e-postası {user.email} adresine gönderildi!'
        })
    else:
        return JsonResponse({
            'success': False,
            'error': 'E-posta gönderilemedi. Lütfen daha sonra tekrar deneyin.'
        })


def generate_daily_report(child, report_date=None):
    """
    Günlük rapor oluştur.
    Celery task olarak gece yarısı çalıştırılabilir.
    """
    if report_date is None:
        report_date = date.today() - timedelta(days=1)  # Dün

    # Zaten rapor var mı?
    if DailyReport.objects.filter(child=child, date=report_date).exists():
        return None

    # Günlük veriler
    day_start = timezone.make_aware(
        timezone.datetime.combine(report_date, timezone.datetime.min.time())
    )
    day_end = day_start + timedelta(days=1)

    # Tamamlanan deneyler
    experiments_completed = ExperimentProgress.objects.filter(
        child=child,
        status='completed',
        completed_at__gte=day_start,
        completed_at__lt=day_end
    ).count()

    # Görüntülenen kartlar (varsa)
    cards_viewed = 0  # TODO: Kart görüntüleme takibi eklenirse

    # Sohbet mesajları
    chat_messages = 0
    try:
        chat_messages = ChatMessage.objects.filter(
            user=child.user,
            created_at__gte=day_start,
            created_at__lt=day_end,
            is_user=True
        ).count()
    except (AttributeError, ChatMessage.DoesNotExist) as e:
        # child.user yoksa veya mesaj bulunamadıysa
        pass

    # Kazanılan puanlar (yaklaşık)
    points_earned = experiments_completed * 10  # Varsayılan deney puanı

    # Kazanılan rozetler
    badges_earned = EarnedBadge.objects.filter(
        child=child,
        earned_at__gte=day_start,
        earned_at__lt=day_end
    ).count()

    # Toplam süre
    total_time = ActivityLog.objects.filter(
        child=child,
        created_at__gte=day_start,
        created_at__lt=day_end
    ).aggregate(total=Sum('duration_seconds'))['total'] or 0

    # Rapor oluştur
    report = DailyReport.objects.create(
        child=child,
        date=report_date,
        total_time_minutes=total_time // 60,
        experiments_completed=experiments_completed,
        cards_viewed=cards_viewed,
        chat_messages=chat_messages,
        points_earned=points_earned,
        badges_earned=badges_earned,
    )

    return report
