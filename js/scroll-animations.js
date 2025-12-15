/**
 * Scroll Animation Module
 * Handles scroll-based reveal animations, parallax effects, and intersection observers
 */

// Scroll reveal container animation
function initScrollReveal(containerSelector, config = {}) {
    const scrollContainer = document.querySelector(containerSelector);
    if (!scrollContainer) return;

    const {
        imageSelector = '#cameraImage',
        glowSelector = '.camera-glow',
        textSelector = '#textOverlay',
        indicatorSelector = '#scrollIndicator',
        onProgress = null
    } = config;

    const cameraImage = document.querySelector(imageSelector);
    const cameraGlow = document.querySelector(glowSelector);
    const textOverlay = document.querySelector(textSelector);
    const scrollIndicator = document.querySelector(indicatorSelector);

    function updateCameraReveal() {
        if (!cameraImage) return;

        const scrollContainerTop = scrollContainer.offsetTop;
        const scrollContainerHeight = scrollContainer.offsetHeight;
        const windowHeight = window.innerHeight;
        
        const scrollY = window.scrollY;
        const elementStart = scrollContainerTop;
        
        let scrollProgress = (scrollY - elementStart) / (scrollContainerHeight - windowHeight);
        scrollProgress = Math.max(0, Math.min(1, scrollProgress));

        // Call custom progress handler if provided
        if (typeof onProgress === 'function') {
            onProgress(scrollProgress);
            return;
        }

        // Default animation: Phase 1-3
        if (scrollProgress <= 0.3) {
            const phase1 = scrollProgress / 0.3;
            const scale = 0.3 + phase1 * 0.5;
            cameraImage.style.transform = `scale(${scale}) rotateX(${90 - phase1 * 70}deg) rotateZ(${-45 + phase1 * 35}deg)`;
            cameraImage.style.opacity = phase1 * 0.7;
        } else if (scrollProgress <= 0.6) {
            const phase2 = (scrollProgress - 0.3) / 0.3;
            const scale = 0.8 + phase2 * 0.2;
            const rotX = 20 - phase2 * 20;
            const rotZ = -10 + phase2 * 5;
            cameraImage.style.transform = `scale(${scale}) rotateX(${rotX}deg) rotateZ(${rotZ}deg)`;
            cameraImage.style.opacity = 0.7 + phase2 * 0.3;
        } else {
            cameraImage.style.transform = `scale(1) rotateX(0deg) rotateZ(-5deg)`;
            cameraImage.style.opacity = 1;
        }

        // Glow animation
        if (cameraGlow) {
            const glowOpacity = Math.sin(scrollProgress * Math.PI) * 0.8;
            const glowScale = 0.5 + scrollProgress * 1.5;
            cameraGlow.style.opacity = glowOpacity;
            cameraGlow.style.transform = `scale(${glowScale})`;
        }

        // Text animation
        if (textOverlay) {
            if (scrollProgress <= 0.4) {
                const textPhase = Math.max(0, (scrollProgress - 0.2) / 0.2);
                textOverlay.style.opacity = textPhase;
                textOverlay.style.transform = `translateY(${50 - textPhase * 50}px)`;
            } else {
                textOverlay.style.opacity = 1;
                textOverlay.style.transform = `translateY(0)`;
            }
        }

        // Scroll indicator fade
        if (scrollIndicator) {
            if (scrollProgress > 0.1) {
                scrollIndicator.style.opacity = 0;
                scrollIndicator.style.pointerEvents = 'none';
            } else {
                scrollIndicator.style.opacity = 1;
                scrollIndicator.style.pointerEvents = 'auto';
            }
        }
    }

    window.addEventListener('scroll', updateCameraReveal);
    window.addEventListener('resize', updateCameraReveal);
    updateCameraReveal();
}

// Feature section observer for animations
function initFeatureObserver(sectionSelector = '.feature-section', config = {}) {
    const {
        threshold = 0.2,
        rootMargin = '0px 0px -100px 0px',
        textClass = '.feature-text',
        visualClass = '.feature-visual'
    } = config;

    const observerOptions = {
        threshold,
        rootMargin
    };

    const featureObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const textElement = entry.target.querySelector(textClass);
                const visualElement = entry.target.querySelector(visualClass);
                
                if (textElement) textElement.classList.add('in-view');
                if (visualElement) visualElement.classList.add('in-view');
                
                featureObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll(sectionSelector).forEach(section => {
        featureObserver.observe(section);
    });
}

// Price strip visibility on scroll
function initPriceStripScroll(stripSelector = '#priceStrip', triggerHeight = 0.5) {
    const priceStrip = document.querySelector(stripSelector);
    if (!priceStrip) return;
    
    function updatePriceStrip() {
        const scrollY = window.scrollY;
        const windowHeight = window.innerHeight;
        
        if (scrollY > windowHeight * triggerHeight) {
            priceStrip.classList.add('visible');
        } else {
            priceStrip.classList.remove('visible');
        }
    }
    
    window.addEventListener('scroll', updatePriceStrip);
    updatePriceStrip();
}

// Export functions
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initScrollReveal,
        initFeatureObserver,
        initPriceStripScroll
    };
}


