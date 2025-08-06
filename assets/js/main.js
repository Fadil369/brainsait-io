/**
 * BrainSAIT Main JavaScript
 * Handles language switching, navigation, modals, and form interactions
 */

class BrainSAIT {
    constructor() {
        this.currentLanguage = 'en';
        this.isRTL = false;
        this.mobileMenuOpen = false;
        this.paymentModal = null;
        this.loadingOverlay = null;
        
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.setupLanguageToggle();
        this.setupMobileMenu();
        this.setupModals();
        this.setupSmoothScrolling();
        this.setupFormValidation();
        this.setupPaymentHandlers();
        this.setupAccessibility();
        this.loadUserPreferences();
    }
    
    /**
     * Set up all event listeners
     */
    setupEventListeners() {
        // Language toggle buttons
        document.querySelectorAll('.lang-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.switchLanguage(e.target.dataset.lang));
        });
        
        // Mobile menu toggle
        const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
        if (mobileMenuBtn) {
            mobileMenuBtn.addEventListener('click', () => this.toggleMobileMenu());
        }
        
        // Navigation links
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => this.handleNavClick(e));
        });
        
        // Purchase buttons
        document.querySelectorAll('.purchase-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.handlePurchaseClick(e));
        });
        
        // Modal close buttons
        document.querySelectorAll('.modal-close').forEach(btn => {
            btn.addEventListener('click', (e) => this.closeModal(e.target.closest('.modal')));
        });
        
        // Contact form
        const contactForm = document.querySelector('.contact-form');
        if (contactForm) {
            contactForm.addEventListener('submit', (e) => this.handleContactSubmit(e));
        }
        
        // Payment options
        document.querySelectorAll('.payment-option').forEach(option => {
            option.addEventListener('click', (e) => this.handlePaymentOption(e));
        });
        
        // Keyboard navigation
        document.addEventListener('keydown', (e) => this.handleKeydown(e));
        
        // Click outside modal to close
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                this.closeModal(e.target);
            }
        });
        
        // Window resize
        window.addEventListener('resize', () => this.handleResize());
        
        // Page visibility change
        document.addEventListener('visibilitychange', () => this.handleVisibilityChange());
    }
    
    /**
     * Language switching functionality
     */
    setupLanguageToggle() {
        const rtlLink = document.getElementById('rtl-styles');
        this.rtlStylesheet = rtlLink;
    }
    
    switchLanguage(lang) {
        if (lang === this.currentLanguage) return;
        
        this.currentLanguage = lang;
        this.isRTL = lang === 'ar';
        
        // Update language buttons
        document.querySelectorAll('.lang-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.lang === lang);
        });
        
        // Update document attributes
        document.documentElement.lang = lang;
        document.documentElement.dir = this.isRTL ? 'rtl' : 'ltr';
        
        // Enable/disable RTL stylesheet
        if (this.rtlStylesheet) {
            this.rtlStylesheet.disabled = !this.isRTL;
        }
        
        // Update all text content
        this.updateTextContent();
        
        // Update page title
        document.title = this.getText('BrainSAIT - Healthcare Technology Solutions', 'برين سايت - حلول تكنولوجيا الرعاية الصحية');
        
        // Save preference
        localStorage.setItem('preferred-language', lang);
        
        // Announce language change to screen readers
        this.announceToScreenReader(
            this.getText('Language changed to English', 'تم تغيير اللغة إلى العربية')
        );
    }
    
    /**
     * Update all text content based on current language
     */
    updateTextContent() {
        document.querySelectorAll('[data-en][data-ar]').forEach(element => {
            const englishText = element.dataset.en;
            const arabicText = element.dataset.ar;
            element.textContent = this.isRTL ? arabicText : englishText;
        });
        
        // Update form labels and placeholders
        this.updateFormText();
        
        // Update ARIA labels
        this.updateAriaLabels();
    }
    
    /**
     * Update form text and placeholders
     */
    updateFormText() {
        const formTexts = {
            'name': { en: 'Name', ar: 'الاسم' },
            'email': { en: 'Email', ar: 'البريد الإلكتروني' },
            'subject': { en: 'Subject', ar: 'الموضوع' },
            'message': { en: 'Message', ar: 'الرسالة' }
        };
        
        Object.keys(formTexts).forEach(key => {
            const element = document.getElementById(key);
            if (element) {
                element.placeholder = this.getText(formTexts[key].en, formTexts[key].ar);
            }
        });
    }
    
    /**
     * Update ARIA labels for accessibility
     */
    updateAriaLabels() {
        const ariaLabels = {
            'Skip to main content': 'انتقل إلى المحتوى الرئيسي',
            'Toggle navigation menu': 'تبديل قائمة التنقل',
            'Switch to English': 'التبديل إلى الإنجليزية',
            'Switch to Arabic': 'التبديل إلى العربية',
            'Close payment modal': 'إغلاق نافذة الدفع',
            'Loading': 'جاري التحميل'
        };
        
        document.querySelectorAll('[aria-label]').forEach(element => {
            const currentLabel = element.getAttribute('aria-label');
            if (ariaLabels[currentLabel]) {
                element.setAttribute('aria-label', 
                    this.getText(currentLabel, ariaLabels[currentLabel])
                );
            }
        });
    }
    
    /**
     * Get text based on current language
     */
    getText(english, arabic) {
        return this.isRTL ? arabic : english;
    }
    
    /**
     * Mobile menu functionality
     */
    setupMobileMenu() {
        this.mobileMenu = document.querySelector('.nav-menu');
        this.mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    }
    
    toggleMobileMenu() {
        this.mobileMenuOpen = !this.mobileMenuOpen;
        
        if (this.mobileMenu) {
            this.mobileMenu.classList.toggle('active', this.mobileMenuOpen);
        }
        
        if (this.mobileMenuBtn) {
            this.mobileMenuBtn.setAttribute('aria-expanded', this.mobileMenuOpen);
            
            // Animate hamburger lines
            const lines = this.mobileMenuBtn.querySelectorAll('.hamburger-line');
            lines.forEach((line, index) => {
                if (this.mobileMenuOpen) {
                    if (index === 0) line.style.transform = 'rotate(45deg) translate(5px, 5px)';
                    else if (index === 1) line.style.opacity = '0';
                    else if (index === 2) line.style.transform = 'rotate(-45deg) translate(7px, -6px)';
                } else {
                    line.style.transform = '';
                    line.style.opacity = '';
                }
            });
        }
        
        // Prevent body scroll when menu is open
        document.body.style.overflow = this.mobileMenuOpen ? 'hidden' : '';
    }
    
    /**
     * Handle navigation link clicks
     */
    handleNavClick(e) {
        e.preventDefault();
        const href = e.target.getAttribute('href');
        
        if (href.startsWith('#')) {
            this.scrollToSection(href.substring(1));
            
            // Close mobile menu if open
            if (this.mobileMenuOpen) {
                this.toggleMobileMenu();
            }
        }
    }
    
    /**
     * Smooth scrolling functionality
     */
    setupSmoothScrolling() {
        // Already handled in CSS with scroll-behavior: smooth
        // But we can add custom easing here if needed
    }
    
    scrollToSection(sectionId) {
        const section = document.getElementById(sectionId);
        if (section) {
            const headerHeight = document.querySelector('.header').offsetHeight;
            const targetPosition = section.offsetTop - headerHeight - 20;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
            
            // Update URL without triggering navigation
            history.pushState(null, null, `#${sectionId}`);
            
            // Focus the section for accessibility
            section.focus();
        }
    }
    
    /**
     * Modal functionality
     */
    setupModals() {
        this.paymentModal = document.getElementById('payment-modal');
        this.loadingOverlay = document.getElementById('loading-overlay');
    }
    
    showModal(modal) {
        if (modal) {
            modal.classList.add('active');
            modal.setAttribute('aria-hidden', 'false');
            
            // Focus the first focusable element
            const firstFocusable = modal.querySelector('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
            if (firstFocusable) {
                firstFocusable.focus();
            }
            
            // Prevent body scroll
            document.body.style.overflow = 'hidden';
        }
    }
    
    closeModal(modal) {
        if (modal) {
            modal.classList.remove('active');
            modal.setAttribute('aria-hidden', 'true');
            
            // Restore body scroll
            document.body.style.overflow = '';
            
            // Return focus to trigger element if available
            const triggerElement = modal.triggerElement;
            if (triggerElement) {
                triggerElement.focus();
                modal.triggerElement = null;
            }
        }
    }
    
    /**
     * Handle purchase button clicks
     */
    handlePurchaseClick(e) {
        e.preventDefault();
        const plan = e.target.dataset.plan;
        
        if (plan === 'enterprise') {
            // Scroll to contact section for enterprise plan
            this.scrollToSection('contact');
            return;
        }
        
        // Store trigger element for focus restoration
        this.paymentModal.triggerElement = e.target;
        
        // Update modal with plan information
        this.updatePaymentModal(plan);
        
        // Show payment modal
        this.showModal(this.paymentModal);
    }
    
    /**
     * Update payment modal with plan information
     */
    updatePaymentModal(plan) {
        const planInfo = {
            'basic': {
                name: { en: 'Basic Plan', ar: 'الخطة الأساسية' },
                price: 'SAR 299/month'
            },
            'professional': {
                name: { en: 'Professional Plan', ar: 'الخطة المهنية' },
                price: 'SAR 599/month'
            }
        };
        
        const info = planInfo[plan];
        if (info) {
            const planNameElement = this.paymentModal.querySelector('.plan-name');
            const planPriceElement = this.paymentModal.querySelector('.plan-price');
            
            if (planNameElement) {
                planNameElement.textContent = this.getText(info.name.en, info.name.ar);
            }
            
            if (planPriceElement) {
                planPriceElement.textContent = info.price;
            }
        }
    }
    
    /**
     * Handle payment option selection
     */
    handlePaymentOption(e) {
        e.preventDefault();
        const method = e.currentTarget.dataset.method;
        
        this.showLoading();
        
        // Simulate payment processing
        setTimeout(() => {
            this.hideLoading();
            this.processPayment(method);
        }, 2000);
    }
    
    /**
     * Process payment with selected method
     */
    processPayment(method) {
        // In a real implementation, this would integrate with actual payment providers
        if (method === 'stripe') {
            this.handleStripePayment();
        } else if (method === 'paypal') {
            this.handlePayPalPayment();
        }
    }
    
    /**
     * Handle Stripe payment integration
     */
    handleStripePayment() {
        // This is a placeholder for Stripe integration
        // In production, you would use Stripe.js
        console.log('Processing Stripe payment...');
        
        // Simulate successful payment
        this.showPaymentSuccess();
    }
    
    /**
     * Handle PayPal payment integration
     */
    handlePayPalPayment() {
        // This is a placeholder for PayPal integration
        // In production, you would use PayPal SDK
        console.log('Processing PayPal payment...');
        
        // Simulate successful payment
        this.showPaymentSuccess();
    }
    
    /**
     * Show payment success message
     */
    showPaymentSuccess() {
        this.closeModal(this.paymentModal);
        
        const message = this.getText(
            'Payment successful! Thank you for your purchase.',
            'تم الدفع بنجاح! شكراً لك على الشراء.'
        );
        
        this.showNotification(message, 'success');
    }
    
    /**
     * Show loading overlay
     */
    showLoading() {
        if (this.loadingOverlay) {
            this.loadingOverlay.classList.add('active');
            this.loadingOverlay.setAttribute('aria-hidden', 'false');
        }
    }
    
    /**
     * Hide loading overlay
     */
    hideLoading() {
        if (this.loadingOverlay) {
            this.loadingOverlay.classList.remove('active');
            this.loadingOverlay.setAttribute('aria-hidden', 'true');
        }
    }
    
    /**
     * Form validation and submission
     */
    setupFormValidation() {
        this.validationRules = {
            name: {
                required: true,
                minLength: 2,
                pattern: /^[a-zA-Z\s\u0600-\u06FF]+$/
            },
            email: {
                required: true,
                pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
            },
            subject: {
                required: true,
                minLength: 5
            },
            message: {
                required: true,
                minLength: 10
            }
        };
    }
    
    /**
     * Handle contact form submission
     */
    handleContactSubmit(e) {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const isValid = this.validateForm(formData);
        
        if (isValid) {
            this.submitContactForm(formData);
        }
    }
    
    /**
     * Validate form data
     */
    validateForm(formData) {
        let isValid = true;
        
        for (const [fieldName, rules] of Object.entries(this.validationRules)) {
            const value = formData.get(fieldName);
            const error = this.validateField(fieldName, value, rules);
            
            if (error) {
                this.showFieldError(fieldName, error);
                isValid = false;
            } else {
                this.clearFieldError(fieldName);
            }
        }
        
        return isValid;
    }
    
    /**
     * Validate individual field
     */
    validateField(fieldName, value, rules) {
        const messages = {
            required: { en: 'This field is required', ar: 'هذا الحقل مطلوب' },
            minLength: { en: 'Too short', ar: 'قصير جداً' },
            pattern: { en: 'Invalid format', ar: 'تنسيق غير صحيح' }
        };
        
        if (rules.required && (!value || value.trim() === '')) {
            return this.getText(messages.required.en, messages.required.ar);
        }
        
        if (rules.minLength && value.length < rules.minLength) {
            return this.getText(
                `${messages.minLength.en} (minimum ${rules.minLength} characters)`,
                `${messages.minLength.ar} (الحد الأدنى ${rules.minLength} أحرف)`
            );
        }
        
        if (rules.pattern && !rules.pattern.test(value)) {
            return this.getText(messages.pattern.en, messages.pattern.ar);
        }
        
        return null;
    }
    
    /**
     * Show field error
     */
    showFieldError(fieldName, error) {
        const errorElement = document.getElementById(`${fieldName}-error`);
        const fieldElement = document.getElementById(fieldName);
        
        if (errorElement) {
            errorElement.textContent = error;
        }
        
        if (fieldElement) {
            fieldElement.setAttribute('aria-invalid', 'true');
            fieldElement.classList.add('error');
        }
    }
    
    /**
     * Clear field error
     */
    clearFieldError(fieldName) {
        const errorElement = document.getElementById(`${fieldName}-error`);
        const fieldElement = document.getElementById(fieldName);
        
        if (errorElement) {
            errorElement.textContent = '';
        }
        
        if (fieldElement) {
            fieldElement.setAttribute('aria-invalid', 'false');
            fieldElement.classList.remove('error');
        }
    }
    
    /**
     * Submit contact form
     */
    submitContactForm(formData) {
        this.showLoading();
        
        // Simulate form submission
        setTimeout(() => {
            this.hideLoading();
            
            const message = this.getText(
                'Thank you for your message! We will get back to you soon.',
                'شكراً لك على رسالتك! سنتواصل معك قريباً.'
            );
            
            this.showNotification(message, 'success');
            
            // Reset form
            document.querySelector('.contact-form').reset();
        }, 2000);
    }
    
    /**
     * Show notification
     */
    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        notification.setAttribute('role', 'alert');
        
        // Add styles
        Object.assign(notification.style, {
            position: 'fixed',
            top: '20px',
            right: this.isRTL ? 'auto' : '20px',
            left: this.isRTL ? '20px' : 'auto',
            padding: '15px 20px',
            backgroundColor: type === 'success' ? '#10b981' : '#2563eb',
            color: 'white',
            borderRadius: '8px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            zIndex: '9999',
            maxWidth: '400px',
            transform: 'translateY(-100%)',
            opacity: '0',
            transition: 'all 0.3s ease'
        });
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateY(0)';
            notification.style.opacity = '1';
        }, 100);
        
        // Remove after 5 seconds
        setTimeout(() => {
            notification.style.transform = 'translateY(-100%)';
            notification.style.opacity = '0';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 5000);
    }
    
    /**
     * Accessibility enhancements
     */
    setupAccessibility() {
        // Ensure proper focus management
        this.setupFocusManagement();
        
        // Setup keyboard navigation
        this.setupKeyboardNavigation();
        
        // Setup screen reader announcements
        this.setupScreenReaderSupport();
    }
    
    /**
     * Setup focus management
     */
    setupFocusManagement() {
        // Skip to main content functionality is already in HTML
        
        // Focus management for modals handled in showModal/closeModal
        
        // Ensure form validation focuses first error
        document.addEventListener('invalid', (e) => {
            e.target.focus();
        }, true);
    }
    
    /**
     * Setup keyboard navigation
     */
    setupKeyboardNavigation() {
        // This is handled by the global keydown handler
    }
    
    /**
     * Handle keyboard events
     */
    handleKeydown(e) {
        // Escape key closes modals
        if (e.key === 'Escape') {
            const activeModal = document.querySelector('.modal.active');
            if (activeModal) {
                this.closeModal(activeModal);
            } else if (this.mobileMenuOpen) {
                this.toggleMobileMenu();
            }
        }
        
        // Enter key activates buttons
        if (e.key === 'Enter' && e.target.classList.contains('purchase-btn')) {
            e.target.click();
        }
    }
    
    /**
     * Setup screen reader support
     */
    setupScreenReaderSupport() {
        // Create live region for announcements
        this.liveRegion = document.createElement('div');
        this.liveRegion.setAttribute('aria-live', 'polite');
        this.liveRegion.setAttribute('aria-atomic', 'true');
        this.liveRegion.className = 'sr-only';
        document.body.appendChild(this.liveRegion);
    }
    
    /**
     * Announce message to screen readers
     */
    announceToScreenReader(message) {
        if (this.liveRegion) {
            this.liveRegion.textContent = message;
            
            // Clear after announcement
            setTimeout(() => {
                this.liveRegion.textContent = '';
            }, 1000);
        }
    }
    
    /**
     * Payment handlers setup
     */
    setupPaymentHandlers() {
        // Initialize payment providers when needed
        this.stripeInitialized = false;
        this.paypalInitialized = false;
    }
    
    /**
     * Handle window resize
     */
    handleResize() {
        // Close mobile menu on large screens
        if (window.innerWidth > 768 && this.mobileMenuOpen) {
            this.toggleMobileMenu();
        }
    }
    
    /**
     * Handle page visibility change
     */
    handleVisibilityChange() {
        if (document.visibilityState === 'visible') {
            // Page became visible
            this.updateDocumentTitle();
        }
    }
    
    /**
     * Update document title
     */
    updateDocumentTitle() {
        document.title = this.getText(
            'BrainSAIT - Healthcare Technology Solutions',
            'برين سايت - حلول تكنولوجيا الرعاية الصحية'
        );
    }
    
    /**
     * Load user preferences
     */
    loadUserPreferences() {
        // Load saved language preference
        const savedLanguage = localStorage.getItem('preferred-language');
        if (savedLanguage && savedLanguage !== this.currentLanguage) {
            this.switchLanguage(savedLanguage);
        }
        
        // Detect browser language if no preference saved
        if (!savedLanguage) {
            const browserLanguage = navigator.language.startsWith('ar') ? 'ar' : 'en';
            if (browserLanguage !== this.currentLanguage) {
                this.switchLanguage(browserLanguage);
            }
        }
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.brainSAIT = new BrainSAIT();
});

// Performance optimization: Lazy load images
document.addEventListener('DOMContentLoaded', () => {
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    observer.unobserve(img);
                }
            });
        });

        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }
});

// Service Worker registration for PWA capabilities (optional)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('ServiceWorker registration successful');
            })
            .catch(error => {
                console.log('ServiceWorker registration failed');
            });
    });
}