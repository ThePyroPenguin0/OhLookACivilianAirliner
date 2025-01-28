class VeryHighValue extends Phaser.GameObjects.Sprite { // Higher value target implementation
    constructor(scene, x, y, texture, frame, pointValue) {
        super(scene, x, y, texture, frame);
        scene.add.existing(this);
        this.points = pointValue;
        this.moveSpeed = game.settings.spaceshipSpeed;
    }

    update() {
        this.x += this.moveSpeed * 2;
        if(this.x >= 10000)
        {
            this.reset();
        }
    }
    reset() {
        this.x = 0;
    }
}