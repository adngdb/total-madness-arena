(function () {
    'use strict';

    requirejs.config({
        baseUrl: 'js/',

        paths: {
            'entity-manager': '../lib/entity-system-js/entity-manager'
        }
    });

    require(['entity-manager',
                'components/collision',
                'components/displayable',
                'components/wonGames',
                'components/input',
                'components/life',
                'components/movable',
                'components/attack',
                'components/animation'],
            function (EntityManager, Collision, Displayable, WonGames, Input, Life, Movable, Attack, Animation) {

        var game = new Phaser.Game(800, 600, Phaser.AUTO, '', {
                preload: preload,
                create: create
            });

        function preload() {
        };

        function create() {
        };

        function start() {
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
                Animation
            ];
            for (var i = components.length - 1; i >= 0; i--) {
                manager.addComponent(components[i].name, components[i]);
            }

            // Add all processors in the system. Note that because of the logic
            // in our processors' constructors, order here matters.
            // CardProcessor creates all the card entities, and RenderingProcessor
            // then creates all the sprites to go with them.

/// TODO : MANAGER
            manager.addProcessor(new CardProcessor(manager));
            manager.addProcessor(new RenderingProcessor(manager));

            // Start the main loop of the game.
            // requestAnimFrame(animate);
            // function animate() {
            //     requestAnimFrame(animate);

            //     manager.update();
            // }
        }

    });
}());


