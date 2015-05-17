define([
    'lib/sat',
    'constants',
    'global-manager',
], function (SAT, Const, GlobalManager) {

    var ActionProcessor = function (manager, game) {
        this.manager = manager;
        this.game = game;
    };

    ActionProcessor.prototype.update = function (dt) {
        // compute Action 1
        var attacks = this.manager.getComponentsData('Attack1');
        this.computeAction(dt, attacks, Const.inputs.ACTION1, 1);

        // compute Action 2
        attacks = this.manager.getComponentsData('Attack2');
        this.computeAction(dt, attacks, Const.inputs.ACTION2, 2);
    };

    ActionProcessor.prototype.computeAction = function (dt, attacks, input, action) {
        var inputs = GlobalManager.getComponentsData('Input');
        var players = this.manager.getComponentsData('Player');

        // attack cooldown
        for (var attack in attacks) {
            attacks[attack].lastAttack += dt/1000.;
        }

        // get Actions for players given current inputs.
        for (var inputId in inputs) {
            if (inputs[inputId].active) {
                // get the playerID for the input
                var currentPlayer = null;
                for (var playerId in players) {
                    if (players[playerId].number === inputs[inputId].player) {
                        currentPlayer = playerId;
                        break;
                    }
                }
                if (currentPlayer !== null) {
                    if (inputs[inputId].action == input) {
                        if (action === 1) {
                            this.action1(currentPlayer);
                        }
                        else {
                            this.action2(currentPlayer);
                        }
                    }
                }
            }
        }
    }

    ActionProcessor.prototype.action1 = function (player) {
        // get the Attack of the current player
        var attack = this.manager.getComponentDataForEntity('Attack1', player);
        if (attack.lastAttack > attack.cooldown) {
            // attack allowed
            attack.lastAttack = 0;
            this.activateFx(player);
            var otherPlayer = this.checkCollisionWithMovableOnly(player);
            if (otherPlayer) {
                // hit the other player's Life
                var life = this.manager.getComponentDataForEntity('Life', otherPlayer);
                life.value -= attack.value;
                console.log('action 1 : dmg : ', -attack.value);
            }
        }
    }

    ActionProcessor.prototype.action2 = function (player) {
        // get the Attack of the current player
        var attack = this.manager.getComponentDataForEntity('Attack2', player);
        if (attack.lastAttack > attack.cooldown) {
            // attack allowed
            attack.lastAttack = 0;
            this.activateFx(player);
            var otherPlayer = this.checkCollisionWithMovableOnly(player);
            if (otherPlayer) {
                // hit the other player's Life
                var life = this.manager.getComponentDataForEntity('Life', otherPlayer);
                life.value -= attack.value;
                console.log('action 2 : dmg : ', -attack.value);
            }
        }
    }

    ActionProcessor.prototype.checkCollisionWithMovableOnly = function (movableId) {
        // Compute collisions with other Movable (player) only.
        var boundingBoxes = this.manager.getComponentsData('BoundingBox');
        var collisionResponse = new SAT.Response();

        var movableBoxData = this.manager.getComponentDataForEntity('BoundingBox', movableId);
        var movablePosData = this.manager.getComponentDataForEntity('Position', movableId);
        var movableData = this.manager.getComponentDataForEntity('Movable', movableId);

        var dx = movableData.goingRight ? 16 : -16;
        var satElement = new SAT.Box(
            (new SAT.V(movableBoxData.x, movableBoxData.y)).add(new SAT.V(movablePosData.x + dx, movablePosData.y)),
            movableBoxData.width,
            movableBoxData.height
        ).toPolygon();
        for (var id in boundingBoxes) {
            if ((id === movableId) || !(this.manager.entityHasComponent(id, 'Player'))) {
                continue;
            }

            boxData = boundingBoxes[id];
            posData = this.manager.getComponentDataForEntity('Position', id);
            box = new SAT.Box(
                (new SAT.V(boxData.x, boxData.y)).add(new SAT.V(posData.x, posData.y)),
                boxData.width,
                boxData.height
            ).toPolygon();

            if (SAT.testPolygonPolygon(satElement, box, collisionResponse)) {
                return id;
            } else {
                return false;
            }
        }
    }

    ActionProcessor.prototype.activateFx = function (player) {
        // search for the Fx entity
        var movables = this.manager.getComponentsData('Movable');
        var fxMov = null;
        for (fxMov in movables) {
            if (!this.manager.entityHasComponent(fxMov, 'Player')) {
                continue;
            }
        }
        var playerPos = this.manager.getComponentDataForEntity('Position', player);
        var playerMovable = this.manager.getComponentDataForEntity('Movable', player);

        // set the FX entity position
        this.manager.updateComponentDataForEntity('Position', fxMov, {
            x: playerPos.x,
            y: playerPos.y,
        });
        this.manager.updateComponentDataForEntity('Displayable', fxMov, {
            deleted: false
        });
        this.manager.updateComponentDataForEntity('Animated', fxMov, {
            current: 'attackFx',
            started: false,
        });
        movables[fxMov].goingRight = playerMovable.goingRight;
    }
    return ActionProcessor;
});
