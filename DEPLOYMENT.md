# PierceLENS Website - Production Deployment Guide

## Overview
This repository contains the PierceLENS website code, configured for production deployment on GitHub Pages with a custom domain.

## Current Configuration
- **Domain**: piercelens.com (configured in CNAME)
- **Hosting**: GitHub Pages (static site)
- **Repository**: PierceLENS/Website

## Production Setup

### 1. Environment Configuration
Before deploying, configure your production environment variables:

1. Create a `.env` file at the root (never commit this):
```bash
VE_API_ENDPOINT=https://hub.veinternational.org/api
VE_FIRM_ID=your_firm_id_here
VE_API_KEY=your_api_key_here
VE_ENVIRONMENT=production
SITE_URL=https://piercelens.com
ANALYTICS_ID=your_analytics_id_here
```

2. For GitHub Pages deployment, set environment variables via:
   - GitHub Actions (recommended)
   - Build scripts
   - Or inject via HTML inline scripts

### 2. VE Marketplace Integration
The website integrates with Virtual Enterprise Marketplace via `js/ve-marketplace.js`:

- Configuration is centralized in `js/config.js`
- All API credentials should be injected at build/deployment time
- Never commit `.env` files or credentials

### 3. Security Features Implemented
✅ Debug console.logs removed from production code
✅ Security meta tags added (referrer policy, X-UA-Compatible)
✅ Script loading optimized with defer attributes
✅ Configuration externalized for environment-specific settings
✅ .gitignore configured to prevent credential leaks

### 4. Deployment Steps

#### Local Testing:
```bash
# Install a local server (if needed)
# npx http-server
# OR use VS Code Live Server extension
```

#### GitHub Pages Deployment:
1. Push changes to the `main` branch
2. GitHub Pages will automatically deploy
3. Site available at https://piercelens.com

#### Custom Domain (Already Configured):
- CNAME file contains: `piercelens.com`
- DNS records point to GitHub Pages
- No additional configuration needed

### 5. Important Files
- **index.html** - Homepage with navigation and hero section
- **js/config.js** - Centralized configuration
- **js/ve-marketplace.js** - Payment processing integration
- **.env.example** - Template for environment variables
- **CNAME** - Custom domain configuration

### 6. Monitoring & Maintenance

#### Before Each Deploy:
- [ ] Remove debug code (console.logs are already cleaned)
- [ ] Test in production-like environment
- [ ] Verify VE Marketplace credentials are set
- [ ] Check analytics tracking is enabled
- [ ] Test critical user flows (shopping, checkout)

#### Post-Deploy:
- [ ] Verify site loads at https://piercelens.com
- [ ] Check console for errors (should be none)
- [ ] Test cart and checkout flow
- [ ] Verify analytics are tracking

### 7. Common Issues & Fixes

**Issue**: CORS errors from VE Marketplace API
- Solution: Ensure API endpoint is configured correctly and supports CORS

**Issue**: Missing cart items after page reload
- Solution: Check browser cookies are enabled, localStorage access allowed

**Issue**: Images not loading
- Solution: Verify relative paths in HTML, check image files exist in /images

### 8. Support & Resources
- VE Marketplace API Docs: https://hub.veinternational.org/api/docs
- GitHub Pages: https://pages.github.com
- Repository: https://github.com/PierceLENS/Website

## Development Guidelines
- Always use `defer` attribute on non-critical scripts
- Never commit `.env` or credentials
- Remove debug code before committing
- Test locally before pushing to main
- Keep configuration in `js/config.js`

---
**Last Updated**: December 2025
**Status**: Production Ready ✅
