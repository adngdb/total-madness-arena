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
            sprite: 'chara_imperator_a',
            scaleX: 4,
            scaleY: 4,
        },
        'Character': {
            name: 'Imperator',
        },
    }
});
