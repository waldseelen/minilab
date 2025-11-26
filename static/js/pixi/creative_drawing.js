// Creative Drawing - Simple Block-Based Drawing Tool
// Yaratıcı Çizim - Basit Blok Tabanlı Çizim Aracı

class CreativeDrawing {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.container.innerHTML = '';

        this.app = new PIXI.Application({
            width: 800,
            height: 600,
            backgroundColor: 0xFFFFFF,
            resolution: window.devicePixelRatio || 1,
            antialias: true
        });
        this.container.appendChild(this.app.view);

        // Drawing state
        this.currentColor = 0x0088e6;
        this.currentShape = 'circle';
        this.drawingObjects = [];
        this.canvasArea = null;

        this.setup();
    }

    setup() {
        // Title
        this.createTitle();

        // Canvas area
        this.createCanvas();

        // Color palette
        this.createColorPalette();

        // Shape tools
        this.createShapeTools();

        // Action buttons
        this.createActionButtons();

        // Instructions
        this.createInstructions();
    }

    createTitle() {
        const style = new PIXI.TextStyle({
            fontFamily: 'Arial',
            fontSize: 28,
            fill: '#0088e6',
            fontWeight: 'bold'
        });
        const title = new PIXI.Text('🎨 Yaratıcı Çizim', style);
        title.x = 400 - title.width / 2;
        title.y = 15;
        this.app.stage.addChild(title);
    }

    createCanvas() {
        // Canvas background
        const canvas = new PIXI.Graphics();
        canvas.beginFill(0xF5F5F5);
        canvas.lineStyle(3, 0xCCCCCC);
        canvas.drawRoundedRect(0, 0, 600, 400, 10);
        canvas.endFill();
        canvas.x = 100;
        canvas.y = 100;
        canvas.interactive = true;
        canvas.buttonMode = true;

        // Click to draw
        canvas.on('pointerdown', (event) => {
            const localPos = event.data.getLocalPosition(canvas);
            this.addShape(localPos.x, localPos.y);
        });

        this.canvasArea = canvas;
        this.app.stage.addChild(canvas);

        // Canvas container for drawn objects
        this.drawingContainer = new PIXI.Container();
        this.drawingContainer.x = 100;
        this.drawingContainer.y = 100;
        this.app.stage.addChild(this.drawingContainer);
    }

    createColorPalette() {
        const colors = [
            { name: 'Mavi', value: 0x0088e6 },
            { name: 'Kırmızı', value: 0xFF0000 },
            { name: 'Yeşil', value: 0x10B981 },
            { name: 'Sarı', value: 0xFFD700 },
            { name: 'Mor', value: 0x8B5CF6 },
            { name: 'Turuncu', value: 0xFFA500 },
            { name: 'Pembe', value: 0xEC4899 }
        ];

        const paletteContainer = new PIXI.Container();
        paletteContainer.x = 20;
        paletteContainer.y = 100;

        const label = new PIXI.Text('Renkler:', {
            fontFamily: 'Arial',
            fontSize: 14,
            fill: '#666666',
            fontWeight: 'bold'
        });
        paletteContainer.addChild(label);

        colors.forEach((color, index) => {
            const colorBtn = new PIXI.Graphics();
            colorBtn.beginFill(color.value);
            colorBtn.lineStyle(2, 0x000000, 0.3);
            colorBtn.drawCircle(0, 0, 15);
            colorBtn.endFill();
            colorBtn.x = 0;
            colorBtn.y = 35 + index * 40;
            colorBtn.interactive = true;
            colorBtn.buttonMode = true;
            colorBtn.cursor = 'pointer';

            colorBtn.on('pointerdown', () => {
                this.currentColor = color.value;
                this.updateSelection();
                if (window.playSound) window.playSound('click');
            });

            // Selection ring
            const ring = new PIXI.Graphics();
            ring.lineStyle(3, 0x000000);
            ring.drawCircle(0, 0, 20);
            ring.x = 0;
            ring.y = 35 + index * 40;
            ring.visible = index === 0; // First color selected by default
            colorBtn.selectionRing = ring;
            paletteContainer.addChild(ring);

            paletteContainer.addChild(colorBtn);
        });

        this.colorPalette = paletteContainer.children.filter(child => child.selectionRing);
        this.app.stage.addChild(paletteContainer);
    }

    createShapeTools() {
        const shapes = [
            { name: 'Daire', value: 'circle', emoji: '⭕' },
            { name: 'Kare', value: 'square', emoji: '⬛' },
            { name: 'Yıldız', value: 'star', emoji: '⭐' },
            { name: 'Kalp', value: 'heart', emoji: '❤️' }
        ];

        const toolsContainer = new PIXI.Container();
        toolsContainer.x = 720;
        toolsContainer.y = 100;

        const label = new PIXI.Text('Şekiller:', {
            fontFamily: 'Arial',
            fontSize: 14,
            fill: '#666666',
            fontWeight: 'bold'
        });
        toolsContainer.addChild(label);

        shapes.forEach((shape, index) => {
            const btn = new PIXI.Graphics();
            btn.beginFill(0xF0F0F0);
            btn.lineStyle(2, 0xCCCCCC);
            btn.drawRoundedRect(0, 0, 60, 60, 10);
            btn.endFill();
            btn.x = 0;
            btn.y = 35 + index * 75;
            btn.interactive = true;
            btn.buttonMode = true;
            btn.cursor = 'pointer';

            const emoji = new PIXI.Text(shape.emoji, { fontSize: 30 });
            emoji.x = 30 - emoji.width / 2;
            emoji.y = 30 - emoji.height / 2;
            btn.addChild(emoji);

            btn.on('pointerdown', () => {
                this.currentShape = shape.value;
                this.updateShapeSelection();
                if (window.playSound) window.playSound('click');
            });

            // Selection indicator
            btn.isSelected = index === 0;
            btn.on('pointerover', () => {
                if (!btn.isSelected) {
                    btn.clear();
                    btn.beginFill(0xE0E0E0);
                    btn.lineStyle(2, 0xCCCCCC);
                    btn.drawRoundedRect(0, 0, 60, 60, 10);
                    btn.endFill();
                    btn.addChild(emoji);
                }
            });
            btn.on('pointerout', () => {
                if (!btn.isSelected) {
                    btn.clear();
                    btn.beginFill(0xF0F0F0);
                    btn.lineStyle(2, 0xCCCCCC);
                    btn.drawRoundedRect(0, 0, 60, 60, 10);
                    btn.endFill();
                    btn.addChild(emoji);
                }
            });

            btn.shapeValue = shape.value;
            toolsContainer.addChild(btn);
        });

        this.shapeTools = toolsContainer.children.filter(child => child.shapeValue);
        this.updateShapeSelection();
        this.app.stage.addChild(toolsContainer);
    }

    updateSelection() {
        this.colorPalette.forEach(colorBtn => {
            if (colorBtn.selectionRing) {
                colorBtn.selectionRing.visible = false;
            }
        });
    }

    updateShapeSelection() {
        this.shapeTools.forEach(btn => {
            btn.isSelected = btn.shapeValue === this.currentShape;
            btn.clear();
            btn.beginFill(btn.isSelected ? 0xD0E0FF : 0xF0F0F0);
            btn.lineStyle(2, btn.isSelected ? 0x0088e6 : 0xCCCCCC);
            btn.drawRoundedRect(0, 0, 60, 60, 10);
            btn.endFill();
            // Re-add emoji
            const emoji = btn.children[btn.children.length - 1];
            if (emoji) btn.addChild(emoji);
        });
    }

    createActionButtons() {
        // Clear button
        const clearBtn = this.createButton(100, 520, '🗑️ Temizle', 0xFF6347, () => {
            this.clearCanvas();
        });
        this.app.stage.addChild(clearBtn);

        // Save/Complete button
        const saveBtn = this.createButton(250, 520, '✅ Tamamla', 0x10B981, () => {
            this.completeDrawing();
        });
        this.app.stage.addChild(saveBtn);
    }

    createButton(x, y, text, color, onClick) {
        const btn = new PIXI.Container();
        btn.x = x;
        btn.y = y;
        btn.interactive = true;
        btn.buttonMode = true;
        btn.cursor = 'pointer';

        const bg = new PIXI.Graphics();
        bg.beginFill(color);
        bg.drawRoundedRect(0, 0, 130, 50, 10);
        bg.endFill();
        btn.addChild(bg);

        const label = new PIXI.Text(text, {
            fontFamily: 'Arial',
            fontSize: 16,
            fill: '#FFFFFF',
            fontWeight: 'bold'
        });
        label.x = 65 - label.width / 2;
        label.y = 25 - label.height / 2;
        btn.addChild(label);

        btn.on('pointerdown', () => {
            bg.scale.set(0.95);
            onClick();
        });
        btn.on('pointerup', () => bg.scale.set(1));
        btn.on('pointerupoutside', () => bg.scale.set(1));

        return btn;
    }

    createInstructions() {
        const text = new PIXI.Text('Tuvale tıklayarak çiz! Renk ve şekil seç.', {
            fontFamily: 'Arial',
            fontSize: 14,
            fill: '#666666',
            align: 'center'
        });
        text.x = 400 - text.width / 2;
        text.y = 70;
        this.app.stage.addChild(text);
    }

    addShape(x, y) {
        const shape = new PIXI.Graphics();

        if (this.currentShape === 'circle') {
            shape.beginFill(this.currentColor);
            shape.drawCircle(0, 0, 25);
            shape.endFill();
        } else if (this.currentShape === 'square') {
            shape.beginFill(this.currentColor);
            shape.drawRect(-25, -25, 50, 50);
            shape.endFill();
        } else if (this.currentShape === 'star') {
            shape.beginFill(this.currentColor);
            this.drawStar(shape, 0, 0, 5, 25, 12);
            shape.endFill();
        } else if (this.currentShape === 'heart') {
            shape.beginFill(this.currentColor);
            this.drawHeart(shape, 0, 0, 25);
            shape.endFill();
        }

        shape.x = x;
        shape.y = y;
        this.drawingContainer.addChild(shape);
        this.drawingObjects.push(shape);

        // Play sound
        if (window.playSound) window.playSound('click');

        // Update progress
        if (window.updateExperimentProgress) {
            const progress = Math.min(this.drawingObjects.length, 10);
            window.updateExperimentProgress(
                progress,
                `${this.drawingObjects.length} şekil çizildi!`
            );
        }
    }

    drawStar(graphics, cx, cy, spikes, outerRadius, innerRadius) {
        let rot = Math.PI / 2 * 3;
        let x = cx;
        let y = cy;
        const step = Math.PI / spikes;

        graphics.moveTo(cx, cy - outerRadius);

        for (let i = 0; i < spikes; i++) {
            x = cx + Math.cos(rot) * outerRadius;
            y = cy + Math.sin(rot) * outerRadius;
            graphics.lineTo(x, y);
            rot += step;

            x = cx + Math.cos(rot) * innerRadius;
            y = cy + Math.sin(rot) * innerRadius;
            graphics.lineTo(x, y);
            rot += step;
        }

        graphics.lineTo(cx, cy - outerRadius);
    }

    drawHeart(graphics, x, y, size) {
        const width = size;
        const height = size;

        graphics.moveTo(x, y + height / 4);
        graphics.bezierCurveTo(x, y, x - width / 2, y - height / 2, x - width / 2, y + height / 4);
        graphics.bezierCurveTo(x - width / 2, y + height / 2, x, y + height, x, y + height);
        graphics.bezierCurveTo(x, y + height, x + width / 2, y + height / 2, x + width / 2, y + height / 4);
        graphics.bezierCurveTo(x + width / 2, y - height / 2, x, y, x, y + height / 4);
    }

    clearCanvas() {
        this.drawingContainer.removeChildren();
        this.drawingObjects = [];
        if (window.playSound) window.playSound('click');

        if (window.updateExperimentProgress) {
            window.updateExperimentProgress(0, 'Tuval temizlendi!');
        }
    }

    completeDrawing() {
        if (this.drawingObjects.length < 5) {
            this.showMessage('En az 5 şekil çiz! 🎨', 0xFFA500);
            return;
        }

        this.showMessage('Harika sanat eseri! 🎉', 0x10B981);
        if (window.playSound) window.playSound('success');

        if (window.updateExperimentProgress) {
            window.updateExperimentProgress(10, 'Çizim tamamlandı!');
        }
    }

    showMessage(text, color) {
        const message = new PIXI.Container();

        const bg = new PIXI.Graphics();
        bg.beginFill(color, 0.9);
        bg.drawRoundedRect(0, 0, 300, 80, 15);
        bg.endFill();
        message.addChild(bg);

        const label = new PIXI.Text(text, {
            fontFamily: 'Arial',
            fontSize: 20,
            fill: '#FFFFFF',
            fontWeight: 'bold',
            align: 'center',
            wordWrap: true,
            wordWrapWidth: 280
        });
        label.x = 150 - label.width / 2;
        label.y = 40 - label.height / 2;
        message.addChild(label);

        message.x = 250;
        message.y = 250;
        message.alpha = 0;
        this.app.stage.addChild(message);

        // Animate
        const fadeIn = () => {
            message.alpha += 0.05;
            if (message.alpha < 1) {
                requestAnimationFrame(fadeIn);
            } else {
                setTimeout(() => {
                    const fadeOut = () => {
                        message.alpha -= 0.05;
                        if (message.alpha > 0) {
                            requestAnimationFrame(fadeOut);
                        } else {
                            this.app.stage.removeChild(message);
                        }
                    };
                    fadeOut();
                }, 1500);
            }
        };
        fadeIn();
    }
}
