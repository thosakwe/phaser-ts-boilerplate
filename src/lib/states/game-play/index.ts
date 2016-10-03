import {Group, KeyCode, Physics, Pointer, Sound, State, Sprite, Text, TileSprite} from 'phaser-shim';
import Protagonist from "../../game-object/protagonist";
import {States} from "../index";
export default class GamePlayState extends State {
    _lastSpeed = 0;
    _lives = 0;
    _originalTint: number;
    _paused = false;
    _powerUpLifeSpan = 10000;
    _restarted = false;
    _score = 0;
    _shootInterval = 250;
    _shootTimer = 0;
    _spawnInterval = 1000;
    _spawnTimer = 0;
    _starMode = false;
    _trollFaceSpeed = 40;
    background: Sprite;
    boosts: Group;
    boostSound: Sound;
    fireballs: Group;
    hitSound: Sound;
    lives: Group;
    npc: Group;
    protagonist: Protagonist;
    scoreLabel: Text;
    scream: Sound;
    skillHitSound: Sound;
    stars: Group;
    starSound: Sound;
    tile: TileSprite;
    trollFaces: Group;

    preload(): void {
        super.preload();
        this.load.image('background', 'assets/backgrounds/layer-1.png');
        this.load.image('boost', 'assets/heart.png');
        this.load.audio('boost sound', 'assets/sounds/boost-ogg/boost-loop.ogg');
        this.load.audio('hit', 'assets/sounds/hits/1.ogg');
        this.load.audio('scream', 'assets/sounds/wscream_2.wav');
        this.load.audio('skill hit', 'assets/sounds/skill_hit.mp3');
        this.load.image('star', 'assets/star.png');
        this.load.audio('star sound', 'assets/sounds/level-up/chipquest.wav');
        this.load.image('tile', 'assets/backgrounds/tile.png');
        this.load.image('trollface', 'assets/enemies/trollface.png');
        this.protagonist = new Protagonist(this.game);
        this.protagonist.preload();
    }

    addLife(): Sprite {
        this._lives++;

        this.lives.subAll('x', 40, true, true);

        /* const x = window.innerWidth - 20 - (40 * this.lives.countLiving());
         const y = 20; */

        const x = window.innerWidth - 20;
        const y = 20;

        const sprite: Sprite = this.lives.create(x, y, 'player');
        sprite.anchor.setTo(1, 0);
        sprite.animations.add('pedal').play(15, true);
        sprite.scale.setTo(1 / 3);
        return sprite;
    }

    create(): void {
        super.create();
        this.world.resize(5000, this.world.height);

        this._spawnTimer += this._spawnInterval;

        this.background = this.add.sprite(0, 0, 'background');
        this.background.scale.x = this.world.width / this.background.width;
        this.background.scale.y = this.world.height / this.background.height;

        this.tile = this.add.tileSprite(0, this.world.height - 100, this.world.width, 100, 'tile');
        this.physics.arcade.enable(this.tile);
        const tileBody: Physics.Arcade.Body = <Physics.Arcade.Body>this.tile.body;
        tileBody.allowGravity = false;
        tileBody.immovable = true;

        this.scoreLabel = this.add.text(20, 20, `Score: ${this._score}    Lives: ${this._lives}`, {
            fill: '#fff',
            font: '32px Arial, sans-serif'
        });
        this.scoreLabel.fixedToCamera = true;

        const shootKey = this.input.keyboard.addKey(KeyCode.X);
        shootKey.onDown.add(this.shootFireball.bind(this));

        this.input.maxPointers = 2;
        this.input.onHold.add(this.protagonist.updatePointer, this.protagonist);

        this.input.onTap.add(this.onTap, this);

        this.lives = this.add.group();
        this.lives.fixedToCamera = true;
        this.npc = this.add.group();
        this.boosts = this.add.physicsGroup(Physics.ARCADE, this.npc);
        this.fireballs = this.add.physicsGroup(Physics.ARCADE, this.npc);
        this.stars = this.add.physicsGroup(Physics.ARCADE, this.npc);
        this.trollFaces = this.add.physicsGroup(Physics.ARCADE, this.npc);

        this.protagonist.draw(this.world.width / 2, this.tile.top);
        this.protagonist.create();
        this._originalTint = this.background.tint; // this.protagonist.sprite.tint;

        if (this._restarted) {
            // this.protagonist.body.velocity.y = 2000;
            this.protagonist.sprite.y = this.tile.top;
        }

        this.boostSound = this.add.sound('boost sound');
        this.hitSound = this.add.sound('hit');
        this.scream = this.add.sound('scream');
        this.skillHitSound = this.add.sound('skill hit');
        this.starSound = this.add.sound('star sound');

        for (let i = 0; i < 3; i++) {
            this.addLife();
            this.spawnNPC();
        }
    }

