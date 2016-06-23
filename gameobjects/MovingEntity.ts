class MovingEntity extends Phaser.Sprite {
  isPhysical: boolean;
  possessible: boolean;
  isPossessed: boolean;
  originX: number;
  originY: number;
  wanderTime:number;
  objs;
  entityType:String;
  constructor(game, x, y, objs) {
    super(game, x, y);
    this.isPhysical = true;
    this.wanderTime = 0;
  }
}
