/**
 * intro.js - Handles the Intro Screen logic
 */

const Intro = {
    init(onComplete) {
        this.screen = document.getElementById('intro-screen');
        this.video = document.getElementById('intro-video');
        this.startBtn = document.getElementById('start-btn');
        this.skipBtn = document.getElementById('skip-btn');
        this.onComplete = onComplete; 

        this.bindEvents();
    },

    bindEvents() {
        this.startBtn.addEventListener('click', () => {
            console.log("START clicked");
            // Set a fallback timeout in case video fails to play or end
            const fallback = setTimeout(() => {
                console.log("Video fallback triggered");
                this.finish();
            }, 5000);

            try {
                this.video.currentTime = 0;
                this.video.play().catch(err => {
                    console.warn("Video play failed:", err);
                    clearTimeout(fallback);
                    this.finish();
                });
                
                this.video.onended = () => {
                    clearTimeout(fallback);
                    this.finish();
                };
            } catch (e) {
                console.error("Video integration error:", e);
                clearTimeout(fallback);
                this.finish();
            }
        });

        this.skipBtn.addEventListener('click', () => {
            console.log("SKIP clicked");
            this.finish();
        });
    },

    finish() {
        if (this.isFinished) return;
        this.isFinished = true;
        
        this.screen.classList.add('fade-out');
        setTimeout(() => {
            this.screen.classList.add('hidden');
            if (this.onComplete) this.onComplete();
        }, 800);
    }
};

window.Intro = Intro;
