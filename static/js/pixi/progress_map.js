/**
 * Progress Map - Görsel İlerleme Haritası
 * Çocuklar için etkileşimli ada/gezegen keşif yolculuğu
 * @version 1.0
 */

class ProgressMap {
    constructor(canvasId, options = {}) {
        this.canvasElement = document.getElementById(canvasId);
        if (!this.canvasElement) {
            console.error(`Canvas element '${canvasId}' bulunamadı!`);
            return;
        }

        this.app = new PIXI.Application({
            width: options.width || 900,
            height: options.height || 650,
            backgroundColor: 0x87CEEB,
            antialias: true,
            resolution: window.devicePixelRatio || 1
        });

        this.canvasElement.appendChild(this.app.view);

        // Kullanıcı ilerlemesi (dışarıdan gelecek)
        this.userProgress = options.progress || {
            level: 1,
            xp: 0,
            completedExperiments: [],
            badges: [],
            currentStreak: 0
        };

        // Ada/İstasyon tanımları
        this.islands = [
            {
                id: 'start',
                name: '🏠 Başlangıç Adası',
                x: 100,
                y: 500,
                color: 0x8BC34A,
                unlockLevel: 0,
                description: 'Maceranın başladığı yer!',
                experiments: []
            },
            {
                id: 'nature',
                name: '🌱 Doğa Adası',
                x: 250,
                y: 400,
                color: 0x4CAF50,
                unlockLevel: 1,
                description: 'Bitkiler ve doğa deneyleri!',
                experiments: ['plant_growth', 'plant_story']
            },
            {
                id: 'colors',
                name: '🎨 Renk Adası',
                x: 400,
                y: 320,
                color: 0xE91E63,
                unlockLevel: 2,
                description: 'Renkler ve sanat deneyleri!',
                experiments: ['color_lab', 'creative_drawing']
            },
            {
                id: 'space',
                name: '🚀 Uzay İstasyonu',
                x: 550,
                y: 230,
                color: 0x3F51B5,
                unlockLevel: 3,
                description: 'Gezegenler ve yıldızlar!',
                experiments: ['orbit_game', 'solar_quiz']
            },
            {
                id: 'engineering',
                name: '⚙️ Mühendislik Adası',
                x: 700,
                y: 150,
                color: 0xFF9800,
                unlockLevel: 4,
                description: 'İcat ve tasarım!',
                experiments: ['inventor_workshop', 'circuit_design']
            },
            {
                id: 'logic',
                name: '🧩 Mantık Kulesi',
                x: 800,
                y: 80,
                color: 0x9C27B0,
                unlockLevel: 5,
                description: 'Bulmacalar ve kodlama!',
                experiments: ['pattern_puzzle']
            }
        ];

        // Rozetler
        this.badges = [
            { id: 'first_step', name: '🌟 İlk Adım', description: 'İlk deneyi tamamla!', icon: '🌟' },
            { id: 'nature_lover', name: '🌿 Doğa Sever', description: 'Doğa deneylerini tamamla!', icon: '🌿' },
            { id: 'artist', name: '🎨 Sanatçı', description: 'Sanat deneylerini tamamla!', icon: '🎨' },
            { id: 'astronaut', name: '🚀 Astronot', description: 'Uzay deneylerini tamamla!', icon: '🚀' },
            { id: 'inventor', name: '⚙️ Mucit', description: 'Mühendislik deneylerini tamamla!', icon: '⚙️' },
            { id: 'genius', name: '🧠 Dahi', description: 'Tüm deneyleri tamamla!', icon: '🧠' }
        ];

        this.init();
    }

    init() {
        this.createSkyBackground();
        this.createOcean();
        this.createClouds();
        this.createPaths();
        this.createIslands();
        this.createCharacter();
        this.createStatsPanel();
        this.createBadgesPanel();
        this.createLegend();
        this.animateScene();
    }

