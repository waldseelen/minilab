/**
 * Solar Explorer V2 - Gelişmiş Uzay Keşif Simülasyonu
 * Görsel atlas, gezegenler, yıldızlar, galaksiler
 * @version 2.0
 */

class SolarExplorerV2 {
    constructor(canvasId, options = {}) {
        this.canvasElement = document.getElementById(canvasId);
        if (!this.canvasElement) {
            console.error(`Canvas element '${canvasId}' bulunamadı!`);
            return;
        }

        this.app = new PIXI.Application({
            width: options.width || 900,
            height: options.height || 650,
            backgroundColor: 0x0A0A1A,
            antialias: true,
            resolution: window.devicePixelRatio || 1
        });

        this.canvasElement.appendChild(this.app.view);

        // Durum değişkenleri
        this.currentCategory = 'planets';
        this.selectedItem = null;
        this.discoveredItems = [];
        this.score = 0;
        this.quizActive = false;
        this.currentQuiz = null;

        // Uzay verileri
        this.spaceData = {
            planets: {
                name: '🪐 Gezegenler',
                items: [
                    {
                        id: 'mercury',
                        name: 'Merkür',
                        emoji: '☿️',
                        color: 0xB5B5B5,
                        size: 25,
                        facts: [
                            'Güneş\'e en yakın gezegen!',
                            'Atmosferi yok, çok sıcak ve çok soğuk!',
                            'Bir yılı sadece 88 gün!'
                        ],
                        quiz: {
                            question: 'Merkür Güneş\'e ne kadar yakın?',
                            options: ['En yakın', 'İkinci en yakın', 'Ortada', 'Uzakta'],
                            correct: 0
                        }
                    },
                    {
                        id: 'venus',
                        name: 'Venüs',
                        emoji: '♀️',
                        color: 0xFFD700,
                        size: 35,
                        facts: [
                            'Dünya\'nın ikizi denilen gezegen!',
                            'Çok sıcak! 450°C kadar!',
                            'Bulutları asit dolu!'
                        ],
                        quiz: {
                            question: 'Venüs neden sıcak?',
                            options: ['Güneş\'e yakın', 'Kalın atmosfer', 'Volkanlar', 'Büyük'],
                            correct: 1
                        }
                    },
                    {
                        id: 'earth',
                        name: 'Dünya',
                        emoji: '🌍',
                        color: 0x1E90FF,
                        size: 38,
                        facts: [
                            'Bizim evimiz! 🏠',
                            'Tek sıvı suyu olan gezegen!',
                            'Canlıların yaşadığı tek yer!'
                        ],
                        quiz: {
                            question: 'Dünya\'yı özel yapan ne?',
                            options: ['Büyük', 'Sıvı su', 'Halkası var', 'En sıcak'],
                            correct: 1
                        }
                    },
                    {
                        id: 'mars',
                        name: 'Mars',
                        emoji: '♂️',
                        color: 0xFF4500,
                        size: 32,
                        facts: [
                            'Kırmızı gezegen! 🔴',
                            'İki küçük ayı var!',
                            'Robotlar orada keşif yapıyor!'
                        ],
                        quiz: {
                            question: 'Mars neden kırmızı?',
                            options: ['Sıcak', 'Demir (Pas)', 'Volkan', 'Güneş'],
                            correct: 1
                        }
                    },
                    {
                        id: 'jupiter',
                        name: 'Jüpiter',
                        emoji: '♃',
                        color: 0xD2691E,
                        size: 65,
                        facts: [
                            'En büyük gezegen! 🏆',
                            'Dev fırtına: Büyük Kırmızı Leke!',
                            '79 ayı var!'
                        ],
                        quiz: {
                            question: 'Jüpiter\'in kaç ayı var?',
                            options: ['1', '2', '12', '79'],
                            correct: 3
                        }
                    },
                    {
                        id: 'saturn',
                        name: 'Satürn',
                        emoji: '🪐',
                        color: 0xF4A460,
                        size: 58,
                        hasRings: true,
                        facts: [
                            'Güzel halkaları var! 💍',
                            'Suda yüzebilir (hafif)!',
                            '82 ayı var!'
                        ],
                        quiz: {
                            question: 'Satürn\'ün halkaları neden yapılmış?',
                            options: ['Taş', 'Buz ve taş', 'Altın', 'Gaz'],
                            correct: 1
                        }
                    },
                    {
                        id: 'uranus',
                        name: 'Uranüs',
                        emoji: '⛢',
                        color: 0x40E0D0,
                        size: 45,
                        facts: [
                            'Yatay dönen gezegen!',
                            'Buz devi!',
                            'Çok soğuk: -224°C!'
                        ],
                        quiz: {
                            question: 'Uranüs\'ün özelliği nedir?',
                            options: ['Yatay döner', 'En büyük', 'En sıcak', 'Halkası yok'],
                            correct: 0
                        }
                    },
                    {
                        id: 'neptune',
                        name: 'Neptün',
                        emoji: '♆',
                        color: 0x4169E1,
                        size: 44,
                        facts: [
                            'En uzak gezegen!',
                            'Mavi renkli!',
                            'Çok güçlü fırtınaları var!'
                        ],
                        quiz: {
                            question: 'Neptün neden mavi?',
                            options: ['Su', 'Metan gazı', 'Gökyüzü yansıması', 'Boyalı'],
                            correct: 1
                        }
                    }
                ]
            },
            stars: {
                name: '⭐ Yıldızlar',
                items: [
                    {
                        id: 'sun',
                        name: 'Güneş',
                        emoji: '☀️',
                        color: 0xFFD700,
                        size: 80,
                        facts: [
                            'Bizim yıldızımız! ⭐',
                            '4.6 milyar yaşında!',
                            'Isısı 5,500°C!'
                        ],
                        quiz: {
                            question: 'Güneş ne tür bir yıldız?',
                            options: ['Kırmızı dev', 'Sarı cüce', 'Beyaz cüce', 'Süpernova'],
                            correct: 1
                        }
                    },
                    {
                        id: 'sirius',
                        name: 'Sirius',
                        emoji: '✨',
                        color: 0xFFFFFF,
                        size: 45,
                        facts: [
                            'En parlak yıldız!',
                            'Köpek Yıldızı da denir!',
                            '8.6 ışık yılı uzakta!'
                        ],
                        quiz: {
                            question: 'Sirius\'un diğer adı ne?',
                            options: ['Kuzey Yıldızı', 'Köpek Yıldızı', 'Kutup Yıldızı', 'Sabah Yıldızı'],
                            correct: 1
                        }
                    },
                    {
                        id: 'polaris',
                        name: 'Kutup Yıldızı',
                        emoji: '⭐',
                        color: 0xF0F8FF,
                        size: 40,
                        facts: [
                            'Hep kuzeyi gösterir!',
                            'Denizcilere yol gösterir!',
                            '433 ışık yılı uzakta!'
                        ],
                        quiz: {
                            question: 'Kutup Yıldızı ne için kullanılır?',
                            options: ['Şans getirmek', 'Yön bulmak', 'Dilek tutmak', 'Hava tahmini'],
                            correct: 1
                        }
                    },
                    {
                        id: 'betelgeuse',
                        name: 'Betelgeuse',
                        emoji: '🔴',
                        color: 0xFF6347,
                        size: 60,
                        facts: [
                            'Kırmızı süper dev!',
                            'Güneş\'ten 700 kat büyük!',
                            'Yakında patlayabilir!'
                        ],
                        quiz: {
                            question: 'Betelgeuse ne tür yıldız?',
                            options: ['Sarı cüce', 'Beyaz cüce', 'Kırmızı süper dev', 'Kahverengi cüce'],
                            correct: 2
                        }
                    }
                ]
            },
            galaxies: {
                name: '🌌 Galaksiler',
                items: [
                    {
                        id: 'milkyway',
                        name: 'Samanyolu',
                        emoji: '🌌',
                        color: 0xE6E6FA,
                        size: 70,
                        isGalaxy: true,
                        facts: [
                            'Bizim galaksimiz! 🏠',
                            '200 milyar yıldız var!',
                            'Spiral şeklinde!'
                        ],
                        quiz: {
                            question: 'Samanyolu\'nda kaç yıldız var?',
                            options: ['1 milyon', '1 milyar', '200 milyar', '1 trilyon'],
                            correct: 2
                        }
                    },
                    {
                        id: 'andromeda',
                        name: 'Andromeda',
                        emoji: '🌀',
                        color: 0x9370DB,
                        size: 75,
                        isGalaxy: true,
                        facts: [
                            'En yakın büyük galaksi!',
                            '2.5 milyon ışık yılı uzakta!',
                            'Samanyolu ile birleşecek!'
                        ],
                        quiz: {
                            question: 'Andromeda Samanyolu\'na ne yapacak?',
                            options: ['Uzaklaşacak', 'Birleşecek', 'Hiçbir şey', 'Yok edecek'],
                            correct: 1
                        }
                    },
                    {
                        id: 'sombrero',
                        name: 'Sombrero',
                        emoji: '🎩',
                        color: 0xDDA0DD,
                        size: 55,
                        isGalaxy: true,
                        facts: [
                            'Meksika şapkasına benziyor!',
                            '29 milyon ışık yılı uzakta!',
                            '800 milyar yıldız var!'
                        ],
                        quiz: {
                            question: 'Sombrero galaksisi neye benzer?',
                            options: ['Top', 'Şapka', 'Halka', 'Üçgen'],
                            correct: 1
                        }
                    }
                ]
            },
            moons: {
                name: '🌙 Aylar',
                items: [
                    {
                        id: 'moon',
                        name: 'Ay',
                        emoji: '🌙',
                        color: 0xC0C0C0,
                        size: 30,
                        facts: [
                            'Dünya\'nın tek ayı!',
                            'İnsanlar orada yürüdü!',
                            'Gel-git olaylarına neden olur!'
                        ],
                        quiz: {
                            question: 'Ay Dünya\'yı nasıl etkiler?',
                            options: ['Hava durumu', 'Gel-git', 'Deprem', 'Fırtına'],
                            correct: 1
                        }
                    },
                    {
                        id: 'europa',
                        name: 'Europa',
                        emoji: '🧊',
                        color: 0xE0FFFF,
                        size: 28,
                        facts: [
                            'Jüpiter\'in buzlu ayı!',
                            'Altında okyanus olabilir!',
                            'Yaşam olabilir mi? 🤔'
                        ],
                        quiz: {
                            question: 'Europa\'nın yüzeyi neden kaplı?',
                            options: ['Kum', 'Buz', 'Lav', 'Su'],
                            correct: 1
                        }
                    },
                    {
                        id: 'titan',
                        name: 'Titan',
                        emoji: '🟠',
                        color: 0xFFA500,
                        size: 35,
                        facts: [
                            'Satürn\'ün en büyük ayı!',
                            'Kalın atmosferi var!',
                            'Metan gölleri var!'
                        ],
                        quiz: {
                            question: 'Titan\'da ne tür göller var?',
                            options: ['Su', 'Lav', 'Metan', 'Asit'],
                            correct: 2
                        }
                    },
                    {
                        id: 'io',
                        name: 'Io',
                        emoji: '🌋',
                        color: 0xFFFF00,
                        size: 28,
                        facts: [
                            'En volkanik yer!',
                            'Yüzlerce volkan var!',
                            'Sürekli patlıyor!'
                        ],
                        quiz: {
                            question: 'Io\'yu özel yapan ne?',
                            options: ['Buz', 'Volkanlar', 'Su', 'Ormanlar'],
                            correct: 1
                        }
                    }
                ]
            }
        };

        this.init();
    }

