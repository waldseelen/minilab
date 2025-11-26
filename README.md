# 🧪 MiniLab

4-6 yaş arası çocuklar için tasarlanmış, interaktif deneyler, hikayeler ve oyunlaştırma öğeleri sunan bir bilim keşif platformu.

---

## 🚀 Özellikler

- 👨‍👩‍👧 **Hesap Sistemi**: Ebeveyn hesabı + birden fazla çocuk profili.
- 🧒 **Çocuk Profili**: Puan, rozetler, avatar özelleştirme, günlük giriş ödülleri.
- 🔬 **Deneyler (Experiments)**: Kategorilere ayrılmış deney kartları, simülasyonlar ve öğrenme kartları.
- 🏅 **Oyunlaştırma (Gamification)**: Rozetler, puanlar, sürpriz yumurta sistemi, avatar mağazası.
- 📖 **Hikaye Modu (Storymode)**: Seçilebilir yollarla ilerleyen etkileşimli hikayeler.
- 🤖 **MiniBot (Chatbot)**: Gemini tabanlı çocuk dostu asistan, deneylere ve kavramlara eşlik eden sohbet.
- 📊 **Dashboard**: Çocuk ilerlemesi, deney tamamlanma oranları vb. (planlandı).

---

## 🧩 Teknoloji Yığını

- **Backend**: Python, Django 5.2
- **Frontend**: Django Templates, Tailwind CSS, Alpine.js
- **Simülasyonlar**: Pixi.js (2D WebGL deneyler)
- **Yapay Zeka**: Google Gemini API (MiniBot)
- **Veritabanı**: SQLite (geliştirme), PostgreSQL (prod)
- **Ses**: Web Speech API, Howler.js

---

## 📂 Proje Yapısı (Özet)

```text
MINILAB/
├── config/           # Django proje ayarları (base/dev/prod)
├── apps/
│   ├── accounts/     # Kullanıcı ve çocuk profilleri
│   ├── dashboard/    # Ebeveyn ve çocuk panelleri
│   ├── experiments/  # Deneyler, kategoriler, kartlar
│   ├── gamification/ # Rozetler, avatar mağazası, ödüller
│   ├── storymode/    # Hikaye akışı ve seçimler
│   └── chatbot/      # MiniBot ve Gemini entegrasyonu
├── static/           # CSS, JS (alpine/pixi), img, sounds
├── templates/        # base.html, pages/, components/, app şablonları
├── media/            # Kullanıcı yüklemeleri
├── logs/             # Loglar
├── manage.py
├── requirements.txt
└── .env / .env.example
```

Detaylı teknik plan için `PROJECT_PLAN.md` dosyasına bakabilirsiniz.

---

## 🔧 Kurulum ve Çalıştırma

### 1. Ortamı Hazırlama

```powershell
cd c:\Users\HP\FILES\MINILAB

# (Opsiyonel) Sanal ortam oluşturma
python -m venv venv
.\nvenv\Scripts\Activate.ps1

# Bağımlılıkları yükle
pip install -r requirements.txt
```

### 2. Ortam Değişkenleri

Kök dizinde `.env` dosyası oluşturun veya `.env.example` üzerinden kopyalayın ve aşağıdaki gibi doldurun (örnek):

```env
DJANGO_SETTINGS_MODULE=config.settings.dev
SECRET_KEY=super-secret-key
DEBUG=True
GEMINI_API_KEY=your-gemini-api-key
DATABASE_URL=sqlite:///db.sqlite3
```

### 3. Veritabanı Migrasyonları

```powershell
$env:DJANGO_SETTINGS_MODULE="config.settings.dev"
python manage.py migrate
python manage.py createsuperuser  # admin hesabı oluşturmak için
```

### 4. Geliştirme Sunucusunu Başlatma

```powershell
$env:DJANGO_SETTINGS_MODULE="config.settings.dev"
python manage.py runserver
```

Uygulama varsayılan olarak `http://127.0.0.1:8000/` adresinde çalışacaktır.

### 5. Admin Paneli

- URL: `http://127.0.0.1:8000/admin/`
- Buradan kullanıcılar, deneyler ve oyunlaştırma öğeleri yönetilebilir.

---

## 🧱 Ana Modüller

- **`apps/accounts`**: Custom User, `ChildProfile`, günlük giriş (`DailyLogin`).
- **`apps/experiments`**: `Category`, `Experiment`, `LearningCard`, `ExperimentProgress`.
- **`apps/gamification`**: `Badge`, `EarnedBadge`, `AvatarItem`, `OwnedAvatarItem`, `SurpriseEgg`.
- **`apps/storymode`**: `Story`, `StoryPage`, `StoryChoice`, `StoryProgress`.
- **`apps/chatbot`**: `ChatSession`, `ChatMessage`, `MiniBotHint`, Gemini API entegrasyonu.

Model detayları için ilgili app içindeki `models.py` dosyalarına bakabilirsiniz.

---

## 🧪 Geliştirme Yol Haritası (Özet)

- **Faz 1**: Mimari, Custom User, kalite araçları, Docker altyapısı.
- **Faz 2**: Tasarım dili, `base.html`, Tailwind + Alpine, landing page.
- **Faz 3**: İlk Pixi.js deneyleri (ör. Renk Karıştırma), API uçları.
- **Faz 4**: MiniBot, Gemini entegrasyonu, sesli arayüz altyapısı.
- **Faz 5**: Mucit Atölyesi, devre tasarımı, yaratıcı kodlama modülleri.
- **Faz 6**: Oyunlaştırma ve hikaye modu.
- **Faz 7**: Ebeveyn paneli, raporlar, ekran süresi yönetimi.

Detaylı yapılacaklar ve durum için `PROJECT_PLAN.md` içindeki checklist’lere bakın.

---

## 🧪 Katkı ve Geliştirme

- Yeni bir özellik eklerken ilgili app altında view, template ve (varsa) Pixi/Alpine komponentini birlikte tasarlayın.
- Güvenli çocuk deneyimi için içerik ve prompt tasarımında yaş grubunu (4-6) dikkate alın.
- Her yeni özelliğin ardından en az temel testleri ve `python manage.py check` komutunu çalıştırın.

Pull request / issue kuralları ileride bu dosyada ayrıntılandırılabilir.

---

## 📜 Lisans

Lisans bilgisi henüz eklenmedi. Proje açık kaynak yapılacaksa uygun bir lisans (`MIT`, `Apache-2.0` vb.) seçilip bu kısım güncellenmelidir.
