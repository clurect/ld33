var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var MovingEntity = (function (_super) {
    __extends(MovingEntity, _super);
    function MovingEntity(game, x, y, objs) {
        _super.call(this, game, x, y);
        this.isPhysical = true;
        this.wanderTime = 0;
    }
    return MovingEntity;
}(Phaser.Sprite));
