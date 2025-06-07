# AGENTS.md (Complete Stripe Endpoints Implementation)

**Last Updated:** 2025-06-07

## 🧠 Purpose

This file defines standards for AI agents and human developers to implement **ALL Stripe API endpoints** with comprehensive logging, metadata enhancement, and network fallback patterns. Focus is on creating complete, production-ready Stripe integration functions.

---

## 🎯 Core Objective: Complete Stripe API Coverage

### 📋 Required Stripe Endpoints Implementation

All AI agents must implement comprehensive functions for every major Stripe endpoint:

**Core Objects:**
- ✅ Customers (`/customers`)
- ✅ Products (`/products`) 
- ✅ Prices (`/prices`)
- ✅ Payment Intents (`/payment_intents`)
- ✅ Setup Intents (`/setup_intents`)
- ✅ Subscriptions (`/subscriptions`)
- ✅ Invoices (`/invoices`)
- ✅ Payment Methods (`/payment_methods`)

**Advanced Objects:**
- ✅ Coupons (`/coupons`)
- ✅ Promotion Codes (`/promotion_codes`)
- ✅ Tax Rates (`/tax_rates`)
- ✅ Webhook Endpoints (`/webhook_endpoints`)
- ✅ Events (`/events`)
- ✅ Charges (`/charges`)
- ✅ Refunds (`/refunds`)
- ✅ Disputes (`/disputes`)

**Business Objects:**
- ✅ Accounts (`/accounts`)
- ✅ Application Fees (`/application_fees`)
- ✅ Balance (`/balance`)
- ✅ Payouts (`/payouts`)
- ✅ Reviews (`/reviews`)

---

## 🌐 Network & HTTP Request Foundation

### ⚠️ **CRITICAL: Universal Stripe Request Handler**

Every Stripe endpoint must use this fallback-enabled request pattern:

```typescript
interface StripeRequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  body?: Record<string, any>;
  expand?: string[];
  idempotencyKey?: string;
}

const makeStripeRequest = async (
  endpoint: string, 
  options: StripeRequestOptions = {}
): Promise<any> => {
  const { method = 'GET', body, expand, idempotencyKey } = options;
  
  console.log(`🌐 Stripe API: ${method} ${endpoint}`);
  console.log(`📊 Request body:`, body);
  
  // Prepare headers
  const headers: Record<string, string> = {
    'Authorization': `Bearer ${process.env.STRIPE_SK}`,
    'Content-Type': 'application/x-www-form-urlencoded',
    'Stripe-Version': '2023-10-16'
  };
  
  if (idempotencyKey) {
    headers['Idempotency-Key'] = idempotencyKey;
  }
  
  // Prepare body with expand parameters
  let requestBody: URLSearchParams | undefined;
  if (body || expand) {
    requestBody = new URLSearchParams();
    
    if (body) {
      Object.entries(body).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          requestBody!.append(key, String(value));
        }
      });
    }
    
    if (expand) {
      expand.forEach(field => requestBody!.append('expand[]', field));
    }
  }
  
  try {
    // Primary: Try fetch
    console.log('📡 Attempting fetch...');
    const response = await fetch(`https://api.stripe.com/v1${endpoint}`, {
      method,
      headers,
      body: method !== 'GET' ? requestBody : undefined
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Stripe API Error: ${response.status} - ${JSON.stringify(errorData)}`);
    }
    
    const data = await response.json();
    console.log('✅ Fetch succeeded');
    data._requestMethod = 'fetch';
    return data;
    
  } catch (fetchError) {
    console.log('⚠️ Fetch failed, using curl fallback...');
    return await curlStripeRequest(endpoint, options, fetchError);
  }
};

const curlStripeRequest = async (
  endpoint: string, 
  options: StripeRequestOptions, 
  fetchError: Error
) => {
  const { exec } = require('child_process');
  const { promisify } = require('util');
  const execAsync = promisify(exec);
  
  console.log('🔄 Executing curl fallback...');
  
  let curlCommand = `curl -X ${options.method || 'GET'} `;
  curlCommand += `"https://api.stripe.com/v1${endpoint}" `;
  curlCommand += `-H "Authorization: Bearer ${process.env.STRIPE_SK}" `;
  curlCommand += `-H "Content-Type: application/x-www-form-urlencoded" `;
  curlCommand += `-H "Stripe-Version: 2023-10-16" `;
  
  if (options.idempotencyKey) {
    curlCommand += `-H "Idempotency-Key: ${options.idempotencyKey}" `;
  }
  
  if (options.body && options.method !== 'GET') {
    Object.entries(options.body).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        curlCommand += `-d "${key}=${encodeURIComponent(String(value))}" `;
      }
    });
  }
  
  if (options.expand) {
    options.expand.forEach(field => {
      curlCommand += `-d "expand[]=${field}" `;
    });
  }
  
  curlCommand += '-v';
  
  try {
    const { stdout, stderr } = await execAsync(curlCommand);
    console.log('✅ Curl succeeded');
    
    const jsonMatch = stdout.match(/\{.*\}/s);
    if (jsonMatch) {
      const data = JSON.parse(jsonMatch[0]);
      data._requestMethod = 'curl';
      console.log('📋 Curl response received');
      return data;
    } else {
      throw new Error('No JSON in curl response');
    }
  } catch (curlError) {
    console.error('❌ Both fetch and curl failed');
    console.error('Fetch error:', fetchError.message);
    console.error('Curl error:', curlError.message);
    throw new Error(`All methods failed. Original: ${fetchError.message}`);
  }
};
```

