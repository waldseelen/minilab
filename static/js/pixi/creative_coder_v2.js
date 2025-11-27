/**
 * Creative Coder V2 - Blok Tabanlı Görsel Programlama Simülasyonu
 * Çocuklar için basit komut blokları ile çizim
 * @version 2.0
 */

class CreativeCoderV2 {
    constructor(canvasId, options = {}) {
        this.canvasElement = document.getElementById(canvasId);
        if (!this.canvasElement) {
            console.error(`Canvas element '${canvasId}' bulunamadı!`);
            return;
        }

        this.app = new PIXI.Application({
            width: options.width || 900,
            height: options.height || 650,
            backgroundColor: 0xF5F5F5,
            antialias: true,
            resolution: window.devicePixelRatio || 1
        });

        this.canvasElement.appendChild(this.app.view);

        // Robot durumu
        this.robot = {
            x: 400,
            y: 350,
            direction: 0, // 0: sağ, 90: aşağı, 180: sol, 270: yukarı
            penDown: true,
            penColor: 0x4CAF50,
            penSize: 4
        };

        // Komut blokları
        this.codeBlocks = [];
        this.isRunning = false;
        this.currentBlockIndex = 0;

        // Mevcut blok tipleri
        this.blockTypes = {
            forward: { name: '⬆️ İleri Git', color: 0x4CAF50, param: 50 },
            backward: { name: '⬇️ Geri Git', color: 0x8BC34A, param: 50 },
            turnRight: { name: '➡️ Sağa Dön', color: 0x2196F3, param: 90 },
            turnLeft: { name: '⬅️ Sola Dön', color: 0x03A9F4, param: 90 },
            penUp: { name: '✏️ Kalemi Kaldır', color: 0xFF9800, param: null },
            penDown: { name: '✏️ Kalemi İndir', color: 0xFFC107, param: null },
            setColor: { name: '🎨 Renk Değiştir', color: 0xE91E63, param: 'random' },
            repeat: { name: '🔄 Tekrarla', color: 0x9C27B0, param: 3 }
        };

        // Hazır şablonlar
        this.templates = [
            {
                name: '🔲 Kare',
                blocks: [
                    {
                        type: 'repeat', param: 4, inner: [
                            { type: 'forward', param: 80 },
                            { type: 'turnRight', param: 90 }
                        ]
                    }
                ]
            },
            {
                name: '🔺 Üçgen',
                blocks: [
                    {
                        type: 'repeat', param: 3, inner: [
                            { type: 'forward', param: 100 },
                            { type: 'turnRight', param: 120 }
                        ]
                    }
                ]
            },
            {
                name: '⭐ Yıldız',
                blocks: [
                    {
                        type: 'repeat', param: 5, inner: [
                            { type: 'forward', param: 80 },
                            { type: 'turnRight', param: 144 }
                        ]
                    }
                ]
            },
            {
                name: '🌸 Çiçek',
                blocks: [
                    {
                        type: 'repeat', param: 8, inner: [
                            { type: 'setColor', param: 'random' },
                            {
                                type: 'repeat', param: 4, inner: [
                                    { type: 'forward', param: 30 },
                                    { type: 'turnRight', param: 90 }
                                ]
                            },
                            { type: 'turnRight', param: 45 }
                        ]
                    }
                ]
            }
        ];

        this.colors = [0xFF5722, 0x4CAF50, 0x2196F3, 0xFFEB3B, 0x9C27B0, 0xE91E63, 0x00BCD4];
        this.drawings = new PIXI.Graphics();
        this.completedDrawings = 0;

        this.init();
    }

    init() {
        this.createBackground();
        this.createCanvas();
        this.createBlockPalette();
        this.createCodeArea();
        this.createControlPanel();
        this.createRobot();
        this.createTemplatesPanel();
    }

