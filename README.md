# contexts


## Documentation

- [Stripe Testing Best Practices](docs/stripe-testing-best-practices.md)

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

Use the `stripe` library with your secret key stored in `STRIPE_SK` to create a
SetupIntent for an existing customer. The publishable key can be accessed via
`STRIPE_PK` on the client if needed.

```ts
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SK as string, {
    apiVersion: '2022-11-15',
});

export async function createSetupIntent(customerId: string) {
    return stripe.setupIntents.create({
        usage: 'off_session',
        customer: customerId,
    });
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
