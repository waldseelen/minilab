"""
MiniLab - Story Mode Views
Hikaye modu görünümleri.
"""
from django.shortcuts import render, get_object_or_404
from django.contrib.auth.decorators import login_required
from django.http import JsonResponse
from .models import Story, StoryPage


def story_list(request):
    """
    Hikaye listesi.
    """
    stories = Story.objects.filter(is_active=True)
    context = {
        'page_title': 'Hikayeler',
        'stories': stories,
    }
    return render(request, 'storymode/story_list.html', context)


def story_detail(request, slug):
    """
    Hikaye detay sayfası.
    """
    story = get_object_or_404(Story, slug=slug, is_active=True)
    context = {
        'page_title': story.title,
        'story': story,
    }
    return render(request, 'storymode/story_detail.html', context)


@login_required
def story_page(request, slug, page_order):
    """
    Hikaye sayfası okuma.
    """
    story = get_object_or_404(Story, slug=slug, is_active=True)
    page = get_object_or_404(StoryPage, story=story, order=page_order)

    context = {
        'page_title': story.title,
        'story': story,
        'page': page,
    }
    return render(request, 'storymode/story_page.html', context)


@login_required
def make_choice(request, slug):
    """
    Hikaye seçimi yap (AJAX).
    """
    if request.method != 'POST':
        return JsonResponse({'error': 'Geçersiz istek'}, status=400)

    # TODO: Seçimi işle, sonraki sayfayı döndür

    return JsonResponse({
        'success': True,
        'next_page_url': '',
    })
