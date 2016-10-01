import {AUTO, Game} from 'phaser-shim';

export default class Trugen {
    game:Game;

    constructor(containerId:string) {
        this.game = new Game(800, 600, AUTO, containerId);
        alert('WTF');
    }
}