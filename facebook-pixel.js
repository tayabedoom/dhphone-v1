// Meta Pixel Code - DH Phone E-commerce Tracking
// Pixel ID: 1118651196841746

// Initialize Meta Pixel
!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');

// Initialize with your Pixel ID
fbq('init', '1118651196841746');

// Track PageView on every page load
fbq('track', 'PageView');

// Global variables for tracking
window.fbPixelData = {
    currency: 'DZD', // Default currency - can be updated dynamically
    products: {}, // Store product data for tracking
    cart: {
        items: [],
        total: 0
    }
};

// Helper function to get product data
function getProductData(productId) {
    return window.fbPixelData.products[productId] || {
        id: productId,
        name: 'Unknown Product',
        price: 0,
        currency: window.fbPixelData.currency
    };
}

// Helper function to format price
function formatPrice(price) {
    return parseFloat(price).toFixed(2);
}

// 1. ViewContent Event - Track when user views a product
function trackViewContent(productId, productName, price, currency = 'DZD') {
    console.log('📊 Meta Pixel: ViewContent', { productId, productName, price, currency });
    
    fbq('track', 'ViewContent', {
        content_ids: [productId],
        content_name: productName,
        value: formatPrice(price),
        currency: currency,
        content_type: 'product'
    });
}

// 2. AddToCart Event - Track when user adds product to cart
function trackAddToCart(productId, productName, price, quantity = 1, currency = 'DZD') {
    console.log('📊 Meta Pixel: AddToCart', { productId, productName, price, quantity, currency });
    
    fbq('track', 'AddToCart', {
        content_ids: [productId],
        content_name: productName,
        value: formatPrice(price * quantity),
        currency: currency,
        content_type: 'product',
        contents: [{
            id: productId,
            quantity: quantity,
            price: formatPrice(price)
        }]
    });
    
    // Update cart data
    const existingItem = window.fbPixelData.cart.items.find(item => item.id === productId);
    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        window.fbPixelData.cart.items.push({
            id: productId,
            name: productName,
            price: price,
            quantity: quantity
        });
    }
    
    // Update cart total
    window.fbPixelData.cart.total = window.fbPixelData.cart.items.reduce((total, item) => {
        return total + (item.price * item.quantity);
    }, 0);
}

// 3. InitiateCheckout Event - Track when user starts checkout
function trackInitiateCheckout(cartTotal, currency = 'DZD') {
    console.log('📊 Meta Pixel: InitiateCheckout', { cartTotal, currency });
    
    const contents = window.fbPixelData.cart.items.map(item => ({
        id: item.id,
        quantity: item.quantity,
        price: formatPrice(item.price)
    }));
    
    fbq('track', 'InitiateCheckout', {
        value: formatPrice(cartTotal),
        currency: currency,
        contents: contents,
        content_type: 'product'
    });
}

// 4. Purchase Event - Track successful purchase
function trackPurchase(orderId, orderTotal, currency = 'DZD') {
    console.log('📊 Meta Pixel: Purchase', { orderId, orderTotal, currency });
    
    const contents = window.fbPixelData.cart.items.map(item => ({
        id: item.id,
        quantity: item.quantity,
        price: formatPrice(item.price)
    }));
    
    fbq('track', 'Purchase', {
        value: formatPrice(orderTotal),
        currency: currency,
        contents: contents,
        content_type: 'product',
        order_id: orderId
    });
    
    // Clear cart after successful purchase
    window.fbPixelData.cart.items = [];
    window.fbPixelData.cart.total = 0;
}

// 5. Search Event - Track product searches
function trackSearch(searchTerm) {
    console.log('📊 Meta Pixel: Search', { searchTerm });
    
    fbq('track', 'Search', {
        search_string: searchTerm,
        content_type: 'product'
    });
}

// 6. Contact Event - Track contact form submissions
function trackContact() {
    console.log('📊 Meta Pixel: Contact');
    
    fbq('track', 'Contact');
}

// Auto-detect and track ViewContent on product pages
document.addEventListener('DOMContentLoaded', function() {
    console.log('📊 Meta Pixel: DOM loaded, initializing tracking...');
    
    // Check if we're on a product detail page
    const productId = getProductIdFromPage();
    if (productId) {
        const productData = getProductData(productId);
        if (productData.name !== 'Unknown Product') {
            trackViewContent(
                productData.id,
                productData.name,
                productData.price,
                productData.currency
            );
        }
    }
    
    // Auto-track AddToCart button clicks
    setupAddToCartTracking();
    
    // Auto-track form submissions
    setupFormTracking();
    
    console.log('📊 Meta Pixel: Tracking initialized successfully');
});

// Helper function to get product ID from current page
function getProductIdFromPage() {
    // Check URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('product') || urlParams.get('id');
    
    if (productId) return productId;
    
    // Check for product ID in page data attributes
    const productElement = document.querySelector('[data-product-id]');
    if (productElement) {
        return productElement.getAttribute('data-product-id');
    }
    
    // Check for product ID in meta tags
    const productMeta = document.querySelector('meta[name="product-id"]');
    if (productMeta) {
        return productMeta.getAttribute('content');
    }
    
    return null;
}

// Setup automatic AddToCart tracking
function setupAddToCartTracking() {
    // Track clicks on add to cart buttons
    document.addEventListener('click', function(e) {
        const addToCartBtn = e.target.closest('[data-add-to-cart], .add-to-cart, [onclick*="cart"], [onclick*="order"]');
        
        if (addToCartBtn) {
            const productId = addToCartBtn.getAttribute('data-product-id') || 
                             addToCartBtn.closest('[data-product-id]')?.getAttribute('data-product-id');
            
            if (productId) {
                const productData = getProductData(productId);
                trackAddToCart(
                    productData.id,
                    productData.name,
                    productData.price,
                    1,
                    productData.currency
                );
            }
        }
    });
}

// Setup automatic form tracking
function setupFormTracking() {
    // Track order form submissions
    const orderForm = document.querySelector('#orderForm, form[data-form-type="order"]');
    if (orderForm) {
        orderForm.addEventListener('submit', function(e) {
            // Track InitiateCheckout when order form is submitted
            trackInitiateCheckout(window.fbPixelData.cart.total, window.fbPixelData.currency);
        });
    }
    
    // Track contact form submissions
    const contactForm = document.querySelector('#contactForm, form[data-form-type="contact"]');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            trackContact();
        });
    }
}

// Function to update product data (call this when loading products)
function updateProductData(products) {
    products.forEach(product => {
        window.fbPixelData.products[product.id] = {
            id: product.id,
            name: product.title || product.name,
            price: parseFloat(product.price || product.priceRange?.minVariantPrice?.amount || 0),
            currency: product.currency || product.priceRange?.minVariantPrice?.currencyCode || 'DZD'
        };
    });
    console.log('📊 Meta Pixel: Product data updated', products.length, 'products');
}

// Function to manually trigger purchase event (call this on thank you page)
function triggerPurchaseEvent(orderId, orderTotal, currency = 'DZD') {
    trackPurchase(orderId, orderTotal, currency);
}

// Export functions for use in other scripts
window.FacebookPixel = {
    trackViewContent,
    trackAddToCart,
    trackInitiateCheckout,
    trackPurchase,
    trackSearch,
    trackContact,
    updateProductData,
    triggerPurchaseEvent,
    getProductData
};

// Also export as MetaPixel for compatibility
window.MetaPixel = window.FacebookPixel;

console.log('📊 Meta Pixel: E-commerce tracking system loaded successfully'); 