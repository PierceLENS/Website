document.addEventListener('DOMContentLoaded', () => {
    // 1. Define the base price and elements
    const BASE_PRICE = 999;
    const priceDisplay = document.getElementById('current-price');
    const configuratorForm = document.querySelector('.configurator-options');
    const productImage = document.getElementById('product-image'); // NEW: Get the image element

    // 2. NEW: Function to update the product image based on the selected body finish
    function updateImage() {
        // Find the currently selected body finish radio button
        const selectedFinish = configuratorForm.querySelector('input[name="finish"]:checked');
        
        if (selectedFinish) {
            const finishValue = selectedFinish.value; // e.g., 'matte-black', 'carbon-fiber'
            
            // Assume image files are in ../images/config/ and named after the value
            // e.g., ../images/config/matte-black.png
            const newSrc = `../images/config/${finishValue}.png`;
            
            // Apply image path
            productImage.src = newSrc;
        }
    }

    // 3. Function to calculate the total price (unchanged)
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

    // 4. Attach an event listener to the entire options container
    // We now call both functions on change
    configuratorForm.addEventListener('change', () => {
        calculateTotal();
        // NEW: Check if the change happened in the body-finish group to update the image
        updateImage();
    });

    // 5. Initial setup on load
    calculateTotal();
    updateImage(); // NEW: Initial image setup
});