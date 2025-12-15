/**
 * Cart Management System
 * Unified module for shopping cart widget (dropdown) and full cart page
 * Uses cookies to sync with shopping-cart.js
 */

// Cookie helper functions
function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
}

function setCookie(name, value, days) {
    const expires = new Date(Date.now() + days * 864e5).toUTCString();
    document.cookie = `${name}=${value}; expires=${expires}; path=/`;
}

// Get cart from cookie (synced with shopping-cart.js)
function getCartFromCookie() {
    const cartCookie = getCookie('piercelens_cart');
    if (cartCookie) {
        try {
            const parsed = JSON.parse(decodeURIComponent(cartCookie));
            return parsed.items || [];
        } catch (e) {
            return [];
        }
    }
    return [];
}

// Normalize cart item shape for consistent ID/quantity handling across modules
function normalizeCartItem(raw) {
    const item = { ...raw };
    const qty = parseInt(item.quantity, 10);
    item.quantity = Number.isFinite(qty) && qty > 0 ? qty : 1;
    item.id = item.id ? String(item.id) : `${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;
    return item;
}

// Global Cart Array
let cart = getCartFromCookie().map(normalizeCartItem);

// ============================================= */
/* CART WIDGET / DROPDOWN REFERENCES */
/* ============================================= */

const cartOverlay = document.getElementById('cart-overlay');
const cartSidebar = document.getElementById('cart-sidebar');
const cartItemsContainer = document.getElementById('cart-items-list');
const cartTotalDisplay = document.getElementById('cart-subtotal');
const cartTrigger = document.getElementById('open-cart') || document.getElementById('cart-trigger');
const closeCartButton = document.getElementById('close-cart');
const cartCountBubble = document.getElementById('cart-count-bubble');

// ============================================= */
/* CART PAGE REFERENCES */
/* ============================================= */

const cartPageContainer = document.getElementById('cart-items-container');
const cartPageSummary = {
    subtotal: document.getElementById('summary-subtotal'),
    tax: document.getElementById('summary-tax'),
    total: document.getElementById('summary-total'),
    checkout: document.getElementById('proceed-checkout'),
    promoBtn: document.getElementById('apply-promo'),
    promoInput: document.getElementById('promo-code'),
    promoMessage: document.getElementById('promo-message')
};

// ============================================= */
/* HELPER FUNCTIONS */
/* ============================================= */

function saveCart() {
    const cartData = { items: cart };
    const cartString = encodeURIComponent(JSON.stringify(cartData));
    setCookie('piercelens_cart', cartString, 7);
}

function calculateCartTotal() {
    const total = cart.reduce((sum, item) => {
        const qty = parseInt(item.quantity, 10);
        const safeQty = Number.isFinite(qty) && qty > 0 ? qty : 1;
        return sum + (item.price * safeQty);
    }, 0);
    if (cartTotalDisplay) {
        cartTotalDisplay.textContent = `$${total.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;
    }
    return total;
}

function updateCartCount() {
    const count = cart.reduce((sum, item) => {
        const qty = parseInt(item.quantity, 10);
        return sum + (Number.isFinite(qty) && qty > 0 ? qty : 1);
    }, 0);
    
    // Update cart count bubble if present
    if (cartCountBubble) {
        if (count > 0) {
            cartCountBubble.textContent = count;
            cartCountBubble.style.display = 'flex';
        } else {
            cartCountBubble.style.display = 'none';
        }
    }
    
    // Also update the ShoppingCart badge if it exists
    if (typeof ShoppingCart !== 'undefined' && ShoppingCart.updateCartCount) {
        ShoppingCart.updateCartCount();
    }
}

// ============================================= */
/* CART ITEM MANIPULATION */
/* ============================================= */

function removeItem(itemId) {
    const targetId = String(itemId);
    cart = cart.filter(item => String(item.id) !== targetId);
    saveCart();
    updateCartCount();
    
    // Render appropriate view
    if (cartPageContainer) {
        loadCartPage();
    } else if (cartItemsContainer) {
        renderCartDropdown();
    }
}

function addItemToCart(item) {
    cart.push(normalizeCartItem(item));
    saveCart();
    updateCartCount();
    
    // Render appropriate view
    if (cartPageContainer) {
        loadCartPage();
    } else if (cartItemsContainer) {
        renderCartDropdown();
    }
}

