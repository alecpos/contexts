# B12 Injection Funnel – API Call Breakdown

This guide enumerates the network requests and database interactions triggered by each screen in the B12 injection intake flow. Use it alongside `call-graph.json` and `migration-plan.json` for deeper dependency analysis.

| Page | Key Functions / APIs | Tables & Services |
| ---- | ------------------- | ----------------- |
| **improve-function** | `readUserSession()` | `auth.sessions` via Supabase |
| **b12-advantages** | – | – |
| **registration-v3** | `createSupabaseServerComponentClient()` → `supabase.auth.getSession` | `auth.sessions` |
| **state-selection** | `readUserSession()`, `getUserState()` | `profiles.state` |
| **date-of-birth-v3** | `readUserSession()`, `getUserDateOfBirth()` | `profiles.dob` |
| **good-news-v3** | `readUserSession()`, `getCustomerFirstNameById()` | `profiles.first_name` |
| **demographic-collection-v3** | `readUserSession()`, `getIntakeProfileData()`, `getPriceVariantTableData()` | `profiles`, `product_variants` |
| **greeting-v3** | `readUserSession()`, `getCustomerFirstNameById()` | `profiles.first_name` |
| **up-next-v3** | `readUserSession()` | – |
| **questions-v3 (hub)** | `readUserSession()`, `getOrderForProduct()`, `createQuestionnaireSessionForOrder()`, `getQuestionsForProduct_with_Version()` | `orders`, `questionnaire_sessions` |
| **question-id-v3** | `getQuestionInformation_with_version()`, `getQuestionsForProduct_with_Version()`, `writeQuestionnaireAnswer()`, `updateSessionCompletion()`, `trackRudderstackEvent()` | `questionnaire_questions`, `hhq_answers`, RudderStack |
| **select-supply** | `readUserSession()`, `getOrderForProduct()`, `getMonthlyAndQuarterlyPriceVariantData()`, `getNonGLPDiscountForProduct()` | `orders`, `product_variants`, `discounts` |
| **general-order-summary** | `readUserSession()`, `getOrderForProduct()`, `getPriceDataRecordWithVariant()` | `orders`, `product_variants` |
| **b12-reviews** | – | – |
| **pre-id-v3** | `readUserSession()`, `getIDVerificationData()`, `getCombinedOrderV2()` | `profiles.license/selfie`, `orders` |
| **id-verification-v3** | `updateUserProfileLicensePhotoURL()`, `updateUserProfileSelfiePhotoURL()`, `checkMixpanelEventFired()`, `trackMixpanelEvent()`, `trackRudderstackEvent()` | `storage`, `mixpanel_event_audit`, Mixpanel, RudderStack |
| **shipping-information-v3** | `readUserSession()`, `getShippingInformationData()`, `axios.post('/api/google')`, `trackMixpanelEvent()`, `trackRudderstackEvent()`, `triggerEvent()` | `profiles.address`, Google API, Mixpanel, RudderStack, Customer.io |
| **new-checkout** | `readUserSession()`, `checkForExistingOrderV2()`, `getFullIntakeProfileData()`, `getPriceVariantTableData()`, `updateOrderDiscount()`, `fetchProductImageAndPriceData()` | `orders`, `profiles`, `product_variants`, `product_images` |

These calls are derived from the current codebase and cross-checked against `call-graph.json` and `migration-plan.json` for ongoing refactors.
