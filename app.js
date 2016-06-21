var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Rabbit = (function (_super) {
    __extends(Rabbit, _super);
    function Rabbit() {
        _super.apply(this, arguments);
        this.runSpeed = 200;
    }
    return Rabbit;
}(Phaser.Sprite));
var SimpleGame = (function () {
    function SimpleGame() {
        this.currentSpeed = 0;
        this.game = new Phaser.Game(800, 600, Phaser.AUTO, '', { preload: this.preload.bind(this), create: this.create.bind(this), update: this.update.bind(this), render: this.render.bind(this) });
    }
    SimpleGame.prototype.preload = function () {
        this.game.load.atlas('characters', 'assets/img/spritesheet.png', 'assets/img/sprites.json');
        this.game.load.audio('vikings', 'assets/audio/vikings.mp3');
        this.game.load.tilemap('map', 'assets/maps/mapu.json', null, Phaser.Tilemap.TILED_JSON);
        this.game.load.image('tiles', 'assets/maps/tileset.png');
    };
    SimpleGame.prototype.create = function () {
        window.thus = this;
        this.oldpointer = new Phaser.Pointer(this.game, 23);
        this.map = this.game.add.tilemap('map');
        this.rabbits = new Array();
        this.map.addTilesetImage('MonsterLand', 'tiles');
        this.layer = this.map.createLayer('Ground');
        this.layer.resizeWorld();
        this.collideLayer = this.map.createLayer('Collide');
        this.map.setCollision([17, 18, 19, 20, 25, 26, 27, 28], true, this.collideLayer);
        this.player = this.game.add.sprite(0, 0, 'characters', 'spirit');
        this.player.anchor.setTo(0.5, 0.5);
        this.carrot = this.game.add.sprite(600, 200, 'characters', 'carrot');
        this.carrot.anchor.setTo(0.5, 0.5);
        this.rabbits[0] = this.game.add.sprite(500, 500, 'characters', 'rabbit');
        this.rabbits[0].anchor.setTo(0.5, 0.5);
        this.rabbits[0].originX = 500;
        this.rabbits[0].originY = 500;
        this.rabbits[0].runSpeed = 250;
        this.rabbits[1] = this.game.add.sprite(100, 500, 'characters', 'rabbit');
        this.rabbits[1].anchor.setTo(0.5, 0.5);
        this.rabbits[1].originX = 100;
        this.rabbits[1].originY = 500;
        this.rabbits[1].runSpeed = 200;
        this.game.physics.enable(this.player, Phaser.Physics.ARCADE);
        this.game.physics.enable(this.rabbits[0], Phaser.Physics.ARCADE);
        this.game.physics.enable(this.rabbits[1], Phaser.Physics.ARCADE);
        this.game.physics.enable(this.carrot, Phaser.Physics.ARCADE);
        this.player.body.drag.set(0.2);
        this.player.body.maxVelocity.setTo(400, 400);
        this.player.body.collideWorldBounds = true;
        this.instructions = this.game.add.text(600, 150, 'Click on him to possess', { font: '40px Arial', fill: '#000' });
        this.instructions.anchor.setTo(0.5, 0.5);
        this.carrot.body.drag.set(0.2);
        this.carrot.body.maxVelocity.setTo(400, 400);
        this.carrot.body.collideWorldBounds = true;
        this.rabbits[0].body.drag.set(0.2);
        this.rabbits[0].body.maxVelocity.setTo(400, 400);
        this.rabbits[0].body.collideWorldBounds = true;
        this.rabbits[1].body.drag.set(0.2);
        this.rabbits[1].body.maxVelocity.setTo(400, 400);
        this.rabbits[1].body.collideWorldBounds = true;
        var bgmusic = this.game.add.audio('vikings');
        this.game.camera.follow(this.player);
        this.game.camera.deadzone = new Phaser.Rectangle(150, 150, 500, 300);
        this.game.camera.focusOnXY(0, 0);
        this.cursors = this.game.input.keyboard.createCursorKeys();
    };
    SimpleGame.prototype.update = function () {
        var wideRadius = 42;
        if (this.game.input.activePointer.isDown) {
            if (!this.inRadius(this.player, this.oldpointer, wideRadius))
                this.currentSpeed = 400;
            this.oldpointer.x = this.game.input.activePointer.worldX.valueOf();
            this.oldpointer.y = this.game.input.activePointer.worldY.valueOf();
            this.game.physics.arcade.moveToPointer(this.player, this.currentSpeed, this.game.input.activePointer);
        }
        if (this.currentSpeed > 0 && this.inRadius(this.player, this.oldpointer, wideRadius)) {
            this.currentSpeed -= 4;
            this.game.physics.arcade.moveToPointer(this.player, this.currentSpeed, this.game.input.activePointer);
        }
        var radius = 22;
        if (this.inRadius(this.player, this.oldpointer, radius)) {
            this.currentSpeed = 0;
            this.game.physics.arcade.moveToPointer(this.player, this.currentSpeed, this.game.input.activePointer);
        }
        this.game.physics.arcade.collide(this.player, this.carrot, function (t, s) {
            console.log(this.player);
            console.log(s);
            this.possess(t, s);
            this.instructions.destroy();
        }, null, this);
        for (var i = 0; i < this.rabbits.length; i++) {
            this.game.physics.arcade.collide(this.rabbits[i], this.collideLayer);
        }
        if (this.player.isPhysical) {
            this.instructions = this.game.add.text(500, 450, 'Now kill these carrot eating jerks', { font: '30px Arial', fill: '#000' });
            this.instructions.anchor.setTo(0.5, 0.5);
            for (var i = 0; i < this.rabbits.length; i++) {
                if (this.inRadius(this.player, this.rabbits[i], 200)) {
                    console.log(this.rabbits[i].runSpeed);
                    var runAwayAngle = Phaser.Math.angleBetween(this.rabbits[i].x, this.rabbits[i].y, this.player.x, this.player.y) + Math.PI;
                    this.game.physics.arcade.velocityFromRotation(runAwayAngle, this.rabbits[i].runSpeed, this.rabbits[i].body.velocity);
                }
                else {
                    if (!this.inRadius(this.rabbits[i], { x: this.rabbits[i].originX, y: this.rabbits[i].originY }, 50)) {
                        this.game.physics.arcade.moveToXY(this.rabbits[i], this.rabbits[i].originX, this.rabbits[i].originY, 100);
                    }
                }
                this.game.physics.arcade.collide(this.player, this.rabbits[i], function (s, t) {
                    if (s.isPhysical === true) {
                        t.kill();
                        this.rabbits.splice(i, 1);
                    }
                }, null, this);
                this.game.physics.arcade.collide(this.player, this.collideLayer);
            }
        }
        this.gameCheck();
    };
    SimpleGame.prototype.gameCheck = function () {
        if (this.rabbits.length <= 0) {
            this.gameWon();
        }
    };
    SimpleGame.prototype.gameWon = function () {
        this.game.paused = true;
        var choiseLabel = this.game.add.text(this.player.x, this.player.y, 'YOU WON!', { font: '50px Arial', fill: '#000' });
        choiseLabel.anchor.setTo(0.5, 0.5);
    };
    SimpleGame.prototype.possess = function (t, s) {
        t.kill();
        this.player = s;
        this.game.camera.follow(this.player);
        this.game.camera.focusOnXY(this.player.x, this.player.y);
        this.player.isPhysical = true;
    };
    SimpleGame.prototype.inRadius = function (thing1, thing2, radius) {
        return thing1.x >= thing2.x - radius && thing2.x + radius >= thing1.x && thing1.y >= thing2.y - radius && thing2.y + radius >= thing1.y;
    };
    SimpleGame.prototype.render = function () {
    };
    return SimpleGame;
}());
window.onload = function () {
    var game = new SimpleGame();
};
