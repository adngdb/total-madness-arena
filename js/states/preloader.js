define([
    'constants',
    'global-manager',
    'components/global/input',
    'processors/global/input',
],
function (
    Const,
    GlobalManager,
    Input,
    InputProcessor
) {

    var Preloader = function(game) {
        this.background = null;
        this.preloadBar = null;
        this.loadingText = null;
    };

    Preloader.prototype = {

        init: function () {
            GlobalManager.addComponent(Input.name, Input);
            GlobalManager.addProcessor(new InputProcessor(this.game));
        },

        preload: function() {
            this.background = this.add.sprite(this.world.centerX - 162, this.world.centerY + 100, 'preloaderBackground');
            this.preloadBar = this.add.sprite(this.world.centerX - 162, this.world.centerY + 100, 'preloaderBar');
            this.loadingText = this.add.sprite(this.world.centerX - 162, this.world.centerY - 10, 'preloaderText');

            this.load.setPreloadSprite(this.preloadBar);

            /** Player Choice state stuff **/
            this.game.load.image('menuSelectionPerso', 'assets/gfx/menuSelectionPerso.png');
            // missing char portrait
            // this.game.load.image('upgrade_menu_middleground', 'assets/gfx/upgrade_menu_middleground.png');

            /** Game state stuff **/
            this.game.load.spritesheet('chara_imperator_a', 'assets/gfx/chara_imperator_a.png', 64, 96);
            this.game.load.spritesheet('chara_imperator_b', 'assets/gfx/chara_imperator_b.png', 64, 96);
            this.game.load.spritesheet('chara_gino_a', 'assets/gfx/chara_gino_a.png', 64, 96);
            this.game.load.spritesheet('chara_gino_b', 'assets/gfx/chara_gino_b.png', 64, 96);
            this.game.load.spritesheet('chara_punkette_a', 'assets/gfx/chara_punkette_a.png', 64, 96);
            this.game.load.spritesheet('chara_punkette_b', 'assets/gfx/chara_punkette_b.png', 64, 96);
            this.game.load.spritesheet('chara_eva_a', 'assets/gfx/chara_eva_a.png', 64, 96);
            this.game.load.spritesheet('chara_eva_b', 'assets/gfx/chara_eva_b.png', 64, 96);
            this.game.load.spritesheet('chara_kaput_a', 'assets/gfx/chara_kaput_a.png', 64, 96);
            this.game.load.spritesheet('chara_kaput_b', 'assets/gfx/chara_kaput_b.png', 64, 96);
            this.game.load.spritesheet('fx', 'assets/gfx/fx.png', 64, 96);

            // GUI
            this.game.load.image('inGameGUIBarBorder', 'assets/gfx/inGameGUIBarBorder.png');
            this.game.load.image('inGameGUIBarFill', 'assets/gfx/inGameGUIBarFill.png');
            this.game.load.image('inGameGUITimer', 'assets/gfx/inGameGUITimer.png');

            var cacheKey = Phaser.Plugin.Tiled.utils.cacheKey;
            for (var i = 1; i <= Const.game.NUMBER_OF_MAPS; i++) {
                this.game.load.tiledmap(
                    cacheKey('level_map_0' + i, 'tiledmap'),
                    'assets/levels/map_0' + i + '.json',
                    null,
                    Phaser.Tilemap.TILED_JSON
                );
                this.game.load.image(
                    cacheKey('level_map_0' + i, 'tileset', 'level_all'),
                    'assets/gfx/lvl_all.png'
                );
            }

            /** Upgrade state stuff **/
            this.game.load.image('upgrade_menu_back_ground', 'assets/gfx/upgrade_menu_back_ground.png');
            this.game.load.image('upgrade_menu_box', 'assets/gfx/upgrade_menu_box.png');
            this.game.load.image('upgrade_menu_foreground', 'assets/gfx/upgrade_menu_foreground.png');
            this.game.load.image('upgrade_menu_middleground', 'assets/gfx/upgrade_menu_middleground.png');
            this.game.load.image('ingame_foreground', 'assets/gfx/ingame_foreground.png');

            /** Title state stuff **/
            this.game.load.image('title_menu_background', 'assets/gfx/title_screen.png');

            /** Score state stuff **/
            this.game.load.image('score_menu_background', 'assets/gfx/score_menu_background.png');
            this.game.load.image('player0', 'assets/gfx/player0.png');
            this.game.load.image('player1', 'assets/gfx/player1.png');

            /** Ambiance music **/
            this.game.load.audio('ambiance_lvl_1', 'assets/sfx/ambiance_lvl_1.ogg');
            this.game.load.audio('ambiance_menu_all', 'assets/sfx/ambiance_menu_all.ogg');
        },

        create: function() {
            // Animate away.
            this.add.tween(this.background)
                .to({alpha: 0}, 800, Phaser.Easing.Linear.None, true);
            this.add.tween(this.loadingText)
                .to({alpha: 0}, 800, Phaser.Easing.Linear.None, true);
            this.add.tween(this.preloadBar)
                .to({alpha: 0}, 800, Phaser.Easing.Linear.None, true)
                .onComplete.add(this.startGame, this);
        },

        startGame: function() {
             this.game.state.start('Title');
        }

    };

    return Preloader;
});
