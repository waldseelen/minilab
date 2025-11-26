"""
MiniLab - Experiments Views
Deney sayfaları görünümleri.
"""
from django.shortcuts import render, get_object_or_404, redirect
from django.contrib.auth.decorators import login_required
from django.http import JsonResponse
from django.utils import timezone
from .models import Category, Experiment, LearningCard, ExperimentProgress
from apps.gamification.models import Badge, EarnedBadge
import random


def category_list(request):
    """
    Kategori listesi - Tüm bilim kategorileri.
    """
    categories = Category.objects.filter(is_active=True).order_by('order')

    # Her kategorinin deney sayısını ekle
    for cat in categories:
        cat.experiment_count = cat.experiments.filter(is_active=True).count()
        cat.card_count = LearningCard.objects.filter(experiment__category=cat).count()

    context = {
        'page_title': 'Keşfet',
        'categories': categories,
    }
    return render(request, 'experiments/category_list.html', context)


def category_detail(request, slug):
    """
    Kategori detay - O kategorideki deneyler ve öğrenme kartları.
    """
    category = get_object_or_404(Category, slug=slug, is_active=True)
    experiments = category.experiments.filter(is_active=True)

    # Bu kategorideki tüm öğrenme kartlarını çek
    learning_cards = LearningCard.objects.filter(
        experiment__category=category
    ).select_related('experiment').order_by('order')

    # Rastgele bir kart seç (görülmemiş olanlardan tercih et)
    all_cards = list(learning_cards)
    if all_cards:
        random_card = random.choice(all_cards)
    else:
        random_card = None

    context = {
        'page_title': category.name,
        'category': category,
        'experiments': experiments,
        'learning_cards': learning_cards,
        'random_card': random_card,
        'total_cards': learning_cards.count(),
    }
    return render(request, 'experiments/category_detail.html', context)


def experiment_detail(request, slug):
    """
    Deney detay sayfası - Açıklama ve başlat butonu.
    """
    experiment = get_object_or_404(Experiment, slug=slug, is_active=True)

    context = {
        'page_title': experiment.title,
        'experiment': experiment,
    }
    return render(request, 'experiments/experiment_detail.html', context)


@login_required
def start_experiment(request, slug):
    """
    Deney simülasyonu sayfası - Pixi.js canvas.
    """
    experiment = get_object_or_404(Experiment, slug=slug, is_active=True)

    # İlerleme kaydı oluştur veya al
    progress = None
    if hasattr(request.user, 'child_profile'):
        progress, created = ExperimentProgress.objects.get_or_create(
            child=request.user.child_profile,
            experiment=experiment,
            defaults={'status': 'in_progress', 'started_at': timezone.now()}
        )
        if not created and progress.status == 'not_started':
            progress.status = 'in_progress'
            progress.started_at = timezone.now()
            progress.save()

    context = {
        'page_title': experiment.title,
        'experiment': experiment,
        'progress': progress,
    }
    return render(request, 'experiments/experiment_play.html', context)


@login_required
def complete_experiment(request, slug):
    """
    Deney tamamlama (AJAX veya form POST).
    """
    experiment = get_object_or_404(Experiment, slug=slug)

    if not hasattr(request.user, 'child_profile'):
        if request.method == 'POST' and request.headers.get('X-Requested-With') == 'XMLHttpRequest':
            return JsonResponse({'error': 'Profil bulunamadı'}, status=400)
        return redirect('experiments:experiment_detail', slug=slug)

    child = request.user.child_profile

    # İlerleme kaydını güncelle
    progress, created = ExperimentProgress.objects.get_or_create(
        child=child,
        experiment=experiment
    )

    # Sadece ilk tamamlamada tam puan ver
    first_completion = progress.status != 'completed'
    points_earned = experiment.points if first_completion else experiment.points // 2

    progress.status = 'completed'
    progress.score = max(progress.score, experiment.points)
    progress.attempts += 1
    progress.completed_at = timezone.now()
    progress.save()

    # Yıldız tozu ekle
    if first_completion:
        child.star_dust = (child.star_dust or 0) + points_earned
        child.save()

    # Kazanılan rozetleri kontrol et
    new_badges = check_badges_earned(child, experiment)

    # AJAX isteği ise JSON döndür
    if request.method == 'POST' and request.headers.get('X-Requested-With') == 'XMLHttpRequest':
        return JsonResponse({
            'success': True,
            'points': points_earned,
            'total_star_dust': child.star_dust,
            'new_badges': [{'name': b.name, 'icon': b.icon} for b in new_badges],
            'message': 'Tebrikler! 🎉',
            'redirect_url': f'/deneyler/{slug}/rapor/',
        })

    # Normal istek ise rapor sayfasına yönlendir
    return redirect('experiments:experiment_report', slug=slug)


