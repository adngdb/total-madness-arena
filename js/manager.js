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

        addGeneticToPlayer: function (player, genetic) {
            if (this.players[player] && !this.players[player]['genetics'][genetic]) {
                this.players[player]['genetics'][genetic] = genetic;
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
