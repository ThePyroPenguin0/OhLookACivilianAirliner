class Rocket extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, frame) {
        super(scene, x, y, texture, frame);

        scene.add.existing(this);
        this.isFiring = false;
        this.moveSpeed = 1;
        this.sfxShot = scene.sound.add('sfx-shot');
        this.xLocked = false;
        this.score = 0;
    }

    // Object-side implementation of mouse tracking
    updatePosition(pointerX) {
        this.x = Phaser.Math.Clamp(pointerX, this.minX, this.maxX);
    }

    update() {
        if (this.isFiring) {
            this.y -= this.moveSpeed;
            this.moveSpeed++;
        }

        if (this.y < 0) {
            this.reset();
        }
    }

    reset() {
        this.score -= 1;
        this.isFiring = false;
        this.y = game.config.height - borderUISize - borderPadding;
        this.moveSpeed = 4;
        this.xLocked = false;
    }
}