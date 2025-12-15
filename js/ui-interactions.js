/**
 * UI Interactions Module
 * Handles common UI interactions like dropdowns, modals, and toggles
 */

// Setup dropdown accessibility (keyboard + focus + escape)
function setupDropdownAccessibility(selectorOrElement = '.dropdown') {
    const dropdowns = typeof selectorOrElement === 'string' 
        ? document.querySelectorAll(selectorOrElement)
        : [selectorOrElement];

    dropdowns.forEach(function(dd) {
        const trigger = dd.querySelector('a');
        const menu = dd.querySelector('.dropdown-menu');
        if (!trigger || !menu) return;
        
        trigger.setAttribute('aria-haspopup', 'true');
        trigger.setAttribute('aria-expanded', 'false');

        function openMenu() {
            dd.classList.add('open');
            trigger.setAttribute('aria-expanded', 'true');
        }
        function closeMenu() {
            dd.classList.remove('open');
            trigger.setAttribute('aria-expanded', 'false');
        }

        trigger.addEventListener('focus', openMenu);
        trigger.addEventListener('mouseenter', openMenu);
        dd.addEventListener('mouseleave', closeMenu);

        dd.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                closeMenu();
                trigger.focus();
            }
        });

        dd.addEventListener('focusout', function(e) {
            if (!dd.contains(e.relatedTarget)) {
                closeMenu();
            }
        });
    });
}

// Setup mobile nav toggle
function setupMobileNavToggle(toggleSelector = '.nav-toggle', listSelector = '.nav-list') {
    const navToggle = document.querySelector(toggleSelector);
    const navList = document.querySelector(listSelector);
    
    if (!navToggle || !navList) return;

    navToggle.addEventListener('click', function() {
        navList.classList.toggle('nav-open');
        navToggle.classList.toggle('open');
    });
}

// Setup payment method selection
function setupPaymentMethodSelection(containerSelector = '.payment-methods', detailsSelector = '.payment-details') {
    document.querySelectorAll(containerSelector).forEach(method => {
        method.addEventListener('click', function() {
            document.querySelectorAll(containerSelector).forEach(m => m.classList.remove('active'));
            this.classList.add('active');

            const selectedMethod = this.dataset.method;
            document.querySelectorAll(detailsSelector).forEach(detail => {
                detail.classList.remove('active');
            });
            const detailElement = document.getElementById(`${selectedMethod}-details`);
            if (detailElement) {
                detailElement.classList.add('active');
            }
        });
    });
}

// Setup modal interactions
function setupModal(triggerSelector, modalSelector, confirmSelector, cancelSelector) {
    const trigger = document.querySelector(triggerSelector);
    const modal = document.querySelector(modalSelector);
    const confirmBtn = document.querySelector(confirmSelector);
    const cancelBtn = document.querySelector(cancelSelector);

    if (!modal) return;

    if (trigger) {
        trigger.addEventListener('click', () => {
            modal.style.display = 'flex';
        });
    }

    if (confirmBtn) {
        confirmBtn.addEventListener('click', () => {
            modal.style.display = 'none';
        });
    }

    if (cancelBtn) {
        cancelBtn.addEventListener('click', () => {
            modal.style.display = 'none';
        });
    }
}

// Setup click outside modal to close
function setupModalClickOutside(modalSelector) {
    const modal = document.querySelector(modalSelector);
    if (!modal) return;

    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });
}

// Export functions
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        setupDropdownAccessibility,
        setupMobileNavToggle,
        setupPaymentMethodSelection,
        setupModal,
        setupModalClickOutside
    };
}

