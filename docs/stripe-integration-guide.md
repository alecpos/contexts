# Stripe Integration Guide

This guide explains how to integrate new Stripe features across the codebase and how to test order flows using the existing provider pattern.

## Environment Setup

Create a `.env` file based on `.env.example` and provide the following keys:

```
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY_TEST=<test publishable key>
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY_SANDBOX=<sandbox key>
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY_LIVE=<live key>
STRIPE_SK=<secret key for server requests>
NEXT_PUBLIC_SUPABASE_URL=<your Supabase URL>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your Supabase anon key>
RUDDERSTACK_WRITE_KEY=<analytics key>
```

Use test mode keys during development. Sandbox mode can be selected by setting `STRIPE_ENVIRONMENT=sandbox`.

## Provider Workflow

All Stripe logic is isolated in `StripeProvider`. Wrap your application with this provider and access functions through `useStripeContext()`:

```tsx
import { StripeProvider, useStripeContext } from './providers/StripeProvider';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <StripeProvider>{children}</StripeProvider>;
}
```

The context exposes helper functions for creating setup intents, updating payment methods and starting checkout sessions. When `NODE_ENV` is not `production` the context also provides `simulateWebhookEvent` for local testing.

## Order Flow Example

To begin a payment flow from a component:

```tsx
'use client';
import { useStripeContext } from '@/app/providers/StripeProvider';

export default function CheckoutButton() {
  const { startCheckoutSession } = useStripeContext();

  const handleClick = async () => {
    await startCheckoutSession({
      priceId: 'price_basic',
      quantity: 1,
      successUrl: 'https://example.com/success',
      cancelUrl: 'https://example.com/cancel'
    });
  };

  return <button onClick={handleClick}>Pay</button>;
}
```

On the server, `createCheckoutSessionServer` in `services/stripe/checkoutSession.ts` uses `stripe.checkout.sessions.create` to generate the session. The provider then redirects the customer using `stripe.redirectToCheckout`.

### Simulating Webhooks

When testing locally you can call `simulateWebhookEvent` to hit `/api/stripe/webhook/simulate` with custom event data:

```ts
await simulateWebhookEvent('invoice.paid', { id: 'in_123' });
```

This method is undefined in production builds to prevent accidental calls.

## Running Tests

Use Jest to execute the suite:

```
npm test
```

Tests reside under `providers/__tests__/` and mock external calls. They cover environment configuration, API failures and webhook simulation. Add new tests whenever you extend the provider so flows remain reliable.

