define([
    // managers
    'entity-manager',
    'global-manager',

    // components
    'components/global/displayable',
    'components/global/position',
    'components/global/text',

    'components/game/bounding-box',
    'components/game/collision',
    'components/game/wonGames',
    'components/game/life',
    'components/game/movable',
    'components/game/attack1',
    'components/game/attack2',
    'components/game/player',
    'components/game/map',
    'components/game/life-bar',

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

    // components
    Displayable,
    Position,
    Text,

    BoundingBox,
    Collision,
    WonGames,
    Life,
    Movable,
    Attack1,
    Attack2,
    Player,
    Map,
    LifeBar,

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

        init: function (matchManager) {
            this.matchManager = matchManager;
        },

        update: function () {
            GlobalManager.update(this.game.time.elapsed);
            this.manager.update(this.game.time.elapsed);

            if (this.timer.ms > 0) {
                this.manager.updateComponentDataForEntity('Text', this.timerTextId, {
                    content: parseInt(this.timer.duration.toFixed(0) / 1000) + 1,
                });
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
                Text,
                WonGames,
                Life,
                Movable,
                Attack1,
                Attack2,
                Position,
                Player,
                Map,
                LifeBar,
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

            // create GUI
            this.createGUI();

        },

        endGame: function () {
            this.game.state.start('Upgrade', true, false, this.matchManager);
        },

        createGUI: function () {
            // player 1
            var gUIElement = this.manager.createEntity(['Position', 'Displayable']);
            this.manager.updateComponentDataForEntity('Displayable', gUIElement, {
                sprite: 'inGameGUIBarBorder',
            });
            this.manager.updateComponentDataForEntity('Position', gUIElement, {
                x: 186,
                y: 40,
            });

            gUIElement = this.manager.createEntity(['Position', 'Displayable', 'LifeBar']);
            this.manager.updateComponentDataForEntity('Displayable', gUIElement, {
                sprite: 'inGameGUIBarFill',
            });
            this.manager.updateComponentDataForEntity('Position', gUIElement, {
                x: 19,
                y: 40,
            });

            // player 2
            var gUIElement = this.manager.createEntity(['Position', 'Displayable']);
            this.manager.updateComponentDataForEntity('Displayable', gUIElement, {
                sprite: 'inGameGUIBarBorder',
                scaleX: -1,
            });
            this.manager.updateComponentDataForEntity('Position', gUIElement, {
                x: 778,
                y: 40,
            });

            gUIElement = this.manager.createEntity(['Position', 'Displayable', 'LifeBar']);
            this.manager.updateComponentDataForEntity('Displayable', gUIElement, {
                sprite: 'inGameGUIBarFill',
                scaleX: -1,
            });
            this.manager.updateComponentDataForEntity('Position', gUIElement, {
                x: 945,
                y: 40,
            });
            this.manager.updateComponentDataForEntity('LifeBar', gUIElement, {
                player: 1,
            });

            // timer
            gUIElement = this.manager.createEntity(['Position', 'Displayable']);
            this.manager.updateComponentDataForEntity('Displayable', gUIElement, {
                sprite: 'inGameGUITimer',
            });
            this.manager.updateComponentDataForEntity('Position', gUIElement, {
                x: 480,
                y: 40,
            });

            // timer text
            this.timer = this.game.time.create(false);
            this.timer.loop(30000, this.endGame, this);
            this.timer.start();

            this.timerTextId = this.manager.createEntity(['Position', 'Text']);
            this.manager.updateComponentDataForEntity('Text', this.timerTextId, {
                content: '5',
                font: 'retroComputerDemo',
                fontSize: '19.5px',
            });
            this.manager.updateComponentDataForEntity('Position', this.timerTextId, {
                x: 480,
                y: 54,
            });

        },

    };

    return Game;
});
