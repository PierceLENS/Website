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
        ],
        accessories: [
            { id: 'mini-nvme-1tb', name: 'Mini-NVMe Module (1TB)', price: 120, description: 'High-speed removable storage', image: '../images/products/accessories/mini_nvme_module/mini-nvme-module.png' },
            { id: 'tripod', name: 'Tripod', price: 35, description: 'Stable support for your camera', image: '../images/products/accessories/tripod/tripod.png' },
            { id: 'soft-case', name: 'Soft Camera Case', price: 45, description: 'Protective soft case', image: '../images/products/accessories/soft_camera_case/soft_camera_case.png' },
            { id: 'hard-case', name: 'Hard Camera Case', price: 89, description: 'Premium protection', image: '../images/products/accessories/hard_camera_case/hard_camera_case.png' },
            { id: 'neck-strap', name: 'Neck Strap', price: 29, description: 'Comfortable camera strap', image: '../images/products/accessories/neck_strap/neck_strap.png' },
            { id: 'cleaning-kit', name: 'Lens Cleaning Kit', price: 25, description: 'Keep your lens clear', image: '../images/products/accessories/lens_cleaning_kit/lens_cleaning_kit.png' }
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
            { label: 'Black', color: '#111111', finish: 'black', price: 0, image: 'pierceLENS_Pro.png' },
            { label: 'Brown', color: '#704214', finish: 'brown', price: 100, image: 'pierceLENS_Pro.png' },
            { label: 'Teal', color: '#008080', finish: 'teal', price: 100, image: 'pierceLENS_Pro.png' },
            { label: 'Olive', color: '#6B8E23', finish: 'olive', price: 100, image: 'pierceLENS_Pro.png' },
            { label: 'Lilac', color: '#C8A2C8', finish: 'lilac', price: 150, image: 'pierceLENS_Pro.png' },
            { label: 'Pink', color: '#F8BBD0', finish: 'pink', price: 150, image: 'pierceLENS_Pro.png' },
            { label: 'Carbon', color: '#1a1a1a', finish: 'carbon', price: 250, image: 'pierceLENS_Pro.png' }
        ],
        grips: [
            { name: 'Synthetic Rubber', value: 'synthetic', price: 0, description: 'Standard grip' },
            { name: 'Italian Leather', value: 'leather', price: 150, description: 'Premium comfort grip' }
        ],
        filters: [
            { name: 'Standard 15 Filters', value: 'standard', price: 0, description: 'Included in base package' },
            { name: 'Pro Cine-Tones Expansion', value: 'pro', price: 300, description: '30+ professional color grades' }
        ],
        accessories: [
            { id: 'mini-nvme-1tb', name: 'Mini-NVMe Module (1TB)', price: 120, description: 'High-speed removable storage', image: '../images/products/accessories/mini_nvme_module/mini-nvme-module.png' },
            { id: 'tripod', name: 'Tripod', price: 35, description: 'Stable support for your camera', image: '../images/products/accessories/tripod/tripod.png' },
            { id: 'soft-case', name: 'Soft Camera Case', price: 45, description: 'Protective soft case', image: '../images/products/accessories/soft_camera_case/soft_camera_case.png' },
            { id: 'hard-case', name: 'Hard Camera Case', price: 89, description: 'Premium protection', image: '../images/products/accessories/hard_camera_case/hard_camera_case.png' },
            { id: 'neck-strap', name: 'Neck Strap', price: 29, description: 'Comfortable camera strap', image: '../images/products/accessories/neck_strap/neck_strap.png' },
            { id: 'cleaning-kit', name: 'Lens Cleaning Kit', price: 25, description: 'Keep your lens clear', image: '../images/products/accessories/lens_cleaning_kit/lens_cleaning_kit.png' }
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
        ],
        accessories: [
            { id: 'mini-nvme-1tb', name: 'Mini-NVMe Module (1TB)', price: 120, description: 'High-speed removable storage', image: '../images/products/accessories/mini_nvme_module/mini-nvme-module.png' },
            { id: 'tripod', name: 'Tripod', price: 35, description: 'Stable support for your camera', image: '../images/products/accessories/tripod/tripod.png' },
            { id: 'soft-case', name: 'Soft Camera Case', price: 45, description: 'Protective soft case', image: '../images/products/accessories/soft_camera_case/soft_camera_case.png' },
            { id: 'hard-case', name: 'Hard Camera Case', price: 89, description: 'Premium protection', image: '../images/products/accessories/hard_camera_case/hard_camera_case.png' },
            { id: 'neck-strap', name: 'Neck Strap', price: 29, description: 'Comfortable camera strap', image: '../images/products/accessories/neck_strap/neck_strap.png' },
            { id: 'cleaning-kit', name: 'Lens Cleaning Kit', price: 25, description: 'Keep your lens clear', image: '../images/products/accessories/lens_cleaning_kit/lens_cleaning_kit.png' }
        ]
    }
};

