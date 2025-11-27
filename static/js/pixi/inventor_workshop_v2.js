/**
 * Mucit Atölyesi V2 - Gelişmiş Pixi.js Simülasyonu
 * Profesyonel UI, etkileşimli rehberlik ve zengin icat sistemi.
 * @version 2.0
 */

class InventorWorkshopV2 {
    constructor(canvasId, options = {}) {
        this.canvasElement = document.getElementById(canvasId);
        if (!this.canvasElement) {
            console.error(`Canvas element '${canvasId}' bulunamadı!`);
            return;
        }

        this.app = new PIXI.Application({
            width: options.width || 900,
            height: options.height || 650,
            backgroundColor: 0xFAF8F5,
            antialias: true,
            resolution: window.devicePixelRatio || 1
        });

        this.canvasElement.appendChild(this.app.view);

        // Durum değişkenleri
        this.currentTool = null;
        this.currentTutorialStep = 0;
        this.tutorialActive = true;

        // Geliştirilmiş envanter
        this.inventory = {
            wood: { count: 5, emoji: '🪵', name: 'Tahta' },
            metal: { count: 5, emoji: '⚙️', name: 'Metal' },
            wheel: { count: 4, emoji: '🛞', name: 'Tekerlek' },
            spring: { count: 3, emoji: '🌀', name: 'Yay' },
            rope: { count: 4, emoji: '🪢', name: 'İp' },
            gear: { count: 3, emoji: '⚙️', name: 'Dişli' },
            screw: { count: 6, emoji: '🔩', name: 'Vida' },
            battery: { count: 2, emoji: '🔋', name: 'Pil' }
        };

        this.createdItems = [];
        this.draggedItem = null;
        this.completedInventions = [];

        // İcat reçeteleri
        this.inventionRecipes = {
            'car': {
                name: '🚗 Oyuncak Araba',
                materials: { wood: 1, wheel: 4, metal: 1 },
                points: 30,
                hint: 'Tahta gövde, metal çerçeve ve 4 tekerlek!'
            },
            'robot': {
                name: '🤖 Mini Robot',
                materials: { metal: 2, gear: 2, battery: 1 },
                points: 50,
                hint: 'Metal gövde, dişliler ve pil!'
            },
            'swing': {
                name: '🎠 Salıncak',
                materials: { wood: 2, rope: 2 },
                points: 25,
                hint: 'İki tahta ve iki ip!'
            },
            'springToy': {
                name: '🎪 Zıplayan Oyuncak',
                materials: { wood: 1, spring: 2 },
                points: 20,
                hint: 'Tahta ve yaylar!'
            },
            'windmill': {
                name: '🏭 Yel Değirmeni',
                materials: { wood: 2, gear: 1, metal: 1 },
                points: 40,
                hint: 'Tahta kanatlar, dişli ve metal gövde!'
            },
            'cart': {
                name: '🛒 El Arabası',
                materials: { wood: 1, wheel: 2, metal: 1 },
                points: 25,
                hint: 'Tahta kasa, iki tekerlek!'
            },
            'crane': {
                name: '🏗️ Vinç',
                materials: { metal: 2, rope: 1, gear: 1 },
                points: 45,
                hint: 'Metal kol, ip ve dişli!'
            },
            'train': {
                name: '🚂 Oyuncak Tren',
                materials: { wood: 2, wheel: 6, screw: 2 },
                points: 55,
                hint: 'İki vagon, çok tekerlek!'
            }
        };

        this.score = 0;
        this.init();
    }

    init() {
        this.createBackground();
        this.createToolbar();
        this.createMaterialsPanel();
        this.createWorkbench();
        this.createRecipeBook();
        this.createScorePanel();
        this.createTutorialOverlay();
        this.createHintButton();
        this.startTutorial();
    }