---

## 🏗️ Complete Stripe Endpoints Implementation

### 👥 Customer Management Endpoints

```typescript
// CREATE CUSTOMER with comprehensive metadata
const createCustomer = async (customerData: {
  name?: string;
  email?: string;
  phone?: string;
  description?: string;
  address?: object;
  metadata?: Record<string, string>;
}) => {
  console.log('👤 Creating Stripe customer...');
  
  const enhancedData = {
    ...customerData,
    metadata: {
      created_by: 'api',
      environment: process.env.NODE_ENV || 'development',
      timestamp: new Date().toISOString(),
      version: '1.0',
      ...customerData.metadata
    }
  };
  
  const customer = await makeStripeRequest('/customers', {
    method: 'POST',
    body: enhancedData,
    expand: ['default_source', 'subscriptions']
  });
  
  analyzeStripeObject(customer, 'customer');
  return customer;
};

// RETRIEVE CUSTOMER
const getCustomer = async (customerId: string) => {
  console.log(`👤 Retrieving customer: ${customerId}`);
  
  const customer = await makeStripeRequest(`/customers/${customerId}`, {
    expand: ['default_source', 'subscriptions', 'tax_info']
  });
  
  analyzeStripeObject(customer, 'customer');
  return customer;
};

// UPDATE CUSTOMER
const updateCustomer = async (customerId: string, updateData: Record<string, any>) => {
  console.log(`👤 Updating customer: ${customerId}`);
  
  const enhancedData = {
    ...updateData,
    metadata: {
      ...updateData.metadata,
      last_updated: new Date().toISOString(),
      updated_by: 'api'
    }
  };
  
  const customer = await makeStripeRequest(`/customers/${customerId}`, {
    method: 'POST',
    body: enhancedData
  });
  
  analyzeStripeObject(customer, 'customer');
  return customer;
};

// LIST CUSTOMERS
const listCustomers = async (params: {
  limit?: number;
  starting_after?: string;
  email?: string;
  created?: object;
} = {}) => {
  console.log('👥 Listing customers...');
  
  const customers = await makeStripeRequest('/customers', {
    body: params
  });
  
  console.log(`📊 Found ${customers.data.length} customers`);
  customers.data.forEach((customer: any, index: number) => {
    console.log(`Customer ${index + 1}: ${customer.id} - ${customer.email || 'No email'}`);
  });
  
  return customers;
};

// DELETE CUSTOMER
const deleteCustomer = async (customerId: string) => {
  console.log(`🗑️ Deleting customer: ${customerId}`);
  
  const result = await makeStripeRequest(`/customers/${customerId}`, {
    method: 'DELETE'
  });
  
  console.log('✅ Customer deleted:', result);
  return result;
};
```

### 🛍️ Product Management Endpoints

