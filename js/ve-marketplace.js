/**
 * Virtual Enterprise Marketplace Integration
 * 
 * This module handles integration with VE Marketplace for transaction processing.
 * Configure your VE Marketplace credentials and endpoints below.
 */

const VEMarketplace = {
    // Configuration - Loaded from AppConfig (see js/config.js)
    config: null,

    /**
     * Get configuration, loading from AppConfig if available
     */
    getConfig: function() {
        if (this.config) return this.config;
        
        // Try to use AppConfig if available, otherwise use defaults
        if (typeof AppConfig !== 'undefined') {
            this.config = AppConfig.veMarketplace;
        } else {
            this.config = {
                apiEndpoint: 'https://hub.veinternational.org/api',
                firmId: 'production_firm_id',
                apiKey: 'production_api_key',
                environment: 'production'
            };
        }
        return this.config;
    },

    /**
     * Initialize the VE Marketplace integration
     */
    init: function() {
        this.loadOrderData();
    },

    /**
     * Load order data from localStorage or URL parameters
     */
    loadOrderData: function() {
        // Check if order data was passed from customize page
        const orderData = localStorage.getItem('ve_order_data');
        if (orderData) {
            try {
                const order = JSON.parse(orderData);
                this.populateOrderSummary(order);
            } catch (e) {
                // Error parsing order data
            }
        }
    },

    /**
     * Populate order summary with product details
     */
    populateOrderSummary: function(order) {
        // Update order display with actual order data
        // You can update the DOM here with actual order details
        // Example: document.getElementById('item-details').innerHTML = ...
    },

    /**
     * Create a transaction request to VE Marketplace
     */
    createTransaction: async function(orderData) {
        const config = this.getConfig();
        const transactionPayload = {
            firm_id: config.firmId,
            transaction_type: 'sale',
            amount: orderData.total,
            currency: 'USD',
            customer: {
                first_name: orderData.customer.firstName,
                last_name: orderData.customer.lastName,
                email: orderData.customer.email,
                phone: orderData.customer.phone
            },
            shipping_address: {
                street: orderData.shipping.address,
                city: orderData.shipping.city,
                state: orderData.shipping.state,
                postal_code: orderData.shipping.zip,
                country: orderData.shipping.country
            },
            items: orderData.items.map(item => ({
                product_id: item.id,
                name: item.name,
                quantity: item.quantity,
                price: item.price,
                customizations: item.customizations
            })),
            payment_method: orderData.paymentMethod,
            metadata: {
                order_date: new Date().toISOString(),
                source: 'piercelens_website'
            }
        };

        try {
            const response = await fetch(`${config.apiEndpoint}/transactions`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${config.apiKey}`,
                    'X-Firm-ID': config.firmId
                },
                body: JSON.stringify(transactionPayload)
            });

            if (!response.ok) {
                throw new Error(`VE Marketplace API error: ${response.status}`);
            }

            const result = await response.json();
            return {
                success: true,
                transaction_id: result.transaction_id,
                status: result.status,
                data: result
            };

        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    },

    /**
     * Process the order and create VE Marketplace transaction
     */
    processOrder: async function(formData) {
        // Validate form data
        if (!this.validateOrderData(formData)) {
            return {
                success: false,
                error: 'Invalid order data'
            };
        }

        // Show loading state
        this.showLoading(true);

        // Prepare order data
        const orderData = {
            total: parseFloat(document.querySelector('.total-row.final strong').textContent.replace('$', '').replace(',', '')),
            customer: {
                firstName: formData.firstName,
                lastName: formData.lastName,
                email: formData.email,
                phone: formData.phone
            },
            shipping: {
                address: formData.address,
                city: formData.city,
                state: formData.state,
                zip: formData.zip,
                country: formData.country
            },
            items: this.getOrderItems(),
            paymentMethod: formData.paymentMethod
        };

        // Create transaction with VE Marketplace
        const result = await this.createTransaction(orderData);

        this.showLoading(false);

        if (result.success) {
            // Store transaction ID
            localStorage.setItem('ve_transaction_id', result.transaction_id);
            
            // Redirect to confirmation page
            this.showSuccessMessage(result);
            
            // Clear order data
            localStorage.removeItem('ve_order_data');
            
            return result;
        } else {
            this.showErrorMessage(result.error);
            return result;
        }
    },

    /**
     * Validate order data before submission
     */
    validateOrderData: function(formData) {
        const requiredFields = ['firstName', 'lastName', 'email', 'phone', 'address', 'city', 'state', 'zip', 'country'];
        
        for (const field of requiredFields) {
            if (!formData[field] || formData[field].trim() === '') {
                return false;
            }
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            return false;
        }

        return true;
    },

    /**
     * Get order items from the page
     */
    getOrderItems: function() {
        const items = [];
        document.querySelectorAll('.order-item').forEach(item => {
            const name = item.querySelector('.item-details h3').textContent;
            const price = parseFloat(item.querySelector('.item-price').textContent.replace('$', '').replace(',', ''));
            const customizations = [];
            
            item.querySelectorAll('.item-details p').forEach(detail => {
                customizations.push(detail.textContent);
            });

            items.push({
                id: 'pl-001', // Product ID
                name: name,
                quantity: 1,
                price: price,
                customizations: customizations
            });
        });

        return items;
    },

    /**
     * Show loading state during transaction processing
     */
    showLoading: function(isLoading) {
        const button = document.querySelector('.place-order-btn');
        if (isLoading) {
            button.disabled = true;
            button.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Processing...';
        } else {
            button.disabled = false;
            button.innerHTML = 'Place Order';
        }
    },

    /**
     * Generate and print store-style receipt
     */
    printReceipt: function(orderData, result) {
        const receiptWindow = window.open('', 'PRINT', 'height=600,width=400');
        
        const receiptHTML = `
            <!DOCTYPE html>
            <html>
            <head>
                <title>Receipt - ${result.transaction_id}</title>
                <style>
                    @media print {
                        body { margin: 0; }
                        @page { margin: 0; }
                    }
                    body {
                        font-family: 'Courier New', monospace;
                        width: 302px;
                        margin: 0 auto;
                        padding: 20px 10px;
                        font-size: 12px;
                        line-height: 1.4;
                        color: #000;
                        background: white;
                    }
                    .center { text-align: center; }
                    .bold { font-weight: bold; }
                    .large { font-size: 16px; }
                    .divider { 
                        border-top: 1px dashed #000; 
                        margin: 10px 0; 
                    }
                    .double-divider { 
                        border-top: 2px solid #000; 
                        margin: 10px 0; 
                    }
                    .row { 
                        display: flex; 
                        justify-content: space-between; 
                        margin: 3px 0;
                    }
                    .item-row {
                        margin: 8px 0;
                    }
                    .item-name {
                        font-weight: bold;
                        margin-bottom: 2px;
                    }
                    .item-details {
                        font-size: 10px;
                        margin-left: 10px;
                        color: #333;
                    }
                    .total-section {
                        margin-top: 15px;
                    }
                    .grand-total {
                        font-size: 14px;
                        font-weight: bold;
                        margin-top: 5px;
                    }
                </style>
            </head>
            <body>
                <div class="center large bold">
                    PIERCELENS
                </div>
                <div class="center">
                    Professional Camera Systems
                </div>
                <div class="center" style="margin-top: 5px; font-size: 10px;">
                    www.piercelens.com
                </div>
                
                <div class="divider"></div>
                
                <div class="center" style="margin: 10px 0;">
                    ${new Date().toLocaleDateString('en-US', { 
                        weekday: 'short', 
                        year: 'numeric', 
                        month: 'short', 
                        day: 'numeric' 
                    })}
                </div>
                <div class="center">
                    ${new Date().toLocaleTimeString('en-US')}
                </div>
                
                <div class="divider"></div>
                
                <div style="margin: 10px 0;">
                    <div class="bold">Transaction ID:</div>
                    <div>${result.transaction_id}</div>
                </div>
                
                <div style="margin: 10px 0;">
                    <div class="bold">Customer:</div>
                    <div>${orderData.customer.firstName} ${orderData.customer.lastName}</div>
                    <div style="font-size: 10px;">${orderData.customer.email}</div>
                </div>
                
                <div class="double-divider"></div>
                
                <div class="bold" style="margin-bottom: 10px;">ITEMS PURCHASED</div>
                
                ${orderData.items.map(item => `
                    <div class="item-row">
                        <div class="item-name">${item.name}</div>
                        ${item.customizations.map(custom => `
                            <div class="item-details">• ${custom}</div>
                        `).join('')}
                        <div class="row" style="margin-top: 5px;">
                            <span>Qty: ${item.quantity}</span>
                            <span class="bold">$${item.price.toFixed(2)}</span>
                        </div>
                    </div>
                `).join('')}
                
                <div class="divider"></div>
                
                <div class="total-section">
                    <div class="row">
                        <span>Subtotal:</span>
                        <span>$${(orderData.total - 170).toFixed(2)}</span>
                    </div>
                    <div class="row">
                        <span>Shipping:</span>
                        <span>$25.00</span>
                    </div>
                    <div class="row">
                        <span>Tax:</span>
                        <span>$145.00</span>
                    </div>
                </div>
                
                <div class="double-divider"></div>
                
                <div class="row grand-total">
                    <span>TOTAL:</span>
                    <span>$${orderData.total.toFixed(2)}</span>
                </div>
                
                <div class="double-divider"></div>
                
                <div style="margin: 15px 0;">
                    <div class="bold">US BANK NETWORK DEBIT</div>
                    <div style="margin-top: 5px;">
                        Name: ${orderData.payment.cardName}
                    </div>
                    <div style="margin-top: 3px;">
                        Account: ${orderData.payment.cardNumber.replace(/\d(?=\d{4})/g, '*')}
                    </div>
                </div>
                
                <div class=\"divider\"></div>
                
                <div class="center" style="margin-top: 15px; font-size: 10px;">
                    <div class="bold">Thank you for your purchase!</div>
                    <div style="margin-top: 5px;">
                        Questions? Contact us at<br>
                        support@piercelens.com
                    </div>
                </div>
                
                <div class="center" style="margin-top: 15px; font-size: 10px;">
                    <div>Virtual Enterprise Transaction</div>
                    <div>This is a simulated purchase</div>
                </div>
                
                <script>
                    window.onload = function() {
                        window.print();
                        window.onafterprint = function() {
                            window.close();
                        };
                    };
                </script>
            </body>
            </html>
        `;
        
        receiptWindow.document.write(receiptHTML);
        receiptWindow.document.close();
    },

    /**
     * Show cashier confirmation screen with transaction details
     */
    showCashierConfirmation: function(orderData, result) {
        const cashierScreen = `
            <div id="cashier-overlay" style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; 
                        background: rgba(0,0,0,0.95); z-index: 9999; overflow-y: auto;">
                <div style="max-width: 800px; margin: 40px auto; 
                            background: linear-gradient(135deg, #1a1a1a 0%, #222222 100%); 
                            border: 3px solid #00BFFF; border-radius: 20px; padding: 50px;">
                    
                    <!-- Header -->
                    <div style="text-align: center; margin-bottom: 40px; padding-bottom: 30px; 
                                border-bottom: 2px solid rgba(0, 191, 255, 0.3);">
                        <i class="fa-solid fa-cash-register" style="color: #00BFFF; font-size: 48px; margin-bottom: 15px;"></i>
                        <h1 style="color: white; font-size: 32px; margin: 15px 0; font-weight: 700;">
                            Cashier Confirmation
                        </h1>
                        <p style="color: #00BFFF; font-size: 16px; font-weight: 600; letter-spacing: 2px;">
                            TRANSACTION ID: ${result.transaction_id}
                        </p>
                    </div>

                    <!-- Customer Information -->
                    <div style="margin-bottom: 35px;">
                        <h2 style="color: #00BFFF; font-size: 20px; margin-bottom: 20px; 
                                   padding-bottom: 10px; border-bottom: 1px solid rgba(0, 191, 255, 0.2);">
                            <i class="fa-solid fa-user"></i> Customer Information
                        </h2>
                        <div style="display: grid; grid-template-columns: 150px 1fr; gap: 15px; 
                                    font-size: 16px; color: white;">
                            <div style="color: #aaa; font-weight: 600;">Name:</div>
                            <div style="font-size: 20px; font-weight: 700;">${orderData.customer.firstName} ${orderData.customer.lastName}</div>
                            
                            <div style="color: #aaa; font-weight: 600;">Email:</div>
                            <div style="font-size: 18px;">${orderData.customer.email}</div>
                            
                            <div style="color: #aaa; font-weight: 600;">Phone:</div>
                            <div style="font-size: 18px;">${orderData.customer.phone}</div>
                        </div>
                    </div>

                    <!-- US Bank Network Debit Card Information -->
                    <div style="margin-bottom: 35px; padding: 25px; 
                                background: rgba(0, 191, 255, 0.05); 
                                border: 2px solid rgba(0, 191, 255, 0.2); 
                                border-radius: 12px;">
                        <h2 style="color: #00BFFF; font-size: 20px; margin-bottom: 20px;">
                            <i class="fa-solid fa-credit-card"></i> US Bank Network Debit Card
                        </h2>
                        <div style="display: grid; grid-template-columns: 150px 1fr; gap: 15px; 
                                    font-size: 16px; color: white;">
                            <div style="color: #aaa; font-weight: 600;">Cardholder:</div>
                            <div style="font-size: 20px; font-weight: 700;">${orderData.payment.cardName || 'N/A'}</div>
                            
                            <div style="color: #aaa; font-weight: 600;">Account Number:</div>
                            <div style="font-size: 20px; font-weight: 700; letter-spacing: 2px;">
                                ${orderData.payment.cardNumber || 'N/A'}
                            </div>
                        </div>
                    </div>

                    <!-- Order Summary -->
                    <div style="margin-bottom: 35px;">
                        <h2 style="color: #00BFFF; font-size: 20px; margin-bottom: 20px; 
                                   padding-bottom: 10px; border-bottom: 1px solid rgba(0, 191, 255, 0.2);">
                            <i class="fa-solid fa-shopping-cart"></i> Order Details
                        </h2>
                        ${orderData.items.map(item => `
                            <div style="margin-bottom: 15px; padding: 15px; 
                                        background: rgba(255,255,255,0.03); border-radius: 8px;">
                                <div style="color: white; font-size: 18px; font-weight: 700; margin-bottom: 8px;">
                                    ${item.name}
                                </div>
                                <div style="color: #aaa; font-size: 14px;">
                                    ${item.customizations.join(' • ')}
                                </div>
                                <div style="color: #00BFFF; font-size: 20px; font-weight: 700; margin-top: 10px;">
                                    $${item.price.toFixed(2)}
                                </div>
                            </div>
                        `).join('')}
                    </div>

                    <!-- Total Amount -->
                    <div style="background: linear-gradient(135deg, rgba(0, 191, 255, 0.15) 0%, rgba(0, 191, 255, 0.05) 100%); 
                                padding: 25px; border-radius: 12px; margin-bottom: 30px; 
                                border: 2px solid #00BFFF;">
                        <div style="display: flex; justify-content: space-between; align-items: center;">
                            <div style="color: white; font-size: 24px; font-weight: 700;">
                                TOTAL AMOUNT
                            </div>
                            <div style="color: #00BFFF; font-size: 36px; font-weight: 700;">
                                $${orderData.total.toFixed(2)}
                            </div>
                        </div>
                    </div>

                    <!-- Action Buttons -->
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
                        <button onclick="VEMarketplace.printReceipt(${JSON.stringify(orderData).replace(/"/g, '&quot;')}, ${JSON.stringify(result).replace(/"/g, '&quot;')})" 
                                style="padding: 18px; background: rgba(0, 191, 255, 0.2); 
                                       color: #00BFFF; border: 2px solid #00BFFF; border-radius: 10px; 
                                       font-size: 16px; font-weight: 700; cursor: pointer; 
                                       transition: all 0.3s ease;"
                                onmouseover="this.style.background='rgba(0, 191, 255, 0.3)'"
                                onmouseout="this.style.background='rgba(0, 191, 255, 0.2)'">
                            <i class="fa-solid fa-print"></i> Print Receipt
                        </button>
                        <button onclick="document.getElementById('cashier-overlay').remove(); VEMarketplace.showSuccessMessage({transaction_id: '${result.transaction_id}'})" 
                                style="padding: 18px; background: #00BFFF; color: black; 
                                       border: none; border-radius: 10px; font-size: 16px; 
                                       font-weight: 700; cursor: pointer; transition: all 0.3s ease;"
                                onmouseover="this.style.background='#00d7ff'; this.style.boxShadow='0 0 20px rgba(0, 191, 255, 0.5)'"
                                onmouseout="this.style.background='#00BFFF'; this.style.boxShadow='none'">
                            <i class="fa-solid fa-check"></i> Confirm & Continue
                        </button>
                    </div>

                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', cashierScreen);
    },

    /**
     * Show success message after cashier confirmation
     */
    showSuccessMessage: function(result) {
        const message = `
            <div style="position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); 
                        background: linear-gradient(135deg, #1a1a1a 0%, #222222 100%); 
                        border: 2px solid #00BFFF; padding: 40px; border-radius: 15px; 
                        text-align: center; z-index: 10000; max-width: 500px;">
                <i class="fa-solid fa-check-circle" style="color: #00ff88; font-size: 64px; margin-bottom: 20px;"></i>
                <h2 style="color: white; margin: 20px 0;">Order Placed Successfully!</h2>
                <p style="color: #aaa; margin: 15px 0;">Transaction ID: ${result.transaction_id}</p>
                <p style="color: #aaa; margin: 15px 0;">A confirmation email has been sent to your address.</p>
                <button onclick="window.location.href='../index.html'" 
                        style="margin-top: 30px; padding: 15px 40px; background: #00BFFF; 
                               color: black; border: none; border-radius: 8px; font-weight: 700; 
                               cursor: pointer;">Return to Home</button>
            </div>
            <div style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; 
                        background: rgba(0,0,0,0.8); z-index: 9999;"></div>
        `;
        document.body.insertAdjacentHTML('beforeend', message);
    },

    /**
     * Show error message if transaction fails
     */
    showErrorMessage: function(errorMsg) {
        alert(`Transaction failed: ${errorMsg}\n\nPlease check your information and try again, or contact support.`);
    },

    /**
     * Demo mode - simulate VE Marketplace transaction for testing
     */
    demoTransaction: function(orderData) {
        return new Promise((resolve) => {
            // Simulate API delay
            setTimeout(() => {
                resolve({
                    success: true,
                    transaction_id: 'VE-' + Date.now(),
                    status: 'completed',
                    data: {
                        message: 'Demo transaction successful',
                        timestamp: new Date().toISOString()
                    }
                });
            }, 2000);
        });
    }
};

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = VEMarketplace;
}

