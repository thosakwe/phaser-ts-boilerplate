import FirstPerson from "./first-person";
import {Group, Physics, Sprite} from 'phaser-shim';

export default class Protagonist extends FirstPerson {
    createSprite(): Sprite {
        const sprite = this.game.add.sprite(0, 0, 'player');
        sprite.animations.add('pedal', [0, 1, 2, 3, 4], 15, true);
        sprite.anchor.setTo(0.5, 1);
        this.game.camera.follow(sprite);
        return sprite;
    }

    create(): void {
        super.create();
        this.body.bounce.y = 0.2;
        this.speed.setTo(this.sprite.width * 5);
        this.sprite.play('pedal');
    }

    createFireball(x:number, y:number, group:Group, starMode:boolean):Sprite {
        const sprite = group.create(x, y, starMode ? 'blue fireball' : 'fireball');
        sprite.anchor.setTo(0.5);
        sprite.animations.add('burn').play(15, true);
        sprite.checkWorldBounds = true;
        sprite.outOfBoundsKill = true;
        sprite.scale.setTo(0.5 * this.sprite.scale.x, 0.5);
        this.game.physics.enable(sprite);
        const body = <Physics.Arcade.Body>sprite.body;
        body.allowGravity = false;
        body.collideWorldBounds = false;
        return sprite;
    }

    down(): void {
    }

    idle(): void {
        super.idle();
        // this.sprite.angle = 0;
        this.sprite.animations.stop();
    }

    left(): void {
        super.left();
        // this.sprite.angle = -15;
        this.sprite.play('pedal');
    }

    preload(): void {
        super.preload();
        this.game.load.spritesheet('blue fireball', 'assets/fireballoga/blue/spritesheet-512px-by197px-per-frame.png', 512, 197);
        this.game.load.spritesheet('fireball', 'assets/fireballoga/red/spritesheet-512px-by-197px-per-frame.png', 512, 197);
        this.game.load.spritesheet('player', 'assets/player.png', 100, 158);
    }

    right(): void {
        super.right();
        // this.sprite.angle = 15;
        this.sprite.play('pedal');
    }

    up(): void {
        this.jump();
    }
}