// Jacqueline Worsley Ministries - Interactive Website Script

class CinematicWebsite {
    constructor() {
        this.currentSection = 0;
        this.totalSections = 0;
        this.sections = [];
        this.audio = null;
        this.isAudioPlaying = true; // Start with audio playing
        this.autoProgressTimer = null;
        this.isNarrating = false;
        this.currentUtterance = null;
        this.sectionNarrated = new Set(); // Track which sections have been narrated
        this.introMusicPlayed = false;
        this.isPaused = false; // Start playing automatically
        this.soundcloudPlayer = null;
        this.fadeInterval = null;
        this.narratorVoice = null; // Store consistent narrator voice
        this.soundcloudPlayer = null;
        this.scWidget = null;
        this.init();
    }

    init() {
        // Get all sections
        this.sections = document.querySelectorAll('.section');
        this.totalSections = this.sections.length;
        
        // Setup audio with original working method
        this.setupAudio();
        
        // Setup navigation
        this.setupNavigation();
        
        // Setup auto-progression for introduction
        this.setupAutoProgression();
        
        // Update progress bar
        this.updateProgressBar();
        
        // Start with a cinematic entrance (original method)
        this.playIntroductionSequence();
        
        // Initialize SoundCloud player
        this.initializeSoundCloudPlayer();
        
        console.log('Jacqueline Worsley Ministries website initialized with audio timeline');
    }
    
    setupAudio() {
        this.soundcloudPlayer = document.getElementById('soundcloud-player');
        
        // Initialize speech synthesis
        if ('speechSynthesis' in window) {
            speechSynthesis.getVoices();
            window.speechSynthesis.onvoiceschanged = () => {
                console.log('Speech synthesis voices loaded');
                // Reset narrator voice to ensure consistency
                this.narratorVoice = null;
                this.getNarratorVoice();
            };
        }
        
        // Initialize SoundCloud Widget API
        if (typeof SC !== 'undefined' && SC.Widget && this.soundcloudPlayer) {
            this.scWidget = SC.Widget(this.soundcloudPlayer);
            
            this.scWidget.bind(SC.Widget.Events.READY, () => {
                console.log('SoundCloud Widget API ready - enforcing 17% volume');
                this.scWidget.setVolume(17);
                this.scWidget.seekTo(0);
                this.scWidget.play();
                this.isAudioPlaying = true;
                console.log('SoundCloud auto-started');
            });
            
            this.scWidget.bind(SC.Widget.Events.PLAY, () => {
                this.scWidget.setVolume(17);
            });
        }
    }
    
    playIntroductionSequence() {
        // Start background music immediately
        this.startBackgroundMusic();
        
        // Start narration immediately - force it to work
        setTimeout(() => {
            console.log('Starting narrator voice automatically');
            this.forceStartNarration();
        }, 2000);
    }
    
    forceStartNarration() {
        // Force speech synthesis to be ready
        if ('speechSynthesis' in window) {
            // Cancel any existing speech
            speechSynthesis.cancel();
            
            // Wait for voices to be available
            const startNarration = () => {
                const voices = speechSynthesis.getVoices();
                if (voices.length > 0) {
                    this.displayWelcomeMessage();
                } else {
                    setTimeout(startNarration, 100);
                }
            };
            
            startNarration();
            
            // Also try on voices changed event
            speechSynthesis.onvoiceschanged = () => {
                if (!this.isNarrating) {
                    this.displayWelcomeMessage();
                }
            };
        }
    }
    
    startBackgroundMusic() {
        console.log('Starting SoundCloud background music');
        if (this.soundcloudPlayer && this.scWidget) {
            this.scWidget.play();
            this.scWidget.setVolume(17);
            this.isAudioPlaying = true;
        }
    }
    
    displayWelcomeMessage() {
        console.log('displayWelcomeMessage called - starting narrator voice');
        
        const messages = [
            "Welcome, dear friends, to Jacqueline Worsley Ministries. We're so blessed you're here with us today.",
            "Let's prepare our hearts for a wonderful journey through God's Word together.",
            "Here's a beautiful teaching for us today. The Parable of the Talents from Matthew chapter 25. It's truly inspiring.",
            "Come, let's discover what amazing gifts our loving God has given each one of us."
        ];
        
        let messageIndex = 0;
        
        const showMessage = () => {
            if (messageIndex < messages.length && this.currentSection === 0) {
                console.log('Showing message:', messageIndex + 1, 'of', messages.length);
                
                // Create and show visual message box
                const messageDisplay = document.createElement('div');
                messageDisplay.className = 'voice-message';
                messageDisplay.style.cssText = `
                    position: fixed;
                    top: 20px;
                    left: 50%;
                    transform: translateX(-50%);
                    background: linear-gradient(45deg, rgba(220, 20, 60, 0.9), rgba(139, 0, 0, 0.9));
                    color: #FFD700;
                    padding: 1.5rem 2.5rem;
                    border-radius: 20px;
                    font-size: 1.3rem;
                    font-weight: 600;
                    z-index: 2000;
                    border: 3px solid #FFD700;
                    box-shadow: 0 15px 40px rgba(0,0,0,0.6);
                    opacity: 0;
                    transition: all 0.5s ease;
                    text-align: center;
                    font-family: 'Playfair Display', serif;
                    text-shadow: 2px 2px 4px rgba(0,0,0,0.8);
                    max-width: 80vw;
                `;
                
                messageDisplay.textContent = messages[messageIndex];
                document.body.appendChild(messageDisplay);
                
                // Fade in the message
                setTimeout(() => {
                    messageDisplay.style.opacity = '1';
                }, 100);
                
                // Speak the message using consistent narrator voice
                console.log('Speaking message:', messages[messageIndex].substring(0, 30) + '...');
                
                const onMessageComplete = () => {
                    console.log('Message', messageIndex + 1, 'completed');
                    // Fade out message
                    messageDisplay.style.opacity = '0';
                    setTimeout(() => {
                        messageDisplay.remove();
                        messageIndex++;
                        if (messageIndex < messages.length) {
                            setTimeout(showMessage, 1000); // 1 second pause between messages
                        } else {
                            console.log('All welcome messages completed');
                            this.sectionNarrated.add('0-intro');
                        }
                    }, 500);
                };
                
                this.speakText(messages[messageIndex], onMessageComplete);
            }
        };
        
        // Start immediately
        showMessage();
    }
    
