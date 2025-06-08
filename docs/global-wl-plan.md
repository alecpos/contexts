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
