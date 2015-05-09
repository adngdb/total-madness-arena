define([
    'entity-manager',

    'components/upgrade/input',
    'components/upgrade/genetic',

    'processors/upgrade/input',
    'processors/upgrade/genetic',
], function (
    EntityManager,

    Input,
    Genetic,

    InputProcessor,
    GeneticProcessor
) {
    var Upgrade = function () {
        this.timer = null;
        this.remainingTimeText = null;
        this.playerGenetics = [];
        this.player2Genetics = [];
        this.manager = null;
    };

    Upgrade.prototype = {
        init: function (matchManager) {
            this.matchManager = matchManager;

            var self = this;

            this.manager = new EntityManager();
            var components = [
                Input,
                Genetic,
            ];

            components.forEach(function (element, index, array) {
                self.manager.addComponent(element.name, element);
            });

            this.manager.addProcessor(new InputProcessor(this.manager, this.game));
            this.manager.addProcessor(new GeneticProcessor(this.manager, this.game));

            this.playerGenetics.forEach(function (element, index, array) {
                var genetic = self.manager.createEntity([
                    'Genetic', 'Input'
                ]);
                self.manager.getComponentDataForEntity('Genetic', genetic).name = element;
                self.manager.getComponentDataForEntity('Genetic', genetic).player = 0;
            });

            this.player2Genetics.forEach(function (element, index, array) {
                var genetic = self.manager.createEntity([
                    'Genetic', 'Input'
                ]);
                self.manager.getComponentDataForEntity('Genetic', genetic).name = element;
                self.manager.getComponentDataForEntity('Genetic', genetic).player = 01;
            });
        },

        create: function () {
            this.game.add.sprite(0, 0, 'upgrade_menu_back_ground');
            this.game.add.sprite(0, 0, 'upgrade_menu_middleground');
            this.game.add.sprite(0, 0, 'upgrade_menu_foreground');

            var geneticTextStyle = { font: "16pt retroComputerDemo", fill: "#000000", align: "center" };
            var buttonTextStyle = { font: "16pt retroComputerDemo", fill: "#F7F48D", align: "center" };
            var nbGeneric = 0;
            for(var generic in this.playerGenetics){
                this.game.add.sprite(81, 225 + (86 * nbGeneric), 'upgrade_menu_box');
                this.game.add.text(91, 232 + (86 * nbGeneric), generic, geneticTextStyle);
                this.game.add.text(330, 267 + (86 * nbGeneric), "A", buttonTextStyle);
                nbGeneric++;
            }

            this.timer = this.game.time.create(false);
            this.timer.loop(5000, this.endUpgrade, this);
            this.timer.start();

            var style = { font: "24pt retroComputerDemo", fill: "#000000", align: "center" };
            this.remainingTimeText = this.game.add.text(676, 50, "5", style);
        },

        endUpgrade: function () {
            this.game.state.start('Game', true, false, this.matchManager);
        },

        update: function () {
            this.manager.update(this.game.time.elapsed);

            if (this.timer.ms > 0) {
                this.remainingTimeText.text = parseInt(this.timer.duration.toFixed(0) / 1000) + 1;
            }
        },

    };

    return Upgrade;
});
