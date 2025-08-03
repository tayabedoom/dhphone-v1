// Language toggle functionality (reusable)
(function() {
    let langToggle, langDropdown, langToggleMobile, langDropdownMobile;
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
        
        // Update language display in toggle buttons
        const langToggleSpan = document.querySelector('#language-toggle span');
        const langToggleMobileSpan = document.querySelector('#language-toggle-mobile span');
        
        if (langToggleSpan) {
            langToggleSpan.textContent = language.toUpperCase();
        }
        if (langToggleMobileSpan) {
            langToggleMobileSpan.textContent = language.toUpperCase();
        }
        
        // Update all translatable elements
        document.querySelectorAll('[data-' + language + ']').forEach(element => {
            const text = element.getAttribute('data-' + language);
            if (text) {
                element.textContent = text;
            }
        });
    }
    
    function closeLangDropdown() {
        if (langDropdown) {
            langDropdown.classList.add('hidden');
            langToggle.setAttribute('aria-expanded', 'false');
        }
        if (langDropdownMobile) {
            langDropdownMobile.classList.add('hidden');
        }
    }
    
    function openLangDropdown() {
        if (langDropdown) {
            langDropdown.classList.remove('hidden');
            langToggle.setAttribute('aria-expanded', 'true');
        }
    }
    
    function initLanguageToggle() {
        // Get elements
        langToggle = document.getElementById('language-toggle');
        langDropdown = document.getElementById('language-dropdown');
        langToggleMobile = document.getElementById('language-toggle-mobile');
        langDropdownMobile = document.getElementById('language-dropdown-mobile');
        
        // Set initial language
        const savedLang = localStorage.getItem('lang') || 'en';
        setLang(savedLang);
        
        // Desktop language toggle
        if (langToggle && langDropdown) {
            langToggle.setAttribute('aria-haspopup', 'listbox');
            langToggle.setAttribute('aria-expanded', 'false');
            langDropdown.setAttribute('role', 'listbox');
            
            langToggle.addEventListener('click', function(e) {
                e.stopPropagation();
                if (langDropdown.classList.contains('hidden')) {
                    openLangDropdown();
                } else {
                    closeLangDropdown();
                }
            });
            
            // Close dropdown when clicking outside
            document.addEventListener('click', function(e) {
                if (!langToggle.contains(e.target) && !langDropdown.contains(e.target)) {
                    closeLangDropdown();
                }
            });
            
            // Keyboard navigation
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
            
            // Language option selection
            langDropdown.querySelectorAll('.lang-option').forEach(option => {
                option.setAttribute('tabindex', '0');
                option.addEventListener('click', function() {
                    const selectedLang = this.getAttribute('data-lang');
                    setLang(selectedLang);
                    closeLangDropdown();
                });
                
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
        }

        // Mobile language toggle
        if (langToggleMobile && langDropdownMobile) {
            langToggleMobile.addEventListener('click', function(e) {
                e.stopPropagation();
                langDropdownMobile.classList.toggle('hidden');
            });

            // Handle mobile language selection
            langDropdownMobile.querySelectorAll('.lang-option').forEach(button => {
                button.addEventListener('click', (e) => {
                    const selectedLang = e.target.getAttribute('data-lang');
                    setLang(selectedLang);
                    langDropdownMobile.classList.add('hidden');
                });
            });

            // Close mobile dropdown when clicking outside
            window.addEventListener('click', function(e) {
                if (!langToggleMobile.contains(e.target) && !langDropdownMobile.contains(e.target)) {
                    langDropdownMobile.classList.add('hidden');
                }
            });
        }
    }
    
    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initLanguageToggle);
    } else {
        initLanguageToggle();
    }
})();