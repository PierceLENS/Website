document.addEventListener('DOMContentLoaded', () => {
    const track = document.getElementById('carousel-track');
    const prevButton = document.getElementById('prev-slide');
    const nextButton = document.getElementById('next-slide');
    const indicatorsContainer = document.getElementById('carousel-indicators');
    
    // Get all slides
    const slides = Array.from(track.children);
    const slideCount = slides.length;
    let currentIndex = 0; // Starts at the first slide (index 0)

    // Function to move the carousel using CSS Transform
    const moveToSlide = (index) => {
        // Handle looping
        if (index < 0) {
            index = slideCount - 1; // Wrap to the last slide
        } else if (index >= slideCount) {
            index = 0; // Wrap to the first slide
        }
        
        currentIndex = index;
        
        // Calculate the percentage to move the track. Each slide is 100% width,
        // so move in full 100% increments per slide.
        const translateValue = -currentIndex * 100;

        // Apply movement using translateX. CSS handles the smooth transition.
        track.style.transform = `translateX(${translateValue}%)`;

        // Update indicators
        if (indicatorsContainer) {
            const buttons = Array.from(indicatorsContainer.children);
            buttons.forEach((btn, i) => btn.setAttribute('aria-selected', i === currentIndex ? 'true' : 'false'));
        }

        // Announce change for screen readers
        track.setAttribute('aria-label', `Slide ${currentIndex + 1} of ${slideCount}`);

        // Update button states (optional, useful if we decide not to loop)
        // updateNavButtons(); 
    };
    
    // Initial call to set the track position (should be 0%)
    moveToSlide(0);

    // Build indicators
    if (indicatorsContainer) {
        for (let i = 0; i < slideCount; i++) {
            const btn = document.createElement('button');
            btn.type = 'button';
            btn.setAttribute('aria-selected', i === 0 ? 'true' : 'false');
            btn.setAttribute('aria-label', `Go to slide ${i + 1}`);
            btn.setAttribute('role', 'tab');
            btn.addEventListener('click', () => moveToSlide(i));
            indicatorsContainer.appendChild(btn);
        }
    }

    // Keyboard navigation (left/right)
    if (track) {
        track.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowRight') { e.preventDefault(); moveToSlide(currentIndex + 1); }
            if (e.key === 'ArrowLeft') { e.preventDefault(); moveToSlide(currentIndex - 1); }
        });
    }

    // Touch / swipe support
    let touchStartX = 0;
    let touchEndX = 0;
    const minSwipeDistance = 30;

    if (track) {
        track.addEventListener('touchstart', (e) => {
            stopAutoplay();
            touchStartX = e.changedTouches[0].screenX;
        }, {passive: true});

        track.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            const diff = touchStartX - touchEndX;
            if (Math.abs(diff) > minSwipeDistance) {
                if (diff > 0) moveToSlide(currentIndex + 1); else moveToSlide(currentIndex - 1);
            }
            startAutoplay();
        }, {passive: true});
    }

    // Autoplay
    let autoplayInterval = 5000; // 5 seconds per slide
    let autoplayId = null;

    const startAutoplay = () => {
        if (autoplayId) return;
        autoplayId = setInterval(() => {
            moveToSlide(currentIndex + 1);
        }, autoplayInterval);
    };

    const stopAutoplay = () => {
        if (!autoplayId) return;
        clearInterval(autoplayId);
        autoplayId = null;
    };

    // Start autoplay if track exists
    if (track) startAutoplay();

    // Pause on hover/focus for accessibility
    if (track) {
        track.addEventListener('mouseenter', stopAutoplay);
        track.addEventListener('mouseleave', startAutoplay);
        track.addEventListener('focusin', stopAutoplay);
        track.addEventListener('focusout', startAutoplay);
    }

    // Event Listeners
    if (nextButton) {
        nextButton.addEventListener('click', () => {
            // Move to the next index
            moveToSlide(currentIndex + 1);
        });
    }

    if (prevButton) {
        prevButton.addEventListener('click', () => {
            // Move to the previous index
            moveToSlide(currentIndex - 1);
        });
    }
});