/**
 * Pattern Puzzle V2 - Gelişmiş Mantık Bulmaca Oyunu
 * 6+ seviye, zorluk dereceleri, görsel ilerleme sistemi
 * @version 2.0
 */

class PatternPuzzleV2 {
    constructor(canvasId, options = {}) {
        this.canvasElement = document.getElementById(canvasId);
        if (!this.canvasElement) {
            console.error(`Canvas element '${canvasId}' bulunamadı!`);
            return;
        }

        this.app = new PIXI.Application({
            width: options.width || 900,
            height: options.height || 650,
            backgroundColor: 0xE8F5E9,
            antialias: true,
            resolution: window.devicePixelRatio || 1
        });

        this.canvasElement.appendChild(this.app.view);

        // Oyun durumu
        this.currentLevel = 1;
        this.score = 0;
        this.streak = 0;
        this.completedLevels = [];
        this.selectedAnswer = null;
        this.lives = 3;
        this.maxLives = 3;

        // Renkler
        this.colors = {
            red: 0xF44336,
            blue: 0x2196F3,
            green: 0x4CAF50,
            yellow: 0xFFEB3B,
            purple: 0x9C27B0,
            orange: 0xFF9800,
            pink: 0xE91E63,
            cyan: 0x00BCD4
        };

        // Şekiller
        this.shapes = ['circle', 'square', 'triangle', 'star', 'heart', 'diamond', 'hexagon'];

        // Seviye tanımları
        this.levels = [
            // Kolay seviyeler (1-3)
            {
                id: 1,
                name: '🌈 Renk Sırası',
                type: 'color_sequence',
                difficulty: 'easy',
                description: 'Sıradaki rengi bul!',
                patternLength: 3,
                options: 3,
                points: 10,
                timeLimit: null
            },
            {
                id: 2,
                name: '🔷 Şekil Sırası',
                type: 'shape_sequence',
                difficulty: 'easy',
                description: 'Sıradaki şekli bul!',
                patternLength: 3,
                options: 3,
                points: 15,
                timeLimit: null
            },
            {
                id: 3,
                name: '📏 Büyük-Küçük',
                type: 'size_sequence',
                difficulty: 'easy',
                description: 'Sıradaki boyutu bul!',
                patternLength: 4,
                options: 3,
                points: 15,
                timeLimit: null
            },
            // Orta seviyeler (4-6)
            {
                id: 4,
                name: '🎨 Renk + Şekil',
                type: 'color_shape',
                difficulty: 'medium',
                description: 'Hem rengi hem şekli bul!',
                patternLength: 4,
                options: 4,
                points: 25,
                timeLimit: 30
            },
            {
                id: 5,
                name: '🔢 Sayı Örüntüsü',
                type: 'number_pattern',
                difficulty: 'medium',
                description: 'Sayıları incele, sıradakini bul!',
                patternLength: 5,
                options: 4,
                points: 30,
                timeLimit: 30
            },
            {
                id: 6,
                name: '🔄 Dönüşüm',
                type: 'rotation',
                difficulty: 'medium',
                description: 'Dönen şeklin bir sonraki hali?',
                patternLength: 4,
                options: 4,
                points: 35,
                timeLimit: 25
            },
            // Zor seviyeler (7-9)
            {
                id: 7,
                name: '🌟 Karmaşık Dizi',
                type: 'complex_sequence',
                difficulty: 'hard',
                description: 'Renk + Şekil + Boyut birlikte!',
                patternLength: 5,
                options: 5,
                points: 50,
                timeLimit: 20
            },
            {
                id: 8,
                name: '🎭 Ayna Görüntüsü',
                type: 'mirror',
                difficulty: 'hard',
                description: 'Yansımayı tahmin et!',
                patternLength: 4,
                options: 4,
                points: 45,
                timeLimit: 20
            },
            {
                id: 9,
                name: '🧩 Matrix Tamamla',
                type: 'matrix',
                difficulty: 'hard',
                description: '3x3 tabloyu tamamla!',
                patternLength: 9,
                options: 4,
                points: 60,
                timeLimit: 30
            }
        ];

        this.init();
    }

    init() {
        this.createBackground();
        this.createHeader();
        this.createLevelMap();
        this.createGameArea();
        this.createStatsPanel();
        this.createLivesDisplay();
        this.loadLevel(1);
    }

    createBackground() {
        // Gradient arka plan
        const bg = new PIXI.Graphics();
        bg.beginFill(0xE8F5E9);
        bg.drawRect(0, 0, this.app.screen.width, this.app.screen.height);
        bg.endFill();
        this.app.stage.addChild(bg);

        // Dekoratif elementler
        for (let i = 0; i < 20; i++) {
            const shape = new PIXI.Graphics();
            const colors = [0x81C784, 0xA5D6A7, 0xC8E6C9];
            shape.beginFill(colors[Math.floor(Math.random() * colors.length)], 0.3);

            if (i % 3 === 0) {
                shape.drawCircle(0, 0, 20 + Math.random() * 30);
            } else if (i % 3 === 1) {
                const size = 30 + Math.random() * 30;
                shape.drawRect(-size / 2, -size / 2, size, size);
            } else {
                shape.drawStar(0, 0, 5, 20 + Math.random() * 15, 10);
            }
            shape.endFill();

            shape.x = Math.random() * this.app.screen.width;
            shape.y = Math.random() * this.app.screen.height;
            shape.alpha = 0.3;
            this.app.stage.addChild(shape);
        }
    }