    enemyHitPlayer(_: Sprite, enemy: Sprite): void {
        this.hitSound.play();
        enemy.kill();

        this.fireballs.forEachAlive((fireball: Sprite) => {
            fireball.kill();
        }, this);

        this._lives--;

        if (this.lives.countLiving() > 0)
            this.lives.getFirstAlive().kill();

        this.updateScore();
        this.camera.shake();

        // Todo: Game over logic
        if (this._lives <= 0) {
            this.scream.play();
            this.protagonist.sprite.visible = false;
            this._paused = true;

            this.npc.forEachAlive((group: Group) => {
                group.forEachAlive((sprite: Sprite) => {
                    sprite.kill();
                }, this);
            }, this);

            this.camera.fade(0, 1000);

            setTimeout(() => {
                alert(`RIP to Dat Boi.\n\nYour score: ${this._score} points`);
                this.game.state.start(States.GAME_OVER, true, false, this._score);
            }, 1000);
        }
    }

    static floatEnemy(enemy: Sprite) {
        const body = <Physics.Arcade.Body>enemy.body;

        if (body.touching.down) {
            body.velocity.y = -250;
        }
    }

    init(restarted: boolean) {
        if (restarted !== undefined && restarted === true) {
            this._restarted = true;
        }
    }

    onTap(pointer: Pointer, doubleTap: boolean): void {
        if (doubleTap) {
            if (this.input.pointer2.isDown)
                this.protagonist.jump();
            else this.shootFireball();
        }

        this.protagonist.updatePointer();
    }

    shootFireball(): void {
        if (this.time.now > this._shootTimer) {
            const fireball = this.protagonist.createFireball(
                this.protagonist.sprite.x,
                this.protagonist.sprite.y - this.protagonist.sprite.height / 2 - 20,
                this.fireballs,
                this._starMode);
            const body = <Physics.Arcade.Body>fireball.body;

            if (this.protagonist.body.velocity.x === 0)
                body.velocity.x = (this._starMode ? 2000 : 1000) * (this.protagonist.sprite.scale.x * -1);
            else body.velocity.x = this.protagonist.body.velocity.x * 2;

            this._shootTimer = this.time.now + this._shootInterval;

            // Fireballs expire after 1/2 second
            setTimeout(() => {
                fireball.kill();
            }, 500);
        }
    }

    shutdown() {
        this._paused = false;
        this._score = 0;
        this._lives = 0;
    }

    spawnBoost(x: number, y: number): Sprite {
        const sprite: Sprite = this.boosts.create(x, y, 'boost');
        sprite.anchor.setTo(0.5, 1);
        sprite.scale.setTo(0.5);
        const body = <Physics.Arcade.Body>sprite.body;
        body.bounce.y = 0.8;
        body.collideWorldBounds = true;
        body.velocity.y = -250;

        setTimeout(() => {
            if (sprite.alive)
                sprite.kill();
        }, 5000);

        return sprite;
    }

