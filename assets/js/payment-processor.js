/**
 * Enhanced Payment Integration Module
 * Handles Stripe, PayPal, and local Saudi payment methods
 */

class PaymentProcessor {
    constructor() {
        this.stripe = null;
        this.elements = null;
        this.cardElement = null;
        this.isStripeReady = false;
        this.isPayPalReady = false;
        
        this.init();
    }
    
    async init() {
        await this.initializeStripe();
        await this.initializePayPal();
        this.setupLocalPayments();
    }
    
    async initializeStripe() {
        try {
            // Load Stripe if not already loaded
            if (!window.Stripe) {
                await this.loadScript('https://js.stripe.com/v3/');
            }
            
            // Initialize with publishable key (demo key for development)
            this.stripe = Stripe(this.getStripePublishableKey());
            this.elements = this.stripe.elements({
                appearance: {
                    theme: 'stripe',
                    variables: {
                        colorPrimary: '#2563eb',
                        colorBackground: '#ffffff',
                        colorText: '#1f2937',
                        colorDanger: '#ef4444',
                        fontFamily: 'Inter, system-ui, sans-serif',
                        spacingUnit: '4px',
                        borderRadius: '8px'
                    }
                }
            });
            
            this.isStripeReady = true;
            console.log('Stripe initialized successfully');
        } catch (error) {
            console.error('Stripe initialization failed:', error);
        }
    }
    
    async initializePayPal() {
        try {
            // PayPal SDK should be loaded via script tag in HTML
            if (window.paypal) {
                this.isPayPalReady = true;
                console.log('PayPal SDK ready');
            }
        } catch (error) {
            console.error('PayPal initialization failed:', error);
        }
    }
    
