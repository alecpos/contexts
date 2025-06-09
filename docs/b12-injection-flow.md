# B12 Injection Intake Flow – API Reference

This document details the network calls and data sources used in each step of the B12 injection intake funnel. It is based on the implementation under `bioverse-client/app/(intake)/intake/prescriptions/[product]`.

| Page | API Calls | Databases/Tables | Analytics |
| --- | --- | --- | --- |
| `improve-function` | `readUserSession()` | `auth.sessions` via Supabase | – |
| `b12-advantages` | none | – | – |
| `registration` | `readUserSession()`, Supabase auth session | `auth.sessions` | – |
| `state-selection` | `readUserSession()`, `getUserState()` | `profiles.state` | – |
| `date-of-birth` | `readUserSession()`, `getUserDateOfBirth()` | `profiles.date_of_birth` | – |
| `good-news-v3` | `readUserSession()`, `getCustomerFirstNameById()` | `profiles.first_name` | – |
| `demographic-collection` | `readUserSession()`, `getIntakeProfileData()`, `getPriceVariantTableData()` | `profiles`, `product_variants` | – |
| `greeting` | `readUserSession()`, `getCustomerFirstNameById()` | `profiles.first_name` | – |
| `up-next` | `readUserSession()` | `auth.sessions` | – |
| `questions` | `getQuestionsForProduct_with_Version()` | RPC `get_questions_for_product_with_version` | – |
| `questions/[question_id]` | `readUserSession()`, `getAccountProfileData()` | `profiles` | – |
| `select-supply` | `readUserSession()`, `getOrderForProduct()`, `getMonthlyAndQuarterlyPriceVariantData()`, `getNonGLPDiscountForProduct()` | `orders`, `product_variants`, `discounts` | – |
| `general-order-summary` | `readUserSession()`, `getOrderForProduct()`, `getPriceDataRecordWithVariant()` | `orders`, `product_variants` | – |
| `b12-reviews` | none | – | – |
| `pre-id` | `readUserSession()`, `getIDVerificationData()` | `profiles.license_photo_url`, `profiles.selfie_photo_url` | – |
| `id-verification` | `readUserSession()`, `getIDVerificationData()` | `profiles` | – |
| `shipping-information` | `readUserSession()`, `getShippingInformationData()` | `profiles` | – |
| `new-checkout` | `readUserSession()`, `getFullIntakeProfileData()`, `checkForExistingOrderV2()`, `getPriceVariantTableData()`, `updateOrderDiscount()`, `fetchProductImageAndPriceData()` | `profiles`, `orders`, `product_variants`, `products`, `stripe_product_coupon_pairs` | `trackRudderstackEvent('ORDER_RECEIVED')` upon completion |

The functions above ultimately call the Supabase client to read or write data. See `call-graph.json` and `migration-plan.json` for the wider dependency graph.
