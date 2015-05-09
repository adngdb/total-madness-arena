define({
    name: 'Character_02',
    description: 'Playable character 02. Nickname: Mario the Plumber. ',
    components: [
        'Animated',
        'AnimationIdle',
        'AnimationJump',
        'AnimationWalk',
        'AnimationAttack1',
        'AnimationAttack2',
        'Attack1',
        'Attack2',
        'BoundingBox',
        'Displayable',
        'Life',
        'Movable',
        'Player',
        'Position',
    ],
    initialState: {
        'AnimationIdle': {
            keys: [0, 1, 2, 3],
            speed: 8,
        },
        'AnimationWalk': {
            speed: 8,
        },
        'BoundingBox': {
            x: -32,
            y: -48,
            width: 64,
            height: 96,
        },
        'Displayable': {
            sprite: 'chara_thin',
        },
        'Position': {
            x: 500,
            y: 700,
        },
    }
});
