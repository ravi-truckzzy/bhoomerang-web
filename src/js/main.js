/**
 * main.js - Application Initialization
 */

document.addEventListener('DOMContentLoaded', () => {
    console.log("App Initializing...");

    const urlParams = new URLSearchParams(window.location.search);
    const slideParam = urlParams.get('slide');
    
    if (slideParam !== null) {
        // Bypass Intro completely
        const introScreen = document.getElementById('intro-screen');
        if (introScreen) {
            introScreen.classList.add('hidden');
            introScreen.style.display = 'none';
            introScreen.remove(); // Remove completely to avoid YT overhead
        }

        // Ensure UI elements are visible
        const sideNav = document.querySelector('.side-nav');
        const bottomNav = document.querySelector('.bottom-nav');
        if (sideNav) sideNav.classList.remove('hidden');
        if (bottomNav) bottomNav.classList.remove('hidden');

        Landing.init(parseInt(slideParam));
        Landing.show();
    } else {
        // Initialize normally – Landing.init() called ONLY after intro completes
        Intro.init(() => {
            Landing.init(0);
            Landing.show();
        });
    }
});
