define(['processors/input'], function (InputProcessor) {

    var PhysicsProcessor = function (manager, game) {
        this.manager = manager;
        this.game = game;
        this.game.physics.startSystem(Phaser.Physics.P2JS);
        this.game.physics.p2.gravity.y = 250;

        this.init();
    };

    PhysicsProcessor.prototype.init = function () {
    };

    PhysicsProcessor.prototype.update = function () {
        var inputs = this.manager.getComponentsData('Input');
        var players = this.manager.getComponentsData('Player');

        for (var inputId in inputs) {
            if (inputs[inputId].active) {
                var concernedPlayer = null;
                for (var playerId in players) {
                    if (players[playerId].number === inputs[inputId].player) {
                        concernedPlayer = playerId;
                    }
                }
                switch (inputs[inputId].action) {
                    case InputProcessor.actions.JUMP:
                        var positionData = this.manager.getComponentDataForEntity('Position', concernedPlayer);
                        positionData.y -= 5;
                        break;
                    case InputProcessor.actions.LEFT:
                        var positionData = this.manager.getComponentDataForEntity('Position', concernedPlayer);
                        positionData.x -= 5;
                        break;
                    case InputProcessor.actions.DOWN:
                        var positionData = this.manager.getComponentDataForEntity('Position', concernedPlayer);
                        positionData.y += 5;
                        break;
                    case InputProcessor.actions.RIGHT:
                        var positionData = this.manager.getComponentDataForEntity('Position', concernedPlayer);
                        positionData.x += 5;
                        break;
                    case InputProcessor.actions.ACTION1:
                        console.log('action1');
                        break;
                    case InputProcessor.actions.ACTION2:
                        console.log('action2');
                        break;
                }
            }
        }
    };

    return PhysicsProcessor;
});
