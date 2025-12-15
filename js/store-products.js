/**
 * Store Page Product Management
 * Modular system for cart and customization integration
 */

document.addEventListener('DOMContentLoaded', function() {
    // Get all product buttons
    const productButtons = document.querySelectorAll('.product-cta-button');
    
    productButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Don't process disabled buttons
            if (this.disabled) return;
            
            const productId = this.getAttribute('data-product');
            const productName = this.getAttribute('data-name');
            const productPrice = parseFloat(this.getAttribute('data-price'));
            const productImage = this.getAttribute('data-image') || '../images/products/Cameras/pierceLENS/the-pierce-lens.png';
            
            // Camera products - redirect to customization with URL parameter
            if (productId === 'pl-camera') {
                window.location.href = '../customize/index.html?camera=pl';
                return;
            }
            if (productId === 'pl-pro-camera') {
                window.location.href = '../customize/index.html?camera=pl-pro';
                return;
            }
            if (productId === 'pl-lite-camera') {
                window.location.href = '../customize/index.html?camera=pl-lite';
                return;
            }
            
            // All other products - add to cart
            if (typeof ShoppingCart !== 'undefined') {
                const cartItem = {
                    name: productName,
                    price: productPrice,
                    quantity: 1,
                    image: productImage
                };
                
                ShoppingCart.addItem(cartItem);
                ShoppingCart.showAddConfirmation(productName);
                
                // Visual feedback - button animation
                this.classList.add('added-to-cart');
                this.innerHTML = '<i class="fa-solid fa-check"></i> Added!';
                
                setTimeout(() => {
                    this.classList.remove('added-to-cart');
                    this.innerHTML = 'Add to Cart';
                }, 2000);
            } else {
                console.error('ShoppingCart module not loaded');
                alert('Unable to add to cart. Please refresh the page.');
            }
        });
    });
});


