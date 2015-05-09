define(['constants'], function (Const) {
    var controls = {
        0: [
            {
                action: Const.inputs.JUMP,
                keys: [Phaser.Keyboard.UP],
                padButtons: [Const.gamepad.STICK_UP, Const.gamepad.BUTTON_A]
            },
            {
                action: Const.inputs.LEFT,
                keys: [Phaser.Keyboard.LEFT],
                padButtons: [Const.gamepad.STICK_LEFT]
            },
            {
                action: Const.inputs.DOWN,
                keys: [Phaser.Keyboard.DOWN],
                padButtons: [Const.gamepad.STICK_DOWN]
            },
            {
                action: Const.inputs.RIGHT,
                keys: [Phaser.Keyboard.RIGHT],
                padButtons: [Const.gamepad.STICK_RIGHT]
            },
            {
                action: Const.inputs.ACTION1,
                keys: [Phaser.Keyboard.NUMPAD_0],
                padButtons: [Const.gamepad.BUTTON_X]
            },
            {
                action: Const.inputs.ACTION2,
                keys: [Phaser.Keyboard.NUMPAD_DECIMAL],
                padButtons: [Const.gamepad.BUTTON_Y]
            },
        ],
        1: [
            {
                action: Const.inputs.JUMP,
                keys: [Phaser.Keyboard.Z, Phaser.Keyboard.W],
                padButtons: [Const.gamepad.STICK_UP, Const.gamepad.BUTTON_A]
            },
            {
                action: Const.inputs.LEFT,
                keys: [Phaser.Keyboard.Q, Phaser.Keyboard.A],
                padButtons: [Const.gamepad.STICK_LEFT]
            },
            {
                action: Const.inputs.DOWN,
                keys: [Phaser.Keyboard.S],
                padButtons: [Const.gamepad.STICK_DOWN]
            },
            {
                action: Const.inputs.RIGHT,
                keys: [Phaser.Keyboard.D],
                padButtons: [Const.gamepad.STICK_RIGHT]
            },
            {
                action: Const.inputs.ACTION1,
                keys: [Phaser.Keyboard.T],
                padButtons: [Const.gamepad.BUTTON_X]
            },
            {
                action: Const.inputs.ACTION2,
                keys: [Phaser.Keyboard.G],
                padButtons: [Const.gamepad.BUTTON_Y]
            },
        ]
    };

    var assemblages = {};

    for (var p in controls) {
        var pControls = controls[p];
        for (var i = pControls.length - 1; i >= 0; i--) {
            var input = pControls[i];
            input.player = parseInt(p);

            var assemblage = {
                name: 'Input_' + input.action + '_' + input.player,
                components: ['Input'],
                initialState: {
                    'Input': input
                }
            };

            assemblages[assemblage.name] = assemblage;
        }
    }

    return assemblages;
});
