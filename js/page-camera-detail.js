/**
 * Camera Product Detail Pages Script
 * Used by: cameras/the-pierce-lens/index.html and cameras/the-pierce-lens-pro/index.html
 */

// Customize buttons handler (supports multiple CTA instances)
document.querySelectorAll('.customize-camera-btn').forEach((btn) => {
    btn.addEventListener('click', (e) => {
        e.preventDefault();
        const cameraId = btn.dataset.cameraId || 'pl';
        const cameraName = btn.dataset.cameraName || 'The Pierce Lens';
        if (typeof CameraSelection !== 'undefined') {
            CameraSelection.goToCustomize(cameraId, cameraName);
        } else {
            window.location.href = '../../customize/index.html';
        }
    });
});

// Initialize scroll animations for pro page
if (document.body.classList.contains('pro-version') && document.querySelector('.scroll-reveal-container')) {
    initProScrollAnimations();
}

/**
 * Initialize Pro version scroll animations
 */
function initProScrollAnimations() {
    const cameraImage = document.getElementById('cameraImage');
    const cameraGlow = document.querySelector('.camera-glow');
    const cameraCoreGlow = document.querySelector('.camera-core-glow');
    const cameraOuterRing = document.querySelector('.camera-outer-ring');
    const textOverlay = document.getElementById('textOverlay');
    const scrollContainer = document.querySelector('.scroll-reveal-container');
    const scrollIndicator = document.getElementById('scrollIndicator');

    function updateCameraReveal() {
        if (!scrollContainer || !cameraImage) return;

        const scrollContainerTop = scrollContainer.offsetTop;
        const scrollContainerHeight = scrollContainer.offsetHeight;
        const windowHeight = window.innerHeight;
        
        const scrollY = window.scrollY;
        const elementStart = scrollContainerTop;
        
        let scrollProgress = (scrollY - elementStart) / (scrollContainerHeight - windowHeight);
        scrollProgress = Math.max(0, Math.min(1, scrollProgress));

        // Phase 1: Explosive scale in with 3D rotation
        if (scrollProgress <= 0.25) {
            const phase1 = scrollProgress / 0.25;
            const scale = 0.2 + phase1 * 0.6;
            const rotX = 90 - phase1 * 80;
            const rotZ = -45 + phase1 * 40;
            const rotY = -20 + phase1 * 20;
            
            cameraImage.style.transform = `scale(${scale}) rotateX(${rotX}deg) rotateZ(${rotZ}deg) rotateY(${rotY}deg)`;
            cameraImage.style.opacity = phase1 * 0.8;
        }
        // Phase 2: Mid-flight adjustments
        else if (scrollProgress <= 0.5) {
            const phase2 = (scrollProgress - 0.25) / 0.25;
            const scale = 0.8 + phase2 * 0.15;
            const rotX = 10 - phase2 * 10;
            const rotZ = -5 + phase2 * 2;
            
            cameraImage.style.transform = `scale(${scale}) rotateX(${rotX}deg) rotateZ(${rotZ}deg) rotateY(0)`;
            cameraImage.style.opacity = 0.8 + phase2 * 0.2;
        }
        // Phase 3: Landing position
        else if (scrollProgress <= 0.75) {
            const scale = 0.95 + ((scrollProgress - 0.5) / 0.25) * 0.05;
            cameraImage.style.transform = `scale(${scale}) rotateX(0deg) rotateZ(-3deg) rotateY(0)`;
            cameraImage.style.opacity = 1;
        }
        // Phase 4: Final rest state
        else {
            cameraImage.style.transform = `scale(1) rotateX(0deg) rotateZ(-2deg) rotateY(0)`;
            cameraImage.style.opacity = 1;
        }

        // Multi-layer glow animation
        if (cameraGlow) {
            const glowOpacity = Math.sin(scrollProgress * Math.PI) * 0.9;
            const glowScale = 0.4 + scrollProgress * 1.8;
            cameraGlow.style.opacity = glowOpacity;
            cameraGlow.style.transform = `scale(${glowScale})`;
        }

        // Core glow
        if (cameraCoreGlow && cameraCoreGlow !== cameraGlow) {
            const coreGlowOpacity = Math.sin(scrollProgress * Math.PI * 1.5) * 0.6;
            const coreGlowScale = 0.3 + scrollProgress * 1.2;
            cameraCoreGlow.style.opacity = coreGlowOpacity;
            cameraCoreGlow.style.transform = `scale(${coreGlowScale})`;
        }

        // Outer ring animation
        if (cameraOuterRing) {
            const ringOpacity = Math.sin((scrollProgress + 0.3) * Math.PI) * 0.7;
            const ringScale = 0.5 + scrollProgress * 2.0;
            const ringRotation = scrollProgress * 720;
            
            cameraOuterRing.style.opacity = ringOpacity;
            cameraOuterRing.style.transform = `scale(${ringScale}) rotateZ(${ringRotation}deg)`;
        }

        // Text animation
        if (textOverlay) {
            if (scrollProgress <= 0.5) {
                const textPhase = Math.max(0, (scrollProgress - 0.15) / 0.25);
                textOverlay.style.opacity = textPhase;
                textOverlay.style.transform = `translateY(${50 - textPhase * 50}px) scale(${0.95 + textPhase * 0.05})`;
            } else {
                textOverlay.style.opacity = 1;
                textOverlay.style.transform = `translateY(0) scale(1)`;
            }
        }

        // Scroll indicator
        if (scrollIndicator) {
            if (scrollProgress > 0.1) {
                scrollIndicator.style.opacity = 0;
                scrollIndicator.style.pointerEvents = 'none';
            } else {
                scrollIndicator.style.opacity = 1 - scrollProgress * 10;
                scrollIndicator.style.pointerEvents = 'auto';
            }
        }
    }

    window.addEventListener('scroll', updateCameraReveal);
    window.addEventListener('resize', updateCameraReveal);
    updateCameraReveal();

    // Initialize feature card observer
    initProFeatureCards();

    // Run shared observers for features and price strip
    initFeatureObserver();
    initPriceStripScroll('#priceStrip');

    // Parallax background
    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        const revealContainer = document.querySelector('.scroll-reveal-container');
        if (revealContainer) {
            revealContainer.style.backgroundPosition = `0 ${scrollY * 0.3}px`;
        }
    });

    // Cursor-following glow
    document.addEventListener('mousemove', (e) => {
        const coreGlow = document.querySelector('.camera-core-glow');
        if (coreGlow && e.clientY < window.innerHeight * 1.5) {
            const x = e.clientX / window.innerWidth;
            coreGlow.style.filter = `blur(${60 + x * 20}px)`;
        }
    });

    // Loading animation for pro badge
    setTimeout(() => {
        const proBadge = document.querySelector('.pro-badge');
        if (proBadge) {
            proBadge.style.opacity = '1';
        }
    }, 500);
}

/**
 * Initialize pro feature cards observer
 */
function initProFeatureCards() {
    const cardObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add('visible');
                    entry.target.style.animation = `none`;
                    setTimeout(() => {
                        entry.target.style.animation = `floatUp 0.6s ease-out`;
                    }, 10);
                }, index * 80);
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: '0px 0px -80px 0px'
    });

    document.querySelectorAll('.feature-card').forEach(card => cardObserver.observe(card));
    document.querySelectorAll('.spec-item').forEach(spec => cardObserver.observe(spec));
}
