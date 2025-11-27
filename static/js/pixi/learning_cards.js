/**
 * MiniLab - Learning Cards (Flash Cards) V2
 * Çocuklar için interaktif öğrenme kartları
 * Pixi.js + GSAP animasyonları
 */

class LearningCards {
    constructor(containerId, options = {}) {
        this.container = document.getElementById(containerId);
        this.options = {
            cards: options.cards || [],
            category: options.category || 'all',
            autoRead: options.autoRead !== false,
            onCardComplete: options.onCardComplete || (() => { }),
            onAllComplete: options.onAllComplete || (() => { }),
            ...options
        };

        this.app = null;
        this.currentIndex = 0;
        this.cardsLearned = 0;
        this.isFlipped = false;
        this.cardContainer = null;

        // Renk paleti (kategoriye göre)
        this.categoryColors = {
            animals: { primary: 0xF59E0B, secondary: 0xFEF3C7 },
            plants: { primary: 0x10B981, secondary: 0xD1FAE5 },
            space: { primary: 0x6366F1, secondary: 0xE0E7FF },
            body: { primary: 0xEF4444, secondary: 0xFEE2E2 },
            weather: { primary: 0x06B6D4, secondary: 0xCFFAFE },
            colors: { primary: 0xEC4899, secondary: 0xFCE7F3 },
            shapes: { primary: 0x8B5CF6, secondary: 0xEDE9FE },
            numbers: { primary: 0x3B82F6, secondary: 0xDBEAFE },
            science: { primary: 0x14B8A6, secondary: 0xCCFBF1 },
            nature: { primary: 0x22C55E, secondary: 0xDCFCE7 },
            default: { primary: 0x8B5CF6, secondary: 0xF3E8FF },
        };

        this.init();
    }

    async init() {
        const rect = this.container.getBoundingClientRect();
        const width = rect.width || 600;
        const height = rect.height || 500;

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
        this.bgLayer = new PIXI.Container();
        this.cardLayer = new PIXI.Container();
        this.uiLayer = new PIXI.Container();
        this.effectsLayer = new PIXI.Container();

        this.app.stage.addChild(this.bgLayer);
        this.app.stage.addChild(this.cardLayer);
        this.app.stage.addChild(this.uiLayer);
        this.app.stage.addChild(this.effectsLayer);

        // Demo kartlar yoksa
        if (this.options.cards.length === 0) {
            this.options.cards = this.getDemoCards();
        }

        this.createBackground();
        this.createUI();
        this.createCard();
    }

    getDemoCards() {
        return [
            {
                title: 'Güneş',
                emoji: '☀️',
                category: 'space',
                front_text: 'Gökyüzündeki en parlak yıldız hangisi?',
                back_text: 'Güneş! Dünyamızı ısıtan ve aydınlatan dev bir yıldızdır.',
                fun_fact: 'Güneş o kadar büyük ki içine 1 milyon tane Dünya sığabilir!',
            },
            {
                title: 'Kelebek',
                emoji: '🦋',
                category: 'animals',
                front_text: 'Tırtıldan çıkan, renkli kanatları olan böcek hangisi?',
                back_text: 'Kelebek! Tırtıl önce koza yapar, sonra muhteşem bir kelebeğe dönüşür.',
                fun_fact: 'Kelebekler kanatlarıyla değil, ayaklarıyla tat alır!',
            },
            {
                title: 'Gökkuşağı',
                emoji: '🌈',
                category: 'weather',
                front_text: 'Yağmurdan sonra gökyüzünde beliren renkli yay nedir?',
                back_text: 'Gökkuşağı! Güneş ışığı yağmur damlalarından geçerken 7 renge ayrılır.',
                fun_fact: 'Gökkuşağının renkleri: Kırmızı, Turuncu, Sarı, Yeşil, Mavi, Lacivert, Mor!',
            },
        ];
    }

    createBackground() {
        const width = this.app.screen.width;
        const height = this.app.screen.height;

        // Gradient arka plan
        const bg = new PIXI.Graphics();
        bg.rect(0, 0, width, height);
        bg.fill({ color: 0xFAF5FF });
        this.bgLayer.addChild(bg);

        // Dekoratif elementler
        const decorEmojis = ['✨', '🌟', '💫', '⭐'];
        for (let i = 0; i < 8; i++) {
            const decor = new PIXI.Text({
                text: decorEmojis[i % decorEmojis.length],
                style: { fontSize: 20 + Math.random() * 15 }
            });
            decor.x = Math.random() * width;
            decor.y = Math.random() * height;
            decor.alpha = 0.3;
            this.bgLayer.addChild(decor);

            // Hafif animasyon
            gsap.to(decor, {
                y: decor.y - 10,
                duration: 2 + Math.random() * 2,
                repeat: -1,
                yoyo: true,
                ease: 'sine.inOut',
            });
        }
    }

