# List all PaymentIntents

Returns a list of PaymentIntents.

A dictionary with a `data` property that contains an array of up to `limit` PaymentIntents, starting after PaymentIntent `starting_after`. Each entry in the array is a separate PaymentIntent object. If no other PaymentIntents are available, the resulting array is empty.

- `created` (object, optional)
  A filter on the list, based on the object `created` field. The value can be a string with an integer Unix timestamp or a dictionary with a number of different query options.

  - `created.gt` (integer, optional)
    Minimum value to filter by (exclusive)

  - `created.gte` (integer, optional)
    Minimum value to filter by (inclusive)

  - `created.lt` (integer, optional)
    Maximum value to filter by (exclusive)

  - `created.lte` (integer, optional)
    Maximum value to filter by (inclusive)

- `customer` (string, optional)
  Only return PaymentIntents for the customer that this customer ID specifies.

- `ending_before` (string, optional)
  A cursor for use in pagination. `ending_before` is an object ID that defines your place in the list. For instance, if you make a list request and receive 100 objects, starting with `obj_bar`, your subsequent call can include `ending_before=obj_bar` in order to fetch the previous page of the list.

- `limit` (integer, optional)
  A limit on the number of objects to be returned. Limit can range between 1 and 100, and the default is 10.

- `starting_after` (string, optional)
  A cursor for use in pagination. `starting_after` is an object ID that defines your place in the list. For instance, if you make a list request and receive 100 objects, ending with `obj_foo`, your subsequent call can include `starting_after=obj_foo` in order to fetch the next page of the list.

```dotnet
StripeConfiguration.ApiKey = "<<secret key>>";

var options = new PaymentIntentListOptions { Limit = 3 };
var service = new PaymentIntentService();
StripeList<PaymentIntent> paymentIntents = service.List(options);
```

```go
stripe.Key = "<<secret key>>"

params := &stripe.PaymentIntentListParams{};
params.Limit = stripe.Int64(3)
result := paymentintent.List(params);
```

```java
Stripe.apiKey = "<<secret key>>";

PaymentIntentListParams params = PaymentIntentListParams.builder().setLimit(3L).build();

PaymentIntentCollection paymentIntents = PaymentIntent.list(params);
```

```node
const stripe = require('stripe')('<<secret key>>');

const paymentIntents = await stripe.paymentIntents.list({
  limit: 3,
});
```

```python
import stripe
stripe.api_key = "<<secret key>>"

payment_intents = stripe.PaymentIntent.list(limit=3)
```

```php
$stripe = new \Stripe\StripeClient('<<secret key>>');

$paymentIntents = $stripe->paymentIntents->all(['limit' => 3]);
```

```ruby
Stripe.api_key = '<<secret key>>'

payment_intents = Stripe::PaymentIntent.list({limit: 3})
```

### Response

```json
{
  "object": "list",
  "url": "/v1/payment_intents",
  "has_more": false,
  "data": [
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
  ]
}
```