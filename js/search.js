// Search functionality
document.addEventListener('DOMContentLoaded', () => {
    const searchTrigger = document.getElementById('search-trigger');
    const searchModal = document.getElementById('search-modal');
    const searchClose = document.getElementById('search-close');
    const searchInput = document.getElementById('search-input');
    const searchResults = document.getElementById('search-results');

    // Search database - all searchable content
    const searchData = [
        // Pierce Lens Lineup
        {
            title: 'Pierce Lens',
            description: 'View the complete Pierce Lens lineup',
            url: 'cameras/pierce-lens/index.html',
            category: 'Camera Line',
            icon: 'fa-camera',
            keywords: ['camera', 'pierce', 'lens', 'lineup', 'models', 'compare']
        },
        {
            title: 'Pierce Lens',
            description: 'Professional cinema camera - 6K, 120fps',
            url: 'cameras/the-pierce-lens/index.html',
            category: 'Camera',
            icon: 'fa-camera',
            keywords: ['camera', 'cinema', 'professional', 'pierce', 'lens', 'pl', '6k', 'base']
        },
        {
            title: 'Pierce Lens Pro',
            description: 'Advanced cinema camera - 8K, 240fps',
            url: 'cameras/the-pierce-lens-pro/index.html',
            category: 'Camera',
            icon: 'fa-camera',
            keywords: ['camera', 'cinema', 'professional', 'pierce', 'lens', 'pro', 'advanced', 'plp', '8k']
        },
        {
            title: 'Pierce Lens Lite',
            description: 'Compact cinema camera - Coming 2026',
            url: 'cameras/pierce-lens/index.html',
            category: 'Camera (Coming Soon)',
            icon: 'fa-camera',
            keywords: ['camera', 'cinema', 'pierce', 'lens', 'lite', 'compact', '4k', 'coming', 'soon']
        },
        // Pages
        {
            title: 'Customize Your Camera',
            description: 'Build and customize your perfect camera',
            url: 'customize/index.html',
            category: 'Page',
            icon: 'fa-sliders',
            keywords: ['customize', 'build', 'configure', 'options', 'personalize']
        },
        {
            title: 'Store',
            description: 'Browse all products and accessories',
            url: 'store/index.html',
            category: 'Page',
            icon: 'fa-store',
            keywords: ['store', 'shop', 'buy', 'purchase', 'products', 'accessories']
        },
        {
            title: 'Support',
            description: 'Get help and technical support',
            url: 'support/index.html',
            category: 'Page',
            icon: 'fa-headset',
            keywords: ['support', 'help', 'contact', 'technical', 'assistance', 'faq']
        },
        {
            title: 'Press & Media',
            description: 'Media resources and press kit',
            url: 'press/index.html',
            category: 'Page',
            icon: 'fa-newspaper',
            keywords: ['press', 'media', 'news', 'kit', 'resources']
        },
        {
            title: 'Privacy Policy',
            description: 'Our privacy and data policy',
            url: 'privacy/index.html',
            category: 'Legal',
            icon: 'fa-shield-halved',
            keywords: ['privacy', 'policy', 'data', 'legal']
        },
        {
            title: 'Terms & Conditions',
            description: 'Terms of service and conditions',
            url: 'policy/index.html',
            category: 'Legal',
            icon: 'fa-file-contract',
            keywords: ['terms', 'conditions', 'policy', 'legal', 'service']
        },
        // Accessories/Products (can be expanded)
        {
            title: 'Mini NVMe Module',
            description: 'High-speed storage expansion',
            url: 'store/index.html',
            category: 'Accessory',
            icon: 'fa-microchip',
            keywords: ['nvme', 'storage', 'module', 'ssd', 'expansion', 'memory']
        },
        {
            title: 'Pro Cine Tones Pack',
            description: 'Professional color grading presets',
            url: 'store/index.html',
            category: 'Software',
            icon: 'fa-palette',
            keywords: ['cine', 'tones', 'color', 'grading', 'presets', 'lut', 'professional']
        }
    ];

    // Open search modal
    if (searchTrigger) {
        searchTrigger.addEventListener('click', (e) => {
            e.preventDefault();
            searchModal.classList.add('active');
            searchInput.focus();
            document.body.classList.add('modal-open');
        });
    }

    // Close search modal
    function closeSearch() {
        searchModal.classList.remove('active');
        searchInput.value = '';
        searchResults.innerHTML = '';
        document.body.classList.remove('modal-open');
    }

    if (searchClose) {
        searchClose.addEventListener('click', closeSearch);
    }

    // Close on background click
    searchModal.addEventListener('click', (e) => {
        if (e.target === searchModal) {
            closeSearch();
        }
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && searchModal.classList.contains('active')) {
            closeSearch();
        }
    });

    // Search function
    function performSearch(query) {
        if (!query || query.trim().length === 0) {
            searchResults.innerHTML = '';
            return;
        }

        query = query.toLowerCase().trim();
        
        // Filter results
        const results = searchData.filter(item => {
            return item.title.toLowerCase().includes(query) ||
                   item.description.toLowerCase().includes(query) ||
                   item.keywords.some(keyword => keyword.includes(query));
        });

        // Display results
        if (results.length === 0) {
            searchResults.innerHTML = `
                <div class="search-no-results">
                    <i class="fa-solid fa-magnifying-glass"></i>
                    <p>No results found for "${query}"</p>
                </div>
            `;
        } else {
            searchResults.innerHTML = results.map(item => `
                <a href="${item.url}" class="search-result-item">
                    <div class="search-result-icon">
                        <i class="fa-solid ${item.icon}"></i>
                    </div>
                    <div class="search-result-info">
                        <h4>${item.title}</h4>
                        <p>${item.description} • ${item.category}</p>
                    </div>
                </a>
            `).join('');
        }
    }

    // Search input listener with debounce
    let searchTimeout;
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                performSearch(e.target.value);
            }, 200);
        });
    }
});

