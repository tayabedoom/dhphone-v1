// config.js - Shopify and Firebase Configuration
window.config = {
    shopify: {
        // Your Shopify store domain (without https://)
        domain: "kwr3tv-ax.myshopify.com",
        
        // Your Shopify Storefront Access Token
        // Make sure this token has the following permissions:
        // - Read products, variants, and collections
        // - Read customer information (if needed)
        accessToken: "e318cfe2b56703f779f113ed17e8459c",
        
        // API version (optional, defaults to 2023-10)
        apiVersion: "2023-10"
    },
    
    firebase: {
        // Your Firebase configuration
        apiKey: "AIzaSyAndSCDhjwz1rvm_2tI3ZLnEJRkFBeBJ8U",
        authDomain: "dh-phone-dynamic-content.firebaseapp.com",
        projectId: "dh-phone-dynamic-content",
        storageBucket: "dh-phone-dynamic-content.firebasestorage.app",
        messagingSenderId: "778700427286",
        appId: "1:778700427286:web:b2e0c24a34e89908ebe537",
        measurementId: "G-2YZ3YXHCVS"
    },
    
    // Additional settings
    settings: {
        // Enable/disable features
        enableFirebase: true,
        enableLocalStorage: true,
        
        // Product display settings
        productsPerPage: 12,
        relatedProductsCount: 4,
        
        // Cache settings (in milliseconds)
        cacheExpiry: 5 * 60 * 1000, // 5 minutes
        
        // Fallback settings
        useSampleData: true, // Set to false in production
        
        // Currency settings
        currency: "USD",
        currencySymbol: "$"
    }
};

