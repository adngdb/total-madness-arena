define(function() {

    var Preloader = function(game) {
        this.background = null;
        this.preloadBar = null;
        this.loadingText = null;
    };

    Preloader.prototype = {

        preload: function() {
            this.background = this.add.sprite(this.world.centerX - 162, this.world.centerY + 100, 'preloaderBackground');
            this.preloadBar = this.add.sprite(this.world.centerX - 162, this.world.centerY + 100, 'preloaderBar');
            this.loadingText = this.add.sprite(this.world.centerX - 162, this.world.centerY - 10, 'preloaderText');

            this.load.setPreloadSprite(this.preloadBar);

            /** Game state stuff **/
            this.game.load.spritesheet('chara_fat', 'assets/gfx/chara_fat.png', 64, 96);
            this.game.load.spritesheet('chara_thin', 'assets/gfx/chara_thin.png', 64, 96);

            var cacheKey = Phaser.Plugin.Tiled.utils.cacheKey;
            this.game.load.tiledmap(
                cacheKey('level_map', 'tiledmap'),
                'assets/levels/map_01.json',
                null,
                Phaser.Tilemap.TILED_JSON
            );
            this.game.load.image(
                cacheKey('level_map', 'tileset', 'lvl_all'),
                'assets/gfx/lvl_all.png'
            );

            /** Upgrade state stuff **/
            this.game.load.spritesheet('upgradeMenuBackGround', 'assets/gfx/upgrade_menu_back_ground.png', 960, 768);
            this.game.load.spritesheet('upgradeMenuMiddleGround', 'assets/gfx/upgrade_menu_box.png', 960, 768);
            this.game.load.spritesheet('upgradeMenuForeGround', 'assets/gfx/upgrade_menu_foreground.png', 960, 768);
            this.game.load.spritesheet('upgradeMenuBox', 'assets/gfx/upgrade_menu_middleground.png', 321, 73);
        },

        create: function() {
             this.add.tween(this.background)
                 .to({alpha: 0}, 800, Phaser.Easing.Linear.None, true);
             this.add.tween(this.loadingText)
                 .to({alpha: 0}, 800, Phaser.Easing.Linear.None, true);
             this.add.tween(this.preloadBar)
                 .to({alpha: 0}, 800, Phaser.Easing.Linear.None, true)
                 .onComplete.add(this.startGame, this);
        },

        startGame: function() {
             this.game.state.start('Game');
        }

    };

    return Preloader;
});
