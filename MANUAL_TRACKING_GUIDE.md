# Facebook Pixel Manual Tracking Guide for DH Phone

## Overview
This guide provides comprehensive manual tracking methods for all Shopify products on your DH Phone website using Facebook Pixel.

## Available Tracking Methods

### 1. Product View Tracking
Track when users view specific products:

```javascript
// Track product view with real Shopify product data
// This automatically fetches product details from your Shopify store
window.shopifyTracker.trackProductPageView('iphone-15-pro');

// Or track product card clicks (uses data attributes from Shopify)
window.shopifyTracker.trackProductCardClick(productCardElement);

// Manual tracking with real product data
async function trackRealProduct(productHandle) {
    const productData = await window.shopifyTracker.fetchProductDetails(productHandle);
    window.FacebookPixel.trackProductView(
        productData.title,
        productData.type,
        productData.price
    );
}
```

### 2. Add to Cart Tracking
Track when users add products to cart:

```javascript
// Track add to cart with real Shopify product data
async function trackAddToCartReal(productHandle) {
    const productData = await window.shopifyTracker.fetchProductDetails(productHandle);
    window.FacebookPixel.trackAddToCart(
        productData.title,
        productData.type,
        productData.price
    );
}

// Or use the Shopify tracker
window.shopifyTracker.trackAddToCart(
    productData.title,
    productData.type,
    productData.price,
    productData.currency
);
```

### 3. Purchase Tracking
Track completed purchases:

```javascript
// Track purchase with order details
window.FacebookPixel.trackPurchase(
    1250000,                   // Order value in DZD
    'order_12345'              // Order ID
);

// Or use the Shopify tracker
window.shopifyTracker.trackPurchase(
    1250000,
    'order_12345',
    'DZD'
);
```

### 4. Contact Form Tracking
Track contact form submissions:

```javascript
// Track contact form submission
window.FacebookPixel.trackContactForm();

// Or use the Shopify tracker
window.shopifyTracker.trackContactForm();
```

### 5. WhatsApp Contact Tracking
Track WhatsApp link clicks:

```javascript
// Track WhatsApp contact
window.FacebookPixel.trackWhatsAppClick();

// Or use the Shopify tracker
window.shopifyTracker.trackWhatsAppClick();
```

### 6. Social Media Tracking
Track social media link clicks:

```javascript
// Track social media clicks
window.FacebookPixel.trackSocialMediaClick('Facebook');
window.FacebookPixel.trackSocialMediaClick('Instagram');
window.FacebookPixel.trackSocialMediaClick('TikTok');
```

### 7. Search Tracking
Track search functionality:

```javascript
// Track search events
window.FacebookPixel.trackSearch('iPhone 15');

// Or use the Shopify tracker
window.shopifyTracker.trackSearch('iPhone 15');
```

### 8. Category Filter Tracking
Track category filter selections:

```javascript
// Track category filter
window.FacebookPixel.trackCategoryFilter('Smartphones');

// Or use the Shopify tracker
window.shopifyTracker.trackCategoryClick(categoryButtonElement);
```

## Automatic Tracking Features

### Product Cards
All product cards automatically track:
- Product title, category, and price
- Click events with detailed product information
- Availability status

### Category Filters
Category buttons automatically track:
- Category selection events
- Filter changes

### Search Functionality
Search input automatically tracks:
- Search terms (minimum 2 characters)
- Search frequency

### Contact Forms
All forms automatically track:
- Form submission events
- Lead generation

### Social Media Links
All social media links automatically track:
- Platform-specific clicks (Facebook, Instagram, TikTok)
- Click frequency

## Manual Tracking Examples

### Example 1: Track Product View from Custom Button
```javascript
// Add this to any custom button or link
async function trackCustomProductView(productHandle) {
    try {
        const productData = await window.shopifyTracker.fetchProductDetails(productHandle);
        window.FacebookPixel.trackProductView(
            productData.title,
            productData.type,
            productData.price
        );
    } catch (error) {
        console.error('Error tracking product view:', error);
    }
}

// Usage: trackCustomProductView('iphone-15-pro');
```

### Example 2: Track Purchase from Order Confirmation
```javascript
// Add this to order confirmation page
function trackOrderPurchase(orderData) {
    window.FacebookPixel.trackPurchase(
        orderData.total,
        orderData.orderId
    );
}
```

### Example 3: Track Lead from Custom Form
```javascript
// Add this to custom contact forms
function trackCustomLead() {
    window.FacebookPixel.trackContactForm();
    
    // Or track as a lead
    window.shopifyTracker.trackLead('Custom Contact Form', 'Contact');
}
```

