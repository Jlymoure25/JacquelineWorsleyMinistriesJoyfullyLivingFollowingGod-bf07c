// Simple ambient audio fallback (main audio now uses SoundCloud directly)
class AmbientAudio {
    constructor() {
        this.isPlaying = false;
    }

    async initialize() {
        console.log('Ambient audio fallback initialized (main SoundCloud audio preferred)');
        return true;
    }

    play() {
        console.log('Using main SoundCloud audio instead of ambient fallback');
        this.isPlaying = true;
    }

    stop() {
        this.isPlaying = false;
        console.log('Ambient fallback stopped');
    }

    fadeOut() {
        console.log('Ambient fallback fade out');
        this.stop();
    }

    createMeditativeAmbience() {
        this.play();
    }
}

// Make available globally
window.AmbientAudio = AmbientAudio;