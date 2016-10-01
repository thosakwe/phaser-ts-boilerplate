import Assets from '../../assets';
import {Sprite, State} from 'phaser-shim';

export default class Title extends State {
    logo: Sprite;

    create(): void {
        window.document.title = 'My Game';

        this.logo = this.game.add.sprite(this.game.width / 2, this.game.height / 2, Assets.LOGO);
        this.logo.anchor.setTo(0.5, 0.5);
        this.logo.scale.setTo(0.5, 0.5);
    }
}