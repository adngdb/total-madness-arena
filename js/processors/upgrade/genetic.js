define(['manager'], function (GlobalManager) {

    var GeneticProcessor = function (manager, game) {
        this.manager = manager;
        this.game = game;

        this.init();
    };

    GeneticProcessor.prototype.init = function () {
    };

    GeneticProcessor.prototype.update = function () {
        var inputs = this.manager.getComponentsData('Input');

        for (var input in inputs) {
            if (inputs[input].active) {
                GlobalManager.addGeneticToPlayer(inputs[input].player, inputs[input].genetic);
            }
        }
    };

    return GeneticProcessor;
});
