define(['manager'], function (GlobalManager) {
    var PlayerChoice = function () {
    };

    PlayerChoice.prototype = {

        init: function() {
            GlobalManager.resetPlayers();
        },

        create: function () {
            this.game.state.start('Game');
        },

        update: function () {
        },

    };

    return PlayerChoice;
});
