document.addEventListener('DOMContentLoaded', () => {
    const header = document.querySelector('header');
    const heroBanner = document.getElementById('hero');
    const navToggle = document.querySelector('.nav-toggle');
    const navLinks = document.querySelector('.nav-links');
    const body = document.body;

    // Lazy-load auth script across all pages
    if (!document.getElementById('pl-auth-script')) {
        const headerScript = document.currentScript || document.querySelector('script[src*="header.js"]');
        const scriptSrc = headerScript ? headerScript.getAttribute('src') || '' : 'js/header.js';
        const basePath = scriptSrc.includes('/') ? scriptSrc.substring(0, scriptSrc.lastIndexOf('/') + 1) : '';

        const s = document.createElement('script');
        s.src = `${basePath}auth.js`;
        s.id = 'pl-auth-script';
        document.body.appendChild(s);
    }
    
    function checkScroll() {
        if (!heroBanner) {
            header.classList.add('scrolled');
            return;
        }
        const heroBottom = heroBanner.offsetTop + heroBanner.offsetHeight;
        if (window.scrollY > heroBottom) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }

    // Mobile nav toggle
    if (navToggle && navLinks) {
        navToggle.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const isOpen = navLinks.classList.contains('nav-open');
            if (isOpen) {
                navLinks.classList.remove('nav-open');
                navToggle.classList.remove('open');
                navToggle.setAttribute('aria-expanded', 'false');
                body.style.overflow = '';
            } else {
                navLinks.classList.add('nav-open');
                navToggle.classList.add('open');
                navToggle.setAttribute('aria-expanded', 'true');
                body.style.overflow = 'hidden';
            }
        });

        // Close nav when clicking a link
        navLinks.querySelectorAll('a').forEach(item => {
            item.addEventListener('click', function(e) {
                const parent = item.closest('.nav-dropdown');
                if (parent && window.innerWidth <= 900 && item === parent.querySelector(':scope > a')) {
                    return;
                }
                
                navLinks.classList.remove('nav-open');
                navToggle.classList.remove('open');
                navToggle.setAttribute('aria-expanded', 'false');
                body.style.overflow = '';
            });
        });

        // Close nav when clicking outside
        document.addEventListener('click', function(e) {
            if (!navToggle.contains(e.target) && !navLinks.contains(e.target)) {
                navLinks.classList.remove('nav-open');
                navToggle.classList.remove('open');
                navToggle.setAttribute('aria-expanded', 'false');
                body.style.overflow = '';
            }
        });
    } else {
        // navToggle or navLinks not found
    }

    // Mobile dropdown toggle
    document.querySelectorAll('.nav-dropdown > a').forEach(dropdown => {
        dropdown.addEventListener('click', function(e) {
            if (window.innerWidth <= 900) {
                e.preventDefault();
                const parent = dropdown.parentElement;
                const isOpen = parent.classList.contains('open');
                
                document.querySelectorAll('.nav-dropdown').forEach(d => {
                    if (d !== parent) d.classList.remove('open');
                });
                
                parent.classList.toggle('open');
            }
        });
    });

    window.addEventListener('scroll', checkScroll, { passive: true });
    window.addEventListener('resize', checkScroll, { passive: true });
    
    checkScroll();
});