    init() {
        this.createStarryBackground();
        this.createHeader();
        this.createCategoryMenu();
        this.createAtlasArea();
        this.createInfoPanel();
        this.createProgressPanel();
        this.showCategory('planets');
    }

    createStarryBackground() {
        // Koyu uzay arka planı
        const bg = new PIXI.Graphics();
        bg.beginFill(0x0A0A1A);
        bg.drawRect(0, 0, this.app.screen.width, this.app.screen.height);
        bg.endFill();
        this.app.stage.addChild(bg);

        // Yıldızlar
        for (let i = 0; i < 200; i++) {
            const star = new PIXI.Graphics();
            const brightness = Math.random();
            star.beginFill(0xFFFFFF, brightness);
            star.drawCircle(0, 0, Math.random() * 2 + 0.5);
            star.endFill();
            star.x = Math.random() * this.app.screen.width;
            star.y = Math.random() * this.app.screen.height;
            this.app.stage.addChild(star);

            // Parıldama animasyonu
            if (Math.random() > 0.7) {
                let alpha = brightness;
                let dir = -1;
                const twinkle = () => {
                    alpha += 0.02 * dir;
                    if (alpha <= 0.2 || alpha >= brightness) dir *= -1;
                    star.alpha = alpha;
                    requestAnimationFrame(twinkle);
                };
                twinkle();
            }
        }

        // Nebula efekti
        const nebula = new PIXI.Graphics();
        nebula.beginFill(0x4B0082, 0.1);
        nebula.drawEllipse(700, 400, 200, 150);
        nebula.endFill();
        nebula.beginFill(0x800080, 0.08);
        nebula.drawEllipse(150, 300, 150, 100);
        nebula.endFill();
        this.app.stage.addChild(nebula);
    }

