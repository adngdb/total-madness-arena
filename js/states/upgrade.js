define([
    'entity-manager',
    'global-manager',

    // components
    'components/global/displayable',
    'components/global/position',
    'components/global/text',

    // processors
    'processors/upgrade/rendering',
], function (
    EntityManager,
    GlobalManager,

    // components
    Displayable,
    Position,
    Text,

    // processors
    RenderingProcessor
) {
    var Upgrade = function () {
        this.timer = null;
        this.remainingTimeText = null;
    };

    Upgrade.prototype = {
        init: function (matchManager) {
            this.matchManager = matchManager;
            this.manager = new EntityManager();

            var components = [
                Displayable,
                Position,
                Text,
            ];
            for (var i = components.length - 1; i >= 0; i--) {
                this.manager.addComponent(components[i].name, components[i]);
            }

            this.manager.addProcessor(new RenderingProcessor(this.manager, this.game));
        },

        create: function () {
            var backgroundSprites = [
                'upgrade_menu_back_ground',
                'upgrade_menu_middleground',
                'upgrade_menu_foreground',
            ];
            for (var i = 0; i < backgroundSprites.length; i++) {
                var entity = this.manager.createEntity(['Position', 'Displayable']);
                this.manager.updateComponentDataForEntity('Displayable', entity, {sprite: backgroundSprites[i]});
            }

            // var geneticTextStyle = { font: "16pt retroComputerDemo", fill: "#000000", align: "center" };
            // var buttonTextStyle = { font: "16pt retroComputerDemo", fill: "#F7F48D", align: "center" };
            // var nbGeneric = 0;
            // for(var generic in this.playerGenetics){
            //     this.game.add.sprite(81, 225 + (86 * nbGeneric), 'upgrade_menu_box');
            //     this.game.add.text(91, 232 + (86 * nbGeneric), generic, geneticTextStyle);
            //     this.game.add.text(330, 267 + (86 * nbGeneric), "A", buttonTextStyle);
            //     nbGeneric++;
            // }

            this.timer = this.game.time.create(false);
            this.timer.loop(5000, this.endUpgrade, this);
            this.timer.start();

            this.timerTextId = this.manager.createEntity(['Position', 'Text']);
            this.manager.updateComponentDataForEntity('Text', this.timerTextId, {
                content: '5',
                font: '24pt retroComputerDemo',
            });
            this.manager.updateComponentDataForEntity('Position', this.timerTextId, {
                x: 676,
                y: 50,
            });
        },

        endUpgrade: function () {
            this.game.state.start('Game', true, false, this.matchManager);
        },

        update: function () {
            GlobalManager.update(this.game.time.elapsed);
            this.manager.update(this.game.time.elapsed);

            if (this.timer.ms > 0) {
                this.manager.updateComponentDataForEntity('Text', this.timerTextId, {
                    content: parseInt(this.timer.duration.toFixed(0) / 1000) + 1,
                });
            }
        },

    };

    return Upgrade;
});
