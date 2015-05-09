define([
    // managers
    'entity-manager',
    'global-manager',
    'manager',

    // components
    'components/game/bounding-box',
    'components/game/collision',
    'components/game/displayable',
    'components/game/wonGames',
    'components/game/life',
    'components/game/movable',
    'components/game/attack1',
    'components/game/attack2',
    'components/game/position',
    'components/game/player',
    'components/game/map',

    'components/genetics/speed',
    'components/genetics/gravity',

    'components/game/animated',
    'components/game/animation-idle',
    'components/game/animation-jump',
    'components/game/animation-walk',
    'components/game/animation-attack1',
    'components/game/animation-attack2',

    'components/game/animation-attack-fx',
    'components/game/animation-jump-fx',

    // assemblages
    'assemblages/game/character_01',
    'assemblages/game/character_02',
    'assemblages/game/fx',

    // processors
    'processors/game/rendering',
    'processors/game/physics',
    'processors/game/death',
    'processors/game/genetic',
    'processors/game/action',
],
function (
    // managers
    EntityManager,
    GlobalManager,
    MatchManager,

    // components
    BoundingBox,
    Collision,
    Displayable,
    WonGames,
    Life,
    Movable,
    Attack1,
    Attack2,
    Position,
    Player,
    Map,
    Speed,
    Gravity,

    Animated,
    AnimationIdle,
    AnimationJump,
    AnimationWalk,
    AnimationAttack1,
    AnimationAttack2,

    AnimationAttackFx,
    AnimationJumpFx,

    // assemblages
    Character_01,
    Character_02,
    Fx,

    // processors
    RenderingProcessor,
    PhysicsProcessor,
    DeathProcessor,
    GeneticProcessor,
    ActionProcessor
) {
    var Game = function () {
        this.remainingTimeText = null;
        this.timer = null;
    };

    Game.prototype = {

        update: function () {
            GlobalManager.update(this.game.time.elapsed);
            this.manager.update(this.game.time.elapsed);
            if (this.timer.ms > 0) {
                this.remainingTimeText.text = parseInt(this.timer.duration.toFixed(0) / 1000) + 1;
            }
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
                Life,
                Movable,
                Attack1,
                Attack2,
                Position,
                Player,
                Map,
                Animated,
                AnimationIdle,
                AnimationJump,
                AnimationWalk,
                AnimationAttack1,
                AnimationAttack2,
                AnimationAttackFx,
                AnimationJumpFx,
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
                Fx,
            ];
            for (var i = assemblages.length - 1; i >= 0; i--) {
                this.manager.addAssemblage(assemblages[i].name, assemblages[i]);
            }

            // Add processors.
            this.manager.addProcessor(new PhysicsProcessor(this.manager, this.game));
            this.manager.addProcessor(new GeneticProcessor(this.manager, this.game));
            this.manager.addProcessor(new ActionProcessor(this.manager, this.game));
            this.manager.addProcessor(new DeathProcessor(this.manager, this.game));
            this.manager.addProcessor(new RenderingProcessor(this.manager, this.game));

            var player1 = this.manager.createEntityFromAssemblage('Character_01');
            this.manager.updateComponentDataForEntity('Player', player1, {number: 0});

            var player2 = this.manager.createEntityFromAssemblage('Character_02');
            this.manager.updateComponentDataForEntity('Player', player2, {number: 1});

            this.manager.createEntityFromAssemblage('fx');

            var map = this.manager.createEntity(['Map']);
            this.manager.getComponentDataForEntity('Map', map).resourceId = 'level_map';

            MatchManager.addPlayer(this.manager.getComponentDataForEntity('Player', player1).number);
            MatchManager.addPlayer(this.manager.getComponentDataForEntity('Player', player2).number);

            MatchManager.addGeneticManipulation('Gravity');
            MatchManager.addGeneticManipulation('Speed');

            // timer
            this.timer = this.game.time.create(false);
            this.timer.loop(50000, this.endGame, this);
            this.timer.start();

            var style = { font: "24pt retroComputerDemo", fill: "#000000", align: "center" };
            this.remainingTimeText = this.game.add.text(676, 50, "5", style);
        },

        endGame: function () {
            this.game.state.start('Upgrade');
        },
    };

    return Game;
});
