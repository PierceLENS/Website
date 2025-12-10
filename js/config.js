/**
 * Application Configuration
 * 
 * This file centralizes all environment-specific configuration.
 * For local development, create a .env file with your settings.
 * For production, set environment variables on your hosting platform.
 */

const AppConfig = {
    // VE Marketplace settings
    veMarketplace: {
        apiEndpoint: window.__VE_API_ENDPOINT__ || 'https://hub.veinternational.org/api',
        firmId: window.__VE_FIRM_ID__ || 'production_firm_id',
        apiKey: window.__VE_API_KEY__ || 'production_api_key',
        environment: window.__VE_ENVIRONMENT__ || 'production'
    },

    // Site settings
    site: {
        url: window.__SITE_URL__ || 'https://piercelens.com',
        analyticsId: window.__ANALYTICS_ID__ || ''
    },

    // Feature flags
    features: {
        debugMode: false,
        enableAnalytics: true,
        enableVEMarketplace: true
    },

    /**
     * Load configuration from environment or use defaults
     * Call this on page load if needed
     */
    init: function() {
        // Configuration is ready to use
    }
};

// Export for use in modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AppConfig;
}