    speakText(text, onComplete = null) {
        console.log('speakText called with:', text.substring(0, 50) + '...');
        
        if ('speechSynthesis' in window) {
            // Cancel any existing speech
            speechSynthesis.cancel();
            
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.rate = 0.9;   // Natural conversational pace
            utterance.pitch = 1.1;  // Slight uplift for warmth
            utterance.volume = 1.0;  // Maximum volume
            
            // Get consistent narrator voice
            const voices = speechSynthesis.getVoices();
            console.log('Available voices:', voices.length);
            
            // Use the same voice selection logic as parable narration
            const narratorVoice = voices.find(voice => 
                (voice.name.toLowerCase().includes('samantha') ||
                voice.name.toLowerCase().includes('karen') ||
                voice.name.toLowerCase().includes('susan') ||
                voice.name.toLowerCase().includes('victoria') ||
                voice.name.toLowerCase().includes('female')) &&
                voice.lang.startsWith('en')
            ) || voices.find(voice => 
                voice.lang.startsWith('en') && voice.name.toLowerCase().includes('female')
            ) || voices.find(voice => voice.lang.startsWith('en')) || voices[0];
            
            if (narratorVoice) {
                utterance.voice = narratorVoice;
                console.log('Using narrator voice:', narratorVoice.name);
            } else {
                console.log('No narrator voice found, using default');
            }\n            \n            this.isNarrating = true;\n            this.currentUtterance = utterance;\n            \n            utterance.onstart = () => {\n                console.log('✅ Speech started successfully!');\n            };\n            \n            utterance.onend = () => {\n                this.isNarrating = false;\n                this.currentUtterance = null;\n                console.log('✅ Speech completed:', text.substring(0, 30) + '...');\n                if (onComplete) {\n                    setTimeout(onComplete, 1000); // Shorter pause\n                }\n            };\n            \n            utterance.onerror = (event) => {\n                this.isNarrating = false;\n                this.currentUtterance = null;\n                console.log('❌ Speech synthesis error:', event.error);\n                if (onComplete) {\n                    onComplete();\n                }\n            };\n            \n            // Start speaking\n            speechSynthesis.speak(utterance);\n            console.log('🎙️ Speech synthesis started');\n        } else {\n            console.log('❌ Speech synthesis not supported');\n            if (onComplete) {\n                onComplete();\n            }\n        }\n    }
    
    getNarratorVoice() {
        if (!this.narratorVoice) {
            const voices = speechSynthesis.getVoices();
            this.narratorVoice = voices.find(voice => 
                (voice.name.toLowerCase().includes('samantha') ||
                voice.name.toLowerCase().includes('karen') ||
                voice.name.toLowerCase().includes('susan') ||
                voice.name.toLowerCase().includes('victoria') ||
                voice.name.toLowerCase().includes('female')) &&
                voice.lang.startsWith('en')
            ) || voices.find(voice => 
                voice.lang.startsWith('en') && voice.name.toLowerCase().includes('female')
            ) || voices.find(voice => voice.lang.startsWith('en'));
            
            if (this.narratorVoice) {
                console.log('Narrator voice selected:', this.narratorVoice.name);
            }
        }
        return this.narratorVoice;
    }
    
    forceStartEverything() {
        // Force start audio immediately
        this.forceStartAudio();
        
        // Force start narration immediately
        this.forceStartNarration();
        
        // Keep trying every 100ms until both work
        this.keepTrying = setInterval(() => {
            if (!this.isAudioPlaying) {
                this.forceStartAudio();
            }
            if (!this.isNarrating) {
                this.forceStartNarration();
            }
            // Stop trying after both are working
            if (this.isAudioPlaying && this.isNarrating) {
                clearInterval(this.keepTrying);
            }
        }, 100);
        
        // Stop trying after 10 seconds max
        setTimeout(() => {
            if (this.keepTrying) {
                clearInterval(this.keepTrying);
            }
        }, 10000);
    }

    setupAudio() {
        this.soundcloudPlayer = document.getElementById('soundcloud-player');
        
        // Initialize speech synthesis
        if ('speechSynthesis' in window) {
            speechSynthesis.getVoices();
            window.speechSynthesis.onvoiceschanged = () => {
                console.log('Speech synthesis voices loaded');
                // Reset narrator voice to ensure consistency
                this.narratorVoice = null;
                this.getNarratorVoice();
            };
        }
        
        // Initialize new SoundCloud player reference with enhanced volume control
        this.soundcloudPlayer = document.getElementById('soundcloud-player');
        if (this.soundcloudPlayer) {
            console.log('SoundCloud player reference established');
            
            // Initialize SoundCloud Widget API with delayed setup
            // Force immediate SoundCloud initialization
            const initSoundCloud = () => {
                if (typeof SC !== 'undefined' && SC.Widget && this.soundcloudPlayer) {
                    this.scWidget = SC.Widget(this.soundcloudPlayer);
                    
                    this.scWidget.bind(SC.Widget.Events.READY, () => {
                        console.log('SoundCloud Widget ready - starting audio immediately');
                        this.scWidget.setVolume(17);
                        this.scWidget.seekTo(0);
                        this.scWidget.play();
                        this.isAudioPlaying = true;
                        console.log('SoundCloud audio started automatically');
                    });
                } else {
                    console.log('SoundCloud not ready, retrying in 100ms');
                    setTimeout(initSoundCloud, 100);
                }
            };
            initSoundCloud();
                } else {
                    console.log('SoundCloud Widget API not available, retrying...');
                    setTimeout(() => this.setupAudio(), 1000);
                }
            }, 500);
                
                // Volume control on play events
                this.scWidget.bind(SC.Widget.Events.PLAY, () => {
                    console.log('Audio playing via Widget API - maintaining 17% volume');
                    this.scWidget.setVolume(17);
                });
                
                // Progress tracking
                this.scWidget.bind(SC.Widget.Events.PLAY_PROGRESS, (data) => {
                    // Ensure volume stays at 17% during playback
                    if (data.currentPosition % 5000 < 100) { // Check every 5 seconds
                        this.scWidget.setVolume(17);
                    }
                });
                
                // Audio ends naturally - no auto-restart
                this.scWidget.bind(SC.Widget.Events.FINISH, () => {
                    console.log('Audio finished - maintaining 17% volume setting');
                });
                
                // Error handling
                this.scWidget.bind(SC.Widget.Events.ERROR, () => {
                    console.log('SoundCloud Widget API error - attempting recovery');
                });
            }
            
            // Apply immediate volume reduction
            this.applyVolumeReduction();
        }
    }
    
