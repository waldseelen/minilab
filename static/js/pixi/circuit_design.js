/**
 * Devre Tasarımı - Pixi.js Simülasyonu
 * Basit elektrik devresi elemanlarını sürükleyerek devre oluşturma.
 */

class CircuitDesign {
    constructor(canvasId, options = {}) {
        this.canvasElement = document.getElementById(canvasId);
        if (!this.canvasElement) {
            console.error(`Canvas element '${canvasId}' bulunamadı!`);
            return;
        }

        // Pixi.js uygulaması oluştur
        this.app = new PIXI.Application({
            width: options.width || 800,
            height: options.height || 600,
            backgroundColor: 0x1A1A2E,
            antialias: true
        });

        this.canvasElement.appendChild(this.app.view);

        // Durum değişkenleri
        this.components = [];
        this.connections = [];
        this.circuitComplete = false;
        this.draggedComponent = null;

        this.init();
    }

    init() {
        this.createBackground();
        this.createComponentPanel();
        this.createCircuitBoard();
        this.createInstructions();
        this.createResetButton();
        this.createSuccessMessage();
    }

    createBackground() {
        // Arka plan
        const bg = new PIXI.Graphics();
        bg.beginFill(0x0F0F23);
        bg.drawRect(0, 0, this.app.screen.width, this.app.screen.height);
        bg.endFill();
        this.app.stage.addChild(bg);

        // Grid çizgileri
        const grid = new PIXI.Graphics();
        grid.lineStyle(1, 0x2A2A4E, 0.3);
        for (let x = 0; x < this.app.screen.width; x += 40) {
            grid.moveTo(x, 0);
            grid.lineTo(x, this.app.screen.height);
        }
        for (let y = 0; y < this.app.screen.height; y += 40) {
            grid.moveTo(0, y);
            grid.lineTo(this.app.screen.width, y);
        }
        this.app.stage.addChild(grid);
    }

    createComponentPanel() {
        // Elemanlar paneli
        const panelBg = new PIXI.Graphics();
        panelBg.beginFill(0x16213E);
        panelBg.drawRoundedRect(10, 10, 180, this.app.screen.height - 20, 10);
        panelBg.endFill();
        this.app.stage.addChild(panelBg);

        // Başlık
        const title = new PIXI.Text('⚡ Devre Elemanları', {
            fontFamily: 'Fredoka One, Arial',
            fontSize: 18,
            fill: 0xFFFFFF
        });
        title.x = 20;
        title.y = 20;
        this.app.stage.addChild(title);

        // Devre elemanları
        const components = [
            { name: 'Pil', emoji: '🔋', type: 'battery', color: 0x00FF00, y: 70 },
            { name: 'Lamba', emoji: '💡', type: 'bulb', color: 0xFFFF00, y: 150 },
            { name: 'Anahtar', emoji: '⚡', type: 'switch', color: 0xFF6B6B, y: 230 },
            { name: 'Tel', emoji: '➖', type: 'wire', color: 0x4ECDC4, y: 310 }
        ];

        components.forEach(comp => {
            this.createComponentButton(comp);
        });
    }

    createComponentButton(comp) {
        const container = new PIXI.Container();
        container.x = 20;
        container.y = comp.y;
        container.interactive = true;
        container.buttonMode = true;

        // Arka plan
        const bg = new PIXI.Graphics();
        bg.beginFill(comp.color, 0.2);
        bg.lineStyle(3, comp.color);
        bg.drawRoundedRect(0, 0, 150, 60, 10);
        bg.endFill();
        container.addChild(bg);

        // Emoji
        const emoji = new PIXI.Text(comp.emoji, {
            fontSize: 36
        });
        emoji.x = 15;
        emoji.y = 10;
        container.addChild(emoji);

        // İsim
        const name = new PIXI.Text(comp.name, {
            fontFamily: 'Arial',
            fontSize: 16,
            fill: 0xFFFFFF,
            fontWeight: 'bold'
        });
        name.x = 65;
        name.y = 20;
        container.addChild(name);

        // Tıklama ve sürükleme
        container
            .on('pointerdown', (e) => this.onComponentDragStart(e, comp))
            .on('pointerup', (e) => this.onComponentDragEnd(e))
            .on('pointerupoutside', (e) => this.onComponentDragEnd(e))
            .on('pointermove', (e) => this.onComponentDragMove(e));

        container.comp = comp;
        this.app.stage.addChild(container);
    }

    onComponentDragStart(event, comp) {
        // Eleman kopyası oluştur
        const copy = this.createComponent(comp, event.data.global.x, event.data.global.y);
        copy.alpha = 0.8;
        this.draggedComponent = copy;
        this.app.stage.addChild(copy);
    }