```typescript
// CREATE PRODUCT
const createProduct = async (productData: {
  name: string;
  description?: string;
  images?: string[];
  metadata?: Record<string, string>;
  url?: string;
  statement_descriptor?: string;
}) => {
  console.log('🛍️ Creating Stripe product...');
  
  const enhancedData = {
    ...productData,
    metadata: {
      created_by: 'api',
      category: productData.metadata?.category || 'general',
      version: '1.0',
      created_at: new Date().toISOString(),
      ...productData.metadata
    }
  };
  
  const product = await makeStripeRequest('/products', {
    method: 'POST',
    body: enhancedData
  });
  
  analyzeStripeObject(product, 'product');
  return product;
};

// RETRIEVE PRODUCT
const getProduct = async (productId: string) => {
  console.log(`🛍️ Retrieving product: ${productId}`);
  
  const product = await makeStripeRequest(`/products/${productId}`);
  analyzeStripeObject(product, 'product');
  return product;
};

// UPDATE PRODUCT
const updateProduct = async (productId: string, updateData: Record<string, any>) => {
  console.log(`🛍️ Updating product: ${productId}`);
  
  const product = await makeStripeRequest(`/products/${productId}`, {
    method: 'POST',
    body: updateData
  });
  
  analyzeStripeObject(product, 'product');
  return product;
};

// LIST PRODUCTS
const listProducts = async (params: {
  active?: boolean;
  limit?: number;
  starting_after?: string;
  url?: string;
} = {}) => {
  console.log('🛍️ Listing products...');
  
  const products = await makeStripeRequest('/products', {
    body: params
  });
  
  console.log(`📊 Found ${products.data.length} products`);
  products.data.forEach((product: any, index: number) => {
    console.log(`Product ${index + 1}: ${product.id} - ${product.name}`);
  });
  
  return products;
};

// DELETE PRODUCT
const deleteProduct = async (productId: string) => {
  console.log(`🗑️ Deleting product: ${productId}`);
  
  const result = await makeStripeRequest(`/products/${productId}`, {
    method: 'DELETE'
  });
  
  console.log('✅ Product deleted:', result);
  return result;
};
```

### 💰 Price Management Endpoints

```typescript
// CREATE PRICE
const createPrice = async (priceData: {
  currency: string;
  product?: string;
  unit_amount?: number;
  recurring?: object;
  metadata?: Record<string, string>;
  lookup_key?: string;
  transfer_lookup_key?: boolean;
}) => {
  console.log('💰 Creating Stripe price...');
  
  const enhancedData = {
    ...priceData,
    metadata: {
      created_by: 'api',
      price_type: priceData.recurring ? 'recurring' : 'one_time',
      created_at: new Date().toISOString(),
      ...priceData.metadata
    }
  };
  
  const price = await makeStripeRequest('/prices', {
    method: 'POST',
    body: enhancedData
  });
  
  analyzeStripeObject(price, 'price');
  return price;
};

// RETRIEVE PRICE
const getPrice = async (priceId: string) => {
  console.log(`💰 Retrieving price: ${priceId}`);
  
  const price = await makeStripeRequest(`/prices/${priceId}`, {
    expand: ['product']
  });
  
  analyzeStripeObject(price, 'price');
  return price;
};

// LIST PRICES
const listPrices = async (params: {
  active?: boolean;
  currency?: string;
  product?: string;
  type?: 'one_time' | 'recurring';
  limit?: number;
} = {}) => {
  console.log('💰 Listing prices...');
  
  const prices = await makeStripeRequest('/prices', {
    body: params,
    expand: ['data.product']
  });
  
  console.log(`📊 Found ${prices.data.length} prices`);
  prices.data.forEach((price: any, index: number) => {
    console.log(`Price ${index + 1}: ${price.id} - ${price.unit_amount} ${price.currency}`);
  });
  
  return prices;
};

// UPDATE PRICE
const updatePrice = async (priceId: string, updateData: Record<string, any>) => {
  console.log(`💰 Updating price: ${priceId}`);
  
  const price = await makeStripeRequest(`/prices/${priceId}`, {
    method: 'POST',
    body: updateData
  });
  
  analyzeStripeObject(price, 'price');
  return price;
};
```

### 💳 Payment Intent Endpoints

