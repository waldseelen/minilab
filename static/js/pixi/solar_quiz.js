// Solar System Quiz - Interactive Planet Explorer
// Güneş Sistemi Quiz'i - Gezegenler

class SolarQuiz {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.container.innerHTML = '';

        this.app = new PIXI.Application({
            width: 800,
            height: 600,
            backgroundColor: 0x000033,
            resolution: window.devicePixelRatio || 1,
            antialias: true
        });
        this.container.appendChild(this.app.view);

        // Quiz data
        this.planets = [
            {
                name: 'Merkür',
                color: 0x8B7355,
                size: 20,
                fact: 'Güneşe en yakın gezegen!',
                question: 'Güneşe en yakın gezegen hangisi?',
                correctAnswer: 'Merkür'
            },
            {
                name: 'Venüs',
                color: 0xFFA500,
                size: 30,
                fact: 'Gökyüzünün en parlak gezegeni!',
                question: 'Gökyüzünde en parlak görünen gezegen?',
                correctAnswer: 'Venüs'
            },
            {
                name: 'Dünya',
                color: 0x0088FF,
                size: 32,
                fact: 'Bizim evimiz! Su ve yaşam var.',
                question: 'Hangi gezegende yaşam var?',
                correctAnswer: 'Dünya'
            },
            {
                name: 'Mars',
                color: 0xFF4500,
                size: 25,
                fact: 'Kızıl Gezegen! Kırmızı görünür.',
                question: 'Kırmızı renkte olan gezegen?',
                correctAnswer: 'Mars'
            },
            {
                name: 'Jüpiter',
                color: 0xFFA07A,
                size: 60,
                fact: 'En büyük gezegen!',
                question: 'Güneş Sisteminin en büyük gezegeni?',
                correctAnswer: 'Jüpiter'
            }
        ];

        this.currentQuestion = 0;
        this.score = 0;
        this.answeredCorrectly = new Set();

