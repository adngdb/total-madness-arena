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
        'Portrait',
    ],
    initialState: {
        'BoundingBox': {
            x: -16,
            y: -36,
            width: 30,
            height: 84,
        },
        'Character': {
            name: 'Punkette',
            sprite: 'chara_punkette_',
        },
        'Position': {
            x: 200,
            y: 200,
        },
        'Portrait': {
            sprite: 'portrait_punkette',
        },
    }
});