    createSkyBackground() {
        // Gradient gökyüzü
        const sky = new PIXI.Graphics();

        // Üstten alta gradient efekti (katmanlar)
        const colors = [0x1A237E, 0x3F51B5, 0x64B5F6, 0x87CEEB];
        const heights = [0, 150, 350, this.app.screen.height];

        for (let i = 0; i < colors.length - 1; i++) {
            sky.beginFill(colors[i]);
            sky.drawRect(0, heights[i], this.app.screen.width, heights[i + 1] - heights[i]);
            sky.endFill();
        }

        this.app.stage.addChild(sky);

        // Yıldızlar (üst kısımda)
        for (let i = 0; i < 50; i++) {
            const star = new PIXI.Graphics();
            star.beginFill(0xFFFFFF, 0.5 + Math.random() * 0.5);
            star.drawCircle(0, 0, Math.random() * 2 + 0.5);
            star.endFill();
            star.x = Math.random() * this.app.screen.width;
            star.y = Math.random() * 200;
            this.app.stage.addChild(star);

            // Parıldama
            if (Math.random() > 0.6) {
                let alpha = star.alpha;
                let dir = -1;
                const twinkle = () => {
                    alpha += 0.02 * dir;
                    if (alpha <= 0.3 || alpha >= 1) dir *= -1;
                    star.alpha = alpha;
                    requestAnimationFrame(twinkle);
                };
                twinkle();
            }
        }

        // Güneş
        const sun = new PIXI.Graphics();
        sun.beginFill(0xFFD700, 0.9);
        sun.drawCircle(0, 0, 40);
        sun.endFill();
        sun.beginFill(0xFFEB3B, 0.4);
        sun.drawCircle(0, 0, 55);
        sun.endFill();
        sun.x = 800;
        sun.y = 60;
        this.app.stage.addChild(sun);

        // Güneş parlaması
        let sunGlow = 0;
        let sunDir = 1;
        const animateSun = () => {
            sunGlow += 0.01 * sunDir;
            if (sunGlow >= 0.2 || sunGlow <= 0) sunDir *= -1;
            sun.scale.set(1 + sunGlow);
            requestAnimationFrame(animateSun);
        };
        animateSun();
    }

    createOcean() {
        // Okyanus
        const ocean = new PIXI.Graphics();
        ocean.beginFill(0x0077BE, 0.8);
        ocean.drawRect(0, 450, this.app.screen.width, 200);
        ocean.endFill();
        this.app.stage.addChild(ocean);

        // Dalgalar
        this.waves = [];
        for (let i = 0; i < 5; i++) {
            const wave = new PIXI.Graphics();
            wave.beginFill(0x00A0E4, 0.3);
            wave.drawEllipse(0, 0, 150, 15);
            wave.endFill();
            wave.x = i * 200;
            wave.y = 470 + Math.random() * 30;
            wave.originalX = wave.x;
            this.app.stage.addChild(wave);
            this.waves.push(wave);
        }
    }

    createClouds() {
        // Bulutlar
        this.clouds = [];
        for (let i = 0; i < 6; i++) {
            const cloud = this.createCloud();
            cloud.x = Math.random() * this.app.screen.width;
            cloud.y = 100 + Math.random() * 200;
            cloud.speed = 0.2 + Math.random() * 0.3;
            this.app.stage.addChild(cloud);
            this.clouds.push(cloud);
        }
    }

    createCloud() {
        const cloud = new PIXI.Graphics();
        cloud.beginFill(0xFFFFFF, 0.8);
        cloud.drawEllipse(0, 0, 50, 25);
        cloud.drawEllipse(30, -10, 40, 20);
        cloud.drawEllipse(-25, 5, 35, 20);
        cloud.drawEllipse(50, 5, 30, 15);
        cloud.endFill();
        return cloud;
    }

