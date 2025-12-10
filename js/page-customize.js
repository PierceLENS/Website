/**
 * Camera Customization Page - URL-Based Configuration System
 * Camera is selected via URL parameter (?camera=pl|pl-pro|pl-lite)
 * All configuration options are dynamically loaded based on the camera
 */

// Camera configuration data
const CAMERA_CONFIGS = {
    'pl': {
        name: 'The Pierce Lens',
        basePrice: 999,
        specs: {
            sensor: '48MP',
            dynamic: '14 Stops',
            storage: 'Up to 4TB',
            connectivity: 'Wi-Fi 6E'
        },
        colors: [
            { label: 'Black', color: '#111111', finish: 'black', price: 0, image: 'the-pierce-lens.png' },
            { label: 'Brown', color: '#704214', finish: 'brown', price: 100, image: 'the-pierce-lens_brown.png' },
            { label: 'Teal', color: '#008080', finish: 'teal', price: 100, image: 'the-pierce-lens_teal.png' },
            { label: 'Olive', color: '#6B8E23', finish: 'olive', price: 100, image: 'the-pierce-lens_olive.png' },
            { label: 'Lilac', color: '#C8A2C8', finish: 'lilac', price: 150, image: 'the-pierce-lens_lilac.png' },
            { label: 'Pink', color: '#F8BBD0', finish: 'pink', price: 150, image: 'the-pierce-lens_pink.png' }
        ],
        grips: [
            { name: 'Synthetic Rubber', value: 'synthetic', price: 0, description: 'Standard grip' },
            { name: 'Italian Leather', value: 'leather', price: 150, description: 'Premium comfort grip' }
        ],
        filters: [
            { name: 'Standard 15 Filters', value: 'standard', price: 0, description: 'Included in base package' },
            { name: 'Pro Cine-Tones Expansion', value: 'pro', price: 300, description: '30+ professional color grades' }
        ]
    },
    'pl-pro': {
        name: 'The Pierce Lens Pro',
        basePrice: 1199,
        specs: {
            sensor: '61MP',
            dynamic: '15 Stops',
            storage: 'Up to 8TB',
            connectivity: 'Wi-Fi 6E + 5G'
        },
        colors: [
            { label: 'Black', color: '#111111', finish: 'black', price: 0, image: 'the-pierce-lens.png' },
            { label: 'Brown', color: '#704214', finish: 'brown', price: 100, image: 'the-pierce-lens_brown.png' },
            { label: 'Teal', color: '#008080', finish: 'teal', price: 100, image: 'the-pierce-lens_teal.png' },
            { label: 'Olive', color: '#6B8E23', finish: 'olive', price: 100, image: 'the-pierce-lens_olive.png' },
            { label: 'Lilac', color: '#C8A2C8', finish: 'lilac', price: 150, image: 'the-pierce-lens_lilac.png' },
            { label: 'Pink', color: '#F8BBD0', finish: 'pink', price: 150, image: 'the-pierce-lens_pink.png' },
            { label: 'Carbon', color: '#1a1a1a', finish: 'carbon', price: 250, image: 'the-pierce-lens_carbon.png' }
        ],
        grips: [
            { name: 'Synthetic Rubber', value: 'synthetic', price: 0, description: 'Standard grip' },
            { name: 'Italian Leather', value: 'leather', price: 150, description: 'Premium comfort grip' }
        ],
        filters: [
            { name: 'Standard 15 Filters', value: 'standard', price: 0, description: 'Included in base package' },
            { name: 'Pro Cine-Tones Expansion', value: 'pro', price: 300, description: '30+ professional color grades' }
        ]
    },
    'pl-lite': {
        name: 'PierceLENS Lite',
        basePrice: 499,
        specs: {
            sensor: '24MP',
            dynamic: '12 Stops',
            storage: 'Up to 2TB',
            connectivity: 'Wi-Fi 6'
        },
        colors: [
            { label: 'Black', color: '#111111', finish: 'black', price: 0, image: 'the-pierce-lens.png' },
            { label: 'Teal', color: '#008080', finish: 'teal', price: 50, image: 'the-pierce-lens_teal.png' },
            { label: 'Pink', color: '#F8BBD0', finish: 'pink', price: 50, image: 'the-pierce-lens_pink.png' }
        ],
        grips: [
            { name: 'Synthetic Rubber', value: 'synthetic', price: 0, description: 'Standard ergonomic grip' }
        ],
        filters: [
            { name: 'Standard 8 Filters', value: 'standard', price: 0, description: 'Essential creative filters' },
            { name: 'Pro Filter Pack', value: 'pro', price: 150, description: '20+ creative filters' }
        ]
    }
};

