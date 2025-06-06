# Stripe Testing Best Practices

Stripe provides special testing resources to help you verify your integration. Always perform your tests in **test mode** using test API keys and tokens.

- Use the [test card numbers](https://stripe.com/docs/testing#international-cards) and test bank account information to simulate different outcomes.
- Isolate scenarios in [Sandboxes](https://stripe.com/docs/sandboxes) when you need separate environments for teams or partners.
- Automate recurring flows with [test clocks](https://stripe.com/docs/billing/testing/test-clocks) to advance subscriptions through time.
- Avoid using real payment method details in your tests. The [Stripe Services Agreement](https://stripe.com/legal/ssa) prohibits testing in live mode with real data.

For more guidance, see the official [Testing](https://stripe.com/docs/testing) docs.