    createHeader() {
        // Başlık paneli
        const header = new PIXI.Graphics();
        header.beginFill(0x4CAF50);
        header.drawRoundedRect(0, 0, this.app.screen.width, 60, 0);
        header.endFill();
        this.app.stage.addChild(header);

        // Başlık
        const title = new PIXI.Text('🧩 Örüntü Bulmacası', {
            fontFamily: 'Fredoka One, Arial',
            fontSize: 32,
            fill: 0xFFFFFF,
            dropShadow: true,
            dropShadowDistance: 2,
            dropShadowColor: '#00000044'
        });
        title.x = 20;
        title.y = 12;
        this.app.stage.addChild(title);

        // Skor
        this.scoreDisplay = new PIXI.Text('⭐ 0', {
            fontFamily: 'Arial',
            fontSize: 24,
            fill: 0xFFEB3B,
            fontWeight: 'bold'
        });
        this.scoreDisplay.x = this.app.screen.width - 120;
        this.scoreDisplay.y = 18;
        this.app.stage.addChild(this.scoreDisplay);
    }

    createLivesDisplay() {
        this.livesContainer = new PIXI.Container();
        this.livesContainer.x = this.app.screen.width - 250;
        this.livesContainer.y = 15;
        this.app.stage.addChild(this.livesContainer);
        this.updateLivesDisplay();
    }

    updateLivesDisplay() {
        this.livesContainer.removeChildren();

        for (let i = 0; i < this.maxLives; i++) {
            const heart = new PIXI.Text(i < this.lives ? '❤️' : '🖤', {
                fontSize: 24
            });
            heart.x = i * 30;
            this.livesContainer.addChild(heart);
        }
    }

    createLevelMap() {
        // Seviye haritası (sol panel)
        const panel = new PIXI.Graphics();
        panel.beginFill(0xFFFFFF, 0.9);
        panel.lineStyle(3, 0x4CAF50);
        panel.drawRoundedRect(10, 70, 150, 500, 15);
        panel.endFill();
        this.app.stage.addChild(panel);

        const mapTitle = new PIXI.Text('🗺️ Seviyeler', {
            fontFamily: 'Arial',
            fontSize: 18,
            fill: 0x2E7D32,
            fontWeight: 'bold'
        });
        mapTitle.x = 35;
        mapTitle.y = 82;
        this.app.stage.addChild(mapTitle);

        this.levelButtonsContainer = new PIXI.Container();
        this.levelButtonsContainer.x = 20;
        this.levelButtonsContainer.y = 115;
        this.app.stage.addChild(this.levelButtonsContainer);

        this.updateLevelMap();
    }

    updateLevelMap() {
        this.levelButtonsContainer.removeChildren();

        this.levels.forEach((level, index) => {
            const btn = new PIXI.Container();
            btn.y = index * 42;
            btn.interactive = true;
            btn.buttonMode = true;
            btn.cursor = 'pointer';

            const completed = this.completedLevels.includes(level.id);
            const current = this.currentLevel === level.id;
            const locked = level.id > 1 && !this.completedLevels.includes(level.id - 1);

            const bg = new PIXI.Graphics();
            if (current) {
                bg.beginFill(0x4CAF50);
            } else if (completed) {
                bg.beginFill(0x81C784);
            } else if (locked) {
                bg.beginFill(0xBDBDBD);
            } else {
                bg.beginFill(0xE8F5E9);
            }
            bg.lineStyle(2, current ? 0x2E7D32 : 0x4CAF50);
            bg.drawRoundedRect(0, 0, 130, 35, 8);
            bg.endFill();
            btn.addChild(bg);

            // Seviye numarası
            const numBg = new PIXI.Graphics();
            numBg.beginFill(current ? 0xFFFFFF : 0x4CAF50);
            numBg.drawCircle(18, 17, 14);
            numBg.endFill();
            btn.addChild(numBg);

            const num = new PIXI.Text(level.id.toString(), {
                fontFamily: 'Arial',
                fontSize: 14,
                fill: current ? 0x4CAF50 : 0xFFFFFF,
                fontWeight: 'bold'
            });
            num.anchor.set(0.5);
            num.x = 18;
            num.y = 17;
            btn.addChild(num);

            // Durum ikonu
            let statusIcon = locked ? '🔒' : (completed ? '✓' : '');
            const status = new PIXI.Text(statusIcon, {
                fontSize: 14,
                fill: completed ? 0x2E7D32 : 0x666666
            });
            status.x = 110;
            status.y = 8;
            btn.addChild(status);

            // Zorluk göstergesi
            const diffColors = { easy: '🟢', medium: '🟡', hard: '🔴' };
            const diff = new PIXI.Text(diffColors[level.difficulty], {
                fontSize: 10
            });
            diff.x = 40;
            diff.y = 10;
            btn.addChild(diff);

            if (!locked) {
                btn.on('pointerdown', () => {
                    this.loadLevel(level.id);
                    this.playSound('click');
                });

                btn.on('pointerover', () => {
                    if (!current) bg.alpha = 0.8;
                });

                btn.on('pointerout', () => {
                    bg.alpha = 1;
                });
            }

            this.levelButtonsContainer.addChild(btn);
        });
    }

    createGameArea() {
        // Ana oyun alanı
        this.gameArea = new PIXI.Container();
        this.gameArea.x = 170;
        this.gameArea.y = 70;
        this.app.stage.addChild(this.gameArea);

        // Arka plan
        const areaBg = new PIXI.Graphics();
        areaBg.beginFill(0xFFFFFF, 0.95);
        areaBg.lineStyle(3, 0x4CAF50);
        areaBg.drawRoundedRect(0, 0, 720, 500, 15);
        areaBg.endFill();
        this.gameArea.addChild(areaBg);
    }

    createStatsPanel() {
        // İstatistik paneli (alt)
        const statsPanel = new PIXI.Container();
        statsPanel.x = 170;
        statsPanel.y = 580;
        this.app.stage.addChild(statsPanel);

        const bg = new PIXI.Graphics();
        bg.beginFill(0x4CAF50, 0.2);
        bg.drawRoundedRect(0, 0, 720, 60, 10);
        bg.endFill();
        statsPanel.addChild(bg);

        // Streak
        this.streakText = new PIXI.Text('🔥 Seri: 0', {
            fontFamily: 'Arial',
            fontSize: 18,
            fill: 0xFF5722,
            fontWeight: 'bold'
        });
        this.streakText.x = 20;
        this.streakText.y = 18;
        statsPanel.addChild(this.streakText);

        // Tamamlanan
        this.completedText = new PIXI.Text('✅ Tamamlanan: 0/9', {
            fontFamily: 'Arial',
            fontSize: 18,
            fill: 0x2E7D32,
            fontWeight: 'bold'
        });
        this.completedText.x = 300;
        this.completedText.y = 18;
        statsPanel.addChild(this.completedText);

        // Zaman
        this.timerText = new PIXI.Text('⏱️ --', {
            fontFamily: 'Arial',
            fontSize: 18,
            fill: 0x1976D2,
            fontWeight: 'bold'
        });
        this.timerText.x = 580;
        this.timerText.y = 18;
        statsPanel.addChild(this.timerText);
    }

