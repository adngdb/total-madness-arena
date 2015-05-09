define([
    'entity-manager',

    'components/bounding-box',
    'components/collision',
    'components/displayable',
    'components/wonGames',
    'components/input',
    'components/life',
    'components/movable',
    'components/attack',
    'components/position',
    'components/player',
    'components/map',

    'components/animated',
    'components/animation-idle',
    'components/animation-walk',

    'processors/rendering',
    'processors/input',
    'processors/physics',
    'processors/death'
],
function (
    EntityManager,

    BoundingBox,
    Collision,
    Displayable,
    WonGames,
    Input,
    Life,
    Movable,
    Attack,
    Position,
    Player,
    Map,

    Animated,
    AnimationWalk,
    AnimationIdle,

    RenderingProcessor,
    InputProcessor,
    PhysicsProcessor,
    DeathProcessor
) {
    var Game = function () {
    };

    Game.prototype = {

        update: function () {
            this.manager.update(this.game.time.elapsed);
        },

        preload: function () {
            this.game.load.spritesheet('chara_fat', 'assets/gfx/chara_fat.png', 64, 96);
            this.game.load.spritesheet('chara_thin', 'assets/gfx/chara_thin.png', 64, 96);

            var cacheKey = Phaser.Plugin.Tiled.utils.cacheKey;
            this.game.load.tiledmap(
                cacheKey('level_map', 'tiledmap'),
                'assets/levels/default.json',
                null,
                Phaser.Tilemap.TILED_JSON
            );
            this.game.load.image(
                cacheKey('level_map', 'tileset', 'lvl_all'),
                'assets/gfx/lvl_all.png'
            );
        },

        create: function () {
            // set / reset a new entityManager
            this.manager = new EntityManager();
            // Add all components to the system.
            var components = [
                BoundingBox,
                Collision,
                Displayable,
                WonGames,
                Input,
                Life,
                Movable,
                Attack,
                Position,
                Player,
                Map,
                Animated,
                AnimationWalk,
                AnimationIdle
            ];
            for (var i = components.length - 1; i >= 0; i--) {
                this.manager.addComponent(components[i].name, components[i]);
            }

            // Add processors.
            this.manager.addProcessor(new RenderingProcessor(this.manager, this.game));
            this.manager.addProcessor(new InputProcessor(this.manager, this.game));
            this.manager.addProcessor(new DeathProcessor(this.manager, this.game));
            this.manager.addProcessor(new PhysicsProcessor(this.manager, this.game));

            var player = this.manager.createEntity([
                'Player', 'Position', 'BoundingBox', 'Displayable', 'Movable', 'Life', 'Animated', 'AnimationIdle', 'AnimationWalk'
            ]);
            this.manager.getComponentDataForEntity('Movable', player).gravity = 1.5;
            this.manager.getComponentDataForEntity('BoundingBox', player).height = 96;
            this.manager.getComponentDataForEntity('BoundingBox', player).width = 64;

            var player2 = this.manager.createEntity([
                'Player', 'Position', 'BoundingBox', 'Displayable', 'Life', 'Animated', 'AnimationIdle', 'AnimationWalk'
            ]);
            this.manager.getComponentDataForEntity('Player', player2).number = 1;
            this.manager.getComponentDataForEntity('Displayable', player2).sprite = 'chara_thin';
            this.manager.getComponentDataForEntity('Position', player2).y = 100;
            this.manager.getComponentDataForEntity('Position', player2).x = 300;
            this.manager.getComponentDataForEntity('AnimationIdle', player2).keys = [0, 1, 2, 3];
            this.manager.getComponentDataForEntity('AnimationIdle', player2).speed = 8;
            this.manager.getComponentDataForEntity('AnimationWalk', player2).speed = 8;
            this.manager.getComponentDataForEntity('BoundingBox', player2).height = 96;
            this.manager.getComponentDataForEntity('BoundingBox', player2).width = 64;

            var map = this.manager.createEntity(['Map']);
            this.manager.getComponentDataForEntity('Map', map).resourceId = 'level_map';
        },

    };

    return Game;
});
