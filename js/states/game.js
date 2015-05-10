define([
    'constants',

    // managers
    'entity-manager',
    'global-manager',

    // components
    'components/global/displayable',
    'components/global/position',
    'components/global/text',
    'components/global/player',
    'components/global/sound',

    'components/game/bounding-box',
    'components/game/collision',
    'components/game/game',
    'components/game/life',
    'components/game/movable',
    'components/game/attack1',
    'components/game/attack2',
    'components/game/map',
    'components/game/life-bar',
    'components/game/character',

    'components/manipulations/speed',
    'components/manipulations/gravity',
    'components/manipulations/zangief',
    'components/manipulations/flash',
    'components/manipulations/pervert',
    'components/manipulations/nega',

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
    'assemblages/game/character_03',
    'assemblages/game/character_04',
    'assemblages/game/character_05',
    'assemblages/game/fx',

    // processors
    'processors/global/sound',

    'processors/game/rendering',
    'processors/game/physics',
    'processors/game/death',
    'processors/game/manipulation',
    'processors/game/action',
],
function (
    Const,

    // managers
    EntityManager,
    GlobalManager,

    // components
    Displayable,
    Position,
    Text,
    Player,
    Sound,

    BoundingBox,
    Collision,
    GameComp,
    Life,
    Movable,
    Attack1,
    Attack2,
    Map,
    LifeBar,
    Character,

    Speed,
    Gravity,
    Zangief,
    Flash,
    Pervert,
    Nega,

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
    Character_03,
    Character_04,
    Character_05,
    Fx,

    // processors
    SoundProcessor,

    RenderingProcessor,
    PhysicsProcessor,
    DeathProcessor,
    ManipulationProcessor,
    ActionProcessor
) {
    var Game = function () {
        this.remainingTimeText = null;
        this.timer = null;
        this.newPlayerManipulations = [];
        this.gameStateId = null;
    };

    Game.prototype = {

        init: function (matchManager) {
            this.matchManager = matchManager;

            var players = matchManager.getComponentsData('Player');
            for (var p in players) {
                this.newPlayerManipulations[players[p].number] = players[p].manipulations;
            }
        },

        update: function () {
            GlobalManager.update(this.game.time.elapsed);
            this.manager.update(this.game.time.elapsed);

            if (this.timer.ms > 0) {
                this.manager.updateComponentDataForEntity('Text', this.timerTextId, {
                    content: parseInt(this.timer.duration.toFixed(0) / 1000) + 1,
                });
            }

            // Check if the game is over or not.
            var state = this.manager.getComponentDataForEntity('Game', this.gameStateId);
            if (state.gameOver) {
                var matchOver = false;

                var matchPlayers = this.matchManager.getComponentsData('Player');
                for (var p in matchPlayers) {
                    if (matchPlayers[p].number === state.winner) {
                        matchPlayers[p].score++;

                        if (matchPlayers[p].score >= Const.game.GAMES_TO_WIN) {
                            matchOver = true;
                            var matches = this.matchManager.getComponentsData('Match');
                            for (var m in matches) {
                                matches[m].matchOver = true;
                                matches[m].winner = state.winner;
                            }
                        }
                    }
                }

                this.endGame(matchOver);
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
                Player,
                Sound,
                GameComp,
                Life,
                Movable,
                Attack1,
                Attack2,
                Position,
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
                Zangief,
                Flash,
                Pervert,
                Nega,
                Character,
            ];
            for (var i = components.length - 1; i >= 0; i--) {
                this.manager.addComponent(components[i].name, components[i]);
            }

            // Add assemblages.
            // Add all components to the system.
            var assemblages = [
                Character_01,
                Character_02,
                Character_03,
                Character_04,
                Character_05,
                Fx,
            ];
            for (var i = assemblages.length - 1; i >= 0; i--) {
                this.manager.addAssemblage(assemblages[i].name, assemblages[i]);
            }

            // Add processors.
            this.soundProcessor = new SoundProcessor(this.manager, this.game)

            this.manager.addProcessor(new PhysicsProcessor(this.manager, this.game));
            this.manager.addProcessor(new ManipulationProcessor(this.manager, this.game));
            this.manager.addProcessor(new ActionProcessor(this.manager, this.game));
            this.manager.addProcessor(new DeathProcessor(this.manager, this.game, this.matchManager));
            this.manager.addProcessor(this.soundProcessor);
            this.manager.addProcessor(new RenderingProcessor(this.manager, this.game));

            // Create a state for the current game.
            this.gameStateId = this.manager.createEntity(['Game']);

            var player1 = this.manager.createEntityFromAssemblage('Character_04');
            this.manager.updateComponentDataForEntity('Player', player1, {number: 0});

            var player2 = this.manager.createEntityFromAssemblage('Character_05');
            this.manager.updateComponentDataForEntity('Player', player2, {number: 1});

            for(var player in this.newPlayerManipulations) {
                if (player == 0) {
                    this.manager.addComponentsToEntity(player2, this.newPlayerManipulations[player]);
                }
                else {
                    this.manager.addComponentsToEntity(player1, this.newPlayerManipulations[player]);
                }
            }

            this.manager.createEntityFromAssemblage('fx');

            var map = this.manager.createEntity(['Map']);
            var lvlNum = this.game.rnd.between(1, 4);
            this.manager.getComponentDataForEntity('Map', map).resourceId = 'level_map_0' + lvlNum;
            console.log('using map: ', 'level_map_0' + lvlNum);

            // Create ambiance music.
            var ambiance = this.manager.createEntity(['Sound']);
            this.manager.updateComponentDataForEntity('Sound', ambiance, {
                source: 'ambiance_lvl_1',
                loop: true,
            });

            // create GUI
            this.createGUI();

            var foreground = this.manager.createEntity(['Position', 'Displayable']);
            this.manager.updateComponentDataForEntity('Displayable', foreground, {
                sprite: 'ingame_foreground',
            });
            this.manager.updateComponentDataForEntity('Position', foreground, {
                x: 480,
                y: 384,
            });
        },

        endGame: function (matchOver) {
            this.soundProcessor.stopAll();
            if (matchOver) {
                this.game.state.start('Score', true, false, this.matchManager);
            }
            else {
                this.game.state.start('Upgrade', true, false, this.matchManager);
            }
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
            this.timer.loop(Const.game.DURATION, this.endGame, this);
            this.timer.start();

            this.timerTextId = this.manager.createEntity(['Position', 'Text']);
            this.manager.updateComponentDataForEntity('Text', this.timerTextId, {
                content: '30',
                font: 'retroComputerDemo',
                fontSize: '19.5px',
            });
            this.manager.updateComponentDataForEntity('Position', this.timerTextId, {
                x: 480,
                y: 54,
            });

            // player Name text
            var players = this.manager.getComponentsData('Player');
            for (entity in players) {
                var nameText = this.manager.createEntity(['Position', 'Text']);
                var charData = this.manager.getComponentDataForEntity('Character', entity);
                if (players[entity].number == 0) {
                    this.manager.updateComponentDataForEntity('Text', nameText, {
                        content: charData.name,
                        fill: '#E8E043',
                        font: 'retroComputerDemo',
                        fontSize: '19.5px',
                        align: 'right',
                        anchorX: 1.,
                    });
                    this.manager.updateComponentDataForEntity('Position', nameText, {
                        x: 350,
                        y: 27,
                    });
                } else if (players[entity].number == 1) {
                    this.manager.updateComponentDataForEntity('Text', nameText, {
                        content: charData.name,
                        fill: '#E8E043',
                        font: 'retroComputerDemo',
                        fontSize: '19.5px',
                        align: 'left',
                        anchorX: 0.,
                    });
                    this.manager.updateComponentDataForEntity('Position', nameText, {
                        x: 611,
                        y: 27,
                    });
                }
            }


        },

    };

    return Game;
});
