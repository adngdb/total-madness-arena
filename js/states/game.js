define([
    'entity-manager',

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
    'components/map',

    'processors/rendering',
    'processors/input'
],
function (
    EntityManager,

    Collision,
    Displayable,
    WonGames,
    Input,
    Life,
    Movable,
    Attack,
    Animation,
    Position,
    Player,
    Map,

    RenderingProcessor,
    InputProcessor
) {
    var Game = function () {
        // Create an Entity System manager object.
        this.manager = new EntityManager();
    };

    Game.prototype = {

        update: function () {
            this.manager.update();
        },

        preload: function () {
            this.game.load.spritesheet('chara_fat', 'assets/gfx/chara_fat.png', 64, 96);

            var cacheKey = Phaser.Plugin.Tiled.utils.cacheKey;
            this.game.load.tiledmap(cacheKey('level_map', 'tiledmap'), 'assets/levels/default.json', null, Phaser.Tilemap.TILED_JSON);
            this.game.load.image(cacheKey('level_map', 'tileset', 'lvl_all'), 'assets/gfx/lvl_all.png');
        },

        create: function () {
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
                Player,
                Map
            ];
            for (var i = components.length - 1; i >= 0; i--) {
                this.manager.addComponent(components[i].name, components[i]);
            }

            // Add processors.
            this.manager.addProcessor(new RenderingProcessor(this.manager, this.game));
            this.manager.addProcessor(new InputProcessor(this.manager, this.game));

            var player = this.manager.createEntity(['Player', 'Position', 'Displayable', 'Movable']);
            var player2 = this.manager.createEntity(['Player', 'Position', 'Displayable']);
            this.manager.getComponentDataForEntity('Player', player2).number = 1;

            var map = this.manager.createEntity(['Map']);
            this.manager.getComponentDataForEntity('Map', map).resourceId = 'level_map';
        }
    };

    return Game;
});
