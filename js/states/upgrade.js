define([
    'entity-manager',
    'manager',

    'components/upgrade/input',
    'components/upgrade/genetic',

    'processors/upgrade/input',
    'processors/upgrade/genetic',
], function (
    EntityManager,
    GlobalManager,

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
        init: function () {
            var self = this;

            this.playerGenetics = GlobalManager.geneticManipulations;
            this.player2Genetics = GlobalManager.geneticManipulations;

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

            this.timer = this.game.time.create(false);
            this.timer.loop(5000, this.endUpgrade, this);
            this.timer.start();

            var style = { font: "24pt retroComputerDemo", fill: "#000000", align: "center" };
            this.remainingTimeText = this.game.add.text(676, 50, "5", style);
        },

        endUpgrade: function () {
            this.game.state.start('Game');
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