    onComponentDragMove(event) {
        if (this.draggedComponent) {
            this.draggedComponent.x = event.data.global.x;
            this.draggedComponent.y = event.data.global.y;
        }
    }

    onComponentDragEnd(event) {
        if (!this.draggedComponent) return;

        const x = event.data.global.x;
        const y = event.data.global.y;

        // Devre tahtasına bırakıldı mı kontrol et
        if (x > 220 && x < this.app.screen.width - 20 && y > 80 && y < this.app.screen.height - 20) {
            // Elemanı ekle
            this.draggedComponent.alpha = 1;
            this.draggedComponent.interactive = true;
            this.draggedComponent.buttonMode = true;

            // Bağlantı noktaları ekle
            this.addConnectionPoints(this.draggedComponent);

            this.components.push(this.draggedComponent);
            this.showMessage(`✅ ${this.draggedComponent.compData.name} eklendi!`);

            // Devre kontrolü
            this.checkCircuit();
        } else {
            // Geçersiz alan - sil
            this.app.stage.removeChild(this.draggedComponent);
        }

        this.draggedComponent = null;
    }

    createComponent(comp, x, y) {
        const container = new PIXI.Container();
        container.x = x;
        container.y = y;
        container.compData = comp;

        // Arka plan
        const bg = new PIXI.Graphics();
        bg.beginFill(comp.color, 0.3);
        bg.lineStyle(3, comp.color);
        bg.drawRoundedRect(-40, -30, 80, 60, 8);
        bg.endFill();
        container.addChild(bg);

        // Emoji
        const emoji = new PIXI.Text(comp.emoji, {
            fontSize: 32
        });
        emoji.anchor.set(0.5);
        container.addChild(emoji);

        container.bg = bg;
        return container;
    }

    addConnectionPoints(component) {
        // Sol ve sağ bağlantı noktaları
        const leftPoint = new PIXI.Graphics();
        leftPoint.beginFill(0xFFFFFF);
        leftPoint.drawCircle(-40, 0, 6);
        leftPoint.endFill();
        leftPoint.name = 'left';
        component.addChild(leftPoint);

        const rightPoint = new PIXI.Graphics();
        rightPoint.beginFill(0xFFFFFF);
        rightPoint.drawCircle(40, 0, 6);
        rightPoint.endFill();
        rightPoint.name = 'right';
        component.addChild(rightPoint);
    }

    createCircuitBoard() {
        // Devre tahtası
        const board = new PIXI.Graphics();
        board.lineStyle(3, 0x4ECDC4);
        board.beginFill(0x0F0F23, 0.5);
        board.drawRoundedRect(220, 80,
            this.app.screen.width - 240, this.app.screen.height - 100, 15);
        board.endFill();
        this.app.stage.addChild(board);

        // Başlık
        const label = new PIXI.Text('⚡ Devre Tahtası', {
            fontFamily: 'Fredoka One, Arial',
            fontSize: 20,
            fill: 0x4ECDC4
        });
        label.x = 240;
        label.y = 50;
        this.app.stage.addChild(label);
    }

    checkCircuit() {
        // Basit devre kontrolü: Pil + Lamba + Anahtar
        const hasBattery = this.components.some(c => c.compData.type === 'battery');
        const hasBulb = this.components.some(c => c.compData.type === 'bulb');
        const hasSwitch = this.components.some(c => c.compData.type === 'switch');

        // İlerleme güncelle
        let progress = 0;
        let message = 'Elemanları sürükle!';

        if (hasBattery) {
            progress = 1;
            message = '🔋 Pil eklendi!';
        }
        if (hasBattery && hasBulb) {
            progress = 2;
            message = '💡 Lamba eklendi!';
        }
        if (hasBattery && hasBulb && hasSwitch) {
            progress = 3;
            message = '⚡ Devre tamamlandı!';
        }

        if (window.updateExperimentProgress) {
            window.updateExperimentProgress(progress, message);
        }

        if (hasBattery && hasBulb && hasSwitch && !this.circuitComplete) {
            this.completeCircuit();
        }
    }

    completeCircuit() {
        this.circuitComplete = true;

        // Lamba animasyonu
        const bulbs = this.components.filter(c => c.compData.type === 'bulb');
        bulbs.forEach(bulb => {
            this.animateBulb(bulb);
        });

        // Başarı mesajı
        this.successMessage.text = '⚡ TEBRİKLER! Devre çalışıyor! 💡';
        this.successMessage.visible = true;

        // Elektrik efekti
        this.createElectricEffect();

        setTimeout(() => {
            this.successMessage.visible = false;
        }, 4000);
    }