    createHeader() {
        // Başlık paneli
        const header = new PIXI.Graphics();
        header.beginFill(0x1A1A2E, 0.9);
        header.drawRect(0, 0, this.app.screen.width, 55);
        header.endFill();
        this.app.stage.addChild(header);

        const title = new PIXI.Text('🚀 Uzay Kaşifi', {
            fontFamily: 'Fredoka One, Arial',
            fontSize: 32,
            fill: 0x00D4FF,
            dropShadow: true,
            dropShadowColor: '#0066FF',
            dropShadowDistance: 2
        });
        title.x = 20;
        title.y = 10;
        this.app.stage.addChild(title);

        // Skor
        this.scoreDisplay = new PIXI.Text('⭐ 0', {
            fontFamily: 'Arial',
            fontSize: 24,
            fill: 0xFFD700,
            fontWeight: 'bold'
        });
        this.scoreDisplay.x = this.app.screen.width - 100;
        this.scoreDisplay.y = 15;
        this.app.stage.addChild(this.scoreDisplay);
    }

    createCategoryMenu() {
        // Kategori menüsü (sol)
        const menuBg = new PIXI.Graphics();
        menuBg.beginFill(0x16213E, 0.95);
        menuBg.lineStyle(2, 0x00D4FF);
        menuBg.drawRoundedRect(10, 65, 160, 280, 15);
        menuBg.endFill();
        this.app.stage.addChild(menuBg);

        const menuTitle = new PIXI.Text('📚 Kategoriler', {
            fontFamily: 'Arial',
            fontSize: 18,
            fill: 0x00D4FF,
            fontWeight: 'bold'
        });
        menuTitle.x = 30;
        menuTitle.y = 78;
        this.app.stage.addChild(menuTitle);

        this.categoryButtonsContainer = new PIXI.Container();
        this.categoryButtonsContainer.x = 20;
        this.categoryButtonsContainer.y = 115;
        this.app.stage.addChild(this.categoryButtonsContainer);

        const categories = Object.keys(this.spaceData);
        categories.forEach((cat, index) => {
            const btn = new PIXI.Container();
            btn.y = index * 55;
            btn.interactive = true;
            btn.buttonMode = true;
            btn.cursor = 'pointer';

            const bg = new PIXI.Graphics();
            bg.beginFill(this.currentCategory === cat ? 0x00D4FF : 0x1A1A2E);
            bg.lineStyle(2, 0x00D4FF);
            bg.drawRoundedRect(0, 0, 140, 45, 10);
            bg.endFill();
            btn.addChild(bg);
            btn.bg = bg;
            btn.catKey = cat;

            const text = new PIXI.Text(this.spaceData[cat].name, {
                fontFamily: 'Arial',
                fontSize: 14,
                fill: this.currentCategory === cat ? 0x1A1A2E : 0xFFFFFF,
                fontWeight: 'bold'
            });
            text.x = 10;
            text.y = 12;
            btn.addChild(text);
            btn.text = text;

            btn.on('pointerover', () => {
                if (this.currentCategory !== cat) {
                    bg.alpha = 0.8;
                }
            });

            btn.on('pointerout', () => {
                bg.alpha = 1;
            });

            btn.on('pointerdown', () => {
                this.showCategory(cat);
                this.playSound('click');
            });

            this.categoryButtonsContainer.addChild(btn);
        });
    }

