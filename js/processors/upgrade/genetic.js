define(function () {

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
                console.log('pouet');
                console.log(inputs[input]);

            }
        }
    };

    return GeneticProcessor;
});
