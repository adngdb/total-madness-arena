define(function () {
    var GlobalManager = function () {
        this.players = [];
        this.geneticManipulations = [];
    };

    GlobalManager.prototype = {

        addPlayer: function (player) {
            if (!this.players[player]) {
                this.players[player] = {id: player, genetics: []};
            }
        },

        addGeneticManipulation: function (geneticManipulation) {
            if (!this.geneticManipulations[geneticManipulation]) {
                this.geneticManipulations[geneticManipulation] = geneticManipulation;
            }
        },

        resetPlayers: function () {
            this.players = [];
        },
    };

    return new GlobalManager();
});
