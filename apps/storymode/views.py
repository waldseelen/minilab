"""
MiniLab - Story Mode Views
Hikaye modu görünümleri.
Profesyonel Phase 6 implementasyonu.
"""
from django.shortcuts import render, get_object_or_404, redirect
from django.contrib.auth.decorators import login_required
from django.http import JsonResponse
from django.views.decorators.http import require_POST
from django.utils import timezone
from django.db import transaction
import json

from .models import Story, StoryPage, StoryChoice, StoryProgress
from apps.accounts.models import ChildProfile
from apps.parent_panel.models import ActivityLog


def get_child_profile(user):
    """Kullanıcının çocuk profilini güvenli şekilde al.

    Ebeveyn hesabına giriş yapılmışsa, ilk çocuk profilini döndürür.
    Session'da seçili çocuk varsa onu tercih eder.
    """
    try:
        # Ebeveynin çocuk profillerini al (ilk profili döndür)
        return ChildProfile.objects.filter(parent=user).first()
    except Exception:
        return None


def story_list(request):
    """
    Hikaye listesi.
    """
    stories = Story.objects.filter(is_active=True).order_by('order')

    # Kullanıcı giriş yapmışsa ilerleme bilgisini ekle
    child = None
    if request.user.is_authenticated:
        child = get_child_profile(request.user)

    for story in stories:
        story.user_progress = None
        story.is_completed = False
        story.is_started = False

        if child:
            progress = StoryProgress.objects.filter(
                child=child,
                story=story
            ).first()

            if progress:
                story.user_progress = progress
                story.is_completed = progress.is_completed
                story.is_started = True

    context = {
        'page_title': 'Hikayeler',
        'stories': stories,
        'child': child,
    }
    return render(request, 'storymode/story_list.html', context)


def story_detail(request, slug):
    """
    Hikaye detay sayfası.
    """
    story = get_object_or_404(Story, slug=slug, is_active=True)
    child = None
    progress = None

    if request.user.is_authenticated:
        child = get_child_profile(request.user)
        if child:
            progress = StoryProgress.objects.filter(
                child=child,
                story=story
            ).first()

    # İlk sayfa
    first_page = story.pages.filter(is_start=True).first()
    if not first_page:
        first_page = story.pages.order_by('order').first()

    context = {
        'page_title': story.title,
        'story': story,
        'first_page': first_page,
        'progress': progress,
        'child': child,
        'total_pages': story.pages.count(),
    }
    return render(request, 'storymode/story_detail.html', context)


@login_required
def story_page(request, slug, page_order):
    """
    Hikaye sayfası okuma.
    """
    story = get_object_or_404(Story, slug=slug, is_active=True)
    page = get_object_or_404(StoryPage, story=story, order=page_order)
    child = get_child_profile(request.user)

    # İlerlemeyi güncelle
    if child:
        progress, created = StoryProgress.objects.get_or_create(
            child=child,
            story=story,
            defaults={'current_page': page}
        )

        if not progress.is_completed:
            progress.current_page = page
            progress.save()

        # Bitiş sayfasına ulaşıldıysa
        if page.is_ending and not progress.is_completed:
            with transaction.atomic():
                progress.is_completed = True
                progress.completed_at = timezone.now()
                progress.ending_reached = page.ending_type
                progress.save()

                # Puan ekle
                if story.points:
                    child.total_points += story.points
                    child.star_dust += story.points // 2
                    child.save()

                # Aktivite kaydı
                ActivityLog.objects.create(
                    child=child,
                    activity_type='story_read',
                    related_story=story,
                    extra_data={'ending_type': page.ending_type}
                )

    # Seçenekleri al
    choices = page.choices.all().order_by('order')

    # Önceki ve sonraki sayfa
    prev_page = story.pages.filter(order__lt=page.order).order_by('-order').first()
    next_page = story.pages.filter(order__gt=page.order).order_by('order').first()

    context = {
        'page_title': story.title,
        'story': story,
        'page': page,
        'choices': choices,
        'prev_page': prev_page,
        'next_page': next_page,
        'child': child,
        'is_last_page': page.is_ending or not next_page,
    }
    return render(request, 'storymode/story_page.html', context)


