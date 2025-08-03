// Mobile menu functionality for Contact page
(function() {
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    const menuIcon = mobileMenuButton?.querySelector('i');

    function toggleMobileMenu() {
        if (mobileMenu && mobileMenuButton) {
            const isHidden = mobileMenu.classList.contains('hidden');
            
            if (isHidden) {
                // Show menu
                mobileMenu.classList.remove('hidden');
                mobileMenu.classList.add('animate-fade-in');
                mobileMenuButton.setAttribute('aria-expanded', 'true');
                document.body.classList.add('menu-open');
                
                // Change icon to X
                if (menuIcon) {
                    menuIcon.classList.remove('fa-bars');
                    menuIcon.classList.add('fa-times');
                }
            } else {
                // Hide menu
                mobileMenu.classList.add('hidden');
                mobileMenu.classList.remove('animate-fade-in');
                mobileMenuButton.setAttribute('aria-expanded', 'false');
                document.body.classList.remove('menu-open');
                
                // Change icon back to bars
                if (menuIcon) {
                    menuIcon.classList.remove('fa-times');
                    menuIcon.classList.add('fa-bars');
                }
            }
        }
    }

    function closeMobileMenu() {
        if (mobileMenu && mobileMenuButton) {
            mobileMenu.classList.add('hidden');
            mobileMenu.classList.remove('animate-fade-in');
            mobileMenuButton.setAttribute('aria-expanded', 'false');
            document.body.classList.remove('menu-open');
            
            if (menuIcon) {
                menuIcon.classList.remove('fa-times');
                menuIcon.classList.add('fa-bars');
            }
        }
    }

    function initMobileMenu() {
        if (mobileMenuButton && mobileMenu) {
            // Set initial state
            mobileMenuButton.setAttribute('aria-expanded', 'false');
            mobileMenuButton.setAttribute('aria-label', 'Toggle mobile menu');
            
            // Add click event
            mobileMenuButton.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                toggleMobileMenu();
            });

            // Close menu when clicking outside
            document.addEventListener('click', function(e) {
                if (!mobileMenuButton.contains(e.target) && !mobileMenu.contains(e.target)) {
                    closeMobileMenu();
                }
            });

            // Close menu on escape key
            document.addEventListener('keydown', function(e) {
                if (e.key === 'Escape') {
                    closeMobileMenu();
                }
            });

            // Close menu when window is resized to desktop size
            window.addEventListener('resize', function() {
                if (window.innerWidth >= 768) { // md breakpoint
                    closeMobileMenu();
                }
            });

            // Add click events to mobile menu links to close menu
            const mobileMenuLinks = mobileMenu.querySelectorAll('a');
            mobileMenuLinks.forEach(link => {
                link.addEventListener('click', function() {
                    // Small delay to allow navigation
                    setTimeout(closeMobileMenu, 100);
                });
            });
        }
    }

    // Initialize mobile menu when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initMobileMenu);
    } else {
        initMobileMenu();
    }
})();

