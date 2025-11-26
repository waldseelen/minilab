
import React, { createContext, useState, useContext, useEffect } from 'react';

type Language = 'tr' | 'en';

interface I18nContextType {
  language: Language;
  toggleLanguage: () => void;
  t: (key: string) => string;
}

const translations = {
  tr: {
    'nav.home': 'Ana Sayfa',
    'nav.minibot': 'MiniBot',
    'hero.title': 'Keşfetmeye Hazır mısın?',
    'hero.subtitle': 'Bilim, uzay ve teknoloji dolu dünyamıza hoş geldin!',
    'btn.about': 'Biz Kimiz?',
    'btn.generate': 'Deney Bul',
    'search.placeholder': 'Kartlarda ara (örn: uzay, robot, deney)...',
    'filter.all': 'Hepsi',
    'filter.category': 'Kategori Seç:',
    'filter.age': 'Yaş Grubu:',
    'cat.Physics': 'Fizik',
    'cat.Chemistry': 'Kimya',
    'cat.Biology': 'Biyoloji',
    'cat.Astronomy': 'Uzay',
    'cat.Technology': 'Teknoloji',
    'cat.AI': 'Yapay Zeka',
    'cat.Environment': 'Çevre Bilimi',
    'cat.Robotics': 'Robotik',
    'card.learn': 'Öğren',
    'card.experiment': 'Deney',
    'card.simulation': 'Simülasyon',
    'card.more': 'Daha Fazla',
    'features.tag': 'Nasıl Çalışır?',
    'features.title': 'MiniLab ile Öğrenmenin 3 Yolu',
    'features.cards.title': 'Renkli Bilgi Kartları',
    'features.cards.desc': 'Uzaydan dinozorlara kadar her şeyi eğlenceli kartlarla keşfet. Sadece oku ve öğren!',
    'features.experiments.title': 'Çılgın Deneyler',
    'features.experiments.desc': 'Mutfağını bir laboratuvara dönüştür! Güvenli ve kolay tariflerle bilimi yaşayarak öğren.',
    'features.minibot.title': 'MiniBot Asistan',
    'features.minibot.desc': 'Aklına takılan soruları robot arkadaşına sor. O her zaman seninle sohbet etmeye hazır!',
    'gen.title': '🧪 Kendi Deneyini Oluştur!',
    'gen.desc': 'Evde yapabileceğin eğlenceli ve güvenli deneyler bulmak için aşağıdan seçim yap.',
    'gen.loading': 'Düşünüyorum...',
    'gen.history': 'Son Deneylerin 📜',
    'gen.result': 'Senin İçin Fikirler:',
    'minibot.title': 'MiniBot Asistan',
    'minibot.subtitle': 'Bilim Arkadaşın',
    'minibot.input': 'Sorunu buraya yaz...',
    'minibot.anim': 'Animasyon:',
    'minibot.style': 'Tarz:',
    'minibot.style.default': 'Klasik',
    'minibot.style.fancy': 'Şık',
    'minibot.style.smart': 'Bilgin',
    'minibot.style.worker': 'Mühendis',
    'minibot.style.royal': 'Kraliyet',
    'minibot.eyes': 'Gözler:',
    'minibot.eyes.normal': 'Normal',
    'minibot.eyes.big': 'Kocaman',
    'minibot.eyes.sparkling': 'Işıltılı',
    'minibot.eyes.curious': 'Meraklı',
    'minibot.intro': 'Merhaba! Ben MiniBot! 🤖 Bilimle ilgili merak ettiğin her şeyi bana sorabilirsin. Bugün ne keşfetmek istersin?',
    'modal.welcome': 'MiniLab Kids\'e Hoş Geldin!',
    'modal.mission': 'Görevimiz',
    'modal.mission.desc': 'Merak ettiğin sorulara cevap bulmak, güvenli deneyler yapmak ve bilimin ne kadar eğlenceli olduğunu göstermek!',
    'modal.minibot': 'MiniBot ile Tanış!',
    'modal.minibot.desc': 'O senin yapay zeka asistanın. "MiniBot" sayfasına gidip ona aklına gelen en çılgın bilim sorularını sorabilirsin.',
    'modal.start': 'Keşfetmeye Başla!',
    'footer': '© 2024 MiniLab Kids. Merak etmeye devam et! ✨'
  },
  en: {
    'nav.home': 'Home',
    'nav.minibot': 'MiniBot',
    'hero.title': 'Ready to Explore?',
    'hero.subtitle': 'Welcome to a world full of science, space, and technology!',
    'btn.about': 'About Us',
    'btn.generate': 'Find Experiments',
    'search.placeholder': 'Search cards (e.g., space, robot, experiment)...',
    'filter.all': 'All',
    'filter.category': 'Category:',
    'filter.age': 'Age Group:',
    'cat.Physics': 'Physics',
    'cat.Chemistry': 'Chemistry',
    'cat.Biology': 'Biology',
    'cat.Astronomy': 'Space',
    'cat.Technology': 'Tech',
    'cat.AI': 'AI',
    'cat.Environment': 'Env. Science',
    'cat.Robotics': 'Robotics',
    'card.learn': 'Learn',
    'card.experiment': 'Experiment',
    'card.simulation': 'Simulation',
    'card.more': 'Learn More',
    'features.tag': 'How it Works',
    'features.title': '3 Ways to Learn with MiniLab',
    'features.cards.title': 'Fun Learning Cards',
    'features.cards.desc': 'Discover everything from space to dinosaurs with colorful cards. Just read and learn!',
    'features.experiments.title': 'Crazy Experiments',
    'features.experiments.desc': 'Turn your kitchen into a lab! Learn science by doing with safe and easy recipes.',
    'features.minibot.title': 'MiniBot Assistant',
    'features.minibot.desc': 'Ask your robot friend any question. It is always ready to chat with you!',
    'gen.title': '🧪 Create Your Experiment!',
    'gen.desc': 'Choose below to find fun and safe experiments you can do at home.',
    'gen.loading': 'Thinking...',
    'gen.history': 'Your Recent Experiments 📜',
    'gen.result': 'Ideas for You:',
    'minibot.title': 'MiniBot Assistant',
    'minibot.subtitle': 'Your Science Buddy',
    'minibot.input': 'Type your question here...',
    'minibot.anim': 'Animation:',
    'minibot.style': 'Style:',
    'minibot.style.default': 'Classic',
    'minibot.style.fancy': 'Fancy',
    'minibot.style.smart': 'Smart',
    'minibot.style.worker': 'Engineer',
    'minibot.style.royal': 'Royal',
    'minibot.eyes': 'Eyes:',
    'minibot.eyes.normal': 'Normal',
    'minibot.eyes.big': 'Big',
    'minibot.eyes.sparkling': 'Sparkling',
    'minibot.eyes.curious': 'Curious',
    'minibot.intro': 'Hello! I am MiniBot! 🤖 You can ask me anything about science. What would you like to discover today?',
    'modal.welcome': 'Welcome to MiniLab Kids!',
    'modal.mission': 'Our Mission',
    'modal.mission.desc': 'To answer your curious questions, perform safe experiments, and show how fun science can be!',
    'modal.minibot': 'Meet MiniBot!',
    'modal.minibot.desc': 'It is your AI assistant. Go to the "MiniBot" page and ask it your craziest science questions.',
    'modal.start': 'Start Exploring!',
    'footer': '© 2024 MiniLab Kids. Keep being curious! ✨'
  }
};

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export const I18nProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('tr');

  useEffect(() => {
    const savedLang = localStorage.getItem('appLanguage') as Language;
    if (savedLang) setLanguage(savedLang);
  }, []);

  const toggleLanguage = () => {
    const newLang = language === 'tr' ? 'en' : 'tr';
    setLanguage(newLang);
    localStorage.setItem('appLanguage', newLang);
  };

  const t = (key: string): string => {
    // @ts-ignore
    return translations[language][key] || key;
  };

  return (
    <I18nContext.Provider value={{ language, toggleLanguage, t }}>
      {children}
    </I18nContext.Provider>
  );
};

export const useI18n = () => {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return context;
};
