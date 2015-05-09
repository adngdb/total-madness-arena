define(['constants', 'lib/sat'], function (Const, SAT) {

    var GRAVITY = 10;
    var DECELERATION = 1; // in pixels per second

    var PhysicsProcessor = function (manager, game) {
        this.manager = manager;
        this.game = game;

        this._boxes = {};
        this.mapIsLoaded = false;
    };

    PhysicsProcessor.prototype.update = function (dt) {
        var boxData = null;
        var posData = null;

        var inputs = this.manager.getComponentsData('Input');
        var players = this.manager.getComponentsData('Player');
        var movables = this.manager.getComponentsData('Movable');

        // Apply gravity.
        for (var m in movables) {
            var moveData = movables[m];
            moveData.dy += DECELERATION * moveData.gravityScale * dt;
            if (moveData.dy > GRAVITY) {
                moveData.dy = GRAVITY;
            }
            moveData.dx = 0;
        }

        // Update movements for players given current inputs.
        for (var inputId in inputs) {
            if (inputs[inputId].active) {
                var moveData = null;
                for (var playerId in players) {
                    if (players[playerId].number === inputs[inputId].player) {
                        if (this.manager.entityHasComponent(playerId, 'Movable')) {
                            moveData = this.manager.getComponentDataForEntity('Movable', playerId);
                        }
                        break;
                    }
                }

                if (moveData !== null) {
                    switch (inputs[inputId].action) {
                        case Const.inputs.JUMP:
                            moveData.dy = -50;
                            break;
                        case Const.inputs.LEFT:
                            moveData.dx -= (dt / 1000.) * moveData.speed;
                            break;
                        case Const.inputs.RIGHT:
                            moveData.dx += (dt / 1000.) * moveData.speed;
                            break;
                        case Const.inputs.ACTION1:
                            console.log('action1');
                            break;
                        case Const.inputs.ACTION2:
                            console.log('action2');
                            break;
                    }
                }
            }
        }

        // Move all movables.
        for (var m in movables) {
            var moveData = movables[m];
            var posData = this.manager.getComponentDataForEntity('Position', m);
            posData.x += moveData.dx;
            this.checkCollision();
            posData.y += moveData.dy;
            this.checkCollision();
        }

        // Get the map to find platforms and boundaries.
        if (!this.mapIsLoaded) {
            this.loadMap();
        }
    };

    PhysicsProcessor.prototype.loadMap = function () {
        // First see if there's a map available.
        var maps = this.manager.getComponentsData('Map');
        for (var i in maps) {
            var map = maps[i]._map;
            console.debug('Found a new map, adding BoundingBoxes');

            for (var l in map.layers) {
                var layer = map.layers[l];
                if (layer.name === 'collision') {
                    for (var t in layer.tileIds) {
                        if (layer.tileIds[t] !== 0) {
                            // Create a bounding box for that tile.
                            var boxId = this.manager.createEntity(['Position', 'BoundingBox']);
                            boxData = this.manager.getComponentDataForEntity('BoundingBox', boxId);
                            boxData.x = 0
                            boxData.y = 0;
                            boxData.width = map.tileWidth;
                            boxData.height = map.tileHeight;

                            posData = this.manager.getComponentDataForEntity('Position', boxId);
                            posData.x = (t % map.size.x) * map.tileWidth;
                            posData.y = Math.floor(t / map.size.x) * map.tileHeight;
                            // console.log(posData.x, posData.y);
                        }
                    }
                }
            }

            this.mapIsLoaded = true;
        }
    }

    PhysicsProcessor.prototype.checkCollision = function () {
        // Compute collisions and make appropriate moves to correct positions.
        var movables = this.manager.getComponentsData('Movable');
        var boundingBoxes = this.manager.getComponentsData('BoundingBox');
        var areColliding = null;
        var collisionResponse = new SAT.Response();

        for (var movableId in movables) {
            var moveData = movables[movableId];
            var movableBoxData = this.manager.getComponentDataForEntity('BoundingBox', movableId);
            var movablePosData = this.manager.getComponentDataForEntity('Position', movableId);

            var satElement = new SAT.Box(
                (new SAT.V(movableBoxData.x, movableBoxData.y)).add(new SAT.V(movablePosData.x, movablePosData.y)),
                movableBoxData.width,
                movableBoxData.height
            ).toPolygon();

            for (var id in boundingBoxes) {
                if (id === movableId) {
                    continue;
                }

                boxData = boundingBoxes[id];
                posData = this.manager.getComponentDataForEntity('Position', id);

                if (!this._boxes[id] || this.manager.entityHasComponent(id, 'Movable')) {
                    this._boxes[id] = new SAT.Box(
                        (new SAT.V(boxData.x, boxData.y)).add(new SAT.V(posData.x, posData.y)),
                        boxData.width,
                        boxData.height
                    ).toPolygon();
                }

                var areColliding = SAT.testPolygonPolygon(satElement, this._boxes[id], collisionResponse);

                if (areColliding) {
                    // console.log('HIT: ', movableId, id);

                    // console.log('---------------------------------------');
                    // console.log(satElement, this._boxes[id]);
                    // console.log(collisionResponse.overlap, collisionResponse.overlapV.x, collisionResponse.overlapV.y);

                    // console.log(movablePosData.x, movablePosData.y, moveData.dy);

                    movablePosData.x -= collisionResponse.overlapV.x;
                    movablePosData.y -= collisionResponse.overlapV.y + 1;

                    // update the boundingBox for the movable
                    satElement = new SAT.Box(
                        (new SAT.V(movableBoxData.x, movableBoxData.y)).add(new SAT.V(movablePosData.x, movablePosData.y)),
                        movableBoxData.width,
                        movableBoxData.height
                    ).toPolygon();
                    collisionResponse.clear();
                }
            }
        }
    }

    return PhysicsProcessor;
});
