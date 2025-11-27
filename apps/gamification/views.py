"""
MiniLab - Gamification Views
Oyunlaştırma, rozetler ve mağaza görünümleri.
Profesyonel Phase 6 implementasyonu.
"""
from django.shortcuts import render, get_object_or_404
from django.contrib.auth.decorators import login_required
from django.http import JsonResponse
from django.db import transaction
from django.views.decorators.http import require_POST
from django.utils import timezone
from datetime import date
import random
import json

from .models import Badge, AvatarItem, SurpriseEgg, EarnedBadge, OwnedAvatarItem
from apps.accounts.models import ChildProfile, DailyLogin


def get_child_profile(user, request=None):
    """Kullanıcının çocuk profilini güvenli şekilde al.

    Ebeveyn hesabına giriş yapılmışsa, ilk çocuk profilini döndürür.
    Session'da seçili çocuk varsa onu tercih eder.
    """
    try:
        # Session'da seçili çocuk var mı?
        if request and 'selected_child_id' in request.session:
            child = ChildProfile.objects.filter(
                id=request.session['selected_child_id'],
                parent=user
            ).first()
            if child:
                return child

        # Ebeveynin çocuk profillerini al (ilk profili döndür)
        return ChildProfile.objects.filter(parent=user).first()
    except Exception:
        return None


@login_required
def badges_view(request):
    """
    Rozet koleksiyonu sayfası.
    Kazanılmış ve kilitli rozetleri gösterir.
    """
    badges = Badge.objects.filter(is_secret=False).order_by('badge_type', 'order')
    child = get_child_profile(request.user, request)

    # Kullanıcının kazandığı rozetleri al
    earned_badge_ids = []
    if child:
        earned_badge_ids = list(EarnedBadge.objects.filter(
            child=child
        ).values_list('badge_id', flat=True))

    # Her rozet için is_earned durumunu ekle
    for badge in badges:
        badge.is_earned = badge.id in earned_badge_ids

    # Kategorilere göre grupla
    badge_groups = {}
    for badge in badges:
        badge_type = badge.badge_type
        if badge_type not in badge_groups:
            badge_groups[badge_type] = {
                'name': badge.get_badge_type_display(),
                'badges': []
            }
        badge_groups[badge_type]['badges'].append(badge)

    context = {
        'page_title': 'Rozetlerim',
        'badges': badges,
        'badge_groups': badge_groups,
        'earned_count': len(earned_badge_ids),
        'total_count': badges.count(),
        'child': child,
        'star_dust': child.star_dust if child else 0,
    }
    return render(request, 'gamification/badges.html', context)


@login_required
def shop_view(request):
    """
    Avatar mağazası - Dinamik ürün listesi ve satın alma.
    """
    child = get_child_profile(request.user, request)
    star_dust = child.star_dust if child else 0

    # Tüm ürünleri kategorize et
    items = AvatarItem.objects.all().order_by('item_type', 'order')

    # Sahip olunan ürünlerin ID'lerini al
    owned_item_ids = []
    if child:
        owned_item_ids = list(OwnedAvatarItem.objects.filter(
            child=child
        ).values_list('item_id', flat=True))

    # Ürünleri JSON formatına dönüştür
    items_data = []
    for item in items:
        items_data.append({
            'id': item.id,
            'name': item.name,
            'icon': item.icon if hasattr(item, 'icon') else '🎁',
            'price': item.price,
            'category': item.item_type,
            'rarity': item.rarity if hasattr(item, 'rarity') else 'common',
            'owned': item.id in owned_item_ids,
            'is_free': item.is_free,
            'is_default': item.is_default,
        })

    context = {
        'page_title': 'Avatar Mağazası',
        'items': items,
        'items_json': json.dumps(items_data),
        'star_dust': star_dust,
        'owned_count': len(owned_item_ids),
        'child': child,
    }
    return render(request, 'gamification/shop.html', context)


@login_required
@require_POST
def purchase_item(request, item_id):
    """
    Öğe satın al (AJAX).
    Yıldız tozu kontrolü ve veritabanı kaydı.
    """
    child = get_child_profile(request.user, request)
    if not child:
        return JsonResponse({
            'success': False,
            'error': 'Çocuk profili bulunamadı.'
        }, status=400)

    item = get_object_or_404(AvatarItem, id=item_id)

    # Zaten sahip mi kontrol et
    if OwnedAvatarItem.objects.filter(child=child, item=item).exists():
        return JsonResponse({
            'success': False,
            'error': 'Bu ürüne zaten sahipsin!',
            'already_owned': True
        })

    # Yıldız tozu kontrolü
    if not item.is_free and child.star_dust < item.price:
        return JsonResponse({
            'success': False,
            'error': 'Yeterli yıldız tozun yok!',
            'required': item.price,
            'current': child.star_dust
        })

    # Rozet gereksinimi kontrolü
    if item.required_badge:
        has_badge = EarnedBadge.objects.filter(
            child=child,
            badge=item.required_badge
        ).exists()
        if not has_badge:
            return JsonResponse({
                'success': False,
                'error': f'Bu ürün için "{item.required_badge.name}" rozeti gerekli!',
                'required_badge': item.required_badge.name
            })

    # Satın alma işlemi (transaction ile)
    with transaction.atomic():
        # Yıldız tozu düş
        if not item.is_free:
            child.star_dust -= item.price
            child.save()

        # Ürünü ekle
        OwnedAvatarItem.objects.create(
            child=child,
            item=item,
            is_equipped=False
        )

    return JsonResponse({
        'success': True,
        'message': f'{item.name} satın alındı! 🎉',
        'item_name': item.name,
        'new_balance': child.star_dust,
        'item_id': item.id
    })


