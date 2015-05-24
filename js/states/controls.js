define([
    'entity-manager',
    'global-manager',

    // components
    'components/global/displayable',
    'components/global/position',
    'components/global/text',
    'components/global/sound',

    // processors
    'processors/global/sound',
    'processors/upgrade/rendering',
], function (
    EntityManager,
    GlobalManager,

    // components
    Displayable,
    Position,
    Text,
    Sound,

    // processors
    SoundProcessor,
    RenderingProcessor
) {
    var Controls = function () {
    };

    Controls.prototype = {

        init: function() {
            // Create the Manager.
            this.manager = new EntityManager();

            // add components
            var components = [
                Displayable,
                Position,
                Text,
                Sound,
            ];
            for (var i = components.length - 1; i >= 0; i--) {
                this.manager.addComponent(components[i].name, components[i]);
            }

            // add processors
            this.soundProcessor = new SoundProcessor(this.manager, this.game);

            this.manager.addProcessor(this.soundProcessor);
            this.manager.addProcessor(new RenderingProcessor(this.manager, this.game));
        },

        create: function () {
            // Create ambiance music.
            var ambiance = this.manager.createEntity(['Sound']);
            this.manager.updateComponentDataForEntity('Sound', ambiance, {
                source: 'ambiance_menu_all',
                loop: true,
            });

            // Create all background sprites.
            var backgroundSprites = [
                'controls_menu',
                'upgrade_menu_foreground',
            ];
            for (var i = 0; i < backgroundSprites.length; i++) {
                var entity = this.manager.createEntity(['Position', 'Displayable']);
                this.manager.updateComponentDataForEntity('Displayable', entity, {sprite: backgroundSprites[i]});
            }

            this.timerDone = false;
            this.game.time.events.add(2000, function() {
                this.timerDone = true;
            }, this);

            var inputs = GlobalManager.getComponentsData('Input');
            var controlsXPosition = 315;
            var controlsYPositions = {
                'left': 260,
                'right': 347,
                'jump': 433,
                'action1': 518,
                'action2': 605
            };
            this.inputs = [];
            for(var input in inputs) {
                if (inputs[input].action != 'down') {
                    if (!this.inputs[inputs[input].player]) {
                        this.inputs[inputs[input].player] = [];
                    }

                    if (!this.inputs[inputs[input].player][inputs[input].action]) {
                        this.inputs[inputs[input].player][inputs[input].action] = [];
                    }

                    this.inputs[inputs[input].player][inputs[input].action]['keys'] = inputs[input].keys;
                }
            }
            for(input in this.inputs) {
                var playerInputs = this.inputs[input];
                for (var playerInput in playerInputs) {
                    var text = this.manager.createEntity(['Position', 'Text']);
                    this.manager.updateComponentDataForEntity('Text', text, {
                        content: playerInputs[playerInput].keys.join(', '),
                        fill: '#F7F48D',
                    });
                    this.manager.updateComponentDataForEntity('Position', text, {
                        x: controlsXPosition + (460 * input),
                        y: controlsYPositions[playerInput],
                    });
                }
            }
        },

        end: function () {
            this.soundProcessor.stopAll();
            this.game.state.start('PlayerChoice', true, false);
        },

        update: function () {
            GlobalManager.update(this.game.time.elapsed);
            this.manager.update(this.game.time.elapsed);

            if (this.timerDone) {
                var inputs = GlobalManager.getComponentsData('Input');
                for (var i in inputs) {
                    if (inputs[i].active) {
                        this.end();
                    }
                }
            }
        },

    };

    return Controls;
});
