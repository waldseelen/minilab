# 🧪 MiniLab - Master Geliştirme Planı

Bu döküman, 4-6 yaş arası çocuklar için geliştirilecek interaktif bilim platformu **MiniLab**'ın teknik mimarisini, dosya yapısını ve gelişim sürecini kapsar.

---

## 1. 🛠️ Teknoloji Yığını (Tech Stack)

| Katman | Teknoloji | Kullanım Amacı |
|--------|-----------|----------------|
| **Backend** | Python & Django 5.2 | Güvenlik, Veri Yönetimi, Admin Paneli |
| **Frontend (UI)** | Django Templates + Tailwind CSS | Hızlı ve Esnek Stil |
| **Frontend (Logic)** | Alpine.js | Hafif interaktivite, SPA hissi veren geçişler |
| **Simülasyon/Oyun** | Pixi.js | Yüksek performanslı 2D WebGL render |
| **AI** | Google Gemini API | MiniBot Karakteri |
| **Veritabanı** | PostgreSQL (Prod) / SQLite (Dev) | Veri depolama |
| **Ses** | Web Speech API & Howler.js | Ses efektleri ve TTS |

---

## 2. 📂 Proje Klasör Yapısı

```
MINILAB/
├── config/                     # Django proje ayarları
│   ├── settings/
│   │   ├── __init__.py         # Varsayılan dev ayarlarını yükler
│   │   ├── base.py             # Ortak ayarlar
│   │   ├── dev.py              # Geliştirme ortamı (Debug=True)
│   │   └── prod.py             # Canlı ortam ayarları
│   ├── urls.py                 # Ana URL yapılandırması
│   └── wsgi.py
│
├── apps/                       # BÜTÜN UYGULAMALAR BURADA
│   ├── __init__.py
│   ├── accounts/               # Kullanıcı yönetimi (Custom User Model)
│   ├── dashboard/              # Ebeveyn ve Çocuk Panelleri
│   ├── experiments/            # Deneyler, Kartlar ve Kategoriler
│   ├── gamification/           # Rozetler, Puanlar, Avatar Mağazası
│   ├── storymode/              # Hikaye modu mantığı
│   └── chatbot/                # MiniBot ve Gemini entegrasyonu
│
├── static/                     # CSS, JS, Resimler
│   ├── css/
│   ├── js/
│   │   ├── alpine/             # Alpine.js componentleri
│   │   └── pixi/               # Simülasyon kodları (her deney ayrı dosya)
│   ├── img/
│   └── sounds/
│
├── templates/                  # HTML Dosyaları
│   ├── base.html               # Ana şablon
│   ├── components/             # Tekrar eden parçalar
│   ├── pages/                  # Landing page vb.
│   ├── accounts/
│   ├── dashboard/
│   ├── experiments/
│   ├── storymode/
│   ├── chatbot/
│   └── gamification/
│
├── media/                      # Kullanıcı yüklemeleri
├── logs/                       # Log dosyaları
├── venv/                       # Virtual environment
├── manage.py
├── requirements.txt
├── .env                        # Çevre değişkenleri
├── .env.example
└── .gitignore
```

---

## 3. 📊 Veri Modelleri
!!!!! EN ÖNEMLİ KISIM !!!!!
### Accounts (Kullanıcı Yönetimi)
- **User** - Ebeveyn hesabı (AbstractUser tabanlı)
- **ChildProfile** - Çocuk profili (puan, avatar, tercihler)
- **DailyLogin** - Günlük giriş takibi (Sürpriz Yumurta)

### 📋 MiniLab - Kategori Bazlı İçerik Üretim Özetleri(Daha fazla bilgi icin C:\Users\HP\FILES\MINILAB\Cards.md )

Bu dosya, MiniLab projesinin üretim planlamasında (production plan) kullanılmak üzere; her bir kategorinin içerik kapsamını, hedeflenen kazanımları ve üretim sırasında dikkat edilmesi gereken pedagojik tonu özetler.

1. FİZİK (Hareket ve Güçler)

İçerik Kapsamı: Yerçekimi, sürtünme kuvveti, mıknatıslar, ışık-gölge oyunları, denge ve yansıma gibi temel fiziksel olaylar.

