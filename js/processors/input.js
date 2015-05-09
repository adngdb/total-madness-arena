define(['constants'], function (Const) {

    var InputProcessor = function (manager, game) {
        this.manager = manager;
        this.game = game;
        this.firstPlayerInputs = [];
        this.secondPlayerInputs = [];

        this.init();
    };

    InputProcessor.prototype.init = function () {

        var firstPlayerControls = [
            {action: Const.inputs.JUMP, keys: [Phaser.Keyboard.UP]},
            {action: Const.inputs.LEFT, keys: [Phaser.Keyboard.LEFT]},
            {action: Const.inputs.DOWN, keys: [Phaser.Keyboard.DOWN]},
            {action: Const.inputs.RIGHT, keys: [Phaser.Keyboard.RIGHT]},
            {action: Const.inputs.ACTION1, keys: [Phaser.Keyboard.NUMPAD_0]},
            {action: Const.inputs.ACTION2, keys: [Phaser.Keyboard.NUMPAD_DECIMAL]}
        ];

        for (var firstPlayerControlId in firstPlayerControls) {
            var input = this.manager.createEntity(['Input']);
            this.manager.getComponentDataForEntity('Input', input).action = firstPlayerControls[firstPlayerControlId].action;
            this.manager.getComponentDataForEntity('Input', input).keys = firstPlayerControls[firstPlayerControlId].keys;
            this.manager.getComponentDataForEntity('Input', input).player = 0;
            this.firstPlayerInputs.push(input);
        }

        var secondPlayerControls = [
            {action: Const.inputs.JUMP, keys: [Phaser.Keyboard.Z]},
            {action: Const.inputs.LEFT, keys: [Phaser.Keyboard.Q]},
            {action: Const.inputs.DOWN, keys: [Phaser.Keyboard.S]},
            {action: Const.inputs.RIGHT, keys: [Phaser.Keyboard.D]},
            {action: Const.inputs.ACTION1, keys: [Phaser.Keyboard.T]},
            {action: Const.inputs.ACTION2, keys: [Phaser.Keyboard.G]}
        ];

        for (var secondPlayerControlId in secondPlayerControls) {
            var input = this.manager.createEntity(['Input']);
            this.manager.getComponentDataForEntity('Input', input).action = secondPlayerControls[secondPlayerControlId].action;
            this.manager.getComponentDataForEntity('Input', input).keys = secondPlayerControls[secondPlayerControlId].keys;
            this.manager.getComponentDataForEntity('Input', input).player = 1;
            this.secondPlayerInputs.push(input);
        }
    };

    InputProcessor.prototype.update = function () {
        var inputs = this.manager.getComponentsData('Input');
        for (var inputId in inputs) {
            if (this.isDown(inputs[inputId].keys)) {
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
        keys.every(function (element, index, array) {
            atLeastOneKeyIsDown = atLeastOneKeyIsDown || self.game.input.keyboard.isDown(element);
        });

        return atLeastOneKeyIsDown
    };

    return InputProcessor;
});