    applyVolumeReduction() {
        if (this.soundcloudPlayer) {
            console.log('SoundCloud player ready - using pure API volume controls');
            
            // Pure Widget API volume control at 17% - no CSS methods
            if (this.scWidget) {
                this.scWidget.setVolume(17);
                this.scWidget.getCurrentSound((sound) => {
                    if (sound) {
                        console.log('Current sound loaded - API enforcing 17% volume');
                        this.scWidget.setVolume(17);
                    }
                });
                console.log('Pure Widget API volume control set to 17%');
            }
        }
    }
    
    startFallbackAudio() {
        const fallbackAudio = document.getElementById('backgroundAudio');
        if (fallbackAudio) {
            fallbackAudio.play().then(() => {
                console.log('Fallback audio started');
                this.isAudioPlaying = true;
            }).catch(e => {
                console.log('Fallback audio failed:', e);
            });
        }
        
        // Initialize ambient audio system as minimal fallback
        if (window.AmbientAudio) {
            this.ambientAudio = new AmbientAudio();
        }
        
        // Setup audio control button
        const audioBtn = document.querySelector('.audio-btn');
        if (audioBtn) {
            audioBtn.addEventListener('click', () => {
                this.toggleBackgroundMusic();
            });
        }
    }
    
    toggleBackgroundMusic() {
        if (this.soundcloudPlayer && this.scWidget) {
            if (this.isAudioPlaying) {
                // Pause the audio using SoundCloud Widget API
                this.scWidget.pause();
                this.isAudioPlaying = false;
                document.querySelector('.audio-btn').textContent = '🔇';
            } else {
                // Resume the audio using SoundCloud Widget API
                this.scWidget.play();
                this.isAudioPlaying = true;
                document.querySelector('.audio-btn').textContent = '🔊';
            }
        }
    }
    
    fadeToSoftVolume() {
        // SoundCloud player handles its own volume
        console.log('SoundCloud music continues at optimal volume for narration');
    }
    
    adjustAudioVolume(level) {
        // Pure Widget API volume control only
        if (this.soundcloudPlayer && level >= 0 && level <= 1) {
            // Pure API method - no CSS or URL parameters
            if (this.scWidget) {
                const apiVolume = Math.floor(level * 100);
                this.scWidget.setVolume(apiVolume);
                console.log(`Audio volume adjusted to ${apiVolume}% using pure API control`);
            }
        }
    }
    
    initializeSoundCloudPlayer() {
        // Get SoundCloud player and ensure it plays from beginning at 17% volume
        this.soundcloudPlayer = document.getElementById('soundcloud-player');
        if (this.soundcloudPlayer) {
            console.log('Initializing SoundCloud player with 14% volume and Widget API controls');
            
            // Ensure volume=14 and seek=0 parameters
            let currentSrc = this.soundcloudPlayer.src;
            
            // Set volume to 14% if not already set
            if (!currentSrc.includes('volume=14')) {
                if (currentSrc.includes('volume=')) {
                    currentSrc = currentSrc.replace(/volume=\d+/, 'volume=14');
                } else {
                    currentSrc = currentSrc + '&volume=14';
                }
            }
            
            // Add seek=0 to start from beginning
            if (!currentSrc.includes('&seek=0')) {
                currentSrc = currentSrc + '&seek=0';
            }
            
            // Update iframe source with proper parameters
            this.soundcloudPlayer.src = currentSrc;
            
            this.startBackgroundMusic();
        } else {
            console.error('SoundCloud player not found');
        }
    }
    
    restartAudioFromBeginning() {
        if (this.soundcloudPlayer) {
            console.log('Restarting SoundCloud audio from beginning with pure API controls');
            
            // Get current src - no volume parameters, pure API control
            const currentSrc = this.soundcloudPlayer.src;
            let newSrc = currentSrc;
            
            // Remove any existing seek parameter and add seek=0
            if (newSrc.includes('&seek=')) {
                newSrc = newSrc.replace(/&seek=\d+/, '&seek=0');
            } else {
                newSrc = newSrc + '&seek=0';
            }
            
            // Reload iframe with seek parameter to start from beginning
            this.soundcloudPlayer.src = newSrc;
            
            // Ensure player is visible and playing with pure API volume control
            this.soundcloudPlayer.style.display = 'block';
            this.isAudioPlaying = true;
            
            // Use Widget API to seek to beginning and set 14% volume
            if (this.scWidget) {
                this.scWidget.seekTo(0);
                this.scWidget.setVolume(14);
                this.scWidget.play();
            }
            
            console.log('Audio restarted from beginning at 14% volume');
        }
    }
    
    fadeOutSoundCloudAudio() {
        if (this.soundcloudPlayer) {
            console.log('Starting SoundCloud audio fade-out using pure API controls');
            
            // Start from current 17% volume level - pure API fade
            let currentVolume = 17;
            
            const duration = 30000; // 30 seconds fade-out
            const steps = 60;
            const volumeDecrement = currentVolume / steps;
            const intervalTime = duration / steps; // ~500ms per step
            
            const fadeOutInterval = setInterval(() => {
                currentVolume -= volumeDecrement;
                
                if (currentVolume <= 0.1) {
                    // Complete fade-out using pure API
                    this.soundcloudPlayer.style.display = 'none';
                    this.isAudioPlaying = false;
                    clearInterval(fadeOutInterval);
                    
                    // Final API volume to 0
                    if (this.scWidget) {
                        this.scWidget.setVolume(0);
                    }
                    
                    console.log('SoundCloud audio fade-out complete using pure API - waiting 2 seconds before video fade to black');
                    // Wait 2 seconds after music stops before fading to black
                    setTimeout(() => {
                        this.fadeVideoToBlack();
                    }, 2000);
                } else {
                    // Use pure Widget API for smooth volume fade only
                    if (this.scWidget) {
                        const widgetVolume = Math.max(0, Math.floor(currentVolume));
                        this.scWidget.setVolume(widgetVolume);
                        console.log('Pure API fade-out volume:', widgetVolume);
                    }
                }
            }, intervalTime);
        }
    }
    
