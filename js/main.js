(function () {
    'use strict';

    requirejs.config({
        baseUrl: 'js/',

        paths: {
            'entity-manager': '../lib/entity-system-js/entity-manager'
        }
    });

    require(['states/boot',
                'states/preloader',
                'states/game'
            ],
            function (Boot, Preloader, Game) {

        var game = new Phaser.Game(960, 768, Phaser.AUTO, '', {
            preload: preload,
            init: init,
            create: create,
            update: update
        });

        function preload() {
            this.game.load.spritesheet('chara_fat', 'assets/gfx/chara_fat.png', 64, 96);
        }

        function create() {
        }

        function init() {
        }

        game.state.add('Boot', Boot);
        game.state.add('Preload', Preloader);
        game.state.add('Game', Game);

        game.state.start('Game');

        function update () {
            manager.update(1);
        }
    });
}());


