
## COMPREHENSIVE CHAIN OF REASONING COMMAND FOR STRIPE PROJECT ANALYSIS & OPTIMIZATION


ensure you run npm install. And ensure we reach the endpoints. If you get an error, lets diagnose and fix,. It SHOULD be reaching the endpoints

### PHASE 1: PROJECT DOCUMENTATION DISCOVERY
1. Search the entire project directory for ALL .md files recursively
2. List each .md file found with its full path
3. Extract all external links/references from each .md file
4. Categorize links by domain (stripe.com, github.com, other external sites, etc.)
5. Create an inventory of all documentation files and their reference counts

### PHASE 2: LINK VALIDATION & REFERENCE VERIFICATION
1. Test each external link to verify if it's still active and accessible
2. For broken/dead links:
   - Document the broken URL
   - Note which .md file(s) contain the broken reference
   - Suggest potential replacement URLs if obvious alternatives exist
3. For Stripe-specific links (stripe.com domain):
   - Verify the link works and content is current
   - Extract key information from the live Stripe documentation
   - Cross-reference with your project's implementation
   - Note any discrepancies between your docs and current Stripe docs

### PHASE 3: STRIPE OBJECT ANALYSIS & METADATA EXTRACTION
1. **Identify all Stripe objects used in the codebase:**
   - Products, Prices, Customers, Subscriptions, Payment Intents, etc.
   - Sessions, Invoices, Coupons, Discounts, Tax Rates
   - Webhooks, Events, Charges, Refunds

2. **For EACH Stripe object type, create comprehensive analysis:**
   - Map current usage in codebase
   - Document actual data shapes being returned
   - Identify missing metadata fields
   - Compare with full Stripe API object specification
   - Note which optional fields could provide value

3. **Data Shape Documentation:**
   - Create detailed schemas for each object type used
   - Document nested object relationships
   - Map field types, nullability, and constraints
   - Identify expand parameters that could provide richer data

