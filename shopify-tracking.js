// Shopify Product Tracking for Facebook Pixel
// This script provides comprehensive tracking for all Shopify products

class ShopifyProductTracker {
    constructor() {
        this.currentProduct = null;
        this.trackedEvents = new Set();
        this.init();
    }

    init() {
        console.log('🚀 Initializing Shopify Product Tracker...');
        this.setupEventListeners();
        this.trackPageLoad();
    }

    setupEventListeners() {
        // Track product card clicks
        document.addEventListener('click', (e) => {
            const productCard = e.target.closest('.product-card');
            if (productCard) {
                this.trackProductCardClick(productCard);
            }
        });

        // Track category filter clicks
        document.addEventListener('click', (e) => {
            const categoryBtn = e.target.closest('.category-item, .category-btn');
            if (categoryBtn) {
                this.trackCategoryClick(categoryBtn);
            }
        });

        // Track search functionality
        const searchInput = document.getElementById('search-input');
        if (searchInput) {
            let searchTimeout;
            searchInput.addEventListener('input', (e) => {
                clearTimeout(searchTimeout);
                searchTimeout = setTimeout(() => {
                    this.trackSearch(e.target.value);
                }, 500);
            });
        }

        // Track WhatsApp clicks
        document.addEventListener('click', (e) => {
            const whatsappLink = e.target.closest('a[href*="whatsapp"]');
            if (whatsappLink) {
                this.trackWhatsAppClick();
            }
        });

        // Track contact form submissions
        document.addEventListener('submit', (e) => {
            if (e.target.tagName === 'FORM') {
                this.trackContactForm();
            }
        });

        // Track social media clicks
        document.addEventListener('click', (e) => {
            const socialLink = e.target.closest('a[href*="facebook"], a[href*="instagram"], a[href*="tiktok"]');
            if (socialLink) {
                this.trackSocialMediaClick(socialLink.href);
            }
        });
    }

    trackPageLoad() {
        const urlParams = new URLSearchParams(window.location.search);
        const productHandle = urlParams.get('product');
        
        if (productHandle) {
            console.log('📊 Tracking product page load:', productHandle);
            this.trackProductPageView(productHandle);
        } else {
            console.log('📊 Tracking general page load');
            this.trackPageView();
        }
    }

    trackProductCardClick(productCard) {
        const productData = this.extractProductData(productCard);
        if (!productData) return;

        console.log('📊 Tracking product card click:', productData.title);
        
        if (window.FacebookPixel && window.FacebookPixel.trackProductView) {
            window.FacebookPixel.trackProductView(
                productData.title,
                productData.type,
                productData.price
            );
        }

        // Prevent duplicate tracking
        const eventId = `product_click_${productData.id}`;
        if (this.trackedEvents.has(eventId)) return;
        this.trackedEvents.add(eventId);
    }

    trackCategoryClick(categoryBtn) {
        const category = categoryBtn.textContent.trim() || categoryBtn.dataset.category;
        console.log('📊 Tracking category click:', category);
        
        if (window.FacebookPixel && window.FacebookPixel.trackCategoryFilter) {
            window.FacebookPixel.trackCategoryFilter(category);
        }
    }

    trackSearch(searchTerm) {
        if (!searchTerm || searchTerm.length < 2) return;
        
        console.log('📊 Tracking search:', searchTerm);
        
        if (window.FacebookPixel && window.FacebookPixel.trackSearch) {
            window.FacebookPixel.trackSearch(searchTerm);
        }
    }

    trackProductPageView(productHandle) {
        console.log('📊 Tracking product page view:', productHandle);
        
        // Fetch product details from Shopify API
        this.fetchProductDetails(productHandle).then(productData => {
            if (window.FacebookPixel && window.FacebookPixel.trackProductView) {
                window.FacebookPixel.trackProductView(
                    productData.title,
                    productData.type,
                    productData.price
                );
            }
        }).catch(error => {
            console.error('Error fetching product details:', error);
            // Fallback to basic tracking
            if (window.FacebookPixel && window.FacebookPixel.trackProductView) {
                window.FacebookPixel.trackProductView(productHandle, 'Product', 0);
            }
        });
    }

