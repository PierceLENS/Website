document.addEventListener('DOMContentLoaded', () => {
    // 1. Define the base price and elements
    const BASE_PRICE = 999;
    const priceDisplay = document.getElementById('current-price');
    const configuratorForm = document.querySelector('.configurator-options');
    const productImage = document.getElementById('product-image'); 

    // 2. Function to update the product image based on the selected body finish
    function updateImage() {
        const selectedFinish = configuratorForm.querySelector('input[name="finish"]:checked');
        
        if (selectedFinish) {
            const finishValue = selectedFinish.value; // e.g., 'matte-black', 'carbon-fiber'
            
            // UPDATED: Image path now uses the 'camera_' prefix and assumes files are in ../images/
            const newSrc = `../images/camera_${finishValue}.png`; 
            
            // Apply image path
            productImage.src = newSrc;
        }
    }

    // 3. Function to calculate the total price (unchanged)
    function calculateTotal() {
        let total = BASE_PRICE;
        // ... (price calculation logic remains the same) ...
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
    });

    // 5. Initial setup on load
    calculateTotal();
    updateImage();
});