    updateCategoryButtons() {
        this.categoryButtonsContainer.children.forEach(btn => {
            const isActive = btn.catKey === this.currentCategory;
            btn.bg.clear();
            btn.bg.beginFill(isActive ? 0x00D4FF : 0x1A1A2E);
            btn.bg.lineStyle(2, 0x00D4FF);
            btn.bg.drawRoundedRect(0, 0, 140, 45, 10);
            btn.bg.endFill();
            btn.text.style.fill = isActive ? 0x1A1A2E : 0xFFFFFF;
        });
    }

    createAtlasArea() {
        // Ana atlas alanı
        this.atlasContainer = new PIXI.Container();
        this.atlasContainer.x = 180;
        this.atlasContainer.y = 65;
        this.app.stage.addChild(this.atlasContainer);

        const atlasBg = new PIXI.Graphics();
        atlasBg.beginFill(0x0D1B2A, 0.8);
        atlasBg.lineStyle(2, 0x00D4FF, 0.5);
        atlasBg.drawRoundedRect(0, 0, 440, 520, 15);
        atlasBg.endFill();
        this.atlasContainer.addChild(atlasBg);
    }

    showCategory(category) {
        this.currentCategory = category;
        this.selectedItem = null;
        this.updateCategoryButtons();
        this.renderAtlas();
        this.clearInfoPanel();
    }

    renderAtlas() {
        // Atlas içeriğini temizle (arka plan hariç)
        while (this.atlasContainer.children.length > 1) {
            this.atlasContainer.removeChildAt(1);
        }

        const items = this.spaceData[this.currentCategory].items;
        const categoryTitle = new PIXI.Text(this.spaceData[this.currentCategory].name, {
            fontFamily: 'Arial',
            fontSize: 22,
            fill: 0x00D4FF,
            fontWeight: 'bold'
        });
        categoryTitle.x = 20;
        categoryTitle.y = 15;
        this.atlasContainer.addChild(categoryTitle);

        // Gezegen/yıldız düzeni
        const cols = this.currentCategory === 'planets' ? 4 : 3;
        const startX = 40;
        const startY = 60;
        const spacingX = 100;
        const spacingY = 120;

        items.forEach((item, index) => {
            const col = index % cols;
            const row = Math.floor(index / cols);

            const container = this.createSpaceItem(item, startX + col * spacingX, startY + row * spacingY);
            this.atlasContainer.addChild(container);
        });
    }

