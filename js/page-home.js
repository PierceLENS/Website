/**
 * Home Page (index.html) Specific Script
 */

document.addEventListener('DOMContentLoaded', function() {
    

    // Cart trigger with ShoppingCart
    var cartTrigger = document.getElementById('cart-trigger');
    if (cartTrigger && typeof ShoppingCart !== 'undefined') {
        var newCartTrigger = cartTrigger.cloneNode(true);
        cartTrigger.parentNode.replaceChild(newCartTrigger, cartTrigger);
        newCartTrigger.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();
            ShoppingCart.showCartModal();
        });
        ShoppingCart.updateCartCount();
    }

    // Setup dropdown accessibility
    if (typeof setupDropdownAccessibility === 'function') {
        setupDropdownAccessibility();
    }
});