    createUI() {
        const width = this.app.screen.width;

        // Üst bar
        const topBar = new PIXI.Graphics();
        topBar.roundRect(10, 10, width - 20, 50, 12);
        topBar.fill({ color: 0xFFFFFF, alpha: 0.9 });
        this.uiLayer.addChild(topBar);

        // İlerleme göstergesi
        this.progressText = new PIXI.Text({
            text: `📚 ${this.currentIndex + 1} / ${this.options.cards.length}`,
            style: {
                fontFamily: 'Nunito, sans-serif',
                fontSize: 20,
                fontWeight: 'bold',
                fill: 0x6B7280,
            }
        });
        this.progressText.x = 25;
        this.progressText.y = 22;
        this.uiLayer.addChild(this.progressText);

        // Öğrenilen kartlar
        this.learnedText = new PIXI.Text({
            text: `✅ ${this.cardsLearned} öğrenildi`,
            style: {
                fontFamily: 'Nunito, sans-serif',
                fontSize: 20,
                fontWeight: 'bold',
                fill: 0x10B981,
            }
        });
        this.learnedText.x = width - 160;
        this.learnedText.y = 22;
        this.uiLayer.addChild(this.learnedText);

        // İlerleme çubuğu
        const progressBarBg = new PIXI.Graphics();
        progressBarBg.roundRect(10, 65, width - 20, 8, 4);
        progressBarBg.fill({ color: 0xE5E7EB });
        this.uiLayer.addChild(progressBarBg);

        this.progressBar = new PIXI.Graphics();
        this.updateProgressBar();
        this.uiLayer.addChild(this.progressBar);

        // Alt navigasyon
        this.createNavButtons();
    }

    updateProgressBar() {
        const width = this.app.screen.width;
        const progress = (this.currentIndex + 1) / this.options.cards.length;

        this.progressBar.clear();
        this.progressBar.roundRect(10, 65, (width - 20) * progress, 8, 4);
        this.progressBar.fill({ color: 0x8B5CF6 });
    }

    createNavButtons() {
        const width = this.app.screen.width;
        const height = this.app.screen.height;
        const buttonY = height - 60;

        // Önceki buton
        this.prevButton = this.createButton('←', 60, buttonY, () => this.previousCard());
        this.uiLayer.addChild(this.prevButton);

        // Sesli oku butonu
        this.speakButton = this.createButton('🔊', width / 2, buttonY, () => this.speakCard());
        this.uiLayer.addChild(this.speakButton);

        // Sonraki buton
        this.nextButton = this.createButton('→', width - 60, buttonY, () => this.nextCard());
        this.uiLayer.addChild(this.nextButton);

        // İpucu butonu
        this.hintButton = this.createButton('💡', width / 2, buttonY - 60, () => this.showFunFact(), true);
        this.hintButton.visible = false;
        this.uiLayer.addChild(this.hintButton);
    }

    createButton(text, x, y, onClick, small = false) {
        const container = new PIXI.Container();
        container.x = x;
        container.y = y;

        const size = small ? 40 : 50;
        const bg = new PIXI.Graphics();
        bg.circle(0, 0, size / 2);
        bg.fill({ color: 0xFFFFFF });
        bg.stroke({ width: 2, color: 0xE5E7EB });
        container.addChild(bg);

        const label = new PIXI.Text({
            text,
            style: {
                fontSize: small ? 20 : 28,
            }
        });
        label.anchor.set(0.5);
        container.addChild(label);

        container.eventMode = 'static';
        container.cursor = 'pointer';
        container.on('pointerdown', onClick);
        container.on('pointerover', () => {
            gsap.to(container.scale, { x: 1.1, y: 1.1, duration: 0.2 });
        });
        container.on('pointerout', () => {
            gsap.to(container.scale, { x: 1, y: 1, duration: 0.2 });
        });

        return container;
    }

