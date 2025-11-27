"""
MiniLab - Dashboard Views
Ana sayfa ve panel görünümleri.
"""
from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required
from apps.experiments.models import Category, Experiment


def landing_page(request):
    """
    Ana sayfa - Landing Page
    Animasyonlu, şirin karşılama sayfası.
    """
    # Giriş yapmış kullanıcıyı panele yönlendir
    if request.user.is_authenticated:
        return redirect('dashboard:child_dashboard')

    # Tüm 10 kategoriyi veritabanından çek
    categories = Category.objects.filter(is_active=True).order_by('order')

    context = {
        'categories': categories,
    }
    return render(request, 'pages/landing.html', context)


@login_required
def child_dashboard(request):
    """
    Çocuk paneli - Ana menü.
    Kategoriler, günlük ödül, MiniBot erişimi.
    """
    # Kategorileri veritabanından çek
    categories = Category.objects.filter(is_active=True).order_by('order')

    # Her kategorinin deney sayısını ekle
    for cat in categories:
        cat.experiment_count = cat.experiments.filter(is_active=True).count()

    # Kullanıcı profil bilgileri
    star_dust = 0
    badge_count = 0
    child_profile = None

    from apps.accounts.models import ChildProfile
    # Ebeveynin ilk çocuk profilini al
    child_profile = ChildProfile.objects.filter(parent=request.user).first()
    if child_profile:
        star_dust = child_profile.star_dust or 0
        badge_count = child_profile.earned_badges.count()

    context = {
        'page_title': 'MiniLab',
        'categories': categories,
        'star_dust': star_dust,
        'badge_count': badge_count,
        'child_profile': child_profile,
    }
    return render(request, 'dashboard/child_dashboard.html', context)


@login_required
def parent_dashboard(request):
    """
    Ebeveyn paneli - İstatistikler ve ayarlar.
    """
    context = {
        'page_title': 'Ebeveyn Paneli',
    }
    return render(request, 'dashboard/parent_dashboard.html', context)


@login_required
def select_profile(request):
    """
    Profil seçimi - Birden fazla çocuk profili varsa.
    """
    context = {
        'page_title': 'Profil Seç',
    }
    return render(request, 'dashboard/select_profile.html', context)
