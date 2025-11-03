document.addEventListener('DOMContentLoaded', () => {
    // 1. Define the HTML structure for the cookie banner
    const cookieBannerHTML = `
        <div id="cookie-banner" role="dialog" aria-live="polite">
            <div class="container">
                <p>We use essential cookies to ensure the site functions correctly. By continuing to browse, you agree to our <a href="PLACEHOLDER_POLICY_LINK" class="cookie-link">Cookie Policy</a>.</p>
                <button id="accept-cookies" class="cta-button cookie-accept-btn">Accept</button>
            </div>
        </div>
    `;

    // 2. Determine the path to the policy page based on the current page's location
    let policyLink;
    // Check if the current path includes a folder (e.g., /customize/ or /policy/)
    if (window.location.pathname.includes('/customize/') || window.location.pathname.includes('/policy/')) {
        // Current file is in a subfolder, link must go up one level
        policyLink = '../policy/index.html';
    } else {
        // Current file is in the root
        policyLink = 'policy/index.html';
    }

    // 3. Inject the HTML into the body element
    const banner = document.createElement('div');
    banner.innerHTML = cookieBannerHTML.replace('PLACEHOLDER_POLICY_LINK', policyLink);
    document.body.appendChild(banner.firstChild);

    // 4. (Optional) Basic functionality to hide the banner when 'Accept' is clicked
    // In a real site, this would also set a 'cookie' to prevent reappearance.
    const acceptButton = document.getElementById('accept-cookies');
    if (acceptButton) {
        acceptButton.addEventListener('click', () => {
            const bannerElement = document.getElementById('cookie-banner');
            if (bannerElement) {
                bannerElement.style.display = 'none';
            }
        });
    }
});