```typescript
// CREATE PAYMENT INTENT
const createPaymentIntent = async (paymentData: {
  amount: number;
  currency: string;
  customer?: string;
  payment_method?: string;
  confirmation_method?: 'automatic' | 'manual';
  confirm?: boolean;
  metadata?: Record<string, string>;
}) => {
  console.log('💳 Creating payment intent...');
  
  const enhancedData = {
    ...paymentData,
    metadata: {
      created_by: 'api',
      intent_type: 'payment',
      created_at: new Date().toISOString(),
      ...paymentData.metadata
    }
  };
  
  const paymentIntent = await makeStripeRequest('/payment_intents', {
    method: 'POST',
    body: enhancedData
  });
  
  analyzeStripeObject(paymentIntent, 'payment_intent');
  return paymentIntent;
};

// RETRIEVE PAYMENT INTENT
const getPaymentIntent = async (paymentIntentId: string) => {
  console.log(`💳 Retrieving payment intent: ${paymentIntentId}`);
  
  const paymentIntent = await makeStripeRequest(`/payment_intents/${paymentIntentId}`, {
    expand: ['customer', 'payment_method']
  });
  
  analyzeStripeObject(paymentIntent, 'payment_intent');
  return paymentIntent;
};

// CONFIRM PAYMENT INTENT
const confirmPaymentIntent = async (paymentIntentId: string, confirmData: Record<string, any> = {}) => {
  console.log(`💳 Confirming payment intent: ${paymentIntentId}`);
  
  const paymentIntent = await makeStripeRequest(`/payment_intents/${paymentIntentId}/confirm`, {
    method: 'POST',
    body: confirmData
  });
  
  analyzeStripeObject(paymentIntent, 'payment_intent');
  return paymentIntent;
};

// CANCEL PAYMENT INTENT
const cancelPaymentIntent = async (paymentIntentId: string) => {
  console.log(`❌ Canceling payment intent: ${paymentIntentId}`);
  
  const paymentIntent = await makeStripeRequest(`/payment_intents/${paymentIntentId}/cancel`, {
    method: 'POST'
  });
  
  analyzeStripeObject(paymentIntent, 'payment_intent');
  return paymentIntent;
};
```

### 🔧 Setup Intent Endpoints

```typescript
// CREATE SETUP INTENT
const createSetupIntent = async (setupData: {
  customer?: string;
  payment_method?: string;
  usage: 'off_session' | 'on_session';
  metadata?: Record<string, string>;
}) => {
  console.log('🔧 Creating setup intent...');
  
  const enhancedData = {
    ...setupData,
    metadata: {
      created_by: 'api',
      intent_type: 'setup',
      created_at: new Date().toISOString(),
      ...setupData.metadata
    }
  };
  
  const setupIntent = await makeStripeRequest('/setup_intents', {
    method: 'POST',
    body: enhancedData
  });
  
  analyzeStripeObject(setupIntent, 'setup_intent');
  return setupIntent;
};

// RETRIEVE SETUP INTENT
const getSetupIntent = async (setupIntentId: string) => {
  console.log(`🔧 Retrieving setup intent: ${setupIntentId}`);
  
  const setupIntent = await makeStripeRequest(`/setup_intents/${setupIntentId}`, {
    expand: ['customer', 'payment_method']
  });
  
  analyzeStripeObject(setupIntent, 'setup_intent');
  return setupIntent;
};

// CONFIRM SETUP INTENT
const confirmSetupIntent = async (setupIntentId: string, confirmData: Record<string, any> = {}) => {
  console.log(`🔧 Confirming setup intent: ${setupIntentId}`);
  
  const setupIntent = await makeStripeRequest(`/setup_intents/${setupIntentId}/confirm`, {
    method: 'POST',
    body: confirmData
  });
  
  analyzeStripeObject(setupIntent, 'setup_intent');
  return setupIntent;
};
```

### 🔄 Subscription Endpoints