    getStripePublishableKey() {
        // Return appropriate key based on environment
        if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
            return 'pk_test_51234567890abcdef'; // Demo test key
        }
        return 'pk_live_your_actual_live_key_here'; // Replace with actual live key
    }
    
    async loadScript(src) {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = src;
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
        });
    }
    
    setupLocalPayments() {
        // Setup Saudi local payment methods
        this.localPaymentMethods = {
            mada: {
                name: 'مدى - mada',
                icon: '💳',
                processor: this.processMadaPayment.bind(this)
            },
            stcpay: {
                name: 'STC Pay',
                icon: '📱',
                processor: this.processSTCPayment.bind(this)
            },
            sadad: {
                name: 'سداد - SADAD',
                icon: '🏛️',
                processor: this.processSadadPayment.bind(this)
            }
        };
    }
    
    async processStripePayment(planDetails, customerInfo) {
        if (!this.isStripeReady) {
            throw new Error('Stripe is not initialized');
        }
        
        try {
            // Create payment intent on your backend
            const response = await fetch('/api/create-payment-intent', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    amount: Math.round(parseFloat(planDetails.price) * 100), // Convert to cents
                    currency: 'sar',
                    metadata: {
                        plan_id: planDetails.id,
                        plan_name: planDetails.name,
                        customer_email: customerInfo.email
                    }
                })
            });
            
            const { client_secret } = await response.json();
            
            // Confirm payment with Stripe
            const result = await this.stripe.confirmCardPayment(client_secret, {
                payment_method: {
                    card: this.cardElement,
                    billing_details: {
                        name: customerInfo.name,
                        email: customerInfo.email,
                        address: {
                            line1: customerInfo.address,
                            city: customerInfo.city,
                            country: 'SA'
                        }
                    }
                }
            });
            
            if (result.error) {
                throw new Error(result.error.message);
            }
            
            return {
                success: true,
                payment_intent: result.paymentIntent,
                transaction_id: result.paymentIntent.id
            };
            
        } catch (error) {
            console.error('Stripe payment failed:', error);
            throw error;
        }
    }
    
    async processPayPalPayment(planDetails) {
        if (!this.isPayPalReady) {
            throw new Error('PayPal is not initialized');
        }
        
        return new Promise((resolve, reject) => {
            window.paypal.Buttons({
                createOrder: (data, actions) => {
                    return actions.order.create({
                        purchase_units: [{
                            amount: {
                                value: planDetails.price,
                                currency_code: 'USD' // PayPal doesn't support SAR directly
                            },
                            description: planDetails.name
                        }]
                    });
                },
                onApprove: async (data, actions) => {
                    try {
                        const details = await actions.order.capture();
                        resolve({
                            success: true,
                            transaction_id: details.id,
                            payment_details: details
                        });
                    } catch (error) {
                        reject(error);
                    }
                },
                onError: (error) => {
                    reject(error);
                }
            }).render('#paypal-button-container');
        });
    }
    
    async processMadaPayment(planDetails, customerInfo) {
        // Integrate with mada payment gateway
        // This would typically redirect to the mada payment page
        try {
            const response = await fetch('/api/mada/create-payment', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    amount: planDetails.price,
                    currency: 'SAR',
                    customer: customerInfo,
                    return_url: window.location.origin + '/payment-success',
                    cancel_url: window.location.origin + '/payment-cancel'
                })
            });
            
            const data = await response.json();
            
            if (data.payment_url) {
                // Redirect to mada payment page
                window.location.href = data.payment_url;
            }
            
            return data;
        } catch (error) {
            console.error('mada payment failed:', error);
            throw error;
        }
    }
    
    async processSTCPayment(planDetails, customerInfo) {
        // Integrate with STC Pay
        try {
            const response = await fetch('/api/stcpay/create-payment', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    amount: planDetails.price,
                    currency: 'SAR',
                    customer: customerInfo,
                    phone: customerInfo.phone // STC Pay requires phone number
                })
            });
            
            const data = await response.json();
            
            if (data.payment_url) {
                window.location.href = data.payment_url;
            }
            
            return data;
        } catch (error) {
            console.error('STC Pay payment failed:', error);
            throw error;
        }
    }
    
    async processSadadPayment(planDetails, customerInfo) {
        // Integrate with SADAD
        try {
            const response = await fetch('/api/sadad/create-bill', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    amount: planDetails.price,
                    currency: 'SAR',
                    customer: customerInfo,
                    bill_description: planDetails.name
                })
            });
            
            const data = await response.json();
            
            if (data.bill_number) {
                // Show bill number for SADAD payment
                this.showSadadBill(data.bill_number, planDetails.price);
            }
            
            return data;
        } catch (error) {
            console.error('SADAD payment failed:', error);
            throw error;
        }
    }
    
    showSadadBill(billNumber, amount) {
        const modal = document.createElement('div');
        modal.className = 'modal active';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3>SADAD Bill Generated</h3>
                    <button class="modal-close">&times;</button>
                </div>
                <div class="modal-body">
                    <div class="sadad-bill-info">
                        <h4>Bill Number: ${billNumber}</h4>
                        <p>Amount: SAR ${amount}</p>
                        <p>Please visit any SADAD partner or use the SADAD app to complete the payment.</p>
                        <div class="qr-code">
                            <!-- QR code would be generated here -->
                            <p>QR Code for mobile payment</p>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Close modal functionality
        modal.querySelector('.modal-close').addEventListener('click', () => {
            document.body.removeChild(modal);
        });
    }
    
    // Utility method to validate payment data
    validatePaymentData(planDetails, customerInfo) {
        const errors = [];
        
        if (!planDetails || !planDetails.price) {
            errors.push('Invalid plan details');
        }
        
        if (!customerInfo || !customerInfo.email) {
            errors.push('Customer email is required');
        }
        
        if (!customerInfo.name) {
            errors.push('Customer name is required');
        }
        
        return errors;
    }
    
    // Format currency for display
    formatCurrency(amount, currency = 'SAR') {
        return new Intl.NumberFormat('ar-SA', {
            style: 'currency',
            currency: currency
        }).format(amount);
    }
    
    // Calculate VAT (15% in Saudi Arabia)
    calculateVAT(amount) {
        return amount * 0.15;
    }
    
    // Calculate total with VAT
    calculateTotal(amount) {
        return amount + this.calculateVAT(amount);
    }
}

// Export for use in main.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PaymentProcessor;
} else {
    window.PaymentProcessor = PaymentProcessor;
}
