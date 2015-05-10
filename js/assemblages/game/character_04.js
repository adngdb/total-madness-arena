define({
    name: 'Character_04',
    description: 'Playable character 04. Nickname: Eva. ',
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
            keys: [16, 17, 18, 19],
            speed: 12,
        },
        'AnimationIdle': {
            keys: [0, 1, 2, 3],
            speed: 8,
        },
        'BoundingBox': {
            x: -32,
            y: -48,
            width: 64,
            height: 96,
        },
        'Displayable': {
            sprite: 'chara_eva',
        },
        'Character': {
            name: 'Eva',
        },
        'Position': {
            x: 200,
            y: 200,
        },
    }
});
