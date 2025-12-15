/**
 * Checkout Page (checkout/index.html) Specific Script
 */

document.addEventListener('DOMContentLoaded', function() {
    // Mobile nav toggle
    setupMobileNavToggle('.nav-toggle', '.nav-list');

    // Load user session and autofill
    loadUserSession();

    // Setup payment method selection
    setupPaymentMethodSelection('.payment-method', '.payment-details');

    // Card number formatting
    setupCardNumberFormatting('#cardNumber');

    // Expiry date formatting
    setupExpiryFormatting('#expiry');

    // Initialize VE Marketplace integration
    if (typeof VEMarketplace !== 'undefined') {
        VEMarketplace.init();
    }

    // Place order button
    const placeOrderBtn = document.querySelector('.place-order-btn');
    if (placeOrderBtn) {
        placeOrderBtn.addEventListener('click', handlePlaceOrder);
    }

    // Load checkout cart
    loadCheckoutCart();

    // Cart trigger
    const cartTrigger = document.getElementById('cart-trigger');
    if (cartTrigger && typeof ShoppingCart !== 'undefined') {
        cartTrigger.addEventListener('click', function(e) {
            e.preventDefault();
            ShoppingCart.showCartModal();
        });
        ShoppingCart.updateCartCount();
    }

    // Crypto modal
    const cryptoConfirmBtn = document.getElementById('crypto-confirm-btn');
    const cryptoCancelBtn = document.getElementById('crypto-cancel-btn');
    const cryptoModal = document.getElementById('crypto-modal');
    
    if (cryptoConfirmBtn) {
        cryptoConfirmBtn.addEventListener('click', handleCryptoConfirm);
    }
    if (cryptoCancelBtn) {
        cryptoCancelBtn.addEventListener('click', function() {
            if (cryptoModal) cryptoModal.style.display = 'none';
        });
    }

    // PayPal modal
    const paypalConfirmBtn = document.getElementById('paypal-confirm-btn');
    const paypalCancelBtn = document.getElementById('paypal-cancel-btn');
    const paypalModal = document.getElementById('paypal-modal');
    
    if (paypalConfirmBtn) {
        paypalConfirmBtn.addEventListener('click', handlePaypalConfirm);
    }
    if (paypalCancelBtn) {
        paypalCancelBtn.addEventListener('click', function() {
            if (paypalModal) paypalModal.style.display = 'none';
        });
    }
});

/**
 * Load cart data from session storage and populate order summary
 */
function loadCheckoutCart() {
    const checkoutCart = sessionStorage.getItem('checkout_cart');
    
    if (!checkoutCart) {
        const cart = typeof ShoppingCart !== 'undefined' ? ShoppingCart.getCart() : { items: [] };
        if (cart.items.length === 0) {
            return;
        }
        populateOrderSummary(cart);
    } else {
        const cart = JSON.parse(checkoutCart);
        populateOrderSummary(cart);
    }
}

/**
 * Populate order summary with cart items
 */