        this.setup();
        this.addStars();
    }

    setup() {
        // Title
        this.createTitle();

        // Sun
        this.createSun();

        // Display area for planets
        this.planetsContainer = new PIXI.Container();
        this.planetsContainer.x = 400;
        this.planetsContainer.y = 300;
        this.app.stage.addChild(this.planetsContainer);

        // Question area
        this.createQuestionArea();

        // Info panel
        this.createInfoPanel();

        // Show first question
        this.showQuestion(this.currentQuestion);
    }

    addStars() {
        // Add twinkling stars
        for (let i = 0; i < 100; i++) {
            const star = new PIXI.Graphics();
            star.beginFill(0xFFFFFF);
            star.drawCircle(0, 0, Math.random() * 2);
            star.endFill();
            star.x = Math.random() * 800;
            star.y = Math.random() * 600;
            star.alpha = Math.random() * 0.5 + 0.3;
            this.app.stage.addChildAt(star, 0);

            // Twinkle animation
            this.app.ticker.add(() => {
                star.alpha += (Math.random() - 0.5) * 0.02;
                if (star.alpha < 0.2) star.alpha = 0.2;
                if (star.alpha > 0.8) star.alpha = 0.8;
            });
        }
    }

    createSun() {
        const sun = new PIXI.Graphics();
        sun.beginFill(0xFFD700);
        sun.drawCircle(0, 0, 40);
        sun.endFill();
        sun.x = 100;
        sun.y = 100;

        // Sun rays
        for (let i = 0; i < 12; i++) {
            const ray = new PIXI.Graphics();
            ray.beginFill(0xFFD700);
            ray.drawRect(-2, -50, 4, 15);
            ray.endFill();
            ray.rotation = (Math.PI * 2 * i) / 12;
            sun.addChild(ray);
        }

        this.app.stage.addChild(sun);

        // Rotate sun
        this.app.ticker.add(() => {
            sun.rotation += 0.005;
        });
    }

    createTitle() {
        const style = new PIXI.TextStyle({
            fontFamily: 'Arial',
            fontSize: 28,
            fill: '#FFFFFF',
            fontWeight: 'bold',
            dropShadow: true,
            dropShadowDistance: 2,
            align: 'center'
        });
        const title = new PIXI.Text('🌍 Gezegen Keşfi!', style);
        title.x = 400 - title.width / 2;
        title.y = 20;
        this.app.stage.addChild(title);
    }

    createQuestionArea() {
        this.questionContainer = new PIXI.Container();
        this.questionContainer.y = 450;
        this.app.stage.addChild(this.questionContainer);
    }

    createInfoPanel() {
        // Score
        this.scoreText = new PIXI.Text('⭐ Puan: 0', {
            fontFamily: 'Arial',
            fontSize: 18,
            fill: '#FFD700',
            fontWeight: 'bold'
        });
        this.scoreText.x = 650;
        this.scoreText.y = 70;
        this.app.stage.addChild(this.scoreText);

        // Progress
        this.progressText = new PIXI.Text('Soru: 1/5', {
            fontFamily: 'Arial',
            fontSize: 18,
            fill: '#FFFFFF',
            fontWeight: 'bold'
        });
        this.progressText.x = 20;
        this.progressText.y = 70;
        this.app.stage.addChild(this.progressText);
    }

    showQuestion(index) {
        if (index >= this.planets.length) {
            this.showCompletion();
            return;
        }

        this.planetsContainer.removeChildren();
        this.questionContainer.removeChildren();

        const planet = this.planets[index];

        // Draw planet at center
        const planetGraphic = new PIXI.Graphics();
        planetGraphic.beginFill(planet.color);
        planetGraphic.drawCircle(0, 0, planet.size);
        planetGraphic.endFill();

        // Add glow effect
        const glow = new PIXI.Graphics();
        glow.beginFill(planet.color, 0.3);
        glow.drawCircle(0, 0, planet.size + 10);
        glow.endFill();
        this.planetsContainer.addChild(glow);
        this.planetsContainer.addChild(planetGraphic);

        // Fact text
        const factBg = new PIXI.Graphics();
        factBg.beginFill(0x000000, 0.7);
        factBg.drawRoundedRect(-150, -120, 300, 60, 10);
        factBg.endFill();
        this.planetsContainer.addChild(factBg);

        const factText = new PIXI.Text(planet.fact, {
            fontFamily: 'Arial',
            fontSize: 16,
            fill: '#FFFFFF',
            align: 'center',
            wordWrap: true,
            wordWrapWidth: 280
        });
        factText.anchor.set(0.5);
        factText.y = -90;
        this.planetsContainer.addChild(factText);

        // Question
        const questionText = new PIXI.Text(planet.question, {
            fontFamily: 'Arial',
            fontSize: 20,
            fill: '#FFFFFF',
            fontWeight: 'bold',
            align: 'center',
            wordWrap: true,
            wordWrapWidth: 700
        });
        questionText.x = 400 - questionText.width / 2;
        questionText.y = 10;
        this.questionContainer.addChild(questionText);

        // Answer buttons
        const answers = [planet.correctAnswer];
        const wrongAnswers = this.planets
            .filter(p => p.name !== planet.correctAnswer)
            .map(p => p.name);

        // Add 2 random wrong answers
        for (let i = 0; i < 2 && wrongAnswers.length > 0; i++) {
            const randomIndex = Math.floor(Math.random() * wrongAnswers.length);
            answers.push(wrongAnswers[randomIndex]);
            wrongAnswers.splice(randomIndex, 1);
        }

        // Shuffle answers
        answers.sort(() => Math.random() - 0.5);

        // Create answer buttons
        answers.forEach((answer, i) => {
            const button = this.createAnswerButton(answer, answer === planet.correctAnswer);
            button.x = 50 + i * 240;
            button.y = 60;
            this.questionContainer.addChild(button);
        });

        // Update progress
        this.progressText.text = `Soru: ${index + 1}/${this.planets.length}`;
    }

    createAnswerButton(text, isCorrect) {
        const container = new PIXI.Container();
        container.interactive = true;
        container.buttonMode = true;
        container.cursor = 'pointer';

        const bg = new PIXI.Graphics();
        bg.beginFill(0x4169E1);
        bg.drawRoundedRect(0, 0, 220, 60, 15);
        bg.endFill();
        container.addChild(bg);

        const label = new PIXI.Text(text, {
            fontFamily: 'Arial',
            fontSize: 18,
            fill: '#FFFFFF',
            fontWeight: 'bold',
            align: 'center'
        });
        label.x = 110 - label.width / 2;
        label.y = 30 - label.height / 2;
        container.addChild(label);

        // Hover effects
        container.on('pointerover', () => {
            bg.clear();
            bg.beginFill(0x5A7FE1);
            bg.drawRoundedRect(0, 0, 220, 60, 15);
            bg.endFill();
            container.scale.set(1.05);
        });

        container.on('pointerout', () => {
            bg.clear();
            bg.beginFill(0x4169E1);
            bg.drawRoundedRect(0, 0, 220, 60, 15);
            bg.endFill();
            container.scale.set(1);
        });

        // Click handler
        container.on('pointerdown', () => {
            this.checkAnswer(isCorrect);
        });

        return container;
    }

    checkAnswer(isCorrect) {
        if (isCorrect) {
            this.score += 20;
            this.scoreText.text = `⭐ Puan: ${this.score}`;
            this.answeredCorrectly.add(this.currentQuestion);

            this.showFeedback('Doğru! 🎉', 0x10B981);
            if (window.playSound) window.playSound('success');

            setTimeout(() => {
                this.currentQuestion++;
                this.showQuestion(this.currentQuestion);
            }, 1500);
        } else {
            this.showFeedback('Tekrar dene! 🤔', 0xFF6347);
            if (window.playSound) window.playSound('click');
        }

        // Update experiment progress
        if (window.updateExperimentProgress) {
            window.updateExperimentProgress(
                this.answeredCorrectly.size,
                `${this.answeredCorrectly.size} gezegen öğrenildi!`
            );
        }
    }

    showFeedback(message, color) {
        const feedback = new PIXI.Container();

        const bg = new PIXI.Graphics();
        bg.beginFill(color, 0.95);
        bg.drawRoundedRect(0, 0, 300, 80, 15);
        bg.endFill();
        feedback.addChild(bg);

        const text = new PIXI.Text(message, {
            fontFamily: 'Arial',
            fontSize: 24,
            fill: '#FFFFFF',
            fontWeight: 'bold',
            align: 'center'
        });
        text.x = 150 - text.width / 2;
        text.y = 40 - text.height / 2;
        feedback.addChild(text);

        feedback.x = 250;
        feedback.y = 250;
        feedback.alpha = 0;

        this.app.stage.addChild(feedback);

        // Animate
        const fadeIn = () => {
            feedback.alpha += 0.05;
            if (feedback.alpha < 1) {
                requestAnimationFrame(fadeIn);
            } else {
                setTimeout(() => {
                    const fadeOut = () => {
                        feedback.alpha -= 0.05;
                        if (feedback.alpha > 0) {
                            requestAnimationFrame(fadeOut);
                        } else {
                            this.app.stage.removeChild(feedback);
                        }
                    };
                    fadeOut();
                }, 1000);
            }
        };
        fadeIn();
    }

    showCompletion() {
        this.planetsContainer.removeChildren();
        this.questionContainer.removeChildren();

        const completion = new PIXI.Container();

        const bg = new PIXI.Graphics();
        bg.beginFill(0x8B5CF6, 0.9);
        bg.drawRoundedRect(0, 0, 500, 250, 20);
        bg.endFill();
        completion.addChild(bg);

        const emoji = new PIXI.Text('🚀', {
            fontSize: 80
        });
        emoji.x = 250 - emoji.width / 2;
        emoji.y = 30;
        completion.addChild(emoji);

        const title = new PIXI.Text('Harika İş!', {
            fontFamily: 'Arial',
            fontSize: 36,
            fill: '#FFFFFF',
            fontWeight: 'bold'
        });
        title.x = 250 - title.width / 2;
        title.y = 120;
        completion.addChild(title);

        const scoreText = new PIXI.Text(`Toplam: ${this.score} puan`, {
            fontFamily: 'Arial',
            fontSize: 24,
            fill: '#FFD700'
        });
        scoreText.x = 250 - scoreText.width / 2;
        scoreText.y = 170;
        completion.addChild(scoreText);

        completion.x = 150;
        completion.y = 175;
        this.app.stage.addChild(completion);

        if (window.updateExperimentProgress) {
            window.updateExperimentProgress(5, 'Tüm gezegenler keşfedildi!');
        }
    }
}
