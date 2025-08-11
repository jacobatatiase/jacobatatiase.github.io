// Language Management
class LanguageManager {
    constructor() {
        this.currentLanguage = localStorage.getItem('language') || 'en';
        this.languageData = {};
        this.languageToggle = document.getElementById('language-toggle');
        this.currentLanguageIcon = document.getElementById('current-language');
        this.mobileCurrentLanguageIcon = document.getElementById('mobile-current-language');
        this.mobileLanguageToggle = document.getElementById('mobile-language-toggle');
        this.languageDropdown = document.getElementById('language-dropdown');
        this.languageOptions = document.querySelectorAll('.language-option');
        this.flagMap = {
            'en': '🇬🇧',
            'sv': '🇸🇪', 
            'de': '🇩🇪',
            'it': '🇮🇹'
        };
        this.init();
    }

    async init() {
        await this.loadLanguageData(this.currentLanguage);
        this.applyLanguage(this.currentLanguage);
        this.updateLanguageIcon();
        this.bindEvents();
    }

    async loadLanguageData(language) {
        if (!this.languageData[language]) {
            try {
                const response = await fetch(`${language}.json`);
                this.languageData[language] = await response.json();
            } catch (error) {
                console.error(`Error loading language ${language}:`, error);
                // Fallback to English if language fails to load
                if (language !== 'en') {
                    await this.loadLanguageData('en');
                }
            }
        }
    }

    bindEvents() {
        // Desktop language toggle
        if (this.languageToggle) {
            this.languageToggle.addEventListener('click', (e) => {
                e.stopPropagation();
                this.toggleLanguageDropdown();
            });
        }

        // Mobile language toggle
        if (this.mobileLanguageToggle) {
            this.mobileLanguageToggle.addEventListener('click', (e) => {
                e.stopPropagation();
                this.showMobileLanguageOptions();
            });
        }

        // Language options
        this.languageOptions.forEach(option => {
            option.addEventListener('click', async (e) => {
                e.preventDefault();
                const selectedLanguage = e.target.getAttribute('data-lang');
                await this.switchLanguage(selectedLanguage);
                this.closeLanguageDropdown();
            });
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', () => {
            this.closeLanguageDropdown();
        });
    }

    toggleLanguageDropdown() {
        if (this.languageDropdown) {
            this.languageDropdown.classList.toggle('show');
            this.languageDropdown.classList.toggle('hidden');
        }
    }

    closeLanguageDropdown() {
        if (this.languageDropdown) {
            this.languageDropdown.classList.add('hidden');
            this.languageDropdown.classList.remove('show');
        }
    }

    showMobileLanguageOptions() {
        // For mobile, we'll cycle through languages
        const languages = ['en', 'de', 'it', 'sv'];
        const currentIndex = languages.indexOf(this.currentLanguage);
        const nextIndex = (currentIndex + 1) % languages.length;
        const nextLanguage = languages[nextIndex];
        this.switchLanguage(nextLanguage);
    }

    async switchLanguage(language) {
        await this.loadLanguageData(language);
        this.currentLanguage = language;
        this.applyLanguage(language);
        this.updateLanguageIcon();
        localStorage.setItem('language', language);
    }

    applyLanguage(language) {
        const data = this.languageData[language];
        if (!data) return;

        // Update all elements with data-i18n attributes
        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.getAttribute('data-i18n');
            const translation = this.getNestedValue(data, key);
            if (translation) {
                element.textContent = translation;
            }
        });

        // Update title attributes
        document.querySelectorAll('[data-i18n-title]').forEach(element => {
            const key = element.getAttribute('data-i18n-title');
            const translation = this.getNestedValue(data, key);
            if (translation) {
                element.setAttribute('title', translation);
            }
        });

        // Update placeholder attributes
        document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
            const key = element.getAttribute('data-i18n-placeholder');
            const translation = this.getNestedValue(data, key);
            if (translation) {
                element.setAttribute('placeholder', translation);
            }
        });

        // Update form language field
        const languageField = document.getElementById('form-language');
        if (languageField) {
            languageField.value = language;
        }

        // Update HTML lang attribute
        document.documentElement.setAttribute('lang', language);
    }

    getNestedValue(obj, path) {
        return path.split('.').reduce((current, key) => {
            return current && current[key] !== undefined ? current[key] : null;
        }, obj);
    }

    updateLanguageIcon() {
        const flag = this.flagMap[this.currentLanguage] || '🌐';
        if (this.currentLanguageIcon) {
            this.currentLanguageIcon.textContent = flag;
        }
        if (this.mobileCurrentLanguageIcon) {
            this.mobileCurrentLanguageIcon.textContent = flag;
        }
    }
}

