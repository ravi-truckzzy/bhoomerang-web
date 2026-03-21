/**
 * landing.js - Horizontal Edition
 */

const Landing = {
    init(startIndex = 0) {
        this.page = document.getElementById('landing-page');
        this.sections = document.querySelectorAll('.landing-section');
        this.navContainer = document.getElementById('nav-numbers');
        this.arrowContainer = document.getElementById('slider-arrows');
        this.prevBtn = document.getElementById('prev-btn');
        this.nextBtn = document.getElementById('next-btn');
        this.pageFlipOverlay = document.getElementById('page-flip');
        
        this.activeSectionIndex = startIndex;
        this.isAnimating = false;

        this.createNav();
        this.bindEvents();
        
        if (startIndex > 0) {
            // Apply immediate scroll to start index instead of 0
            this.page.scrollLeft = startIndex * window.innerWidth;
            this.updateNavUI();
        }
        
        this.updateArrowState();
    },

    createNav() {
        this.navContainer.innerHTML = ''; // Clear existing
        this.sections.forEach((_, index) => {
            const navItem = document.createElement('div');
            navItem.classList.add('nav-item');
            if (index === 0) navItem.classList.add('active');
            navItem.innerText = (index + 1).toString().padStart(2, '0');
            navItem.dataset.index = index;
            
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
        this.updateArrowState();
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
            }
        }, { passive: false });

        // Arrow Buttons
        this.prevBtn.addEventListener('click', () => this.scrollToSection(this.activeSectionIndex - 1));
        this.nextBtn.addEventListener('click', () => this.scrollToSection(this.activeSectionIndex + 1));

        // Keyboard Navigation
        window.addEventListener('keydown', (e) => {
            if (this.page.classList.contains('hidden')) return;
            if (e.key === 'ArrowRight') this.scrollToSection(this.activeSectionIndex + 1);
            if (e.key === 'ArrowLeft') this.scrollToSection(this.activeSectionIndex - 1);
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
            this.updateArrowState();
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

    updateArrowState() {
        // Hide entire container on Section 1
        if (this.activeSectionIndex === 0) {
            this.arrowContainer.classList.add('hidden');
        } else {
            this.arrowContainer.classList.remove('hidden');
        }

        this.prevBtn.disabled = this.activeSectionIndex === 0;
        this.nextBtn.disabled = this.activeSectionIndex === this.sections.length - 1;
    },

    triggerPageFlip() {
        // Redirect to detail page with active section index
        window.location.href = `detail.html?slide=${this.activeSectionIndex}`;
    },

    show() {
        this.page.classList.remove('hidden');
        this.page.classList.add('visible');
    }
};

window.Landing = Landing;
