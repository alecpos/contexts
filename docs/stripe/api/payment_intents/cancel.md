# Cancel a PaymentIntent

Use this endpoint to cancel a PaymentIntent before it has been completed. The PaymentIntent must be in a cancellable state such as `requires_payment_method` or `requires_capture`.

```http
POST /v1/payment_intents/{PAYMENT_INTENT_ID}/cancel
```

## Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| `cancellation_reason` | string | Optional reason for canceling. One of `duplicate`, `fraudulent`, `requested_by_customer`, `abandoned`, `failed_invoice`, or `void_invoice`. |

## Response

Returns the canceled PaymentIntent object if the call succeeds. The object's `status` becomes `canceled` and `canceled_at` is set to a timestamp.

For full details see the [Stripe API documentation](https://stripe.com/docs/api/payment_intents/cancel).
