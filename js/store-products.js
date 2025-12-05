/**
 * Store Page Product Management
 * Handles add-to-cart functionality for all products
 */

document.addEventListener('DOMContentLoaded', function() {
    // Get all product buttons
    const productButtons = document.querySelectorAll('.product-cta-button');
    
    productButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            const productId = this.getAttribute('data-product');
            const productName = this.getAttribute('data-name');
            const productPrice = parseFloat(this.getAttribute('data-price'));
            
            // Special handling for camera configuration
            if (productId === 'pl-camera') {
                if (typeof CameraSelection !== 'undefined') {
                    CameraSelection.goToCustomize('pl', productName);
                } else {
                    window.location.href = '../customize/index.html';
                }
                return;
            }
            
            if (productId === 'pl-pro-camera') {
                if (typeof CameraSelection !== 'undefined') {
                    CameraSelection.goToCustomize('pl-pro', productName);
                } else {
                    window.location.href = '../customize/index.html';
                }
                return;
            }
            
            // Add other products to cart
            if (typeof ShoppingCart !== 'undefined') {
                const cartItem = {
                    name: productName,
                    price: productPrice,
                    quantity: 1
                };
                
                ShoppingCart.addItem(cartItem);
                ShoppingCart.showAddConfirmation(productName);
                ShoppingCart.updateCartCount();
            } else {
                alert('Shopping cart not loaded. Please refresh the page.');
            }
        });
    });
});