@login_required
def experiment_report(request, slug):
    """
    Deney sonu raporu - "Bugün neler öğrendin?" ekranı.
    """
    experiment = get_object_or_404(Experiment, slug=slug)

    # Kullanıcı kontrolü
    progress = None
    child = None
    recent_badges = []
    total_experiments_completed = 0

    if hasattr(request.user, 'child_profile'):
        child = request.user.child_profile

        # Bu deney için ilerleme
        try:
            progress = ExperimentProgress.objects.get(
                child=child,
                experiment=experiment
            )
        except ExperimentProgress.DoesNotExist:
            pass

        # Son kazanılan rozetler (son 1 dakika içinde)
        recent_time = timezone.now() - timezone.timedelta(minutes=1)
        recent_badges = EarnedBadge.objects.filter(
            child=child,
            earned_at__gte=recent_time
        ).select_related('badge')

        # Toplam tamamlanan deney sayısı
        total_experiments_completed = ExperimentProgress.objects.filter(
            child=child,
            status='completed'
        ).count()

    # Öğrenme hedefleri
    learning_objectives = experiment.learning_objectives_list

    # İlgili kartlar
    learning_cards = experiment.learning_cards.all()[:3]

    # Quiz soruları (basit öneri)
    quiz_questions = generate_simple_quiz(experiment)

    context = {
        'page_title': 'Deney Raporu',
        'experiment': experiment,
        'progress': progress,
        'child': child,
        'recent_badges': recent_badges,
        'total_experiments_completed': total_experiments_completed,
        'learning_objectives': learning_objectives,
        'learning_cards': learning_cards,
        'quiz_questions': quiz_questions,
    }
    return render(request, 'experiments/experiment_report.html', context)


def check_badges_earned(child, experiment):
    """
    Deney sonrası kazanılabilecek rozetleri kontrol et.
    """
    new_badges = []

    # Toplam tamamlanan deney sayısı
    completed_count = ExperimentProgress.objects.filter(
        child=child,
        status='completed'
    ).count()

    # İlk deney rozeti
    if completed_count == 1:
        badge = Badge.objects.filter(requirement_type='first_experiment').first()
        if badge:
            ub, created = EarnedBadge.objects.get_or_create(child=child, badge=badge)
            if created:
                new_badges.append(badge)

    # 5 deney rozeti
    if completed_count == 5:
        badge = Badge.objects.filter(requirement_type='experiments_completed', requirement_value=5).first()
        if badge:
            ub, created = EarnedBadge.objects.get_or_create(child=child, badge=badge)
            if created:
                new_badges.append(badge)

    # Kategori ustası (bir kategoride tüm deneyler)
    category = experiment.category
    category_experiments = category.experiments.filter(is_active=True).count()
    completed_in_category = ExperimentProgress.objects.filter(
        child=child,
        experiment__category=category,
        status='completed'
    ).count()

    if completed_in_category == category_experiments and category_experiments > 0:
        badge = Badge.objects.filter(
            requirement_type='category_master',
            requirement_category=category
        ).first()
        if badge:
            ub, created = EarnedBadge.objects.get_or_create(child=child, badge=badge)
            if created:
                new_badges.append(badge)

    return new_badges


def generate_simple_quiz(experiment):
    """
    Deney için basit quiz soruları oluştur.
    """
    questions = []

    # Deneyin öğrenme hedeflerinden soru oluştur
    objectives = experiment.learning_objectives_list

    if objectives:
        questions.append({
            'question': f'Bu deneyde ne öğrendin?',
            'type': 'open',
            'hint': objectives[0] if objectives else '',
        })

    # Kategori bazlı soru
    questions.append({
        'question': f'Bu deney hangi bilim alanıyla ilgiliydi?',
        'type': 'choice',
        'choices': [
            experiment.category.name,
            'Müzik',
            'Spor',
        ],
        'correct': experiment.category.name,
    })

    return questions


def learning_cards_view(request, slug):
    """
    Öğrenme kartları odaklı görünüm - 3D flip animasyonlu, sesli kartlar.
    """
    category = get_object_or_404(Category, slug=slug, is_active=True)

    # Tüm öğrenme kartlarını çek
    learning_cards = LearningCard.objects.filter(
        experiment__category=category
    ).select_related('experiment').order_by('order')

    # Kullanıcı profili varsa ilerleme bilgisi ekle
    card_progress = {}
    if hasattr(request.user, 'child_profile'):
        child = request.user.child_profile
        # Tamamlanan deneyler
        completed_experiments = ExperimentProgress.objects.filter(
            child=child,
            experiment__category=category,
            status='completed'
        ).values_list('experiment_id', flat=True)

        for card in learning_cards:
            card_progress[card.id] = card.experiment_id in completed_experiments

    context = {
        'page_title': f'{category.name} - Öğrenme Kartları',
        'category': category,
        'learning_cards': learning_cards,
        'card_progress': card_progress,
        'total_cards': learning_cards.count(),
    }
    return render(request, 'experiments/learning_cards.html', context)
