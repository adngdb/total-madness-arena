define([
    'global-manager',
    'constants',
], function (GlobalManager, Const) {

    var InputProcessor = function (manager, charAssemblages, current) {
        this.manager = manager;
        this.charAssemblages = charAssemblages;
        this.current = current;
    };

    InputProcessor.prototype.update = function () {

    // ActionProcessor.prototype.computeAction = function (dt, attacks, input, action) {
        var inputs = GlobalManager.getComponentsData('Input');

        // get Actions for players given current inputs.
        for (var inputId in inputs) {
            if (inputs[inputId].active) {
                if (inputs[inputId].action == Const.inputs.RIGHT) {
                    // delete old entity
                    var allPlayer = this.manager.getComponentsData('Player');
                    for (var player in allPlayer) {
                        if (inputs[inputId].player == allPlayer[player].number) {
                            this.manager.removeEntity(player);
                        }
                    }

                    // create new Entity
                    this.current[inputs[inputId].player] = (++this.current[inputs[inputId].player]) % this.charAssemblages.length;
                    var newPlayer = this.manager.createEntityFromAssemblage(this.charAssemblages[this.current[inputs[inputId].player]].name)
                    this.manager.updateComponentDataForEntity('Displayable', newPlayer,
                        {
                            scaleX: 4,
                            scaleY: 4,
                        });
                    this.manager.updateComponentDataForEntity('Player', newPlayer,
                        {
                            number: inputs[inputId].player,
                        });
                    if (inputs[inputId].player == 1) {
                        this.manager.updateComponentDataForEntity('Position', newPlayer,
                            {
                                x: 220,
                                y: 340,
                            });
                    } else {
                        this.manager.updateComponentDataForEntity('Position', newPlayer,
                            {
                                x: 700,
                                y: 340,
                            });
                    }
                }
                else if (inputs[inputId].action == Const.inputs.LEFT) {
                    // delete old entity
                    var allPlayer = this.manager.getComponentsData('Player');
                    for (var player in allPlayer) {
                        if (inputs[inputId].player == allPlayer[player].number) {
                            this.manager.removeEntity(player);
                        }
                    }

                    // create new Entity
                    this.current[inputs[inputId].player] = (--this.current[inputs[inputId].player] + this.charAssemblages.length) % this.charAssemblages.length;
                    var newPlayer = this.manager.createEntityFromAssemblage(this.charAssemblages[this.current[inputs[inputId].player]].name)
                    this.manager.updateComponentDataForEntity('Displayable', newPlayer,
                        {
                            scaleX: 4,
                            scaleY: 4,
                        });
                    if (inputs[inputId].player == 1) {
                        this.manager.updateComponentDataForEntity('Position', newPlayer,
                            {
                                x: 220,
                                y: 340,
                            });
                    } else {
                        this.manager.updateComponentDataForEntity('Position', newPlayer,
                            {
                                x: 700,
                                y: 340,
                            });
                    }
                }
            }
        }
    }


    return InputProcessor;
});
