# Retrieve a PaymentIntent

Retrieves the details of a PaymentIntent that has previously been created.

You can retrieve a PaymentIntent client-side using a publishable key when the `client_secret` is in the query string.

If you retrieve a PaymentIntent with a publishable key, it only returns a subset of properties. Refer to the [payment intent](#payment_intent_object) object reference for more details.

Returns a PaymentIntent if a valid identifier was provided.

- `client_secret` (string, required)
  The client secret of the PaymentIntent. We require it if you use a publishable key to retrieve the source.

```dotnet
StripeConfiguration.ApiKey = "<<secret key>>";

var service = new PaymentIntentService();
PaymentIntent paymentIntent = service.Get("pi_3MtwBwLkdIwHu7ix28a3tqPa");
```

```go
stripe.Key = "<<secret key>>"

params := &stripe.PaymentIntentParams{};
result, err := paymentintent.Get("pi_3MtwBwLkdIwHu7ix28a3tqPa", params);
```

```java
Stripe.apiKey = "<<secret key>>";

PaymentIntent paymentIntent = PaymentIntent.retrieve("pi_3MtwBwLkdIwHu7ix28a3tqPa");
```

```node
const stripe = require('stripe')('<<secret key>>');

const paymentIntent = await stripe.paymentIntents.retrieve('pi_3MtwBwLkdIwHu7ix28a3tqPa');
```

```python
import stripe
stripe.api_key = "<<secret key>>"

payment_intent = stripe.PaymentIntent.retrieve("pi_3MtwBwLkdIwHu7ix28a3tqPa")
```

```php
$stripe = new \Stripe\StripeClient('<<secret key>>');

$paymentIntent = $stripe->paymentIntents->retrieve('pi_3MtwBwLkdIwHu7ix28a3tqPa', []);
```

```ruby
Stripe.api_key = '<<secret key>>'

payment_intent = Stripe::PaymentIntent.retrieve('pi_3MtwBwLkdIwHu7ix28a3tqPa')
```

### Response

```json
{
  "id": "pi_3MtwBwLkdIwHu7ix28a3tqPa",
  "object": "payment_intent",
  "amount": 2000,
  "amount_capturable": 0,
  "amount_details": {
    "tip": {}
  },
  "amount_received": 0,
  "application": null,
  "application_fee_amount": null,
  "automatic_payment_methods": {
    "enabled": true
  },
  "canceled_at": null,
  "cancellation_reason": null,
  "capture_method": "automatic",
  "client_secret": "pi_3MtwBwLkdIwHu7ix28a3tqPa_secret_YrKJUKribcBjcG8HVhfZluoGH",
  "confirmation_method": "automatic",
  "created": 1680800504,
  "currency": "usd",
  "customer": null,
  "description": null,
  "last_payment_error": null,
  "latest_charge": null,
  "livemode": false,
  "metadata": {},
  "next_action": null,
  "on_behalf_of": null,
  "payment_method": null,
  "payment_method_options": {
    "card": {
      "installments": null,
      "mandate_options": null,
      "network": null,
      "request_three_d_secure": "automatic"
    },
    "link": {
      "persistent_token": null
    }
  },
  "payment_method_types": [
    "card",
    "link"
  ],
  "processing": null,
  "receipt_email": null,
  "review": null,
  "setup_future_usage": null,
  "shipping": null,
  "source": null,
  "statement_descriptor": null,
  "statement_descriptor_suffix": null,
  "status": "requires_payment_method",
  "transfer_data": null,
  "transfer_group": null
}
```