function populateOrderSummary(cart) {
    const orderItemsContainer = document.querySelector('.order-items');
    if (!orderItemsContainer) return;

    const subtotal = cart.items.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0);
    const shipping = 0;
    const tax = subtotal * 0.0875;
    const total = subtotal + shipping + tax;

    orderItemsContainer.innerHTML = cart.items.map(item => {
        const customizations = item.customizations 
            ? Object.entries(item.customizations).map(([key, value]) => 
                `<p>${key}: ${value}</p>`
              ).join('')
            : '';

        return `
            <div class="order-item">
                <div class="item-image">
                    <img src="${item.image}" alt="${item.name}">
                </div>
                <div class="item-details">
                    <h3>${item.name}</h3>
                    ${customizations}
                    ${item.quantity > 1 ? `<p>Qty: ${item.quantity}</p>` : ''}
                </div>
                <div class="item-price">$${(item.price * (item.quantity || 1)).toFixed(2)}</div>
            </div>
        `;
    }).join('');

    const rows = document.querySelectorAll('.order-totals .total-row');
    if (rows.length >= 3) {
        rows[0].querySelector('strong').textContent = `$${subtotal.toFixed(2)}`;
        rows[1].querySelector('strong').textContent = shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`;
        rows[2].querySelector('strong').textContent = `$${tax.toFixed(2)}`;
    }

    const finalTotal = document.querySelector('.order-totals .total-row.final strong');
    if (finalTotal) {
        finalTotal.textContent = `$${total.toFixed(2)}`;
    }
}

/**
 * Handle place order button click
 */
async function handlePlaceOrder() {
    const formData = {
        firstName: document.getElementById('firstName').value,
        lastName: document.getElementById('lastName').value,
        email: document.getElementById('email').value,
        paymentMethod: document.querySelector('.payment-method.active')?.dataset.method
    };

    if (!validateCheckoutForm(formData)) {
        alert('Please fill in all required fields.');
        return;
    }

    let paymentData = {};
    const paymentMethod = formData.paymentMethod;

    if (paymentMethod === 'crypto') {
        paymentData = { crypto: true };
    } else if (paymentMethod === 'paypal') {
        paymentData = { paypal: true };
    } else if (paymentMethod === 'card') {
        paymentData = getCardPaymentData();
        if (!paymentData) {
            alert('Please select a payment method or enter payment information.');
            return;
        }
    }

    const completeOrderData = {
        customer: formData,
        payment: paymentData,
        items: typeof VEMarketplace !== 'undefined' ? VEMarketplace.getOrderItems() : [],
        total: parseFloat(document.querySelector('.total-row.final strong')?.textContent.replace('$', '').replace(',', '') || 0)
    };

    if (paymentMethod === 'crypto') {
        const cryptoModal = document.getElementById('crypto-modal');
        if (cryptoModal) {
            cryptoModal.style.display = 'flex';
            window.cryptoOrderData = completeOrderData;
        }
        return;
    }
    if (paymentMethod === 'paypal') {
        const paypalModal = document.getElementById('paypal-modal');
        if (paypalModal) {
            paypalModal.style.display = 'flex';
            window.paypalOrderData = completeOrderData;
        }
        return;
    }

    // Process card payment
    const result = await (typeof VEMarketplace !== 'undefined' 
        ? VEMarketplace.demoTransaction(formData)
        : { success: true });
    
    if (typeof VEMarketplace !== 'undefined') {
        VEMarketplace.showLoading(false);
        if (result.success) {
            VEMarketplace.showCashierConfirmation(completeOrderData, result);
        }
    }
}

/**
 * Validate checkout form
 */
function validateCheckoutForm(formData) {
    let isValid = true;
    const paymentMethod = formData.paymentMethod;

    if (paymentMethod === 'crypto' || paymentMethod === 'paypal') {
        const userFields = [
            document.getElementById('firstName'),
            document.getElementById('lastName'),
            document.getElementById('email')
        ];
        userFields.forEach(field => {
            if (!field.value) {
                isValid = false;
                field.style.borderColor = '#ff4444';
            } else {
                field.style.borderColor = '';
            }
        });
    } else {
        const requiredFields = document.querySelectorAll('input[required], select[required]');
        requiredFields.forEach(field => {
            if (!field.value) {
                isValid = false;
                field.style.borderColor = '#ff4444';
            } else {
                field.style.borderColor = '';
            }
        });

        if (paymentMethod === 'card') {
            const cardName = document.getElementById('cardName');
            const cardNumber = document.getElementById('cardNumber');
            
            if (cardName && !cardName.value) {
                isValid = false;
                cardName.style.borderColor = '#ff4444';
            }
            if (cardNumber && !cardNumber.value) {
                isValid = false;
                cardNumber.style.borderColor = '#ff4444';
            }
        }
    }

    return isValid;
}

/**
 * Get card payment data from form or saved payments
 */
function getCardPaymentData() {
    const cardDetails = document.getElementById('card-details');
    const selectedPaymentIdx = cardDetails?.dataset.selectedPayment;

    if (selectedPaymentIdx !== undefined) {
        const sessionRaw = sessionStorage.getItem('pl_session') || localStorage.getItem('pl_session');
        if (sessionRaw) {
            const session = JSON.parse(sessionRaw);
            const payments = JSON.parse(localStorage.getItem('pl_payments') || '{}');
            const userPayments = payments[session.email] || [];
            const savedPayment = userPayments[parseInt(selectedPaymentIdx)];
            
            if (savedPayment) {
                return {
                    cardName: savedPayment.name,
                    cardNumber: '••• ••• ' + savedPayment.lastFour.slice(-3),
                    savedPayment: true
                };
            }
        }
    }

    const cardName = document.getElementById('cardName')?.value;
    const cardNumber = document.getElementById('cardNumber')?.value;
    
    if (cardName && cardNumber) {
        return {
            cardName,
            cardNumber,
            savedPayment: false
        };
    }

    return null;
}

/**
 * Handle crypto confirmation
 */
async function handleCryptoConfirm() {
    const cryptoModal = document.getElementById('crypto-modal');
    if (cryptoModal) cryptoModal.style.display = 'none';
    
    if (window.cryptoOrderData && typeof VEMarketplace !== 'undefined') {
        VEMarketplace.showLoading(true);
        const result = await VEMarketplace.demoTransaction(window.cryptoOrderData.customer);
        VEMarketplace.showLoading(false);
        if (result.success) {
            VEMarketplace.showCashierConfirmation(window.cryptoOrderData, result);
        } else {
            alert('There was a problem processing your crypto payment.');
        }
    } else {
        alert('Order data missing. Please try again.');
    }
}

/**
 * Handle PayPal confirmation
 */
async function handlePaypalConfirm() {
    const paypalModal = document.getElementById('paypal-modal');
    if (paypalModal) paypalModal.style.display = 'none';
    
    if (window.paypalOrderData && typeof VEMarketplace !== 'undefined') {
        VEMarketplace.showLoading(true);
        const result = await VEMarketplace.demoTransaction(window.paypalOrderData.customer);
        VEMarketplace.showLoading(false);
        if (result.success) {
            VEMarketplace.showCashierConfirmation(window.paypalOrderData, result);
        } else {
            alert('There was a problem processing your PayPal payment.');
        }
    } else {
        alert('Order data missing. Please try again.');
    }
}

