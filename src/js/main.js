/**
 * main.js - Application Initialization
 */

document.addEventListener('DOMContentLoaded', () => {
    console.log("App Initializing...");

    const urlParams = new URLSearchParams(window.location.search);
    const slideParam = urlParams.get('slide');
    
    if (slideParam !== null) {
        // Bypass Intro completely
        document.getElementById('intro-screen').classList.add('hidden');
        const introVideo = document.getElementById('intro-video');
        if (introVideo) introVideo.remove(); // Prevent loading/playing video

        Landing.init(parseInt(slideParam));
        Landing.show();
    } else {
        // Initialize normally
        Intro.init(() => {
            Landing.show();
        });
        Landing.init(0);
    }
});
