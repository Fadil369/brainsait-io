/**
 * Analytics and Performance Monitoring Module
 * Tracks user interactions, performance metrics, and business events
 */

class AnalyticsManager {
    constructor() {
        this.sessionId = this.generateSessionId();
        this.userId = this.getUserId();
        this.events = [];
        this.performanceMetrics = {};
        
        this.init();
    }
    
    init() {
        this.setupPerformanceMonitoring();
        this.setupErrorTracking();
        this.setupUserInteractionTracking();
        this.trackPageView();
        
        // Send analytics data periodically
        setInterval(() => this.sendAnalytics(), 30000); // Every 30 seconds
        
        // Send on page unload
        window.addEventListener('beforeunload', () => this.sendAnalytics());
    }
    
    generateSessionId() {
        return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }
    
    getUserId() {
        let userId = localStorage.getItem('brainsait_user_id');
        if (!userId) {
            userId = 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
            localStorage.setItem('brainsait_user_id', userId);
        }
        return userId;
    }
    
    setupPerformanceMonitoring() {
        // Monitor Core Web Vitals
        if ('web-vitals' in window || this.loadWebVitals()) {
            this.measureWebVitals();
        }
        
        // Monitor navigation timing
        window.addEventListener('load', () => {
            setTimeout(() => this.collectNavigationMetrics(), 0);
        });
        
        // Monitor resource loading
        this.observeResourceTiming();
    }
    
    async loadWebVitals() {
        try {
            // Load web-vitals library dynamically
            const script = document.createElement('script');
            script.src = 'https://unpkg.com/web-vitals@3/dist/web-vitals.iife.js';
            document.head.appendChild(script);
            
            return new Promise((resolve) => {
                script.onload = () => resolve(true);
                script.onerror = () => resolve(false);
            });
        } catch (error) {
            console.warn('Failed to load web-vitals library');
            return false;
        }
    }
    
    measureWebVitals() {
        if (window.webVitals) {
            const { getCLS, getFID, getFCP, getLCP, getTTFB } = window.webVitals;
            
            getCLS((metric) => this.trackPerformanceMetric('CLS', metric));
            getFID((metric) => this.trackPerformanceMetric('FID', metric));
            getFCP((metric) => this.trackPerformanceMetric('FCP', metric));
            getLCP((metric) => this.trackPerformanceMetric('LCP', metric));
            getTTFB((metric) => this.trackPerformanceMetric('TTFB', metric));
        }
    }
    
    collectNavigationMetrics() {
        if ('performance' in window) {
            const navigation = performance.getEntriesByType('navigation')[0];
            
            this.performanceMetrics = {
                dns_lookup: navigation.domainLookupEnd - navigation.domainLookupStart,
                tcp_connect: navigation.connectEnd - navigation.connectStart,
                request_response: navigation.responseEnd - navigation.requestStart,
                dom_processing: navigation.domContentLoadedEventEnd - navigation.responseEnd,
                load_complete: navigation.loadEventEnd - navigation.navigationStart,
                page_load_time: navigation.loadEventEnd - navigation.fetchStart
            };
            
            this.trackEvent('performance', 'page_metrics', this.performanceMetrics);
        }
    }
    
    observeResourceTiming() {
        if ('PerformanceObserver' in window) {
            const observer = new PerformanceObserver((list) => {
                list.getEntries().forEach((entry) => {
                    if (entry.name.includes('.js') || entry.name.includes('.css')) {
                        this.trackEvent('performance', 'resource_timing', {
                            name: entry.name,
                            duration: entry.duration,
                            size: entry.transferSize
                        });
                    }
                });
            });
            
            observer.observe({ entryTypes: ['resource'] });
        }
    }
    
    setupErrorTracking() {
        // Track JavaScript errors
        window.addEventListener('error', (event) => {
            this.trackError('javascript_error', {
                message: event.message,
                filename: event.filename,
                lineno: event.lineno,
                colno: event.colno,
                stack: event.error?.stack
            });
        });
        
        // Track unhandled promise rejections
        window.addEventListener('unhandledrejection', (event) => {
            this.trackError('unhandled_promise_rejection', {
                reason: event.reason,
                stack: event.reason?.stack
            });
        });
    }
    
    setupUserInteractionTracking() {
        // Track button clicks
        document.addEventListener('click', (event) => {
            if (event.target.matches('button, .btn, [role="button"]')) {
                const buttonText = event.target.textContent.trim();
                const buttonId = event.target.id;
                const buttonClass = event.target.className;
                
                this.trackEvent('interaction', 'button_click', {
                    text: buttonText,
                    id: buttonId,
                    class: buttonClass,
                    x: event.clientX,
                    y: event.clientY
                });
            }
        });
        
        // Track form submissions
        document.addEventListener('submit', (event) => {
            const form = event.target;
            const formId = form.id;
            const formClass = form.className;
            
            this.trackEvent('interaction', 'form_submit', {
                id: formId,
                class: formClass,
                fields: this.getFormFields(form)
            });
        });
        
        // Track scroll depth
        this.setupScrollTracking();
        
        // Track time on page sections
        this.setupSectionVisibilityTracking();
    }
    