// Theme Management
class ThemeManager {
    constructor() {
        this.currentTheme = localStorage.getItem('theme') || 'dark';
        this.themeToggle = document.getElementById('theme-toggle');
        this.themeIcon = document.getElementById('theme-icon');
        this.mobileThemeToggle = document.getElementById('mobile-theme-toggle');
        this.mobileThemeIcon = document.getElementById('mobile-theme-icon');
        this.init();
    }

    init() {
        this.applyTheme(this.currentTheme);
        if (this.themeToggle) {
            this.themeToggle.addEventListener('click', () => this.toggleTheme());
        }
        if (this.mobileThemeToggle) {
            this.mobileThemeToggle.addEventListener('click', () => this.toggleTheme());
        }
        this.updateThemeIcon();
    }

    toggleTheme() {
        this.currentTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        this.applyTheme(this.currentTheme);
        this.updateThemeIcon();
        localStorage.setItem('theme', this.currentTheme);
    }

    applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
    }

    updateThemeIcon() {
        const icon = this.currentTheme === 'light' ? 'fas fa-moon' : 'fas fa-sun';
        if (this.themeIcon) {
            this.themeIcon.className = icon;
        }
        if (this.mobileThemeIcon) {
            this.mobileThemeIcon.className = icon;
        }
    }
}

// Smooth Scrolling Navigation
class NavigationManager {
    constructor() {
        this.navLinks = document.querySelectorAll('a[href^="#"]');
        this.init();
    }

    init() {
        this.navLinks.forEach(link => {
            link.addEventListener('click', (e) => this.handleNavClick(e));
        });
    }

    handleNavClick(e) {
        e.preventDefault();
        const targetId = e.target.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
            const headerOffset = 80;
            const elementPosition = targetElement.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    }
}

// Intersection Observer for Animations
class AnimationManager {
    constructor() {
        this.animatedElements = document.querySelectorAll('.bg-white, .text-center');
        this.init();
    }

    init() {
        const options = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-fade-in-up');
                    this.observer.unobserve(entry.target);
                }
            });
        }, options);

        this.animatedElements.forEach(element => {
            this.observer.observe(element);
        });
    }
}

// Form Handling
class FormManager {
    constructor() {
        this.contactForm = document.getElementById('contact-form');
        this.init();
    }

    init() {
        if (this.contactForm) {
            this.contactForm.addEventListener('submit', (e) => this.handleSubmit(e));
        }
    }

    async handleSubmit(e) {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(this.contactForm);
        const data = Object.fromEntries(formData);
        
        // Update language field before submission
        this.updateLanguageField();
        
        // Simple validation
        if (!this.validateForm(data)) {
            return;
        }

        // Show loading state
        const submitBtn = this.contactForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        const sendingText = this.getTranslatedErrorMessage('contact.form.sending') || 'Sending...';
        submitBtn.textContent = sendingText;
        submitBtn.disabled = true;

        try {
            // Submit to Formspree
            const response = await fetch(this.contactForm.action, {
                method: 'POST',
                body: new FormData(this.contactForm),
                headers: {
                    'Accept': 'application/json'
                }
            });

            if (response.ok) {
                this.showSuccess();
                this.contactForm.reset();
            } else {
                const errorData = await response.json();
                this.handleFormspreeErrors(errorData);
            }
        } catch (error) {
            console.error('Form submission error:', error);
            this.showError('Network error. Please try again.');
        } finally {
            // Reset button state
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
            submitBtn.classList.remove('loading');
        }
    }

