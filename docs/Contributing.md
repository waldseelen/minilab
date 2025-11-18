# 🤝 MiniLab Katkıda Bulunma Rehberi

MiniLab projesine katkıda bulunmak istediğiniz için teşekkür ederiz! Bu rehber, projeye nasıl katkı sağlayabileceğinizi açıklamaktadır.

## 🎯 Katkı Türleri

### 1. 🐛 Hata Bildirimi
- GitHub Issues'da yeni bir issue açın
- Hata açıklaması, beklenen davranış, gerçekleşen davranış
- Tarayıcı, işletim sistemi, versiyon bilgileri
- Mümkünse ekran görüntüsü veya video

### 2. ✨ Yeni Özellik Önerisi
- Önce bir issue açarak özelliği tartışın
- Use case'leri ve hedef kullanıcı grubunu açıklayın
- Mockup veya wireframe ekleyin (opsiyonel)

### 3. 📝 Dokümantasyon
- Typo düzeltmeleri
- Eksik dokümantasyon ekleme
- Örnekler ve tutorial'lar
- README çevirileri

### 4. 🔧 Kod Katkısı
- Bug fix'leri
- Yeni özellikler
- Performans iyileştirmeleri
- Test coverage artırımı

## 🚀 Başlarken

### Gereksinimler
- Node.js 18 veya üzeri
- npm veya yarn
- Git
- VS Code (önerilen)

### Kurulum

1. **Repository'yi Fork Edin**
   ```bash
   # GitHub'da "Fork" butonuna tıklayın
   ```

2. **Yerel Klonlama**
   ```bash
   git clone https://github.com/YOUR_USERNAME/MINILAB.git
   cd MINILAB
   ```

3. **Bağımlılıkları Yükleyin**
   ```bash
   npm install
   ```

4. **Geliştirme Sunucusunu Başlatın**
   ```bash
   npm run dev
   ```

5. **Upstream Remote Ekleyin**
   ```bash
   git remote add upstream https://github.com/waldseelen/MINILAB.git
   ```

## 📋 Geliştirme Workflow'u

### 1. Yeni Branch Oluşturun
```bash
# Feature için
git checkout -b feature/amazing-feature

# Bug fix için
git checkout -b fix/bug-description

# Dokümantasyon için
git checkout -b docs/update-readme
```

### Branch Adlandırma Kuralları
- `feature/`: Yeni özellikler
- `fix/`: Hata düzeltmeleri
- `docs/`: Dokümantasyon değişiklikleri
- `refactor/`: Kod yeniden yapılandırma
- `test/`: Test eklemeleri
- `style/`: Stil ve format değişiklikleri
- `perf/`: Performans iyileştirmeleri

### 2. Değişikliklerinizi Yapın

#### Kod Standartları
- **TypeScript**: Tip tanımları zorunlu
- **ESLint**: Kuralları takip edin
  ```bash
  npm run lint
  npm run lint:fix
  ```
- **Formatting**: Tutarlı kod formatı
- **Comments**: Karmaşık mantık için açıklayıcı yorumlar

#### Bileşen Kuralları
```tsx
// ✅ İyi Örnek
import React, { useState, useMemo } from 'react';

interface MyComponentProps {
  title: string;
  onAction?: () => void;
}

const MyComponent: React.FC<MyComponentProps> = ({ title, onAction }) => {
  const [count, setCount] = useState(0);

  const doubleCount = useMemo(() => count * 2, [count]);

  return (
    <div>
      <h2>{title}</h2>
      <p>Count: {doubleCount}</p>
      <button onClick={onAction}>Action</button>
    </div>
  );
};

export default MyComponent;
```

#### i18n Kuralları
```typescript
// Yeni çeviri anahtarı ekleme
// src/i18n.tsx içinde hem TR hem EN ekleyin

const tr: Dictionary = {
  'new.key': 'Türkçe metin',
  // ...
};

const en: Dictionary = {
  'new.key': 'English text',
  // ...
};

// Kullanım
const { t } = useI18n();
<p>{t('new.key')}</p>
```

#### Erişilebilirlik (A11y)
```tsx
// ✅ ARIA etiketleri kullanın
<button
  aria-label="Kategoriyi seç"
  aria-pressed={isSelected}
>
  {category}
</button>

// ✅ Anlamlı alt metinler
<img
  src="/icon.svg"
  alt="Fizik kategorisi ikonu"
  loading="lazy"
/>

// ✅ Klavye navigasyonu
<div
  tabIndex={0}
  onKeyPress={(e) => e.key === 'Enter' && handleAction()}
>
```

### 3. Test Edin
```bash
# Lint kontrolü
npm run lint

# Build test
npm run build

# Manuel test
npm run dev
```

#### Test Checklist
- [ ] Tüm sayfalarda gezinme çalışıyor
- [ ] Farklı yaş grupları/kategoriler doğru filtreliyor
- [ ] Dil değişimi çalışıyor (TR/EN)
- [ ] Dark mode çalışıyor
- [ ] Mobil responsive
- [ ] Tarayıcı konsolu temiz (hata yok)

### 4. Commit Yapın

#### Commit Message Formatı
```
<type>(<scope>): <subject>

<body>

<footer>
```

