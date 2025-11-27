/**
 * Devre Tasarımı V2 - Gelişmiş Pixi.js Simülasyonu
 * LED, motor, buzzer desteği, interaktif rehberlik ve devre şemaları
 * @version 2.0
 */

class CircuitDesignV2 {
    constructor(canvasId, options = {}) {
        this.canvasElement = document.getElementById(canvasId);
        if (!this.canvasElement) {
            console.error(`Canvas element '${canvasId}' bulunamadı!`);
            return;
        }

        this.app = new PIXI.Application({
            width: options.width || 900,
            height: options.height || 650,
            backgroundColor: 0x1A237E,
            antialias: true,
            resolution: window.devicePixelRatio || 1
        });

        this.canvasElement.appendChild(this.app.view);

        // Devre durumu
        this.components = [];
        this.wires = [];
        this.selectedComponent = null;
        this.isDrawingWire = false;
        this.wireStart = null;
        this.currentLevel = 1;
        this.completedLevels = [];
        this.score = 0;

        // Bileşen tanımları
        this.componentTypes = {
            battery: {
                name: 'Pil',
                emoji: '🔋',
                color: 0xFFEB3B,
                terminals: ['positive', 'negative'],
                info: 'Elektrik kaynağı - artı ve eksi kutupları var!'
            },
            led: {
                name: 'LED',
                emoji: '💡',
                color: 0xF44336,
                terminals: ['anode', 'cathode'],
                info: 'Işık yapar! Artı kutba anotunu bağla.'
            },
            bulb: {
                name: 'Ampul',
                emoji: '💡',
                color: 0xFFC107,
                terminals: ['in', 'out'],
                info: 'Klasik ampul - iki ucunu bağla!'
            },
            motor: {
                name: 'Motor',
                emoji: '⚙️',
                color: 0x4CAF50,
                terminals: ['power', 'ground'],
                info: 'Döner! Artı ve eksiye bağla.'
            },
            buzzer: {
                name: 'Buzzer',
                emoji: '🔔',
                color: 0x9C27B0,
                terminals: ['plus', 'minus'],
                info: 'Ses çıkarır! Doğru bağlarsan bip bip!'
            },
            switch: {
                name: 'Anahtar',
                emoji: '🔘',
                color: 0x607D8B,
                terminals: ['in', 'out'],
                isSwitch: true,
                info: 'Devreyi açar/kapar!'
            },
            resistor: {
                name: 'Direnç',
                emoji: '📏',
                color: 0x795548,
                terminals: ['in', 'out'],
                info: 'Akımı yavaşlatır!'
            }
        };

        // Görev seviyeleri
        this.levels = [
            {
                id: 1,
                name: '💡 İlk Işık',
                description: 'Pili ampule bağla ve ışığı yak!',
                requiredComponents: ['battery', 'bulb'],
                goal: 'bulb_on',
                points: 20,
                hint: 'Pilin artısını ampulün bir ucuna, eksisini diğer ucuna bağla!'
            },
            {
                id: 2,
                name: '🔘 Anahtarlı Devre',
                description: 'Anahtar ile ampulü kontrol et!',
                requiredComponents: ['battery', 'switch', 'bulb'],
                goal: 'switch_control',
                points: 30,
                hint: 'Pil → Anahtar → Ampul → Pil sırasıyla bağla!'
            },
            {
                id: 3,
                name: '🚦 LED Işıkları',
                description: 'Kırmızı LED\'i yak!',
                requiredComponents: ['battery', 'led', 'resistor'],
                goal: 'led_on',
                points: 35,
                hint: 'LED için direnç gerekli! Pil → Direnç → LED → Pil'
            },
            {
                id: 4,
                name: '⚙️ Motor Gücü',
                description: 'Motoru çalıştır!',
                requiredComponents: ['battery', 'switch', 'motor'],
                goal: 'motor_running',
                points: 40,
                hint: 'Anahtarı kullanarak motoru kontrol et!'
            },
            {
                id: 5,
                name: '🔔 Sesli Alarm',
                description: 'Buzzer ile alarm yap!',
                requiredComponents: ['battery', 'switch', 'buzzer'],
                goal: 'buzzer_on',
                points: 40,
                hint: 'Buzzer\'ı anahtarla kontrol et!'
            },
            {
                id: 6,
                name: '🌟 Komple Devre',
                description: 'LED + Motor + Buzzer hepsini çalıştır!',
                requiredComponents: ['battery', 'led', 'motor', 'buzzer', 'switch'],
                goal: 'all_working',
                points: 60,
                hint: 'Paralel bağlantı kur! Her bileşen pile bağlı olmalı.'
            }
        ];

        this.init();
    }

