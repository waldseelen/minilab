"""
MiniLab - Gamification Views
Oyunlaştırma, rozetler ve mağaza görünümleri.
"""
from django.shortcuts import render, get_object_or_404
from django.contrib.auth.decorators import login_required
from django.http import JsonResponse
from .models import Badge, AvatarItem, SurpriseEgg, EarnedBadge, OwnedAvatarItem
import random


@login_required
def badges_view(request):
    """
    Rozet koleksiyonu sayfası.
    """
    badges = Badge.objects.filter(is_secret=False).order_by('order')

    # Kullanıcının kazandığı rozetleri al
    earned_badge_ids = []
    child = None
    if hasattr(request.user, 'child_profile'):
        child = request.user.child_profile
        earned_badge_ids = list(EarnedBadge.objects.filter(
            child=child
        ).values_list('badge_id', flat=True))

    # Her rozet için is_earned durumunu ekle
    for badge in badges:
        badge.is_earned = badge.id in earned_badge_ids

    context = {
        'page_title': 'Rozetlerim',
        'badges': badges,
        'earned_count': len(earned_badge_ids),
        'child': child,
    }
    return render(request, 'gamification/badges.html', context)


@login_required
def shop_view(request):
    """
    Avatar mağazası.
    """
    items = AvatarItem.objects.all().order_by('item_type', 'order')

    context = {
        'page_title': 'Mağaza',
        'items': items,
    }
    return render(request, 'gamification/shop.html', context)


@login_required
def purchase_item(request, item_id):
    """
    Öğe satın al (AJAX).
    """
    if request.method != 'POST':
        return JsonResponse({'error': 'Geçersiz istek'}, status=400)

    item = get_object_or_404(AvatarItem, id=item_id)

    # TODO: Yıldız tozu kontrolü ve satın alma işlemi

    return JsonResponse({
        'success': True,
        'message': f'{item.name} satın alındı! 🎉',
    })


@login_required
def customize_avatar(request):
    """
    Avatar özelleştirme sayfası.
    """
    context = {
        'page_title': 'Avatarım',
    }
    return render(request, 'gamification/customize_avatar.html', context)


@login_required
def surprise_egg(request):
    """
    Sürpriz Yumurta açma (AJAX).
    """
    if request.method != 'POST':
        # Sayfa göster
        context = {
            'page_title': 'Sürpriz Yumurta',
        }
        return render(request, 'gamification/surprise_egg.html', context)

    # Ödül seç (ağırlıklı rastgele)
    eggs = SurpriseEgg.objects.all()

    if not eggs.exists():
        return JsonResponse({
            'success': True,
            'reward_type': 'star_dust',
            'reward_name': 'Yıldız Tozu',
            'reward_amount': 10,
            'rarity': 'common',
        })

    # Ağırlıklı rastgele seçim
    weights = [egg.weight for egg in eggs]
    chosen_egg = random.choices(list(eggs), weights=weights, k=1)[0]

    return JsonResponse({
        'success': True,
        'reward_type': chosen_egg.reward_type,
        'reward_name': chosen_egg.name,
        'reward_amount': chosen_egg.star_dust_amount,
        'rarity': chosen_egg.rarity,
    })
