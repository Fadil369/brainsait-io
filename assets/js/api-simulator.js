/**
 * API Endpoint Simulation for Payment Processing
 * This file simulates backend endpoints for payment processing
 * In production, these would be actual server endpoints
 */

class APISimulator {
    constructor() {
        this.baseURL = window.location.origin;
        this.simulateLatency = true;
        this.latencyMs = 1500;
    }
    
    async simulateRequest(endpoint, options = {}) {
        if (this.simulateLatency) {
            await this.delay(this.latencyMs);
        }
        
        // Simulate different endpoints
        switch (endpoint) {
            case '/api/create-payment-intent':
                return this.createStripePaymentIntent(options.body);
            
            case '/api/mada/create-payment':
                return this.createMadaPayment(options.body);
            
            case '/api/stcpay/create-payment':
                return this.createSTCPayment(options.body);
            
            case '/api/sadad/create-bill':
                return this.createSadadBill(options.body);
            
            case '/api/subscription/create':
                return this.createSubscription(options.body);
            
            case '/api/demo/grant-access':
                return this.grantDemoAccess(options.body);
            
            default:
                throw new Error('Endpoint not found');
        }
    }
    
    async delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    
    createStripePaymentIntent(data) {
        const parsedData = JSON.parse(data);
        
        // Simulate Stripe PaymentIntent creation
        return {
            success: true,
            client_secret: `pi_${this.generateId()}_secret_${this.generateId()}`,
            payment_intent_id: `pi_${this.generateId()}`,
            amount: parsedData.amount,
            currency: parsedData.currency
        };
    }
    
    createMadaPayment(data) {
        const parsedData = JSON.parse(data);
        
        // Simulate mada payment creation
        return {
            success: true,
            payment_id: `mada_${this.generateId()}`,
            payment_url: `https://payment.mada.com.sa/pay/${this.generateId()}`,
            amount: parsedData.amount,
            currency: parsedData.currency,
            expires_at: new Date(Date.now() + 15 * 60 * 1000).toISOString()
        };
    }
    
    createSTCPayment(data) {
        const parsedData = JSON.parse(data);
        
        // Simulate STC Pay payment creation
        return {
            success: true,
            payment_id: `stc_${this.generateId()}`,
            payment_url: `stcpay://pay?amount=${parsedData.amount}&reference=${this.generateId()}`,
            qr_code: this.generateQRCode(),
            amount: parsedData.amount,
            currency: parsedData.currency
        };
    }
    
    createSadadBill(data) {
        const parsedData = JSON.parse(data);
        
        // Simulate SADAD bill creation
        return {
            success: true,
            bill_number: this.generateBillNumber(),
            amount: parsedData.amount,
            currency: parsedData.currency,
            expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
            qr_code: this.generateQRCode()
        };
    }
    
    createSubscription(data) {
        const parsedData = JSON.parse(data);
        
        return {
            success: true,
            subscription_id: `sub_${this.generateId()}`,
            status: 'active',
            current_period_start: new Date().toISOString(),
            current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
            plan: parsedData.plan_id
        };
    }
    
    grantDemoAccess(data) {
        const parsedData = JSON.parse(data);
        
        return {
            success: true,
            demo_access_token: `demo_${this.generateId()}`,
            expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
            product_url: parsedData.product_url,
            access_instructions: 'Your demo access has been granted. Use the provided token to access the product.'
        };
    }
    
    generateId() {
        return Math.random().toString(36).substr(2, 9);
    }
    
    generateBillNumber() {
        return Math.floor(Math.random() * 9000000000) + 1000000000;
    }
    
    generateQRCode() {
        // In production, this would generate an actual QR code
        return `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"><rect width="100" height="100" fill="white"/><text x="50" y="50" text-anchor="middle" fill="black">QR</text></svg>`;
    }
}

// Intercept fetch requests and simulate API responses
const originalFetch = window.fetch;
const apiSimulator = new APISimulator();

window.fetch = async function(url, options = {}) {
    // Check if it's an API endpoint we should simulate
    if (url.startsWith('/api/')) {
        try {
            const response = await apiSimulator.simulateRequest(url, options);
            
            return new Response(JSON.stringify(response), {
                status: 200,
                statusText: 'OK',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        } catch (error) {
            return new Response(JSON.stringify({
                error: error.message,
                success: false
            }), {
                status: 400,
                statusText: 'Bad Request',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        }
    }
    
    // For non-API requests, use original fetch
    return originalFetch.apply(this, arguments);
};

// Export for use in other modules
window.APISimulator = APISimulator;
