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
        console.log('Starting introduction sequence');
        
        // Start background music immediately
        this.startBackgroundMusic();
        
        // Start introductory narrator voice after 2 seconds
        setTimeout(() => {
            this.startIntroductoryNarration();
        }, 2000);
    }
    
    startIntroductoryNarration() {
        console.log('Starting introductory narration');
        
        const messages = [
            "Welcome, dear friends, to Jacqueline Worsley Ministries. We're so blessed you're here with us today.",
            "Let's prepare our hearts for a wonderful journey through God's Word together.",
            "Here's a beautiful teaching for us today. The Parable of the Talents from Matthew chapter 25. It's truly inspiring.",
            "Come, let's discover what amazing gifts our loving God has given each one of us."
        ];
        
        let messageIndex = 0;
        
        const playNextMessage = () => {
            if (messageIndex < messages.length) {
                const message = messages[messageIndex];
                
                // Create visual message box
                const messageBox = document.createElement('div');
                messageBox.style.cssText = `
                    position: fixed;
                    top: 20px;
                    left: 50%;
                    transform: translateX(-50%);
                    background: linear-gradient(45deg, rgba(220, 20, 60, 0.9), rgba(139, 0, 0, 0.9));
                    color: #FFD700;
                    padding: 20px 30px;
                    border-radius: 20px;
                    font-size: 1.3rem;
                    font-weight: 600;
                    z-index: 3000;
                    border: 3px solid #FFD700;
                    box-shadow: 0 15px 40px rgba(0,0,0,0.6);
                    text-align: center;
                    font-family: 'Playfair Display', serif;
                    text-shadow: 2px 2px 4px rgba(0,0,0,0.8);
                    max-width: 80vw;
                    opacity: 0;
                    transition: opacity 0.5s ease;
                `;
                
                messageBox.textContent = message;
                document.body.appendChild(messageBox);
                
                // Show message box
                setTimeout(() => {
                    messageBox.style.opacity = '1';
                }, 100);
                
                const onMessageComplete = () => {
                    // Fade out message box
                    messageBox.style.opacity = '0';
                    setTimeout(() => {
                        messageBox.remove();
                        messageIndex++;
                        if (messageIndex < messages.length) {
                            setTimeout(playNextMessage, 1000);
                        } else {
                            console.log('Introductory narration completed');
                            this.sectionNarrated.add('0-intro');
                        }
                    }, 500);
                };
                
                this.speakText(message, onMessageComplete);
            }
        };
        
        playNextMessage();
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
            const narratorVoice = this.getNarratorVoice();
            if (narratorVoice) {
                utterance.voice = narratorVoice;
                console.log('Using narrator voice:', narratorVoice.name);
            } else {
                console.log('No narrator voice found, using default');
            }
            
            this.isNarrating = true;
            this.currentUtterance = utterance;
            
            utterance.onstart = () => {
                console.log('Speech started successfully!');
            };
            
            utterance.onend = () => {
                this.isNarrating = false;
                this.currentUtterance = null;
                console.log('Speech completed:', text.substring(0, 30) + '...');
                if (onComplete) {
                    setTimeout(onComplete, 1000); // Shorter pause
                }
            };
            
            utterance.onerror = (event) => {
                this.isNarrating = false;
                this.currentUtterance = null;
                console.log('Speech synthesis error:', event.error);
                if (onComplete) {
                    onComplete();
                }
            };
            
            // Start speaking
            speechSynthesis.speak(utterance);
            console.log('Speech synthesis started');
        } else {
            console.log('Speech synthesis not supported');
            if (onComplete) {
                onComplete();
            }
        }
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

    startBackgroundMusic() {
        console.log('Background music started via SoundCloud');
        // Music is handled by SoundCloud widget
    }

    initializeSoundCloudPlayer() {
        // Already handled in setupAudio()
        console.log('SoundCloud player initialization handled in setupAudio');
    }

    setupNavigation() {
        // Navigation buttons
        const prevBtn = document.getElementById('prevBtn');
        const nextBtn = document.getElementById('nextBtn');
        const playPauseBtn = document.getElementById('playPauseBtn');

        if (prevBtn) {
            prevBtn.addEventListener('click', () => this.previousSection());
        }
        if (nextBtn) {
            nextBtn.addEventListener('click', () => this.nextSection());
        }
        if (playPauseBtn) {
            playPauseBtn.addEventListener('click', () => this.togglePlayPause());
        }

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') this.previousSection();
            if (e.key === 'ArrowRight') this.nextSection();
            if (e.key === ' ') {
                e.preventDefault();
                this.nextSection();
            }
        });

        console.log('Navigation setup complete');
    }

    setupAutoProgression() {
        // Auto-progression for narrated sections only
        this.autoProgressTimer = setInterval(() => {
            if (!this.isPaused && !this.isNarrating) {
                // Only auto-progress if we're not at the last section
                if (this.currentSection < this.totalSections - 1) {
                    // Check if the current section needs narration or auto-advance
                    const currentSectionId = this.sections[this.currentSection].id;
                    if (currentSectionId && !this.sectionNarrated.has(`${this.currentSection}-${currentSectionId}`)) {
                        this.checkAndNarrateSection();
                    }
                } else {
                    // Stop auto-progression at the end
                    clearInterval(this.autoProgressTimer);
                }
            }
        }, 3000); // Check every 3 seconds
    }

    clearAutoProgressTimer() {
        if (this.autoProgressTimer) {
            clearInterval(this.autoProgressTimer);
            this.autoProgressTimer = null;
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
            
            this.updateProgressBar();
            
            // Check if this section needs narration
            this.checkAndNarrateSection();
            
            // Restart auto-progression
            this.setupAutoProgression();
            
        }, 300);
    }

    checkAndNarrateSection() {
        const currentSectionId = this.sections[this.currentSection].id;
        if (!currentSectionId) return;

        const sectionKey = `${this.currentSection}-${currentSectionId}`;
        
        // Skip if already narrated or if we're currently narrating
        if (this.sectionNarrated.has(sectionKey) || this.isNarrating) {
            return;
        }

        const sceneNarrations = {
            'parable-intro': "A wealthy master entrusted his money to his servants before going on a journey. This is the story of what they chose to do with what was given to them.",
            'scene1': "To the first servant, he gave five talents - a fortune worth many years of wages. This servant received the most because the master trusted his abilities.",
            'scene2': "To the second servant, he gave two talents - still a substantial amount. Each servant received according to their ability and the master's trust in them.",
            'scene3': "To the third servant, he gave one talent. Even one talent was worth twenty years of wages for a laborer - this was no small gift.",
            'scene4': "The first two servants immediately went to work, trading and investing wisely. They doubled what they had been given through faithful service.",
            'scene5': "But the third servant, filled with fear, dug a hole and buried his talent in the ground. He chose safety over faith, hiding instead of multiplying what was entrusted to him.",
            'message': "When the master returned, he celebrated those who had been faithful with what they received. But to the one who buried his talent, he said: 'You wicked and lazy servant!' The risk of not using God's gifts is far greater than any risk in using them."
        };

        // Only narrate specific parable sections
        if (sceneNarrations[currentSectionId]) {
            this.sectionNarrated.add(sectionKey);
            console.log(`Narrating section: ${currentSectionId}`);
            
            // Speak after a brief delay to let section settle
            setTimeout(() => {
                const onComplete = () => {
                    console.log(`Completed narration for ${currentSectionId}`);
                    // Auto-advance after narration with a brief pause
                    if (this.currentSection < this.totalSections - 1) {
                        setTimeout(() => {
                            this.autoProgressTimer = setTimeout(() => {
                                if (this.currentSection < this.totalSections - 1) {
                                    this.nextSection();
                                }
                            }, 2500); // 2.5 seconds after narration ends for natural flow
                        }, 1000);
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
        }
    }

    handleThanksgivingSection() {
        console.log('Handling thanksgiving section');
        
        const thanksgivingText = "Thank you, dear friends, for joining us today in studying God's Word. May you be blessed as you use the gifts God has given you for His glory. Remember, God calls us to be faithful stewards of everything He entrusts to us. Go and be fruitful!";
        
        const sectionKey = `${this.currentSection}-thanksgiving`;
        if (!this.sectionNarrated.has(sectionKey)) {
            this.sectionNarrated.add(sectionKey);
            
            setTimeout(() => {
                const onGodFirstComplete = () => {
                    console.log('Thanksgiving narration completed');
                    // Final fade out of audio
                    if (this.scWidget) {
                        this.fadeOutSoundCloudAudio();
                    }
                };
                this.speakText(thanksgivingText, onGodFirstComplete);
            }, 1000);
        }
    }

    fadeOutSoundCloudAudio() {
        if (!this.scWidget) return;
        
        console.log('Starting SoundCloud audio fade-out');
        let currentVolume = 17;
        const fadeStep = 1;
        const fadeInterval = 200; // milliseconds
        
        this.fadeInterval = setInterval(() => {
            currentVolume -= fadeStep;
            if (currentVolume <= 0) {
                this.scWidget.setVolume(0);
                this.scWidget.pause();
                clearInterval(this.fadeInterval);
                console.log('SoundCloud audio faded out and paused');
            } else {
                this.scWidget.setVolume(currentVolume);
            }
        }, fadeInterval);
    }

    updateProgressBar() {
        const progressBar = document.querySelector('.progress-fill');
        if (progressBar) {
            const progress = ((this.currentSection + 1) / this.totalSections) * 100;
            progressBar.style.width = `${progress}%`;
        }

        // Update counter
        const counter = document.querySelector('.section-counter');
        if (counter) {
            counter.textContent = `${this.currentSection + 1} / ${this.totalSections}`;
        }
    }

    togglePlayPause() {
        this.isPaused = !this.isPaused;
        const btn = document.getElementById('playPauseBtn');
        
        if (this.isPaused) {
            if (btn) btn.innerHTML = '<i class="fas fa-play"></i>';
            console.log('Paused');
        } else {
            if (btn) btn.innerHTML = '<i class="fas fa-pause"></i>';
            console.log('Playing');
        }
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded - initializing Jacqueline Worsley Ministries website');
    window.cinematicWebsite = new CinematicWebsite();
});

// Global functions for "Begin Your Journey" button compatibility
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

// Additional global functions that might be called from HTML
function togglePlayPause() {
    if (window.cinematicWebsite) {
        window.cinematicWebsite.togglePlayPause();
    }
}

// Ensure audio interaction for mobile devices
document.addEventListener('click', function enableAudio() {
    // Enable audio context on first user interaction
    if (window.cinematicWebsite) {
        // Force voices to load
        speechSynthesis.getVoices();
        
        // Attempt to play silent audio to enable audio context
        const silentAudio = new Audio('data:audio/wav;base64,UklGRigAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQAAAAA=');
        silentAudio.play().catch(() => {});
        
        // Only run once
        document.removeEventListener('click', enableAudio);
    }
}, { once: true });

// Handle page visibility change
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        // Page is hidden, pause speech
        if (window.cinematicWebsite && window.cinematicWebsite.isNarrating) {
            speechSynthesis.pause();
        }
    } else {
        // Page is visible again, resume speech
        if (window.cinematicWebsite && speechSynthesis.paused) {
            speechSynthesis.resume();
        }
    }
});

// Auto-start everything when page loads (after user interaction)
window.addEventListener('load', () => {
    console.log('Page loaded - website ready');
    // Voices should be loaded by now, but force it just in case
    if ('speechSynthesis' in window) {
        speechSynthesis.getVoices();
    }
});