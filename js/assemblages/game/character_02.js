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
        'Character',
        'Portrait',
    ],
    initialState: {
        'AnimationAttack1': {
            keys: [8, 9, 10, 9],
            speed: 10,
        },
        'AnimationAttack2': {
            keys: [16, 17, 18, 19, 17, 16],
            speed: 10,
        },
        'AnimationIdle': {
            keys: [0, 1, 2, 3],
            speed: 8,
        },
        'AnimationWalk': {
            speed: 20,
        },
        'BoundingBox': {
            x: -22,
            y: -26,
            width: 40,
            height: 74,
        },
        'Character': {
            name: 'Gino',
            sprite: 'chara_gino_',
        },
        'Position': {
            x: 500,
            y: 700,
        },
        'Portrait': {
            sprite: 'portrait_gino',
        },
    }
});
