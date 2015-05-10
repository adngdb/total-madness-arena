define(function () {

    var SoundProcessor = function (manager, game) {
        this.manager = manager;
        this.game = game;

        this.sounds = {};
    };

    SoundProcessor.prototype.createSound = function (entity, soundData) {
        var sound = this.game.add.sound(soundData.source, 1, soundData.loop);
        this.sounds[entity] = sound;
    };

    SoundProcessor.prototype.update = function (dt) {
        var entity;

        // Play all sounds.
        var sounds = this.manager.getComponentsData('Sound');
        for (entity in sounds) {
            // First create the actual Phaser.Sound object if it doesn't exist yet.
            if (!this.sounds[entity]) {
                this.createSound(entity, sounds[entity]);
                this.sounds[entity].play();
            }
        }
    };

    SoundProcessor.prototype.stopAll = function () {
        // Stop all sounds.
        for (s in this.sounds) {
            this.sounds[s].stop();
            this.sounds[s].destroy();
        }
    };

    return SoundProcessor;
});
