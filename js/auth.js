(function() {
    const USERS_KEY = 'pl_users';
    const SESSION_KEY = 'pl_session';

    let state = {
        currentUser: null
    };

    const els = {
        overlay: null,
        modal: null,
        tabs: [],
        form: null,
        nameField: null,
        emailField: null,
        passwordField: null,
        rememberField: null,
        error: null,
        success: null,
        submit: null,
        accountWrapper: null,
        accountChip: null,
        accountAvatar: null,
        accountDropdown: null
    };

    function loadUsers() {
        try {
            const raw = localStorage.getItem(USERS_KEY);
            return raw ? JSON.parse(raw) : [];
        } catch (e) {
            return [];
        }
    }

    function saveUsers(users) {
        localStorage.setItem(USERS_KEY, JSON.stringify(users));
    }

    function hashPassword(pw) {
        return btoa(unescape(encodeURIComponent(pw)));
    }

    function findUser(email) {
        return loadUsers().find(u => u.email.toLowerCase() === email.toLowerCase());
    }

    function setSession(email, remember) {
        const payload = JSON.stringify({ email });
        if (remember) {
            localStorage.setItem(SESSION_KEY, payload);
            sessionStorage.removeItem(SESSION_KEY);
        } else {
            sessionStorage.setItem(SESSION_KEY, payload);
            localStorage.removeItem(SESSION_KEY);
        }
    }

    function clearSession() {
        localStorage.removeItem(SESSION_KEY);
        sessionStorage.removeItem(SESSION_KEY);
        state.currentUser = null;
    }

    function getSession() {
        const raw = sessionStorage.getItem(SESSION_KEY) || localStorage.getItem(SESSION_KEY);
        if (!raw) return null;
        try {
            return JSON.parse(raw);
        } catch (e) {
            return null;
        }
    }

    function ensureAccountUI() {
        const navActions = document.querySelector('.nav-actions');
        if (!navActions || document.getElementById('pl-account-wrapper')) return;

        const wrapper = document.createElement('div');
        wrapper.className = 'account-wrapper';
        wrapper.id = 'pl-account-wrapper';
        wrapper.innerHTML = `
            <button type="button" class="account-chip" id="auth-trigger" aria-haspopup="true" aria-expanded="false" aria-label="Open account">
                <span class="account-avatar" aria-hidden="true">P</span>
            </button>
            <div class="account-dropdown" id="account-dropdown">
                <div class="account-dropdown-header" id="account-info" style="display:none;">
                    <div class="account-info-avatar"></div>
                    <div class="account-info-text">
                        <div class="account-info-name"></div>
                        <div class="account-info-email"></div>
                    </div>
                </div>
                <a href="account/index.html" class="account-dropdown-link" data-action="account" style="display:none;">Account Settings</a>
                <button type="button" data-action="signin">Sign in</button>
                <button type="button" data-action="logout" style="display:none;">Sign out</button>
            </div>
        `;

        navActions.appendChild(wrapper);

        els.accountWrapper = wrapper;
        els.accountChip = wrapper.querySelector('#auth-trigger');
        els.accountAvatar = wrapper.querySelector('.account-avatar');
        els.accountDropdown = wrapper.querySelector('#account-dropdown');

        els.accountChip.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            const isOpen = els.accountDropdown.classList.toggle('open');
            els.accountChip.setAttribute('aria-expanded', String(isOpen));
        });

        document.addEventListener('click', (e) => {
            if (!els.accountWrapper) return;
            if (!els.accountWrapper.contains(e.target)) {
                closeDropdown();
            }
        });
    }

    function ensureModal() {
        if (document.getElementById('pl-auth-overlay')) return;
        const overlay = document.createElement('div');
        overlay.className = 'auth-overlay';
        overlay.id = 'pl-auth-overlay';
        overlay.innerHTML = `
            <div class="auth-modal" role="dialog" aria-modal="true" aria-labelledby="auth-title">
                <header class="auth-header">
                    <div class="auth-pill">Pierce Account</div>
                    <h2 id="auth-title">Welcome back</h2>
                    <p class="auth-subtitle" id="auth-subtitle">Sign in to keep your Pierce gear in sync.</p>
                </header>
                <div class="auth-tabs">
                    <button type="button" class="auth-tab active" data-mode="login">Sign in</button>
                    <button type="button" class="auth-tab" data-mode="signup">Create account</button>
                </div>
                <form id="auth-form">
                    <div class="auth-field" id="auth-name-field" style="display:none;">
                        <label for="auth-name">Full name</label>
                        <input type="text" id="auth-name" name="name" autocomplete="name" placeholder="Alex Doe">
                    </div>
                    <div class="auth-field">
                        <label for="auth-email">Email</label>
                        <input type="email" id="auth-email" name="email" autocomplete="email" required placeholder="you@example.com">
                    </div>
                    <div class="auth-field">
                        <label for="auth-password">Password</label>
                        <input type="password" id="auth-password" name="password" autocomplete="current-password" required placeholder="********">
                    </div>
                    <div class="auth-actions">
                        <label class="auth-remember">
                            <input type="checkbox" id="auth-remember"> Keep me signed in
                        </label>
                        <small class="auth-note">Local, private to this browser</small>
                    </div>
                    <div class="auth-error" id="auth-error"></div>
                    <div class="auth-success" id="auth-success"></div>
                    <button type="submit" class="auth-submit" id="auth-submit">Continue</button>
                </form>
            </div>
        `;

        document.body.appendChild(overlay);

        els.overlay = overlay;
        els.modal = overlay.querySelector('.auth-modal');
        els.tabs = Array.from(overlay.querySelectorAll('.auth-tab'));
        els.form = overlay.querySelector('#auth-form');
        els.nameField = overlay.querySelector('#auth-name');
        els.emailField = overlay.querySelector('#auth-email');
        els.passwordField = overlay.querySelector('#auth-password');
        els.rememberField = overlay.querySelector('#auth-remember');
        els.error = overlay.querySelector('#auth-error');
        els.success = overlay.querySelector('#auth-success');
        els.submit = overlay.querySelector('#auth-submit');

        els.tabs.forEach(tab => {
            tab.addEventListener('click', () => switchMode(tab.dataset.mode));
        });

        els.form.addEventListener('submit', handleSubmit);

        // Encourage browser autofill/credential hints
        els.form.setAttribute('autocomplete', 'on');
        els.emailField.setAttribute('autocomplete', 'username');
        els.passwordField.setAttribute('autocomplete', 'current-password');

        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) closeModal();
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') closeModal();
        });
    }

    function switchMode(mode) {
        els.tabs.forEach(tab => tab.classList.toggle('active', tab.dataset.mode === mode));
        const isSignup = mode === 'signup';
        const title = isSignup ? 'Create account' : 'Welcome back';
        const subtitle = isSignup ? 'One account for Pierce updates and orders.' : 'Sign in to keep your Pierce gear in sync.';
        els.modal.querySelector('#auth-title').textContent = title;
        const subtitleEl = els.modal.querySelector('#auth-subtitle');
        if (subtitleEl) subtitleEl.textContent = subtitle;
        els.nameField.parentElement.style.display = isSignup ? 'flex' : 'none';
        els.emailField.setAttribute('autocomplete', 'username');
        els.passwordField.setAttribute('autocomplete', isSignup ? 'new-password' : 'current-password');
        els.form.dataset.mode = mode;
        els.error.textContent = '';
        els.success.textContent = '';
    }

    function openModal(mode = 'login') {
        ensureModal();
        switchMode(mode);
        els.overlay.classList.add('active');
        els.emailField.focus();
    }

    function closeModal() {
        if (els.overlay) {
            els.overlay.classList.remove('active');
        }
    }

    function closeDropdown() {
        if (els.accountDropdown) {
            els.accountDropdown.classList.remove('open');
            if (els.accountChip) {
                els.accountChip.setAttribute('aria-expanded', 'false');
            }
        }
    }

    function handleSubmit(e) {
        e.preventDefault();
        if (!els.form) return;

        const mode = els.form.dataset.mode || 'login';
        const name = (els.nameField.value || '').trim();
        const email = (els.emailField.value || '').trim();
        const password = els.passwordField.value || '';
        const remember = !!els.rememberField.checked;

        els.error.textContent = '';
        els.success.textContent = '';

        if (!email || !password) {
            els.error.textContent = 'Email and password are required.';
            return;
        }

        if (mode === 'signup') {
            if (!name) {
                els.error.textContent = 'Please add your name.';
                return;
            }
            if (password.length < 6) {
                els.error.textContent = 'Use at least 6 characters.';
                return;
            }
            if (findUser(email)) {
                els.error.textContent = 'This email is already registered.';
                return;
            }
            const users = loadUsers();
            users.push({
                name,
                email,
                password: hashPassword(password)
            });
            saveUsers(users);
            setSession(email, remember);
            state.currentUser = { name, email };
            els.success.textContent = 'Account created. You are signed in.';
            renderAccount();
            setTimeout(closeModal, 800);
            return;
        }

        const existing = findUser(email);
        if (!existing) {
            els.error.textContent = 'Account not found. Try signing up.';
            return;
        }
        if (existing.password !== hashPassword(password)) {
            els.error.textContent = 'Invalid credentials. Please try again.';
            return;
        }

        setSession(email, remember);
        state.currentUser = { name: existing.name, email: existing.email };
        els.success.textContent = 'Signed in.';
        renderAccount();
        setTimeout(closeModal, 600);
    }

    function handleLogout() {
        clearSession();
        renderAccount();
        closeDropdown();
    }

    function syncFromStorage() {
        const session = getSession();
        const user = session ? findUser(session.email) : null;
        state.currentUser = user || null;
        renderAccount();
    }

    function renderAccount() {
        if (!els.accountAvatar) return;
        const session = getSession();
        const sessionUser = session ? findUser(session.email) : null;
        state.currentUser = sessionUser || null;

        const signinBtn = document.querySelector('[data-action="signin"]');
        const logoutBtn = document.querySelector('[data-action="logout"]');
        const accountInfo = document.querySelector('#account-info');
        const infoAvatar = accountInfo ? accountInfo.querySelector('.account-info-avatar') : null;
        const infoName = accountInfo ? accountInfo.querySelector('.account-info-name') : null;
        const infoEmail = accountInfo ? accountInfo.querySelector('.account-info-email') : null;

        if (state.currentUser) {
            const { name, email } = state.currentUser;
            const initials = (name || email || 'P').trim().split(/\s+/).map(part => part[0]).join('').slice(0, 2).toUpperCase();
            els.accountAvatar.textContent = initials || 'P';
            els.accountChip.setAttribute('aria-label', 'Account menu');
            
            if (signinBtn) signinBtn.style.display = 'none';
            if (logoutBtn) logoutBtn.style.display = 'block';
            
            const accountLink = document.querySelector('[data-action="account"]');
            if (accountLink) accountLink.style.display = 'block';
            
            if (accountInfo) {
                accountInfo.style.display = 'flex';
                if (infoAvatar) infoAvatar.textContent = initials || 'P';
                if (infoName) infoName.textContent = name || email;
                if (infoEmail) infoEmail.textContent = email;
            }
        } else {
            els.accountAvatar.textContent = 'P';
            els.accountChip.setAttribute('aria-label', 'Open sign in');
            
            if (signinBtn) signinBtn.style.display = 'block';
            if (logoutBtn) logoutBtn.style.display = 'none';
            
            const accountLink = document.querySelector('[data-action="account"]');
            if (accountLink) accountLink.style.display = 'none';
            
            if (accountInfo) accountInfo.style.display = 'none';
            closeDropdown();
        }
    }

    function init() {
        ensureAccountUI();
        ensureModal();

        const session = getSession();
        if (session && session.email) {
            const u = findUser(session.email);
            state.currentUser = u || null;
        }
        renderAccount();

        // Wire up dropdown buttons after renderAccount
        const signinBtn = document.querySelector('[data-action="signin"]');
        if (signinBtn) {
            signinBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                closeDropdown();
                openModal('login');
            });
        }

        const accountLink = document.querySelector('[data-action="account"]');
        if (accountLink) {
            accountLink.addEventListener('click', (e) => {
                e.preventDefault();
                closeDropdown();
                const basePath = window.location.pathname.includes('cameras/') || 
                               window.location.pathname.includes('customize/') ||
                               window.location.pathname.includes('store/') ||
                               window.location.pathname.includes('support/') ? '../' : '';
                window.location.href = `${basePath}account/index.html`;
            });
        }

        const logoutBtn = document.querySelector('[data-action="logout"]');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                handleLogout();
            });
        }

        window.addEventListener('storage', (e) => {
            if (e.key === SESSION_KEY || e.key === USERS_KEY) {
                syncFromStorage();
            }
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();