    createPaths() {
        // Adalar arası yollar
        const pathGraphics = new PIXI.Graphics();
        pathGraphics.lineStyle(6, 0xFFD54F, 0.6);

        for (let i = 0; i < this.islands.length - 1; i++) {
            const start = this.islands[i];
            const end = this.islands[i + 1];

            // Noktalı yol
            const distance = Math.sqrt(Math.pow(end.x - start.x, 2) + Math.pow(end.y - start.y, 2));
            const dots = Math.floor(distance / 20);

            for (let j = 0; j < dots; j++) {
                const progress = j / dots;
                const x = start.x + (end.x - start.x) * progress;
                const y = start.y + (end.y - start.y) * progress;

                const unlocked = this.userProgress.level >= end.unlockLevel;
                pathGraphics.beginFill(unlocked ? 0xFFD54F : 0x9E9E9E, 0.8);
                pathGraphics.drawCircle(x, y, 4);
                pathGraphics.endFill();
            }
        }

        this.app.stage.addChild(pathGraphics);
    }

    createIslands() {
        this.islandContainers = [];

        this.islands.forEach((island, index) => {
            const container = new PIXI.Container();
            container.x = island.x;
            container.y = island.y;
            container.interactive = true;
            container.buttonMode = true;
            container.cursor = 'pointer';

            const unlocked = this.userProgress.level >= island.unlockLevel;
            const current = this.userProgress.level === island.unlockLevel ||
                (index === 0 && this.userProgress.level === 0);

            // Ada gölgesi
            const shadow = new PIXI.Graphics();
            shadow.beginFill(0x000000, 0.2);
            shadow.drawEllipse(5, 10, 50, 25);
            shadow.endFill();
            container.addChild(shadow);

            // Ada zemini
            const ground = new PIXI.Graphics();
            if (unlocked) {
                ground.beginFill(island.color);
            } else {
                ground.beginFill(0x9E9E9E);
            }
            ground.drawEllipse(0, 0, 50, 30);
            ground.endFill();

            // Ada üstü detaylar
            if (unlocked) {
                ground.beginFill(0x8D6E63);
                ground.drawEllipse(0, 5, 40, 20);
                ground.endFill();
            }
            container.addChild(ground);

            // Ada ismi arka planı
            const nameBg = new PIXI.Graphics();
            nameBg.beginFill(unlocked ? 0x000000 : 0x616161, 0.7);
            nameBg.drawRoundedRect(-60, -70, 120, 30, 8);
            nameBg.endFill();
            container.addChild(nameBg);

            // Ada ismi
            const name = new PIXI.Text(unlocked ? island.name : '🔒 ???', {
                fontFamily: 'Arial',
                fontSize: 12,
                fill: 0xFFFFFF,
                fontWeight: 'bold'
            });
            name.anchor.set(0.5);
            name.y = -55;
            container.addChild(name);

            // Seviye rozeti
            const levelBadge = new PIXI.Graphics();
            levelBadge.beginFill(current ? 0xFFD700 : (unlocked ? 0x4CAF50 : 0x9E9E9E));
            levelBadge.drawCircle(40, -20, 15);
            levelBadge.endFill();
            container.addChild(levelBadge);

            const levelText = new PIXI.Text((island.unlockLevel + 1).toString(), {
                fontFamily: 'Arial',
                fontSize: 14,
                fill: 0xFFFFFF,
                fontWeight: 'bold'
            });
            levelText.anchor.set(0.5);
            levelText.x = 40;
            levelText.y = -20;
            container.addChild(levelText);

            // Kilitsiz adalarda dekorasyon
            if (unlocked) {
                this.addIslandDecoration(container, island);
            }

            // Güncel ada parlaması
            if (current) {
                const glow = new PIXI.Graphics();
                glow.beginFill(0xFFD700, 0.3);
                glow.drawCircle(0, 0, 65);
                glow.endFill();
                container.addChildAt(glow, 0);

                // Nabız animasyonu
                let scale = 1;
                let dir = 1;
                const pulse = () => {
                    scale += 0.005 * dir;
                    if (scale >= 1.1 || scale <= 0.9) dir *= -1;
                    glow.scale.set(scale);
                    requestAnimationFrame(pulse);
                };
                pulse();
            }

            // Tıklama olayı
            container.on('pointerdown', () => {
                if (unlocked) {
                    this.showIslandDetails(island);
                } else {
                    this.showLockedMessage(island);
                }
            });

            container.on('pointerover', () => {
                if (unlocked) {
                    container.scale.set(1.1);
                }
            });

            container.on('pointerout', () => {
                container.scale.set(1);
            });

            this.app.stage.addChild(container);
            this.islandContainers.push(container);
        });
    }