// Utility functions for Shopify API
window.shopifyUtils = {
    // Test Shopify connection
    async testConnection() {
        try {
            const response = await fetch(`https://${window.config.shopify.domain}/api/${window.config.shopify.apiVersion}/graphql.json`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Shopify-Storefront-Access-Token': window.config.shopify.accessToken
                },
                body: JSON.stringify({
                    query: `
                        query {
                            shop {
                                name
                                description
                            }
                        }
                    `
                })
            });
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            const data = await response.json();
            
            if (data.errors) {
                throw new Error(data.errors[0].message);
            }
            
            console.log('✅ Shopify connection successful:', data.data.shop);
            return { success: true, data: data.data.shop };
            
        } catch (error) {
            console.error('❌ Shopify connection failed:', error);
            return { success: false, error: error.message };
        }
    },
    
    // Cache management for Shopify data
    _cache: {
        products: null,
        productsByHandle: {},
        timestamp: null,
        getItem(key) {
            // Check if localStorage is available and enabled
            if (window.config.settings.enableLocalStorage && window.localStorage) {
                try {
                    const item = localStorage.getItem(`shopify_${key}`);
                    if (!item) return null;
                    
                    const { data, timestamp } = JSON.parse(item);
                    const now = Date.now();
                    const cacheExpiry = window.config.settings.cacheExpiry || 5 * 60 * 1000; // 5 minutes default
                    
                    if (now - timestamp < cacheExpiry) {
                        console.log(`✅ Using cached ${key} data`);
                        return data;
                    } else {
                        console.log(`⏰ Cache expired for ${key}`);
                        return null;
                    }
                } catch (error) {
                    console.warn('Error reading from cache:', error);
                    return null;
                }
            }
            return null;
        },
        setItem(key, data) {
            // Check if localStorage is available and enabled
            if (window.config.settings.enableLocalStorage && window.localStorage) {
                try {
                    const cacheData = {
                        data: data,
                        timestamp: Date.now()
                    };
                    localStorage.setItem(`shopify_${key}`, JSON.stringify(cacheData));
                    console.log(`✅ Cached ${key} data`);
                } catch (error) {
                    console.warn('Error writing to cache:', error);
                }
            }
        }
    },
    
    // Get all products with pagination and caching
    async getAllProducts(limit = 50, cursor = null, useCache = true) {
        // Check cache first if enabled and no cursor (first page)
        if (useCache && !cursor) {
            const cachedProducts = this._cache.getItem('products');
            if (cachedProducts) {
                return cachedProducts;
            }
        }
        
        // Optimized query - only request essential fields
        const query = `
            query getProducts($first: Int!, $after: String) {
                products(first: $first, after: $after) {
                    pageInfo {
                        hasNextPage
                        endCursor
                    }
                    edges {
                        cursor
                        node {
                            id
                            title
                            handle
                            description
                            productType
                            tags
                            images(first: 1) {
                                edges {
                                    node {
                                        id
                                        src
                                        altText
                                    }
                                }
                            }
                            variants(first: 1) {
                                edges {
                                    node {
                                        id
                                        available
                                        price {
                                            amount
                                            currencyCode
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        `;
        
        try {
            console.time('Shopify API Request');
            const response = await fetch(`https://${window.config.shopify.domain}/api/${window.config.shopify.apiVersion}/graphql.json`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Shopify-Storefront-Access-Token': window.config.shopify.accessToken
                },
                body: JSON.stringify({
                    query: query,
                    variables: { 
                        first: limit,
                        after: cursor
                    }
                })
            });
            console.timeEnd('Shopify API Request');
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            const data = await response.json();
            
            if (data.errors) {
                throw new Error(data.errors[0].message);
            }
            
            // Cache the results if this is the first page
            if (!cursor && useCache) {
                this._cache.setItem('products', data.data.products);
            }
            
            return data.data.products;
            
        } catch (error) {
            console.error('Failed to fetch products:', error);
            throw error;
        }
    },
    
    // Get product by handle with caching
    async getProductByHandle(handle, useCache = true) {
        // Check cache first if enabled
        if (useCache) {
            const cacheKey = `product_${handle}`;
            const cachedProduct = this._cache.getItem(cacheKey);
            if (cachedProduct) {
                return cachedProduct;
            }
        }
        
        // Optimized query with only necessary fields
        const query = `
            query getProduct($handle: String!) {
                product(handle: $handle) {
                    id
                    title
                    description
                    descriptionHtml
                    handle
                    productType
                    tags
                    images(first: 5) {
                        edges {
                            node {
                                id
                                src
                                altText
                            }
                        }
                    }
                    variants(first: 10) {
                        edges {
                            node {
                                id
                                title
                                available
                                price {
                                    amount
                                    currencyCode
                                }
                                compareAtPrice {
                                    amount
                                    currencyCode
                                }
                                selectedOptions {
                                    name
                                    value
                                }
                            }
                        }
                    }
                    options {
                        id
                        name
                        values
                    }
                }
            }
        `;
        
        try {
            console.time(`Fetch product: ${handle}`);
            const response = await fetch(`https://${window.config.shopify.domain}/api/${window.config.shopify.apiVersion}/graphql.json`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Shopify-Storefront-Access-Token': window.config.shopify.accessToken
                },
                body: JSON.stringify({
                    query: query,
                    variables: { handle: handle }
                })
            });
            console.timeEnd(`Fetch product: ${handle}`);
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            const data = await response.json();
            
            if (data.errors) {
                throw new Error(data.errors[0].message);
            }
            
            // Cache the product data if caching is enabled
            if (useCache && data.data.product) {
                const cacheKey = `product_${handle}`;
                this._cache.setItem(cacheKey, data.data.product);
            }
            
            return data.data.product;
            
        } catch (error) {
            console.error('Failed to fetch product:', error);
            throw error;
        }
    },
    
    // Clear all Shopify cache
    clearCache() {
        if (window.config.settings.enableLocalStorage && window.localStorage) {
            try {
                // Find all shopify_ prefixed items in localStorage
                const shopifyKeys = [];
                for (let i = 0; i < localStorage.length; i++) {
                    const key = localStorage.key(i);
                    if (key && key.startsWith('shopify_')) {
                        shopifyKeys.push(key);
                    }
                }
                
                // Remove all shopify cache items
                shopifyKeys.forEach(key => localStorage.removeItem(key));
                console.log(`✅ Cleared ${shopifyKeys.length} Shopify cache items`);
                return true;
            } catch (error) {
                console.error('Failed to clear cache:', error);
                return false;
            }
        }
        return false;
    },
    
    // Transform Shopify product data to simplified format with optimized processing
    transformProduct(shopifyProduct) {
        if (!shopifyProduct) return null;
        
        // Use destructuring for cleaner code and better performance
        const { id, title, description, descriptionHtml, handle, productType, tags } = shopifyProduct;
        
        // Process images more efficiently
        const images = [];
        if (shopifyProduct.images?.edges) {
            for (const edge of shopifyProduct.images.edges) {
                images.push({
                    id: edge.node.id,
                    src: edge.node.src,
                    alt: edge.node.altText || title
                });
            }
        }
        
        // Process variants more efficiently
        const variants = [];
        if (shopifyProduct.variants?.edges) {
            for (const edge of shopifyProduct.variants.edges) {
                variants.push({
                    id: edge.node.id,
                    title: edge.node.title,
                    available: edge.node.available,
                    price: edge.node.price?.amount,
                compareAtPrice: edge.node.compareAtPrice?.amount,
                 selectedOptions: edge.node.selectedOptions
                });
            }
        }
        
        // Build and return the transformed product
        return {
            id,
            title,
            description,
            descriptionHtml,
            handle,
            productType,
            tags,
            images,
            variants,
            options: shopifyProduct.options?.map(option => ({
                id: option.id,
                name: option.name,
                values: option.values
            })) || []
        };
    },
    
    // Prefetch and cache products for better performance
    async prefetchProducts(limit = 12) {
        try {
            console.log(`🔄 Prefetching ${limit} products...`);
            const products = await this.getAllProducts(limit, null, true);
            console.log(`✅ Prefetched ${products.edges.length} products`);
            return products;
        } catch (error) {
            console.error('Failed to prefetch products:', error);
            return null;
        }
    },
    
    // Format price with currency
    formatPrice(amount, currencyCode = 'USD') {
        if (!amount) return '';
        
        const price = parseFloat(amount);
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: currencyCode
        }).format(price);
    },
    
    // Search products
    async searchProducts(query, limit = 20) {
        const searchQuery = `
            query searchProducts($query: String!, $first: Int!) {
                products(first: $first, query: $query) {
                    edges {
                        node {
                            id
                            title
                            handle
                            description
                            vendor
                            productType
                            images(first: 1) {
                                edges {
                                    node {
                                        src
                                        altText
                                    }
                                }
                            }
                            variants(first: 1) {
                                edges {
                                    node {
                                        price {
                                            amount
                                            currencyCode
                                        }
                                        available
                                    }
                                }
                            }
                        }
                    }
                }
            }
        `;
        
        try {
            const response = await fetch(`https://${window.config.shopify.domain}/api/${window.config.shopify.apiVersion}/graphql.json`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Shopify-Storefront-Access-Token': window.config.shopify.accessToken
                },
                body: JSON.stringify({
                    query: searchQuery,
                    variables: { 
                        query: query,
                        first: limit
                    }
                })
            });
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            const data = await response.json();
            
            if (data.errors) {
                throw new Error(data.errors[0].message);
            }
            
            return data.data.products.edges.map(edge => this.transformProduct(edge.node));
            
        } catch (error) {
            console.error('Failed to search products:', error);
            throw error;
        }
    }
};

