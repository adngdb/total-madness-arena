define({
    name: 'Character_01',
    description: 'Playable character 01. Nickname: The Big Fat Guy. ',
    components: [
        'Animated',
        'AnimationIdle',
        'AnimationJump',
        'AnimationWalk',
        'Attack',
        'BoundingBox',
        'Displayable',
        'Life',
        'Movable',
        'Player',
        'Position',
    ],
    initialState: {
        'BoundingBox': {
            x: -32,
            y: -48,
            width: 64,
            height: 96,
        },
        'Displayable': {
            sprite: 'chara_fat',
        },
        'Position': {
            x: 200,
            y: 200,
        },
    }
});
