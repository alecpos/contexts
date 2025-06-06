# contexts


## Documentation

- [Stripe Testing Best Practices](docs/stripe-testing-best-practices.md)
- [Stripe Integration Guide](docs/stripe-integration-guide.md)

## SupabaseProvider

`SupabaseProvider` creates a client instance using your project's Supabase
credentials and exposes it through the `useSupabaseContext` hook. To configure
the provider you must set the following environment variables in a `.env` file
or in your deployment settings:

```bash
NEXT_PUBLIC_SUPABASE_URL=<your project url>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your anon key>
```

For more information on obtaining these values see the [Supabase getting
started docs](https://supabase.com/docs/guides/getting-started/quickstarts/nextjs).

### Usage

Wrap your application's root layout in `SupabaseProvider` and access the client
and the active session via `useSupabaseContext`.

```tsx
// app/layout.tsx
import { SupabaseProvider } from './providers/SupabaseProvider';

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return <SupabaseProvider>{children}</SupabaseProvider>;
}
```

```tsx
// Example component
'use client';
import { useSupabaseContext } from '@/app/providers/SupabaseProvider';

export default function Example() {
    const { client, session } = useSupabaseContext();

    const loadProfile = async () => {
        const { data } = await client.from('profiles').select('*');
        console.log(session?.user, data);
    };

    return <button onClick={loadProfile}>Load Profile</button>;
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
