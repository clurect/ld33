var SimpleGame = (function () {
    function SimpleGame() {
        this.currentSpeed = 0;
        this.game = new Phaser.Game(800, 600, Phaser.AUTO, '', { preload: this.preload.bind(this), create: this.create.bind(this), update: this.update.bind(this), render: this.render.bind(this) });
    }
    SimpleGame.prototype.preload = function () {
        this.game.load.atlas('characters', 'assets/img/spritesheet.png', 'assets/img/sprites.json');
        this.game.load.audio('village', ['assets/audio/village.mp3', 'assets/audio/village.ogg']);
        this.game.load.tilemap('map', 'assets/maps/mapu.json', null, Phaser.Tilemap.TILED_JSON);
        this.game.load.image('tiles', 'assets/maps/tileset.png');
    };
    SimpleGame.prototype.create = function () {
        this.oldpointer = new Phaser.Pointer(this.game, 23);
        this.map = this.game.add.tilemap('map');
        this.map.addTilesetImage('MonsterLand', 'tiles');
        this.layer = this.map.createLayer('Ground');
        this.layer.resizeWorld();
        this.collideLayer = this.map.createLayer('Collide');
        this.map.setCollision([2, 3], true, this.collideLayer);
        //var logo = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY, 'logo');
        this.carrot = this.game.add.sprite(0, 0, 'characters', 'carrot');
        this.carrot.anchor.setTo(0.5, 0.5);
        this.game.physics.enable(this.carrot, Phaser.Physics.ARCADE);
        this.carrot.body.drag.set(0.2);
        this.carrot.body.maxVelocity.setTo(400, 400);
        this.carrot.body.collideWorldBounds = true;
        var bgmusic = this.game.add.audio('village');
        //bgmusic.play("",0,1,true,true);
        this.game.camera.follow(this.carrot);
        this.game.camera.deadzone = new Phaser.Rectangle(150, 150, 500, 300);
        this.game.camera.focusOnXY(0, 0);
        this.cursors = this.game.input.keyboard.createCursorKeys();
    };
    SimpleGame.prototype.update = function () {
        var wideRadius = 42;
        if (this.game.input.activePointer.isDown) {
            // get the location only when the pointer is clicked, set to variable to ensure that the character stops following the pointer after it is let go
            if (!this.inRadius(this.carrot, this.oldpointer, wideRadius))
                this.currentSpeed = 500;
            this.oldpointer.x = this.game.input.activePointer.worldX.valueOf();
            this.oldpointer.y = this.game.input.activePointer.worldY.valueOf();
            this.game.physics.arcade.moveToPointer(this.carrot, this.currentSpeed, this.game.input.activePointer);
        }
        if (this.currentSpeed > 0 && this.inRadius(this.carrot, this.oldpointer, wideRadius)) {
            this.currentSpeed -= 4;
            //this.game.physics.arcade.moveToXY(this.carrot, this.currentSpeed, 1,2);
            //TODO need to fix movement when the pointer moves
            this.game.physics.arcade.moveToPointer(this.carrot, this.currentSpeed, this.game.input.activePointer);
        }
        var radius = 22;
        if (this.inRadius(this.carrot, this.oldpointer, radius)) {
            this.currentSpeed = 0;
            this.game.physics.arcade.moveToPointer(this.carrot, this.currentSpeed, this.game.input.activePointer);
        }
        this.game.physics.arcade.collide(this.carrot, this.collideLayer, function (s, t) {
            //console.log('hey you hit the layer');
        }, null, this);
    };
    SimpleGame.prototype.inRadius = function (character, pointer, radius) {
        return character.x >= pointer.x - radius && pointer.x + radius >= character.x && character.y >= pointer.y - radius && pointer.y + radius >= character.y;
    };
    SimpleGame.prototype.render = function () {
        this.game.debug.text(this.carrot.x, 32, 32);
        this.game.debug.text(this.carrot.y, 32, 82);
        this.game.debug.text("old x: " + this.oldpointer.x, 32, 182);
        this.game.debug.text("old y: " + this.oldpointer.y, 32, 282);
        //this.game.debug.text(this.currentSpeed, 32, 382);
        this.game.debug.text("pointer x: " + this.game.input.activePointer.worldX, 32, 482);
        this.game.debug.text("pointer y: " + this.game.input.activePointer.worldY, 32, 582);
    };
    return SimpleGame;
})();
window.onload = function () {
    var game = new SimpleGame();
};
//# sourceMappingURL=app.js.map