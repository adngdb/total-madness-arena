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
            x: -16,
            y: -36,
            width: 30,
            height: 84,
        },
        'Displayable': {
            sprite: 'chara_punkette_a',
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
