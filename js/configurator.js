document.addEventListener('DOMContentLoaded', () => {
    // 1. Define the base price and elements
    const BASE_PRICE = 999;
    const priceDisplay = document.getElementById('current-price');
    const configuratorForm = document.querySelector('.configurator-options');
    const productImage = document.getElementById('product-image'); 
    const imageFront = document.getElementById('product-image-front');
    const imageBack = document.getElementById('product-image-back');
    
    // NEW: Get the overlay elements
    const filterPreview = document.getElementById('preview-filter');
    const nvmePreview = document.getElementById('preview-nvme'); // Assuming an NVMe checkbox exists/will exist

    // Variable to track if a transition is currently running (optional, but good practice)
    let isTransitioning = false; 
    let currentActiveImage = imageFront;
    let nextImage = imageBack;

    imageBack.classList.add('transparent');
    // Function to update the product image based on the selected body finish
    function updateImage() {
    const selectedFinish = configuratorForm.querySelector('input[name="finish"]:checked');
    
    if (selectedFinish) {
        const finishValue = selectedFinish.value; 
        const newSrc = finishValue === 'black' ? `../images/products/Cameras/pierceLENS/the-pierce-lens.png` : `../images/products/Cameras/pierceLENS/the-pierce-lens_${finishValue}.png`; 
        
        // --- 1. Avoid redundant transition if same color is selected ---
        if (currentActiveImage.src.includes(newSrc)) {
            return;
        }

        // --- 2. Update the hidden/back layer source ---
        // The next image to be shown gets the new source
        nextImage.src = newSrc;

        // --- 3. Perform Cross-Fade ---
        // Fade the currently active image out (opacity 1 -> 0)
        currentActiveImage.classList.add('transparent'); 
        
        // Fade the next image in (opacity 0 -> 1). It is already under the active-layer class.
        // We ensure the next image does NOT have the transparent class
        nextImage.classList.remove('transparent');

        // --- 4. Swap Roles After Transition (500ms delay matches CSS transition) ---
        setTimeout(() => {
            // Swap classes (Z-index and opacity control)
            currentActiveImage.classList.remove('active-layer');
            currentActiveImage.classList.add('base-layer');
            
            nextImage.classList.add('active-layer');
            nextImage.classList.remove('base-layer');

            // Swap the JS references for the next click
            [currentActiveImage, nextImage] = [nextImage, currentActiveImage];

        }, 500); // 500ms MUST match the CSS transition duration
    }
}
// Note: Ensure the function calls updateImage() on initial load and inside the change listener.
// This function replaces the old, instant updateImage() logic.
    // 2. NEW: Function to toggle accessory visibility
    function updateAccessoryPreviews() {
        // --- 1. Pro Cine-Tones Expansion (Assuming its checkbox name/value) ---
        // We'll assume the checkbox is named 'filter' with value 'pro-expansion' from previous discussion.
        const filterCheckbox = document.querySelector('input[name="filter"][value="pro-expansion"]');
        if (filterCheckbox && filterCheckbox.checked) {
            filterPreview.classList.add('visible');
        } else {
            filterPreview.classList.remove('visible');
        }

        // --- 2. Mini-NVMe Module (Assuming its checkbox name/value) ---
        // We'll assume the checkbox is named 'storage' with value 'mini-nvme'.
        const nvmeCheckbox = document.querySelector('input[name="storage"][value="mini-nvme"]');
        if (nvmeCheckbox && nvmeCheckbox.checked) {
            nvmePreview.classList.add('visible');
        } else {
            nvmePreview.classList.remove('visible');
        }
    }


    // 3. Function to calculate the total price (modified to call updateAccessoryPreviews)
    function calculateTotal() {
        let total = BASE_PRICE;
        
        const options = configuratorForm.querySelectorAll('input[type="radio"], input[type="checkbox"]');

        options.forEach(input => {
            const price = parseFloat(input.getAttribute('data-price')) || 0;

            if (input.type === 'radio') {
                if (input.checked) {
                    total += price;
                }
            } else if (input.type === 'checkbox') {
                if (input.checked && !input.disabled) {
                    total += price;
                }
            }
        });

        priceDisplay.textContent = `$${total.toLocaleString()}`;
    }

    // 4. Attach event listeners
    configuratorForm.addEventListener('change', () => {
        calculateTotal();
        updateImage();
        updateAccessoryPreviews(); // CRITICAL: Call accessory toggle function
    });

    // 5. Initial setup on load
    calculateTotal();
    updateImage(); 
    updateAccessoryPreviews(); // CRITICAL: Initial accessory state
});