    createBackground() {
        const bg = new PIXI.Graphics();
        bg.beginFill(0xECEFF1);
        bg.drawRect(0, 0, this.app.screen.width, this.app.screen.height);
        bg.endFill();
        this.app.stage.addChild(bg);

        // Başlık
        const title = new PIXI.Text('🤖 Kodlama Atölyesi', {
            fontFamily: 'Fredoka One, Arial',
            fontSize: 28,
            fill: 0x37474F,
            dropShadow: true,
            dropShadowDistance: 2,
            dropShadowColor: '#00000022'
        });
        title.x = 20;
        title.y = 10;
        this.app.stage.addChild(title);
    }

    createCanvas() {
        // Çizim alanı
        const canvasBg = new PIXI.Graphics();
        canvasBg.beginFill(0xFFFFFF);
        canvasBg.lineStyle(3, 0x90A4AE);
        canvasBg.drawRoundedRect(180, 50, 450, 400, 15);
        canvasBg.endFill();
        this.app.stage.addChild(canvasBg);

        // Grid çizgileri
        const grid = new PIXI.Graphics();
        grid.lineStyle(1, 0xE0E0E0);
        for (let x = 180; x <= 630; x += 25) {
            grid.moveTo(x, 50);
            grid.lineTo(x, 450);
        }
        for (let y = 50; y <= 450; y += 25) {
            grid.moveTo(180, y);
            grid.lineTo(630, y);
        }
        this.app.stage.addChild(grid);

        // Çizim layer
        this.drawings = new PIXI.Graphics();
        this.app.stage.addChild(this.drawings);
    }

    createBlockPalette() {
        // Blok paleti (sol)
        const paletteBg = new PIXI.Graphics();
        paletteBg.beginFill(0x37474F);
        paletteBg.drawRoundedRect(10, 50, 160, 400, 15);
        paletteBg.endFill();
        this.app.stage.addChild(paletteBg);

        const paletteTitle = new PIXI.Text('📦 Bloklar', {
            fontFamily: 'Arial',
            fontSize: 18,
            fill: 0xFFFFFF,
            fontWeight: 'bold'
        });
        paletteTitle.x = 45;
        paletteTitle.y = 62;
        this.app.stage.addChild(paletteTitle);

        // Blokları oluştur
        const blockTypes = Object.keys(this.blockTypes);
        blockTypes.forEach((type, index) => {
            this.createPaletteBlock(type, index);
        });
    }

    createPaletteBlock(type, index) {
        const blockData = this.blockTypes[type];
        const block = new PIXI.Container();
        block.x = 20;
        block.y = 95 + index * 45;
        block.interactive = true;
        block.buttonMode = true;
        block.cursor = 'grab';

        const bg = new PIXI.Graphics();
        bg.beginFill(blockData.color);
        bg.drawRoundedRect(0, 0, 140, 38, 8);
        bg.endFill();

        // Bağlantı çıkıntıları
        bg.beginFill(blockData.color);
        bg.drawRect(20, -5, 30, 5);
        bg.drawRect(20, 38, 30, 5);
        bg.endFill();

        block.addChild(bg);

        const text = new PIXI.Text(blockData.name, {
            fontFamily: 'Arial',
            fontSize: 12,
            fill: 0xFFFFFF,
            fontWeight: 'bold'
        });
        text.x = 8;
        text.y = 10;
        block.addChild(text);

        block.on('pointerdown', (e) => {
            this.startDragBlock(e, type);
        });

        block.on('pointerover', () => {
            block.scale.set(1.05);
        });

        block.on('pointerout', () => {
            block.scale.set(1);
        });

        this.app.stage.addChild(block);
    }

