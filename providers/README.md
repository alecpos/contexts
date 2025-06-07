# StripeProvider

`StripeProvider` talks directly to the Stripe REST API using the secret key from `.env`. The accompanying hook `useStripe` exposes helper functions for creating customers, products, and mock payments while in test mode.


## Usage

Wrap your root layout in `StripeProvider` and access the helper functions with the `useStripe` hook.

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

Wrap your application with `StripeProvider` to ensure the customer and setup intent are created before calling these helpers.

### Demo Dashboard

The `dashboard/Dashboard.tsx` component demonstrates these helpers in a simple UI. Embed it inside `StripeProvider` to list test prices and perform mock purchases:

```tsx
import { StripeProvider } from '../providers/StripeProvider'
import Dashboard from '../dashboard/Dashboard'

export default function Page() {
  return (
    <StripeProvider>
      <Dashboard />
    </StripeProvider>
  )
}
```

Running this page in your React or Next.js app displays a list of prices and a **Buy** button for each entry. Transactions use test card tokens so no real charges occur.
