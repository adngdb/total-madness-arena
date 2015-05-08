define(function () {

    var DeathProcessor = function (manager, game) {
        this.manager = manager;
        this.game = game;

        this.init();
    };

    DeathProcessor.prototype.init = function () {
    };

    DeathProcessor.prototype.update = function () {
        // check player's life if someone is dead (or both)
        var life = this.manager.getComponentsData('Life');
        var reboot = false;
        for (var entityId in life) {
            var currentLife = life[entityId];
            if (currentLife.value <= 0) {
                var player = this.manager.getComponentDataForEntity('Player', entityId);
console.log('MORT du joueur n°' + player.number);
                reboot = true;
            }
        }
        if (reboot) {
console.log('REBOOOT!!!');
            this.game.state.restart('Game');
        }
    };

    return DeathProcessor;
});