    startDragBlock(event, type) {
        const blockData = this.blockTypes[type];

        const dragBlock = new PIXI.Container();
        dragBlock.blockType = type;
        dragBlock.param = blockData.param;

        const bg = new PIXI.Graphics();
        bg.beginFill(blockData.color, 0.9);
        bg.drawRoundedRect(-70, -19, 140, 38, 8);
        bg.endFill();
        dragBlock.addChild(bg);

        const text = new PIXI.Text(blockData.name, {
            fontFamily: 'Arial',
            fontSize: 12,
            fill: 0xFFFFFF,
            fontWeight: 'bold'
        });
        text.anchor.set(0.5);
        text.y = 0;
        dragBlock.addChild(text);

        dragBlock.x = event.data.global.x;
        dragBlock.y = event.data.global.y;

        this.draggedBlock = dragBlock;
        this.app.stage.addChild(dragBlock);

        this.app.stage.interactive = true;
        this.onDragMove = (e) => {
            if (this.draggedBlock) {
                this.draggedBlock.x = e.data.global.x;
                this.draggedBlock.y = e.data.global.y;
            }
        };
        this.onDragEnd = (e) => {
            if (this.draggedBlock) {
                const x = e.data.global.x;
                const y = e.data.global.y;

                // Kod alanına bırakıldı mı?
                if (x > 640 && y > 50 && y < 450) {
                    this.addCodeBlock(this.draggedBlock.blockType, this.draggedBlock.param);
                }
                this.app.stage.removeChild(this.draggedBlock);
                this.draggedBlock = null;
            }
            this.app.stage.off('pointermove', this.onDragMove);
            this.app.stage.off('pointerup', this.onDragEnd);
        };

        this.app.stage.on('pointermove', this.onDragMove);
        this.app.stage.on('pointerup', this.onDragEnd);
    }

    createCodeArea() {
        // Kod alanı (sağ)
        const codeAreaBg = new PIXI.Graphics();
        codeAreaBg.beginFill(0x455A64);
        codeAreaBg.drawRoundedRect(640, 50, 250, 400, 15);
        codeAreaBg.endFill();
        this.app.stage.addChild(codeAreaBg);

        const codeTitle = new PIXI.Text('📝 Kodun', {
            fontFamily: 'Arial',
            fontSize: 18,
            fill: 0xFFFFFF,
            fontWeight: 'bold'
        });
        codeTitle.x = 720;
        codeTitle.y = 62;
        this.app.stage.addChild(codeTitle);

        // Blokları buraya sürükle mesajı
        this.dropHint = new PIXI.Text('⬇️ Blokları buraya sürükle!', {
            fontFamily: 'Arial',
            fontSize: 14,
            fill: 0x90A4AE,
            fontStyle: 'italic'
        });
        this.dropHint.x = 670;
        this.dropHint.y = 200;
        this.app.stage.addChild(this.dropHint);

        this.codeBlocksContainer = new PIXI.Container();
        this.codeBlocksContainer.x = 650;
        this.codeBlocksContainer.y = 95;
        this.app.stage.addChild(this.codeBlocksContainer);
    }