// Current state
let currentCamera = 'pl';
let currentPrice = 0;
let currentSectionIndex = 0;
const totalSections = 4; // Color, Grip, Filter, Accessories

/**
 * Get URL parameter
 */
function getURLParameter(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
}

/**
 * Activate a specific section
 */
function activateSection(index) {
    const sections = document.querySelectorAll('.option-section');
    if (index < 0 || index >= sections.length) return;
    
    currentSectionIndex = index;
    
    sections.forEach((section, i) => {
        section.classList.remove('active', 'completed');
        
        if (i < index) {
            section.classList.add('completed');
        } else if (i === index) {
            section.classList.add('active');
            // Smooth scroll to active section
            setTimeout(() => {
                section.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, 100);
        }
    });
}

/**
 * Move to next section
 */
function nextSection() {
    if (currentSectionIndex < totalSections - 1) {
        activateSection(currentSectionIndex + 1);
    }
}

/**
 * Check if section has a selection
 */
function isSectionComplete(index) {
    if (index === 0) {
        // Color section - always has a selection (default black)
        return true;
    } else if (index === 1) {
        // Grip section
        return document.querySelector('[data-option="grip"].selected') !== null;
    } else if (index === 2) {
        // Filter section
        return document.querySelector('[data-option="filter"].selected') !== null;
    } else if (index === 3) {
        // Accessories section - optional, always complete
        return true;
    }
    return false;
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
    
    // Initialize scroll handler for preview
    handlePreviewScroll();
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
    buildAccessoriesOptions(config.accessories);
    
    // Apply animation delays to option sections
    document.querySelectorAll('.option-section').forEach((section, index) => {
        section.style.animationDelay = `${index * 0.1}s`;
    });
    
    // Activate first section
    activateSection(0);
    
    // Allow clicking on section headers to navigate
    document.querySelectorAll('.option-section').forEach((section, index) => {
        section.addEventListener('click', function(e) {
            // Only allow navigation to completed sections or current section
            if (this.classList.contains('completed') || this.classList.contains('active')) {
                if (e.target.closest('h3') || this.classList.contains('completed')) {
                    activateSection(index);
                }
            }
        });
    });
    
    // Set initial preview image
    if (config.colors && config.colors.length > 0) {
        updatePreviewImage(config.colors[0].image);
    }
    
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
        swatch.setAttribute('data-color', color.color);
        
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
 * Build accessories options
 */
function buildAccessoriesOptions(accessories) {
    const container = document.querySelector('.option-section:nth-of-type(4) .option-choices');
    if (!container) return;
    
    container.innerHTML = '';
    
    accessories.forEach((accessory) => {
        const label = document.createElement('label');
        label.className = 'option-label';
        label.setAttribute('data-option', 'accessory');
        label.setAttribute('data-value', accessory.id);
        label.setAttribute('data-price', accessory.price);
        
        label.innerHTML = `
            <input type="checkbox" name="accessory-${accessory.id}" value="${accessory.id}">
            <div class="custom-checkbox"></div>
            <div class="label-content">
                <strong>${accessory.name}</strong>
                <p style="font-size: 12px; color: var(--color-text-secondary);">${accessory.description}</p>
            </div>
            <span class="label-price">+$${accessory.price}</span>
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
        swatch.addEventListener('click', function(e) {
            e.stopPropagation();
            document.querySelectorAll('.color-swatch').forEach(s => s.classList.remove('selected'));
            this.classList.add('selected');
            if (this.dataset.color) {
                this.style.backgroundColor = this.dataset.color;
            }
            updatePreviewImage(this.getAttribute('data-image'));
            updatePricing();
            
            // Auto-advance to next section after brief delay
            setTimeout(() => {
                if (currentSectionIndex === 0) {
                    nextSection();
                }
            }, 500);
        });
    });
    
    // Option label selection (grips and filters - radio buttons)
    document.querySelectorAll('.option-label[data-option="grip"], .option-label[data-option="filter"]').forEach(label => {
        label.addEventListener('click', function(e) {
            e.stopPropagation();
            const option = this.getAttribute('data-option');
            document.querySelectorAll(`[data-option="${option}"]`).forEach(l => l.classList.remove('selected'));
            this.classList.add('selected');
            updatePricing();
            
            // Auto-advance to next section after brief delay
            setTimeout(() => {
                if (option === 'grip' && currentSectionIndex === 1) {
                    nextSection();
                } else if (option === 'filter' && currentSectionIndex === 2) {
                    nextSection();
                }
            }, 500);
        });
    });
    
    // Accessory checkboxes
    document.querySelectorAll('.option-label[data-option="accessory"]').forEach(label => {
        label.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            // Toggle checkbox
            const checkbox = this.querySelector('input[type="checkbox"]');
            checkbox.checked = !checkbox.checked;
            
            // Update selected class based on checkbox state
            if (checkbox.checked) {
                this.classList.add('selected');
            } else {
                this.classList.remove('selected');
            }
            updatePricing();
            // Don't auto-advance on accessories since they're optional and multiple
        });
    });
    
    // Add to cart button
    const addToCartBtn = document.getElementById('add-to-cart-btn');
    if (addToCartBtn) {
        addToCartBtn.addEventListener('click', handleAddToCart);
    }
    
    // Continue to summary button
    const continueBtn = document.getElementById('continue-to-summary');
    if (continueBtn) {
        continueBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            const summarySection = document.getElementById('summary-section');
            if (summarySection) {
                summarySection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    }
}

/**
 * Update preview image
 */
function updatePreviewImage(imageName) {
    const img = document.getElementById('previewImage');
    if (!img) return;
    
    // Determine the correct folder based on camera type
    let folder = 'pierceLENS';
    if (currentCamera === 'pl-pro') {
        folder = 'pierceLENS_Pro';
    } else if (currentCamera === 'pl-lite') {
        folder = 'pierceLENS'; // Lite uses the same folder as standard
    }
    
    const newSrc = `../images/products/Cameras/${folder}/${imageName}`;
    if (img.src.includes(imageName)) return;
    
    // Add transitioning class for smooth fade and scale
    img.classList.add('transitioning');
    
    // Preload the new image
    const preloadImg = new Image();
    preloadImg.src = newSrc;
    
    preloadImg.onload = () => {
        setTimeout(() => {
            img.src = newSrc;
            // Remove transitioning class to fade in
            requestAnimationFrame(() => {
                img.classList.remove('transitioning');
            });
        }, 250);
    };
}

/**
 * Animate price change
 */
function animatePrice(element, newValue) {
    if (!element) return;
    element.classList.add('price-updating');
    element.textContent = newValue;
    setTimeout(() => {
        element.classList.remove('price-updating');
    }, 500);
}

/**
 * Update pricing display
 */
function updatePricing() {
    const config = CAMERA_CONFIGS[currentCamera];
    let upgrades = 0;
    const upgradeItems = [];
    
    // Get selected color price
    const selectedColor = document.querySelector('.color-swatch.selected');
    if (selectedColor) {
        const colorPrice = parseFloat(selectedColor.getAttribute('data-price')) || 0;
        if (colorPrice > 0) {
            upgrades += colorPrice;
            upgradeItems.push({
                name: selectedColor.getAttribute('data-label') + ' Finish',
                price: colorPrice
            });
        }
    }
    
    // Get selected grip price
    const selectedGrip = document.querySelector('[data-option="grip"].selected');
    if (selectedGrip) {
        const gripPrice = parseFloat(selectedGrip.getAttribute('data-price')) || 0;
        if (gripPrice > 0) {
            upgrades += gripPrice;
            const gripName = selectedGrip.querySelector('strong').textContent;
            upgradeItems.push({
                name: gripName,
                price: gripPrice
            });
        }
    }
    
    // Get selected filter price
    const selectedFilter = document.querySelector('[data-option="filter"].selected');
    if (selectedFilter) {
        const filterPrice = parseFloat(selectedFilter.getAttribute('data-price')) || 0;
        if (filterPrice > 0) {
            upgrades += filterPrice;
            const filterName = selectedFilter.querySelector('strong').textContent;
            upgradeItems.push({
                name: filterName,
                price: filterPrice
            });
        }
    }
    
    // Get selected accessories prices
    const selectedAccessories = document.querySelectorAll('[data-option="accessory"].selected');
    selectedAccessories.forEach(acc => {
        const accPrice = parseFloat(acc.getAttribute('data-price')) || 0;
        const accName = acc.querySelector('strong').textContent;
        upgrades += accPrice;
        upgradeItems.push({
            name: accName,
            price: accPrice
        });
    });
    
    currentPrice = config.basePrice + upgrades;
    
    // Update base price display
    const basePriceElement = document.getElementById('basePrice');
    if (basePriceElement) {
        basePriceElement.textContent = '$' + config.basePrice;
    }
    
    // Update upgrades container with individual items
    const upgradesContainer = document.getElementById('upgrades-container');
    if (upgradesContainer) {
        upgradesContainer.innerHTML = '';
        upgradeItems.forEach((item, index) => {
            const upgradeRow = document.createElement('div');
            upgradeRow.className = 'upgrade-item';
            upgradeRow.style.animationDelay = `${index * 0.05}s`;
            upgradeRow.innerHTML = `
                <p>${item.name}</p>
                <strong>+$${item.price}</strong>
            `;
            upgradesContainer.appendChild(upgradeRow);
        });
    }
    
    // Update total price with animation
    const totalPrice = document.getElementById('totalPrice');
    if (totalPrice) {
        animatePrice(totalPrice, '$' + currentPrice);
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
    
    // Get selected accessories
    const selectedAccessories = document.querySelectorAll('[data-option="accessory"].selected');
    const accessoryNames = Array.from(selectedAccessories).map(acc => 
        acc.querySelector('strong').textContent
    );
    
    const customizations = {
        'Body Finish': selectedColor ? selectedColor.getAttribute('data-label') : 'Black',
        'Grip': selectedGrip ? selectedGrip.value : 'synthetic',
        'Filters': selectedFilter ? selectedFilter.value : 'standard',
        'Accessories': accessoryNames.length > 0 ? accessoryNames.join(', ') : 'None'
    };
    
    // Determine the correct folder based on camera type
    let folder = 'pierceLENS';
    let defaultImage = 'the-pierce-lens.png';
    if (currentCamera === 'pl-pro') {
        folder = 'pierceLENS_Pro';
        defaultImage = 'pierceLENS_Pro.png';
    } else if (currentCamera === 'pl-lite') {
        folder = 'pierceLENS';
        defaultImage = 'the-pierce-lens.png';
    }
    
    const cartItem = {
        name: config.name,
        price: currentPrice,
        quantity: 1,
        image: `../images/products/Cameras/${folder}/` + (selectedColor ? selectedColor.getAttribute('data-image') : defaultImage),
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
 * Mobile navigation toggle (placeholder for future mobile enhancements)
 */
function setupMobileNavToggle() {
    // Reserved for mobile-specific UI enhancements
}

/**
 * Handle preview section scroll behavior
 */
function handlePreviewScroll() {
    const preview = document.querySelector('.customizer-preview');
    const summarySection = document.getElementById('summary-section');
    const customizer = document.querySelector('.customizer-content');
    
    if (!preview || !summarySection || !customizer) return;
    
    // Only apply on desktop
    if (window.innerWidth <= 1024) return;
    
    const summaryTop = summarySection.getBoundingClientRect().top;
    const viewportHeight = window.innerHeight;
    const previewHeight = preview.offsetHeight;
    const customizerRect = customizer.getBoundingClientRect();
    const customizerBottom = customizerRect.bottom;
    
    // Check if we've scrolled far enough that the preview would overlap the summary
    // This happens when summary is about to enter viewport and preview needs to scroll up
    if (customizerBottom - previewHeight < 120 + 100) {
        preview.classList.add('at-bottom');
    } else {
        preview.classList.remove('at-bottom');
    }
}

// Add scroll listener
window.addEventListener('scroll', handlePreviewScroll);
window.addEventListener('resize', handlePreviewScroll);

// All obsolete functions removed - camera selection now handled via URL parameters


