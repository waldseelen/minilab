/**
 * Mucit Atölyesi - Pixi.js Simülasyonu
 * Çocuklar araçlar ve malzemeler kullanarak basit icatlar yapabilir.
 */

class InventorWorkshop {
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
            backgroundColor: 0xF5F3ED,
            antialias: true
        });

        this.canvasElement.appendChild(this.app.view);

        // Durum değişkenleri
        this.currentTool = null;
        this.inventory = {
            wood: 3,
            metal: 3,
            wheel: 2,
            spring: 2
        };
        this.createdItems = [];
        this.draggedItem = null;

        this.init();
    }

    init() {
        this.createBackground();
        this.createToolbar();
        this.createMaterialsPanel();
        this.createWorkbench();
        this.createInventoryDisplay();
        this.createInstructions();
        this.createSuccessMessage();
    }

    createBackground() {
        // Atölye arka planı
        const bg = new PIXI.Graphics();
        bg.beginFill(0xE8E5D9);
        bg.drawRect(0, 0, this.app.screen.width, this.app.screen.height);
        bg.endFill();
        this.app.stage.addChild(bg);

        // Zemin çizgisi
        const floor = new PIXI.Graphics();
        floor.lineStyle(3, 0x8B7355);
        floor.moveTo(0, this.app.screen.height - 50);
        floor.lineTo(this.app.screen.width, this.app.screen.height - 50);
        this.app.stage.addChild(floor);
    }

    createToolbar() {
        // Araçlar paneli
        const toolbarBg = new PIXI.Graphics();
        toolbarBg.beginFill(0x8B7355);
        toolbarBg.drawRoundedRect(10, 10, 150, 400, 10);
        toolbarBg.endFill();
        this.app.stage.addChild(toolbarBg);

        // Başlık
        const title = new PIXI.Text('🔧 Araçlar', {
            fontFamily: 'Fredoka One, Arial',
            fontSize: 20,
            fill: 0xFFFFFF
        });
        title.x = 25;
        title.y = 20;
        this.app.stage.addChild(title);

        // Araçlar
        const tools = [
            { name: 'Çekiç', emoji: '🔨', y: 60 },
            { name: 'Testere', emoji: '🪚', y: 140 },
            { name: 'Tornavida', emoji: '🪛', y: 220 },
            { name: 'Anahtar', emoji: '🔧', y: 300 }
        ];

        tools.forEach(tool => {
            this.createToolButton(tool);
        });
    }

    createToolButton(tool) {
        const container = new PIXI.Container();
        container.x = 20;
        container.y = tool.y;
        container.interactive = true;
        container.buttonMode = true;

        // Arka plan
        const bg = new PIXI.Graphics();
        bg.beginFill(0xFFD700);
        bg.drawRoundedRect(0, 0, 130, 60, 8);
        bg.endFill();
        container.addChild(bg);

        // Emoji
        const emoji = new PIXI.Text(tool.emoji, {
            fontSize: 32
        });
        emoji.x = 15;
        emoji.y = 10;
        container.addChild(emoji);

        // İsim
        const name = new PIXI.Text(tool.name, {
            fontFamily: 'Arial',
            fontSize: 14,
            fill: 0x333333
        });
        name.x = 55;
        name.y = 20;
        container.addChild(name);

        // Tıklama
        container.on('pointerdown', () => {
            this.selectTool(tool, bg);
        });

        container.bg = bg;
        container.tool = tool;
        this.app.stage.addChild(container);
    }

    selectTool(tool, bg) {
        // Önceki seçimi temizle
        this.app.stage.children.forEach(child => {
            if (child.bg && child !== bg.parent) {
                child.bg.clear();
                child.bg.beginFill(0xFFD700);
                child.bg.drawRoundedRect(0, 0, 130, 60, 8);
                child.bg.endFill();
            }
        });

        // Yeni seçim
        bg.clear();
        bg.lineStyle(4, 0xFF6347);
        bg.beginFill(0xFFD700);
        bg.drawRoundedRect(0, 0, 130, 60, 8);
        bg.endFill();

        this.currentTool = tool;
        this.showMessage(`${tool.emoji} ${tool.name} seçildi!`);
    }

    createMaterialsPanel() {
        // Malzemeler paneli
        const panelBg = new PIXI.Graphics();
        panelBg.beginFill(0x8B7355);
        panelBg.drawRoundedRect(this.app.screen.width - 160, 10, 150, 400, 10);
        panelBg.endFill();
        this.app.stage.addChild(panelBg);

        // Başlık
        const title = new PIXI.Text('📦 Malzemeler', {
            fontFamily: 'Fredoka One, Arial',
            fontSize: 18,
            fill: 0xFFFFFF
        });
        title.x = this.app.screen.width - 148;
        title.y = 20;
        this.app.stage.addChild(title);

        // Malzemeler
        const materials = [
            { name: 'Tahta', emoji: '🪵', type: 'wood', y: 60 },
            { name: 'Metal', emoji: '⚙️', type: 'metal', y: 140 },
            { name: 'Tekerlek', emoji: '⚙️', type: 'wheel', y: 220 },
            { name: 'Yay', emoji: '🌀', type: 'spring', y: 300 }
        ];

        materials.forEach(material => {
            this.createMaterialSlot(material);
        });
    }

    createMaterialSlot(material) {
        const container = new PIXI.Container();
        container.x = this.app.screen.width - 150;
        container.y = material.y;

        // Arka plan
        const bg = new PIXI.Graphics();
        bg.beginFill(0xDDDDDD);
        bg.drawRoundedRect(0, 0, 130, 60, 8);
        bg.endFill();
        container.addChild(bg);

        // Emoji
        const emoji = new PIXI.Text(material.emoji, {
            fontSize: 32
        });
        emoji.x = 15;
        emoji.y = 10;
        container.addChild(emoji);

        // Sayı
        const count = new PIXI.Text(`×${this.inventory[material.type]}`, {
            fontFamily: 'Arial',
            fontSize: 16,
            fill: 0x333333,
            fontWeight: 'bold'
        });
        count.x = 60;
        count.y = 20;
        count.name = `count_${material.type}`;
        container.addChild(count);

        // Sürükleme
        container.interactive = true;
        container.buttonMode = true;
        container
            .on('pointerdown', (e) => this.onMaterialDragStart(e, material))
            .on('pointerup', (e) => this.onMaterialDragEnd(e))
            .on('pointerupoutside', (e) => this.onMaterialDragEnd(e))
            .on('pointermove', (e) => this.onMaterialDragMove(e));

        container.material = material;
        this.app.stage.addChild(container);
    }

    onMaterialDragStart(event, material) {
        if (this.inventory[material.type] <= 0) {
            this.showMessage('❌ Bu malzemeden kalmadı!');
            return;
        }

        // Malzeme kopyası oluştur
        const copy = new PIXI.Text(material.emoji, {
            fontSize: 48
        });
        copy.anchor.set(0.5);
        copy.x = event.data.global.x;
        copy.y = event.data.global.y;
        copy.alpha = 0.8;
        copy.material = material;

        this.draggedItem = copy;
        this.app.stage.addChild(copy);
    }

    onMaterialDragMove(event) {
        if (this.draggedItem) {
            this.draggedItem.x = event.data.global.x;
            this.draggedItem.y = event.data.global.y;
        }
    }

    onMaterialDragEnd(event) {
        if (!this.draggedItem) return;

        const x = event.data.global.x;
        const y = event.data.global.y;

        // Çalışma tezgahına bırakıldı mı kontrol et
        if (x > 200 && x < this.app.screen.width - 200 && y > 100 && y < 450) {
            // Malzemeyi tezgaha ekle
            this.draggedItem.x = x;
            this.draggedItem.y = y;
            this.draggedItem.alpha = 1;
            this.createdItems.push(this.draggedItem);

            // Envanterden düş
            this.inventory[this.draggedItem.material.type]--;
            this.updateInventoryDisplay();

            this.showMessage(`✅ ${this.draggedItem.material.name} eklendi!`);

            // İcat kontrolü
            this.checkForInvention();
        } else {
            // Geçersiz alan - sil
            this.app.stage.removeChild(this.draggedItem);
        }

        this.draggedItem = null;
    }

    createWorkbench() {
        // Çalışma tezgahı
        const workbench = new PIXI.Graphics();
        workbench.lineStyle(4, 0x6B4423);
        workbench.beginFill(0xD2B48C, 0.3);
        workbench.drawRoundedRect(200, 100,
            this.app.screen.width - 400, 350, 15);
        workbench.endFill();
        this.app.stage.addChild(workbench);

        // Tezgah etiketi
        const label = new PIXI.Text('🔨 Çalışma Tezgahı - Malzemeleri buraya sürükle!', {
            fontFamily: 'Arial',
            fontSize: 18,
            fill: 0x6B4423,
            fontWeight: 'bold'
        });
        label.anchor.set(0.5);
        label.x = this.app.screen.width / 2;
        label.y = 120;
        this.app.stage.addChild(label);
    }

    createInventoryDisplay() {
        this.inventoryText = new PIXI.Text('', {
            fontFamily: 'Arial',
            fontSize: 14,
            fill: 0x333333
        });
        this.inventoryText.x = 10;
        this.inventoryText.y = this.app.screen.height - 40;
        this.app.stage.addChild(this.inventoryText);
        this.updateInventoryDisplay();
    }

    updateInventoryDisplay() {
        // Envanter sayılarını güncelle
        this.app.stage.children.forEach(child => {
            if (child.name && child.name.startsWith('count_')) {
                const type = child.name.split('_')[1];
                child.text = `×${this.inventory[type]}`;
            }
        });
    }

    checkForInvention() {
        // İcat kombinasyonlarını kontrol et
        const items = this.createdItems.map(item => item.material.type);

        // Araba: Tahta + Metal + 2 Tekerlek
        if (items.filter(i => i === 'wood').length >= 1 &&
            items.filter(i => i === 'metal').length >= 1 &&
            items.filter(i => i === 'wheel').length >= 2) {
            this.completeInvention('🚗 Harika! Bir araba yaptın!');
        }
        // Yaylı Oyuncak: Tahta + Yay
        else if (items.filter(i => i === 'wood').length >= 1 &&
            items.filter(i => i === 'spring').length >= 1) {
            this.completeInvention('🎪 Süper! Yaylı bir oyuncak yaptın!');
        }
        // Tekerli Kasa: Metal + Tekerlek
        else if (items.filter(i => i === 'metal').length >= 1 &&
            items.filter(i => i === 'wheel').length >= 1) {
            this.completeInvention('📦 Tebrikler! Tekerli bir kasa yaptın!');
        }
    }

    completeInvention(message) {
        // Başarı mesajı
        this.successMessage.text = message;
        this.successMessage.visible = true;

        // Patlamalar
        for (let i = 0; i < 20; i++) {
            setTimeout(() => {
                this.createParticle(
                    this.app.screen.width / 2,
                    this.app.screen.height / 2
                );
            }, i * 50);
        }

        // Temizleme butonu
        setTimeout(() => {
            this.successMessage.visible = false;
            this.showResetButton();
        }, 3000);
    }

    createParticle(x, y) {
        const colors = [0xFFD700, 0xFF6347, 0x32CD32, 0x1E90FF];
        const particle = new PIXI.Graphics();
        particle.beginFill(colors[Math.floor(Math.random() * colors.length)]);
        particle.drawCircle(0, 0, 5);
        particle.endFill();
        particle.x = x;
        particle.y = y;

        const angle = Math.random() * Math.PI * 2;
        const speed = 2 + Math.random() * 3;
        particle.vx = Math.cos(angle) * speed;
        particle.vy = Math.sin(angle) * speed;

        this.app.stage.addChild(particle);

        const animate = () => {
            particle.x += particle.vx;
            particle.y += particle.vy;
            particle.alpha -= 0.02;

            if (particle.alpha > 0) {
                requestAnimationFrame(animate);
            } else {
                this.app.stage.removeChild(particle);
            }
        };
        animate();
    }

    showResetButton() {
        const button = new PIXI.Container();
        button.x = this.app.screen.width / 2 - 75;
        button.y = this.app.screen.height / 2 + 50;
        button.interactive = true;
        button.buttonMode = true;

        const bg = new PIXI.Graphics();
        bg.beginFill(0x32CD32);
        bg.drawRoundedRect(0, 0, 150, 50, 10);
        bg.endFill();
        button.addChild(bg);

        const text = new PIXI.Text('🔄 Yeni İcat', {
            fontFamily: 'Arial',
            fontSize: 18,
            fill: 0xFFFFFF,
            fontWeight: 'bold'
        });
        text.anchor.set(0.5);
        text.x = 75;
        text.y = 25;
        button.addChild(text);

        button.on('pointerdown', () => {
            this.resetWorkshop();
            this.app.stage.removeChild(button);
        });

        this.app.stage.addChild(button);
    }

    resetWorkshop() {
        // Tezgahı temizle
        this.createdItems.forEach(item => {
            this.app.stage.removeChild(item);
        });
        this.createdItems = [];
        this.showMessage('✨ Tezgah temizlendi! Yeni bir icat yapabilirsin!');
    }

    createInstructions() {
        const instructions = new PIXI.Text(
            '1️⃣ Sol panelden bir araç seç\n' +
            '2️⃣ Sağ panelden malzemeleri tezgaha sürükle\n' +
            '3️⃣ Farklı kombinasyonları dene!',
            {
                fontFamily: 'Arial',
                fontSize: 14,
                fill: 0x555555,
                align: 'left'
            }
        );
        instructions.x = 220;
        instructions.y = 470;
        this.app.stage.addChild(instructions);
    }

    createSuccessMessage() {
        this.successMessage = new PIXI.Text('', {
            fontFamily: 'Fredoka One, Arial',
            fontSize: 32,
            fill: 0xFF6347,
            fontWeight: 'bold',
            stroke: 0xFFFFFF,
            strokeThickness: 4
        });
        this.successMessage.anchor.set(0.5);
        this.successMessage.x = this.app.screen.width / 2;
        this.successMessage.y = this.app.screen.height / 2 - 50;
        this.successMessage.visible = false;
        this.app.stage.addChild(this.successMessage);
    }

    showMessage(text) {
        // Geçici mesaj göster
        const message = new PIXI.Text(text, {
            fontFamily: 'Arial',
            fontSize: 16,
            fill: 0x333333,
            fontWeight: 'bold'
        });
        message.anchor.set(0.5);
        message.x = this.app.screen.width / 2;
        message.y = 480;
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
window.InventorWorkshop = InventorWorkshop;