// Cache utilities
window.cacheUtils = {
    // Set item in cache with expiry
    set(key, data, expiryMs = window.config.settings.cacheExpiry) {
        const item = {
            data: data,
            expiry: Date.now() + expiryMs
        };
        
        try {
            localStorage.setItem(`shopify_cache_${key}`, JSON.stringify(item));
        } catch (error) {
            console.warn('Failed to set cache:', error);
        }
    },
    
    // Get item from cache
    get(key) {
        try {
            const item = localStorage.getItem(`shopify_cache_${key}`);
            if (!item) return null;
            
            const parsed = JSON.parse(item);
            
            // Check if expired
            if (Date.now() > parsed.expiry) {
                localStorage.removeItem(`shopify_cache_${key}`);
                return null;
            }
            
            return parsed.data;
        } catch (error) {
            console.warn('Failed to get cache:', error);
            return null;
        }
    },
    
    // Clear all cache
    clear() {
        try {
            const keys = Object.keys(localStorage);
            keys.forEach(key => {
                if (key.startsWith('shopify_cache_')) {
                    localStorage.removeItem(key);
                }
            });
        } catch (error) {
            console.warn('Failed to clear cache:', error);
        }
    }
};

// Sample/fallback data
window.sampleData = {
    products: [
        {
            id: 'sample-1',
            title: 'DH Phone Pro Max',
            description: 'The ultimate smartphone experience with cutting-edge technology and premium design.',
            handle: 'dh-phone-pro-max',
            vendor: 'DH Electronics',
            productType: 'Smartphone',
            tags: ['phone', 'premium', 'latest'],
            images: [
                { 
                    id: 'img-1',
                    src: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500&h=500&fit=crop',
                    alt: 'DH Phone Pro Max - Front View'
                },
                {
                    id: 'img-2', 
                    src: 'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=500&h=500&fit=crop',
                    alt: 'DH Phone Pro Max - Back View'
                }
            ],
            variants: [
                {
                    id: 'var-1',
                    title: '128GB Space Gray',
                    available: true,
                    price: '999.00',
                    compareAtPrice: '1199.00'
                },
                {
                    id: 'var-2',
                    title: '256GB Space Gray',
                    available: true,
                    price: '1099.00',
                    compareAtPrice: '1299.00'
                }
            ]
        },
        {
            id: 'sample-2',
            title: 'DH Phone Standard',
            description: 'Perfect balance of performance and affordability in a sleek design.',
            handle: 'dh-phone-standard',
            vendor: 'DH Electronics',
            productType: 'Smartphone',
            tags: ['phone', 'affordable', 'reliable'],
            images: [
                {
                    id: 'img-3',
                    src: 'https://images.unsplash.com/photo-1556656793-08538906a9f8?w=500&h=500&fit=crop',
                    alt: 'DH Phone Standard'
                }
            ],
            variants: [
                {
                    id: 'var-3',
                    title: '64GB Blue',
                    available: true,
                    price: '699.00',
                    compareAtPrice: '799.00'
                }
            ]
        },
        {
            id: 'sample-3',
            title: 'DH Phone Mini',
            description: 'Compact size with powerful features for on-the-go lifestyle.',
            handle: 'dh-phone-mini',
            vendor: 'DH Electronics',
            productType: 'Smartphone',
            tags: ['phone', 'compact', 'portable'],
            images: [
                {
                    id: 'img-4',
                    src: 'https://images.unsplash.com/photo-1567581935884-3349723552ca?w=500&h=500&fit=crop',
                    alt: 'DH Phone Mini'
                }
            ],
            variants: [
                {
                    id: 'var-4',
                    title: '128GB Pink',
                    available: false,
                    price: '599.00'
                }
            ]
        }
    ]
};

