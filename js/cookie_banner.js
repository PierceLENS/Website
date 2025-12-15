document.addEventListener('DOMContentLoaded', () => {
    // Only show if not previously accepted
    const consentKey = 'pl-cookie-consent';

    function getCookie(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
        return null;
    }

    function setCookie(name, val, days = 365) {
        const expires = new Date(Date.now() + days * 24 * 60 * 60 * 1000).toUTCString();
        document.cookie = `${name}=${val}; expires=${expires}; path=/; SameSite=Lax`;
    }

    const alreadyAccepted = (getCookie(consentKey) === 'accepted') || (localStorage.getItem(consentKey) === 'accepted');

    // Build policy link relative to depth
    const segments = window.location.pathname.split('/').filter(Boolean);
    const dirCount = Math.max(0, segments.length - 1); // exclude file name
    const up = '../'.repeat(dirCount);
    const policyLink = `${up}policy/index.html`;

    // Reuse existing banner if present in markup; otherwise create it
    let bannerElement = document.getElementById('cookie-banner');
    if (!bannerElement) {
        const cookieBannerHTML = `
            <div id="cookie-banner" role="dialog" aria-live="polite">
                <div class="container">
                    <p>We use essential cookies to ensure the site functions correctly. By continuing to browse, you agree to our <a href="${policyLink}" class="cookie-link">Cookie Policy</a>.</p>
                    <button id="accept-cookies" class="cta-button cookie-accept-btn" aria-label="Accept cookies">Accept</button>
                </div>
            </div>
        `;

        const wrapper = document.createElement('div');
        wrapper.innerHTML = cookieBannerHTML;
        bannerElement = wrapper.firstElementChild;
        if (bannerElement) {
            document.body.appendChild(bannerElement);
        }
    } else {
        // Update policy link in existing markup
        const link = bannerElement.querySelector('.cookie-link');
        if (link) link.href = policyLink;
    }

    if (!bannerElement) return;

    // If already accepted, hide banner and stop
    if (alreadyAccepted) {
        bannerElement.remove();
        return;
    }

    const acceptButton = bannerElement.querySelector('#accept-cookies');
    if (acceptButton) {
        acceptButton.addEventListener('click', () => {
            bannerElement.remove();
            try {
                localStorage.setItem(consentKey, 'accepted');
            } catch (e) {
                // ignore storage errors
            }
            setCookie(consentKey, 'accepted');
        });
    }
});

