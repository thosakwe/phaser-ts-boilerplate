import Assets from '../../assets';
import {ScaleManager, State, Text} from 'phaser-shim';
import States from '../names';

export default class Loading extends State {
    _interval: any;
    _percent = 0;

    text: Text;

    preload(): void {
        this.game.load.image(Assets.LOGO, 'assets/logo.png');
    }


    create(): void {
        this.game.stage.backgroundColor = '#fff';

        // Resizing logic
        this.game.scale.scaleMode = ScaleManager.SHOW_ALL;
        window.addEventListener('resize', e => {
            this.game.scale.setGameSize(
                window.innerWidth * window.devicePixelRatio,
                window.innerHeight * window.devicePixelRatio);
        });

        this.text = this.game.add.text(0, 0, window.document.title = '0% loaded...', {
            boundsAlignH: 'center',
            boundsAlignV: 'middle',
            fill: '#000'
        }).setTextBounds(0, 0, this.game.width, this.game.height);

        this._interval = window.setInterval(() => {
            this.text.setText(window.document.title = `${this._percent++}% loaded...`);

            if (this._percent > 100) {
                window.clearInterval(this._interval);
                this.game.state.start(States.TITLE);
            }
        }, 25);
    }
}