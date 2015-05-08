define(function () {

    var InputProcessor = function (manager, game) {
        this.manager = manager;
        this.game = game;
        this.firstPlayerInputs = [];
        this.secondPlayerInputs = [];

        this.init();
    };

    InputProcessor.actions = {
        UP : 'up',
        LEFT : 'left',
        DOWN : 'down',
        RIGHT : 'right',
        ACTION1: 'action1',
        ACTION2: 'action2'
    }

    InputProcessor.prototype.init = function () {

        var firstPlayerControls = [
            {action: InputProcessor.actions.UP, keys: [Phaser.Keyboard.UP]},
            {action: InputProcessor.actions.LEFT, keys: [Phaser.Keyboard.LEFT]},
            {action: InputProcessor.actions.DOWN, keys: [Phaser.Keyboard.DOWN]},
            {action: InputProcessor.actions.RIGHT, keys: [Phaser.Keyboard.RIGHT]},
            {action: InputProcessor.actions.ACTION1, keys: [Phaser.Keyboard.NUMPAD_0]},
            {action: InputProcessor.actions.ACTION2, keys: [Phaser.Keyboard.NUMPAD_DECIMAL]}
        ];

        for (var firstPlayerControlId in firstPlayerControls) {
            var input = this.manager.createEntity(['Input']);
            this.manager.getComponentDataForEntity('Input', input).action = firstPlayerControls[firstPlayerControlId].action;
            this.manager.getComponentDataForEntity('Input', input).keys = firstPlayerControls[firstPlayerControlId].keys;
            this.manager.getComponentDataForEntity('Input', input).player = 0;
            this.firstPlayerInputs.push(input);
        }

        var secondPlayerControls = [
            {action: InputProcessor.actions.UP, keys: [Phaser.Keyboard.Z]},
            {action: InputProcessor.actions.LEFT, keys: [Phaser.Keyboard.Q]},
            {action: InputProcessor.actions.DOWN, keys: [Phaser.Keyboard.S]},
            {action: InputProcessor.actions.RIGHT, keys: [Phaser.Keyboard.D]},
            {action: InputProcessor.actions.ACTION1, keys: [Phaser.Keyboard.T]},
            {action: InputProcessor.actions.ACTION2, keys: [Phaser.Keyboard.G]}
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
