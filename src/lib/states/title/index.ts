import {State, Text} from 'phaser-shim';
import {States} from "../index";
import Protagonist from "../../game-object/protagonist";

export default class Title extends State {
    protagonist:Protagonist;
    instructions:Text;
    play:Text;
    title:Text;

    preload(): void {
        this.load.image('bro', 'assets/backgrounds/tile.png');
        this.protagonist = new Protagonist(this.game);
        this.protagonist.preload();
    }

    create(): void {
        this.stage.backgroundColor = '#fff';
        this.world.resize(window.innerWidth, window.innerHeight);

        this.title = this.add.text(0, 0, 'The Adventures of Dat Boi', {
            boundsAlignH: 'center',
            boundsAlignV: 'middle',
            fill: '#000',
            font: '48px Arial'
        });

        this.title.setTextBounds(0, 20, this.world.width, this.title.height);

        this.protagonist.draw(this.world.width / 2, this.title.height + 40).anchor.y = 0;
        this.protagonist.body.allowGravity = false;
        this.protagonist.sprite.play('pedal');

        this.play = this.add.text(0, this.protagonist.sprite.bottom + 10, 'PLAY GAME', {
            boundsAlignH: 'center',
            boundsAlignV: 'middle',
            fill: '#000',
            font: '32px Arial'
        });

        this.play.inputEnabled = true;
        this.play.input.useHandCursor = true;
        this.play.setTextBounds(0, 10, this.world.width / 2, this.play.height);

        this.play.events.onInputDown.add(() => {
            this.game.state.start(States.GAMEPLAY);
        });

        this.instructions = this.add.text(this.world.width / 2, this.protagonist.sprite.bottom + 10, 'CONTROLS', {
            boundsAlignH: 'center',
            boundsAlignV: 'middle',
            fill: '#000',
            font: '32px Arial'
        });

        this.instructions.inputEnabled = true;
        this.instructions.input.useHandCursor = true;
        this.instructions.setTextBounds(0, 10, this.world.width / 2, this.instructions.height);

        this.instructions.events.onInputDown.add(() => {
            this.game.state.start(States.CONTROLS);
        });
    }
}