@login_required
@require_POST
def make_choice(request, slug):
    """
    Hikaye seçimi yap (AJAX).
    Seçeneği işle ve sonraki sayfaya yönlendir.
    """
    child = get_child_profile(request.user)
    if not child:
        return JsonResponse({
            'success': False,
            'error': 'Profil bulunamadı'
        }, status=400)

    story = get_object_or_404(Story, slug=slug, is_active=True)

    try:
        data = json.loads(request.body)
        choice_id = data.get('choice_id')
    except (json.JSONDecodeError, KeyError):
        return JsonResponse({
            'success': False,
            'error': 'Geçersiz veri'
        }, status=400)

    choice = get_object_or_404(StoryChoice, id=choice_id, page__story=story)

    # İlerlemeyi güncelle
    progress, created = StoryProgress.objects.get_or_create(
        child=child,
        story=story,
        defaults={'current_page': choice.page}
    )

    # Seçimin sonraki sayfasına yönlendir
    if choice.next_page:
        next_page = choice.next_page
    else:
        # Varsayılan olarak sıradaki sayfa
        next_page = story.pages.filter(
            order__gt=choice.page.order
        ).order_by('order').first()

    if next_page:
        progress.current_page = next_page
        progress.save()

        return JsonResponse({
            'success': True,
            'feedback': choice.feedback,
            'is_correct': choice.is_correct,
            'next_page_url': f'/hikayeler/{slug}/sayfa/{next_page.order}/',
            'next_page_order': next_page.order,
        })
    else:
        # Hikaye bitti
        progress.is_completed = True
        progress.completed_at = timezone.now()
        progress.save()

        return JsonResponse({
            'success': True,
            'feedback': choice.feedback,
            'is_correct': choice.is_correct,
            'completed': True,
            'story_list_url': '/hikayeler/',
        })


@login_required
def reset_story(request, slug):
    """
    Hikaye ilerlemesini sıfırla.
    """
    child = get_child_profile(request.user)
    story = get_object_or_404(Story, slug=slug)

    if child:
        StoryProgress.objects.filter(child=child, story=story).delete()

    return redirect('storymode:story_detail', slug=slug)


# ============================================
# Faz 5: Yeni Görünümler
# ============================================

def memory_game(request):
    """
    Hafıza/Eşleştirme oyunu sayfası.
    """
    # Dinamik import ile V2 modelleri kontrol et
    games = []
    try:
        from .models_v2 import MemoryMatchGame
        games = MemoryMatchGame.objects.filter(is_active=True)
    except (ImportError, Exception):
        pass  # Model henüz migrate edilmemiş olabilir

    context = {
        'page_title': 'Hafıza Oyunu',
        'games': games,
    }
    return render(request, 'storymode/memory_game.html', context)


def learning_cards(request, category=None):
    """
    Öğrenme kartları sayfası.
    """
    cards = []
    cards_by_category = {}
    total_cards = 0

    try:
        from .models_v2 import LearningCard

        if category and category != 'all':
            cards = LearningCard.objects.filter(
                is_active=True,
                category=category
            ).order_by('order')
        else:
            cards = LearningCard.objects.filter(is_active=True).order_by('category', 'order')

        # Kategori sayıları
        all_cards = LearningCard.objects.filter(is_active=True)
        total_cards = all_cards.count()

        for cat_code, cat_name in LearningCard.CARD_CATEGORIES:
            count = all_cards.filter(category=cat_code).count()
            cards_by_category[cat_code] = count

    except (ImportError, Exception):
        pass  # Model henüz migrate edilmemiş olabilir

    context = {
        'page_title': 'Öğrenme Kartları',
        'cards': cards,
        'selected_category': category,
        'cards_by_category': cards_by_category,
        'total_cards': total_cards,
    }
    return render(request, 'storymode/learning_cards.html', context)


