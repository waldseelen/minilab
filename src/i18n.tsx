import React, { createContext, useContext, useMemo, useState, useEffect } from 'react';

type Lang = 'tr' | 'en';

type Dictionary = Record<string, string>;

const tr: Dictionary = {
  'nav.home': 'Ana Sayfa',
  'nav.simulations': 'Simülasyonlar',
  'nav.profile': 'Profil',
  'nav.minibot': 'MiniBot',
  'nav.parent': 'Ebeveyn Paneli',
  'toggle.dark': 'Tema: Açık/Koyu',
  'toggle.lang': 'TR/EN',
  'home.title': 'MiniLab\'a Hoş Geldin! 🎉',
  'home.all': 'Hepsi',
  'home.hero.title': 'Bilimi Öğrenmeye Hazır mısın?',
  'home.hero.subtitle': 'Eğlenceli bilgi kartları ile öğren! 📚',
  'home.age.title': 'Kaç yaşındasın? 🎂',
  'home.age.all': '🌟 Hepsi',
  'home.content.learning': '📚 Bilgi Kartları',
  'home.content.experiments': '🧪 Deneyler',
  'home.category.learning': '📖 Hangi Konuyu Öğrenmek İstiyorsun?',
  'home.category.experiments': '🧪 Hangi Deneyleri Yapmak İstiyorsun?',
  'home.nocontent.title': 'Bu kategori için içerik hazırlanıyor!',
  'home.nocontent.subtitle': 'Başka bir kategori veya yaş grubu seçmeyi dene! 😊',
  'cat.Physics': 'Fizik',
  'cat.Chemistry': 'Kimya',
  'cat.Biology': 'Biyoloji',
  'cat.Environmental Science': 'Çevre Bilimi',
  'cat.Engineering': 'Mühendislik',
  'cat.Astronomy': 'Astronomi',
  'cat.Technology': 'Teknoloji',
  'cat.AI': 'Yapay Zeka',
  'card.count': 'Kart',
  'experiment.count': 'Deney',
  'level.card': '. Kart',
  'daily.fact': 'Günün Bilgisi',
  'daily.continue': '👀 Devamını Oku',
  'daily.close': '📖 Kapat',
  'achievement.title': '🏆 Rozetlerim',
  'achievement.unlock': 'Tebrikler! 🎉',
  'achievement.first': 'İlk rozetini kazan için ilk deneyini tamamla! 🚀',
  'learning.keywords': '🔑 Anahtar Kelimeler',
  'learning.facts': '🎉 İlginç Bilgiler',
  'learning.schema': '📊 Şema',
  'learning.quiz': '🧩 Mini Test Çöz',
  'learning.complete': '✅ Tamamladım',
  'learning.back': '← İçeriğe Dön',
  'quiz.correct': '🎉 Doğru!',
  'quiz.incorrect': '😅 Yanlış!',
  'exp.materials': 'Gerekli Malzemeler:',
  'safety.title': 'Önce Güvenlik! 🛡️',
  'safety.text': 'Tüm deneylerde ebeveyn gözetimi önerilir.',
  'sim.title': 'Simülasyonlar Hazırlanıyor!',
  'sim.text': 'Etkileşimli eğlence için hazır ol! Simülasyonlar kısa süre içinde burada olacak.',
  'btn.letsgo': 'Başla! 🚀',
  'experiment.notFound': 'Deney bulunamadı!',
  'experiment.watchVideo': 'Videoyu İzle:',
  'loading.text': 'Yükleniyor...',
  'parent.title': 'Ebeveyn Paneli',
  'profile.badges': 'Rozetlerim',
  'profile.name': 'Süper Bilimci',
  'profile.title': 'Profilim',
  'sim.open': 'Hemen yönlendirmeli deneyi aç',
  'parent.stats.experiments': 'Tamamlanan Deney',
  'parent.stats.time': 'Öğrenme Süresi',
  'parent.stats.badges': 'Kazanılan Rozet',
  'recent.activity': 'Son Etkinlikler',
  'settings': 'Ayarlar',
  'settings.screenTime': 'Günlük ekran süresi limiti:',
  'settings.filter': 'İçeriği kategoriye göre filtrele:',
  'minibot.title': 'MiniBot ile Sohbet 🤖',
  'minibot.placeholder': 'Bilimle ilgili bir soru sor!'
};