Nasıl Olacak (Yaklaşım): Soyut formüller yerine, çocuğun günlük hayatta karşılaştığı (zıplamak, kaymak, aynaya bakmak gibi) eylemler üzerinden "sebep-sonuç" ilişkisi kurulacak.

Üretim Notu: Görsellerde hareket hissi (motion) ön planda olmalı.

2. KİMYA (Karışımlar ve Dönüşümler)

İçerik Kapsamı: Hal değişimleri (erime/donma), zararsız kimyasal tepkimeler (sirke-karbonat), karışımlar (yağ-su), çözünme ve paslanma.

Nasıl Olacak (Yaklaşım): "Mutfak Bilimi" tadında, sihir gibi görünen olayların mantıklı açıklamaları yapılacak. Tehlikeli kimyasallar değil, günlük malzemeler kullanılacak.

Üretim Notu: Dönüşüm ve değişim (öncesi/sonrası) vurgulanmalı.

3. BİYOLOJİ & SAĞLIK (Canlılar ve Vücudumuz)

İçerik Kapsamı: Organların işlevleri (kalp, iskelet), hijyen (diş fırçalama, mikroplar), büyüme süreçleri (tohum, kelebek döngüsü) ve sağlıklı beslenme.

Nasıl Olacak (Yaklaşım): Vücut farkındalığı yaratırken korkutucu tıbbi görsellerden kaçınılacak. Mikroplar "yaramaz tozlar", aşı "kalkan" gibi metaforlarla anlatılacak.

Üretim Notu: Karakterler sağlıklı ve enerjik resmedilmeli.

4. ASTRONOMİ (Uzay ve Gökyüzü)

İçerik Kapsamı: Güneş, Ay, Dünya, gezegenler, yıldızlar, yerçekimsiz ortam ve uzay araçları.

Nasıl Olacak (Yaklaşım): Uzayın büyüklüğü ve gizemi, çocuğun hayal gücünü tetikleyecek şekilde, ancak "karanlık/korkutucu" değil "keşfedilesi" bir yer olarak sunulacak.

Üretim Notu: Derinlik algısı ve parlak, ilgi çekici renkler kullanılmalı.

5. TEKNOLOJİ (Makineler)

İçerik Kapsamı: Tablet, pil, internet, drone, elektrik gibi modern cihazların ve altyapıların çalışma prensipleri.

Nasıl Olacak (Yaklaşım): Teknolojik aletlerin "sihirli kutular" olmadığı, içinde mühendislik ve mantık olduğu; görünmez bağlar (sinyaller) ve enerji akışı ile anlatılacak.

Üretim Notu: Cihazların iç yapısını veya çalışma mantığını basitleştiren şematik çizimler tercih edilmeli.

6. YAPAY ZEKA (Akıllı Sistemler)

İçerik Kapsamı: Makine öğrenmesi, yüz tanıma, sesli asistanlar, algoritmalar ve otonom araçlar.

Nasıl Olacak (Yaklaşım): Kritik: YZ, "canlı", "hisseden" veya "insan gibi" değil; matematik ve veri ile çalışan, çok hızlı işlem yapan "yardımcı bir araç" olarak konumlandırılacak. Korku ögeleri kesinlikle yok.

Üretim Notu: "Beyin" metaforu yerine "işlemci/veri" görselleri veya eşleştirme oyunları kullanılmalı.

7. DOĞA (Çevre ve Yaşam)

İçerik Kapsamı: Su döngüsü, mevsimler, hayvanların savunma mekanizmaları (kamuflaj), bitkiler ve ekosistem dengesi.

Nasıl Olacak (Yaklaşım): Doğayı koruma bilinci ve canlılara saygı teması işlenecek. Doğadaki döngülerin sürekliliği vurgulanacak.

Üretim Notu: Pastel ve doğal renk paletleri, huzurlu atmosferler.

8. İCATLAR (Bizi İlerleten Şeyler)

İçerik Kapsamı: Tekerlek, uçak, ampul, telefon, pusula gibi insanlık tarihini değiştiren temel buluşlar.

Nasıl Olacak (Yaklaşım): "Bir sorun vardı ve insanlar bunu çözmek için bu aleti buldu" şeklinde problem-çözüm odaklı bir anlatım benimsenecek.

Üretim Notu: Eski ve yeni (öncesi/sonrası) karşılaştırmaları etkili olacaktır.

9. MATEMATİK & MANTIK (Gizli Desenler)

