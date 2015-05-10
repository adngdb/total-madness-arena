define([
    'global-manager',
], function (GlobalManager) {

    var InputProcessor = function (manager) {
        this.manager = manager;
    };

    InputProcessor.prototype.update = function () {
        var inputs = GlobalManager.getComponentsData('Input');
        var manipInputs = this.manager.getComponentsData('ManipInput');
        var choices = this.manager.getComponentsData('AvailableManips');

        for (var entity in manipInputs) {
            var manipInput = manipInputs[entity];
            var playerData = this.manager.getComponentDataForEntity('Player', entity);
            var input = inputs[manipInput.input];

            if (input.active) {
                var manipId = null;

                for (var c in choices) {
                    var plData = this.manager.getComponentDataForEntity('Player', c);
                    if (plData.number === input.player) {
                        manipId = c;
                    }
                }

                this.manager.updateComponentDataForEntity('AvailableManips', manipId, {
                    choice: manipInput.manip
                });
            }
        }
    };

    InputProcessor.prototype.isDown = function (keys) {
        var atLeastOneKeyIsDown = false;

        var self = this;
        keys.forEach(function (element, index, array) {
            atLeastOneKeyIsDown = atLeastOneKeyIsDown || self.game.input.keyboard.isDown(element);
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
