/**
 * MiniLab - Memory Match Game V2
 * Çocuklar için gelişmiş hafıza/eşleştirme oyunu
 * Pixi.js + Alpine.js entegrasyonu
 */

class MemoryMatchGame {
    constructor(containerId, options = {}) {
        this.container = document.getElementById(containerId);
        this.options = {
            gridSize: options.gridSize || '3x4',
            gameType: options.gameType || 'emoji_word',
            timeLimit: options.timeLimit || 120,
            cards: options.cards || [],
            onComplete: options.onComplete || (() => { }),
            onMatch: options.onMatch || (() => { }),
            onMismatch: options.onMismatch || (() => { }),
            ...options
        };

        this.app = null;
        this.cardSprites = [];
        this.flippedCards = [];
        this.matchedPairs = 0;
        this.moves = 0;
        this.timeRemaining = this.options.timeLimit;
        this.timerInterval = null;
        this.isLocked = false;
        this.gameStarted = false;
        this.score = 0;

        // Renk paleti
        this.colors = {
            cardBack: 0x8B5CF6,      // Mor
            cardFront: 0xFFFFFF,      // Beyaz
            matched: 0x10B981,        // Yeşil
            border: 0xE9D5FF,         // Açık mor
            text: 0x374151,           // Koyu gri
            highlight: 0xFCD34D,      // Sarı
        };

        this.init();
    }

    async init() {
        // Container boyutları
        const rect = this.container.getBoundingClientRect();
        const width = rect.width || 800;
        const height = rect.height || 600;

        // Pixi Application
        this.app = new PIXI.Application();
        await this.app.init({
            width,
            height,
            backgroundColor: 0xFAF5FF,
            antialias: true,
            resolution: window.devicePixelRatio || 1,
            autoDensity: true,
        });

        this.container.appendChild(this.app.canvas);

        // Layers
        this.gameLayer = new PIXI.Container();
        this.uiLayer = new PIXI.Container();
        this.effectsLayer = new PIXI.Container();

        this.app.stage.addChild(this.gameLayer);
        this.app.stage.addChild(this.uiLayer);
        this.app.stage.addChild(this.effectsLayer);

        this.createUI();
        this.createCards();
        this.showStartScreen();
    }

    createUI() {
        const width = this.app.screen.width;

        // Üst bar arka planı
        const topBar = new PIXI.Graphics();
        topBar.roundRect(10, 10, width - 20, 60, 15);
        topBar.fill({ color: 0xFFFFFF, alpha: 0.95 });
        topBar.stroke({ width: 2, color: this.colors.border });
        this.uiLayer.addChild(topBar);

        // Süre göstergesi
        this.timeText = new PIXI.Text({
            text: `⏱️ ${this.formatTime(this.timeRemaining)}`,
            style: {
                fontFamily: 'Nunito, sans-serif',
                fontSize: 24,
                fontWeight: 'bold',
                fill: this.colors.text,
            }
        });
        this.timeText.x = 30;
        this.timeText.y = 25;
        this.uiLayer.addChild(this.timeText);

        // Hamle sayacı
        this.movesText = new PIXI.Text({
            text: `🎯 ${this.moves} hamle`,
            style: {
                fontFamily: 'Nunito, sans-serif',
                fontSize: 24,
                fontWeight: 'bold',
                fill: this.colors.text,
            }
        });
        this.movesText.x = width / 2 - 60;
        this.movesText.y = 25;
        this.uiLayer.addChild(this.movesText);

        // Skor
        this.scoreText = new PIXI.Text({
            text: `⭐ ${this.score}`,
            style: {
                fontFamily: 'Nunito, sans-serif',
                fontSize: 24,
                fontWeight: 'bold',
                fill: 0xF59E0B,
            }
        });
        this.scoreText.x = width - 120;
        this.scoreText.y = 25;
        this.uiLayer.addChild(this.scoreText);
    }

