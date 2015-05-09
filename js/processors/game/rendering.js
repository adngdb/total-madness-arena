define(['constants'], function (Const) {

    var ANIMATION_COMPONENTS = [
        'AnimationIdle',
        'AnimationJump',
        'AnimationWalk',
        'AnimationAttack1',
        'AnimationAttack2',
        'AnimationJumpFx',
        'AnimationAttackFx',
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
            // if 'deleted' : do not display (delete sprite)
            if (displayables[entity].deleted) {
                // delete the current sprite
                this.sprites[entity].visible = false;
                this.sprites[entity].animations.getAnimation('attackFx').isFinished = true;
                this.sprites[entity].animations.getAnimation('jumpFx').isFinished = true;
                continue;
            }

            var sprite = this.sprites[entity];
            sprite.visible = true;

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

                // Change the animation depending on the movement / action data.
                if (this.manager.entityHasComponent(entity, 'Animated')) {
                    var animatedData = this.manager.getComponentDataForEntity('Animated', entity);
                    if (this.manager.entityHasComponent(entity, 'Player')) {
                        var attack1 = this.manager.getComponentDataForEntity('Attack1', entity);
                        var attack2 = this.manager.getComponentDataForEntity('Attack2', entity);

                        if (!moveData.jumpAllowed) {
                            if (animatedData.current != 'jump') {
                                animatedData.current = 'jump';
                                this.sprites[entity].animations.play(animatedData.current);
                            }
                        }
                        else if (moveData.dx !== 0) {
                            if (animatedData.current != 'walk') {
                                animatedData.current = 'walk';
                                this.sprites[entity].animations.play(animatedData.current);
                            }
                        }
                        else if (attack1.lastAttack < attack1.cooldown) {
                            if (animatedData.current != 'attack1') {
                                animatedData.current = 'attack1';
                                this.sprites[entity].animations.play(animatedData.current);
                            }
                        }
                        else if (attack2.lastAttack < attack2.cooldown) {
                            if (animatedData.current != 'attack2') {
                                animatedData.current = 'attack2';
                                this.sprites[entity].animations.play(animatedData.current);
                            }
                        }
                        else {
                            if (animatedData.current != 'idle') {
                                animatedData.current = 'idle';
                                this.sprites[entity].animations.play(animatedData.current);
                            }
                        }
                    }
                    else {
                        // non player => FX sprite
                        if (!animatedData.started) {
                            animatedData.started = true;
                            this.sprites[entity].animations.play(animatedData.current);
                        }
                        if (this.sprites[entity].animations.getAnimation('attackFx').isFinished
                            && this.sprites[entity].animations.getAnimation('jumpFx').isFinished) {
                            displayables[entity].deleted = true;
                        }
                    }
                }
            }

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
