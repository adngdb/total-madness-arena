define(function () {

    var RenderingProcessor = function (manager, game) {
        this.manager = manager;
        this.game = game;

        // An associative array for entities' sprites.
        //      entityId -> Sprite{}
        // Phaser handles all the displaying so we only need to create Sprites
        // once, and then keep a track of those Sprite objects.
        this.sprites = {};
    };

    RenderingProcessor.prototype.createSprite = function (displayableId, displayableData) {
        var positionData = this.manager.getComponentDataForEntity('Position', displayableId);

        this.sprites[displayableId] = this.game.add.sprite(positionData.x, positionData.y, displayableData.sprite);
    };

    RenderingProcessor.prototype.update = function () {
        // Display the map.
        var maps = this.manager.getComponentsData('Map');
        for (var mapId in maps) {
            if (maps[mapId]._map === null) {
                // UGLY HACK
                // Store the created map object in the component, so that it
                // can be re-used by the PhysicsProcessor for collisions.
                maps[mapId]._map = this.game.add.tiledmap(maps[mapId].resourceId);
            }
        }

        // Display all sprites.
        var displayables = this.manager.getComponentsData('Displayable');
        for (var entity in displayables) {
            // First create the actual Phaser.Sprite object if it doesn't exist yet.
            if (!this.sprites[entity]) {
                this.createSprite(entity, displayables[entity]);
            }

            var sprite = this.sprites[entity];

            // Then update the position of each sprite.
            if (this.manager.entityHasComponent(entity, 'Movable')) {
                var positionData = this.manager.getComponentDataForEntity('Position', entity);
                sprite.x = positionData.x;
                sprite.y = positionData.y;
            }
        }
    };

    return RenderingProcessor;
});
