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
        this.sprites[entity] = sprite;
    };

    RenderingProcessor.prototype.createText = function (entity, textData) {
        var posData = this.manager.getComponentDataForEntity('Position', entity);

        var style = {
            font: textData.font,
            fill: textData.fill,
            align: textData.align,
        };
        var text = this.game.add.text(posData.x, posData.y, textData.content, style);
        this.texts[entity] = text;
    };

    RenderingProcessor.prototype.update = function (dt) {
        var entity;

        // Display all sprites.
        var displayables = this.manager.getComponentsData('Displayable');
        for (entity in displayables) {
            // First create the actual Phaser.Sprite object if it doesn't exist yet.
            if (!this.sprites[entity]) {
                this.createSprite(entity, displayables[entity]);
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