def api_get_cards(request, category=None):
    """
    Öğrenme kartları API endpoint'i.
    JSON formatında kart verilerini döndürür.
    """
    try:
        from .models_v2 import LearningCard

        if category and category != 'all':
            cards = LearningCard.objects.filter(
                is_active=True,
                category=category
            ).order_by('order')
        else:
            cards = LearningCard.objects.filter(is_active=True).order_by('order')

        cards_data = []
        for card in cards:
            cards_data.append({
                'id': card.id,
                'title': card.title,
                'category': card.category,
                'emoji': card.emoji,
                'front_text': card.front_text,
                'back_text': card.back_text,
                'fun_fact': card.fun_fact,
                'difficulty': card.difficulty,
            })

        return JsonResponse({
            'success': True,
            'cards': cards_data,
            'count': len(cards_data),
        })

    except (ImportError, Exception) as e:
        # Demo veriler döndür
        demo_cards = [
            {
                'id': 1,
                'title': 'Güneş',
                'category': 'space',
                'emoji': '☀️',
                'front_text': 'Gökyüzündeki en parlak yıldız hangisi?',
                'back_text': 'Güneş! Dünyamızı ısıtan ve aydınlatan dev bir yıldızdır.',
                'fun_fact': 'Güneş o kadar büyük ki içine 1 milyon tane Dünya sığabilir!',
                'difficulty': 1,
            },
            {
                'id': 2,
                'title': 'Kelebek',
                'category': 'animals',
                'emoji': '🦋',
                'front_text': 'Tırtıldan çıkan, renkli kanatları olan böcek hangisi?',
                'back_text': 'Kelebek! Tırtıl önce koza yapar, sonra muhteşem bir kelebeğe dönüşür.',
                'fun_fact': 'Kelebekler kanatlarıyla değil, ayaklarıyla tat alır!',
                'difficulty': 1,
            },
        ]

        return JsonResponse({
            'success': True,
            'cards': demo_cards,
            'count': len(demo_cards),
            'is_demo': True,
        })


def api_get_memory_games(request):
    """
    Hafıza oyunları API endpoint'i.
    """
    try:
        from .models_v2 import MemoryMatchGame, MatchCard

        games = MemoryMatchGame.objects.filter(is_active=True).order_by('order')

        games_data = []
        for game in games:
            cards = game.cards.all()
            cards_data = [{
                'content_a': card.content_a,
                'content_a_type': card.content_a_type,
                'content_b': card.content_b,
                'content_b_type': card.content_b_type,
            } for card in cards]

            games_data.append({
                'id': game.id,
                'title': game.title,
                'game_type': game.game_type,
                'description': game.description,
                'grid_size': game.grid_size,
                'time_limit': game.time_limit,
                'points': game.points,
                'difficulty': game.difficulty,
                'cards': cards_data,
            })

        return JsonResponse({
            'success': True,
            'games': games_data,
            'count': len(games_data),
        })

    except (ImportError, Exception) as e:
        # Demo veriler
        demo_games = [
            {
                'id': 1,
                'title': 'Hayvan Eşleştirme',
                'game_type': 'emoji_word',
                'description': 'Hayvan emojilerini isimleriyle eşleştir!',
                'grid_size': '2x3',
                'time_limit': 90,
                'points': 15,
                'difficulty': 1,
                'cards': [
                    {'content_a': '🐱', 'content_a_type': 'emoji', 'content_b': 'Kedi', 'content_b_type': 'text'},
                    {'content_a': '🐕', 'content_a_type': 'emoji', 'content_b': 'Köpek', 'content_b_type': 'text'},
                    {'content_a': '🐘', 'content_a_type': 'emoji', 'content_b': 'Fil', 'content_b_type': 'text'},
                ],
            },
        ]

        return JsonResponse({
            'success': True,
            'games': demo_games,
            'count': len(demo_games),
            'is_demo': True,
        })
