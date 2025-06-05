# Testing Stripe Billing

Learn how to test your Billing integration.

- Use test [cards](https://docs.stripe.com/testing.md#cards) and [account numbers](https://docs.stripe.com/testing.md#test-account-numbers) to trigger different scenarios, like payment failures or required authentication.
- Use [test clocks](https://docs.stripe.com/billing/testing/test-clocks.md) to simulate Billing objects through time and test events at different milestones, like the end of a free trial or annual plan.
- Read the [general testing doc](https://docs.stripe.com/testing.md) to learn about fundamental testing common to all of Stripe.

Thoroughly test your integration before you expose it to customers or use it for any live activity. Use the resources on this page in addition to any organizational guidelines (for example, runbooks, quality gates, or development checklists) to help determine whether your integration is production-ready.

## Go-live principles

Before taking your integration live, review these Stripe checklists:

- [Account checklist](https://docs.stripe.com/get-started/account/checklist.md)
- [Development checklist](https://docs.stripe.com/get-started/checklist/go-live.md)
- [Website checklist](https://docs.stripe.com/get-started/checklist/website.md)

Here’s what a typical integration flow looks like.

For subscription and recurring revenue integrations, make sure that, at a minimum, the following components work as expected.

The table lists the event notifications for each component. You can configure your integration to listen for these events with *webhook*s. Read this guide to learn more about [event notifications](#webhooks) and testing.

| Component                   | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          | Events                                                                                                                                                                                                           |
| --------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Customer sign-up**        | Make sure your integration can successfully collect the information you need to create a Customer record in Stripe. Your customers can enter that information through Payment Links  Checkout, *Elements*, or a completely custom payment form built with the [Stripe API](https://docs.stripe.com/api.md). No matter which form you use, make sure that you see the Customer object stored on Stripe. You can use the Dashboard or API to view and [manage Customers](https://docs.stripe.com/billing/customer.md#manage-customers).                                                                                                                                                                | - `customer.created`
  - `customer.subscription.created`                                                                                                                                                         |
| **Invoicing**               | Subscriptions generate *Invoices* at the end of each billing cycle. Depending on your payment collection method, you may send an invoice to collect payment in arrears or to confirm an automatic charge. Make sure that your integration creates and sends invoices as you expect. Read the guide to learn more about creating and managing [invoices for subscriptions](https://docs.stripe.com/billing/invoices/subscription.md). You can use test clocks to simulate billing cycles, which include generating and sending invoices. Read the test clocks guide to learn about specific [use cases](https://docs.stripe.com/billing/testing/test-clocks/api-advanced-usage.md#use-cases) to test. | - `invoice.created`
  - `invoice.finalized`
  - `invoice.finalization_failed`
  - `invoice.paid`
  - `invoice.payment_action_required`
  - `invoice.payment_failed`
  - `invoice.upcoming`
  - `invoice.updated` |
| **Subscription management** | Set up the *customer portal* to let your customers manage their *subscriptions* and billing information. To test it, create a subscription in a *sandbox*. Then, log in to the portal as the test user and update the subscription. Check the Dashboard or API to see whether the subscription reflects the customer’s change. Read the [integration guide](https://docs.stripe.com/customer-management.md) to learn how to set up the customer portal.                                                                                                                                                                                                                                              | - `customer.subscription.deleted`
  - `customer.subscription.paused`
  - `customer.subscription.resumed`
  - `customer.subscription.updated`                                                                     |
| **Trials**                  | Offer customers a trial of your service. To test that your trial is set up correctly, you can create a test clock. The subscription should generate a zero-value invoice for the trial period. [Learn how to test trials with test clocks](#trials). For more information about how trials work, read the [subscription trials guide](https://docs.stripe.com/billing/subscriptions/trials.md).                                                                                                                                                                                                                                                                                                      | - `customer.subscription.trial_will_end`
  - `customer.subscription.updated`                                                                                                                                     |
| **Payment failures**        | Payments from your customers may fail for a number of reasons. Make sure your integration can handle failures, including retrying payments. [Learn how to test payment failures](#payment-failures).                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 | - `invoice.finalization_failed`
  - `invoice.payment_failed`
  - `invoice.payment_action_required`                                                                                                               |

## Test clocks

Test clocks allow you to simulate Billing objects, like *subscriptions*, through time in a *sandbox* so you don’t have to wait a year to see how your integration handles a payment failure for an annual renewal. You don’t need to write any code with test clocks: you can create simulations in the Dashboard. You can also access them through the API. Learn more about [test clocks](https://docs.stripe.com/billing/testing/test-clocks.md) and common [use cases](https://docs.stripe.com/billing/testing/test-clocks.md) for them.

## Test subscription trial periods 

First, follow these steps to start using test clocks:

1. [Create a test clock](https://docs.stripe.com/billing/testing/test-clocks/api-advanced-usage.md#create-clock)
1. [Set up your testing simulation](https://docs.stripe.com/billing/testing/test-clocks/api-advanced-usage.md#setup-simulation)
1. [Advance the clock’s time](https://docs.stripe.com/billing/testing/test-clocks/api-advanced-usage.md#advance-clock)
1. [Monitor and handle the changes](https://docs.stripe.com/billing/testing/test-clocks/api-advanced-usage.md#monitor-changes)
1. [Update the simulation](https://docs.stripe.com/billing/testing/test-clocks/api-advanced-usage.md#update-simulation)

Next, you can start testing trials with test clocks. Let’s say that you want customers to try your product for free with a seven-day trial before they start paying and want to collect payment information up front. To simulate this situation using test clocks, follow these steps:

- Create a new test clock and set its `frozen_time` to January 1.
- Add a customer and include their payment method. In this case, use a 4242424242424242 [test card](https://docs.stripe.com/testing.md#cards).
- Create a subscription and add a seven-day free trial period:

To add a trial period to an existing subscription using the Dashboard:

Find the subscription you want to change.

1. Click **Actions**.
1. Click **Update subscription**.
1. Click **Add free trial** and enter seven in **Free trial days** field.
1. Click **Update subscription**.

You can start a customer’s subscription with a free trial period by providing a `trial_period_days=7` argument when creating the subscription:

```dotnet
StripeConfiguration.ApiKey = "<<secret key>>";

var options = new SubscriptionCreateOptions
{
    Customer = "<<customer>>",
    Items = new List<SubscriptionItemOptions>
    {
        new SubscriptionItemOptions { Price = "<<price>>" },
    },
    TrialEnd = DateTimeOffset.FromUnixTimeSeconds(1610403705).UtcDateTime,
};
var service = new SubscriptionService();
Subscription subscription = service.Create(options);
```

```go
stripe.Key = "<<secret key>>"

params := &stripe.SubscriptionParams{
  Customer: stripe.String("<<customer>>"),
  Items: []*stripe.SubscriptionItemsParams{
    &stripe.SubscriptionItemsParams{Price: stripe.String("<<price>>")},
  },
  TrialEnd: stripe.Int64(1610403705),
};
result, err := subscription.New(params);
```

```java
Stripe.apiKey = "<<secret key>>";

SubscriptionCreateParams params =
  SubscriptionCreateParams.builder()
    .setCustomer("<<customer>>")
    .addItem(SubscriptionCreateParams.Item.builder().setPrice("<<price>>").build())
    .setTrialEnd(1610403705L)
    .build();

Subscription subscription = Subscription.create(params);
```

```node
const stripe = require('stripe')('<<secret key>>');

const subscription = await stripe.subscriptions.create({
  customer: '<<customer>>',
  items: [
    {
      price: '<<price>>',
    },
  ],
  trial_end: 1610403705,
});
```

```python
import stripe
stripe.api_key = "<<secret key>>"

subscription = stripe.Subscription.create(
  customer="<<customer>>",
  items=[{"price": "<<price>>"}],
  trial_end=1610403705,
)
```

```php
$stripe = new \Stripe\StripeClient('<<secret key>>');

$subscription = $stripe->subscriptions->create([
  'customer' => '<<customer>>',
  'items' => [['price' => '<<price>>']],
  'trial_end' => 1610403705,
]);
```

```ruby
Stripe.api_key = '<<secret key>>'

subscription = Stripe::Subscription.create({
  customer: '<<customer>>',
  items: [{price: '<<price>>'}],
  trial_end: 1610403705,
})
```

- After creating a subscription with a seven-day free trial period, a subscription is created in a `trialing` state. An invoice of $0.00 is generated due to the free trial.
- Advance the date to January 5 to see the [customer.subscription.trial_will_end](https://docs.stripe.com/api/events/types.md#event_types-customer.subscription.trial_will_end) event notification. Stripe sends the notification three days before the trial ends. You can use this webhook event to inform your customers that the trial ends soon.
- Advance the date to January 8 to see that the subscription is now `paid` and an invoice for  is created.
- Advance the date by one cycle (for example, to February 8 for a monthly subscription) to see the subscription renew successfully.

### Test trial periods without test clocks

To test how your integration handles trial periods without waiting a full trial period to see the results, create a new *subscription* with a `trial_end` value a few minutes in the future. If you use Checkout, set the [trial_end](https://docs.stripe.com/api/subscriptions/create.md#create_subscription-trial_end) value to at least 2 days.

## Test subscription webhook notifications 

Subscriptions integrations rely heavily on *webhooks*. You set up a webhook endpoint on your server and specify which event notifications to listen for. Stripe emits notifications for events like a subscription upgrade or cancellation.

You can test webhooks by either creating actual test subscriptions or by triggering event notifications with the [Stripe CLI](https://docs.stripe.com/stripe-cli.md) or through the [Dashboard](https://dashboard.stripe.com/test/account/webhooks).

After you set up the Stripe CLI and link to your Stripe account, you can trigger events from the [subscription lifecycle](https://docs.stripe.com/billing/subscriptions/overview.md#subscription-lifecycle) to test your webhook integration. If you use the Stripe CLI to trigger events, you can see event notifications on your server as they come in, which allows you to check your webhook integration directly without network tunnels or firewalls.

When you use the Stripe CLI or the Dashboard to trigger events, the event your webhook receives contains fake data that doesn’t correlate to subscription information. The most reliable way to test webhook notifications is to create actual test subscriptions and handle the corresponding events.

The following table describes the most common events related to subscriptions and, where applicable, suggests actions for handling the events.

| Event                                             | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| ------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `customer.created`                                | Sent when a [Customer](https://docs.stripe.com/api/customers/object.md) is successfully created.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| `customer.subscription.created`                   | Sent when the subscription is created. The subscription `status` might be `incomplete` if customer authentication is required to complete the payment or if you set `payment_behavior` to `default_incomplete`. View [subscription payment behavior](https://docs.stripe.com/billing/subscriptions/overview.md#subscription-payment-behavior) to learn more.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| `customer.subscription.deleted`                   | Sent when a customer’s subscription ends.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| `customer.subscription.paused`                    | Sent when a subscription’s `status` changes to `paused`.
  For example, this is sent when a subscription is [configured](https://docs.stripe.com/api/subscriptions/create.md#create_subscription-trial_settings-end_behavior-missing_payment_method) to pause when a [free trial ends without a payment method](https://docs.stripe.com/billing/subscriptions/trials.md#create-free-trials-without-payment).
  Invoicing won’t occur until the subscription is [resumed](https://docs.stripe.com/api/subscriptions/resume.md).
  We don’t send this event if [payment collection is paused](https://docs.stripe.com/billing/subscriptions/pause-payment.md) because invoices continue to be created during that time period.                                                                                                                                                                                                                                                                                                                    |
| `customer.subscription.resumed`                   | Sent when a subscription previously in a `paused` status is resumed. This doesn’t apply when [payment collection is unpaused](https://docs.stripe.com/billing/subscriptions/pause-payment.md#unpausing).                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| `customer.subscription.trial_will_end`            | Sent three days before the [trial period ends](https://docs.stripe.com/billing/subscriptions/trials.md). If the trial is less than three days, this event is triggered.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| `customer.subscription.updated`                   | Sent when a subscription starts or [changes](https://docs.stripe.com/billing/subscriptions/change.md). For example, renewing a subscription, adding a coupon, applying a discount, adding an invoice item, and changing plans all trigger this event.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| `entitlements.active_entitlement_summary.updated` | Sent when a customer’s active entitlements are updated. When you receive this event, you can provision or de-provision access to your product’s features. Read more about [integrating with entitlements](https://docs.stripe.com/billing/entitlements.md).                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| `invoice.created`                                 | Sent when an invoice is created for a new or renewing subscription. If Stripe fails to receive a successful response to `invoice.created`, then finalizing all invoices with [automatic collection](https://docs.stripe.com/invoicing/integration/automatic-advancement-collection.md) is delayed for up to 72 hours. Read more about [finalizing invoices](https://docs.stripe.com/invoicing/integration/workflow-transitions.md#finalized).
  * Respond to the notification by sending a request to the [Finalize an invoice](https://docs.stripe.com/api/invoices/finalize.md) API.                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| `invoice.finalized`                               | Sent when an invoice is successfully finalized and ready to be paid.
  * You can send the invoice to the customer. View [invoice finalization](https://docs.stripe.com/invoicing/integration/workflow-transitions.md#finalized) to learn more.
  * Depending on your settings, we automatically charge the default payment method or attempt collection. View [emails after finalization](https://docs.stripe.com/invoicing/integration/workflow-transitions.md#emails) to learn more.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| `invoice.finalization_failed`                     | The invoice couldn’t be finalized. Learn how to [handle invoice finalization failures](https://docs.stripe.com/tax/customer-locations.md#finalizing-invoices-with-finalization-failures) by reading the guide. Learn more about [invoice finalization](https://docs.stripe.com/invoicing/integration/workflow-transitions.md#finalized) in the invoices overview guide.
  * Inspect the Invoice’s [last_finalization_error](https://docs.stripe.com/api/invoices/object.md#invoice_object-last_finalization_error) to determine the cause of the error.
  * If you’re using Stripe Tax, check the Invoice object’s [automatic_tax](https://docs.stripe.com/api/invoices/object.md#invoice_object-last_finalization_error) field.
  * If `automatic_tax[status]=requires_location_inputs`, the invoice can’t be finalized and payments can’t be collected. Notify your customer and collect the required [customer location](https://docs.stripe.com/tax/customer-locations.md).
  * If `automatic_tax[status]=failed`, retry the request later. |
| `invoice.paid`                                    | Sent when the invoice is successfully paid. You can provision access to your product when you receive this event and the subscription `status` is `active`.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| `invoice.payment_action_required`                 | Sent when the invoice requires customer authentication. Learn how to handle the subscription when the invoice [requires action](https://docs.stripe.com/billing/subscriptions/overview.md#requires-action).                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| `invoice.payment_failed`                          | A payment for an invoice failed. The PaymentIntent status changes to `requires_action`. The status of the subscription continues to be `incomplete` _only_ for the subscription’s first invoice. If a payment fails, there are several possible actions to take:

  * Notify the customer. Read about how you can configure [subscription settings](https://docs.stripe.com/billing/subscriptions/overview.md#settings) to enable [Smart Retries](https://docs.stripe.com/billing/revenue-recovery/smart-retries.md) and other revenue recovery features.
  * If you’re using PaymentIntents, collect new payment information and [confirm the PaymentIntent](https://docs.stripe.com/api/payment_intents/confirm.md).
  * Update the [default payment method](https://docs.stripe.com/api/subscriptions/object.md#subscription_object-default_payment_method) on the subscription.                                                                                                                                                             |
| `invoice.upcoming`                                | Sent a few days prior to the renewal of the subscription. The number of days is based on the number set for **Upcoming renewal events** in the [Dashboard](https://dashboard.stripe.com/settings/billing/automatic). For existing subscriptions, changing the number of days takes effect on the next billing period. You can still add [extra invoice items](https://docs.stripe.com/billing/invoices/subscription.md#adding-upcoming-invoice-items), if needed.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| `invoice.updated`                                 | Sent when a payment succeeds or fails. If payment is successful the `paid` attribute is set to `true` and the `status` is `paid`. If payment fails, `paid` is set to `false` and the `status` remains `open`. Payment failures also trigger  a `invoice.payment_failed` event.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| `payment_intent.created`                          | Sent when a [PaymentIntent](https://docs.stripe.com/api/payment_intents.md) is created.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| `payment_intent.succeeded`                        | Sent when a PaymentIntent has successfully completed payment.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| `subscription_schedule.aborted`                   | Sent when a subscription schedule is canceled because payment delinquency terminated the related subscription.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| `subscription_schedule.canceled`                  | Sent when a subscription schedule is canceled, which also cancels any active associated subscription.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| `subscription_schedule.completed`                 | Sent when all [phases](https://docs.stripe.com/billing/subscriptions/subscription-schedules.md#subscription-schedule-phases) of a subscription schedule complete.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| `subscription_schedule.created`                   | Sent when a new subscription schedule is created.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| `subscription_schedule.expiring`                  | Sent 7 days before a subscription schedule is set to expire.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| `subscription_schedule.released`                  | Sent when a subscription schedule is [released](https://docs.stripe.com/api/subscription_schedules/release.md), or stopped and disassociated from the subscription, which remains.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| `subscription_schedule.updated`                   | Sent when a subscription schedule is updated.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |

## Test payment failures 

Use specific [test credit card numbers](https://docs.stripe.com/testing.md#cards) to trigger payment failures for subscriptions and *invoices*.

Some subscription updates cause Stripe to invoice the subscription and attempt payment immediately (this synchronous payment attempt can occur on the initial invoice, or on certain invoice updates).
If this attempt fails, the subscription is created in an `incomplete` status.

To test the effects of payment failure on an active subscription, attach the [**4000 0000 0000 0341**](https://docs.stripe.com/testing.md#cards) card as the customer’s default payment method, but use a trial period to defer the attempt (a trial of a few seconds or minutes is sufficient). The subscription becomes active immediately, with a [draft](https://docs.stripe.com/invoicing/overview.md#draft) invoice created when the trial period ends. It takes approximately one hour for the invoice status changes to open, at which time payment collection is attempted and fails.

Use [test clocks](https://docs.stripe.com/billing/testing/test-clocks.md) to simulate the forward movement of time in a *sandbox*, which causes Billing resources, like Subscriptions, to change state and trigger *webhook* events. This allows you to see how your integration handles a payment failure for a quarterly or annual renewal without waiting a year.

## Test payments that require 3D Secure 

Use the [**4000 0027 6000 3184**](https://docs.stripe.com/testing.md#three-ds-cards) card to simulate 3D Secure triggering for subscriptions and invoices.

When a 3D Secure authentication flow is triggered, you can test authenticating or failing the payment attempt in the 3DS dialog that opens.
If the payment is authenticated successfully, the invoice is paid.
If the invoice belongs to a subscription in an `incomplete` status, the subscription becomes active.
When a payment attempt fails, the authentication attempt is unsuccessful and the invoice remains `open`.

## Test Bank Transfer payments for invoices 

To test manual payments on invoices through Bank Transfer:

1. In a sandbox, create an invoice and set the collection method to `send_invoice` and set the `payment_settings[payment_method_types]` array to `[customer_balance]`.
1. Find the invoice in the Dashboard and click **Send**.
1. Your customer has been allocated a unique virtual bank account number that you can retrieve through the [funding instructions API](https://docs.stripe.com/payments/customer-balance/funding-instructions.md#create-funding-instructions). The virtual banking details are also present in the hosted invoice page as well as the PDF.

## Test the default payment method for invoices and subscriptions

Use specific [test card IDs](https://docs.stripe.com/testing.md?testing-method=payment-methods#cards) to simulate default payment methods being used for subscriptions and invoices.

The provided payment method must be attached to the subscription or invoice’s customer setting it as the `default_payment method`. For example, if using `pm_card_visa` to create a test Visa payment method:

1. Call the [PaymentMethod Attach](https://docs.stripe.com/api/payment_methods/attach.md) endpoint with `pm_card_visa` and the intended customer for the subscription or invoice
1. With the resulting Payment Method ID, create the subscription or invoice with this ID as the `default_payment_method`.

Now, the subscription or invoice will charge this payment method.

Learn more about using [default payment methods](https://docs.stripe.com/testing.md?testing-method=payment-methods#cards) for subscriptions and invoices.

## Test customer tax ID verification 

Use these magic tax IDs to trigger certain verification conditions in testing environments. The tax ID type must be either the EU VAT Number or Australian Business Number (ABN).

| Number                                                     | Type                                      |
| ---------------------------------------------------------- | ----------------------------------------- |
| {{testModeMagicValues.tax_id.successful_verification}}     | Successful verification                   |
| {{testModeMagicValues.tax_id.unsuccessful_verification}}   | Unsuccessful verification                 |
| {{testModeMagicValues.tax_id.always_pending_verification}} | Verification remains pending indefinitely |

## Automated testing

You can set up [automated testing](https://docs.stripe.com/automated-testing.md) for your integration. To optimize the testing:

- Be aware of the [data retention policy](https://support.stripe.com/questions/test-mode-subscription-data-retention) for subscription-related data in a sandbox.
- Avoid re-using resources like [Coupons](https://docs.stripe.com/api/coupons.md) and [Promotion Codes](https://docs.stripe.com/api/promotion_codes.md) across tests.
- Use the [stripe-mock](https://github.com/stripe/stripe-mock) HTTP server, which is based on the Stripe API and closely reflects the API’s behavior.

## See Also

- [Sandboxes](https://docs.stripe.com/sandboxes.md)
- [Multiple accounts](https://docs.stripe.com/get-started/account/multiple-accounts.md)