İçerik Kapsamı: Rakamlar, simetri, geometrik şekiller, örüntüler, ölçü birimleri, gruplama ve temel işlemler.

Nasıl Olacak (Yaklaşım): Matematik sadece "sayılar" değil; doğadaki düzen, şekiller ve mantıklı düşünme becerisi olarak ele alınacak. Görsel matematik ön planda.

Üretim Notu: Düzenli, simetrik ve net çizgiler. Karmaşadan uzak durulmalı.

10. SANAT & MÜZİK BİLİMİ (Renkler ve Sesler)

İçerik Kapsamı: Ses dalgaları, renk karışımları, ritim, ışık-gölge, enstrümanların çalışma mantığı.

Nasıl Olacak (Yaklaşım): Sanatın estetik tarafının arkasındaki bilimsel gerçekler (titreşim, frekans, optik) basitçe gösterilecek.

Üretim Notu: İşitsel ögeler (ses efektleri) bu kategoride görseller kadar önemlidir.



### Experiments (Deneyler)
- **Category** - Deney kategorileri (Fizik, Kimya, Biyoloji/Sağlık, Astronomi, Teknoloji, AI, Doğa, İcatlar, Matematik, Müzik ve Sanat)
- **Experiment** - Deney içerikleri (simülasyon, video, quiz)
- **LearningCard** - Öğrenme kartları
- **ExperimentProgress** - Çocuk ilerleme durumu

### Gamification (Oyunlaştırma)
- **Badge** - Rozetler ve kazanma koşulları
- **EarnedBadge** - Kazanılan rozetler
- **AvatarItem** - Avatar özelleştirme öğeleri
- **OwnedAvatarItem** - Sahip olunan öğeler
- **SurpriseEgg** - Sürpriz Yumurta ödül havuzu

### Story Mode (Hikaye)
- **Story** - Ana hikaye
- **StoryPage** - Hikaye sayfaları
- **StoryChoice** - Seçenekler
- **StoryProgress** - İlerleme durumu

### Chatbot (MiniBot)
- **ChatSession** - Sohbet oturumu
- **ChatMessage** - Mesajlar
- **MiniBotHint** - Bağlama göre ipuçları

---























## 4. ✨ Özellik Listesi

### A. Temel Deneyim (MVP) ✅ TAMAMLANDI
- [x] Şirin Landing Page (animasyonlu, modern navigation bar) ✅
- [x] Custom User Model (Ebeveyn/Çocuk) ✅
- [x] Giriş/Kayıt Sistemi ✅
- [x] Sesli Arayüz (Voice-First) - Menülerin okunması (@mouseenter ile Alpine.js) ✅
- [x] Kategori Kartları (12 kategori, 100 öğrenme kartı) ✅

### B. İnteraktif İçerik ✅ TAMAMLANDI (8/8 Simülasyon)
- [x] **Renk Laboratuvarı:** Pixi.js ile renk karıştırma (color_lab.js) ✅
- [x] **Gezegen Yörünge Oyunu:** Pixi.js ile yerçekimi simülasyonu (orbit_game.js) ✅
- [x] **Bitki Büyütme Döngüsü:** 5 aşamalı büyüme simülasyonu (plant_growth.js) ✅
- [x] **Öğrenme Kartları:** 3D Flip animasyonlu, sesli kartlar (learning_cards.html) ✅
- [x] **Mini Lab Kitaplığı:** "Bitki Maceraları" hikayesi (7 sayfa, StoryPage modeli) ✅
- [x] **Problem Çözme Misyonları:** Örüntü bulma oyunu (pattern_puzzle.js - 3 level) ✅
- [x] **Keşfet ve Soru Sor:** Güneş Sistemi keşfi quiz (solar_quiz.js - 5 gezegen) ✅
- [x] **Yaratıcı Kodlama:** Şekil ve renk çizim aracı (creative_drawing.js) ✅

### C. Yaratıcılık ve Mühendislik ✅ TAMAMLANDI
- [x] **Mucit Atölyesi:** Sanal atölye (inventor_workshop.js - araçlar, malzemeler, icatlar) ✅
- [x] **Devre Tasarımı:** Elektrik devresi simülasyonu (circuit_design.js - pil, lamba, anahtar) ✅