    addIslandDecoration(container, island) {
        // Ada türüne göre dekorasyon
        switch (island.id) {
            case 'start':
                // Bayrak
                const flag = new PIXI.Graphics();
                flag.beginFill(0xFF5722);
                flag.moveTo(0, -30);
                flag.lineTo(20, -40);
                flag.lineTo(20, -55);
                flag.lineTo(0, -45);
                flag.closePath();
                flag.endFill();
                flag.lineStyle(3, 0x795548);
                flag.moveTo(0, -20);
                flag.lineTo(0, -55);
                container.addChild(flag);
                break;

            case 'nature':
                // Ağaç
                const tree = new PIXI.Graphics();
                tree.beginFill(0x4CAF50);
                tree.drawCircle(-15, -40, 15);
                tree.drawCircle(0, -50, 18);
                tree.drawCircle(15, -40, 15);
                tree.endFill();
                tree.lineStyle(4, 0x795548);
                tree.moveTo(0, -20);
                tree.lineTo(0, -35);
                container.addChild(tree);
                break;

            case 'colors':
                // Palet
                const palette = new PIXI.Graphics();
                const colors = [0xFF5722, 0xFFEB3B, 0x4CAF50, 0x2196F3];
                colors.forEach((color, i) => {
                    palette.beginFill(color);
                    palette.drawCircle(-20 + i * 13, -35, 5);
                    palette.endFill();
                });
                container.addChild(palette);
                break;

            case 'space':
                // Roket
                const rocket = new PIXI.Graphics();
                rocket.beginFill(0xE0E0E0);
                rocket.moveTo(0, -60);
                rocket.lineTo(-8, -40);
                rocket.lineTo(8, -40);
                rocket.closePath();
                rocket.endFill();
                rocket.beginFill(0xF44336);
                rocket.drawRect(-8, -40, 16, 15);
                rocket.endFill();
                container.addChild(rocket);
                break;

            case 'engineering':
                // Dişli
                const gear = new PIXI.Graphics();
                gear.beginFill(0x607D8B);
                gear.drawCircle(0, -40, 12);
                gear.endFill();
                for (let i = 0; i < 8; i++) {
                    const angle = (i / 8) * Math.PI * 2;
                    gear.beginFill(0x607D8B);
                    gear.drawRect(
                        Math.cos(angle) * 10 - 3,
                        -40 + Math.sin(angle) * 10 - 3,
                        6, 6
                    );
                    gear.endFill();
                }
                container.addChild(gear);
                break;

            case 'logic':
                // Bulmaca parçası
                const puzzle = new PIXI.Graphics();
                puzzle.beginFill(0x9C27B0);
                puzzle.drawRoundedRect(-12, -52, 24, 24, 3);
                puzzle.endFill();
                puzzle.beginFill(0xFFFFFF, 0.5);
                puzzle.drawCircle(0, -40, 4);
                puzzle.endFill();
                container.addChild(puzzle);
                break;
        }
    }

