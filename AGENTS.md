# AGENTS.md (Comprehensive Stripe Integration & Documentation Analysis)

**Last Updated:** 2025-06-07

## 🧠 Purpose

This file defines standards for AI agents and human developers contributing to the project. It enforces a **comprehensive documentation-first** architecture with **robust Stripe integration analysis**, **verbose logging**, and **metadata enhancement** patterns.

---

## 📁 Project Structure & Conventions

### 🔍 Key Paths

* `src/`: Main application source code
* `docs/`: All `.md` files and documentation
* `providers/`: External service integrations (Stripe, payments)
* `utils/`: Logging utilities and HTTP abstraction layers
* `types/`: TypeScript definitions and Stripe object schemas
* `tests/`: Test files with verbose logging examples
* `scripts/`: Documentation analysis and link validation tools

### 🔄 Data & Analysis Flow

* **Documentation state**: Tracked via `.md` file analysis and link validation
* **Stripe objects**: Full metadata documentation with data shape analysis
* **API interactions**: HTTP-only with comprehensive logging
* **Verbose mode**: Built-in debugging without environment dependencies

---

## 🧩 Design Patterns & Principles

### ✅ Required Patterns

* **Documentation-first**: All `.md` files must be analyzed and cross-referenced
* **Verbose logging**: Every Stripe operation logs full request/response data
* **Metadata enhancement**: All Stripe objects include comprehensive metadata
* **HTTP-only integration**: No Stripe SDKs, only `fetch`/`curl` requests
* **Real data validation**: Test with actual Stripe API responses
* **Link validation**: All external references must be verified and updated

---

## 📚 Documentation Analysis Requirements

### 🔍 Markdown File Analysis

All AI agents must perform comprehensive `.md` file analysis:

```javascript
// Required documentation analysis pattern
const analyzeProjectDocumentation = async () => {
  // Phase 1: Discovery
  const mdFiles = await findAllMarkdownFiles('.');
  console.log(`📋 Found ${mdFiles.length} .md files`);
  
  // Phase 2: Link extraction and validation
  for (const file of mdFiles) {
    const links = extractAllLinks(file);
    const brokenLinks = await validateLinks(links);
    
    if (brokenLinks.length > 0) {
      console.log(`⚠️  Broken links in ${file}:`, brokenLinks);
    }
  }
  
  // Phase 3: Stripe documentation cross-reference
  const stripeLinks = filterStripeLinks(allLinks);
  await crossReferenceWithLiveStripeDocs(stripeLinks);
};
```

### 📖 Required Documentation Updates

* **Link validation**: All external links verified and updated
* **Stripe reference accuracy**: Cross-referenced with live Stripe docs
* **Metadata schemas**: Documented for every Stripe object type
* **API examples**: Include verbose logging output
* **Error handling**: Document all Stripe error types and responses

---

## 🧪 Stripe Integration & Comprehensive Logging

### 🏗️ Enhanced Provider Contract: `StripeProvider`

All Stripe logic must include verbose logging and comprehensive metadata:

```typescript
export const StripeProvider = ({ children }: PropsWithChildren) => {
  // Simple verbose control - no env required
  const VERBOSE_LOGGING = true;
  const LOG_FULL_RESPONSES = true;
  
  const [stripeData, setStripeData] = useState({
    customerId: null,
    clientSecret: null,
    error: null,
    metadata: {}
  });

  const logStripeOperation = (operation: string, input: any, output: any) => {
    if (VERBOSE_LOGGING) {
      console.log(`
      ═══════════════════════════════════════════════════════════
      🔷 STRIPE ${operation.toUpperCase()} OPERATION
      ═══════════════════════════════════════════════════════════
      ⏰ Timestamp: ${new Date().toISOString()}
      📝 Operation: ${operation}
      📥 Input Data: ${JSON.stringify(input, null, 2)}
      📤 Output Data: ${JSON.stringify(output, null, 2)}
      🔗 Request ID: ${output?.id || 'N/A'}
      💾 Data Shape Analysis:
      ${analyzeObjectShape(output)}
      ═══════════════════════════════════════════════════════════
      `);
    }
  };

  const createCustomerWithMetadata = async (customerData: any) => {
    console.log('🚀 Creating customer with enhanced metadata...');
    
    const enhancedData = {
      ...customerData,
      metadata: {
        ...customerData.metadata,
        created_by: 'system',
        environment: 'test',
        version: '1.0',
        project_context: 'comprehensive_analysis'
      }
    };

    try {
      const response = await fetch('https://api.stripe.com/v1/customers', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${process.env.STRIPE_SK}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams(enhancedData)
      });

      const customer = await response.json();
      
      logStripeOperation('CREATE_CUSTOMER', enhancedData, customer);
      
      if (LOG_FULL_RESPONSES) {
        console.log('📊 Full customer object analysis:');
        analyzeStripeCustomerObject(customer);
      }
      
      return customer;
    } catch (error) {
      console.error('❌ Customer creation failed:', error);
      logStripeOperation('CREATE_CUSTOMER_ERROR', enhancedData, error);
      throw error;
    }
  };

  return (
    <StripeContext.Provider value={{ stripeData, createCustomerWithMetadata }}>
      {children}
    </StripeContext.Provider>
  );
};
```

