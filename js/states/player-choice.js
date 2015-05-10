define([
    'entity-manager',
    'global-manager',

    'components/match/player',
    'components/match/match',

    'assemblages/match/player-1',
    'assemblages/match/player-2',
    'assemblages/match/character_01',
    'assemblages/match/character_02',

    'components/global/displayable',
    'components/global/position',
    'components/global/text',
    'components/global/player',

    'processors/player-choice/input',
    'processors/player-choice/rendering',

    'components/game/animated',
    'components/game/animation-idle',
    'components/game/character',

], function (
    EntityManager,
    GlobalManager,

    PlayerMatch,
    Match,

    Player_1,
    Player_2,
    Character_01,
    Character_02,

    Displayable,
    Position,
    Text,
    Player,

    // processors
    InputProcessor,
    RenderingProcessor,

    Animated,
    AnimationIdle,
    Character
) {
    var PlayerChoice = function () {

        this.current = [0,1];
    };

    PlayerChoice.prototype = {

        init: function() {
            // Create the Match Manager.
            this.matchManager = new EntityManager();
            this.matchManager.addComponent(PlayerMatch.name, PlayerMatch);
            this.matchManager.addComponent(Match.name, Match);

            // create 2 players (in MatchManager)
            this.matchManager.addAssemblage(Player_1.name, Player_1);
            this.matchManager.addAssemblage(Player_2.name, Player_2);
            this.matchManager.createEntity(['Match']);
            this.player1 = this.matchManager.createEntityFromAssemblage('Player_1');
            this.player2 = this.matchManager.createEntityFromAssemblage('Player_2');

            // create 'local' entity manager
            this.manager = new EntityManager();
            var components = [
                Animated,
                AnimationIdle,
                Displayable,
                Position,
                Text,
                Character,
                Player
            ];
            for (var i = components.length - 1; i >= 0; i--) {
                this.manager.addComponent(components[i].name, components[i]);
            }

            // create all possible characters (in 'local' manager)
            this.charAssemblages = [
                Character_01,
                Character_02
            ];
            for (var i = this.charAssemblages.length - 1; i >= 0; i--) {
                this.manager.addAssemblage(this.charAssemblages[i].name, this.charAssemblages[i]);
            }

            var newPlayer = this.manager.createEntityFromAssemblage(this.charAssemblages[this.current[0]].name);
            this.manager.updateComponentDataForEntity('Displayable', newPlayer,
                {
                    scaleX: 4,
                    scaleY: 4,
                });
            this.manager.updateComponentDataForEntity('Player', newPlayer,
                {
                    number: 0,
                });
            this.manager.updateComponentDataForEntity('Position', newPlayer,
                {
                    x: 700,
                    y: 340,
                });
            newPlayer = this.manager.createEntityFromAssemblage(this.charAssemblages[this.current[1]].name);
            this.manager.updateComponentDataForEntity('Displayable', newPlayer,
                {
                    scaleX: 4,
                    scaleY: 4,
                });
            this.manager.updateComponentDataForEntity('Player', newPlayer,
                {
                    number: 1,
                });
            this.manager.updateComponentDataForEntity('Position', newPlayer,
                {
                    x: 220,
                    y: 340,
                });
            this.manager.addProcessor(new InputProcessor(this.manager, this.charAssemblages, this.current));
            this.manager.addProcessor(new RenderingProcessor(this.manager, this.game, this.matchManager));

        },

        create: function () {
            // Create timer to end the screen.
            this.timer = this.game.time.create(false);
            this.timer.loop(5000, this.endChoice, this);
            this.timer.start();
            // Show timer text.
            this.timerTextId = this.manager.createEntity(['Position', 'Text']);
            this.manager.updateComponentDataForEntity('Text', this.timerTextId, {
                content: '15',
                font: 'retroComputerDemo',
                fontSize: '24pt',
            });
            this.manager.updateComponentDataForEntity('Position', this.timerTextId, {
                x: 680,
                y: 33,
            });

            // Create all background sprites.
            var backgroundSprites = [
                'menuSelectionPerso',
            ];
            for (var i = 0; i < backgroundSprites.length; i++) {
                var entity = this.manager.createEntity(['Position', 'Displayable']);
                this.manager.updateComponentDataForEntity('Displayable', entity, {sprite: backgroundSprites[i]});
            }

        },

        update: function () {
            GlobalManager.update(this.game.time.elapsed);
            this.matchManager.update(this.game.time.elapsed);
            this.manager.update(this.game.time.elapsed);

            if (this.timer.ms > 0) {
                this.manager.updateComponentDataForEntity('Text', this.timerTextId, {
                    content: parseInt(this.timer.duration.toFixed(0) / 1000) + 1,
                });
            }
        },

        endChoice: function() {
            // save player choice
            var players = this.matchManager.getComponentsData('Player');
            for (entity in players) {
                if (players[entity].number == 0) {
                    this.matchManager.updateComponentDataForEntity('Player', entity,
                        {
                            character: this.charAssemblages[0].name,
                        });
                }
                else if (players[entity].number == 1) {
                    this.matchManager.updateComponentDataForEntity('Player', entity,
                        {
                            character: this.charAssemblages[1].name,
                        });
                }
            }

            this.game.state.start('Game', true, false, this.matchManager);
        }
    };

    return PlayerChoice;
});
