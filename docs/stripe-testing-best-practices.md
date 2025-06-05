# Best Practices for Stripe Testing Environments

Stripe supports test mode and sandboxes for validating payment integrations. Sandboxes offer isolated configurations with their own API keys and data so you can test without affecting other environments.

- **Use test cards and test API keys.** The documentation notes:
  > To confirm that your integration works correctly, simulate transactions without moving any money using special values while in test mode or Sandboxes.
  > Any time you work with a test card, use test API keys in all API calls. This is true whether you’re serving a payment form to test interactively or writing test code.
- **Avoid load testing.** Stripe warns:
  > Because of rate limits, we don’t recommend that you use testing environments to load-test your integration.
- **Configure webhooks and API credentials per environment.** Each sandbox generates its own API keys and webhook settings. Keep these separate from production and manage them securely like live keys.
- **Limitations.** Accounts currently support up to five sandboxes. Plan your workflow accordingly or use additional accounts if more isolated environments are required.
- **Copy settings or start from scratch.** When creating a sandbox you can clone your existing account configuration or begin with a blank environment depending on your test needs.
- **Use automated tests with Stripe's SDKs.** Combine API-driven tests with mocked UI interactions to verify complex scenarios like disputes or payment method errors.

See Stripe's [Testing](https://docs.stripe.com/testing) guide for the official reference.