---

### 🔍 Data Shape Analysis Functions

Required utility functions for all Stripe objects:

```typescript
const analyzeStripeCustomerObject = (customer: any) => {
  console.log(`\n🔍 CUSTOMER OBJECT ANALYSIS`);
  console.log(`📋 Available fields: ${Object.keys(customer).join(', ')}`);
  console.log(`🏷️  Metadata fields: ${Object.keys(customer.metadata || {}).join(', ')}`);
  
  // Check for missing common fields
  const commonCustomerFields = ['name', 'email', 'phone', 'address', 'description'];
  const missingFields = commonCustomerFields.filter(field => !customer[field]);
  
  if (missingFields.length > 0) {
    console.log(`⚠️  Missing recommended fields: ${missingFields.join(', ')}`);
    console.log(`💡 Consider adding these for enhanced customer data`);
  }
  
  console.log(`📊 Full object structure:`);
  console.log(JSON.stringify(customer, null, 2));
};

const analyzeStripeProductObject = (product: any) => {
  console.log(`\n🔍 PRODUCT OBJECT ANALYSIS`);
  console.log(`📋 Available fields: ${Object.keys(product).join(', ')}`);
  console.log(`🏷️  Metadata fields: ${Object.keys(product.metadata || {}).join(', ')}`);
  
  // Check for missing product fields
  const commonProductFields = ['description', 'images', 'url', 'statement_descriptor'];
  const missingFields = commonProductFields.filter(field => !product[field]);
  
  if (missingFields.length > 0) {
    console.log(`⚠️  Missing recommended fields: ${missingFields.join(', ')}`);
  }
  
  console.log(`📊 Full object structure:`);
  console.log(JSON.stringify(product, null, 2));
};
```

---

### ✅ Enhanced Stripe Function Guidelines

* **Verbose logging required**: Every function logs full request/response
* **Metadata enhancement**: Add comprehensive metadata to all objects
* **HTTP-only**: Never use `stripe-js` or SDKs, only `fetch`/`curl`
* **Data shape analysis**: Document and analyze every object returned
* **Environment variables**: Use `STRIPE_PK` and `STRIPE_SK` from `.env`
* **Error documentation**: Log and categorize all error types
* **Link validation**: Verify all Stripe documentation references

---

### 🧪 Comprehensive Test Strategy

```typescript
describe('Enhanced StripeProvider', () => {
  it('creates customer with comprehensive metadata and logging', async () => {
    const customerData = {
      name: 'Test Customer',
      email: 'test@example.com'
    };
    
    render(<StripeProvider><TestComponent /></StripeProvider>);
    
    await waitFor(() => {
      const { createCustomerWithMetadata } = useStripe();
      expect(createCustomerWithMetadata).toBeDefined();
    });
    
    // Verify verbose logging output
    expect(console.log).toHaveBeenCalledWith(
      expect.stringContaining('STRIPE CREATE_CUSTOMER OPERATION')
    );
  });

  it('analyzes and documents data shapes', async () => {
    // Test should verify that data shape analysis is performed
    // and missing fields are identified and logged
  });

  it('validates all external documentation links', async () => {
    const links = await extractLinksFromMarkdown('./docs/');
    const brokenLinks = await validateLinks(links);
    expect(brokenLinks).toHaveLength(0);
  });
});
```

