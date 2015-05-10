define({
    name: 'Character_05',
    description: 'Playable character 05. Nickname: Sg. Kaput. ',
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
    ],
    initialState: {
        'AnimationAttack1': {
            keys: [8, 9, 10, 9],
            speed: 10,
        },
        'AnimationAttack2': {
            keys: [16, 17, 18, 17],
            speed: 10,
        },
        'AnimationIdle': {
            keys: [0, 1, 2],
            speed: 8,
        },
        'AnimationWalk': {
            keys: [32, 33, 34, 35, 36],
            speed: 15,
        },
        'BoundingBox': {
            x: -32,
            y: -48,
            width: 64,
            height: 96,
        },
        'Displayable': {
            sprite: 'chara_kaput',
        },
        'Character': {
            name: 'Sg. Kaput',
        },
        'Position': {
            x: 200,
            y: 200,
        },
    }
});