@login_required
def customize_avatar(request):
    """
    Avatar özelleştirme sayfası.
    Sahip olunan öğeleri göster ve kuşandır.
    """
    child = get_child_profile(request.user, request)

    if not child:
        context = {
            'page_title': 'Avatarım',
            'error': 'Çocuk profili bulunamadı'
        }
        return render(request, 'gamification/customize_avatar.html', context)

    # Sahip olunan ürünleri kategoriye göre grupla
    owned_items = OwnedAvatarItem.objects.filter(child=child).select_related('item')

    items_by_type = {
        'body': [],
        'accessory': [],
        'background': [],
        'pet': [],
    }

    equipped_items = {}

    for owned in owned_items:
        item = owned.item
        item_data = {
            'id': item.id,
            'name': item.name,
            'icon': item.icon if hasattr(item, 'icon') else '🎁',
            'image': item.image.url if item.image else None,
            'is_equipped': owned.is_equipped,
            'owned_id': owned.id,
        }
        items_by_type[item.item_type].append(item_data)

        if owned.is_equipped:
            equipped_items[item.item_type] = item_data

    # Varsayılan ürünleri de ekle
    default_items = AvatarItem.objects.filter(is_default=True)
    for item in default_items:
        item_data = {
            'id': item.id,
            'name': item.name,
            'icon': item.icon if hasattr(item, 'icon') else '🎁',
            'image': item.image.url if item.image else None,
            'is_equipped': False,
            'is_default': True,
        }
        if item_data not in items_by_type[item.item_type]:
            items_by_type[item.item_type].append(item_data)

    context = {
        'page_title': 'Avatarım',
        'child': child,
        'items_by_type': items_by_type,
        'items_json': json.dumps(items_by_type),
        'equipped_items': equipped_items,
        'equipped_json': json.dumps(equipped_items),
        'avatar_body': child.avatar_body,
        'avatar_color': child.avatar_color,
        'avatar_accessory': child.avatar_accessory,
        'star_dust': child.star_dust,
    }
    return render(request, 'gamification/customize_avatar.html', context)


@login_required
@require_POST
def equip_item(request):
    """
    Öğe kuşan/çıkar (AJAX).
    """
    child = get_child_profile(request.user, request)
    if not child:
        return JsonResponse({'success': False, 'error': 'Profil bulunamadı'}, status=400)

    try:
        data = json.loads(request.body)
        item_id = data.get('item_id')
        equip = data.get('equip', True)
    except (json.JSONDecodeError, KeyError):
        return JsonResponse({'success': False, 'error': 'Geçersiz veri'}, status=400)

    item = get_object_or_404(AvatarItem, id=item_id)

    # Sahiplik kontrolü (varsayılan öğeler hariç)
    owned = OwnedAvatarItem.objects.filter(child=child, item=item).first()
    if not owned and not item.is_default:
        return JsonResponse({'success': False, 'error': 'Bu öğeye sahip değilsin'})

    with transaction.atomic():
        # Aynı kategorideki diğer öğeleri çıkar
        if equip:
            OwnedAvatarItem.objects.filter(
                child=child,
                item__item_type=item.item_type
            ).update(is_equipped=False)

        # Bu öğeyi kuşan/çıkar
        if owned:
            owned.is_equipped = equip
            owned.save()
        elif item.is_default and equip:
            # Varsayılan öğe için kayıt oluştur
            OwnedAvatarItem.objects.create(
                child=child,
                item=item,
                is_equipped=True
            )

    return JsonResponse({
        'success': True,
        'message': f'{item.name} {"kuşanıldı" if equip else "çıkarıldı"}!',
        'equipped': equip
    })


