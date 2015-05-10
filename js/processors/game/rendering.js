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
        this.texts = {};

        this.player0LifeBar = null;
        this.player1LifeBar = null;
        this.lifeGaugeMaxSize = null;

        // For debug.
        this.graphics = null;
    };

    RenderingProcessor.prototype.createSprite = function (entity, displayableData) {
        var positionData = this.manager.getComponentDataForEntity('Position', entity);

        var sprite = this.game.add.sprite(positionData.x, positionData.y, displayableData.sprite);
        sprite.anchor.setTo(.5, .5);
        sprite.scale.x = displayableData.scaleX;
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
        if (this.manager.entityHasComponent(entity, 'LifeBar')) {
            var lifeBar = this.manager.getComponentDataForEntity('LifeBar', entity);
            sprite.cropEnabled = true;
            if (lifeBar.player == 1) {
                // player0 lifebar anchor LEFT
                sprite.anchor.setTo(0, 0.5);
                this.player1LifeBar = sprite;
                this.lifeGaugeMaxSize = -sprite.width;
            }
            else {
                // player0 lifebar anchor LEFT
                sprite.anchor.setTo(0, 0.5);
                this.player0LifeBar = sprite;
            }
        }
    };

    RenderingProcessor.prototype.createText = function (entity, textData) {
        var posData = this.manager.getComponentDataForEntity('Position', entity);

        var style = {
            font: textData.fontSize + ' ' + textData.font,
            fill: textData.fill,
            align: textData.align,
        };
        var text = this.game.add.text(posData.x, posData.y, textData.content, style);
        text.anchor.setTo(textData.anchorX, textData.anchorY);
        this.texts[entity] = text;
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

        // update lifeGauge
        var players = this.manager.getComponentsData('Player');
        for (entity in players) {
            var lifeData = this.manager.getComponentDataForEntity('Life', entity);
            if (players[entity].number == 0) {
                this.updateLife(lifeData, this.player0LifeBar);
            } else if (players[entity].number == 1) {
                this.updateLife(lifeData, this.player1LifeBar);
            }
        }

        // Display all sprites.
        var displayables = this.manager.getComponentsData('Displayable');
        for (entity in displayables) {
            // if 'deleted' : do not display (no sprite)
            if (displayables[entity].deleted) {
                continue;
            }
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
                            this.sprites[entity].animations.play(animatedData.current, null, null, true);
                            displayables[entity].deleted = true;
                            this.sprites[entity] = null;
                        }
                    }
                }
            }
        }

        // Display all texts.
        var texts = this.manager.getComponentsData('Text');
        for (entity in texts) {
            // First create the actual Phaser.Text object if it doesn't exist yet.
            if (!this.texts[entity]) {
                this.createText(entity, texts[entity]);
            }
            else {
                this.texts[entity].text = texts[entity].content;
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

    RenderingProcessor.prototype.updateLife = function(lifeData, lifeBar) {
        if (lifeBar === null) {
            return;
        }
        var croppedWidth = (lifeData.value / 100.) * this.lifeGaugeMaxSize;
        lifeBar.crop({
            x: 0,
            y: 0,
            width: croppedWidth,
            height: lifeBar.height
        });

    }

    return RenderingProcessor;
});
