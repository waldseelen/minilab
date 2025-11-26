from django.core.management.base import BaseCommand
from apps.experiments.models import Category, Experiment

class Command(BaseCommand):
    help = 'Gezegen Yörünge Oyunu deneyini kurar'

    def handle(self, *args, **options):
        self.stdout.write('Gezegen Yörünge Oyunu kuruluyor...')

        try:
            category = Category.objects.get(slug='astronomi')
        except Category.DoesNotExist:
            self.stdout.write(self.style.ERROR('Astronomi kategorisi bulunamadı! Önce load_initial_content çalıştırın.'))
            return

        experiment, created = Experiment.objects.update_or_create(
            slug='gezegen-yorunge',
            defaults={
                'category': category,
                'title': 'Gezegen Yörünge Oyunu',
                'short_description': 'Kendi güneş sistemini kur!',
                'description': 'Güneşin etrafında dönen gezegenler oluştur. Bakalım birbirlerine çarpmadan dönebilecekler mi? Yerçekimini keşfet!',
                'experiment_type': 'simulation',
                'difficulty': 'medium',
                'pixi_script': 'orbit_game.js',
                'points': 25,
                'estimated_time': 5,
                'is_active': True,
                'learning_objectives': 'Gezegenlerin güneş etrafında döndüğünü öğrenir.\nYerçekimi kavramını tanır.\nYörünge hareketini gözlemler.',
                'order': 1
            }
        )

        if created:
            self.stdout.write(self.style.SUCCESS('Gezegen Yörünge Oyunu oluşturuldu!'))
        else:
            self.stdout.write(self.style.SUCCESS('Gezegen Yörünge Oyunu güncellendi!'))
