(function () {
    'use strict';

    requirejs.config({
        baseUrl: "js/"
    });
 
    require(['game'], function (Game) {
        var game = new Game();
        game.start();
    });
}());