    fadeVideoToBlack() {
        console.log('Starting video fade to black after audio fade-out');
        
        // Create black overlay
        const blackOverlay = document.createElement('div');
        blackOverlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            background: #000000;
            z-index: 9998;
            opacity: 0;
            transition: opacity 3s ease-out;
            pointer-events: none;
        `;
        
        document.body.appendChild(blackOverlay);
        
        // Start fade to black
        setTimeout(() => {
            blackOverlay.style.opacity = '1';
        }, 100);
        
        // Complete fade after 3 seconds
        setTimeout(() => {
            console.log('Video fade to black complete');
        }, 3100);
    }
    
    forceStartAudio() {
        console.log('FORCING audio to start now!');
        
        // Method 1: HTML5 Audio (most reliable)
        const audio = document.getElementById('backgroundAudio');
        if (audio) {
            audio.muted = false;
            audio.volume = 0.3;
            audio.play().then(() => {
                this.isAudioPlaying = true;
                console.log('✅ HTML5 Audio started successfully!');
            }).catch(() => {
                console.log('HTML5 audio failed, trying other methods');
            });
        }
        
        // Method 2: SoundCloud as backup
        this.tryStartSoundCloud();
        
        // Method 3: Web Audio API as last resort
        this.tryWebAudio();
    }
    
    tryStartSoundCloud() {
        const player = document.getElementById('soundcloud-player');
        if (player) {
            player.src = player.src; // Reload iframe
            console.log('SoundCloud iframe reloaded');
        }
    }
    
    tryWebAudio() {
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.frequency.setValueAtTime(220, audioContext.currentTime);
            gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
            
            oscillator.start();
            oscillator.stop(audioContext.currentTime + 0.1);
            
            console.log('✅ Web Audio API backup started');
        } catch (e) {
            console.log('Web Audio API failed:', e);
        }
    }
            if (this.ambientAudio) {
                this.ambientAudio.play();
            }
        }
    }
    
    fadeInAudio() {
        if (this.soundcloudPlayer) {
            console.log('Audio ready - using Widget API controls only');
            // Ensure player is visible
            this.soundcloudPlayer.style.display = 'block';
            console.log('SoundCloud audio active with Widget API controls');
        }
    }
    
    fadeOutAudio() {
        if (this.soundcloudPlayer) {
            console.log('Starting audio fade-out from 17% volume');
            let currentOpacity = 0.17; // Start from current 17% volume
            const duration = 30000; // 30 seconds fade-out
            const steps = 60;
            const decrement = currentOpacity / steps;
            const intervalTime = duration / steps;
            
            const fadeOutInterval = setInterval(() => {
                currentOpacity -= decrement;
                
                if (currentOpacity <= 0.001) {
                    this.soundcloudPlayer.style.filter = 'opacity(0)';
                    this.soundcloudPlayer.style.display = 'none';
                    clearInterval(fadeOutInterval);
                    this.isAudioPlaying = false;
                    console.log('SoundCloud audio completely faded out - waiting 2 seconds before video fade to black');
                    // Wait 2 seconds after music stops before fading to black
                    setTimeout(() => {
                        this.fadeVideoToBlack();
                    }, 2000);
                } else {
                    this.soundcloudPlayer.style.filter = `opacity(${currentOpacity}) brightness(${currentOpacity + 0.25})`;
                }
            }, intervalTime);
        }
    }
    
    fadeVideoToBlack() {
        console.log('Starting video fade to black after SoundCloud audio completely fades out');
        
        // Create black overlay for fade to black effect
        const blackOverlay = document.createElement('div');
        blackOverlay.className = 'video-fade-to-black';
        document.body.appendChild(blackOverlay);
        
        // Start fade to black after a brief delay
        setTimeout(() => {
            blackOverlay.classList.add('active');
            console.log('Video fading to black...');
        }, 500);
        
        // Complete fade to black after 4 seconds
        setTimeout(() => {
            console.log('Video completely faded to black');
            // Optional: Add end screen or restart functionality after black screen
            this.showEndScreenAfterBlack();
        }, 4500);
    }
    
    showEndScreenAfterBlack() {
        // Create a simple end screen that appears after black fade
        const endScreen = document.createElement('div');
        endScreen.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            background: linear-gradient(135deg, #8B4513 0%, #DAA520 100%);
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            color: #F5F5DC;
            font-family: 'Georgia', serif;
            z-index: 10000;
            opacity: 0;
            transition: opacity 3s ease-in;
        `;
        
        endScreen.innerHTML = `
            <h1 style="font-size: 3rem; margin-bottom: 1rem; text-align: center;">Thank You</h1>
            <p style="font-size: 1.5rem; text-align: center; max-width: 600px; line-height: 1.6;">May God's blessings be with you as you continue your faithful journey in following Christ.</p>
            <button onclick="location.reload()" style="margin-top: 2rem; padding: 1rem 2rem; font-size: 1.2rem; background: #DAA520; color: #8B4513; border: none; border-radius: 5px; cursor: pointer; box-shadow: 0 4px 8px rgba(0,0,0,0.3);">Experience Again</button>
        `;
        
        document.body.appendChild(endScreen);
        
        // Fade in end screen after black screen
        setTimeout(() => {
            endScreen.style.opacity = '1';
            console.log('End screen displayed after black fade');
        }, 1000);
    }
    
    // Audio continues throughout - no stopping or resuming needed
    
    startAudioPlayback() {
        // Try HTML5 audio first
        if (this.audio) {
            this.audio.volume = 0.5;
            this.audio.play().then(() => {
                this.isAudioPlaying = true;
                document.querySelector('.audio-btn').textContent = '🔊';
                console.log('HTML5 audio playing');
            }).catch(() => {
                // Fallback to Web Audio API
                this.startAmbientAudio();
            });
        } else {
            this.startAmbientAudio();
        }
    }
    
    startAmbientAudio() {
        if (this.ambientAudio) {
            this.ambientAudio.initialize().then(success => {
                if (success) {
                    this.ambientAudio.play();
                    this.isAudioPlaying = true;
                    document.querySelector('.audio-btn').textContent = '🔊';
                    console.log('Ambient audio playing');
                } else {
                    console.log('Audio not available');
                }
            });
        }
    }

