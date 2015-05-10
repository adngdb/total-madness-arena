define(function () {

    var DeathProcessor = function (manager, game, matchManager) {
        this.manager = manager;
        this.game = game;
        this.matchManager = matchManager;
        this.init();
    };

    DeathProcessor.prototype.init = function () {
    };

    DeathProcessor.prototype.update = function () {
        // check player's life if someone is dead (or both)
        var life = this.manager.getComponentsData('Life');
        var end = false;
        var dead = null;
        for (var entityId in life) {
            var currentLife = life[entityId];
            if (currentLife.value <= 0) {
                var player = this.manager.getComponentDataForEntity('Player', entityId);
                console.log('MORT du joueur n°' + player.number);
                end = true;
                dead = player.number;
            }
        }
        if (end) {
            var games = this.manager.getComponentsData('Game');
            for (var g in games) {
                games[g].gameOver = true;
                games[g].winner = 1 - dead;
            }
        }
    };

    return DeathProcessor;
});
