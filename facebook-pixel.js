// Facebook Pixel Configuration
// Facebook Pixel ID for DH Phone
const FB_PIXEL_ID = '1118651196841746';

// Facebook Pixel Base Code
!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');

// Initialize Facebook Pixel
fbq('init', FB_PIXEL_ID);
fbq('track', 'PageView');

// Track page views on route changes
function trackPageView(pageName) {
    fbq('track', 'PageView', {
        page_name: pageName,
        page_title: document.title
    });
}

// Track product views
function trackProductView(productName, productCategory, productPrice) {
    fbq('track', 'ViewContent', {
        content_name: productName,
        content_category: productCategory,
        value: productPrice,
        currency: 'DZD'
    });
}

// Track add to cart events
function trackAddToCart(productName, productCategory, productPrice) {
    fbq('track', 'AddToCart', {
        content_name: productName,
        content_category: productCategory,
        value: productPrice,
        currency: 'DZD'
    });
}

// Track purchase events
function trackPurchase(orderValue, orderId) {
    fbq('track', 'Purchase', {
        value: orderValue,
        currency: 'DZD',
        content_ids: [orderId]
    });
}

// Track contact form submissions
function trackContactForm() {
    fbq('track', 'Lead', {
        content_name: 'Contact Form',
        content_category: 'Contact'
    });
}

// Track WhatsApp clicks
function trackWhatsAppClick() {
    fbq('track', 'Contact', {
        content_name: 'WhatsApp Contact',
        content_category: 'Contact'
    });
}

// Track social media clicks
function trackSocialMediaClick(platform) {
    fbq('track', 'CustomEvent', {
        event_name: 'Social Media Click',
        content_name: platform,
        content_category: 'Social Media'
    });
}

// Track search events
function trackSearch(searchTerm) {
    fbq('track', 'Search', {
        search_string: searchTerm
    });
}

// Track category filter clicks
function trackCategoryFilter(categoryName) {
    fbq('track', 'CustomEvent', {
        event_name: 'Category Filter',
        content_name: categoryName,
        content_category: 'Product Category'
    });
}

// Auto-track important elements
document.addEventListener('DOMContentLoaded', function() {
    // Track contact form submissions
    const contactForms = document.querySelectorAll('form');
    contactForms.forEach(form => {
        form.addEventListener('submit', function() {
            trackContactForm();
        });
    });

    // Track WhatsApp links
    const whatsappLinks = document.querySelectorAll('a[href*="whatsapp"]');
    whatsappLinks.forEach(link => {
        link.addEventListener('click', function() {
            trackWhatsAppClick();
        });
    });

    // Track social media links
    const socialLinks = document.querySelectorAll('a[href*="facebook"], a[href*="instagram"], a[href*="tiktok"]');
    socialLinks.forEach(link => {
        link.addEventListener('click', function() {
            const href = link.href;
            if (href.includes('facebook')) {
                trackSocialMediaClick('Facebook');
            } else if (href.includes('instagram')) {
                trackSocialMediaClick('Instagram');
            } else if (href.includes('tiktok')) {
                trackSocialMediaClick('TikTok');
            }
        });
    });

    // Track product card clicks
    const productCards = document.querySelectorAll('.product-card, [data-product]');
    productCards.forEach(card => {
        card.addEventListener('click', function() {
            const productName = this.getAttribute('data-product-name') || 'Product';
            const productCategory = this.getAttribute('data-product-category') || 'General';
            const productPrice = this.getAttribute('data-product-price') || 0;
            
            trackProductView(productName, productCategory, productPrice);
        });
    });

    // Track category filter buttons
    const categoryButtons = document.querySelectorAll('.category-btn, [data-category]');
    categoryButtons.forEach(button => {
        button.addEventListener('click', function() {
            const categoryName = this.getAttribute('data-category') || this.textContent.trim();
            trackCategoryFilter(categoryName);
        });
    });
});

// Export functions for manual tracking
window.FacebookPixel = {
    trackPageView,
    trackProductView,
    trackAddToCart,
    trackPurchase,
    trackContactForm,
    trackWhatsAppClick,
    trackSocialMediaClick,
    trackSearch,
    trackCategoryFilter
}; 