    createBackground() {
        // Gradient arka plan
        const bg = new PIXI.Graphics();
        bg.beginFill(0xFDF6E3);
        bg.drawRect(0, 0, this.app.screen.width, this.app.screen.height);
        bg.endFill();
        this.app.stage.addChild(bg);

        // Duvar dokusu
        const wallPattern = new PIXI.Graphics();
        wallPattern.lineStyle(1, 0xE8DFD0, 0.3);
        for (let i = 0; i < this.app.screen.width; i += 30) {
            wallPattern.moveTo(i, 0);
            wallPattern.lineTo(i, this.app.screen.height * 0.7);
        }
        for (let j = 0; j < this.app.screen.height * 0.7; j += 30) {
            wallPattern.moveTo(0, j);
            wallPattern.lineTo(this.app.screen.width, j);
        }
        this.app.stage.addChild(wallPattern);

        // Zemin
        const floor = new PIXI.Graphics();
        floor.beginFill(0x8B7355);
        floor.drawRect(0, this.app.screen.height - 80, this.app.screen.width, 80);
        floor.endFill();

        // Zemin çizgileri
        floor.lineStyle(2, 0x6B5344);
        for (let i = 0; i < this.app.screen.width; i += 50) {
            floor.moveTo(i, this.app.screen.height - 80);
            floor.lineTo(i + 20, this.app.screen.height);
        }
        this.app.stage.addChild(floor);

        // Başlık
        const title = new PIXI.Text('🔧 Mucit Atölyesi', {
            fontFamily: 'Fredoka One, Arial',
            fontSize: 32,
            fill: 0x5D4037,
            dropShadow: true,
            dropShadowDistance: 2,
            dropShadowColor: '#00000033'
        });
        title.x = this.app.screen.width / 2 - title.width / 2;
        title.y = 10;
        this.app.stage.addChild(title);
    }

    createToolbar() {
        // Araçlar paneli
        const panelBg = new PIXI.Graphics();
        panelBg.beginFill(0x795548);
        panelBg.drawRoundedRect(10, 60, 130, 350, 15);
        panelBg.endFill();

        // Panel gölgesi
        panelBg.beginFill(0x5D4037, 0.3);
        panelBg.drawRoundedRect(15, 65, 130, 350, 15);
        panelBg.endFill();
        this.app.stage.addChild(panelBg);

        const titleBg = new PIXI.Graphics();
        titleBg.beginFill(0xFFB74D);
        titleBg.drawRoundedRect(20, 70, 110, 35, 8);
        titleBg.endFill();
        this.app.stage.addChild(titleBg);

        const title = new PIXI.Text('🔧 Araçlar', {
            fontFamily: 'Arial',
            fontSize: 18,
            fill: 0x5D4037,
            fontWeight: 'bold'
        });
        title.x = 35;
        title.y = 77;
        this.app.stage.addChild(title);

        const tools = [
            { name: 'Çekiç', emoji: '🔨', action: 'hammer', tip: 'Parçaları birleştir!' },
            { name: 'Testere', emoji: '🪚', action: 'saw', tip: 'Tahta kes!' },
            { name: 'Tornavida', emoji: '🪛', action: 'screwdriver', tip: 'Vida sık!' },
            { name: 'Pense', emoji: '🔧', action: 'pliers', tip: 'Bük ve tut!' }
        ];

        tools.forEach((tool, index) => {
            this.createToolButton(tool, index);
        });
    }

    createToolButton(tool, index) {
        const container = new PIXI.Container();
        container.x = 20;
        container.y = 115 + index * 60;
        container.interactive = true;
        container.buttonMode = true;
        container.cursor = 'pointer';

        const bg = new PIXI.Graphics();
        bg.beginFill(0xFFE0B2);
        bg.lineStyle(2, 0xFFB74D);
        bg.drawRoundedRect(0, 0, 110, 50, 10);
        bg.endFill();
        container.addChild(bg);

        const emoji = new PIXI.Text(tool.emoji, { fontSize: 28 });
        emoji.x = 8;
        emoji.y = 8;
        container.addChild(emoji);

        const name = new PIXI.Text(tool.name, {
            fontFamily: 'Arial',
            fontSize: 14,
            fill: 0x5D4037,
            fontWeight: 'bold'
        });
        name.x = 45;
        name.y = 15;
        container.addChild(name);

        // Hover efektleri
        container.on('pointerover', () => {
            bg.clear();
            bg.beginFill(0xFFCC80);
            bg.lineStyle(3, 0xFF9800);
            bg.drawRoundedRect(0, 0, 110, 50, 10);
            bg.endFill();
            container.scale.set(1.05);
            this.showTooltip(tool.tip, container.x + 120, container.y + 25);
        });

        container.on('pointerout', () => {
            if (this.currentTool !== tool.action) {
                bg.clear();
                bg.beginFill(0xFFE0B2);
                bg.lineStyle(2, 0xFFB74D);
                bg.drawRoundedRect(0, 0, 110, 50, 10);
                bg.endFill();
            }
            container.scale.set(1);
            this.hideTooltip();
        });

        container.on('pointerdown', () => {
            this.selectTool(tool.action, bg, container);
            this.playSound('click');
        });

        container.bg = bg;
        container.toolAction = tool.action;
        this.app.stage.addChild(container);
    }

