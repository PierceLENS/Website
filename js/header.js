document.addEventListener('DOMContentLoaded', () => {
    const header = document.querySelector('header');
    const heroBanner = document.getElementById('hero');
    
    function checkScroll() {
        // If there's no hero on this page, default to scrolled state (solid header)
        if (!heroBanner) {
            header.classList.add('scrolled');
            return;
        }

        // Bottom edge of hero
        const heroBottom = heroBanner.offsetTop + heroBanner.offsetHeight;

        if (window.scrollY > heroBottom) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }

    // If nav toggle exists, keep aria-expanded in sync when nav-open is toggled (for non-home pages too)
    const navToggle = document.querySelector('.nav-toggle');
    const navLinks = document.querySelector('.nav-links');
    if (navToggle && navLinks) {
        navToggle.addEventListener('click', () => {
            const expanded = navToggle.getAttribute('aria-expanded') === 'true';
            navToggle.setAttribute('aria-expanded', (!expanded).toString());
            navLinks.classList.toggle('nav-open');
            navToggle.classList.toggle('open');
        });
    }

    // Mobile dropdown toggle
    const navDropdowns = document.querySelectorAll('.nav-dropdown > a');
    navDropdowns.forEach(dropdown => {
        dropdown.addEventListener('click', (e) => {
            // Only prevent default and toggle on mobile
            if (window.innerWidth <= 900) {
                e.preventDefault();
                const parent = dropdown.parentElement;
                const isOpen = parent.classList.contains('open');
                
                // Close all other dropdowns
                document.querySelectorAll('.nav-dropdown').forEach(d => {
                    if (d !== parent) d.classList.remove('open');
                });
                
                // Toggle current dropdown
                parent.classList.toggle('open');
            }
        });
    });

    // Attach the function to the scroll event
    window.addEventListener('scroll', checkScroll, { passive: true });
    window.addEventListener('resize', checkScroll, { passive: true });
    
    // Run once on load, in case the user opens the page already scrolled down
    checkScroll();
});