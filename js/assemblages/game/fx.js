define({
    name: 'fx',
    description: 'Contain the spriteSheet for all fx',
    components: [
        'Animated',
        'AnimationAttackFx',
        'AnimationJumpFx',
        'Displayable',
        'Movable',
        'Position',
    ],
    initialState: {
        'Displayable': {
            sprite: 'fx',
            deleted: true,
        },
        'Position': {
            x: 200,
            y: 200,
        },
    }
});
