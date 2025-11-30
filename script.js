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
        
        // Setup audio with immediate auto-start
        this.setupAudio();
        
        // Setup navigation
        this.setupNavigation();
        
        // Setup auto-progression for introduction
        this.setupAutoProgression();
        
        // Update progress bar
        this.updateProgressBar();
        
        // Start SoundCloud and narrator voice together - IMMEDIATE auto-start
        this.playIntroductionSequence();
        
        // Force audio start after short delay to ensure SoundCloud is ready
        setTimeout(() => {
            this.forceStartAudio();
        }, 2000);
        
        console.log('Jacqueline Worsley Ministries website initialized with immediate auto-start');
    }
    
    setupAudio() {
        this.audio = document.getElementById('background-music');
        
        // Initialize speech synthesis
        if ('speechSynthesis' in window) {
            speechSynthesis.getVoices();
            window.speechSynthesis.onvoiceschanged = () => {
                console.log('Speech synthesis voices loaded');
                this.narratorVoice = null;
                this.getNarratorVoice();
            };
        }
        
        // Audio will start on user interaction
        this.isAudioPlaying = false;
    }
    


    playIntroductionSequence() {
        console.log('Starting synchronized introduction sequence');
        
        // Start SoundCloud and narrator voice at EXACTLY the same time
        this.startBackgroundMusic();
        this.startIntroductoryNarration();
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



    forceStartAudio() {
        console.log('Force starting background music...');
        if (this.audio) {
            this.audio.volume = 0.17;
            this.audio.play().then(() => {
                console.log('Background music force started at 17% volume');
                this.isAudioPlaying = true;
            }).catch(err => {
                console.log('Audio start failed:', err);
            });
        }
    }
    
    startBackgroundMusic() {
        console.log('Starting background music at 17% volume');
        if (this.audio && !this.isAudioPlaying) {
            this.audio.volume = 0.17;
            this.audio.play().then(() => {
                console.log('Background music started successfully');
                this.isAudioPlaying = true;
            }).catch(err => {
                console.log('Background music failed to start:', err);
            });
        }
    }

    // SoundCloud initialization moved to setupAudio()

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
            
            // Audio continues playing until thanksgiving narration completes
            if (sectionIndex === this.totalSections - 1) {
                console.log('Final section reached - audio will continue until thanksgiving narration ends');
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
            'parable-intro': "The Parable of the Talents. Matthew chapter 25 verses 14 through 30. A story of faithfulness, multiplication, and the sacred trust God places in each of us. A wealthy master entrusted his money to his servants before going on a journey. This is the story of what they chose to do with what was given to them.",
            
            'scene1': "Verses 14 through 15. For it will be like a man going on a journey, who called his servants and entrusted to them his property. To one he gave five talents, to another two, to another one, to each according to his ability. Then he went away. To the first servant, he gave five talents - a fortune worth many years of wages. This servant received the most because the master trusted his abilities.",
            
            'scene2': "Verses 16 through 17. He who had received the five talents went at once and traded with them, and he made five talents more. So also he who had the two talents made two talents more. The first two servants immediately went to work, trading and investing wisely. They doubled what they had been given through faithful service.",
            
            'scene3': "Verse 18. But he who had received the one talent went and dug in the ground and hid his master's money. The third servant, filled with fear, dug a hole and buried his talent in the ground. He chose safety over faith, hiding instead of multiplying what was entrusted to him. I was afraid, he said.",
            
            'scene4': "Verses 19 through 23. Now after a long time the master of those servants came and settled accounts with them. Well done, good and faithful servant. You have been faithful over a little; I will set you over much. Enter into the joy of your master. When the master returned, he celebrated those who had been faithful with what they received.",
            
            'scene5': "Verses 24 through 30. He also who had received the one talent came forward, saying, Master, I knew you to be a hard man, so I was afraid, and I went and hid your talent. But his master answered him, You wicked and slothful servant! But to the one who buried his talent, he said: 'You wicked and lazy servant!' The risk of not using God's gifts is far greater than any risk in using them.",
            
            'message': "The Sacred Trust. Seek to please, obey, and trust God with all He has invested in you, or lose everything - including all God invested in you and yourself. Did You Know? A talent was a monetary unit worth about twenty years' wages for a laborer. JESUS, imagine that! The loss today would be worth more than a whole life of wages - then you lose yourself too. The risk is too, too high. The risk of total loss ain't worth it.",
            
            'closing': "Until Next Time. Join us next time as we take another trip in the WORD OF GOD. Joyfully Living Following God.",
            
            'thanksgiving': "HAPPY THANKSGIVING EVERYONE EVERYBODY from Jacqueline Worsley Ministries Joyfully Living Following God. Thanksgiving is a lifestyle not just a one day celebration. Hashtag thank God everyday all the time from whom all blessings flow. Take Care and May God Bless You With His Choice Blessings. GOD FIRST."
        };

        // Only narrate specific parable sections
        if (sceneNarrations[currentSectionId]) {
            this.sectionNarrated.add(sectionKey);
            console.log(`Narrating section: ${currentSectionId}`);
            
            // Speak after a brief delay to let section settle
            setTimeout(() => {
                const onComplete = () => {
                    console.log(`Completed narration for ${currentSectionId}`);
                    
                    // Special handling for thanksgiving section - final section
                    if (currentSectionId === 'thanksgiving') {
                        this.showThankYouMessage();
                    } else {
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
                // Message narration handled above with complete text
                break;
            case 'closing':
                // Closing narration handled above with complete text
                break;
            case 'thanksgiving':
                // Thanksgiving narration handled above with complete text
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

    // displayMessageTakeaway removed - now handled in main narration flow

    showThankYouMessage() {
        console.log('Showing Thank You message box with narration');
        
        setTimeout(() => {
            // Create thank you message box
            const thankYouBox = document.createElement('div');
            thankYouBox.style.cssText = `
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: linear-gradient(45deg, rgba(204, 85, 0, 0.95), rgba(139, 69, 19, 0.95));
                color: #F5F5DC;
                padding: 40px 60px;
                border-radius: 30px;
                font-size: 2rem;
                font-weight: 700;
                z-index: 4000;
                border: 4px solid #F5F5DC;
                box-shadow: 0 25px 60px rgba(0,0,0,0.8);
                text-align: center;
                font-family: 'Playfair Display', serif;
                text-shadow: 3px 3px 6px rgba(0,0,0,0.9);
                opacity: 0;
                transition: opacity 1s ease;
                backdrop-filter: blur(15px);
                line-height: 1.4;
            `;
            
            thankYouBox.innerHTML = `
                Thank You For Joining Us.<br>
                God Bless You.
            `;
            
            document.body.appendChild(thankYouBox);
            
            // Show the message box
            setTimeout(() => {
                thankYouBox.style.opacity = '1';
            }, 100);
            
            // Start narrating the thank you message
            const thankYouMessage = "Thank You For Joining Us. God Bless You.";
            
            const onThankYouComplete = () => {
                console.log('Thank you narration completed');
                
                // Fade out the message box
                thankYouBox.style.opacity = '0';
                
                setTimeout(() => {
                    thankYouBox.remove();
                    this.handleFinalEnding();
                }, 1000);
            };
            
            this.speakText(thankYouMessage, onThankYouComplete);
        }, 2000); // 2 second pause after thanksgiving section
    }
    
    handleFinalEnding() {
        console.log('Handling final ending sequence');
        
        // Start audio fade and website fade simultaneously
        console.log('Starting simultaneous audio fade out and website fade to black');
        
        // Start both fades at the same time
        if (this.scWidget) {
            this.fadeOutSoundCloudAudio();
        }
        
        // Fade to black immediately (simultaneously with audio)
        this.fadeToBlackAndShowReplay();
    }
    
    fadeToBlackAndShowReplay() {
        console.log('Fading to black and showing replay option');
        
        // Create black overlay
        const blackOverlay = document.createElement('div');
        blackOverlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            background: black;
            z-index: 9999;
            opacity: 0;
            transition: opacity 3s ease;
            display: flex;
            justify-content: center;
            align-items: center;
            flex-direction: column;
        `;
        
        // Create replay button
        const replayButton = document.createElement('button');
        replayButton.textContent = 'Begin Your Journey Again';
        replayButton.style.cssText = `
            background: linear-gradient(45deg, rgba(220, 20, 60, 0.9), rgba(139, 0, 0, 0.9));
            color: #FFD700;
            padding: 20px 40px;
            border: 3px solid #FFD700;
            border-radius: 25px;
            font-size: 1.5rem;
            font-weight: 600;
            font-family: 'Playfair Display', serif;
            cursor: pointer;
            opacity: 0;
            transition: all 0.3s ease, opacity 2s ease 4s;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.8);
            box-shadow: 0 15px 40px rgba(0,0,0,0.6);
        `;
        
        replayButton.addEventListener('click', () => {
            this.restartJourney();
        });
        
        replayButton.addEventListener('mouseover', () => {
            replayButton.style.transform = 'scale(1.1)';
            replayButton.style.boxShadow = '0 20px 60px rgba(0,0,0,0.8)';
        });
        
        replayButton.addEventListener('mouseout', () => {
            replayButton.style.transform = 'scale(1)';
            replayButton.style.boxShadow = '0 15px 40px rgba(0,0,0,0.6)';
        });
        
        blackOverlay.appendChild(replayButton);
        document.body.appendChild(blackOverlay);
        
        // Fade to black
        setTimeout(() => {
            blackOverlay.style.opacity = '1';
        }, 100);
        
        // Show button 2 seconds after fade completes (3s fade + 2s wait = 5s total)
        setTimeout(() => {
            replayButton.style.opacity = '1';
        }, 5000);
    }
    
    restartJourney() {
        console.log('Restarting the journey');
        
        // Remove any overlays
        const overlays = document.querySelectorAll('[style*="position: fixed"][style*="z-index: 9999"]');
        overlays.forEach(overlay => overlay.remove());
        
        // Reset all state
        this.currentSection = 0;
        this.sectionNarrated.clear();
        this.isNarrating = false;
        this.isPaused = false;
        
        // Reset sections
        this.sections.forEach(section => {
            section.classList.remove('active', 'prev');
        });
        
        if (this.sections[0]) {
            this.sections[0].classList.add('active');
        }
        
        // Update progress
        this.updateProgressBar();
        
        // Restart SoundCloud with looping
        if (this.scWidget) {
            this.scWidget.setVolume(17);
            this.scWidget.seekTo(0);
            this.scWidget.play();
            console.log('SoundCloud restarted with looping enabled');
        }
        
        // Restart the introduction sequence
        setTimeout(() => {
            this.playIntroductionSequence();
        }, 1000);
    }

    fadeOutSoundCloudAudio(onComplete = null) {
        if (!this.scWidget) {
            if (onComplete) onComplete();
            return;
        }
        
        console.log('Starting SoundCloud audio fade-out (3 seconds to match website fade)');
        let currentVolume = 17;
        const fadeStep = 1;
        const fadeInterval = 176; // milliseconds (17 steps * 176ms = ~3 seconds)
        
        this.fadeInterval = setInterval(() => {
            currentVolume -= fadeStep;
            if (currentVolume <= 0) {
                this.scWidget.setVolume(0);
                this.scWidget.pause();
                clearInterval(this.fadeInterval);
                console.log('SoundCloud audio faded out and paused');
                if (onComplete) onComplete();
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
function enableAudio() {
    console.log('User clicked - starting audio and narration');
    if (window.cinematicWebsite && window.cinematicWebsite.audio) {
        window.cinematicWebsite.audio.volume = 0.17;
        window.cinematicWebsite.audio.play().then(() => {
            window.cinematicWebsite.isAudioPlaying = true;
            console.log('✅ AUDIO STARTED at 17% volume');
        }).catch(err => {
            console.log('❌ Audio failed:', err);
        });
    }
    
    // Start narration
    if (window.cinematicWebsite) {
        window.cinematicWebsite.startIntroductoryNarration();
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

// Force everything to start on first user interaction
document.addEventListener('click', function forceAllFunctionality() {
    console.log('User clicked - forcing ALL functionality to start!');
    
    if (window.cinematicWebsite) {
        // Force SoundCloud to play
        if (window.cinematicWebsite.scWidget) {
            console.log('Force starting SoundCloud');
            window.cinematicWebsite.scWidget.setVolume(17);
            window.cinematicWebsite.scWidget.play();
            window.cinematicWebsite.isAudioPlaying = true;
        }
        
        // Force speech synthesis to be ready
        if ('speechSynthesis' in window) {
            speechSynthesis.getVoices();
            console.log('Speech synthesis voices loaded');
            
            // Force start narrator if not already started
            if (!window.cinematicWebsite.sectionNarrated.has('0-intro')) {
                console.log('Force starting narrator');
                window.cinematicWebsite.startIntroductoryNarration();
            }
        }
    }
}, { once: true });

// Auto-start everything when page loads (after user interaction)
window.addEventListener('load', () => {
    console.log('Page loaded - website ready');
    // Voices should be loaded by now, but force it just in case
    if ('speechSynthesis' in window) {
        speechSynthesis.getVoices();
    }
    
    // Try to start immediately if possible
    setTimeout(() => {
        if (window.cinematicWebsite && window.cinematicWebsite.scWidget) {
            console.log('Attempting immediate start');
            window.cinematicWebsite.scWidget.play();
            window.cinematicWebsite.scWidget.setVolume(17);
        }
    }, 1000);
});