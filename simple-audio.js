// Simple audio tone generator that definitely works
function createSimpleAudio() {
    try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        
        // Resume context if suspended
        if (audioContext.state === 'suspended') {
            audioContext.resume();
        }
        
        // Create a gentle, meditative background tone
        const oscillator1 = audioContext.createOscillator();
        const oscillator2 = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        // Connect oscillators to gain, gain to destination
        oscillator1.connect(gainNode);
        oscillator2.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        // Set up gentle tones (A major chord)
        oscillator1.frequency.setValueAtTime(220, audioContext.currentTime); // A3
        oscillator2.frequency.setValueAtTime(277.18, audioContext.currentTime); // C#4
        
        // Set volume low for background ambience
        gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
        
        // Use sine waves for gentle sound
        oscillator1.type = 'sine';
        oscillator2.type = 'sine';
        
        // Start the oscillators
        oscillator1.start();
        oscillator2.start();
        
        console.log('Simple audio background started');
        return { oscillator1, oscillator2, gainNode, audioContext };
        
    } catch (error) {
        console.log('Audio not supported:', error);
        return null;
    }
}

// Make it globally available
window.createSimpleAudio = createSimpleAudio;