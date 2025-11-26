from django.core.management.base import BaseCommand
from apps.experiments.models import Category, Experiment

class Command(BaseCommand):
    help = 'Renk Laboratuvarı deneyini kurar'

    def handle(self, *args, **options):
        self.stdout.write('Renk Laboratuvarı kuruluyor...')

        try:
            category = Category.objects.get(slug='sanat-muzik')
        except Category.DoesNotExist:
            self.stdout.write(self.style.ERROR('Sanat & Müzik kategorisi bulunamadı! Önce load_initial_content çalıştırın.'))
            return

        experiment, created = Experiment.objects.update_or_create(
            slug='renk-laboratuvari',
            defaults={
                'category': category,
                'title': 'Renk Laboratuvarı',
                'short_description': 'Renkleri karıştır ve yeni renkler keşfet!',
                'description': 'Kırmızı, Mavi ve Sarı ana renklerdir. Bakalım onları karıştırınca hangi renkler ortaya çıkacak? Kendi laboratuvarında deney yap ve gör!',
                'experiment_type': 'simulation',
                'difficulty': 'easy',
                'pixi_script': 'color_lab.js',
                'points': 20,
                'estimated_time': 5,
                'is_active': True,
                'learning_objectives': 'Ana renkleri öğrenir.\nAra renklerin nasıl oluştuğunu keşfeder.\nDeney yapma becerisi kazanır.',
                'order': 1
            }
        )

        if created:
            self.stdout.write(self.style.SUCCESS('Renk Laboratuvarı oluşturuldu!'))
        else:
            self.stdout.write(self.style.SUCCESS('Renk Laboratuvarı güncellendi!'))
