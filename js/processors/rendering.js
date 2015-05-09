define(['constants'], function (Const) {

    var RenderingProcessor = function (manager, game) {
        this.manager = manager;
        this.game = game;

        // An associative array for entities' sprites.
        //      entityId -> Sprite{}
        // Phaser handles all the displaying so we only need to create Sprites
        // once, and then keep a track of those Sprite objects.
        this.sprites = {};

        // For debug.
        this.graphics = null;
    };

    RenderingProcessor.prototype.createSprite = function (entity, displayableData) {
        var positionData = this.manager.getComponentDataForEntity('Position', entity);

        var sprite = this.game.add.sprite(positionData.x, positionData.y, displayableData.sprite);
        // this.game.physics.p2.enable(sprite);

        // if (this.manager.entityHasComponent(entity, 'Movable')) {
        //     sprite.data.gravityScale = this.manager.getComponentDataForEntity('Movable', entity).gravity;
        // }
        this.sprites[entity] = sprite;

        if (this.manager.entityHasComponent(entity, 'Animated')) {
            // Add all animations to that Sprite.
            var animationComponents = ['AnimationIdle', 'AnimationWalk'];

            for (var c in animationComponents) {
                var comp = animationComponents[c];
                if (this.manager.entityHasComponent(entity, comp)) {
                    var animData = this.manager.getComponentDataForEntity(comp, entity);
                    this.sprites[entity].animations.add(animData.anim, animData.keys, animData.speed, animData.loop);
                }
            }
        }
    };

    RenderingProcessor.prototype.update = function (dt) {
        var entity;

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
        for (entity in displayables) {
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

        // Run animations.
        var animated = this.manager.getComponentsData('Animated');
        for (entity in animated) {
            this.sprites[entity].animations.play(animated[entity].current);
        }

        // DEBUG
        if (Const.debug) {
            if (this.graphics) {
                this.game.world.remove(this.graphics);
            }

            this.graphics = this.game.add.graphics(0, 0);

            this.graphics.lineStyle(1, 0xffd900, 1);

            var boxes = this.manager.getComponentsData('BoundingBox');
            for (var b in boxes) {
                var box = boxes[b];
                var pos = this.manager.getComponentDataForEntity('Position', b);

                this.graphics.moveTo(pos.x, pos.y);
                this.graphics.lineTo(pos.x + box.width, pos.y);
                this.graphics.lineTo(pos.x + box.width, pos.y + box.height);
                this.graphics.lineTo(pos.x, pos.y + box.height);
                this.graphics.lineTo(pos.x, pos.y);
                this.graphics.endFill();
            }
        }
    };

    return RenderingProcessor;
});