    init() {
        this.createBackground();
        this.createToolbar();
        this.createWorkArea();
        this.createLevelSelector();
        this.createControlPanel();
        this.createInfoPanel();
        this.loadLevel(1);
    }

    createBackground() {
        // Gradient arka plan (devre teması)
        const bg = new PIXI.Graphics();
        bg.beginFill(0x0D1B2A);
        bg.drawRect(0, 0, this.app.screen.width, this.app.screen.height);
        bg.endFill();
        this.app.stage.addChild(bg);

        // Grid çizgileri (devre tahtası efekti)
        const grid = new PIXI.Graphics();
        grid.lineStyle(1, 0x1B3A4B, 0.4);
        for (let x = 0; x < this.app.screen.width; x += 25) {
            grid.moveTo(x, 0);
            grid.lineTo(x, this.app.screen.height);
        }
        for (let y = 0; y < this.app.screen.height; y += 25) {
            grid.moveTo(0, y);
            grid.lineTo(this.app.screen.width, y);
        }
        this.app.stage.addChild(grid);

        // Başlık
        const title = new PIXI.Text('⚡ Devre Tasarımı', {
            fontFamily: 'Fredoka One, Arial',
            fontSize: 32,
            fill: 0x00E5FF,
            dropShadow: true,
            dropShadowDistance: 2,
            dropShadowColor: '#00000066'
        });
        title.x = this.app.screen.width / 2 - title.width / 2;
        title.y = 10;
        this.app.stage.addChild(title);
    }

    createToolbar() {
        // Bileşenler paneli
        const panel = new PIXI.Graphics();
        panel.beginFill(0x1B3A4B, 0.95);
        panel.lineStyle(2, 0x00E5FF);
        panel.drawRoundedRect(10, 55, 130, 450, 15);
        panel.endFill();
        this.app.stage.addChild(panel);

        const title = new PIXI.Text('🔌 Bileşenler', {
            fontFamily: 'Arial',
            fontSize: 16,
            fill: 0x00E5FF,
            fontWeight: 'bold'
        });
        title.x = 25;
        title.y = 65;
        this.app.stage.addChild(title);

        const componentList = Object.keys(this.componentTypes);
        componentList.forEach((type, index) => {
            this.createComponentButton(type, index);
        });
    }

    createComponentButton(type, index) {
        const comp = this.componentTypes[type];
        const btn = new PIXI.Container();
        btn.x = 20;
        btn.y = 95 + index * 55;
        btn.interactive = true;
        btn.buttonMode = true;
        btn.cursor = 'grab';

        const bg = new PIXI.Graphics();
        bg.beginFill(comp.color, 0.3);
        bg.lineStyle(2, comp.color);
        bg.drawRoundedRect(0, 0, 110, 45, 8);
        bg.endFill();
        btn.addChild(bg);

        const emoji = new PIXI.Text(comp.emoji, { fontSize: 24 });
        emoji.x = 8;
        emoji.y = 8;
        btn.addChild(emoji);

        const name = new PIXI.Text(comp.name, {
            fontFamily: 'Arial',
            fontSize: 13,
            fill: 0xFFFFFF,
            fontWeight: 'bold'
        });
        name.x = 42;
        name.y = 14;
        btn.addChild(name);

        btn.on('pointerover', () => {
            bg.clear();
            bg.beginFill(comp.color, 0.5);
            bg.lineStyle(3, comp.color);
            bg.drawRoundedRect(0, 0, 110, 45, 8);
            bg.endFill();
            btn.scale.set(1.05);
            this.showComponentInfo(comp);
        });

        btn.on('pointerout', () => {
            bg.clear();
            bg.beginFill(comp.color, 0.3);
            bg.lineStyle(2, comp.color);
            bg.drawRoundedRect(0, 0, 110, 45, 8);
            bg.endFill();
            btn.scale.set(1);
        });

        btn.on('pointerdown', (e) => this.startDragComponent(e, type));

        this.app.stage.addChild(btn);
    }

