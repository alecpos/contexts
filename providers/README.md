# StripeProvider


`StripeProvider` talks directly to the Stripe REST API using the secret key from `.env`. **It is a server component** so the secret key never reaches the browser. When invoked it ensures the code is running in a Node.js environment (and not the Edge runtime) and that `STRIPE_SK` is present. In production, `STRIPE_SK` must be a live key. The provider caches the initial customer/setup intent so repeated renders do not create duplicates. The accompanying hook `useStripe` can be consumed from other server components to access helper functions for creating customers, products and mock payments while in test mode.



## Usage


Wrap your root layout in `StripeProvider` (server component) and access the helper functions with the `useStripe` hook from other server components. Client components should call API routes instead of using the context directly. If `StripeProvider` is executed in the browser it throws immediately.


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
import { useStripe } from '../providers/StripeProvider';

export default function PaymentButton() {
    const { listPrices, purchasePrice } = useStripe();

    const handleClick = async () => {
        const prices = await listPrices(3);
        await purchasePrice(prices.data[0].id);
    };

    return <button onClick={handleClick}>Purchase First Price</button>;
}
```


## Provided Functions

`useStripe()` exposes several helpers:

- `createProduct(name)` – create a Product object in Stripe.
- `createPrice(amount, currency, productId)` – create a Price for a product.
- `listProducts(limit)` – list existing products.
- `listPrices(limit)` – list prices.
- `purchasePrice(priceId)` – perform a mock purchase using test card tokens.
- `listAllPaymentIntents()` – auto-paginate through all payment intents.
- `listAllCharges()` – auto-paginate through all charges.
- `applyCustomerBalance(id)` – apply a customer's balance to a payment intent.
- `incrementAuthorization(id, amount)` – increase an authorized amount.
- `verifyMicrodeposits(id, amounts)` – verify bank account microdeposits.

Wrap your application with `StripeProvider` to ensure the customer and setup intent are created before calling these helpers.

---

## RudderStackProvider

`RudderStackProvider` sends analytics events using the RudderStack Node SDK. It is a server component so API keys never reach the browser. The provider validates the following environment variables:

```bash
RUDDERSTACK_API_KEY=<write key>
RUDDERSTACK_DATA_PLANE_URL=<data plane url>
```

### Usage

Wrap your application's root layout in `RudderStackProvider` and call the helper hook `useRudderStack` from server components to track analytics events.

```tsx
import { RudderStackProvider } from './providers/RudderStackProvider'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <RudderStackProvider>{children}</RudderStackProvider>
}
```

```tsx
import { useRudderStack } from '../providers/RudderStackProvider'

export default async function Example() {
  const { track } = useRudderStack()
  await track('my-event', { foo: 'bar' })
  return null
}
```

The context provides three functions:

- `track(event, properties)` – send a tracking event
- `identify(userId, traits)` – identify a user
- `alias(newUserId, anonymousId)` – alias an anonymous user to a new id

Wrap your application with `RudderStackProvider` to ensure events are sent securely from the server.
