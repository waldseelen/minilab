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
        from apps.accounts.models import ChildProfile
        # Ebeveynin ilk çocuk profilini al
        child_profile = ChildProfile.objects.filter(parent=request.user).first()
        if child_profile:
            star_dust = child_profile.star_dust or 0

    return {
        'star_dust': star_dust,
    }
