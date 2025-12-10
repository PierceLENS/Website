/**
 * Form Handling Module
 * Manages form interactions, validation, and user session loading
 */

// Load user session and autofill information
function loadUserSession() {
    const SESSION_KEY = 'pl_session';
    const USERS_KEY = 'pl_users';
    const PAYMENT_KEY = 'pl_payments';
    
    const sessionRaw = sessionStorage.getItem(SESSION_KEY) || localStorage.getItem(SESSION_KEY);
    if (!sessionRaw) return;

    try {
        const session = JSON.parse(sessionRaw);
        const users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
        const user = users.find(u => u.email.toLowerCase() === session.email.toLowerCase());
        
        if (user) {
            const profileData = JSON.parse(localStorage.getItem(`pl_profile_${user.email}`) || '{}');
            const fullUser = { ...user, ...profileData };

            document.getElementById('user-info-preview').style.display = 'block';
            document.getElementById('user-info-form').style.display = 'none';
            
            document.getElementById('preview-name').textContent = fullUser.name || 'User';
            document.getElementById('preview-email').textContent = fullUser.email;
            
            if (fullUser.phone) {
                document.getElementById('preview-phone').style.display = 'block';
                document.getElementById('preview-phone').querySelector('span').textContent = fullUser.phone;
            }

            if (fullUser.name) {
                const nameParts = fullUser.name.trim().split(/\s+/);
                document.getElementById('firstName').value = nameParts[0] || '';
                document.getElementById('lastName').value = nameParts.slice(1).join(' ') || '';
            }
            document.getElementById('email').value = fullUser.email;

            document.getElementById('edit-user-info-btn').addEventListener('click', function() {
                document.getElementById('user-info-preview').style.display = 'none';
                document.getElementById('user-info-form').style.display = 'block';
                document.getElementById('save-user-info-btn').style.display = 'block';
            });

            document.getElementById('save-user-info-btn').addEventListener('click', function() {
                const firstName = document.getElementById('firstName').value;
                const lastName = document.getElementById('lastName').value;
                const fullName = `${firstName} ${lastName}`.trim();
                
                document.getElementById('preview-name').textContent = fullName || 'User';
                document.getElementById('preview-email').textContent = document.getElementById('email').value;
                
                document.getElementById('user-info-preview').style.display = 'block';
                document.getElementById('user-info-form').style.display = 'none';
                document.getElementById('save-user-info-btn').style.display = 'none';
            });

            loadSavedPayments(user.email);
        }
    } catch (e) {
        console.error('Error loading user session:', e);
    }
}

