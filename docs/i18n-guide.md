# 🌍 MiniLab i18n (Internationalization) Rehberi

Bu belge, MiniLab projesinde çoklu dil desteğinin nasıl çalıştığını ve yeni çeviriler ekleme sürecini açıklamaktadır.

## 📚 Genel Bakış

MiniLab, **React Context API** tabanlı özel bir i18n sistemi kullanır. Şu anda desteklenen diller:
- 🇹🇷 Türkçe (tr)
- 🇬🇧 İngilizce (en)

## 🏗️ Mimari

### Dosya Konumu
```
src/i18n.tsx
```

### Temel Yapı
```typescript
type Lang = 'tr' | 'en';
type Dictionary = Record<string, string>;

const tr: Dictionary = { ... };
const en: Dictionary = { ... };

const DICTS: Record<Lang, Dictionary> = { tr, en };
```

## 🔑 Anahtar Adlandırma Kuralları

### Format
```
<domain>.<subdomain>.<key>
```

### Örnekler
```typescript
'nav.home'                    // Navigation > Home
'home.hero.title'             // HomePage > Hero Section > Title
'cat.Physics'                 // Category > Physics
'experiment.notFound'         // Experiment > Not Found
'minibot.placeholder'         // MiniBot > Input Placeholder
```

### Domain'ler
- `nav`: Navigasyon
- `home`: Ana sayfa
- `cat`: Kategoriler
- `experiment` / `exp`: Deneyler
- `learning`: Öğrenme kartları
- `quiz`: Quiz bileşenleri
- `achievement`: Başarı sistemi
- `parent`: Ebeveyn paneli
- `profile`: Profil sayfası
- `minibot`: AI asistan
- `sim`: Simülasyonlar
- `btn`: Butonlar
- `toggle`: Toggle butonlar

## ➕ Yeni Çeviri Ekleme

### 1. Anahtar Tanımlama

**src/i18n.tsx** dosyasını açın ve hem TR hem EN dictionary'lerine ekleyin:

```typescript
const tr: Dictionary = {
  // Mevcut anahtarlar...
  'new.section.title': 'Yeni Bölüm Başlığı',
  'new.section.description': 'Bu yeni bir bölüm açıklamasıdır',
  'new.action.button': 'Tıkla!',
};

const en: Dictionary = {
  // Mevcut anahtarlar...
  'new.section.title': 'New Section Title',
  'new.section.description': 'This is a new section description',
  'new.action.button': 'Click!',
};
```

### 2. Bileşende Kullanım

```tsx
import { useI18n } from '../i18n';

const MyComponent: React.FC = () => {
  const { t } = useI18n();

  return (
    <div>
      <h2>{t('new.section.title')}</h2>
      <p>{t('new.section.description')}</p>
      <button>{t('new.action.button')}</button>
    </div>
  );
};
```

## 🔄 Dil Değiştirme

### Kullanıcı Tarafından
Header'daki dil butonu ile:
```tsx
const { toggleLang } = useI18n();

<button onClick={toggleLang}>
  TR/EN
</button>
```

### Programatik
```tsx
const { lang } = useI18n();

if (lang === 'tr') {
  // Türkçe spesifik işlemler
} else {
  // İngilizce spesifik işlemler
}
```

## 💾 Kalıcılık (Persistence)

Dil tercihi **localStorage**'da saklanır:
```typescript
localStorage.setItem('minilab:lang', 'tr');
const saved = localStorage.getItem('minilab:lang');
```

Sayfa yenilendiğinde son seçilen dil otomatik yüklenir.

## 📋 Mevcut Çeviri Anahtarları

### Navigasyon
```typescript
'nav.home': 'Ana Sayfa' / 'Home'
'nav.simulations': 'Simülasyonlar' / 'Simulations'
'nav.profile': 'Profil' / 'Profile'
'nav.minibot': 'MiniBot' / 'MiniBot'
'nav.parent': 'Ebeveyn Paneli' / 'Parent Dashboard'
```