    startDragComponent(event, type) {
        const comp = this.componentTypes[type];

        const dragObj = new PIXI.Container();
        dragObj.componentType = type;

        // Bileşen görüntüsü
        const bg = new PIXI.Graphics();
        bg.beginFill(comp.color, 0.8);
        bg.lineStyle(3, 0xFFFFFF);
        bg.drawRoundedRect(-40, -30, 80, 60, 10);
        bg.endFill();
        dragObj.addChild(bg);

        const emoji = new PIXI.Text(comp.emoji, { fontSize: 32 });
        emoji.anchor.set(0.5);
        dragObj.addChild(emoji);

        // Terminal noktaları
        const t1 = new PIXI.Graphics();
        t1.beginFill(0xFFFFFF);
        t1.drawCircle(-35, 0, 8);
        t1.endFill();
        t1.name = 'terminal1';
        dragObj.addChild(t1);

        const t2 = new PIXI.Graphics();
        t2.beginFill(0xFFFFFF);
        t2.drawCircle(35, 0, 8);
        t2.endFill();
        t2.name = 'terminal2';
        dragObj.addChild(t2);

        dragObj.x = event.data.global.x;
        dragObj.y = event.data.global.y;

        this.draggedComponent = dragObj;
        this.app.stage.addChild(dragObj);

        // Stage event listeners
        this.app.stage.interactive = true;
        this.onDragMove = (e) => {
            if (this.draggedComponent) {
                this.draggedComponent.x = e.data.global.x;
                this.draggedComponent.y = e.data.global.y;
            }
        };
        this.onDragEnd = (e) => {
            if (this.draggedComponent) {
                const x = e.data.global.x;
                const y = e.data.global.y;

                // Çalışma alanında mı?
                if (x > 150 && x < this.app.screen.width - 150 && y > 60 && y < this.app.screen.height - 80) {
                    this.placeComponent(this.draggedComponent, x, y);
                } else {
                    this.app.stage.removeChild(this.draggedComponent);
                    this.showMessage('⚠️ Çalışma alanına bırak!', 0xFF9800);
                }
                this.draggedComponent = null;
            }
            this.app.stage.off('pointermove', this.onDragMove);
            this.app.stage.off('pointerup', this.onDragEnd);
        };

        this.app.stage.on('pointermove', this.onDragMove);
        this.app.stage.on('pointerup', this.onDragEnd);
    }

    placeComponent(comp, x, y) {
        comp.x = x;
        comp.y = y;
        comp.interactive = true;
        comp.buttonMode = true;

        // ID ver
        comp.id = `comp_${Date.now()}`;
        comp.terminals = {
            terminal1: { x: x - 35, y: y, connected: false, connectedTo: null },
            terminal2: { x: x + 35, y: y, connected: false, connectedTo: null }
        };

        // Terminal etkileşimleri
        const t1 = comp.getChildByName('terminal1');
        const t2 = comp.getChildByName('terminal2');

        [t1, t2].forEach((terminal, idx) => {
            terminal.interactive = true;
            terminal.buttonMode = true;
            terminal.cursor = 'crosshair';
            terminal.on('pointerdown', (e) => {
                e.stopPropagation();
                this.startWire(comp, idx === 0 ? 'terminal1' : 'terminal2');
            });
        });

        // Sürükleme ve silme
        comp.on('pointerdown', () => {
            this.selectedComponent = comp;
        });

        // Sağ tık silme
        comp.on('rightclick', (e) => {
            e.stopPropagation();
            this.removeComponent(comp);
        });

        this.components.push(comp);
        this.playSound('place');
        this.showMessage(`✅ ${this.componentTypes[comp.componentType].name} eklendi!`, 0x4CAF50);

        // Switch için özel davranış
        if (comp.componentType === 'switch') {
            comp.isOn = false;
            comp.on('pointerdown', () => {
                comp.isOn = !comp.isOn;
                this.updateSwitchVisual(comp);
                this.checkCircuit();
            });
        }
    }

