define(['constants'], function (Const) {

    var InputProcessor = function (manager, game) {
        this.manager = manager;
        this.game = game;
        this.firstPlayerInputs = [];
        this.secondPlayerInputs = [];

        this.init();
    };

    InputProcessor.prototype.init = function () {
        this.game.input.gamepad.start();

        var firstPlayerControls = [
            {genetic: 1, keys: [Phaser.Keyboard.UP], padButtons: [Const.gamepad.STICK_UP, Const.gamepad.BUTTON_A]},
            {genetic: 2, keys: [Phaser.Keyboard.LEFT], padButtons: [Const.gamepad.STICK_LEFT]},
            {genetic: 3, keys: [Phaser.Keyboard.DOWN], padButtons: [Const.gamepad.STICK_DOWN]},
            {genetic: 4, keys: [Phaser.Keyboard.RIGHT], padButtons: [Const.gamepad.STICK_RIGHT]},
            {genetic: 5, keys: [Phaser.Keyboard.NUMPAD_0], padButtons: [Const.gamepad.BUTTON_X]},
            {genetic: 6, keys: [Phaser.Keyboard.NUMPAD_DECIMAL], padButtons: [Const.gamepad.BUTTON_Y]}
        ];

        for (var firstPlayerControlId in firstPlayerControls) {
            var input = this.manager.createEntity(['Input']);
            this.manager.getComponentDataForEntity('Input', input).genetic = firstPlayerControls[firstPlayerControlId].genetic;
            this.manager.getComponentDataForEntity('Input', input).keys = firstPlayerControls[firstPlayerControlId].keys;
            this.manager.getComponentDataForEntity('Input', input).player = 1;
            this.manager.getComponentDataForEntity('Input', input).pad = this.game.input.gamepad.pad1;
            this.manager.getComponentDataForEntity('Input', input).padButtons = firstPlayerControls[firstPlayerControlId].padButtons;
            this.firstPlayerInputs.push(input);
        }

        var secondPlayerControls = [
            {action: 1, keys: [Phaser.Keyboard.Z], padButtons: [Const.gamepad.STICK_UP, Const.gamepad.BUTTON_A]},
            {action: 2, keys: [Phaser.Keyboard.Q], padButtons: [Const.gamepad.STICK_LEFT]},
            {action: 3, keys: [Phaser.Keyboard.S], padButtons: [Const.gamepad.STICK_DOWN]},
            {action: 4, keys: [Phaser.Keyboard.D], padButtons: [Const.gamepad.STICK_RIGHT]},
            {action: 5, keys: [Phaser.Keyboard.T], padButtons: [Const.gamepad.BUTTON_X]},
            {action: 6, keys: [Phaser.Keyboard.G], padButtons: [Const.gamepad.BUTTON_Y]}
        ];

        for (var secondPlayerControlId in secondPlayerControls) {
            var input = this.manager.createEntity(['Input']);
            this.manager.getComponentDataForEntity('Input', input).genetic = secondPlayerControls[secondPlayerControlId].genetic;
            this.manager.getComponentDataForEntity('Input', input).keys = secondPlayerControls[secondPlayerControlId].keys;
            this.manager.getComponentDataForEntity('Input', input).player = 0;
            this.manager.getComponentDataForEntity('Input', input).pad = this.game.input.gamepad.pad2;
            this.manager.getComponentDataForEntity('Input', input).padButtons = secondPlayerControls[secondPlayerControlId].padButtons;
            this.secondPlayerInputs.push(input);
        }
    };

    InputProcessor.prototype.update = function () {
        var inputs = this.manager.getComponentsData('Input');
        for (var inputId in inputs) {
            if (this.isDown(inputs[inputId].keys) || this.padUsed(inputs[inputId].pad, inputs[inputId].padButtons)) {
                inputs[inputId].active = true;
            }
            else {
                inputs[inputId].active = false;
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