    selectTool(action, bg, container) {
        // Önceki seçimi temizle
        this.app.stage.children.forEach(child => {
            if (child.toolAction && child.bg && child.toolAction !== action) {
                child.bg.clear();
                child.bg.beginFill(0xFFE0B2);
                child.bg.lineStyle(2, 0xFFB74D);
                child.bg.drawRoundedRect(0, 0, 110, 50, 10);
                child.bg.endFill();
            }
        });

        // Yeni seçim
        bg.clear();
        bg.beginFill(0x4CAF50);
        bg.lineStyle(3, 0x388E3C);
        bg.drawRoundedRect(0, 0, 110, 50, 10);
        bg.endFill();

        this.currentTool = action;
        this.showMessage(`${container.children[1].text} ${container.children[2].text} seçildi!`, 0x4CAF50);

        // Tutorial ilerlet
        if (this.tutorialActive && this.currentTutorialStep === 0) {
            this.nextTutorialStep();
        }
    }

    createMaterialsPanel() {
        // Malzemeler paneli (sağ)
        const panelBg = new PIXI.Graphics();
        panelBg.beginFill(0x795548);
        panelBg.drawRoundedRect(this.app.screen.width - 140, 60, 130, 500, 15);
        panelBg.endFill();
        this.app.stage.addChild(panelBg);

        const titleBg = new PIXI.Graphics();
        titleBg.beginFill(0x81C784);
        titleBg.drawRoundedRect(this.app.screen.width - 130, 70, 110, 35, 8);
        titleBg.endFill();
        this.app.stage.addChild(titleBg);

        const title = new PIXI.Text('📦 Malzeme', {
            fontFamily: 'Arial',
            fontSize: 16,
            fill: 0x1B5E20,
            fontWeight: 'bold'
        });
        title.x = this.app.screen.width - 118;
        title.y = 77;
        this.app.stage.addChild(title);

        const materialTypes = Object.keys(this.inventory);
        materialTypes.forEach((type, index) => {
            this.createMaterialSlot(type, index);
        });
    }

    createMaterialSlot(type, index) {
        const material = this.inventory[type];
        const container = new PIXI.Container();
        container.x = this.app.screen.width - 130;
        container.y = 115 + index * 52;
        container.interactive = true;
        container.buttonMode = true;
        container.cursor = 'grab';

        const bg = new PIXI.Graphics();
        bg.beginFill(0xE8F5E9);
        bg.lineStyle(2, 0x81C784);
        bg.drawRoundedRect(0, 0, 110, 45, 8);
        bg.endFill();
        container.addChild(bg);

        const emoji = new PIXI.Text(material.emoji, { fontSize: 24 });
        emoji.x = 8;
        emoji.y = 8;
        container.addChild(emoji);

        const countText = new PIXI.Text(`×${material.count}`, {
            fontFamily: 'Arial',
            fontSize: 14,
            fill: 0x1B5E20,
            fontWeight: 'bold'
        });
        countText.x = 40;
        countText.y = 12;
        countText.name = `count_${type}`;
        container.addChild(countText);

        const nameText = new PIXI.Text(material.name, {
            fontFamily: 'Arial',
            fontSize: 10,
            fill: 0x4CAF50
        });
        nameText.x = 70;
        nameText.y = 15;
        container.addChild(nameText);

        container
            .on('pointerdown', (e) => this.onMaterialDragStart(e, type))
            .on('pointerup', (e) => this.onMaterialDragEnd(e))
            .on('pointerupoutside', (e) => this.onMaterialDragEnd(e))
            .on('pointermove', (e) => this.onMaterialDragMove(e));

        container.materialType = type;
        this.app.stage.addChild(container);
    }

    onMaterialDragStart(event, type) {
        if (this.inventory[type].count <= 0) {
            this.showMessage('❌ Bu malzemeden kalmadı!', 0xF44336);
            this.playSound('error');
            return;
        }

        const material = this.inventory[type];
        const copy = new PIXI.Container();

        const bg = new PIXI.Graphics();
        bg.beginFill(0xFFFFFF, 0.9);
        bg.lineStyle(3, 0x4CAF50);
        bg.drawRoundedRect(-30, -25, 60, 50, 10);
        bg.endFill();
        copy.addChild(bg);

        const emoji = new PIXI.Text(material.emoji, { fontSize: 36 });
        emoji.anchor.set(0.5);
        copy.addChild(emoji);

        copy.x = event.data.global.x;
        copy.y = event.data.global.y;
        copy.alpha = 0.85;
        copy.materialType = type;
        copy.materialData = material;

        this.draggedItem = copy;
        this.app.stage.addChild(copy);

        // Tutorial ilerlet
        if (this.tutorialActive && this.currentTutorialStep === 1) {
            this.nextTutorialStep();
        }
    }

