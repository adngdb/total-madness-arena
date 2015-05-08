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
            'components/player',
            'processors/rendering',
            'processors/input'
            ],
        function (EntityManager, Collision, Displayable, WonGames, Input, Life, Movable, Attack, Animation, Position, Player, RenderingProcessor, InputProcessor) {

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
                Position,
                Player
            ];
            for (var i = components.length - 1; i >= 0; i--) {
                manager.addComponent(components[i].name, components[i]);
            }

            var player = manager.createEntity(['Player', 'Position', 'Displayable', 'Movable']);
            var player2 = manager.createEntity(['Player', 'Position', 'Displayable']);
            manager.getComponentDataForEntity('Player', player2).number = 1;

            manager.addProcessor(new RenderingProcessor(manager, this.game));
            manager.addProcessor(new InputProcessor(manager, this.game));
        }
    };

    return Game;
});
