Here is a rewritten version of `AGENTS.md` that aligns with your goal of guiding an LLM (or any contributor) to expand Stripe-related context and test functions against real API calls or Stripe.js. This version is structured to follow a **test-driven development** (TDD) approach and prioritize **provider-based architecture** with clear examples, strict integration boundaries, and robust validation hooks:

---

# AGENTS.md

**Last Updated:** 2025-06-05

## 🧠 Purpose

This file serves as a definitive guide for **AI agents** (e.g., OpenAI Codex, GPT-4o) and **human developers** contributing to the project. It defines standards for code generation, service integrations, and validation using real APIs (e.g., Stripe.js) in a **context-provider-first** architecture. This is a **living document**—please update it alongside any changes to our provider interfaces or integration workflows.

---

## 📁 Project Structure & Conventions

### 🔍 Key Paths

* `bioverse-app/bioverse-client/app/`: Root of the main Next.js application.
* `providers/`: All third-party integrations (Stripe, RudderStack, Supabase) must live here.
* `utils/`: Shared utilities, including API wrappers and controller functions.
* `components/`: Reusable UI logic; must not directly reference third-party SDKs.
* `pages/`: Next.js route handlers.
* `types/`: Centralized TypeScript types and enums.
* `styles/`, `public/`: CSS modules and static assets.

### 🔄 Data & State Flow

* **UI state**: Managed via React hooks.
* **Third-party state**: Isolated inside React **Context Providers**.
* **API calls**: Routed through `utils/database/controller/` or tested directly via the providers.

---

## 🧩 Design Patterns & Principles

### ✅ Required Patterns

* Use **context providers** for all external SDKs or services.
* Use **custom hooks** to access provider context (`useStripe`, `useSupabase`, `useRudderStack`).
* Apply **container/presenter** component separation for side effects vs rendering.
* Prefer **composition over inheritance**.
* Apply **TDD** by starting with provider tests that validate integration with the real API.

---

## 🧪 Stripe Integration & Testing

### 🏗️ Provider Contract: `StripeProvider`

```tsx
export const StripeProvider = ({ children }: PropsWithChildren) => {
  const [stripe, setStripe] = useState<Stripe | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadStripe(process.env.NEXT_PUBLIC_STRIPE_KEY!)
      .then(setStripe)
      .catch(err => {
        setError(err.message)
        // TODO: Log to RudderStack
      })
  }, [])

  return (
    <StripeContext.Provider value={{ stripe, error }}>
      {children}
    </StripeContext.Provider>
  )
}
```

### 🔍 Hook Contract: `useStripe()`

```ts
export const useStripe = () => {
  const context = useContext(StripeContext)
  if (!context) throw new Error('useStripe must be used within StripeProvider')
  return context
}
```

### ✅ Stripe Function Guidelines

* **All payment operations must go through the `StripeProvider` context.**
* Always use `stripe.confirmPayment(...)` or `stripe.redirectToCheckout(...)` inside validated test flows.
* Validate test mode behavior using actual Stripe test cards.
* Example function for payment:

```ts
/**
 * Charges the user using a test card.
 * @param amount - Payment amount in cents
 * @returns Promise resolving to confirmation result
 */
export async function processTestPayment(amount: number) {
  const { stripe } = useStripe()
  return await stripe?.confirmCardPayment(clientSecret, { payment_method: { card } })
}
```

---

## 🧪 Test-Driven Context Provider Validation

### 📋 Validation Rules

| Requirement                           | Check |
| ------------------------------------- | ----- |
| Provider initialization tested        | ✅     |
| API keys read from `.env`             | ✅     |
| Service mocked in unit tests          | ✅     |
| Calls succeed using Stripe test data  | ✅     |
| Errors logged via RudderStack         | ✅     |
| Loading, retry, fallback states exist | ✅     |

### 🧪 Test Strategy

```ts
describe('StripeProvider', () => {
  it('initializes Stripe from env key', async () => {
    render(<StripeProvider><TestChild /></StripeProvider>)
    await waitFor(() => expect(useStripe().stripe).not.toBeNull())
  })

  it('falls back gracefully on error', async () => {
    process.env.NEXT_PUBLIC_STRIPE_KEY = 'bad-key'
    render(<StripeProvider><TestChild /></StripeProvider>)
    await waitFor(() => expect(useStripe().error).not.toBeNull())
  })
})
```

---

## 🎯 AI Agent Objectives

When guiding an LLM:

* **Always** use or extend the `StripeProvider` pattern (no raw `stripe = loadStripe(...)` in random files).
* Start with **integration tests** and provider bootstraps before any UI work.
* Use **real test-mode API keys** and ensure the LLM validates behavior using test cards.
* Refactor or generate only **inside** the provider abstraction.
* Prefer `stripe-js` for frontend payment logic (not the Node.js SDK).

---

## 🧱 Other Providers

### RudderStackProvider

* Tracks page views, events, and provider lifecycle.
* Must wrap any event-tracking logic in `trackEvent(...)`.

### SupabaseProvider

* Manages auth, session, and CRUD with Supabase.
* Abstracts all `supabase.from(...).select()` calls into composable hooks.

---

## 🧑‍💻 Coding & Style Conventions

| Rule       | Value                                                                               |
| ---------- | ----------------------------------------------------------------------------------- |
| Language   | TypeScript                                                                          |
| Components | Functional (React)                                                                  |
| Formatting | Prettier + 2-space indent                                                           |
| Quotes     | Single                                                                              |
| Naming     | `PascalCase` for components, `camelCase` for vars, `UPPER_SNAKE_CASE` for constants |

---

## 📝 Pull Requests & Collaboration

### PR Format

* Title: `[Type] Short description` (e.g., `[Feature] Add Stripe test hook`)
* Body: Integration notes, screenshots, config diffs.
* Include: Service validation steps (e.g., “Stripe test card succeeded”)

### Commits

* Squash unless otherwise directed.
* Use commit prefixes: `feat:`, `fix:`, `chore:`, `test:`.
* Example: `feat: validate StripeProvider retry logic on 402 error`

---

## ⚙️ Advanced Tooling

* Place `AGENTS.md` in all key subdirs (`providers/`, `components/`) to scope rules.
* `.env.example` must document:

  * `NEXT_PUBLIC_STRIPE_KEY`
  * `SUPABASE_URL`
  * `RUDDERSTACK_WRITE_KEY`

---

## 📖 Integration Examples

✅ **Correct**

```tsx
const Checkout = () => {
  const { stripe } = useStripe()
  const { trackEvent } = useRudderStack()
  const { user } = useSupabase()

  const handlePayment = async () => {
    trackEvent('Payment Initiated', { userId: user.id })
    try {
      const result = await stripe.confirmPayment({ clientSecret })
      trackEvent('Payment Success', { paymentId: result.id })
    } catch (err) {
      trackEvent('Payment Failed', { error: err.message })
    }
  }
}
```

🚫 **Incorrect**

```ts
// Don't do this
const stripe = await loadStripe('hardcoded-key')
stripe.confirmPayment(...)
```

---

By enforcing these conventions, all generated or human-authored code will be **testable, monitorable, and safely integrated** into our architecture. This enables AI agents and developers alike to **build and validate new functionality with confidence**, especially in sensitive areas like payments, analytics, and authentication.

---

Let me know if you'd like this broken into nested `AGENTS.md` documents under `providers/stripe/` or other modules.