    onMaterialDragMove(event) {
        if (this.draggedItem) {
            this.draggedItem.x = event.data.global.x;
            this.draggedItem.y = event.data.global.y;

            // Tezgah üzerinde mi kontrol et - görsel feedback
            const x = event.data.global.x;
            const y = event.data.global.y;
            if (x > 160 && x < this.app.screen.width - 160 && y > 80 && y < this.app.screen.height - 100) {
                this.draggedItem.alpha = 1;
                this.draggedItem.scale.set(1.1);
            } else {
                this.draggedItem.alpha = 0.7;
                this.draggedItem.scale.set(1);
            }
        }
    }

    onMaterialDragEnd(event) {
        if (!this.draggedItem) return;

        const x = event.data.global.x;
        const y = event.data.global.y;

        // Çalışma tezgahına bırakıldı mı
        if (x > 160 && x < this.app.screen.width - 160 && y > 80 && y < this.app.screen.height - 100) {
            this.draggedItem.x = x;
            this.draggedItem.y = y;
            this.draggedItem.alpha = 1;
            this.draggedItem.scale.set(1);

            // Etkileşimli yap
            this.draggedItem.interactive = true;
            this.draggedItem.buttonMode = true;
            this.draggedItem.on('pointerdown', (e) => this.onWorkbenchItemClick(e, this.draggedItem));

            this.createdItems.push(this.draggedItem);

            // Envanterden düş
            this.inventory[this.draggedItem.materialType].count--;
            this.updateInventoryDisplay();

            this.showMessage(`✅ ${this.draggedItem.materialData.name} eklendi!`, 0x4CAF50);
            this.playSound('place');

            // İcat kontrolü
            this.checkForInventions();

            // Tutorial ilerlet
            if (this.tutorialActive && this.currentTutorialStep === 2) {
                this.nextTutorialStep();
            }
        } else {
            this.app.stage.removeChild(this.draggedItem);
            this.showMessage('⚠️ Tezgaha bırak!', 0xFF9800);
        }

        this.draggedItem = null;
    }

    onWorkbenchItemClick(event, item) {
        // Tıklanan öğeyi çıkarmak için
        if (event.data.originalEvent.shiftKey) {
            this.removeItemFromWorkbench(item);
        }
    }

    removeItemFromWorkbench(item) {
        const index = this.createdItems.indexOf(item);
        if (index > -1) {
            this.createdItems.splice(index, 1);
            this.inventory[item.materialType].count++;
            this.updateInventoryDisplay();
            this.app.stage.removeChild(item);
            this.showMessage('↩️ Malzeme geri alındı!', 0x2196F3);
            this.playSound('click');
        }
    }

    createWorkbench() {
        // Çalışma tezgahı
        const workbench = new PIXI.Graphics();

        // Gölge
        workbench.beginFill(0x5D4037, 0.2);
        workbench.drawRoundedRect(165, 85, this.app.screen.width - 320, 470, 20);
        workbench.endFill();

        // Ana alan
        workbench.lineStyle(4, 0x8D6E63);
        workbench.beginFill(0xD7CCC8, 0.3);
        workbench.drawRoundedRect(160, 80, this.app.screen.width - 320, 470, 20);
        workbench.endFill();

        this.app.stage.addChild(workbench);

        // Tezgah etiketi
        const labelBg = new PIXI.Graphics();
        labelBg.beginFill(0xBCAAA4);
        labelBg.drawRoundedRect(this.app.screen.width / 2 - 150, 90, 300, 35, 8);
        labelBg.endFill();
        this.app.stage.addChild(labelBg);

        const label = new PIXI.Text('🔨 Malzemeleri buraya sürükle ve icat yap!', {
            fontFamily: 'Arial',
            fontSize: 16,
            fill: 0x5D4037,
            fontWeight: 'bold'
        });
        label.anchor.set(0.5);
        label.x = this.app.screen.width / 2;
        label.y = 107;
        this.app.stage.addChild(label);
    }

