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
            ];
            for (var i = components.length - 1; i >= 0; i--) {
                this.manager.addComponent(components[i].name, components[i]);
            }

            this.manager.addProcessor(new RenderingProcessor(this.manager, this.game));
        },

        create: function () {
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
        },

        end: function () {
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
