import {State, Text} from 'phaser-shim';
import {States} from "../index";

export default class ControlsState extends State {
    create(): void {
        this.stage.backgroundColor = '#fff';
        this.world.resize(window.innerWidth, window.innerHeight);

        const text = this.add.text(0, 0, this.controls().trim(), {
            boundsAlignH: 'center',
            boundsAlignV: 'middle',
            fill: '#000',
            font: '32px Arial'
        });

        if (!this.game.device.desktop)
            text.fontSize = '20px';

        text.setTextBounds(0, 0, this.world.width, this.world.height);

        this.input.onDown.add(() => {
            this.game.state.start(States.TITLE);
        });
    }

    private controls():string {
        let move = 'Arrow keys';
        let jump = 'Space';
        let shoot = 'Press X';
        let goBack = 'CLICK';

        if (!this.game.device.desktop) {
            move = 'Touch/hold left/right of character';
            jump = 'Double-tap another finger while moving';
            shoot = 'Hold down another finger while moving. Double-tap while stationary.';
            goBack = 'TAP';
        }

        return `Move: ${move}\nJump: ${jump}\nShoot: ${shoot}\n\n${goBack} TO RETURN TO TITLE SCREEN`;
    }

    init() {
        this.world.resize(window.innerWidth, window.innerHeight);
    }
}