    createAudioVisualization() {
        // Create visual audio representation since we can't directly use YouTube
        const audioVisualizer = document.createElement('div');
        audioVisualizer.className = 'audio-visualizer';
        audioVisualizer.innerHTML = `
            <div class="visualizer-bars">
                ${Array(20).fill(0).map(() => '<div class="bar"></div>').join('')}
            </div>
        `;
        
        // Add visualizer styles
        const style = document.createElement('style');
        style.textContent = `
            .audio-visualizer {
                position: fixed;
                bottom: 100px;
                left: 30px;
                z-index: 999;
            }
            .visualizer-bars {
                display: flex;
                gap: 3px;
                align-items: end;
                height: 40px;
            }
            .bar {
                width: 3px;
                background: linear-gradient(to top, var(--crimson), var(--gold));
                border-radius: 2px;
                animation: audioBar 0.8s ease-in-out infinite;
            }
            .bar:nth-child(odd) { animation-delay: 0.1s; }
            .bar:nth-child(even) { animation-delay: 0.3s; }
            @keyframes audioBar {
                0%, 100% { height: 5px; }
                50% { height: 35px; }
            }
        `;
        document.head.appendChild(style);
        document.body.appendChild(audioVisualizer);
    }

    playAudio() {
        if (this.ambientAudio && !this.isAudioPlaying) {
            this.ambientAudio.play();
            this.isAudioPlaying = true;
            document.querySelector('.audio-btn').textContent = '🔊';
            console.log('Ambient background music playing');
        } else if (this.audio) {
            this.audio.muted = false;
            this.audio.play().then(() => {
                this.isAudioPlaying = true;
                document.querySelector('.audio-btn').textContent = '🔊';
                console.log('HTML5 audio playing');
            }).catch(e => {
                console.log('Audio play failed:', e);
                this.createFallbackAudio();
            });
        }
    }
    
    createFallbackAudio() {
        // Use ambient audio as fallback
        if (!this.ambientAudio && window.AmbientAudio) {
            this.ambientAudio = new AmbientAudio();
            this.ambientAudio.initialize().then(success => {
                if (success) {
                    this.ambientAudio.play();
                    this.isAudioPlaying = true;
                    console.log('Fallback ambient audio started');
                } else {
                    this.createAudioVisualization();
                }
            });
        } else {
            this.createAudioVisualization();
        }
    }

    toggleAudio() {
        if (this.isAudioPlaying) {
            // Stop/mute all audio sources
            if (this.soundcloudPlayer) {
                this.soundcloudPlayer.style.opacity = '0';
                this.soundcloudPlayer.style.pointerEvents = 'none';
            }
            if (this.backgroundMusic) {
                this.backgroundMusic.pause();
            }
            if (this.simpleAudio) {
                this.simpleAudio.oscillator1.stop();
                this.simpleAudio.oscillator2.stop();
                this.simpleAudio = null;
            }
            if (this.ambientAudio) {
                this.ambientAudio.stop();
            }
            if (this.audio) {
                this.audio.pause();
            }
            // Stop speech synthesis
            if ('speechSynthesis' in window) {
                speechSynthesis.cancel();
            }
            this.isAudioPlaying = false;
            document.querySelector('.audio-btn').textContent = '🔇';
            console.log('All audio stopped');
        } else {
            // Start/unmute audio at soft level only
            this.startBackgroundMusic();
            this.isAudioPlaying = true;
            document.querySelector('.audio-btn').textContent = '🔈'; // Soft audio icon only
            console.log('Soft audio started - no loud control allowed');
        }
    }

