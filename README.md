# 🧪 MiniLab - Çocuklar İçin İnteraktif Bilim Platformu

MiniLab, 4-10 yaş arası çocuklar için tasarlanmış, eğlenceli ve öğretici bir bilim eğitim platformudur. Çocuklar fizik, kimya, bioloji, astronomi ve daha fazla alanda interaktif deneyler yapabilir, bilgi kartları ile öğrenebilir ve yapay zeka destekli MiniBot asistanı ile sohbet edebilir.

## 🌟 Özellikler

### 📚 Öğrenme Kartları
- Yaş grubuna özel içerik (4-6, 6-8, 8-10 yaş)
- Kategori bazlı öğrenme (Fizik, Kimya, Bioloji, Astronomi, vb.)
- İnteraktif kartlar ile adım adım öğrenme

### 🔬 Bilimsel Deneyler
- Yaş grubuna uygun güvenli deneyler
- Adım adım görsel talimatlar
- Gerekli malzeme listeleri
- Her deney için öğrenme hedefleri

### 🤖 MiniBot - AI Asistan
- Google Gemini AI destekli
- Çocuk dostu sohbet deneyimi
- Bilimsel soruları yanıtlama
- Meraklı sorulara açıklayıcı cevaplar

### 🎮 İnteraktif Simülasyonlar
- PixiJS ile geliştirilmiş simülasyonlar
- Atom yapısı keşfi
- Fizik ve kimya simülasyonları

### 🏆 Başarı Sistemi
- Tamamlanan aktiviteler için rozetler
- İlerleme takibi
- Motivasyon arttırıcı ödüller

### 👨‍👩‍👧‍👦 Ebeveyn Kontrol Paneli
- Çocuğun ilerleme takibi
- Tamamlanan aktivitelerin görüntülenmesi
- Öğrenme istatistikleri

## 🛠️ Teknolojiler

- **Frontend Framework:** React 19 + TypeScript
- **Build Tool:** Vite 7
- **Styling:** Tailwind CSS 4
- **Routing:** React Router DOM
- **AI Integration:** Google Generative AI (Gemini)
- **Animations:** PixiJS
- **Internationalization:** i18next
- **Linting:** ESLint 9

## 🚀 Kurulum

### Gereksinimler
- Node.js 18+
- npm veya yarn

### Adımlar

1. Projeyi klonlayın:
```bash
git clone https://github.com/[your-username]/MINILAB.git
cd MINILAB
```

2. Bağımlılıkları yükleyin:
```bash
npm install
```

3. Ortam değişkenlerini ayarlayın:
```bash
# .env.local dosyası oluşturun
VITE_GEMINI_API_KEY=your_gemini_api_key_here
```

4. Geliştirme sunucusunu başlatın:
```bash
npm run dev
```

5. Tarayıcınızda açın: `http://localhost:5173`

## 📦 Build

Proje build etmek için:
```bash
npm run build
```

Build çıktısı `dist/` klasöründe oluşturulur.

## 🎨 Proje Yapısı

```
MINILAB/
├── public/              # Statik dosyalar
│   ├── icons/          # Kategori ve navigasyon ikonları
│   ├── illustrations/  # Eğitim görselleri
│   └── learning/       # Ders içerik görselleri
├── src/
│   ├── components/     # React bileşenleri
│   ├── data/          # Veri dosyaları (deneyler, kartlar)
│   ├── hooks/         # Custom React hooks
│   ├── pages/         # Sayfa bileşenleri
│   ├── services/      # API servisleri
│   ├── i18n.tsx       # Çoklu dil desteği
│   └── App.tsx        # Ana uygulama
├── index.html
├── vite.config.ts
├── tailwind.config.js
└── package.json
```

## 🌍 Dil Desteği

- 🇹🇷 Türkçe
- 🇬🇧 İngilizce

## 🤝 Katkıda Bulunma

Katkılarınızı bekliyoruz! Lütfen bir pull request gönderin veya bir issue açın.

## 📄 Lisans

Bu proje MIT lisansı altında lisanslanmıştır.

## 👨‍💻 Geliştirici

Bu proje, çocukların bilim ve teknolojiye olan ilgisini artırmak amacıyla geliştirilmiştir.

---

**MiniLab** - Her çocuk bir bilim insanıdır! 🚀🔬✨
