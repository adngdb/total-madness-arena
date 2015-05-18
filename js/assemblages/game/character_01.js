define({
    name: 'Character_01',
    description: 'Playable character 01. Nickname: The Big Fat Guy. ',
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
        'AnimationAttack2': {
            keys: [16, 17, 18, 19, 18, 17, 16],
            speed: 8,
        },
        'BoundingBox': {
            x: -22,
            y: -28,
            width: 54,
            height: 76,
        },
        'Character': {
            name: 'Imperator',
            sprite: 'chara_imperator_',
        },
        'Position': {
            x: 200,
            y: 200,
        },
    }
});
