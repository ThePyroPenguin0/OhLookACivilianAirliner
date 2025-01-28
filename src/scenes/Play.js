class Play extends Phaser.Scene {
    init() {
        this.player = this.data.get('player') || 1;
        this.p1Score = this.data.get('p1Score') || 0;
        this.p2Score = this.data.get('p2Score') || 0;
        this.gameOver = false;

        // Reset timer
        this.timeRemaining = game.settings.gameTimer;
        this.sound.stopAll();
    }

    constructor() {
        super('playScene');
    }

    create() {
        console.log(this.player);
        // Assets
        this.background = this.add.tileSprite(0, 0, 800, 600, "background").setOrigin(0, 0);
        this.add.rectangle(0, borderUISize + borderPadding, game.config.width, borderUISize * 2, 0x00FF00).setOrigin(0, 0);
        this.add.rectangle(0, 0, game.config.width, borderUISize, 0xFFFFFF).setOrigin(0, 0);
        this.add.rectangle(0, game.config.height - borderUISize, game.config.width, borderUISize, 0xFFFFFF).setOrigin(0, 0);
        this.add.rectangle(0, 0, borderUISize, game.config.height, 0xFFFFFF).setOrigin(0, 0);
        this.add.rectangle(game.config.width - borderUISize, 0, borderUISize, game.config.height, 0xFFFFFF).setOrigin(0, 0);

        // Objects
        this.p1Rocket = new Rocket(this, game.config.width / 2, game.config.height - borderUISize - borderPadding, "rocket").setOrigin(0.5, 0);
        this.ship01 = new LowValue(this, game.config.width + borderUISize * 6, borderUISize * 2 + borderPadding * 2, 'lowValue', 0, -5).setOrigin(0, 0)
        this.ship02 = new HighValue(this, game.config.width + borderUISize * 3, borderUISize * 4 + borderPadding * 4, 'highValue', 0, 20).setOrigin(0, 0)
        this.ship03 = new LowValue(this, game.config.width + borderUISize * 6, borderUISize * 6 + borderPadding * 6, 'lowValue', 0, -10).setOrigin(0, 0)
        this.shipSpecial = new VeryHighValue(this, -10246, borderUISize * 12 + borderPadding * 10, 'veryHighValue', 0, 100).setOrigin(0,0);
        this.ship04 = new LowValue(this, game.config.width + borderUISize * 1, borderUISize * 8 + borderPadding * 8, 'lowValue', 0, -15).setOrigin(0, 0)
        this.ship05 = new HighValue(this, -80, borderUISize * 10 + borderPadding * 10, 'highValue', 0, 10).setOrigin(0, 0)
        this.ship06 = new LowValue(this, game.config.width + borderUISize * 12, borderUISize * 12 + borderPadding * 12, 'lowValue', 0, -20).setOrigin(0, 0)


        // I'm not a contrarian, I just don't know how else to make these smaller :(
        this.p1Rocket.setScale(0.75);
        this.ship01.setScale(0.5);
        this.ship02.setScale(0.5);
        this.ship03.setScale(0.5);
        this.shipSpecial.setScale(0.4);
        this.ship04.setScale(0.5);
        this.ship05.setScale(0.5);
        this.ship06.setScale(0.5);

        // Controls
        keyFIRE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F);
        keyRESET = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);

        // Score
        this.scoreConfig =
        {
            fontFamily: "Courier",
            fontSize: "22px",
            backgroundColor: "#F3B141",
            color: "#843605",
            align: "center",
            padding:
            {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 150
        }

        this.scoreLeft = this.add.text(borderUISize + borderPadding, borderUISize + borderPadding * 2, "SCORE: " + this.p1Rocket.score, this.scoreConfig);

        // Timer
        this.gameOver = false;
        this.scoreConfig.fixedWidth = 0;
        this.createTimer();
        this.timerText = this.add.text(game.config.width - 200, 58, "TIME REMAINING: " + this.timeRemaining, this.scoreConfig).setOrigin(0.5);
    }

    update() {

        // Endless two-player implementation
        if (this.gameOver && Phaser.Input.Keyboard.JustDown(keyRESET)) {
            this.scene.restart();
        }
        else if (this.gameOver && Phaser.Input.Keyboard.JustDown(keyLEFT)) {
            this.scene.start("menuScene");
        }
        else if (this.gameOver && Phaser.Input.Keyboard.JustDown(keyRIGHT)) {
            if (this.player == 1) {
                this.data.set('p1Score', this.p1Score + this.p1Rocket.score);
                this.data.set('player', 2);
                this.scene.restart();
            }
            else if(this.player == 2){
                this.data.set('p2Score', this.p2Score + this.p1Rocket.score);
                this.data.set('player', 1);
                this.scene.restart();
            }
        }

        this.background.tilePositionX -= 1;
        this.p1Rocket.update();

        if (!this.gameOver) {
            this.ship01.update();
            this.ship02.update();
            this.ship03.update();
            this.shipSpecial.update();
            this.ship04.update();
            this.ship05.update();
            this.ship06.update();
        }

        // Mouse targeting implementation
        if (this.p1Rocket.xLocked == false && this.gameOver == false) {
            this.input.on('pointermove', (pointer) => {
                this.p1Rocket.x = Phaser.Math.Clamp(pointer.x, borderUISize, game.config.width - borderUISize);
            });
        }

        // Target lock mechanism
        this.input.on('pointerdown', () => {
            this.sound.stopByKey('sfx-shot');
            this.sound.play('sfx-shot', { volume: 0.2 });
            this.p1Rocket.xLocked = true;
            this.xLock = this.p1Rocket.x;
            
            this.time.delayedCall(2500, () => {
                this.p1Rocket.isFiring = true;
            }, null, this);
        })

        if (this.p1Rocket.xLocked) {
            this.p1Rocket.x = this.xLock;
        }

        if (this.checkCollision(this.p1Rocket, this.ship01)) {
            this.shipExplode(this.ship01);
            this.p1Rocket.reset();
        }

        if (this.checkCollision(this.p1Rocket, this.ship02)) {
            this.shipExplode(this.ship02);
            this.p1Rocket.reset();
        }


        if (this.checkCollision(this.p1Rocket, this.ship03)) {
            this.shipExplode(this.ship03);
            this.p1Rocket.reset();
        }

        if (this.checkCollision(this.p1Rocket, this.ship04)) {
            this.shipExplode(this.ship04);
            this.p1Rocket.reset();
        }

        if (this.checkCollision(this.p1Rocket, this.ship05)) {
            this.shipExplode(this.ship05);
            this.p1Rocket.reset();
        }

        if (this.checkCollision(this.p1Rocket, this.ship06)) {
            this.shipExplode(this.ship06);
            this.p1Rocket.reset();
        }

        if (this.checkCollision(this.p1Rocket, this.shipSpecial)) {
            this.shipExplode(this.shipSpecial);
            this.p1Rocket.reset();
        }


    }

    checkCollision(rocket, ship) {
        if (rocket.x < ship.x + ship.width && rocket.x + rocket.width > ship.x && rocket.y < ship.y + ship.height && rocket.height + rocket.y > ship.y) {
            return true
        }
        else {
            return false
        }
    }

    shipExplode(ship) {
        ship.alpha = 0;
        let boom = this.add.sprite(ship.x, ship.y, "explosion").setOrigin(0, 0);
        boom.setScale(2);
        boom.anims.play("explode");
        boom.on("animationcomplete", () => {
            ship.reset();
            ship.alpha = 1;
            boom.destroy();
        })
        this.p1Rocket.score += ship.points;
        this.timeRemaining += ship.points;
        this.createTimer();
        this.scoreLeft.text = "SCORE: " + this.p1Rocket.score;
        this.sound.play("sfx-explosion");
    }

    // Adaptive timer implementation
    createTimer() {
        if (this.sceneTimer) {
            this.time.removeEvent(this.sceneTimer);
            this.sceneTimer = undefined;
        }

        this.sceneTimer = this.time.addEvent({
            delay: 1000,
            repeat: this.timeRemaining,
            callback: () => {
                this.timeRemaining--;
                console.log("Time remaining: " + this.timeRemaining);
                this.timerText.setText("TIME REMAINING: " + this.timeRemaining);
                if (this.timeRemaining <= 0 && this.player == 1) {
                    this.gameOver = true;
                    console.log("Player 1 score: " + this.p1Rocket.score);
                    this.add.text(game.config.width / 2, game.config.height / 2 + 64, 'Press (R) to Restart, (LEFT) for Menu,\nor (RIGHT) for Player Two.', this.scoreConfig).setOrigin(0.5);
                }
                else if (this.timeRemaining <= 0 && this.player == 2) {
                    this.gameOver = true;
                    console.log("Player 2 score: " + this.p1Rocket.score);
                    this.add.text(game.config.width / 2, game.config.height / 2, 'Current Scores: ' + this.p1Score + " and " + this.p1Rocket.score + "\nPress (RIGHT) to keep playing.", this.scoreConfig).setOrigin(0.5)
                }
            },
            callbackScope: this,
        });
    }
}