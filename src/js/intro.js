// Global callback for YouTube API
window.onYouTubeIframeAPIReady = () => {
    if (window.Intro && typeof window.Intro.createPlayer === 'function') {
        window.Intro.createPlayer();
    }
};

const Intro = {
    init(onComplete) {
        this.screen = document.getElementById('intro-screen');
        this.playPauseBtn = document.getElementById('play-pause-btn');
        this.skipBtn = document.getElementById('skip-btn');
        this.onComplete = onComplete;
        this.isVideoStarted = false;
        this.isFinished = false;

        this.bindEvents();
    },

    createPlayer() {
        this.player = new YT.Player('intro-video-container', {
            videoId: 'aegmFAWAcRk',
            playerVars: {
                autoplay: 0, // Starts paused now
                mute: 1,
                controls: 0,
                showinfo: 0,
                modestbranding: 1,
                loop: 1,
                playlist: 'aegmFAWAcRk',
                enablejsapi: 1,
                playsinline: 1,
                rel: 0
            },
            events: {
                'onReady': () => {
                    console.log("YouTube Player Ready - Waiting for click");
                },
                'onStateChange': (event) => {
                    const playIcon = this.playPauseBtn.querySelector('.play-icon');
                    const pauseIcon = this.playPauseBtn.querySelector('.pause-icon');

                    // YT.PlayerState.PLAYING = 1, PAUSED = 2, ENDED = 0
                    if (event.data === 1) {
                        if (playIcon) playIcon.style.display = 'none';
                        if (pauseIcon) pauseIcon.style.display = 'block';
                    } else if (event.data === 2 || event.data === 0) {
                        if (playIcon) playIcon.style.display = 'block';
                        if (pauseIcon) pauseIcon.style.display = 'none';
                    }

                    if (event.data === 0) {
                        this.finish();
                    }
                }
            }
        });
    },

    bindEvents() {


        this.playPauseBtn.addEventListener('click', () => {
            if (!this.player || typeof this.player.getPlayerState !== 'function') return;

            const state = this.player.getPlayerState();

            if (state === 1) { // Playing
                this.player.pauseVideo();
            } else { // Paused or stopped
                this.player.unMute();
                this.player.playVideo();

                // YouTube Shorts stay on-screen, so we use a fallback to finish after 20s
                if (!this.timeoutStarted) {
                    this.timeoutStarted = true;
                    setTimeout(() => {
                        if (!this.isFinished) this.finish();
                    }, 20000);
                }
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

        if (this.player && typeof this.player.stopVideo === 'function') {
            this.player.stopVideo();
        }

        // Show UI elements ONLY when entering the index page
        const sideNav = document.querySelector('.side-nav');
        const bottomNav = document.querySelector('.bottom-nav');
        if (sideNav) sideNav.classList.remove('hidden');
        if (bottomNav) bottomNav.classList.remove('hidden');

        this.screen.classList.add('fade-out');
        setTimeout(() => {
            this.screen.classList.add('hidden');
            if (this.onComplete) this.onComplete();
        }, 800);
    }
};

window.Intro = Intro;