// Language toggle functionality for Contact page
(function() {
    // Language dropdown functionality
    const langToggle = document.getElementById('lang-toggle');
    const langDropdown = document.getElementById('lang-dropdown');
    const currentLangSpan = document.getElementById('current-lang');
    const html = document.documentElement;

    function setLang(language) {
        if (language === 'ar') {
            html.setAttribute('lang', 'ar');
            html.setAttribute('dir', 'rtl');
            localStorage.setItem('lang', 'ar');
        } else if (language === 'fr') {
            html.setAttribute('lang', 'fr');
            html.setAttribute('dir', 'ltr');
            localStorage.setItem('lang', 'fr');
        } else {
            html.setAttribute('lang', 'en');
            html.setAttribute('dir', 'ltr');
            localStorage.setItem('lang', 'en');
        }
        // Update current language display
        if (currentLangSpan) {
            currentLangSpan.textContent = language.toUpperCase();
        }
        // Update page title
        const titleElement = document.querySelector('title');
        if (titleElement) {
            const titleAttr = `data-${language}`;
            const newTitle = titleElement.getAttribute(titleAttr) || titleElement.getAttribute('data-en');
            if (newTitle) {
                titleElement.textContent = newTitle;
            }
        }
        // Update dropdown labels
        document.querySelectorAll('.lang-option').forEach(option => {
            const labelSpan = option.querySelector('.lang-label');
            if (labelSpan) {
                const label = option.getAttribute('data-' + language);
                if (label) {
                    labelSpan.textContent = label;
                }
            }
        });
        // Update all elements with data-lang attributes
        document.querySelectorAll('[data-' + language + ']').forEach(element => {
            const text = element.getAttribute('data-' + language);
            if (text) {
                element.textContent = text;
            }
        });
    }

    function closeLangDropdown() {
        if (langDropdown) {
            langDropdown.classList.remove('lang-dropdown-open');
            langToggle.setAttribute('aria-expanded', 'false');
        }
    }
    function openLangDropdown() {
        if (langDropdown) {
            langDropdown.classList.add('lang-dropdown-open');
            langToggle.setAttribute('aria-expanded', 'true');
        }
    }
    function initLanguageToggle() {
        // Initial language
        const savedLang = localStorage.getItem('lang') || 'en';
        setLang(savedLang);
        if (langToggle && langDropdown) {
            langToggle.setAttribute('aria-haspopup', 'listbox');
            langToggle.setAttribute('aria-expanded', 'false');
            langDropdown.setAttribute('role', 'listbox');
            langToggle.addEventListener('click', function(e) {
                e.stopPropagation();
                console.log('Language toggle clicked');
                if (langDropdown.classList.contains('lang-dropdown-open')) {
                    console.log('Closing language dropdown');
                    closeLangDropdown();
                } else {
                    console.log('Opening language dropdown');
                    openLangDropdown();
                }
            });
            document.addEventListener('click', function(e) {
                if (!langToggle.contains(e.target) && !langDropdown.contains(e.target)) {
                    closeLangDropdown();
                }
            });
            // Keyboard accessibility
            langToggle.addEventListener('keydown', function(e) {
                if (e.key === 'Escape') {
                    closeLangDropdown();
                } else if (e.key === 'ArrowDown') {
                    e.preventDefault();
                    openLangDropdown();
                    const firstOption = langDropdown.querySelector('.lang-option');
                    if (firstOption) firstOption.focus();
                }
            });
            langDropdown.querySelectorAll('.lang-option').forEach(option => {
                option.setAttribute('tabindex', '0');
                option.addEventListener('keydown', function(e) {
                    if (e.key === 'Escape') {
                        closeLangDropdown();
                        langToggle.focus();
                    } else if (e.key === 'ArrowDown') {
                        e.preventDefault();
                        const next = this.nextElementSibling;
                        if (next) next.focus();
                    } else if (e.key === 'ArrowUp') {
                        e.preventDefault();
                        const prev = this.previousElementSibling;
                        if (prev) prev.focus();
                        else langToggle.focus();
                    } else if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        this.click();
                    }
                });
            });
            // Handle language selection
            const langOptions = document.querySelectorAll('.lang-option');
            langOptions.forEach(option => {
                option.addEventListener('click', function() {
                    const selectedLang = this.getAttribute('data-lang');
                    setLang(selectedLang);
                    closeLangDropdown();
                });
            });
        }
    }
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initLanguageToggle);
    } else {
        initLanguageToggle();
    }
})();

document.addEventListener('DOMContentLoaded', function() {
    // Fetch and populate Wilaya dropdown
    fetch('https://raw.githubusercontent.com/othmanus/algeria-cities/master/json/wilaya.json')
        .then(response => response.json())
        .then(wilayas => {
            const wilayaSelect = document.getElementById('wilaya');
            if (wilayaSelect && Array.isArray(wilayas)) {
                wilayas.forEach(wilaya => {
                    const option = document.createElement('option');
                    option.value = wilaya.code || wilaya.id || wilaya.nom || wilaya.name;
                    option.textContent = wilaya.nom || wilaya.name;
                    wilayaSelect.appendChild(option);
                });
            }
        })
        .catch(err => {
            console.error('Failed to load Wilayas:', err);
        });
});

// Patch form validation to include Wilaya
(function() {
    // ... existing code ...
    // (Find validateContactForm and add Wilaya validation)
    const origValidate = window.validateContactForm;
    window.validateContactForm = function() {
        let isValid = true;
        if (typeof origValidate === 'function') {
            isValid = origValidate();
        }
        // Wilaya validation
        const wilaya = document.getElementById('wilaya');
        if (wilaya && !wilaya.value) {
            const errorElement = document.getElementById('wilayaError');
            errorElement.classList.remove('hidden');
            wilaya.classList.add('border-red-500', 'ring-2', 'ring-red-200');
            wilaya.focus();
            isValid = false;
        }
        return isValid;
    };
})(); 

// Floating labels functionality
function initializeFloatingLabels() {
    const formInputs = document.querySelectorAll('.form-input input, .form-input textarea, .form-input select');
    
    formInputs.forEach(input => {
        const label = input.nextElementSibling;
        if (label && label.classList.contains('floating-label')) {
            // Check initial state
            if (input.value || (input.tagName === 'SELECT' && input.value !== '')) {
                label.classList.add('active');
            }
            
            // Add event listeners
            input.addEventListener('focus', () => {
                label.classList.add('active');
            });
            
            input.addEventListener('blur', () => {
                if (!input.value || (input.tagName === 'SELECT' && input.value === '')) {
                    label.classList.remove('active');
                }
            });
            
            input.addEventListener('input', () => {
                if (input.value || (input.tagName === 'SELECT' && input.value !== '')) {
                    label.classList.add('active');
                } else {
                    label.classList.remove('active');
                }
            });
        }
    });
}

// Initialize form functionality when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('Contact page loaded successfully');
    
    // Initialize floating labels
    initializeFloatingLabels();
    
    // Test SweetAlert2
    if (typeof Swal !== 'undefined') {
        console.log('SweetAlert2 is loaded and ready');
    } else {
        console.error('SweetAlert2 not loaded');
    }
}); 