@login_required
@require_POST
def save_avatar(request):
    """
    Avatar ayarlarını kaydet (AJAX).
    """
    child = get_child_profile(request.user, request)
    if not child:
        return JsonResponse({'success': False, 'error': 'Profil bulunamadı'}, status=400)

    try:
        data = json.loads(request.body)
        avatar_body = data.get('avatar_body', child.avatar_body)
        avatar_color = data.get('avatar_color', child.avatar_color)
        avatar_accessory = data.get('avatar_accessory', child.avatar_accessory)
    except (json.JSONDecodeError, KeyError):
        return JsonResponse({'success': False, 'error': 'Geçersiz veri'}, status=400)

    child.avatar_body = avatar_body
    child.avatar_color = avatar_color
    child.avatar_accessory = avatar_accessory
    child.save()

    return JsonResponse({
        'success': True,
        'message': 'Avatar kaydedildi! 🎉'
    })


@login_required
def surprise_egg(request):
    """
    Sürpriz Yumurta açma (AJAX).
    Günlük ödül sistemi.
    """
    child = get_child_profile(request.user, request)

    if request.method != 'POST':
        # Bugün açılmış mı kontrol et
        already_opened = False
        if child:
            already_opened = DailyLogin.objects.filter(
                child=child,
                login_date=date.today(),
                reward_claimed=True
            ).exists()

        context = {
            'page_title': 'Sürpriz Yumurta',
            'already_opened': already_opened,
            'child': child,
            'star_dust': child.star_dust if child else 0,
        }
        return render(request, 'gamification/surprise_egg.html', context)

    # POST - Yumurta aç
    if not child:
        return JsonResponse({
            'success': False,
            'error': 'Çocuk profili bulunamadı'
        }, status=400)

    # Bugün zaten açmış mı?
    daily_login, created = DailyLogin.objects.get_or_create(
        child=child,
        login_date=date.today(),
        defaults={'reward_claimed': False}
    )

    if daily_login.reward_claimed:
        return JsonResponse({
            'success': False,
            'error': 'Bugünkü sürpriz yumurtanı zaten açtın! Yarın tekrar gel.',
            'already_claimed': True
        })

    # Ödül seç (ağırlıklı rastgele)
    eggs = SurpriseEgg.objects.all()

    if not eggs.exists():
        # Varsayılan ödül
        reward_type = 'star_dust'
        reward_name = 'Yıldız Tozu'
        reward_amount = random.choice([5, 10, 15, 20])
        rarity = 'common'
        reward_item = None
    else:
        # Ağırlıklı rastgele seçim
        weights = [egg.weight for egg in eggs]
        chosen_egg = random.choices(list(eggs), weights=weights, k=1)[0]

        reward_type = chosen_egg.reward_type
        reward_name = chosen_egg.name
        reward_amount = chosen_egg.star_dust_amount
        rarity = chosen_egg.rarity
        reward_item = chosen_egg.avatar_item

    # Ödülü ver
    with transaction.atomic():
        if reward_type == 'star_dust':
            child.star_dust += reward_amount
            child.save()
        elif reward_type == 'avatar_item' and reward_item:
            # Avatar öğesi ver (zaten yoksa)
            OwnedAvatarItem.objects.get_or_create(
                child=child,
                item=reward_item,
                defaults={'is_equipped': False}
            )
            reward_name = reward_item.name
        elif reward_type == 'badge':
            # Rozet ver (eğer tanımlıysa)
            if hasattr(chosen_egg, 'badge') and chosen_egg.badge:
                EarnedBadge.objects.get_or_create(
                    child=child,
                    badge=chosen_egg.badge,
                    defaults={'is_new': True}
                )
                reward_name = chosen_egg.badge.name

        # Günlük giriş kaydını güncelle
        daily_login.reward_claimed = True
        daily_login.reward_type = reward_type
        daily_login.reward_amount = reward_amount
        daily_login.save()

    return JsonResponse({
        'success': True,
        'reward_type': reward_type,
        'reward_name': reward_name,
        'reward_amount': reward_amount,
        'rarity': rarity,
        'new_balance': child.star_dust,
    })


@login_required
def api_badges_check(request):
    """
    Rozet kazanma kontrolü API'si.
    Aktivite sonrası otomatik rozet kontrolü için kullanılır.
    """
    child = get_child_profile(request.user, request)
    if not child:
        return JsonResponse({'success': False, 'error': 'Profil bulunamadı'})

    new_badges = []

    # Tüm kazanılmamış rozetleri kontrol et
    earned_ids = EarnedBadge.objects.filter(child=child).values_list('badge_id', flat=True)
    unearned_badges = Badge.objects.exclude(id__in=earned_ids)

    for badge in unearned_badges:
        if badge.check_requirement(child):
            # Rozet kazanıldı!
            EarnedBadge.objects.create(
                child=child,
                badge=badge,
                is_new=True
            )

            # Puan ekle
            if badge.points_reward:
                child.star_dust += badge.points_reward
                child.save()

            new_badges.append({
                'id': badge.id,
                'name': badge.name,
                'icon': badge.icon,
                'rarity': badge.rarity,
                'points': badge.points_reward,
            })

    return JsonResponse({
        'success': True,
        'new_badges': new_badges,
        'count': len(new_badges)
    })
