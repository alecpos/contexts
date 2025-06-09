# Global Weight Loss Funnel – Implementation Plan

This document outlines the approach for **BV-3284 Build & Integrate New Global Weight Loss Funnel for A/B Testing**. The goal is to implement the redesigned funnel and prepare it for A/B testing against the existing version.

## Objectives

- Capture goal weight and display interactive BMI feedback.
- Offer medication selection for Ozempic, Mounjaro, Zepbound and BIOVERSE Weight Loss Capsule.
- Route 30% of users through this new funnel and keep 70% on the current flow.
- Store new answers in the patient model and ensure DoseSpot integration for retail prescriptions.

## Sprint Breakdown (15 points)

1. **Page Scaffolding (3 pts)** – Create new route files and basic React components for goal weight input, interactive BMI feedback and medication selection.
2. **Backend Updates (4 pts)** – Extend order and questionnaire controllers to store goal weight and selected medication. Add DoseSpot prescription logic for the new options.
3. **A/B Split Logic (3 pts)** – Implement percentage based routing in the intake controller and verify that analytics capture which version a user sees.
4. **Interactive Visualization (3 pts)** – Build responsive BMI graph that updates as the user enters goal weight.
5. **Tracking & QA (2 pts)** – Ensure events flow to analytics and test both funnels across common devices.

Success is achieved when the new funnel matches the Figma designs, integrates with backend services and can be toggled on for a percentage of traffic.

## Progress

- Initial pages for the new funnel have been scaffolded under `app/(intake)/intake/prescriptions/[product]/`:
  - `global-wl-goal-weight`
  - `global-wl-interactive`
  - `global-wl-medications`
  - `global-wl-checkout`
- `global-wl-intro`
- `global-wl-up-next`
- `global-wl-order-summary`
- `global-wl-whats-next`
- A **long** variant has been added with the same structure:
  - `global-wl-long-intro`
  - `global-wl-long-goal-weight`
  - `global-wl-long-interactive`
  - `global-wl-long-medications`
  - `global-wl-long-checkout`
  - `global-wl-long-up-next`
  - `global-wl-long-order-summary`
  - `global-wl-long-whats-next`
- Each page mirrors the existing route pattern and renders a placeholder component from `components/intake-v4/pages/`.
- Next we will flesh out the remaining screens using the same `app/(intake)/intake/prescriptions/[product]/<route>` structure. This keeps parity with the current weight‑loss routes and makes A/B testing easier. New files will follow the pattern of a thin server component that imports a client component from `components/intake-v4/pages/`.
- Route constants have been updated (`GLOBAL_WL_ROUTES` and `GLOBAL_WL_LONG_ROUTES`) so the intake controller knows about the new sequences.
- All pages now reside under the dynamic `[product]` directory so any `PRODUCT_HREF` value automatically loads the funnel.
- With the skeleton in place, the next step is fleshing out form logic and data wiring while keeping the same server component + client component split.

## Route Structure & Pages

All screens live under `app/(intake)/intake/prescriptions/[product]/` so any value from `ALL_PRODUCT_HREFS` automatically loads the funnel. Each page is a thin server component that renders a matching client component from `components/intake-v4/pages/`.

- `global-wl-intro/page.tsx`
- `global-wl-goal-weight/page.tsx`
- `global-wl-interactive/page.tsx`
- `global-wl-medications/page.tsx`
- `global-wl-checkout/page.tsx`
- `global-wl-up-next/page.tsx`
- `global-wl-order-summary/page.tsx`
- `global-wl-whats-next/page.tsx`
- `global-wl-long-intro/page.tsx`
- `global-wl-long-goal-weight/page.tsx`
- `global-wl-long-interactive/page.tsx`
- `global-wl-long-medications/page.tsx`
- `global-wl-long-checkout/page.tsx`
- `global-wl-long-up-next/page.tsx`
- `global-wl-long-order-summary/page.tsx`
- `global-wl-long-whats-next/page.tsx`

This mirrors the existing weight‑loss routes and keeps parity for analytics and A/B tests. Additional pages should follow the same naming convention.

## Must Implement & API Requirements

### Must Implement

- Complete interactive form logic on each page.
- Track analytics events for every screen.
- Wire server-side validation for medication selection.
- Persist BMI graph data between steps.

### API Requirements

- `POST /api/patient/goal-weight` – save the patient target weight.
- `GET /api/products/weight-loss` – fetch medication options.
- `POST /api/prescriptions/medication` – create the prescription record.
- `POST /api/checkout/weight-loss` – finalize the order.

### Timing Per Page (Existing Funnel Benchmarks)

| Page | Reference | Est. Time |
| --- | --- | --- |
| `global-wl-goal-weight` | `wl-goal-weight` | ~0.5d |
| `global-wl-interactive` | `wl-interactive` | ~1d |
| `global-wl-medications` | `wl-medications` | ~0.5d |
| `global-wl-checkout` | `wl-checkout` | ~0.5d |
| `global-wl-order-summary` | `order-summary` | ~0.5d |
| `global-wl-whats-next` | `whats-next` | ~0.25d |

### Timing Per Page – Other Funnels

The legacy weight-loss funnel provides additional benchmarks that may help
estimate work in related flows.

| Page | Est. Time |
| --- | --- |
| `wl-intro` | ~0.25d |
| `wl-goal-weight` | ~0.5d |
| `wl-medications` | ~0.5d |
| `wl-checkout` | ~0.5d |
| `wl-order-summary` | ~0.5d |
| `wl-whats-next` | ~0.25d |

## Next Steps

- Implement full logic for goal weight capture and ensure the value persists across steps.
- Build out interactive BMI feedback graph using live data from the form.
- Connect medication options to DoseSpot integration and store selection in the patient model.
- Add A/B routing logic so 30% of global weight loss traffic goes through these new pages.
- Verify analytics events trigger for every screen in both the control and variant flows.

## B12 Injection Reference

The B12 intake is currently the most complete implementation. Its page-by-page API sequence serves as the blueprint for the global weight loss funnel. See [call-graph.json](/call-graph.json) and [migration-plan.json](/migration-plan.json) for the underlying dependency graph.

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

## Mapping B12 Calls to Global Weight Loss Pages

The new funnel should reuse these APIs where possible. The table below lists the initial mapping of B12 calls to their global‑WL counterparts. Long variants inherit the same logic.

| Global WL Page | B12 Equivalent | Primary APIs / Events |
| -------------- | -------------- | --------------------- |
| `global-wl-intro` | `improve-function` | `readUserSession()` |
| `global-wl-goal-weight` | `registration-v3`, `state-selection` | `readUserSession()`, `getUserState()` |
| `global-wl-interactive` | `date-of-birth-v3`, `good-news-v3` | `readUserSession()`, `getCustomerFirstNameById()` |
| `global-wl-medications` | `demographic-collection-v3` | `readUserSession()`, `getPriceVariantTableData()` |
| `global-wl-checkout` | `new-checkout` | `checkForExistingOrderV2()`, `updateOrderDiscount()` |
| `global-wl-up-next` | `up-next-v3` | `readUserSession()` |
| `global-wl-order-summary` | `general-order-summary` | `getOrderForProduct()`, `getPriceDataRecordWithVariant()` |
| `global-wl-whats-next` | `shipping-information-v3` | `getShippingInformationData()`, RudderStack & Mixpanel events |

For a detailed breakdown see [b12-injection-api-flow.md](./b12-injection-api-flow.md).