    createCard() {
        if (this.cardContainer) {
            this.cardContainer.destroy();
        }

        const width = this.app.screen.width;
        const height = this.app.screen.height;
        const cardData = this.options.cards[this.currentIndex];

        // Renkleri belirle
        const colors = this.categoryColors[cardData.category] || this.categoryColors.default;

        this.cardContainer = new PIXI.Container();
        this.cardContainer.x = width / 2;
        this.cardContainer.y = height / 2 - 20;
        this.cardLayer.addChild(this.cardContainer);

        const cardW = Math.min(400, width - 40);
        const cardH = 280;

        // Kart ön yüzü
        this.frontCard = new PIXI.Container();

        const frontBg = new PIXI.Graphics();
        frontBg.roundRect(-cardW / 2, -cardH / 2, cardW, cardH, 25);
        frontBg.fill({ color: 0xFFFFFF });
        frontBg.stroke({ width: 4, color: colors.primary });
        this.frontCard.addChild(frontBg);

        // Emoji
        const emoji = new PIXI.Text({
            text: cardData.emoji,
            style: { fontSize: 80 }
        });
        emoji.anchor.set(0.5);
        emoji.y = -60;
        this.frontCard.addChild(emoji);

        // Soru
        const question = new PIXI.Text({
            text: cardData.front_text,
            style: {
                fontFamily: 'Nunito, sans-serif',
                fontSize: 22,
                fontWeight: 'bold',
                fill: 0x374151,
                wordWrap: true,
                wordWrapWidth: cardW - 40,
                align: 'center',
            }
        });
        question.anchor.set(0.5);
        question.y = 50;
        this.frontCard.addChild(question);

        // "Çevir" ipucu
        const flipHint = new PIXI.Text({
            text: '👆 Cevabı görmek için dokun',
            style: {
                fontFamily: 'Nunito, sans-serif',
                fontSize: 14,
                fill: 0x9CA3AF,
            }
        });
        flipHint.anchor.set(0.5);
        flipHint.y = cardH / 2 - 25;
        this.frontCard.addChild(flipHint);

        this.cardContainer.addChild(this.frontCard);

        // Kart arka yüzü (gizli)
        this.backCard = new PIXI.Container();
        this.backCard.visible = false;

        const backBg = new PIXI.Graphics();
        backBg.roundRect(-cardW / 2, -cardH / 2, cardW, cardH, 25);
        backBg.fill({ color: colors.secondary });
        backBg.stroke({ width: 4, color: colors.primary });
        this.backCard.addChild(backBg);

        // Başlık
        const titleBg = new PIXI.Graphics();
        titleBg.roundRect(-cardW / 2 + 10, -cardH / 2 + 10, cardW - 20, 45, 15);
        titleBg.fill({ color: colors.primary });
        this.backCard.addChild(titleBg);

        const title = new PIXI.Text({
            text: `${cardData.emoji} ${cardData.title}`,
            style: {
                fontFamily: 'Nunito, sans-serif',
                fontSize: 24,
                fontWeight: 'bold',
                fill: 0xFFFFFF,
            }
        });
        title.anchor.set(0.5);
        title.y = -cardH / 2 + 32;
        this.backCard.addChild(title);

        // Cevap
        const answer = new PIXI.Text({
            text: cardData.back_text,
            style: {
                fontFamily: 'Nunito, sans-serif',
                fontSize: 20,
                fill: 0x374151,
                wordWrap: true,
                wordWrapWidth: cardW - 40,
                align: 'center',
            }
        });
        answer.anchor.set(0.5);
        answer.y = 20;
        this.backCard.addChild(answer);

        // "Öğrendim" butonu
        const learnedBtn = this.createLearnedButton(cardW);
        learnedBtn.y = cardH / 2 - 35;
        this.backCard.addChild(learnedBtn);

        this.cardContainer.addChild(this.backCard);

        // Kart tıklama
        this.cardContainer.eventMode = 'static';
        this.cardContainer.cursor = 'pointer';
        this.cardContainer.on('pointerdown', () => this.flipCard());

        // Giriş animasyonu
        this.cardContainer.scale.set(0);
        gsap.to(this.cardContainer.scale, {
            x: 1,
            y: 1,
            duration: 0.4,
            ease: 'back.out',
        });

        // UI güncelle
        this.isFlipped = false;
        this.hintButton.visible = false;
        this.updateUI();

        // Otomatik okuma
        if (this.options.autoRead) {
            setTimeout(() => this.speakCard(), 500);
        }
    }

