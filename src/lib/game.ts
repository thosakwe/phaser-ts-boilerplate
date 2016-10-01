import {AUTO, Game} from 'phaser-shim';

export default class MyGame {
    game:Game;

    constructor() {
        this.game = new Game(800, 600, AUTO);
    }
}