### PHASE 4: ROBUST LOGGING IMPLEMENTATION
1. **Create comprehensive logging functions for each Stripe operation:**
   ```javascript
   // Simple verbose flag - no env needed
   const VERBOSE = true; // Set to false to disable detailed logging
   
   const logStripeOperation = (operation, input, output, metadata = {}) => {
     if (VERBOSE) {
       console.log(`
       ═══════════════════════════════════════════════════════════
       🔷 STRIPE ${operation.toUpperCase()} OPERATION
       ═══════════════════════════════════════════════════════════
       ⏰ Timestamp: ${new Date().toISOString()}
       📝 Operation: ${operation}
       📥 Input Data: ${JSON.stringify(input, null, 2)}
       📤 Output Data: ${JSON.stringify(output, null, 2)}
       🏷️  Metadata: ${JSON.stringify(metadata, null, 2)}
       🔗 Request ID: ${output?.id || 'N/A'}
       💾 Data Shape: ${JSON.stringify(getObjectShape(output), null, 2)}
       ═══════════════════════════════════════════════════════════
       `);
     }
   };
2. Add detailed logging to every Stripe function: // Example for any Stripe functionconst createCustomer = async (customerData) => {  console.log('🚀 Creating customer with data:', customerData);    try {    const customer = await stripe.customers.create(customerData);        // Log the full response shape    console.log('✅ Customer created successfully');    console.log('📊 Full customer object shape:');    console.log(JSON.stringify(customer, null, 2));        logStripeOperation('CREATE_CUSTOMER', customerData, customer);    return customer;  } catch (error) {    console.error('❌ Customer creation failed:', error);    console.error('🔍 Error details:', {      type: error.type,      code: error.code,      message: error.message,      param: error.param    });    throw error;  }};
3. 
PHASE 5: VERBOSE MODE IMPLEMENTATION (NO ENV REQUIRED)
1. Create simple verbose logging with toggles:// At the top of each file - easy to toggle
2. const DEBUG_MODE = true;
3. const SHOW_FULL_RESPONSES = true;
4. const LOG_REQUEST_DETAILS = true;
5. 
6. const debugLog = (message, data = null) => {
7.   if (DEBUG_MODE) {
8.     console.log(`🐛 [DEBUG] ${message}`);
9.     if (data && SHOW_FULL_RESPONSES) {
10.       console.log(JSON.stringify(data, null, 2));
11.     }
12.   }
13. };
14. 
15. const requestLog = (endpoint, params) => {
16.   if (LOG_REQUEST_DETAILS) {
17.     console.log(`📡 API Request to: ${endpoint}`);
18.     console.log(`📋 Parameters:`, params);
19.   }
20. };
21. 
22. Add verbose output directly in functions:const getAllProducts = async () => {
23.   console.log('🛍️ Fetching all products...');
24.   
25.   const products = await stripe.products.list({ limit: 100 });
26.   
27.   console.log(`✅ Found ${products.data.length} products`);
28.   console.log('📊 Products data shape:');
29.   products.data.forEach((product, index) => {
30.     console.log(`\n--- Product ${index + 1} ---`);
31.     console.log(`ID: ${product.id}`);
32.     console.log(`Name: ${product.name}`);
33.     console.log(`Description: ${product.description}`);
34.     console.log(`Metadata keys: ${Object.keys(product.metadata)}`);
35.     console.log(`Full object:`, JSON.stringify(product, null, 2));
36.   });
37.   
38.   return products;
39. };
40. 
PHASE 6: FUNCTION OPTIMIZATION & PERFECTION
1. For each Stripe operation, create perfect functions with built-in logging:Products:const createProductWithFullMetadata = async (productData) => {
2.   console.log('🏭 Creating product with enhanced metadata...');
3.   
4.   const enhancedData = {
5.     ...productData,
6.     metadata: {
7.       ...productData.metadata,
8.       created_by: 'system',
9.       version: '1.0',
10.       category: productData.category || 'general',
11.       // Add any other business metadata
12.     }
13.   };
14.   
15.   console.log('📝 Enhanced product data:', enhancedData);
16.   
17.   try {
18.     const product = await stripe.products.create(enhancedData);
19.     console.log('✅ Product created with ID:', product.id);
20.     console.log('📊 Full product object:', JSON.stringify(product, null, 2));
21.     return product;
22.   } catch (error) {
23.     console.error('❌ Product creation failed:', error);
24.     throw error;
25.   }
26. };
27. 
PHASE 7: ANALYSIS OF USER-PROVIDED CONTEXT
[SPACE FOR YOUR PROMPT/ISSUES - INSERT BELOW THIS LINE]

CONTEXT/ISSUES TO ANALYZE: [INSERT YOUR SPECIFIC PROMPTS, ERROR MESSAGES, OR ISSUES HERE]
Example format:
* Specific error you're encountering
* Code snippets that aren't working
* Questions about implementation
* Stripe notifications or warnings you've received

PHASE 8: DATA SHAPE ANALYSIS & METADATA ENHANCEMENT
1. Create utility functions to analyze object shapes: const analyzeStripeObject = (obj, objectType) => {  console.log(`\n🔍 Analyzing ${objectType} object shape:`);  console.log(`📋 Available fields: ${Object.keys(obj).join(', ')}`);  console.log(`🏷️  Metadata fields: ${Object.keys(obj.metadata || {}).join(', ')}`);  console.log(`📊 Full object structure:`);  console.log(JSON.stringify(obj, null, 2));    // Check for commonly missing fields  const commonFields = {    product: ['description', 'images', 'metadata', 'url'],    customer: ['name', 'email', 'phone', 'address', 'metadata'],    subscription: ['metadata', 'description', 'trial_end']  };    if (commonFields[objectType]) {    console.log(`⚠️  Missing common fields:`);    commonFields[objectType].forEach(field => {      if (!obj[field]) {        console.log(`   - ${field}`);      }    });  }};
2. 
PHASE 9: IMPLEMENTATION GUIDE
1. Step-by-step implementation:
    * Add logging functions to each file
    * Set DEBUG_MODE = true at the top of files
    * Run each function and examine the logged output
    * Identify missing metadata and enhance objects
    * Perfect each function based on logged data shapes
2. No environment setup required:
    * Just toggle boolean flags in code
    * Use console.log statements liberally
    * Copy/paste the verbose output for analysis
    * Gradually reduce logging as functions are perfected
OUTPUT FORMAT:
* Provide complete, ready-to-use logging functions
* Include copy-paste code examples with built-in verbose output
* Show before/after examples of function enhancement
* Create step-by-step implementation without any env dependencies
