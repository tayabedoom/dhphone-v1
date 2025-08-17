# Facebook Pixel Testing Guide for DH Phone

## Overview
This guide will help you verify that Facebook Pixel is properly tracking e-commerce events on your website.

## Prerequisites
1. **Facebook Pixel Helper Extension** - Install from Chrome Web Store
2. **Facebook Business Manager** - Access to your Pixel dashboard
3. **Test Events Tool** - Available in Facebook Events Manager

## Installation Verification

### 1. Check Base Pixel Installation
- Open your website in Chrome
- Open Developer Tools (F12)
- Go to Console tab
- Look for: `📊 Facebook Pixel: Product data updated`
- Check Network tab for requests to `facebook.com/tr`

### 2. Verify Pixel Helper
- Click the Facebook Pixel Helper extension icon
- Should show:
  - Pixel ID: `1118651196841746`
  - PageView event on every page load
  - No errors or warnings

## Event Testing Checklist

### ✅ PageView Event
**Where to test:** All pages
**Expected behavior:**
- Fires on every page load
- Shows in Pixel Helper
- Appears in Facebook Events Manager

**Test steps:**
1. Navigate to any page on your site
2. Check Pixel Helper shows PageView event
3. Verify in Facebook Events Manager

### ✅ ViewContent Event
**Where to test:** Product detail pages (`product-in.html`)
**Expected behavior:**
- Fires when viewing a product
- Includes: content_ids, content_name, value, currency

**Test steps:**
1. Go to `porduct.html`
2. Click on any product to view details
3. Check Pixel Helper shows ViewContent event
4. Verify product data is correct

### ✅ AddToCart Event
**Where to test:** Product detail pages (order form submission)
**Expected behavior:**
- Fires when clicking "إرسال الطلب" button
- Includes: content_ids, content_name, value, currency, contents array

**Test steps:**
1. Go to a product detail page
2. Fill out the order form
3. Click "إرسال الطلب"
4. Check Pixel Helper shows AddToCart event
5. Verify product data is correct

### ✅ InitiateCheckout Event
**Where to test:** Order form submission
**Expected behavior:**
- Fires when order form is submitted
- Includes: value, currency, contents array

**Test steps:**
1. Fill out and submit order form
2. Check Pixel Helper shows InitiateCheckout event
3. Verify cart total is correct

### ✅ Purchase Event
**Where to test:** Thank you page (`thank-you.html`)
**Expected behavior:**
- Fires on thank you page load
- Includes: value, currency, contents array, order_id

**Test steps:**
1. Complete an order (submit order form)
2. Should redirect to thank you page
3. Check Pixel Helper shows Purchase event
4. Verify order total and ID are correct

### ✅ Search Event
**Where to test:** Products page search
**Expected behavior:**
- Fires when searching for products
- Includes: search_string, content_type

**Test steps:**
1. Go to `porduct.html`
2. Type in search box
3. Check Pixel Helper shows Search event
4. Verify search term is correct

### ✅ Contact Event
**Where to test:** Contact form submission
**Expected behavior:**
- Fires when contact form is submitted
- Simple event with no parameters

**Test steps:**
1. Go to `Contact.html`
2. Fill out and submit contact form
3. Check Pixel Helper shows Contact event

## Facebook Events Manager Testing

### 1. Access Test Events
1. Go to Facebook Business Manager
2. Navigate to Events Manager
3. Select your Pixel
4. Click "Test Events" tab

### 2. Test Event Configuration
- **Test Event Code:** Use the provided test event code
- **Event Name:** Choose the event you want to test
- **Event Data:** Fill in test parameters

### 3. Verify Events
- Events should appear in real-time
- Check that all parameters are correct
- Verify no duplicate events

## Common Issues & Solutions

### Issue: Pixel not loading
**Symptoms:** No events in Pixel Helper
**Solutions:**
1. Check if `facebook-pixel.js` is loaded
2. Verify Pixel ID is correct
3. Check for JavaScript errors in console

### Issue: Events not firing
**Symptoms:** PageView works but other events don't
**Solutions:**
1. Check if `window.FacebookPixel` object exists
2. Verify event functions are called
3. Check for JavaScript errors

### Issue: Wrong product data
**Symptoms:** Events fire but with incorrect data
**Solutions:**
1. Verify product data is loaded correctly
2. Check `updateProductData()` function
3. Ensure product IDs match

### Issue: Duplicate events
**Symptoms:** Same event fires multiple times
**Solutions:**
1. Check for multiple event listeners
2. Verify form submission handling
3. Check page redirects

## Debugging Tools

### 1. Browser Console
```javascript
// Check if Facebook Pixel is loaded
console.log(window.fbq);

// Check product data
console.log(window.fbPixelData);

// Manually trigger events for testing
window.FacebookPixel.trackViewContent('test-id', 'Test Product', 100, 'DZD');
```

### 2. Network Tab
- Look for requests to `facebook.com/tr`
- Check request parameters
- Verify no failed requests

### 3. Facebook Pixel Helper
- Shows all events in real-time
- Displays event parameters
- Highlights errors and warnings

## Performance Monitoring

### 1. Event Volume
- Monitor daily event counts
- Check for unusual spikes
- Verify event ratios make sense

### 2. Conversion Tracking
- Track ViewContent → AddToCart conversion
- Track AddToCart → Purchase conversion
- Monitor overall conversion rates

### 3. Data Quality
- Check for missing product data
- Verify currency consistency
- Monitor for duplicate events

## Best Practices

### 1. Testing Environment
- Test on staging site first
- Use test events before going live
- Verify all events work in production

### 2. Data Accuracy
- Ensure product prices are correct
- Verify currency is consistent (DZD)
- Check product IDs are unique

### 3. User Experience
- Don't block page loading
- Handle errors gracefully
- Provide fallbacks for failed events

## Support Resources

### Facebook Documentation
- [Facebook Pixel Implementation Guide](https://developers.facebook.com/docs/facebook-pixel/implementation/)
- [Standard Events Reference](https://developers.facebook.com/docs/facebook-pixel/reference/)
- [Test Events Tool](https://developers.facebook.com/docs/facebook-pixel/implementation/test-events/)

### Troubleshooting
- Facebook Developer Community
- Facebook Business Support
- Pixel Helper documentation

## Contact Information
For technical support with this implementation:
- Check console logs for errors
- Verify all files are properly loaded
- Test each event individually
- Use Facebook's test events tool

---

**Last Updated:** December 2024
**Version:** 1.0
**Pixel ID:** 1118651196841746
