# Google Tag Manager Setup Guide for DH Phone

## Prerequisites
1. **Google Tag Manager Account**: You must have a Google Tag Manager account
2. **Container Access**: You must have "publish" permission for the Tag Manager container
3. **Container ID**: Your GTM container ID (format: GTM-XXXXXXX)

## Step 1: Get Your GTM Container ID
1. Go to [Google Tag Manager](https://tagmanager.google.com/)
2. Sign in with your Google account
3. Select your container (or create a new one)
4. Copy the container ID from the top-right corner (format: GTM-XXXXXXX)

## Step 2: Update Configuration Files
1. **Update `gtm-config.js`**:
   - Replace `'GTM-XXXXXXX'` with your actual container ID
   - Example: `const GTM_CONTAINER_ID = 'GTM-ABC12345';`

2. **Update HTML files**:
   - Replace all instances of `GTM-XXXXXXX` with your actual container ID
   - This includes both the script in `<head>` and the noscript fallback

## Step 3: Verify Implementation
1. **Check Browser Console**: Look for GTM initialization messages
2. **Use GTM Preview Mode**: Test your implementation in GTM's preview mode
3. **Verify Data Layer**: Check that `dataLayer` is properly initialized

## Step 4: Publish Your Container
1. In GTM, click "Submit" button
2. Add a version name and description
3. Click "Publish"

## Important Notes
- **Container Snippet**: The GTM container snippet is now included in your HTML files
- **Data Layer**: A data layer is initialized for custom tracking
- **Fallback Support**: Noscript fallback is included for users with JavaScript disabled
- **Existing Tracking**: Facebook Pixel tracking remains intact alongside GTM

## Files Modified
- `index.html` - Added GTM container snippet and noscript fallback
- `gtm-config.js` - Created GTM configuration file
- Other HTML files will need similar updates

## Next Steps
1. Replace `GTM-XXXXXXX` with your actual container ID in all files
2. Test the implementation
3. Configure tags, triggers, and variables in GTM as needed
4. Publish your container

## Support
If you encounter issues:
1. Check browser console for errors
2. Verify container ID is correct
3. Ensure you have publish permissions
4. Use GTM's preview mode for debugging
