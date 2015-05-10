define(function () {

    var ManipulationProcessor = function (manager, game) {
        this.manager = manager;
        this.game = game;
        this.speeded = [];
        this.gravited = [];

        this.init();
    };

    ManipulationProcessor.prototype.init = function () {
    };

    ManipulationProcessor.prototype.update = function () {
        this.manipulateSpeed();
        this.manipulateGravity();
    };

    ManipulationProcessor.prototype.manipulateSpeed = function () {
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

    ManipulationProcessor.prototype.manipulateGravity = function () {
        var gravity = this.manager.getComponentsData('Gravity');
        for (var entity in gravity) {
            if (!this.gravited[entity]) {
                this.gravited[entity] = entity;
                if (this.manager.entityHasComponent(entity, 'Movable')) {
                    var movableData = this.manager.getComponentDataForEntity('Movable', entity);
                    movableData.gravity = movableData.gravity * gravity[entity].gravityScale;
                }
            }
        }
    };

    return ManipulationProcessor;
});
