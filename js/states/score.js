define([
    'entity-manager',
    'global-manager',

    // components
    'components/global/displayable',
    'components/global/position',
    'components/global/text',
    'components/global/player',
    'components/global/sound',
    'components/game/animated',
    'components/game/animation-idle',
    'components/game/character',

    // assemblages
    'assemblages/match/character_01',
    'assemblages/match/character_02',
    'assemblages/match/character_03',
    'assemblages/match/character_04',
    'assemblages/match/character_05',

    // processors
    'processors/global/sound',
    'processors/player-choice/rendering',
], function (
    EntityManager,
    GlobalManager,

    // components
    Displayable,
    Position,
    Text,
    Player,
    Sound,
    Animated,
    AnimationIdle,
    Character,

    Character_01,
    Character_02,
    Character_03,
    Character_04,
    Character_05,

    // processors
    SoundProcessor,
    RenderingProcessor
) {
    var Score = function () {
    };

    Score.prototype = {

        init: function(matchManager) {
            this.matchManager = matchManager;

            // Create the Manager.
            this.manager = new EntityManager();

            // add components
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

            var assemblages = [
                Character_01,
                Character_02,
                Character_03,
                Character_04,
                Character_05,
            ];
            for (var i = assemblages.length - 1; i >= 0; i--) {
                this.manager.addAssemblage(assemblages[i].name, assemblages[i]);
            }

            // add processors
            this.soundProcessor = new SoundProcessor(this.manager, this.game);

            this.manager.addProcessor(this.soundProcessor);
            this.manager.addProcessor(new RenderingProcessor(this.manager, this.game));
        },

        create: function () {
            // Create ambiance music.
            var ambiance = this.manager.createEntity(['Sound']);
            this.manager.updateComponentDataForEntity('Sound', ambiance, {
                source: 'ambiance_menu_all',
                loop: true,
            });

            // Create the winner's sprite.
            var winner = null;
            var states = this.matchManager.getComponentsData('Match');
            for (var s in states) {
                winner = states[s].winner;
                break;
            }

            var players = this.matchManager.getComponentsData('Player');
            for (var p in players) {
                if (players[p].number === winner) {
                    winner = players[p];
                    break;
                }
            }
            var winningPlayer = this.manager.createEntityFromAssemblage(winner.character);
            this.manager.updateComponentDataForEntity('Position', winningPlayer, {
                x: 450,
                y: 300
            });
            var characterData = this.manager.getComponentDataForEntity('Character', winningPlayer);
            var displayableData = this.manager.getComponentDataForEntity('Displayable', winningPlayer);
            var playerData = this.manager.getComponentDataForEntity('Player', winningPlayer);
            playerData.number = winner.number;

            var spriteLetters = ['a', 'b'];
            var spriteLetter = spriteLetters[playerData.number];
            for (var manipulation in winner.manipulations) {
                if ('Nega' == winner.manipulations[manipulation]) {
                    spriteLetter = spriteLetter === 'a' ? 'b' : 'a';
                    break;
                }
            }
            displayableData.sprite = characterData.sprite + spriteLetter;

            var playerNumber = this.manager.createEntity(['Displayable', 'Position']);
            this.manager.updateComponentDataForEntity('Displayable', playerNumber, {
                sprite: 'player' + playerData.number,
            });
            this.manager.updateComponentDataForEntity('Position', playerNumber, {
                x: 300,
                y: 585
            });

            // Create all background sprites.
            var backgroundSprites = [
                'upgrade_menu_foreground',
                'score_menu_background',
            ];
            for (var i = 0; i < backgroundSprites.length; i++) {
                var entity = this.manager.createEntity(['Position', 'Displayable']);
                this.manager.updateComponentDataForEntity('Displayable', entity, {sprite: backgroundSprites[i]});
            }

            this.timerDone = false;
            this.game.time.events.add(2000, function() {
                this.timerDone = true;
            }, this);
        },

        end: function () {
            this.soundProcessor.stopAll();
            this.game.state.start('PlayerChoice', true, false);
        },

        update: function () {
            GlobalManager.update(this.game.time.elapsed);
            this.manager.update(this.game.time.elapsed);

            if (this.timerDone) {
                var inputs = GlobalManager.getComponentsData('Input');
                for (var i in inputs) {
                    if (inputs[i].active) {
                        this.end();
                    }
                }
            }
        },

    };

    return Score;
});
