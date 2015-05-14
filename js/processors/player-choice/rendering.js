define(function () {

    var RenderingProcessor = function (manager, game) {
        this.manager = manager;
        this.game = game;

        // An associative array for entities' sprites.
        //      entityId -> Sprite{}
        // Phaser handles all the displaying so we only need to create Sprites
        // once, and then keep a track of those Sprite objects.
        this.sprites = {};

        // An associative array for entities' texts.
        //      entityId -> Text{}
        // Phaser handles all the displaying so we only need to create Texts
        // once, and then keep a track of those Text objects.
        this.texts = {};
    };

    RenderingProcessor.prototype.createSprite = function (entity, displayableData) {
        var posData = this.manager.getComponentDataForEntity('Position', entity);

        var sprite = this.game.add.sprite(posData.x, posData.y, displayableData.sprite);
        if (this.manager.entityHasComponent(entity, 'Animated')) {
            var animData = this.manager.getComponentDataForEntity('AnimationIdle', entity);
            sprite.animations.add(animData.anim, animData.keys, animData.speed, animData.loop);
            sprite.scale.x = displayableData.scaleX;
            sprite.scale.y = displayableData.scaleY;
            sprite.anchor.setTo(.5, .5);
        }
        else {
            sprite.sendToBack();
        }
        this.sprites[entity] = sprite;
    };

    RenderingProcessor.prototype.createText = function (entity, textData) {
        var posData = this.manager.getComponentDataForEntity('Position', entity);

        var style = {
            font: textData.fontSize + ' ' + textData.font,
            fill: textData.fill,
            align: textData.align,
        };
        var text = this.game.add.text(posData.x, posData.y, textData.content, style);
        text.anchor.setTo(.5, .5);
        this.texts[entity] = text;
    };

    RenderingProcessor.prototype.update = function (dt) {
        var entity;

        // Destroy the sprites of all missing entities.
        for (var id in this.sprites) {
            if (this.manager.entities.indexOf(parseInt(id)) === -1) {
                this.sprites[id].destroy();
                delete this.sprites[id];
            }
        }

        // Destroy the texts of all missing entities.
        for (var id in this.texts) {
            if (this.manager.entities.indexOf(parseInt(id)) === -1) {
                this.texts[id].destroy();
                delete this.texts[id];
            }
        }

        // Display all sprites.
        var displayables = this.manager.getComponentsData('Displayable');
        for (entity in displayables) {
            // First create the actual Phaser.Sprite object if it doesn't exist yet.
            if (!this.sprites[entity]) {
                this.createSprite(entity, displayables[entity]);
            }
            if (displayables[entity].deleted) {
                this.sprites[entity].visible = false;
                continue;
            }
            // Change the animation depending on the movement / action data.
            if (this.manager.entityHasComponent(entity, 'Animated')) {
                var animatedData = this.manager.getComponentDataForEntity('Animated', entity);
                if (animatedData.current !== 'idle') {
                    animatedData.current = 'idle';
                    this.sprites[entity].animations.play(animatedData.current);
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
    };

    return RenderingProcessor;
});
