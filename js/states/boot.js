define(function() {

    var Boot = function (game) {
    };

    Boot.prototype = {
        init: function () {
            this.game.input.keyboard.addKeyCapture(Phaser.Keyboard.SPACEBAR);

            // //  Unless you specifically know your game needs to support multi-touch I would recommend setting this to 1
            this.input.maxPointers = 1;

            // //  Phaser will automatically pause if the browser tab the game is in loses focus. You can disable that here:
            this.stage.disableVisibilityChange = false;

            if (this.game.device.desktop)
            {
                 //  If you have any desktop specific settings, they can go in here
                 //this.scale.pageAlignHorizontally = true;
            }
            else
            {
                 //  Same goes for mobile settings.
                 //  In this case we're saying "scale the game, no lower than 480x260 and no higher than 1024x768"
                 //this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
                 //this.scale.minWidth = 480;
                 //this.scale.minHeight = 260;
                 //this.scale.maxWidth = 1024;
                 //this.scale.maxHeight = 768;
                 //this.scale.forceLandscape = true;
                 //this.scale.pageAlignHorizontally = true;
                 //this.scale.setScreenSize(true);
            }
        },

        preload: function () {
            this.load.image('preloaderBackground', 'assets/gfx/progress_bar_fg.png');
            this.load.image('preloaderBar', 'assets/gfx/progress_bar_bg.png');
            this.load.image('preloaderText', 'assets/gfx/loading.png');
        },

        create: function () {
            this.state.start('Preload');
        }
    };

    return Boot;
});
