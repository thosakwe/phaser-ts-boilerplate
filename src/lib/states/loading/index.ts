import {Physics, ScaleManager, State} from 'phaser-shim';
import States from '../names';

export default class Loading extends State {
    create(): void {
        this.game.physics.startSystem(Physics.ARCADE);
        this.game.physics.arcade.gravity.y = 250;

        // Resizing logic
        this.game.scale.scaleMode = ScaleManager.SHOW_ALL;
        window.addEventListener('resize', e => {
            this.game.scale.setGameSize(
                window.innerWidth * window.devicePixelRatio,
                window.innerHeight * window.devicePixelRatio);
        });

        this.game.state.start(States.TITLE);
    }
}