```typescript
// CREATE SUBSCRIPTION
const createSubscription = async (subscriptionData: {
  customer: string;
  items: Array<{ price: string; quantity?: number }>;
  trial_period_days?: number;
  metadata?: Record<string, string>;
}) => {
  console.log('🔄 Creating subscription...');
  
  // Handle items array for Stripe API
  const body: Record<string, any> = {
    customer: subscriptionData.customer,
    trial_period_days: subscriptionData.trial_period_days,
    metadata: {
      created_by: 'api',
      subscription_type: 'standard',
      created_at: new Date().toISOString(),
      ...subscriptionData.metadata
    }
  };
  
  // Add items
  subscriptionData.items.forEach((item, index) => {
    body[`items[${index}][price]`] = item.price;
    if (item.quantity) {
      body[`items[${index}][quantity]`] = item.quantity;
    }
  });
  
  const subscription = await makeStripeRequest('/subscriptions', {
    method: 'POST',
    body
  });
  
  analyzeStripeObject(subscription, 'subscription');
  return subscription;
};

// RETRIEVE SUBSCRIPTION
const getSubscription = async (subscriptionId: string) => {
  console.log(`🔄 Retrieving subscription: ${subscriptionId}`);
  
  const subscription = await makeStripeRequest(`/subscriptions/${subscriptionId}`, {
    expand: ['customer', 'items.data.price.product']
  });
  
  analyzeStripeObject(subscription, 'subscription');
  return subscription;
};

// UPDATE SUBSCRIPTION
const updateSubscription = async (subscriptionId: string, updateData: Record<string, any>) => {
  console.log(`🔄 Updating subscription: ${subscriptionId}`);
  
  const subscription = await makeStripeRequest(`/subscriptions/${subscriptionId}`, {
    method: 'POST',
    body: updateData
  });
  
  analyzeStripeObject(subscription, 'subscription');
  return subscription;
};

// CANCEL SUBSCRIPTION
const cancelSubscription = async (subscriptionId: string, cancelData: {
  at_period_end?: boolean;
  invoice_now?: boolean;
  prorate?: boolean;
} = {}) => {
  console.log(`❌ Canceling subscription: ${subscriptionId}`);
  
  const subscription = await makeStripeRequest(`/subscriptions/${subscriptionId}`, {
    method: 'DELETE',
    body: cancelData
  });
  
  analyzeStripeObject(subscription, 'subscription');
  return subscription;
};
```

---

## 📊 Data Shape Analysis Utilities

```typescript
const analyzeStripeObject = (obj: any, objectType: string) => {
  console.log(`\n🔍 ANALYZING ${objectType.toUpperCase()} OBJECT`);
  console.log(`═══════════════════════════════════════════════════════════`);
  console.log(`📋 Object ID: ${obj.id}`);
  console.log(`🏷️  Object Type: ${obj.object}`);
  console.log(`📊 Available Fields: ${Object.keys(obj).join(', ')}`);
  console.log(`🗂️  Metadata Fields: ${Object.keys(obj.metadata || {}).join(', ')}`);
  
  // Type-specific analysis
  switch (objectType) {
    case 'customer':
      analyzeCustomerSpecific(obj);
      break;
    case 'product':
      analyzeProductSpecific(obj);
      break;
    case 'price':
      analyzePriceSpecific(obj);
      break;
    case 'payment_intent':
      analyzePaymentIntentSpecific(obj);
      break;
    case 'subscription':
      analyzeSubscriptionSpecific(obj);
      break;
  }
  
  console.log(`📊 Full Object Structure:`);
  console.log(JSON.stringify(obj, null, 2));
  console.log(`═══════════════════════════════════════════════════════════\n`);
};

const analyzeCustomerSpecific = (customer: any) => {
  const requiredFields = ['name', 'email', 'phone', 'address'];
  const missingFields = requiredFields.filter(field => !customer[field]);
  
  if (missingFields.length > 0) {
    console.log(`⚠️  Missing Customer Fields: ${missingFields.join(', ')}`);
  }
  
  console.log(`💳 Payment Methods: ${customer.sources?.total_count || 0}`);
  console.log(`🔄 Subscriptions: ${customer.subscriptions?.total_count || 0}`);
};

const analyzeProductSpecific = (product: any) => {
  const recommendedFields = ['description', 'images', 'url', 'statement_descriptor'];
  const missingFields = recommendedFields.filter(field => !product[field]);
  
  if (missingFields.length > 0) {
    console.log(`💡 Recommended Product Fields: ${missingFields.join(', ')}`);
  }
  
  console.log(`🖼️  Images: ${product.images?.length || 0}`);
  console.log(`✅ Active: ${product.active}`);
};

const analyzePriceSpecific = (price: any) => {
  console.log(`💰 Amount: ${price.unit_amount} ${price.currency}`);
  console.log(`🔄 Recurring: ${price.recurring ? 'Yes' : 'No'}`);
  if (price.recurring) {
    console.log(`📅 Interval: ${price.recurring.interval}`);
  }
};

const analyzePaymentIntentSpecific = (paymentIntent: any) => {
  console.log(`💰 Amount: ${paymentIntent.amount} ${paymentIntent.currency}`);
  console.log(`📊 Status: ${paymentIntent.status}`);
  console.log(`🎯 Confirmation Method: ${paymentIntent.confirmation_method}`);
};

const analyzeSubscriptionSpecific = (subscription: any) => {
  console.log(`📊 Status: ${subscription.status}`);
  console.log(`📅 Current Period: ${new Date(subscription.current_period_start * 1000).toISOString()} - ${new Date(subscription.current_period_end * 1000).toISOString()}`);
  console.log(`🛍️  Items: ${subscription.items?.data?.length || 0}`);
};
```

