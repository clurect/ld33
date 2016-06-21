interface Object {
    isPhysical: boolean;
}
class Rabbit extends Phaser.Sprite {
  originX:number;
  originY:number;
}
class SimpleGame {

    constructor() {
        this.game = new Phaser.Game(800, 600, Phaser.AUTO, '', { preload: this.preload.bind(this), create: this.create.bind(this), update: this.update.bind(this), render: this.render.bind(this) });
    }
    game: Phaser.Game;


    preload() {

        this.game.load.atlas('characters', 'assets/img/spritesheet.png', 'assets/img/sprites.json');
        this.game.load.audio('vikings', 'assets/audio/vikings.mp3');

        this.game.load.tilemap('map', 'assets/maps/mapu.json', null, Phaser.Tilemap.TILED_JSON);
        this.game.load.image('tiles', 'assets/maps/tileset.png');


    }
    player: Phaser.Sprite;
    cursors;
    currentSpeed:number = 0;
    land;
    map: Phaser.Tilemap;
    layer: Phaser.TilemapLayer;
    collideLayer: Phaser.TilemapLayer;
    rabbits: Rabbit[];
    carrot: Phaser.Sprite;
    instructions: Phaser.Text;
    create() {

        (<any>window).thus = this;

        this.oldpointer = new Phaser.Pointer(this.game,23);
        this.map = this.game.add.tilemap('map');
        this.rabbits = new Array();
        this.map.addTilesetImage('MonsterLand', 'tiles');

        this.layer = this.map.createLayer('Ground');
        this.layer.resizeWorld();

        this.collideLayer = this.map.createLayer('Collide');
        this.map.setCollision([17,18,19,20,25,26,27,28], true, this.collideLayer);

        //var logo = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY, 'logo');
        this.player = this.game.add.sprite(0, 0, 'characters', 'spirit');
        this.player.anchor.setTo(0.5, 0.5);
        this.carrot = this.game.add.sprite(600, 200, 'characters', 'carrot');
        this.carrot.anchor.setTo(0.5, 0.5);

        this.rabbits[0] = <Rabbit> this.game.add.sprite(500, 500, 'characters', 'rabbit');
        this.rabbits[0].anchor.setTo(0.5, 0.5);
        this.rabbits[0].originX = 500;
        this.rabbits[0].originY = 500;

        this.rabbits[1] = <Rabbit> this.game.add.sprite(100, 500, 'characters', 'rabbit');
        this.rabbits[1].anchor.setTo(0.5, 0.5);
        this.rabbits[1].originX = 100;
        this.rabbits[1].originY = 500;

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

        //bgmusic.play("",0,1,true,true);

        this.game.camera.follow(this.player);
        this.game.camera.deadzone = new Phaser.Rectangle(150, 150, 500, 300);
        this.game.camera.focusOnXY(0, 0);
        this.cursors = this.game.input.keyboard.createCursorKeys();


    }
    oldpointer: Phaser.Pointer;  // = { x: 0, y: 0 };
    update() {
        var wideRadius = 42;
        if (this.game.input.activePointer.isDown) {

            // get the location only when the pointer is clicked, set to variable to ensure that the character stops following the pointer after it is let go
            if (!this.inRadius(this.player, this.oldpointer, wideRadius)) this.currentSpeed = 400;
            this.oldpointer.x = this.game.input.activePointer.worldX.valueOf();
            this.oldpointer.y = this.game.input.activePointer.worldY.valueOf();
            this.game.physics.arcade.moveToPointer(this.player, this.currentSpeed, this.game.input.activePointer);

        }

        if (this.currentSpeed > 0 && this.inRadius(this.player, this.oldpointer, wideRadius)) {
            this.currentSpeed -= 4;
            //this.game.physics.arcade.moveToXY(this.carrot, this.currentSpeed, 1,2);
            //TODO need to fix movement when the pointer moves
            this.game.physics.arcade.moveToPointer(this.player, this.currentSpeed, this.game.input.activePointer);
        }

        var radius = 22;
        if (this.inRadius(this.player, this.oldpointer, radius)) {
            this.currentSpeed = 0;
            this.game.physics.arcade.moveToPointer(this.player, this.currentSpeed, this.game.input.activePointer);
        }



        // the only collision that an etherial being can have is with other monsters to possess them

        this.game.physics.arcade.collide(this.player, this.carrot, function (t, s) {
          console.log(this.player);
          console.log(s);
            this.possess(t, s);
            this.instructions.destroy();
        }, null, this);
        //the rabbit still needs to collide with things


        //this.game.physics.arcade.collide([this.rabbits], this.collideLayer);
        // this checks to see if the character is close to the enemy and causes the enemy to run away

        if (this.player.isPhysical) {
          this.instructions = this.game.add.text(500, 450, 'Now kill these carrot eating jerks', {font: '30px Arial', fill: '#000' });
          this.instructions.anchor.setTo(0.5, 0.5);
          for(var i = 0; i < this.rabbits.length; i++) {
            if (this.inRadius(this.player, this.rabbits[i], 200)) {
              //console.log('run away');
              var runAwayAngle = Phaser.Math.angleBetween(this.rabbits[i].x, this.rabbits[i].y, this.player.x, this.player.y) + Math.PI;
              //this.game.debug.text("RUN: " + runAwayAngle, 32, 32);
              this.game.physics.arcade.velocityFromRotation(runAwayAngle, 200, this.rabbits[i].body.velocity);
            }
            else {

                if (!this.inRadius(this.rabbits[i], { x: this.rabbits[i].originX, y: this.rabbits[i].originY }, 50)) {
                    //console.log('go to middle');
                    this.game.physics.arcade.moveToXY(this.rabbits[i], this.rabbits[i].originX, this.rabbits[i].originY, 100);

                }
            }

            this.game.physics.arcade.collide(this.player, this.rabbits[i], function (s, t: Phaser.Sprite) {
                if (s.isPhysical === true) {
                    t.kill();
                    this.rabbits.splice(i,1);

                }
                console.log(this.rabbits);
            }, null, this);
            this.game.physics.arcade.collide(this.player, this.collideLayer);
          }
        }
        this.gameCheck();
    }
    gameCheck () {
      if (this.rabbits.length <= 0) {
        this.gameWon();
      }
    }
    gameWon() {
        this.game.paused = true;
        var choiseLabel = this.game.add.text(this.player.x, this.player.y, 'YOU WON!', { font: '50px Arial', fill: '#000' });
        choiseLabel.anchor.setTo(0.5, 0.5);
    }
    possess(t,s) {
        t.kill();
        this.player = s;
        //when possessed the camera needs to be readjusted
        this.game.camera.follow(this.player);
        this.game.camera.focusOnXY(this.player.x, this.player.y);
        this.player.isPhysical = true;
    }

    inRadius(thing1, thing2, radius: number) {

        return thing1.x >= thing2.x - radius && thing2.x + radius >= thing1.x && thing1.y >= thing2.y - radius && thing2.y + radius >= thing1.y;
    }
    render() {

        //this.game.debug.text(this.carrot.x, 32, 32);
        //this.game.debug.text(this.carrot.y, 32, 82);

        //this.game.debug.text("old x: " + this.oldpointer.x, 32, 182);
        //this.game.debug.text("old y: " + this.oldpointer.y, 32, 282);

        //this.game.debug.text(this.currentSpeed, 32, 382);

        //this.game.debug.text("pointer x: " + this.game.input.activePointer.worldX, 32, 482);
        //this.game.debug.text("pointer y: " + this.game.input.activePointer.worldY, 32, 582);


    }
}
window.onload = function () {
    var game = new SimpleGame();
};