**Tip (Type):**
- `feat`: Yeni özellik
- `fix`: Hata düzeltme
- `docs`: Dokümantasyon
- `style`: Kod formatı (işlevsellik değişmez)
- `refactor`: Kod yeniden yapılandırma
- `perf`: Performans iyileştirme
- `test`: Test ekleme
- `chore`: Build/tooling değişiklikleri

**Örnekler:**
```bash
# Yeni özellik
git commit -m "feat(homepage): add 'All' age group filter option"

# Hata düzeltme
git commit -m "fix(minibot): prevent crash when API key missing"

# Dokümantasyon
git commit -m "docs(readme): add installation instructions"

# Performans
git commit -m "perf(homepage): optimize filtering with useMemo"
```

### 5. Push ve Pull Request

```bash
# Branch'inizi push edin
git push origin feature/amazing-feature
```

**Pull Request Oluşturma:**
1. GitHub'da repository'nize gidin
2. "Pull Request" butonuna tıklayın
3. Açıklayıcı başlık ve açıklama yazın
4. İlgili issue'ları bağlayın (fixes #123)
5. Ekran görüntüsü veya GIF ekleyin (UI değişiklikleri için)

#### PR Template
```markdown
## Açıklama
Bu PR [özelliği/hatayı] ekliyor/düzeltiyor.

## Değişiklikler
- [ ] Özellik X eklendi
- [ ] Hata Y düzeltildi
- [ ] Dokümantasyon güncellendi

## Test
- [ ] Yerel olarak test edildi
- [ ] Tüm tarayıcılarda çalışıyor
- [ ] Mobil responsive

## Ekran Görüntüleri
(Varsa)

## İlgili Issue'lar
Fixes #123
Related to #456
```

## 🎨 Stil Rehberi

### CSS/Tailwind
- Utility-first yaklaşım tercih edin
- Custom CSS gerekirse `index.css` veya `theme.css` kullanın
- Dark mode desteği ekleyin

### Renk Paleti
```css
/* Pastel Colors */
--pastel-blue: #A7C7E7
--pastel-pink: #FFB6D9
--pastel-green: #B4E197
--pastel-purple: #C5A3FF
--pastel-yellow: #FFF4A3
```

### İkon ve Görseller
- SVG formatı tercih edin
- Optimize edilmiş boyutlar
- Anlamlı dosya isimleri
- `/public/icons/` veya `/public/illustrations/` altında

## 🧪 Test Yazma (Gelecek)

```typescript
// Örnek bileşen testi
import { render, screen } from '@testing-library/react';
import MyComponent from './MyComponent';

describe('MyComponent', () => {
  it('should render title correctly', () => {
    render(<MyComponent title="Test Title" />);
    expect(screen.getByText('Test Title')).toBeInTheDocument();
  });
});
```

## 📦 Yeni Bağımlılık Ekleme

1. **Gereklilik Değerlendirmesi**
   - Gerçekten gerekli mi?
   - Alternatif yerleşik çözümler var mı?
   - Bundle size etkisi nedir?

2. **Ekleme**
   ```bash
   npm install package-name
   ```

3. **Dokümantasyon**
   - README.md'de belirtin
   - Kullanım amacını açıklayın

## 🚫 Yapılmaması Gerekenler

- ❌ `console.log` bırakmayın (geliştirme hariç)
- ❌ Büyük dosyalar commit etmeyin (images, videos)
- ❌ API anahtarları commit etmeyin
- ❌ Linter hatalarını görmezden gelmeyin
- ❌ Main branch'e direkt push yapmayın
- ❌ Test etmeden PR açmayın

## ✅ İyi Pratikler

- ✅ Küçük, odaklı commit'ler
- ✅ Anlamlı commit mesajları
- ✅ Kod review'a açık olun
- ✅ Testler yazın
- ✅ Dokümantasyon ekleyin
- ✅ Erişilebilirlik standartlarına uyun
- ✅ Performance'ı düşünün

## 🔍 Code Review Süreci

### Review Kriterleri
- [ ] Kod okunabilir ve maintainable
- [ ] Tip güvenliği sağlanmış (TypeScript)
- [ ] Performans optimizasyonları yapılmış
- [ ] Erişilebilirlik standartlarına uygun
- [ ] i18n desteği eklenmiş (gerekiyorsa)
- [ ] Hata durumları handle edilmiş
- [ ] Test coverage yeterli

### Feedback Alma
- Yapıcı eleştiriye açık olun
- Sorular sorun, netleştirin
- İyileştirme önerilerini değerlendirin
- Gerekli değişiklikleri hızlıca yapın

## 🏆 İlk Katkınız

İlk kez katkıda bulunuyorsanız, `good-first-issue` etiketli issue'lara bakın. Bunlar yeni katkıcılar için uygun, küçük kapsamlı görevlerdir.

## 📞 İletişim

- **Issues**: Teknik sorular ve hatalar
- **Discussions**: Genel tartışmalar, öneriler
- **Email**: (Proje sahibi email'i buraya)

## 📜 Lisans

Katkılarınız, projenin mevcut MIT lisansı altında dağıtılacaktır.

---

**MiniLab'a katkıda bulunduğunuz için teşekkürler! Her katkı, çocukların bilim öğrenme deneyimini daha iyi hale getiriyor.** 🚀🔬✨
