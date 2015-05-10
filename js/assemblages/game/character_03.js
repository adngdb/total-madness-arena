define({
    name: 'Character_03',
    description: 'Playable character 03. Nickname: Punkette. ',
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
        'BoundingBox': {
            x: -32,
            y: -48,
            width: 64,
            height: 96,
        },
        'Displayable': {
            sprite: 'chara_punkette',
        },
        'Character': {
            name: 'Punkette',
        },
        'Position': {
            x: 200,
            y: 200,
        },
    }
});