    createCharacter() {
        // Karakter (mevcut adalarda)
        this.character = new PIXI.Container();

        // Gölge
        const shadow = new PIXI.Graphics();
        shadow.beginFill(0x000000, 0.3);
        shadow.drawEllipse(0, 25, 12, 5);
        shadow.endFill();
        this.character.addChild(shadow);

        // Gövde
        const body = new PIXI.Graphics();
        body.beginFill(0x2196F3);
        body.drawRoundedRect(-12, -10, 24, 35, 8);
        body.endFill();
        this.character.addChild(body);

        // Kafa
        const head = new PIXI.Graphics();
        head.beginFill(0xFFE0B2);
        head.drawCircle(0, -20, 15);
        head.endFill();
        this.character.addChild(head);

        // Gözler
        const eyes = new PIXI.Graphics();
        eyes.beginFill(0x000000);
        eyes.drawCircle(-5, -22, 3);
        eyes.drawCircle(5, -22, 3);
        eyes.endFill();
        this.character.addChild(eyes);

        // Gülümseme
        const smile = new PIXI.Graphics();
        smile.lineStyle(2, 0x000000);
        smile.arc(0, -15, 6, 0, Math.PI);
        this.character.addChild(smile);

        // Karakteri mevcut adaya yerleştir
        const currentIsland = this.islands.find(i =>
            i.unlockLevel === this.userProgress.level
        ) || this.islands[0];

        this.character.x = currentIsland.x;
        this.character.y = currentIsland.y - 50;

        this.app.stage.addChild(this.character);

        // Zıplama animasyonu
        let bounce = 0;
        let bounceDir = 1;
        const animateCharacter = () => {
            bounce += 0.1 * bounceDir;
            if (bounce >= 5 || bounce <= 0) bounceDir *= -1;
            this.character.y = currentIsland.y - 50 - bounce;
            requestAnimationFrame(animateCharacter);
        };
        animateCharacter();
    }

    createStatsPanel() {
        // İstatistik paneli (sol üst)
        const panel = new PIXI.Container();
        panel.x = 10;
        panel.y = 10;

        const bg = new PIXI.Graphics();
        bg.beginFill(0x000000, 0.7);
        bg.drawRoundedRect(0, 0, 180, 120, 15);
        bg.endFill();
        panel.addChild(bg);

        // Seviye
        const levelText = new PIXI.Text(`⭐ Seviye: ${this.userProgress.level + 1}`, {
            fontFamily: 'Arial',
            fontSize: 18,
            fill: 0xFFD700,
            fontWeight: 'bold'
        });
        levelText.x = 15;
        levelText.y = 15;
        panel.addChild(levelText);

        // XP Bar
        const xpBarBg = new PIXI.Graphics();
        xpBarBg.beginFill(0x333333);
        xpBarBg.drawRoundedRect(15, 45, 150, 15, 5);
        xpBarBg.endFill();
        panel.addChild(xpBarBg);

        const xpNeeded = (this.userProgress.level + 1) * 100;
        const xpProgress = Math.min(this.userProgress.xp / xpNeeded, 1);

        const xpBar = new PIXI.Graphics();
        xpBar.beginFill(0x4CAF50);
        xpBar.drawRoundedRect(15, 45, 150 * xpProgress, 15, 5);
        xpBar.endFill();
        panel.addChild(xpBar);

        const xpText = new PIXI.Text(`${this.userProgress.xp}/${xpNeeded} XP`, {
            fontFamily: 'Arial',
            fontSize: 10,
            fill: 0xFFFFFF
        });
        xpText.x = 70;
        xpText.y = 47;
        panel.addChild(xpText);

        // Tamamlanan deneyler
        const expText = new PIXI.Text(`🔬 Deneyler: ${this.userProgress.completedExperiments.length}`, {
            fontFamily: 'Arial',
            fontSize: 14,
            fill: 0xFFFFFF
        });
        expText.x = 15;
        expText.y = 70;
        panel.addChild(expText);

        // Seri
        const streakText = new PIXI.Text(`🔥 Seri: ${this.userProgress.currentStreak} gün`, {
            fontFamily: 'Arial',
            fontSize: 14,
            fill: 0xFF9800
        });
        streakText.x = 15;
        streakText.y = 92;
        panel.addChild(streakText);

        this.app.stage.addChild(panel);
    }