    updateLanguageField() {
        const languageField = document.getElementById('form-language');
        if (languageField) {
            const currentLanguage = localStorage.getItem('language') || 'en';
            languageField.value = currentLanguage;
        }
    }

    handleFormspreeErrors(errorData) {
        if (errorData.errors) {
            // Handle field-specific errors
            for (const error of errorData.errors) {
                if (error.field && error.message) {
                    this.showError(`${error.field}: ${error.message}`);
                } else {
                    this.showError(error.message || 'Form submission failed');
                }
            }
        } else {
            this.showError('Form submission failed. Please try again.');
        }
    }

    validateForm(data) {
        const requiredFields = ['name', 'email', 'subject'];
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        for (const field of requiredFields) {
            if (!data[field] || data[field].trim() === '') {
                const errorMessage = this.getTranslatedErrorMessage('contact.form.error_required', field);
                this.showError(`${field.charAt(0).toUpperCase() + field.slice(1)}${errorMessage}`);
                return false;
            }
        }

        if (!emailRegex.test(data.email)) {
            const emailErrorMessage = this.getTranslatedErrorMessage('contact.form.error_email');
            this.showError(emailErrorMessage);
            return false;
        }

        return true;
    }

    getTranslatedErrorMessage(key, field = '') {
        const currentLanguage = localStorage.getItem('language') || 'en';
        
        // Try to get translated message
        if (window.languageManager && window.languageManager.languageData[currentLanguage]) {
            const translated = window.languageManager.getNestedValue(
                window.languageManager.languageData[currentLanguage], 
                key
            );
            if (translated) return translated;
        }
        
        // Fallback messages
        const fallbacks = {
            'contact.form.error_required': ' is required',
            'contact.form.error_email': 'Please enter a valid email address',
            'contact.form.sending': 'Sending...'
        };
        
        return fallbacks[key] || 'Error occurred';
    }

    showSuccess() {
        const alert = document.createElement('div');
        alert.className = 'alert alert-success fixed top-4 right-4 w-auto z-50';
        
        // Get current language for success message
        const currentLanguage = localStorage.getItem('language') || 'en';
        let successMessage = 'Message sent successfully! We\'ll get back to you soon.';
        
        // Try to get translated message
        if (window.languageManager && window.languageManager.languageData[currentLanguage]) {
            const translated = window.languageManager.getNestedValue(
                window.languageManager.languageData[currentLanguage], 
                'contact.form.success'
            );
            if (translated) successMessage = translated;
        }
        
        alert.innerHTML = `
            <i class="fas fa-check-circle"></i>
            <span>${successMessage}</span>
        `;
        document.body.appendChild(alert);
        
        setTimeout(() => {
            alert.remove();
        }, 5000);
    }

    showError(message) {
        const alert = document.createElement('div');
        alert.className = 'alert alert-error fixed top-4 right-4 w-auto z-50';
        alert.innerHTML = `
            <i class="fas fa-exclamation-circle"></i>
            <span>${message}</span>
        `;
        document.body.appendChild(alert);
        
        setTimeout(() => {
            alert.remove();
        }, 5000);
    }
}

// Mobile Menu Manager
class MobileMenuManager {
    constructor() {
        this.menuButton = document.getElementById('mobile-menu-button');
        this.mobileMenu = document.getElementById('mobile-menu');
        this.init();
    }

    init() {
        if (this.menuButton && this.mobileMenu) {
            this.menuButton.addEventListener('click', () => this.toggleMenu());
            
            // Close menu when clicking on links
            const menuLinks = this.mobileMenu.querySelectorAll('a');
            menuLinks.forEach(link => {
                link.addEventListener('click', () => {
                    this.closeMenu();
                });
            });
        }
    }

    toggleMenu() {
        this.mobileMenu.classList.toggle('show');
        this.mobileMenu.classList.toggle('hidden');
    }

    closeMenu() {
        this.mobileMenu.classList.add('hidden');
        this.mobileMenu.classList.remove('show');
    }
}

// Performance Monitoring
class PerformanceManager {
    constructor() {
        this.init();
    }