    updateSwitchVisual(switchComp) {
        const bg = switchComp.children[0];
        bg.clear();
        if (switchComp.isOn) {
            bg.beginFill(0x4CAF50, 0.8);
            bg.lineStyle(3, 0x8BC34A);
        } else {
            bg.beginFill(0x607D8B, 0.8);
            bg.lineStyle(3, 0xFFFFFF);
        }
        bg.drawRoundedRect(-40, -30, 80, 60, 10);
        bg.endFill();

        this.showMessage(switchComp.isOn ? '🔛 Anahtar AÇIK!' : '🔴 Anahtar KAPALI!', switchComp.isOn ? 0x4CAF50 : 0xF44336);
    }

    removeComponent(comp) {
        // Bağlı kabloları kaldır
        this.wires = this.wires.filter(wire => {
            if (wire.startComp === comp || wire.endComp === comp) {
                this.app.stage.removeChild(wire.graphic);
                return false;
            }
            return true;
        });

        const index = this.components.indexOf(comp);
        if (index > -1) {
            this.components.splice(index, 1);
        }
        this.app.stage.removeChild(comp);
        this.showMessage('🗑️ Bileşen silindi!', 0xFF5722);
        this.playSound('click');
    }

    startWire(comp, terminalName) {
        if (this.isDrawingWire) {
            // Kablo çizimini bitir
            this.endWire(comp, terminalName);
        } else {
            // Kablo çizimine başla
            this.isDrawingWire = true;
            this.wireStart = { comp, terminalName };
            this.showMessage('🔗 Bağlanacak noktayı seç!', 0x2196F3);

            // Geçici kablo çizgisi
            this.tempWire = new PIXI.Graphics();
            this.app.stage.addChild(this.tempWire);

            this.wireDrawHandler = (e) => {
                if (this.isDrawingWire && this.tempWire) {
                    this.tempWire.clear();
                    this.tempWire.lineStyle(4, 0x00E5FF, 0.6);
                    const startPos = comp.terminals[terminalName];
                    this.tempWire.moveTo(startPos.x, startPos.y);
                    this.tempWire.lineTo(e.data.global.x, e.data.global.y);
                }
            };
            this.app.stage.on('pointermove', this.wireDrawHandler);
        }
    }

    endWire(comp, terminalName) {
        if (!this.wireStart || this.wireStart.comp === comp) {
            this.cancelWire();
            return;
        }

        // Kablo oluştur
        const wire = {
            startComp: this.wireStart.comp,
            startTerminal: this.wireStart.terminalName,
            endComp: comp,
            endTerminal: terminalName
        };

        // Görsel kablo
        const wireGraphic = new PIXI.Graphics();
        wireGraphic.lineStyle(5, 0x00E5FF);
        const start = this.wireStart.comp.terminals[this.wireStart.terminalName];
        const end = comp.terminals[terminalName];

        // Bezier eğrisi
        wireGraphic.moveTo(start.x, start.y);
        const midX = (start.x + end.x) / 2;
        wireGraphic.bezierCurveTo(
            midX, start.y,
            midX, end.y,
            end.x, end.y
        );

        wire.graphic = wireGraphic;
        this.app.stage.addChild(wireGraphic);
        this.wires.push(wire);

        // Terminal bağlantılarını güncelle
        this.wireStart.comp.terminals[this.wireStart.terminalName].connected = true;
        comp.terminals[terminalName].connected = true;

        this.cancelWire();
        this.showMessage('⚡ Kablo bağlandı!', 0x4CAF50);
        this.playSound('place');

        // Devre kontrolü
        this.checkCircuit();
    }

    cancelWire() {
        this.isDrawingWire = false;
        this.wireStart = null;
        if (this.tempWire) {
            this.app.stage.removeChild(this.tempWire);
            this.tempWire = null;
        }
        if (this.wireDrawHandler) {
            this.app.stage.off('pointermove', this.wireDrawHandler);
        }
    }

