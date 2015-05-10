define({
    name: 'Character_02',
    description: 'Playable character 02. Nickname: Mario the Plumber. ',
    components: [
        'Animated',
        'AnimationIdle',
        'Displayable',
        'Position',
        'Character',
        'Player',
    ],
    initialState: {
        'AnimationIdle': {
            keys: [0, 1, 2, 3],
            speed: 8,
        },
        'Displayable': {
            sprite: 'chara_thin',
        },
        'Character': {
            name: 'Gino',
        },
        'Position': {
            x: 500,
            y: 700,
        },
    }
});
