define([
    'entity-manager',
    'components/match/player',
    'assemblages/match/player-1',
    'assemblages/match/player-2',
], function (EntityManager, Player, Player_1, Player_2) {
    var PlayerChoice = function () {
    };

    PlayerChoice.prototype = {

        init: function() {
            // Create the Match Manager.
            this.manager = new EntityManager();
            this.manager.addComponent(Player.name, Player);

            this.manager.addAssemblage(Player_1.name, Player_1);
            this.manager.addAssemblage(Player_2.name, Player_2);

            this.manager.createEntityFromAssemblage('Player_1');
            this.manager.createEntityFromAssemblage('Player_2');
        },

        create: function () {
            this.game.state.start('Game', true, false, this.manager);
        },

        update: function () {
        },

    };

    return PlayerChoice;
});
