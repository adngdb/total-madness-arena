define([
    'constants',
    'global-manager',
], function (
    Const,
    GlobalManager
) {
    "use strict";

    var ControlsProcessor = function (manager) {
        this.manager = manager;
    };

    ControlsProcessor.prototype.update = function (dt) {
        var inputs = GlobalManager.getComponentsData('Input');
        var players = this.manager.getComponentsData('Player');
        var actions = this.manager.getComponentsData('Actions');

        // Reinitialize state for all entities.
        for (var actionsId in actions) {
            this.manager.updateComponentDataForEntity('Actions', actionsId, {
                jump: false,
                goLeft: false,
                goRight: false,
                attack1: false,
                attack2: false,
            });
        }

        // Update movements for players given current inputs.
        for (var inputId in inputs) {
            if (!inputs[inputId].active) {
                continue;
            }

            var actionsData = null;
            for (var playerId in players) {
                if (players[playerId].number === inputs[inputId].player) {
                    actionsData = this.manager.getComponentDataForEntity('Actions', playerId);
                    break;
                }
            }

            if (actionsData !== null) {
                switch (inputs[inputId].action) {
                    case Const.inputs.JUMP:
                        actionsData.jump = true;
                        break;
                    case Const.inputs.LEFT:
                        actionsData.goLeft = true;
                        break;
                    case Const.inputs.RIGHT:
                        actionsData.goRight = true;
                        break;
                    case Const.inputs.ATTACK1:
                        actionsData.attack1 = true;
                        break;
                    case Const.inputs.ATTACK2:
                        actionsData.attack2 = true;
                        break;
                }
            }
        }
    };

    return ControlsProcessor;
});
