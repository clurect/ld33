var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Rabbit = (function (_super) {
    __extends(Rabbit, _super);
    function Rabbit(game, x, y, objs) {
        _super.call(this, game, x, y, objs);
        this.runSpeed = 200;
        Phaser.Sprite.call(this, game, x, y, 'characters', 'rabbit');
        this.game.add.existing(this);
        this.entityType = 'enemy';
        this.hitTimer = 0;
    }
    Rabbit.prototype.update = function () {
    };
    Rabbit.prototype.hit = function (who) {
        if (this.hitTimer <= this.game.time.totalElapsedSeconds()) {
            who.damage(10);
            this.hitTimer = this.game.time.totalElapsedSeconds() + 2;
        }
    };
    return Rabbit;
}(MovingEntity));
var Carrot = (function (_super) {
    __extends(Carrot, _super);
    function Carrot(game, x, y, objs) {
        _super.call(this, game, x, y, objs);
        this.runSpeed = 200;
        Phaser.Sprite.call(this, game, x, y, 'characters', 'carrot');
        this.game.add.existing(this);
    }
    Carrot.prototype.update = function () {
    };
    return Carrot;
}(MovingEntity));
var MonsterPossession = (function () {
    function MonsterPossession() {
        this.currentSpeed = 0;
        this.game = new Phaser.Game(800, 600, Phaser.AUTO, '', { preload: this.preload.bind(this), create: this.create.bind(this), update: this.update.bind(this), render: this.render.bind(this) });
    }
    MonsterPossession.prototype.preload = function () {
        this.game.load.atlas('characters', 'assets/img/spritesheet.png', 'assets/img/sprites.json');
        this.game.load.audio('background', 'assets/audio/Constancy Part One.mp3');
        this.game.load.tilemap('map', 'assets/maps/mapu.json', null, Phaser.Tilemap.TILED_JSON);
        this.game.load.image('tiles', 'assets/maps/tileset.png');
        this.game.load.bitmapFont('gothic', 'assets/fonts/font.png', 'assets/fonts/font.xml');
        this.game.load.image('textarea', 'assets/img/textarea.png');
    };
    MonsterPossession.prototype.create = function () {
        window.thus = this;
        this.wanderTime = 0;
        this.map = this.game.add.tilemap('map');
        this.rabbits = new Array();
        this.instructions = new Array();
        this.map.addTilesetImage('MonsterLand', 'tiles');
        this.layer = this.map.createLayer('Ground');
        this.layer.resizeWorld();
        this.collideLayer = this.map.createLayer('Collide');
        this.map.setCollision([17, 18, 19, 20, 25, 26, 27, 28], true, this.collideLayer);
        this.player = this.game.add.sprite(0, 0, 'characters', 'spirit');
        this.player.anchor.setTo(0.5, 0.5);
        this.possessing = false;
        this.carrot = new Carrot(this.game, 600, 200, null);
        this.carrot.anchor.setTo(0.5, 0.5);
        this.littleCarrot = this.game.add.sprite(600, 800, 'characters', 'carrot');
        this.littleCarrot.scale.setTo(0.5, 0.5);
        this.littleCarrot.anchor.setTo(0.5, 0.5);
        this.littleCarrot.health = 100;
        this.addEnemy(0, 500, 500, 250);
        this.addEnemy(1, 100, 500, 200);
        this.game.physics.enable(this.player, Phaser.Physics.ARCADE);
        this.game.physics.enable(this.carrot, Phaser.Physics.ARCADE);
        this.game.physics.enable(this.littleCarrot, Phaser.Physics.ARCADE);
        this.player.body.drag.set(0.2);
        this.player.body.maxVelocity.setTo(400, 400);
        this.player.body.collideWorldBounds = true;
        this.carrot.body.drag.set(0.2);
        this.carrot.body.maxVelocity.setTo(400, 400);
        this.carrot.body.collideWorldBounds = true;
        this.littleCarrot.body.collideWorldBounds = true;
        var bgmusic = this.game.add.audio('background');
        bgmusic.play("", 0, 1, true, true);
        this.game.camera.follow(this.player);
        this.game.camera.deadzone = new Phaser.Rectangle(150, 150, 200, 200);
        this.game.camera.focusOnXY(0, 0);
        this.cursors = this.game.input.keyboard.createCursorKeys();
        this.addGameText('Press space to possess carrot monsters when near.\nStop the rabbits from eating the small carrots.\n[space to continue]');
        this.movementPaused = true;
    };
    MonsterPossession.prototype.update = function () {
        this.game.time.advancedTiming = true;
        this.game.debug.text('' + this.game.time.fps, 50, 50);
        this.game.debug.text('' + this.game.camera.position.y, 50, 100);
        this.game.debug.text('' + this.game.camera.position.x, 50, 150);
        this.player.body.velocity.y = 0;
        this.player.body.velocity.x = 0;
        if (this.movementPaused) {
            if (this.game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)) {
                this.movementPaused = false;
                this.killInstructions();
            }
            return;
        }
        var vel = 400;
        if (this.game.input.keyboard.isDown(Phaser.Keyboard.W)) {
            this.player.body.velocity.y = -vel;
        }
        if (this.game.input.keyboard.isDown(Phaser.Keyboard.S)) {
            this.player.body.velocity.y = vel;
        }
        if (this.game.input.keyboard.isDown(Phaser.Keyboard.D)) {
            this.player.body.velocity.x = vel;
        }
        if (this.game.input.keyboard.isDown(Phaser.Keyboard.A)) {
            this.player.body.velocity.x = -vel;
        }
        if (!this.player.isPhysical) {
            this.game.physics.arcade.collide(this.carrot, this.collideLayer);
            this.wander(this.carrot);
            if (this.game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR) && this.game.physics.arcade.distanceBetween(this.player, this.carrot) < 100) {
                this.possess(this.player, this.carrot);
                this.killInstructions();
            }
        }
        this.game.debug.text('' + this.littleCarrot.health, 50, 250);
        if (this.player.isPhysical) {
            this.game.physics.arcade.collide(this.player, this.collideLayer);
        }
        for (var i = 0; i < this.rabbits.length; i++) {
            this.game.physics.arcade.collide(this.rabbits[i], this.collideLayer);
            if (this.player.isPhysical && this.inRadius(this.player, this.rabbits[i], 200)) {
                var runAwayAngle = Phaser.Math.angleBetween(this.rabbits[i].x, this.rabbits[i].y, this.player.x, this.player.y) + Math.PI;
                this.game.physics.arcade.velocityFromRotation(runAwayAngle, this.rabbits[i].runSpeed, this.rabbits[i].body.velocity);
            }
            else {
                this.chaseCarrots(this.rabbits[i]);
                this.wander(this.rabbits[i]);
            }
            if (this.player.isPhysical) {
                this.game.physics.arcade.collide(this.player, this.rabbits[i], function (s, t) {
                    t.kill();
                    this.rabbits.splice(i, 1);
                }, null, this);
            }
        }
        this.gameCheck();
    };
    MonsterPossession.prototype.addGameText = function (text) {
        var spotY = this.game.camera.position.y + this.game.camera.height / 2;
        var spotX = this.game.camera.position.x - this.game.camera.width / 2;
        this.textarea = this.game.add.image(spotX, spotY - 150, 'textarea');
        this.instructions.push(this.game.add.bitmapText(spotX + 10, spotY - 140, 'gothic', text, 24));
    };
    MonsterPossession.prototype.addEnemy = function (index, x, y, speed) {
        this.rabbits[index] = new Rabbit(this.game, x, y, this.objs);
        this.rabbits[index].anchor.setTo(0.5, 0.5);
        this.rabbits[index].originX = x;
        this.rabbits[index].originY = y;
        this.rabbits[index].runSpeed = speed;
        this.game.physics.enable(this.rabbits[index], Phaser.Physics.ARCADE);
        this.rabbits[index].body.drag.set(0.2);
        this.rabbits[index].body.maxVelocity.setTo(speed, speed);
        this.rabbits[index].body.collideWorldBounds = true;
    };
    MonsterPossession.prototype.chaseCarrots = function (who) {
        if (!this.inRadius(this.littleCarrot, who, 300))
            return;
        console.log('chase chase!!');
        var runTowardAngle = this.runAway(this.littleCarrot, who);
        this.game.physics.arcade.velocityFromRotation(runTowardAngle, who.runSpeed / 2, who.body.velocity);
        if (this.inRadius(this.littleCarrot, who, 200)) {
            this.game.physics.arcade.velocityFromRotation(this.runAway(this.littleCarrot, who), 70, this.littleCarrot.body.velocity);
        }
        else {
            this.game.physics.arcade.moveToXY(this.littleCarrot, 600, 800, 50);
        }
        this.game.physics.arcade.collide(this.littleCarrot, who, function (s, t) {
            t.hit(s);
        }, null, this);
    };
    MonsterPossession.prototype.carrotRunAway = function () {
    };
    MonsterPossession.prototype.gameCheck = function () {
        if (this.rabbits.length <= 0) {
            this.gameWon();
        }
        if (!this.littleCarrot.alive) {
            this.gameLost();
        }
    };
    MonsterPossession.prototype.gameWon = function () {
        this.movementPaused = true;
        this.game.add.text(this.player.x, this.player.y - this.player.height, 'YOU WON!', { font: '50px Arial', fill: '#000' }).anchor.setTo(0.5, 0.5);
        this.addGameText('You won!');
    };
    MonsterPossession.prototype.randomPosNeg = function () {
        var num = Math.random();
        if (num < 0.5)
            num = -num;
        return num;
    };
    MonsterPossession.prototype.runAway = function (who, whoFrom) {
        return Phaser.Math.angleBetween(who.x, who.y, whoFrom.x, whoFrom.y) + Math.PI;
    };
    MonsterPossession.prototype.gameLost = function () {
        this.movementPaused = true;
        var choiseLabel = this.game.add.text(this.player.x, this.player.y, 'Little Carrot died, game over!', { font: '50px Arial', fill: '#000' });
        choiseLabel.anchor.setTo(0.5, 0.5);
    };
    MonsterPossession.prototype.killInstructions = function () {
        for (var i = 0; i < this.instructions.length; i++) {
            this.instructions[i].destroy();
        }
        this.instructions = new Array();
        this.textarea.destroy();
    };
    MonsterPossession.prototype.possess = function (t, s) {
        if (!this.possessing) {
            t.kill();
            this.player = s;
            this.game.camera.follow(this.player);
            this.game.camera.focusOnXY(this.player.x, this.player.y);
            this.player.isPhysical = true;
        }
    };
    MonsterPossession.prototype.inRadius = function (thing1, thing2, radius) {
        return thing1.x >= thing2.x - radius && thing2.x + radius >= thing1.x && thing1.y >= thing2.y - radius && thing2.y + radius >= thing1.y;
    };
    MonsterPossession.prototype.render = function () {
    };
    MonsterPossession.prototype.wander = function (who) {
        if (who.wanderTime < this.game.time.totalElapsedSeconds() || who.wanderTime == 0) {
            who.body.velocity = new Phaser.Point(this.randomPosNeg() * 20, this.randomPosNeg() * 20);
            who.wanderTime = this.game.time.totalElapsedSeconds() + Math.random() * 10;
        }
    };
    return MonsterPossession;
}());
window.onload = function () {
    var game = new MonsterPossession();
};
