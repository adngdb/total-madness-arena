define({
    name: 'Movable',
    state: {
        dy: 10,
        dx: 0,
        speed: 300, // in pixels per second

        goingRight: true,
        touchingGround: false,

        speedY: 0,
        gravityScale: 1,
        jumpAllowed: true,
        lastJump: 0,
    }
});