// Current state
let currentCamera = 'pl';
let currentPrice = 0;

/**
 * Get URL parameter
 */
function getURLParameter(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
}

/**
 * Initialize customization page
 */
document.addEventListener('DOMContentLoaded', function() {
    // Get camera from URL parameter
    const cameraParam = getURLParameter('camera');
    
    // Validate camera parameter
    if (cameraParam && CAMERA_CONFIGS[cameraParam]) {
        currentCamera = cameraParam;
    } else {
        // Default to pl if no valid parameter
        currentCamera = 'pl';
        // Update URL to reflect default
        window.history.replaceState({}, '', '?camera=pl');
    }
    
    // Initialize the customization interface
    initializeCustomization();
    setupMobileNavToggle();
});

/**
 * Initialize customization interface
 */
function initializeCustomization() {
    const config = CAMERA_CONFIGS[currentCamera];
    if (!config) {
        console.error('Invalid camera configuration');
        return;
    }
    
    // Update page title and specs
    updatePageInfo(config);
    
    // Build configuration options
    buildColorOptions(config.colors);
    buildGripOptions(config.grips);
    buildFilterOptions(config.filters);
    
    // Attach event listeners
    attachEventListeners();
    
    // Initial price update
    updatePricing();
}

/**
 * Update page information
 */
function updatePageInfo(config) {
    // Update title
    const titleElement = document.querySelector('.preview-title');
    if (titleElement) {
        titleElement.textContent = config.name;
    }
    
    // Update specs
    const specItems = document.querySelectorAll('.preview-specs .spec-item');
    const specsArray = [
        config.specs.sensor,
        config.specs.dynamic,
        config.specs.storage,
        config.specs.connectivity
    ];
    
    specItems.forEach((item, index) => {
        const strong = item.querySelector('strong');
        if (strong && specsArray[index]) {
            strong.textContent = specsArray[index];
        }
    });
    
    // Update base price in summary
    const basePriceElement = document.querySelector('.summary-row:nth-of-type(1) strong');
    if (basePriceElement) {
        basePriceElement.textContent = '$' + config.basePrice;
    }
}

/**
 * Build color swatches
 */
function buildColorOptions(colors) {
    const container = document.querySelector('.color-swatches');
    if (!container) return;
    
    container.innerHTML = '';
    
    colors.forEach((color, index) => {
        const swatch = document.createElement('div');
        swatch.className = 'color-swatch' + (index === 0 ? ' selected' : '');
        swatch.style.backgroundColor = color.color;
        swatch.setAttribute('data-label', color.label);
        swatch.setAttribute('data-finish', color.finish);
        swatch.setAttribute('data-price', color.price);
        swatch.setAttribute('data-image', color.image);
        
        container.appendChild(swatch);
    });
}

/**
 * Build grip options
 */
function buildGripOptions(grips) {
    const container = document.querySelector('.option-section:nth-of-type(2) .option-choices');
    if (!container) return;
    
    container.innerHTML = '';
    
    grips.forEach((grip, index) => {
        const label = document.createElement('label');
        label.className = 'option-label' + (index === 0 ? ' selected' : '');
        label.setAttribute('data-option', 'grip');
        label.setAttribute('data-value', grip.value);
        label.setAttribute('data-price', grip.price);
        
        label.innerHTML = `
            <input type="radio" name="grip" value="${grip.value}" ${index === 0 ? 'checked' : ''}>
            <div class="custom-radio"></div>
            <div class="label-content">
                <strong>${grip.name}</strong>
                <p style="font-size: 12px; color: var(--color-text-secondary);">${grip.description}</p>
            </div>
            <span class="label-price">${grip.price === 0 ? 'Included' : '+$' + grip.price}</span>
        `;
        
        container.appendChild(label);
    });
}

/**
 * Build filter options
 */
function buildFilterOptions(filters) {
    const container = document.querySelector('.option-section:nth-of-type(3) .option-choices');
    if (!container) return;
    
    container.innerHTML = '';
    
    filters.forEach((filter, index) => {
        const label = document.createElement('label');
        label.className = 'option-label' + (index === 0 ? ' selected' : '');
        label.setAttribute('data-option', 'filter');
        label.setAttribute('data-value', filter.value);
        label.setAttribute('data-price', filter.price);
        
        label.innerHTML = `
            <input type="radio" name="filter" value="${filter.value}" ${index === 0 ? 'checked' : ''}>
            <div class="custom-radio"></div>
            <div class="label-content">
                <strong>${filter.name}</strong>
                <p style="font-size: 12px; color: var(--color-text-secondary);">${filter.description}</p>
            </div>
            <span class="label-price">${filter.price === 0 ? 'Included' : '+$' + filter.price}</span>
        `;
        
        container.appendChild(label);
    });
}