---

## 🧪 Comprehensive Testing Strategy

```typescript
describe('Complete Stripe Endpoints', () => {
  let testCustomer: any;
  let testProduct: any;
  let testPrice: any;
  
  beforeAll(async () => {
    // Setup test data
    testCustomer = await createCustomer({
      name: 'Test Customer',
      email: 'test@example.com'
    });
    
    testProduct = await createProduct({
      name: 'Test Product',
      description: 'A test product'
    });
    
    testPrice = await createPrice({
      currency: 'usd',
      unit_amount: 2000,
      product: testProduct.id
    });
  });
  
  describe('Customer Endpoints', () => {
    it('creates, retrieves, updates, and deletes customers', async () => {
      // Create
      expect(testCustomer.id).toMatch(/^cus_/);
      expect(testCustomer.email).toBe('test@example.com');
      
      // Retrieve
      const retrieved = await getCustomer(testCustomer.id);
      expect(retrieved.id).toBe(testCustomer.id);
      
      // Update
      const updated = await updateCustomer(testCustomer.id, {
        name: 'Updated Name'
      });
      expect(updated.name).toBe('Updated Name');
      
      // List
      const customers = await listCustomers({ limit: 1 });
      expect(customers.data.length).toBeGreaterThan(0);
    });
  });
  
  describe('Product Endpoints', () => {
    it('handles complete product lifecycle', async () => {
      expect(testProduct.id).toMatch(/^prod_/);
      expect(testProduct.name).toBe('Test Product');
      
      const updated = await updateProduct(testProduct.id, {
        description: 'Updated description'
      });
      expect(updated.description).toBe('Updated description');
    });
  });
  
  describe('Payment Intent Endpoints', () => {
    it('creates and manages payment intents', async () => {
      const paymentIntent = await createPaymentIntent({
        amount: 2000,
        currency: 'usd',
        customer: testCustomer.id
      });
      
      expect(paymentIntent.id).toMatch(/^pi_/);
      expect(paymentIntent.amount).toBe(2000);
      
      const retrieved = await getPaymentIntent(paymentIntent.id);
      expect(retrieved.id).toBe(paymentIntent.id);
    });
  });
  
  describe('Network Fallback', () => {
    it('handles fetch failures gracefully', async () => {
      // Mock fetch to fail
      const originalFetch = global.fetch;
      global.fetch = jest.fn().mockRejectedValue(new Error('Network error'));
      
      // Should still work via curl fallback
      const customer = await createCustomer({
        name: 'Fallback Test',
        email: 'fallback@test.com'
      });
      
      expect(customer.id).toMatch(/^cus_/);
      expect(customer._requestMethod).toBe('curl');
      
      global.fetch = originalFetch;
    });
  });
  
  afterAll(async () => {
    // Cleanup
    if (testCustomer) await deleteCustomer(testCustomer.id);
    if (testProduct) await deleteProduct(testProduct.id);
  });
});
```

---

## ⚙️ Implementation Checklist

### ✅ Required for Each Endpoint

- [ ] **Create function** with comprehensive metadata
- [ ] **Retrieve function** with expand parameters
- [ ] **Update function** with proper data handling
- [ ] **List function** with pagination support
- [ ] **Delete function** where applicable
- [ ] **Fetch/curl fallback** implemented
- [ ] **Verbose logging** with data shape analysis
- [ ] **Error handling** with detailed error info
- [ ] **Test coverage** with real API calls
- [ ] **Documentation** with curl examples

### 🎯 AI Agent Objectives

1. **Complete Coverage**: Implement ALL Stripe endpoints listed above
2. **Network Resilience**: Every function must have fetch/curl fallback
3. **Comprehensive Logging**: Log full request/response for debugging
4. **Metadata Enhancement**: Add meaningful metadata to all objects
5. **Data Analysis**: Analyze and document object shapes
6. **Real Testing**: Test with actual Stripe test API keys
7. **Production Ready**: Handle errors, edge cases, and validation

---

**Remember**: Node's fetch may fail due to network restrictions, but curl fallback always succeeds. Implement both methods for every endpoint to ensure continuous development capability.