    animateBulb(bulb) {
        let glowing = false;
        setInterval(() => {
            if (bulb.bg) {
                glowing = !glowing;
                bulb.bg.clear();
                bulb.bg.beginFill(0xFFFF00, glowing ? 0.8 : 0.3);
                bulb.bg.lineStyle(3, 0xFFFF00);
                bulb.bg.drawRoundedRect(-40, -30, 80, 60, 8);
                bulb.bg.endFill();

                // Parlama efekti
                if (glowing) {
                    const glow = new PIXI.Graphics();
                    glow.beginFill(0xFFFF00, 0.3);
                    glow.drawCircle(0, 0, 50);
                    glow.endFill();
                    bulb.addChild(glow);

                    setTimeout(() => {
                        bulb.removeChild(glow);
                    }, 300);
                }
            }
        }, 600);
    }

    createElectricEffect() {
        // Elektrik çizgileri
        for (let i = 0; i < 10; i++) {
            setTimeout(() => {
                const spark = new PIXI.Graphics();
                spark.lineStyle(2, 0x00FFFF);

                const startX = 250 + Math.random() * 300;
                const startY = 150 + Math.random() * 300;
                spark.moveTo(startX, startY);

                for (let j = 0; j < 5; j++) {
                    const x = startX + (Math.random() - 0.5) * 100;
                    const y = startY + (Math.random() - 0.5) * 100;
                    spark.lineTo(x, y);
                }

                spark.alpha = 0.8;
                this.app.stage.addChild(spark);

                setTimeout(() => {
                    this.app.stage.removeChild(spark);
                }, 200);
            }, i * 100);
        }
    }

    createInstructions() {
        const instructions = new PIXI.Text(
            '📋 Nasıl Oynanır:\n' +
            '1. Sol panelden elemanları sürükle\n' +
            '2. Devre tahtasına yerleştir\n' +
            '3. Pil + Lamba + Anahtar = Işık! 💡',
            {
                fontFamily: 'Arial',
                fontSize: 14,
                fill: 0xCCCCCC,
                align: 'left',
                lineHeight: 22
            }
        );
        instructions.x = 240;
        instructions.y = this.app.screen.height - 100;
        this.app.stage.addChild(instructions);
    }

    createResetButton() {
        const button = new PIXI.Container();
        button.x = this.app.screen.width - 150;
        button.y = 20;
        button.interactive = true;
        button.buttonMode = true;

        const bg = new PIXI.Graphics();
        bg.beginFill(0xFF6B6B);
        bg.drawRoundedRect(0, 0, 130, 45, 10);
        bg.endFill();
        button.addChild(bg);

        const text = new PIXI.Text('🔄 Yeniden Başlat', {
            fontFamily: 'Arial',
            fontSize: 14,
            fill: 0xFFFFFF,
            fontWeight: 'bold'
        });
        text.anchor.set(0.5);
        text.x = 65;
        text.y = 22;
        button.addChild(text);

        button.on('pointerdown', () => {
            this.resetCircuit();
        });

        this.app.stage.addChild(button);
    }

    resetCircuit() {
        // Tüm elemanları temizle
        this.components.forEach(comp => {
            this.app.stage.removeChild(comp);
        });
        this.components = [];
        this.circuitComplete = false;
        this.showMessage('🔄 Devre temizlendi!');
    }

    createSuccessMessage() {
        this.successMessage = new PIXI.Text('', {
            fontFamily: 'Fredoka One, Arial',
            fontSize: 28,
            fill: 0x00FF00,
            fontWeight: 'bold',
            stroke: 0x000000,
            strokeThickness: 4
        });
        this.successMessage.anchor.set(0.5);
        this.successMessage.x = this.app.screen.width / 2;
        this.successMessage.y = this.app.screen.height / 2 - 50;
        this.successMessage.visible = false;
        this.app.stage.addChild(this.successMessage);
    }

    showMessage(text) {
        const message = new PIXI.Text(text, {
            fontFamily: 'Arial',
            fontSize: 16,
            fill: 0xFFFFFF,
            fontWeight: 'bold'
        });
        message.anchor.set(0.5);
        message.x = this.app.screen.width / 2;
        message.y = 100;
        this.app.stage.addChild(message);

        setTimeout(() => {
            this.app.stage.removeChild(message);
        }, 2000);
    }

    destroy() {
        if (this.app) {
            this.app.destroy(true, { children: true, texture: true, baseTexture: true });
        }
    }
}

// Global erişim için
window.CircuitDesign = CircuitDesign;
