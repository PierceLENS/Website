document.addEventListener('DOMContentLoaded', () => {
    const header = document.querySelector('header');
    const heroBanner = document.getElementById('hero');
    
    function checkScroll() {
        if (!heroBanner) return;
        
        // Get the bottom edge of the hero banner
        const heroBottom = heroBanner.offsetTop + heroBanner.offsetHeight;
        
        // If scrolled past the hero banner, add the scrolled class
        if (window.scrollY > heroBottom) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }

    // Attach the function to the scroll event
    window.addEventListener('scroll', checkScroll);
    
    // Run once on load, in case the user opens the page already scrolled down
    checkScroll();
});