    // Fetch product details from Shopify API
    async fetchProductDetails(productHandle) {
        try {
            const shopifyAccessToken = 'e318cfe2b56703f779f113ed17e8459c';
            const shopDomain = 'kwr3tv-ax.myshopify.com';
            const shopifyEndpoint = `https://${shopDomain}/api/2024-01/graphql.json`;
            
            const query = `
                query getProduct($handle: String!) {
                    product(handle: $handle) {
                        id
                        title
                        handle
                        productType
                        priceRange {
                            minVariantPrice {
                                amount
                                currencyCode
                            }
                        }
                        variants(first: 1) {
                            edges {
                                node {
                                    availableForSale
                                }
                            }
                        }
                    }
                }
            `;

            const response = await fetch(shopifyEndpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Shopify-Storefront-Access-Token': shopifyAccessToken
                },
                body: JSON.stringify({
                    query: query,
                    variables: { handle: productHandle }
                })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            
            if (data.errors) {
                throw new Error(data.errors[0].message);
            }

            const product = data.data.product;
            return {
                title: product.title,
                type: product.productType || 'Product',
                price: parseFloat(product.priceRange?.minVariantPrice?.amount || '0'),
                currency: product.priceRange?.minVariantPrice?.currencyCode || 'DZD',
                available: product.variants?.edges[0]?.node?.availableForSale || false
            };
        } catch (error) {
            console.error('Error fetching product details:', error);
            throw error;
        }
    }

    trackPageView() {
        console.log('📊 Tracking page view');
        
        if (window.FacebookPixel && window.FacebookPixel.trackPageView) {
            window.FacebookPixel.trackPageView(document.title);
        }
    }

    trackWhatsAppClick() {
        console.log('📊 Tracking WhatsApp click');
        
        if (window.FacebookPixel && window.FacebookPixel.trackWhatsAppClick) {
            window.FacebookPixel.trackWhatsAppClick();
        }
    }

    trackContactForm() {
        console.log('📊 Tracking contact form submission');
        
        if (window.FacebookPixel && window.FacebookPixel.trackContactForm) {
            window.FacebookPixel.trackContactForm();
        }
    }

    trackSocialMediaClick(url) {
        let platform = 'Social Media';
        if (url.includes('facebook')) platform = 'Facebook';
        else if (url.includes('instagram')) platform = 'Instagram';
        else if (url.includes('tiktok')) platform = 'TikTok';
        
        console.log('📊 Tracking social media click:', platform);
        
        if (window.FacebookPixel && window.FacebookPixel.trackSocialMediaClick) {
            window.FacebookPixel.trackSocialMediaClick(platform);
        }
    }

    extractProductData(productCard) {
        try {
            return {
                id: productCard.dataset.productId || productCard.dataset.productHandle,
                title: productCard.dataset.productTitle || productCard.querySelector('h3')?.textContent || 'Product',
                type: productCard.dataset.productType || 'General',
                price: parseFloat(productCard.dataset.productPrice || '0'),
                currency: productCard.dataset.productCurrency || 'USD',
                handle: productCard.dataset.productHandle,
                available: productCard.dataset.productAvailable === 'true'
            };
        } catch (error) {
            console.error('Error extracting product data:', error);
            return null;
        }
    }

    // Manual tracking methods for external use
    trackAddToCart(productTitle, productType, price, currency = 'DZD') {
        console.log('📊 Tracking add to cart:', productTitle);
        
        if (window.FacebookPixel && window.FacebookPixel.trackAddToCart) {
            window.FacebookPixel.trackAddToCart(productTitle, productType, price);
        }
    }

    trackPurchase(orderValue, orderId, currency = 'DZD') {
        console.log('📊 Tracking purchase:', orderId, orderValue);
        
        if (window.FacebookPixel && window.FacebookPixel.trackPurchase) {
            window.FacebookPixel.trackPurchase(orderValue, orderId);
        }
    }

    trackLead(contentName = 'Lead', contentCategory = 'Contact') {
        console.log('📊 Tracking lead:', contentName);
        
        if (window.FacebookPixel && window.FacebookPixel.trackContactForm) {
            window.FacebookPixel.trackContactForm();
        }
    }
}

// Initialize tracking when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    window.shopifyTracker = new ShopifyProductTracker();
});

// Export for manual use
window.ShopifyTracker = ShopifyProductTracker; 