    createSpaceItem(item, x, y) {
        const container = new PIXI.Container();
        container.x = x;
        container.y = y;
        container.interactive = true;
        container.buttonMode = true;
        container.cursor = 'pointer';

        const discovered = this.discoveredItems.includes(item.id);

        // Glow efekti
        const glow = new PIXI.Graphics();
        glow.beginFill(item.color, 0.2);
        glow.drawCircle(0, 0, item.size + 15);
        glow.endFill();
        glow.visible = false;
        container.addChild(glow);
        container.glow = glow;

        // Ana gök cismi
        const body = new PIXI.Graphics();

        if (item.isGalaxy) {
            // Galaksi spiral
            body.beginFill(item.color, 0.8);
            body.drawEllipse(0, 0, item.size, item.size * 0.4);
            body.endFill();
            body.beginFill(item.color, 0.5);
            body.drawEllipse(0, 0, item.size * 0.7, item.size * 0.25);
            body.endFill();
        } else if (item.hasRings) {
            // Satürn halkaları
            body.lineStyle(6, 0xD2B48C, 0.7);
            body.drawEllipse(0, 0, item.size + 20, 10);
            body.beginFill(item.color);
            body.lineStyle(0);
            body.drawCircle(0, 0, item.size);
            body.endFill();
        } else {
            // Normal gezegen/yıldız
            body.beginFill(item.color);
            body.drawCircle(0, 0, item.size);
            body.endFill();

            // Detay
            if (item.color !== 0xFFD700) { // Güneş değilse
                body.beginFill(0x000000, 0.1);
                body.drawCircle(-item.size * 0.2, -item.size * 0.2, item.size * 0.3);
                body.endFill();
            }
        }
        container.addChild(body);

        // Keşfedilmemiş maske
        if (!discovered) {
            const mask = new PIXI.Graphics();
            mask.beginFill(0x333333, 0.7);
            mask.drawCircle(0, 0, item.size + 5);
            mask.endFill();
            container.addChild(mask);

            const question = new PIXI.Text('?', {
                fontFamily: 'Arial',
                fontSize: 24,
                fill: 0xFFFFFF,
                fontWeight: 'bold'
            });
            question.anchor.set(0.5);
            container.addChild(question);
        }

        // İsim
        const name = new PIXI.Text(discovered ? item.name : '???', {
            fontFamily: 'Arial',
            fontSize: 12,
            fill: discovered ? 0xFFFFFF : 0x888888,
            fontWeight: 'bold'
        });
        name.anchor.set(0.5);
        name.y = item.size + 20;
        container.addChild(name);

        // Keşfedildi ikonu
        if (discovered) {
            const checkmark = new PIXI.Text('✓', {
                fontFamily: 'Arial',
                fontSize: 16,
                fill: 0x00FF00
            });
            checkmark.x = item.size - 5;
            checkmark.y = -item.size - 5;
            container.addChild(checkmark);
        }

        // Hover efektleri
        container.on('pointerover', () => {
            container.glow.visible = true;
            container.scale.set(1.1);
        });

        container.on('pointerout', () => {
            container.glow.visible = false;
            container.scale.set(1);
        });

        container.on('pointerdown', () => {
            this.selectItem(item);
        });

        // Yörünge animasyonu (gezegenler için)
        if (this.currentCategory === 'planets' && discovered) {
            let angle = Math.random() * Math.PI * 2;
            const orbit = () => {
                angle += 0.02;
                body.rotation = Math.sin(angle) * 0.1;
                requestAnimationFrame(orbit);
            };
            orbit();
        }

        return container;
    }

    createInfoPanel() {
        // Bilgi paneli (sağ)
        const panelBg = new PIXI.Graphics();
        panelBg.beginFill(0x16213E, 0.95);
        panelBg.lineStyle(2, 0x00D4FF);
        panelBg.drawRoundedRect(630, 65, 260, 520, 15);
        panelBg.endFill();
        this.app.stage.addChild(panelBg);

        this.infoContainer = new PIXI.Container();
        this.infoContainer.x = 640;
        this.infoContainer.y = 75;
        this.app.stage.addChild(this.infoContainer);

        const defaultText = new PIXI.Text('👆 Bir gök cismi seç!', {
            fontFamily: 'Arial',
            fontSize: 18,
            fill: 0x888888,
            fontStyle: 'italic'
        });
        defaultText.x = 20;
        defaultText.y = 200;
        this.infoContainer.addChild(defaultText);
    }

    clearInfoPanel() {
        this.infoContainer.removeChildren();
        const defaultText = new PIXI.Text('👆 Bir gök cismi seç!', {
            fontFamily: 'Arial',
            fontSize: 18,
            fill: 0x888888,
            fontStyle: 'italic'
        });
        defaultText.x = 20;
        defaultText.y = 200;
        this.infoContainer.addChild(defaultText);
    }

