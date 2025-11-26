// Pattern Puzzle - Logic Puzzle Game
// Mantık ve Örüntü Bulma Oyunu

class PatternPuzzle {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.container.innerHTML = '';

        this.app = new PIXI.Application({
            width: 800,
            height: 600,
            backgroundColor: 0xF0F9FF,
            resolution: window.devicePixelRatio || 1,
            antialias: true
        });
        this.container.appendChild(this.app.view);

        // Puzzle state
        this.currentLevel = 1;
        this.maxLevel = 3;
        this.score = 0;
        this.patterns = this.generatePatterns();

        this.setup();
    }

    setup() {
        // Title
        this.createTitle();

        // Pattern display area
        this.createPatternDisplay();

        // Answer options
        this.createAnswerOptions();

        // Info panel
        this.createInfoPanel();

        // Load first puzzle
        this.loadPuzzle(this.currentLevel);
    }

    createTitle() {
        const style = new PIXI.TextStyle({
            fontFamily: 'Arial',
            fontSize: 28,
            fill: '#0088e6',
            fontWeight: 'bold',
            align: 'center'
        });
        const title = new PIXI.Text('🧩 Örüntüyü Bul!', style);
        title.x = 400 - title.width / 2;
        title.y = 20;
        this.app.stage.addChild(title);
    }

    createPatternDisplay() {
        this.patternContainer = new PIXI.Container();
        this.patternContainer.x = 100;
        this.patternContainer.y = 100;
        this.app.stage.addChild(this.patternContainer);
    }

    createAnswerOptions() {
        this.optionsContainer = new PIXI.Container();
        this.optionsContainer.x = 100;
        this.optionsContainer.y = 350;
        this.app.stage.addChild(this.optionsContainer);
    }

    createInfoPanel() {
        // Level display
        this.levelText = new PIXI.Text('Seviye: 1', {
            fontFamily: 'Arial',
            fontSize: 20,
            fill: '#666666',
            fontWeight: 'bold'
        });
        this.levelText.x = 20;
        this.levelText.y = 70;
        this.app.stage.addChild(this.levelText);

        // Score display
        this.scoreText = new PIXI.Text('Puan: 0', {
            fontFamily: 'Arial',
            fontSize: 20,
            fill: '#10B981',
            fontWeight: 'bold'
        });
        this.scoreText.x = 670;
        this.scoreText.y = 70;
        this.app.stage.addChild(this.scoreText);

        // Instructions
        const instructions = new PIXI.Text('Sıradaki şekil hangisi olmalı?', {
            fontFamily: 'Arial',
            fontSize: 18,
            fill: '#666666',
            align: 'center'
        });
        instructions.x = 400 - instructions.width / 2;
        instructions.y = 300;
        this.app.stage.addChild(instructions);
    }

    generatePatterns() {
        return [
            // Level 1 - Simple color pattern
            {
                sequence: ['red', 'blue', 'red', 'blue', 'red'],
                answer: 'blue',
                options: ['blue', 'red', 'yellow'],
                hint: 'Renkler sırayla değişiyor!'
            },
            // Level 2 - Shape pattern
            {
                sequence: ['circle', 'square', 'circle', 'square', 'circle'],
                answer: 'square',
                options: ['circle', 'square', 'triangle'],
                hint: 'Şekiller sırayla tekrar ediyor!'
            },
            // Level 3 - Size pattern
            {
                sequence: ['small', 'medium', 'large', 'small', 'medium'],
                answer: 'large',
                options: ['small', 'medium', 'large'],
                hint: 'Boyutlar büyüyüp küçülüyor!'
            }
        ];
    }

    loadPuzzle(level) {
        this.patternContainer.removeChildren();
        this.optionsContainer.removeChildren();

        const pattern = this.patterns[level - 1];

        // Draw pattern sequence
        pattern.sequence.forEach((item, index) => {
            const shape = this.createShape(item, index);
            shape.x = index * 110;
            shape.y = 0;
            this.patternContainer.addChild(shape);
        });

        // Add question mark
        const questionMark = this.createQuestionMark();
        questionMark.x = pattern.sequence.length * 110;
        questionMark.y = 0;
        this.patternContainer.addChild(questionMark);

        // Draw answer options
        pattern.options.forEach((option, index) => {
            const optionShape = this.createShape(option, index, true);
            optionShape.x = index * 200 + 50;
            optionShape.y = 0;
            optionShape.interactive = true;
            optionShape.buttonMode = true;
            optionShape.cursor = 'pointer';

            // Add click handler
            optionShape.on('pointerdown', () => {
                this.checkAnswer(option, pattern.answer);
            });

            // Hover effect
            optionShape.on('pointerover', () => {
                optionShape.scale.set(1.1);
            });
            optionShape.on('pointerout', () => {
                optionShape.scale.set(1);
            });

            this.optionsContainer.addChild(optionShape);
        });

        // Update level text
        this.levelText.text = `Seviye: ${level}`;
    }

    createShape(type, index, isOption = false) {
        const container = new PIXI.Container();
        const size = isOption ? 80 : 60;

        // Determine what to draw based on type
        const graphics = new PIXI.Graphics();

        if (type === 'red' || type === 'blue' || type === 'yellow') {
            // Color circles
            const color = type === 'red' ? 0xFF0000 : type === 'blue' ? 0x0000FF : 0xFFFF00;
            graphics.beginFill(color);
            graphics.drawCircle(0, 0, size / 2);
            graphics.endFill();
        } else if (type === 'circle') {
            // Circle shape
            graphics.lineStyle(4, 0x0088e6, 1);
            graphics.beginFill(0x4fc3f7);
            graphics.drawCircle(0, 0, size / 2);
            graphics.endFill();
        } else if (type === 'square') {
            // Square shape
            graphics.lineStyle(4, 0x10B981, 1);
            graphics.beginFill(0x34d399);
            graphics.drawRect(-size / 2, -size / 2, size, size);
            graphics.endFill();
        } else if (type === 'triangle') {
            // Triangle shape
            graphics.lineStyle(4, 0xEC4899, 1);
            graphics.beginFill(0xf9a8d4);
            graphics.moveTo(0, -size / 2);
            graphics.lineTo(size / 2, size / 2);
            graphics.lineTo(-size / 2, size / 2);
            graphics.closePath();
            graphics.endFill();
        } else if (type === 'small' || type === 'medium' || type === 'large') {
            // Size-based circles
            const sizeMap = { small: 20, medium: 35, large: 50 };
            const radius = sizeMap[type];
            graphics.beginFill(0x8B5CF6);
            graphics.drawCircle(0, 0, radius);
            graphics.endFill();
        }

        graphics.x = size / 2;
        graphics.y = size / 2;
        container.addChild(graphics);

        // Add background for options
        if (isOption) {
            const bg = new PIXI.Graphics();
            bg.lineStyle(3, 0xCCCCCC, 1);
            bg.beginFill(0xFFFFFF);
            bg.drawRoundedRect(0, 0, size + 20, size + 20, 10);
            bg.endFill();
            container.addChildAt(bg, 0);
            graphics.x = (size + 20) / 2;
            graphics.y = (size + 20) / 2;
        }

        return container;
    }

    createQuestionMark() {
        const container = new PIXI.Container();

        const bg = new PIXI.Graphics();
        bg.beginFill(0xFFD700, 0.3);
        bg.drawCircle(30, 30, 30);
        bg.endFill();
        container.addChild(bg);

        const text = new PIXI.Text('?', {
            fontFamily: 'Arial',
            fontSize: 50,
            fill: '#FFD700',
            fontWeight: 'bold'
        });
        text.anchor.set(0.5);
        text.x = 30;
        text.y = 30;
        container.addChild(text);

        return container;
    }

    checkAnswer(selected, correct) {
        if (selected === correct) {
            // Correct answer
            this.score += 10;
            this.scoreText.text = `Puan: ${this.score}`;

            this.showFeedback('Doğru! 🎉', 0x10B981);

            if (window.playSound) window.playSound('success');

            // Next level
            setTimeout(() => {
                if (this.currentLevel < this.maxLevel) {
                    this.currentLevel++;
                    this.loadPuzzle(this.currentLevel);
                } else {
                    this.showCompletion();
                }
            }, 1500);
        } else {
            // Wrong answer
            this.showFeedback('Tekrar dene! 🤔', 0xFF6347);
            if (window.playSound) window.playSound('click');
        }

        // Update progress
        if (window.updateExperimentProgress) {
            window.updateExperimentProgress(
                this.currentLevel,
                `Seviye ${this.currentLevel} - ${this.score} puan`
            );
        }
    }

    showFeedback(message, color) {
        const feedback = new PIXI.Container();

        const bg = new PIXI.Graphics();
        bg.beginFill(color, 0.9);
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

        // Fade in and out
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
        // Clear stage
        this.patternContainer.removeChildren();
        this.optionsContainer.removeChildren();

        // Completion message
        const completion = new PIXI.Container();

        const bg = new PIXI.Graphics();
        bg.beginFill(0x10B981, 0.9);
        bg.drawRoundedRect(0, 0, 600, 300, 20);
        bg.endFill();
        completion.addChild(bg);

        const emoji = new PIXI.Text('🏆', {
            fontSize: 80,
            align: 'center'
        });
        emoji.x = 300 - emoji.width / 2;
        emoji.y = 50;
        completion.addChild(emoji);

        const title = new PIXI.Text('Tebrikler!', {
            fontFamily: 'Arial',
            fontSize: 36,
            fill: '#FFFFFF',
            fontWeight: 'bold',
            align: 'center'
        });
        title.x = 300 - title.width / 2;
        title.y = 150;
        completion.addChild(title);

        const scoreText = new PIXI.Text(`Toplam Puan: ${this.score}`, {
            fontFamily: 'Arial',
            fontSize: 24,
            fill: '#FFFFFF',
            align: 'center'
        });
        scoreText.x = 300 - scoreText.width / 2;
        scoreText.y = 200;
        completion.addChild(scoreText);

        completion.x = 100;
        completion.y = 150;
        this.app.stage.addChild(completion);

        if (window.updateExperimentProgress) {
            window.updateExperimentProgress(3, 'Tüm bulmacalar tamamlandı!');
        }
    }
}
