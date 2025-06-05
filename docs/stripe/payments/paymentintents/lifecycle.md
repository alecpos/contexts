# How PaymentIntents work

Learn how PaymentIntents work within the payment flow.

Payments involving *asynchronous* processes can be complex to manage. For example, a user might be required to confirm a payment using *3D Secure*.
Asynchronous payment flows are hard to manage because they depend on customer interactions that happen outside of your application.
[PaymentIntents](https://docs.stripe.com/api/payment_intents.md) and [SetupIntents](https://docs.stripe.com/api/setup_intents.md) simplify management by tracking the status of the flow in a _state machine_.

When the PaymentIntent is created, it has a status of `requires_payment_method`1 [until a payment method is attached](https://docs.stripe.com/payments/payment-methods/overview.md).

We recommend creating the PaymentIntent as soon as you know how much you want to charge, so that Stripe can record all the attempted payments.

After the customer provides their payment information, the PaymentIntent is ready to be confirmed.

In most integrations, this state is skipped because payment method information is submitted at the same time that the payment is confirmed.

If the payment requires additional actions, such as authenticating with [3D Secure](https://docs.stripe.com/payments/3d-secure.md), the PaymentIntent has a status of `requires_action`1.

After required actions are handled, the PaymentIntent moves to `processing` for *asynchronous payment methods*, such as bank debits. These types of payment methods can take up to a few days to process. Other payment methods, such as cards, are processed more quickly and don’t go into the `processing` status.

If you’re separately [authorizing and capturing funds](https://docs.stripe.com/payments/place-a-hold-on-a-payment-method.md), your PaymentIntent can instead move to `requires_capture`. In that case, attempting to capture the funds moves it to `processing`.

A PaymentIntent with a status of succeeded means that the payment flow it is driving is complete.

The funds are now in your account and you can confidently fulfill the order. If you need to refund the customer, you can use the Refunds API.

If the payment attempt fails (for example due to a decline), the PaymentIntent’s status returns to `requires_payment_method` so that the payment can be retried.

You can cancel a PaymentIntent at any point before it’s in a `processing`2 or `succeeded` state. Canceling it invalidates the PaymentIntent for future payment attempts, and can’t be undone. If any funds have been held, cancellation releases them.

PaymentIntents might also be automatically transitioned to the `canceled` state after they have been [confirmed](https://docs.stripe.com/api/payment_intents/confirm.md) too many times.

1 Versions of the API before [2019-02-11](https://docs.stripe.com/upgrades.md#2019-02-11) show `requires_source` instead of `requires_payment_method` and `requires_source_action` instead of `requires_action`.