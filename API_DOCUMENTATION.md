# API Documentation

## SoundCloud Widget API Integration

### Implementation Overview
This project uses the SoundCloud Widget API for precise audio control without relying on URL parameters or CSS volume manipulation.

### API Setup
```javascript
// Initialize SoundCloud Widget
const scWidget = SC.Widget(document.getElementById('soundcloud-player'));

// Bind to ready event
scWidget.bind(SC.Widget.Events.READY, () => {
    scWidget.setVolume(17); // Set to 17% volume
    scWidget.seekTo(0);     // Start from beginning
    scWidget.play();        // Begin playback
});
```

### Volume Control Methods

#### Pure API Volume Control
```javascript
// Set volume (0-100)
scWidget.setVolume(17); // 17% volume

// Get current volume
scWidget.getVolume((volume) => {
    console.log('Current volume:', volume);
});
```

#### Timeline Control
```javascript
// Seek to specific time (milliseconds)
scWidget.seekTo(0); // Start from beginning

// Get current position
scWidget.getPosition((position) => {
    console.log('Current position:', position, 'ms');
});

// Get duration
scWidget.getDuration((duration) => {
    console.log('Total duration:', duration, 'ms');
});
```

### Event Monitoring

#### Available Events
```javascript
// Widget is ready
SC.Widget.Events.READY

// Playback started
SC.Widget.Events.PLAY

// Playback paused
SC.Widget.Events.PAUSE

// Track finished
SC.Widget.Events.FINISH

// Playback progress (fires continuously)
SC.Widget.Events.PLAY_PROGRESS

// Loading progress
SC.Widget.Events.LOAD_PROGRESS

// Error occurred
SC.Widget.Events.ERROR
```

#### Event Implementation
```javascript
// Monitor playback progress
scWidget.bind(SC.Widget.Events.PLAY_PROGRESS, (data) => {
    console.log('Position:', data.currentPosition);
    console.log('Duration:', data.loadedProgress);
    
    // Maintain volume every 5 seconds
    if (data.currentPosition % 5000 < 100) {
        scWidget.setVolume(17);
    }
});

// Handle errors
scWidget.bind(SC.Widget.Events.ERROR, () => {
    console.log('SoundCloud API error - attempting recovery');
    // Implement error recovery logic
});
```

### Fade Effects Implementation

#### Fade In (2 minutes)
```javascript
fadeInAudio() {
    let currentVolume = 0;
    const targetVolume = 17;
    const duration = 120000; // 2 minutes
    const steps = 240;
    const increment = targetVolume / steps;
    const intervalTime = duration / steps;
    
    const fadeInInterval = setInterval(() => {
        currentVolume += increment;
        
        if (currentVolume >= targetVolume) {
            this.scWidget.setVolume(targetVolume);
            clearInterval(fadeInInterval);
        } else {
            this.scWidget.setVolume(Math.floor(currentVolume));
        }
    }, intervalTime);
}
```

#### Fade Out (30 seconds)
```javascript
fadeOutAudio() {
    let currentVolume = 17;
    const duration = 30000; // 30 seconds
    const steps = 60;
    const decrement = currentVolume / steps;
    const intervalTime = duration / steps;
    
    const fadeOutInterval = setInterval(() => {
        currentVolume -= decrement;
        
        if (currentVolume <= 0) {
            this.scWidget.setVolume(0);
            clearInterval(fadeOutInterval);
        } else {
            this.scWidget.setVolume(Math.floor(currentVolume));
        }
    }, intervalTime);
}
```

### Error Handling Best Practices

```javascript
// Comprehensive error handling
function initializeSoundCloud() {
    try {
        if (typeof SC !== 'undefined' && SC.Widget) {
            const scWidget = SC.Widget(soundcloudPlayer);
            
            // Set timeout for API readiness
            const readyTimeout = setTimeout(() => {
                console.warn('SoundCloud API not ready after 10 seconds');
            }, 10000);
            
            scWidget.bind(SC.Widget.Events.READY, () => {
                clearTimeout(readyTimeout);
                initializeAudioControls(scWidget);
            });
            
        } else {
            console.error('SoundCloud Widget API not available');
            initializeFallbackAudio();
        }
    } catch (error) {
        console.error('SoundCloud initialization error:', error);
        initializeFallbackAudio();
    }
}
```

### Performance Considerations

#### Efficient Event Binding
- Bind events only when necessary
- Use throttling for frequent events (PLAY_PROGRESS)
- Clean up event listeners on component destruction

#### Memory Management
```javascript
// Cleanup function
function cleanupSoundCloud() {
    if (scWidget) {
        // Unbind all events
        scWidget.unbind(SC.Widget.Events.READY);
        scWidget.unbind(SC.Widget.Events.PLAY);
        scWidget.unbind(SC.Widget.Events.PLAY_PROGRESS);
        
        // Clear intervals
        if (fadeInterval) {
            clearInterval(fadeInterval);
        }
    }
}
```

### Testing and Debugging

#### Console Logging
```javascript
// Enable detailed logging
const DEBUG_MODE = true;

function logAPICall(method, params) {
    if (DEBUG_MODE) {
        console.log(`SoundCloud API: ${method}`, params);
    }
}

// Usage
logAPICall('setVolume', { volume: 17 });
scWidget.setVolume(17);
```

#### Common Issues and Solutions

1. **API Not Loading**: Check network connectivity and SoundCloud service status
2. **Volume Not Changing**: Ensure track is loaded and playing
3. **Events Not Firing**: Verify proper event binding and API readiness
4. **Cross-Origin Issues**: Use HTTPS for production deployments

### Browser Compatibility
- Chrome 60+: Full support
- Firefox 55+: Full support  
- Safari 11+: Full support
- Edge 79+: Full support
- Mobile browsers: Touch interaction required for autoplay