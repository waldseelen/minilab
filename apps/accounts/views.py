"""
MiniLab - Accounts Views
Kullanıcı işlemleri görünümleri.
"""
from django.shortcuts import render, redirect
from django.contrib.auth import login, logout, authenticate
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from .models import User


def login_view(request):
    """
    Kullanıcı girişi.
    """
    if request.user.is_authenticated:
        return redirect('dashboard:child_dashboard')

    if request.method == 'POST':
        username = request.POST.get('username')
        password = request.POST.get('password')
        user = authenticate(request, username=username, password=password)

        if user is not None:
            login(request, user)
            messages.success(request, f'Hoş geldin, {user.first_name or user.username}! 🎉')
            return redirect('dashboard:child_dashboard')
        else:
            messages.error(request, 'Kullanıcı adı veya şifre hatalı.')

    return render(request, 'accounts/login.html', {'page_title': 'Giriş Yap'})


def logout_view(request):
    """
    Kullanıcı çıkışı.
    """
    logout(request)
    messages.info(request, 'Görüşmek üzere! 👋')
    return redirect('dashboard:landing')


def register_view(request):
    """
    Yeni kullanıcı kaydı (Ebeveyn).
    """
    if request.user.is_authenticated:
        return redirect('dashboard:child_dashboard')

    if request.method == 'POST':
        first_name = request.POST.get('first_name', '').strip()
        last_name = request.POST.get('last_name', '').strip()
        email = request.POST.get('email', '').strip()
        username = request.POST.get('username', '').strip()
        password1 = request.POST.get('password1', '')
        password2 = request.POST.get('password2', '')
        terms = request.POST.get('terms')

        # Validasyon
        errors = []

        if not all([first_name, last_name, email, username, password1, password2]):
            errors.append('Tüm alanları doldurunuz.')

        if password1 != password2:
            errors.append('Şifreler eşleşmiyor.')

        if len(password1) < 6:
            errors.append('Şifre en az 6 karakter olmalıdır.')

        if User.objects.filter(username=username).exists():
            errors.append('Bu kullanıcı adı zaten kullanılıyor.')

        if User.objects.filter(email=email).exists():
            errors.append('Bu e-posta adresi zaten kayıtlı.')

        if not terms:
            errors.append('Kullanım koşullarını kabul etmelisiniz.')

        if errors:
            for error in errors:
                messages.error(request, error)
        else:
            # Kullanıcı oluştur
            user = User.objects.create_user(
                username=username,
                email=email,
                password=password1,
                first_name=first_name,
                last_name=last_name,
                user_type='parent'
            )

            # Otomatik giriş yap
            login(request, user)
            messages.success(request, f'Hoş geldin, {first_name}! 🎉 Hesabın başarıyla oluşturuldu!')
            return redirect('dashboard:child_dashboard')

    return render(request, 'accounts/register.html', {'page_title': 'Kayıt Ol'})


@login_required
def add_child(request):
    """
    Çocuk profili ekleme.
    """
    if request.method == 'POST':
        # TODO: Form işleme
        pass

    return render(request, 'accounts/add_child.html', {'page_title': 'Çocuk Ekle'})


@login_required
def edit_child(request, child_id):
    """
    Çocuk profili düzenleme.
    """
    # TODO: Profil getir ve düzenle
    return render(request, 'accounts/edit_child.html', {'page_title': 'Profil Düzenle'})


@login_required
def settings_view(request):
    """
    Kullanıcı ayarları.
    """
    return render(request, 'accounts/settings.html', {'page_title': 'Ayarlar'})


@login_required
def history_view(request):
    """
    Öğrenme geçmişi sayfası.
    """
    from apps.experiments.models import ExperimentProgress
    from datetime import datetime, timedelta
    from django.db.models import Sum, Count
    from django.db.models.functions import TruncDate

    user = request.user

    # Kullanıcının child profile'ını bul (varsa)
    child_ids = []
    try:
        from apps.accounts.models import ChildProfile
        child_profiles = ChildProfile.objects.filter(parent=user)
        child_ids = list(child_profiles.values_list('id', flat=True))
    except (ChildProfile.DoesNotExist, Exception) as e:
        # Çocuk profili bulunamadı veya veritabanı hatası
        child_ids = []

    # Son aktiviteler (child profile varsa)
    if child_ids:
        recent_activities = ExperimentProgress.objects.filter(
            child_id__in=child_ids
        ).select_related(
            'experiment', 'experiment__category'
        ).order_by('-started_at')[:20]

        total_cards_viewed = ExperimentProgress.objects.filter(child_id__in=child_ids).count()
        completed_experiments = ExperimentProgress.objects.filter(
            child_id__in=child_ids,
            status='completed'
        ).count()
        total_points = ExperimentProgress.objects.filter(
            child_id__in=child_ids,
            status='completed'
        ).aggregate(total=Sum('score'))['total'] or 0
    else:
        recent_activities = []
        total_cards_viewed = 0
        completed_experiments = 0
        total_points = 0

    # Hafta günleri için boş veri
    week_days = []
    weekly_total = 0

    context = {
        'page_title': 'Öğrenme Geçmişi',
        'recent_activities': recent_activities,
        'total_cards_viewed': total_cards_viewed,
        'completed_experiments': completed_experiments,
        'total_points': total_points,
        'streak': 0,
        'week_days': week_days,
        'weekly_total': weekly_total,
    }

    return render(request, 'accounts/history.html', context)