    createLearnedButton(cardW) {
        const container = new PIXI.Container();

        const bg = new PIXI.Graphics();
        bg.roundRect(-80, -18, 160, 36, 18);
        bg.fill({ color: 0x10B981 });
        container.addChild(bg);

        const text = new PIXI.Text({
            text: '✅ Öğrendim!',
            style: {
                fontFamily: 'Nunito, sans-serif',
                fontSize: 18,
                fontWeight: 'bold',
                fill: 0xFFFFFF,
            }
        });
        text.anchor.set(0.5);
        container.addChild(text);

        container.eventMode = 'static';
        container.cursor = 'pointer';
        container.on('pointerdown', (e) => {
            e.stopPropagation();
            this.markAsLearned();
        });
        container.on('pointerover', () => container.scale.set(1.05));
        container.on('pointerout', () => container.scale.set(1));

        return container;
    }

    flipCard() {
        if (this.isAnimating) return;
        this.isAnimating = true;

        const toBack = !this.isFlipped;

        gsap.to(this.cardContainer.scale, {
            x: 0,
            duration: 0.2,
            ease: 'power2.in',
            onComplete: () => {
                this.frontCard.visible = !toBack;
                this.backCard.visible = toBack;
                this.hintButton.visible = toBack;

                gsap.to(this.cardContainer.scale, {
                    x: 1,
                    duration: 0.2,
                    ease: 'power2.out',
                    onComplete: () => {
                        this.isAnimating = false;
                        this.isFlipped = toBack;

                        if (toBack && this.options.autoRead) {
                            this.speakCard();
                        }
                    }
                });
            }
        });

        // Flip ses efekti
        this.playSound('flip');
    }

    markAsLearned() {
        const cardData = this.options.cards[this.currentIndex];
        this.cardsLearned++;

        // Yıldız efekti
        this.showStarEffect();

        // Callback
        this.options.onCardComplete(cardData);

        // Sonraki karta geç
        setTimeout(() => {
            if (this.currentIndex < this.options.cards.length - 1) {
                this.nextCard();
            } else {
                this.showCompletionScreen();
            }
        }, 500);

        this.playSound('success');
    }

    showStarEffect() {
        for (let i = 0; i < 5; i++) {
            setTimeout(() => {
                const star = new PIXI.Text({
                    text: '⭐',
                    style: { fontSize: 40 }
                });
                star.x = this.cardContainer.x + (Math.random() - 0.5) * 200;
                star.y = this.cardContainer.y;
                star.anchor.set(0.5);
                this.effectsLayer.addChild(star);

                gsap.to(star, {
                    y: star.y - 100,
                    alpha: 0,
                    rotation: Math.PI,
                    duration: 0.8,
                    ease: 'power2.out',
                    onComplete: () => star.destroy(),
                });
            }, i * 80);
        }
    }

    showFunFact() {
        const cardData = this.options.cards[this.currentIndex];
        if (!cardData.fun_fact) return;

        const width = this.app.screen.width;
        const height = this.app.screen.height;

        // Overlay
        const overlay = new PIXI.Graphics();
        overlay.rect(0, 0, width, height);
        overlay.fill({ color: 0x000000, alpha: 0.5 });
        overlay.eventMode = 'static';
        overlay.on('pointerdown', () => {
            overlay.destroy();
            popup.destroy();
        });
        this.effectsLayer.addChild(overlay);

        // Popup
        const popup = new PIXI.Container();
        popup.x = width / 2;
        popup.y = height / 2;

        const bg = new PIXI.Graphics();
        bg.roundRect(-180, -100, 360, 200, 20);
        bg.fill({ color: 0xFEF3C7 });
        bg.stroke({ width: 3, color: 0xF59E0B });
        popup.addChild(bg);

        const icon = new PIXI.Text({
            text: '💡',
            style: { fontSize: 50 }
        });
        icon.anchor.set(0.5);
        icon.y = -50;
        popup.addChild(icon);

        const title = new PIXI.Text({
            text: 'Biliyor muydun?',
            style: {
                fontFamily: 'Nunito, sans-serif',
                fontSize: 20,
                fontWeight: 'bold',
                fill: 0xB45309,
            }
        });
        title.anchor.set(0.5);
        title.y = 0;
        popup.addChild(title);

        const fact = new PIXI.Text({
            text: cardData.fun_fact,
            style: {
                fontFamily: 'Nunito, sans-serif',
                fontSize: 16,
                fill: 0x78350F,
                wordWrap: true,
                wordWrapWidth: 320,
                align: 'center',
            }
        });
        fact.anchor.set(0.5);
        fact.y = 50;
        popup.addChild(fact);

        popup.scale.set(0);
        this.effectsLayer.addChild(popup);

        gsap.to(popup.scale, {
            x: 1,
            y: 1,
            duration: 0.3,
            ease: 'back.out',
        });

        // Sesli oku
        this.speak(`Biliyor muydun? ${cardData.fun_fact}`);
    }

