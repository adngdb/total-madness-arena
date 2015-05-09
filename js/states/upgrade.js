define(function () {
    var Upgrade = function () {
    };

    Upgrade.prototype = {

        create: function () {
            this.game.add.sprite(0, 0, 'upgrade_menu_back_ground');
            this.game.add.sprite(0, 0, 'upgrade_menu_middleground');
            this.game.add.sprite(0, 0, 'upgrade_menu_foreground');
        },

        update: function () {
        },

    };

    return Upgrade;
});