// Load and display saved payment methods
function loadSavedPayments(email) {
    const PAYMENT_KEY = 'pl_payments';
    const payments = JSON.parse(localStorage.getItem(PAYMENT_KEY) || '{}');
    const userPayments = payments[email] || [];

    if (userPayments.length === 0) return;

    document.getElementById('saved-payments-section').style.display = 'block';
    document.getElementById('manual-payment-heading').textContent = 'Or Enter New Payment Method';

    const container = document.getElementById('saved-payments-list');
    container.innerHTML = userPayments.map((payment, idx) => `
        <div class="saved-payment-option" data-idx="${idx}" data-name="${payment.name}" data-number="••• ••• ${payment.lastFour.slice(-3)}" data-is-default="${payment.isDefault}" style="
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 16px;
            background: rgba(0, 191, 255, 0.05);
            border: 2px solid rgba(0, 191, 255, 0.2);
            border-radius: 10px;
            cursor: pointer;
            transition: all 0.3s ease;
        ">
            <div style="display: flex; align-items: center; gap: 15px;">
                <i class="fa-solid fa-building-columns" style="font-size: 24px; color: var(--color-main-accent);"></i>
                <div>
                    <div style="font-weight: 600; color: var(--color-text-primary); margin-bottom: 4px;">
                        ${payment.name}
                    </div>
                    <div style="font-size: 13px; color: var(--color-text-secondary);">
                        ••• ••• ${payment.lastFour.slice(-3)}
                    </div>
                </div>
            </div>
            ${payment.isDefault ? '<span style="color: var(--color-main-accent); font-size: 12px; font-weight: 700;">DEFAULT</span>' : ''}
        </div>
    `).join('');

    document.querySelectorAll('.saved-payment-option').forEach(option => {
        option.addEventListener('click', function() {
            document.querySelectorAll('.saved-payment-option').forEach(opt => {
                opt.style.borderColor = 'rgba(0, 191, 255, 0.2)';
                opt.style.background = 'rgba(0, 191, 255, 0.05)';
            });
            
            this.style.borderColor = 'var(--color-main-accent)';
            this.style.background = 'rgba(0, 191, 255, 0.15)';

            document.getElementById('cardName').value = '';
            document.getElementById('cardNumber').value = '';

            document.getElementById('card-details').dataset.selectedPayment = this.dataset.idx;
            document.getElementById('card-details').dataset.selectedName = this.dataset.name;
            document.getElementById('card-details').dataset.selectedNumber = this.dataset.number;
            document.getElementById('card-details').dataset.selectedIsDefault = this.dataset.isDefault;

            document.getElementById('save-payment-selection-btn').style.display = 'block';
        });

        option.addEventListener('mouseenter', function() {
            if (this.style.borderColor !== 'var(--color-main-accent)') {
                this.style.borderColor = 'rgba(0, 191, 255, 0.5)';
                this.style.background = 'rgba(0, 191, 255, 0.1)';
            }
        });

        option.addEventListener('mouseleave', function() {
            if (this.style.borderColor !== 'var(--color-main-accent)') {
                this.style.borderColor = 'rgba(0, 191, 255, 0.2)';
                this.style.background = 'rgba(0, 191, 255, 0.05)';
            }
        });
    });

    const defaultPayment = userPayments.findIndex(p => p.isDefault);
    if (defaultPayment !== -1) {
        const defaultOption = container.children[defaultPayment];
        if (defaultOption) {
            defaultOption.click();
            showPaymentPreview(
                userPayments[defaultPayment].name,
                '••• ••• ' + userPayments[defaultPayment].lastFour.slice(-3),
                userPayments[defaultPayment].isDefault
            );
        }
    }

    document.getElementById('edit-payment-btn').addEventListener('click', function() {
        document.getElementById('payment-preview').style.display = 'none';
        document.getElementById('payment-selection').style.display = 'block';
    });

    document.getElementById('save-payment-selection-btn').addEventListener('click', function() {
        const cardDetails = document.getElementById('card-details');
        const selectedName = cardDetails.dataset.selectedName;
        const selectedNumber = cardDetails.dataset.selectedNumber;
        const selectedIsDefault = cardDetails.dataset.selectedIsDefault === 'true';

        if (selectedName) {
            showPaymentPreview(selectedName, selectedNumber, selectedIsDefault);
        }
    });
}

// Show payment preview card
function showPaymentPreview(name, number, isDefault) {
    document.getElementById('selected-payment-name').textContent = name;
    document.getElementById('selected-payment-number').textContent = number;
    document.getElementById('selected-payment-badge').style.display = isDefault ? 'block' : 'none';
    
    document.getElementById('payment-preview').style.display = 'block';
    document.getElementById('payment-selection').style.display = 'none';
    document.getElementById('save-payment-selection-btn').style.display = 'none';
}

// Setup card number formatting
function setupCardNumberFormatting(inputSelector = '#cardNumber') {
    const cardNumber = document.querySelector(inputSelector);
    if (!cardNumber) return;

    cardNumber.addEventListener('input', function(e) {
        let value = e.target.value.replace(/\s/g, '').replace(/\D/g, '');
        if (value.length > 9) value = value.slice(0, 9);
        let formattedValue = value.match(/.{1,3}/g)?.join(' ') || value;
        e.target.value = formattedValue;
    });
}

// Setup expiry date formatting
function setupExpiryFormatting(inputSelector = '#expiry') {
    const expiry = document.querySelector(inputSelector);
    if (!expiry) return;

    expiry.addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length >= 2) {
            value = value.slice(0, 2) + '/' + value.slice(2, 4);
        }
        e.target.value = value;
    });
}

// Export functions
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        loadUserSession,
        loadSavedPayments,
        showPaymentPreview,
        setupCardNumberFormatting,
        setupExpiryFormatting
    };
}
