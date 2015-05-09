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
            moveData.acceleration += DECELERATION * moveData.gravityScale * dt * 0.15;
            if (moveData.acceleration > 1) {
                moveData.acceleration = 1;
            }
            moveData.dy += moveData.acceleration;
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
                            if (moveData.jumpAllowed) {
                                moveData.acceleration = Const.acceleration;
                                moveData.jumpAllowed = false;
                            }
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
            this.checkCollision(m);
            posData.y += moveData.dy;
            this.checkCollision(m);
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
            var mapWidth = map.size.x;
            var mapHeight = map.size.y;

            console.debug('Found a new map, adding BoundingBoxes');

            var platformTiles = [];
            for (var l in map.layers) {
                var layer = map.layers[l];
                if (layer.name === 'collision') {
                    platformTiles = layer.tileIds;
                    break;
                }
            }

            var markedTiles = [];
            for (var i = 0; i < platformTiles.length; i++) {
                if (platformTiles[i] === 0 || markedTiles[i]) {
                    continue;
                }

                markedTiles[i] = true;
                var combinedBox = [i];

                var rowEnd = (Math.floor(i / mapWidth) + 1) * mapWidth - 1;
                var columnEnd = mapWidth * mapHeight - 1;
                var horizontalBox = true;

                // First check in the rest of the row if there are adjacents tiles.
                for (var j = i + 1; j <= rowEnd; j++) {
                    if (platformTiles[j] === 0 || markedTiles[j]) {
                        break;
                    }

                    markedTiles[j] = true;
                    combinedBox.push(j);
                }

                if (combinedBox.length === 1) {
                    // Then check in the rest of the column if there are adjacents tiles.
                    for (var k = i + mapWidth; k <= columnEnd; k += mapWidth) {
                        if (platformTiles[k] === 0 || markedTiles[k]) {
                            break;
                        }

                        markedTiles[k] = true;
                        combinedBox.push(k);
                        horizontalBox = false;
                    }
                }

                // Create a bounding box for that group of tiles.
                var boxId = this.manager.createEntity(['Position', 'BoundingBox']);
                boxData = this.manager.getComponentDataForEntity('BoundingBox', boxId);
                boxData.x = 0
                boxData.y = 0;
                if (horizontalBox) {
                    boxData.width = map.tileWidth * combinedBox.length;
                    boxData.height = map.tileHeight;
                }
                else {
                    boxData.width = map.tileWidth;
                    boxData.height = map.tileHeight * combinedBox.length;
                }

                posData = this.manager.getComponentDataForEntity('Position', boxId);
                posData.x = (i % mapWidth) * map.tileWidth;
                posData.y = Math.floor(i / mapWidth) * map.tileHeight;
            }

            this.mapIsLoaded = true;
        }
    }

    PhysicsProcessor.prototype.checkCollision = function (movableId) {
        // Compute collisions and make appropriate moves to correct positions.
        var boundingBoxes = this.manager.getComponentsData('BoundingBox');
        var areColliding = null;
        var collisionResponse = new SAT.Response();

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

                if (collisionResponse.overlapV.y > 0) {
                    // collision with ground : new jump allowed
                    var moveData = this.manager.getComponentDataForEntity('Movable', movableId);
                    moveData.jumpAllowed = true;
                }

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

    return PhysicsProcessor;
});
