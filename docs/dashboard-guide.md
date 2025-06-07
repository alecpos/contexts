# Stripe Dashboard UI Guide

This guide explains how to use the example `Dashboard` component to list prices and perform test purchases.

1. **Wrap the app in `StripeProvider`**
   ```tsx
   // app/layout.tsx
   import { StripeProvider } from '../providers/StripeProvider'
   export default function RootLayout({ children }: { children: React.ReactNode }) {
     return <StripeProvider>{children}</StripeProvider>
   }
   ```

2. **Render the Dashboard**
   ```tsx
   import Dashboard from '../dashboard/Dashboard'
   export default function Page() {
     return <Dashboard />
   }
   ```

3. **Create products and prices**
   Use the `useStripe` hook in any component to call `createProduct` and `createPrice`. Prices can be one‑time or recurring by passing an interval:
   ```tsx
   const { createProduct, createPrice } = useStripe()
   const prod = await createProduct('Starter Plan')
   await createPrice(500, 'usd', prod.id, 'month')
   ```

4. **Buy a price**
   When the Dashboard loads it lists the first five prices. Press **Buy** next to any price to run a test payment using the `tok_visa` token. Successful purchases appear in your Stripe test mode dashboard.

5. **Cancel a subscription**
   Use `createSubscription` with a recurring price ID to start a subscription. Pass the returned `sub.id` to `cancelSubscription` when you want to cancel it.

All operations use your `STRIPE_SK` in test mode so no real charges occur. For more details see `docs/stripe/testing.md`.
