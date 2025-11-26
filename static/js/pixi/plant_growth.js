// Plant Growth Cycle - Pixi.js Script
// Bitki Büyütme Döngüsü Simülasyonu

class PlantGrowth {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.container.innerHTML = '';

        this.app = new PIXI.Application({
            width: 800,
            height: 600,
            backgroundColor: 0x87CEEB, // Sky blue
            resolution: window.devicePixelRatio || 1,
            antialias: true
        });
        this.container.appendChild(this.app.view);

        // Growth stages: 0=seed, 1=sprout, 2=young, 3=mature, 4=flower
        this.stage = 0;
        this.waterLevel = 0;
        this.sunLevel = 0;
        this.timeElapsed = 0;
        this.autoGrow = false;

        this.setup();
        this.startAnimation();
    }

    setup() {
        // Ground
        this.ground = new PIXI.Graphics();
        this.ground.beginFill(0x8B4513); // Brown
        this.ground.drawRect(0, 450, 800, 150);
        this.ground.endFill();
        this.app.stage.addChild(this.ground);

        // Grass on ground
        this.grass = new PIXI.Graphics();
        this.grass.beginFill(0x228B22); // Forest green
        this.grass.drawRect(0, 450, 800, 20);
        this.grass.endFill();
        this.app.stage.addChild(this.grass);

        // Plant container
        this.plantContainer = new PIXI.Container();
        this.plantContainer.x = 400;
        this.plantContainer.y = 450;
        this.app.stage.addChild(this.plantContainer);

        // Sun
        this.createSun();

        // Clouds (decorative)
        this.createClouds();

        // Control buttons
        this.createControls();

        // Info panel
        this.createInfoPanel();

        // Instructions
        this.createInstructions();

        // Draw initial seed
        this.drawPlant();
    }

    createSun() {
        this.sun = new PIXI.Graphics();
        this.sun.beginFill(0xFFD700); // Gold
        this.sun.drawCircle(0, 0, 50);
        this.sun.endFill();
        this.sun.x = 700;
        this.sun.y = 80;
        this.sun.alpha = 0.7;
        this.app.stage.addChild(this.sun);

        // Sun rays
        for (let i = 0; i < 12; i++) {
            const ray = new PIXI.Graphics();
            ray.beginFill(0xFFD700);
            ray.drawRect(-3, -60, 6, 20);
            ray.endFill();
            ray.rotation = (Math.PI * 2 * i) / 12;
            this.sun.addChild(ray);
        }
    }

    createClouds() {
        const cloud1 = this.createCloud();
        cloud1.x = 150;
        cloud1.y = 100;
        this.app.stage.addChild(cloud1);

        const cloud2 = this.createCloud();
        cloud2.x = 550;
        cloud2.y = 150;
        cloud2.scale.set(0.8);
        this.app.stage.addChild(cloud2);
    }

    createCloud() {
        const cloud = new PIXI.Graphics();
        cloud.beginFill(0xFFFFFF, 0.8);
        cloud.drawCircle(0, 0, 30);
        cloud.drawCircle(25, 0, 35);
        cloud.drawCircle(50, 0, 30);
        cloud.drawCircle(25, -15, 25);
        cloud.endFill();
        return cloud;
    }

    createControls() {
        // Water button
        const waterBtn = this.createButton(0x4169E1, 100, 500, "💧 Su Ver", () => {
            this.addWater();
        });
        this.app.stage.addChild(waterBtn);

        // Sun button
        const sunBtn = this.createButton(0xFFD700, 100, 560, "☀️ Güneş Ver", () => {
            this.addSun();
        });
        this.app.stage.addChild(sunBtn);

        // Auto grow toggle
        const autoBtn = this.createButton(0x32CD32, 250, 500, "⏱️ Otomatik", () => {
            this.toggleAutoGrow();
        });
        this.app.stage.addChild(autoBtn);

        // Reset button
        const resetBtn = this.createButton(0xFF6347, 250, 560, "🔄 Yeniden Başla", () => {
            this.reset();
        });
        this.app.stage.addChild(resetBtn);
    }

    createButton(color, x, y, text, onClick) {
        const btn = new PIXI.Container();

        const bg = new PIXI.Graphics();
        bg.beginFill(color);
        bg.lineStyle(2, 0x000000, 0.3);
        bg.drawRoundedRect(0, 0, 130, 45, 10);
        bg.endFill();
        btn.addChild(bg);

        const label = new PIXI.Text(text, {
            fontFamily: 'Arial',
            fontSize: 16,
            fill: '#FFFFFF',
            fontWeight: 'bold'
        });
        label.x = 65 - label.width / 2;
        label.y = 22 - label.height / 2;
        btn.addChild(label);

        btn.x = x;
        btn.y = y;
        btn.interactive = true;
        btn.buttonMode = true;
        btn.cursor = 'pointer';

        btn.on('pointerdown', () => {
            bg.scale.set(0.95);
            onClick();
        });
        btn.on('pointerup', () => {
            bg.scale.set(1);
        });
        btn.on('pointerupoutside', () => {
            bg.scale.set(1);
        });

        return btn;
    }

    createInfoPanel() {
        this.infoPanel = new PIXI.Container();
        this.infoPanel.x = 450;
        this.infoPanel.y = 500;

        const bg = new PIXI.Graphics();
        bg.beginFill(0xFFFFFF, 0.9);
        bg.lineStyle(2, 0x666666);
        bg.drawRoundedRect(0, 0, 300, 100, 10);
        bg.endFill();
        this.infoPanel.addChild(bg);

        this.stageText = new PIXI.Text('Aşama: Tohum', {
            fontFamily: 'Arial',
            fontSize: 18,
            fill: '#333333',
            fontWeight: 'bold'
        });
        this.stageText.x = 10;
        this.stageText.y = 10;
        this.infoPanel.addChild(this.stageText);

        this.waterText = new PIXI.Text('💧 Su: 0/3', {
            fontFamily: 'Arial',
            fontSize: 16,
            fill: '#4169E1'
        });
        this.waterText.x = 10;
        this.waterText.y = 40;
        this.infoPanel.addChild(this.waterText);

        this.sunText = new PIXI.Text('☀️ Güneş: 0/3', {
            fontFamily: 'Arial',
            fontSize: 16,
            fill: '#FFD700'
        });
        this.sunText.x = 10;
        this.sunText.y = 65;
        this.infoPanel.addChild(this.sunText);

        this.app.stage.addChild(this.infoPanel);
    }

    createInstructions() {
        const style = new PIXI.TextStyle({
            fontFamily: 'Arial',
            fontSize: 20,
            fill: '#FFFFFF',
            fontWeight: 'bold',
            dropShadow: true,
            dropShadowDistance: 2,
            align: 'center'
        });
        const text = new PIXI.Text("Bitkini büyüt! Su ve güneş vererek bitki döngüsünü izle 🌱", style);
        text.x = 400 - text.width / 2;
        text.y = 20;
        this.app.stage.addChild(text);
    }

    drawPlant() {
        // Clear previous plant
        this.plantContainer.removeChildren();

        const stageNames = ['Tohum 🌰', 'Filiz 🌱', 'Genç Bitki 🌿', 'Olgun Bitki 🪴', 'Çiçek Açtı 🌸'];
        this.stageText.text = `Aşama: ${stageNames[this.stage]}`;

        switch (this.stage) {
            case 0:
                this.drawSeed();
                break;
            case 1:
                this.drawSprout();
                break;
            case 2:
                this.drawYoungPlant();
                break;
            case 3:
                this.drawMaturePlant();
                break;
            case 4:
                this.drawFloweringPlant();
                break;
        }
    }

    drawSeed() {
        const seed = new PIXI.Graphics();
        seed.beginFill(0x8B4513); // Brown
        seed.drawEllipse(0, -10, 10, 15);
        seed.endFill();
        this.plantContainer.addChild(seed);
    }

    drawSprout() {
        // Small sprout emerging
        const stem = new PIXI.Graphics();
        stem.lineStyle(3, 0x228B22); // Green
        stem.moveTo(0, 0);
        stem.lineTo(0, -30);
        this.plantContainer.addChild(stem);

        const leaf1 = new PIXI.Graphics();
        leaf1.beginFill(0x90EE90); // Light green
        leaf1.drawEllipse(-10, -25, 8, 12);
        leaf1.endFill();
        this.plantContainer.addChild(leaf1);

        const leaf2 = new PIXI.Graphics();
        leaf2.beginFill(0x90EE90);
        leaf2.drawEllipse(10, -20, 8, 12);
        leaf2.endFill();
        this.plantContainer.addChild(leaf2);
    }

    drawYoungPlant() {
        // Taller stem with more leaves
        const stem = new PIXI.Graphics();
        stem.lineStyle(5, 0x228B22);
        stem.moveTo(0, 0);
        stem.lineTo(0, -80);
        this.plantContainer.addChild(stem);

        // Multiple leaves
        for (let i = 0; i < 4; i++) {
            const leaf = new PIXI.Graphics();
            leaf.beginFill(0x32CD32); // Lime green
            const side = i % 2 === 0 ? -1 : 1;
            leaf.drawEllipse(side * 15, -20 - i * 15, 12, 18);
            leaf.endFill();
            this.plantContainer.addChild(leaf);
        }
    }

    drawMaturePlant() {
        // Tall stem with many leaves
        const stem = new PIXI.Graphics();
        stem.lineStyle(7, 0x228B22);
        stem.moveTo(0, 0);
        stem.lineTo(0, -120);
        this.plantContainer.addChild(stem);

        // More and bigger leaves
        for (let i = 0; i < 6; i++) {
            const leaf = new PIXI.Graphics();
            leaf.beginFill(0x228B22); // Forest green
            const side = i % 2 === 0 ? -1 : 1;
            leaf.drawEllipse(side * 20, -20 - i * 18, 15, 22);
            leaf.endFill();
            this.plantContainer.addChild(leaf);
        }

        // Bud forming
        const bud = new PIXI.Graphics();
        bud.beginFill(0xFFB6C1); // Light pink
        bud.drawCircle(0, -120, 8);
        bud.endFill();
        this.plantContainer.addChild(bud);
    }

    drawFloweringPlant() {
        // Full grown with flower
        const stem = new PIXI.Graphics();
        stem.lineStyle(8, 0x228B22);
        stem.moveTo(0, 0);
        stem.lineTo(0, -150);
        this.plantContainer.addChild(stem);

        // Leaves
        for (let i = 0; i < 6; i++) {
            const leaf = new PIXI.Graphics();
            leaf.beginFill(0x228B22);
            const side = i % 2 === 0 ? -1 : 1;
            leaf.drawEllipse(side * 20, -30 - i * 20, 15, 22);
            leaf.endFill();
            this.plantContainer.addChild(leaf);
        }

        // Beautiful flower
        const flower = new PIXI.Container();
        flower.y = -150;

        // Petals
        const petalColors = [0xFF69B4, 0xFF1493, 0xFFB6C1, 0xFF69B4, 0xFF1493];
        for (let i = 0; i < 5; i++) {
            const petal = new PIXI.Graphics();
            petal.beginFill(petalColors[i]);
            petal.drawEllipse(0, -20, 12, 20);
            petal.endFill();
            petal.rotation = (Math.PI * 2 * i) / 5;
            flower.addChild(petal);
        }

        // Center
        const center = new PIXI.Graphics();
        center.beginFill(0xFFD700); // Gold
        center.drawCircle(0, 0, 8);
        center.endFill();
        flower.addChild(center);

        this.plantContainer.addChild(flower);
    }

    addWater() {
        if (this.waterLevel < 3) {
            this.waterLevel++;
            this.waterText.text = `💧 Su: ${this.waterLevel}/3`;
            this.checkGrowth();
            this.playWaterEffect();
            if (window.playSound) window.playSound('click');
        }
    }

    addSun() {
        if (this.sunLevel < 3) {
            this.sunLevel++;
            this.sunText.text = `☀️ Güneş: ${this.sunLevel}/3`;
            this.checkGrowth();
            this.playSunEffect();
            if (window.playSound) window.playSound('click');
        }
    }

    checkGrowth() {
        // Check if ready to grow to next stage
        const requiredWater = this.stage + 1;
        const requiredSun = this.stage + 1;

        if (this.waterLevel >= requiredWater && this.sunLevel >= requiredSun && this.stage < 4) {
            this.grow();
        }

        // Update global progress
        if (window.updateExperimentProgress) {
            let message = '';
            if (this.stage === 0) message = 'Tohumu ektin!';
            else if (this.stage === 1) message = 'Filiz çıktı! 🌱';
            else if (this.stage === 2) message = 'Bitki büyüyor! 🌿';
            else if (this.stage === 3) message = 'Neredeyse çiçek açacak! 🪴';
            else if (this.stage === 4) message = 'Muhteşem! Çiçek açtı! 🌸';

            window.updateExperimentProgress(this.stage, message);
        }
    }

    grow() {
        if (this.stage < 4) {
            this.stage++;
            this.waterLevel = 0;
            this.sunLevel = 0;
            this.waterText.text = `💧 Su: 0/3`;
            this.sunText.text = `☀️ Güneş: 0/3`;
            this.drawPlant();
            this.animateGrowth();
            if (window.playSound) window.playSound('success');
        }
    }

    animateGrowth() {
        // Simple scale animation
        this.plantContainer.scale.set(0.8);
        const scaleUp = () => {
            this.plantContainer.scale.x += 0.01;
            this.plantContainer.scale.y += 0.01;
            if (this.plantContainer.scale.x < 1) {
                requestAnimationFrame(scaleUp);
            } else {
                this.plantContainer.scale.set(1);
            }
        };
        requestAnimationFrame(scaleUp);
    }

    playWaterEffect() {
        // Water droplets animation
        for (let i = 0; i < 5; i++) {
            setTimeout(() => {
                const droplet = new PIXI.Graphics();
                droplet.beginFill(0x4169E1, 0.6);
                droplet.drawCircle(0, 0, 4);
                droplet.endFill();
                droplet.x = this.plantContainer.x + (Math.random() - 0.5) * 40;
                droplet.y = 350;
                this.app.stage.addChild(droplet);

                const fall = () => {
                    droplet.y += 5;
                    droplet.alpha -= 0.02;
                    if (droplet.y < 450 && droplet.alpha > 0) {
                        requestAnimationFrame(fall);
                    } else {
                        this.app.stage.removeChild(droplet);
                    }
                };
                requestAnimationFrame(fall);
            }, i * 100);
        }
    }

    playSunEffect() {
        // Sun rays animation
        const originalAlpha = this.sun.alpha;
        this.sun.alpha = 1;
        setTimeout(() => {
            this.sun.alpha = originalAlpha;
        }, 300);
    }

    toggleAutoGrow() {
        this.autoGrow = !this.autoGrow;
        if (this.autoGrow && window.playSound) {
            window.playSound('click');
        }
    }

    reset() {
        this.stage = 0;
        this.waterLevel = 0;
        this.sunLevel = 0;
        this.autoGrow = false;
        this.waterText.text = `💧 Su: 0/3`;
        this.sunText.text = `☀️ Güneş: 0/3`;
        this.drawPlant();
        if (window.updateExperimentProgress) {
            window.updateExperimentProgress(0, 'Yeniden başlıyoruz!');
        }
    }

    startAnimation() {
        this.app.ticker.add(() => {
            this.timeElapsed++;

            // Auto grow mode
            if (this.autoGrow && this.timeElapsed % 120 === 0) {
                if (this.waterLevel < 3 && Math.random() > 0.5) {
                    this.addWater();
                } else if (this.sunLevel < 3) {
                    this.addSun();
                }
            }

            // Sun rotation
            if (this.sun) {
                this.sun.rotation += 0.001;
            }
        });
    }
}