// Initialization and diagnostic functions
window.diagnostics = {
    // Run all diagnostics
    async runAll() {
        console.log('🔍 Running Shopify diagnostics...');
        
        const results = {
            config: this.checkConfig(),
            connection: await this.checkConnection(),
            products: await this.checkProducts()
        };
        
        console.log('📊 Diagnostic Results:', results);
        return results;
    },
    
    // Check configuration
    checkConfig() {
        const issues = [];
        
        if (!window.config) {
            issues.push('Config object not found');
            return { success: false, issues };
        }
        
        if (!window.config.shopify) {
            issues.push('Shopify config missing');
        } else {
            if (!window.config.shopify.domain) {
                issues.push('Shopify domain missing');
            }
            if (!window.config.shopify.accessToken) {
                issues.push('Shopify access token missing');
            }
        }
        
        return {
            success: issues.length === 0,
            issues: issues
        };
    },
    
    // Check connection
    async checkConnection() {
        try {
            return await window.shopifyUtils.testConnection();
        } catch (error) {
            return { success: false, error: error.message };
        }
    },
    
    // Check if products can be loaded
    async checkProducts() {
        try {
            const products = await window.shopifyUtils.getAllProducts(5);
            return {
                success: true,
                count: products.edges.length,
                hasMore: products.pageInfo.hasNextPage
            };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }
};

// Auto-run diagnostics when config loads
if (typeof window !== 'undefined') {
    // Wait for DOM to load, then run diagnostics
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            setTimeout(() => window.diagnostics.runAll(), 1000);
        });
    } else {
        setTimeout(() => window.diagnostics.runAll(), 1000);
    }
}