    createBadgesPanel() {
        // Rozetler paneli (sağ üst)
        const panel = new PIXI.Container();
        panel.x = this.app.screen.width - 200;
        panel.y = 10;

        const bg = new PIXI.Graphics();
        bg.beginFill(0x000000, 0.7);
        bg.drawRoundedRect(0, 0, 190, 80, 15);
        bg.endFill();
        panel.addChild(bg);

        const title = new PIXI.Text('🏆 Rozetler', {
            fontFamily: 'Arial',
            fontSize: 14,
            fill: 0xFFD700,
            fontWeight: 'bold'
        });
        title.x = 15;
        title.y = 10;
        panel.addChild(title);

        // Rozet ikonları
        this.badges.slice(0, 5).forEach((badge, index) => {
            const earned = this.userProgress.badges.includes(badge.id);

            const badgeIcon = new PIXI.Text(badge.icon, {
                fontSize: 24
            });
            badgeIcon.x = 15 + index * 35;
            badgeIcon.y = 40;
            badgeIcon.alpha = earned ? 1 : 0.3;
            panel.addChild(badgeIcon);
        });

        this.app.stage.addChild(panel);
    }

    createLegend() {
        // Lejant (sağ alt)
        const legend = new PIXI.Container();
        legend.x = this.app.screen.width - 150;
        legend.y = this.app.screen.height - 100;

        const bg = new PIXI.Graphics();
        bg.beginFill(0x000000, 0.6);
        bg.drawRoundedRect(0, 0, 140, 90, 10);
        bg.endFill();
        legend.addChild(bg);

        const items = [
            { color: 0x4CAF50, text: '✓ Açık' },
            { color: 0xFFD700, text: '📍 Şu an' },
            { color: 0x9E9E9E, text: '🔒 Kilitli' }
        ];

        items.forEach((item, index) => {
            const dot = new PIXI.Graphics();
            dot.beginFill(item.color);
            dot.drawCircle(20, 20 + index * 25, 8);
            dot.endFill();
            legend.addChild(dot);

            const text = new PIXI.Text(item.text, {
                fontFamily: 'Arial',
                fontSize: 12,
                fill: 0xFFFFFF
            });
            text.x = 35;
            text.y = 13 + index * 25;
            legend.addChild(text);
        });

        this.app.stage.addChild(legend);
    }

    showIslandDetails(island) {
        // Ada detay popup'ı
        const overlay = new PIXI.Container();
        overlay.name = 'islandOverlay';

        const darkness = new PIXI.Graphics();
        darkness.beginFill(0x000000, 0.7);
        darkness.drawRect(0, 0, this.app.screen.width, this.app.screen.height);
        darkness.endFill();
        darkness.interactive = true;
        overlay.addChild(darkness);

        const panel = new PIXI.Graphics();
        panel.beginFill(island.color, 0.95);
        panel.lineStyle(4, 0xFFFFFF);
        panel.drawRoundedRect(this.app.screen.width / 2 - 200, 150, 400, 350, 20);
        panel.endFill();
        overlay.addChild(panel);

        // Başlık
        const title = new PIXI.Text(island.name, {
            fontFamily: 'Fredoka One, Arial',
            fontSize: 28,
            fill: 0xFFFFFF
        });
        title.anchor.set(0.5);
        title.x = this.app.screen.width / 2;
        title.y = 190;
        overlay.addChild(title);

        // Açıklama
        const desc = new PIXI.Text(island.description, {
            fontFamily: 'Arial',
            fontSize: 16,
            fill: 0xFFFFFF
        });
        desc.anchor.set(0.5);
        desc.x = this.app.screen.width / 2;
        desc.y = 230;
        overlay.addChild(desc);

        // Deneyler
        const expTitle = new PIXI.Text('🔬 Deneyler:', {
            fontFamily: 'Arial',
            fontSize: 18,
            fill: 0xFFFFFF,
            fontWeight: 'bold'
        });
        expTitle.x = this.app.screen.width / 2 - 170;
        expTitle.y = 270;
        overlay.addChild(expTitle);

        if (island.experiments.length > 0) {
            island.experiments.forEach((exp, index) => {
                const completed = this.userProgress.completedExperiments.includes(exp);
                const expText = new PIXI.Text(`${completed ? '✅' : '⬜'} ${exp.replace('_', ' ')}`, {
                    fontFamily: 'Arial',
                    fontSize: 14,
                    fill: 0xFFFFFF
                });
                expText.x = this.app.screen.width / 2 - 170;
                expText.y = 300 + index * 25;
                overlay.addChild(expText);
            });
        } else {
            const noExp = new PIXI.Text('Burası başlangıç noktası!', {
                fontFamily: 'Arial',
                fontSize: 14,
                fill: 0xFFFFFF,
                fontStyle: 'italic'
            });
            noExp.x = this.app.screen.width / 2 - 170;
            noExp.y = 300;
            overlay.addChild(noExp);
        }

        // Kapat butonu
        const closeBtn = new PIXI.Container();
        closeBtn.x = this.app.screen.width / 2;
        closeBtn.y = 450;
        closeBtn.interactive = true;
        closeBtn.buttonMode = true;
        closeBtn.cursor = 'pointer';

        const closeBg = new PIXI.Graphics();
        closeBg.beginFill(0xFFFFFF);
        closeBg.drawRoundedRect(-60, -20, 120, 40, 10);
        closeBg.endFill();
        closeBtn.addChild(closeBg);

        const closeText = new PIXI.Text('Kapat', {
            fontFamily: 'Arial',
            fontSize: 16,
            fill: island.color,
            fontWeight: 'bold'
        });
        closeText.anchor.set(0.5);
        closeBtn.addChild(closeText);

        closeBtn.on('pointerdown', () => {
            this.app.stage.removeChild(overlay);
        });
        overlay.addChild(closeBtn);

        darkness.on('pointerdown', () => {
            this.app.stage.removeChild(overlay);
        });

        this.app.stage.addChild(overlay);
        this.playSound('click');
    }