### Example 4: Track Add to Cart from Custom Button
```javascript
// Add this to custom "Add to Cart" buttons
async function trackCustomAddToCart(productHandle) {
    try {
        const productData = await window.shopifyTracker.fetchProductDetails(productHandle);
        window.FacebookPixel.trackAddToCart(
            productData.title,
            productData.type,
            productData.price
        );
    } catch (error) {
        console.error('Error tracking add to cart:', error);
    }
}

// Usage: trackCustomAddToCart('iphone-15-pro');
```

## Integration with Shopify Products

### Automatic Shopify Integration
The tracking system automatically:
- ✅ Fetches real product data from your Shopify store
- ✅ Updates when you add/remove products
- ✅ Uses actual product titles, prices, and categories
- ✅ Tracks inventory status (in stock/out of stock)
- ✅ Works with all your Shopify products dynamically

### Product Data Attributes
All product cards include these data attributes for automatic tracking:

```html
<div class="product-card" 
     data-product-id="gid://shopify/Product/123456"
     data-product-handle="iphone-15-pro"
     data-product-title="iPhone 15 Pro"
     data-product-type="Smartphones"
     data-product-price="1250000"
     data-product-currency="DZD"
     data-product-available="true">
```

### Real-Time Product Data
The system automatically fetches product details from your Shopify store:

```javascript
// Get real product data from Shopify
const productData = await window.shopifyTracker.fetchProductDetails('iphone-15-pro');
console.log(productData);
// Output: {
//   title: "iPhone 15 Pro",
//   type: "Smartphones", 
//   price: 1250000,
//   currency: "DZD",
//   available: true
// }
```

### Automatic Event Tracking
The following events are automatically tracked:

1. **Product Card Clicks**: Tracks product view with full details
2. **Category Filter Clicks**: Tracks category selection
3. **Search Input**: Tracks search terms and frequency
4. **Contact Form Submissions**: Tracks lead generation
5. **WhatsApp Clicks**: Tracks contact attempts
6. **Social Media Clicks**: Tracks platform-specific engagement

## Testing Your Tracking

### 1. Check Browser Console
Open browser console and look for tracking messages:
```
📊 Tracking product view: iPhone 15 Pro
📊 Tracking category click: Smartphones
📊 Tracking search: iPhone
📊 Tracking WhatsApp click
```

### 2. Facebook Events Manager
Check your Facebook Events Manager to verify events are being received:
1. Go to Facebook Events Manager
2. Select your Pixel ID: `1088401762837358`
3. Check the "Events" tab for incoming events

### 3. Facebook Pixel Helper
Install Facebook Pixel Helper browser extension to debug:
1. Install the extension
2. Visit your website
3. Check for pixel events and data

## Best Practices

### 1. Consistent Product Data
Ensure all products have consistent data attributes:
- Product title (exact match with Shopify)
- Product category (use consistent naming)
- Product price (in DZD currency)

### 2. Event Deduplication
The tracking system prevents duplicate events within the same session.

### 3. Error Handling
All tracking functions include error handling and fallbacks.

### 4. Performance
Tracking is optimized for performance and doesn't affect page load speed.

## Troubleshooting

### Common Issues

1. **Events not appearing in Facebook**
   - Check browser console for errors
   - Verify Pixel ID is correct: `1088401762837358`
   - Ensure Facebook Pixel is loaded before tracking

2. **Product data not tracking**
   - Verify product cards have correct data attributes
   - Check product data extraction in console

3. **Manual tracking not working**
   - Ensure `window.FacebookPixel` is available
   - Check function names match exactly

### Debug Mode
Enable debug mode by adding this to console:
```javascript
// Enable debug logging
window.FacebookPixel.debug = true;
```

## How It Works with Your Shopify Store

### Automatic Product Detection
1. **Product Loading**: When your products page loads, it automatically fetches all products from your Shopify store
2. **Real Data**: Uses actual product titles, prices, categories, and availability from Shopify
3. **Dynamic Updates**: When you add/remove products in Shopify, the tracking automatically updates
4. **Inventory Tracking**: Tracks whether products are in stock or out of stock

### What Happens When You:
- **Add a Product**: Automatically appears with tracking
- **Remove a Product**: Automatically stops tracking
- **Update Prices**: Automatically uses new prices
- **Change Categories**: Automatically updates category tracking
- **Update Inventory**: Automatically tracks availability

### No Manual Configuration Needed
The system automatically:
- ✅ Detects all your Shopify products
- ✅ Uses real product data
- ✅ Tracks inventory changes
- ✅ Updates when you modify products
- ✅ Works with any product you add

## Support
For issues or questions about tracking implementation, check:
1. Browser console for error messages
2. Facebook Events Manager for event delivery
3. Facebook Pixel Helper for debugging

## Pixel ID
Your Facebook Pixel ID: `1088401762837358`

Make sure this ID is used consistently across all tracking implementations. 