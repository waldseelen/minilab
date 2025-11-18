// Çocuk Dostu Öğretici Bilgi Kartları Müfredatı

export interface LearningCard {
  id: string;
  title: string;
  content: string;
  category: 'Physics' | 'Chemistry' | 'Biology' | 'Environmental Science' | 'Engineering' | 'Astronomy' | 'Technology' | 'AI';
  ageGroup: '4-6' | '6-8' | '8-10';
  level: number; // Öğrenme sırası (1'den başlar)
  duration: string;
  imageUrl: string;
  schemaUrl?: string;
  videoUrl?: string;
  keyWords: string[];
  funFacts: string[];
  quiz?: QuizQuestion[];
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

// FİZİK MÜFREDATı
const physicsCards: LearningCard[] = [
  // 4-6 Yaş Fizik
  {
    id: 'physics_4_1',
    title: 'Renkler Neler?',
    content: 'Dünyada çok güzel renkler var! Kırmızı elma, sarı güneş, mavi gökyüzü... Her rengin bir ismi var ve çok özeldir! 🌈',
    category: 'Physics',
    ageGroup: '4-6',
    level: 1,
    duration: '5 dakika',
    imageUrl: '/learning/physics/colors.svg',
    keyWords: ['Renk', 'Kırmızı', 'Sarı', 'Mavi'],
    funFacts: ['Gökkuşağında 7 ana renk vardır!', 'Kedi ve köpekler bazı renkleri göremez!'],
    quiz: [{
      question: 'Güneş hangi renktedir?',
      options: ['🔴 Kırmızı', '🟡 Sarı', '🔵 Mavi', '🟢 Yeşil'],
      correctAnswer: 1,
      explanation: 'Güneş sarı renktedir ve bize ışık verir! ☀️'
    }]
  },
  {
    id: 'physics_4_2',
    title: 'Büyük ve Küçük',
    content: 'Bazı şeyler çok büyük, bazıları çok küçük! Fil büyük, karınca küçük. Sen de büyüyorsun! 📏',
    category: 'Physics',
    ageGroup: '4-6',
    level: 2,
    duration: '5 dakika',
    imageUrl: '/learning/physics/size.svg',
    keyWords: ['Büyük', 'Küçük', 'Boyut', 'Karşılaştırma'],
    funFacts: ['En büyük hayvan mavi balina!', 'En küçük kuş sinekkuşu!']
  },
  
  // 6-8 Yaş Fizik
  {
    id: 'physics_6_1',
    title: 'Işık Nedir?',
    content: 'Işık etrafımızı aydınlatan harika bir şey! Güneşten, ampulden, mumdan gelir. Işık olmasaydı hiçbir şey göremezdik! 💡',
    category: 'Physics',
    ageGroup: '6-8',
    level: 1,
    duration: '8 dakika',
    imageUrl: '/learning/physics/light.svg',
    schemaUrl: '/schemas/light_sources.svg',
    keyWords: ['Işık', 'Aydınlatma', 'Güneş', 'Ampul'],
    funFacts: ['Işık çok hızlı hareket eder!', 'Prizma ile gökkuşağı yapabilirsin!'],
    quiz: [{
      question: 'Hangi şey ışık verir?',
      options: ['🌙 Ay', '☀️ Güneş', '🪨 Taş', '📚 Kitap'],
      correctAnswer: 1,
      explanation: 'Güneş kendi ışığını üretir! Ay güneşin ışığını yansıtır.'
    }]
  },
  {
    id: 'physics_6_2',
    title: 'Ses Nasıl Çıkar?',
    content: 'Konuştuğunda, şarkı söylediğinde ses çıkar! Ses titreşimle oluşur. Kulağın sesi yakalar! 🔊',
    category: 'Physics',
    ageGroup: '6-8',
    level: 2,
    duration: '8 dakika',
    imageUrl: '/learning/physics/sound.svg',
    keyWords: ['Ses', 'Titreşim', 'Kulak', 'Müzik'],
    funFacts: ['Yunuslar ses ile konuşur!', 'Uzayda ses yoktur!']
  },

  // 8-10 Yaş Fizik
  {
    id: 'physics_8_1',
    title: 'Enerji Nedir?',
    content: 'Enerji hareket etmek için gereken güç! Koşmak için enerjin olmalı. Elektrik de bir enerji türü! ⚡',
    category: 'Physics',
    ageGroup: '8-10',
    level: 1,
    duration: '10 dakika',
    imageUrl: '/learning/physics/energy.svg',
    schemaUrl: '/schemas/energy_types.svg',
    keyWords: ['Enerji', 'Elektrik', 'Hareket', 'Güç'],
    funFacts: ['Enerji kaybolmaz, şekil değiştirir!', 'Güneş panelleri ışığı elektriğe çevirir!'],
    quiz: [{
      question: 'Hangi şey enerjiye örnek değildir?',
      options: ['⚡ Elektrik', '🔥 Ateş', '🌊 Hareket', '📖 Kitap'],
      correctAnswer: 3,
      explanation: 'Kitap enerji değil, bilgi içerir! Diğerleri enerji türleridir.'
    }]
  }
];

// KİMYA MÜFREDATı
const chemistryCards: LearningCard[] = [
  // 4-6 Yaş Kimya
  {
    id: 'chemistry_4_1',
    title: 'Su Çok Önemli!',
    content: 'Su içeriz, yıkanırız, bitkiler büyür! Su katı (buz), sıvı (su), gaz (buhar) olabilir! 💧',
    category: 'Chemistry',
    ageGroup: '4-6',
    level: 1,
    duration: '5 dakika',
    imageUrl: '/learning/chemistry/water.svg',
    keyWords: ['Su', 'Buz', 'Buhar', 'İçmek'],
    funFacts: ['Vücut %70 su!', 'Su renksiz ve kokusuz!']
  },
  {
    id: 'chemistry_4_2',
    title: 'Tatlı ve Tuzlu',
    content: 'Yemeklerin farklı tatları var! Şeker tatlı, tuz tuzlu. Dilimizle tatları anlayız! 👅',
    category: 'Chemistry',
    ageGroup: '4-6',
    level: 2,
    duration: '5 dakika',
    imageUrl: '/learning/chemistry/taste.svg',
    keyWords: ['Tat', 'Şeker', 'Tuz', 'Dil'],
    funFacts: ['5 temel tat var!', 'Her dilin farklı yerleri farklı tatlar hisseder!']
  },

  // 6-8 Yaş Kimya
  {
    id: 'chemistry_6_1',
    title: 'Her Şey Atomlardan Yapılmış!',
    content: 'Sen, ben, masa, sandalye... Her şey çok küçük parçacıklardan oluşur. Bunlara atom denir! ⚛️',
    category: 'Chemistry',
    ageGroup: '6-8',
    level: 1,
    duration: '8 dakika',
    imageUrl: '/learning/chemistry/atoms.svg',
    schemaUrl: '/schemas/atom_structure.svg',
    keyWords: ['Atom', 'Parçacık', 'Madde', 'Küçük'],
    funFacts: ['Atomlar çok çok küçük!', 'Farklı atomlar farklı maddeler oluşturur!'],
    quiz: [{
      question: 'Her şey neye yapılmıştır?',
      options: ['🧱 Tuğla', '⚛️ Atom', '🍯 Bal', '🌟 Yıldız'],
      correctAnswer: 1,
      explanation: 'Her şey atomlardan yapılmıştır! Atomlar çok küçük yapı taşlarıdır.'
    }]
  }
];

// BİYOLOJİ MÜFREDATı
const biologyCards: LearningCard[] = [
  // 4-6 Yaş Biyoloji  
  {
    id: 'biology_4_1',
    title: 'Canlı ve Cansız',
    content: 'Kediler, köpekler, ağaçlar canlı! Nefes alır, büyür, hareket eder. Taş, masa cansız! 🐱',
    category: 'Biology',
    ageGroup: '4-6',
    level: 1,
    duration: '5 dakika',
    imageUrl: '/learning/biology/living.svg',
    keyWords: ['Canlı', 'Cansız', 'Nefes', 'Büyümek'],
    funFacts: ['Bitkiler de canlıdır!', 'Canlılar yemek yer!']
  },
  {
    id: 'biology_4_2',
    title: 'Hayvanların Evleri',
    content: 'Her hayvanın bir evi var! Kuş yuva yapar, karınca yuva, balık suda yaşar! 🏠',
    category: 'Biology',
    ageGroup: '4-6',
    level: 2,
    duration: '5 dakika',
    imageUrl: '/learning/biology/habitats.svg',
    keyWords: ['Ev', 'Yuva', 'Hayvan', 'Yaşam'],
    funFacts: ['Arı kovan yapar!', 'Köpekbalığı okyanusta yaşar!']
  }
];

// ASTRONOMİ MÜFREDATı
const astronomyCards: LearningCard[] = [
  // 4-6 Yaş Astronomi
  {
    id: 'astronomy_4_1',
    title: 'Güneş Çok Büyük!',
    content: 'Güneş çok büyük ve sıcak bir yıldız! Bize ışık ve sıcaklık verir. Güneş olmasaydı çok soğuk olurdu! ☀️',
    category: 'Astronomy',
    ageGroup: '4-6',
    level: 1,
    duration: '5 dakika',
    imageUrl: '/learning/astronomy/sun.svg',
    keyWords: ['Güneş', 'Yıldız', 'Sıcak', 'Işık'],
    funFacts: ['Güneş Dünya\'dan çok çok büyük!', 'Güneş sarı değil, aslında beyaz!']
  },
  {
    id: 'astronomy_4_2',
    title: 'Ay Gece Parlar',
    content: 'Ay gece gökte parlar! Bazen yuvarlak, bazen hilal şeklinde görünür. Ay kendi ışığını yapmaz! 🌙',
    category: 'Astronomy',
    ageGroup: '4-6',
    level: 2,
    duration: '5 dakika',
    imageUrl: '/learning/astronomy/moon.svg',
    keyWords: ['Ay', 'Gece', 'Hilal', 'Parlamak'],
    funFacts: ['Ay Güneş\'in ışığını yansıtır!', 'Ay\'da dağlar var!']
  },
  {
    id: 'astronomy_4_3',
    title: 'Yıldızlar Pırıl Pırıl!',
    content: 'Gece gökte bir sürü yıldız var! Pırıl pırıl parlıyorlar. Hepsi çok uzakta ama çok güzeller! ⭐',
    category: 'Astronomy',
    ageGroup: '4-6',
    level: 3,
    duration: '5 dakika',
    imageUrl: '/learning/astronomy/stars.svg',
    keyWords: ['Yıldız', 'Pırıl pırıl', 'Gece', 'Uzak'],
    funFacts: ['En parlak yıldızı Sirius!', 'Yıldızlar farklı renklerde olabilir!']
  },
  {
    id: 'astronomy_4_4',
    title: 'Roket Uzaya Gider!',
    content: 'Roketler çok hızlı uzaya çıkar! Astronotlar roketle uzay istasyonuna gider. Sen de astronot olmak ister misin? 🚀',
    category: 'Astronomy',
    ageGroup: '4-6',
    level: 4,
    duration: '6 dakika',
    imageUrl: '/learning/astronomy/rocket.svg',
    keyWords: ['Roket', 'Uzay', 'Astronot', 'Hızlı'],
    funFacts: ['Roketler çok yüksek sesle çıkar!', 'Uzayda ağırlık yoktur!']
  },

  // 6-8 Yaş Astronomi  
  {
    id: 'astronomy_6_1',
    title: 'Uzay Çok Büyük!',
    content: 'Uzay çok çok büyük ve sonsuz! İçinde milyarlarca yıldız, gezegen var. Biz Dünya\'da yaşıyoruz! 🚀',
    category: 'Astronomy',
    ageGroup: '6-8',
    level: 1,
    duration: '8 dakika',
    imageUrl: '/learning/astronomy/space.svg',
    schemaUrl: '/schemas/solar_system_simple.svg',
    keyWords: ['Uzay', 'Sonsuz', 'Yıldız', 'Gezegen'],
    funFacts: ['Uzayda milyarlarca galaksi var!', 'En yakın yıldız 4 ışık yılı uzakta!'],
    quiz: [{
      question: 'Hangi gezegenden yaşıyoruz?',
      options: ['🌍 Dünya', '🔴 Mars', '🪐 Satürn', '☀️ Güneş'],
      correctAnswer: 0,
      explanation: 'Bizim evimiz Dünya! Mavi ve yeşil güzel gezegenimiz.'
    }]
  },
  {
    id: 'astronomy_6_2',
    title: 'Güneş Sistemi Ailesi',
    content: 'Güneş sistemimizde 8 gezegen var! Merkür, Venüs, Dünya, Mars, Jüpiter, Satürn, Uranüs, Neptün. Hepsi Güneş\'in etrafında döner! 🌍',
    category: 'Astronomy',
    ageGroup: '6-8',
    level: 2,
    duration: '10 dakika',
    imageUrl: '/learning/astronomy/solar_system.svg',
    schemaUrl: '/schemas/planets_order.svg',
    keyWords: ['Güneş Sistemi', '8 Gezegen', 'Merkür', 'Venüs'],
    funFacts: ['Jüpiter en büyük gezegen!', 'Satürn\'ün güzel halkaları var!'],
    quiz: [{
      question: 'Güneş sisteminde kaç gezegen vardır?',
      options: ['6 tane', '7 tane', '8 tane', '9 tane'],
      correctAnswer: 2,
      explanation: 'Güneş sisteminde 8 gezegen var. Plüto artık gezegen sayılmaz!'
    }]
  },
  {
    id: 'astronomy_6_3',
    title: 'Galaksimiz Samanyolu',
    content: 'Samanyolu bizim galaksimiz! İçinde milyarlarca yıldız var. Gece gökte parlak şerit gibi görünür! 🌌',
    category: 'Astronomy',
    ageGroup: '6-8',
    level: 3,
    duration: '10 dakika',
    imageUrl: '/learning/astronomy/milky_way.svg',
    keyWords: ['Samanyolu', 'Galaksi', 'Milyarlarca yıldız', 'Şerit'],
    funFacts: ['Samanyolu spiral şeklinde!', 'Çapı 100,000 ışık yılı!']
  },

  // 8-10 Yaş Astronomi
  {
    id: 'astronomy_8_1',
    title: 'Kara Delikler Gizemli!',
    content: 'Kara delikler uzayın en gizemli yerleri! Çok güçlü çekim gücü var, hiçbir şey kaçamaz. Işık bile! ⚫',
    category: 'Astronomy',
    ageGroup: '8-10',
    level: 1,
    duration: '12 dakika',
    imageUrl: '/learning/astronomy/black_hole.svg',
    schemaUrl: '/schemas/black_hole.svg',
    keyWords: ['Kara Delik', 'Çekim Gücü', 'Işık', 'Gizemli'],
    funFacts: ['Kara delikten kaçmak imkansız!', 'Zamanu büker!'],
    quiz: [{
      question: 'Kara delikten ne kaçamaz?',
      options: ['Sadece taşlar', 'Sadece su', 'Hiçbir şey kaçamaz', 'Sadece hava'],
      correctAnswer: 2,
      explanation: 'Kara delikler o kadar güçlü ki hiçbir şey, hatta ışık bile kaçamaz!'
    }]
  },
  {
    id: 'astronomy_8_2',
    title: 'Uzay İstasyonu Yaşam',
    content: 'Uluslararası Uzay İstasyonu\'nda astronotlar yaşar! Dünya\'nın etrafında dolanır ve bilim deneyleri yapar! 🛸',
    category: 'Astronomy',
    ageGroup: '8-10',
    level: 2,
    duration: '15 dakika',
    imageUrl: '/learning/astronomy/space_station.svg',
    keyWords: ['Uzay İstasyonu', 'Astronot', 'Bilim', 'Deneyle'],
    funFacts: ['90 dakikada Dünya\'yı dolaşır!', 'İçinde ağırlıksızlık var!']
  }
];

// TEKNOLOJİ MÜFREDATı
const technologyCards: LearningCard[] = [
  // 4-6 Yaş Teknoloji
  {
    id: 'tech_4_1',
    title: 'Telefon Nasıl Konuşturur?',
    content: 'Telefon çok uzaktaki insanlarla konuşmamızı sağlar! Sesimizi elektrik sinyaline çevirir! 📱',
    category: 'Technology',
    ageGroup: '4-6',
    level: 1,
    duration: '5 dakika',
    imageUrl: '/learning/technology/phone.svg',
    keyWords: ['Telefon', 'Konuşmak', 'Elektrik', 'Sinyal'],
    funFacts: ['İlk telefonu Bell icat etti!', 'Telefonlar eskiden çok büyüktü!']
  },
  {
    id: 'tech_4_2',
    title: 'Araba Nasıl Hareket Eder?',
    content: 'Arabalar motor sayesinde hareket eder! Motor benzini enerjiye çevirir ve tekerlekleri döndürür! 🚗',
    category: 'Technology',
    ageGroup: '4-6',
    level: 2,
    duration: '6 dakika',
    imageUrl: '/learning/technology/car.svg',
    keyWords: ['Araba', 'Motor', 'Benzin', 'Tekerlek'],
    funFacts: ['İlk araba at arabasından hızlıydı!', 'Elektrikli arabalar da var!']
  },
  {
    id: 'tech_4_3',
    title: 'Televizyon Nasıl Görüntü Verir?',
    content: 'Televizyon elektrik sinyalleriyle uzaktaki görüntüleri bize getirir! Renkli resimler yapar! 📺',
    category: 'Technology',
    ageGroup: '4-6',
    level: 3,
    duration: '5 dakika',
    imageUrl: '/learning/technology/tv.svg',
    keyWords: ['Televizyon', 'Görüntü', 'Elektrik', 'Renkli'],
    funFacts: ['İlk televizyon siyah beyazdı!', 'TV\'deki görüntü çok hızlı değişir!']
  },

  // 6-8 Yaş Teknoloji
  {
    id: 'tech_6_1',
    title: 'Bilgisayar Nasıl Çalışır?',
    content: 'Bilgisayar çok hızlı hesap yapan akıllı makine! 0 ve 1 sayılarını kullanarak her şeyi anlar! 💻',
    category: 'Technology',
    ageGroup: '6-8',
    level: 1,
    duration: '8 dakika',
    imageUrl: '/learning/technology/computer.svg',
    keyWords: ['Bilgisayar', 'Hesap', '0 ve 1', 'Akıllı'],
    funFacts: ['İlk bilgisayar oda büyüklüğündeydi!', 'Bilgisayarlar saniyede milyonlarca işlem yapar!']
  },
  {
    id: 'tech_6_2',
    title: 'İnternet Dünyayı Bağlar',
    content: 'İnternet dünyadaki tüm bilgisayarları birbirine bağlar! Bilgi paylaşmak için kullanırız! 🌐',
    category: 'Technology',
    ageGroup: '6-8',
    level: 2,
    duration: '10 dakika',
    imageUrl: '/learning/technology/internet.svg',
    schemaUrl: '/schemas/internet_connection.svg',
    keyWords: ['İnternet', 'Bağlantı', 'Dünya', 'Bilgi'],
    funFacts: ['İnternet 1960\'larda icat edildi!', 'Saniyede milyonlarca mesaj gönderilir!'],
    quiz: [{
      question: 'İnternet ne yapar?',
      options: ['Yemek pişirir', 'Bilgisayarları bağlar', 'Müzik çalar', 'Resim çizer'],
      correctAnswer: 1,
      explanation: 'İnternet tüm dünyada bilgisayarları birbirine bağlar!'
    }]
  },
  {
    id: 'tech_6_3',
    title: 'Robot Yardımcılar',
    content: 'Robotlar insanlara yardım eder! Ev temizler, fabrikada çalışır, hatta uzaya gider! 🤖',
    category: 'Technology',
    ageGroup: '6-8',
    level: 3,
    duration: '8 dakika',
    imageUrl: '/learning/technology/robot.svg',
    keyWords: ['Robot', 'Yardım', 'Fabrika', 'Uzay'],
    funFacts: ['Bazı robotlar köpek gibi yürür!', 'Robotlar yorulmaz!']
  },
  {
    id: 'tech_6_4',
    title: 'Uydu Teknolojisi',
    content: 'Uydular uzaydan Dünya\'yı izler! Hava durumu, haberleşme ve navigasyon için kullanılır! 📡',
    category: 'Technology',
    ageGroup: '6-8',
    level: 4,
    duration: '10 dakika',
    imageUrl: '/learning/technology/satellite.svg',
    keyWords: ['Uydu', 'Uzay', 'Hava durumu', 'Navigasyon'],
    funFacts: ['GPS uyduları sayesinde çalışır!', 'Binlerce uydu Dünya\'nın etrafında döner!']
  },

  // 8-10 Yaş Teknoloji
  {
    id: 'tech_8_1',
    title: 'Kodlama ve Programlama',
    content: 'Kodlama bilgisayara ne yapacağını söyleme sanatı! Özel dille talimatlar veririz! 💾',
    category: 'Technology',
    ageGroup: '8-10',
    level: 1,
    duration: '12 dakika',
    imageUrl: '/learning/technology/coding.svg',
    schemaUrl: '/schemas/programming_flow.svg',
    keyWords: ['Kodlama', 'Program', 'Talimat', 'Dil'],
    funFacts: ['İlk programcı Ada Lovelace bir kadındı!', 'Bugün 700\'den fazla programlama dili var!'],
    quiz: [{
      question: 'Kodlama nedir?',
      options: ['Gizli yazı yazma', 'Bilgisayara talimat verme', 'Oyun oynama', 'Resim çizme'],
      correctAnswer: 1,
      explanation: 'Kodlama, bilgisayara hangi işlemleri yapacağını söyleme yoludur!'
    }]
  },
  {
    id: 'tech_8_2',
    title: 'Sanal Gerçeklik (VR)',
    content: 'VR gözlüğüyle bambaşka dünyalara gidebiliriz! Bilgisayar sanal ortam yaratır! 🥽',
    category: 'Technology',
    ageGroup: '8-10',
    level: 2,
    duration: '10 dakika',
    imageUrl: '/learning/technology/vr.svg',
    keyWords: ['VR', 'Sanal Gerçeklik', 'Gözlük', 'Sanal Ortam'],
    funFacts: ['VR ile Mars\'ta yürüyebiliriz!', 'Doktorlar VR ile ameliyat pratiği yapar!']
  },
  {
    id: 'tech_8_3',
    title: '3D Yazıcılar Yaratır',
    content: '3D yazıcılar plastikten gerçek nesneler yapar! Bilgisayardaki tasarımı fiziksel objeye dönüştürür! 🖨️',
    category: 'Technology',
    ageGroup: '8-10',
    level: 3,
    duration: '12 dakika',
    imageUrl: '/learning/technology/3d_printer.svg',
    keyWords: ['3D Yazıcı', 'Plastik', 'Nesne', 'Tasarım'],
    funFacts: ['3D yazıcıyla ev bile yapılabiliyor!', 'Uzayda da 3D yazıcı kullanılıyor!']
  }
];

// YAPAY ZEKA MÜFREDATı
const aiCards: LearningCard[] = [
  // 6-8 Yaş AI
  {
    id: 'ai_6_1',
    title: 'Akıllı Oyuncaklar',
    content: 'Bazı oyuncaklar çok akıllı! Seninle konuşur, sorularını yanıtlar. Bunlar küçük bilgisayarlı oyuncaklar! 🧸',
    category: 'AI',
    ageGroup: '6-8',
    level: 1,
    duration: '6 dakika',
    imageUrl: '/learning/ai/smart_toys.svg',
    keyWords: ['Akıllı Oyuncak', 'Konuşmak', 'Bilgisayar', 'Sorular'],
    funFacts: ['Alexa ve Siri yapay zeka kullanır!', 'Akıllı oyuncaklar öğrenebilir!']
  },
  {
    id: 'ai_6_2',
    title: 'Telefondaki Akıllı Asistan',
    content: 'Telefonda "Hey Siri" deyince seni dinleyen akıllı asistan! Sorularını yanıtlar ve yardım eder! 📱',
    category: 'AI',
    ageGroup: '6-8',
    level: 2,
    duration: '8 dakika',
    imageUrl: '/learning/ai/phone_assistant.svg',
    keyWords: ['Akıllı Asistan', 'Siri', 'Dinlemek', 'Yardım'],
    funFacts: ['Milyonlarca kişi akıllı asistan kullanır!', 'Sesini tanıyabilir!']
  },

  // 8-10 Yaş AI
  {
    id: 'ai_8_1',
    title: 'Yapay Zeka Nedir?',
    content: 'Yapay zeka bilgisayarlara düşünmeyi öğreten teknoloji! Tıpkı sen nasıl öğreniyorsan, onlar da öğrenir! 🤖',
    category: 'AI',
    ageGroup: '8-10',
    level: 1,
    duration: '10 dakika',
    imageUrl: '/learning/ai/what_is_ai.svg',
    schemaUrl: '/schemas/ai_learning.svg',
    keyWords: ['Yapay Zeka', 'Öğrenme', 'Düşünme', 'Bilgisayar'],
    funFacts: ['AI oyun oynamayı öğrenebilir!', 'AI resim ve müzik yapabilir!'],
    quiz: [{
      question: 'Yapay zeka neyi taklit eder?',
      options: ['🏃 Koşmak', '🧠 Düşünmek', '🎵 Şarkı söylemek', '🎨 Resim yapmak'],
      correctAnswer: 1,
      explanation: 'Yapay zeka insan beyninin düşünme yeteneğini taklit eder!'
    }]
  },
  {
    id: 'ai_8_2',
    title: 'Makine Öğrenmesi',
    content: 'Makineler bizim gibi deneyerek öğrenebilir! Çok veri görüp kalıpları keşfeder! 📊',
    category: 'AI',
    ageGroup: '8-10',
    level: 2,
    duration: '12 dakika',
    imageUrl: '/learning/ai/machine_learning.svg',
    keyWords: ['Makine Öğrenmesi', 'Veri', 'Kalıp', 'Deneyim'],
    funFacts: ['AI milyonlarca örnek görerek öğrenir!', 'Netflix öneriler yapar!'],
    quiz: [{
      question: 'Makine öğrenmesi nasıl çalışır?',
      options: ['Kitap okuyarak', 'Çok veri görerek', 'Uyuyarak', 'Yürüyerek'],
      correctAnswer: 1,
      explanation: 'Makineler milyonlarca veri örneği görerek kalıpları öğrenir!'
    }]
  },
  {
    id: 'ai_8_3',
    title: 'AI Sanatçı mı?',
    content: 'Yapay zeka artık resim yapıyor, müzik besteliyiyor! İnsanlar gibi yaratıcı olabiliyor! 🎨',
    category: 'AI',
    ageGroup: '8-10',
    level: 3,
    duration: '10 dakika',
    imageUrl: '/learning/ai/ai_art.svg',
    keyWords: ['AI Sanat', 'Resim', 'Müzik', 'Yaratıcı'],
    funFacts: ['AI tabloları müzede sergileniyor!', 'AI şarkıları dinleyebiliriz!']
  },
  {
    id: 'ai_8_4',
    title: 'Gelecekteki AI',
    content: 'Gelecekte AI daha akıllı olacak! Robotlar evimizde, okulda, hastanede bize yardım edecek! 🚀',
    category: 'AI',
    ageGroup: '8-10',
    level: 4,
    duration: '12 dakika',
    imageUrl: '/learning/ai/future_ai.svg',
    schemaUrl: '/schemas/ai_future.svg',
    keyWords: ['Gelecek', 'Akıllı Robot', 'Yardım', 'Hastane'],
    funFacts: ['AI doktorlara teşhis koyma yardımı ediyor!', 'Kendi kendine giden arabalar geliyor!']
  }
];

// ÇEVRE BİLİMİ MÜFREDATı
const environmentalScienceCards: LearningCard[] = [
  // 4-6 Yaş Çevre Bilimi
  {
    id: 'env_4_1',
    title: 'Ağaçlar Neden Önemli?',
    content: 'Ağaçlar bizim en iyi arkadaşımız! Temiz hava verir, gölge yapar, kuşlara ev olur! 🌳',
    category: 'Environmental Science',
    ageGroup: '4-6',
    level: 1,
    duration: '5 dakika',
    imageUrl: '/learning/environment/trees.svg',
    keyWords: ['Ağaç', 'Temiz hava', 'Gölge', 'Kuş'],
    funFacts: ['Bir ağaç günde 4 kişinin nefes alacağı oksijen üretir!', 'En yaşlı ağaç 5000 yaşında!']
  },
  {
    id: 'env_4_2',
    title: 'Su Çok Değerli!',
    content: 'Su olmadan yaşayamayız! İçeriz, yıkanırız, bitkiler büyür. Suyu boşa harcamayalım! 💧',
    category: 'Environmental Science',
    ageGroup: '4-6',
    level: 2,
    duration: '5 dakika',
    imageUrl: '/learning/environment/water.svg',
    keyWords: ['Su', 'Yaşam', 'Bitki', 'Tasarruf'],
    funFacts: ['Dünya\'nın %71\'i suyla kaplı!', 'İnsan vücut %60 su!']
  },
  {
    id: 'env_4_3',
    title: 'Hayvanların Evi',
    content: 'Her hayvanın özel bir evi var! Arı kovanda, balık suda, kuş ağaçta yaşar! 🏠',
    category: 'Environmental Science',
    ageGroup: '4-6',
    level: 3,
    duration: '6 dakika',
    imageUrl: '/learning/environment/animal_homes.svg',
    keyWords: ['Hayvan', 'Ev', 'Kovan', 'Su'],
    funFacts: ['Sincaplar ağaçta yuva yapar!', 'Kunduzlar su barajı yapar!']
  },

  // 6-8 Yaş Çevre Bilimi
  {
    id: 'env_6_1',
    title: 'Geri Dönüşüm Nedir?',
    content: 'Geri dönüşümle çöplerden yeni şeyler yaparız! Plastik şişe yeni kıyafet olabilir! ♻️',
    category: 'Environmental Science',
    ageGroup: '6-8',
    level: 1,
    duration: '8 dakika',
    imageUrl: '/learning/environment/recycling.svg',
    schemaUrl: '/schemas/recycling_process.svg',
    keyWords: ['Geri Dönüşüm', 'Çöp', 'Plastik', 'Yeni'],
    funFacts: ['1 ton kağıt geri dönüştürülürse 17 ağaç kesilmez!', 'Cam sonsuza kadar geri dönüştürülebilir!'],
    quiz: [{
      question: 'Hangi malzeme geri dönüştürülebilir?',
      options: ['🗞️ Kağıt', '🍎 Meyve', '🧸 Oyuncak', '✏️ Kalem'],
      correctAnswer: 0,
      explanation: 'Kağıt geri dönüştürülerek yeni kağıtlar yapılabilir!'
    }]
  },
  {
    id: 'env_6_2',
    title: 'Sera Etkisi Nedir?',
    content: 'Dünya\'nın etrafında görünmez bir battaniye var! Bu battaniye çok kalınlaşırsa gezegen ısınır! 🌡️',
    category: 'Environmental Science',
    ageGroup: '6-8',
    level: 2,
    duration: '10 dakika',
    imageUrl: '/learning/environment/greenhouse.svg',
    keyWords: ['Sera Etkisi', 'Battaniye', 'Isınma', 'Gezegen'],
    funFacts: ['CO2 sera gazıdır!', 'Arabalar sera gazı çıkarır!']
  },
  {
    id: 'env_6_3',
    title: 'Temiz Enerji Kaynakları',
    content: 'Güneş, rüzgar ve su enerjisi temiz! Doğaya zarar vermeden elektrik üretir! ⚡',
    category: 'Environmental Science',
    ageGroup: '6-8',
    level: 3,
    duration: '10 dakika',
    imageUrl: '/learning/environment/clean_energy.svg',
    keyWords: ['Temiz Enerji', 'Güneş', 'Rüzgar', 'Su'],
    funFacts: ['Güneş panelleri 25 yıl çalışır!', 'Bir rüzgar türbini 1500 evin elektriğini karşılar!']
  },

  // 8-10 Yaş Çevre Bilimi
  {
    id: 'env_8_1',
    title: 'İklim Değişikliği',
    content: 'Dünya\'nın iklimi değişiyor! İnsanların faaliyetleri sera gazlarını artırıyor! 🌍',
    category: 'Environmental Science',
    ageGroup: '8-10',
    level: 1,
    duration: '12 dakika',
    imageUrl: '/learning/environment/climate_change.svg',
    schemaUrl: '/schemas/climate_change.svg',
    keyWords: ['İklim Değişikliği', 'Sera Gazı', 'İnsan', 'Faaliyet'],
    funFacts: ['Son 100 yılda Dünya 1°C ısındı!', 'Kutup buzları eriyor!'],
    quiz: [{
      question: 'İklim değişikliğine ne sebep olur?',
      options: ['🌳 Ağaç dikmek', '🏭 Fabrika gazları', '💧 Su içmek', '🌞 Güneş'],
      correctAnswer: 1,
      explanation: 'Fabrikaların çıkardığı gazlar sera etkisini artırır!'
    }]
  },
  {
    id: 'env_8_2',
    title: 'Biyolojik Çeşitlilik',
    content: 'Dünya\'da milyonlarca farklı canlı var! Bu çeşitlilik doğal dengeyi korur! 🦋',
    category: 'Environmental Science',
    ageGroup: '8-10',
    level: 2,
    duration: '10 dakika',
    imageUrl: '/learning/environment/biodiversity.svg',
    keyWords: ['Biyolojik Çeşitlilik', 'Canlı', 'Denge', 'Koruma'],
    funFacts: ['Her gün 150 tür yok oluyor!', 'Arılar olmasa meyve yetişmez!']
  }
];

// MÜHENDİSLİK MÜFREDATı  
const engineeringCards: LearningCard[] = [
  // 4-6 Yaş Mühendislik
  {
    id: 'eng_4_1',
    title: 'Köprüler Nasıl Durur?',
    content: 'Köprüler çok güçlü! Ağır arabaları taşır ama yıkılmaz. Mühendisler özel tasarım yapar! 🌉',
    category: 'Engineering',
    ageGroup: '4-6',
    level: 1,
    duration: '6 dakika',
    imageUrl: '/learning/engineering/bridges.svg',
    keyWords: ['Köprü', 'Güçlü', 'Tasarım', 'Mühendis'],
    funFacts: ['En uzun köprü 165 km!', 'Köprüler rüzgarda sallanır!']
  },
  {
    id: 'eng_4_2',
    title: 'Evler Nasıl Yapılır?',
    content: 'Evleri mühendisler tasarlar! Güçlü temel, sağlam duvarlar, güzel çatı yaparlar! 🏠',
    category: 'Engineering',
    ageGroup: '4-6',
    level: 2,
    duration: '5 dakika',
    imageUrl: '/learning/engineering/houses.svg',
    keyWords: ['Ev', 'Temel', 'Duvar', 'Çatı'],
    funFacts: ['En yüksek bina 828 metre!', 'Eskimolar buzdan ev yapar!']
  },
  {
    id: 'eng_4_3',
    title: 'Makineler Nasıl Çalışır?',
    content: 'Makinelerin içinde dişliler, kayışlar var! Birlikte çalışarak büyük güç yaratır! ⚙️',
    category: 'Engineering',
    ageGroup: '4-6',
    level: 3,
    duration: '6 dakika',
    imageUrl: '/learning/engineering/machines.svg',
    keyWords: ['Makine', 'Dişli', 'Kayış', 'Güç'],
    funFacts: ['Dişliler 5000 yıl önce icat edildi!', 'Saat de makine!']
  },

  // 6-8 Yaş Mühendislik
  {
    id: 'eng_6_1',
    title: 'Kaldıraç Gücü',
    content: 'Kaldıraçla çok ağır şeyleri kaldırabiliriz! Küçük güçle büyük yük taşır! 💪',
    category: 'Engineering',
    ageGroup: '6-8',
    level: 1,
    duration: '8 dakika',
    imageUrl: '/learning/engineering/lever.svg',
    schemaUrl: '/schemas/lever_physics.svg',
    keyWords: ['Kaldıraç', 'Ağır', 'Güç', 'Yük'],
    funFacts: ['Arşimed "Bana bir kaldıraç ver, dünyayı kaldırayım" demiş!', 'Makas da kaldıraç!'],
    quiz: [{
      question: 'Kaldıraç ne yapar?',
      options: ['Işık yapar', 'Güçü artırır', 'Su ısıtır', 'Ses çıkarır'],
      correctAnswer: 1,
      explanation: 'Kaldıraç küçük gücü büyük güce dönüştürür!'
    }]
  },
  {
    id: 'eng_6_2',
    title: 'Tekerlek İcadı',
    content: 'Tekerlek en önemli icat! Ağır yükleri kolayca taşımamızı sağlar! 🛞',
    category: 'Engineering',
    ageGroup: '6-8',
    level: 2,
    duration: '8 dakika',
    imageUrl: '/learning/engineering/wheel.svg',
    keyWords: ['Tekerlek', 'İcat', 'Taşımak', 'Kolay'],
    funFacts: ['5500 yıl önce icat edildi!', 'Yer sürtünmesini azaltır!']
  },
  {
    id: 'eng_6_3',
    title: 'Elektrik Nasıl Gelir?',
    content: 'Elektrik santralden kablolarla evimize gelir! Türbinler dönerek elektrik üretir! ⚡',
    category: 'Engineering',
    ageGroup: '6-8',
    level: 3,
    duration: '10 dakika',
    imageUrl: '/learning/engineering/electricity.svg',
    keyWords: ['Elektrik', 'Santral', 'Kablo', 'Türbin'],
    funFacts: ['Elektrik ışık hızıyla hareket eder!', 'Tesla coil çok güçlü elektrik yapar!']
  },

  // 8-10 Yaş Mühendislik
  {
    id: 'eng_8_1',
    title: 'Yapısal Mühendislik',
    content: 'Yapısal mühendisler gökdelenleri tasarlar! Depreme, rüzgara dayanıklı yapar! 🏗️',
    category: 'Engineering',
    ageGroup: '8-10',
    level: 1,
    duration: '12 dakika',
    imageUrl: '/learning/engineering/structural.svg',
    schemaUrl: '/schemas/building_forces.svg',
    keyWords: ['Yapısal Mühendislik', 'Gökdelen', 'Deprem', 'Dayanıklı'],
    funFacts: ['Burj Khalifa 828 metre yüksek!', 'Gökdelenler sallanmak için tasarlanır!'],
    quiz: [{
      question: 'Yapısal mühendisler neyi hesaplar?',
      options: ['Renkleri', 'Kuvvetleri', 'Sesleri', 'Kokları'],
      correctAnswer: 1,
      explanation: 'Yapısal mühendisler binaların güvenli durması için kuvvetleri hesaplar!'
    }]
  },
  {
    id: 'eng_8_2',
    title: 'Robot Mühendisliği',
    content: 'Robot mühendisleri akıllı makineler yapar! Sensörler, motorlar ve yazılım birleşir! 🤖',
    category: 'Engineering',
    ageGroup: '8-10',
    level: 2,
    duration: '12 dakika',
    imageUrl: '/learning/engineering/robotics.svg',
    keyWords: ['Robot Mühendisliği', 'Sensör', 'Motor', 'Yazılım'],
    funFacts: ['İlk robot 1961\'de fabrikada çalıştı!', 'Cerrahi robotlar ameliyat yapar!']
  },
  {
    id: 'eng_8_3',
    title: 'Havacılık Mühendisliği',
    content: 'Havacılık mühendisleri uçak ve roket yapar! Aerodinamik ve itki sistemleri tasarlar! ✈️',
    category: 'Engineering',
    ageGroup: '8-10',
    level: 3,
    duration: '15 dakika',
    imageUrl: '/learning/engineering/aerospace.svg',
    keyWords: ['Havacılık', 'Uçak', 'Roket', 'Aerodinamik'],
    funFacts: ['Wright Kardeşler ilk uçağı yaptı!', 'Jet motorları saniyede 10.000 devir yapar!']
  }
];

// Tüm kartları birleştir
export const allLearningCards: LearningCard[] = [
  ...physicsCards,
  ...chemistryCards, 
  ...biologyCards,
  ...astronomyCards,
  ...technologyCards,
  ...aiCards,
  ...environmentalScienceCards,
  ...engineeringCards
];

// Kategoriye göre kartları getir
export function getCardsByCategory(category: string): LearningCard[] {
  return allLearningCards.filter(card => card.category === category);
}

// Yaş grubuna göre kartları getir  
export function getCardsByAge(ageGroup: '4-6' | '6-8' | '8-10'): LearningCard[] {
  return allLearningCards.filter(card => card.ageGroup === ageGroup).sort((a, b) => a.level - b.level);
}

// Kategori ve yaş grubuna göre kartları getir
export function getCardsByCategoryAndAge(category: string, ageGroup: '4-6' | '6-8' | '8-10'): LearningCard[] {
  return allLearningCards.filter(card => 
    card.category === category && card.ageGroup === ageGroup
  ).sort((a, b) => a.level - b.level);
}

// Tek bir kart getir
export function getCard(cardId: string): LearningCard | undefined {
  return allLearningCards.find(card => card.id === cardId);
}
