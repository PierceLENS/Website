document.addEventListener('DOMContentLoaded', () => {
    // 1. Define the base price and the element to display the total
    const BASE_PRICE = 1350;
    const priceDisplay = document.getElementById('current-price');
    const configuratorForm = document.querySelector('.configurator-options');

    // 2. Function to calculate the total price
    function calculateTotal() {
        let total = BASE_PRICE;
        
        // 3. Get all radio buttons and checkboxes in the configuration area
        const options = configuratorForm.querySelectorAll('input[type="radio"], input[type="checkbox"]');

        options.forEach(input => {
            const price = parseFloat(input.getAttribute('data-price')) || 0;

            if (input.type === 'radio') {
                // For radio buttons, only add the price of the checked option in its group
                if (input.checked) {
                    total += price;
                }
            } else if (input.type === 'checkbox') {
                // For checkboxes, add the price if it is checked AND not disabled (like the Standard filter)
                if (input.checked && !input.disabled) {
                    total += price;
                }
            }
        });

        // 4. Update the display element with the new price, formatted as currency
        priceDisplay.textContent = `$${total.toLocaleString()}`;
    }

    // 5. Attach an event listener to the entire options container
    // This makes the script more efficient, catching clicks on any radio/checkbox
    configuratorForm.addEventListener('change', calculateTotal);

    // 6. Initial calculation on load to ensure the price reflects the default selection
    calculateTotal();
});