function updateItemQuantity(itemId, newQuantity) {
    const item = cart.find(i => String(i.id) === String(itemId));
    if (item) {
        const parsedQty = parseInt(newQuantity, 10);
        if (!Number.isFinite(parsedQty) || parsedQty <= 0) {
            removeItem(itemId);
        } else {
            item.quantity = parsedQty;
            saveCart();
            updateCartCount();
            
            // Render appropriate view
            if (cartPageContainer) {
                loadCartPage();
            } else if (cartItemsContainer) {
                renderCartDropdown();
            }
        }
    }
}

// ============================================= */
/* CART WIDGET / DROPDOWN RENDERING */
/* ============================================= */

function renderCartDropdown() {
    if (!cartItemsContainer) return;
    
    cartItemsContainer.innerHTML = '';
    
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p class="empty-cart-message">Your cart is empty.</p>';
    } else {
        cart.forEach(item => {
            const itemElement = document.createElement('div');
            itemElement.classList.add('cart-item');
            const qty = parseInt(item.quantity, 10);
            const safeQty = Number.isFinite(qty) && qty > 0 ? qty : 1;
            
            // Generate description
            let description = '';
            if (item.customizations && typeof item.customizations === 'object') {
                const tags = Object.entries(item.customizations)
                    .map(([key, value]) => `${key}: ${value}`)
                    .join(' | ');
                description = tags;
            } else if (item.description) {
                description = item.description;
            }
            
            itemElement.innerHTML = `
                <div class="item-details">
                    <p class="item-name">${item.name}</p>
                    ${description ? `<p class="item-config">${description}</p>` : ''}
                    <p class="item-price">$${(item.price * safeQty).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</p>
                </div>
                <button class="remove-btn" data-item-id="${item.id}">&times;</button>
            `;
            
            cartItemsContainer.appendChild(itemElement);
        });
        
        // Attach remove listeners
        document.querySelectorAll('.remove-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                const itemId = e.currentTarget.dataset.itemId;
                removeItem(itemId);
            });
        });
    }
    
    calculateCartTotal();
}

// ============================================= */
/* CART PAGE RENDERING */
/* ============================================= */

function renderCartItem(item) {
    const qty = parseInt(item.quantity, 10);
    const safeQty = Number.isFinite(qty) && qty > 0 ? qty : 1;
    const customizationTags = item.customizations && typeof item.customizations === 'object'
        ? Object.entries(item.customizations).map(([key, value]) => 
            `<span class="customization-tag">${key}: ${value}</span>`
          ).join('')
        : '';
    
    return `
        <div class="cart-item-card" data-item-id="${item.id}">
            <div class="cart-item-image">
                <img src="${item.image}" alt="${item.name}" onerror="this.src='../images/placeholder.png'">
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
                <p class="cart-item-price">$${(item.price * safeQty).toFixed(2)}</p>
                
                <div class="quantity-controls">
                    <button class="quantity-btn decrease-qty" data-item-id="${item.id}" ${safeQty <= 1 ? 'disabled' : ''}>
                        <i class="fa-solid fa-minus"></i>
                    </button>
                    <span class="quantity-display">${safeQty}</span>
                    <button class="quantity-btn increase-qty" data-item-id="${item.id}">
                        <i class="fa-solid fa-plus"></i>
                    </button>
                </div>
                
                <button class="remove-item-btn" data-item-id="${item.id}">
                    <i class="fa-solid fa-trash"></i>
                    Remove
                </button>
            </div>
        </div>
    `;
}