    createRecipeBook() {
        // Reçete kitabı butonu
        const bookBtn = new PIXI.Container();
        bookBtn.x = 20;
        bookBtn.y = 420;
        bookBtn.interactive = true;
        bookBtn.buttonMode = true;
        bookBtn.cursor = 'pointer';

        const bg = new PIXI.Graphics();
        bg.beginFill(0x3F51B5);
        bg.drawRoundedRect(0, 0, 110, 45, 10);
        bg.endFill();
        bookBtn.addChild(bg);

        const text = new PIXI.Text('📖 Reçeteler', {
            fontFamily: 'Arial',
            fontSize: 14,
            fill: 0xFFFFFF,
            fontWeight: 'bold'
        });
        text.x = 10;
        text.y = 12;
        bookBtn.addChild(text);

        bookBtn.on('pointerdown', () => this.showRecipeBook());
        bookBtn.on('pointerover', () => {
            bg.clear();
            bg.beginFill(0x5C6BC0);
            bg.drawRoundedRect(0, 0, 110, 45, 10);
            bg.endFill();
        });
        bookBtn.on('pointerout', () => {
            bg.clear();
            bg.beginFill(0x3F51B5);
            bg.drawRoundedRect(0, 0, 110, 45, 10);
            bg.endFill();
        });

        this.app.stage.addChild(bookBtn);
    }

    showRecipeBook() {
        // Reçete overlay
        const overlay = new PIXI.Container();
        overlay.name = 'recipeOverlay';

        // Karartma
        const darkness = new PIXI.Graphics();
        darkness.beginFill(0x000000, 0.7);
        darkness.drawRect(0, 0, this.app.screen.width, this.app.screen.height);
        darkness.endFill();
        darkness.interactive = true;
        overlay.addChild(darkness);

        // Kitap paneli
        const panel = new PIXI.Graphics();
        panel.beginFill(0xFFF8E1);
        panel.lineStyle(4, 0x8D6E63);
        panel.drawRoundedRect(100, 50, 700, 550, 20);
        panel.endFill();
        overlay.addChild(panel);

        // Başlık
        const title = new PIXI.Text('📖 İcat Reçeteleri', {
            fontFamily: 'Fredoka One, Arial',
            fontSize: 28,
            fill: 0x5D4037
        });
        title.x = 450 - title.width / 2;
        title.y = 70;
        overlay.addChild(title);

        // Reçeteleri listele
        const recipes = Object.entries(this.inventionRecipes);
        recipes.forEach(([key, recipe], index) => {
            const row = index % 4;
            const col = Math.floor(index / 4);

            const card = new PIXI.Container();
            card.x = 130 + col * 340;
            card.y = 120 + row * 120;

            const cardBg = new PIXI.Graphics();
            const completed = this.completedInventions.includes(key);
            cardBg.beginFill(completed ? 0xC8E6C9 : 0xFFFFFF);
            cardBg.lineStyle(2, completed ? 0x4CAF50 : 0xBDBDBD);
            cardBg.drawRoundedRect(0, 0, 320, 100, 10);
            cardBg.endFill();
            card.addChild(cardBg);

            const nameText = new PIXI.Text(recipe.name + (completed ? ' ✅' : ''), {
                fontFamily: 'Arial',
                fontSize: 18,
                fill: 0x333333,
                fontWeight: 'bold'
            });
            nameText.x = 10;
            nameText.y = 10;
            card.addChild(nameText);

            // Malzemeler
            let materialText = 'Malzemeler: ';
            Object.entries(recipe.materials).forEach(([mat, count]) => {
                materialText += `${this.inventory[mat].emoji}×${count} `;
            });
            const matText = new PIXI.Text(materialText, {
                fontFamily: 'Arial',
                fontSize: 14,
                fill: 0x666666
            });
            matText.x = 10;
            matText.y = 40;
            card.addChild(matText);

            const pointsText = new PIXI.Text(`⭐ ${recipe.points} puan`, {
                fontFamily: 'Arial',
                fontSize: 14,
                fill: 0xFF9800,
                fontWeight: 'bold'
            });
            pointsText.x = 10;
            pointsText.y = 70;
            card.addChild(pointsText);

            overlay.addChild(card);
        });

        // Kapatma butonu
        const closeBtn = new PIXI.Container();
        closeBtn.x = 750;
        closeBtn.y = 60;
        closeBtn.interactive = true;
        closeBtn.buttonMode = true;
        closeBtn.cursor = 'pointer';

        const closeBg = new PIXI.Graphics();
        closeBg.beginFill(0xF44336);
        closeBg.drawCircle(0, 0, 20);
        closeBg.endFill();
        closeBtn.addChild(closeBg);

        const closeX = new PIXI.Text('✕', {
            fontSize: 24,
            fill: 0xFFFFFF,
            fontWeight: 'bold'
        });
        closeX.anchor.set(0.5);
        closeBtn.addChild(closeX);

        closeBtn.on('pointerdown', () => {
            this.app.stage.removeChild(overlay);
            this.playSound('click');
        });
        overlay.addChild(closeBtn);

        this.app.stage.addChild(overlay);
        this.playSound('click');
    }

