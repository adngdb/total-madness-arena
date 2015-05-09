define(['manager'], function (GlobalManager) {
    var Upgrade = function () {
        this.timer = null;
        this.remainingTimeText = null;
    };

    Upgrade.prototype = {
        create: function () {
            this.game.add.sprite(0, 0, 'upgrade_menu_back_ground');
            this.game.add.sprite(0, 0, 'upgrade_menu_middleground');
            this.game.add.sprite(0, 0, 'upgrade_menu_foreground');

            this.timer = this.game.time.create(false);
            this.timer.loop(6000, this.endUpgrade, this);
            this.timer.start();

            var style = { font: "19.5pt retroComputerDemo", fill: "#000000", align: "center" };
            this.remainingTimeText = this.game.add.text(676, 50, "5", style);
        },

        endUpgrade: function () {
            this.game.state.start('Game');
        },

        update: function () {
            if (this.timer.ms > 0) {
                this.remainingTimeText.text = parseInt(this.timer.duration.toFixed(0) / 1000);
            }
        },

    };

    return Upgrade;
});
