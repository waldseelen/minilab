# 🔊 MiniLab Ses Dosyaları Rehberi

Bu klasör, MiniLab projesinin ses efektleri ve eğitim kartları için kullanılacak ses dosyalarını içerir.

## 📁 Klasör Yapısı

```
static/sounds/
├── README.md (bu dosya)
├── effects/              # Ses efektleri
│   ├── click.mp3         # Buton tıklama sesi
│   ├── success.mp3       # Başarı sesi
│   ├── badge.mp3         # Rozet kazanma sesi
│   ├── confetti.mp3      # Konfeti sesi
│   ├── star.mp3          # Yıldız tozu kazanma
│   └── error.mp3         # Hata sesi
│
├── cards/                # Eğitim kartları için ses dosyaları
│   ├── physics/          # Fizik kartları
│   ├── chemistry/        # Kimya kartları
│   ├── biology/          # Biyoloji kartları
│   ├── astronomy/        # Astronomi kartları
│   ├── technology/       # Teknoloji kartları
│   ├── ai/               # Yapay Zeka kartları
│   ├── nature/           # Doğa kartları
│   ├── inventions/       # İcatlar kartları
│   ├── math/             # Matematik kartları
│   └── art/              # Sanat kartları
│
└── minibot/              # MiniBot karakteri sesleri
    ├── greeting.mp3      # Selamlama
    ├── encouragement.mp3 # Teşvik
    ├── question.mp3      # Soru sorma
    └── goodbye.mp3       # Veda
```

## 🎵 Ses Dosyası Özellikleri

### Format
- **Format:** MP3 (uyumluluk için)
- **Alternatif:** WebM, OGG (modern tarayıcılar için)
- **Bitrate:** 128kbps (yeterli kalite + küçük boyut)
- **Sample Rate:** 44.1kHz

### Süre
- **Efektler:** 0.5-2 saniye
- **Eğitim Kartları:** 5-15 saniye
- **MiniBot Sesleri:** 3-10 saniye

## 📝 Eğitim Kartları İçin Ses Üretimi

### Otomatik TTS Üretimi
Şu an için Web Speech API kullanılıyor (tarayıcı tabanlı TTS).

### Gelecek Geliştirmeler
```python
# Google TTS ile toplu ses dosyası üretimi
from gtts import gTTS
import os

def generate_card_audio(card):
    text = f"{card.title}. {card.front_content}"
    tts = gTTS(text=text, lang='tr', slow=False)

    category_folder = f"static/sounds/cards/{card.category.slug}/"
    os.makedirs(category_folder, exist_ok=True)

    filename = f"{category_folder}{card.slug}.mp3"
    tts.save(filename)

    # Veritabanında güncelle
    card.audio_file = filename
    card.save()
```

## 🎮 Kullanım Örnekleri

### JavaScript (Alpine.js)
```javascript
// Efekt çalma
Alpine.store('app').playSound('success');

// TTS (Web Speech API)
Alpine.store('app').speak('Tebrikler! Yeni rozet kazandın!');
```

### Django Template
```django
<button @click="Alpine.store('app').playSound('click')">
    Tıkla
</button>
```

## 📥 Ses Kaynakları

### Ücretsiz Ses Efektleri
- **Pixabay Sound Effects:** https://pixabay.com/sound-effects/
- **Freesound:** https://freesound.org/
- **Zapsplat:** https://www.zapsplat.com/
- **Mixkit:** https://mixkit.co/free-sound-effects/

### TTS Servisleri
- **Google Cloud Text-to-Speech:** https://cloud.google.com/text-to-speech
- **Amazon Polly:** https://aws.amazon.com/polly/
- **ElevenLabs (AI Voices):** https://elevenlabs.io/

## ⚠️ Lisans ve Telif Hakları

Tüm ses dosyaları:
- Ticari kullanım için lisanslı olmalı
- Attribution (atıf) gerekiyorsa README'de belirtilmeli
- Çocuklara uygun içerikte olmalı

## 🔧 Optimizasyon

### Dosya Boyutu Küçültme
```bash
# FFmpeg ile sıkıştırma
ffmpeg -i input.mp3 -b:a 128k -ar 44100 output.mp3
```

### Lazy Loading
```javascript
// Ses dosyalarını ihtiyaç anında yükle
const audio = new Audio('/static/sounds/effects/success.mp3');
audio.load(); // Preload
```

---

**Not:** Şu an için Web Speech API kullanılarak tarayıcı tabanlı TTS sistemi aktif.
Ses dosyaları üretimi Faz 7'de (Production hazırlığında) tamamlanacak.

*Son güncelleme: 26 Kasım 2025*
