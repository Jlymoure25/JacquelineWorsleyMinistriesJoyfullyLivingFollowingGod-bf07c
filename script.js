// Jacqueline Worsley Ministries - Interactive Website Script

class CinematicWebsite {
    constructor() {
        this.currentSection = 0;
        this.totalSections = 0;
        this.sections = [];
        this.audio = null;
        this.isAudioPlaying = true;
        this.autoProgressTimer = null;
        this.isNarrating = false;
        this.currentUtterance = null;
        this.sectionNarrated = new Set();
        this.introMusicPlayed = false;
        this.isPaused = false;
        this.soundcloudPlayer = null;
        this.fadeInterval = null;
        this.narratorVoice = null;
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
        
        // Start with a cinematic entrance
        this.playIntroductionSequence();
        
        // Initialize SoundCloud player
        this.initializeSoundCloudPlayer();
        
        console.log('Jacqueline Worsley Ministries website initialized');
    }
    
    setupAudio() {
        // Create audio element
        this.audio = new Audio();
        this.audio.loop = false;
        this.audio.volume = 0.15; // Lower volume for background music
        
        // Add event listeners
        this.audio.addEventListener('canplaythrough', () => {
            console.log('Audio can play through');
        });
        
        this.audio.addEventListener('error', (e) => {
            console.error('Audio error:', e);
        });
        
        console.log('Audio setup completed');
    }

    playIntroductionSequence() {
        console.log('Starting introduction sequence');
        
        // Start background music immediately
        this.startBackgroundMusic();
        
        // Start narration immediately - no delay
        this.startNarratorVoice();
    }
    
    startNarratorVoice() {
        console.log('STARTING NARRATOR VOICE NOW');
        
        // Force voices to load first
        if (speechSynthesis.getVoices().length === 0) {
            speechSynthesis.onvoiceschanged = () => {
                console.log('Voices loaded, starting narration');
                this.beginNarration();
            };
        } else {
            this.beginNarration();
        }
    }
    
    beginNarration() {
        const message = "Welcome, dear friends, to Jacqueline Worsley Ministries. We're so blessed you're here with us today.";
        
        // Create and show message box
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
        `;
        
        messageBox.textContent = message;
        document.body.appendChild(messageBox);
        
        // Speak immediately
        const utterance = new SpeechSynthesisUtterance(message);
        utterance.rate = 0.9;
        utterance.pitch = 1.1;
        utterance.volume = 1.0;
        
        // Get voice
        const voices = speechSynthesis.getVoices();
        const voice = voices.find(v => v.lang.startsWith('en')) || voices[0];
        if (voice) {
            utterance.voice = voice;
        }
        
        utterance.onend = () => {
            console.log('First message completed');
            messageBox.remove();
            setTimeout(() => {
                this.continueNarration();
            }, 1000);
        };
        
        speechSynthesis.speak(utterance);
        console.log('SPEAKING NOW:', message.substring(0, 50));
    }
    
    continueNarration() {
        const messages = [
            "Let's prepare our hearts for a wonderful journey through God's Word together.",
            "Here's a beautiful teaching for us today. The Parable of the Talents from Matthew chapter 25. It's truly inspiring.",
            "Come, let's discover what amazing gifts our loving God has given each one of us."
        ];
        
        let index = 0;
        
        const playNext = () => {
            if (index < messages.length) {
                const message = messages[index];
                
                // Create message box
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
                `;
                
                messageBox.textContent = message;
                document.body.appendChild(messageBox);
                
                // Speak
                const utterance = new SpeechSynthesisUtterance(message);
                utterance.rate = 0.9;
                utterance.pitch = 1.1;
                utterance.volume = 1.0;
                
                const voices = speechSynthesis.getVoices();
                const voice = voices.find(v => v.lang.startsWith('en')) || voices[0];
                if (voice) {
                    utterance.voice = voice;
                }
                
                utterance.onend = () => {
                    console.log('Message', index + 2, 'completed');
                    messageBox.remove();
                    index++;
                    if (index < messages.length) {
                        setTimeout(playNext, 1000);
                    } else {
                        console.log('ALL NARRATION COMPLETED');
                        this.sectionNarrated.add('0-intro');
                    }
                };
                
                speechSynthesis.speak(utterance);
                console.log('Speaking message', index + 2);
            }
        };
        
        playNext();
    }

    startBackgroundMusic() {
        console.log('Background music started via SoundCloud');
        // Music is handled by SoundCloud widget - just log it
    }

    initializeSoundCloudPlayer() {
        const iframe = document.querySelector('#soundcloud-player');
        if (iframe) {
            this.scWidget = SC.Widget(iframe);
            console.log('SoundCloud widget initialized');
            
            // Set volume to 17% as originally working
            this.scWidget.setVolume(17);
            
            this.scWidget.bind(SC.Widget.Events.READY, () => {
                console.log('SoundCloud player ready');
                this.scWidget.setVolume(17);
            });
            
            this.scWidget.bind(SC.Widget.Events.PLAY, () => {
                console.log('SoundCloud music started playing');
            });
        }
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
            if (e.key === 'ArrowLeft') {
                e.preventDefault();
                this.previousSection();
            } else if (e.key === 'ArrowRight') {
                e.preventDefault();
                this.nextSection();
            } else if (e.key === ' ') {
                e.preventDefault();
                this.togglePlayPause();
            }
        });

        console.log('Navigation setup complete');
    }

    setupAutoProgression() {
        // Auto-progression for narrated sections
        this.autoProgressTimer = setInterval(() => {
            if (!this.isPaused && !this.isNarrating) {
                // Only auto-progress if we're not at the last section
                if (this.currentSection < this.totalSections - 1) {
                    this.nextSection();
                } else {
                    // Stop auto-progression at the end
                    clearInterval(this.autoProgressTimer);
                }
            }
        }, 15000); // 15 seconds per section
    }

    nextSection() {
        if (this.currentSection < this.totalSections - 1) {
            this.currentSection++;
            this.showCurrentSection();
            this.updateProgressBar();
            this.playAudioForSection();
        }
    }

    previousSection() {
        if (this.currentSection > 0) {
            this.currentSection--;
            this.showCurrentSection();
            this.updateProgressBar();
            this.playAudioForSection();
        }
    }

    showCurrentSection() {
        // Hide all sections
        this.sections.forEach(section => {
            section.classList.remove('active');
        });

        // Show current section
        if (this.sections[this.currentSection]) {
            this.sections[this.currentSection].classList.add('active');
        }

        console.log(`Showing section ${this.currentSection + 1}/${this.totalSections}`);
    }

    playAudioForSection() {
        // Audio logic for sections - keeping original working method
        console.log(`Playing audio for section ${this.currentSection}`);
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
    new CinematicWebsite();
});