    addCodeBlock(type, param) {
        const blockData = this.blockTypes[type];
        const index = this.codeBlocks.length;

        const block = new PIXI.Container();
        block.y = index * 42;
        block.blockType = type;
        block.param = param;
        block.index = index;
        block.interactive = true;
        block.buttonMode = true;

        const bg = new PIXI.Graphics();
        bg.beginFill(blockData.color);
        bg.drawRoundedRect(0, 0, 230, 38, 8);
        bg.endFill();

        // Puzzle bağlantıları
        bg.beginFill(blockData.color);
        bg.drawRect(30, -5, 25, 5);
        bg.drawRect(30, 38, 25, 5);
        bg.endFill();

        block.addChild(bg);
        block.bg = bg;

        // Block numarası
        const numBg = new PIXI.Graphics();
        numBg.beginFill(0x000000, 0.3);
        numBg.drawCircle(18, 19, 14);
        numBg.endFill();
        block.addChild(numBg);

        const num = new PIXI.Text((index + 1).toString(), {
            fontFamily: 'Arial',
            fontSize: 12,
            fill: 0xFFFFFF,
            fontWeight: 'bold'
        });
        num.anchor.set(0.5);
        num.x = 18;
        num.y = 19;
        block.addChild(num);

        const text = new PIXI.Text(blockData.name, {
            fontFamily: 'Arial',
            fontSize: 12,
            fill: 0xFFFFFF,
            fontWeight: 'bold'
        });
        text.x = 40;
        text.y = 11;
        block.addChild(text);

        // Parametre gösterimi
        if (param !== null) {
            const paramText = new PIXI.Text(`(${param})`, {
                fontFamily: 'Arial',
                fontSize: 11,
                fill: 0xFFFFFF,
                alpha: 0.8
            });
            paramText.x = 180;
            paramText.y = 12;
            block.addChild(paramText);
        }

        // Silme butonu
        const deleteBtn = new PIXI.Container();
        deleteBtn.x = 210;
        deleteBtn.y = 19;
        deleteBtn.interactive = true;
        deleteBtn.buttonMode = true;
        deleteBtn.cursor = 'pointer';

        const deleteBg = new PIXI.Graphics();
        deleteBg.beginFill(0xFF5722);
        deleteBg.drawCircle(0, 0, 10);
        deleteBg.endFill();
        deleteBtn.addChild(deleteBg);

        const deleteX = new PIXI.Text('×', {
            fontFamily: 'Arial',
            fontSize: 14,
            fill: 0xFFFFFF,
            fontWeight: 'bold'
        });
        deleteX.anchor.set(0.5);
        deleteX.y = -1;
        deleteBtn.addChild(deleteX);

        deleteBtn.on('pointerdown', (e) => {
            e.stopPropagation();
            this.removeCodeBlock(index);
        });
        block.addChild(deleteBtn);

        this.codeBlocksContainer.addChild(block);
        this.codeBlocks.push({ type, param, container: block });

        this.dropHint.visible = false;
        this.playSound('place');
        this.updateBlockNumbers();
    }

    removeCodeBlock(index) {
        if (index >= 0 && index < this.codeBlocks.length) {
            const block = this.codeBlocks[index];
            this.codeBlocksContainer.removeChild(block.container);
            this.codeBlocks.splice(index, 1);
            this.updateBlockNumbers();
            this.playSound('click');

            if (this.codeBlocks.length === 0) {
                this.dropHint.visible = true;
            }
        }
    }

    updateBlockNumbers() {
        this.codeBlocks.forEach((block, index) => {
            block.container.y = index * 42;
            block.container.index = index;
            // Numarayı güncelle
            const numText = block.container.children[2];
            numText.text = (index + 1).toString();
        });
    }

    createControlPanel() {
        // Kontrol paneli (alt)
        const controlBg = new PIXI.Graphics();
        controlBg.beginFill(0x37474F);
        controlBg.drawRoundedRect(180, 460, 450, 80, 15);
        controlBg.endFill();
        this.app.stage.addChild(controlBg);

        // Çalıştır butonu
        this.runButton = this.createControlButton('▶️ Çalıştır', 200, 475, 0x4CAF50, () => {
            this.runCode();
        });

        // Durdur butonu
        this.stopButton = this.createControlButton('⏹️ Durdur', 340, 475, 0xF44336, () => {
            this.stopCode();
        });

        // Temizle butonu
        this.createControlButton('🗑️ Temizle', 480, 475, 0xFF9800, () => {
            this.clearAll();
        });

        // Hız kontrolü
        const speedLabel = new PIXI.Text('Hız:', {
            fontFamily: 'Arial',
            fontSize: 14,
            fill: 0xFFFFFF
        });
        speedLabel.x = 200;
        speedLabel.y = 520;
        this.app.stage.addChild(speedLabel);

        this.speedButtons = [];
        ['Yavaş', 'Normal', 'Hızlı'].forEach((label, index) => {
            const btn = this.createSpeedButton(label, 250 + index * 70, 515, index);
            this.speedButtons.push(btn);
        });
        this.currentSpeed = 1; // Normal
        this.updateSpeedButtons();
    }