    spawnNPC(): void {
        let x = this.world.randomX;
        const y = this.tile.top;

        while (Math.abs(x - this.protagonist.sprite.x) <= this.protagonist.sprite.width * 2)
            x = this.world.randomX;

        if (this._starMode) {
            if (this.rnd.integerInRange(1, 10) <= 2)
                this.spawnBoost(x, y);
            else this.spawnTrollface(x, y);
        } else {
            if (this._lives < 3 && this.rnd.integerInRange(1, 10) === 1)
                this.spawnBoost(x, y);
            else if (this.rnd.integerInRange(1, 10) == 1)
                this.spawnStar(x, y);
            else this.spawnTrollface(x, y);
        }
    }

    spawnStar(x: number, y: number): Sprite {
        const sprite: Sprite = this.stars.create(x, y, 'star');
        sprite.anchor.setTo(0.5, 1);
        sprite.scale.setTo(1 / 3);
        const body = <Physics.Arcade.Body>sprite.body;
        body.bounce.y = 0.8;
        body.collideWorldBounds = true;
        body.velocity.y = -250;

        setTimeout(() => {
            sprite.kill();
        }, this._powerUpLifeSpan);

        return sprite;
    }

    // Todo: make own class
    spawnTrollface(x: number, y: number): Sprite {
        if (!this._starMode)
            this._trollFaceSpeed += 15;

        const sprite: Sprite = this.trollFaces.create(x, y, 'trollface');
        sprite.anchor.setTo(0.5, 1);
        sprite.scale.setTo(0.25);
        const body = <Physics.Arcade.Body>sprite.body;
        body.bounce.y = 0.5;
        body.collideWorldBounds = true;
        return sprite;
    }

    update(): void {
        super.update();

        this.physics.arcade.collide(this.protagonist.sprite, this.tile);
        this.physics.arcade.collide(this.boosts, this.tile);
        this.physics.arcade.collide(this.stars, this.tile);
        this.physics.arcade.collide(this.trollFaces, this.tile);


        if (this._paused)
            return;

        this.protagonist.update();

        if (this.input.pointer2.isDown)
            this.shootFireball();

        this.physics.arcade.collide(this.fireballs, this.trollFaces, (fireball: Sprite, trollFace: Sprite) => {
            this.skillHitSound.play();
            fireball.kill();
            trollFace.kill();
            this._score += this._starMode ? 20 : 10;

            if (this._starMode) {
                this._lastSpeed += 5;
                this.protagonist.speed.x += 10;
            } else {
                this.protagonist.speed.x += 5;
            }
            this.updateScore();
        });

        this.physics.arcade.collide(this.boosts, this.protagonist.sprite, (_, boost: Sprite) => {
            this.boostSound.play();
            boost.kill();
            this.addLife();
            this.updateScore();
        });

        this.physics.arcade.collide(this.stars, this.protagonist.sprite, (_, __: Sprite) => {
            const lastShootTimer = this._shootTimer;
            this._lastSpeed = this.protagonist.speed.x;

            this.starSound.play();
            this.stars.forEachAlive((star: Sprite) => {
                star.kill();
            }, this);
            this.background.tint = Math.random() * 0xffffff;
            this.protagonist.speed.x *= 2;
            this._starMode = true;
            this._shootTimer *= 0.5;

            setTimeout(() => {
                this._starMode = false;
                this._shootTimer = lastShootTimer;
                this.background.tint = this._originalTint;
                this.protagonist.speed.x = this._lastSpeed;
            }, this._powerUpLifeSpan);
        });

        this.physics.arcade.collide(this.trollFaces, this.protagonist.sprite, this.enemyHitPlayer.bind(this));

        this.trollFaces.forEachAlive(GamePlayState.floatEnemy, this);

        this.trollFaces.forEachAlive((trollFace: Sprite) => {
            const body = <Physics.Arcade.Body> trollFace.body;

            if (trollFace.x > this.protagonist.sprite.x) {
                body.velocity.x = -1 * this._trollFaceSpeed;
            } else body.velocity.x = this._trollFaceSpeed;
        }, this);

        if (this.time.now > this._spawnTimer) {
            this.spawnNPC();
            this._spawnTimer = this.time.now += this._spawnInterval;
        }
    }

    updateScore() {
        this.scoreLabel.setText(`Score: ${this._score}`);
    }
}