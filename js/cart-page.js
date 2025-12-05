/**
 * Cart Page Management
 * Handles full cart display, quantity updates, and checkout navigation
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize cart page
    loadCartPage();
    
    // Update cart count badge
    ShoppingCart.updateCartCount();
    
    // Setup event listeners
    setupEventListeners();
});

/**
 * Load and display cart contents
 */
function loadCartPage() {
    const cart = ShoppingCart.getCart();
    const container = document.getElementById('cart-items-container');
    
    if (cart.items.length === 0) {
        // Show empty cart state
        container.innerHTML = `
            <div class="cart-empty-state">
                <i class="fa-solid fa-cart-shopping"></i>
                <h2>Your cart is empty</h2>
                <p>Add some amazing products to get started!</p>
                <a href="../customize/index.html" class="shop-now-btn">
                    <i class="fa-solid fa-camera"></i>
                    Start Customizing
                </a>
            </div>
        `;
        updateSummary();
        return;
    }
    
    // Render all cart items
    container.innerHTML = cart.items.map(item => renderCartItem(item)).join('');
    
    // Update summary
    updateSummary();
}

/**
 * Render a single cart item card
 */
function renderCartItem(item) {
    const customizationTags = item.customizations 
        ? Object.entries(item.customizations).map(([key, value]) => 
            `<span class="customization-tag">${key}: ${value}</span>`
          ).join('')
        : '';
    
    return `
        <div class="cart-item-card" data-item-id="${item.id}">
            <div class="cart-item-image">
                <img src="${item.image}" alt="${item.name}">
            </div>
            
            <div class="cart-item-details">
                <h3>${item.name}</h3>
                ${customizationTags ? `
                    <div class="cart-item-customizations">
                        ${customizationTags}
                    </div>
                ` : ''}
            </div>
            
            <div class="cart-item-controls">
                <p class="cart-item-price">$${(item.price * (item.quantity || 1)).toFixed(2)}</p>
                
                <div class="quantity-controls">
                    <button class="quantity-btn" onclick="decreaseQuantity('${item.id}')" ${(item.quantity || 1) <= 1 ? 'disabled' : ''}>
                        <i class="fa-solid fa-minus"></i>
                    </button>
                    <span class="quantity-display">${item.quantity || 1}</span>
                    <button class="quantity-btn" onclick="increaseQuantity('${item.id}')">
                        <i class="fa-solid fa-plus"></i>
                    </button>
                </div>
                
                <button class="remove-item-btn" onclick="removeCartItem('${item.id}')">
                    <i class="fa-solid fa-trash"></i>
                    Remove
                </button>
            </div>
        </div>
    `;
}

/**
 * Increase item quantity
 */
function increaseQuantity(itemId) {
    const cart = ShoppingCart.getCart();
    const item = cart.items.find(i => i.id === itemId);
    
    if (item) {
        item.quantity = (item.quantity || 1) + 1;
        ShoppingCart.saveCart(cart);
        loadCartPage();
        ShoppingCart.updateCartCount();
    }
}

/**
 * Decrease item quantity
 */
function decreaseQuantity(itemId) {
    const cart = ShoppingCart.getCart();
    const item = cart.items.find(i => i.id === itemId);
    
    if (item && (item.quantity || 1) > 1) {
        item.quantity = item.quantity - 1;
        ShoppingCart.saveCart(cart);
        loadCartPage();
        ShoppingCart.updateCartCount();
    }
}

/**
 * Remove item from cart with animation
 */
function removeCartItem(itemId) {
    const itemCard = document.querySelector(`[data-item-id="${itemId}"]`);
    
    if (itemCard) {
        // Add removing animation
        itemCard.classList.add('cart-item-removing');
        
        // Wait for animation, then remove
        setTimeout(() => {
            ShoppingCart.removeItem(itemId);
            loadCartPage();
            ShoppingCart.updateCartCount();
        }, 300);
    }
}

/**
 * Update cart summary with totals
 */
function updateSummary() {
    const cart = ShoppingCart.getCart();
    const subtotal = cart.items.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0);
    const tax = subtotal * 0.0875; // 8.75% tax
    const total = subtotal + tax;
    
    // Update summary elements
    document.getElementById('summary-subtotal').textContent = `$${subtotal.toFixed(2)}`;
    document.getElementById('summary-tax').textContent = `$${tax.toFixed(2)}`;
    document.getElementById('summary-total').textContent = `$${total.toFixed(2)}`;
    
    // Enable/disable checkout button
    const checkoutBtn = document.getElementById('proceed-checkout');
    if (cart.items.length === 0) {
        checkoutBtn.disabled = true;
    } else {
        checkoutBtn.disabled = false;
    }
}

/**
 * Setup event listeners
 */
function setupEventListeners() {
    // Proceed to checkout
    const checkoutBtn = document.getElementById('proceed-checkout');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', function() {
            const cart = ShoppingCart.getCart();
            if (cart.items.length > 0) {
                // Store cart data for checkout page
                sessionStorage.setItem('checkout_cart', JSON.stringify(cart));
                window.location.href = '../checkout/index.html';
            }
        });
    }
    
    // Apply promo code
    const applyPromoBtn = document.getElementById('apply-promo');
    if (applyPromoBtn) {
        applyPromoBtn.addEventListener('click', applyPromoCode);
    }
    
    // Allow Enter key in promo input
    const promoInput = document.getElementById('promo-code');
    if (promoInput) {
        promoInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                applyPromoCode();
            }
        });
    }
    
    // Cart trigger for dropdown
    const cartTrigger = document.getElementById('cart-trigger');
    if (cartTrigger) {
        cartTrigger.addEventListener('click', function(e) {
            e.preventDefault();
            ShoppingCart.showCartModal();
        });
    }
}

/**
 * Apply promo code
 */
function applyPromoCode() {
    const promoInput = document.getElementById('promo-code');
    const promoMessage = document.getElementById('promo-message');
    const code = promoInput.value.trim().toUpperCase();
    
    // Clear previous message
    promoMessage.textContent = '';
    promoMessage.className = 'promo-message';
    
    if (!code) {
        promoMessage.textContent = 'Please enter a promo code';
        promoMessage.classList.add('error');
        return;
    }
    
    // Demo promo codes
    const promoCodes = {
        'WELCOME10': { discount: 10, type: 'percentage', description: '10% off' },
        'SAVE20': { discount: 20, type: 'percentage', description: '20% off' },
        'FIRST50': { discount: 50, type: 'fixed', description: '$50 off' }
    };
    
    if (promoCodes[code]) {
        const promo = promoCodes[code];
        promoMessage.textContent = `✓ Promo code applied! ${promo.description}`;
        promoMessage.classList.add('success');
        
        // Apply discount (for demo, just show message)
        // In production, this would update the cart totals
    } else {
        promoMessage.textContent = '✗ Invalid promo code';
        promoMessage.classList.add('error');
    }
}
