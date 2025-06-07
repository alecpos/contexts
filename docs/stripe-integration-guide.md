# Stripe Integration Guide

This project integrates directly with the Stripe API. All requests use the secret key stored in the `STRIPE_SK` environment variable and fall back to `curl` when a standard fetch fails.

## Configuring API keys

Create a `.env` file in the project root with the test keys from your Stripe dashboard:

```bash
STRIPE_PK=pk_test_...
STRIPE_SK=sk_test_...
```

Use the corresponding live keys (`pk_live_`/`sk_live_`) when deploying to production.

## Basic request pattern

Every helper in `services/stripe/http.ts` logs the request, calls Stripe using `fetch`, and automatically retries using `curl` if the network request fails. This approach ensures reliability even without Node fetch network access.

## Example endpoints

### Create a SetupIntent
```bash
curl https://api.stripe.com/v1/setup_intents \
  -u $STRIPE_SK: \
  -d customer=cus_123 \
  -d usage=off_session
```

### Retrieve a customer
```bash
curl https://api.stripe.com/v1/customers/cus_123 -u $STRIPE_SK:
```

### Create a product and price
```bash
curl https://api.stripe.com/v1/products -u $STRIPE_SK: -d name="Demo"

curl https://api.stripe.com/v1/prices \
  -u $STRIPE_SK: \
  -d unit_amount=500 \
  -d currency=usd \
  -d product=prod_123
```

## Switching modes

Using test keys keeps all operations in *test mode*. Replace them with live keys only when you intend to process real charges. Never expose your secret key in client-side code.

For additional testing advice see [Stripe Testing Best Practices](./stripe-testing-best-practices.md).
