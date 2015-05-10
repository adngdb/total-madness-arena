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
            sprite: 'chara_fat',
        },
        'Character': {
            name: 'Imperator',
        },
        'Position': {
            x: 200,
            y: 200,
        },
    }
});