    loadLevel(levelId) {
        // Oyun alanını temizle
        this.gameArea.removeChildren();

        // Arka plan yeniden ekle
        const areaBg = new PIXI.Graphics();
        areaBg.beginFill(0xFFFFFF, 0.95);
        areaBg.lineStyle(3, 0x4CAF50);
        areaBg.drawRoundedRect(0, 0, 720, 500, 15);
        areaBg.endFill();
        this.gameArea.addChild(areaBg);

        this.currentLevel = levelId;
        this.selectedAnswer = null;
        const level = this.levels.find(l => l.id === levelId);

        this.updateLevelMap();

        // Seviye başlığı
        const levelTitle = new PIXI.Text(`${level.name}`, {
            fontFamily: 'Arial',
            fontSize: 26,
            fill: 0x2E7D32,
            fontWeight: 'bold'
        });
        levelTitle.x = 360 - levelTitle.width / 2;
        levelTitle.y = 20;
        this.gameArea.addChild(levelTitle);

        // Açıklama
        const desc = new PIXI.Text(level.description, {
            fontFamily: 'Arial',
            fontSize: 16,
            fill: 0x666666
        });
        desc.x = 360 - desc.width / 2;
        desc.y = 55;
        this.gameArea.addChild(desc);

        // Örüntüyü oluştur
        this.generatePattern(level);

        // Zamanlayıcı
        if (level.timeLimit) {
            this.startTimer(level.timeLimit);
        } else {
            this.timerText.text = '⏱️ --';
        }
    }

    generatePattern(level) {
        switch (level.type) {
            case 'color_sequence':
                this.generateColorSequence(level);
                break;
            case 'shape_sequence':
                this.generateShapeSequence(level);
                break;
            case 'size_sequence':
                this.generateSizeSequence(level);
                break;
            case 'color_shape':
                this.generateColorShapeSequence(level);
                break;
            case 'number_pattern':
                this.generateNumberPattern(level);
                break;
            case 'rotation':
                this.generateRotationPattern(level);
                break;
            case 'complex_sequence':
                this.generateComplexSequence(level);
                break;
            case 'mirror':
                this.generateMirrorPattern(level);
                break;
            case 'matrix':
                this.generateMatrixPattern(level);
                break;
        }
    }

    generateColorSequence(level) {
        const colorKeys = Object.keys(this.colors).slice(0, 4);
        const pattern = [];

        // Basit tekrarlayan dizi: A, B, A, B, ?
        const basePattern = colorKeys.slice(0, 2);
        for (let i = 0; i < level.patternLength; i++) {
            pattern.push(basePattern[i % basePattern.length]);
        }

        const correctAnswer = basePattern[level.patternLength % basePattern.length];

        // Örüntüyü göster
        this.displaySequence(pattern, 'color');

        // Seçenekleri oluştur
        this.createColorOptions(colorKeys, correctAnswer, level);
    }

    generateShapeSequence(level) {
        const shapeList = this.shapes.slice(0, 4);
        const pattern = [];

        // Basit sıralı dizi
        for (let i = 0; i < level.patternLength; i++) {
            pattern.push(shapeList[i % shapeList.length]);
        }

        const correctAnswer = shapeList[level.patternLength % shapeList.length];

        this.displaySequence(pattern, 'shape');
        this.createShapeOptions(shapeList, correctAnswer, level);
    }

    generateSizeSequence(level) {
        const sizes = ['small', 'medium', 'large'];
        const pattern = [];

        // Artan veya azalan dizi
        for (let i = 0; i < level.patternLength; i++) {
            pattern.push(sizes[i % sizes.length]);
        }

        const correctAnswer = sizes[level.patternLength % sizes.length];

        this.displaySizeSequence(pattern);
        this.createSizeOptions(sizes, correctAnswer, level);
    }

    generateColorShapeSequence(level) {
        const colorKeys = ['red', 'blue', 'green'];
        const shapeList = ['circle', 'square', 'triangle'];
        const pattern = [];

        for (let i = 0; i < level.patternLength; i++) {
            pattern.push({
                color: colorKeys[i % colorKeys.length],
                shape: shapeList[Math.floor(i / colorKeys.length) % shapeList.length]
            });
        }

        const correctAnswer = {
            color: colorKeys[level.patternLength % colorKeys.length],
            shape: shapeList[Math.floor(level.patternLength / colorKeys.length) % shapeList.length]
        };

        this.displayColorShapeSequence(pattern);
        this.createColorShapeOptions(colorKeys, shapeList, correctAnswer, level);
    }

    generateNumberPattern(level) {
        // Basit aritmetik dizi: 2, 4, 6, 8, ?
        const start = Math.floor(Math.random() * 3) + 1;
        const step = Math.floor(Math.random() * 3) + 2;
        const pattern = [];

        for (let i = 0; i < level.patternLength; i++) {
            pattern.push(start + i * step);
        }

        const correctAnswer = start + level.patternLength * step;

        this.displayNumberSequence(pattern);
        this.createNumberOptions(correctAnswer, step, level);
    }

    generateRotationPattern(level) {
        const rotations = [0, 90, 180, 270];
        const pattern = [];

        for (let i = 0; i < level.patternLength; i++) {
            pattern.push(rotations[i % rotations.length]);
        }

        const correctAnswer = rotations[level.patternLength % rotations.length];

        this.displayRotationSequence(pattern);
        this.createRotationOptions(rotations, correctAnswer, level);
    }