### D. MiniBot (AI Asistan) ✅ TAMAMLANDI (26 Kasım 2025)
- [x] Gemini API entegrasyonu (Backend + Frontend hazır) ✅
- [x] **Gemini 2.5 Flash:** Model: `gemini-2.0-flash-exp` ✅
- [x] **Türkçe Native Persona:** Doğal Türkçe, Türk kültürüne uygun örnekler ✅
- [x] Sesli yanıt (TTS - Web Speech API) ve Mikrofon (STT) ✅
- [x] Güvenli "Çocuk Modu" (yasak kelime filtresi, güvenlik ayarları, döngü önleme) ✅
- [x] **Sistem Promptu:** Gerçek cevaplar, döngüye girme, 4-6 yaş dil seviyesi ✅
- [x] **Duygu Dostu İletişim:** Sakinleştirici, motive edici, onaylayıcı dil ✅
- [x] **Ebeveyn Katılımı:** Aile ile aktivite önerileri, paylaşım teşviki ✅
- [x] **Gelişmiş Fallback Sistemi:** 15+ konu kategorisi, duygusal durum tespiti ✅
- [x] **Akıllı Karşılama:** Günün saatine göre dinamik selamlama ✅
- [x] **Hızlı Sorular:** 8 popüler bilim sorusu ile kolay başlangıç ✅
- [x] API Key: AIzaSyB1EVzdN2BX1n8xG4gn6KChCfJxFVg0Vz4 ✅

### E. Ebeveyn & Sistem ✅ TAMAMLANDI
- [x] Dashboard (ilerleme grafikleri, puan/rozet gösterimi) ✅
- [x] Ekran Süresi Limiti ✅
- [x] Yatma Zamanı Modu ✅

---

## 🎉 MİNİLAB MVP DURUMU (26 Kasım 2025 - Faz 4 Tamamlandı!)

### ✅ Tamamlanan Özellikler
| Kategori | Durum | Detay |
|----------|-------|-------|
| **UI/UX** | ✅ 100% | Modern rounded design, gradient colors, responsive |
| **Simülasyonlar** | ✅ 100% | 8 Pixi.js simülasyonu (color_lab, orbit_game, plant_growth, pattern_puzzle, solar_quiz, creative_drawing, inventor_workshop, circuit_design) |
| **İçerik** | ✅ 100% | 12 kategori, 18 deney, 100 öğrenme kartı, 1 hikaye |
| **AI Chatbot** | ✅ 100% | Gemini 2.5 Flash + Türkçe persona + TTS/STT + Duygu Dostu İletişim |
| **Sesli Arayüz** | ✅ 100% | Menu hover okuma, Alpine.js speak(), STT mikrofon |
| **Gamification** | ✅ 100% | Puan, rozet, avatar sistemi backend hazır |
| **Ebeveyn Entegrasyonu** | ✅ 100% | MiniBot yanıtlarında aile katılımı teşviki |

### 📊 İstatistikler
- **Toplam Kod Dosyası:** 50+ dosya
- **Pixi.js Simülasyonları:** 8 adet
- **Template Dosyaları:** 20+ HTML
- **Veritabanı Modeli:** 15+ model
- **API Endpoints:** 30+ endpoint

### 🚀 Sistem Sağlık Durumu
- ✅ Django 5.2.8 + Python 3.14.0
- ✅ PostgreSQL/SQLite veritabanı
- ✅ Gemini 2.5 Flash API entegre
- ✅ Tüm migration'lar uygulandı
- ✅ Sistem kontrolü: 0 hata
- ✅ Sunucu çalışıyor: http://127.0.0.1:8000/

---











## 5. 📅 Geliştirme Yol Haritası (Faz 1-8)

### 📅 Faz 1: Temel Atma ve Mimari (Hafta 1) ✅ TAMAMLANDI
*Hedef: Sağlam bir iskelet ve kod standartları.*
- [x] Git init ve Venv kurulumu. ✅
- [x] Django projesi başlatma (`config` klasörü ile). ✅
- [x] **Settings Ayrımı:** base.py, dev.py, prod.py. ✅
- [x] **Kod Kalitesi:** Pre-commit hooks (Black, Flake8). ✅ *(.pre-commit-config.yaml oluşturuldu)*
- [x] **Docker:** Dockerfile ve docker-compose.yml hazırlığı. ✅ *(Dockerfile, docker-compose.yml, .dockerignore oluşturuldu)*
- [x] **Modeller:** Accounts uygulaması ve CustomUser/ChildProfile modelleri. ✅