    createCards() {
        const [cols, rows] = this.options.gridSize.split('x').map(Number);
        const totalCards = cols * rows;

        // Kart verilerini hazırla
        let cardPairs = [];
        if (this.options.cards.length > 0) {
            // Verilen kartları kullan
            this.options.cards.forEach((card, idx) => {
                cardPairs.push({
                    id: idx,
                    type: 'a',
                    content: card.content_a,
                    contentType: card.content_a_type,
                    pairId: idx
                });
                cardPairs.push({
                    id: idx,
                    type: 'b',
                    content: card.content_b,
                    contentType: card.content_b_type,
                    pairId: idx
                });
            });
        } else {
            // Demo kartlar
            const demoEmojis = ['🐱', '🐕', '🐘', '🦁', '🐻', '🐼', '🐨', '🐸', '🦋', '🐝'];
            const neededPairs = Math.floor(totalCards / 2);

            for (let i = 0; i < neededPairs; i++) {
                const emoji = demoEmojis[i % demoEmojis.length];
                cardPairs.push({ id: i, type: 'a', content: emoji, contentType: 'emoji', pairId: i });
                cardPairs.push({ id: i, type: 'b', content: emoji, contentType: 'emoji', pairId: i });
            }
        }

        // Kartları karıştır
        cardPairs = this.shuffle(cardPairs);

        // Kart boyutları
        const width = this.app.screen.width;
        const height = this.app.screen.height;
        const gameAreaTop = 90;
        const padding = 20;
        const gap = 15;

        const cardWidth = (width - padding * 2 - gap * (cols - 1)) / cols;
        const cardHeight = (height - gameAreaTop - padding - gap * (rows - 1)) / rows;
        const cardSize = Math.min(cardWidth, cardHeight, 120);

        // Grid başlangıç pozisyonu (ortalanmış)
        const gridWidth = cols * cardSize + (cols - 1) * gap;
        const gridHeight = rows * cardSize + (rows - 1) * gap;
        const startX = (width - gridWidth) / 2;
        const startY = gameAreaTop + (height - gameAreaTop - gridHeight) / 2;

        // Kartları oluştur
        cardPairs.forEach((cardData, index) => {
            const col = index % cols;
            const row = Math.floor(index / cols);
            const x = startX + col * (cardSize + gap) + cardSize / 2;
            const y = startY + row * (cardSize + gap) + cardSize / 2;

            const card = this.createCard(cardData, cardSize, x, y);
            this.cardSprites.push(card);
            this.gameLayer.addChild(card);
        });

        this.totalPairs = cardPairs.length / 2;
    }

    createCard(data, size, x, y) {
        const container = new PIXI.Container();
        container.x = x;
        container.y = y;
        container.cardData = data;
        container.isFlipped = false;
        container.isMatched = false;

        // Kart arka yüzü
        const back = new PIXI.Graphics();
        back.roundRect(-size / 2, -size / 2, size, size, 15);
        back.fill({ color: this.colors.cardBack });
        back.stroke({ width: 3, color: 0x7C3AED });
        back.name = 'back';
        container.addChild(back);

        // Arka yüz dekorasyonu (soru işareti)
        const backText = new PIXI.Text({
            text: '❓',
            style: {
                fontSize: size * 0.5,
            }
        });
        backText.anchor.set(0.5);
        backText.name = 'backText';
        container.addChild(backText);

        // Kart ön yüzü (gizli)
        const front = new PIXI.Graphics();
        front.roundRect(-size / 2, -size / 2, size, size, 15);
        front.fill({ color: this.colors.cardFront });
        front.stroke({ width: 3, color: this.colors.border });
        front.name = 'front';
        front.visible = false;
        container.addChild(front);

        // Ön yüz içeriği
        const contentStyle = {
            fontFamily: 'Nunito, sans-serif',
            fontSize: data.contentType === 'emoji' ? size * 0.5 : size * 0.25,
            fontWeight: 'bold',
            fill: this.colors.text,
            wordWrap: true,
            wordWrapWidth: size - 20,
            align: 'center',
        };

        const frontText = new PIXI.Text({
            text: data.content,
            style: contentStyle,
        });
        frontText.anchor.set(0.5);
        frontText.name = 'frontText';
        frontText.visible = false;
        container.addChild(frontText);

        // Etkileşim
        container.eventMode = 'static';
        container.cursor = 'pointer';

        container.on('pointerdown', () => this.onCardClick(container));
        container.on('pointerover', () => {
            if (!container.isFlipped && !container.isMatched && !this.isLocked) {
                container.scale.set(1.05);
            }
        });
        container.on('pointerout', () => {
            if (!container.isMatched) {
                container.scale.set(1);
            }
        });

        return container;
    }