    setupNavigation() {
        const prevBtn = document.querySelector('.prev-btn');
        const nextBtn = document.querySelector('.next-btn');
        
        prevBtn.addEventListener('click', () => this.previousSection());
        nextBtn.addEventListener('click', () => this.nextSection());
        
        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') this.previousSection();
            if (e.key === 'ArrowRight') this.nextSection();
            if (e.key === ' ') {
                e.preventDefault();
                this.nextSection();
            }
        });

        // Audio control
        document.querySelector('.audio-btn').addEventListener('click', () => this.toggleAudio());
        
        this.updateNavigationButtons();
    }

    setupAutoProgression() {
        // Auto-progression now handled by narration completion
        // No automatic timing, everything waits for speech to complete
        console.log('Auto-progression will be controlled by narration completion');
    }

    playIntroductionSequence() {
        // This is now handled by forceStartEverything
        console.log('Introduction sequence handled by forced start');
    }
    
    showMusicIntro() {
        // No message shown - music plays automatically in background
        console.log('Starting smooth jazz background music...');
    }
    
    forceStartAudio() {
        // Try multiple methods to ensure audio starts
        if (window.createSimpleAudio && !this.isAudioPlaying) {
            this.simpleAudio = createSimpleAudio();
            if (this.simpleAudio) {
                this.isAudioPlaying = true;
                document.querySelector('.audio-btn').textContent = '🔊';
                console.log('Simple audio started successfully');
                return;
            }
        }
        
        // Fallback to other methods
        this.startAudioPlayback();
    }

    forceStartNarration() {
        console.log('FORCING narration to start now!');
        
        // Force speech synthesis to be ready
        speechSynthesis.cancel();
        
        const startNarration = () => {
            const message = "Welcome, dear friends, to Jacqueline Worsley Ministries. We're so blessed you're here with us today.";
            
            const utterance = new SpeechSynthesisUtterance(message);
            utterance.rate = 0.9;
            utterance.pitch = 1.1;
            utterance.volume = 1.0;
            
            // Get any available voice
            const voices = speechSynthesis.getVoices();
            if (voices.length > 0) {
                utterance.voice = voices.find(v => v.lang.startsWith('en')) || voices[0];
            }
            
            utterance.onstart = () => {
                this.isNarrating = true;
                console.log('✅ Narration started successfully!');
            };
            
            utterance.onend = () => {
                this.isNarrating = false;
                // Continue with next message
                this.continueNarration();
            };
            
            speechSynthesis.speak(utterance);
        };
        
        // Try immediately
        startNarration();
        
        // Also try when voices change
        speechSynthesis.onvoiceschanged = startNarration;
    }
    
    continueNarration() {
        const messages = [
            "Let's prepare our hearts for a wonderful journey through God's Word together.",
            "Here's a beautiful teaching for us today. The Parable of the Talents from Matthew chapter 25. It's truly inspiring.",
            "Come, let's discover what amazing gifts our loving God has given each one of us."
        ];
        
        let messageIndex = 0;
        
        const speakNext = () => {
            if (messageIndex < messages.length) {
                const utterance = new SpeechSynthesisUtterance(messages[messageIndex]);
                utterance.rate = 0.9;
                utterance.pitch = 1.1;
                utterance.volume = 1.0;
                
                const voices = speechSynthesis.getVoices();
                if (voices.length > 0) {
                    utterance.voice = voices.find(v => v.lang.startsWith('en')) || voices[0];
                }
                
                utterance.onend = () => {
                    messageIndex++;
                    setTimeout(speakNext, 1000);
                };
                
                speechSynthesis.speak(utterance);
            }
        };
        
        setTimeout(speakNext, 1500);
    }
    
    displayWelcomeMessage() {
        // This is now handled by forceStartNarration
        console.log('Welcome message display handled by forced narration');
        
        // Natural, warm voice introduction with actual narration
        const messages = [
            "Welcome, dear friends, to Jacqueline Worsley Ministries. We're so blessed you're here with us today.",
            "Let's prepare our hearts for a wonderful journey through God's Word together.",
            "Here's a beautiful teaching for us today. The Parable of the Talents from Matthew chapter 25. It's truly inspiring.",
            "Come, let's discover what amazing gifts our loving God has given each one of us."
        ];
        
        let messageIndex = 0;
        const messageDisplay = document.createElement('div');
        messageDisplay.className = 'voice-message';
        messageDisplay.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: linear-gradient(45deg, rgba(220, 20, 60, 0.9), rgba(139, 0, 0, 0.9));
            color: var(--gold);
            padding: 1.5rem 2.5rem;
            border-radius: 20px;
            font-size: 1.3rem;
            font-weight: 600;
            z-index: 2000;
            border: 3px solid var(--gold);
            box-shadow: 0 15px 40px rgba(0,0,0,0.6);
            opacity: 0;
            transition: all 0.5s ease;
            text-align: center;
            font-family: 'Playfair Display', serif;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.8);
        `;
        
        document.body.appendChild(messageDisplay);
        
        const showMessage = () => {
            if (messageIndex < messages.length && this.currentSection === 0) {
                messageDisplay.textContent = messages[messageIndex];
                messageDisplay.style.opacity = '1';
                
                // Add text-to-speech narration with callback
                const onMessageComplete = () => {
                    messageDisplay.style.opacity = '0';
                    setTimeout(() => {
                        messageIndex++;
                        if (messageIndex < messages.length) {
                            showMessage();
                        } else {
                            messageDisplay.remove();
                            // All intro messages complete, enable auto-advance
                            this.sectionNarrated.add('0-intro');
                        }
                    }, 500);
                };
                
                this.speakText(messages[messageIndex], onMessageComplete);
            }
        };
        
        // Start immediately without waiting
        showMessage();
    }
    
    getNarratorVoice() {
        if (!this.narratorVoice) {
            const voices = speechSynthesis.getVoices();
            this.narratorVoice = voices.find(voice => 
                (voice.name.toLowerCase().includes('samantha') ||
                voice.name.toLowerCase().includes('karen') ||
                voice.name.toLowerCase().includes('susan') ||
                voice.name.toLowerCase().includes('victoria') ||
                voice.name.toLowerCase().includes('female')) &&
                voice.lang.startsWith('en')
            ) || voices.find(voice => 
                voice.lang.startsWith('en') && voice.name.toLowerCase().includes('female')
            ) || voices.find(voice => voice.lang.startsWith('en'));
            
            if (this.narratorVoice) {
                console.log('Narrator voice selected:', this.narratorVoice.name);
            }
        }
        return this.narratorVoice;
    }

    speakText(text, onComplete = null) {
        // Text-to-speech narration with natural joyful settings
        if ('speechSynthesis' in window) {
            // Cancel any existing speech
            speechSynthesis.cancel();
            
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.rate = 0.9;   // Natural conversational pace
            utterance.pitch = 1.1;  // Slight uplift for warmth while staying natural
            utterance.volume = 1.0;  // Maximum volume with natural delivery
            
            // Use consistent narrator voice for ALL narration
            const narratorVoice = this.getNarratorVoice();
            if (narratorVoice) {
                utterance.voice = narratorVoice;
            }
            
            this.isNarrating = true;
            this.currentUtterance = utterance;
            
            utterance.onend = () => {
                this.isNarrating = false;
                this.currentUtterance = null;
                console.log('Natural narration completed:', text.substring(0, 50) + '...');
                if (onComplete) {
                    setTimeout(onComplete, 1200); // Natural pause after speaking
                }
            };
            
            utterance.onerror = () => {
                this.isNarrating = false;
                this.currentUtterance = null;
                console.log('Narration error');
                if (onComplete) {
                    setTimeout(onComplete, 1000);
                }
            };
            
            speechSynthesis.speak(utterance);
            console.log('Naturally narrating:', text.substring(0, 100) + '...');
        } else {
            // Fallback if speech synthesis not available
            console.log('Speech synthesis not available, using timer');
            if (onComplete) {
                setTimeout(onComplete, text.length * 70); // Natural reading pace
            }
        }
    }

    nextSection() {
        if (this.currentSection < this.totalSections - 1) {
            this.clearAutoProgressTimer();
            this.transitionToSection(this.currentSection + 1);
        }
    }

    previousSection() {
        if (this.currentSection > 0) {
            this.clearAutoProgressTimer();
            this.transitionToSection(this.currentSection - 1);
        }
    }

    transitionToSection(sectionIndex) {
        console.log(`Transitioning from section ${this.currentSection} to section ${sectionIndex}`);
        
        // Audio continues at 17% volume throughout - no restart on Begin Journey
        console.log('Audio continues at 17% volume throughout video');
        
        // Remove active class from current section
        this.sections[this.currentSection].classList.remove('active');
        this.sections[this.currentSection].classList.add('prev');
        
        // Add active class to new section
        setTimeout(() => {
            this.sections[this.currentSection].classList.remove('prev');
            this.currentSection = sectionIndex;
            this.sections[this.currentSection].classList.add('active');
            
            // Continue audio at final section and then fade-out
            if (sectionIndex === this.totalSections - 1) {
                console.log('Final section reached - audio will fade out at end');
                if (this.soundcloudPlayer) {
                    // Audio continues playing, then fades out after 2 minutes
                    setTimeout(() => {
                        console.log('Starting SoundCloud fade-out at end of video');
                        this.fadeOutSoundCloudAudio();
                    }, 120000); // 2 minutes
                }
            }
            
            // Update UI
            this.updateProgressBar();
            this.updateNavigationButtons();
            
            // Handle special section behaviors
            this.handleSectionSpecialEffects(sectionIndex);
            
        }, 100);
    }

    handleSectionSpecialEffects(sectionIndex) {
        const sectionIds = ['intro', 'parable-intro', 'scene1', 'scene2', 'scene3', 'scene4', 'scene5', 'message', 'closing', 'thanksgiving'];
        const currentSectionId = sectionIds[sectionIndex];
        
        // Audio continues softly throughout all sections
        console.log('Section', currentSectionId, '- audio continues softly in background');
        
        // Scene narrations - natural, warm delivery
        const sceneNarrations = {
            'parable-intro': "Here's a beautiful teaching for us today. The Parable of the Talents from Matthew chapter 25, verses 14 through 30.",
            'scene1': "Listen to this wonderful story. A man going on a journey called his servants and entrusted his property to them. To one he gave five talents, to another two, to another one, each according to their ability.",
            'scene2': "The faithful servants went at once and traded with their talents, doubling what they had been given. They were such good stewards.",
            'scene3': "But the fearful servant went and dug in the ground and hid his master's money. Such a missed opportunity.",
            'scene4': "When the master returned, he said to the faithful servants: Well done, good and faithful servant! Enter into the joy of your master! What beautiful words of praise.",
            'scene5': "But to the unfaithful servant he said: You wicked and slothful servant! Cast him into outer darkness. What a sad ending for him.",
            'closing': "What a blessing this has been. Please join us next time as we take another journey through God's wonderful Word. Joyfully Living Following God.",
            'thanksgiving': "Happy Thanksgiving everyone, from all of us at Jacqueline Worsley Ministries. Remember, thanksgiving is a lifestyle, not just a one day celebration."
        };
        
        // Only narrate if this section hasn't been narrated yet
        const sectionKey = `${sectionIndex}-${currentSectionId}`;
        if (sceneNarrations[currentSectionId] && !this.sectionNarrated.has(sectionKey)) {
            this.sectionNarrated.add(sectionKey);
            
            setTimeout(() => {
                const onComplete = () => {
                    // Auto-advance for ALL slides after narration is complete
                    if (['parable-intro', 'scene1', 'scene2', 'scene3', 'scene4', 'scene5', 'message', 'closing', 'thanksgiving'].includes(currentSectionId)) {
                        if (currentSectionId === 'thanksgiving') {
                            // For thanksgiving, speak GOD FIRST after main narration
                            setTimeout(() => {
                                this.speakGodFirst();
                            }, 1500);
                        } else {
                            this.autoProgressTimer = setTimeout(() => {
                                if (this.currentSection < this.totalSections - 1) {
                                    this.nextSection();
                                }
                            }, 2500); // 2.5 seconds after narration ends for natural flow
                        }
                    }
                };
                
                this.speakText(sceneNarrations[currentSectionId], onComplete);
            }, 500);
        }
        
        switch(currentSectionId) {
            case 'parable-intro':
                this.animateParableTitle();
                break;
            case 'scene1':
            case 'scene2':
            case 'scene3':
            case 'scene4':
            case 'scene5':
                this.animateParableScene(currentSectionId);
                break;
            case 'message':
                this.displayMessageTakeaway();
                break;
            case 'thanksgiving':
                this.handleThanksgivingSection();
                break;
        }
    }

    animateParableTitle() {
        const title = document.querySelector('.parable-title');
        if (title) {
            title.style.animation = 'none';
            setTimeout(() => {
                title.style.animation = 'zoomIn 2s ease-out, finalGlow 3s ease-in-out 2s infinite';
            }, 100);
        }
    }

    animateParableScene(sceneId) {
        const scene = document.getElementById(sceneId);
        if (!scene) return;
        
        // Animate characters in sequence
        const characters = scene.querySelectorAll('.character-silhouette');
        characters.forEach((char, index) => {
            setTimeout(() => {
                char.style.animation = 'fadeInUp 1s ease-out, characterBreathe 3s ease-in-out 1s infinite';
            }, index * 500);
        });
        
        // Animate special elements
        const specialElements = scene.querySelectorAll('.multiplication-effect, .buried-talent, .reward-text');
        specialElements.forEach((element, index) => {
            setTimeout(() => {
                element.style.animation = 'fadeInUp 1s ease-out';
            }, 1000 + (index * 300));
        });
    }

    displayMessageTakeaway() {
        // Add actual narration for the message - only once
        const sectionKey = `${this.currentSection}-message`;
        if (!this.sectionNarrated.has(sectionKey)) {
            this.sectionNarrated.add(sectionKey);
            
            const keyMessage = "Seek to please, obey, and trust God with all He has invested in you, or lose everything including all God invested in you and yourself. A talent was worth twenty years wages for a laborer. Jesus, imagine that! The risk is too, too high. The risk of total loss ain't worth it.";
            
            // Speak the message with completion callback for auto-advance
            setTimeout(() => {
                const onComplete = () => {
                    // Auto-advance after message narration
                    this.autoProgressTimer = setTimeout(() => {
                        if (this.currentSection < this.totalSections - 1) {
                            this.nextSection();
                        }
                    }, 2500);
                    console.log('Message takeaway narration complete, auto-advancing');
                };
                this.speakText(keyMessage, onComplete);
            }, 1000);
            
            // Visual indicator
            this.simulateVoiceReading(keyMessage);
        }
    }

    simulateVoiceReading(text) {
        // Create a visual indicator that "voice" is speaking
        const voiceIndicator = document.createElement('div');
        voiceIndicator.className = 'voice-indicator';
        voiceIndicator.innerHTML = '🎤 Speaking...';
        voiceIndicator.style.cssText = `
            position: fixed;
            top: 50px;
            right: 50px;
            background: var(--gold);
            color: var(--dark-crimson);
            padding: 0.5rem 1rem;
            border-radius: 20px;
            font-weight: bold;
            z-index: 2000;
            animation: pulse 1s ease-in-out infinite;
        `;
        
        document.body.appendChild(voiceIndicator);
        
        // Remove after "speaking" duration
        const speakingDuration = Math.max(text.length * 100, 5000); // Minimum 5 seconds
        setTimeout(() => {
            voiceIndicator.remove();
        }, speakingDuration);
    }

    speakGodFirst() {
        const godFirstText = "GOD FIRST!";
        
        const onGodFirstComplete = () => {
            console.log('GOD FIRST narration completed, music will continue for 4 more seconds');
            // Wait exactly 4 seconds after "GOD FIRST" narration, then fade audio
            setTimeout(() => {
                this.fadeOutAudio();
                console.log('Fading out music 4 seconds after GOD FIRST');
                
                // Final completion - website journey ends here
                setTimeout(() => {
                    console.log('Website presentation complete!');
                    this.showCompletionMessage();
                }, 2000);
            }, 4000);
        };
        
        this.speakText(godFirstText, onGodFirstComplete);
    }
    
    showCompletionMessage() {
        const completionMsg = document.createElement('div');
        completionMsg.innerHTML = '✨ Thank you for joining us! God bless you! ✨';
        completionMsg.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: linear-gradient(45deg, var(--gold), var(--crimson));
            color: white;
            padding: 2rem;
            border-radius: 20px;
            font-size: 1.5rem;
            font-weight: bold;
            z-index: 3000;
            text-align: center;
            font-family: 'Cinzel', serif;
        `;
        document.body.appendChild(completionMsg);
    }

    handleThanksgivingSection() {
        // Add final celebration effects
        this.addCelebrationEffects();
    }

    addCelebrationEffects() {
        // Create golden particle effects for the ending
        const particleContainer = document.createElement('div');
        particleContainer.className = 'celebration-particles';
        particleContainer.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 1500;
        `;
        
        // Create multiple particles
        for (let i = 0; i < 30; i++) {
            const particle = document.createElement('div');
            particle.style.cssText = `
                position: absolute;
                width: 6px;
                height: 6px;
                background: var(--gold);
                border-radius: 50%;
                top: ${Math.random() * 100}%;
                left: ${Math.random() * 100}%;
                animation: celebrationFloat ${3 + Math.random() * 4}s ease-in-out infinite;
                animation-delay: ${Math.random() * 2}s;
            `;
            particleContainer.appendChild(particle);
        }
        
        document.body.appendChild(particleContainer);
        
        // Add celebration animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes celebrationFloat {
                0%, 100% {
                    transform: translateY(0) rotate(0deg);
                    opacity: 0;
                }
                50% {
                    transform: translateY(-200px) rotate(360deg);
                    opacity: 1;
                }
            }
        `;
        document.head.appendChild(style);
        
        // Remove particles after animation
        setTimeout(() => {
            particleContainer.remove();
        }, 10000);
    }

    fadeOutAudio() {
        console.log('Fading out "We Belong Together (Instrumental)" after "GOD FIRST" message');
        
        // Fade out new SoundCloud player
        if (this.soundcloudPlayer) {
            setTimeout(() => {
                this.soundcloudPlayer.style.opacity = '0';
                this.soundcloudPlayer.style.pointerEvents = 'none';
                this.isAudioPlaying = false;
                console.log('SoundCloud "We Belong Together (Instrumental)" faded out after "GOD FIRST" message');
            }, 1000);
        }
        
        // Fade out any remaining audio sources
        if (this.ambientAudio) {
            this.ambientAudio.fadeOut();
            console.log('Ambient audio fading out after "GOD FIRST" message');
        }
    }

    updateProgressBar() {
        const progressBar = document.querySelector('.progress-bar');
        if (progressBar) {
            const progress = ((this.currentSection + 1) / this.totalSections) * 100;
            progressBar.style.width = `${progress}%`;
        }
    }

    updateNavigationButtons() {
        const prevBtn = document.querySelector('.prev-btn');
        const nextBtn = document.querySelector('.next-btn');
        
        if (prevBtn) {
            prevBtn.disabled = this.currentSection === 0;
        }
        
        if (nextBtn) {
            nextBtn.disabled = this.currentSection === this.totalSections - 1;
            if (this.currentSection === this.totalSections - 1) {
                nextBtn.textContent = '🏁';
                nextBtn.title = 'Journey Complete';
            } else {
                nextBtn.textContent = '›';
                nextBtn.title = 'Next Section';
            }
        }
    }

    clearAutoProgressTimer() {
        if (this.autoProgressTimer) {
            clearTimeout(this.autoProgressTimer);
            this.autoProgressTimer = null;
        }
    }
}

