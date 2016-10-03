import Character from "./character";
import {CursorKeys, KeyCode, Key, Pointer} from 'phaser-shim';

abstract class FirstPerson extends Character {
    private _spacebar: Key;
    protected keys: CursorKeys;
    protected pointer: Pointer;

    anyKeyIsDown(): boolean {
        return this.keys.up.isDown || this.keys.down.isDown || this.keys.left.isDown || this.keys.right.isDown || this.touchingScreen();
    }

    constructor(game) {
        super(game);
        this.jumpVelocity = 300;
        this.pointer = game.input.pointer1 != null ? game.input.pointer1 : game.input.activePointer;
    }

    create(): void {
        super.create();
        this._spacebar = this.game.input.keyboard.addKey(KeyCode.SPACEBAR);
        this._spacebar.onDown.add(() => {
            this.jump();
        });

        this.keys = this.game.input.keyboard.createCursorKeys();
    }

    touchingScreen(): boolean {
        return this.pointer.isDown;
    }

    update(): void {
        super.update();

        this.updatePointer();

        if (this._spacebar.isDown) {
            this.jump();
        }

        if (this.anyKeyIsDown()) {
            if (this.keys.up.isDown) {
                this.up();
            } else if (this.keys.down.isDown) {
                this.down();
            }

            if (this.keys.left.isDown) {
                this.left();
            } else if (this.keys.right.isDown) {
                this.right();
            }
        } else {
            this.idle();
        }
    }

    updatePointer(): void {
        if (this.pointer.isDown) {
            if (this.pointer.worldX < this.sprite.x)
                this.left();
            else if (this.pointer.worldX > this.sprite.x)
                this.right();
        }
    }
}

export default FirstPerson;