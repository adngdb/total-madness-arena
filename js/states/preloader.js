define(function() {

    var Preloader = function(game) {
        this.background = null;

        this.PLAYER_SIZE = 48;
    };

    Preloader.prototype = {

        preload: function() {
            // this.background = this.add.sprite(0, 0, 'preloaderBackground');
            // this.preloadBar = this.add.sprite(this.world.centerX - 380, this.world.centerY - 10, 'preloaderBar');

            // this.load.setPreloadSprite(this.preloadBar);

            // this.load.spritesheet('player', 'assets/gfx/player.png', this.PLAYER_SIZE, this.PLAYER_SIZE);

            // this.load.image('background', 'assets/gfx/background.png');

            // this.load.spritesheet('muteToggle', 'assets/interface/sound.png', 128, 128);

            // // audio for background soundtrack
            // this.load.audio('theme_relax', 'assets/sfx/theme_main_relax.ogg');

            // this.load.tilemap('access_map', 'assets/maps/access.json', null, Phaser.Tilemap.TILED_JSON);
        },

        create: function() {
            // var tween = this.add.tween(this.background)
            //     .to({alpha: 0}, 800, Phaser.Easing.Linear.None, true);
            // var tween = this.add.tween(this.preloadBar)
            //     .to({alpha: 0}, 800, Phaser.Easing.Linear.None, true);
            // tween.onComplete.add(this.startGame, this);
        },

        startGame: function() {
            // this.game.state.start('MainMenu');
        }

    };

    return Preloader;
});