    createControlButton(text, x, y, color, callback) {
        const btn = new PIXI.Container();
        btn.x = x;
        btn.y = y;
        btn.interactive = true;
        btn.buttonMode = true;
        btn.cursor = 'pointer';

        const bg = new PIXI.Graphics();
        bg.beginFill(color);
        bg.drawRoundedRect(0, 0, 120, 40, 10);
        bg.endFill();
        btn.addChild(bg);
        btn.bg = bg;
        btn.bgColor = color;

        const label = new PIXI.Text(text, {
            fontFamily: 'Arial',
            fontSize: 16,
            fill: 0xFFFFFF,
            fontWeight: 'bold'
        });
        label.x = 60 - label.width / 2;
        label.y = 10;
        btn.addChild(label);

        btn.on('pointerover', () => {
            bg.alpha = 0.8;
        });

        btn.on('pointerout', () => {
            bg.alpha = 1;
        });

        btn.on('pointerdown', callback);

        this.app.stage.addChild(btn);
        return btn;
    }

    createSpeedButton(text, x, y, speedIndex) {
        const btn = new PIXI.Container();
        btn.x = x;
        btn.y = y;
        btn.interactive = true;
        btn.buttonMode = true;
        btn.cursor = 'pointer';
        btn.speedIndex = speedIndex;

        const bg = new PIXI.Graphics();
        bg.beginFill(0x607D8B);
        bg.drawRoundedRect(0, 0, 60, 25, 5);
        bg.endFill();
        btn.addChild(bg);
        btn.bg = bg;

        const label = new PIXI.Text(text, {
            fontFamily: 'Arial',
            fontSize: 11,
            fill: 0xFFFFFF
        });
        label.x = 30 - label.width / 2;
        label.y = 5;
        btn.addChild(label);

        btn.on('pointerdown', () => {
            this.currentSpeed = speedIndex;
            this.updateSpeedButtons();
        });

        this.app.stage.addChild(btn);
        return btn;
    }

    updateSpeedButtons() {
        this.speedButtons.forEach((btn, index) => {
            btn.bg.clear();
            btn.bg.beginFill(index === this.currentSpeed ? 0x4CAF50 : 0x607D8B);
            btn.bg.drawRoundedRect(0, 0, 60, 25, 5);
            btn.bg.endFill();
        });
    }

    createRobot() {
        this.robotContainer = new PIXI.Container();
        this.robotContainer.x = this.robot.x;
        this.robotContainer.y = this.robot.y;

        // Robot gövdesi
        const body = new PIXI.Graphics();
        body.beginFill(0x2196F3);
        body.drawCircle(0, 0, 15);
        body.endFill();

        // Yön oku
        body.beginFill(0xFFFFFF);
        body.moveTo(15, 0);
        body.lineTo(5, -8);
        body.lineTo(5, 8);
        body.closePath();
        body.endFill();

        this.robotContainer.addChild(body);
        this.app.stage.addChild(this.robotContainer);
    }

