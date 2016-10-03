import {KeyCode, State, Text} from 'phaser-shim';
import {States} from "../index";
// import {States} from "../index";

export default class GameOverState extends State {
    private _score: number = undefined;
    text: Text;

    create(): void {
        this.stage.backgroundColor = '#000';
        this.world.resize(window.innerWidth, window.innerHeight);

        this.text = this.add.text(0, 0, `  Game Over!\n\n${this.game.device.desktop ? "Click" : "Tap"} to restart.`, {
            boundsAlignH: 'center',
            boundsAlignV: 'middle',
            fill: '#fff',
            font: '32px Arial'
        });

        /* this.text.x = this.world.width / 2 - this.text.width / 2;
        this.text.y = this.text.x = 50;
        */

        this.text.setTextBounds(0, 0, this.world.width, this.world.height);

        this.input.onDown.add(this.restart, this);
        this.input.keyboard.addKey(KeyCode.ENTER).onDown.add(this.restart, this);

        this.setScore();
    }

    init(...args) {
        if (args.length > 0) {
            this.setScore(args[0]);
        }

        this.world.resize(window.innerWidth, window.innerHeight);
    }

    private restart():void {
        this.game.state.start(States.TITLE);
    }

    private setScore(score?:number) {
        if (score != undefined)
        this._score = score;

        if (this.text != null)
            this.text.setText(`Your score: ${this._score}\n\n${this.game.device.desktop ? "Click" : "Tap"} to restart.`);
        else if (this._score === undefined) {

        }
    }
}