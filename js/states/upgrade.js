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

        create: function () {
            this.game.add.sprite(0, 0, 'upgradeMenuBackGround');
            this.game.add.sprite(0, 0, 'upgradeMenuMiddleGround');
            this.game.add.sprite(0, 0, 'upgradeMenuForeGround');
        },

    };

    return Upgrade;
});