    createTemplatesPanel() {
        // Şablonlar paneli (alt sağ)
        const templateBg = new PIXI.Graphics();
        templateBg.beginFill(0x455A64);
        templateBg.drawRoundedRect(640, 460, 250, 180, 15);
        templateBg.endFill();
        this.app.stage.addChild(templateBg);

        const templateTitle = new PIXI.Text('🎨 Hazır Şablonlar', {
            fontFamily: 'Arial',
            fontSize: 16,
            fill: 0xFFFFFF,
            fontWeight: 'bold'
        });
        templateTitle.x = 680;
        templateTitle.y = 472;
        this.app.stage.addChild(templateTitle);

        this.templates.forEach((template, index) => {
            const btn = new PIXI.Container();
            btn.x = 660 + (index % 2) * 110;
            btn.y = 505 + Math.floor(index / 2) * 55;
            btn.interactive = true;
            btn.buttonMode = true;
            btn.cursor = 'pointer';

            const bg = new PIXI.Graphics();
            bg.beginFill(0x607D8B);
            bg.drawRoundedRect(0, 0, 100, 45, 8);
            bg.endFill();
            btn.addChild(bg);

            const text = new PIXI.Text(template.name, {
                fontFamily: 'Arial',
                fontSize: 14,
                fill: 0xFFFFFF,
                fontWeight: 'bold'
            });
            text.x = 50 - text.width / 2;
            text.y = 12;
            btn.addChild(text);

            btn.on('pointerover', () => {
                bg.alpha = 0.8;
            });

            btn.on('pointerout', () => {
                bg.alpha = 1;
            });

            btn.on('pointerdown', () => {
                this.loadTemplate(template);
            });

            this.app.stage.addChild(btn);
        });
    }

    loadTemplate(template) {
        // Mevcut kodu temizle
        this.codeBlocks.forEach(block => {
            this.codeBlocksContainer.removeChild(block.container);
        });
        this.codeBlocks = [];

        // Şablon bloklarını ekle
        this.flattenBlocks(template.blocks).forEach(block => {
            this.addCodeBlock(block.type, block.param);
        });

        this.showMessage(`✅ ${template.name} yüklendi!`, 0x4CAF50);
        this.playSound('success');
    }

    flattenBlocks(blocks, result = []) {
        blocks.forEach(block => {
            if (block.type === 'repeat' && block.inner) {
                // Repeat bloğunu düzleştir
                for (let i = 0; i < block.param; i++) {
                    this.flattenBlocks(block.inner, result);
                }
            } else {
                result.push(block);
            }
        });
        return result;
    }

    async runCode() {
        if (this.isRunning || this.codeBlocks.length === 0) return;

        this.isRunning = true;
        this.currentBlockIndex = 0;

        // Robot'u başlangıç pozisyonuna al
        this.robot.x = 400;
        this.robot.y = 250;
        this.robot.direction = 0;
        this.robot.penDown = true;
        this.robotContainer.x = this.robot.x;
        this.robotContainer.y = this.robot.y;
        this.robotContainer.rotation = 0;

        // Çizimi temizle
        this.drawings.clear();

        const speeds = [500, 200, 50];
        const delay = speeds[this.currentSpeed];

        for (let i = 0; i < this.codeBlocks.length; i++) {
            if (!this.isRunning) break;

            const block = this.codeBlocks[i];

            // Aktif bloğu vurgula
            this.highlightBlock(i);

            await this.executeBlock(block);
            await this.sleep(delay);
        }

        this.unhighlightAllBlocks();
        this.isRunning = false;
        this.completedDrawings++;

        this.showMessage('✅ Kod tamamlandı!', 0x4CAF50);

        // Progress callback
        if (window.updateExperimentProgress) {
            window.updateExperimentProgress(
                this.completedDrawings,
                `${this.completedDrawings} çizim tamamlandı!`
            );
        }
    }

    async executeBlock(block) {
        const { type, param } = block;

        switch (type) {
            case 'forward':
                await this.moveRobot(param);
                break;
            case 'backward':
                await this.moveRobot(-param);
                break;
            case 'turnRight':
                await this.rotateRobot(param);
                break;
            case 'turnLeft':
                await this.rotateRobot(-param);
                break;
            case 'penUp':
                this.robot.penDown = false;
                break;
            case 'penDown':
                this.robot.penDown = true;
                break;
            case 'setColor':
                this.robot.penColor = this.colors[Math.floor(Math.random() * this.colors.length)];
                break;
        }
    }