const en: Dictionary = {
  'nav.home': 'Home',
  'nav.simulations': 'Simulations',
  'nav.profile': 'Profile',
  'nav.minibot': 'MiniBot',
  'nav.parent': 'Parent Dashboard',
  'toggle.dark': 'Dark Mode',
  'toggle.lang': 'TR/EN',
  'home.title': 'Welcome to MiniLab!',
  'home.all': 'All',
  'home.hero.title': 'Ready to Learn Science?',
  'home.hero.subtitle': 'Learn with fun knowledge cards! 📚',
  'home.age.title': 'How old are you? 🎂',
  'home.age.all': '🌟 All',
  'home.content.learning': '📚 Learning Cards',
  'home.content.experiments': '🧪 Experiments',
  'home.category.learning': '📖 Which Topic Do You Want to Learn?',
  'home.category.experiments': '🧪 Which Experiments Do You Want to Do?',
  'home.nocontent.title': 'Content is being prepared for this category!',
  'home.nocontent.subtitle': 'Try selecting another category or age group! 😊',
  'cat.Physics': 'Physics',
  'cat.Chemistry': 'Chemistry',
  'cat.Biology': 'Biology',
  'cat.Environmental Science': 'Environmental Science',
  'cat.Engineering': 'Engineering',
  'cat.Astronomy': 'Astronomy',
  'cat.Technology': 'Technology',
  'cat.AI': 'Artificial Intelligence',
  'card.count': 'Cards',
  'experiment.count': 'Experiments',
  'level.card': '. Card',
  'daily.fact': 'Daily Fact',
  'daily.continue': '👀 Read More',
  'daily.close': '📖 Close',
  'achievement.title': '🏆 My Badges',
  'achievement.unlock': 'Congratulations! 🎉',
  'achievement.first': 'Complete your first experiment to earn your first badge! 🚀',
  'learning.keywords': '🔑 Keywords',
  'learning.facts': '🎉 Fun Facts',
  'learning.schema': '📊 Diagram',
  'learning.quiz': '🧩 Take Mini Quiz',
  'learning.complete': '✅ Completed',
  'learning.back': '← Back to Content',
  'quiz.correct': '🎉 Correct!',
  'quiz.incorrect': '😅 Wrong!',
  'exp.materials': 'Materials Needed:',
  'safety.title': 'Safety First!',
  'safety.text': 'Parental supervision is recommended for all experiments.',
  'sim.title': 'Simulations are Loading!',
  'sim.text': 'Get ready for some interactive fun! Our simulations are being built and will be available soon.',
  'sim.open': 'Open a guided experiment now',
  'btn.letsgo': "Let's Go!",
  'experiment.notFound': 'Experiment not found!',
  'experiment.watchVideo': 'Watch the Video:',
  'loading.text': 'Loading...',
  'profile.title': 'My Profile',
  'profile.badges': 'My Badges',
  'profile.name': 'Super Scientist',
  'parent.title': 'Parent Dashboard',
  'parent.stats.experiments': 'Completed Experiments',
  'parent.stats.time': 'Learning Time',
  'parent.stats.badges': 'Earned Badges',
  'recent.activity': 'Recent Activities',
  'settings': 'Settings',
  'settings.screenTime': 'Daily screen time limit:',
  'settings.filter': 'Filter content by category:',
  'minibot.title': 'Chat with MiniBot 🤖',
  'minibot.placeholder': 'Ask a science question!'
};

const DICTS: Record<Lang, Dictionary> = { tr, en };

type Ctx = {
  lang: Lang;
  t: (key: string) => string;
  toggleLang: () => void;
};

const I18nContext = createContext<Ctx | null>(null);

export const I18nProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLang] = useState<Lang>('tr');

  useEffect(() => {
    const saved = (localStorage.getItem('minilab:lang') as Lang) || 'tr';
    setLang(saved);
  }, []);

  useEffect(() => {
    localStorage.setItem('minilab:lang', lang);
  }, [lang]);

  const t = useMemo(() => (key: string) => {
    const dict = DICTS[lang] || en;
    return dict[key] ?? key;
  }, [lang]);

  const toggleLang = () => setLang((prev) => (prev === 'tr' ? 'en' : 'tr'));

  const value = useMemo(() => ({ lang, t, toggleLang }), [lang, t]);
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
};

export const useI18n = (): Ctx => {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error('useI18n must be used within I18nProvider');
  return ctx;
};


