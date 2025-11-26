"""
Django Management Command: Ses Dosyalarını Otomatik Üret
Tüm öğrenme kartları için TTS ses dosyaları oluşturur.

Kullanım:
    python manage.py generate_audio_files

Gereksinimler:
    pip install gTTS pydub
"""

from django.core.management.base import BaseCommand
from apps.experiments.models import LearningCard
from gtts import gTTS
import os
from pathlib import Path


class Command(BaseCommand):
    help = 'Tüm öğrenme kartları için ses dosyaları üretir'

    def add_arguments(self, parser):
        parser.add_argument(
            '--category',
            type=str,
            help='Sadece belirli bir kategori için ses üret (slug)',
        )
        parser.add_argument(
            '--overwrite',
            action='store_true',
            help='Mevcut ses dosyalarının üzerine yaz',
        )

    def handle(self, *args, **options):
        category_slug = options.get('category')
        overwrite = options.get('overwrite')

        # Kartları filtrele
        cards = LearningCard.objects.all()
        if category_slug:
            cards = cards.filter(category__slug=category_slug)

        total = cards.count()
        self.stdout.write(f"🎵 {total} kart için ses dosyası üretiliyor...")

        success_count = 0
        error_count = 0

        for i, card in enumerate(cards, 1):
            try:
                # Klasör oluştur
                category_folder = Path('static/sounds/cards') / card.category.slug
                category_folder.mkdir(parents=True, exist_ok=True)

                # Dosya yolu
                filename = category_folder / f"{card.slug}.mp3"

                # Mevcut dosya kontrolü
                if filename.exists() and not overwrite:
                    self.stdout.write(f"  ⏭️  [{i}/{total}] Zaten var: {card.title}")
                    continue

                # TTS ile ses üret
                text = f"{card.title}. {card.front_content}"
                tts = gTTS(text=text, lang='tr', slow=False)
                tts.save(str(filename))

                # Veritabanında güncelle
                card.audio_file = str(filename)
                card.save(update_fields=['audio_file'])

                success_count += 1
                self.stdout.write(
                    self.style.SUCCESS(f"  ✅ [{i}/{total}] {card.title}")
                )

            except Exception as e:
                error_count += 1
                self.stdout.write(
                    self.style.ERROR(f"  ❌ [{i}/{total}] {card.title}: {str(e)}")
                )

        # Özet
        self.stdout.write(self.style.SUCCESS(f"\n🎉 Tamamlandı!"))
        self.stdout.write(f"  ✅ Başarılı: {success_count}")
        self.stdout.write(f"  ❌ Hatalı: {error_count}")
        self.stdout.write(f"  📁 Konum: static/sounds/cards/")
