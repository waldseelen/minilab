// Planet Orbit Game - Pixi.js Script

class OrbitGame {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.container.innerHTML = '';

        this.app = new PIXI.Application({
            width: 800,
            height: 600,
            backgroundColor: 0x000022, // Dark space blue
            resolution: window.devicePixelRatio || 1,
            antialias: true
        });
        this.container.appendChild(this.app.view);

        this.planets = [];
        this.sun = null;
        this.G = 0.5; // Gravity constant (tweaked for game feel)

        this.setup();

        // Game loop
        this.app.ticker.add((delta) => this.update(delta));
    }

    setup() {
        // Starfield background
        this.createStars();

        // Sun
        this.sun = new PIXI.Graphics();
        this.sun.beginFill(0xFFD700); // Gold
        this.sun.drawCircle(0, 0, 40);
        this.sun.endFill();

        // Sun Glow
        const glow = new PIXI.Graphics();
        glow.beginFill(0xFFD700, 0.3);
        glow.drawCircle(0, 0, 60);
        glow.endFill();
        this.sun.addChild(glow);

        this.sun.x = this.app.screen.width / 2;
        this.sun.y = this.app.screen.height / 2;
        this.sun.mass = 1000;
        this.app.stage.addChild(this.sun);

        // Instructions
        const style = new PIXI.TextStyle({
            fontFamily: 'Arial',
            fontSize: 20,
            fill: '#FFFFFF',
            align: 'center'
        });
        const text = new PIXI.Text("Gezegen eklemek için boşluğa tıkla!", style);
        text.x = this.app.screen.width / 2 - text.width / 2;
        text.y = 50;
        this.app.stage.addChild(text);

        // Click to add planet
        this.app.stage.interactive = true;
        this.app.stage.hitArea = this.app.screen;
        this.app.stage.on('pointerdown', (event) => {
            const pos = event.data.getLocalPosition(this.app.stage);
            this.createPlanet(pos.x, pos.y);
        });

        // Reset Button
        this.createResetButton();
    }

    createStars() {
        const stars = new PIXI.Graphics();
        stars.beginFill(0xFFFFFF);
        for (let i = 0; i < 200; i++) {
            const x = Math.random() * this.app.screen.width;
            const y = Math.random() * this.app.screen.height;
            const size = Math.random() * 2;
            stars.drawCircle(x, y, size);
        }
        stars.endFill();
        this.app.stage.addChild(stars);
    }

    createPlanet(x, y) {
        const planet = new PIXI.Graphics();
        const color = Math.random() * 0xFFFFFF;
        planet.beginFill(color);
        planet.drawCircle(0, 0, 10);
        planet.endFill();

        planet.x = x;
        planet.y = y;

        // Calculate initial velocity for a somewhat stable orbit
        // v = sqrt(GM/r) for circular orbit
        const dx = x - this.sun.x;
        const dy = y - this.sun.y;
        const r = Math.sqrt(dx * dx + dy * dy);
        const v = Math.sqrt(this.G * this.sun.mass / r);

        // Perpendicular vector (-dy, dx) normalized
        planet.vx = (-dy / r) * v;
        planet.vy = (dx / r) * v;

        this.app.stage.addChild(planet);
        this.planets.push(planet);

        // Play sound
        if (window.playSound) window.playSound('click');

        // Update progress
        if (window.updateExperimentProgress) {
            window.updateExperimentProgress(Math.min(3, this.planets.length), `${this.planets.length} Gezegen!`);
        }
    }

    update(delta) {
        for (let planet of this.planets) {
            const dx = this.sun.x - planet.x;
            const dy = this.sun.y - planet.y;
            const distSq = dx * dx + dy * dy;
            const dist = Math.sqrt(distSq);

            // Gravity force
            // F = G * M * m / r^2
            // a = F / m = G * M / r^2
            const force = this.G * this.sun.mass / distSq;

            const ax = force * (dx / dist);
            const ay = force * (dy / dist);

            planet.vx += ax * delta;
            planet.vy += ay * delta;

            planet.x += planet.vx * delta;
            planet.y += planet.vy * delta;

            // Collision with sun (simple removal)
            if (dist < 50) {
                planet.alpha = 0; // Hide
                // Ideally remove from array but for simplicity just hide
            }
        }
    }

    createResetButton() {
        const btn = new PIXI.Graphics();
        btn.beginFill(0x333333);
        btn.lineStyle(1, 0xFFFFFF);
        btn.drawRoundedRect(0, 0, 100, 40, 10);
        btn.endFill();
        btn.x = this.app.screen.width - 120;
        btn.y = 20;
        btn.interactive = true;
        btn.buttonMode = true;
        btn.cursor = 'pointer';

        const text = new PIXI.Text("Temizle", { fontSize: 16, fontFamily: 'Arial', fill: '#FFFFFF' });
        text.x = 50 - text.width / 2;
        text.y = 20 - text.height / 2;
        btn.addChild(text);

        btn.on('pointerdown', (e) => {
            e.stopPropagation(); // Prevent creating a planet under the button
            for (let p of this.planets) {
                this.app.stage.removeChild(p);
            }
            this.planets = [];
            if (window.updateExperimentProgress) {
                window.updateExperimentProgress(0, "Gezegen ekle!");
            }
        });

        this.app.stage.addChild(btn);
    }
}