    async moveRobot(distance) {
        const radians = (this.robot.direction * Math.PI) / 180;
        const startX = this.robot.x;
        const startY = this.robot.y;
        const endX = startX + Math.cos(radians) * distance;
        const endY = startY + Math.sin(radians) * distance;

        // Çizim
        if (this.robot.penDown) {
            this.drawings.lineStyle(this.robot.penSize, this.robot.penColor);
            this.drawings.moveTo(startX, startY);
        }

        // Animasyonlu hareket
        const steps = 20;
        for (let i = 1; i <= steps; i++) {
            if (!this.isRunning) break;

            const progress = i / steps;
            this.robot.x = startX + (endX - startX) * progress;
            this.robot.y = startY + (endY - startY) * progress;
            this.robotContainer.x = this.robot.x;
            this.robotContainer.y = this.robot.y;

            if (this.robot.penDown) {
                this.drawings.lineTo(this.robot.x, this.robot.y);
            }

            await this.sleep(10);
        }
    }

    async rotateRobot(angle) {
        const startDir = this.robot.direction;
        const endDir = startDir + angle;

        // Animasyonlu dönüş
        const steps = 15;
        for (let i = 1; i <= steps; i++) {
            if (!this.isRunning) break;

            const progress = i / steps;
            this.robot.direction = startDir + (endDir - startDir) * progress;
            this.robotContainer.rotation = (this.robot.direction * Math.PI) / 180;

            await this.sleep(10);
        }

        this.robot.direction = endDir % 360;
    }

    highlightBlock(index) {
        this.codeBlocks.forEach((block, i) => {
            if (i === index) {
                block.container.bg.lineStyle(3, 0xFFEB3B);
                block.container.scale.set(1.05);
            } else {
                block.container.scale.set(1);
            }
        });
    }

    unhighlightAllBlocks() {
        this.codeBlocks.forEach(block => {
            block.container.scale.set(1);
        });
    }

    stopCode() {
        this.isRunning = false;
        this.unhighlightAllBlocks();
        this.showMessage('⏹️ Kod durduruldu!', 0xF44336);
    }

    clearAll() {
        // Kodu temizle
        this.codeBlocks.forEach(block => {
            this.codeBlocksContainer.removeChild(block.container);
        });
        this.codeBlocks = [];
        this.dropHint.visible = true;

        // Çizimi temizle
        this.drawings.clear();

        // Robot'u sıfırla
        this.robot.x = 400;
        this.robot.y = 250;
        this.robot.direction = 0;
        this.robot.penDown = true;
        this.robotContainer.x = this.robot.x;
        this.robotContainer.y = this.robot.y;
        this.robotContainer.rotation = 0;

        this.showMessage('🗑️ Temizlendi!', 0xFF9800);
        this.playSound('click');
    }

    showMessage(text, color) {
        const existing = this.app.stage.children.find(c => c.name === 'message');
        if (existing) this.app.stage.removeChild(existing);

        const container = new PIXI.Container();
        container.name = 'message';

        const bg = new PIXI.Graphics();
        bg.beginFill(color, 0.95);
        bg.drawRoundedRect(0, 0, text.length * 10 + 40, 40, 10);
        bg.endFill();
        container.addChild(bg);

        const textEl = new PIXI.Text(text, {
            fontFamily: 'Arial',
            fontSize: 16,
            fill: 0xFFFFFF,
            fontWeight: 'bold'
        });
        textEl.x = 20;
        textEl.y = 10;
        container.addChild(textEl);

        container.x = 400 - (text.length * 10 + 40) / 2;
        container.y = 550;

        this.app.stage.addChild(container);

        setTimeout(() => {
            if (this.app.stage.children.includes(container)) {
                this.app.stage.removeChild(container);
            }
        }, 2000);
    }

    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    playSound(type) {
        if (window.playSound) {
            window.playSound(type);
        }
    }

    destroy() {
        this.isRunning = false;
        if (this.app) {
            this.app.destroy(true, { children: true, texture: true, baseTexture: true });
        }
    }
}

// Global erişim
window.CreativeCoderV2 = CreativeCoderV2;
