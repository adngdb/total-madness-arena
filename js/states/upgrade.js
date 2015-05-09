define([
    'entity-manager',
],
function (
    EntityManager
) {
    var Upgrade = function () {
    };

    Upgrade.prototype = {

        update: function () {
        },

        preload: function () {
            this.game.load.spritesheet('upgradeMenuBackGround', 'assets/gfx/upgradeMenuBackGround.png', 960, 768);
            this.game.load.spritesheet('upgradeMenuMiddleGround', 'assets/gfx/upgradeMenuMiddleGround.png', 960, 768);
            this.game.load.spritesheet('upgradeMenuForeGround', 'assets/gfx/upgradeMenuForeGround.png', 960, 768);
            this.game.load.spritesheet('upgradeMenuBox', 'assets/gfx/upgradeMenuBox.png', 321, 73);
        },

        create: function () {
            this.game.add.sprite(0, 0, 'upgradeMenuBackGround');
            this.game.add.sprite(0, 0, 'upgradeMenuMiddleGround');
            this.game.add.sprite(0, 0, 'upgradeMenuForeGround');
        },

    };

    return Upgrade;
});
