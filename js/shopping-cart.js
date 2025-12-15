/**
 * Shopping Cart Management System
 * Uses cookies to persist cart data across sessions
 */

const ShoppingCart = {
    // Cookie configuration
    COOKIE_NAME: 'piercelens_cart',
    COOKIE_DAYS: 7,

    /**
     * Get cart data from cookie
     */
    getCart: function() {
        const cartCookie = this.getCookie(this.COOKIE_NAME);
        if (cartCookie) {
            try {
                return JSON.parse(decodeURIComponent(cartCookie));
            } catch (e) {
                return { items: [] };
            }
        }
        return { items: [] };
    },

    /**
     * Save cart data to cookie
     */
    saveCart: function(cart) {
        const cartString = encodeURIComponent(JSON.stringify(cart));
        this.setCookie(this.COOKIE_NAME, cartString, this.COOKIE_DAYS);
    },

    /**
     * Add item to cart
     */
    addItem: function(item) {
        const cart = this.getCart();
        const qty = parseInt(item.quantity, 10);

        // Normalize item identity and quantity so cart-management can interoperate
        item.quantity = Number.isFinite(qty) && qty > 0 ? qty : 1;
        item.id = item.id ? String(item.id) : `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        
        cart.items.push(item);
        this.saveCart(cart);
        this.updateCartCount();
        
        return item.id;
    },

    /**
     * Remove item from cart by ID
     */
    removeItem: function(itemId) {
        const cart = this.getCart();
        cart.items = cart.items.filter(item => item.id !== itemId);
        this.saveCart(cart);
        this.updateCartCount();
    },

    /**
     * Update item quantity
     */
    updateQuantity: function(itemId, quantity) {
        const cart = this.getCart();
        const item = cart.items.find(item => item.id === itemId);
        if (item) {
            const parsedQty = parseInt(quantity, 10);
            if (!Number.isFinite(parsedQty) || parsedQty <= 0) {
                this.removeItem(itemId);
                return;
            }
            item.quantity = parsedQty;
            this.saveCart(cart);
        }
    },

    /**
     * Clear entire cart
     */
    clearCart: function() {
        this.saveCart({ items: [] });
        this.updateCartCount();
    },

    /**
     * Get total number of items in cart
     */
    getItemCount: function() {
        const cart = this.getCart();
        return cart.items.reduce((total, item) => {
            const qty = parseInt(item.quantity, 10);
            return total + (Number.isFinite(qty) && qty > 0 ? qty : 1);
        }, 0);
    },

    /**
     * Get cart total price
     */
    getTotal: function() {
        const cart = this.getCart();
        return cart.items.reduce((total, item) => {
            const qty = parseInt(item.quantity, 10);
            const safeQty = Number.isFinite(qty) && qty > 0 ? qty : 1;
            return total + (item.price * safeQty);
        }, 0);
    },

    /**
     * Get correct path to cart page based on current location
     */
    getCartPagePath: function() {
        const path = window.location.pathname;
        
        // Remove trailing slash and filename to get directory path
        let dirPath = path.replace(/\/[^\/]*$/, '');
        
        // Count directory depth (excluding root)
        const depth = dirPath.split('/').filter(p => p.length > 0).length;
        
        // If at root, go directly to cart
        if (depth === 0) {
            return 'cart/index.html';
        }
        
        // Build relative path with correct number of ../
        return '../'.repeat(depth) + 'cart/index.html';
    },

    /**
     * Update cart count badge in header
     */
    updateCartCount: function() {
        const count = this.getItemCount();
        const cartTrigger = document.getElementById('cart-trigger');
        
        if (cartTrigger) {
            // Remove existing badge
            const existingBadge = cartTrigger.querySelector('.cart-badge');
            if (existingBadge) {
                existingBadge.remove();
            }
            
            // Add new badge if items exist
            if (count > 0) {
                const badge = document.createElement('span');
                badge.className = 'cart-badge';
                badge.textContent = count;
                cartTrigger.appendChild(badge);
            }
        }
    },

    /**
     * Show cart preview dropdown
     */
    showCartModal: function() {
        // Remove existing dropdown if present (toggle behavior)
        const existingDropdown = document.getElementById('cart-dropdown');
        if (existingDropdown) {
            existingDropdown.remove();
            document.removeEventListener('click', this.handleOutsideClick);
            return;
        }
        
        const cart = this.getCart();
        const total = this.getTotal();
        const itemCount = this.getItemCount();

        // Show only first 3 items in preview
        const previewItems = cart.items.slice(0, 3);
        const hasMoreItems = cart.items.length > 3;

        // Build simple dropdown HTML to test
        let dropdownHTML = '<div id="cart-dropdown" class="cart-dropdown" style="position:fixed;top:100px;right:100px;width:380px;background:#1a1a1a;border:2px solid #00BFFF;border-radius:12px;padding:20px;z-index:99999;">';
        dropdownHTML += '<div class="cart-dropdown-header">';
        dropdownHTML += '<h3 style="color:#fff;margin:0;">Shopping Cart</h3>';
        dropdownHTML += '<span style="color:#00BFFF;">' + itemCount + ' items</span>';
        dropdownHTML += '</div>';
        
        if (cart.items.length === 0) {
            dropdownHTML += '<div class="cart-dropdown-empty" style="text-align:center;padding:40px 20px;">';
            dropdownHTML += '<i class="fa-solid fa-shopping-cart" style="font-size:48px;color:#333;"></i>';
            dropdownHTML += '<p style="color:#aaa;margin-top:15px;">Your cart is empty</p>';
            dropdownHTML += '</div>';
        } else {
            dropdownHTML += '<div class="cart-dropdown-items" style="padding:15px 0;">';
            for (let i = 0; i < Math.min(3, cart.items.length); i++) {
                const item = cart.items[i];
                dropdownHTML += '<div class="cart-dropdown-item" style="display:grid;grid-template-columns:60px 1fr 30px;gap:12px;padding:12px;background:rgba(0,191,255,0.05);border-radius:8px;margin-bottom:10px;">';
                dropdownHTML += '<div style="width:60px;height:60px;"><img src="' + item.image + '" style="width:100%;height:100%;object-fit:contain;"></div>';
                dropdownHTML += '<div><h4 style="color:#fff;margin:0;font-size:14px;">' + item.name + '</h4>';
                dropdownHTML += '<p style="color:#00BFFF;margin:5px 0 0 0;font-size:16px;font-weight:700;">$' + item.price.toFixed(2) + '</p></div>';
                dropdownHTML += '<button onclick="ShoppingCart.removeItemQuick(\'' + item.id + '\')" style="background:none;border:none;color:#666;cursor:pointer;"><i class="fa-solid fa-times"></i></button>';
                dropdownHTML += '</div>';
            }
            if (cart.items.length > 3) {
                dropdownHTML += '<div style="text-align:center;padding:12px;color:#00BFFF;font-size:13px;">+' + (cart.items.length - 3) + ' more items</div>';
            }
            dropdownHTML += '</div>';
            dropdownHTML += '<div class="cart-dropdown-footer" style="border-top:1px solid rgba(0,191,255,0.2);padding-top:15px;margin-top:15px;">';
            dropdownHTML += '<div style="display:flex;justify-content:space-between;margin-bottom:15px;"><span style="color:#aaa;">Subtotal:</span><strong style="color:#00BFFF;font-size:20px;">$' + total.toFixed(2) + '</strong></div>';
            dropdownHTML += '<a href="' + this.getCartPagePath() + '" style="display:block;width:100%;padding:12px;background:#00BFFF;color:#111;text-align:center;text-decoration:none;border-radius:8px;font-weight:700;">View Cart</a>';
            dropdownHTML += '</div>';
        }
        dropdownHTML += '</div>';
        
        const cartTrigger = document.getElementById('cart-trigger');
        if (!cartTrigger) return;
        
        // Insert dropdown into body
        document.body.insertAdjacentHTML('beforeend', dropdownHTML);
        
        const dropdown = document.getElementById('cart-dropdown');
        if (!dropdown) return;
        
        const triggerRect = cartTrigger.getBoundingClientRect();
        const isMobile = window.innerWidth <= 768;
        
        // Position dropdown with inline styles
        if (isMobile) {
            dropdown.style.cssText = `
                position: fixed !important;
                top: ${triggerRect.bottom + 12}px !important;
                left: 50% !important;
                right: auto !important;
                transform: translateX(-50%) translateY(-8px) !important;
                z-index: 99999 !important;
                display: block !important;
                visibility: visible !important;
                width: calc(100vw - ${window.innerWidth <= 480 ? '24' : '32'}px);
                max-width: ${window.innerWidth <= 480 ? 'calc(100vw - 24px)' : '380px'};
            `;
        } else {
            dropdown.style.cssText = `
                position: fixed !important;
                top: ${triggerRect.bottom + 15}px !important;
                right: ${window.innerWidth - triggerRect.right}px !important;
                left: auto !important;
                z-index: 99999 !important;
                display: block !important;
                visibility: visible !important;
                width: 380px;
                max-width: calc(100vw - 24px);
            `;
        }
        
        // Animate dropdown in with smoother timing
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                dropdown.classList.add('active');
            });
        });

        // Close dropdown when clicking outside (delay to avoid catching the opening click)
        setTimeout(() => {
            document.addEventListener('click', this.handleOutsideClick);
        }, 100);
    },

    /**
     * Handle clicks outside cart dropdown
     */
    handleOutsideClick: function(e) {
        const dropdown = document.getElementById('cart-dropdown');
        const cartTrigger = document.getElementById('cart-trigger');
        
        if (dropdown && !dropdown.contains(e.target) && !cartTrigger.contains(e.target)) {
            ShoppingCart.closeCartModal();
            document.removeEventListener('click', ShoppingCart.handleOutsideClick);
        }
    },

    /**
     * Close cart dropdown
     */
    closeCartModal: function() {
        const dropdown = document.getElementById('cart-dropdown');
        if (dropdown) {
            dropdown.classList.remove('active');
            setTimeout(() => dropdown.remove(), 200);
            document.removeEventListener('click', this.handleOutsideClick);
        }
    },

    /**
     * Quick remove item from dropdown
     */
    removeItemQuick: function(itemId) {
        this.removeItem(itemId);
        this.closeCartModal();
        // Reopen to show updated cart
        setTimeout(() => this.showCartModal(), 100);
    },

    /**
     * Show add to cart confirmation
     */
    showAddConfirmation: function(itemName) {
        const notification = document.createElement('div');
        notification.className = 'cart-notification';
        notification.innerHTML = `
            <i class="fa-solid fa-check-circle"></i>
            <span>Added to cart: ${itemName}</span>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('show');
        }, 10);
        
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    },

    /**
     * Cookie utility functions
     */
    setCookie: function(name, value, days) {
        const expires = new Date();
        expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
        document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`;
    },

    getCookie: function(name) {
        const nameEQ = name + "=";
        const ca = document.cookie.split(';');
        for (let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) === ' ') c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
        }
        return null;
    },

    /**
     * Initialize cart system
     */
    init: function() {
        this.updateCartCount();
        
        // Set up cart trigger click handler
        const cartTrigger = document.getElementById('cart-trigger');
        if (cartTrigger) {
            cartTrigger.addEventListener('click', (e) => {
                e.preventDefault();
                this.showCartModal();
            });
        }
    }
};

// Initialize on page load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => ShoppingCart.init());
} else {
    ShoppingCart.init();
}


