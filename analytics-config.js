// Umami Analytics Configuration
// Note: These IDs are NOT secrets - they're meant to be public and visible in browser
// They identify which website's analytics to track in the Umami dashboard

const ANALYTICS_CONFIG = {
  // Umami tracking endpoint (bypasses Cloudflare Access for public tracking)
  trackingUrl: 'https://umami-tracking.cjunker.dev/script.js',

  // Website IDs for different environments
  websites: {
    production: 'e6d18108-be73-4b78-b4bd-a84ac4a99c7e',    // cjunker.dev
    staging: 'e1d1ff65-36f9-42c3-9ce9-42b7b60f57d3',       // staging.cjunker.dev
    local: 'e1d1ff65-36f9-42c3-9ce9-42b7b60f57d3'          // localhost (uses staging ID)
  }
};

// Auto-detect environment and load tracking script
(function() {
  const hostname = window.location.hostname;
  let websiteId;
  let environment;

  // Map hostname to website ID
  if (hostname === 'cjunker.dev') {
    environment = 'production';
    websiteId = ANALYTICS_CONFIG.websites.production;
  } else if (hostname === 'staging.cjunker.dev') {
    environment = 'staging';
    websiteId = ANALYTICS_CONFIG.websites.staging;
  } else if (hostname === 'localhost' || hostname === '127.0.0.1') {
    environment = 'local';
    websiteId = ANALYTICS_CONFIG.websites.local;
  } else {
    console.warn(`[Umami Analytics] Unknown hostname: ${hostname}. Analytics tracking disabled.`);
    return;
  }

  // Validate configuration
  if (!websiteId) {
    console.warn(`[Umami Analytics] No website ID configured for ${environment} environment. Analytics tracking disabled.`);
    return;
  }

  if (!ANALYTICS_CONFIG.trackingUrl) {
    console.warn('[Umami Analytics] Tracking URL not configured. Analytics tracking disabled.');
    return;
  }

  // Load Umami tracking script
  console.log(`[Umami Analytics] Loading analytics for ${environment} (${hostname})`);
  const script = document.createElement('script');
  script.defer = true;
  script.src = ANALYTICS_CONFIG.trackingUrl;
  script.setAttribute('data-website-id', websiteId);

  // Log errors if script fails to load
  script.onerror = function() {
    console.error('[Umami Analytics] Failed to load tracking script from', ANALYTICS_CONFIG.trackingUrl);
  };

  document.head.appendChild(script);
})();
