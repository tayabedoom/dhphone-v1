// Shopify Integration
const shopifyAccessToken = window.config.shopify.accessToken;
const shopDomain = window.config.shopify.domain;
const apiVersion = window.config.shopify.apiVersion || '2023-10';
const shopifyEndpoint = `https://${shopDomain}/api/${apiVersion}/graphql.json`;

// Reference to shopifyUtils for optimized API calls
const shopify = window.shopifyUtils;

// Global variables
let allProducts = [];
let filteredProducts = [];
let currentCategory = 'all';
let searchQuery = '';

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Initializing products page...');
    
    // Check if configuration is available
    if (!window.config || !window.config.shopify) {
        console.error('❌ Shopify configuration not found');
        showError('Configuration error. Please check your setup.');
        return;
    }
    
    // Check if shopifyUtils is available
    if (!window.shopifyUtils) {
        console.error('❌ Shopify utilities not found');
        showError('Shopify utilities not loaded. Please check your configuration.');
        return;
    }
    
    // Initialize critical UI elements first
    initializeCategories();
    
    // Load products from Shopify (with cache)
    loadProducts();
    
    // Initialize non-critical UI elements after a slight delay
    setTimeout(() => {
        initializeSearch();
    }, 100);
});

// Test Shopify connection
async function testShopifyConnection() {
    try {
        console.log('🔍 Testing Shopify connection...');
        console.log('Domain:', shopDomain);
        console.log('Endpoint:', shopifyEndpoint);
        
        const testQuery = `
            query {
                shop {
                    name
                    primaryDomain {
                        url
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
                query: testQuery
            })
        });

        console.log('Response status:', response.status);
        console.log('Response headers:', response.headers);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('Shopify test response:', data);

        if (data.errors) {
            console.error('Shopify API errors:', data.errors);
            return false;
        }

        if (data.data && data.data.shop) {
            console.log('✅ Shopify connection successful!');
            console.log('Shop name:', data.data.shop.name);
            console.log('Shop URL:', data.data.shop.primaryDomain?.url);
            return true;
        }

        return false;
    } catch (error) {
        console.error('❌ Shopify connection test failed:', error);
        return false;
    }
}

// Fetch all products from Shopify with optimized loading
async function loadProducts() {
    const productList = document.getElementById('product-list');
    if (!productList) {
        console.error('❌ Product list container not found');
        return;
    }

    // Show loading state
    showLoadingState();

    try {
        console.time('Total product loading time');
        
        // First test the connection using shopifyUtils
        const connectionTest = await shopify.testConnection();
        if (!connectionTest) {
            showError('Failed to connect to Shopify. Please check your configuration.');
            return;
        }

        console.log('📦 Loading products from Shopify...');
        
        // Use the optimized shopifyUtils.getAllProducts method with caching
        const productsData = await shopify.getAllProducts(50, null, true);
        
        if (!productsData || !productsData.edges || productsData.edges.length === 0) {
            console.error('❌ No products data received');
            showError('No products found in your Shopify store.');
            return;
        }

        // Transform the data to our expected format
        allProducts = productsData.edges.map(edge => {
            const node = edge.node;
            return {
                id: node.id,
                title: node.title,
                handle: node.handle,
                description: node.description,
                productType: node.productType,
                tags: node.tags,
                priceRange: {
                    minVariantPrice: {
                        amount: node.variants?.edges[0]?.node?.price?.amount || '0',
                        currencyCode: node.variants?.edges[0]?.node?.price?.currencyCode || 'USD'
                    }
                },
                images: {
                    edges: node.images?.edges?.map(imgEdge => ({
                        node: {
                            url: imgEdge.node.src,
                            altText: imgEdge.node.altText
                        }
                    })) || []
                },
                variants: {
                    edges: node.variants?.edges?.map(varEdge => ({
                        node: {
                            availableForSale: varEdge.node.available
                        }
                    })) || []
                }
            };
        });
        
        console.log(`✅ Loaded ${allProducts.length} products from Shopify`);
        console.timeEnd('Total product loading time');
        
        // Initialize categories from products
        initializeCategoriesFromProducts();
        
        // Display all products initially
        filteredProducts = [...allProducts];
        displayProducts(filteredProducts);
        
        // Prefetch additional product details in the background for faster navigation
        setTimeout(() => {
            console.log('🔄 Prefetching additional product details...');
            shopify.prefetchProducts(12).catch(err => {
                console.warn('Non-critical prefetch error:', err);
            });
        }, 2000); // Delay prefetching to prioritize initial render
        
    } catch (error) {
        console.error('❌ Error loading products:', error);
        
        // Check for specific error types
        if (error.name === 'TypeError' && error.message.includes('fetch')) {
            showError('Network error. Please check your internet connection.');
        } else if (error.message.includes('CORS')) {
            showError('CORS error. Please check your Shopify domain configuration.');
        } else {
            showError('Failed to load products. Please try again later.');
        }
        
        // Try to load sample data as fallback
        if (window.config.settings.useSampleData && window.sampleData) {
            console.log('🔄 Loading sample data as fallback...');
            try {
                allProducts = window.sampleData.products.map(product => ({
                    id: product.id,
                    title: product.title,
                    handle: product.handle,
                    description: product.description,
                    productType: product.productType,
                    tags: product.tags,
                    priceRange: {
                        minVariantPrice: {
                            amount: product.variants[0]?.price || '0',
                            currencyCode: 'USD'
                        }
                    },
                    images: {
                        edges: product.images.map(img => ({
                            node: {
                                url: img.src,
                                altText: img.alt
                            }
                        }))
                    },
                    variants: {
                        edges: product.variants.map(variant => ({
                            node: {
                                availableForSale: variant.available
                            }
                        }))
                    }
                }));
                
                console.log(`✅ Loaded ${allProducts.length} sample products`);
                filteredProducts = [...allProducts];
                displayProducts(filteredProducts);
                initializeCategoriesFromProducts();
            } catch (fallbackError) {
                console.error('❌ Failed to load sample data:', fallbackError);
            }
        }
    }
}

// Show loading state
function showLoadingState() {
    const productList = document.getElementById('product-list');
    if (!productList) return;

    productList.innerHTML = `
        <div class="col-span-full text-center py-12">
            <div class="loading-spinner mx-auto mb-4"></div>
            <p class="text-gray-600 dark:text-gray-400">Loading products from Shopify...</p>
        </div>
    `;
}

// Display products in the grid with optimized rendering and progressive image loading
function displayProducts(products) {
    const productList = document.getElementById('product-list');
    if (!productList) return;

    if (products.length === 0) {
        productList.innerHTML = `
            <div class="col-span-full text-center py-16">
                <div class="max-w-md mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 transform transition-all duration-300 hover:shadow-xl">
                    <div class="bg-gray-100 dark:bg-gray-700 rounded-full h-20 w-20 flex items-center justify-center mx-auto mb-6">
                        <i class="fas fa-search text-4xl text-blue-500 dark:text-blue-400"></i>
                    </div>
                    <h3 class="text-xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">No products found</h3>
                    <p class="text-gray-600 dark:text-gray-400 mb-6">Try adjusting your search or filter criteria</p>
                    <button onclick="clearSearch()" class="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full hover:shadow-lg transition-all duration-300 transform hover:scale-105">
                        <i class="fas fa-redo mr-2"></i>Clear Search
                    </button>
                </div>
            </div>
        `;
        return;
    }

    console.log(`🎨 Displaying ${products.length} products`);

    // Use document fragment for better performance
    const fragment = document.createDocumentFragment();
    
    // Clear existing content
    productList.innerHTML = '';
    
    // Batch process products for better performance
    const batchSize = 8;
    let currentIndex = 0;
    
    // Preload high-priority images
    const preloadImages = (startIdx, count) => {
        const endIdx = Math.min(startIdx + count, products.length);
        for (let i = startIdx; i < endIdx; i++) {
            const product = products[i];
            if (product.images?.edges[0]?.node?.url) {
                const preloadLink = document.createElement('link');
                preloadLink.rel = 'preload';
                preloadLink.as = 'image';
                preloadLink.href = product.images.edges[0].node.url;
                document.head.appendChild(preloadLink);
            }
        }
    };
    
    // Preload first batch of images
    preloadImages(0, batchSize);
    
    function renderBatch() {
        if (currentIndex >= products.length) return;
        
        const endIndex = Math.min(currentIndex + batchSize, products.length);
        
        // Preload next batch of images
        if (endIndex < products.length) {
            preloadImages(endIndex, batchSize);
        }
        
        for (let i = currentIndex; i < endIndex; i++) {
            const product = products[i];
            const price = product.priceRange?.minVariantPrice?.amount || '0';
            const currency = product.priceRange?.minVariantPrice?.currencyCode || 'USD';
            const image = product.images?.edges[0]?.node || { url: 'https://placehold.co/400x300', altText: product.title };
            const isAvailable = product.variants?.edges[0]?.node?.availableForSale || false;
            
            const productCard = document.createElement('div');
            productCard.className = 'product-card bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2';
            productCard.style.animationDelay = `${(i % batchSize) * 50}ms`;
            
            productCard.innerHTML = `
                <div class="relative overflow-hidden group">
                    <div class="h-56 skeleton rounded-t-2xl"></div>
                    <img src="${image.url}" alt="${image.altText || product.title}" 
                         class="product-image loading w-full h-56 object-cover transition-transform duration-500 group-hover:scale-110 absolute top-0 left-0"
                         loading="lazy"
                         onerror="this.src='https://placehold.co/400x300?text=No+Image'; this.classList.remove('loading'); this.classList.add('loaded')">
                    <div class="absolute top-3 right-3">
                        <span class="px-3 py-1 text-xs font-medium rounded-full ${isAvailable ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white' : 'bg-gradient-to-r from-red-500 to-pink-500 text-white'}">
                            ${isAvailable ? 'In Stock' : 'Out of Stock'}
                        </span>
                    </div>
                    <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                <div class="p-6">
                    <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">${product.title}</h3>
                    <p class="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-3">${product.description || 'No description available'}</p>
                    <div class="flex justify-between items-center">
                        <div class="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">${formatPrice(price, currency)}</div>
                        <button class="${isAvailable ? 'bg-gradient-to-r from-blue-600 to-purple-600' : 'bg-gray-400 dark:bg-gray-600'} px-4 py-2 rounded-xl text-white font-medium transition-all duration-300 hover:shadow-lg transform hover:scale-105" 
                                ${isAvailable ? `onclick="viewProduct('${product.id}')"` : `onclick="window.location.href='Contact.html'"` } 
                                ${!isAvailable ? 'disabled' : ''}>
                            ${isAvailable ? 'View Details' : 'Contact Us'}
                        </button>
                    </div>
                </div>
            `;
            
            // Add image load event handler
            const img = productCard.querySelector('.product-image');
            img.onload = function() {
                this.classList.remove('loading');
                this.classList.add('loaded');
            };
            
            fragment.appendChild(productCard);
        }
        
        productList.appendChild(fragment.cloneNode(true));
        currentIndex = endIndex;
        
        if (currentIndex < products.length) {
            // Schedule next batch with requestAnimationFrame for better performance
            window.requestAnimationFrame(renderBatch);
        }
    }
    
    // Start rendering batches
    renderBatch();
}

// Format price with proper decimal places and thousands separators
function formatPrice(price, currency) {
    // Convert string to number and handle formatting
    const numPrice = parseFloat(price);
    if (isNaN(numPrice)) return `${currency} 0.00`;
    
    // Format based on currency
    try {
        return new Intl.NumberFormat('en-US', { 
            style: 'currency', 
            currency: currency,
            minimumFractionDigits: 2,
            maximumFractionDigits: 2 
        }).format(numPrice);
    } catch (e) {
        // Fallback if Intl is not supported
        return `${currency} ${numPrice.toFixed(2)}`;
    }
}

// Initialize search functionality
function initializeSearch() {
    const searchInput = document.getElementById('search-input');
    if (!searchInput) {
        console.warn('⚠️ Search input not found');
        return;
    }

    let searchTimeout;
    searchInput.addEventListener('input', function() {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
            searchQuery = this.value.toLowerCase().trim();
            console.log('🔍 Searching for:', searchQuery);
            filterProducts();
        }, 300);
    });
}

// Clear search and reset filters
function clearSearch() {
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        searchInput.value = '';
        searchQuery = '';
    }
    
    // Reset category to 'All'
    selectCategory('all');
    
    // Display all products
    filterProducts();
}

// Initialize categories
function initializeCategories() {
    const categorySlider = document.getElementById('category-slider');
    if (!categorySlider) {
        console.warn('⚠️ Category slider not found');
        return;
    }

    // Add "All" category
    const allCategory = document.createElement('button');
    allCategory.className = 'category-item active text-sm font-medium transition-all duration-300';
    allCategory.textContent = 'All';
    allCategory.dataset.category = 'all';
    allCategory.addEventListener('click', () => selectCategory('all'));
    categorySlider.querySelector('#category-buttons').appendChild(allCategory);
}

// Initialize categories from products
function initializeCategoriesFromProducts() {
    const categorySlider = document.getElementById('category-slider');
    const categoryButtons = document.getElementById('category-buttons');
    if (!categorySlider || !categoryButtons) {
        console.warn('⚠️ Category slider or buttons container not found');
        return;
    }

    // Get unique product types
    const productTypes = [...new Set(allProducts.map(product => product.productType).filter(Boolean))];
    console.log('📂 Product types found:', productTypes);
    
    // Clear existing product type categories (keep the "All" button)
    const existingButtons = categoryButtons.querySelectorAll('button:not([data-category="all"])');
    existingButtons.forEach(button => button.remove());

    // Add product type categories
    productTypes.forEach(type => {
        // Check if this category already exists
        if (!categoryButtons.querySelector(`[data-category="${type}"]`)) {
            const categoryButton = document.createElement('button');
            categoryButton.className = 'category-item text-sm font-medium transition-all duration-300 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300';
            categoryButton.textContent = type;
            categoryButton.dataset.category = type;
            categoryButton.addEventListener('click', () => selectCategory(type));
            categoryButtons.appendChild(categoryButton);
        }
    });
}

// Select category
function selectCategory(category) {
    currentCategory = category;
    console.log('📂 Selected category:', category);
    
    // Update active state
    document.querySelectorAll('.category-item').forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.category === category) {
            btn.classList.add('active');
        }
    });
    
    filterProducts();
}

// Filter products based on search and category
function filterProducts() {
    filteredProducts = allProducts.filter(product => {
        const matchesSearch = !searchQuery || 
            product.title.toLowerCase().includes(searchQuery) ||
            (product.description && product.description.toLowerCase().includes(searchQuery)) ||
            (product.productType && product.productType.toLowerCase().includes(searchQuery));
        
        const matchesCategory = currentCategory === 'all' || 
            (product.productType && product.productType === currentCategory);
        
        return matchesSearch && matchesCategory;
    });
    
    console.log(`🔍 Filtered to ${filteredProducts.length} products`);
    displayProducts(filteredProducts);
}

// View product details
function viewProduct(id) {
    console.log('👁️ Viewing product:', id);
    
    // Extract the handle from the ID (gid://shopify/Product/1234567890 -> 1234567890)
    let handle = id;
    if (id.includes('/')) {
        handle = id.split('/').pop();
    }
    
    // Find the product in our loaded products
    const product = allProducts.find(p => p.id === id || p.id.includes(handle));
    
    // If we have the handle, use it for better URL structure
    if (product && product.handle) {
        window.location.href = `product-in.html?handle=${product.handle}`;
    } else {
        window.location.href = `product-in.html?id=${handle}`;
    }
}

// Show error message
function showError(message) {
    const productList = document.getElementById('product-list');
    if (!productList) return;

    productList.innerHTML = `
        <div class="col-span-full text-center py-12">
            <div class="text-red-500 dark:text-red-400">
                <i class="fas fa-exclamation-triangle text-4xl mb-4"></i>
                <p class="text-lg">${message}</p>
                <button onclick="loadProducts()" class="mt-4 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
                    Try Again
                </button>
            </div>
        </div>
    `;
}

// Mobile menu functionality
document.addEventListener('DOMContentLoaded', function() {
    const hamburgerBtn = document.getElementById('hamburger-btn');
    const hamburgerMenu = document.getElementById('hamburger-menu');
    const hamburgerOverlay = document.getElementById('hamburger-overlay');
    const closeMenu = document.getElementById('close-menu');

    function openMenu() {
        hamburgerMenu.classList.add('open');
        hamburgerOverlay.classList.add('active');
    }

    function closeMenuFunc() {
        hamburgerMenu.classList.remove('open');
        hamburgerOverlay.classList.remove('active');
    }

    if (hamburgerBtn) hamburgerBtn.addEventListener('click', openMenu);
    if (closeMenu) closeMenu.addEventListener('click', closeMenuFunc);
    if (hamburgerOverlay) hamburgerOverlay.addEventListener('click', closeMenuFunc);

    // Language toggle functionality
    const languageToggle = document.getElementById('language-toggle');
    const languageDropdown = document.getElementById('language-dropdown');
    const desktopLanguageToggle = document.getElementById('desktop-language-toggle');
    const desktopLanguageDropdown = document.getElementById('desktop-language-dropdown');

    function toggleLanguageDropdown(dropdown) {
        if (dropdown) {
            dropdown.classList.toggle('active');
        }
    }

    if (languageToggle) {
        languageToggle.addEventListener('click', () => toggleLanguageDropdown(languageDropdown));
    }

    if (desktopLanguageToggle) {
        desktopLanguageToggle.addEventListener('click', () => toggleLanguageDropdown(desktopLanguageDropdown));
    }

    // Close dropdowns when clicking outside
    document.addEventListener('click', function(event) {
        if (languageDropdown && !languageToggle.contains(event.target)) {
            languageDropdown.classList.remove('active');
        }
        if (desktopLanguageDropdown && !desktopLanguageToggle.contains(event.target)) {
            desktopLanguageDropdown.classList.remove('active');
        }
    });
});

// Clear Shopify cache and reload products
function clearCache() {
    if (shopify && shopify.clearCache) {
        const cleared = shopify.clearCache();
        if (cleared) {
            console.log('🧹 Cache cleared, reloading products...');
            loadProducts();
        }
    } else {
        // Fallback if shopifyUtils is not available
        try {
            // Find all shopify_ prefixed items in localStorage
            const shopifyKeys = [];
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                if (key && (key.startsWith('shopify_') || key === 'shopifyProducts')) {
                    shopifyKeys.push(key);
                }
            }
            
            // Remove all shopify cache items
            shopifyKeys.forEach(key => localStorage.removeItem(key));
            console.log(`✅ Cleared ${shopifyKeys.length} Shopify cache items`);
            loadProducts();
        } catch (error) {
            console.error('Failed to clear cache:', error);
        }
    }
}