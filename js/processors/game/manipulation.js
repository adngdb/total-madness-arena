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
        this.manipulateZangief();
        this.manipulateFlash();
        this.manipulatePervert();
        this.manipulateNega();
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

    ManipulationProcessor.prototype.manipulateZangief = function () {
        var zangief = this.manager.getComponentsData('Zangief');
        for (var entity in zangief) {
            if (!this.gravited[entity]) {
                this.gravited[entity] = entity;
                if (this.manager.entityHasComponent(entity, 'Attack1')) {
                    var attack1Data = this.manager.getComponentDataForEntity('Attack1', entity);
                    attack1Data.value = attack1Data.value * zangief[entity].value;
                    attack1Data.cooldown = attack1Data.cooldown * zangief[entity].cooldown;
                }
                if (this.manager.entityHasComponent(entity, 'Attack2')) {
                    var attack2Data = this.manager.getComponentDataForEntity('Attack2', entity);
                    attack2Data.value = attack2Data.value * zangief[entity].value;
                    attack2Data.cooldown = attack2Data.cooldown * zangief[entity].cooldown;
                }
            }
        }
    };

    ManipulationProcessor.prototype.manipulateFlash = function () {
        var flash = this.manager.getComponentsData('Flash');
        for (var entity in flash) {
            if (!this.gravited[entity]) {
                this.gravited[entity] = entity;
                if (this.manager.entityHasComponent(entity, 'Attack1')) {
                    var attack1Data = this.manager.getComponentDataForEntity('Attack1', entity);
                    attack1Data.value = attack1Data.value * flash[entity].value;
                    attack1Data.cooldown = attack1Data.cooldown * flash[entity].cooldown;
                }
                if (this.manager.entityHasComponent(entity, 'Attack2')) {
                    var attack2Data = this.manager.getComponentDataForEntity('Attack2', entity);
                    attack2Data.value = attack2Data.value * flash[entity].value;
                    attack2Data.cooldown = attack2Data.cooldown * flash[entity].cooldown;
                }
            }
        }
    };

    ManipulationProcessor.prototype.manipulatePervert = function () {
        var pervert = this.manager.getComponentsData('Pervert');
        for (var entity in pervert) {
            if (!this.speeded[entity]) {
                this.speeded[entity] = entity;
                if (this.manager.entityHasComponent(entity, 'Displayable')) {
                    var displayableData = this.manager.getComponentDataForEntity('Displayable', entity);
                    displayableData.deleted = !pervert[entity].visible;
                }
            }
        }
    };

    ManipulationProcessor.prototype.manipulateNega = function () {
        var pervert = this.manager.getComponentsData('Nega');
        for (var entity in pervert) {
            if (!this.speeded[entity]) {
                this.speeded[entity] = entity;
                if (this.manager.entityHasComponent(entity, 'Displayable')) {
                    var displayableData = this.manager.getComponentDataForEntity('Displayable', entity);

                    var spriteLetter = displayableData.sprite.substr(-2);
                    displayableData.sprite = displayableData.sprite.slice(0,-2) + (spriteLetter == '_a' ? '_b' : '_a');
                }
            }
        }
    };

    return ManipulationProcessor;
});
