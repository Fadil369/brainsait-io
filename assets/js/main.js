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
        this.setupBillingToggle();
        this.setupAccessibility();
        this.loadUserPreferences();
        this.checkDemoAccess();
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
        
        // Demo trial buttons
        document.querySelectorAll('.demo-trial-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.handleDemoTrialClick(e));
        });
        
        // Demo buttons (for services)
        document.querySelectorAll('.demo-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.handleDemoClick(e));
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
        
        // Billing toggle
        const billingToggle = document.getElementById('billing-period');
        if (billingToggle) {
            billingToggle.addEventListener('change', (e) => this.handleBillingToggle(e));
        }
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
    
    /**
     * Open modal
     */
    openModal(modal) {
        if (modal) {
            modal.classList.add('active');
            modal.setAttribute('aria-hidden', 'false');
            
            // Prevent body scroll
            document.body.style.overflow = 'hidden';
            
            // Store the trigger element for focus management
            modal.triggerElement = document.activeElement;
            
            // Focus the modal
            modal.focus();
        }
    }
    
    /**
     * Close modal
     */
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
        const button = e.target;
        const plan = button.dataset.plan;
        
        if (plan === 'enterprise' || plan === 'ai-enterprise' || plan === 'analytics-professional') {
            // Scroll to contact section for enterprise plans
            this.scrollToSection('contact');
            return;
        }
        
        // Get plan details from button attributes
        const currentPrice = this.isAnnualBilling ? button.dataset.annualPrice : button.dataset.monthlyPrice;
        const period = this.isAnnualBilling ? 'annual' : 'monthly';
        
        // Store selected plan details
        this.selectedPlan = {
            id: plan,
            name: this.getPlanDisplayName(plan),
            price: currentPrice,
            period: period,
            originalButton: button
        };
        
        // Store trigger element for focus restoration
        this.paymentModal.triggerElement = button;
        
        // Update modal with plan information
        this.updatePaymentModal(this.selectedPlan);
        
        // Show payment modal
        this.showModal(this.paymentModal);
    }
    
    /**
     * Get display name for plan
     */
    getPlanDisplayName(planId) {
        const planNames = {
            'basic': this.getText('Basic Plan', 'الخطة الأساسية'),
            'professional': this.getText('Professional Plan', 'الخطة المهنية'),
            'ai-starter': this.getText('AI Diagnosis Starter', 'التشخيص الذكي - المبتدئ'),
            'ai-professional': this.getText('AI Diagnosis Professional', 'التشخيص الذكي - المهني'),
            'portal-basic': this.getText('Patient Portal Basic', 'بوابة المرضى - أساسي'),
            'portal-professional': this.getText('Patient Portal Professional', 'بوابة المرضى - مهني'),
            'analytics-standard': this.getText('Healthcare Analytics Standard', 'تحليلات الرعاية الصحية - قياسي')
        };
        
        return planNames[planId] || planId;
    }
    
    /**
     * Update payment modal with plan information
     */
    updatePaymentModal(planDetails) {
        const planNameElement = this.paymentModal.querySelector('.plan-name');
        const planPriceElement = this.paymentModal.querySelector('.plan-price');
        
        if (planNameElement) {
            planNameElement.textContent = planDetails.name;
        }
        
        if (planPriceElement) {
            const periodText = planDetails.period === 'annual' ? 
                this.getText('/year', '/سنة') : 
                this.getText('/month', '/شهر');
            planPriceElement.textContent = `SAR ${planDetails.price}${periodText}`;
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
     * Handle demo trial button click
     */
    handleDemoTrialClick(e) {
        e.preventDefault();
        const button = e.currentTarget;
        const product = button.dataset.product;
        const url = button.dataset.url;
        
        this.showLoading();
        
        // Simulate demo access generation
        setTimeout(() => {
            this.hideLoading();
            this.grantDemoAccess(product, url);
        }, 1500);
    }
    
    /**
     * Handle demo button click for services
     */
    handleDemoClick(e) {
        e.preventDefault();
        const button = e.currentTarget;
        const service = button.dataset.service;
        
        this.showDemoRequestModal(service);
    }
    
    /**
     * Grant 1-day demo access
     */
    grantDemoAccess(product, url) {
        // Store demo access in localStorage with 24-hour expiry
        const demoAccess = {
            product: product,
            url: url,
            grantedAt: Date.now(),
            expiresAt: Date.now() + (24 * 60 * 60 * 1000) // 24 hours
        };
        
        // Store in localStorage
        localStorage.setItem(`demo_${product}`, JSON.stringify(demoAccess));
        
        // Show success message
        const message = this.getText(
            `Demo access granted! You have 24 hours to explore ${product}. Click below to access.`,
            `تم منح وصول التجربة! لديك 24 ساعة لاستكشاف ${product}. انقر أدناه للوصول.`
        );
        
        this.showDemoAccessModal(product, url, message);
    }
    
    /**
     * Show demo access modal
     */
    showDemoAccessModal(product, url, message) {
        // Create demo access modal
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3 data-en="Demo Access Granted" data-ar="تم منح وصول التجربة">Demo Access Granted</h3>
                    <button class="modal-close" aria-label="Close demo modal">&times;</button>
                </div>
                <div class="modal-body">
                    <div class="demo-success">
                        <div class="success-icon">🎉</div>
                        <p>${message}</p>
                        <div class="demo-timer">
                            <span class="timer-label" data-en="Time remaining:" data-ar="الوقت المتبقي:">Time remaining:</span>
                            <span class="timer-display">23:59:59</span>
                        </div>
                        <div class="demo-actions">
                            <a href="${url}" target="_blank" rel="noopener noreferrer" class="btn btn-primary" data-en="Access Demo" data-ar="الوصول للتجربة">Access Demo</a>
                            <button class="btn btn-secondary modal-close" data-en="Close" data-ar="إغلاق">Close</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        this.openModal(modal);
        
        // Start countdown timer
        this.startDemoTimer(modal.querySelector('.timer-display'), product);
        
        // Add close event
        modal.querySelector('.modal-close').addEventListener('click', () => {
            this.closeModal(modal);
            document.body.removeChild(modal);
        });
    }
    
    /**
     * Start demo countdown timer
     */
    startDemoTimer(timerElement, product) {
        const updateTimer = () => {
            const demoData = localStorage.getItem(`demo_${product}`);
            if (!demoData) return;
            
            const demo = JSON.parse(demoData);
            const now = Date.now();
            const remaining = demo.expiresAt - now;
            
            if (remaining <= 0) {
                // Demo expired
                localStorage.removeItem(`demo_${product}`);
                timerElement.textContent = this.getText('Expired', 'منتهي الصلاحية');
                return;
            }
            
            // Calculate hours, minutes, seconds
            const hours = Math.floor(remaining / (1000 * 60 * 60));
            const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((remaining % (1000 * 60)) / 1000);
            
            timerElement.textContent = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        };
        
        updateTimer();
        const interval = setInterval(updateTimer, 1000);
        
        // Store interval ID to clean up later
        setTimeout(() => clearInterval(interval), 24 * 60 * 60 * 1000);
    }
    
    /**
     * Show demo request modal for services
     */
    showDemoRequestModal(service) {
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3 data-en="Request Demo" data-ar="طلب عرض توضيحي">Request Demo</h3>
                    <button class="modal-close" aria-label="Close demo request modal">&times;</button>
                </div>
                <div class="modal-body">
                    <form class="demo-request-form">
                        <div class="form-group">
                            <label for="demo-name" data-en="Name" data-ar="الاسم">Name</label>
                            <input type="text" id="demo-name" name="name" required>
                        </div>
                        <div class="form-group">
                            <label for="demo-email" data-en="Email" data-ar="البريد الإلكتروني">Email</label>
                            <input type="email" id="demo-email" name="email" required>
                        </div>
                        <div class="form-group">
                            <label for="demo-company" data-en="Company" data-ar="الشركة">Company</label>
                            <input type="text" id="demo-company" name="company">
                        </div>
                        <div class="form-group">
                            <label for="demo-message" data-en="Message" data-ar="الرسالة">Message</label>
                            <textarea id="demo-message" name="message" rows="3" placeholder="Tell us about your requirements..."></textarea>
                        </div>
                        <button type="submit" class="btn btn-primary" data-en="Request Demo" data-ar="طلب عرض توضيحي">Request Demo</button>
                    </form>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        this.openModal(modal);
        
        // Handle form submission
        modal.querySelector('.demo-request-form').addEventListener('submit', (e) => {
            this.handleDemoRequest(e, service, modal);
        });
        
        // Add close event
        modal.querySelector('.modal-close').addEventListener('click', () => {
            this.closeModal(modal);
            document.body.removeChild(modal);
        });
    }
    
    /**
     * Handle demo request submission
     */
    handleDemoRequest(e, service, modal) {
        e.preventDefault();
        
        this.showLoading();
        
        // Simulate demo request processing
        setTimeout(() => {
            this.hideLoading();
            this.closeModal(modal);
            document.body.removeChild(modal);
            
            const message = this.getText(
                'Demo request submitted successfully! We will contact you within 24 hours.',
                'تم تقديم طلب العرض التوضيحي بنجاح! سنتواصل معك خلال 24 ساعة.'
            );
            
            this.showNotification(message, 'success');
        }, 2000);
    }
    
    /**
     * Check and manage demo access on page load
     */
    checkDemoAccess() {
        const demoKeys = Object.keys(localStorage).filter(key => key.startsWith('demo_'));
        
        demoKeys.forEach(key => {
            const demoData = localStorage.getItem(key);
            if (demoData) {
                const demo = JSON.parse(demoData);
                if (Date.now() > demo.expiresAt) {
                    // Demo expired, remove it
                    localStorage.removeItem(key);
                } else {
                    // Demo still active, could show indicator
                    this.showActiveDemoIndicator(demo);
                }
            }
        });
    }
    
    /**
     * Show active demo indicator
     */
    showActiveDemoIndicator(demo) {
        // Add visual indicator for active demos
        const product = demo.product;
        const button = document.querySelector(`[data-product="${product}"] .demo-trial-btn`);
        
        if (button) {
            button.textContent = this.getText('Demo Active', 'التجربة نشطة');
            button.classList.add('demo-active');
            button.onclick = () => window.open(demo.url, '_blank');
        }
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
     * Show notification message
     */
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <p>${message}</p>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // Trigger animation
        setTimeout(() => notification.classList.add('show'), 100);
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            notification.classList.add('hide');
            setTimeout(() => {
                if (document.body.contains(notification)) {
                    document.body.removeChild(notification);
                }
            }, 300);
        }, 5000);
        
        // Click to dismiss
        notification.addEventListener('click', () => {
            notification.classList.add('hide');
            setTimeout(() => {
                if (document.body.contains(notification)) {
                    document.body.removeChild(notification);
                }
            }, 300);
        });
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
     * Show notification message
     */
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <p>${message}</p>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // Trigger animation
        setTimeout(() => notification.classList.add('show'), 100);
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            notification.classList.add('hide');
            setTimeout(() => {
                if (document.body.contains(notification)) {
                    document.body.removeChild(notification);
                }
            }, 300);
        }, 5000);
        
        // Click to dismiss
        notification.addEventListener('click', () => {
            notification.classList.add('hide');
            setTimeout(() => {
                if (document.body.contains(notification)) {
                    document.body.removeChild(notification);
                }
            }, 300);
        });
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
        this.stripe = null;
        this.elements = null;
        this.cardElement = null;
        
        // Load Stripe script
        this.loadStripeScript();
    }
    
    /**
     * Load Stripe script dynamically
     */
    loadStripeScript() {
        if (window.Stripe) {
            this.initializeStripe();
            return;
        }
        
        const script = document.createElement('script');
        script.src = 'https://js.stripe.com/v3/';
        script.onload = () => this.initializeStripe();
        document.head.appendChild(script);
    }
    
    /**
     * Initialize Stripe
     */
    initializeStripe() {
        // Use demo/test key for development
        this.stripe = Stripe('pk_test_demo_key_for_development_only');
        this.stripeInitialized = true;
        this.setupStripeElements();
    }
    
    /**
     * Setup Stripe Elements
     */
    setupStripeElements() {
        if (!this.stripe) return;
        
        this.elements = this.stripe.elements({
            locale: this.currentLanguage === 'ar' ? 'ar' : 'en'
        });
        
        // Create card element
        this.cardElement = this.elements.create('card', {
            style: {
                base: {
                    fontSize: '16px',
                    color: '#424770',
                    '::placeholder': {
                        color: '#aab7c4',
                    },
                },
                invalid: {
                    color: '#9e2146',
                },
            },
        });
    }
    
    /**
     * Handle payment option selection
     */
    handlePaymentOption(event) {
        const method = event.currentTarget.dataset.method;
        const planDetails = this.getSelectedPlanDetails();
        
        this.closeModal(document.getElementById('payment-modal'));
        
        switch (method) {
            case 'stripe':
                this.handleStripePayment(planDetails);
                break;
            case 'paypal':
                this.handlePayPalPayment(planDetails);
                break;
            case 'mada':
            case 'stcpay':
            case 'sadad':
            case 'bank-transfer':
                this.handleLocalPayment(method, planDetails);
                break;
            default:
                console.error('Unknown payment method:', method);
        }
    }
    
    /**
     * Handle Stripe payment
     */
    handleStripePayment(planDetails) {
        if (!this.stripeInitialized) {
            this.showNotification('Payment system is loading, please try again.', 'warning');
            return;
        }
        
        // Update the Stripe payment modal
        this.updateStripeModal(planDetails);
        this.openModal(document.getElementById('stripe-payment-modal'));
        
        // Mount card element if not already mounted
        if (this.cardElement && !this.cardElement._mounted) {
            this.cardElement.mount('#card-element');
            this.cardElement._mounted = true;
        }
        
        // Setup form submission
        this.setupStripeFormHandler(planDetails);
    }
    
    /**
     * Update Stripe payment modal with plan details
     */
    updateStripeModal(planDetails) {
        document.getElementById('summary-plan-name').textContent = planDetails.name;
        document.getElementById('summary-amount').textContent = `SAR ${planDetails.price}`;
    }
    
    /**
     * Setup Stripe form submission handler
     */
    setupStripeFormHandler(planDetails) {
        const form = document.getElementById('stripe-payment-form');
        const submitButton = document.getElementById('submit-payment');
        
        form.onsubmit = async (event) => {
            event.preventDefault();
            this.processStripePayment(planDetails, submitButton);
        };
    }
    
    /**
     * Process Stripe payment
     */
    async processStripePayment(planDetails, submitButton) {
        this.setLoadingState(submitButton, true);
        
        try {
            // Get billing details from form
            const billingDetails = this.getBillingDetails();
            
            // For demo purposes, simulate payment processing
            await this.simulatePaymentProcessing();
            
            // In a real implementation, you would:
            // 1. Create payment intent on your server
            // 2. Confirm payment with Stripe
            // const {error, paymentIntent} = await this.stripe.confirmCardPayment(clientSecret, {
            //     payment_method: {
            //         card: this.cardElement,
            //         billing_details: billingDetails,
            //     }
            // });
            
            this.handlePaymentSuccess(planDetails, 'stripe');
            
        } catch (error) {
            this.handlePaymentError(error.message);
        } finally {
            this.setLoadingState(submitButton, false);
        }
    }
    
    /**
     * Handle PayPal payment
     */
    handlePayPalPayment(planDetails) {
        // For demo purposes, simulate PayPal redirect
        this.showNotification('Redirecting to PayPal...', 'info');
        
        setTimeout(() => {
            // In real implementation, you would redirect to PayPal
            // window.location.href = paypalCheckoutUrl;
            this.handlePaymentSuccess(planDetails, 'paypal');
        }, 2000);
    }
    
    /**
     * Handle local payment methods
     */
    handleLocalPayment(method, planDetails) {
        const methodNames = {
            'mada': 'mada Card',
            'stcpay': 'STC Pay',
            'sadad': 'SADAD',
            'bank-transfer': 'Bank Transfer'
        };
        
        const methodName = methodNames[method] || method;
        
        this.showNotification(`Redirecting to ${methodName} payment gateway...`, 'info');
        
        setTimeout(() => {
            // In real implementation, you would redirect to local payment gateway
            this.handlePaymentSuccess(planDetails, method);
        }, 2000);
    }
    
    /**
     * Get selected plan details
     */
    getSelectedPlanDetails() {
        // This would be set when opening the payment modal
        return this.selectedPlan || {
            name: 'Professional Plan',
            price: '599',
            period: 'monthly'
        };
    }
    
    /**
     * Get billing details from form
     */
    getBillingDetails() {
        return {
            name: document.getElementById('billing-name')?.value || '',
            email: document.getElementById('billing-email')?.value || '',
            address: {
                line1: document.getElementById('billing-address')?.value || '',
                city: document.getElementById('billing-city')?.value || '',
                country: 'SA',
            },
        };
    }
    
    /**
     * Simulate payment processing delay
     */
    simulatePaymentProcessing() {
        return new Promise(resolve => setTimeout(resolve, 2000));
    }
    
    /**
     * Handle successful payment
     */
    handlePaymentSuccess(planDetails, method) {
        this.closeModal(document.getElementById('stripe-payment-modal'));
        this.showNotification(
            `Payment successful! Welcome to ${planDetails.name}. You will receive a confirmation email shortly.`,
            'success'
        );
        
        // In real implementation, you would:
        // 1. Redirect to success page
        // 2. Update user account
        // 3. Send confirmation email
        
        setTimeout(() => {
            // Redirect to dashboard or success page
            console.log('Redirect to dashboard/success page');
        }, 3000);
    }
    
    /**
     * Handle payment error
     */
    handlePaymentError(errorMessage) {
        this.showNotification(`Payment failed: ${errorMessage}`, 'error');
    }
    
    /**
     * Set loading state for button
     */
    setLoadingState(button, isLoading) {
        const buttonText = button.querySelector('#button-text');
        const spinner = button.querySelector('#spinner');
        
        if (isLoading) {
            button.disabled = true;
            buttonText.style.opacity = '0';
            spinner.classList.remove('hidden');
        } else {
            button.disabled = false;
            buttonText.style.opacity = '1';
            spinner.classList.add('hidden');
        }
    }
    
    /**
     * Setup billing toggle functionality
     */
    setupBillingToggle() {
        this.isAnnualBilling = false;
    }
    
    /**
     * Handle billing period toggle
     */
    handleBillingToggle(event) {
        this.isAnnualBilling = event.target.checked;
        this.updatePriceDisplay();
    }
    
    /**
     * Update price display based on billing period
     */
    updatePriceDisplay() {
        const monthlyPrices = document.querySelectorAll('.monthly-price');
        const annualPrices = document.querySelectorAll('.annual-price');
        const monthlyPeriods = document.querySelectorAll('.monthly-period');
        const annualPeriods = document.querySelectorAll('.annual-period');
        const annualSavings = document.querySelectorAll('.annual-savings');
        
        if (this.isAnnualBilling) {
            // Show annual pricing
            monthlyPrices.forEach(el => el.classList.add('hidden'));
            annualPrices.forEach(el => el.classList.remove('hidden'));
            monthlyPeriods.forEach(el => el.classList.add('hidden'));
            annualPeriods.forEach(el => el.classList.remove('hidden'));
            annualSavings.forEach(el => el.classList.remove('hidden'));
        } else {
            // Show monthly pricing
            monthlyPrices.forEach(el => el.classList.remove('hidden'));
            annualPrices.forEach(el => el.classList.add('hidden'));
            monthlyPeriods.forEach(el => el.classList.remove('hidden'));
            annualPeriods.forEach(el => el.classList.add('hidden'));
            annualSavings.forEach(el => el.classList.add('hidden'));
        }
        
        // Update purchase button data attributes
        document.querySelectorAll('.purchase-btn').forEach(btn => {
            const plan = btn.dataset.plan;
            const monthlyPrice = btn.dataset.monthlyPrice;
            const annualPrice = btn.dataset.annualPrice;
            
            if (this.isAnnualBilling) {
                btn.dataset.currentPrice = annualPrice;
                btn.dataset.currentPeriod = 'annual';
            } else {
                btn.dataset.currentPrice = monthlyPrice;
                btn.dataset.currentPeriod = 'monthly';
            }
        });
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