    nextCard() {
        if (this.currentIndex < this.options.cards.length - 1) {
            // Çıkış animasyonu
            gsap.to(this.cardContainer, {
                x: -100,
                alpha: 0,
                duration: 0.3,
                onComplete: () => {
                    this.currentIndex++;
                    this.createCard();
                    this.cardContainer.x = this.app.screen.width / 2 + 100;
                    this.cardContainer.alpha = 0;
                    gsap.to(this.cardContainer, {
                        x: this.app.screen.width / 2,
                        alpha: 1,
                        duration: 0.3,
                    });
                }
            });
        }
    }

    previousCard() {
        if (this.currentIndex > 0) {
            gsap.to(this.cardContainer, {
                x: this.app.screen.width + 100,
                alpha: 0,
                duration: 0.3,
                onComplete: () => {
                    this.currentIndex--;
                    this.createCard();
                    this.cardContainer.x = -100;
                    this.cardContainer.alpha = 0;
                    gsap.to(this.cardContainer, {
                        x: this.app.screen.width / 2,
                        alpha: 1,
                        duration: 0.3,
                    });
                }
            });
        }
    }

    speakCard() {
        const cardData = this.options.cards[this.currentIndex];
        const text = this.isFlipped
            ? `${cardData.title}. ${cardData.back_text}`
            : cardData.front_text;
        this.speak(text);
    }

    speak(text) {
        if ('speechSynthesis' in window) {
            speechSynthesis.cancel();
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = 'tr-TR';
            utterance.rate = 0.85;
            utterance.pitch = 1.1;
            speechSynthesis.speak(utterance);
        }
    }

    updateUI() {
        this.progressText.text = `📚 ${this.currentIndex + 1} / ${this.options.cards.length}`;
        this.learnedText.text = `✅ ${this.cardsLearned} öğrenildi`;
        this.updateProgressBar();
    }

    showCompletionScreen() {
        const width = this.app.screen.width;
        const height = this.app.screen.height;

        // Overlay
        const overlay = new PIXI.Graphics();
        overlay.rect(0, 0, width, height);
        overlay.fill({ color: 0x8B5CF6, alpha: 0.95 });
        this.effectsLayer.addChild(overlay);

        // Confetti
        this.createConfetti();

        // Mesajlar
        const texts = [
            { text: '🎉', y: height / 2 - 100, size: 80 },
            { text: 'Harika İş!', y: height / 2 - 20, size: 36 },
            { text: `${this.cardsLearned} kart öğrendin!`, y: height / 2 + 30, size: 24 },
        ];

        texts.forEach(t => {
            const text = new PIXI.Text({
                text: t.text,
                style: {
                    fontFamily: 'Nunito, sans-serif',
                    fontSize: t.size,
                    fontWeight: 'bold',
                    fill: 0xFFFFFF,
                }
            });
            text.anchor.set(0.5);
            text.x = width / 2;
            text.y = t.y;
            this.effectsLayer.addChild(text);
        });

        // Callback
        this.options.onAllComplete({
            totalCards: this.options.cards.length,
            cardsLearned: this.cardsLearned,
        });

        this.speak('Tebrikler! Tüm kartları öğrendin!');
    }

    createConfetti() {
        const colors = [0xFFFFFF, 0xFCD34D, 0xF87171, 0x34D399, 0x60A5FA];
        const width = this.app.screen.width;

        for (let i = 0; i < 30; i++) {
            setTimeout(() => {
                const confetti = new PIXI.Graphics();
                confetti.rect(-4, -8, 8, 16);
                confetti.fill({ color: colors[Math.floor(Math.random() * colors.length)] });
                confetti.x = Math.random() * width;
                confetti.y = -20;
                confetti.rotation = Math.random() * Math.PI;
                this.effectsLayer.addChild(confetti);

                gsap.to(confetti, {
                    y: this.app.screen.height + 50,
                    rotation: confetti.rotation + Math.PI * 4,
                    duration: 2 + Math.random(),
                    ease: 'power1.in',
                    onComplete: () => confetti.destroy(),
                });
            }, i * 50);
        }
    }

    playSound(type) {
        // Sound effects placeholder
    }

    destroy() {
        if (this.app) {
            this.app.destroy(true, { children: true, texture: true });
        }
    }
}

// Global export
window.LearningCards = LearningCards;
