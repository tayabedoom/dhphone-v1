// Shopify Integration
const shopifyAccessToken = 'e318cfe2b56703f779f113ed17e8459c';
const shopDomain = 'kwr3tv-ax.myshopify.com';
const shopifyEndpoint = `https://${shopDomain}/api/2024-01/graphql.json`;

// Global variables
let allProducts = [];
let filteredProducts = [];
let currentCategory = 'all';
let searchQuery = '';

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Initializing products page...');
    loadProducts();
    initializeSearch();
    initializeCategories();
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

// Fetch all products from Shopify
async function loadProducts() {
    const productList = document.getElementById('product-list');
    if (!productList) {
        console.error('❌ Product list container not found');
        return;
    }

    // Show loading state
    showLoadingState();

    try {
        // First test the connection
        const connectionTest = await testShopifyConnection();
        if (!connectionTest) {
            showError('Failed to connect to Shopify. Please check your configuration.');
            return;
        }

        console.log('📦 Loading products from Shopify...');
        
        const query = `
            query getProducts($first: Int!) {
                products(first: $first) {
                    edges {
                        node {
                            id
                            title
                            handle
                            description
                            productType
                            tags
                            priceRange {
                                minVariantPrice {
                                    amount
                                    currencyCode
                                }
                            }
                            images(first: 5) {
                                edges {
                                    node {
                                        url
                                        altText
                                    }
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
                    pageInfo {
                        hasNextPage
                        hasPreviousPage
                    }
                }
            }
        `;

        console.log('Sending GraphQL query...');
        const response = await fetch(shopifyEndpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Shopify-Storefront-Access-Token': shopifyAccessToken
            },
            body: JSON.stringify({
                query: query,
                variables: { first: 50 }
            })
        });

        console.log('Response received:', response.status, response.statusText);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('📦 Shopify API response:', data);
        
        if (data.errors) {
            console.error('❌ Shopify API errors:', data.errors);
            data.errors.forEach((error, index) => {
                console.error(`Error ${index + 1}:`, error.message);
            });
            
            // Check if it's an API version issue
            const hasVersionError = data.errors.some(error => 
                error.message.includes('version') || 
                error.message.includes('deprecated') ||
                error.message.includes('doesn\'t exist')
            );
            
            if (hasVersionError) {
                showError('Shopify API version issue. Please check your API configuration or contact support.');
            } else {
                showError('Failed to load products from Shopify. Please check your API configuration.');
            }
            return;
        }

        if (!data.data || !data.data.products) {
            console.error('❌ No products data received');
            showError('No products found in your Shopify store.');
            return;
        }

        allProducts = data.data.products.edges.map(edge => edge.node);
        console.log(`✅ Loaded ${allProducts.length} products from Shopify`);
        
        // Log first few products for debugging
        if (allProducts.length > 0) {
            console.log('Sample product:', allProducts[0]);
        }
        
        // Initialize categories from products
        initializeCategoriesFromProducts();
        
        // Display all products initially
        filteredProducts = [...allProducts];
        displayProducts(filteredProducts);
        
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

// Display products in the grid
function displayProducts(products) {
    const productList = document.getElementById('product-list');
    if (!productList) return;

    if (products.length === 0) {
        productList.innerHTML = `
            <div class="col-span-full text-center py-12">
                <div class="text-gray-500 dark:text-gray-400">
                    <i class="fas fa-search text-4xl mb-4"></i>
                    <p class="text-lg">No products found</p>
                    <p class="text-sm">Try adjusting your search or filter criteria</p>
                </div>
            </div>
        `;
        return;
    }

    console.log(`🎨 Displaying ${products.length} products`);

    productList.innerHTML = products.map(product => {
        const price = product.priceRange?.minVariantPrice?.amount || '0';
        const currency = product.priceRange?.minVariantPrice?.currencyCode || 'USD';
        const image = product.images?.edges[0]?.node || { url: 'https://placehold.co/400x300', altText: product.title };
        const isAvailable = product.variants?.edges[0]?.node?.availableForSale || false;
        
        return `
            <div class="product-card bg-white dark:bg-slate-800 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300">
                <div class="relative overflow-hidden">
                    <img src="${image.url}" alt="${image.altText || product.title}" 
                         class="product-image w-full h-48 object-cover transition-transform duration-300"
                         onerror="this.src='https://placehold.co/400x300?text=No+Image'">
                    <div class="absolute top-2 right-2">
                        <span class="px-2 py-1 text-xs font-medium rounded-full ${isAvailable ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'}">
                            ${isAvailable ? 'In Stock' : 'Out of Stock'}
                        </span>
                    </div>
                </div>
                <div class="p-6">
                    <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">${product.title}</h3>
                    <p class="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-3">${product.description || 'No description available'}</p>
                    <div class="flex justify-between items-center">
                        <div class="price-tag">${currency} ${price}</div>
                        <button class="btn-primary px-4 py-2 rounded-lg text-white font-medium transition-all duration-200 hover:scale-105" 
                                ${isAvailable ? `onclick="viewProduct('${product.handle}')"` : `onclick="window.location.href='Contact.html'"`} 
                                ${!isAvailable ? 'disabled' : ''}>
                            ${isAvailable ? 'View Details' : 'Contact Us'}
                        </button>
                    </div>
                </div>
            </div>
        `;
    }).join('');
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

// Initialize categories
function initializeCategories() {
    const categorySlider = document.getElementById('category-slider');
    if (!categorySlider) {
        console.warn('⚠️ Category slider not found');
        return;
    }

    // Add "All" category
    const allCategory = document.createElement('button');
    allCategory.className = 'category-item active px-4 py-2 rounded-full border-2 border-gray-200 dark:border-slate-600 text-sm font-medium transition-all duration-200 hover:border-primary-500 dark:hover:border-primary-400';
    allCategory.textContent = 'All';
    allCategory.dataset.category = 'all';
    allCategory.addEventListener('click', () => selectCategory('all'));
    categorySlider.appendChild(allCategory);
}

// Initialize categories from products
function initializeCategoriesFromProducts() {
    const categorySlider = document.getElementById('category-slider');
    if (!categorySlider) return;

    // Get unique product types
    const productTypes = [...new Set(allProducts.map(product => product.productType).filter(Boolean))];
    console.log('📂 Product types found:', productTypes);
    
    // Clear existing categories except "All"
    const allButton = categorySlider.querySelector('[data-category="all"]');
    categorySlider.innerHTML = '';
    if (allButton) {
        categorySlider.appendChild(allButton);
    }

    // Add product type categories
    productTypes.forEach(type => {
        const categoryButton = document.createElement('button');
        categoryButton.className = 'category-item px-4 py-2 rounded-full border-2 border-gray-200 dark:border-slate-600 text-sm font-medium transition-all duration-200 hover:border-primary-500 dark:hover:border-primary-400';
        categoryButton.textContent = type;
        categoryButton.dataset.category = type;
        categoryButton.addEventListener('click', () => selectCategory(type));
        categorySlider.appendChild(categoryButton);
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
function viewProduct(handle) {
    console.log('👁️ Viewing product:', handle);
    window.location.href = `product-in.html?product=${handle}`;
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
const mobileMenuButton = document.getElementById('mobile-menu-button');
const mobileMenu = document.getElementById('mobile-menu');

if (mobileMenuButton && mobileMenu) {
    mobileMenuButton.addEventListener('click', function() {
        mobileMenu.classList.toggle('hidden');
    });
}