    showLockedMessage(island) {
        this.showMessage(`🔒 Bu adayı açmak için Seviye ${island.unlockLevel + 1}'e ulaşmalısın!`, 0xF44336);
        this.playSound('error');
    }

    showMessage(text, color) {
        const existing = this.app.stage.children.find(c => c.name === 'message');
        if (existing) this.app.stage.removeChild(existing);

        const container = new PIXI.Container();
        container.name = 'message';

        const bg = new PIXI.Graphics();
        bg.beginFill(color, 0.95);
        bg.drawRoundedRect(0, 0, text.length * 9 + 40, 45, 10);
        bg.endFill();
        container.addChild(bg);

        const textEl = new PIXI.Text(text, {
            fontFamily: 'Arial',
            fontSize: 14,
            fill: 0xFFFFFF,
            fontWeight: 'bold'
        });
        textEl.x = 20;
        textEl.y = 12;
        container.addChild(textEl);

        container.x = this.app.screen.width / 2 - (text.length * 9 + 40) / 2;
        container.y = this.app.screen.height - 60;

        this.app.stage.addChild(container);

        setTimeout(() => {
            if (this.app.stage.children.includes(container)) {
                this.app.stage.removeChild(container);
            }
        }, 3000);
    }

    animateScene() {
        // Bulut hareketi
        const animateClouds = () => {
            this.clouds.forEach(cloud => {
                cloud.x += cloud.speed;
                if (cloud.x > this.app.screen.width + 100) {
                    cloud.x = -100;
                }
            });
            requestAnimationFrame(animateClouds);
        };
        animateClouds();

        // Dalga hareketi
        const animateWaves = () => {
            this.waves.forEach((wave, index) => {
                wave.x = wave.originalX + Math.sin(Date.now() / 1000 + index) * 20;
            });
            requestAnimationFrame(animateWaves);
        };
        animateWaves();
    }

    // Dış API - İlerleme güncelleme
    updateProgress(newProgress) {
        this.userProgress = { ...this.userProgress, ...newProgress };
        // Haritayı yeniden çiz
        this.app.stage.removeChildren();
        this.init();
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
window.ProgressMap = ProgressMap;
