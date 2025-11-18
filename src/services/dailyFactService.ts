// Günlük Bilim Gerçekleri Servisi

export interface DailyFact {
  id: string;
  title: string;
  content: string;
  emoji: string;
  category: string;
  ageGroup: '4-6' | '6-8' | '8-10' | 'All';
}

const dailyFacts: DailyFact[] = [
  {
    id: 'fact_1',
    title: 'Karıncalar Süper Güçlü!',
    content: 'Karıncalar kendi ağırlıklarının 50 katını kaldırabilirler! Bu, bir çocuğun bir arabanın kaldırması gibi! 🚗',
    emoji: '🐜',
    category: 'Biology',
    ageGroup: '4-6'
  },
  {
    id: 'fact_2',
    title: 'Yıldızlar Neden Parlar?',
    content: 'Yıldızlar çok sıcak gazlardan oluşur ve kendi ışıklarını üretirler! Güneş de aslında çok büyük bir yıldız! ⭐',
    emoji: '🌟',
    category: 'Astronomy',
    ageGroup: '6-8'
  },
  {
    id: 'fact_3',
    title: 'Su Aslında Renksizdir!',
    content: 'Denizler mavi görünür çünkü gök mavisi yansır. Temiz su aslında hiç rengi yoktur! 🌊',
    emoji: '💧',
    category: 'Chemistry',
    ageGroup: '4-6'
  },
  {
    id: 'fact_4',
    title: 'Robotlar Nasıl Öğrenir?',
    content: 'Robotlar binlerce örnek görerek öğrenir, tıpkı sen bisiklet sürmeyi öğrenirken düştükçe denediğin gibi! 🤖',
    emoji: '🤖',
    category: 'AI',
    ageGroup: '8-10'
  },
  {
    id: 'fact_5',
    title: 'Kelebekler Ayaklarıyla Tatma!',
    content: 'Kelebekler çiçeklere konduklarında ayaklarıyla tatlı nektarı tadabilirler! 🦋',
    emoji: '🦋',
    category: 'Biology',
    ageGroup: '4-6'
  },
  {
    id: 'fact_6',
    title: 'Işık Çok Hızlı!',
    content: 'Işık 1 saniyede Dünya\'yı 7 kez dolaşabilecek kadar hızlıdır! Şimşek bu yüzden çok hızlı görünür! ⚡',
    emoji: '💡',
    category: 'Physics',
    ageGroup: '6-8'
  },
  {
    id: 'fact_7',
    title: 'Bitkiler Nefes Alır!',
    content: 'Bitkiler gündüz oksijen verir, gece ise nefes alır! Odandaki bitki sana temiz hava verir! 🌱',
    emoji: '🌱',
    category: 'Biology',
    ageGroup: '6-8'
  },
  {
    id: 'fact_8',
    title: 'Buzun Sırrı!',
    content: 'Buz suya göre daha hafiftir, bu yüzden suda yüzer! Bu yüzden buzdağları denizde yüzer! 🧊',
    emoji: '🧊',
    category: 'Chemistry',
    ageGroup: '6-8'
  },
  {
    id: 'fact_9',
    title: 'Çiçekler Rengarenk Neden?',
    content: 'Çiçekler renkli olur çünkü böcekleri çekmek ister! Her rengin bir anlamı var! 🌈',
    emoji: '🌸',
    category: 'Biology',
    ageGroup: '4-6'
  },
  {
    id: 'fact_10',
    title: 'Ses Havadan Hızlı Değil!',
    content: 'Işık sesten çok daha hızlıdır. Bu yüzden şimşeği göründen sonra gök gürültüsünü duyarız! 🌩️',
    emoji: '🔊',
    category: 'Physics',
    ageGroup: '8-10'
  },
  {
    id: 'fact_11',
    title: 'Ay Büyüklüğü Değişir Mi?',
    content: 'Ay aslında hep aynı büyüklükte! Ama bize bazen büyük bazen küçük görünür çünkü güneş ışığı farklı vurar! 🌙',
    emoji: '🌙',
    category: 'Astronomy',
    ageGroup: '6-8'
  },
  {
    id: 'fact_12',
    title: 'Bilgisayarlar İkili Konuşur!',
    content: 'Bilgisayarlar sadece 0 ve 1 rakamlarını kullanır! Her harfi bu rakamlarla yazar! 💻',
    emoji: '💻',
    category: 'Technology',
    ageGroup: '8-10'
  }
];

class DailyFactService {
  private currentFactIndex = 0;
  
  constructor() {
    this.loadCurrentIndex();
  }

  private loadCurrentIndex() {
    const saved = localStorage.getItem('minilab:dailyFactIndex');
    if (saved) {
      this.currentFactIndex = parseInt(saved);
    } else {
      // İlk kez kullanıyorsa rasgele başlat
      this.currentFactIndex = Math.floor(Math.random() * dailyFacts.length);
      this.saveCurrentIndex();
    }
  }

  private saveCurrentIndex() {
    localStorage.setItem('minilab:dailyFactIndex', this.currentFactIndex.toString());
  }

  getDailyFact(): DailyFact {
    const today = new Date().toDateString();
    const lastShown = localStorage.getItem('minilab:lastFactDate');
    
    if (lastShown !== today) {
      // Yeni gün, yeni gerçek
      this.currentFactIndex = (this.currentFactIndex + 1) % dailyFacts.length;
      this.saveCurrentIndex();
      localStorage.setItem('minilab:lastFactDate', today);
    }
    
    return dailyFacts[this.currentFactIndex];
  }

  getFactByAgeGroup(ageGroup: '4-6' | '6-8' | '8-10'): DailyFact[] {
    return dailyFacts.filter(fact => fact.ageGroup === ageGroup || fact.ageGroup === 'All');
  }

  getRandomFact(): DailyFact {
    const randomIndex = Math.floor(Math.random() * dailyFacts.length);
    return dailyFacts[randomIndex];
  }

  markFactAsRead(factId: string) {
    const readFacts = this.getReadFacts();
    if (!readFacts.includes(factId)) {
      readFacts.push(factId);
      localStorage.setItem('minilab:readFacts', JSON.stringify(readFacts));
    }
  }

  private getReadFacts(): string[] {
    const saved = localStorage.getItem('minilab:readFacts');
    return saved ? JSON.parse(saved) : [];
  }

  getReadFactsCount(): number {
    return this.getReadFacts().length;
  }
}

export const dailyFactService = new DailyFactService();
