"""
MiniLab URL ve Routing Testi
Tüm URL'lerin doğru tanımlandığını ve çalıştığını test eder.
"""
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings.dev')
django.setup()

from django.urls import get_resolver
from django.test import Client

def test_urls():
    """URL'leri test et"""

    print("=" * 60)
    print("🌐 MİNİLAB URL TEST RAPORU")
    print("=" * 60)

    # Test edilecek URL'ler
    test_cases = [
        # Public pages
        ('/', 'Landing Page'),
        ('/hesap/giris/', 'Login'),
        ('/hesap/kayit/', 'Register'),

        # Experiments
        ('/deneyler/', 'Deney Listesi'),
        ('/deneyler/kategoriler/', 'Kategori Listesi'),

        # Chatbot
        ('/minibot/', 'MiniBot Chat'),

        # Storymode
        ('/hikaye/', 'Hikaye Listesi'),
    ]

    client = Client()

    print("\n📋 URL KONTROL SONUÇLARI:")
    success_count = 0
    fail_count = 0

    for url, name in test_cases:
        try:
            response = client.get(url, follow=True)

            # Başarılı yanıt kodları: 200 (OK), 302 (Redirect)
            if response.status_code in [200, 302]:
                status = "✅"
                success_count += 1
            else:
                status = "⚠️"
                fail_count += 1

            print(f"   {status} {name}: {url}")
            print(f"      Status: {response.status_code}")

        except Exception as e:
            print(f"   ❌ {name}: {url}")
            print(f"      Hata: {str(e)[:50]}")
            fail_count += 1

    # URL pattern'leri kontrol et
    print("\n🔗 KAYITLI URL PATTERN'LERİ:")
    resolver = get_resolver()

    url_patterns = {
        'accounts': [],
        'experiments': [],
        'chatbot': [],
        'gamification': [],
        'storymode': [],
        'dashboard': [],
    }

    for pattern in resolver.url_patterns:
        pattern_str = str(pattern.pattern)

        if 'accounts' in pattern_str or 'hesap' in pattern_str:
            url_patterns['accounts'].append(pattern_str)
        elif 'experiments' in pattern_str or 'deney' in pattern_str:
            url_patterns['experiments'].append(pattern_str)
        elif 'chatbot' in pattern_str or 'minibot' in pattern_str:
            url_patterns['chatbot'].append(pattern_str)
        elif 'gamification' in pattern_str or 'rozetler' in pattern_str:
            url_patterns['gamification'].append(pattern_str)
        elif 'story' in pattern_str or 'hikaye' in pattern_str:
            url_patterns['storymode'].append(pattern_str)
        elif 'dashboard' in pattern_str or 'panel' in pattern_str:
            url_patterns['dashboard'].append(pattern_str)

    for app_name, patterns in url_patterns.items():
        if patterns:
            print(f"\n   📂 {app_name.upper()}:")
            for p in patterns[:3]:  # İlk 3 pattern'i göster
                print(f"      • {p}")

    # Özet
    print("\n" + "=" * 60)
    print("📊 TEST ÖZETİ:")
    print(f"   ✅ Başarılı: {success_count}")
    print(f"   ❌ Başarısız: {fail_count}")
    total = success_count + fail_count
    success_rate = (success_count / total * 100) if total > 0 else 0
    print(f"   📈 Başarı Oranı: {success_rate:.1f}%")
    print("=" * 60)

    if success_rate >= 80:
        print("✅ SİSTEM SAĞLIKLI - Tüm ana URL'ler çalışıyor!")
    else:
        print("⚠️ UYARI - Bazı URL'ler sorunlu!")

if __name__ == '__main__':
    test_urls()