    setupScrollTracking() {
        let maxScroll = 0;
        const throttledScrollHandler = this.throttle(() => {
            const scrollPercent = Math.round(
                (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
            );
            
            if (scrollPercent > maxScroll) {
                maxScroll = scrollPercent;
                
                // Track scroll milestones
                if ([25, 50, 75, 90, 100].includes(scrollPercent)) {
                    this.trackEvent('engagement', 'scroll_depth', {
                        percent: scrollPercent,
                        timestamp: Date.now()
                    });
                }
            }
        }, 250);
        
        window.addEventListener('scroll', throttledScrollHandler);
    }
    
    setupSectionVisibilityTracking() {
        if ('IntersectionObserver' in window) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        const sectionId = entry.target.id;
                        const timestamp = Date.now();
                        
                        this.trackEvent('engagement', 'section_view', {
                            section: sectionId,
                            timestamp: timestamp
                        });
                        
                        // Store section entry time
                        entry.target.dataset.entryTime = timestamp;
                    } else {
                        // Calculate time spent in section
                        const entryTime = parseInt(entry.target.dataset.entryTime);
                        if (entryTime) {
                            const timeSpent = Date.now() - entryTime;
                            
                            this.trackEvent('engagement', 'section_time', {
                                section: entry.target.id,
                                time_spent: timeSpent
                            });
                        }
                    }
                });
            }, { threshold: 0.5 });
            
            // Observe all main sections
            document.querySelectorAll('section[id]').forEach((section) => {
                observer.observe(section);
            });
        }
    }
    
    trackPageView() {
        this.trackEvent('navigation', 'page_view', {
            url: window.location.href,
            title: document.title,
            referrer: document.referrer,
            user_agent: navigator.userAgent,
            screen_resolution: `${screen.width}x${screen.height}`,
            viewport_size: `${window.innerWidth}x${window.innerHeight}`,
            language: navigator.language,
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
        });
    }
    
    trackEvent(category, action, data = {}) {
        const event = {
            id: this.generateEventId(),
            session_id: this.sessionId,
            user_id: this.userId,
            timestamp: Date.now(),
            category: category,
            action: action,
            data: data,
            url: window.location.href,
            user_agent: navigator.userAgent.substr(0, 200) // Truncate for storage
        };
        
        this.events.push(event);
        
        // Send immediately for critical events
        if (['error', 'payment', 'conversion'].includes(category)) {
            this.sendAnalytics();
        }
    }
    
    trackError(type, details) {
        this.trackEvent('error', type, details);
    }
    
    trackPerformanceMetric(name, metric) {
        this.trackEvent('performance', 'web_vital', {
            name: name,
            value: metric.value,
            rating: metric.rating,
            delta: metric.delta
        });
    }
    
    trackBusinessEvent(eventType, data) {
        this.trackEvent('business', eventType, data);
    }
    
    // Business-specific tracking methods
    trackProductView(productId, productName) {
        this.trackBusinessEvent('product_view', {
            product_id: productId,
            product_name: productName
        });
    }
    
    trackAddToCart(productId, productName, price) {
        this.trackBusinessEvent('add_to_cart', {
            product_id: productId,
            product_name: productName,
            price: price
        });
    }
    
    trackPurchaseAttempt(planId, planName, price, paymentMethod) {
        this.trackBusinessEvent('purchase_attempt', {
            plan_id: planId,
            plan_name: planName,
            price: price,
            payment_method: paymentMethod
        });
    }
    
    trackPurchaseSuccess(transactionId, planId, planName, price, paymentMethod) {
        this.trackBusinessEvent('purchase_success', {
            transaction_id: transactionId,
            plan_id: planId,
            plan_name: planName,
            price: price,
            payment_method: paymentMethod
        });
    }
    
    trackDemoAccess(productId, productName) {
        this.trackBusinessEvent('demo_access', {
            product_id: productId,
            product_name: productName
        });
    }
    
    async sendAnalytics() {
        if (this.events.length === 0) return;
        
        const payload = {
            events: [...this.events],
            session_id: this.sessionId,
            user_id: this.userId,
            timestamp: Date.now()
        };
        
        try {
            // Send to analytics endpoint
            await fetch('/api/analytics/events', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });
            
            // Clear sent events
            this.events = [];
        } catch (error) {
            console.warn('Failed to send analytics:', error);
            
            // Store in localStorage as fallback
            this.storeAnalyticsLocally(payload);
        }
    }
    
    storeAnalyticsLocally(payload) {
        try {
            const stored = JSON.parse(localStorage.getItem('brainsait_analytics') || '[]');
            stored.push(payload);
            
            // Keep only last 100 events to prevent storage bloat
            if (stored.length > 100) {
                stored.splice(0, stored.length - 100);
            }
            
            localStorage.setItem('brainsait_analytics', JSON.stringify(stored));
        } catch (error) {
            console.warn('Failed to store analytics locally:', error);
        }
    }
    
    // Utility methods
    generateEventId() {
        return 'evt_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }
    
    throttle(func, delay) {
        let timeoutId;
        let lastExecTime = 0;
        
        return function (...args) {
            const currentTime = Date.now();
            
            if (currentTime - lastExecTime > delay) {
                func.apply(this, args);
                lastExecTime = currentTime;
            } else {
                clearTimeout(timeoutId);
                timeoutId = setTimeout(() => {
                    func.apply(this, args);
                    lastExecTime = Date.now();
                }, delay - (currentTime - lastExecTime));
            }
        };
    }
    
    getFormFields(form) {
        const fields = {};
        const formData = new FormData(form);
        
        for (const [key, value] of formData.entries()) {
            // Don't track sensitive data
            if (!['password', 'card', 'cvv', 'ssn'].some(sensitive => 
                key.toLowerCase().includes(sensitive))) {
                fields[key] = typeof value === 'string' ? value.substr(0, 100) : '[file]';
            }
        }
        
        return fields;
    }
}

// Initialize analytics
window.addEventListener('DOMContentLoaded', () => {
    window.analyticsManager = new AnalyticsManager();
});

// Export for external use
window.AnalyticsManager = AnalyticsManager;