### 📅 Faz 2: Tasarım Dili ve Frontend (Hafta 2) ✅ TAMAMLANDI
*Hedef: Şirin, animasyonlu arayüz.*
- [x] Tailwind CSS entegrasyonu (Renk paleti tanımlama). ✅
- [x] `templates/base.html` ve Alpine.js kurulumu. ✅
- [x] **Landing Page:** Zıplayan elementler, MiniBot SVG'si. ✅ *(Modern navigation bar, gradient sections, rounded cards)*
- [x] **Sesli arayüz altyapısı (TTS).** ✅ *(Web Speech API + Alpine.store('app').speak() fonksiyonu)*
- [x] **Sesli rehber ve menü okuma:** Her ana ekranda "Dinle" butonu ile sayfa başlığı ve kısa açıklamanın Web Speech API üzerinden okunması. ✅ *(Dashboard ve tüm kategorilerde @mouseenter ile sesli okuma aktif)*

### 📅 Faz 3: Simülasyon ve İçerik Çekirdeği (Hafta 3) ✅ TAMAMLANDI
*Hedef: Temel deneylerin ve içeriklerin oluşturulması.*
- [x] İlk deney: "Renk Karıştırma" için Pixi.js entegrasyonu. ✅
- [x] Deney şablonları ve örnek içerikler. ✅ *(18 deney aktif)*
- [x] Kategori ve deney listeleri için API uç noktaları. ✅
- [x] **12 Kategori veritabanına yüklendi** ✅ (26.11.2025)
- [x] **100 Öğrenme Kartı içeriği yüklendi** ✅ (26.11.2025)
- [x] **Admin paneli düzenlendi** - Kategoriler, Deneyler, Kartlar görüntülenebilir ✅ (26.11.2025)
- [x] **Eğitim kartları için ses dosyaları.** ✅ *(Web Speech API TTS aktif, otomatik ses üretimi scripti hazır: generate_audio_files.py, static/sounds/README.md)*
- [x] **Deney sonu mini raporu:** "Bugün neler öğrendin?" ekranı ✅ *(experiment_report.html - Quiz, kazanımlar, konfeti animasyonu)*
- [x] **Deney sonu ekranında kazanılan puan/rozet gösterimi** ✅ *(Gamification entegrasyonu tamamlandı - Yıldız tozu, yeni rozetler, istatistikler)*
















































### 📅 Faz 4: Zeka ve Ses (Hafta 4) ✅ TAMAMLANDI
*Hedef: Konuşan arkadaş MiniBot.*
- [x] `apps/chatbot` kurulumu ve Gemini API bağlantısı. ✅
- [x] System Prompt: "5 yaşındaki çocuğun neşeli arkadaşı" (güvenlik filtreleri ve yasak konu listesi ile). ✅
- [x] Sohbet arayüzü (Alpine.js toggle) ve Sesli Soru Sorma (STT). ✅
- [x] Duygu dostu MiniBot cevabı tasarımı: her zaman sakinleştirici, motive edici, ebeveyni oyuna dahil eden dil. ✅

**Faz 4 Özeti (26 Kasım 2025):**
- ✅ Gelişmiş System Prompt: 4-6 yaş seviyesi, Türkçe native, güvenlik filtreleri
- ✅ Ebeveyn Katılımı: Yanıtlarda aile ile aktivite önerileri
- ✅ Duygu Dostu İletişim: Sakinleştirici, motive edici, onaylayıcı dil
- ✅ Gelişmiş Fallback Sistemi: 15+ konu kategorisi, duygusal durum tespiti
- ✅ Akıllı Karşılama: Günün saatine göre dinamik selamlama
- ✅ Güvenlik: Yasak kelime filtresi, güvenli yönlendirme, döngü önleme
- ✅ STT/TTS Entegrasyonu: Web Speech API, mikrofon girişi, sesli okuma
- ✅ Hızlı Sorular: 8 popüler bilim sorusu ile kolay başlangıç









### 📅 Faz 5: Yaratıcılık ve Mühendislik (Hafta 5 - Sonraki Hedef)
*Hedef: Çocukların yaratıcılığını artıracak araçlar.*

