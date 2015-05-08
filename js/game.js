define([], function () {
    'use strict';

    function Game() {
    }
    
    Game.prototype = {
        constructor: Game,

        start: function() {
            this.game = new Phaser.Game(800, 600, Phaser.AUTO, '', { 
                preload: this.preload, 
                create: this.create 
            });
        },

        preload: function() {
        },
        
        create: function() {
        }
    };
    
    return Game;
});