    createScorePanel() {
        const panel = new PIXI.Container();
        panel.x = 20;
        panel.y = 475;

        const bg = new PIXI.Graphics();
        bg.beginFill(0xFFC107);
        bg.drawRoundedRect(0, 0, 110, 80, 10);
        bg.endFill();
        panel.addChild(bg);

        this.scoreText = new PIXI.Text('⭐ 0', {
            fontFamily: 'Fredoka One, Arial',
            fontSize: 28,
            fill: 0x5D4037
        });
        this.scoreText.x = 10;
        this.scoreText.y = 10;
        panel.addChild(this.scoreText);

        this.inventionCountText = new PIXI.Text('İcat: 0/8', {
            fontFamily: 'Arial',
            fontSize: 14,
            fill: 0x5D4037
        });
        this.inventionCountText.x = 10;
        this.inventionCountText.y = 50;
        panel.addChild(this.inventionCountText);

        this.app.stage.addChild(panel);
    }

    createTutorialOverlay() {
        this.tutorialOverlay = new PIXI.Container();
        this.tutorialOverlay.visible = false;

        const bg = new PIXI.Graphics();
        bg.beginFill(0x000000, 0.5);
        bg.drawRect(0, 0, this.app.screen.width, this.app.screen.height);
        bg.endFill();
        this.tutorialOverlay.addChild(bg);

        this.tutorialBox = new PIXI.Container();
        this.tutorialOverlay.addChild(this.tutorialBox);

        this.app.stage.addChild(this.tutorialOverlay);
    }

    startTutorial() {
        this.tutorialSteps = [
            {
                text: '🔧 İlk önce sol panelden bir araç seç!',
                highlight: { x: 10, y: 60, w: 130, h: 350 }
            },
            {
                text: '📦 Şimdi sağ panelden malzeme sürükle!',
                highlight: { x: this.app.screen.width - 140, y: 60, w: 130, h: 500 }
            },
            {
                text: '🔨 Malzemeleri tezgaha bırak!',
                highlight: { x: 160, y: 80, w: this.app.screen.width - 320, h: 470 }
            },
            {
                text: '📖 Reçete kitabından icatları öğren!',
                highlight: { x: 20, y: 420, w: 110, h: 45 }
            }
        ];

        this.showTutorialStep(0);
    }

    showTutorialStep(step) {
        if (step >= this.tutorialSteps.length) {
            this.tutorialOverlay.visible = false;
            this.tutorialActive = false;
            this.showMessage('🎉 Hazırsın! Şimdi icat yapabilirsin!', 0x4CAF50);
            return;
        }

        const tutorialData = this.tutorialSteps[step];
        this.tutorialOverlay.visible = true;

        // Clear previous
        this.tutorialBox.removeChildren();

        // Highlight area
        const highlight = new PIXI.Graphics();
        highlight.lineStyle(4, 0xFFEB3B);
        highlight.drawRoundedRect(
            tutorialData.highlight.x,
            tutorialData.highlight.y,
            tutorialData.highlight.w,
            tutorialData.highlight.h,
            10
        );
        this.tutorialBox.addChild(highlight);

        // Animasyon
        let pulseDir = 1;
        const animate = () => {
            if (!this.tutorialOverlay.visible) return;
            highlight.alpha += 0.02 * pulseDir;
            if (highlight.alpha >= 1 || highlight.alpha <= 0.5) pulseDir *= -1;
            requestAnimationFrame(animate);
        };
        animate();

        // Text box
        const textBox = new PIXI.Graphics();
        textBox.beginFill(0xFFFFFF);
        textBox.drawRoundedRect(this.app.screen.width / 2 - 200, 550, 400, 60, 10);
        textBox.endFill();
        this.tutorialBox.addChild(textBox);

        const text = new PIXI.Text(tutorialData.text, {
            fontFamily: 'Arial',
            fontSize: 18,
            fill: 0x333333,
            fontWeight: 'bold'
        });
        text.anchor.set(0.5);
        text.x = this.app.screen.width / 2;
        text.y = 580;
        this.tutorialBox.addChild(text);
    }

    nextTutorialStep() {
        this.currentTutorialStep++;
        setTimeout(() => {
            this.showTutorialStep(this.currentTutorialStep);
        }, 500);
    }

