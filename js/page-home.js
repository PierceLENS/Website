/**
 * Home Page (index.html) Specific Script
 */

document.addEventListener('DOMContentLoaded', function() {
    // Festive snow animation
    var snowContainer = document.querySelector('.festive-banner .snow');
    if (snowContainer) {
        for (var i = 0; i < 24; i++) {
            var snowflake = document.createElement('span');
            snowflake.className = 'snowflake';
            snowflake.textContent = '❄';
            snowflake.style.left = (Math.random() * 100) + '%';
            snowflake.style.fontSize = (0.8 + Math.random() * 1.2) + 'em';
            snowflake.style.animationDelay = (Math.random() * 6) + 's';
            snowContainer.appendChild(snowflake);
        }
    }

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
