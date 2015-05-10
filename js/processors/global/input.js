define([
    'constants',
    'global-manager',
    'assemblages/global/controls'
], function (Const, GlobalManager, Controls) {

    var InputProcessor = function (game) {
        this.manager = GlobalManager;
        this.game = game;

        this.init();
    };

    InputProcessor.prototype.init = function () {
        this.game.input.gamepad.start();

        for (var key in Controls) {
            var control = Controls[key];

            this.manager.addAssemblage(control.name, control);
            this.manager.createEntityFromAssemblage(control.name);
        }
    };

    InputProcessor.prototype.update = function () {
        var inputs = this.manager.getComponentsData('Input');
        for (var inputId in inputs) {
            var input = inputs[inputId];
            var padId = 'pad' + (parseInt(input.player) + 1);
            var pad = this.game.input.gamepad[padId];

            if (this.isDown(input.keys) || this.padUsed(pad, input.padButtons)) {
                input.active = true;
            }
            else {
                input.active = false;
            }
        }
    };

    InputProcessor.prototype.isDown = function (keys) {
        var atLeastOneKeyIsDown = false;

        var self = this;
        keys.forEach(function (element, index, array) {
            var key = Phaser.Keyboard[element];
            atLeastOneKeyIsDown = atLeastOneKeyIsDown || self.game.input.keyboard.isDown(key);
        });

        return atLeastOneKeyIsDown;
    };

    InputProcessor.prototype.padUsed = function (pad, padButtons) {
        var atLeastOnePadButtonIsDown = false;

        padButtons.forEach(function (element, index, array) {
            var actionMade = false;
            switch(element) {
                case Const.gamepad.STICK_UP:
                    if (pad.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_Y) < -0.1) {
                        actionMade = true;
                    }
                    break;
                case Const.gamepad.STICK_RIGHT:
                    if (pad.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_X) > 0.1) {
                        actionMade = true;
                    }
                    break;
                case Const.gamepad.STICK_DOWN:
                    if (pad.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_Y) > 0.1) {
                        actionMade = true;
                    }
                    break;
                case Const.gamepad.STICK_LEFT:
                    if (pad.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_X) < -0.1) {
                        actionMade = true;
                    }
                    break;
                case Const.gamepad.BUTTON_X:
                    if (pad.isDown(Phaser.Gamepad.XBOX360_X)) {
                        actionMade = true;
                    }
                    break;
                case Const.gamepad.BUTTON_Y:
                    if (pad.isDown(Phaser.Gamepad.XBOX360_Y)) {
                        actionMade = true;
                    }
                    break;
                case Const.gamepad.BUTTON_A:
                    if (pad.isDown(Phaser.Gamepad.XBOX360_A)) {
                        actionMade = true;
                    }
                    break;
            }
            atLeastOnePadButtonIsDown = atLeastOnePadButtonIsDown || actionMade;
        });

        return atLeastOnePadButtonIsDown;
    };

    return InputProcessor;
});