    createHintButton() {
        const hintBtn = new PIXI.Container();
        hintBtn.x = 20;
        hintBtn.y = 560;
        hintBtn.interactive = true;
        hintBtn.buttonMode = true;
        hintBtn.cursor = 'pointer';

        const bg = new PIXI.Graphics();
        bg.beginFill(0x9C27B0);
        bg.drawRoundedRect(0, 0, 110, 40, 10);
        bg.endFill();
        hintBtn.addChild(bg);

        const text = new PIXI.Text('💡 İpucu', {
            fontFamily: 'Arial',
            fontSize: 16,
            fill: 0xFFFFFF,
            fontWeight: 'bold'
        });
        text.x = 20;
        text.y = 10;
        hintBtn.addChild(text);

        hintBtn.on('pointerdown', () => this.showHint());

        this.app.stage.addChild(hintBtn);
    }

    showHint() {
        // Mevcut malzemelere göre ipucu ver
        const currentMaterials = {};
        this.createdItems.forEach(item => {
            const type = item.materialType;
            currentMaterials[type] = (currentMaterials[type] || 0) + 1;
        });

        let hint = '';
        let bestMatch = null;
        let bestScore = 0;

        Object.entries(this.inventionRecipes).forEach(([key, recipe]) => {
            if (this.completedInventions.includes(key)) return;

            let matchScore = 0;
            let missing = [];

            Object.entries(recipe.materials).forEach(([mat, count]) => {
                const have = currentMaterials[mat] || 0;
                matchScore += Math.min(have, count);
                if (have < count) {
                    missing.push(`${this.inventory[mat].emoji}×${count - have}`);
                }
            });

            if (matchScore > bestScore) {
                bestScore = matchScore;
                bestMatch = { recipe, key, missing };
            }
        });

        if (bestMatch && bestMatch.missing.length > 0) {
            hint = `${bestMatch.recipe.name} için: ${bestMatch.missing.join(' ')} ekle!`;
        } else if (bestMatch && bestMatch.missing.length === 0) {
            hint = `${bestMatch.recipe.name} yapmak için araç kullan! 🔨`;
        } else {
            hint = 'Reçete kitabına bak ve malzeme ekle! 📖';
        }

        this.showMessage(hint, 0x9C27B0);
        this.playSound('click');
    }

    checkForInventions() {
        const currentMaterials = {};
        this.createdItems.forEach(item => {
            const type = item.materialType;
            currentMaterials[type] = (currentMaterials[type] || 0) + 1;
        });

        Object.entries(this.inventionRecipes).forEach(([key, recipe]) => {
            if (this.completedInventions.includes(key)) return;

            let canMake = true;
            Object.entries(recipe.materials).forEach(([mat, count]) => {
                if ((currentMaterials[mat] || 0) < count) {
                    canMake = false;
                }
            });

            if (canMake) {
                this.completeInvention(key, recipe);
            }
        });
    }

    completeInvention(key, recipe) {
        this.completedInventions.push(key);
        this.score += recipe.points;

        // UI güncelle
        this.scoreText.text = `⭐ ${this.score}`;
        this.inventionCountText.text = `İcat: ${this.completedInventions.length}/8`;

        // Başarı animasyonu
        this.showInventionSuccess(recipe);

        // Kullanılan malzemeleri temizle
        Object.entries(recipe.materials).forEach(([mat, count]) => {
            let removed = 0;
            for (let i = this.createdItems.length - 1; i >= 0 && removed < count; i--) {
                if (this.createdItems[i].materialType === mat) {
                    this.app.stage.removeChild(this.createdItems[i]);
                    this.createdItems.splice(i, 1);
                    removed++;
                }
            }
        });

        // Progress callback
        if (window.updateExperimentProgress) {
            window.updateExperimentProgress(
                this.completedInventions.length,
                `${this.completedInventions.length} icat yapıldı!`
            );
        }

        this.playSound('success');
    }