    init() {
        // Lazy load images
        this.lazyLoadImages();
        
        // Preload critical resources
        this.preloadCriticalResources();
    }

    lazyLoadImages() {
        const images = document.querySelectorAll('img[data-src]');
        
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });

        images.forEach(img => imageObserver.observe(img));
    }

    preloadCriticalResources() {
        const criticalResources = [
            'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css'
        ];

        criticalResources.forEach(url => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.href = url;
            link.as = 'style';
            document.head.appendChild(link);
        });
    }
}

// Accessibility Manager
class AccessibilityManager {
    constructor() {
        this.init();
    }

    init() {
        // Add keyboard navigation support
        this.addKeyboardNavigation();
        
        // Add focus management
        this.addFocusManagement();
        
        // Add screen reader support
        this.addScreenReaderSupport();
    }

    addKeyboardNavigation() {
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                document.body.classList.add('keyboard-nav');
            }
        });

        document.addEventListener('mousedown', () => {
            document.body.classList.remove('keyboard-nav');
        });
    }

    addFocusManagement() {
        const focusableElements = 'a, button, input, textarea, select, [tabindex]:not([tabindex="-1"])';
        
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                const activeElement = document.activeElement;
                if (activeElement && activeElement.blur) {
                    activeElement.blur();
                }
            }
        });
    }

    addScreenReaderSupport() {
        // Add ARIA labels for interactive elements
        const buttons = document.querySelectorAll('button:not([aria-label])');
        buttons.forEach(button => {
            if (!button.textContent.trim()) {
                button.setAttribute('aria-label', 'Button');
            }
        });

        // Add skip link for keyboard users
        const skipLink = document.createElement('a');
        skipLink.href = '#main-content';
        skipLink.textContent = 'Skip to main content';
        skipLink.className = 'sr-only focus:not-sr-only focus:absolute focus:top-0 focus:left-0 bg-primary text-primary-content p-2 z-50';
        document.body.insertBefore(skipLink, document.body.firstChild);

        // Add main content identifier
        const mainContent = document.querySelector('main') || document.querySelector('.hero');
        if (mainContent) {
            mainContent.id = 'main-content';
        }
    }
}

// Navbar Scroll Manager
class NavbarScrollManager {
    constructor() {
        this.navbar = document.getElementById('navbar');
        this.init();
    }

    init() {
        if (this.navbar) {
            window.addEventListener('scroll', () => this.handleScroll());
        }
    }

    handleScroll() {
        if (window.scrollY > 50) {
            this.navbar.classList.add('scrolled');
        } else {
            this.navbar.classList.remove('scrolled');
        }
    }
}

// Initialize all managers when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize language manager first and make it globally available
    window.languageManager = new LanguageManager();
    new ThemeManager();
    new NavigationManager();
    new AnimationManager();
    new FormManager();
    new MobileMenuManager();
    new NavbarScrollManager();
    new PerformanceManager();
    new AccessibilityManager();
});

// Service Worker Registration (for PWA capabilities)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registered: ', registration);
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}

// Error Handling
window.addEventListener('error', (e) => {
    console.error('Global error:', e.error);
    // In production, you might want to send this to an error tracking service
});

window.addEventListener('unhandledrejection', (e) => {
    console.error('Unhandled promise rejection:', e.reason);
    // In production, you might want to send this to an error tracking service
});

// Analytics (placeholder for future implementation)
class AnalyticsManager {
    constructor() {
        this.init();
    }

    init() {
        // Initialize analytics tracking
        this.trackPageView();
        this.trackInteractions();
    }

    trackPageView() {
        // Track page view
        console.log('Page view tracked');
    }

    trackInteractions() {
        // Track button clicks
        document.addEventListener('click', (e) => {
            if (e.target.matches('.btn')) {
                console.log('Button clicked:', e.target.textContent);
            }
        });

        // Track form submissions
        document.addEventListener('submit', (e) => {
            console.log('Form submitted:', e.target.id || 'unknown form');
        });
    }
}

// Initialize analytics
// new AnalyticsManager();