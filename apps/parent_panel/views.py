"""
MiniLab - Parent Panel Views
Ebeveyn paneli görünümleri - Çocuk izleme, raporlar, ayarlar.
"""
from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from django.http import JsonResponse
from django.db.models import Sum, Count, Avg
from django.utils import timezone
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

    # Eğer bağlı çocuk yoksa, kendi çocuk profilini kontrol et
    if not children:
        try:
            own_child = ChildProfile.objects.get(user=user)
            children = [own_child]
        except ChildProfile.DoesNotExist:
            children = []

    # Her çocuk için istatistikleri hesapla
    children_data = []
    for child in children:
        # Son 7 gün aktiviteleri
        week_ago = timezone.now() - timedelta(days=7)

        # Tamamlanan deneyler
        experiments_completed = ExperimentProgress.objects.filter(
            child=child,
            status='completed',
            completed_at__gte=week_ago
        ).count()

        # Kazanılan rozetler
        badges_earned = EarnedBadge.objects.filter(
            child=child,
            earned_at__gte=week_ago
        ).count()

        # Son aktiviteler
        recent_activities = ActivityLog.objects.filter(
            child=child
        ).order_by('-created_at')[:5]

        # Bugünkü süre (varsa)
        today_time = ActivityLog.objects.filter(
            child=child,
            created_at__date=date.today()
        ).aggregate(total=Sum('duration_seconds'))['total'] or 0

        children_data.append({
            'child': child,
            'experiments_completed': experiments_completed,
            'badges_earned': badges_earned,
            'total_points': child.total_points,
            'level': child.level,
            'today_time_minutes': today_time // 60,
            'recent_activities': recent_activities,
        })

    # Ebeveyn ayarlarını getir (yoksa oluştur)
    settings_obj, created = ParentSettings.objects.get_or_create(parent=user)

    context = {
        'page_title': 'Ebeveyn Paneli',
        'children_data': children_data,
        'settings': settings_obj,
        'has_children': len(children) > 0,
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

    # Haftalık aktivite grafiği için veri
    weekly_activity = []
    for i in range(7):
        day = date.today() - timedelta(days=6-i)
        day_experiments = completed_experiments.filter(completed_at__date=day).count()
        weekly_activity.append({
            'day': day.strftime('%a'),
            'count': day_experiments,
        })

    # Son sohbet mesajları (eğer izin varsa)
    chat_messages = []
    link = ParentChildLink.objects.filter(parent=user, child=child).first()
    if link and link.can_view_chat_history:
        chat_messages = ChatMessage.objects.filter(
            user=child.user if hasattr(child, 'user') else None
        ).order_by('-created_at')[:20]

    context = {
        'page_title': f"{child.nickname}'in İlerlemesi",
        'child': child,
        'completed_count': completed_experiments.count(),
        'in_progress_count': in_progress_experiments.count(),
        'total_points': child.total_points,
        'level': child.level,
        'category_stats': category_stats,
        'earned_badges': earned_badges,
        'weekly_activity': weekly_activity,
        'chat_messages': chat_messages,
        'can_view_chat': link.can_view_chat_history if link else True,
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
                child_user = User.objects.get(username=child_username)
                child_profile = ChildProfile.objects.get(user=child_user)

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

            except User.DoesNotExist:
                messages.error(request, 'Kullanıcı bulunamadı.')
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
