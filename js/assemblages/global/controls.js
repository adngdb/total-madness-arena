define(['constants'], function (Const) {
    var controls = {
        0: [
            {
                action: Const.inputs.JUMP,
                keys: ['U'],
                padButtons: [Const.gamepad.STICK_UP, Const.gamepad.BUTTON_A]
            },
            {
                action: Const.inputs.LEFT,
                keys: ['H'],
                padButtons: [Const.gamepad.STICK_LEFT]
            },
            {
                action: Const.inputs.DOWN,
                keys: ['J'],
                padButtons: [Const.gamepad.STICK_DOWN]
            },
            {
                action: Const.inputs.RIGHT,
                keys: ['K'],
                padButtons: [Const.gamepad.STICK_RIGHT]
            },
            {
                action: Const.inputs.ACTION1,
                keys: ['O'],
                padButtons: [Const.gamepad.BUTTON_X]
            },
            {
                action: Const.inputs.ACTION2,
                keys: ['P'],
                padButtons: [Const.gamepad.BUTTON_Y]
            },
        ],
        1: [
            {
                action: Const.inputs.JUMP,
                keys: ['Z', 'W'],
                padButtons: [Const.gamepad.STICK_UP, Const.gamepad.BUTTON_A]
            },
            {
                action: Const.inputs.LEFT,
                keys: ['Q', 'A'],
                padButtons: [Const.gamepad.STICK_LEFT]
            },
            {
                action: Const.inputs.DOWN,
                keys: ['S'],
                padButtons: [Const.gamepad.STICK_DOWN]
            },
            {
                action: Const.inputs.RIGHT,
                keys: ['D'],
                padButtons: [Const.gamepad.STICK_RIGHT]
            },
            {
                action: Const.inputs.ACTION1,
                keys: ['R'],
                padButtons: [Const.gamepad.BUTTON_X]
            },
            {
                action: Const.inputs.ACTION2,
                keys: ['T'],
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