    onCardClick(card) {
        if (this.isLocked || card.isFlipped || card.isMatched || !this.gameStarted) return;

        // İlk tıklama - oyunu başlat
        if (!this.timerInterval) {
            this.startTimer();
        }

        this.flipCard(card, true);
        this.flippedCards.push(card);

        if (this.flippedCards.length === 2) {
            this.moves++;
            this.updateUI();
            this.checkMatch();
        }

        // Ses efekti
        this.playSound('flip');
    }

    flipCard(card, toFront) {
        const back = card.getChildByName('back');
        const backText = card.getChildByName('backText');
        const front = card.getChildByName('front');
        const frontText = card.getChildByName('frontText');

        card.isFlipped = toFront;

        // Flip animasyonu
        gsap.to(card.scale, {
            x: 0,
            duration: 0.15,
            ease: 'power2.in',
            onComplete: () => {
                back.visible = !toFront;
                backText.visible = !toFront;
                front.visible = toFront;
                frontText.visible = toFront;

                gsap.to(card.scale, {
                    x: 1,
                    duration: 0.15,
                    ease: 'power2.out',
                });
            }
        });
    }

    checkMatch() {
        this.isLocked = true;
        const [card1, card2] = this.flippedCards;

        if (card1.cardData.pairId === card2.cardData.pairId) {
            // Eşleşti!
            this.matchedPairs++;
            this.score += Math.ceil((this.timeRemaining / this.options.timeLimit) * 100);
            this.updateUI();

            card1.isMatched = true;
            card2.isMatched = true;

            // Eşleşme animasyonu
            this.showMatchEffect(card1, card2);

            this.options.onMatch(card1.cardData, card2.cardData);
            this.playSound('match');

            setTimeout(() => {
                this.flippedCards = [];
                this.isLocked = false;

                if (this.matchedPairs === this.totalPairs) {
                    this.gameComplete();
                }
            }, 500);
        } else {
            // Eşleşmedi
            this.options.onMismatch(card1.cardData, card2.cardData);
            this.playSound('wrong');

            // Yanlış animasyonu
            gsap.to([card1, card2], {
                x: '+=10',
                duration: 0.05,
                repeat: 5,
                yoyo: true,
            });

            setTimeout(() => {
                this.flipCard(card1, false);
                this.flipCard(card2, false);
                this.flippedCards = [];
                this.isLocked = false;
            }, 1000);
        }
    }

    showMatchEffect(card1, card2) {
        // Yeşil parlama
        [card1, card2].forEach(card => {
            const front = card.getChildByName('front');
            front.clear();
            front.roundRect(-card.width / 2, -card.height / 2, card.width, card.height, 15);
            front.fill({ color: this.colors.matched, alpha: 0.3 });
            front.stroke({ width: 3, color: this.colors.matched });

            gsap.to(card.scale, {
                x: 1.1,
                y: 1.1,
                duration: 0.2,
                yoyo: true,
                repeat: 1,
            });
        });

        // Yıldız efekti
        for (let i = 0; i < 5; i++) {
            setTimeout(() => {
                const star = new PIXI.Text({
                    text: '⭐',
                    style: { fontSize: 30 }
                });
                star.x = (card1.x + card2.x) / 2 + (Math.random() - 0.5) * 100;
                star.y = (card1.y + card2.y) / 2;
                star.anchor.set(0.5);
                this.effectsLayer.addChild(star);

                gsap.to(star, {
                    y: star.y - 80,
                    alpha: 0,
                    duration: 0.8,
                    ease: 'power2.out',
                    onComplete: () => star.destroy(),
                });
            }, i * 100);
        }
    }

