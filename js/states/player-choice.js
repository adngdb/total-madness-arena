define(function () {
    var PlayerChoice = function () {
    };

    PlayerChoice.prototype = {

        create: function () {
            this.game.state.start('Game');
        },

        update: function () {
        },

    };

    return PlayerChoice;
});