### Ana Sayfa (HomePage)
```typescript
'home.title': 'MiniLab\'a Hoş Geldin! 🎉' / 'Welcome to MiniLab!'
'home.hero.title': 'Bilimi Öğrenmeye Hazır mısın?' / 'Ready to Learn Science?'
'home.hero.subtitle': 'Eğlenceli bilgi kartları ile öğren! 📚' / 'Learn with fun knowledge cards! 📚'
'home.age.title': 'Kaç yaşındasın? 🎂' / 'How old are you? 🎂'
'home.age.all': '🌟 Hepsi' / '🌟 All'
'home.content.learning': '📚 Bilgi Kartları' / '📚 Learning Cards'
'home.content.experiments': '🧪 Deneyler' / '🧪 Experiments'
```

### Kategoriler
```typescript
'cat.Physics': 'Fizik' / 'Physics'
'cat.Chemistry': 'Kimya' / 'Chemistry'
'cat.Biology': 'Biyoloji' / 'Biology'
'cat.Environmental Science': 'Çevre Bilimi' / 'Environmental Science'
'cat.Engineering': 'Mühendislik' / 'Engineering'
'cat.Astronomy': 'Astronomi' / 'Astronomy'
'cat.Technology': 'Teknoloji' / 'Technology'
'cat.AI': 'Yapay Zeka' / 'Artificial Intelligence'
```

### Öğrenme Kartları
```typescript
'learning.keywords': '🔑 Anahtar Kelimeler' / '🔑 Keywords'
'learning.facts': '🎉 İlginç Bilgiler' / '🎉 Fun Facts'
'learning.schema': '📊 Şema' / '📊 Diagram'
'learning.quiz': '🧩 Mini Test Çöz' / '🧩 Take Mini Quiz'
'learning.complete': '✅ Tamamladım' / '✅ Completed'
'learning.back': '← İçeriğe Dön' / '← Back to Content'
```

### MiniBot
```typescript
'minibot.title': 'MiniBot ile Sohbet 🤖' / 'Chat with MiniBot 🤖'
'minibot.placeholder': 'Bilimle ilgili bir soru sor!' / 'Ask a science question!'
```

## 🆕 Yeni Dil Ekleme

### 1. Tip Tanımlarını Güncelleyin
```typescript
type Lang = 'tr' | 'en' | 'fr'; // Fransızca eklendi
```

### 2. Yeni Dictionary Oluşturun
```typescript
const fr: Dictionary = {
  'nav.home': 'Accueil',
  'nav.minibot': 'MiniBot',
  // Tüm anahtarları çevirin...
};
```

### 3. DICTS'e Ekleyin
```typescript
const DICTS: Record<Lang, Dictionary> = { tr, en, fr };
```

### 4. Toggle Fonksiyonunu Güncelleyin
```typescript
const toggleLang = () => {
  setLang((prev) => {
    if (prev === 'tr') return 'en';
    if (prev === 'en') return 'fr';
    return 'tr';
  });
};
```

## ⚠️ Yaygın Hatalar ve Çözümler

### 1. Eksik Çeviri Anahtarı
**Sorun:** Anahtar bir dilde var, diğerinde yok
```typescript
// ❌ Yanlış
const tr: Dictionary = {
  'home.welcome': 'Hoş Geldin',
};
const en: Dictionary = {
  // 'home.welcome' eksik!
};
```

**Çözüm:** Her iki dictionary'ye de ekleyin
```typescript
// ✅ Doğru
const tr: Dictionary = {
  'home.welcome': 'Hoş Geldin',
};
const en: Dictionary = {
  'home.welcome': 'Welcome',
};
```

### 2. Yanlış Anahtar Kullanımı
**Sorun:** Tanımlanmamış anahtar kullanılıyor
```typescript
// Bileşende
<p>{t('home.not.exists')}</p> // Anahtar tanımlı değil
```

**Çözüm:** Anahtarın tanımlı olduğundan emin olun
```typescript
// src/i18n.tsx içinde kontrol edin
const tr: Dictionary = {
  'home.not.exists': 'Tanım ekle',
};
```

