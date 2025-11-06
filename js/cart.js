document.addEventListener('DOMContentLoaded', () => {
    const cartOverlay = document.getElementById('cart-overlay');
    const cartTrigger = document.getElementById('cart-trigger');
    const closeCartButton = document.getElementById('close-cart');
    const cartSidebar = document.getElementById('cart-sidebar');

    // Function to open the cart
    function openCart() {
        cartOverlay.classList.add('visible');
        // Optional: Prevent background scrolling when cart is open
        document.body.style.overflow = 'hidden'; 
    }

    // Function to close the cart
    function closeCart() {
        cartOverlay.classList.remove('visible');
        document.body.style.overflow = ''; // Restore background scrolling
    }

    // Event listeners
    if (cartTrigger) {
        cartTrigger.addEventListener('click', (e) => {
            e.preventDefault(); // Stop the '#' link from jumping the page
            openCart();
        });
    }

    if (closeCartButton) {
        closeCartButton.addEventListener('click', closeCart);
    }

    // Close cart if user clicks outside the sidebar (on the overlay itself)
    if (cartOverlay) {
        cartOverlay.addEventListener('click', (e) => {
            // Check if the click occurred directly on the overlay, not inside the sidebar
            if (e.target === cartOverlay) {
                closeCart();
            }
        });
    }
    
    // Optional: Close cart on Escape key press
    document.addEventListener('keydown', (e) => {
        if (e.key === "Escape" && cartOverlay.classList.contains('visible')) {
            closeCart();
        }
    });

    /* --- Future Enhancement Placeholder ---
    In a real application, this file would also contain functions to:
    1. Add items to a cart array (when the user clicks "Add to Cart" or "Configure")
    2. Render the cart items list dynamically (replacing the placeholder HTML)
    3. Recalculate and display the subtotal
    */
});