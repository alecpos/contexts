# Stripe-Context header

Perform API operations on related accounts.

By default, API requests execute on the Stripe account that generated the accompanying [API key](https://docs.stripe.com/keys.md). However, you can use the `Stripe-Context` header to perform an API request in the context of a related account.

The `Stripe-Context` header supersedes the `Stripe-Account` header, which facilitates [performing API operations on connected accounts](https://docs.stripe.com/connect/authentication.md). `Stripe-Context` expands the scope and the types of related accounts they can access.

## API request scope

You can make API requests to operate within different scopes:

- Your own account
- Any connected account in your platform
- Any v2 account with at least the merchant or recipient configuration

When you make an API request targeting an account other than that of the API key, you must identify the intended account by including the `Stripe-Context` header. The value depends on the relative relationship of the intended account to the [API key](https://docs.stripe.com/keys.md) used to make the request.

For example, consider an organization with multiple platform accounts representing different business lines. Each platform has connected accounts and one connected account has a recipient account.

Given this business structure, it’s possible to perform API requests using several different scopes. The following table shows the `Stripe-Context` format for each different scope that requires context based on its relationship to the account the requesting API key belongs to.

| Requesting API key owner | Scope account | Stripe-Context format                                    |
| ------------------------ | ------------- | -------------------------------------------------------- |
| Rocket Rides             | Driver Smith  | Connected account ID: `acct_111a`                        |
| Rocket Deliveries        | Courier Vega  | Connected account ID: `acct_333a`                        |
| Rocket Rides             | Fuel City     | Connected account ID/Recipient ID: `acct_111a/acct_111b` |

## Example use cases

The following code sample shows a request where the Rocket US platform retrieves the available bank accounts for the recipient of its connected account. The recipient is the _grandchild_ of the platform, so the context uses the format `<connected account ID>/<recipient ID>`.

```curl
curl https://api.stripe.com/v2/core/vault/us_bank_accounts \
  -H "Authorization: Bearer {{PLAT_SECRET_KEY}}" \
  -H "Stripe-Version: 2025-03-31.preview" \
  -H "Stripe-Context: acct_111a/acct_111b"
```

```javascript
const stripeClient = StripeClient('{{PLAT_SECRET_KEY}}', stripe_context='acct_111a/acct_111b')
const bankAccounts = await stripeClient.v2.core.vault.usBankAccounts.retrieve('usba_test_123')
```