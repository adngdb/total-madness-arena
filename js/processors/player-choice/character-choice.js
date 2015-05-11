define([
    'global-manager',
    'constants',
], function (GlobalManager, Const) {

    var CharacterChoiceProcessor = function (manager, charAssemblages, current) {
        this.manager = manager;
        this.charAssemblages = charAssemblages;
        this.current = current;
    };

    CharacterChoiceProcessor.prototype.update = function () {
        var inputs = GlobalManager.getComponentsData('Input');

        for (var inputId in inputs) {
            var input = inputs[inputId];

            if (
                !input.justPressed ||
                (
                    input.action !== Const.inputs.RIGHT &&
                    input.action !== Const.inputs.LEFT
                )
            ) {
                continue;
            }

            // delete old entity
            var allPlayers = this.manager.getComponentsData('Player');
            for (var player in allPlayers) {
                if (input.player === allPlayers[player].number) {
                    this.manager.removeEntity(parseInt(player));
                }
            }

            if (input.action === Const.inputs.RIGHT) {
                this.current[input.player] = (this.current[input.player] + 1) % this.charAssemblages.length;
            }
            else if (input.action === Const.inputs.LEFT) {
                var choice = this.current[input.player] - 1;
                var ln = this.charAssemblages.length;

                // This is the actual correct way of doing a modulo.
                // See http://stackoverflow.com/questions/23126440/
                this.current[input.player] = (choice % ln + ln) % ln;
            }

            // create new Entity
            var newPlayer = this.manager.createEntityFromAssemblage(this.charAssemblages[this.current[input.player]].name)
            this.manager.updateComponentDataForEntity('Player', newPlayer, {
                number: input.player,
            });
            if (input.player === 1) {
                this.manager.updateComponentDataForEntity('Position', newPlayer, {
                    x: 220,
                    y: 340,
                });
            } else {
                this.manager.updateComponentDataForEntity('Position', newPlayer, {
                    x: 700,
                    y: 340,
                });
            }
        }
    };

    return CharacterChoiceProcessor;
});
