define([
    'entity-manager',
    'global-manager',

    // components
    'components/global/displayable',
    'components/global/position',
    'components/global/text',
    'components/global/player',
    'components/global/sound',

    'components/manipulations/speed',
    'components/manipulations/gravity',
    'components/manipulations/zangief',

    'components/upgrade/manipulations',
    'components/upgrade/available-manips',
    'components/upgrade/manip-input',

    // processors
    'processors/global/sound',
    'processors/upgrade/rendering',
    'processors/upgrade/input',
], function (
    EntityManager,
    GlobalManager,

    // components
    Displayable,
    Position,
    Text,
    Player,
    Sound,

    Speed,
    Gravity,
    Zangief,

    Manipulations,
    AvailableManips,
    ManipInput,

    // processors
    SoundProcessor,
    RenderingProcessor,
    InputProcessor
) {
    var Upgrade = function () {
        this.timer = null;
    };

    Upgrade.prototype = {
        init: function (matchManager) {
            this.matchManager = matchManager;
            this.manager = new EntityManager();

            // add components
            var components = [
                Displayable,
                Position,
                Text,
                Player,
                Sound,
                Manipulations,
                AvailableManips,
                ManipInput,
                Speed,
                Gravity,
                Zangief,
            ];
            for (var i = components.length - 1; i >= 0; i--) {
                this.manager.addComponent(components[i].name, components[i]);
            }

            // add processors
            this.soundProcessor = new SoundProcessor(this.manager, this.game);

            this.manager.addProcessor(new InputProcessor(this.manager));
            this.manager.addProcessor(this.soundProcessor);
            this.manager.addProcessor(new RenderingProcessor(this.manager, this.game));
        },

        create: function () {
            var NUMBER_OF_CHOICES = 3;
            var currentNumberOfChoices = 0;

            // Create manipulation entities.
            var allManipsId = this.manager.createEntity(['Manipulations']);
            var allManips = this.manager.getComponentDataForEntity('Manipulations', allManipsId).allManips;
            console.log(allManips);

            var allManipNames = [];
            var manipulationsData = this.manager.createEntity(['Speed', 'Gravity', 'Zangief']);
            for (var manip in allManips) {
                allManipNames[allManips[manip]] = this.manager.getComponentDataForEntity(allManips[manip], manipulationsData).name;
            }
            console.log(allManipNames);

            var allInputs = GlobalManager.getComponentsData('Input');

            // Generate a list of available manipulations for each player.
            for (var i = 0; i < 2; i++) {
                var pl = this.manager.createEntity(['Player', 'AvailableManips']);
                this.manager.updateComponentDataForEntity('Player', pl, {number: i});

                var matchPlayers = this.matchManager.getComponentsData('Player');
                var playerManips = [];
                for (var matchPlayer in matchPlayers) {
                    if (matchPlayers[matchPlayer].number === i) {
                        playerManips = matchPlayers[matchPlayer].manipulations;
                    }
                }

                var choices = [];
                for (var j = 0, maxln = allManips.length; j < NUMBER_OF_CHOICES && j < maxln; j++) {
                    choices.push(allManips[j]);
                }
                choices = choices.filter(function(i) {return playerManips.indexOf(i) < 0;});
                currentNumberOfChoices = choices.length;
                this.manager.updateComponentDataForEntity('AvailableManips', pl, {manips: choices});

                var markedInput = {};
                for (var k = 0, ln = choices.length; k < ln; k++) {
                    var manipInputId = this.manager.createEntity(['ManipInput', 'Player']);
                    this.manager.updateComponentDataForEntity('Player', manipInputId, {number: i});

                    var inputId = null;
                    for (var key in allInputs) {
                        var input = allInputs[key];

                        if (input.player === i && !markedInput[key]) {
                            inputId = key;
                            markedInput[key] = true;
                            break;
                        }
                    }

                    var newState = {
                        manip: choices[k],
                        input: inputId,
                    };
                    this.manager.updateComponentDataForEntity('ManipInput', manipInputId, newState);
                }
            }

            // Create timer to end the screen.
            this.timer = this.game.time.create(false);
            this.timer.loop(5000, this.endUpgrade, this);
            this.timer.start();

            // Create ambiance music.
            var ambiance = this.manager.createEntity(['Sound']);
            this.manager.updateComponentDataForEntity('Sound', ambiance, {
                source: 'ambiance_menu_all',
                loop: true,
            });

            // Create all background sprites.
            var backgroundSprites = [
                'upgrade_menu_back_ground',
                'upgrade_menu_middleground',
                'upgrade_menu_foreground',
            ];
            for (var i = 0; i < backgroundSprites.length; i++) {
                var entity = this.manager.createEntity(['Position', 'Displayable']);
                this.manager.updateComponentDataForEntity('Displayable', entity, {sprite: backgroundSprites[i]});
            }

            var manips = this.manager.getComponentsData('ManipInput');
            var manipNumber = 0;
            for (var m in manips) {
                var playerData = this.manager.getComponentDataForEntity('Player', m);
                var manipData = manips[m];

                var backId = this.manager.createEntity(['Displayable', 'Position']);

                this.manager.updateComponentDataForEntity('Displayable', backId, {sprite: 'upgrade_menu_box'});
                this.manager.updateComponentDataForEntity('Position', backId, {
                    x: (480 * playerData.number) + 81,
                    y: (86 * (manipNumber % (NUMBER_OF_CHOICES - (NUMBER_OF_CHOICES - currentNumberOfChoices)))) + 225,
                });

                var nameTextId = this.manager.createEntity(['Text', 'Position']);
                this.manager.updateComponentDataForEntity('Text', nameTextId, {content: allManipNames[manipData.manip]});
                this.manager.updateComponentDataForEntity('Position', nameTextId, {
                    x: (480 * playerData.number) + 91,
                    y: (86 * (manipNumber % (NUMBER_OF_CHOICES - (NUMBER_OF_CHOICES - currentNumberOfChoices)))) + 225,
                });

                var keyTextId = this.manager.createEntity(['Text', 'Position']);
                this.manager.updateComponentDataForEntity('Text', keyTextId, {
                    content: allInputs[manipData.input].keys.join(', '),
                    fill: '#F7F48D',
                });
                this.manager.updateComponentDataForEntity('Position', keyTextId, {
                    x: (480 * playerData.number) + 330,
                    y: (86 * (manipNumber % (NUMBER_OF_CHOICES - (NUMBER_OF_CHOICES - currentNumberOfChoices)))) + 260,
                });

                manipNumber++;
            }

            // Show timer text.
            this.timerTextId = this.manager.createEntity(['Position', 'Text']);
            this.manager.updateComponentDataForEntity('Text', this.timerTextId, {
                content: '5',
                font: 'retroComputerDemo',
                fontSize: '24pt',
            });
            this.manager.updateComponentDataForEntity('Position', this.timerTextId, {
                x: 676,
                y: 50,
            });
        },

        endUpgrade: function () {
            var choices = this.manager.getComponentsData('AvailableManips');
            var matchPlayers = this.matchManager.getComponentsData('Player');
            for (var c in choices) {
                var manip = choices[c];
                var player = this.manager.getComponentDataForEntity('Player', c);

                if (manip.manips.length > 0) {
                    if (!manip.choice) {
                        manip.choice = manip.manips[Math.floor(Math.random() * Object.keys(manip.manips).length)];
                    }

                    for (var p in matchPlayers) {
                        var mpl = matchPlayers[p];
                        if (mpl.number === player.number) {
                            mpl.manipulations.push(manip.choice);
                        }
                    }
                }
            }

            this.soundProcessor.stopAll();
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
