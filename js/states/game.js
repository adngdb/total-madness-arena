define([
    // managers
    'entity-manager',
    'manager',

    // components
    'components/game/bounding-box',
    'components/game/collision',
    'components/game/displayable',
    'components/game/wonGames',
    'components/game/input',
    'components/game/life',
    'components/game/movable',
    'components/game/attack',
    'components/game/position',
    'components/game/player',
    'components/game/map',

    'components/genetics/speed',
    'components/genetics/gravity',

    'components/game/animated',
    'components/game/animation-idle',
    'components/game/animation-jump',
    'components/game/animation-walk',

    // assemblages
    'assemblages/game/character_01',
    'assemblages/game/character_02',

    // processors
    'processors/game/rendering',
    'processors/game/input',
    'processors/game/physics',
    'processors/game/death',
    'processors/game/genetic',
    'processors/game/action',
],
function (
    // managers
    EntityManager,
    GlobalManager,

    // components
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
    Speed,
    Gravity,

    Animated,
    AnimationIdle,
    AnimationJump,
    AnimationWalk,

    // assemblages
    Character_01,
    Character_02,

    // processors
    RenderingProcessor,
    InputProcessor,
    PhysicsProcessor,
    DeathProcessor,
    GeneticProcessor,
    ActionProcessor
) {
    var Game = function () {
    };

    Game.prototype = {

        update: function () {
            this.manager.update(this.game.time.elapsed);
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
                AnimationIdle,
                AnimationJump,
                AnimationWalk,
                Gravity,
                Speed,
            ];
            for (var i = components.length - 1; i >= 0; i--) {
                this.manager.addComponent(components[i].name, components[i]);
            }

            // Add assemblages.
            // Add all components to the system.
            var assemblages = [
                Character_01,
                Character_02,
            ];
            for (var i = assemblages.length - 1; i >= 0; i--) {
                this.manager.addAssemblage(assemblages[i].name, assemblages[i]);
            }

            // Add processors.
            this.manager.addProcessor(new InputProcessor(this.manager, this.game));
            this.manager.addProcessor(new PhysicsProcessor(this.manager, this.game));
            this.manager.addProcessor(new GeneticProcessor(this.manager, this.game));
            this.manager.addProcessor(new ActionProcessor(this.manager, this.game));
            this.manager.addProcessor(new DeathProcessor(this.manager, this.game));
            this.manager.addProcessor(new RenderingProcessor(this.manager, this.game));

            var player1 = this.manager.createEntityFromAssemblage('Character_01');
            this.manager.updateComponentDataForEntity('Player', player1, {number: 0});

            var player2 = this.manager.createEntityFromAssemblage('Character_02');
            this.manager.updateComponentDataForEntity('Player', player2, {number: 1});

            var map = this.manager.createEntity(['Map']);
            this.manager.getComponentDataForEntity('Map', map).resourceId = 'level_map';

            GlobalManager.addPlayer(this.manager.getComponentDataForEntity('Player', player1).number);
            GlobalManager.addPlayer(this.manager.getComponentDataForEntity('Player', player2).number);

            GlobalManager.addGeneticManipulation('Gravity');
            GlobalManager.addGeneticManipulation('Speed');
        },
    };

    return Game;
});