    showStartScreen() {
        const width = this.app.screen.width;
        const height = this.app.screen.height;

        // Overlay
        const overlay = new PIXI.Graphics();
        overlay.rect(0, 0, width, height);
        overlay.fill({ color: 0x000000, alpha: 0.5 });
        overlay.name = 'startOverlay';
        this.uiLayer.addChild(overlay);

        // Start panel
        const panel = new PIXI.Graphics();
        const panelW = 400;
        const panelH = 300;
        panel.roundRect(-panelW / 2, -panelH / 2, panelW, panelH, 30);
        panel.fill({ color: 0xFFFFFF });
        panel.stroke({ width: 4, color: this.colors.cardBack });
        panel.x = width / 2;
        panel.y = height / 2;
        panel.name = 'startPanel';
        this.uiLayer.addChild(panel);

        // Başlık
        const title = new PIXI.Text({
            text: '🧠 Hafıza Oyunu',
            style: {
                fontFamily: 'Nunito, sans-serif',
                fontSize: 36,
                fontWeight: 'bold',
                fill: this.colors.cardBack,
            }
        });
        title.anchor.set(0.5);
        title.x = width / 2;
        title.y = height / 2 - 80;
        title.name = 'startTitle';
        this.uiLayer.addChild(title);

        // Açıklama
        const desc = new PIXI.Text({
            text: 'Eşleşen kartları bul!\nHer eşleşmede puan kazan.',
            style: {
                fontFamily: 'Nunito, sans-serif',
                fontSize: 20,
                fill: this.colors.text,
                align: 'center',
            }
        });
        desc.anchor.set(0.5);
        desc.x = width / 2;
        desc.y = height / 2 - 10;
        desc.name = 'startDesc';
        this.uiLayer.addChild(desc);

        // Başla butonu
        const btnContainer = new PIXI.Container();
        btnContainer.x = width / 2;
        btnContainer.y = height / 2 + 70;
        btnContainer.name = 'startBtn';

        const btn = new PIXI.Graphics();
        btn.roundRect(-80, -25, 160, 50, 25);
        btn.fill({ color: this.colors.cardBack });
        btnContainer.addChild(btn);

        const btnText = new PIXI.Text({
            text: '▶️ Başla!',
            style: {
                fontFamily: 'Nunito, sans-serif',
                fontSize: 24,
                fontWeight: 'bold',
                fill: 0xFFFFFF,
            }
        });
        btnText.anchor.set(0.5);
        btnContainer.addChild(btnText);

        btnContainer.eventMode = 'static';
        btnContainer.cursor = 'pointer';
        btnContainer.on('pointerdown', () => this.startGame());
        btnContainer.on('pointerover', () => btnContainer.scale.set(1.05));
        btnContainer.on('pointerout', () => btnContainer.scale.set(1));

        this.uiLayer.addChild(btnContainer);
    }

    startGame() {
        // Start ekranını kaldır
        ['startOverlay', 'startPanel', 'startTitle', 'startDesc', 'startBtn'].forEach(name => {
            const child = this.uiLayer.getChildByName(name);
            if (child) child.destroy();
        });

        this.gameStarted = true;
        this.playSound('start');
    }

    startTimer() {
        this.timerInterval = setInterval(() => {
            this.timeRemaining--;
            this.updateUI();

            if (this.timeRemaining <= 0) {
                this.gameOver();
            }
        }, 1000);
    }

    updateUI() {
        this.timeText.text = `⏱️ ${this.formatTime(this.timeRemaining)}`;
        this.movesText.text = `🎯 ${this.moves} hamle`;
        this.scoreText.text = `⭐ ${this.score}`;

        // Süre azaldığında renk değişimi
        if (this.timeRemaining <= 10) {
            this.timeText.style.fill = 0xEF4444;
        }
    }

    formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }

    gameComplete() {
        clearInterval(this.timerInterval);

        const width = this.app.screen.width;
        const height = this.app.screen.height;

        // Bonus puan
        const timeBonus = Math.ceil(this.timeRemaining * 2);
        const moveBonus = Math.max(0, (this.totalPairs * 3 - this.moves) * 10);
        this.score += timeBonus + moveBonus;

        // Confetti efekti
        this.createConfetti();

        // Tebrik ekranı
        setTimeout(() => {
            const overlay = new PIXI.Graphics();
            overlay.rect(0, 0, width, height);
            overlay.fill({ color: 0x000000, alpha: 0.7 });
            this.uiLayer.addChild(overlay);

            const panel = new PIXI.Graphics();
            panel.roundRect(width / 2 - 200, height / 2 - 180, 400, 360, 30);
            panel.fill({ color: 0xFFFFFF });
            this.uiLayer.addChild(panel);

            const texts = [
                { text: '🎉 TEBRİKLER!', y: height / 2 - 130, size: 42, color: this.colors.cardBack },
                { text: 'Tüm kartları eşleştirdin!', y: height / 2 - 70, size: 22, color: this.colors.text },
                { text: `⭐ Toplam Puan: ${this.score}`, y: height / 2 - 20, size: 28, color: 0xF59E0B },
                { text: `🎯 ${this.moves} hamlede`, y: height / 2 + 30, size: 20, color: this.colors.text },
                { text: `⏱️ ${this.formatTime(this.timeRemaining)} kaldı`, y: height / 2 + 60, size: 20, color: this.colors.text },
            ];

            texts.forEach(t => {
                const text = new PIXI.Text({
                    text: t.text,
                    style: {
                        fontFamily: 'Nunito, sans-serif',
                        fontSize: t.size,
                        fontWeight: 'bold',
                        fill: t.color,
                    }
                });
                text.anchor.set(0.5);
                text.x = width / 2;
                text.y = t.y;
                this.uiLayer.addChild(text);
            });

            // Yeniden oyna butonu
            const btnContainer = new PIXI.Container();
            btnContainer.x = width / 2;
            btnContainer.y = height / 2 + 130;

            const btn = new PIXI.Graphics();
            btn.roundRect(-100, -25, 200, 50, 25);
            btn.fill({ color: this.colors.matched });
            btnContainer.addChild(btn);

            const btnText = new PIXI.Text({
                text: '🔄 Tekrar Oyna',
                style: {
                    fontFamily: 'Nunito, sans-serif',
                    fontSize: 22,
                    fontWeight: 'bold',
                    fill: 0xFFFFFF,
                }
            });
            btnText.anchor.set(0.5);
            btnContainer.addChild(btnText);

            btnContainer.eventMode = 'static';
            btnContainer.cursor = 'pointer';
            btnContainer.on('pointerdown', () => this.restart());
            btnContainer.on('pointerover', () => btnContainer.scale.set(1.05));
            btnContainer.on('pointerout', () => btnContainer.scale.set(1));

            this.uiLayer.addChild(btnContainer);
        }, 1000);

        this.options.onComplete({
            score: this.score,
            moves: this.moves,
            timeRemaining: this.timeRemaining,
        });

        this.playSound('win');
    }

    gameOver() {
        clearInterval(this.timerInterval);
        this.isLocked = true;

        const width = this.app.screen.width;
        const height = this.app.screen.height;

        const overlay = new PIXI.Graphics();
        overlay.rect(0, 0, width, height);
        overlay.fill({ color: 0x000000, alpha: 0.7 });
        this.uiLayer.addChild(overlay);

        const texts = [
            { text: '⏰ Süre Doldu!', y: height / 2 - 60, size: 36, color: 0xEF4444 },
            { text: `${this.matchedPairs}/${this.totalPairs} eşleştirme`, y: height / 2, size: 24, color: 0xFFFFFF },
            { text: `⭐ ${this.score} puan`, y: height / 2 + 40, size: 24, color: 0xFCD34D },
        ];

        texts.forEach(t => {
            const text = new PIXI.Text({
                text: t.text,
                style: {
                    fontFamily: 'Nunito, sans-serif',
                    fontSize: t.size,
                    fontWeight: 'bold',
                    fill: t.color,
                }
            });
            text.anchor.set(0.5);
            text.x = width / 2;
            text.y = t.y;
            this.uiLayer.addChild(text);
        });

        // Tekrar dene butonu
        const btnContainer = new PIXI.Container();
        btnContainer.x = width / 2;
        btnContainer.y = height / 2 + 110;

        const btn = new PIXI.Graphics();
        btn.roundRect(-100, -25, 200, 50, 25);
        btn.fill({ color: this.colors.cardBack });
        btnContainer.addChild(btn);

        const btnText = new PIXI.Text({
            text: '🔄 Tekrar Dene',
            style: {
                fontFamily: 'Nunito, sans-serif',
                fontSize: 22,
                fontWeight: 'bold',
                fill: 0xFFFFFF,
            }
        });
        btnText.anchor.set(0.5);
        btnContainer.addChild(btnText);

        btnContainer.eventMode = 'static';
        btnContainer.cursor = 'pointer';
        btnContainer.on('pointerdown', () => this.restart());

        this.uiLayer.addChild(btnContainer);

        this.playSound('lose');
    }

    createConfetti() {
        const colors = [0xFF6B6B, 0x4ECDC4, 0x45B7D1, 0xF7DC6F, 0xBB8FCE, 0x58D68D];
        const width = this.app.screen.width;

        for (let i = 0; i < 50; i++) {
            setTimeout(() => {
                const confetti = new PIXI.Graphics();
                confetti.rect(-5, -10, 10, 20);
                confetti.fill({ color: colors[Math.floor(Math.random() * colors.length)] });
                confetti.x = Math.random() * width;
                confetti.y = -20;
                confetti.rotation = Math.random() * Math.PI;
                this.effectsLayer.addChild(confetti);

                gsap.to(confetti, {
                    y: this.app.screen.height + 50,
                    x: confetti.x + (Math.random() - 0.5) * 200,
                    rotation: confetti.rotation + Math.PI * 4,
                    duration: 2 + Math.random(),
                    ease: 'power1.in',
                    onComplete: () => confetti.destroy(),
                });
            }, i * 30);
        }
    }

    shuffle(array) {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }

    playSound(type) {
        // Ses efektleri (Alpine.store ile entegre edilebilir)
        if (typeof Alpine !== 'undefined' && Alpine.store('app')) {
            const sounds = {
                flip: () => { },
                match: () => Alpine.store('app').speak('Harika!'),
                wrong: () => { },
                win: () => Alpine.store('app').speak('Tebrikler! Oyunu kazandın!'),
                lose: () => Alpine.store('app').speak('Süre doldu! Tekrar dene!'),
                start: () => { },
            };
            if (sounds[type]) sounds[type]();
        }
    }

    restart() {
        // Temizle
        clearInterval(this.timerInterval);
        this.timerInterval = null;
        this.cardSprites = [];
        this.flippedCards = [];
        this.matchedPairs = 0;
        this.moves = 0;
        this.timeRemaining = this.options.timeLimit;
        this.isLocked = false;
        this.gameStarted = false;
        this.score = 0;

        // Yeniden oluştur
        this.gameLayer.removeChildren();
        this.uiLayer.removeChildren();
        this.effectsLayer.removeChildren();

        this.createUI();
        this.createCards();
        this.showStartScreen();
    }

    destroy() {
        clearInterval(this.timerInterval);
        if (this.app) {
            this.app.destroy(true, { children: true, texture: true });
        }
    }
}

// Global export
window.MemoryMatchGame = MemoryMatchGame;
