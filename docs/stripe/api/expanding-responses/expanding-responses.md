# Expanding responses

Learn how to reduce the number of requests you make to the Stripe API by expanding objects in responses.

This guide describes how to request additional properties from the API. You will learn to modify your requests to include:

- properties from related objects
- properties from distantly related objects
- additional properties on all objects in a list
- properties that aren’t included by default in a response

## How it works 

The Stripe API is organized into resources represented by objects with state, configuration, and contextual properties. These objects all have unique IDs that you can use to retrieve, update, and delete them. The API also uses these IDs to link related objects together. A [Checkout Session](https://docs.stripe.com/api/checkout/sessions/object.md), for example, links to a [Customer](https://docs.stripe.com/api/customers/object.md) by the [Customer ID](https://docs.stripe.com/api/checkout/sessions/object.md#checkout_session_object-customer).

```json
{
  "id": "cs_test_KdjLtDPfAjT1gq374DMZ3rHmZ9OoSlGRhyz8yTypH76KpN4JXkQpD2G0",
  "object": "checkout.session",
  ...
  "customer": "cus_HQmikpKnGHkNwW",
  ...
}
```

In cases where you need information from a linked object, you can retrieve the linked object in a new call using its ID. However, this approach requires two API requests to access just one value. If you need information from multiple linked objects, each would also require separate requests, which all adds to the latency and complexity of your application.

The API has an Expand feature that allows you to retrieve linked objects in a single call, effectively replacing the object ID with all its properties and values. For example, say you wanted to access details on a customer tied to a given Checkout Session. You would retrieve the Checkout Session and pass the `customer` property to the `expand` array, which tells Stripe to include the entire Customer object in the response:

```dotnet
StripeConfiguration.ApiKey = "<<secret key>>";

var options = new Stripe.Checkout.SessionGetOptions { Expand = new List<string> { "customer" } };
var service = new Stripe.Checkout.SessionService();
Stripe.Checkout.Session session = service.Get("<<checkoutSession>>", options);
```

```go
stripe.Key = "<<secret key>>"

params := &stripe.CheckoutSessionParams{};
params.AddExpand("customer")
result, err := session.Get("<<checkoutSession>>", params);
```

```java
Stripe.apiKey = "<<secret key>>";

SessionRetrieveParams params = SessionRetrieveParams.builder().addExpand("customer").build();

Session session = Session.retrieve("<<checkoutSession>>", params, null);
```

```node
const stripe = require('stripe')('<<secret key>>');

const session = await stripe.checkout.sessions.retrieve(
  '<<checkoutSession>>',
  {
    expand: ['customer'],
  }
);
```

```python
import stripe
stripe.api_key = "<<secret key>>"

session = stripe.checkout.Session.retrieve(
  "<<checkoutSession>>",
  expand=["customer"],
)
```

```php
$stripe = new \Stripe\StripeClient('<<secret key>>');

$session = $stripe->checkout->sessions->retrieve('<<checkoutSession>>', ['expand' => ['customer']]);
```

```ruby
Stripe.api_key = '<<secret key>>'

session = Stripe::Checkout::Session.retrieve({
  expand: ['customer'],
  id: '<<checkoutSession>>',
})
```

Which returns the Checkout Session with the full Customer object instead of its ID:

```json
{
  "id": "cs_test_KdjLtDPfAjT1gq374DMZ3rHmZ9OoSlGRhyz8yTypH76KpN4JXkQpD2G0",
  "object": "checkout.session",
  ...
  "customer": {
    "id": "cus_HQmikpKnGHkNwW",
    "object": "customer",
    ...
    "metadata": {
      "user_id": "user_xyz"
    },
    ...
  }
}
```

Not all properties can be expanded. The API reference marks expandable properties with the “Expandable” label.

## Expanding multiple properties 

To expand multiple properties in one call, add additional items to the expand array. For example, if you want to expand both the [customer](https://docs.stripe.com/api/checkout/sessions/object.md#checkout_session_object-customer) and the [payment_intent](https://docs.stripe.com/api/checkout/sessions/object.md#checkout_session_object-payment_intent) for a given Checkout Session, you would pass `expand` an array with both the `customer` and `payment_intent` strings:

```dotnet
StripeConfiguration.ApiKey = "<<secret key>>";

var options = new Stripe.Checkout.SessionGetOptions
{
    Expand = new List<string> { "customer", "payment_intent" },
};
var service = new Stripe.Checkout.SessionService();
Stripe.Checkout.Session session = service.Get("<<checkoutSession>>", options);
```

```go
stripe.Key = "<<secret key>>"

params := &stripe.CheckoutSessionParams{};
params.AddExpand("customer")
params.AddExpand("payment_intent")
result, err := session.Get("<<checkoutSession>>", params);
```

```java
Stripe.apiKey = "<<secret key>>";

SessionRetrieveParams params =
  SessionRetrieveParams.builder().addExpand("customer").addExpand("payment_intent").build();

Session session = Session.retrieve("<<checkoutSession>>", params, null);
```

```node
const stripe = require('stripe')('<<secret key>>');

const session = await stripe.checkout.sessions.retrieve(
  '<<checkoutSession>>',
  {
    expand: ['customer', 'payment_intent'],
  }
);
```

```python
import stripe
stripe.api_key = "<<secret key>>"

session = stripe.checkout.Session.retrieve(
  "<<checkoutSession>>",
  expand=["customer", "payment_intent"],
)
```

```php
$stripe = new \Stripe\StripeClient('<<secret key>>');

$session = $stripe->checkout->sessions->retrieve(
  '<<checkoutSession>>',
  ['expand' => ['customer', 'payment_intent']]
);
```

```ruby
Stripe.api_key = '<<secret key>>'

session = Stripe::Checkout::Session.retrieve({
  expand: ['customer', 'payment_intent'],
  id: '<<checkoutSession>>',
})
```

## Expanding multiple levels 

If the value you want is nested deeply across multiple linked resources, you can reach it by recursively expanding using dot notation. For instance, if you needed to know the type of payment method that was used for a given Checkout Session, you would first retrieve the Checkout Session’s payment intent, then retrieve the payment intent’s linked payment method to get its type. With `expand`, you can do this in one call:

```dotnet
StripeConfiguration.ApiKey = "<<secret key>>";

var options = new Stripe.Checkout.SessionGetOptions
{
    Expand = new List<string> { "payment_intent.payment_method" },
};
var service = new Stripe.Checkout.SessionService();
Stripe.Checkout.Session session = service.Get("<<checkoutSession>>", options);
```

```go
stripe.Key = "<<secret key>>"

params := &stripe.CheckoutSessionParams{};
params.AddExpand("payment_intent.payment_method")
result, err := session.Get("<<checkoutSession>>", params);
```

```java
Stripe.apiKey = "<<secret key>>";

SessionRetrieveParams params =
  SessionRetrieveParams.builder().addExpand("payment_intent.payment_method").build();

Session session = Session.retrieve("<<checkoutSession>>", params, null);
```

```node
const stripe = require('stripe')('<<secret key>>');

const session = await stripe.checkout.sessions.retrieve(
  '<<checkoutSession>>',
  {
    expand: ['payment_intent.payment_method'],
  }
);
```

```python
import stripe
stripe.api_key = "<<secret key>>"

session = stripe.checkout.Session.retrieve(
  "<<checkoutSession>>",
  expand=["payment_intent.payment_method"],
)
```

```php
$stripe = new \Stripe\StripeClient('<<secret key>>');

$session = $stripe->checkout->sessions->retrieve(
  '<<checkoutSession>>',
  ['expand' => ['payment_intent.payment_method']]
);
```

```ruby
Stripe.api_key = '<<secret key>>'

session = Stripe::Checkout::Session.retrieve({
  expand: ['payment_intent.payment_method'],
  id: '<<checkoutSession>>',
})
```

Which returns the Checkout Session with the full [PaymentIntent](https://docs.stripe.com/api/payment_intents/object.md) and [PaymentMethod](https://docs.stripe.com/api/payment_methods/object.md) objects instead of their IDs:

```json
{
  "id": "cs_test_KdjLtDPfAjT1gq374DMZ3rHmZ9OoSlGRhyz8yTypH76KpN4JXkQpD2G0",
  "object": "checkout.session",
  ...
  "mode": "payment",
  "payment_intent": {
    "id": "pi_1GkXXDLHughnNhxyLlsnvUuY",
    "object": "payment_intent",
    "amount": 100,
    ...
    "charges": {...},
    "client_secret": "pi_1GkXXDLHughnNhxyLlsnvUuY_secret_oLbwpm0ME0ieJ9Aykz2SwKzj5",
    ...
    "payment_method": {
      "id": "pm_1GkXXuLHughnNhxy8xpAdGtf",
      "object": "payment_method",
      "billing_details": {...},
      "card": {...},
      "created": 1589902798,
      "customer": "cus_HQmikpKnGHkNwW",
      "livemode": false,
      "metadata": {},
      "type": "card"
    },
    "payment_method_options": {...},
    "payment_method_types": [
      "card"
    ],
    "receipt_email": "jenny.rosen@gmail.com",
    "review": null,
    "setup_future_usage": null,
    "shipping": null,
    "source": null,
    "statement_descriptor": null,
    "statement_descriptor_suffix": null,
    "status": "succeeded",
    "transfer_data": null,
    "transfer_group": null
  },
  "payment_method_types": [
    "card"
  ],
  "setup_intent": null,
  "shipping": null,
  "shipping_address_collection": null,
  "submit_type": null,
  "subscription": null,
  "success_url": "http://localhost:5000"
}
```

Expansions have a maximum depth of four levels. Meaning that an `expand` string can contain no more than four properties: `property1.property2.property3.property4`.

## Expanding properties in lists 

When the API returns a list of objects, you can use the `data` keyword to expand a given property on each object in that list. For example, say you need information about the payment methods used by one of your customers. To get this information, you would [list the customer’s PaymentIntents](https://docs.stripe.com/api/payment_intents/list.md#list_payment_intents-customer), which returns an object with the following structure:

```json
{
  "object": "list",
  "data": [
    {
      "id": "pi_1GrvBKLHughnNhxy6N28q8gt",
      "object": "payment_intent",
      "amount": 1000,
      ...
      "payment_method": "pm_1GrvBxLHughnNhxyJjtBtHcc",
      ...
    },
    {
      "id": "pi_1Grv8tLHughnNhxyflPG4bMG",
      "object": "payment_intent",
      "amount": 4000,
      ...
      "payment_method": "pm_1Grv9zLHughnNhxyv6uMNomv",
      ...
    }
  ],
  "has_more": false,
  "url": "/v1/payment_intents"
}
```

All lists returned in the API have the above structure, where the `data` property contains the array of objects being listed. You can use the `data` keyword in any position in an expand string to move the expand cursor into the list.

Rather than looping through each payment intent in the list and retrieving the linked payment methods in separate calls, you can expand all the payment methods at once using the `data` keyword:

```dotnet
StripeConfiguration.ApiKey = "<<secret key>>";

var options = new PaymentIntentListOptions
{
    Customer = "<<customer>>",
    Expand = new List<string> { "data.payment_method" },
};
var service = new PaymentIntentService();
StripeList<PaymentIntent> paymentIntents = service.List(options);
```

```go
stripe.Key = "<<secret key>>"

params := &stripe.PaymentIntentListParams{Customer: stripe.String("<<customer>>")};
params.AddExpand("data.payment_method")
result := paymentintent.List(params);
```

```java
Stripe.apiKey = "<<secret key>>";

PaymentIntentListParams params =
  PaymentIntentListParams.builder()
    .setCustomer("<<customer>>")
    .addExpand("data.payment_method")
    .build();

PaymentIntentCollection paymentIntents = PaymentIntent.list(params);
```

```node
const stripe = require('stripe')('<<secret key>>');

const paymentIntents = await stripe.paymentIntents.list({
  customer: '<<customer>>',
  expand: ['data.payment_method'],
});
```

```python
import stripe
stripe.api_key = "<<secret key>>"

payment_intents = stripe.PaymentIntent.list(
  customer="<<customer>>",
  expand=["data.payment_method"],
)
```

```php
$stripe = new \Stripe\StripeClient('<<secret key>>');

$paymentIntents = $stripe->paymentIntents->all([
  'customer' => '<<customer>>',
  'expand' => ['data.payment_method'],
]);
```

```ruby
Stripe.api_key = '<<secret key>>'

payment_intents = Stripe::PaymentIntent.list({
  customer: '<<customer>>',
  expand: ['data.payment_method'],
})
```

The list then includes the full payment method object on each payment intent:

```json
{
  "object": "list",
  "data": [
    {
      "id": "pi_1GrvBKLHughnNhxy6N28q8gt",
      "object": "payment_intent",
      "amount": 1000,
      ...
      "payment_method": {
        "id": "pm_1GrvBxLHughnNhxyJjtBtHcc",
        "object": "payment_method",
        "billing_details": {...},
        "card": {
          "brand": "visa",
          ...
          "country": "US",
          "exp_month": 2,
          "exp_year": 2022,
          "fingerprint": "1212u2LvSFqEHu3h",
          "funding": "credit",
          "last4": "4242",
          ...
        },
        "created": 1591661989,
        "customer": "cus_HQmikpKnGHkNwW",
        "livemode": false,
        "metadata": {...},
        "type": "card"
      },
      ...
    },
    {
      "id": "pi_1Grv8tLHughnNhxyflPG4bMG",
      "object": "payment_intent",
      "amount": 4000,
      ...
      "payment_method": {
        "id": "pm_1Grv9zLHughnNhxyv6uMNomv",
        "object": "payment_method",
        "billing_details": {...},
        "card": {
          "brand": "visa",
          "checks": {...},
          "country": "US",
          "exp_month": 2,
          "exp_year": 2025,
          "fingerprint": "1212u2LvSFqEHu3h",
          "funding": "credit",
          "generated_from": null,
          "last4": "0341",
          "three_d_secure_usage": {...},
          "wallet": null
        },
        "created": 1591661989,
        "customer": "cus_HQmikpKnGHkNwW",
        "livemode": false,
        "metadata": {...},
        "type": "card"
      },
      ...
    }
  ],
  "has_more": false,
  "url": "/v1/payment_intents"
}
```

Expanding responses has performance implications. To keep requests fast, try to limit many nested expansions on list requests.

## Using expansion to request includable properties

In some cases, resources have properties that aren’t included by default. One example is the Checkout Session’s [line_items](https://docs.stripe.com/api/checkout/sessions/object.md#checkout_session_object-line_items) property, which is only included in responses if requested using the `expand` parameter, for example:

```dotnet
StripeConfiguration.ApiKey = "<<secret key>>";

var options = new Stripe.Checkout.SessionGetOptions { Expand = new List<string> { "line_items" } };
var service = new Stripe.Checkout.SessionService();
Stripe.Checkout.Session session = service.Get("<<checkoutSession>>", options);
```

```go
stripe.Key = "<<secret key>>"

params := &stripe.CheckoutSessionParams{};
params.AddExpand("line_items")
result, err := session.Get("<<checkoutSession>>", params);
```

```java
Stripe.apiKey = "<<secret key>>";

SessionRetrieveParams params = SessionRetrieveParams.builder().addExpand("line_items").build();

Session session = Session.retrieve("<<checkoutSession>>", params, null);
```

```node
const stripe = require('stripe')('<<secret key>>');

const session = await stripe.checkout.sessions.retrieve(
  '<<checkoutSession>>',
  {
    expand: ['line_items'],
  }
);
```

```python
import stripe
stripe.api_key = "<<secret key>>"

session = stripe.checkout.Session.retrieve(
  "<<checkoutSession>>",
  expand=["line_items"],
)
```

```php
$stripe = new \Stripe\StripeClient('<<secret key>>');

$session = $stripe->checkout->sessions->retrieve(
  '<<checkoutSession>>',
  ['expand' => ['line_items']]
);
```

```ruby
Stripe.api_key = '<<secret key>>'

session = Stripe::Checkout::Session.retrieve({
  expand: ['line_items'],
  id: '<<checkoutSession>>',
})
```

Like other expandable properties, the API reference marks properties that are includable with the “Expandable” label.

## Using expansion with webhooks 

You can’t receive *webhook* events with properties auto-expanded. Objects sent in events are always in their minimal form. To access nested values in expandable properties, you must retrieve the object in a separate call within your webhook handler.