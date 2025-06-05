# Sandboxes

Test Stripe functionality in an isolated environment.

A sandbox is an isolated test environment. You can use your sandbox to test Stripe functionality in your account, and experiment with new features without affecting your live integration. For example, when testing in a sandbox, the payments you create aren’t processed by card networks or payment providers.

## Use cases

Sandboxes provide an environment for testing various functionalities and scenarios without the implications of real transactions. Below are some common use cases for sandboxes in your Stripe integrations:

| Scenario                                                       | Description                                                                                                                                                                                                                                                                                     |
| -------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Simulate Stripe events to test without real money movement** | Use your sandbox to test payments functionality without real money movement. Create payments in your business account to accumulate a fake balance or use test helpers to simulate external events.                                                                                             |
| **Scale isolated sandboxes for teams**                         | Your team can [test in separate sandboxes](https://docs.stripe.com/sandboxes/dashboard/manage.md#create-a-sandbox) to make sure that data and actions are completely isolated from other sandboxes. Changes made in one sandbox don’t interfere with changes in another.                        |
| **Invite external users**                                      | [You can invite another user](https://docs.stripe.com/sandboxes/dashboard/manage-access.md#grant-users-access-to-a-specific-sandbox), such as an implementation partner or design agency, to access all sandboxes, or a specific sandbox, without providing them access to your live mode data. |
| **Test in the Dashboard or the CLI**                           | Access your sandbox from the Dashboard or the [Stripe CLI](https://docs.stripe.com/stripe-cli/overview.md). Test Stripe functionality directly in the Dashboard or use familiar CLI commands and [fixtures](https://docs.stripe.com/cli/fixtures).                                              |

## Manage sandboxes in the Dashboard

To access sandboxes, click **Sandboxes** within the Dashboard account picker. Depending on your permissions, you can view, create, delete, and open sandboxes from the sandboxes overview page. To manage user access and API keys for a specific sandbox, first open the sandbox and then manage those settings directly within the sandbox. Learn more about [managing your sandbox](https://docs.stripe.com/sandboxes/dashboard/manage.md).

## Test in a sandbox

You can simulate payments and use test cards to test your integration without moving money. Learn more about [using test cards to confirm that your integration works correctly](https://docs.stripe.com/testing.md).

## Limitations

- You can’t test *IC+* pricing in a sandbox.
- You can’t create connections between a Connect platform’s sandbox and connected account sandboxes.