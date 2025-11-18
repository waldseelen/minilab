# 🏗️ MiniLab Mimari Dokümantasyonu

Bu belge, MiniLab projesinin teknik mimarisini, veri akışını ve bileşen yapısını detaylandırmaktadır.

## 📐 Genel Mimari

MiniLab, modern React ekosistemi üzerine inşa edilmiş, **Component-Based Architecture** prensiplerine dayanan bir Single Page Application (SPA)'dır.

```
┌─────────────────────────────────────────────────────┐
│                   index.html                        │
│  ┌───────────────────────────────────────────────┐  │
│  │              main.tsx (Entry Point)           │  │
│  │  ┌─────────────────────────────────────────┐  │  │
│  │  │            App.tsx                      │  │  │
│  │  │  ┌───────────────────────────────────┐  │  │  │
│  │  │  │   I18nProvider (Context)          │  │  │  │
│  │  │  │   ErrorBoundary                   │  │  │  │
│  │  │  │   React Router                    │  │  │  │
│  │  │  │                                   │  │  │  │
│  │  │  │   ┌─────────────────────────┐     │  │  │  │
│  │  │  │   │  Header (Navigation)    │     │  │  │  │
│  │  │  │   └─────────────────────────┘     │  │  │  │
│  │  │  │   ┌─────────────────────────┐     │  │  │  │
│  │  │  │   │  Pages (Lazy Loaded)    │     │  │  │  │
│  │  │  │   │  - HomePage             │     │  │  │  │
│  │  │  │   │  - MiniBotPage          │     │  │  │  │
│  │  │  │   │  - SimulationsPage      │     │  │  │  │
│  │  │  │   │  - ProfilePage          │     │  │  │  │
│  │  │  │   │  - ParentDashboard      │     │  │  │  │
│  │  │  │   └─────────────────────────┘     │  │  │  │
│  │  │  │   ┌─────────────────────────┐     │  │  │  │
│  │  │  │   │  Footer                 │     │  │  │  │
│  │  │  │   └─────────────────────────┘     │  │  │  │
│  │  │  └───────────────────────────────────┘  │  │  │
│  │  └─────────────────────────────────────────┘  │  │
│  └───────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────┘
```

## 🗂️ Dizin Yapısı

```
MINILAB/
├── public/                 # Statik varlıklar
│   ├── icons/             # İkon dosyaları (SVG)
│   ├── illustrations/     # Eğitim görselleri
│   ├── images/            # Deney görselleri
│   ├── learning/          # Öğrenme içeriği görselleri
│   └── schemas/           # Diyagram ve şemalar
├── src/
│   ├── components/        # Yeniden kullanılabilir UI bileşenleri
│   ├── pages/            # Sayfa bileşenleri (Router endpoints)
│   ├── data/             # Statik veri dosyaları
│   ├── services/         # Dış servis entegrasyonları
│   ├── hooks/            # Custom React hooks
│   ├── i18n.tsx          # Internationalization context
│   ├── App.tsx           # Ana uygulama bileşeni
│   └── main.tsx          # Giriş noktası
├── docs/                 # Dokümantasyon
├── vite.config.ts        # Build yapılandırması
├── tailwind.config.js    # Stil yapılandırması
└── package.json          # Bağımlılıklar
```

## 🔄 Veri Akışı

### 1. Öğrenme Kartları Akışı
```
User Interaction (HomePage)
    ↓
State Updates (selectedCategory, selectedAgeGroup)
    ↓
useMemo Hook (Filtered Data)
    ↓
Data Layer (learningCards.ts)
    ↓
LearningCard Component
    ↓
UI Render
```

### 2. AI Asistan (MiniBot) Akışı
```
User Input (MiniBotPage)
    ↓
handleSend()
    ↓
geminiService.ts
    ↓
Google Generative AI API / Mock
    ↓
Response Processing
    ↓
Messages State Update
    ↓
Chat UI Update
```

### 3. i18n (Çok Dilli Destek) Akışı
```
I18nProvider Context
    ↓
localStorage (Persistence)
    ↓
useI18n Hook
    ↓
t() Function
    ↓
Translated Text
```

## 🧩 Katman Mimarisi

### Presentation Layer (UI)
- **Bileşenler:** `components/`, `pages/`
- **Sorumluluk:** Kullanıcı arayüzü, etkileşimler, görsel sunum
- **Teknoloji:** React, Tailwind CSS

### Business Logic Layer
- **Hooks:** `hooks/useKeyboardNavigation.ts`, `hooks/useToast.ts`
- **Sorumluluk:** İş mantığı, durum yönetimi, hesaplamalar
- **Teknoloji:** React Hooks (useState, useMemo, useCallback)

### Data Layer
- **Veri Kaynakları:** `data/experiments.ts`, `data/learningCards.ts`
- **Sorumluluk:** Veri modelleri, veri erişimi, filtreleme
- **Teknoloji:** TypeScript interfaces, pure functions

