document.addEventListener('DOMContentLoaded', () => {
    // Only show if not previously accepted
    const consentKey = 'pl-cookie-consent';
    if (localStorage.getItem(consentKey) === 'accepted') return;

    // Build policy link relative to depth
    const pathDepth = (window.location.pathname.match(/\//g) || []).length - 1; // subtract leading slash
    const up = '../'.repeat(Math.max(0, pathDepth - 0));
    const policyLink = `${up}policy/index.html`;

    const cookieBannerHTML = `
        <div id="cookie-banner" role="dialog" aria-live="polite">
            <div class="container">
                <p>We use essential cookies to ensure the site functions correctly. By continuing to browse, you agree to our <a href="${policyLink}" class="cookie-link">Cookie Policy</a>.</p>
                <button id="accept-cookies" class="cta-button cookie-accept-btn" aria-label="Accept cookies">Accept</button>
            </div>
        </div>
    `;

    const banner = document.createElement('div');
    banner.innerHTML = cookieBannerHTML;
    document.body.appendChild(banner.firstChild);

    const acceptButton = document.getElementById('accept-cookies');
    if (acceptButton) {
        acceptButton.addEventListener('click', () => {
            const bannerElement = document.getElementById('cookie-banner');
            if (bannerElement) {
                bannerElement.style.display = 'none';
            }
            try {
                localStorage.setItem(consentKey, 'accepted');
            } catch (e) {
                // ignore storage errors
            }
        });
    }
});