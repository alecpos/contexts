# StripeProvider

This provider initializes Stripe on the client and exposes helper functions for common payment tasks. Use the `useStripeContext` hook to access these utilities.


## Usage

Wrap your root layout in `StripeProvider` and access the context with the `useStripeContext` hook.

```tsx
// app/layout.tsx
import { StripeProvider } from './providers/StripeProvider';

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return <StripeProvider>{children}</StripeProvider>;
}
```

```tsx
// Example component
'use client';
import { useStripeContext } from '@/app/providers/StripeProvider';

export default function PaymentButton({ customerId }: { customerId: string }) {
    const { createSetupIntentForCustomer } = useStripeContext();

    const handleClick = async () => {
        await createSetupIntentForCustomer(customerId);
    };

    return <button onClick={handleClick}>Create Setup Intent</button>;
}
```


## Provided Functions

- `createSetupIntentForCustomer(customerId)` – create a Setup Intent for a Stripe customer.
- `updateCustomerDefaultPaymentMethod(customerId)` – update a customer's default payment method via `/api/stripe/payment-method/default`.
- `updateSubscriptionPaymentMethod(customerId, subscriptionId)` – update a subscription's payment method via `/api/stripe/payment-method/subscription`.
- `startCheckoutSession(options)` – create a Checkout Session via HTTP and redirect the customer to `session.url` from the response.
- `listPaymentIntents(limit)` – fetch recent PaymentIntents for debugging.

Wrap your application with `StripeProvider` to ensure Stripe is loaded before any payment interactions.