    generateComplexSequence(level) {
        const colorKeys = ['red', 'blue'];
        const shapeList = ['circle', 'square'];
        const sizes = ['small', 'large'];
        const pattern = [];

        for (let i = 0; i < level.patternLength; i++) {
            pattern.push({
                color: colorKeys[i % 2],
                shape: shapeList[Math.floor(i / 2) % 2],
                size: sizes[Math.floor(i / 4) % 2]
            });
        }

        const correctAnswer = {
            color: colorKeys[level.patternLength % 2],
            shape: shapeList[Math.floor(level.patternLength / 2) % 2],
            size: sizes[Math.floor(level.patternLength / 4) % 2]
        };

        this.displayComplexSequence(pattern);
        this.createComplexOptions(colorKeys, shapeList, sizes, correctAnswer, level);
    }

    generateMirrorPattern(level) {
        // Basit ayna örüntüsü
        const shapes = ['triangle', 'arrow'];
        const pattern = [];
        const directions = ['left', 'right'];

        for (let i = 0; i < level.patternLength; i++) {
            pattern.push({
                shape: shapes[0],
                direction: directions[i % 2]
            });
        }

        const correctAnswer = {
            shape: shapes[0],
            direction: directions[level.patternLength % 2]
        };

        this.displayMirrorSequence(pattern);
        this.createMirrorOptions(directions, correctAnswer, level);
    }

    generateMatrixPattern(level) {
        // 3x3 matrix - son hücre boş
        const colors = ['red', 'blue', 'green'];
        const matrix = [];

        for (let i = 0; i < 3; i++) {
            const row = [];
            for (let j = 0; j < 3; j++) {
                row.push(colors[(i + j) % 3]);
            }
            matrix.push(row);
        }

        const correctAnswer = matrix[2][2];
        matrix[2][2] = null; // Son hücre boş

        this.displayMatrix(matrix);
        this.createMatrixOptions(colors, correctAnswer, level);
    }

    // Görüntüleme fonksiyonları
    displaySequence(pattern, type) {
        const startX = 80;
        const y = 180;
        const spacing = 100;

        pattern.forEach((item, index) => {
            const container = new PIXI.Container();
            container.x = startX + index * spacing;
            container.y = y;

            const shape = new PIXI.Graphics();
            if (type === 'color') {
                shape.beginFill(this.colors[item]);
                shape.drawCircle(0, 0, 35);
                shape.endFill();
            } else if (type === 'shape') {
                shape.beginFill(0x4CAF50);
                this.drawShape(shape, item, 35);
                shape.endFill();
            }
            container.addChild(shape);

            this.gameArea.addChild(container);
        });

        // Soru işareti
        const questionMark = new PIXI.Text('?', {
            fontFamily: 'Fredoka One, Arial',
            fontSize: 48,
            fill: 0xFF5722
        });
        questionMark.anchor.set(0.5);
        questionMark.x = startX + pattern.length * spacing;
        questionMark.y = y;
        this.gameArea.addChild(questionMark);

        // Animasyon
        let scale = 1;
        let dir = 1;
        const animate = () => {
            scale += 0.02 * dir;
            if (scale > 1.2 || scale < 0.9) dir *= -1;
            questionMark.scale.set(scale);
            if (this.currentLevel === this.levels.find(l => this.gameArea.children.includes(questionMark))?.id) {
                requestAnimationFrame(animate);
            }
        };
        animate();
    }

    displaySizeSequence(pattern) {
        const startX = 80;
        const y = 180;
        const spacing = 100;
        const sizeMap = { small: 20, medium: 35, large: 50 };

        pattern.forEach((size, index) => {
            const shape = new PIXI.Graphics();
            shape.beginFill(0x4CAF50);
            shape.drawCircle(0, 0, sizeMap[size]);
            shape.endFill();
            shape.x = startX + index * spacing;
            shape.y = y;
            this.gameArea.addChild(shape);
        });

        const questionMark = new PIXI.Text('?', {
            fontFamily: 'Fredoka One, Arial',
            fontSize: 48,
            fill: 0xFF5722
        });
        questionMark.anchor.set(0.5);
        questionMark.x = startX + pattern.length * spacing;
        questionMark.y = y;
        this.gameArea.addChild(questionMark);
    }

    displayColorShapeSequence(pattern) {
        const startX = 60;
        const y = 180;
        const spacing = 90;

        pattern.forEach((item, index) => {
            const shape = new PIXI.Graphics();
            shape.beginFill(this.colors[item.color]);
            this.drawShape(shape, item.shape, 30);
            shape.endFill();
            shape.x = startX + index * spacing;
            shape.y = y;
            this.gameArea.addChild(shape);
        });

        const questionMark = new PIXI.Text('?', {
            fontFamily: 'Fredoka One, Arial',
            fontSize: 48,
            fill: 0xFF5722
        });
        questionMark.anchor.set(0.5);
        questionMark.x = startX + pattern.length * spacing;
        questionMark.y = y;
        this.gameArea.addChild(questionMark);
    }

    displayNumberSequence(pattern) {
        const startX = 60;
        const y = 180;
        const spacing = 90;

        pattern.forEach((num, index) => {
            const container = new PIXI.Container();
            container.x = startX + index * spacing;
            container.y = y;

            const bg = new PIXI.Graphics();
            bg.beginFill(0x2196F3);
            bg.drawCircle(0, 0, 35);
            bg.endFill();
            container.addChild(bg);

            const text = new PIXI.Text(num.toString(), {
                fontFamily: 'Arial',
                fontSize: 28,
                fill: 0xFFFFFF,
                fontWeight: 'bold'
            });
            text.anchor.set(0.5);
            container.addChild(text);

            this.gameArea.addChild(container);
        });

        const questionMark = new PIXI.Text('?', {
            fontFamily: 'Fredoka One, Arial',
            fontSize: 48,
            fill: 0xFF5722
        });
        questionMark.anchor.set(0.5);
        questionMark.x = startX + pattern.length * spacing;
        questionMark.y = y;
        this.gameArea.addChild(questionMark);
    }

