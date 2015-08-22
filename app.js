var SimpleGame = (function () {
    function SimpleGame() {
        this.currentSpeed = 0;
        this.oldpointer = { x: 0, y: 0 };
        this.game = new Phaser.Game(800, 600, Phaser.AUTO, '', { preload: this.preload.bind(this), create: this.create.bind(this), update: this.update.bind(this), render: this.render.bind(this) });
    }
    SimpleGame.prototype.preload = function () {
        this.game.load.atlas('characters', 'assets/img/spritesheet.png', 'assets/img/sprites.json');
        this.game.load.audio('village', ['assets/audio/village.mp3', 'assets/audio/village.ogg']);
        this.game.load.image('earth', 'assets/img/clouds-11.jpg');
    };
    SimpleGame.prototype.create = function () {
        this.game.world.setBounds(-1000, -1000, 2000, 2000);
        this.land = this.game.add.tileSprite(0, 0, 800, 600, 'earth');
        this.land.fixedToCamera = true;
        //var logo = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY, 'logo');
        this.carrot = this.game.add.sprite(0, 0, 'characters', 'carrot');
        this.carrot.anchor.setTo(0.5, 0.5);
        this.game.physics.enable(this.carrot, Phaser.Physics.ARCADE);
        this.carrot.body.drag.set(0.2);
        this.carrot.body.maxVelocity.setTo(400, 400);
        this.carrot.body.collideWorldBounds = true;
        //logo.anchor.setTo(0.5, 0.5);
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
            //carrot.angle = targetAngle;
            if (!this.inRadius(wideRadius))
                this.currentSpeed = 500;
            this.oldpointer.x = this.game.input.activePointer.worldX;
            this.oldpointer.y = this.game.input.activePointer.worldY;
            this.carrot.rotation = this.game.physics.arcade.moveToPointer(this.carrot, this.currentSpeed, this.game.input.activePointer);
        }
        if (this.currentSpeed > 0 && this.inRadius(wideRadius)) {
            this.currentSpeed -= 4;
        }
        var radius = 22;
        if (this.inRadius(radius)) {
            this.currentSpeed = 0;
        }
        this.land.tilePosition.x = -this.game.camera.x;
        this.land.tilePosition.y = -this.game.camera.y;
        this.game.physics.arcade.velocityFromRotation(this.carrot.rotation, this.currentSpeed, this.carrot.body.velocity);
    };
    SimpleGame.prototype.inRadius = function (radius) {
        return this.carrot.x >= this.oldpointer.x - radius && this.oldpointer.x + radius >= this.carrot.x && this.carrot.y >= this.oldpointer.y - radius && this.oldpointer.y + radius >= this.carrot.y;
    };
    SimpleGame.prototype.render = function () {
        this.game.debug.text(this.carrot.x, 32, 32);
        this.game.debug.text(this.carrot.y, 32, 82);
        this.game.debug.text(this.oldpointer.x, 32, 182);
        //this.game.debug.text(this.oldpointer.y, 32, 282);
        this.game.debug.text(this.currentSpeed, 32, 382);
        this.game.debug.text(this.game.input.activePointer.worldX, 32, 482);
        this.game.debug.text(this.game.input.activePointer.worldY, 32, 582);
    };
    return SimpleGame;
})();
window.onload = function () {
    var game = new SimpleGame();
};
//# sourceMappingURL=app.js.map