**Not:** Faz 1-4 tamamlandı. Faz 5 bir sonraki geliştirme döngüsünde ele alınacak.

- [x] **Mucit Atölyesi Frontend:** Sanal atölye UI geliştirme (backend hazır ✅).
- [x] **Devre Tasarımı İyileştirme:** Daha fazla devre elemanı ve etkileşimli rehberlik (temel simülasyon hazır ✅).
- [x] **Mini Lab Kitaplığı Genişletme:** Yeni hikayeler ve kart eşleştirme oyunları (1 hikaye mevcut ✅).
- [x] **Problem Çözme Misyonları:** Yeni seviyeler ve zorluklarla genişletme (temel oyun hazır ✅).
- [x] **Keşfet ve Soru Sor:** Görsel atlas tabanlı quiz akışı (temel quiz hazır ✅).
- [x] **Yaratıcı Kodlama:** Blok tabanlı hikaye oluşturucu (temel çizim aracı hazır ✅).
- [x] **Görsel İlerleme Haritası:** Çocuğun deney ve hikaye ilerlemesini gezegen/ada haritası gibi görsel bir yol üzerinde göstermek.










### 📅 Faz 6: Oyunlaştırma ve Hikaye (Hafta 6)
*Hedef: Bağlılık yaratma.*
- [x] Rozet ve Puan sistemi (Backend signals hazır).
- [x] Avatar Mağazası (Backend hazır).
- [x] Sürpriz Yumurta sistemi (Backend hazır).
- [x] Hikaye Modu (Seçim ekranları).
- [x] Avatar Mağazası frontend entegrasyonu.



### 📅 Faz 7: Ebeveyn Paneli ve Final (Hafta 7)
*Hedef: Ebeveynler için kontrol ve izleme.*
- [x] Ebeveyn paneli tasarımı ve geliştirilmesi.
- [x] Çocuk ilerleme raporları ve grafikler.
- [x] Ekran süresi ve yatma zamanı ayarları.
- [x] Ebeveyn için haftalık özet: "Bu hafta ne öğrendi?" kartı veya e-posta özeti (kategori bazlı sade özet; örn. "2 fizik, 1 biyoloji deneyi tamamlandı") ve backend tarafında cron/Celery ile otomasyon tasarımı.

---

























## 6. 🎨 Tasarım & UI/UX

### Renk Paleti
| Renk | Hex | Kullanım |
|------|-----|----------|
| MiniLab Blue | `#0088e6` | Ana renk, linkler |
| MiniLab Orange | `#ffa31a` | CTA butonları, vurgular |
| Purple | `#8B5CF6` | MiniBot, premium |
| Green | `#10B981` | Başarı, Biyoloji |
| Pink | `#EC4899` | AI, özel |
| Yellow | `#FBBF24` | Yıldız, ödüller |

### Fontlar
- **Display (Başlıklar):** Fredoka One
- **Body (Metin):** Nunito

### Animasyonlar
- `animate-bounce` - Zıplama
- `animate-float` - Yüzme/süzülme
- `animate-wiggle` - Sallanma
- `hover:scale-105` - Büyüme
- `active:scale-95` - Basılma efekti

---

## 7. 🚀 Çalıştırma

### Geliştirme Ortamı
```powershell
# Virtual environment aktifleştir
cd c:\Users\HP\FILES\MINILAB
.\venv\Scripts\Activate.ps1

# Sunucuyu başlat
$env:DJANGO_SETTINGS_MODULE="config.settings"
python manage.py runserver
```

### Admin Paneli
- URL: http://127.0.0.1:8000/admin/
- Kullanıcı: `admin`
- Şifre: `admin123`

---

## 8. 📝 Notlar

- **Custom User Model** projenin en başından tanımlandı - sonradan değiştirmek zordur.
- **DJANGO_SETTINGS_MODULE** ortam değişkeni her terminal oturumunda ayarlanmalı.
- **Güvenlik:** Gemini API key ve Secret Key kesinlikle `.env` dosyasında tutulmalı.
- **Test:** Her yeni özellik eklendiğinde `pytest` çalıştırılarak regresyon testi yapılmalı.
- **User Model:** Proje başında `AUTH_USER_MODEL` ayarlandığından emin olunmalı.

---
*Son güncelleme: 26 Kasım 2025 (Revize Master Plan)*