// Global functions for button clicks
function enableAudio() {
    if (window.cinematicWebsite) {
        window.cinematicWebsite.startBackgroundMusic();
    }
}

function startJourney() {
    if (window.cinematicWebsite) {
        window.cinematicWebsite.nextSection();
    }
}

function nextSection() {
    if (window.cinematicWebsite) {
        window.cinematicWebsite.nextSection();
    }
}

function previousSection() {
    if (window.cinematicWebsite) {
        window.cinematicWebsite.previousSection();
    }
}

function toggleAudio() {
    if (window.cinematicWebsite) {
        window.cinematicWebsite.toggleAudio();
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.cinematicWebsite = new CinematicWebsite();
});

// Handle window resize
window.addEventListener('resize', () => {
    // Adjust any responsive elements if needed
    console.log('Window resized - adjusting layout');
});

// Handle visibility change (pause audio when tab is not visible)
document.addEventListener('visibilitychange', () => {
    if (window.cinematicWebsite && window.cinematicWebsite.audio) {
        if (document.hidden && window.cinematicWebsite.isAudioPlaying) {
            window.cinematicWebsite.audio.pause();
        } else if (!document.hidden && window.cinematicWebsite.isAudioPlaying) {
            window.cinematicWebsite.playAudio();
        }
    }
});

// Add touch support for mobile
let touchStartX = 0;
let touchEndX = 0;

document.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
});

document.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    const threshold = 50; // Minimum swipe distance
    
    if (Math.abs(touchStartX - touchEndX) > threshold) {
        if (touchStartX > touchEndX + threshold) {
            // Swipe left - next section
            nextSection();
        } else if (touchStartX < touchEndX - threshold) {
            // Swipe right - previous section
            previousSection();
        }
    }
});

console.log('Jacqueline Worsley Ministries - Joyfully Living Following God - Website Script Loaded');