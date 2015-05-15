define({
    name: 'Character_01',
    description: 'Playable character 01. Nickname: The Big Fat Guy. ',
    components: [
        'Animated',
        'AnimationIdle',
        'Displayable',
        'Position',
        'Character',
        'Player',
    ],
    initialState: {
        'Displayable': {
            scaleX: 4,
            scaleY: 4,
        },
        'Character': {
            name: 'Imperator',
            sprite: 'chara_imperator_',
        },
    }
});
