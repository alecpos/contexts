# Metadata use cases

Use these examples to store your data on Stripe objects.

Use [metadata](https://docs.stripe.com/api/metadata.md) to store your important data on Stripe objects with these common examples. The following use cases aren’t exhaustive; how you use metadata depends on your specific use cases.

Don’t include sensitive data in `metadata`, such as PII, bank account details, or customer card details.

## Store IDs for objects or records

You can use metadata in Stripe objects to store IDs that belong to objects or records from your other systems. This allows you to build references between Stripe objects and their related resources from your other systems.

### Order or cart ID

When you create IDs to track your customers’ carts, you can store those IDs as metadata on [Checkout Sessions](https://docs.stripe.com/api/checkout/sessions.md). This allows you to use the related Stripe object to locate the associated cart in your system after the checkout process is complete.

Store the cart ID in the metadata of the Checkout Session after you create it:

```dotnet
StripeConfiguration.ApiKey = "<<secret key>>";

var options = new Stripe.Checkout.SessionCreateOptions
{
    SuccessUrl = "https://example.com/success",
    Mode = "payment",
    LineItems = new List<Stripe.Checkout.SessionLineItemOptions>
    {
        new Stripe.Checkout.SessionLineItemOptions
        {
            Price = "price_1MotwRLkdIwHu7ixYcPLm5uZ",
            Quantity = 1,
        },
    },
    Metadata = new Dictionary<string, string> { { "cart_id", "cart_6943" } },
};
var service = new Stripe.Checkout.SessionService();
Stripe.Checkout.Session session = service.Create(options);
```

```go
stripe.Key = "<<secret key>>"

params := &stripe.CheckoutSessionParams{
  SuccessURL: stripe.String("https://example.com/success"),
  Mode: stripe.String(string(stripe.CheckoutSessionModePayment)),
  LineItems: []*stripe.CheckoutSessionLineItemParams{
    &stripe.CheckoutSessionLineItemParams{
      Price: stripe.String("price_1MotwRLkdIwHu7ixYcPLm5uZ"),
      Quantity: stripe.Int64(1),
    },
  },
};
params.AddMetadata("cart_id", "cart_6943")
result, err := session.New(params);
```

```java
Stripe.apiKey = "<<secret key>>";

SessionCreateParams params =
  SessionCreateParams.builder()
    .setSuccessUrl("https://example.com/success")
    .setMode(SessionCreateParams.Mode.PAYMENT)
    .addLineItem(
      SessionCreateParams.LineItem.builder()
        .setPrice("price_1MotwRLkdIwHu7ixYcPLm5uZ")
        .setQuantity(1L)
        .build()
    )
    .putMetadata("cart_id", "cart_6943")
    .build();

Session session = Session.create(params);
```

```node
const stripe = require('stripe')('<<secret key>>');

const session = await stripe.checkout.sessions.create({
  success_url: 'https://example.com/success',
  mode: 'payment',
  line_items: [
    {
      price: 'price_1MotwRLkdIwHu7ixYcPLm5uZ',
      quantity: 1,
    },
  ],
  metadata: {
    cart_id: 'cart_6943',
  },
});
```

```python
import stripe
stripe.api_key = "<<secret key>>"

session = stripe.checkout.Session.create(
  success_url="https://example.com/success",
  mode="payment",
  line_items=[{"price": "price_1MotwRLkdIwHu7ixYcPLm5uZ", "quantity": 1}],
  metadata={"cart_id": "cart_6943"},
)
```

```php
$stripe = new \Stripe\StripeClient('<<secret key>>');

$session = $stripe->checkout->sessions->create([
  'success_url' => 'https://example.com/success',
  'mode' => 'payment',
  'line_items' => [
    [
      'price' => 'price_1MotwRLkdIwHu7ixYcPLm5uZ',
      'quantity' => 1,
    ],
  ],
  'metadata' => ['cart_id' => 'cart_6943'],
]);
```

```ruby
Stripe.api_key = '<<secret key>>'

session = Stripe::Checkout::Session.create({
  success_url: 'https://example.com/success',
  mode: 'payment',
  line_items: [
    {
      price: 'price_1MotwRLkdIwHu7ixYcPLm5uZ',
      quantity: 1,
    },
  ],
  metadata: {cart_id: 'cart_6943'},
})
```

Then, you can view, update, or delete the ID on the `Checkout Session` object. It also appears in the events sent to your webhook endpoint that contain that Checkout Session (including the `checkout.session.completed` event).

```json
{
  "id": "evt_1PYCL6CzbZon1zn9VivIehz7",
  "object": "event",
  "api_version": "2024-06-20",
  "created": 1719948368,
  "data": {
    "object": {
      "id": "cs_test_a1Znb7gdtlLEPzSi8qMIJzvsSPpIBMKFWovXx0h0O43WS411PpICgCqKjw",
      "object": "checkout.session",
      ...
      "metadata": {
        "cart_id": "cart_6943"
      },
      ...
    }
  },
  ...
  "type": "checkout.session.completed",
}
```

### Customer or CMS ID

You can associate the [Customers](https://docs.stripe.com/api/customers.md) you create in Stripe with your customer management system (CMS) records to help track and manage your customers.

Store the ID of the customer record from your CMS in the metadata of the Customer you create in Stripe.

```dotnet
StripeConfiguration.ApiKey = "<<secret key>>";

var options = new CustomerCreateOptions
{
    Name = "Jenny Rosen",
    Metadata = new Dictionary<string, string> { { "cms_id", "cust_6573" } },
};
var service = new CustomerService();
Customer customer = service.Create(options);
```

```go
stripe.Key = "<<secret key>>"

params := &stripe.CustomerParams{Name: stripe.String("Jenny Rosen")};
params.AddMetadata("cms_id", "cust_6573")
result, err := customer.New(params);
```

```java
Stripe.apiKey = "<<secret key>>";

CustomerCreateParams params =
  CustomerCreateParams.builder().setName("Jenny Rosen").putMetadata("cms_id", "cust_6573").build();

Customer customer = Customer.create(params);
```

```node
const stripe = require('stripe')('<<secret key>>');

const customer = await stripe.customers.create({
  name: 'Jenny Rosen',
  metadata: {
    cms_id: 'cust_6573',
  },
});
```

```python
import stripe
stripe.api_key = "<<secret key>>"

customer = stripe.Customer.create(
  name="Jenny Rosen",
  metadata={"cms_id": "cust_6573"},
)
```

```php
$stripe = new \Stripe\StripeClient('<<secret key>>');

$customer = $stripe->customers->create([
  'name' => 'Jenny Rosen',
  'metadata' => ['cms_id' => 'cust_6573'],
]);
```

```ruby
Stripe.api_key = '<<secret key>>'

customer = Stripe::Customer.create({
  name: 'Jenny Rosen',
  metadata: {cms_id: 'cust_6573'},
})
```

Stripe includes this information in the events sent to your webhook endpoint that contain that Customer object. For example, when you receive `customer.updated` events, you can use the stored ID to identify the record you need to update in your CMS.

```json
{
  "id": "evt_1PajAGCzbZon1zn9FUsn7IoG",
  "object": "event",
  "api_version": "2024-06-20",
  "created": 1720551204,
  "data": {
    "object": {
      "id": "cus_QRcNyZh9aZHXnI",
      "object": "customer",
      ...
      "metadata": {
        "cms_id": "cust_6573"
      },
      ...
    }
  },
  ...
  "type": "customer.updated"
}
```

## Track order fulfillment

Use metadata to store data that facilitates or tracks your order fulfillment processes.

### Price or Product ID on a payment intent

When you directly create [payment intents](https://docs.stripe.com/api/payment_intents.md), you can associate them with your [products](https://docs.stripe.com/api/prodcuts.md) or [prices](https://docs.stripe.com/api/prices.md) using metadata. This allows you to store the ID of the associated objects on the payment intent, which lacks an existing field that associates them with a price or product.

```dotnet
StripeConfiguration.ApiKey = "<<secret key>>";

var options = new PaymentIntentCreateOptions
{
    Amount = 2000,
    Currency = "usd",
    AutomaticPaymentMethods = new PaymentIntentAutomaticPaymentMethodsOptions { Enabled = true },
    Metadata = new Dictionary<string, string>
    {
        { "price_id", "price_1MoBy5LkdIwHu7ixZhnattbh" },
        { "product_id", "prod_NWjs8kKbJWmuuc" },
    },
};
var service = new PaymentIntentService();
PaymentIntent paymentIntent = service.Create(options);
```

```go
stripe.Key = "<<secret key>>"

params := &stripe.PaymentIntentParams{
  Amount: stripe.Int64(2000),
  Currency: stripe.String(string(stripe.CurrencyUSD)),
  AutomaticPaymentMethods: &stripe.PaymentIntentAutomaticPaymentMethodsParams{
    Enabled: stripe.Bool(true),
  },
};
params.AddMetadata("price_id", "price_1MoBy5LkdIwHu7ixZhnattbh")
params.AddMetadata("product_id", "prod_NWjs8kKbJWmuuc")
result, err := paymentintent.New(params);
```

```java
Stripe.apiKey = "<<secret key>>";

PaymentIntentCreateParams params =
  PaymentIntentCreateParams.builder()
    .setAmount(2000L)
    .setCurrency("usd")
    .setAutomaticPaymentMethods(
      PaymentIntentCreateParams.AutomaticPaymentMethods.builder().setEnabled(true).build()
    )
    .putMetadata("price_id", "price_1MoBy5LkdIwHu7ixZhnattbh")
    .putMetadata("product_id", "prod_NWjs8kKbJWmuuc")
    .build();

PaymentIntent paymentIntent = PaymentIntent.create(params);
```

```node
const stripe = require('stripe')('<<secret key>>');

const paymentIntent = await stripe.paymentIntents.create({
  amount: 2000,
  currency: 'usd',
  automatic_payment_methods: {
    enabled: true,
  },
  metadata: {
    price_id: 'price_1MoBy5LkdIwHu7ixZhnattbh',
    product_id: 'prod_NWjs8kKbJWmuuc',
  },
});
```

```python
import stripe
stripe.api_key = "<<secret key>>"

payment_intent = stripe.PaymentIntent.create(
  amount=2000,
  currency="usd",
  automatic_payment_methods={"enabled": True},
  metadata={"price_id": "price_1MoBy5LkdIwHu7ixZhnattbh", "product_id": "prod_NWjs8kKbJWmuuc"},
)
```

```php
$stripe = new \Stripe\StripeClient('<<secret key>>');

$paymentIntent = $stripe->paymentIntents->create([
  'amount' => 2000,
  'currency' => 'usd',
  'automatic_payment_methods' => ['enabled' => true],
  'metadata' => [
    'price_id' => 'price_1MoBy5LkdIwHu7ixZhnattbh',
    'product_id' => 'prod_NWjs8kKbJWmuuc',
  ],
]);
```

```ruby
Stripe.api_key = '<<secret key>>'

payment_intent = Stripe::PaymentIntent.create({
  amount: 2000,
  currency: 'usd',
  automatic_payment_methods: {enabled: true},
  metadata: {
    price_id: 'price_1MoBy5LkdIwHu7ixZhnattbh',
    product_id: 'prod_NWjs8kKbJWmuuc',
  },
})
```

You can locate the ID of the associated object in events that include that payment intent, such as `payment_intent.succeeded` events. Then, pass the metadata from the event to your downstream processes (for example, order fulfillment or inventory management).

```json
{
  "id": "evt_3PajIyCzbZon1zn90b9Wvsqf",
  "object": "event",
  "api_version": "2024-06-20",
  "created": 1720551759,
  "data": {
    "object": {
      "id": "pi_3PajIyCzbZon1zn901xQeOdi",
      "object": "payment_intent",
      ...
      "metadata": {
        "price_id": "price_1MoBy5LkdIwHu7ixZhnattbh",
        "product_id": "prod_NWjs8kKbJWmuuc"
      },
      ...
    }
  },
  ...
  "type": "payment_intent.succeeded",
}
```

### Fulfillment status and tracking

After you begin your order fulfillment flow, you can use metadata to record the current fulfillment status on the associated Stripe object. This allows you to retrieve an object from Stripe, and receive both the payment status and fulfillment status simultaneously.

```dotnet
StripeConfiguration.ApiKey = "<<secret key>>";

var options = new PaymentIntentCreateOptions
{
    Amount = 2000,
    Currency = "usd",
    AutomaticPaymentMethods = new PaymentIntentAutomaticPaymentMethodsOptions { Enabled = true },
    Metadata = new Dictionary<string, string>
    {
        { "fulfillment_status", "fulfillment_not_started" },
    },
};
var service = new PaymentIntentService();
PaymentIntent paymentIntent = service.Create(options);
```

```go
stripe.Key = "<<secret key>>"

params := &stripe.PaymentIntentParams{
  Amount: stripe.Int64(2000),
  Currency: stripe.String(string(stripe.CurrencyUSD)),
  AutomaticPaymentMethods: &stripe.PaymentIntentAutomaticPaymentMethodsParams{
    Enabled: stripe.Bool(true),
  },
};
params.AddMetadata("fulfillment_status", "fulfillment_not_started")
result, err := paymentintent.New(params);
```

```java
Stripe.apiKey = "<<secret key>>";

PaymentIntentCreateParams params =
  PaymentIntentCreateParams.builder()
    .setAmount(2000L)
    .setCurrency("usd")
    .setAutomaticPaymentMethods(
      PaymentIntentCreateParams.AutomaticPaymentMethods.builder().setEnabled(true).build()
    )
    .putMetadata("fulfillment_status", "fulfillment_not_started")
    .build();

PaymentIntent paymentIntent = PaymentIntent.create(params);
```

```node
const stripe = require('stripe')('<<secret key>>');

const paymentIntent = await stripe.paymentIntents.create({
  amount: 2000,
  currency: 'usd',
  automatic_payment_methods: {
    enabled: true,
  },
  metadata: {
    fulfillment_status: 'fulfillment_not_started',
  },
});
```

```python
import stripe
stripe.api_key = "<<secret key>>"

payment_intent = stripe.PaymentIntent.create(
  amount=2000,
  currency="usd",
  automatic_payment_methods={"enabled": True},
  metadata={"fulfillment_status": "fulfillment_not_started"},
)
```

```php
$stripe = new \Stripe\StripeClient('<<secret key>>');

$paymentIntent = $stripe->paymentIntents->create([
  'amount' => 2000,
  'currency' => 'usd',
  'automatic_payment_methods' => ['enabled' => true],
  'metadata' => ['fulfillment_status' => 'fulfillment_not_started'],
]);
```

```ruby
Stripe.api_key = '<<secret key>>'

payment_intent = Stripe::PaymentIntent.create({
  amount: 2000,
  currency: 'usd',
  automatic_payment_methods: {enabled: true},
  metadata: {fulfillment_status: 'fulfillment_not_started'},
})
```

To update the current fulfillment status:

```dotnet
StripeConfiguration.ApiKey = "<<secret key>>";

var options = new PaymentIntentUpdateOptions
{
    Metadata = new Dictionary<string, string>
    {
        { "fulfillment_status", "shipping_label_created" },
    },
};
var service = new PaymentIntentService();
PaymentIntent paymentIntent = service.Update("{{INTENT_ID}}", options);
```

```go
stripe.Key = "<<secret key>>"

params := &stripe.PaymentIntentParams{};
params.AddMetadata("fulfillment_status", "shipping_label_created")
result, err := paymentintent.Update("{{INTENT_ID}}", params);
```

```java
Stripe.apiKey = "<<secret key>>";

PaymentIntent resource = PaymentIntent.retrieve("{{INTENT_ID}}");

PaymentIntentUpdateParams params =
  PaymentIntentUpdateParams.builder()
    .putMetadata("fulfillment_status", "shipping_label_created")
    .build();

PaymentIntent paymentIntent = resource.update(params);
```

```node
const stripe = require('stripe')('<<secret key>>');

const paymentIntent = await stripe.paymentIntents.update(
  '{{INTENT_ID}}',
  {
    metadata: {
      fulfillment_status: 'shipping_label_created',
    },
  }
);
```

```python
import stripe
stripe.api_key = "<<secret key>>"

payment_intent = stripe.PaymentIntent.modify(
  "{{INTENT_ID}}",
  metadata={"fulfillment_status": "shipping_label_created"},
)
```

```php
$stripe = new \Stripe\StripeClient('<<secret key>>');

$paymentIntent = $stripe->paymentIntents->update(
  '{{INTENT_ID}}',
  ['metadata' => ['fulfillment_status' => 'shipping_label_created']]
);
```

```ruby
Stripe.api_key = '<<secret key>>'

payment_intent = Stripe::PaymentIntent.update(
  '{{INTENT_ID}}',
  {metadata: {fulfillment_status: 'shipping_label_created'}},
)
```

## Track affiliate links

In [some cases](https://docs.stripe.com/metadata.md#exceptions), Stripe copies `metadata` from the original object to a related object. If you have affiliates hosting [Payment Links](https://docs.stripe.com/api/payment_links.md) on their sites and offer incentives for sales originating from those links, you can use this behavior in your affiliate tracking.

When you create payment links, you can populate `metadata` to track your affiliate:

```dotnet
StripeConfiguration.ApiKey = "<<secret key>>";

var options = new PaymentLinkCreateOptions
{
    LineItems = new List<PaymentLinkLineItemOptions>
    {
        new PaymentLinkLineItemOptions { Price = "price_1MotwRLkdIwHu7ixYcPLm5uZ", Quantity = 1 },
    },
    Metadata = new Dictionary<string, string> { { "affiliate", "afl_7920" } },
};
var service = new PaymentLinkService();
PaymentLink paymentLink = service.Create(options);
```

```go
stripe.Key = "<<secret key>>"

params := &stripe.PaymentLinkParams{
  LineItems: []*stripe.PaymentLinkLineItemParams{
    &stripe.PaymentLinkLineItemParams{
      Price: stripe.String("price_1MotwRLkdIwHu7ixYcPLm5uZ"),
      Quantity: stripe.Int64(1),
    },
  },
};
params.AddMetadata("affiliate", "afl_7920")
result, err := paymentlink.New(params);
```

```java
Stripe.apiKey = "<<secret key>>";

PaymentLinkCreateParams params =
  PaymentLinkCreateParams.builder()
    .addLineItem(
      PaymentLinkCreateParams.LineItem.builder()
        .setPrice("price_1MotwRLkdIwHu7ixYcPLm5uZ")
        .setQuantity(1L)
        .build()
    )
    .putMetadata("affiliate", "afl_7920")
    .build();

PaymentLink paymentLink = PaymentLink.create(params);
```

```node
const stripe = require('stripe')('<<secret key>>');

const paymentLink = await stripe.paymentLinks.create({
  line_items: [
    {
      price: 'price_1MotwRLkdIwHu7ixYcPLm5uZ',
      quantity: 1,
    },
  ],
  metadata: {
    affiliate: 'afl_7920',
  },
});
```

```python
import stripe
stripe.api_key = "<<secret key>>"

payment_link = stripe.PaymentLink.create(
  line_items=[{"price": "price_1MotwRLkdIwHu7ixYcPLm5uZ", "quantity": 1}],
  metadata={"affiliate": "afl_7920"},
)
```

```php
$stripe = new \Stripe\StripeClient('<<secret key>>');

$paymentLink = $stripe->paymentLinks->create([
  'line_items' => [
    [
      'price' => 'price_1MotwRLkdIwHu7ixYcPLm5uZ',
      'quantity' => 1,
    ],
  ],
  'metadata' => ['affiliate' => 'afl_7920'],
]);
```

```ruby
Stripe.api_key = '<<secret key>>'

payment_link = Stripe::PaymentLink.create({
  line_items: [
    {
      price: 'price_1MotwRLkdIwHu7ixYcPLm5uZ',
      quantity: 1,
    },
  ],
  metadata: {affiliate: 'afl_7920'},
})
```

Every time a customer uses that link to complete a purchase, Stripe creates a [Checkout Session](https://docs.stripe.com/api/checkkout/sessions.md) that inherits the metadata that you provided on the payment link. You can monitor `checkout.session.completed` events to receive notifications from Stripe when a customer completes a purchase. You can then pull your affiliate tracking details from the Checkout Session’s metadata to attribute the sale accurately.

```json
{
 "id": "evt_1PajfeCzbZon1zn9S7pNlQkU",
 "object": "event",
 "api_version": "2024-06-20",
 "created": 1720553150,
 "data": {
   "object": {
      "id": "cs_test_a1zgRtgzjvamTgTnqMqIaqP6zehBIkaM03iYzxNjZiJ7FMDRRhibd5w3gL",
      "object": "checkout.session",
      ...
      "metadata": {
        "affiliate": "afl_7920"
      },
      ...
    }
  },
  ...
  "type": "checkout.session.completed",
}
```

## Store notes

You can use metadata to store notes on objects. For example, to create a note of a customer’s preferred call time, add metadata to the [Customer](https://docs.stripe.com/api/customers.md) object:

```dotnet
StripeConfiguration.ApiKey = "<<secret key>>";

var options = new CustomerCreateOptions
{
    Name = "Jenny Rosen",
    Metadata = new Dictionary<string, string> { { "call_window", "10:00 AM - 2:00 PM" } },
};
var service = new CustomerService();
Customer customer = service.Create(options);
```

```go
stripe.Key = "<<secret key>>"

params := &stripe.CustomerParams{Name: stripe.String("Jenny Rosen")};
params.AddMetadata("call_window", "10:00 AM - 2:00 PM")
result, err := customer.New(params);
```

```java
Stripe.apiKey = "<<secret key>>";

CustomerCreateParams params =
  CustomerCreateParams.builder()
    .setName("Jenny Rosen")
    .putMetadata("call_window", "10:00 AM - 2:00 PM")
    .build();

Customer customer = Customer.create(params);
```

```node
const stripe = require('stripe')('<<secret key>>');

const customer = await stripe.customers.create({
  name: 'Jenny Rosen',
  metadata: {
    call_window: '10:00 AM - 2:00 PM',
  },
});
```

```python
import stripe
stripe.api_key = "<<secret key>>"

customer = stripe.Customer.create(
  name="Jenny Rosen",
  metadata={"call_window": "10:00 AM - 2:00 PM"},
)
```

```php
$stripe = new \Stripe\StripeClient('<<secret key>>');

$customer = $stripe->customers->create([
  'name' => 'Jenny Rosen',
  'metadata' => ['call_window' => '10:00 AM - 2:00 PM'],
]);
```

```ruby
Stripe.api_key = '<<secret key>>'

customer = Stripe::Customer.create({
  name: 'Jenny Rosen',
  metadata: {call_window: '10:00 AM - 2:00 PM'},
})
```

To store a note that details why an [Invoice](https://docs.stripe.com/api/invoices.md) was voided, you can use the `metadata` on the `Invoice` object:

```dotnet
StripeConfiguration.ApiKey = "<<secret key>>";

var options = new InvoiceUpdateOptions
{
    Metadata = new Dictionary<string, string> { { "void_reason", "Duplicate of Invoice #011" } },
};
var service = new InvoiceService();
Invoice invoice = service.Update("{{INVOICE_ID}}", options);
```

```go
stripe.Key = "<<secret key>>"

params := &stripe.InvoiceParams{};
params.AddMetadata("void_reason", "Duplicate of Invoice #011")
result, err := invoice.Update("{{INVOICE_ID}}", params);
```

```java
Stripe.apiKey = "<<secret key>>";

Invoice resource = Invoice.retrieve("{{INVOICE_ID}}");

InvoiceUpdateParams params =
  InvoiceUpdateParams.builder().putMetadata("void_reason", "Duplicate of Invoice #011").build();

Invoice invoice = resource.update(params);
```

```node
const stripe = require('stripe')('<<secret key>>');

const invoice = await stripe.invoices.update(
  '{{INVOICE_ID}}',
  {
    metadata: {
      void_reason: 'Duplicate of Invoice #011',
    },
  }
);
```

```python
import stripe
stripe.api_key = "<<secret key>>"

invoice = stripe.Invoice.modify(
  "{{INVOICE_ID}}",
  metadata={"void_reason": "Duplicate of Invoice #011"},
)
```

```php
$stripe = new \Stripe\StripeClient('<<secret key>>');

$invoice = $stripe->invoices->update(
  '{{INVOICE_ID}}',
  ['metadata' => ['void_reason' => 'Duplicate of Invoice #011']]
);
```

```ruby
Stripe.api_key = '<<secret key>>'

invoice = Stripe::Invoice.update(
  '{{INVOICE_ID}}',
  {metadata: {void_reason: 'Duplicate of Invoice #011'}},
)
```

## Set metadata indirectly

The placement of your metadata determines which event types contain the information you provide. Similarly, if you’re tracking certain event types in your integration, it determines where you place your metadata.

Certain object creation endpoints contain multiple fields for your metadata: one for storing metadata directly on the object being created, and others for setting metadata on downstream-created objects. Learn more about the [indirect metadata fields](https://docs.stripe.com/metadata.md#set-indirectly).

The following example creates a [Checkout Session](https://docs.stripe.com/api/checkout/sessions.md) that generates a subscription when completed. This uses the top-level `metadata` field, and the `subscription_data.metadata` field:

```dotnet
StripeConfiguration.ApiKey = "<<secret key>>";

var options = new Stripe.Checkout.SessionCreateOptions
{
    SuccessUrl = "https://example.com/success",
    Mode = "subscription",
    LineItems = new List<Stripe.Checkout.SessionLineItemOptions>
    {
        new Stripe.Checkout.SessionLineItemOptions
        {
            Price = "price_1MotwRLkdIwHu7ixYcPLm5uZ",
            Quantity = 1,
        },
    },
    Metadata = new Dictionary<string, string>
    {
        { "checkout_metadata", "Checkout Session metadata goes here" },
    },
    SubscriptionData = new Stripe.Checkout.SessionSubscriptionDataOptions
    {
        Metadata = new Dictionary<string, string>
        {
            { "subscription_metadata", "Subscription metadata goes here" },
        },
    },
};
var service = new Stripe.Checkout.SessionService();
Stripe.Checkout.Session session = service.Create(options);
```

```go
stripe.Key = "<<secret key>>"

params := &stripe.CheckoutSessionParams{
  SuccessURL: stripe.String("https://example.com/success"),
  Mode: stripe.String(string(stripe.CheckoutSessionModeSubscription)),
  LineItems: []*stripe.CheckoutSessionLineItemParams{
    &stripe.CheckoutSessionLineItemParams{
      Price: stripe.String("price_1MotwRLkdIwHu7ixYcPLm5uZ"),
      Quantity: stripe.Int64(1),
    },
  },
  SubscriptionData: &stripe.CheckoutSessionSubscriptionDataParams{
    Metadata: map[string]string{"subscription_metadata": "Subscription metadata goes here"},
  },
};
params.AddMetadata("checkout_metadata", "Checkout Session metadata goes here")
result, err := session.New(params);
```

```java
Stripe.apiKey = "<<secret key>>";

SessionCreateParams params =
  SessionCreateParams.builder()
    .setSuccessUrl("https://example.com/success")
    .setMode(SessionCreateParams.Mode.SUBSCRIPTION)
    .addLineItem(
      SessionCreateParams.LineItem.builder()
        .setPrice("price_1MotwRLkdIwHu7ixYcPLm5uZ")
        .setQuantity(1L)
        .build()
    )
    .putMetadata("checkout_metadata", "Checkout Session metadata goes here")
    .setSubscriptionData(
      SessionCreateParams.SubscriptionData.builder()
        .putMetadata("subscription_metadata", "Subscription metadata goes here")
        .build()
    )
    .build();

Session session = Session.create(params);
```

```node
const stripe = require('stripe')('<<secret key>>');

const session = await stripe.checkout.sessions.create({
  success_url: 'https://example.com/success',
  mode: 'subscription',
  line_items: [
    {
      price: 'price_1MotwRLkdIwHu7ixYcPLm5uZ',
      quantity: 1,
    },
  ],
  metadata: {
    checkout_metadata: 'Checkout Session metadata goes here',
  },
  subscription_data: {
    metadata: {
      subscription_metadata: 'Subscription metadata goes here',
    },
  },
});
```

```python
import stripe
stripe.api_key = "<<secret key>>"

session = stripe.checkout.Session.create(
  success_url="https://example.com/success",
  mode="subscription",
  line_items=[{"price": "price_1MotwRLkdIwHu7ixYcPLm5uZ", "quantity": 1}],
  metadata={"checkout_metadata": "Checkout Session metadata goes here"},
  subscription_data={"metadata": {"subscription_metadata": "Subscription metadata goes here"}},
)
```

```php
$stripe = new \Stripe\StripeClient('<<secret key>>');

$session = $stripe->checkout->sessions->create([
  'success_url' => 'https://example.com/success',
  'mode' => 'subscription',
  'line_items' => [
    [
      'price' => 'price_1MotwRLkdIwHu7ixYcPLm5uZ',
      'quantity' => 1,
    ],
  ],
  'metadata' => ['checkout_metadata' => 'Checkout Session metadata goes here'],
  'subscription_data' => [
    'metadata' => ['subscription_metadata' => 'Subscription metadata goes here'],
  ],
]);
```

```ruby
Stripe.api_key = '<<secret key>>'

session = Stripe::Checkout::Session.create({
  success_url: 'https://example.com/success',
  mode: 'subscription',
  line_items: [
    {
      price: 'price_1MotwRLkdIwHu7ixYcPLm5uZ',
      quantity: 1,
    },
  ],
  metadata: {checkout_metadata: 'Checkout Session metadata goes here'},
  subscription_data: {metadata: {subscription_metadata: 'Subscription metadata goes here'}},
})
```

You can set metadata on the object that you create (in this case, the Checkout Session). After your customer completes the checkout process, the metadata previously provided in `subscription_data.metadata` is set on the newly created [Subscription](https://docs.stripe.com/api/subscriptions.md) object. This determines which events include the metadata. For example, events that contain a Checkout Session, such as `checkout.session.completed`, contain values provided through the top-level `metadata` parameter.

```json
{
  "id": "evt_1PakshCzbZon1zn9PlQwJYn0",
  "object": "event",
  "api_version": "2024-06-20",
  "created": 1720557803,
  "data": {
    "object": {
      "id": "cs_test_a1lsYmNYnEqQAxHT9knVy8v7u7m5ChjKtyB3M68ovMCjUQgCADsCkUviUU",
      "object": "checkout.session",
      ...
      "metadata": {
        "checkout_metadata": "Checkout Session metadata goes here"
      },
      ...
    }
  },
  ...
  "type": "checkout.session.completed",
}
```

Events that contain a `Subscription` object, such as `customer.subscription.created`, contain values provided through `subscription_data.metadata`. However, because that event contains a Subscription object, Stripe provides the values in the top-level `metadata` field on the Subscription object.

```json
{
  "id": "evt_1PaksgCzbZon1zn9x9u3MTSC",
  "object": "event",
  "api_version": "2024-06-20",
  "created": 1720557800,
  "data": {
    "object": {
      "id": "sub_1PaksdCzbZon1zn9D6DQjr9L",
      "object": "subscription",
      ...
      "metadata": {
        "subscription_metadata": "Subscription metadata goes here"
      },
      ...
    }
  },
  ...
  "type": "customer.subscription.created",
}
```

You can access the metadata you provide in `subscription_data.metadata` in the [invoice](https://docs.stripe.com/api/invoices.md) events. This occurs because the subscription’s metadata is transferred to `subscription_details.metadata` on the `Invoice` objects created by the subscription.

```json
{
  "id": "evt_1PaksgCzbZon1zn9wD24BlvY",
  "object": "event",
  "api_version": "2024-06-20",
  "created": 1720557800,
  "data": {
    "object": {
      "id": "in_1PaksdCzbZon1zn9Z4bl0z7k",
      "object": "invoice",
      ...
      "subscription_details": {
        "metadata": {
          "subscription_metadata": "Subscription metadata goes here"
        }
        ...
      },
    }
  },
  ...
  "type": "invoice.finalized",
}
```

## Store large amounts of metadata

Use metadata fields in Stripe to store data directly or store an external lookup key to access additional data from your own database, minimizing the information you need to retrieve.

### Store structured data

Metadata can accept any string, including those representing structured data such as JSON, up to [500 characters](https://docs.stripe.com/metadata.md#data). You can use it to store more data within your metadata fields, reducing the number of keys you need to access to retrieve all your information.

```dotnet
StripeConfiguration.ApiKey = "<<secret key>>";

var options = new AccountCreateOptions
{
    Metadata = new Dictionary<string, string>
    {
        {
            "account_details",
            "{\"sourcing_details\":{\"found_from\":\"web_search\",\"referrer\":\"user_123\",\"joined\":\"2024-01-01\"},\"tier_information\":{\"tier\":\"silver\",\"total_sales\":35,\"next_tier_at\":50,\"next_tier\":\"gold\"}}"
        },
    },
};
var service = new AccountService();
Account account = service.Create(options);
```

```go
stripe.Key = "<<secret key>>"

params := &stripe.AccountParams{};
params.AddMetadata(
  "account_details", "{\"sourcing_details\":{\"found_from\":\"web_search\",\"referrer\":\"user_123\",\"joined\":\"2024-01-01\"},\"tier_information\":{\"tier\":\"silver\",\"total_sales\":35,\"next_tier_at\":50,\"next_tier\":\"gold\"}}")
result, err := account.New(params);
```

```java
Stripe.apiKey = "<<secret key>>";

AccountCreateParams params =
  AccountCreateParams.builder()
    .putMetadata(
      "account_details",
      "{\"sourcing_details\":{\"found_from\":\"web_search\",\"referrer\":\"user_123\",\"joined\":\"2024-01-01\"},\"tier_information\":{\"tier\":\"silver\",\"total_sales\":35,\"next_tier_at\":50,\"next_tier\":\"gold\"}}"
    )
    .build();

Account account = Account.create(params);
```

```node
const stripe = require('stripe')('<<secret key>>');

const account = await stripe.accounts.create({
  metadata: {
    account_details: '{"sourcing_details":{"found_from":"web_search","referrer":"user_123","joined":"2024-01-01"},"tier_information":{"tier":"silver","total_sales":35,"next_tier_at":50,"next_tier":"gold"}}',
  },
});
```

```python
import stripe
stripe.api_key = "<<secret key>>"

account = stripe.Account.create(
  metadata={
    "account_details":
    "{\"sourcing_details\":{\"found_from\":\"web_search\",\"referrer\":\"user_123\",\"joined\":\"2024-01-01\"},\"tier_information\":{\"tier\":\"silver\",\"total_sales\":35,\"next_tier_at\":50,\"next_tier\":\"gold\"}}",
  },
)
```

```php
$stripe = new \Stripe\StripeClient('<<secret key>>');

$account = $stripe->accounts->create([
  'metadata' => [
    'account_details' => '{"sourcing_details":{"found_from":"web_search","referrer":"user_123","joined":"2024-01-01"},"tier_information":{"tier":"silver","total_sales":35,"next_tier_at":50,"next_tier":"gold"}}',
  ],
]);
```

```ruby
Stripe.api_key = '<<secret key>>'

account = Stripe::Account.create({
  metadata: {
    account_details: '{"sourcing_details":{"found_from":"web_search","referrer":"user_123","joined":"2024-01-01"},"tier_information":{"tier":"silver","total_sales":35,"next_tier_at":50,"next_tier":"gold"}}',
  },
})
```

### Store metadata externally

To associate more data with an object than the [500 characters](https://docs.stripe.com/metadata.md#data) the provided metadata fields allow, store the excess data in your own database. You can then use metadata to store the ID or lookup key for accessing that information. This approach is similar to storing the ID of any other record in your system.

```dotnet
StripeConfiguration.ApiKey = "<<secret key>>";

var options = new AccountCreateOptions
{
    Metadata = new Dictionary<string, string> { { "account_details_lookup_key", "rec_a1b2c3" } },
};
var service = new AccountService();
Account account = service.Create(options);
```

```go
stripe.Key = "<<secret key>>"

params := &stripe.AccountParams{};
params.AddMetadata("account_details_lookup_key", "rec_a1b2c3")
result, err := account.New(params);
```

```java
Stripe.apiKey = "<<secret key>>";

AccountCreateParams params =
  AccountCreateParams.builder().putMetadata("account_details_lookup_key", "rec_a1b2c3").build();

Account account = Account.create(params);
```

```node
const stripe = require('stripe')('<<secret key>>');

const account = await stripe.accounts.create({
  metadata: {
    account_details_lookup_key: 'rec_a1b2c3',
  },
});
```

```python
import stripe
stripe.api_key = "<<secret key>>"

account = stripe.Account.create(metadata={"account_details_lookup_key": "rec_a1b2c3"})
```

```php
$stripe = new \Stripe\StripeClient('<<secret key>>');

$account = $stripe->accounts->create([
  'metadata' => ['account_details_lookup_key' => 'rec_a1b2c3'],
]);
```

```ruby
Stripe.api_key = '<<secret key>>'

account = Stripe::Account.create({metadata: {account_details_lookup_key: 'rec_a1b2c3'}})
```

## Use metadata with other Stripe APIs and products

You can use metadata with other Stripe APIs and products to enhance their flexibility and extensibility.

### Radar

You can write Radar rules to [reference metadata](https://docs.stripe.com/radar/rules/reference.md#metadata-attributes) values and use them to determine if a rule triggers its associated action for a transaction.

#### Perform initial review of customer transactions

You can set up a flow to flag a [customer’s](https://docs.stripe.com/api/customers.md) initial transaction for review, then update the customer’s details to omit subsequent transactions from review.

```dotnet
StripeConfiguration.ApiKey = "<<secret key>>";

var options = new CustomerCreateOptions
{
    Name = "Jenny Rosen",
    Metadata = new Dictionary<string, string> { { "verified_customer", "false" } },
};
var service = new CustomerService();
Customer customer = service.Create(options);
```

```go
stripe.Key = "<<secret key>>"

params := &stripe.CustomerParams{Name: stripe.String("Jenny Rosen")};
params.AddMetadata("verified_customer", "false")
result, err := customer.New(params);
```

```java
Stripe.apiKey = "<<secret key>>";

CustomerCreateParams params =
  CustomerCreateParams.builder()
    .setName("Jenny Rosen")
    .putMetadata("verified_customer", "false")
    .build();

Customer customer = Customer.create(params);
```

```node
const stripe = require('stripe')('<<secret key>>');

const customer = await stripe.customers.create({
  name: 'Jenny Rosen',
  metadata: {
    verified_customer: 'false',
  },
});
```

```python
import stripe
stripe.api_key = "<<secret key>>"

customer = stripe.Customer.create(
  name="Jenny Rosen",
  metadata={"verified_customer": "false"},
)
```

```php
$stripe = new \Stripe\StripeClient('<<secret key>>');

$customer = $stripe->customers->create([
  'name' => 'Jenny Rosen',
  'metadata' => ['verified_customer' => 'false'],
]);
```

```ruby
Stripe.api_key = '<<secret key>>'

customer = Stripe::Customer.create({
  name: 'Jenny Rosen',
  metadata: {verified_customer: 'false'},
})
```

Review if ::customer:verified_customer:: != `'true'`

```dotnet
StripeConfiguration.ApiKey = "<<secret key>>";

var options = new CustomerUpdateOptions
{
    Metadata = new Dictionary<string, string> { { "verified_customer", "true" } },
};
var service = new CustomerService();
Customer customer = service.Update("{{CUSTOMER_ID}}", options);
```

```go
stripe.Key = "<<secret key>>"

params := &stripe.CustomerParams{};
params.AddMetadata("verified_customer", "true")
result, err := customer.Update("{{CUSTOMER_ID}}", params);
```

```java
Stripe.apiKey = "<<secret key>>";

Customer resource = Customer.retrieve("{{CUSTOMER_ID}}");

CustomerUpdateParams params =
  CustomerUpdateParams.builder().putMetadata("verified_customer", "true").build();

Customer customer = resource.update(params);
```

```node
const stripe = require('stripe')('<<secret key>>');

const customer = await stripe.customers.update(
  '{{CUSTOMER_ID}}',
  {
    metadata: {
      verified_customer: 'true',
    },
  }
);
```

```python
import stripe
stripe.api_key = "<<secret key>>"

customer = stripe.Customer.modify(
  "{{CUSTOMER_ID}}",
  metadata={"verified_customer": "true"},
)
```

```php
$stripe = new \Stripe\StripeClient('<<secret key>>');

$customer = $stripe->customers->update(
  '{{CUSTOMER_ID}}',
  ['metadata' => ['verified_customer' => 'true']]
);
```

```ruby
Stripe.api_key = '<<secret key>>'

customer = Stripe::Customer.update('{{CUSTOMER_ID}}', {metadata: {verified_customer: 'true'}})
```

Stripe only triggers this rule for payments if `verified_customer` is set to `false` on the customer. Customers who have that set to `true` aren’t affected.

#### A/B testing rules

You can use metadata with Radar to create A/B testing scenarios for new rules, allowing you to evaluate a new rule’s effectiveness before implementing it across your entire customer base.

```dotnet
StripeConfiguration.ApiKey = "<<secret key>>";

var options = new PaymentIntentCreateOptions
{
    Amount = 2000,
    Currency = "usd",
    AutomaticPaymentMethods = new PaymentIntentAutomaticPaymentMethodsOptions { Enabled = true },
    Metadata = new Dictionary<string, string> { { "experiment_group", "treatment" } },
};
var service = new PaymentIntentService();
PaymentIntent paymentIntent = service.Create(options);
```

```go
stripe.Key = "<<secret key>>"

params := &stripe.PaymentIntentParams{
  Amount: stripe.Int64(2000),
  Currency: stripe.String(string(stripe.CurrencyUSD)),
  AutomaticPaymentMethods: &stripe.PaymentIntentAutomaticPaymentMethodsParams{
    Enabled: stripe.Bool(true),
  },
};
params.AddMetadata("experiment_group", "treatment")
result, err := paymentintent.New(params);
```

```java
Stripe.apiKey = "<<secret key>>";

PaymentIntentCreateParams params =
  PaymentIntentCreateParams.builder()
    .setAmount(2000L)
    .setCurrency("usd")
    .setAutomaticPaymentMethods(
      PaymentIntentCreateParams.AutomaticPaymentMethods.builder().setEnabled(true).build()
    )
    .putMetadata("experiment_group", "treatment")
    .build();

PaymentIntent paymentIntent = PaymentIntent.create(params);
```

```node
const stripe = require('stripe')('<<secret key>>');

const paymentIntent = await stripe.paymentIntents.create({
  amount: 2000,
  currency: 'usd',
  automatic_payment_methods: {
    enabled: true,
  },
  metadata: {
    experiment_group: 'treatment',
  },
});
```

```python
import stripe
stripe.api_key = "<<secret key>>"

payment_intent = stripe.PaymentIntent.create(
  amount=2000,
  currency="usd",
  automatic_payment_methods={"enabled": True},
  metadata={"experiment_group": "treatment"},
)
```

```php
$stripe = new \Stripe\StripeClient('<<secret key>>');

$paymentIntent = $stripe->paymentIntents->create([
  'amount' => 2000,
  'currency' => 'usd',
  'automatic_payment_methods' => ['enabled' => true],
  'metadata' => ['experiment_group' => 'treatment'],
]);
```

```ruby
Stripe.api_key = '<<secret key>>'

payment_intent = Stripe::PaymentIntent.create({
  amount: 2000,
  currency: 'usd',
  automatic_payment_methods: {enabled: true},
  metadata: {experiment_group: 'treatment'},
})
```

```dotnet
StripeConfiguration.ApiKey = "<<secret key>>";

var options = new PaymentIntentCreateOptions
{
    Amount = 2000,
    Currency = "usd",
    AutomaticPaymentMethods = new PaymentIntentAutomaticPaymentMethodsOptions { Enabled = true },
    Metadata = new Dictionary<string, string> { { "experiment_group", "control" } },
};
var service = new PaymentIntentService();
PaymentIntent paymentIntent = service.Create(options);
```

```go
stripe.Key = "<<secret key>>"

params := &stripe.PaymentIntentParams{
  Amount: stripe.Int64(2000),
  Currency: stripe.String(string(stripe.CurrencyUSD)),
  AutomaticPaymentMethods: &stripe.PaymentIntentAutomaticPaymentMethodsParams{
    Enabled: stripe.Bool(true),
  },
};
params.AddMetadata("experiment_group", "control")
result, err := paymentintent.New(params);
```

```java
Stripe.apiKey = "<<secret key>>";

PaymentIntentCreateParams params =
  PaymentIntentCreateParams.builder()
    .setAmount(2000L)
    .setCurrency("usd")
    .setAutomaticPaymentMethods(
      PaymentIntentCreateParams.AutomaticPaymentMethods.builder().setEnabled(true).build()
    )
    .putMetadata("experiment_group", "control")
    .build();

PaymentIntent paymentIntent = PaymentIntent.create(params);
```

```node
const stripe = require('stripe')('<<secret key>>');

const paymentIntent = await stripe.paymentIntents.create({
  amount: 2000,
  currency: 'usd',
  automatic_payment_methods: {
    enabled: true,
  },
  metadata: {
    experiment_group: 'control',
  },
});
```

```python
import stripe
stripe.api_key = "<<secret key>>"

payment_intent = stripe.PaymentIntent.create(
  amount=2000,
  currency="usd",
  automatic_payment_methods={"enabled": True},
  metadata={"experiment_group": "control"},
)
```

```php
$stripe = new \Stripe\StripeClient('<<secret key>>');

$paymentIntent = $stripe->paymentIntents->create([
  'amount' => 2000,
  'currency' => 'usd',
  'automatic_payment_methods' => ['enabled' => true],
  'metadata' => ['experiment_group' => 'control'],
]);
```

```ruby
Stripe.api_key = '<<secret key>>'

payment_intent = Stripe::PaymentIntent.create({
  amount: 2000,
  currency: 'usd',
  automatic_payment_methods: {enabled: true},
  metadata: {experiment_group: 'control'},
})
```

Block if
::experiment_group:: = `'treatment'` and
:card_funding: = `'prepaid'`

Stripe only triggers this rule for payments that you label as part of the treatment group. It doesn’t affect payments set to `control` as their `experiment_group`.

### The Search API

Use the [Search API](https://docs.stripe.com/search.md#metadata) to query and filter results based on the metadata that you set on the [supported objects](https://docs.stripe.com/search.md#supported-query-fields-for-each-resource) you’re searching for.

For example, you can track your “premium” customers by adding metadata to the [Customer](https://docs.stripe.com/api/customers.md) object. To offer them exclusive promotions, use the Search API to identify customers marked as `premium`, then reach out to them with the promotion.

```dotnet
StripeConfiguration.ApiKey = "<<secret key>>";

var options = new CustomerCreateOptions
{
    Name = "Jenny Rosen",
    Metadata = new Dictionary<string, string> { { "service_tier", "premium" } },
};
var service = new CustomerService();
Customer customer = service.Create(options);
```

```go
stripe.Key = "<<secret key>>"

params := &stripe.CustomerParams{Name: stripe.String("Jenny Rosen")};
params.AddMetadata("service_tier", "premium")
result, err := customer.New(params);
```

```java
Stripe.apiKey = "<<secret key>>";

CustomerCreateParams params =
  CustomerCreateParams.builder()
    .setName("Jenny Rosen")
    .putMetadata("service_tier", "premium")
    .build();

Customer customer = Customer.create(params);
```

```node
const stripe = require('stripe')('<<secret key>>');

const customer = await stripe.customers.create({
  name: 'Jenny Rosen',
  metadata: {
    service_tier: 'premium',
  },
});
```

```python
import stripe
stripe.api_key = "<<secret key>>"

customer = stripe.Customer.create(
  name="Jenny Rosen",
  metadata={"service_tier": "premium"},
)
```

```php
$stripe = new \Stripe\StripeClient('<<secret key>>');

$customer = $stripe->customers->create([
  'name' => 'Jenny Rosen',
  'metadata' => ['service_tier' => 'premium'],
]);
```

```ruby
Stripe.api_key = '<<secret key>>'

customer = Stripe::Customer.create({
  name: 'Jenny Rosen',
  metadata: {service_tier: 'premium'},
})
```

```dotnet
StripeConfiguration.ApiKey = "<<secret key>>";

var options = new CustomerSearchOptions { Query = "metadata['service_tier']:'premium'" };
var service = new CustomerService();
StripeSearchResult<Customer> customers = service.Search(options);
```

```go
stripe.Key = "<<secret key>>"

params := &stripe.CustomerSearchParams{
  SearchParams: stripe.SearchParams{Query: "metadata['service_tier']:'premium'"},
};
result := customer.Search(params);
```

```java
Stripe.apiKey = "<<secret key>>";

CustomerSearchParams params =
  CustomerSearchParams.builder().setQuery("metadata['service_tier']:'premium'").build();

CustomerSearchResult customers = Customer.search(params);
```

```node
const stripe = require('stripe')('<<secret key>>');

const customers = await stripe.customers.search({
  query: 'metadata[\'service_tier\']:\'premium\'',
});
```

```python
import stripe
stripe.api_key = "<<secret key>>"

customers = stripe.Customer.search(query="metadata['service_tier']:'premium'")
```

```php
$stripe = new \Stripe\StripeClient('<<secret key>>');

$customers = $stripe->customers->search(['query' => 'metadata[\'service_tier\']:\'premium\'']);
```

```ruby
Stripe.api_key = '<<secret key>>'

customers = Stripe::Customer.search({query: 'metadata[\'service_tier\']:\'premium\''})
```

Objects must be [indexed](https://docs.stripe.com/search.md#data-freshness) before they appear in results from the Search API. The objects won’t show up in search results until that indexing completes.