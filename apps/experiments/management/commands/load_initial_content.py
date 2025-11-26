"""
MiniLab - İlk İçerik Yükleme Komutu
10 Kategori ve 100 Öğrenme Kartını veritabanına yükler.
"""
from django.core.management.base import BaseCommand
from apps.experiments.models import Category, LearningCard, Experiment


class Command(BaseCommand):
    help = '10 Kategori ve 100 Öğrenme Kartını veritabanına yükler'

    def handle(self, *args, **options):
        self.stdout.write(self.style.SUCCESS('🚀 MiniLab İçerik Yükleme Başlıyor...'))

        # Kategorileri oluştur
        categories = self.create_categories()

        # Her kategori için placeholder deney oluştur
        experiments = self.create_placeholder_experiments(categories)

        # Öğrenme kartlarını oluştur
        self.create_learning_cards(experiments)

        self.stdout.write(self.style.SUCCESS('✅ Tüm içerikler başarıyla yüklendi!'))

    def create_categories(self):
        """10 Ana kategoriyi oluşturur."""
        categories_data = [
            {
                'name': 'Fizik',
                'slug': 'fizik',
                'description': 'Yerçekimi, sürtünme kuvveti, mıknatıslar, ışık-gölge oyunları, denge ve yansıma gibi temel fiziksel olaylar.',
                'icon': '🔬',
                'color': 'blue',
                'order': 1,
            },
            {
                'name': 'Kimya',
                'slug': 'kimya',
                'description': 'Hal değişimleri, zararsız kimyasal tepkimeler, karışımlar, çözünme ve paslanma.',
                'icon': '🧪',
                'color': 'purple',
                'order': 2,
            },
            {
                'name': 'Biyoloji & Sağlık',
                'slug': 'biyoloji-saglik',
                'description': 'Organların işlevleri, hijyen, büyüme süreçleri ve sağlıklı beslenme.',
                'icon': '🧬',
                'color': 'green',
                'order': 3,
            },
            {
                'name': 'Astronomi',
                'slug': 'astronomi',
                'description': 'Güneş, Ay, Dünya, gezegenler, yıldızlar, yerçekimsiz ortam ve uzay araçları.',
                'icon': '🪐',
                'color': 'indigo',
                'order': 4,
            },
            {
                'name': 'Teknoloji',
                'slug': 'teknoloji',
                'description': 'Tablet, pil, internet, drone, elektrik gibi modern cihazların çalışma prensipleri.',
                'icon': '🤖',
                'color': 'cyan',
                'order': 5,
            },
            {
                'name': 'Yapay Zeka',
                'slug': 'yapay-zeka',
                'description': 'Makine öğrenmesi, yüz tanıma, sesli asistanlar, algoritmalar ve otonom araçlar.',
                'icon': '🧠',
                'color': 'pink',
                'order': 6,
            },
            {
                'name': 'Doğa',
                'slug': 'doga',
                'description': 'Su döngüsü, mevsimler, hayvanların savunma mekanizmaları, bitkiler ve ekosistem.',
                'icon': '🍃',
                'color': 'emerald',
                'order': 7,
            },
            {
                'name': 'İcatlar',
                'slug': 'icatlar',
                'description': 'Tekerlek, uçak, ampul, telefon, pusula gibi insanlık tarihini değiştiren buluşlar.',
                'icon': '💡',
                'color': 'amber',
                'order': 8,
            },
            {
                'name': 'Matematik & Mantık',
                'slug': 'matematik-mantik',
                'description': 'Rakamlar, simetri, geometrik şekiller, örüntüler, ölçü birimleri ve gruplama.',
                'icon': '📐',
                'color': 'red',
                'order': 9,
            },
            {
                'name': 'Sanat & Müzik Bilimi',
                'slug': 'sanat-muzik',
                'description': 'Ses dalgaları, renk karışımları, ritim, ışık-gölge, enstrümanların çalışma mantığı.',
                'icon': '🎨',
                'color': 'rose',
                'order': 10,
            },
        ]

        categories = {}
        for cat_data in categories_data:
            cat, created = Category.objects.update_or_create(
                slug=cat_data['slug'],
                defaults=cat_data
            )
            categories[cat_data['slug']] = cat
            status = '✨ Oluşturuldu' if created else '♻️ Güncellendi'
            self.stdout.write(f"  {cat_data['icon']} {cat_data['name']} - {status}")

        self.stdout.write(self.style.SUCCESS(f'\n📁 {len(categories)} Kategori hazır!'))
        return categories

    def create_placeholder_experiments(self, categories):
        """Her kategori için placeholder deney oluşturur (Kartlar için gerekli)."""
        experiments = {}

        experiment_data = {
            'fizik': {
                'title': 'Fizik Öğrenme Kartları',
                'slug': 'fizik-kartlari',
                'short_description': 'Hareket ve güçleri keşfet!',
                'description': 'Yerçekimi, mıknatıslar, gölge oyunları ve daha fazlası...',
            },
            'kimya': {
                'title': 'Kimya Öğrenme Kartları',
                'slug': 'kimya-kartlari',
                'short_description': 'Karışımları ve dönüşümleri keşfet!',
                'description': 'Eriyen buz, köpüren karışımlar ve sihirli tepkimeler...',
            },
            'biyoloji-saglik': {
                'title': 'Biyoloji & Sağlık Kartları',
                'slug': 'biyoloji-kartlari',
                'short_description': 'Vücudunu ve canlıları tanı!',
                'description': 'Kalp, kemikler, mikroplar ve sağlıklı yaşam...',
            },
            'astronomi': {
                'title': 'Astronomi Öğrenme Kartları',
                'slug': 'astronomi-kartlari',
                'short_description': 'Uzayı ve gökyüzünü keşfet!',
                'description': 'Güneş, Ay, gezegenler ve yıldızlar...',
            },
            'teknoloji': {
                'title': 'Teknoloji Öğrenme Kartları',
                'slug': 'teknoloji-kartlari',
                'short_description': 'Makinelerin sırlarını öğren!',
                'description': 'Tabletler, robotlar, dronelar ve elektrik...',
            },
            'yapay-zeka': {
                'title': 'Yapay Zeka Öğrenme Kartları',
                'slug': 'yapay-zeka-kartlari',
                'short_description': 'Akıllı sistemleri tanı!',
                'description': 'Bilgisayarlar nasıl öğrenir, yüz tanıma ve daha fazlası...',
            },
            'doga': {
                'title': 'Doğa Öğrenme Kartları',
                'slug': 'doga-kartlari',
                'short_description': 'Doğayı ve çevreyi keşfet!',
                'description': 'Su döngüsü, mevsimler, hayvanlar ve bitkiler...',
            },
            'icatlar': {
                'title': 'İcatlar Öğrenme Kartları',
                'slug': 'icatlar-kartlari',
                'short_description': 'İnsanlığı değiştiren buluşları öğren!',
                'description': 'Tekerlek, ampul, telefon ve daha fazlası...',
            },
            'matematik-mantik': {
                'title': 'Matematik & Mantık Kartları',
                'slug': 'matematik-kartlari',
                'short_description': 'Sayıları ve şekilleri keşfet!',
                'description': 'Rakamlar, simetri, örüntüler ve ölçme...',
            },
            'sanat-muzik': {
                'title': 'Sanat & Müzik Kartları',
                'slug': 'sanat-kartlari',
                'short_description': 'Renkleri ve sesleri keşfet!',
                'description': 'Renk karışımları, sesler, ritim ve notalar...',
            },
        }

        for cat_slug, exp_data in experiment_data.items():
            category = categories[cat_slug]
            exp, created = Experiment.objects.update_or_create(
                slug=exp_data['slug'],
                defaults={
                    'category': category,
                    'title': exp_data['title'],
                    'short_description': exp_data['short_description'],
                    'description': exp_data['description'],
                    'experiment_type': 'interactive',
                    'difficulty': 'easy',
                    'points': 10,
                    'estimated_time': 5,
                    'is_active': True,
                }
            )
            experiments[cat_slug] = exp
            status = '✨ Oluşturuldu' if created else '♻️ Güncellendi'
            self.stdout.write(f"  📚 {exp_data['title']} - {status}")

        self.stdout.write(self.style.SUCCESS(f'\n🔬 {len(experiments)} Deney hazır!'))
        return experiments

    def create_learning_cards(self, experiments):
        """100 Öğrenme kartını oluşturur."""

        # Kategori slug -> Kartlar
        cards_data = {
            'fizik': [
                {
                    'title': 'Gölge Oyunu',
                    'front_content': 'Gölge nasıl oluşur?',
                    'back_content': 'Işık bir duvara çarpınca arkasına geçemez. Sen ışığın önünde durursan, arkanda senin şekline benzeyen gri bir renk oluşur. Buna gölge denir. Sen hareket edince o da seninle hareket eder.',
                    'order': 1,
                },
                {
                    'title': 'Görünmez Tutkal (Mıknatıs)',
                    'front_content': 'Mıknatıs nasıl çalışır?',
                    'back_content': 'Mıknatıslar demir olan eşyaları çok sever ve onları kendine doğru çeker. Tıpkı bir yapıştırıcı gibi tutar ama eline yapışmaz. Sadece metalleri tutar.',
                    'order': 2,
                },
                {
                    'title': 'Dünyanın Kucağı (Yerçekimi)',
                    'front_content': 'Neden her şey yere düşer?',
                    'back_content': 'Zıpladığımızda ayaklarımız tekrar yere değer. Topu havaya atsak da geri döner. Çünkü Dünya, üzerindeki her şeyi merkezine doğru çeker ve düşmemizi engeller.',
                    'order': 3,
                },
                {
                    'title': 'Ayna Oyunu (Yansıma)',
                    'front_content': 'Aynada kendimizi nasıl görürüz?',
                    'back_content': 'Işık parlak bir yere çarpınca top gibi geri seker. Aynaya baktığında aslında ışığın sana geri dönmesini görürsün. Durgun sular da ayna gibidir.',
                    'order': 4,
                },
                {
                    'title': 'Neden Kayarız? (Sürtünme)',
                    'front_content': 'Buzda neden kayarız?',
                    'back_content': 'Buz çok düzgündür, ayaklarımız üzerinde kolayca kayar. Ama halı veya kum pütürlüdür, ayakkabımızı tutar ve bizi yavaşlatır. Böylece düşmeden yürüyebiliriz.',
                    'order': 5,
                },
                {
                    'title': 'Tahterevalli Dengesi',
                    'front_content': 'Tahterevalli nasıl dengede durur?',
                    'back_content': 'İki tarafın ağırlığı eşit olunca tahterevalli dümdüz durur, buna denge denir. Eğer bir tarafa ağır bir fil oturursa, diğer taraf yukarı kalkar.',
                    'order': 6,
                },
                {
                    'title': 'Suyun Kaldırma Gücü',
                    'front_content': 'Gemiler neden batmaz?',
                    'back_content': 'Su, içi hava dolu olan hafif şeyleri yukarıda tutar. Simitler ve gemiler bu sayede yüzer. Ama taş gibi içi dolu ve ağır şeyler dibe iner.',
                    'order': 7,
                },
                {
                    'title': 'Hızlı ve Yavaş',
                    'front_content': 'Hızlı ve yavaş ne demek?',
                    'back_content': 'Bazı şeyler uçak gibi çok hızlı gider. Bazı şeyler ise salyangoz gibi yavaş hareket eder. Hızlı gitmek için daha çok enerji kullanırız.',
                    'order': 8,
                },
                {
                    'title': 'Işık Kırılması (Sihirli Kalem)',
                    'front_content': 'Suda kalem neden kırık görünür?',
                    'back_content': 'Su dolu bardağa bir kalem koyarsan şekli değişik görünür. Kalem aslında sağlamdır. Sadece suyun içinden bakınca ışık yönünü değiştirir.',
                    'order': 9,
                },
                {
                    'title': 'Ses Dalgaları',
                    'front_content': 'Sesimiz nasıl yayılır?',
                    'back_content': 'Konuştuğunda ağzından görünmez hava dalgaları çıkar. Tıpkı suya taş atınca yayılan halkalar gibi! Bu dalgalar arkadaşının kulağına gidince seni duyar.',
                    'order': 10,
                },
            ],
            'kimya': [
                {
                    'title': 'Eriyen Kule (Hal Değişimi)',
                    'front_content': 'Buz neden erir?',
                    'back_content': 'Sıcak havada buzlar erir ve su olur. Suyu kaynatırsak buhar olur ve uçar. Yani buz, su ve buhar aslında aynı şeydir, sadece sıcaklıkları farklıdır.',
                    'order': 1,
                },
                {
                    'title': 'Köpüren Karışım (Tepkime)',
                    'front_content': 'Sirke ve karbonat karışınca ne olur?',
                    'back_content': 'Bazı malzemeler karışınca bol bol köpük çıkarır. Sirke ve karbonat birleşince içinde hava kabarcıkları oluşur ve bardaktan taşar.',
                    'order': 2,
                },
                {
                    'title': 'Kaybolan Şeker (Çözünme)',
                    'front_content': 'Şeker suda nereye gider?',
                    'back_content': 'Şekeri suya atıp karıştırırsan gözden kaybolur. Aslında yok olmaz, suyun her yerine dağılır. Tadına bakarsan orada olduğunu anlarsın.',
                    'order': 3,
                },
                {
                    'title': 'Demirdeki Turuncu Renk (Paslanma)',
                    'front_content': 'Demir neden paslanır?',
                    'back_content': 'Demir eşyalar yağmurda ıslanırsa renkleri değişir ve turuncu olur. Buna paslanma denir. Eşyalarımızı kuru tutarsak hep yeni gibi kalır.',
                    'order': 4,
                },
                {
                    'title': 'Baloncukların Sırrı',
                    'front_content': 'Baloncuklar nasıl oluşur?',
                    'back_content': 'Sabunlu suyun içine hava üflersen esnek bir top oluşur. İncecik bir zar olduğu için renkli görünür. Patlayana kadar havada süzülür.',
                    'order': 5,
                },
                {
                    'title': 'Zeytinyağı ve Su (Yoğunluk)',
                    'front_content': 'Yağ neden suyun üstünde durur?',
                    'back_content': 'Zeytinyağı sudan daha hafiftir. Ne kadar karıştırırsan karıştır, zeytinyağı hep suyun üzerine çıkar ve orada yüzer.',
                    'order': 6,
                },
                {
                    'title': 'Kabaran Ekmek (Maya)',
                    'front_content': 'Ekmek neden kabarır?',
                    'back_content': 'Ekmeğin hamuruna maya koyarız. Sıcak fırında hamurun içi hava dolar, bu yüzden ekmek sünger gibi yumuşacık olur ve şişer.',
                    'order': 7,
                },
                {
                    'title': 'Sütün Dönüşümü (Yoğurt)',
                    'front_content': 'Sütten yoğurt nasıl olur?',
                    'back_content': 'Sütten yoğurt yapmak için onu ılık bir yerde bekletiriz. Süre dolunca süt koyulaşır ve kaşıkla yiyebileceğimiz lezzetli bir yoğurt olur.',
                    'order': 8,
                },
                {
                    'title': 'Tuz Kristalleri',
                    'front_content': 'Tuz taneleri neye benzer?',
                    'back_content': 'Tuza çok yakından bakarsan, tanelerinin minik kutulara benzediğini görürsün. Doğadaki bazı taşlar böyle düzgün şekilli olur.',
                    'order': 9,
                },
                {
                    'title': 'Gizli Resim (Limon)',
                    'front_content': 'Limonla nasıl gizli mesaj yazılır?',
                    'back_content': 'Limon suyuyla kağıda resim yaparsan kuruyunca görünmez olur. Ama kağıdı biraz ısıtırsan resmin kahverengi olarak tekrar ortaya çıkar.',
                    'order': 10,
                },
            ],
            'biyoloji-saglik': [
                {
                    'title': 'Vücudumuzun Motoru (Kalp)',
                    'front_content': 'Kalp ne işe yarar?',
                    'back_content': 'Göğsünde hiç durmadan çalışan bir kas vardır: Kalbin! Sen koşarsan o da daha hızlı çalışır ve kanı bütün vücuduna taşır.',
                    'order': 1,
                },
                {
                    'title': 'Mikroplar (Minik Tozlar)',
                    'front_content': 'Mikroplar nedir?',
                    'back_content': 'Mikroplar gözle görülmeyecek kadar küçüktür. Ellerimiz kirlendiğinde orada birikirler. Sabun ve suyla ellerimizi yıkarsak hepsi temizlenir gider.',
                    'order': 2,
                },
                {
                    'title': 'Tırtılın Değişimi (Kelebek)',
                    'front_content': 'Tırtıl nasıl kelebek olur?',
                    'back_content': 'Tırtıllar kendilerine bir koza örüp dinlenirler. Zamanı gelince kozadan kanatlı ve renkli bir kelebek olarak çıkarlar. Bu doğanın harika bir olayıdır.',
                    'order': 3,
                },
                {
                    'title': 'İskeletimiz (Vücudun Direği)',
                    'front_content': 'Kemiklerimiz ne işe yarar?',
                    'back_content': 'Vücudumuzun içinde sert kemikler vardır. Kemiklerimiz olmasaydı ayakta dik duramazdık, yumuşak olurduk. Kemikler bizi sağlam tutar.',
                    'order': 4,
                },
                {
                    'title': 'Tohumun Büyümesi',
                    'front_content': 'Tohum nasıl bitki olur?',
                    'back_content': 'Tohumları toprağa ekeriz. Onlara su verirsek ve güneş ışığı görürlerse büyürler, yaprak açarlar ve kocaman bitki olurlar.',
                    'order': 5,
                },
                {
                    'title': 'Diş Fırçalama (Temizlik Zamanı)',
                    'front_content': 'Dişleri neden fırçalarız?',
                    'back_content': 'Yemek yiyince dişlerimizin arasında yemek kırıntıları kalır. Dişlerimizi fırçalarsak bu kırıntılar temizlenir ve dişlerimiz inci gibi bembeyaz olur.',
                    'order': 6,
                },
                {
                    'title': 'Uyku Zamanı (Büyüme Saati)',
                    'front_content': 'Uyku neden önemli?',
                    'back_content': 'Sen uyurken vücudun dinlenir ve büyümeye devam eder. Gün boyu yorulan kasların iyileşir. İyi uyursan sabah çok güçlü uyanırsın.',
                    'order': 7,
                },
                {
                    'title': 'Aşı (Vücudun Kalkanı)',
                    'front_content': 'Aşı ne işe yarar?',
                    'back_content': 'Aşı, vücudumuza hastalıklardan korunmayı öğretir. Böylece vücudumuz daha dirençli ve sağlıklı olur. Minik bir iğne ucu kadardır ve hemen biter.',
                    'order': 8,
                },
                {
                    'title': 'Yara Kabuğu (İyileşme)',
                    'front_content': 'Yaralar nasıl iyileşir?',
                    'back_content': 'Dizindeki yaranın üzerini vücudun kendisi kapatır. Bu kabuk, altındaki deri iyileşene kadar orayı korur. Derin iyileşince kabuk kendiliğinden düşer.',
                    'order': 9,
                },
                {
                    'title': 'Vitaminler (Sağlık Topları)',
                    'front_content': 'Vitaminler nedir?',
                    'back_content': 'Meyve ve sebzelerin içinde vücudumuza iyi gelen Vitaminler vardır. Portakal ve havuç yersen vücudun daha sağlıklı olur ve kolay hasta olmazsın.',
                    'order': 10,
                },
            ],
            'astronomi': [
                {
                    'title': "Ay'ın Halleri",
                    'front_content': 'Ay neden şekil değiştirir?',
                    'back_content': "Ay'a baktığımızda bazen yuvarlak, bazen de muz şeklinde görürüz. Güneş ışığı Ay'ın neresine değerse biz sadece orayı parlak görürüz.",
                    'order': 1,
                },
                {
                    'title': 'Sıcak Top Güneş',
                    'front_content': 'Güneş nedir?',
                    'back_content': 'Güneş, gökyüzündeki dev bir ısı ve ışık kaynağıdır. Bizi çok uzaktan ısıtır ve aydınlatır. Akşam olunca dünyamız döner ve güneş diğer tarafı aydınlatır.',
                    'order': 2,
                },
                {
                    'title': 'Mavi Gezegen Dünya',
                    'front_content': 'Dünya neden mavi görünür?',
                    'back_content': 'Biz kocaman, yuvarlak bir gezegenin üzerinde yaşıyoruz. Uzaydan bakınca dünyamız masmavi görünür. Çünkü üzerinde çok fazla deniz ve okyanus var.',
                    'order': 3,
                },
                {
                    'title': 'Astronotlar ve Uzay',
                    'front_content': 'Uzayda neden süzülürüz?',
                    'back_content': 'Uzayda yerçekimi çok azdır. Bu yüzden astronotlar yürümez, havada süzülürler. Sular bile bardakta durmaz, damlalar halinde havada yüzer!',
                    'order': 4,
                },
                {
                    'title': 'Yıldızlar Nerededir?',
                    'front_content': 'Yıldızlar gündüz nerede?',
                    'back_content': 'Yıldızlar aslında gündüz de oradadır! Ama Güneş o kadar parlaktır ki, yıldızların ışığını göremeyiz. Güneş gidince yıldızlar ortaya çıkar.',
                    'order': 5,
                },
                {
                    'title': 'Gece ve Gündüz',
                    'front_content': 'Gece ve gündüz nasıl oluşur?',
                    'back_content': 'Dünya kendi etrafında döner. Güneşe bakan taraf gündüz olur, arkada kalan taraf gece olur. Sen uyurken dünyanın diğer tarafındaki çocuklar uyanır.',
                    'order': 6,
                },
                {
                    'title': 'Teleskop (Uzay Dürbünü)',
                    'front_content': 'Teleskop ne işe yarar?',
                    'back_content': 'Uzay çok uzaktır. Gözlerimiz orayı net göremez. Teleskop, uzaktaki yıldızları ve gezegenleri bize çok yakınmış gibi gösteren özel bir dürbündür.',
                    'order': 7,
                },
                {
                    'title': 'Kuyruklu Yıldız (Uzay Taşı)',
                    'front_content': 'Kuyruklu yıldız nedir?',
                    'back_content': 'Kuyruklu yıldız, uzayda gezen buzlu bir taştır. Güneşe yaklaşınca ısınır ve arkasında uzun, parlak bir iz bırakır. Bu iz kuyruğa benzer.',
                    'order': 8,
                },
                {
                    'title': 'Kara Delik (Uzay Mıknatısı)',
                    'front_content': 'Kara delik nedir?',
                    'back_content': 'Uzayda çekim gücü çok yüksek olan yerler vardır. Burası o kadar güçlüdür ki, ışığı bile kendine doğru çeker. Bu yüzden rengi siyahtır.',
                    'order': 9,
                },
                {
                    'title': 'Evren Çok Büyük',
                    'front_content': 'Evren ne kadar büyük?',
                    'back_content': 'Evren o kadar büyük ki, içinde sayamayacağımız kadar çok yıldız ve gezegen var. Bizim dünyamız bu koca evrenin içinde sadece minik bir noktadır.',
                    'order': 10,
                },
            ],
            'teknoloji': [
                {
                    'title': 'Tablet Nasıl Çalışır?',
                    'front_content': 'Tablet dokunuşu nasıl anlar?',
                    'back_content': 'Tabletlerin ekranının altında çok ince teller vardır. Parmağınla dokunduğunda sıcaklığı ve elektriği hisseder. Böylece senin nereye bastığını anlar.',
                    'order': 1,
                },
                {
                    'title': 'Enerji Kutusu (Pil)',
                    'front_content': 'Pil ne işe yarar?',
                    'back_content': 'Piller, oyuncakların çalışması için gereken enerjiyi saklar. Oyuncak arabanın pili bitince durur. Yeni pil takınca tekrar hareket etmeye başlar.',
                    'order': 2,
                },
                {
                    'title': 'İnternet Ağı',
                    'front_content': 'İnternet nedir?',
                    'back_content': 'İnternet, dünyadaki bilgisayarların birbiriyle konuşmasını sağlar. Görünmeyen sinyallerle bilgi taşır. Çizgi filmler bu yoldan ekranına gelir.',
                    'order': 3,
                },
                {
                    'title': 'Elektrik (Kablodaki Enerji)',
                    'front_content': 'Elektrik nedir?',
                    'back_content': 'Kabloların içinden elektrik enerjisi geçer. Düğmeye bastığımızda elektrik lambaya ulaşır ve etrafı aydınlatır. Prizlere sadece fişler takılır.',
                    'order': 4,
                },
                {
                    'title': 'Robotlar Nasıl Çalışır?',
                    'front_content': 'Robotlar nasıl hareket eder?',
                    'back_content': 'Robotlar, insanların işini kolaylaştıran makinelerdir. Yorulmazlar ve acıkmazlar. İnsanlar onlara ne yapması gerektiğini kodlarla öğretir.',
                    'order': 5,
                },
                {
                    'title': 'Drone (Uçan Kamera)',
                    'front_content': 'Drone nasıl uçar?',
                    'back_content': 'Drone, uzaktan kumandayla uçurulan pervaneli bir araçtır. Üzerindeki kamerayla kuşlar gibi yukarıdan bakıp bize fotoğraf çekebilir.',
                    'order': 6,
                },
                {
                    'title': 'Yol Haritası (Navigasyon)',
                    'front_content': 'Telefon yolu nasıl buluyor?',
                    'back_content': 'Telefonlardaki haritalar, uzaydaki uydulardan bilgi alır. Böylece nerede olduğumuzu bilir ve gideceğimiz yolu bize tarif eder.',
                    'order': 7,
                },
                {
                    'title': 'Güneş Paneli (Güneşten Elektrik)',
                    'front_content': 'Güneş paneli ne yapar?',
                    'back_content': 'Bazı çatıların üzerinde mavi paneller vardır. Bunlar güneş ışığını alır ve elektriğe çevirir. Doğa dostu bir enerji kaynağıdır.',
                    'order': 8,
                },
                {
                    'title': 'Kablosuz Bağlantı',
                    'front_content': 'Kablosuz kulaklık nasıl çalışır?',
                    'back_content': 'Bazı kulaklıkların kablosu yoktur. Sesi görünmez dalgalarla telefondan kulağına taşır. Böylece hareket ederken kabloya takılmazsın.',
                    'order': 9,
                },
                {
                    'title': '3D Yazıcı (Oyuncak Makinesi)',
                    'front_content': '3D yazıcı ne yapar?',
                    'back_content': 'Bu makine kağıda yazı yazmaz, nesne üretir! Bilgisayardaki çizimi plastik malzemeyi eriterek kat kat örer ve gerçeğe dönüştürür.',
                    'order': 10,
                },
            ],
            'yapay-zeka': [
                {
                    'title': 'Bilgisayar Nasıl Öğrenir?',
                    'front_content': 'Bilgisayarlar nasıl öğrenir?',
                    'back_content': 'Bilgisayarlar normalde düşünemez. Ama onlara binlerce kedi resmi gösterirsek, kedinin neye benzediğini matematik ile öğrenirler.',
                    'order': 1,
                },
                {
                    'title': 'Yüz Tanıma',
                    'front_content': 'Telefon yüzünü nasıl tanır?',
                    'back_content': 'Telefonun kamerası senin yüzündeki noktaları ölçer. Gözlerinin arasının ne kadar açık olduğunu hesaplar. Seni tanırsa kilidi açar.',
                    'order': 2,
                },
                {
                    'title': 'Sesli Yardımcı',
                    'front_content': 'Akıllı hoparlör nasıl çalışır?',
                    'back_content': 'Akıllı hoparlörler senin sesini kaydeder ve kelimelerini anlar. İçindeki bilgisayar sayesinde istediğin şarkıyı bulup çalabilir.',
                    'order': 3,
                },
                {
                    'title': 'Resim Çizen Programlar',
                    'front_content': 'Bilgisayar resim çizebilir mi?',
                    'back_content': 'Bilgisayarlar artık resim de çizebiliyor. Sen ona ne çizmesini istediğini yazarsın, o da bildiği bütün resimleri karıştırıp sana yeni bir resim yapar.',
                    'order': 4,
                },
                {
                    'title': 'Oyun Arkadaşı Bilgisayar',
                    'front_content': 'Bilgisayar oyun oynayabilir mi?',
                    'back_content': 'Tablette oyun oynarken bilgisayar senin hamlelerini takip eder. Oyunu kazanmak için en iyi hamleyi hesaplar. İyi bir satranç oyuncusu gibidir.',
                    'order': 5,
                },
                {
                    'title': 'Kendi Giden Araba',
                    'front_content': 'Araba kendisi nasıl gider?',
                    'back_content': 'Bu arabaların her yerinde kameralar vardır. Yolu, insanları ve diğer arabaları görürler. Bilgisayar sayesinde nereye gideceğine karar verir.',
                    'order': 6,
                },
                {
                    'title': 'Dil Çevirici',
                    'front_content': 'Telefon dil çevirebilir mi?',
                    'back_content': 'Başka bir dilde konuşan birini anlamak için telefonunu kullanabilirsin. Telefon kelimeleri dinler ve senin diline çevirir. Bir sözlük gibidir.',
                    'order': 7,
                },
                {
                    'title': 'Eğlenceli Filtreler',
                    'front_content': 'Telefon filtreler nasıl çalışır?',
                    'back_content': 'Telefon senin yüzünün nerede olduğunu bulur. Tam burnunun olduğu yere kedi burnu, kulaklarının olduğu yere kedi kulağı ekler.',
                    'order': 8,
                },
                {
                    'title': 'Akıllı Öneri',
                    'front_content': 'Uygulama beni nasıl tanır?',
                    'back_content': "Uygulamalar senin en çok hangi çizgi filmleri izlediğini not eder. Sonra sana 'Bunu sevdin, bence bunu da seveceksin' diye benzer filmleri gösterir.",
                    'order': 9,
                },
                {
                    'title': 'Hava Durumu Tahmini',
                    'front_content': 'Hava durumu nasıl tahmin edilir?',
                    'back_content': 'Süper bilgisayarlar rüzgarın hızını ve bulutları ölçer. Topladığı bilgilere bakarak yarın havanın nasıl olacağını tahmin eder.',
                    'order': 10,
                },
            ],
            'doga': [
                {
                    'title': 'Yağmurun Yolculuğu',
                    'front_content': 'Yağmur nereden gelir?',
                    'back_content': 'Su döngüsü hiç durmaz. Denizden buharlaşan sular bulut olur. Bulutlar dolunca yağmur olarak tekrar yeryüzüne düşer.',
                    'order': 1,
                },
                {
                    'title': 'Ağaçların Mevsimleri',
                    'front_content': 'Ağaçlar neden yaprak döker?',
                    'back_content': 'Ağaçlar mevsime göre değişir. İlkbaharda çiçek açar, yazın yeşil yapraklı olur. Sonbaharda yapraklarını döker, kışın dinlenir.',
                    'order': 2,
                },
                {
                    'title': 'Örümcek Ağı',
                    'front_content': 'Örümcek ağı nasıl yapılır?',
                    'back_content': 'Örümcekler kendi ipleriyle ağ örerler. Bu ağlar çok incedir ama sağlamdır. Örümcekler bu ağ sayesinde evlerini yapar.',
                    'order': 3,
                },
                {
                    'title': 'Çalışkan Arılar',
                    'front_content': 'Arılar bal nasıl yapar?',
                    'back_content': 'Arılar çiçekleri çok sever. Çiçeklerden topladıkları özleri kovanlarına götürürler ve orada bal yaparlar. Bal çok faydalı bir besindir.',
                    'order': 4,
                },
                {
                    'title': 'Gökkuşağı Renkleri',
                    'front_content': 'Gökkuşağı nasıl oluşur?',
                    'back_content': 'Güneş ışığı yağmur damlasının içinden geçerken renklere ayrılır. Kırmızı, turuncu, sarı, yeşil, mavi ve mor renkler gökyüzünde bir şerit oluşturur.',
                    'order': 5,
                },
                {
                    'title': 'Rüzgarın Gücü',
                    'front_content': 'Rüzgar nedir?',
                    'back_content': 'Rüzgarı göremezsin ama hissedebilirsin. Hava hızlıca hareket edince rüzgar oluşur. Uçurtmaları gökyüzüne kaldıran güç rüzgardır.',
                    'order': 6,
                },
                {
                    'title': 'Kar Tanesi Şekilleri',
                    'front_content': 'Kar taneleri neye benzer?',
                    'back_content': 'Kar taneleri buzdan oluşur. Her kar tanesinin şekli birbirinden farklıdır. Hiçbiri diğerine benzemez.',
                    'order': 7,
                },
                {
                    'title': 'Mantarlar',
                    'front_content': 'Mantarlar bitki midir?',
                    'back_content': 'Mantarlar bitki değildir, ormanda yetişen özel canlılardır. Bazı mantarları yiyebiliriz ama ormanda gördüğümüz mantarlara dokunmamalıyız.',
                    'order': 8,
                },
                {
                    'title': 'Renk Değiştiren Hayvanlar',
                    'front_content': 'Bukalemun neden renk değiştirir?',
                    'back_content': 'Bazı hayvanlar bulunduğu yerin rengini alabilir. Bukalemunlar yaprağın üzerindeyken yeşil olur, böylece onları fark etmek zorlaşır.',
                    'order': 9,
                },
                {
                    'title': 'Ağaçlar Toprağı Tutar',
                    'front_content': 'Ağaç kökleri ne işe yarar?',
                    'back_content': 'Ağaçların kökleri toprağın içinde büyür ve toprağı sıkıca tutar. Böylece yağmur yağdığında topraklar akıp gitmez. Ağaçlar toprağı korur.',
                    'order': 10,
                },
            ],
            'icatlar': [
                {
                    'title': 'Yuvarlanan Tekerlek',
                    'front_content': 'Tekerlek neden yuvarlak?',
                    'back_content': 'Eşyaları taşımak için tekerlek icat edilmiştir. Yuvarlak olduğu için kolayca döner ve ağır eşyaları rahatça taşımamızı sağlar.',
                    'order': 1,
                },
                {
                    'title': 'Uçaklar',
                    'front_content': 'Uçak nasıl uçar?',
                    'back_content': 'İnsanlar kuşlar gibi uçmak istemiş ve uçakları yapmıştır. Uçaklar kanatları ve motorları sayesinde bizi uzak yerlere götürür.',
                    'order': 2,
                },
                {
                    'title': 'Ampul ve Işık',
                    'front_content': 'Ampul nasıl ışık verir?',
                    'back_content': 'Eskiden geceleri aydınlanmak için mum kullanılırdı. Ampul icat edilince düğmeye basarak her yeri aydınlatmak mümkün oldu.',
                    'order': 3,
                },
                {
                    'title': 'Telefon',
                    'front_content': 'Telefon ne işe yarar?',
                    'back_content': 'Telefon, sesimizi uzaklara ileten bir cihazdır. Dünyanın diğer ucundaki sevdiklerimizle konuşmamızı sağlar.',
                    'order': 4,
                },
                {
                    'title': 'Şemsiye',
                    'front_content': 'Şemsiye nasıl korur?',
                    'back_content': 'Şemsiye bizi yağmurdan koruyan taşınabilir bir çatıdır. Açılınca ıslanmamızı engeller, kapanınca kolayca taşınır.',
                    'order': 5,
                },
                {
                    'title': 'Pusula (Yön Bulucu)',
                    'front_content': 'Pusula nasıl çalışır?',
                    'back_content': 'Pusula, yönümüzü bulmamıza yarayan bir alettir. İbresi her zaman Kuzey yönünü gösterir. Kaybolmamamızı sağlar.',
                    'order': 6,
                },
                {
                    'title': 'Saat (Zaman Ölçer)',
                    'front_content': 'Saat ne işe yarar?',
                    'back_content': 'Saat zamanı ölçmemize yarar. Akrep ve yelkovan bize saatin kaç olduğunu gösterir. Okula gitme ve uyuma vaktini saatten öğreniriz.',
                    'order': 7,
                },
                {
                    'title': 'Gözlük',
                    'front_content': 'Gözlük neden takılır?',
                    'back_content': 'Bazı insanların gözleri uzağı veya yakını iyi göremez. Gözlük takarak her şeyi daha net ve parlak görebilirler.',
                    'order': 8,
                },
                {
                    'title': 'Ateşin Bulunuşu',
                    'front_content': 'Ateş nasıl bulundu?',
                    'back_content': 'Çok eskiden insanlar ateşi buldu. Ateş sayesinde ısındılar, yemeklerini pişirdiler ve karanlıkta aydınlandılar.',
                    'order': 9,
                },
                {
                    'title': 'Kağıt',
                    'front_content': 'Kağıt neden yapılır?',
                    'back_content': 'Kullandığımız kağıtlar ağaçlardan yapılır. Fabrikalarda işlenen ağaçlar incecik kağıtlara dönüşür. Bu yüzden kağıtları israf etmemeliyiz.',
                    'order': 10,
                },
            ],
            'matematik-mantik': [
                {
                    'title': 'Rakamlar',
                    'front_content': 'Rakamlar ne işe yarar?',
                    'back_content': 'Nesneleri saymak için rakamları kullanırız. Kaç tane elma olduğunu veya kaç yaşında olduğunu rakamlarla anlatırsın.',
                    'order': 1,
                },
                {
                    'title': 'Simetri (Ayna Görüntüsü)',
                    'front_content': 'Simetri nedir?',
                    'back_content': 'Kelebeğin bir kanadı diğer kanadının aynısıdır. Ortadan katlarsan üst üste gelirler. Buna simetri denir. Senin yüzün de simetriktir.',
                    'order': 2,
                },
                {
                    'title': 'Geometrik Şekiller',
                    'front_content': 'Şekiller nerede var?',
                    'back_content': 'Çevremizdeki her şey bir şekle benzer. Top daireye, kitap dikdörtgene benzer. Şekiller birleşerek nesneleri oluşturur.',
                    'order': 3,
                },
                {
                    'title': 'Örüntü (Sıralama)',
                    'front_content': 'Örüntü nedir?',
                    'back_content': 'Nesnelerin belli bir kurala göre dizilmesine örüntü denir. Kırmızı, Mavi, Kırmızı... Sırada ne var? Evet, Mavi!',
                    'order': 4,
                },
                {
                    'title': 'Ölçmek',
                    'front_content': 'Ölçmek ne demek?',
                    'back_content': "Bir şeyin uzunluğunu anlamak için onu ölçeriz. Cetvel kullanabiliriz veya ellerimizle 'karış' yaparak ölçebiliriz.",
                    'order': 5,
                },
                {
                    'title': 'Sıfır (Yokluk)',
                    'front_content': 'Sıfır ne demek?',
                    'back_content': "Sepette hiç elma yoksa, buna 'Sıfır' deriz. Sıfır, elinde hiç kalmadığını anlatan sayıdır.",
                    'order': 6,
                },
                {
                    'title': 'Toplama (Bir Araya Getirme)',
                    'front_content': 'Toplama nasıl yapılır?',
                    'back_content': 'Toplama işlemi, sayıları bir araya getirmektir. İki elmanın yanına bir elma daha koyarsan çoğalır ve üç elma olur.',
                    'order': 7,
                },
                {
                    'title': 'Ağır ve Hafif (Terazi)',
                    'front_content': 'Ağır ve hafif ne demek?',
                    'back_content': 'Bazı eşyalar ağırdır, kaldırmak zordur. Bazıları ise hafiftir, kolayca kalkar. Terazide ağır olan taraf aşağı iner.',
                    'order': 8,
                },
                {
                    'title': 'Zaman (Dün, Bugün, Yarın)',
                    'front_content': 'Dün, bugün, yarın ne demek?',
                    'back_content': "Geçip giden zamana 'Dün' deriz. Şu an yaşadığımız zaman 'Bugün'dür. Henüz gelmeyen zaman ise 'Yarın'dır.",
                    'order': 9,
                },
                {
                    'title': 'Gruplama',
                    'front_content': 'Gruplama ne demek?',
                    'back_content': 'Benzer şeyleri bir araya koymaya gruplama denir. Oyuncakları oyuncak kutusuna, kıyafetleri dolaba koyarız.',
                    'order': 10,
                },
            ],
            'sanat-muzik': [
                {
                    'title': 'Sesimiz Nasıl Çıkar?',
                    'front_content': 'Sesimiz nasıl oluşur?',
                    'back_content': 'Boğazımızda ses telleri vardır. Nefes verirken bu teller titrer ve sesimiz çıkar. Tıpkı bir gitarın teli gibi titreşir.',
                    'order': 1,
                },
                {
                    'title': 'Yankı (Ses Yansıması)',
                    'front_content': 'Yankı nedir?',
                    'back_content': 'Boş bir odada bağırırsan sesin duvarlara çarpar ve sana geri gelir. Buna yankı denir. Sesin tekrar duyulmasıdır.',
                    'order': 2,
                },
                {
                    'title': 'Renklerin Karışımı',
                    'front_content': 'Renkler nasıl karışır?',
                    'back_content': 'Farklı renkleri karıştırınca yeni renkler elde ederiz. Sarı ile Maviyi karıştırırsan Yeşil renk oluşur.',
                    'order': 3,
                },
                {
                    'title': 'Ritim',
                    'front_content': 'Ritim nedir?',
                    'back_content': 'Müziğin düzenli tekrar eden vuruşlarına ritim denir. Şarkı söylerken ellerimizle ritim tutabiliriz.',
                    'order': 4,
                },
                {
                    'title': 'Notalar',
                    'front_content': 'Notalar ne işe yarar?',
                    'back_content': 'Yazı yazmak için harfleri kullanırız, müzik yazmak için de notaları kullanırız. Her notanın farklı bir sesi vardır.',
                    'order': 5,
                },
                {
                    'title': 'Işık ve Gölge',
                    'front_content': 'Resimde gölge nasıl yapılır?',
                    'back_content': 'Resim yaparken ışığın geldiği yönü düşünürüz. Işığın gelmediği taraf daha koyu renkli olur, buna gölge denir.',
                    'order': 6,
                },
                {
                    'title': 'Piyano Nasıl Çalışır?',
                    'front_content': 'Piyano nasıl ses çıkarır?',
                    'back_content': 'Piyanonun içinde teller vardır. Tuşa bastığımızda minik bir çekiç tele vurur ve ses çıkar. Uzun teller kalın, kısa teller ince ses çıkarır.',
                    'order': 7,
                },
                {
                    'title': 'Heykel',
                    'front_content': 'Heykel nasıl yapılır?',
                    'back_content': 'Heykeltıraşlar taşa veya çamura şekil verir. Fazlalıkları alarak içinden bir şekil ortaya çıkarırlar.',
                    'order': 8,
                },
                {
                    'title': 'Doku (Yüzeyler)',
                    'front_content': 'Doku nedir?',
                    'back_content': 'Nesnelerin yüzeyine dokununca nasıl hissettiğimize doku denir. Bazı şeyler pütürlü, bazıları yumuşaktır.',
                    'order': 9,
                },
                {
                    'title': 'Orkestra',
                    'front_content': 'Orkestra nedir?',
                    'back_content': 'Birçok müzisyenin bir arada çalgı çalmasına orkestra denir. Herkes uyum içinde çalar ve güzel bir müzik ortaya çıkar.',
                    'order': 10,
                },
            ],
        }

        total_cards = 0
        for cat_slug, cards in cards_data.items():
            experiment = experiments[cat_slug]
            for card_data in cards:
                card, created = LearningCard.objects.update_or_create(
                    experiment=experiment,
                    title=card_data['title'],
                    defaults={
                        'front_content': card_data['front_content'],
                        'back_content': card_data['back_content'],
                        'order': card_data['order'],
                    }
                )
                total_cards += 1
            self.stdout.write(f"  🃏 {experiment.title}: {len(cards)} kart")

        self.stdout.write(self.style.SUCCESS(f'\n📚 Toplam {total_cards} Öğrenme Kartı hazır!'))
