define([
    'entity-manager',
    'global-manager',

    'components/match/player',
    'components/match/match',

    'assemblages/match/player-1',
    'assemblages/match/player-2',
    'assemblages/match/character_01',
    'assemblages/match/character_02',
    'assemblages/match/character_03',
    'assemblages/match/character_04',
    'assemblages/match/character_05',

    'components/global/displayable',
    'components/global/position',
    'components/global/text',
    'components/global/player',
    'components/global/sound',

    'processors/global/sound',
    'processors/player-choice/character-choice',
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
    Character_03,
    Character_04,
    Character_05,

    Displayable,
    Position,
    Text,
    Player,
    Sound,

    // processors
    SoundProcessor,
    CharacterChoiceProcessor,
    RenderingProcessor,

    Animated,
    AnimationIdle,
    Character
) {
    var PlayerChoice = function () {
        // Current choice of character for each player.
        this.currentChoice = [0, 1];
    };

    PlayerChoice.prototype = {

        init: function () {
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
                Player,
                Sound,
            ];
            for (var i = components.length - 1; i >= 0; i--) {
                this.manager.addComponent(components[i].name, components[i]);
            }

            // create all possible characters (in 'local' manager)
            this.charAssemblages = [
                Character_01,
                Character_02,
                Character_03,
                Character_04,
                Character_05,
            ];
            for (var i = this.charAssemblages.length - 1; i >= 0; i--) {
                this.manager.addAssemblage(this.charAssemblages[i].name, this.charAssemblages[i]);
            }

            this.soundProcessor = new SoundProcessor(this.manager, this.game);
            this.charaProcessor = new CharacterChoiceProcessor(this.manager, this.charAssemblages, this.currentChoice);

            this.manager.addProcessor(this.charaProcessor);
            this.manager.addProcessor(this.soundProcessor);
            this.manager.addProcessor(new RenderingProcessor(this.manager, this.game));
        },

        create: function () {
            // Create the initial two choices.
            for (var i = 0; i < 2; i++) {
                this.charaProcessor.createCharacter(i);
            }

            // Create timer to end the screen.
            this.timer = this.game.time.create(false);
            this.timer.loop(5000, this.endChoice, this);
            this.timer.start();

            // Create ambiance music.
            var ambiance = this.manager.createEntity(['Sound']);
            this.manager.updateComponentDataForEntity('Sound', ambiance, {
                source: 'ambiance_menu_all',
                loop: true,
            });

            // Create all background sprites.
            var backgroundSprites = [
                'menuSelectionPerso',
            ];
            for (var i = 0; i < backgroundSprites.length; i++) {
                var entity = this.manager.createEntity(['Position', 'Displayable']);
                this.manager.updateComponentDataForEntity('Displayable', entity, {sprite: backgroundSprites[i]});
            }

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

        endChoice: function () {
            // save player choice
            var players = this.matchManager.getComponentsData('Player');
            for (var entity in players) {
                this.matchManager.updateComponentDataForEntity('Player', entity, {
                    character: this.charAssemblages[this.currentChoice[players[entity].number]].name,
                });
            }

            this.soundProcessor.stopAll();
            this.game.state.start('Game', true, false, this.matchManager);
        }
    };

    return PlayerChoice;
});