function loadCartPage() {
    if (!cartPageContainer) return;
    
    cartPageContainer.innerHTML = '';
    
    if (cart.length === 0) {
        cartPageContainer.innerHTML = `
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
    
    // Render items
    cartPageContainer.innerHTML = cart.map(item => renderCartItem(item)).join('');
    
    // Attach event listeners
    document.querySelectorAll('.increase-qty').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const itemId = e.currentTarget.dataset.itemId;
            const item = cart.find(i => String(i.id) === String(itemId));
            if (item) updateItemQuantity(itemId, (item.quantity || 1) + 1);
        });
    });
    
    document.querySelectorAll('.decrease-qty').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const itemId = e.currentTarget.dataset.itemId;
            const item = cart.find(i => String(i.id) === String(itemId));
            if (item && (item.quantity || 1) > 1) updateItemQuantity(itemId, (item.quantity || 1) - 1);
        });
    });
    
    document.querySelectorAll('.remove-item-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const itemCard = e.currentTarget.closest('.cart-item-card');
            const itemId = e.currentTarget.dataset.itemId;
            
            itemCard.classList.add('cart-item-removing');
            setTimeout(() => removeItem(itemId), 300);
        });
    });
    
    updateSummary();
}

function updateSummary() {
    if (!cartPageSummary.subtotal) return;
    
    const subtotal = cart.reduce((sum, item) => {
        const qty = parseInt(item.quantity, 10);
        const safeQty = Number.isFinite(qty) && qty > 0 ? qty : 1;
        return sum + (item.price * safeQty);
    }, 0);
    const tax = subtotal * 0.0875;
    const total = subtotal + tax;
    
    if (cartPageSummary.subtotal) cartPageSummary.subtotal.textContent = `$${subtotal.toFixed(2)}`;
    if (cartPageSummary.tax) cartPageSummary.tax.textContent = `$${tax.toFixed(2)}`;
    if (cartPageSummary.total) cartPageSummary.total.textContent = `$${total.toFixed(2)}`;
    
    if (cartPageSummary.checkout) {
        cartPageSummary.checkout.disabled = cart.length === 0;
    }
}

// ============================================= */
/* CART WIDGET TOGGLES */
/* ============================================= */

function openCart() {
    if (cartOverlay) {
        cartOverlay.classList.add('visible');
        document.body.style.overflow = 'hidden';
    }
}

function closeCart() {
    if (cartOverlay) {
        cartOverlay.classList.remove('visible');
        document.body.style.overflow = '';
    }
}

// ============================================= */
/* PROMO CODE HANDLING */
/* ============================================= */

function applyPromoCode() {
    if (!cartPageSummary.promoInput || !cartPageSummary.promoMessage) return;
    
    const code = cartPageSummary.promoInput.value.trim().toUpperCase();
    cartPageSummary.promoMessage.textContent = '';
    cartPageSummary.promoMessage.className = 'promo-message';
    
    if (!code) {
        cartPageSummary.promoMessage.textContent = 'Please enter a promo code';
        cartPageSummary.promoMessage.classList.add('error');
        return;
    }
    
    const promoCodes = {
        'WELCOME10': { discount: 10, type: 'percentage', description: '10% off' },
        'SAVE20': { discount: 20, type: 'percentage', description: '20% off' },
        'FIRST50': { discount: 50, type: 'fixed', description: '$50 off' }
    };
    
    if (promoCodes[code]) {
        const promo = promoCodes[code];
        cartPageSummary.promoMessage.textContent = `✓ Promo code applied! ${promo.description}`;
        cartPageSummary.promoMessage.classList.add('success');
    } else {
        cartPageSummary.promoMessage.textContent = '✗ Invalid promo code';
        cartPageSummary.promoMessage.classList.add('error');
    }
}

// ============================================= */
/* EVENT LISTENERS & INITIALIZATION */
/* ============================================= */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize based on page type
    if (cartPageContainer) {
        // Cart page
        loadCartPage();
        
        if (cartPageSummary.checkout) {
            cartPageSummary.checkout.addEventListener('click', () => {
                if (cart.length > 0) {
                    sessionStorage.setItem('checkout_cart', JSON.stringify({ items: cart }));
                    window.location.href = '../checkout/index.html';
                }
            });
        }
        
        if (cartPageSummary.promoBtn) {
            cartPageSummary.promoBtn.addEventListener('click', applyPromoCode);
        }
        
        if (cartPageSummary.promoInput) {
            cartPageSummary.promoInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') applyPromoCode();
            });
        }
    } else if (cartItemsContainer) {
        // Cart widget/dropdown
        renderCartDropdown();
        
        if (cartTrigger) {
            cartTrigger.addEventListener('click', (e) => {
                e.preventDefault();
                openCart();
            });
        }
        
        if (closeCartButton) {
            closeCartButton.addEventListener('click', closeCart);
        }
        
        if (cartOverlay) {
            cartOverlay.addEventListener('click', (e) => {
                if (e.target === cartOverlay) closeCart();
            });
            
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && cartOverlay.classList.contains('visible')) {
                    closeCart();
                }
            });
        }
    }
    
    updateCartCount();
});

// Export for external use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        addItemToCart,
        removeItem,
        updateItemQuantity,
        loadCartPage,
        renderCartDropdown,
        updateCartCount,
        openCart,
        closeCart
    };
}


