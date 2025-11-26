"""
MiniLab - Context Processors
Tüm sayfalarda kullanılabilir global değişkenler.
"""


def star_dust_processor(request):
    """
    Her sayfada star_dust değerini kullanılabilir yapar.
    """
    star_dust = 0

    if request.user.is_authenticated:
        if hasattr(request.user, 'child_profile') and request.user.child_profile:
            star_dust = request.user.child_profile.star_dust or 0

    return {
        'star_dust': star_dust,
    }
