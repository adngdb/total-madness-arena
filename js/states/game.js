define(['entity-manager',
            'components/collision',
            'components/displayable',
            'components/wonGames',
            'components/input',
            'components/life',
            'components/movable',
            'components/attack',
            'components/animation',
            'components/position',
            'processors/rendering'
            ],
        function (EntityManager, Collision, Displayable, WonGames, Input, Life, Movable, Attack, Animation, Position, RenderingProcessor) {

    var Game = function (game) {
    };

    Game.prototype = {

        update: function () {},

        preload: function () {
            this.game.load.spritesheet('chara_fat', 'assets/gfx/chara_fat.png', 64, 96);
        },

        create: function () {
            // Create an Entity System manager object.
            var manager = new EntityManager();

            // Add all components to the system.
            var components = [
                Collision,
                Displayable,
                WonGames,
                Input,
                Life,
                Movable,
                Attack,
                Animation,
                Position
            ];
            for (var i = components.length - 1; i >= 0; i--) {
                manager.addComponent(components[i].name, components[i]);
            }

            var player = manager.createEntity(['Position', 'Displayable', 'Movable']);

            manager.addProcessor(new RenderingProcessor(manager, this.game));

        },

    };

    return Game;
});