    showInventionSuccess(recipe) {
        const successContainer = new PIXI.Container();
        successContainer.x = this.app.screen.width / 2;
        successContainer.y = this.app.screen.height / 2;

        // Arka plan
        const bg = new PIXI.Graphics();
        bg.beginFill(0x4CAF50, 0.95);
        bg.drawRoundedRect(-200, -100, 400, 200, 20);
        bg.endFill();
        successContainer.addChild(bg);

        // İcat ismi
        const nameText = new PIXI.Text(recipe.name, {
            fontFamily: 'Fredoka One, Arial',
            fontSize: 36,
            fill: 0xFFFFFF
        });
        nameText.anchor.set(0.5);
        nameText.y = -40;
        successContainer.addChild(nameText);

        // Puan
        const pointsText = new PIXI.Text(`+${recipe.points} ⭐`, {
            fontFamily: 'Arial',
            fontSize: 28,
            fill: 0xFFEB3B,
            fontWeight: 'bold'
        });
        pointsText.anchor.set(0.5);
        pointsText.y = 20;
        successContainer.addChild(pointsText);

        // Tebrikler
        const congrats = new PIXI.Text('🎉 TEBRİKLER! 🎉', {
            fontFamily: 'Arial',
            fontSize: 24,
            fill: 0xFFFFFF
        });
        congrats.anchor.set(0.5);
        congrats.y = 60;
        successContainer.addChild(congrats);

        // Animasyon
        successContainer.scale.set(0);
        this.app.stage.addChild(successContainer);

        // Scale up animation
        let scale = 0;
        const scaleUp = () => {
            scale += 0.08;
            successContainer.scale.set(Math.min(scale, 1));
            if (scale < 1) {
                requestAnimationFrame(scaleUp);
            }
        };
        scaleUp();

        // Confetti
        this.createConfetti();

        // Remove after delay
        setTimeout(() => {
            let alpha = 1;
            const fadeOut = () => {
                alpha -= 0.05;
                successContainer.alpha = alpha;
                if (alpha > 0) {
                    requestAnimationFrame(fadeOut);
                } else {
                    this.app.stage.removeChild(successContainer);
                }
            };
            fadeOut();
        }, 3000);
    }

    createConfetti() {
        const colors = [0xFFEB3B, 0xFF5722, 0x4CAF50, 0x2196F3, 0xE91E63];

        for (let i = 0; i < 50; i++) {
            setTimeout(() => {
                const confetti = new PIXI.Graphics();
                const color = colors[Math.floor(Math.random() * colors.length)];
                confetti.beginFill(color);
                confetti.drawRect(-5, -5, 10, 10);
                confetti.endFill();

                confetti.x = Math.random() * this.app.screen.width;
                confetti.y = -20;
                confetti.rotation = Math.random() * Math.PI * 2;
                confetti.vx = (Math.random() - 0.5) * 3;
                confetti.vy = 2 + Math.random() * 3;
                confetti.vr = (Math.random() - 0.5) * 0.2;

                this.app.stage.addChild(confetti);

                const animate = () => {
                    confetti.x += confetti.vx;
                    confetti.y += confetti.vy;
                    confetti.rotation += confetti.vr;
                    confetti.vy += 0.1;

                    if (confetti.y < this.app.screen.height + 50) {
                        requestAnimationFrame(animate);
                    } else {
                        this.app.stage.removeChild(confetti);
                    }
                };
                animate();
            }, i * 30);
        }
    }

    updateInventoryDisplay() {
        this.app.stage.children.forEach(child => {
            if (child.materialType) {
                const countText = child.children.find(c => c.name === `count_${child.materialType}`);
                if (countText) {
                    countText.text = `×${this.inventory[child.materialType].count}`;
                }
            }
        });
    }

    showTooltip(text, x, y) {
        this.hideTooltip();

        const tooltip = new PIXI.Container();
        tooltip.name = 'tooltip';

        const bg = new PIXI.Graphics();
        bg.beginFill(0x333333, 0.9);
        bg.drawRoundedRect(0, 0, text.length * 8 + 20, 30, 5);
        bg.endFill();
        tooltip.addChild(bg);

        const textEl = new PIXI.Text(text, {
            fontFamily: 'Arial',
            fontSize: 12,
            fill: 0xFFFFFF
        });
        textEl.x = 10;
        textEl.y = 7;
        tooltip.addChild(textEl);

        tooltip.x = x;
        tooltip.y = y;
        this.app.stage.addChild(tooltip);
    }

    hideTooltip() {
        const existing = this.app.stage.children.find(c => c.name === 'tooltip');
        if (existing) {
            this.app.stage.removeChild(existing);
        }
    }

    showMessage(text, color = 0x333333) {
        // Eski mesajı temizle
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
        container.y = 130;
        container.alpha = 0;

        this.app.stage.addChild(container);

        // Fade in
        let alpha = 0;
        const fadeIn = () => {
            alpha += 0.1;
            container.alpha = alpha;
            if (alpha < 1) requestAnimationFrame(fadeIn);
        };
        fadeIn();

        // Remove after delay
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
window.InventorWorkshopV2 = InventorWorkshopV2;
