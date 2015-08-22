class SimpleGame {

    constructor() {
        this.game = new Phaser.Game(800, 600, Phaser.AUTO, '', { preload: this.preload, create: this.create, update: this.update, render: this.render });
        Phaser
    }
    game: Phaser.Game;

    
    preload () {

        this.game.load.atlas('characters','assets/img/spritesheet.png','assets/img/sprites.json');
        this.game.load.audio('village', ['assets/audio/village.mp3','assets/audio/village.ogg']);
        this.game.load.image('earth', 'assets/img/clouds-11.jpg');

    }
    greep;
    cursors;
    currentSpeed=0;
    land;
    create () {
        this.game.world.setBounds(-1000, -1000, 2000, 2000);

        this.land = this.game.add.tileSprite(0, 0, 800, 600, 'earth');
        this.land.fixedToCamera = true;
        //var logo = game.add.sprite(game.world.centerX, game.world.centerY, 'logo');
        greep = game.add.sprite(0,0,'characters','greep');
        greep.anchor.setTo(0.5,0.5);
        game.physics.enable(greep, Phaser.Physics.ARCADE);
        greep.body.drag.set(0.2);
        greep.body.maxVelocity.setTo(400, 400);
        greep.body.collideWorldBounds = true;
        //logo.anchor.setTo(0.5, 0.5);
        var bgmusic = game.add.audio('village');

        //bgmusic.play("",0,1,true,true);

        game.camera.follow(greep);
        game.camera.deadzone = new Phaser.Rectangle(150, 150, 500, 300);
        game.camera.focusOnXY(0, 0);
        cursors = game.input.keyboard.createCursorKeys();


    }
    var oldpointer = {x:0,y:0};
    update() {
        var wideRadius = 42;
        if(game.input.activePointer.isDown)
        {
            //greep.angle = targetAngle;
            if (!inRadius(wideRadius))currentSpeed = 500;
            oldpointer.x = game.input.activePointer.worldX;
            oldpointer.y = game.input.activePointer.worldY;
            greep.rotation = game.physics.arcade.moveToPointer(greep, currentSpeed, game.input.activePointer)
        }
        
        if (currentSpeed > 0 && inRadius(wideRadius)){
            currentSpeed -= 4;
        }
        var radius = 22;
        if (inRadius(radius)){
            currentSpeed=0;
        }
        land.tilePosition.x = -game.camera.x;
        land.tilePosition.y = -game.camera.y;
        game.physics.arcade.velocityFromRotation(greep.rotation, currentSpeed, greep.body.velocity);
    }

    inRadius(radius) {
        return greep.x >= oldpointer.x-radius && oldpointer.x+radius >= greep.x && greep.y >= oldpointer.y-radius && oldpointer.y+radius >= greep.y;
    }
    render () {

        // game.debug.text('Active Bullets: ' + bullets.countLiving() + ' / ' + bullets.length, 32, 32);
        game.debug.text(greep.x, 32, 32);
        game.debug.text(greep.worldY, 32, 82);

        game.debug.text(oldpointer.x, 32, 182);
        game.debug.text(oldpointer.y, 32, 282);

        game.debug.text(currentSpeed, 32, 382);

        game.debug.text(game.input.activePointer.worldX,32, 482);
        game.debug.text(game.input.activePointer.worldY,32, 582);
        

    }
}
window.onload = function() {
    var game = new SimpleGame();
};