    displayRotationSequence(pattern) {
        const startX = 80;
        const y = 180;
        const spacing = 100;

        pattern.forEach((rotation, index) => {
            const arrow = new PIXI.Graphics();
            arrow.beginFill(0x9C27B0);
            arrow.moveTo(0, -30);
            arrow.lineTo(20, 20);
            arrow.lineTo(0, 10);
            arrow.lineTo(-20, 20);
            arrow.closePath();
            arrow.endFill();
            arrow.x = startX + index * spacing;
            arrow.y = y;
            arrow.rotation = (rotation * Math.PI) / 180;
            this.gameArea.addChild(arrow);
        });

        const questionMark = new PIXI.Text('?', {
            fontFamily: 'Fredoka One, Arial',
            fontSize: 48,
            fill: 0xFF5722
        });
        questionMark.anchor.set(0.5);
        questionMark.x = startX + pattern.length * spacing;
        questionMark.y = y;
        this.gameArea.addChild(questionMark);
    }

    displayComplexSequence(pattern) {
        const startX = 50;
        const y = 180;
        const spacing = 85;
        const sizeMap = { small: 20, large: 40 };

        pattern.forEach((item, index) => {
            const shape = new PIXI.Graphics();
            shape.beginFill(this.colors[item.color]);
            this.drawShape(shape, item.shape, sizeMap[item.size]);
            shape.endFill();
            shape.x = startX + index * spacing;
            shape.y = y;
            this.gameArea.addChild(shape);
        });

        const questionMark = new PIXI.Text('?', {
            fontFamily: 'Fredoka One, Arial',
            fontSize: 48,
            fill: 0xFF5722
        });
        questionMark.anchor.set(0.5);
        questionMark.x = startX + pattern.length * spacing;
        questionMark.y = y;
        this.gameArea.addChild(questionMark);
    }

    displayMirrorSequence(pattern) {
        const startX = 100;
        const y = 180;
        const spacing = 120;

        pattern.forEach((item, index) => {
            const arrow = new PIXI.Graphics();
            arrow.beginFill(0xE91E63);
            if (item.direction === 'right') {
                arrow.moveTo(30, 0);
                arrow.lineTo(-10, -25);
                arrow.lineTo(-10, 25);
            } else {
                arrow.moveTo(-30, 0);
                arrow.lineTo(10, -25);
                arrow.lineTo(10, 25);
            }
            arrow.closePath();
            arrow.endFill();
            arrow.x = startX + index * spacing;
            arrow.y = y;
            this.gameArea.addChild(arrow);
        });

        const questionMark = new PIXI.Text('?', {
            fontFamily: 'Fredoka One, Arial',
            fontSize: 48,
            fill: 0xFF5722
        });
        questionMark.anchor.set(0.5);
        questionMark.x = startX + pattern.length * spacing;
        questionMark.y = y;
        this.gameArea.addChild(questionMark);
    }