    selectItem(item) {
        this.selectedItem = item;
        this.infoContainer.removeChildren();

        // Başlık
        const title = new PIXI.Text(`${item.emoji} ${item.name}`, {
            fontFamily: 'Fredoka One, Arial',
            fontSize: 24,
            fill: 0x00D4FF
        });
        title.x = 10;
        title.y = 10;
        this.infoContainer.addChild(title);

        const discovered = this.discoveredItems.includes(item.id);

        if (discovered) {
            // Bilgi kartı
            const factsBg = new PIXI.Graphics();
            factsBg.beginFill(0x0D1B2A);
            factsBg.drawRoundedRect(5, 50, 235, 180, 10);
            factsBg.endFill();
            this.infoContainer.addChild(factsBg);

            const factsTitle = new PIXI.Text('📖 Bilgiler:', {
                fontFamily: 'Arial',
                fontSize: 16,
                fill: 0xFFD700,
                fontWeight: 'bold'
            });
            factsTitle.x = 15;
            factsTitle.y = 60;
            this.infoContainer.addChild(factsTitle);

            item.facts.forEach((fact, index) => {
                const factText = new PIXI.Text(`• ${fact}`, {
                    fontFamily: 'Arial',
                    fontSize: 13,
                    fill: 0xFFFFFF,
                    wordWrap: true,
                    wordWrapWidth: 210
                });
                factText.x = 15;
                factText.y = 90 + index * 40;
                this.infoContainer.addChild(factText);
            });

            // Quiz butonu
            const quizBtn = this.createButton('🎯 Quiz Yap!', 10, 250, 0x4CAF50, () => {
                this.startQuiz(item);
            });
            this.infoContainer.addChild(quizBtn);

        } else {
            // Keşfet butonu
            const discoverText = new PIXI.Text('🔍 Bu gök cismini henüz keşfetmedin!', {
                fontFamily: 'Arial',
                fontSize: 14,
                fill: 0xFFFFFF,
                wordWrap: true,
                wordWrapWidth: 220
            });
            discoverText.x = 10;
            discoverText.y = 60;
            this.infoContainer.addChild(discoverText);

            const discoverBtn = this.createButton('🔭 Keşfet!', 10, 120, 0xFF9800, () => {
                this.discoverItem(item);
            });
            this.infoContainer.addChild(discoverBtn);
        }

        this.playSound('click');
    }

    createButton(text, x, y, color, callback) {
        const btn = new PIXI.Container();
        btn.x = x;
        btn.y = y;
        btn.interactive = true;
        btn.buttonMode = true;
        btn.cursor = 'pointer';

        const bg = new PIXI.Graphics();
        bg.beginFill(color);
        bg.drawRoundedRect(0, 0, 225, 45, 10);
        bg.endFill();
        btn.addChild(bg);

        const label = new PIXI.Text(text, {
            fontFamily: 'Arial',
            fontSize: 18,
            fill: 0xFFFFFF,
            fontWeight: 'bold'
        });
        label.x = 112.5 - label.width / 2;
        label.y = 10;
        btn.addChild(label);

        btn.on('pointerover', () => {
            bg.alpha = 0.8;
            btn.scale.set(1.02);
        });

        btn.on('pointerout', () => {
            bg.alpha = 1;
            btn.scale.set(1);
        });

        btn.on('pointerdown', callback);

        return btn;
    }

    discoverItem(item) {
        if (this.discoveredItems.includes(item.id)) return;

        this.discoveredItems.push(item.id);
        this.score += 10;
        this.scoreDisplay.text = `⭐ ${this.score}`;
        this.updateProgressPanel();

        // Keşif animasyonu
        this.showDiscoveryAnimation(item);
        this.renderAtlas();
        this.selectItem(item);

        // Progress callback
        if (window.updateExperimentProgress) {
            window.updateExperimentProgress(
                this.discoveredItems.length,
                `${this.discoveredItems.length} gök cismi keşfedildi!`
            );
        }

        this.playSound('success');
    }

    showDiscoveryAnimation(item) {
        const overlay = new PIXI.Container();

        const bg = new PIXI.Graphics();
        bg.beginFill(0x000000, 0.7);
        bg.drawRect(0, 0, this.app.screen.width, this.app.screen.height);
        bg.endFill();
        overlay.addChild(bg);

        const panel = new PIXI.Graphics();
        panel.beginFill(0x16213E);
        panel.lineStyle(4, 0x00D4FF);
        panel.drawRoundedRect(this.app.screen.width / 2 - 180, this.app.screen.height / 2 - 120, 360, 240, 20);
        panel.endFill();
        overlay.addChild(panel);

        const title = new PIXI.Text('🎉 YENİ KEŞİF!', {
            fontFamily: 'Fredoka One, Arial',
            fontSize: 28,
            fill: 0xFFD700
        });
        title.anchor.set(0.5);
        title.x = this.app.screen.width / 2;
        title.y = this.app.screen.height / 2 - 80;
        overlay.addChild(title);

        const itemName = new PIXI.Text(`${item.emoji} ${item.name}`, {
            fontFamily: 'Arial',
            fontSize: 32,
            fill: 0x00D4FF,
            fontWeight: 'bold'
        });
        itemName.anchor.set(0.5);
        itemName.x = this.app.screen.width / 2;
        itemName.y = this.app.screen.height / 2 - 20;
        overlay.addChild(itemName);

        const points = new PIXI.Text('+10 ⭐', {
            fontFamily: 'Arial',
            fontSize: 24,
            fill: 0xFFD700
        });
        points.anchor.set(0.5);
        points.x = this.app.screen.width / 2;
        points.y = this.app.screen.height / 2 + 30;
        overlay.addChild(points);

        const hint = new PIXI.Text('Tıkla devam etmek için', {
            fontFamily: 'Arial',
            fontSize: 14,
            fill: 0x888888
        });
        hint.anchor.set(0.5);
        hint.x = this.app.screen.width / 2;
        hint.y = this.app.screen.height / 2 + 80;
        overlay.addChild(hint);

        overlay.interactive = true;
        overlay.on('pointerdown', () => {
            this.app.stage.removeChild(overlay);
        });

        overlay.scale.set(0);
        this.app.stage.addChild(overlay);

        // Zoom animasyonu
        let scale = 0;
        const zoomIn = () => {
            scale += 0.1;
            overlay.scale.set(Math.min(scale, 1));
            if (scale < 1) requestAnimationFrame(zoomIn);
        };
        zoomIn();

        // Parıltı efekti
        this.createSparkles(this.app.screen.width / 2, this.app.screen.height / 2);
    }

