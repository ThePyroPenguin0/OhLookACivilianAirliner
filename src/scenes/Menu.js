class Menu extends Phaser.Scene
{
    constructor()
    {
        super("menuScene");
    }

    preload()
    {
        this.load.image("rocket", "./assets/RIM66(2).png");
        this.load.image("highValue", "./assets/MIG21(2).png");
        this.load.image("veryHighValue", "./assets/F18(2).png");
        this.load.image("lowValue", "./assets/B747(2).png");
        this.load.image("background", "./assets/bg2(vSv_Entertainment).png");
        this.load.spritesheet("explosion", "./assets/customExplosionPNGEgg.png",
        {
            frameWidth: 70,
            frameHeight: 70,
            startFrame: 0,
            endFrame: 25
        })


        this.load.audio('sfx-select', './assets/sfx-select.wav')
        this.load.audio('sfx-explosion', './assets/explosion2.mp3')
        this.load.audio('sfx-shot', './assets/fire.ogg')
    }
    create()
    {
        this.anims.create
        (
            {
                key: "explode",
                frames: this.anims.generateFrameNumbers("explosion", {start: 0, end: 15, first: 3}),
                frameRate: 12
            }
        )
        
        let menuConfig = 
        {
            fontFamily: "Courier",
            fontSize: "22px",
            backgroundColor: "#F3B141",
            color: "#843605",
            align: "right",
            padding:
            {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 0
        }

        this.add.text(game.config.width/2, game.config.height/2 - borderUISize - borderPadding, " OH LOOK, A CIVILIAN AIRLINER! \n (A Surface to Air Simulation) ", menuConfig).setOrigin(0.5);
        this.add.text(game.config.width/2, game.config.height/2, "Use arrow keys to move & press (F) to fire", menuConfig).setOrigin(0.5);
        menuConfig.backgroundColor= "#00FF00";
        menuConfig.color = "#000";
        this.add.text(game.config.width/2, game.config.height/2 + borderUISize + borderPadding*2, " Press (Left) for Novice Difficulty \n or (Right) for Expert Difficulty ", menuConfig).setOrigin(0.5);

        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
    }

    update()
    {
        if (Phaser.Input.Keyboard.JustDown(keyLEFT)) 
            {
                game.settings =
                {
                    spaceshipSpeed: 3,
                    gameTimer: 60    
                }
                this.sound.play('sfx-select');
                this.scene.start('playScene');   
            }
          if (Phaser.Input.Keyboard.JustDown(keyRIGHT)) 
            {
                game.settings =
                {
                    spaceshipSpeed: 6,
                    gameTimer: 45    
                }
                this.sound.play('sfx-select');
                this.scene.start('playScene');   
            }    
    }
}