/**
 * Attach event listeners
 */
function attachEventListeners() {
    // Color swatch selection
    document.querySelectorAll('.color-swatch').forEach(swatch => {
        swatch.addEventListener('click', function() {
            document.querySelectorAll('.color-swatch').forEach(s => s.classList.remove('selected'));
            this.classList.add('selected');
            updatePreviewImage(this.getAttribute('data-image'));
            updatePricing();
        });
    });
    
    // Option label selection (grips and filters)
    document.querySelectorAll('.option-label').forEach(label => {
        label.addEventListener('click', function() {
            const option = this.getAttribute('data-option');
            document.querySelectorAll(`[data-option="${option}"]`).forEach(l => l.classList.remove('selected'));
            this.classList.add('selected');
            updatePricing();
        });
    });
    
    // Add to cart button
    const addToCartBtn = document.getElementById('add-to-cart-btn');
    if (addToCartBtn) {
        addToCartBtn.addEventListener('click', handleAddToCart);
    }
}

/**
 * Update preview image
 */
function updatePreviewImage(imageName) {
    const img = document.getElementById('previewImage');
    if (!img) return;
    
    const newSrc = `../images/products/the_pierce_lens/${imageName}`;
    if (img.src.includes(imageName)) return;
    
    img.style.transition = 'opacity 0.4s ease';
    img.style.opacity = '0';
    
    setTimeout(() => {
        img.src = newSrc;
        img.style.opacity = '1';
    }, 400);
}

/**
 * Update pricing display
 */
function updatePricing() {
    const config = CAMERA_CONFIGS[currentCamera];
    let upgrades = 0;
    
    // Get selected color price
    const selectedColor = document.querySelector('.color-swatch.selected');
    if (selectedColor) {
        upgrades += parseFloat(selectedColor.getAttribute('data-price')) || 0;
    }
    
    // Get selected grip price
    const selectedGrip = document.querySelector('[data-option="grip"].selected');
    if (selectedGrip) {
        upgrades += parseFloat(selectedGrip.getAttribute('data-price')) || 0;
    }
    
    // Get selected filter price
    const selectedFilter = document.querySelector('[data-option="filter"].selected');
    if (selectedFilter) {
        upgrades += parseFloat(selectedFilter.getAttribute('data-price')) || 0;
    }
    
    currentPrice = config.basePrice + upgrades;
    
    // Update display
    const upgradesTotal = document.getElementById('upgradesTotal');
    const totalPrice = document.getElementById('totalPrice');
    const upgradesRow = document.getElementById('upgrades');
    
    if (upgradesTotal) upgradesTotal.textContent = '$' + upgrades;
    if (totalPrice) totalPrice.textContent = '$' + currentPrice;
    
    // Show/hide upgrades row
    if (upgradesRow) {
        upgradesRow.style.display = upgrades > 0 ? 'flex' : 'none';
    }
}

/**
 * Handle add to cart
 */
function handleAddToCart() {
    const config = CAMERA_CONFIGS[currentCamera];
    
    // Get selections
    const selectedColor = document.querySelector('.color-swatch.selected');
    const selectedGrip = document.querySelector('[data-option="grip"].selected input:checked');
    const selectedFilter = document.querySelector('[data-option="filter"].selected input:checked');
    
    const customizations = {
        'Body Finish': selectedColor ? selectedColor.getAttribute('data-label') : 'Black',
        'Grip': selectedGrip ? selectedGrip.value : 'synthetic',
        'Filters': selectedFilter ? selectedFilter.value : 'standard'
    };
    
    const cartItem = {
        name: config.name,
        price: currentPrice,
        quantity: 1,
        image: '../images/products/the_pierce_lens/' + (selectedColor ? selectedColor.getAttribute('data-image') : 'the-pierce-lens.png'),
        customizations: customizations
    };
    
    if (typeof ShoppingCart !== 'undefined') {
        ShoppingCart.addItem(cartItem);
        ShoppingCart.showAddConfirmation(config.name);
        setTimeout(() => {
            window.location.href = '../cart/index.html';
        }, 1500);
    } else {
        alert('Unable to add to cart. Please refresh the page.');
    }
}

/**
 * Mobile navigation toggle
 */
function setupMobileNavToggle() {
    // Add animation delay to option sections
    document.querySelectorAll('.option-section').forEach((section, index) => {
        section.style.animationDelay = `${index * 0.1}s`;
    });
}

// All obsolete functions removed - camera selection now handled via URL parameters
