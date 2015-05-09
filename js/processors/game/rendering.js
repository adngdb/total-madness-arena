define(['constants'], function (Const) {

    var ANIMATION_COMPONENTS = [
        'AnimationIdle',
        'AnimationJump',
        'AnimationWalk'
    ];

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
        sprite.anchor.setTo(.5, .5);
        this.sprites[entity] = sprite;

        if (this.manager.entityHasComponent(entity, 'Animated')) {
            // Add all animations to that Sprite.
            for (var c in ANIMATION_COMPONENTS) {
                var comp = ANIMATION_COMPONENTS[c];
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

            if (this.manager.entityHasComponent(entity, 'Movable')) {
                var moveData = this.manager.getComponentDataForEntity('Movable', entity);

                // Flip the sprite horizontally if needed.
                if (moveData.goingRight) {
                    sprite.scale.x = 1;
                }
                else {
                    sprite.scale.x = -1;
                }

                // Change the animation depending on the movement data.
                if (this.manager.entityHasComponent(entity, 'Animated')) {
                    var animatedData = this.manager.getComponentDataForEntity('Animated', entity);

                    if (!moveData.jumpAllowed) {
                        animatedData.current = 'jump';
                    }
                    else if (moveData.dx !== 0) {
                        animatedData.current = 'walk';
                    }
                    else {
                        animatedData.current = 'idle';
                    }
                }
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

                this.graphics.moveTo(pos.x + box.x, pos.y + box.y);
                this.graphics.lineTo(pos.x + box.x + box.width, pos.y + box.y);
                this.graphics.lineTo(pos.x + box.x + box.width, pos.y + box.y + box.height);
                this.graphics.lineTo(pos.x + box.x, pos.y + box.y + box.height);
                this.graphics.lineTo(pos.x + box.x, pos.y + box.y);
                this.graphics.endFill();
            }
        }
    };

    return RenderingProcessor;
});
