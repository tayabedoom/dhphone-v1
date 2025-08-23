// Google Tag Manager Configuration
// Replace 'GTM-XXXXXXX' with your actual GTM container ID
const GTM_CONTAINER_ID = 'GTM-P2PWNTT3';

// GTM Data Layer
window.dataLayer = window.dataLayer || [];

// GTM initialization function
function gtag() {
    dataLayer.push(arguments);
}

// Initialize GTM
gtag('js', new Date());
gtag('config', GTM_CONTAINER_ID);

// Export for use in other files
window.GTM_CONTAINER_ID = GTM_CONTAINER_ID;
window.gtag = gtag;
