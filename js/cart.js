// Global Cart Array stored in localStorage
let cart = JSON.parse(localStorage.getItem('pierceLENS_cart')) || [];

// UI Element References
const cartOverlay = document.getElementById('cart-overlay');
const cartSidebar = document.getElementById('cart-sidebar'); // The movable panel
const cartItemsContainer = document.getElementById('cart-items-list');
const cartTotalDisplay = document.getElementById('cart-subtotal');
// NOTE: Assuming you have an element in the header with id="open-cart" (your old 'cart-trigger')
const cartTrigger = document.getElementById('open-cart') || document.getElementById('cart-trigger'); 
const closeCartButton = document.getElementById('close-cart');
// NOTE: Assuming you have an element in the header with id="cart-count-bubble"
const cartCountBubble = document.getElementById('cart-count-bubble'); 

// --- Helper Functions ---

function saveCart() {
    localStorage.setItem('pierceLENS_cart', JSON.stringify(cart));
}

function calculateCartTotal() {
    const total = cart.reduce((sum, item) => sum + item.price, 0);
    cartTotalDisplay.textContent = `$${total.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;
    return total;
}

// --- Cart Item Manipulation ---

function removeItem(itemId) {
    cart = cart.filter(item => item.id !== itemId);
    saveCart();
    renderCart();
}

/**
 * Adds a new item to the cart and updates the UI.
 * @param {object} item - The product object to add.
 */
export function addItemToCart(item) {
    item.id = Date.now(); // Simple unique ID
    cart.push(item);
    saveCart();
    renderCart();
    openCart();
}

// --- Rendering Functions ---

function renderCart() {
    cartItemsContainer.innerHTML = '';
    
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p class="empty-cart-message">Your cart is empty.</p>';
        if (cartCountBubble) cartCountBubble.style.display = 'none';
    } else {
        cart.forEach(item => {
            const itemElement = document.createElement('div');
            itemElement.classList.add('cart-item');
            
            // Generate Description for display
            let description = '';
            if (item.type === 'camera' && item.options) {
                description = `Color: ${item.options.finish}, Grip: ${item.options.grip || 'None'}`;
                if (item.options.accessories && item.options.accessories.length > 0) {
                    description += `, +${item.options.accessories.join(', ')}`;
                }
            } else {
                description = item.description || '';
            }
            
            // Use the .cart-item structure to render
            itemElement.innerHTML = `
                <div class="item-details">
                    <p class="item-name">${item.name}</p>
                    ${description ? `<p class="item-config">${description}</p>` : ''}
                    <p class="item-price">$${item.price.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</p>
                </div>
                <button class="remove-btn" data-item-id="${item.id}">&times;</button>
            `;
            
            cartItemsContainer.appendChild(itemElement);
        });
        
        // Attach event listeners to remove buttons
        document.querySelectorAll('.remove-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                const itemId = parseInt(e.currentTarget.dataset.itemId);
                removeItem(itemId);
            });
        });
        
        if (cartCountBubble) {
            cartCountBubble.textContent = cart.length;
            cartCountBubble.style.display = 'flex';
        }
    }
    
    calculateCartTotal();
}

// --- UI Toggles (Using your existing 'visible' class logic) ---

function openCart() {
    if (cartOverlay) cartOverlay.classList.add('visible');
    // Prevent background scrolling
    document.body.style.overflow = 'hidden'; 
}

function closeCart() {
    if (cartOverlay) cartOverlay.classList.remove('visible');
    // Restore background scrolling
    document.body.style.overflow = ''; 
}

// --- Event Listeners and Initialization ---
document.addEventListener('DOMContentLoaded', () => {
    // Cart open/close listeners
    if (cartTrigger) {
        cartTrigger.addEventListener('click', (e) => {
            e.preventDefault();
            openCart();
        });
    }

    if (closeCartButton) {
        closeCartButton.addEventListener('click', closeCart);
    }
    
    // Close cart if user clicks outside the sidebar (on the overlay itself)
    if (cartOverlay) {
        cartOverlay.addEventListener('click', (e) => {
            if (e.target === cartOverlay) {
                closeCart();
            }
        });
    }
    
    // Close cart on Escape key press
    document.addEventListener('keydown', (e) => {
        if (e.key === "Escape" && cartOverlay?.classList.contains('visible')) {
            closeCart();
        }
    });

    renderCart();
});

// Export for use in other modules (like configurator.js and store logic)
export { addItemToCart };