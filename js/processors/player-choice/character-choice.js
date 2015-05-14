define([
    'global-manager',
    'constants',
], function (GlobalManager, Const) {

    var CharacterChoiceProcessor = function (manager, charAssemblages, current) {
        this.manager = manager;
        this.charAssemblages = charAssemblages;
        this.currentChoice = current;
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
                this.currentChoice[input.player] = (this.currentChoice[input.player] + 1) % this.charAssemblages.length;
            }
            else if (input.action === Const.inputs.LEFT) {
                var choice = this.currentChoice[input.player] - 1;
                var ln = this.charAssemblages.length;

                // This is the actual correct way of doing a modulo.
                // See http://stackoverflow.com/questions/23126440/
                this.currentChoice[input.player] = (choice % ln + ln) % ln;
            }

            // create new Entity
            this.createCharacter(input.player);
        }
    };

    CharacterChoiceProcessor.prototype.createCharacter = function (playerNumber) {
        var positions = {
            character: [
                {
                    x: 700,
                    y: 340,
                },
                {
                    x: 220,
                    y: 340,
                }
            ],
            text: [
                {
                    x: 720,
                    y: 618,
                },
                {
                    x: 240,
                    y: 618,
                }
            ]
        };

        var newPlayer = this.manager.createEntityFromAssemblage(
            this.charAssemblages[this.currentChoice[playerNumber]].name
        );
        this.manager.updateComponentDataForEntity('Player', newPlayer, {
            number: playerNumber,
        });
        this.manager.updateComponentDataForEntity('Position', newPlayer, positions['character'][playerNumber]);

        var characterData = this.manager.getComponentDataForEntity('Character', newPlayer);

        var text = this.manager.createEntity(['Text', 'Position', 'Player']);
        this.manager.updateComponentDataForEntity('Player', text, {
            number: playerNumber,
        });
        this.manager.updateComponentDataForEntity('Text', text, {
            content: characterData.name
        });
        this.manager.updateComponentDataForEntity('Position', text, positions['text'][playerNumber]);
    };

    return CharacterChoiceProcessor;
});
