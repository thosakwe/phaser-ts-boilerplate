import GameObject from "./game-object";
import {Point, Sprite} from 'phaser-shim';

abstract class Character extends GameObject {
    jumpVelocity:number = 250;
    speed: Point = new Point(20, 20);

    create(): void {
        super.create();
        this.idle();
    }

    down(): void {
        this.body.velocity.y = this.speed.y;
    }

    draw(x: number, y: number): Sprite {
        const sprite = super.draw(x, y);
        this.body.collideWorldBounds = true;
        this.speed.setTo(sprite.width / 2);
        return sprite;
    }

    idle(): void {
        this.body.velocity.x = 0;
    }

    jump():void {
        if (this.body.touching.down) {
            this.body.velocity.y = -1 * this.jumpVelocity;
        }
    }

    left(): void {
        this.sprite.scale.x = 1;
        this.body.velocity.x = this.speed.x * -1;
    }

    right(): void {
        this.sprite.scale.x = -1;
        this.body.velocity.x = this.speed.x;
    }

    up(): void {
        this.body.velocity.y = this.speed.y * -1;
    }
}

export default Character;