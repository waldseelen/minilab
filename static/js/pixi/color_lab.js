// Color Laboratory - Pixi.js Script

class ColorLab {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        // Clear container
        this.container.innerHTML = '';

        this.app = new PIXI.Application({
            width: 800,
            height: 600,
            backgroundColor: 0xFFFFFF,
            resolution: window.devicePixelRatio || 1,
            antialias: true
        });
        this.container.appendChild(this.app.view);

        this.mixedColor = 0xFFFFFF; // Start with white (empty)
        this.currentColors = []; // List of colors added

        this.setup();
    }

    setup() {
        // Create Beaker
        this.beaker = new PIXI.Graphics();
        this.beaker.lineStyle(4, 0x000000);
        this.beaker.beginFill(0xFFFFFF);
        this.beaker.drawRect(0, 0, 200, 300);
        this.beaker.endFill();
        this.beaker.x = 300;
        this.beaker.y = 150;
        this.app.stage.addChild(this.beaker);

        // Beaker Liquid (initially invisible/white)
        this.liquid = new PIXI.Graphics();
        this.liquid.beginFill(0xFFFFFF);
        this.liquid.drawRect(0, 0, 190, 290);
        this.liquid.endFill();
        this.liquid.x = 305;
        this.liquid.y = 155;
        this.app.stage.addChild(this.liquid);

        // Create Color Bottles/Sources
        this.createColorSource(0xFF0000, 150, 500, "Kırmızı");
        this.createColorSource(0x0000FF, 400, 500, "Mavi");
        this.createColorSource(0xFFFF00, 650, 500, "Sarı");

        // Reset Button
        this.createResetButton();

        // Instructions
        const style = new PIXI.TextStyle({
            fontFamily: 'Arial',
            fontSize: 24,
            fill: '#333333',
            align: 'center'
        });
        const text = new PIXI.Text("Renkleri kaba sürükle ve karıştır!", style);
        text.x = 400 - text.width / 2;
        text.y = 50;
        this.app.stage.addChild(text);
    }

    createColorSource(color, x, y, name) {
        const circle = new PIXI.Graphics();
        circle.beginFill(color);
        circle.lineStyle(2, 0x000000, 0.5);
        circle.drawCircle(0, 0, 40);
        circle.endFill();
        circle.x = x;
        circle.y = y;
        circle.interactive = true;
        circle.buttonMode = true;
        circle.cursor = 'pointer';

        // Drag events
        circle
            .on('pointerdown', this.onDragStart.bind(this))
            .on('pointerup', this.onDragEnd.bind(this))
            .on('pointerupoutside', this.onDragEnd.bind(this))
            .on('pointermove', this.onDragMove.bind(this));

        circle.originalX = x;
        circle.originalY = y;
        circle.colorValue = color;
        circle.name = name;

        this.app.stage.addChild(circle);

        // Label
        const style = new PIXI.TextStyle({
            fontFamily: 'Arial',
            fontSize: 16,
            fill: '#000000',
            fontWeight: 'bold'
        });
        const text = new PIXI.Text(name, style);
        text.x = x - text.width / 2;
        text.y = y + 50;
        this.app.stage.addChild(text);
    }

    onDragStart(event) {
        const obj = event.currentTarget;
        obj.data = event.data;
        obj.alpha = 0.5;
        obj.dragging = true;
    }

    onDragEnd(event) {
        const obj = event.currentTarget;
        obj.alpha = 1;
        obj.dragging = false;
        obj.data = null;

        // Check if dropped in beaker
        if (this.isOverBeaker(obj)) {
            this.addColor(obj.colorValue);
            // Play sound if available
            if (window.playSound) window.playSound('click');
        }

        // Return to original position
        obj.x = obj.originalX;
        obj.y = obj.originalY;
    }

    onDragMove(event) {
        const obj = event.currentTarget;
        if (obj.dragging) {
            const newPosition = obj.data.getLocalPosition(obj.parent);
            obj.x = newPosition.x;
            obj.y = newPosition.y;
        }
    }

    isOverBeaker(obj) {
        const bounds = this.beaker.getBounds();
        return (
            obj.x > bounds.x &&
            obj.x < bounds.x + bounds.width &&
            obj.y > bounds.y &&
            obj.y < bounds.y + bounds.height
        );
    }

    addColor(color) {
        this.currentColors.push(color);
        this.mixColors();
    }

    mixColors() {
        if (this.currentColors.length === 0) {
            this.updateLiquid(0xFFFFFF);
            return;
        }

        const uniqueColors = [...new Set(this.currentColors)];
        const hasRed = uniqueColors.includes(0xFF0000);
        const hasBlue = uniqueColors.includes(0x0000FF);
        const hasYellow = uniqueColors.includes(0xFFFF00);

        let finalColor = 0xFFFFFF;
        let colorName = "";

        if (hasRed && hasBlue && hasYellow) {
            finalColor = 0x8B4513; // Brown
            colorName = "Kahverengi";
        } else if (hasRed && hasBlue) {
            finalColor = 0x800080; // Purple
            colorName = "Mor";
        } else if (hasRed && hasYellow) {
            finalColor = 0xFFA500; // Orange
            colorName = "Turuncu";
        } else if (hasBlue && hasYellow) {
            finalColor = 0x008000; // Green
            colorName = "Yeşil";
        } else if (hasRed) {
            finalColor = 0xFF0000;
            colorName = "Kırmızı";
        } else if (hasBlue) {
            finalColor = 0x0000FF;
            colorName = "Mavi";
        } else if (hasYellow) {
            finalColor = 0xFFFF00;
            colorName = "Sarı";
        }

        this.updateLiquid(finalColor);

        // Update progress in the main page
        if (window.updateExperimentProgress) {
            // 1 color = step 1, 2 mixed = step 2, 3 mixed = step 3
            let step = 1;
            if (uniqueColors.length >= 2) step = 2;
            if (uniqueColors.length >= 3) step = 3;

            window.updateExperimentProgress(step, colorName);
        }
    }

    updateLiquid(color) {
        this.liquid.clear();
        this.liquid.beginFill(color);
        this.liquid.drawRect(0, 0, 190, 290);
        this.liquid.endFill();
    }

    createResetButton() {
        const btn = new PIXI.Graphics();
        btn.beginFill(0xEEEEEE);
        btn.lineStyle(1, 0x999999);
        btn.drawRoundedRect(0, 0, 100, 40, 10);
        btn.endFill();
        btn.x = 650;
        btn.y = 100;
        btn.interactive = true;
        btn.buttonMode = true;
        btn.cursor = 'pointer';

        const text = new PIXI.Text("Temizle", { fontSize: 16, fontFamily: 'Arial' });
        text.x = 50 - text.width / 2;
        text.y = 20 - text.height / 2;
        btn.addChild(text);

        btn.on('pointerdown', () => {
            this.currentColors = [];
            this.mixColors();
            if (window.updateExperimentProgress) {
                window.updateExperimentProgress(0, "");
            }
        });

        this.app.stage.addChild(btn);
    }
}
