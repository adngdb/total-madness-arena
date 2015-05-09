define(function () {

    var GeneticProcessor = function (manager, game) {
        this.manager = manager;
        this.game = game;
        this.speeded = [];

        this.init();
    };

    GeneticProcessor.prototype.init = function () {
    };

    GeneticProcessor.prototype.update = function () {
        var speed = this.manager.getComponentsData('Speed');
        for (var entity in speed) {
            if (!this.speeded[entity]) {
                this.speeded[entity] = entity;
                if (this.manager.entityHasComponent(entity, 'Movable')) {
                    var movableData = this.manager.getComponentDataForEntity('Movable', entity);
                    movableData.speed = movableData.speed * speed[entity].speedScale;
                }
            }
        }
    };

    return GeneticProcessor;
});
