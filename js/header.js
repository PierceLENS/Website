document.addEventListener('DOMContentLoaded', () => {
    const header = document.querySelector('header');
    
    // Define the scroll threshold (how far down user must scroll before line appears)
    const scrollThreshold = 50; // In pixels

    function checkScroll() {
        // Check if the vertical scroll position is greater than the threshold
        if (window.scrollY > scrollThreshold) {
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