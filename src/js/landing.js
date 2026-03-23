/**
 * landing.js - Horizontal Edition
 */

const Landing = {
    init(startIndex = 0) {
        this.page = document.getElementById('landing-page');
        this.sections = document.querySelectorAll('.landing-section');
        this.navContainer = document.getElementById('nav-numbers');
        this.pageFlipOverlay = document.getElementById('page-flip');
        
        this.activeSectionIndex = startIndex;
        this.isAnimating = false;

        this.createNav();
        this.bindEvents();
        
        // Remove hidden early so geometric properties (scrollLeft, innerWidth) work correctly
        this.page.classList.remove('hidden');
        
        if (startIndex > 0) {
            // Apply immediate scroll to start index instead of 0
            this.page.scrollLeft = startIndex * window.innerWidth;
            this.updateNavUI();
        } else {
            this.updateNavUI(); // Ensure initial state is set even for 0
        }
        
        this.startAutoSlide();
    },

    createNav() {
        this.navContainer.innerHTML = ''; // Clear existing
        this.sections.forEach((section, index) => {
            const navItem = document.createElement('div');
            navItem.classList.add('nav-item');
            if (index === 0) navItem.classList.add('active');
            navItem.dataset.index = index;
            
            const numSpan = document.createElement('span');
            numSpan.innerText = (index + 1).toString().padStart(2, '0');
            navItem.appendChild(numSpan);
            
            const titleText = section.getAttribute('data-title') || 'SLIDE';
            const tooltipSpan = document.createElement('span');
            tooltipSpan.classList.add('nav-tooltip');
            tooltipSpan.innerText = titleText;
            navItem.appendChild(tooltipSpan);
            
            navItem.addEventListener('click', () => {
                this.scrollToSection(index);
            });
            
            this.navContainer.appendChild(navItem);
        });
        this.navItems = this.navContainer.querySelectorAll('.nav-item');
    },

    scrollToSection(index) {
        if (index < 0 || index >= this.sections.length) return;
        
        this.page.scrollTo({
            left: index * window.innerWidth,
            behavior: 'smooth'
        });
        
        this.activeSectionIndex = index;
        this.updateNavUI();
        this.updateAnimations();
        this.resetAutoSlide();
    },

    bindEvents() {
        // Horizontal Scroll Detection
        this.page.addEventListener('scroll', () => {
            if (!this.isAnimating) {
                this.updateActiveSection();
            }
        }, { passive: true });

        // Translate Vertical Scroll to Horizontal
        window.addEventListener('wheel', (e) => {
            if (this.page.classList.contains('hidden')) return;
            
            // If user is scrolling vertically, move horizontally
            if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
                this.page.scrollLeft += e.deltaY;
                e.preventDefault();
                this.resetAutoSlide();
            }
        }, { passive: false });

        // Keyboard Navigation
        window.addEventListener('keydown', (e) => {
            if (this.page.classList.contains('hidden')) return;
            if (e.key === 'ArrowRight') { this.scrollToSection(this.activeSectionIndex + 1); this.resetAutoSlide(); }
            if (e.key === 'ArrowLeft') { this.scrollToSection(this.activeSectionIndex - 1); this.resetAutoSlide(); }
        });

        // Know More Buttons (Page Flip)
        document.querySelectorAll('.know-more-btn').forEach(btn => {
            btn.addEventListener('click', () => this.triggerPageFlip());
        });

        // Touch Swipe
        let touchStartX = 0;
        this.page.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });

        this.page.addEventListener('touchend', (e) => {
            const touchEndX = e.changedTouches[0].screenX;
            const diff = touchStartX - touchEndX;
            if (Math.abs(diff) > 50) {
                if (diff > 0) this.scrollToSection(this.activeSectionIndex + 1);
                else this.scrollToSection(this.activeSectionIndex - 1);
                this.resetAutoSlide();
            }
        }, { passive: true });
    },

    updateActiveSection() {
        const scrollPosition = this.page.scrollLeft;
        const width = window.innerWidth;
        const index = Math.round(scrollPosition / width);

        if (this.activeSectionIndex !== index) {
            this.activeSectionIndex = index;
            this.updateNavUI();
            this.updateAnimations();
        }
    },

    updateNavUI() {
        this.navItems.forEach((item, index) => {
            if (index === this.activeSectionIndex) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });
    },

    updateAnimations() {
        this.sections.forEach((section, index) => {
            const animatedElements = section.querySelectorAll('[data-animation]');
            
            animatedElements.forEach(el => {
                const animationClass = el.getAttribute('data-animation');
                if (!animationClass) return;

                if (index === this.activeSectionIndex) {
                    el.classList.add('animate__animated', animationClass);
                } else {
                    el.classList.remove('animate__animated', animationClass);
                }
            });
        });
    },

    startAutoSlide() {
        this.stopAutoSlide();
        this.autoSlideInterval = setInterval(() => {
            let nextIndex = this.activeSectionIndex + 1;
            if (nextIndex >= this.sections.length) {
                nextIndex = 0; // Loop back to start
            }
            this.scrollToSection(nextIndex);
        }, 15000); 
    },

    stopAutoSlide() {
        if (this.autoSlideInterval) {
            clearInterval(this.autoSlideInterval);
            this.autoSlideInterval = null;
        }
    },

    resetAutoSlide() {
        this.startAutoSlide();
    },

    triggerPageFlip() {
        // Redirect to detail page with active section index
        window.location.href = `detail.html?slide=${this.activeSectionIndex}`;
    },

    show() {
        this.page.classList.remove('hidden');
        this.page.classList.add('visible');
        this.updateAnimations();
    }
};

window.Landing = Landing;