    createWorkArea() {
        // Çalışma alanı çerçevesi
        const workArea = new PIXI.Graphics();
        workArea.lineStyle(3, 0x00E5FF, 0.5);
        workArea.drawRoundedRect(150, 55, this.app.screen.width - 300, this.app.screen.height - 140, 15);
        this.app.stage.addChild(workArea);

        // ESC tuşu ile kablo iptal
        window.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.cancelWire();
            }
        });
    }

    createLevelSelector() {
        // Seviye seçici (alt)
        const panel = new PIXI.Graphics();
        panel.beginFill(0x1B3A4B, 0.95);
        panel.drawRoundedRect(150, this.app.screen.height - 75, this.app.screen.width - 300, 65, 10);
        panel.endFill();
        this.app.stage.addChild(panel);

        this.levelContainer = new PIXI.Container();
        this.levelContainer.y = this.app.screen.height - 65;
        this.app.stage.addChild(this.levelContainer);

        this.updateLevelButtons();
    }

    updateLevelButtons() {
        this.levelContainer.removeChildren();

        this.levels.forEach((level, index) => {
            const btn = new PIXI.Container();
            btn.x = 170 + index * 100;
            btn.y = 0;
            btn.interactive = true;
            btn.buttonMode = true;
            btn.cursor = 'pointer';

            const completed = this.completedLevels.includes(level.id);
            const current = this.currentLevel === level.id;

            const bg = new PIXI.Graphics();
            if (current) {
                bg.beginFill(0x00E5FF);
            } else if (completed) {
                bg.beginFill(0x4CAF50);
            } else {
                bg.beginFill(0x455A64);
            }
            bg.drawRoundedRect(0, 0, 85, 45, 8);
            bg.endFill();
            btn.addChild(bg);

            const text = new PIXI.Text(`${level.id}${completed ? ' ✓' : ''}`, {
                fontFamily: 'Arial',
                fontSize: 18,
                fill: current || completed ? 0x1A237E : 0xFFFFFF,
                fontWeight: 'bold'
            });
            text.x = 15;
            text.y = 5;
            btn.addChild(text);

            const points = new PIXI.Text(`⭐${level.points}`, {
                fontFamily: 'Arial',
                fontSize: 11,
                fill: 0xFFEB3B
            });
            points.x = 10;
            points.y = 28;
            btn.addChild(points);

            btn.on('pointerdown', () => {
                this.loadLevel(level.id);
            });

            this.levelContainer.addChild(btn);
        });
    }

    loadLevel(levelId) {
        // Mevcut devreyi temizle
        this.components.forEach(comp => this.app.stage.removeChild(comp));
        this.wires.forEach(wire => this.app.stage.removeChild(wire.graphic));
        this.components = [];
        this.wires = [];
        this.cancelWire();

        this.currentLevel = levelId;
        const level = this.levels.find(l => l.id === levelId);

        this.updateLevelButtons();
        this.updateInfoPanel(level);
        this.showMessage(`📋 Seviye ${levelId}: ${level.name}`, 0x2196F3);
    }

    createControlPanel() {
        // Sağ panel - kontroller
        const panel = new PIXI.Graphics();
        panel.beginFill(0x1B3A4B, 0.95);
        panel.lineStyle(2, 0x00E5FF);
        panel.drawRoundedRect(this.app.screen.width - 140, 55, 130, 300, 15);
        panel.endFill();
        this.app.stage.addChild(panel);

        const title = new PIXI.Text('🎮 Kontrol', {
            fontFamily: 'Arial',
            fontSize: 16,
            fill: 0x00E5FF,
            fontWeight: 'bold'
        });
        title.x = this.app.screen.width - 120;
        title.y = 65;
        this.app.stage.addChild(title);

        // Test butonu
        this.createControlButton('🔌 Test Et', this.app.screen.width - 130, 100, 0x4CAF50, () => {
            this.checkCircuit(true);
        });

        // Temizle butonu
        this.createControlButton('🗑️ Temizle', this.app.screen.width - 130, 155, 0xF44336, () => {
            this.clearWorkspace();
        });

        // İpucu butonu
        this.createControlButton('💡 İpucu', this.app.screen.width - 130, 210, 0xFF9800, () => {
            this.showHint();
        });

        // Skor
        const scoreBg = new PIXI.Graphics();
        scoreBg.beginFill(0xFFEB3B, 0.2);
        scoreBg.drawRoundedRect(this.app.screen.width - 130, 270, 110, 50, 8);
        scoreBg.endFill();
        this.app.stage.addChild(scoreBg);

        this.scoreText = new PIXI.Text('⭐ 0', {
            fontFamily: 'Fredoka One, Arial',
            fontSize: 24,
            fill: 0xFFEB3B
        });
        this.scoreText.x = this.app.screen.width - 115;
        this.scoreText.y = 280;
        this.app.stage.addChild(this.scoreText);
    }

    createControlButton(text, x, y, color, callback) {
        const btn = new PIXI.Container();
        btn.x = x;
        btn.y = y;
        btn.interactive = true;
        btn.buttonMode = true;
        btn.cursor = 'pointer';

        const bg = new PIXI.Graphics();
        bg.beginFill(color, 0.3);
        bg.lineStyle(2, color);
        bg.drawRoundedRect(0, 0, 110, 40, 8);
        bg.endFill();
        btn.addChild(bg);

        const label = new PIXI.Text(text, {
            fontFamily: 'Arial',
            fontSize: 14,
            fill: 0xFFFFFF,
            fontWeight: 'bold'
        });
        label.x = 10;
        label.y = 10;
        btn.addChild(label);

        btn.on('pointerover', () => {
            bg.clear();
            bg.beginFill(color, 0.6);
            bg.lineStyle(2, color);
            bg.drawRoundedRect(0, 0, 110, 40, 8);
            bg.endFill();
        });

        btn.on('pointerout', () => {
            bg.clear();
            bg.beginFill(color, 0.3);
            bg.lineStyle(2, color);
            bg.drawRoundedRect(0, 0, 110, 40, 8);
            bg.endFill();
        });

        btn.on('pointerdown', () => {
            callback();
            this.playSound('click');
        });

        this.app.stage.addChild(btn);
    }

    createInfoPanel() {
        // Görev bilgisi paneli (üst)
        this.infoPanel = new PIXI.Container();
        this.infoPanel.x = 150;
        this.infoPanel.y = 55;
        this.app.stage.addChild(this.infoPanel);
    }

    updateInfoPanel(level) {
        this.infoPanel.removeChildren();

        const bg = new PIXI.Graphics();
        bg.beginFill(0x1B3A4B, 0.8);
        bg.drawRoundedRect(0, 0, this.app.screen.width - 310, 80, 10);
        bg.endFill();
        this.infoPanel.addChild(bg);

        const levelTitle = new PIXI.Text(`${level.name}`, {
            fontFamily: 'Arial',
            fontSize: 20,
            fill: 0x00E5FF,
            fontWeight: 'bold'
        });
        levelTitle.x = 15;
        levelTitle.y = 10;
        this.infoPanel.addChild(levelTitle);

        const desc = new PIXI.Text(level.description, {
            fontFamily: 'Arial',
            fontSize: 14,
            fill: 0xFFFFFF
        });
        desc.x = 15;
        desc.y = 40;
        this.infoPanel.addChild(desc);

        // Gerekli bileşenler
        let compText = 'Gerekli: ';
        level.requiredComponents.forEach(type => {
            compText += `${this.componentTypes[type].emoji} `;
        });
        const reqText = new PIXI.Text(compText, {
            fontFamily: 'Arial',
            fontSize: 14,
            fill: 0xFFEB3B
        });
        reqText.x = 15;
        reqText.y = 58;
        this.infoPanel.addChild(reqText);
    }

    checkCircuit(showResult = false) {
        const level = this.levels.find(l => l.id === this.currentLevel);

        // Basit devre tamamlama kontrolü
        // Pil bağlı mı?
        const battery = this.components.find(c => c.componentType === 'battery');
        if (!battery) {
            if (showResult) this.showMessage('❌ Devrede pil yok!', 0xF44336);
            return false;
        }

        // Gerekli bileşenler var mı?
        let hasAll = true;
        level.requiredComponents.forEach(type => {
            if (!this.components.find(c => c.componentType === type)) {
                hasAll = false;
            }
        });

        if (!hasAll) {
            if (showResult) this.showMessage('❌ Eksik bileşenler var!', 0xF44336);
            return false;
        }

        // Bağlantı kontrolü (basit)
        let isComplete = this.wires.length >= level.requiredComponents.length;

        // Switch kontrolü
        const switchComp = this.components.find(c => c.componentType === 'switch');
        if (switchComp && !switchComp.isOn) {
            if (showResult) this.showMessage('🔴 Anahtar kapalı!', 0xFF9800);
            // Devre doğru bağlı ama anahtar kapalı
            if (level.goal === 'switch_control') {
                isComplete = true; // Doğru bağlı, test geçer
            } else {
                return false;
            }
        }

        if (isComplete) {
            this.circuitComplete(level);
            return true;
        } else {
            if (showResult) this.showMessage('⚠️ Devre tamamlanmadı!', 0xFF9800);
            return false;
        }
    }

    circuitComplete(level) {
        if (!this.completedLevels.includes(level.id)) {
            this.completedLevels.push(level.id);
            this.score += level.points;
            this.scoreText.text = `⭐ ${this.score}`;
            this.updateLevelButtons();

            // Başarı animasyonu
            this.showSuccessAnimation(level);
            this.createElectricEffect();

            // Progress callback
            if (window.updateExperimentProgress) {
                window.updateExperimentProgress(
                    this.completedLevels.length,
                    `${this.completedLevels.length} seviye tamamlandı!`
                );
            }
        } else {
            this.showMessage('✅ Devre çalışıyor!', 0x4CAF50);
        }

        // Bileşenleri aktifleştir
        this.activateComponents();
    }

    activateComponents() {
        this.components.forEach(comp => {
            if (comp.componentType === 'led' || comp.componentType === 'bulb') {
                this.animateLight(comp);
            } else if (comp.componentType === 'motor') {
                this.animateMotor(comp);
            } else if (comp.componentType === 'buzzer') {
                this.playSound('success');
            }
        });
    }

    animateLight(comp) {
        let glow = 0;
        let dir = 1;
        const animate = () => {
            glow += 0.05 * dir;
            if (glow >= 1 || glow <= 0.3) dir *= -1;

            const bg = comp.children[0];
            bg.clear();
            bg.beginFill(0xFFEB3B, 0.5 + glow * 0.5);
            bg.lineStyle(3, 0xFFEB3B);
            bg.drawRoundedRect(-40, -30, 80, 60, 10);
            bg.endFill();

            if (this.components.includes(comp)) {
                requestAnimationFrame(animate);
            }
        };
        animate();
    }

    animateMotor(comp) {
        const animate = () => {
            comp.rotation += 0.1;
            if (this.components.includes(comp)) {
                requestAnimationFrame(animate);
            }
        };
        animate();
    }

    createElectricEffect() {
        // Kablolar üzerinde elektrik efekti
        this.wires.forEach(wire => {
            const particle = new PIXI.Graphics();
            particle.beginFill(0x00E5FF);
            particle.drawCircle(0, 0, 5);
            particle.endFill();

            const start = wire.startComp.terminals[wire.startTerminal];
            particle.x = start.x;
            particle.y = start.y;
            this.app.stage.addChild(particle);

            let progress = 0;
            const animate = () => {
                progress += 0.05;
                const end = wire.endComp.terminals[wire.endTerminal];
                particle.x = start.x + (end.x - start.x) * progress;
                particle.y = start.y + (end.y - start.y) * progress;
                particle.alpha = 1 - progress;

                if (progress < 1) {
                    requestAnimationFrame(animate);
                } else {
                    this.app.stage.removeChild(particle);
                }
            };
            animate();
        });
    }

    showSuccessAnimation(level) {
        const overlay = new PIXI.Container();

        const bg = new PIXI.Graphics();
        bg.beginFill(0x4CAF50, 0.95);
        bg.drawRoundedRect(this.app.screen.width / 2 - 180, this.app.screen.height / 2 - 80, 360, 160, 20);
        bg.endFill();
        overlay.addChild(bg);

        const title = new PIXI.Text('⚡ DEVRE TAMAMLANDI! ⚡', {
            fontFamily: 'Fredoka One, Arial',
            fontSize: 24,
            fill: 0xFFFFFF
        });
        title.anchor.set(0.5);
        title.x = this.app.screen.width / 2;
        title.y = this.app.screen.height / 2 - 40;
        overlay.addChild(title);

        const points = new PIXI.Text(`+${level.points} ⭐`, {
            fontFamily: 'Arial',
            fontSize: 32,
            fill: 0xFFEB3B,
            fontWeight: 'bold'
        });
        points.anchor.set(0.5);
        points.x = this.app.screen.width / 2;
        points.y = this.app.screen.height / 2 + 10;
        overlay.addChild(points);

        const levelText = new PIXI.Text(level.name, {
            fontFamily: 'Arial',
            fontSize: 18,
            fill: 0xC8E6C9
        });
        levelText.anchor.set(0.5);
        levelText.x = this.app.screen.width / 2;
        levelText.y = this.app.screen.height / 2 + 50;
        overlay.addChild(levelText);

        overlay.alpha = 0;
        this.app.stage.addChild(overlay);

        // Fade in
        let alpha = 0;
        const fadeIn = () => {
            alpha += 0.1;
            overlay.alpha = alpha;
            if (alpha < 1) requestAnimationFrame(fadeIn);
        };
        fadeIn();

        this.playSound('success');

        // Remove after delay
        setTimeout(() => {
            let fadeAlpha = 1;
            const fadeOut = () => {
                fadeAlpha -= 0.08;
                overlay.alpha = fadeAlpha;
                if (fadeAlpha > 0) {
                    requestAnimationFrame(fadeOut);
                } else {
                    this.app.stage.removeChild(overlay);
                }
            };
            fadeOut();
        }, 2500);
    }

    clearWorkspace() {
        this.components.forEach(comp => this.app.stage.removeChild(comp));
        this.wires.forEach(wire => this.app.stage.removeChild(wire.graphic));
        this.components = [];
        this.wires = [];
        this.cancelWire();
        this.showMessage('🗑️ Çalışma alanı temizlendi!', 0x2196F3);
    }

    showHint() {
        const level = this.levels.find(l => l.id === this.currentLevel);
        this.showMessage(`💡 ${level.hint}`, 0xFF9800);
    }

    showComponentInfo(comp) {
        // Tooltip
        const existing = this.app.stage.children.find(c => c.name === 'compInfo');
        if (existing) this.app.stage.removeChild(existing);

        const tooltip = new PIXI.Container();
        tooltip.name = 'compInfo';

        const bg = new PIXI.Graphics();
        bg.beginFill(0x333333, 0.95);
        bg.drawRoundedRect(0, 0, 200, 40, 5);
        bg.endFill();
        tooltip.addChild(bg);

        const text = new PIXI.Text(comp.info, {
            fontFamily: 'Arial',
            fontSize: 11,
            fill: 0xFFFFFF,
            wordWrap: true,
            wordWrapWidth: 190
        });
        text.x = 5;
        text.y = 5;
        tooltip.addChild(text);

        tooltip.x = 145;
        tooltip.y = this.app.screen.height - 130;
        this.app.stage.addChild(tooltip);

        // Auto remove
        setTimeout(() => {
            if (this.app.stage.children.includes(tooltip)) {
                this.app.stage.removeChild(tooltip);
            }
        }, 3000);
    }

    showMessage(text, color = 0x333333) {
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

        container.x = this.app.screen.width / 2 - (text.length * 10 + 40) / 2;
        container.y = 140;
        container.alpha = 0;

        this.app.stage.addChild(container);

        let alpha = 0;
        const fadeIn = () => {
            alpha += 0.1;
            container.alpha = alpha;
            if (alpha < 1) requestAnimationFrame(fadeIn);
        };
        fadeIn();

        setTimeout(() => {
            let fadeAlpha = 1;
            const fadeOut = () => {
                fadeAlpha -= 0.1;
                container.alpha = fadeAlpha;
                if (fadeAlpha > 0) {
                    requestAnimationFrame(fadeOut);
                } else {
                    this.app.stage.removeChild(container);
                }
            };
            fadeOut();
        }, 2500);
    }

    playSound(type) {
        if (window.playSound) {
            window.playSound(type);
        }
    }

    destroy() {
        if (this.app) {
            this.app.destroy(true, { children: true, texture: true, baseTexture: true });
        }
    }
}

// Global erişim
window.CircuitDesignV2 = CircuitDesignV2;
