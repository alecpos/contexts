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
- Each page mirrors the existing route pattern and renders a placeholder component from `components/intake-v4/pages/`.
- Next we will flesh out the remaining screens using the same `app/(intake)/intake/prescriptions/[product]/<route>` structure. This keeps parity with the current weight‑loss routes and makes A/B testing easier. New files will follow the pattern of a thin server component that imports a client component from `components/intake-v4/pages/`.

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
