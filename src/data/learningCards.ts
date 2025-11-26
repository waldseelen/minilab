
import { Category, LearningCard } from '../types';

export const learningCards: LearningCard[] = [
  // --- FİZİK (PHYSICS) ---
  {
    id: 'phy-1',
    title: { tr: 'Yerçekimi Nedir?', en: 'What is Gravity?' },
    content: { 
      tr: 'Hiç zıpladığında neden yere geri düştüğünü merak ettin mi? Dünya bizi kendine çeker! Buna yerçekimi denir. Yerçekimi olmasaydı uzayda süzülürdük! 🎈',
      en: 'Ever wonder why you fall back down when you jump? Earth pulls us! This is called gravity. Without gravity, we would float into space! 🎈' 
    },
    category: Category.Physics,
    ageGroup: '4-6',
    level: 1,
    duration: '5 dk',
    emoji: '🍎',
    tags: ['gravity', 'force'],
    type: 'Learn'
  },
  {
    id: 'phy-2',
    title: { tr: 'Batar mı Yüzer mi?', en: 'Sink or Float?' },
    content: {
      tr: 'Bir kova su al. İçine taş, yaprak, kaşık ve oyuncak ördek at. Hangileri yüzüyor? Genellikle hafif ve içi hava dolu şeyler yüzer! 🛁',
      en: 'Get a bucket of water. Drop a stone, a leaf, a spoon, and a toy duck. Which ones float? Usually light things full of air float! 🛁'
    },
    category: Category.Physics,
    ageGroup: '4-6',
    level: 1,
    duration: '10 dk',
    emoji: '⛵',
    tags: ['water', 'experiment'],
    type: 'Simulation'
  },
  {
    id: 'phy-3',
    title: { tr: 'Mıknatısın Gücü', en: 'Magnet Power' },
    content: {
      tr: 'Mıknatısların görünmez kolları vardır! Metalleri uzaktan bile yakalayabilirler. İki mıknatısı birbirine yaklaştır: Bazen çekerler, bazen iterler. 🧲',
      en: 'Magnets have invisible arms! They can catch metals from afar. Bring two magnets close: sometimes they pull, sometimes they push. 🧲'
    },
    category: Category.Physics,
    ageGroup: '6-8',
    level: 1,
    duration: '10 dk',
    emoji: '🧲',
    tags: ['magnet', 'force'],
    type: 'Experiment'
  },
  {
    id: 'phy-4',
    title: { tr: 'Evde Gökkuşağı Yap', en: 'Make a Rainbow' },
    content: {
      tr: 'Bir bardak su, bir ayna ve güneş ışığı ile odanda kendi gökkuşağını yaratabilirsin. Işık suda kırılır ve renklere ayrılır! 🌈',
      en: 'With a glass of water, a mirror, and sunlight, you can make a rainbow in your room. Light bends in water and splits into colors! 🌈'
    },
    category: Category.Physics,
    ageGroup: '6-8',
    level: 2,
    duration: '15 dk',
    emoji: '🌈',
    tags: ['light', 'color'],
    type: 'Experiment'
  },
  {
    id: 'phy-5',
    title: { tr: 'Sesin Titreşimi', en: 'Sound Vibrations' },
    content: {
      tr: 'Bir balon şişir ve kulağına dayayıp konuş. Titrediğini hissettin mi? Ses aslında havanın titremesidir! 🗣️',
      en: 'Blow up a balloon, hold it to your ear and speak. Feel the shake? Sound is actually vibrating air! 🗣️'
    },
    category: Category.Physics,
    ageGroup: '8-10',
    level: 2,
    duration: '5 dk',
    emoji: '🔊',
    tags: ['sound', 'wave'],
    type: 'Learn'
  },

  // --- KİMYA (CHEMISTRY) ---
  {
    id: 'chem-1',
    title: { tr: 'Yanardağ Patlaması', en: 'Volcano Eruption' },
    content: {
      tr: 'Sirke ve karbonatı karıştırarak kendi mini yanardağını yapabilirsin! Ortaya çıkan gaz köpürerek patlar. Çok eğlenceli! 🌋',
      en: 'Mix vinegar and baking soda to make your own mini volcano! The gas creates a bubbly explosion. So fun! 🌋'
    },
    category: Category.Chemistry,
    ageGroup: '6-8',
    level: 1,
    duration: '15 dk',
    emoji: '🌋',
    tags: ['reaction', 'fun'],
    type: 'Experiment'
  },
  {
    id: 'chem-2',
    title: { tr: 'Dans Eden Kuru Üzümler', en: 'Dancing Raisins' },
    content: {
      tr: 'Gazozun içine kuru üzüm at. Baloncuklar üzümlere yapışıp onları yukarı kaldırır, sonra patlayınca aşağı düşerler. Dans ediyorlar! 🍇',
      en: 'Drop raisins into soda. Bubbles stick to them and lift them up, then they pop and sink. They are dancing! 🍇'
    },
    category: Category.Chemistry,
    ageGroup: '4-6',
    level: 1,
    duration: '5 dk',
    emoji: '💃',
    tags: ['gas', 'fun'],
    type: 'Simulation'
  },
  {
    id: 'chem-3',
    title: { tr: 'Slime Zamanı!', en: 'Slime Time!' },
    content: {
      tr: 'Katı mı sıvı mı? Slime "polimer"dir! Tutkal ve boraks birleşince moleküller el ele tutuşur ve uzayan bir hamur olur. 🦠',
      en: 'Solid or liquid? Slime is a "polymer"! When glue and borax mix, molecules hold hands and become stretchy goo. 🦠'
    },
    category: Category.Chemistry,
    ageGroup: '8-10',
    level: 2,
    duration: '20 dk',
    emoji: '🧪',
    tags: ['polymer', 'slime'],
    type: 'Experiment'
  },
  {
    id: 'chem-4',
    title: { tr: 'Görünmez Mürekkep', en: 'Invisible Ink' },
    content: {
      tr: 'Limon suyuyla kağıda gizli bir mesaj yaz. Kuruyunca görünmez olacak. Isıtınca kahverengiye dönüşüp okunabilir! 🕵️‍♂️',
      en: 'Write a secret message with lemon juice. It disappears when dry. Heat it up to turn it brown and read it! 🕵️‍♂️'
    },
    category: Category.Chemistry,
    ageGroup: '8-10',
    level: 2,
    duration: '15 dk',
    emoji: '🍋',
    tags: ['heat', 'secret'],
    type: 'Experiment'
  },
  {
    id: 'chem-5',
    title: { tr: 'Suyun Halleri', en: 'States of Water' },
    content: {
      tr: 'Su sihirbazdır! Soğukta buz olur (katı), muslukta akar (sıvı), kaynayınca buhar olur (gaz). 🧊💧💨',
      en: 'Water is a magician! Ice in cold (solid), flows in tap (liquid), steam when hot (gas). 🧊💧💨'
    },
    category: Category.Chemistry,
    ageGroup: '4-6',
    level: 1,
    duration: '10 dk',
    emoji: '🧊',
    tags: ['water', 'states'],
    type: 'Learn'
  },
  {
    id: 'chem-6',
    title: { tr: 'Renkli Süt Patlaması', en: 'Color Explosion Milk' },
    content: {
      tr: 'Süte gıda boyası damlat, sonra deterjanlı kulak çubuğuyla dokun. Renklerin kaçıştığını ve dans ettiğini göreceksin! Yüzey gerilimi kırılıyor. 🎨',
      en: 'Drop food coloring in milk, then touch with a soapy cotton swab. Watch colors run away and dance! Surface tension is breaking. 🎨'
    },
    category: Category.Chemistry,
    ageGroup: '4-6',
    level: 1,
    duration: '10 dk',
    emoji: '🎨',
    tags: ['milk', 'colors', 'soap'],
    type: 'Experiment'
  },
  {
    id: 'chem-7',
    title: { tr: 'Kendi Lav Lambanı Yap', en: 'Make Your Own Lava Lamp' },
    content: {
      tr: 'Bir bardağa su ve yağ koy (karışmazlar!). İçine gıda boyası ve efervesan tablet at. Renkli baloncuklar lav gibi yukarı çıkıp inecek! 🏺',
      en: 'Put water and oil in a glass (they don\'t mix!). Add food coloring and a fizzy tablet. Colored bubbles will rise and fall like lava! 🏺'
    },
    category: Category.Chemistry,
    ageGroup: '6-8',
    level: 2,
    duration: '15 dk',
    emoji: '🏺',
    tags: ['oil', 'water', 'density'],
    type: 'Experiment'
  },
  {
    id: 'chem-8',
    title: { tr: 'Kırmızı Lahana Kimyageri', en: 'Red Cabbage Chemist' },
    content: {
      tr: 'Kırmızı lahana suyu sihirli bir sudur! İçine limon sıkarsan pembe, sabunlu su eklersen mavi olur. Asit ve bazları renklerle keşfet! 🥬',
      en: 'Red cabbage juice is magic water! Squeeze lemon in it, it turns pink. Add soapy water, it turns blue. Discover acids and bases with colors! 🥬'
    },
    category: Category.Chemistry,
    ageGroup: '8-10',
    level: 3,
    duration: '25 dk',
    emoji: '🥬',
    tags: ['color', 'acid', 'base'],
    type: 'Experiment'
  },
  {
    id: 'chem-9',
    title: { tr: 'Sihirli Çamur', en: 'Magic Mud' },
    content: {
      tr: 'Mısır nişastası ve suyu karıştır. Hızlıca vurursan taş gibi sert, yavaşça dokunursan su gibi sıvı olur! Newton buna şaşırırdı. 🥣',
      en: 'Mix cornstarch and water. Punch it fast, it\'s hard like stone. Touch slowly, it flows like water! Newton would be surprised. 🥣'
    },
    category: Category.Chemistry,
    ageGroup: '4-6',
    level: 1,
    duration: '15 dk',
    emoji: '🥣',
    tags: ['solid', 'liquid', 'fun'],
    type: 'Experiment'
  },
  {
    id: 'chem-10',
    title: { tr: 'Paraları Parlat', en: 'Shine the Coins' },
    content: {
      tr: 'Kararmış eski paraları sirke ve tuz karışımına at. 5 dakika bekle. Çıkardığında yepyeni gibi parlayacaklar! Asit iş başında. 💰',
      en: 'Put dirty old coins in vinegar and salt mix. Wait 5 minutes. They will shine like new! Acid is working. 💰'
    },
    category: Category.Chemistry,
    ageGroup: '6-8',
    level: 2,
    duration: '10 dk',
    emoji: '💰',
    tags: ['acid', 'clean', 'reaction'],
    type: 'Experiment'
  },
  {
    id: 'chem-11',
    title: { tr: 'Şişen Balon', en: 'The Blowing Balloon' },
    content: {
      tr: 'Şişeye sirke, balona karbonat koy. Balonu şişenin ağzına tak ve karbonatı dök. Balon kendiliğinden şişecek! Gaz gücü! 🎈',
      en: 'Put vinegar in a bottle, baking soda in a balloon. Attach balloon to bottle and dump soda. It inflates by itself! Gas power! 🎈'
    },
    category: Category.Chemistry,
    ageGroup: '8-10',
    level: 2,
    duration: '10 dk',
    emoji: '🎈',
    tags: ['gas', 'pressure', 'fun'],
    type: 'Experiment'
  },

  // --- BİYOLOJİ (BIOLOGY) ---
  {
    id: 'bio-1',
    title: { tr: 'Kelebeğin Yaşamı', en: 'Butterfly Life' },
    content: {
      tr: 'Kelebekler önce yumurta, sonra tırtıl olur. Koza örüp uyurlar ve uyandıklarında rengarenk kanatları olur! 🐛➡️🦋',
      en: 'Butterflies start as eggs, then caterpillars. They spin a cocoon and wake up with colorful wings! 🐛➡️🦋'
    },
    category: Category.Biology,
    ageGroup: '4-6',
    level: 1,
    duration: '6 dk',
    emoji: '🦋',
    tags: ['cycle', 'nature'],
    type: 'Learn'
  },
  {
    id: 'bio-2',
    title: { tr: 'Fasulye Büyütüyoruz', en: 'Growing Beans' },
    content: {
      tr: 'Kuru bir fasulyeyi ıslak pamuğun içine koy. Birkaç gün içinde kök salar ve yeşil yapraklar çıkarır! 🌱',
      en: 'Put a dry bean in wet cotton. In a few days, it grows roots and green leaves! 🌱'
    },
    category: Category.Biology,
    ageGroup: '6-8',
    level: 1,
    duration: '3 gün',
    emoji: '🫘',
    tags: ['plant', 'grow'],
    type: 'Experiment'
  },
  {
    id: 'bio-3',
    title: { tr: 'Beş Süper Duyumuz', en: 'Five Super Senses' },
    content: {
      tr: 'Gözler görür 👀, kulaklar duyar 👂, burun koklar 👃, dil tadar 👅 ve deri hisseder ✋. Bunlar bizim süper güçlerimiz!',
      en: 'Eyes see 👀, ears hear 👂, nose smells 👃, tongue tastes 👅, and skin feels ✋. These are our super powers!'
    },
    category: Category.Biology,
    ageGroup: '4-6',
    level: 1,
    duration: '5 dk',
    emoji: '👀',
    tags: ['body', 'senses'],
    type: 'Learn'
  },
  {
    id: 'bio-4',
    title: { tr: 'Dinozorlar Alemi', en: 'World of Dinosaurs' },
    content: {
      tr: 'Milyonlarca yıl önce dev dinozorlar yaşardı. Bazıları ot yerdi, bazıları et. Şimdi sadece kemiklerini (fosil) buluyoruz. 🦕',
      en: 'Millions of years ago, giant dinosaurs lived. Some ate plants, some ate meat. Now we only find their bones (fossils). 🦕'
    },
    category: Category.Biology,
    ageGroup: '6-8',
    level: 2,
    duration: '10 dk',
    emoji: '🦖',
    tags: ['history', 'animals'],
    type: 'Learn'
  },
  {
    id: 'bio-5',
    title: { tr: 'Mikrop Avcıları', en: 'Germ Hunters' },
    content: {
      tr: 'Ellerimizde görünmeyen minik mikroplar yaşar. Sabunla ellerini yıkarsan hepsi kaçar! Simli su ile dene ve gör. 🦠🧼',
      en: 'Tiny invisible germs live on hands. Wash with soap and they run away! Try with glitter water to see. 🦠🧼'
    },
    category: Category.Biology,
    ageGroup: '4-6',
    level: 1,
    duration: '8 dk',
    emoji: '🧼',
    tags: ['health', 'clean'],
    type: 'Simulation'
  },

  // --- UZAY (SPACE) ---
  {
    id: 'space-1',
    title: { tr: 'Güneş Sistemi Ailesi', en: 'Solar System Family' },
    content: {
      tr: 'Merkezde Güneş baba, etrafında dönen 8 gezegen kardeş! Biz 3. sıradayız (Dünya). En büyüğü Jüpiter! 🌍',
      en: 'Father Sun in the center, 8 planet siblings around! We are 3rd (Earth). Jupiter is the biggest! 🌍'
    },
    category: Category.Space,
    ageGroup: '6-8',
    level: 1,
    duration: '8 dk',
    emoji: '🪐',
    tags: ['planets', 'sun'],
    type: 'Learn'
  },
  {
    id: 'space-2',
    title: { tr: 'Ay Neden Şekil Değiştirir?', en: 'Phases of the Moon' },
    content: {
      tr: 'Ay aslında şekil değiştirmez! Güneş ışığı farklı açılardan vurduğu için bazen hilal, bazen dolunay görürüz. 🌑🌒🌕',
      en: 'The Moon doesn\'t change shape! We see parts lit by the Sun. Sometimes a crescent, sometimes full. 🌑🌒🌕'
    },
    category: Category.Space,
    ageGroup: '8-10',
    level: 2,
    duration: '10 dk',
    emoji: '🌙',
    tags: ['moon', 'light'],
    type: 'Simulation'
  },
  {
    id: 'space-3',
    title: { tr: 'Astronotlar Nasıl Yaşar?', en: 'Astronaut Life' },
    content: {
      tr: 'Uzayda yerçekimi azdır, astronotlar uçar! Uyurken kendilerini bağlarlar. Suyu pipetle içerler! 👩‍🚀',
      en: 'Low gravity in space makes astronauts fly! They tie themselves to sleep. They drink water with a straw! 👩‍🚀'
    },
    category: Category.Space,
    ageGroup: '6-8',
    level: 1,
    duration: '8 dk',
    emoji: '🚀',
    tags: ['space', 'gravity'],
    type: 'Learn'
  },
  {
    id: 'space-4',
    title: { tr: 'Kara Delikler', en: 'Black Holes' },
    content: {
      tr: 'Kara delikler uzayın elektrik süpürgesidir! Çok güçlü çekimleri vardır, ışığı bile yutarlar. ⚫',
      en: 'Black holes are space vacuums! Their pull is so strong, they even swallow light. ⚫'
    },
    category: Category.Space,
    ageGroup: '8-10',
    level: 3,
    duration: '12 dk',
    emoji: '⚫',
    tags: ['mystery', 'physics'],
    type: 'Learn'
  },
  {
    id: 'space-5',
    title: { tr: 'Takımyıldızları', en: 'Constellations' },
    content: {
      tr: 'Gece gökyüzünde yıldızları birleştirip şekiller çizebilirsin. Büyükayı bir tavaya benzer! Kendi şeklini bul! ✨',
      en: 'Connect stars at night to draw shapes. The Big Dipper looks like a pan! Find your own shape! ✨'
    },
    category: Category.Space,
    ageGroup: '6-8',
    level: 1,
    duration: '15 dk',
    emoji: '✨',
    tags: ['stars', 'sky'],
    type: 'Simulation'
  },

  // --- TEKNOLOJİ (TECHNOLOGY) ---
  {
    id: 'tech-1',
    title: { tr: 'Robotlar Nasıl Düşünür?', en: 'How Robots Think' },
    content: {
      tr: 'Robotların beyni yoktur, kodları vardır! Biz onlara komut yazarız, onlar da yemek tarifi gibi adım adım uygular. 📜',
      en: 'Robots have no brains, only code! We write commands, and they follow them step-by-step like a recipe. 📜'
    },
    category: Category.Tech,
    ageGroup: '8-10',
    level: 2,
    duration: '10 dk',
    emoji: '🤖',
    tags: ['coding', 'logic'],
    type: 'Learn'
  },
  {
    id: 'tech-2',
    title: { tr: 'İnternet Ağı', en: 'The Internet Web' },
    content: {
      tr: 'İnternet, dünyadaki bilgisayarları bağlayan dev bir örümcek ağıdır! Kablolarla saniyede dünyanın öbür ucuna mesaj gider. 🌐',
      en: 'Internet is a giant web connecting computers! Messages travel the world in seconds via cables. 🌐'
    },
    category: Category.Tech,
    ageGroup: '8-10',
    level: 2,
    duration: '8 dk',
    emoji: '🕸️',
    tags: ['web', 'connect'],
    type: 'Learn'
  },
  {
    id: 'tech-3',
    title: { tr: '3D Yazıcılar', en: '3D Printers' },
    content: {
      tr: 'Normal yazıcı kağıda resim çizer. 3D yazıcı plastiği eriterek gerçek oyuncaklar basabilir! Katman katman! 🖨️',
      en: 'Normal printers draw on paper. 3D printers melt plastic to build real toys! Layer by layer! 🖨️'
    },
    category: Category.Tech,
    ageGroup: '6-8',
    level: 1,
    duration: '6 dk',
    emoji: '🧊',
    tags: ['future', 'make'],
    type: 'Simulation'
  },
  {
    id: 'tech-4',
    title: { tr: 'Piller Nasıl Çalışır?', en: 'How Batteries Work' },
    content: {
      tr: 'Piller, kimyasalları elektriğe çeviren kutulardır. Oyuncaklarına enerji verirler. Piller bitince geri dönüşüme atmalıyız! 🔋',
      en: 'Batteries are boxes turning chemicals into electricity. They power toys. Recycle them when empty! 🔋'
    },
    category: Category.Tech,
    ageGroup: '6-8',
    level: 1,
    duration: '5 dk',
    emoji: '🔋',
    tags: ['energy', 'power'],
    type: 'Learn'
  },
  {
    id: 'tech-5',
    title: { tr: 'Wifi Nedir?', en: 'What is Wifi?' },
    content: {
      tr: 'Wifi görünmez radyo dalgalarıdır! Kablo olmadan interneti tabletine taşır. Havada uçan müzik gibi! 📶',
      en: 'Wifi is invisible radio waves! It carries internet to your tablet without wires. Like music in the air! 📶'
    },
    category: Category.Tech,
    ageGroup: '8-10',
    level: 2,
    duration: '7 dk',
    emoji: '📶',
    tags: ['wireless', 'radio'],
    type: 'Learn'
  },

  // --- YAPAY ZEKA (AI) ---
  {
    id: 'ai-1',
    title: { tr: 'Yapay Zeka Nedir?', en: 'What is AI?' },
    content: {
      tr: 'Yapay Zeka, bilgisayarların öğrenmesidir. Tıpkı senin bisiklet sürmeyi öğrendiğin gibi, onlar da binlerce resme bakarak öğrenir. 🧠',
      en: 'AI is computers learning. Just like you learn to ride a bike, they learn by looking at thousands of pictures. 🧠'
    },
    category: Category.AI,
    ageGroup: '8-10',
    level: 3,
    duration: '12 dk',
    emoji: '🧠',
    tags: ['learning', 'smart'],
    type: 'Learn'
  },
  {
    id: 'ai-2',
    title: { tr: 'Sürücüsüz Arabalar', en: 'Self-Driving Cars' },
    content: {
      tr: 'Bazı arabaların şoförü yoktur! Yapay zeka kameralarla yolu görür, yayaları tanır ve durur. Robot taksiler! 🚗',
      en: 'Some cars have no driver! AI sees the road with cameras, spots people, and stops. Robot taxis! 🚗'
    },
    category: Category.AI,
    ageGroup: '6-8',
    level: 1,
    duration: '8 dk',
    emoji: '🚕',
    tags: ['cars', 'future'],
    type: 'Simulation'
  },
  {
    id: 'ai-3',
    title: { tr: 'Yüz Tanıma', en: 'Face ID' },
    content: {
      tr: 'Telefonun seni nasıl tanıyor? Yapay zeka burnunu ve gözlerini ölçer. Tıpkı seni tanıyan bir arkadaşın gibi! 🤳',
      en: 'How does the phone know you? AI measures your nose and eyes. Just like a friend recognizing you! 🤳'
    },
    category: Category.AI,
    ageGroup: '8-10',
    level: 2,
    duration: '10 dk',
    emoji: '🔓',
    tags: ['security', 'face'],
    type: 'Experiment'
  },
  {
    id: 'ai-4',
    title: { tr: 'Sesli Asistanlar', en: 'Voice Assistants' },
    content: {
      tr: '"Hey Siri" dediğinde seni nasıl anlıyor? Yapay zeka sesini yazıya çevirir, cevabı bulur ve sana okur! 🗣️',
      en: 'How does it understand "Hey Siri"? AI turns voice into text, finds the answer, and reads it to you! 🗣️'
    },
    category: Category.AI,
    ageGroup: '6-8',
    level: 1,
    duration: '6 dk',
    emoji: '🎙️',
    tags: ['voice', 'help'],
    type: 'Simulation'
  },
  {
    id: 'ai-5',
    title: { tr: 'Robot Ressamlar', en: 'Robot Artists' },
    content: {
      tr: 'Yapay zeka resim yapabilir mi? Evet! Milyonlarca tabloya bakar ve yeni, çılgın resimler çizebilir. 🎨',
      en: 'Can AI paint? Yes! It looks at millions of paintings and draws new, crazy art. 🎨'
    },
    category: Category.AI,
    ageGroup: '8-10',
    level: 2,
    duration: '8 dk',
    emoji: '🎨',
    tags: ['art', 'create'],
    type: 'Experiment'
  },

  // --- ÇEVRE BİLİMİ (ENVIRONMENT) ---
  {
    id: 'env-1',
    title: { tr: 'Geri Dönüşüm Kahramanları', en: 'Recycling Heroes' },
    content: {
      tr: 'Eski kağıtlar yeni deftere, plastik şişeler monta dönüşebilir! Çöplerimizi ayırırsak dünyaya süper kahraman gibi yardım ederiz. ♻️',
      en: 'Old paper becomes notebooks, bottles become jackets! If we sort trash, we help the world like superheroes. ♻️'
    },
    category: Category.Environment,
    ageGroup: '4-6',
    level: 1,
    duration: '5 dk',
    emoji: '♻️',
    tags: ['recycle', 'earth'],
    type: 'Learn'
  },
  {
    id: 'env-2',
    title: { tr: 'Temiz Su Deneyi', en: 'Clean Water Filter' },
    content: {
      tr: 'Kirli suyu nasıl temizleriz? Kum, çakıl ve pamuk kullanarak kendi su filtreni yap. Suyun nasıl berraklaştığını izle! 💧',
      en: 'How to clean dirty water? Make a filter with sand, stones, and cotton. Watch the water become clear! 💧'
    },
    category: Category.Environment,
    ageGroup: '8-10',
    level: 2,
    duration: '20 dk',
    emoji: '🚰',
    tags: ['water', 'nature'],
    type: 'Experiment'
  },
  {
    id: 'env-3',
    title: { tr: 'Kendi Kompostunu Yap', en: 'Make Your Compost' },
    content: {
      tr: 'Muz kabuklarını çöpe atma! Toprakla karıştırıp beklersen bitkiler için harika bir besine (gübre) dönüşür. Doğa hiçbir şeyi israf etmez. 🍌',
      en: 'Don\'t trash banana peels! Mix with soil. It turns into plant food (compost). Nature wastes nothing. 🍌'
    },
    category: Category.Environment,
    ageGroup: '6-8',
    level: 2,
    duration: '15 dk',
    emoji: '🌱',
    tags: ['nature', 'garden'],
    type: 'Experiment'
  },

  // --- ROBOTİK (ROBOTICS) ---
  {
    id: 'robo-1',
    title: { tr: 'Karton Robot Kol', en: 'Cardboard Robot Arm' },
    content: {
      tr: 'Karton, pipet ve iplerle kendi robot elini yap! İpleri çektiğinde parmakların nasıl kapandığını gör. Mekanik güç! 🦾',
      en: 'Make a robot hand with cardboard, straws, and string! Pull the strings to close the fingers. Mechanical power! 🦾'
    },
    category: Category.Robotics,
    ageGroup: '8-10',
    level: 3,
    duration: '30 dk',
    emoji: '🦾',
    tags: ['robot', 'build'],
    type: 'Experiment'
  },
  {
    id: 'robo-2',
    title: { tr: 'Sensörler Nasıl Görür?', en: 'How Sensors See' },
    content: {
      tr: 'Robotların gözü yoktur, sensörleri vardır! Yarasa gibi ses dalgaları gönderip mesafeyi ölçerler. Çarpışmayı böyle önlerler. 🦇',
      en: 'Robots have sensors, not eyes! They send sound waves like bats to measure distance. That\'s how they avoid crashing. 🦇'
    },
    category: Category.Robotics,
    ageGroup: '6-8',
    level: 2,
    duration: '8 dk',
    emoji: '📡',
    tags: ['sensors', 'tech'],
    type: 'Learn'
  },
  {
    id: 'robo-3',
    title: { tr: 'Kodlama Mantığı', en: 'Coding Logic' },
    content: {
      tr: 'Arkadaşına robot gibi davranmasını söyle. "İki adım git, sağa dön" de. Kodlama işte budur: Adım adım emir vermek! 👾',
      en: 'Tell your friend to act like a robot. Say "Walk 2 steps, turn right". That\'s coding: Giving step-by-step orders! 👾'
    },
    category: Category.Robotics,
    ageGroup: '4-6',
    level: 1,
    duration: '10 dk',
    emoji: '👾',
    tags: ['code', 'game'],
    type: 'Simulation'
  }
];
