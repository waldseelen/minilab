#!/usr/bin/env python
"""
MiniLab - Rozet Yükleme Script'i
Temel rozetleri veritabanına yükler.
"""
import os
import sys
import django

# Django setup
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings.dev')
django.setup()

from apps.gamification.models import Badge

# Temel rozetler
BADGES = [
    # İlk adımlar
    {
        'name': 'Genç Bilim İnsanı',
        'slug': 'genc-bilim-insani',
        'description': 'İlk deneyini tamamla!',
        'badge_type': 'achievement',
        'icon': '🔬',
        'rarity': 'common',
        'requirement_type': 'first_experiment',
        'requirement_value': 1,
        'points_reward': 50,
        'order': 1,
    },
    {
        'name': 'Meraklı Kaşif',
        'slug': 'merakli-kasif',
        'description': '5 deney tamamla!',
        'badge_type': 'achievement',
        'icon': '🧭',
        'rarity': 'common',
        'requirement_type': 'experiments_completed',
        'requirement_value': 5,
        'points_reward': 100,
        'order': 2,
    },
    {
        'name': 'Deney Ustası',
        'slug': 'deney-ustasi',
        'description': '10 deney tamamla!',
        'badge_type': 'achievement',
        'icon': '🏆',
        'rarity': 'rare',
        'requirement_type': 'experiments_completed',
        'requirement_value': 10,
        'points_reward': 200,
        'order': 3,
    },
    # Seri rozetleri
    {
        'name': 'Düzenli Öğrenci',
        'slug': 'duzenli-ogrenci',
        'description': '3 gün üst üste giriş yap!',
        'badge_type': 'streak',
        'icon': '📅',
        'rarity': 'common',
        'requirement_type': 'streak_days',
        'requirement_value': 3,
        'points_reward': 75,
        'order': 10,
    },
    {
        'name': 'Haftalık Şampiyon',
        'slug': 'haftalik-sampiyon',
        'description': '7 gün üst üste giriş yap!',
        'badge_type': 'streak',
        'icon': '🔥',
        'rarity': 'rare',
        'requirement_type': 'streak_days',
        'requirement_value': 7,
        'points_reward': 150,
        'order': 11,
    },
    # Kategori rozetleri
    {
        'name': 'Küçük Fizikçi',
        'slug': 'kucuk-fizikci',
        'description': 'Fizik kategorisindeki tüm deneyleri tamamla!',
        'badge_type': 'category',
        'icon': '⚡',
        'rarity': 'epic',
        'requirement_type': 'category_master',
        'requirement_value': 1,
        'points_reward': 300,
        'order': 20,
    },
    {
        'name': 'Süper Kimyager',
        'slug': 'super-kimyager',
        'description': 'Kimya kategorisindeki tüm deneyleri tamamla!',
        'badge_type': 'category',
        'icon': '🧪',
        'rarity': 'epic',
        'requirement_type': 'category_master',
        'requirement_value': 1,
        'points_reward': 300,
        'order': 21,
    },
    {
        'name': 'Uzay Kaşifi',
        'slug': 'uzay-kasifi',
        'description': 'Astronomi kategorisindeki tüm deneyleri tamamla!',
        'badge_type': 'category',
        'icon': '🚀',
        'rarity': 'epic',
        'requirement_type': 'category_master',
        'requirement_value': 1,
        'points_reward': 300,
        'order': 22,
    },
    {
        'name': 'Doğa Dostu',
        'slug': 'doga-dostu',
        'description': 'Biyoloji kategorisindeki tüm deneyleri tamamla!',
        'badge_type': 'category',
        'icon': '🌿',
        'rarity': 'epic',
        'requirement_type': 'category_master',
        'requirement_value': 1,
        'points_reward': 300,
        'order': 23,
    },
    {
        'name': 'Teknoloji Dehası',
        'slug': 'teknoloji-dehasi',
        'description': 'Teknoloji kategorisindeki tüm deneyleri tamamla!',
        'badge_type': 'category',
        'icon': '💻',
        'rarity': 'epic',
        'requirement_type': 'category_master',
        'requirement_value': 1,
        'points_reward': 300,
        'order': 24,
    },
    # Özel rozetler
    {
        'name': 'Bilim Ustası',
        'slug': 'bilim-ustasi',
        'description': 'Tüm kategorilerdeki deneyleri tamamla!',
        'badge_type': 'special',
        'icon': '👑',
        'rarity': 'legendary',
        'requirement_type': 'all_categories',
        'requirement_value': 1,
        'points_reward': 1000,
        'order': 100,
    },
    {
        'name': 'Renk Sanatçısı',
        'slug': 'renk-sanatcisi',
        'description': 'Renk karıştırma deneyini tamamla!',
        'badge_type': 'achievement',
        'icon': '🎨',
        'rarity': 'common',
        'requirement_type': 'specific_experiment',
        'requirement_value': 1,
        'points_reward': 50,
        'order': 5,
    },
    {
        'name': 'Gezegen Avcısı',
        'slug': 'gezegen-avcisi',
        'description': 'Yörünge oyununda 5 gezegen oluştur!',
        'badge_type': 'achievement',
        'icon': '🪐',
        'rarity': 'rare',
        'requirement_type': 'specific_experiment',
        'requirement_value': 1,
        'points_reward': 100,
        'order': 6,
    },
    {
        'name': 'Yeşil Parmak',
        'slug': 'yesil-parmak',
        'description': 'Bitki büyütme deneyinde çiçek aç!',
        'badge_type': 'achievement',
        'icon': '🌸',
        'rarity': 'common',
        'requirement_type': 'specific_experiment',
        'requirement_value': 1,
        'points_reward': 75,
        'order': 7,
    },
]


def main():
    print("🎖️ MiniLab - Rozet Yükleme")
    print("=" * 50)

    created_count = 0
    updated_count = 0

    for badge_data in BADGES:
        badge, created = Badge.objects.update_or_create(
            slug=badge_data['slug'],
            defaults=badge_data
        )

        if created:
            created_count += 1
            print(f"  ✅ {badge.icon} {badge.name} oluşturuldu")
        else:
            updated_count += 1
            print(f"  🔄 {badge.icon} {badge.name} güncellendi")

    print("=" * 50)
    print(f"Toplam: {created_count} yeni, {updated_count} güncellendi")
    print(f"Veritabanında {Badge.objects.count()} rozet var")


if __name__ == '__main__':
    main()