    createSparkles(cx, cy) {
        const colors = [0xFFD700, 0x00D4FF, 0xFFFFFF];

        for (let i = 0; i < 20; i++) {
            setTimeout(() => {
                const sparkle = new PIXI.Graphics();
                sparkle.beginFill(colors[Math.floor(Math.random() * colors.length)]);
                sparkle.drawStar(0, 0, 4, 8, 4);
                sparkle.endFill();

                const angle = Math.random() * Math.PI * 2;
                const distance = 50 + Math.random() * 100;

                sparkle.x = cx;
                sparkle.y = cy;
                sparkle.targetX = cx + Math.cos(angle) * distance;
                sparkle.targetY = cy + Math.sin(angle) * distance;

                this.app.stage.addChild(sparkle);

                let progress = 0;
                const animate = () => {
                    progress += 0.05;
                    sparkle.x = cx + (sparkle.targetX - cx) * progress;
                    sparkle.y = cy + (sparkle.targetY - cy) * progress;
                    sparkle.alpha = 1 - progress;
                    sparkle.rotation += 0.2;

                    if (progress < 1) {
                        requestAnimationFrame(animate);
                    } else {
                        this.app.stage.removeChild(sparkle);
                    }
                };
                animate();
            }, i * 50);
        }
    }

    startQuiz(item) {
        this.quizActive = true;
        this.currentQuiz = item;

        // Quiz overlay
        const overlay = new PIXI.Container();
        overlay.name = 'quizOverlay';

        const bg = new PIXI.Graphics();
        bg.beginFill(0x000000, 0.8);
        bg.drawRect(0, 0, this.app.screen.width, this.app.screen.height);
        bg.endFill();
        overlay.addChild(bg);

        const panel = new PIXI.Graphics();
        panel.beginFill(0x16213E);
        panel.lineStyle(3, 0x00D4FF);
        panel.drawRoundedRect(this.app.screen.width / 2 - 250, 100, 500, 450, 20);
        panel.endFill();
        overlay.addChild(panel);

        // Başlık
        const title = new PIXI.Text(`🎯 ${item.name} Quiz`, {
            fontFamily: 'Fredoka One, Arial',
            fontSize: 28,
            fill: 0x00D4FF
        });
        title.anchor.set(0.5);
        title.x = this.app.screen.width / 2;
        title.y = 140;
        overlay.addChild(title);

        // Soru
        const question = new PIXI.Text(item.quiz.question, {
            fontFamily: 'Arial',
            fontSize: 20,
            fill: 0xFFFFFF,
            fontWeight: 'bold',
            wordWrap: true,
            wordWrapWidth: 450
        });
        question.anchor.set(0.5);
        question.x = this.app.screen.width / 2;
        question.y = 200;
        overlay.addChild(question);

        // Seçenekler
        item.quiz.options.forEach((option, index) => {
            const optBtn = new PIXI.Container();
            optBtn.x = this.app.screen.width / 2;
            optBtn.y = 270 + index * 60;
            optBtn.interactive = true;
            optBtn.buttonMode = true;
            optBtn.cursor = 'pointer';

            const optBg = new PIXI.Graphics();
            optBg.beginFill(0x0D1B2A);
            optBg.lineStyle(2, 0x00D4FF);
            optBg.drawRoundedRect(-200, -22, 400, 44, 10);
            optBg.endFill();
            optBtn.addChild(optBg);
            optBtn.bg = optBg;

            const optText = new PIXI.Text(`${String.fromCharCode(65 + index)}) ${option}`, {
                fontFamily: 'Arial',
                fontSize: 16,
                fill: 0xFFFFFF
            });
            optText.anchor.set(0.5);
            optBtn.addChild(optText);

            optBtn.on('pointerover', () => {
                optBg.clear();
                optBg.beginFill(0x00D4FF, 0.3);
                optBg.lineStyle(2, 0x00D4FF);
                optBg.drawRoundedRect(-200, -22, 400, 44, 10);
                optBg.endFill();
            });

            optBtn.on('pointerout', () => {
                optBg.clear();
                optBg.beginFill(0x0D1B2A);
                optBg.lineStyle(2, 0x00D4FF);
                optBg.drawRoundedRect(-200, -22, 400, 44, 10);
                optBg.endFill();
            });

            optBtn.on('pointerdown', () => {
                this.checkQuizAnswer(index, item.quiz.correct, overlay, optBtn);
            });

            overlay.addChild(optBtn);
        });

        this.app.stage.addChild(overlay);
    }

