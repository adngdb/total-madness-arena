define(function () {

    var InputProcessor = function (manager, game) {
        this.manager = manager;
        this.game = game;
        this.firstPlayerInputs = [];
        this.secondPlayerInputs = [];

        this.init();
    };

    InputProcessor.prototype.init = function () {

        var firstPlayerControls = [
            {action: 'up', keys: [Phaser.Keyboard.UP]},
            {action: 'left', keys: [Phaser.Keyboard.LEFT]},
            {action: 'down', keys: [Phaser.Keyboard.DOWN]},
            {action: 'right', keys: [Phaser.Keyboard.RIGHT]},
            {action: 'numpadzero', keys: [Phaser.Keyboard.NUMPAD_0]},
            {action: 'numpaddecimal', keys: [Phaser.Keyboard.NUMPAD_DECIMAL]}
        ];

        for (var firstPlayerControlId in firstPlayerControls) {
            var input = this.manager.createEntity(['Input']);
            this.manager.getComponentDataForEntity('Input', input).action = firstPlayerControls[firstPlayerControlId].action;
            this.manager.getComponentDataForEntity('Input', input).keys = firstPlayerControls[firstPlayerControlId].keys;
            this.firstPlayerInputs.push(input);
        }

        var secondPlayerControls = [
            {action: 'z', keys: [Phaser.Keyboard.Z]},
            {action: 'q', keys: [Phaser.Keyboard.Q]},
            {action: 's', keys: [Phaser.Keyboard.S]},
            {action: 'd', keys: [Phaser.Keyboard.D]},
            {action: 't', keys: [Phaser.Keyboard.T]},
            {action: 'g', keys: [Phaser.Keyboard.G]}
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