    displayMatrix(matrix) {
        const startX = 250;
        const startY = 140;
        const cellSize = 70;

        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                const cell = new PIXI.Graphics();
                cell.lineStyle(2, 0x4CAF50);

                if (matrix[i][j]) {
                    cell.beginFill(this.colors[matrix[i][j]]);
                } else {
                    cell.beginFill(0xEEEEEE);
                }
                cell.drawRect(0, 0, cellSize - 5, cellSize - 5);
                cell.endFill();

                cell.x = startX + j * cellSize;
                cell.y = startY + i * cellSize;
                this.gameArea.addChild(cell);

                if (!matrix[i][j]) {
                    const question = new PIXI.Text('?', {
                        fontFamily: 'Arial',
                        fontSize: 32,
                        fill: 0xFF5722,
                        fontWeight: 'bold'
                    });
                    question.x = startX + j * cellSize + 20;
                    question.y = startY + i * cellSize + 15;
                    this.gameArea.addChild(question);
                }
            }
        }
    }

    // Seçenek oluşturma fonksiyonları
    createColorOptions(colorKeys, correctAnswer, level) {
        this.createOptions(colorKeys, correctAnswer, level, 'color');
    }

    createShapeOptions(shapeList, correctAnswer, level) {
        this.createOptions(shapeList, correctAnswer, level, 'shape');
    }

    createSizeOptions(sizes, correctAnswer, level) {
        this.createOptions(sizes, correctAnswer, level, 'size');
    }

    createNumberOptions(correctAnswer, step, level) {
        const options = [correctAnswer];
        while (options.length < level.options) {
            const wrong = correctAnswer + (Math.random() > 0.5 ? 1 : -1) * step * (options.length);
            if (!options.includes(wrong) && wrong > 0) {
                options.push(wrong);
            }
        }
        this.shuffleArray(options);
        this.createOptions(options, correctAnswer, level, 'number');
    }

    createRotationOptions(rotations, correctAnswer, level) {
        this.createOptions(rotations, correctAnswer, level, 'rotation');
    }

    createColorShapeOptions(colorKeys, shapeList, correctAnswer, level) {
        const options = [correctAnswer];
        while (options.length < level.options) {
            const opt = {
                color: colorKeys[Math.floor(Math.random() * colorKeys.length)],
                shape: shapeList[Math.floor(Math.random() * shapeList.length)]
            };
            if (!options.find(o => o.color === opt.color && o.shape === opt.shape)) {
                options.push(opt);
            }
        }
        this.shuffleArray(options);
        this.createOptions(options, correctAnswer, level, 'colorShape');
    }

    createComplexOptions(colorKeys, shapeList, sizes, correctAnswer, level) {
        const options = [correctAnswer];
        while (options.length < level.options) {
            const opt = {
                color: colorKeys[Math.floor(Math.random() * colorKeys.length)],
                shape: shapeList[Math.floor(Math.random() * shapeList.length)],
                size: sizes[Math.floor(Math.random() * sizes.length)]
            };
            if (!options.find(o => o.color === opt.color && o.shape === opt.shape && o.size === opt.size)) {
                options.push(opt);
            }
        }
        this.shuffleArray(options);
        this.createOptions(options, correctAnswer, level, 'complex');
    }

    createMirrorOptions(directions, correctAnswer, level) {
        const options = directions.map(d => ({ direction: d }));
        this.createOptions(options, correctAnswer, level, 'mirror');
    }

    createMatrixOptions(colors, correctAnswer, level) {
        this.createOptions(colors, correctAnswer, level, 'color');
    }

    createOptions(options, correctAnswer, level, type) {
        const startX = 120;
        const y = 380;
        const spacing = 130;

        const label = new PIXI.Text('🎯 Cevabını seç:', {
            fontFamily: 'Arial',
            fontSize: 18,
            fill: 0x333333,
            fontWeight: 'bold'
        });
        label.x = startX;
        label.y = y - 50;
        this.gameArea.addChild(label);

        options.forEach((option, index) => {
            const btn = new PIXI.Container();
            btn.x = startX + index * spacing;
            btn.y = y;
            btn.interactive = true;
            btn.buttonMode = true;
            btn.cursor = 'pointer';

            const bg = new PIXI.Graphics();
            bg.beginFill(0xFFFFFF);
            bg.lineStyle(3, 0x4CAF50);
            bg.drawRoundedRect(-45, -45, 90, 90, 10);
            bg.endFill();
            btn.addChild(bg);

            // Seçenek içeriği
            this.drawOption(btn, option, type);

            btn.on('pointerover', () => {
                bg.clear();
                bg.beginFill(0xE8F5E9);
                bg.lineStyle(4, 0x2E7D32);
                bg.drawRoundedRect(-45, -45, 90, 90, 10);
                bg.endFill();
                btn.scale.set(1.1);
            });

            btn.on('pointerout', () => {
                if (this.selectedAnswer !== option) {
                    bg.clear();
                    bg.beginFill(0xFFFFFF);
                    bg.lineStyle(3, 0x4CAF50);
                    bg.drawRoundedRect(-45, -45, 90, 90, 10);
                    bg.endFill();
                }
                btn.scale.set(1);
            });

            btn.on('pointerdown', () => {
                this.selectAnswer(option, correctAnswer, level, bg, btn);
            });

            this.gameArea.addChild(btn);
        });
    }

    drawOption(container, option, type) {
        const shape = new PIXI.Graphics();

        switch (type) {
            case 'color':
                shape.beginFill(this.colors[option]);
                shape.drawCircle(0, 0, 30);
                shape.endFill();
                break;
            case 'shape':
                shape.beginFill(0x4CAF50);
                this.drawShape(shape, option, 30);
                shape.endFill();
                break;
            case 'size':
                const sizeMap = { small: 15, medium: 25, large: 35 };
                shape.beginFill(0x4CAF50);
                shape.drawCircle(0, 0, sizeMap[option]);
                shape.endFill();
                break;
            case 'number':
                const numText = new PIXI.Text(option.toString(), {
                    fontFamily: 'Arial',
                    fontSize: 32,
                    fill: 0x2196F3,
                    fontWeight: 'bold'
                });
                numText.anchor.set(0.5);
                container.addChild(numText);
                return;
            case 'rotation':
                shape.beginFill(0x9C27B0);
                shape.moveTo(0, -25);
                shape.lineTo(15, 15);
                shape.lineTo(0, 5);
                shape.lineTo(-15, 15);
                shape.closePath();
                shape.endFill();
                shape.rotation = (option * Math.PI) / 180;
                break;
            case 'colorShape':
                shape.beginFill(this.colors[option.color]);
                this.drawShape(shape, option.shape, 25);
                shape.endFill();
                break;
            case 'complex':
                const complexSizeMap = { small: 15, large: 30 };
                shape.beginFill(this.colors[option.color]);
                this.drawShape(shape, option.shape, complexSizeMap[option.size]);
                shape.endFill();
                break;
            case 'mirror':
                shape.beginFill(0xE91E63);
                if (option.direction === 'right') {
                    shape.moveTo(20, 0);
                    shape.lineTo(-10, -20);
                    shape.lineTo(-10, 20);
                } else {
                    shape.moveTo(-20, 0);
                    shape.lineTo(10, -20);
                    shape.lineTo(10, 20);
                }
                shape.closePath();
                shape.endFill();
                break;
        }

        container.addChild(shape);
    }

    drawShape(graphics, shapeName, size) {
        switch (shapeName) {
            case 'circle':
                graphics.drawCircle(0, 0, size);
                break;
            case 'square':
                graphics.drawRect(-size, -size, size * 2, size * 2);
                break;
            case 'triangle':
                graphics.moveTo(0, -size);
                graphics.lineTo(size, size);
                graphics.lineTo(-size, size);
                graphics.closePath();
                break;
            case 'star':
                graphics.drawStar(0, 0, 5, size, size / 2);
                break;
            case 'heart':
                // Basit kalp
                graphics.moveTo(0, size);
                graphics.bezierCurveTo(-size, 0, -size, -size, 0, -size / 2);
                graphics.bezierCurveTo(size, -size, size, 0, 0, size);
                break;
            case 'diamond':
                graphics.moveTo(0, -size);
                graphics.lineTo(size, 0);
                graphics.lineTo(0, size);
                graphics.lineTo(-size, 0);
                graphics.closePath();
                break;
            case 'hexagon':
                graphics.drawPolygon([
                    0, -size,
                    size * 0.87, -size * 0.5,
                    size * 0.87, size * 0.5,
                    0, size,
                    -size * 0.87, size * 0.5,
                    -size * 0.87, -size * 0.5
                ]);
                break;
        }
    }

    selectAnswer(selected, correct, level, bg, btn) {
        const isCorrect = this.compareAnswers(selected, correct);

        if (isCorrect) {
            // Doğru cevap
            bg.clear();
            bg.beginFill(0x4CAF50);
            bg.lineStyle(4, 0x2E7D32);
            bg.drawRoundedRect(-45, -45, 90, 90, 10);
            bg.endFill();

            this.score += level.points * (1 + this.streak * 0.1);
            this.streak++;
            this.scoreDisplay.text = `⭐ ${Math.floor(this.score)}`;
            this.streakText.text = `🔥 Seri: ${this.streak}`;

            if (!this.completedLevels.includes(level.id)) {
                this.completedLevels.push(level.id);
                this.completedText.text = `✅ Tamamlanan: ${this.completedLevels.length}/9`;
                this.updateLevelMap();
            }

            this.showFeedback(true, level);
            this.playSound('success');

            // Progress callback
            if (window.updateExperimentProgress) {
                window.updateExperimentProgress(
                    this.completedLevels.length,
                    `${this.completedLevels.length} seviye tamamlandı!`
                );
            }

            // Sonraki seviye
            setTimeout(() => {
                if (level.id < this.levels.length) {
                    this.loadLevel(level.id + 1);
                } else {
                    this.showGameComplete();
                }
            }, 1500);

        } else {
            // Yanlış cevap
            bg.clear();
            bg.beginFill(0xF44336);
            bg.lineStyle(4, 0xB71C1C);
            bg.drawRoundedRect(-45, -45, 90, 90, 10);
            bg.endFill();

            this.streak = 0;
            this.lives--;
            this.streakText.text = `🔥 Seri: 0`;
            this.updateLivesDisplay();

            this.showFeedback(false, level);
            this.playSound('error');

            // Titreme animasyonu
            let shakes = 0;
            const shake = () => {
                btn.x += shakes % 2 === 0 ? 5 : -5;
                shakes++;
                if (shakes < 6) {
                    requestAnimationFrame(shake);
                }
            };
            shake();

            if (this.lives <= 0) {
                setTimeout(() => {
                    this.showGameOver();
                }, 1000);
            } else {
                // Reset after delay
                setTimeout(() => {
                    bg.clear();
                    bg.beginFill(0xFFFFFF);
                    bg.lineStyle(3, 0x4CAF50);
                    bg.drawRoundedRect(-45, -45, 90, 90, 10);
                    bg.endFill();
                }, 1000);
            }
        }
    }

    compareAnswers(selected, correct) {
        if (typeof selected === 'object' && typeof correct === 'object') {
            return JSON.stringify(selected) === JSON.stringify(correct);
        }
        return selected === correct;
    }

    showFeedback(isCorrect, level) {
        const feedback = new PIXI.Container();

        const bg = new PIXI.Graphics();
        bg.beginFill(isCorrect ? 0x4CAF50 : 0xF44336, 0.95);
        bg.drawRoundedRect(-120, -40, 240, 80, 15);
        bg.endFill();
        feedback.addChild(bg);

        const text = new PIXI.Text(isCorrect ? '✅ Doğru!' : '❌ Tekrar dene!', {
            fontFamily: 'Arial',
            fontSize: 28,
            fill: 0xFFFFFF,
            fontWeight: 'bold'
        });
        text.anchor.set(0.5);
        feedback.addChild(text);

        if (isCorrect) {
            const points = new PIXI.Text(`+${level.points} ⭐`, {
                fontFamily: 'Arial',
                fontSize: 18,
                fill: 0xFFEB3B
            });
            points.anchor.set(0.5);
            points.y = 25;
            feedback.addChild(points);
        }

        feedback.x = 360;
        feedback.y = 300;
        feedback.scale.set(0);
        this.gameArea.addChild(feedback);

        // Scale animation
        let scale = 0;
        const scaleUp = () => {
            scale += 0.1;
            feedback.scale.set(Math.min(scale, 1));
            if (scale < 1) requestAnimationFrame(scaleUp);
        };
        scaleUp();

        setTimeout(() => {
            let alpha = 1;
            const fadeOut = () => {
                alpha -= 0.1;
                feedback.alpha = alpha;
                if (alpha > 0) {
                    requestAnimationFrame(fadeOut);
                } else {
                    this.gameArea.removeChild(feedback);
                }
            };
            fadeOut();
        }, 1200);
    }

    showGameComplete() {
        const overlay = new PIXI.Container();

        const bg = new PIXI.Graphics();
        bg.beginFill(0x000000, 0.8);
        bg.drawRect(0, 0, 720, 500);
        bg.endFill();
        overlay.addChild(bg);

        const panel = new PIXI.Graphics();
        panel.beginFill(0x4CAF50);
        panel.drawRoundedRect(160, 100, 400, 300, 20);
        panel.endFill();
        overlay.addChild(panel);

        const title = new PIXI.Text('🎉 TEBRİKLER! 🎉', {
            fontFamily: 'Fredoka One, Arial',
            fontSize: 36,
            fill: 0xFFFFFF
        });
        title.anchor.set(0.5);
        title.x = 360;
        title.y = 150;
        overlay.addChild(title);

        const scoreText = new PIXI.Text(`Toplam Puan: ⭐ ${Math.floor(this.score)}`, {
            fontFamily: 'Arial',
            fontSize: 28,
            fill: 0xFFEB3B,
            fontWeight: 'bold'
        });
        scoreText.anchor.set(0.5);
        scoreText.x = 360;
        scoreText.y = 220;
        overlay.addChild(scoreText);

        const completeText = new PIXI.Text('Tüm seviyeleri tamamladın!', {
            fontFamily: 'Arial',
            fontSize: 20,
            fill: 0xFFFFFF
        });
        completeText.anchor.set(0.5);
        completeText.x = 360;
        completeText.y = 270;
        overlay.addChild(completeText);

        // Yeniden başla butonu
        const restartBtn = new PIXI.Container();
        restartBtn.x = 360;
        restartBtn.y = 340;
        restartBtn.interactive = true;
        restartBtn.buttonMode = true;
        restartBtn.cursor = 'pointer';

        const btnBg = new PIXI.Graphics();
        btnBg.beginFill(0xFFFFFF);
        btnBg.drawRoundedRect(-80, -25, 160, 50, 10);
        btnBg.endFill();
        restartBtn.addChild(btnBg);

        const btnText = new PIXI.Text('🔄 Yeniden Başla', {
            fontFamily: 'Arial',
            fontSize: 18,
            fill: 0x4CAF50,
            fontWeight: 'bold'
        });
        btnText.anchor.set(0.5);
        restartBtn.addChild(btnText);

        restartBtn.on('pointerdown', () => {
            this.gameArea.removeChild(overlay);
            this.resetGame();
        });
        overlay.addChild(restartBtn);

        this.gameArea.addChild(overlay);
        this.createCelebration();
    }

    showGameOver() {
        const overlay = new PIXI.Container();

        const bg = new PIXI.Graphics();
        bg.beginFill(0x000000, 0.8);
        bg.drawRect(0, 0, 720, 500);
        bg.endFill();
        overlay.addChild(bg);

        const panel = new PIXI.Graphics();
        panel.beginFill(0xF44336);
        panel.drawRoundedRect(160, 100, 400, 300, 20);
        panel.endFill();
        overlay.addChild(panel);

        const title = new PIXI.Text('😢 Oyun Bitti', {
            fontFamily: 'Fredoka One, Arial',
            fontSize: 36,
            fill: 0xFFFFFF
        });
        title.anchor.set(0.5);
        title.x = 360;
        title.y = 150;
        overlay.addChild(title);

        const scoreText = new PIXI.Text(`Puan: ⭐ ${Math.floor(this.score)}`, {
            fontFamily: 'Arial',
            fontSize: 28,
            fill: 0xFFEB3B,
            fontWeight: 'bold'
        });
        scoreText.anchor.set(0.5);
        scoreText.x = 360;
        scoreText.y = 220;
        overlay.addChild(scoreText);

        // Yeniden başla butonu
        const restartBtn = new PIXI.Container();
        restartBtn.x = 360;
        restartBtn.y = 320;
        restartBtn.interactive = true;
        restartBtn.buttonMode = true;
        restartBtn.cursor = 'pointer';

        const btnBg = new PIXI.Graphics();
        btnBg.beginFill(0xFFFFFF);
        btnBg.drawRoundedRect(-80, -25, 160, 50, 10);
        btnBg.endFill();
        restartBtn.addChild(btnBg);

        const btnText = new PIXI.Text('🔄 Tekrar Dene', {
            fontFamily: 'Arial',
            fontSize: 18,
            fill: 0xF44336,
            fontWeight: 'bold'
        });
        btnText.anchor.set(0.5);
        restartBtn.addChild(btnText);

        restartBtn.on('pointerdown', () => {
            this.gameArea.removeChild(overlay);
            this.resetGame();
        });
        overlay.addChild(restartBtn);

        this.gameArea.addChild(overlay);
    }

    resetGame() {
        this.currentLevel = 1;
        this.score = 0;
        this.streak = 0;
        this.lives = this.maxLives;
        this.completedLevels = [];

        this.scoreDisplay.text = '⭐ 0';
        this.streakText.text = '🔥 Seri: 0';
        this.completedText.text = '✅ Tamamlanan: 0/9';
        this.updateLivesDisplay();
        this.updateLevelMap();

        this.loadLevel(1);
    }

    createCelebration() {
        const colors = [0xFFEB3B, 0xFF5722, 0x4CAF50, 0x2196F3, 0xE91E63, 0x9C27B0];

        for (let i = 0; i < 40; i++) {
            setTimeout(() => {
                const confetti = new PIXI.Graphics();
                confetti.beginFill(colors[Math.floor(Math.random() * colors.length)]);
                confetti.drawRect(-5, -5, 10, 10);
                confetti.endFill();

                confetti.x = Math.random() * 720;
                confetti.y = -20;
                confetti.vy = 3 + Math.random() * 4;
                confetti.vr = (Math.random() - 0.5) * 0.2;

                this.gameArea.addChild(confetti);

                const animate = () => {
                    confetti.y += confetti.vy;
                    confetti.rotation += confetti.vr;
                    confetti.vy += 0.1;

                    if (confetti.y < 520) {
                        requestAnimationFrame(animate);
                    } else {
                        this.gameArea.removeChild(confetti);
                    }
                };
                animate();
            }, i * 50);
        }
    }

    startTimer(seconds) {
        this.remainingTime = seconds;
        this.timerText.text = `⏱️ ${seconds}s`;

        if (this.timerInterval) clearInterval(this.timerInterval);

        this.timerInterval = setInterval(() => {
            this.remainingTime--;
            this.timerText.text = `⏱️ ${this.remainingTime}s`;

            if (this.remainingTime <= 5) {
                this.timerText.style.fill = 0xF44336;
            }

            if (this.remainingTime <= 0) {
                clearInterval(this.timerInterval);
                this.lives--;
                this.updateLivesDisplay();

                if (this.lives <= 0) {
                    this.showGameOver();
                } else {
                    this.showMessage('⏰ Süre doldu!', 0xF44336);
                    this.loadLevel(this.currentLevel);
                }
            }
        }, 1000);
    }

    shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    showMessage(text, color) {
        const msg = new PIXI.Text(text, {
            fontFamily: 'Arial',
            fontSize: 20,
            fill: color,
            fontWeight: 'bold'
        });
        msg.anchor.set(0.5);
        msg.x = 360;
        msg.y = 100;
        this.gameArea.addChild(msg);

        setTimeout(() => {
            this.gameArea.removeChild(msg);
        }, 2000);
    }

    playSound(type) {
        if (window.playSound) {
            window.playSound(type);
        }
    }

    destroy() {
        if (this.timerInterval) clearInterval(this.timerInterval);
        if (this.app) {
            this.app.destroy(true, { children: true, texture: true, baseTexture: true });
        }
    }
}

// Global erişim
window.PatternPuzzleV2 = PatternPuzzleV2;