    checkQuizAnswer(selected, correct, overlay, selectedBtn) {
        const isCorrect = selected === correct;

        // Görsel feedback
        selectedBtn.bg.clear();
        selectedBtn.bg.beginFill(isCorrect ? 0x4CAF50 : 0xF44336);
        selectedBtn.bg.drawRoundedRect(-200, -22, 400, 44, 10);
        selectedBtn.bg.endFill();

        if (isCorrect) {
            this.score += 20;
            this.scoreDisplay.text = `⭐ ${this.score}`;
            this.showQuizResult(overlay, true);
            this.playSound('success');
        } else {
            this.showQuizResult(overlay, false);
            this.playSound('error');
        }
    }

    showQuizResult(overlay, isCorrect) {
        setTimeout(() => {
            // Sonuç mesajı
            const result = new PIXI.Container();

            const resultBg = new PIXI.Graphics();
            resultBg.beginFill(isCorrect ? 0x4CAF50 : 0xF44336, 0.95);
            resultBg.drawRoundedRect(-150, -50, 300, 100, 15);
            resultBg.endFill();
            result.addChild(resultBg);

            const resultText = new PIXI.Text(isCorrect ? '✅ Doğru!' : '❌ Yanlış!', {
                fontFamily: 'Fredoka One, Arial',
                fontSize: 32,
                fill: 0xFFFFFF
            });
            resultText.anchor.set(0.5);
            resultText.y = -10;
            result.addChild(resultText);

            const pointsText = new PIXI.Text(isCorrect ? '+20 ⭐' : 'Tekrar dene!', {
                fontFamily: 'Arial',
                fontSize: 18,
                fill: 0xFFFFFF
            });
            pointsText.anchor.set(0.5);
            pointsText.y = 25;
            result.addChild(pointsText);

            result.x = this.app.screen.width / 2;
            result.y = this.app.screen.height / 2;
            overlay.addChild(result);

            // Kapat
            setTimeout(() => {
                this.app.stage.removeChild(overlay);
                this.quizActive = false;
                this.currentQuiz = null;
            }, 1500);

        }, 500);
    }

    createProgressPanel() {
        // İlerleme paneli (alt sol)
        this.progressContainer = new PIXI.Container();
        this.progressContainer.x = 10;
        this.progressContainer.y = 355;
        this.app.stage.addChild(this.progressContainer);

        this.updateProgressPanel();
    }

    updateProgressPanel() {
        this.progressContainer.removeChildren();

        const bg = new PIXI.Graphics();
        bg.beginFill(0x16213E, 0.95);
        bg.lineStyle(2, 0x00D4FF);
        bg.drawRoundedRect(0, 0, 160, 230, 15);
        bg.endFill();
        this.progressContainer.addChild(bg);

        const title = new PIXI.Text('📊 İlerleme', {
            fontFamily: 'Arial',
            fontSize: 16,
            fill: 0x00D4FF,
            fontWeight: 'bold'
        });
        title.x = 35;
        title.y = 12;
        this.progressContainer.addChild(title);

        // Kategori ilerlemeleri
        let y = 45;
        Object.entries(this.spaceData).forEach(([key, category]) => {
            const total = category.items.length;
            const discovered = category.items.filter(item =>
                this.discoveredItems.includes(item.id)
            ).length;

            const label = new PIXI.Text(`${category.name.split(' ')[0]}`, {
                fontFamily: 'Arial',
                fontSize: 12,
                fill: 0xFFFFFF
            });
            label.x = 10;
            label.y = y;
            this.progressContainer.addChild(label);

            // Progress bar
            const barBg = new PIXI.Graphics();
            barBg.beginFill(0x333333);
            barBg.drawRoundedRect(10, y + 18, 130, 12, 6);
            barBg.endFill();
            this.progressContainer.addChild(barBg);

            const barFill = new PIXI.Graphics();
            const fillWidth = (discovered / total) * 130;
            barFill.beginFill(0x00D4FF);
            barFill.drawRoundedRect(10, y + 18, fillWidth, 12, 6);
            barFill.endFill();
            this.progressContainer.addChild(barFill);

            const countText = new PIXI.Text(`${discovered}/${total}`, {
                fontFamily: 'Arial',
                fontSize: 10,
                fill: 0xFFFFFF
            });
            countText.x = 145 - countText.width;
            countText.y = y;
            this.progressContainer.addChild(countText);

            y += 45;
        });

        // Toplam
        const totalItems = Object.values(this.spaceData).reduce((sum, cat) => sum + cat.items.length, 0);
        const totalDiscovered = this.discoveredItems.length;

        const totalText = new PIXI.Text(`Toplam: ${totalDiscovered}/${totalItems}`, {
            fontFamily: 'Arial',
            fontSize: 14,
            fill: 0xFFD700,
            fontWeight: 'bold'
        });
        totalText.x = 30;
        totalText.y = 200;
        this.progressContainer.addChild(totalText);
    }

    playSound(type) {
        if (window.playSound) {
            window.playSound(type);
        }
    }

    destroy() {
        if (this.app) {
            this.app.destroy(true, { children: true, texture: true, baseTexture: true });
        }
    }
}

// Global erişim
window.SolarExplorerV2 = SolarExplorerV2;
