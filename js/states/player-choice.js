define(function () {
    var PlayerChoice = function () {
    };

    PlayerChoice.prototype = {

        create: function () {
            console.log('player choice');
            this.game.state.start('Game');
        },

        update: function () {
        },

    };

    return PlayerChoice;
});
