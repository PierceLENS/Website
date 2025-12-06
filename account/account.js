(function() {
    const SESSION_KEY = 'pl_session';
    const USERS_KEY = 'pl_users';
    const PAYMENT_KEY = 'pl_payments';
    const ADDRESSES_KEY = 'pl_addresses';
    const SETTINGS_KEY = 'pl_settings';

    let currentUser = null;

    // Utility functions
    function loadSession() {
        const raw = sessionStorage.getItem(SESSION_KEY) || localStorage.getItem(SESSION_KEY);
        if (!raw) {
            window.location.href = '../index.html';
            return null;
        }
        try {
            return JSON.parse(raw);
        } catch (e) {
            return null;
        }
    }

    function findUser(email) {
        try {
            const users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
            return users.find(u => u.email.toLowerCase() === email.toLowerCase());
        } catch (e) {
            return null;
        }
    }

    function updateUser(email, data) {
        try {
            const users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
            const idx = users.findIndex(u => u.email.toLowerCase() === email.toLowerCase());
            if (idx !== -1) {
                users[idx] = { ...users[idx], ...data };
                localStorage.setItem(USERS_KEY, JSON.stringify(users));
            }
        } catch (e) {
            console.error('Error updating user', e);
        }
    }

    function hashPassword(pw) {
        return btoa(unescape(encodeURIComponent(pw)));
    }

    function loadPayments() {
        try {
            return JSON.parse(localStorage.getItem(PAYMENT_KEY) || '{}');
        } catch (e) {
            return {};
        }
    }

    function savePayments(payments) {
        localStorage.setItem(PAYMENT_KEY, JSON.stringify(payments));
    }

    function loadAddresses() {
        try {
            return JSON.parse(localStorage.getItem(ADDRESSES_KEY) || '{}');
        } catch (e) {
            return {};
        }
    }

    function saveAddresses(addresses) {
        localStorage.setItem(ADDRESSES_KEY, JSON.stringify(addresses));
    }

    function loadSettings(email) {
        try {
            const settings = JSON.parse(localStorage.getItem(`${SETTINGS_KEY}_${email}`) || '{"emailNotif": true, "marketing": false, "twofa": false}');
            return settings;
        } catch (e) {
            return { emailNotif: true, marketing: false, twofa: false };
        }
    }

    function saveSettings(email, settings) {
        localStorage.setItem(`${SETTINGS_KEY}_${email}`, JSON.stringify(settings));
    }

    function loadProfile(email) {
        const user = findUser(email);
        if (!user) return null;
        try {
            const profile = JSON.parse(localStorage.getItem(`pl_profile_${email}`) || '{}');
            return { ...user, ...profile };
        } catch (e) {
            return user;
        }
    }

    function saveProfile(email, data) {
        localStorage.setItem(`pl_profile_${email}`, JSON.stringify(data));
    }

    // Render functions
    function renderProfile() {
        const avatarDisplay = document.getElementById('profile-avatar-display');
        const displayName = document.getElementById('profile-display-name');
        const displayEmail = document.getElementById('profile-display-email');

        const initials = (currentUser.name || currentUser.email || 'P')
            .trim()
            .split(/\s+/)
            .map(p => p[0])
            .join('')
            .slice(0, 2)
            .toUpperCase();

        avatarDisplay.textContent = initials || 'P';
        displayName.textContent = currentUser.name || 'User';
        displayEmail.textContent = currentUser.email;

        // Fill form
        document.getElementById('profile-name').value = currentUser.name || '';
        document.getElementById('profile-email').value = currentUser.email;
        document.getElementById('profile-phone').value = currentUser.phone || '';
        document.getElementById('profile-country').value = currentUser.country || '';
    }

    function renderPayments() {
        const container = document.getElementById('payment-methods-list');
        const payments = loadPayments()[currentUser.email] || [];

        if (payments.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <i class="fa-solid fa-credit-card"></i>
                    <p>No payment methods saved</p>
                </div>
            `;
            return;
        }

        container.innerHTML = payments.map((card, idx) => `
            <div class="payment-card">
                <div class="payment-card-info">
                    <div class="payment-card-icon">${card.type.slice(0, 2).toUpperCase()}</div>
                    <div class="payment-card-details">
                        <h4>${card.name}</h4>
                        <p>••• ••• ${card.lastFour.slice(-3)}</p>
                    </div>
                    ${card.isDefault ? '<span style="color: var(--color-main-accent); font-size: 12px; font-weight: 700;">DEFAULT</span>' : ''}
                </div>
                <div class="payment-card-actions">
                    ${!card.isDefault ? `<button type="button" data-action="set-default" data-idx="${idx}">Set Default</button>` : ''}
                    <button type="button" data-action="delete-payment" data-idx="${idx}">Delete</button>
                </div>
            </div>
        `).join('');
    }

    function renderAddresses() {
        const container = document.getElementById('address-book-list');
        const addresses = loadAddresses()[currentUser.email] || [];

        if (addresses.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <i class="fa-solid fa-location-dot"></i>
                    <p>No addresses saved</p>
                </div>
            `;
            return;
        }

        container.innerHTML = addresses.map((addr, idx) => `
            <div class="address-card">
                <div class="address-card-info">
                    <h4>${addr.name}</h4>
                    <p>${addr.street}</p>
                    <p>${addr.city}, ${addr.state} ${addr.zip}</p>
                    <p>${addr.country}</p>
                    ${addr.isDefault ? '<span class="default-badge">Default</span>' : ''}
                </div>
                <div class="address-card-actions">
                    ${!addr.isDefault ? `<button type="button" data-action="set-default-addr" data-idx="${idx}">Set Default</button>` : ''}
                    <button type="button" data-action="delete-address" data-idx="${idx}">Delete</button>
                </div>
            </div>
        `).join('');
    }

    // Event listeners
    function setupEventListeners() {
        // Sidebar navigation
        document.querySelectorAll('.account-nav-link').forEach(link => {
            link.addEventListener('click', () => {
                const section = link.dataset.section;
                switchSection(section);
                document.querySelectorAll('.account-nav-link').forEach(l => l.classList.remove('active'));
                link.classList.add('active');
            });
        });

        // === PROFILE SECTION ===
        document.getElementById('profile-form').addEventListener('submit', (e) => {
            e.preventDefault();
            const data = {
                name: document.getElementById('profile-name').value,
                phone: document.getElementById('profile-phone').value,
                country: document.getElementById('profile-country').value
            };
            saveProfile(currentUser.email, data);
            currentUser = { ...currentUser, ...data };
            renderProfile();
            showMessage('profile-message', 'Profile updated successfully', false);
        });

        // Avatar upload
        const avatarInput = document.getElementById('profile-avatar');
        if (avatarInput) {
            avatarInput.addEventListener('change', (e) => {
                const file = e.target.files[0];
                if (file && file.size <= 2097152) {
                    const reader = new FileReader();
                    reader.onload = (event) => {
                        saveProfile(currentUser.email, { avatar: event.target.result });
                        currentUser.avatar = event.target.result;
                        renderProfile();
                    };
                    reader.readAsDataURL(file);
                } else {
                    alert('File too large (max 2MB)');
                }
            });
        }

        // === PAYMENT SECTION ===
        const paymentModal = document.getElementById('payment-modal');
        document.getElementById('add-payment-btn').addEventListener('click', () => {
            paymentModal.classList.add('active');
        });

        paymentModal.querySelector('.modal-close').addEventListener('click', () => {
            paymentModal.classList.remove('active');
        });

        paymentModal.addEventListener('click', (e) => {
            if (e.target === paymentModal) {
                paymentModal.classList.remove('active');
            }
        });

        document.getElementById('payment-form').addEventListener('submit', (e) => {
            e.preventDefault();
            const accountNumber = document.getElementById('card-number').value.replace(/\s/g, '');
            if (accountNumber.length < 9) {
                alert('Invalid account number. Please enter a 9-digit account number.');
                return;
            }

            const payments = loadPayments();
            if (!payments[currentUser.email]) payments[currentUser.email] = [];

            const isDefault = document.getElementById('card-default').checked;
            if (isDefault) {
                payments[currentUser.email].forEach(c => c.isDefault = false);
            }

            payments[currentUser.email].push({
                name: document.getElementById('card-name').value,
                type: 'US Bank',
                lastFour: accountNumber.slice(-4),
                isDefault: isDefault || payments[currentUser.email].length === 0
            });

            savePayments(payments);
            renderPayments();
            document.getElementById('payment-form').reset();
            paymentModal.classList.remove('active');
        });

        document.getElementById('card-number').addEventListener('input', (e) => {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length > 9) value = value.slice(0, 9);
            const formatted = value.replace(/(\d{3})(\d{1,3})?(\d{1,3})?/, (match, p1, p2, p3) => {
                let result = p1;
                if (p2) result += ' ' + p2;
                if (p3) result += ' ' + p3;
                return result;
            });
            e.target.value = formatted;
        });

        document.getElementById('payment-methods-list').addEventListener('click', (e) => {
            if (e.target.dataset.action === 'delete-payment') {
                const idx = parseInt(e.target.dataset.idx);
                const payments = loadPayments();
                payments[currentUser.email].splice(idx, 1);
                savePayments(payments);
                renderPayments();
            } else if (e.target.dataset.action === 'set-default') {
                const idx = parseInt(e.target.dataset.idx);
                const payments = loadPayments();
                payments[currentUser.email].forEach(c => c.isDefault = false);
                payments[currentUser.email][idx].isDefault = true;
                savePayments(payments);
                renderPayments();
            }
        });

        // === ADDRESS SECTION ===
        const addressModal = document.getElementById('address-modal');
        document.getElementById('add-address-btn').addEventListener('click', () => {
            addressModal.classList.add('active');
        });

        addressModal.querySelector('.modal-close').addEventListener('click', () => {
            addressModal.classList.remove('active');
        });

        addressModal.addEventListener('click', (e) => {
            if (e.target === addressModal) {
                addressModal.classList.remove('active');
            }
        });

        document.getElementById('address-form').addEventListener('submit', (e) => {
            e.preventDefault();
            const addresses = loadAddresses();
            if (!addresses[currentUser.email]) addresses[currentUser.email] = [];

            const isDefault = document.getElementById('addr-default').checked;
            if (isDefault) {
                addresses[currentUser.email].forEach(a => a.isDefault = false);
            }

            addresses[currentUser.email].push({
                name: document.getElementById('addr-name').value,
                street: document.getElementById('addr-street').value,
                city: document.getElementById('addr-city').value,
                state: document.getElementById('addr-state').value,
                zip: document.getElementById('addr-zip').value,
                country: document.getElementById('addr-country').value,
                isDefault: isDefault || addresses[currentUser.email].length === 0
            });

            saveAddresses(addresses);
            renderAddresses();
            document.getElementById('address-form').reset();
            addressModal.classList.remove('active');
        });

        document.getElementById('address-book-list').addEventListener('click', (e) => {
            if (e.target.dataset.action === 'delete-address') {
                const idx = parseInt(e.target.dataset.idx);
                const addresses = loadAddresses();
                addresses[currentUser.email].splice(idx, 1);
                saveAddresses(addresses);
                renderAddresses();
            } else if (e.target.dataset.action === 'set-default-addr') {
                const idx = parseInt(e.target.dataset.idx);
                const addresses = loadAddresses();
                addresses[currentUser.email].forEach(a => a.isDefault = false);
                addresses[currentUser.email][idx].isDefault = true;
                saveAddresses(addresses);
                renderAddresses();
            }
        });

        // === SETTINGS SECTION ===
        const settings = loadSettings(currentUser.email);
        document.getElementById('setting-email-notif').checked = settings.emailNotif;
        document.getElementById('setting-marketing').checked = settings.marketing;

        document.getElementById('setting-email-notif').addEventListener('change', (e) => {
            settings.emailNotif = e.target.checked;
            saveSettings(currentUser.email, settings);
        });

        document.getElementById('setting-marketing').addEventListener('change', (e) => {
            settings.marketing = e.target.checked;
            saveSettings(currentUser.email, settings);
        });

        // Password change
        const passwordModal = document.getElementById('password-modal');
        document.getElementById('change-password-btn').addEventListener('click', () => {
            passwordModal.classList.add('active');
        });

        passwordModal.querySelector('.modal-close').addEventListener('click', () => {
            passwordModal.classList.remove('active');
        });

        passwordModal.addEventListener('click', (e) => {
            if (e.target === passwordModal) {
                passwordModal.classList.remove('active');
            }
        });

        document.getElementById('password-form').addEventListener('submit', (e) => {
            e.preventDefault();
            const currentPw = document.getElementById('current-password').value;
            const newPw = document.getElementById('new-password').value;
            const confirmPw = document.getElementById('confirm-password').value;

            const user = findUser(currentUser.email);
            if (hashPassword(currentPw) !== user.password) {
                showMessage('password-message', 'Current password is incorrect', true);
                return;
            }

            if (newPw.length < 8) {
                showMessage('password-message', 'Password must be at least 8 characters', true);
                return;
            }

            if (newPw !== confirmPw) {
                showMessage('password-message', 'Passwords do not match', true);
                return;
            }

            updateUser(currentUser.email, { password: hashPassword(newPw) });
            showMessage('password-message', 'Password updated successfully', false);
            document.getElementById('password-form').reset();
            setTimeout(() => {
                passwordModal.classList.remove('active');
            }, 1500);
        });

        // 2FA setup
        const twoFAModal = document.getElementById('twofa-modal');
        document.getElementById('setup-2fa-btn').addEventListener('click', () => {
            twoFAModal.classList.add('active');
        });

        twoFAModal.querySelector('.modal-close').addEventListener('click', () => {
            twoFAModal.classList.remove('active');
        });

        twoFAModal.addEventListener('click', (e) => {
            if (e.target === twoFAModal) {
                twoFAModal.classList.remove('active');
            }
        });

        document.getElementById('enable-2fa-btn').addEventListener('click', () => {
            switchTwoFAStep(2);
        });

        document.getElementById('copy-code-btn').addEventListener('click', () => {
            const code = document.getElementById('secret-code').textContent;
            navigator.clipboard.writeText(code).then(() => {
                const btn = document.getElementById('copy-code-btn');
                const origText = btn.innerHTML;
                btn.innerHTML = '<i class="fa-solid fa-check"></i> Copied!';
                setTimeout(() => {
                    btn.innerHTML = origText;
                }, 2000);
            });
        });

        document.getElementById('verify-2fa-btn').addEventListener('click', () => {
            const code = document.getElementById('twofa-code').value;
            if (code.length === 6) {
                settings.twofa = true;
                saveSettings(currentUser.email, settings);
                switchTwoFAStep(4);
                setTimeout(() => {
                    twoFAModal.classList.remove('active');
                    resetTwoFAModal();
                }, 2000);
            }
        });

        document.getElementById('cancel-2fa-btn').addEventListener('click', () => {
            twoFAModal.classList.remove('active');
            resetTwoFAModal();
        });

        // Delete account
        document.getElementById('delete-account-btn').addEventListener('click', () => {
            if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
                const users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
                const idx = users.findIndex(u => u.email === currentUser.email);
                if (idx !== -1) {
                    users.splice(idx, 1);
                    localStorage.setItem(USERS_KEY, JSON.stringify(users));
                    localStorage.removeItem(SESSION_KEY);
                    sessionStorage.removeItem(SESSION_KEY);
                    localStorage.removeItem(`pl_profile_${currentUser.email}`);
                    window.location.href = '../index.html';
                }
            }
        });
    }

    function switchSection(section) {
        document.querySelectorAll('.account-section').forEach(s => {
            s.classList.remove('active');
        });
        document.getElementById(`${section}-section`).classList.add('active');
    }

    function switchTwoFAStep(step) {
        document.querySelectorAll('.twofa-step').forEach(s => {
            s.classList.remove('active');
        });
        document.getElementById(`twofa-step-${step}`).classList.add('active');
    }

    function resetTwoFAModal() {
        switchTwoFAStep(1);
        document.getElementById('twofa-code').value = '';
    }

    function showMessage(elementId, text, isError = false) {
        const el = document.getElementById(elementId);
        if (!el) return;
        el.textContent = text;
        el.classList.toggle('error', isError);
        setTimeout(() => {
            el.textContent = '';
            el.classList.remove('error');
        }, 3000);
    }

    // Initialize
    function init() {
        const session = loadSession();
        if (!session || !session.email) {
            window.location.href = '../index.html';
            return;
        }

        currentUser = loadProfile(session.email);
        if (!currentUser) {
            window.location.href = '../index.html';
            return;
        }

        renderProfile();
        renderPayments();
        renderAddresses();
        setupEventListeners();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
