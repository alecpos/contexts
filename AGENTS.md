Thank you for the clarification.

Here is the **refactored `AGENTS.md`** where all Stripe integration guidance is updated to:

* **Reference `STRIPE_PK` and `STRIPE_SK` from `.env`**
* **Use direct `curl` HTTP requests only**
* **Remove any mention of `stripe-js`, `loadStripe`, or frontend SDK usage**
* **Preserve the context-provider-first architecture**
* **Align with test-driven integration patterns**

---

# AGENTS.md (Refactored for HTTP-based Stripe Integration)

**Last Updated:** 2025-06-05

## 🧠 Purpose

This file defines standards for AI agents and human developers contributing to the project. It enforces a **context-provider-first** architecture and validates integration with **real third-party APIs** (e.g., Stripe) using **HTTP requests only via `curl` or fetch**.

---

## 📁 Project Structure & Conventions

### 🔍 Key Paths

* `bioverse-app/bioverse-client/app/`: Main Next.js application.
* `providers/`: All external service integrations (Stripe, RudderStack, Supabase).
* `utils/`: Shared logic and HTTP abstraction layers.
* `components/`: UI-only components (no API logic).
* `pages/`: Next.js route handlers.
* `types/`: Shared TypeScript definitions.
* `styles/`, `public/`: Design assets.

### 🔄 Data & State Flow

* **UI state**: Handled with React hooks.
* **External state**: Encapsulated in **React Context Providers**.
* **API interactions**: Use `fetch`/`curl` with secrets from `.env`.

---

## 🧩 Design Patterns & Principles

### ✅ Required Patterns

* Wrap third-party logic inside **context providers**.
* Access providers via custom hooks (`useStripe`, `useSupabase`, etc.).
* Separate side effects (containers) from view components (presenters).
* Validate integration using **real HTTP responses**.
* Drive implementation with **test-first development**.

---

## 🧪 Stripe Integration & Testing

### 🏗️ Provider Contract: `StripeProvider`

Stripe logic must avoid `stripe-js` and instead use `fetch` or `curl` to talk directly to Stripe’s REST API. All API keys must be sourced from `.env`.

```ts
export const StripeProvider = ({ children }: PropsWithChildren) => {
  const [customerId, setCustomerId] = useState<string | null>(null)
  const [clientSecret, setClientSecret] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const createCustomerAndIntent = async () => {
      try {
        const sk = process.env.STRIPE_SK
        if (!sk) throw new Error('STRIPE_SK not set')

        const customer = await fetch('https://api.stripe.com/v1/customers', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${sk}`,
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        }).then(res => res.json())

        const intent = await fetch('https://api.stripe.com/v1/setup_intents', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${sk}`,
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: new URLSearchParams({
            customer: customer.id,
            usage: 'off_session',
          }),
        }).then(res => res.json())

        setCustomerId(customer.id)
        setClientSecret(intent.client_secret)
      } catch (err: any) {
        setError(err.message || 'Stripe setup failed')
      }
    }

    createCustomerAndIntent()
  }, [])

  return (
    <StripeContext.Provider value={{ customerId, clientSecret, error }}>
      {children}
    </StripeContext.Provider>
  )
}
```

---

### 🔍 Hook Contract: `useStripe()`

```ts
export const useStripe = () => {
  const context = useContext(StripeContext)
  if (!context) throw new Error('useStripe must be used within StripeProvider')
  return context
}
```

---

### ✅ Stripe Function Guidelines

* Never use `loadStripe` or Stripe SDKs.
* Use `.env` variables: `STRIPE_PK` for frontend token usage (if needed), `STRIPE_SK` for server-side calls.
* Use direct `curl` or `fetch` requests to Stripe’s API.
* Simulate payments via Stripe test card numbers and test-mode keys.
* Log all failures through RudderStack or your logging provider.

---

### 🧪 Test Strategy

```ts
describe('StripeProvider', () => {
  it('initializes a customer and setup intent', async () => {
    render(<StripeProvider><TestComponent /></StripeProvider>)
    await waitFor(() => {
      const { clientSecret, customerId } = useStripe()
      expect(customerId).toMatch(/^cus_/)
      expect(clientSecret).toMatch(/^seti_/)
    })
  })

  it('fails if STRIPE_SK is missing', async () => {
    process.env.STRIPE_SK = ''
    render(<StripeProvider><TestComponent /></StripeProvider>)
    await waitFor(() => expect(useStripe().error).toBeTruthy())
  })
})
```

---

## 🎯 AI Agent Objectives

When generating code for Stripe integration:

* Always use `StripeProvider` abstraction.
* Use `fetch` or `curl` with secret keys, never SDKs.
* Drive implementation via real test card numbers and sandbox API keys.
* Abstract secret-dependent logic into the provider layer only.
* Use `.env` exclusively for `STRIPE_PK` and `STRIPE_SK`.

---

## ⚙️ Tooling Requirements

* `.env.example` must include:

```env
STRIPE_PK=
STRIPE_SK=
```

* All payment logic must be testable with curl. Example:

```bash
curl https://api.stripe.com/v1/setup_intents \
  -u $STRIPE_SK: \
  -d "customer=cus_123" \
  -d "usage=off_session"
```

---

## 📝 Pull Requests & Collaboration

* Prefix commits with `feat:`, `fix:`, `test:`, etc.
* Ensure real test coverage (not mocks) for all `StripeProvider` flows.
* Include `.env` diffs and test card numbers used in local validation.

---

## 📖 Integration Examples

✅ **Correct**

```ts
const { customerId, clientSecret } = useStripe()

useEffect(() => {
  if (!clientSecret) return
  fetch('/api/charge', {
    method: 'POST',
    body: JSON.stringify({ customerId, clientSecret }),
  })
}, [clientSecret])
```

🚫 **Incorrect**

```ts
const stripe = await loadStripe('pk_test_...')
stripe.confirmPayment(...)
```

---

Let me know if you'd like this split into nested `AGENTS.md` files per provider (e.g. `providers/stripe/AGENTS.md`) or want curl examples for payment method updates or subscription workflows.
