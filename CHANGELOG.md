# Değişiklik Günlüğü

## v2.0.0 - Kapsamlı Yenileme (19 Kasım 2025)

### 🚀 Önemli Değişiklikler

#### React ve TypeScript İyileştirmeleri
- ✅ **Modern React 19**: Tüm componentlerden gereksiz `React.FC` kullanımı kaldırıldı
- ✅ **Import Optimizasyonu**: `import React from 'react'` yerine doğrudan destructuring kullanımı
- ✅ **Type Safety**: Tüm component prop'larında doğru type tanımlamaları
- ✅ **Lazy Loading**: `React.lazy` yerine doğrudan `lazy` import kullanımı

#### CSS ve Görsel İyileştirmeler
- ✅ **Hizalama Düzeltmeleri**: Tüm componentlerde spacing ve alignment tutarlılığı
- ✅ **Responsive Tasarım**:
  - Mobil (< 480px) için optimize edilmiş görünüm
  - Tablet (480px - 768px) için geliştirilmiş layout
  - Desktop (> 768px) için tam özellikli deneyim
- ✅ **Age Filter Styling**: Yaş grubu seçici için geliştirilmiş görsel tasarım
- ✅ **Hero Section**: Padding ve shadow iyileştirmeleri
- ✅ **Category Grid**: Daha iyi hizalanmış kategori kartları

#### Erişilebilirlik (a11y)
- ✅ **Skip Links**: Klavye kullanıcıları için ana içeriğe atlama linkleri
- ✅ **ARIA Labels**: Tüm interaktif elementlerde uygun ARIA etiketleri
- ✅ **Semantic HTML**: `role`, `aria-live`, `aria-label` kullanımı
- ✅ **Keyboard Navigation**: Tab ve Enter tuşları ile tam navigasyon
- ✅ **Screen Reader**: Ekran okuyucu desteği iyileştirildi

#### Dil ve Çeviri
- ✅ **i18n Güncellemeleri**: Eksik çeviri anahtarları eklendi
- ✅ **Skip Links**: Türkçe ve İngilizce çevirileri
- ✅ **Tutarlılık**: Tüm UI metinlerinde tutarlı çeviri kullanımı

#### Performans Optimizasyonları
- ✅ **Code Splitting**: Sayfa bazlı lazy loading
- ✅ **Memoization**: `useMemo` ve `useCallback` kullanımı optimize edildi
- ✅ **Bundle Size**: Build çıktısı optimize edildi
  - index.js: ~190KB (gzip: ~61KB)
  - vendor.js: ~43KB (gzip: ~15KB)
  - CSS: ~25KB (gzip: ~5.5KB)

#### Hata Düzeltmeleri
- ✅ **HomePage**: Kapatılmamış div sorunu düzeltildi
- ✅ **ErrorBoundary**: Vite ortamında `process.env` yerine `import.meta.env` kullanımı
- ✅ **TypeScript**: Tüm compile hataları düzeltildi
- ✅ **HelpBubble**: Type inference sorunları çözüldü

### 📝 Dosya Değişiklikleri

#### Güncellenen Componentler
- `src/App.tsx` - Modern React ve SkipLinks eklendi
- `src/i18n.tsx` - Type tanımları ve yeni çeviriler
- `src/pages/HomePage.tsx` - HTML yapı hatası ve React import düzeltmesi
- `src/pages/MiniBotPage.tsx` - Erişilebilirlik iyileştirmeleri
- `src/components/Header.tsx` - Modern React type tanımları
- `src/components/Footer.tsx` - Tip tanımı güncellemesi
- `src/components/LoadingSpinner.tsx` - Type safety iyileştirmesi
- `src/components/ErrorBoundary.tsx` - Vite uyumluluğu
- `src/components/SkipLinks.tsx` - Yeni component
- `src/components/WelcomeModal.tsx` - Type güncellemesi
- `src/components/HelpBubble.tsx` - Type inference düzeltmesi
- `src/components/ExperimentCard.tsx` - Modern React
- `src/components/InstructionCard.tsx` - Type tanımları
- `src/components/LearningCard.tsx` - Component tip güncellemesi
- `src/components/MiniBotModal.tsx` - React import düzeltmesi

#### Güncellenen Stil Dosyaları
- `src/index.css` - Responsive, hizalama ve skip-links stilleri
- `src/theme.css` - Renk paleti tutarlılığı

#### Güncellenen Dokümantasyon
- `README.md` - Versiyon güncellemeleri ve teknoloji listesi
- `CHANGELOG.md` - Bu dosya (yeni)

### 🔧 Teknik Detaylar

#### Build Sistemi
```bash
✓ 67 modules transformed
✓ built in 4.32s
```

#### Bağımlılıklar
- React: 19.1.1
- React DOM: 19.1.1
- React Router DOM: 7.8.0
- TypeScript: 5.8.3
- Vite: 7.1.0
- Tailwind CSS: 4.1.12

### 🎯 Sonraki Adımlar
- [ ] Unit test kapsamının artırılması
- [ ] E2E test senaryolarının eklenmesi
- [ ] PWA desteği
- [ ] Offline mode
- [ ] Daha fazla simülasyon eklenmesi
- [ ] Çoklu dil desteği genişletilmesi

### 🙏 Teşekkürler
Bu güncelleme, MiniLab'ı daha modern, erişilebilir ve performanslı hale getirdi.

---

**Not**: Bu güncelleme breaking changes içermez. Tüm mevcut özellikler korunmuştur.