### Service Layer
- **Servisler:** `services/geminiService.ts`, `services/achievementService.ts`
- **Sorumluluk:** Dış API entegrasyonları, servis soyutlaması
- **Teknoloji:** Async/await, API clients

## 🎯 Bileşen Hiyerarşisi

### Core Components
- **App.tsx**: Kök bileşen, routing ve context sağlayıcılar
- **ErrorBoundary**: Hata yakalama ve kullanıcı bildirimi
- **Header**: Navigasyon, dil/tema değiştirici
- **Footer**: Alt bilgi

### Page Components
- **HomePage**: Ana sayfa, kategoriler, öğrenme kartları/deneyler
- **MiniBotPage**: AI sohbet arayüzü
- **ExperimentDetailPage**: Deney detay görünümü
- **SimulationsPage**: İnteraktif simülasyonlar (hazırlanıyor)
- **ProfilePage**: Kullanıcı profili ve rozetler
- **ParentDashboard**: Ebeveyn kontrol paneli

### Shared Components
- **LearningCard**: Öğrenme içeriği kartı
- **ExperimentCard**: Deney önizleme kartı
- **Button**: Yeniden kullanılabilir buton
- **LoadingSpinner**: Yükleme göstergesi
- **BackButton**: Geri dönüş butonu

## 🔐 State Management

MiniLab, karmaşık global state yöneticisi (Redux, Zustand) yerine **React Context API** ve **Component State** kombinasyonunu kullanır.

### Context Providers
1. **I18nContext**: Dil yönetimi (`tr` / `en`)
   - localStorage ile kalıcılık
   - `t()` fonksiyonu ile çeviri

### Component-Level State
- **HomePage**: Filtre durumları (kategori, yaş grubu, görünüm)
- **MiniBotPage**: Mesaj geçmişi, input durumu
- **Diğer**: Lokal UI durumları

## ⚡ Performans Optimizasyonları

### Code Splitting
- **React.lazy**: Tüm sayfa bileşenleri lazy loading ile yüklenir
- **Suspense**: LoadingSpinner ile yükleme durumu gösterilir
- **Chunk Strategy**: `vite.config.ts` içinde manuel chunk tanımları
  - `vendor`: React, React Router
  - `ai`: Google Generative AI
  - `ui`: PixiJS (gelecek kullanım)

### Memoization
- **useMemo**: Ağır filtreleme işlemleri cache'lenir
  - HomePage'deki learningCards ve filteredExperiments
- **useCallback**: Event handler'lar gereksiz yeniden oluşturulmaz

### Asset Optimization
- **Lazy Loading**: Görsellere `loading="lazy"` attribute'u
- **SVG Icons**: Vektör formatında küçük boyutlu ikonlar
- **Image Optimization**: (TODO) WebP formatı ve responsive boyutlar

## 🌐 API Entegrasyonları

### Google Gemini AI
- **Servis**: `services/geminiService.ts`
- **Model**: `gemini-1.5-flash`
- **Özellikler**:
  - Çocuk dostu konuşma tonu
  - Güvenlik uyarıları
  - Fallback mock sistemi (API yoksa)
  - Token limiti: 200

### Environment Variables
```bash
VITE_GEMINI_API_KEY=your_api_key_here
```

## 🎨 Styling Stratejisi

### Tailwind CSS
- **Utility-First**: Hızlı prototipleme
- **Custom Config**: `tailwind.config.js` içinde özel renkler
- **Dark Mode**: `data-theme="dark"` attribute ile

### CSS Modules
- **theme.css**: CSS değişkenleri, tema tanımları
- **index.css**: Global stiller, animasyonlar

## 🧪 Testing Stratejisi (Önerilen)

### Unit Tests
- Bileşen render testleri (React Testing Library)
- Hook testleri
- Utility fonksiyon testleri

### Integration Tests
- Sayfa akışları
- Form validasyonları
- API mock testleri

### E2E Tests
- Kullanıcı senaryoları (Playwright)
- Kritik yollar

### Performance Tests
- Lighthouse CI
- Bundle size analizi

## 🚀 Build & Deploy

### Development
```bash
npm run dev
```

### Production Build
```bash
npm run build
```
- Output: `dist/` klasörü
- Chunk analizi: `bundle-analysis.html`

### Deployment
- Static hosting (Vercel, Netlify, GitHub Pages)
- Environment variables yapılandırması gerekli

## 🔮 Gelecek İyileştirmeler

1. **State Management**: Karmaşık durum için Zustand/Jotai
2. **Server-Side**: API endpoints için backend entegrasyonu
3. **Database**: Kullanıcı verileri için Firebase/Supabase
4. **PWA**: Offline-first yaklaşım, Service Workers
5. **Analytics**: Kullanıcı davranış takibi
6. **Testing**: Kapsamlı test coverage
7. **CI/CD**: GitHub Actions ile otomatik deployment

---

**Son Güncelleme:** 18 Kasım 2025
**Versiyon:** 1.0.0