---

## 🎯 AI Agent Objectives

When working on this project, AI agents must:

### 📋 Documentation Analysis
* Scan all `.md` files for broken links
* Cross-reference Stripe documentation with current API
* Update outdated references and examples
* Document data shapes for all Stripe objects

### 🔍 Verbose Implementation
* Add comprehensive logging to every Stripe function
* Implement data shape analysis for all objects
* Create metadata enhancement recommendations
* Generate detailed error documentation

### 🧪 Testing Requirements
* Use real Stripe test API keys and sandbox
* Test with actual Stripe test card numbers (4242 4242 4242 4242)
* Validate webhook handling with real payloads
* Document all test scenarios and responses

---

## ⚙️ Required Tooling & Environment

### 📝 Environment Variables

`.env.example` must include:

```env
# Stripe API Keys
STRIPE_PK=pk_test_...
STRIPE_SK=sk_test_...

# Logging Configuration (optional)
DEBUG_STRIPE=true
VERBOSE_LOGGING=true
```

### 🛠️ Documentation Tools

Required scripts for documentation maintenance:

```bash
# Validate all markdown links
curl -X GET "https://api.stripe.com/v1/products" \
  -H "Authorization: Bearer $STRIPE_SK" \
  -v  # Always use verbose mode for debugging

# Test customer creation with metadata
curl -X POST "https://api.stripe.com/v1/customers" \
  -H "Authorization: Bearer $STRIPE_SK" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "name=Test Customer" \
  -d "email=test@example.com" \
  -d "metadata[created_by]=documentation_test" \
  -v
```

---

## 📝 Pull Request Requirements

* **Documentation updates**: Include `.md` file analysis results
* **Link validation**: Verify all external references work
* **Verbose logging**: Include sample log output from testing
* **Metadata enhancement**: Document metadata additions made
* **Real API testing**: Include test results with actual Stripe responses
* **Error handling**: Document error scenarios tested

---

## 📖 Integration Examples

### ✅ **Correct Implementation**

```typescript
// Comprehensive Stripe product creation
const createProductWithAnalysis = async (productData: any) => {
  console.log('🛍️ Creating product with comprehensive analysis...');
  
  const enhancedData = {
    ...productData,
    metadata: {
      ...productData.metadata,
      created_at: new Date().toISOString(),
      version: '1.0',
      category: productData.category || 'general',
      analysis_complete: 'true'
    }
  };
  
  try {
    const response = await fetch('https://api.stripe.com/v1/products', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.STRIPE_SK}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams(enhancedData)
    });
    
    const product = await response.json();
    
    // Required: Analyze and log data shape
    analyzeStripeProductObject(product);
    
    // Required: Log full operation
    logStripeOperation('CREATE_PRODUCT', enhancedData, product);
    
    return product;
  } catch (error) {
    console.error('❌ Product creation failed:', error);
    logStripeOperation('CREATE_PRODUCT_ERROR', enhancedData, error);
    throw error;
  }
};
```

### 🚫 **Incorrect Implementation**

```typescript
// Missing logging, analysis, and metadata
const stripe = await loadStripe('pk_test_...');  // SDK usage forbidden
const product = await stripe.products.create(data);  // No logging or analysis
```

---

## 🔗 Documentation Maintenance

### 📋 Required Weekly Tasks

* Validate all external links in `.md` files
* Cross-reference Stripe documentation with latest API
* Update any broken or outdated references
* Analyze new Stripe object fields and update schemas
* Review verbose logging output for optimization opportunities

### 📊 Metadata Enhancement Checklist

For each Stripe object type, ensure metadata includes:
- `created_by`: System or user identifier
- `environment`: test/production indicator  
- `version`: Schema or API version
- `category`: Business classification
- `last_updated`: Timestamp of last modification
- Business-specific tracking fields

---

This `AGENTS.md` enforces comprehensive documentation analysis, verbose Stripe integration with full metadata, and robust testing patterns without requiring complex environment setup.