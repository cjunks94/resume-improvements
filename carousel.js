// Hero Image Carousel
(function() {
    'use strict';

    const carousel = {
        currentSlide: 0,
        slides: null,
        indicators: null,
        autoplayInterval: null,
        autoplayDelay: 5000, // 5 seconds

        init() {
            this.slides = document.querySelectorAll('.carousel-slide');
            this.indicators = document.querySelectorAll('.carousel-indicator');

            if (!this.slides.length) return;

            // Set up navigation buttons
            const prevBtn = document.querySelector('.carousel-btn--prev');
            const nextBtn = document.querySelector('.carousel-btn--next');

            if (prevBtn) prevBtn.addEventListener('click', () => this.navigate(-1));
            if (nextBtn) nextBtn.addEventListener('click', () => this.navigate(1));

            // Set up indicator buttons
            this.indicators.forEach((indicator, index) => {
                indicator.addEventListener('click', () => this.goToSlide(index));
            });

            // Set up autoplay with pause on hover
            const container = document.querySelector('.carousel-container');
            if (container) {
                container.addEventListener('mouseenter', () => this.pauseAutoplay());
                container.addEventListener('mouseleave', () => this.startAutoplay());
            }

            // Start autoplay
            this.startAutoplay();
        },

        navigate(direction) {
            this.currentSlide += direction;

            if (this.currentSlide >= this.slides.length) {
                this.currentSlide = 0;
            } else if (this.currentSlide < 0) {
                this.currentSlide = this.slides.length - 1;
            }

            this.updateSlides();
        },

        goToSlide(index) {
            this.currentSlide = index;
            this.updateSlides();
        },

        updateSlides() {
            // Update slides
            this.slides.forEach((slide, index) => {
                if (index === this.currentSlide) {
                    slide.classList.add('active');
                } else {
                    slide.classList.remove('active');
                }
            });

            // Update indicators
            this.indicators.forEach((indicator, index) => {
                if (index === this.currentSlide) {
                    indicator.classList.add('active');
                } else {
                    indicator.classList.remove('active');
                }
            });
        },

        startAutoplay() {
            this.pauseAutoplay(); // Clear any existing interval
            this.autoplayInterval = setInterval(() => {
                this.navigate(1);
            }, this.autoplayDelay);
        },

        pauseAutoplay() {
            if (this.autoplayInterval) {
                clearInterval(this.autoplayInterval);
                this.autoplayInterval = null;
            }
        }
    };

    // Initialize carousel when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => carousel.init());
    } else {
        carousel.init();
    }
})();
