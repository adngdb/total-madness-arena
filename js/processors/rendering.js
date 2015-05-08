define(function () {

    var RenderingProcessor = function (manager, game) {
        this.manager = manager;
        this.game = game;

        // sprites entityId -> sprite{}
        this.sprites = {};

        this.initSprites();
    };

    RenderingProcessor.prototype.initSprites = function () {
        // Load the map.
        var map = this.game.add.tiledmap('level_map');

        var displayables = this.manager.getComponentsData('Displayable');
        for (var entityId in displayables) {
            this.createSprite(entityId, displayables[entityId]);
        }
    };

    RenderingProcessor.prototype.createSprite = function (displayableId, displayableData) {
        var positionData = this.manager.getComponentDataForEntity('Position', displayableId);

        this.sprites[displayableId] = this.game.add.sprite(positionData.x, positionData.y, displayableData.sprite);
    };

    RenderingProcessor.prototype.update = function () {
        for (var entityId in this.sprites) {
            var sprite = this.sprites[entityId];

            if (this.manager.entityHasComponent(entityId, 'Movable')) {
                var positionData = this.manager.getComponentDataForEntity('Position', entityId);

                sprite.x = positionData.x;
                sprite.y = positionData.y;
            }
        }
    };

    return RenderingProcessor;
});
