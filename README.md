# contexts


## Documentation

- [Stripe Testing Best Practices](docs/stripe-testing-best-practices.md)
- [Stripe Integration Guide](docs/stripe-integration-guide.md)
- [Dashboard Guide](docs/dashboard-guide.md)
- [Stripe API Reference](docs/stripe)
- [Stripe Request Examples](docs/stripe/examples.md)

## SupabaseProvider

`SupabaseProvider` performs direct REST requests to your Supabase project using
the service role key and exposes helpers through the `useSupabase` hook. It is a
**server component** so your secret key never reaches the browser. Configure it
with the following environment variables:

```bash
SUPABASE_URL=<your project url>
SUPABASE_SERVICE_KEY=<your service role key>
```

For more information on obtaining these values see the [Supabase API
documentation](https://supabase.com/docs/guides/api).

### Usage

Wrap your application's root layout in `SupabaseProvider` and access the helper
functions via `useSupabase`.

```tsx
// app/layout.tsx
import { SupabaseProvider } from './providers/SupabaseProvider';

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return <SupabaseProvider>{children}</SupabaseProvider>;
}
```

```tsx
// Example server component
import { useSupabase } from '@/app/providers/SupabaseProvider';

export default async function Example() {
    const { select } = useSupabase();
    const profiles = await select('profiles', 5);
    return <pre>{JSON.stringify(profiles, null, 2)}</pre>;
}
```

## SetupIntent Example

Create a SetupIntent using a direct HTTP request. The secret key is read from
`STRIPE_SK` and sent via the `Authorization` header.

```ts
export async function createSetupIntent(customerId: string) {
  const sk = process.env.STRIPE_SK
  if (!sk) throw new Error('STRIPE_SK not set')

  const body = new URLSearchParams({
    customer: customerId,
    usage: 'off_session',
  })

  const res = await fetch('https://api.stripe.com/v1/setup_intents', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${sk}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body,
  })
  return res.json()
}
```

## Testing

Unit tests use **Jest** with **ts-jest** so TypeScript sources compile during the
test run. Install dependencies and execute the test suite with npm:

```bash
npm install
npm test
```

The provided configuration uses a lightweight `tsconfig.json` along with a
`jest` preset defined in `package.json`.
