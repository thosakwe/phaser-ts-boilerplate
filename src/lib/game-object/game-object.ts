import {Game, Physics, Sprite} from 'phaser-shim';

abstract class GameObject {
    body:Physics.Arcade.Body;
    sprite:Sprite;

    constructor(protected game:Game) {}

    create():void {}

    abstract createSprite():Sprite;

    draw(x:number, y:number):Sprite {
        const sprite = this.sprite = this.createSprite();
        this.game.physics.enable(sprite);
        this.body = <Physics.Arcade.Body>this.sprite.body;
        sprite.position.setTo(x, y);
        return sprite;
    }

    preload():void {}
    update():void {}
    render():void {}
}

export default GameObject;