### 3. Fallback Davranışı
Anahtar bulunamazsa, anahtar kendisi döner:
```typescript
t('undefined.key') // "undefined.key" döner
```

**İyileştirme:** Fallback metin ekleyin
```typescript
const t = (key: string, fallback?: string) => {
  const dict = DICTS[lang] || en;
  return dict[key] ?? fallback ?? key;
};

// Kullanım
<p>{t('new.key', 'Varsayılan Metin')}</p>
```

## 🔍 Çeviri Anahtarlarını Bulma

### Dosya İçinde Arama
```bash
# Tüm 'home.*' anahtarlarını bul
grep -r "t\('home\." src/
```

### TypeScript Yardımıyla
```typescript
// Type-safe anahtar tanımı (gelecek iyileştirme)
type TranslationKey = keyof typeof tr;

const t = (key: TranslationKey) => {
  // Otomatik tamamlama ve tip kontrolü
};
```

## 📊 Çeviri İstatistikleri

### Toplam Anahtar Sayısı
- **Türkçe (tr):** ~60 anahtar
- **İngilizce (en):** ~60 anahtar

### Kapsam Alanları
- Navigasyon: 7 anahtar
- Ana Sayfa: 12 anahtar
- Kategoriler: 8 anahtar
- Öğrenme: 8 anahtar
- MiniBot: 2 anahtar
- Deneyler: 5 anahtar
- Diğer: 18 anahtar

## 🛠️ Geliştirme Araçları

### Eksik Çeviri Kontrolü (Script Önerisi)
```typescript
// scripts/check-i18n.ts
const checkMissingTranslations = () => {
  const trKeys = Object.keys(tr);
  const enKeys = Object.keys(en);

  const missingInEn = trKeys.filter(k => !enKeys.includes(k));
  const missingInTr = enKeys.filter(k => !trKeys.includes(k));

  console.log('Missing in EN:', missingInEn);
  console.log('Missing in TR:', missingInTr);
};
```

### Kullanılmayan Anahtar Bulma
```bash
# Kullanılmayan anahtarları bul
for key in $(grep -o "'[^']*'" src/i18n.tsx); do
  grep -r "t($key)" src/ || echo "Unused: $key"
done
```

## 📝 Best Practices

### 1. Tutarlı Formatlama
```typescript
// ✅ Doğru - Nokta ayırıcılı, küçük harf
'home.hero.title'

// ❌ Yanlış - CamelCase, alt çizgi
'homeHeroTitle'
'home_hero_title'
```

### 2. Anlamlı İsimler
```typescript
// ✅ Doğru - Ne olduğu belli
'experiment.materials'

// ❌ Yanlış - Belirsiz
'exp.mat'
'stuff'
```

### 3. Hiyerarşik Yapı
```typescript
// ✅ Doğru - Mantıklı gruplama
'home.hero.title'
'home.hero.subtitle'
'home.category.title'

// ❌ Yanlış - Düz yapı
'homeHeroTitle'
'homeHeroSubtitle'
'homeCategoryTitle'
```

### 4. Emoji Kullanımı
Emoji'ler evrensel olduğu için çeviride aynı kalabilir:
```typescript
const tr = {
  'home.welcome': 'Hoş Geldin! 🎉',
};
const en = {
  'home.welcome': 'Welcome! 🎉', // Aynı emoji
};
```

## 🔮 Gelecek İyileştirmeler

1. **Tip Güvenliği**: TranslationKey tipi ile otomatik tamamlama
2. **Namespace'ler**: Büyük projelerde dosya bazlı bölme
3. **Interpolation**: Dinamik değerler için placeholder'lar
4. **Pluralization**: Tekil/çoğul destek
5. **Date/Number Formatting**: Locale-specific formatlar
6. **External Library**: i18next gibi güçlü kütüphane entegrasyonu

## 📞 Yardım

Çeviri ile ilgili sorularınız için:
- GitHub Issues'da `i18n` etiketi ile issue açın
- Contributing.md'deki iletişim kanallarını kullanın

---

**MiniLab'ı daha fazla dilde erişilebilir hale getirdiğiniz için teşekkürler!** 🌍✨
