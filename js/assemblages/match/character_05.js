define({
    name: 'Character_05',
    description: 'Playable character 05. Nickname: Sg. Kaput. ',
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
            keys: [0, 1, 2],
            speed: 8,
        },
        'Displayable': {
            sprite: 'chara_kaput',
            scaleX: 4,
            scaleY: 4,
        },
        'Character': {
            name: 'Sg. Kaput',
        },
    }
});
