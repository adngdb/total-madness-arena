(function () {
    'use strict';

    requirejs.config({
        baseUrl: 'js/',

        paths: {
            'entity-manager': '../lib/entity-system-js/entity-manager',
            'lib': '../lib'
        }
    });

    require([
    'states/boot',
    'states/preloader',
    'states/game',
    'states/upgrade'
    ],
    function (Boot, Preloader, Game, Upgrade) {

        var game = new Phaser.Game(960, 768, Phaser.AUTO, 'stage', {
            preload: preload,
            init: init,
            create: create,
            update: update
        });

        function preload() {
        }

        function create() {
            this.game.state.add('Boot', Boot);
            this.game.state.add('Preload', Preloader);
            this.game.state.add('Game', Game);
            this.game.state.add('Upgrade', Upgrade);

            this.game.state.start('Game');
        }

        function init() {
            // Activate plugins.
            this.game.add.plugin(Phaser.Plugin.Tiled);
        }

        function update () {
        }
    });
}());


