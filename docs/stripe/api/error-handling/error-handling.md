# Error handling

Catch and respond to declines, invalid data, network problems, and more.

Stripe offers many kinds of errors. They can reflect external events, like declined payments and network interruptions, or code problems, like invalid API calls.

To handle errors, use some or all of the techniques in the table below. No matter what technique you use, you can follow up with our [recommended responses for each error type](#error-types).

| Technique                                                        | Purpose                                                | When needed |
| ---------------------------------------------------------------- | ------------------------------------------------------ | ----------- |
| [Catch exceptions](#catch-exceptions)                            | Recover when an API call can’t continue                | Always      |
| [Monitor webhooks](#monitor-webhooks)                            | React to notifications from Stripe                     | Sometimes   |
| [Get stored information about failures](#use-stored-information) | Investigate past problems and support other techniques | Sometimes   |

## Catch exceptions 

With this library, you don’t need to check for non-200 HTTP responses. The library translates them as exceptions.

In the rare event you need HTTP details, see [Low-level exception handling](https://docs.stripe.com/error-low-level.md) and the [Error](https://docs.stripe.com/api/errors.md) object.

If an immediate problem prevents an API call from continuing, the Stripe Ruby library raises an exception. It’s a best practice to catch and handle exceptions.

To catch an exception, use Ruby’s `rescue` keyword. Catch
`Stripe::StripeError` or its subclasses to handle
Stripe-specific exceptions only. Each subclass represents a different kind of exception.
When you catch an exception, you can [use its class to choose a response](#error-types).

| Technique                                                        | Purpose                                                | When needed |
| ---------------------------------------------------------------- | ------------------------------------------------------ | ----------- |
| [Catch exceptions](#catch-exceptions)                            | Recover when an API call can’t continue                | Always      |
| [Monitor webhooks](#monitor-webhooks)                            | React to notifications from Stripe                     | Sometimes   |
| [Get stored information about failures](#use-stored-information) | Investigate past problems and support other techniques | Sometimes   |

## Catch exceptions 

With this library, you don’t need to check for non-200 HTTP responses. The library translates them as exceptions.

In the rare event you need HTTP details, see [Low-level exception handling](https://docs.stripe.com/error-low-level.md) and the [Error](https://docs.stripe.com/api/errors.md) object.

If an immediate problem prevents an API call from continuing,
the Stripe Python library raises an exception. It’s a best practice to catch and handle exceptions.

To catch an exception, use Python’s `try`/`except` syntax. Catch
`stripe.StripeError` or its subclasses to handle
Stripe-specific exceptions only. Each subclass represents a different kind of exception.
When you catch an exception, you can [use its class to choose a response](#error-types).

| Technique                                                        | Purpose                                                | When needed |
| ---------------------------------------------------------------- | ------------------------------------------------------ | ----------- |
| [Catch exceptions](#catch-exceptions)                            | Recover when an API call can’t continue                | Always      |
| [Monitor webhooks](#monitor-webhooks)                            | React to notifications from Stripe                     | Sometimes   |
| [Get stored information about failures](#use-stored-information) | Investigate past problems and support other techniques | Sometimes   |

## Catch exceptions 

With this library, you don’t need to check for non-200 HTTP responses. The library translates them as exceptions.

In the rare event you need HTTP details, see [Low-level exception handling](https://docs.stripe.com/error-low-level.md) and the [Error](https://docs.stripe.com/api/errors.md) object.

If an immediate problem prevents an API call from continuing,
the Stripe PHP library raises an exception. It’s a best practice to catch and handle exceptions.

To catch an exception, use PHP’s `try`/`catch` syntax. Stripe provides several exception
classes you can catch. Each one represents a different kind of error.
When you catch an exception, you can [use its class to choose a response](#error-types).

| Technique                                                        | Purpose                                                | When needed |
| ---------------------------------------------------------------- | ------------------------------------------------------ | ----------- |
| [Catch exceptions](#catch-exceptions)                            | Recover when an API call can’t continue                | Always      |
| [Monitor webhooks](#monitor-webhooks)                            | React to notifications from Stripe                     | Sometimes   |
| [Get stored information about failures](#use-stored-information) | Investigate past problems and support other techniques | Sometimes   |

## Catch exceptions 

With this library, you don’t need to check for non-200 HTTP responses. The library translates them as exceptions.

In the rare event you need HTTP details, see [Low-level exception handling](https://docs.stripe.com/error-low-level.md) and the [Error](https://docs.stripe.com/api/errors.md) object.

If an immediate problem prevents an API call from continuing,
the Stripe Java library raises an exception. It’s a best practice to catch and handle exceptions.

To catch an exception, use Java’s `try`/`catch` syntax. Catch
`StripeException` or its subclasses to handle
Stripe-specific exceptions only. Each subclass represents a different kind of exception.
When you catch an exception, you can [use its class to choose a response](#error-types).

| Technique                                                        | Purpose                                                | When needed |
| ---------------------------------------------------------------- | ------------------------------------------------------ | ----------- |
| [Catch exceptions](#catch-exceptions)                            | Recover when an API call can’t continue                | Always      |
| [Monitor webhooks](#monitor-webhooks)                            | React to notifications from Stripe                     | Sometimes   |
| [Get stored information about failures](#use-stored-information) | Investigate past problems and support other techniques | Sometimes   |

## Catch exceptions 

With this library, you don’t need to check for non-200 HTTP responses. The library translates them as exceptions.

In the rare event you need HTTP details, see [Low-level exception handling](https://docs.stripe.com/error-low-level.md) and the [Error](https://docs.stripe.com/api/errors.md) object.

If an immediate problem prevents an API call from continuing,
the Stripe Node.js library can raise an exception. It’s a best practice to catch and handle exceptions. To enable exception raising and catch the exception, do the following:

* If you make the API call in a function, precede the function definition with the `async` keyword.
* Precede the API call itself with the `await` keyword.
* Wrap the API call in a `try`/`catch` block.

When you catch an exception, you can [use its type attribute to choose a response](#error-types).

| Technique                                                        | Purpose                                                | When needed |
| ---------------------------------------------------------------- | ------------------------------------------------------ | ----------- |
| [Use error values](#catch-exceptions)                            | Recover when an API call can’t continue                | Always      |
| [Monitor webhooks](#monitor-webhooks)                            | React to notifications from Stripe                     | Sometimes   |
| [Get stored information about failures](#use-stored-information) | Investigate past problems and support other techniques | Sometimes   |

## Use error values 

With this library, you don’t need to check for non-200 HTTP responses. The library translates them to error values.

In the rare event you need HTTP details, see [Low-level exception handling](https://docs.stripe.com/error-low-level.md) and the [Error](https://docs.stripe.com/api/errors.md) object.

API calls in the Stripe Go library return both a result value and an error value. Use
multiple assignment to capture both. If the error value isn’t `nil`, it means an
immediate problem prevented the API call from continuing.

If the error value is related to Stripe, you can cast it to a `stripe.Error` object, which
has fields describing the problem. [Use the Type field to choose a response](#error-types). In
some cases, you can coerce the `Err` property to a more specific error type with additional information.

| Technique                                                        | Purpose                                                | When needed |
| ---------------------------------------------------------------- | ------------------------------------------------------ | ----------- |
| [Catch exceptions](#catch-exceptions)                            | Recover when an API call can’t continue                | Always      |
| [Monitor webhooks](#monitor-webhooks)                            | React to notifications from Stripe                     | Sometimes   |
| [Get stored information about failures](#use-stored-information) | Investigate past problems and support other techniques | Sometimes   |

## Catch exceptions 

With this library, you don’t need to check for non-200 HTTP responses. The library translates them to exceptions.

In the rare event you need HTTP details, see [Low-level exception handling](https://docs.stripe.com/error-low-level.md) and the [Error](https://docs.stripe.com/api/errors.md) object.

If an immediate problem prevents an API call from continuing,
the Stripe .NET library raises an exception. It’s a best practice to catch and handle exceptions.

To catch an exception, use .NET’s `try`/`catch` syntax. Catch a `StripeException`,
then [use its Type attribute to choose a response](#error-types).

```ruby
require 'stripe'

Stripe.api_key = '<<secret key>>'

def example_function(params)
  begin
    Stripe::PaymentIntent.create(params)
  rescue Stripe::CardError => e
    puts "A payment error occurred: #{e.error.message}"
  rescue Stripe::InvalidRequestError => e
    puts "An invalid request occurred."
  rescue Stripe::StripeError => e
    puts "Another problem occurred, maybe unrelated to Stripe."
  else
    puts "No error."
  end
end
```

```python
import stripe, logging
stripe.api_key = '<<secret key>>'

def example_function(**kwargs):
  try:
    stripe.PaymentIntent.create(**kwargs)
  except stripe.CardError as e:
    logging.error("A payment error occurred: {}".format(e.user_message))
  except stripe.InvalidRequestError:
    logging.error("An invalid request occurred.")
  except Exception:
    logging.error("Another problem occurred, maybe unrelated to Stripe.")
  else:
    logging.info("No error.")
```

```php
<?php
require 'vendor/autoload.php';
\Stripe\Stripe::setApiKey('<<secret key>>');

function example_function($args) {
  try {
    $stripe->paymentIntents->create($args);
    error_log("No error.");
  } catch(\Stripe\Exception\CardException $e) {
    error_log("A payment error occurred: {$e->getError()->message}");
  } catch (\Stripe\Exception\InvalidRequestException $e) {
    error_log("An invalid request occurred.");
  } catch (Exception $e) {
    error_log("Another problem occurred, maybe unrelated to Stripe.");
  }
}
```

```java
public static void example_function(PaymentIntentCreateParams params) {
  Stripe.apiKey = "<<secret key>>";
  try {
    PaymentIntent paymentIntent = PaymentIntent.create(params);
    System.out.println("No error.");
  } catch (CardException e) {
    System.out.println("A payment error occurred: {}");
  } catch (InvalidRequestException e) {
    System.out.println("An invalid request occurred.");
  } catch (Exception e) {
   System.out.println("Another problem occurred, maybe unrelated to Stripe.");
  }
}

```

```javascript
const stripe = require('stripe')('<<secret key>>');

async function exampleFunction(args) {
  try {
    const paymentIntent = await stripe.paymentIntents.create(args);
    console.log('No error.');
  } catch (e) {
    switch (e.type) {
      case 'StripeCardError':
        console.log(`A payment error occurred: ${e.message}`);
        break;
      case 'StripeInvalidRequestError':
        console.log('An invalid request occurred.');
        break;
      default:
        console.log('Another problem occurred, maybe unrelated to Stripe.');
        break;
    }
  }
}
```

```go
package main

import (
  "github.com/stripe/stripe-go/v72"
  "github.com/stripe/stripe-go/v72/paymentintent"
  "log"
)

func example_function(params *stripe.PaymentIntentParams) {
  stripe.Key = "<<secret key>>"
  _, err := paymentintent.New(params)
  if err == nil {
    log.Println("No error.")
  } else {
    if stripeErr, ok := err.(*stripe.Error); ok {
      switch stripeErr.Type {
        case stripe.ErrorTypeCard:
          log.Println("A payment error occurred:", stripeErr.Msg)
        case stripe.ErrorTypeInvalidRequest:
          log.Println("An invalid request occurred.")
        default:
          log.Println("Another Stripe error occurred.")
      }
    } else {
      log.Println("An error occurred that was unrelated to Stripe.")
    }
  }
}
```

```dotnet
using Stripe;

StripeConfiguration.ApiKey = Environment.GetEnvironmentVariable("STRIPE_SECRET_KEY");

static void ExampleFunction(PaymentIntentCreateOptions options)
{
  try
  {
    var service = new PaymentIntentService();
    service.Create(options);
    Console.WriteLine("No error.");
  }
  catch (StripeException e)
  {
    switch (e.StripeError.Type)
    {
      case "card_error":
        Console.WriteLine($"A payment error occurred: {e.StripeError.Message}");
        break;
      case "invalid_request_error":
        Console.WriteLine("An invalid request occurred.");
        break;
      default:
        Console.WriteLine("Another problem occurred, maybe unrelated to Stripe.");
        break;
    }
  }
}

```

After setting up exception handling, test it on a variety of data, including [test cards](https://docs.stripe.com/testing.md), to simulate different payment outcomes.

```ruby
example_function(
  # The required parameter currency is missing,
  amount: 2000,
  confirm: true,
  payment_method: 'pm_card_visa',
)
```

```
An invalid request occurred.
```

```python
example_function(
  # The required parameter currency is missing
  amount=2000,
  confirm=True,
  payment_method='pm_card_visa',
)
```

```
An invalid request occurred.
```

```php
example_function([
  // The required parameter currency is missing
  'amount' => 2000,
  'confirm' => True,
  'payment_method' => 'pm_card_visa',
]);
```

```
An invalid request occurred.
```

```java
// Notice `.setCurrency("USD")` is intentionally missing.
PaymentIntentCreateParams params = PaymentIntentCreateParams.builder()
    .setAmount(2000L)
    .setConfirm(true)
    .setPaymentMethod("pm_card_visa")
    .build();
example_function(params);
```

```
An invalid request occurred.
```

```javascript
exampleFunction({
  // The required parameter currency is missing
  amount: 2000,
  confirm: true,
  payment_method: 'pm_card_visa',
})
```

```
An invalid request occurred.
```

```go
params := &stripe.PaymentIntentParams{
  Amount: stripe.Int64(2000),
  // The required parameter currency is missing
  Confirm: stripe.Bool(true),
  PaymentMethod: stripe.String("pm_card_visa"),  }
example_function(params)
```

```
An invalid request occurred.
```

```dotnet
var options = new PaymentIntentCreateOptions
{
  Amount = 2000,
  // The required parameter Currency is missing
  Confirm = true,
  PaymentMethod = "pm_card_visa"
};
ExampleFunction(options);

```

```
An invalid request occurred.
```

```ruby
example_function(
  currency: 'USD',
  amount: 2000,
  confirm: true,
  payment_method: 'pm_card_chargeDeclinedFraudulent',
)
```

```
A payment error occurred: Your card was declined.
```

```python
example_function(
  currency="USD",
  amount=2000,
  confirm=True,
  payment_method='pm_card_chargeDeclinedFraudulent',
)
```

```
A payment error occurred: Your card was declined.
```

```php
example_function([
  'currency' => 'USD',
  'amount' => 2000,
  'confirm' => True,
  'payment_method' => 'pm_card_chargeDeclinedFraudulent',
]);
```

```
A payment error occurred: Your card was declined.
```

```java
PaymentIntentCreateParams params = PaymentIntentCreateParams.builder()
    .setAmount(2000L)
    .setCurrency("USD")
    .setConfirm(true)
    .setPaymentMethod("pm_card_chargeDeclinedFraudulent")
    .build();
example_function(params);
```

```
A payment error occurred: Your card was declined.
```

```javascript
exampleFunction({
  currency: 'USD',
  amount: 2000,
  confirm: true,
  payment_method: 'pm_card_chargeDeclinedFraudulent',
})
```

```
A payment error occurred: Your card was declined.
```

```go
params := &stripe.PaymentIntentParams{
  Amount: stripe.Int64(2000),
  Currency: stripe.String(string(stripe.CurrencyUSD)),
  Confirm: stripe.Bool(true),
  PaymentMethod: stripe.String("pm_card_chargeDeclinedFraudulent"),
}
example_function(params)
```

```
A payment error occurred: Your card was declined.
```

```dotnet
var options = new PaymentIntentCreateOptions
{
  Amount = 2000,
  Currency = "usd",
  Confirm = true,
  PaymentMethod = "pm_card_chargeDeclinedFraudulent",
};
ExampleFunction(options);
```

```
A payment error occurred: Your card was declined.
```

```ruby
example_function(
  currency: 'USD',
  amount: 2000,
  confirm: true,
  payment_method: 'pm_card_visa',
)
```

```
No error.
```

```python
example_function(
  currency="USD",
  amount=2000,
  confirm=True,
  payment_method="pm_card_visa",
)
```

```
No error.
```

```php
example_function([
  'currency' => 'USD',
  'amount' => 2000,
  'confirm' => True,
  'payment_method' => 'pm_card_visa',
]);
```

```
No error.
```

```java
PaymentIntentCreateParams params = PaymentIntentCreateParams.builder()
    .setAmount(2000L)
    .setCurrency("USD")
    .setConfirm(true)
    .setPaymentMethod("pm_card_visa")
    .build();
example_function(params);
```

```
No error.
```

```javascript
exampleFunction({
  currency: 'USD',
  amount: 2000,
  confirm: true,
  payment_method: 'pm_card_visa',
})
```

```
No error.
```

```go
params := &stripe.PaymentIntentParams{
  Amount: stripe.Int64(2000),
  Currency: stripe.String(string(stripe.CurrencyUSD)),
  Confirm: stripe.Bool(true),
  PaymentMethod: stripe.String("pm_card_visa"),
}
example_function(params)
```

```
No error.
```

```dotnet
var options = new PaymentIntentCreateOptions
{
  Amount = 2000,
  Currency = "usd",
  Confirm = true,
  PaymentMethod = "pm_card_visa"
};
ExampleFunction(options);

```

```
No error.
```

## Monitor webhooks

Stripe notifies you about many kinds of problems using *webhooks*. This includes problems that don’t follow immediately after an API call. For example:

* You lose a dispute.
* A recurring payment fails after months of success.
* Your frontend *confirms* a payment, but goes offline before finding out the payment fails. (The backend still receives webhook notification, even though it wasn’t the one to make the API call.)

You don’t need to handle every webhook event type. In fact, some integrations don’t handle any.

In your webhook handler, start with the basic steps from the [webhook builder](https://docs.stripe.com/webhooks/quickstart.md): get an event object and use the event type to find out what happened. Then, if the event type indicates an error, follow these extra steps:

1. Access [event.data.object](https://docs.stripe.com/api/events/object.md#event_object-data-object) to retrieve the affected object.
1. [Use stored information](#use-stored-information) on the affected object to gain context, including an error object.
1. [Use its type to choose a response](#error-types).

1. Access [event[‘data’][‘object’]](https://docs.stripe.com/api/events/object.md#event_object-data-object) to retrieve the affected object.
1. [Use stored information](#use-stored-information) on the affected object to gain context, including an error object.
1. [Use its type to choose a response](#error-types).

1. Access [event->data->object](https://docs.stripe.com/api/events/object.md#event_object-data-object) to retrieve the affected object.
1. [Use stored information](#use-stored-information) on the affected object to gain context, including an error object.
1. [Use its type to choose a response](#error-types).

1. Get the affected object using an `EventDataObjectDeserializer` and casting its output to the appropriate type.
1. [Use stored information](#use-stored-information) on the affected object to gain context, including an error object.
1. [Use its type to choose a response](#error-types).

1. Access [event.data.object](https://docs.stripe.com/api/events/object.md#event_object-data-object) to retrieve the affected object.
1. [Use stored information](#use-stored-information) on the affected object to gain context, including an error object.
1. [Use its type to choose a response](#error-types).

1. Get the affected object by unmarshalling data from `event.Data.Raw`.
1. [Use stored information](#use-stored-information) on the affected object to gain context, including an error object.
1. [Use its type to choose a response](#error-types).

1. Get the affected object by casting [stripeEvent.Data.Object](https://docs.stripe.com/api/events/object.md#event_object-data-object) to the appropriate type.
1. [Use stored information](#use-stored-information) on the affected object to gain context, including an error object.
1. [Use its type to choose a response](#error-types).

```ruby
require 'stripe'
require 'sinatra'
post '/webhook' do
  payload = request.body.read
  data = JSON.parse(payload, symbolize_names: true)

  # Get the event object
  event = Stripe::Event.construct_from(data)

  # Use the event type to find out what happened
  case event.type
  when 'payment_intent.payment_failed'

    # Get the object affected
    payment_intent = event.data.object

    # Use stored information to get an error object
    e = payment_intent.last_payment_error

    # Use its type to choose a response
    case e.type
    when 'card_error'
      puts "A payment error occurred: #{e.message}"
    when 'invalid_request'
      puts "An invalid request occurred."
    else
      puts "Another problem occurred, maybe unrelated to Stripe."
    end
  end

  content_type 'application/json'
  {
    status: 'success'
  }.to_json
end
```

```python
\#! /usr/bin/env python3.6
# Python 3.6 or newer required.

import json
import os
import stripe
import logging
stripe.api_key = '<<secret key>>'

from flask import Flask, jsonify, request

app = Flask(__name__)

@app.route('/webhook', methods=['POST'])
def webhook():
    event = None
    payload = request.data

    # Get the event object
    try:
        event = json.loads(payload)
    except json.decoder.JSONDecodeError as e:
        print('⚠️  Webhook error while parsing basic request.' + str(e))
        return jsonify(success=False)

    # Use the event type to find out what happened
    if event and event['type'] == 'payment_intent.payment_failed':

        # Get the object affected
        payment_intent = event['data']['object']

        # Use stored information to get an error object
        e = payment_intent['last_payment_error']

        # Use its type to choose a response
        if e['type'] == 'card_error':
          logging.error("A payment error occurred: {}".format(e['message']))
        elif e['type'] == 'invalid_request':
          logging.error("An invalid request occurred.")
        else:
          logging.error("Another problem occurred, maybe unrelated to Stripe")
    return jsonify(success=True)
```

```php
<?php
require 'vendor/autoload.php';
\Stripe\Stripe::setApiKey('<<secret key>>');

$payload = @file_get_contents('php://input');
$event = null;

// Get the event object
try {
  $event = \Stripe\Event::constructFrom(
    json_decode($payload, true)
  );
} catch(\UnexpectedValueException $e) {
  echo '⚠️  Webhook error while parsing basic request.';
  http_response_code(400);
  exit();
}

// Use the event type to find out what happened
if ($event->type == 'payment_intent.payment_failed') {

  // Get the object affected
  $paymentIntent = $event->data->object;

  // Use stored information to get an error object
  $e = $paymentIntent->last_payment_error;

  // Use its type to choose a response
  switch ($e->type) {
    case \Stripe\Exception\CardException:
      error_log("A payment error occurred: {$e->getError()->message}");
      break;
    case \Stripe\Exception\InvalidRequestException:
      error_log("An invalid request occurred.");
      if (isset($e->getError()->param)) {
        error_log("The parameter {$e->getError()->param} is invalid or missing.");
      }
      break;
    default:
      error_log("Another problem occurred, maybe unrelated to Stripe.");
  }
}

http_response_code(200);
```

```java
post("/webhook", (request, response) -> {
      String payload = request.body();
      String sigHeader = request.headers("Stripe-Signature");
      String endpointSecret = "whsec_9d75cc10168ca3f518f64a69a5015bc07222290a199b27985efe350c7c59ecde";

      Event event = null;

      // Get an event object
      try {
        event = Webhook.constructEvent(payload, sigHeader, endpointSecret);
      } catch (SignatureVerificationException e) {
        response.status(400);
        return "";
      }

      // Deserialize the object inside the event to a generic Stripe object
      EventDataObjectDeserializer dataObjectDeserializer = event.getDataObjectDeserializer();
      StripeObject stripeObject = null;
      if (dataObjectDeserializer.getObject().isPresent()) {
        stripeObject = dataObjectDeserializer.getObject().get();
      } else {
        // Deserialization failed, probably due to an API version mismatch.
        // Refer to the Javadoc documentation on `EventDataObjectDeserializer` for
        // instructions on how to handle this case, or return an error here.
      }

      // Use the event type to find out whaat happened
      switch (event.getType()) {
        case "payment_intent.payment_failed":

          // Get the object affected by casting the generic Stripe object
          PaymentIntent paymentIntent = (PaymentIntent) stripeObject;

          // Use stored information to get an error object
          StripeError error = paymentIntent.getLastPaymentError();

          // Use its type to choose a response
          switch(error.getType()) {
            case "card_error":
              System.out.printf("A payment error occurred: %s\n", error.getMessage());
              break;
            case "invalid_request":
              System.out.println("An invalid request occurred.");
              break;
            default:
              System.out.println("Another problem occurred, maybe unrelated to Stripe.");
              break;
          }
          break;
        default:
          // Unexpected event type
          response.status(400);
          return "";
      }

      response.status(200);
      return "";
    });
  }

```

```javascript
const stripe = require('stripe')('<<secret key>>');
const express = require('express');
const app = express();

app.post('/webhook', express.json({type: 'application/json'}), (request, response) => {

  // Get an event object
  const event = request.body;

  // Use its type to find out what happened
  if (event.type == 'payment_intent.payment_failed') {

    // Get the object affected
    const paymentIntent = event.data.object;

    // Use stored information to get an error object
    const error = paymentIntent.last_payment_error;

    // Use its type to choose a response
    switch (error.type) {
      case 'card_error':
        console.log(`A payment error occurred: ${error.message}`);
        break;
      case 'invalid_request_error':
        console.log('An invalid request occurred.');
        if (error.param) {
          console.log(`The parameter ${error.param} is invalid or missing.`);
        }
        break;
      default:
        console.log('Another problem occurred, maybe unrelated to Stripe.');
        break;
    }
  }
  response.send();
});

app.listen(4242, () => console.log('Running on port 4242'));
```

```go
package main

import (
  "encoding/json"
  "io/ioutil"
  "log"
  "net/http"

  "github.com/stripe/stripe-go/v72"
  "github.com/stripe/stripe-go/v72/webhook"
)

func main() {
  http.HandleFunc("/webhook", handleWebhook)
  addr := "localhost:4242"
  log.Printf("Listening on %s", addr)
  log.Fatal(http.ListenAndServe(addr, nil))
}

func handleWebhook(w http.ResponseWriter, req *http.Request) {
  const MaxBodyBytes = int64(65536)
  req.Body = http.MaxBytesReader(w, req.Body, MaxBodyBytes)
  payload, err := ioutil.ReadAll(req.Body)
  if err != nil {
    log.Printf("Error reading request body: %v\n", err)
    w.WriteHeader(http.StatusServiceUnavailable)
    return
  }

  // Replace this endpoint secret with your endpoint's unique secret
  // If you are testing with the CLI, find the secret by running 'stripe listen'
  // If you are using an endpoint defined with the API or dashboard, look in your webhook settings
  // at https://dashboard.stripe.com/webhooks
  endpointSecret := "whsec_..."
  signatureHeader := req.Header.Get("Stripe-Signature")

  // Get an event object
  event, err := webhook.ConstructEvent(payload, signatureHeader, endpointSecret)
  if err != nil {
    log.Printf("⚠️  Webhook signature verification failed. %v\n", err)
    w.WriteHeader(http.StatusBadRequest) // Return a 400 error on a bad signature
    return
  }
  // Use its type to find out what happened
  switch event.Type {
  case "payment_intent.payment_failed":

    // Get the object affected by unmarshalling event data into
    // the appropriate struct for the event type
    var paymentIntent stripe.PaymentIntent
    err := json.Unmarshal(event.Data.Raw, &paymentIntent)
    if err != nil {
      log.Printf("Error parsing webhook JSON: %v\n", err)
      w.WriteHeader(http.StatusBadRequest)
      return
    }

    // Use stored data to get an error object
    e := paymentIntent.LastPaymentError

    // Use its type to choose a response
    switch e.Type {
    case "card_error":
      log.Println("A payment error occurred: ", e.Msg)
    case "invalid_request":
      log.Println("An invalid request occurred.")
    default:
      log.Println("Another problem occurred, maybe unrelated to Stripe.")
    }
  default:
    log.Println("Unhandled event type: ", event.Type)
  }

  w.WriteHeader(http.StatusOK)
}
```

```dotnet
using Stripe;

var builder = WebApplication.CreateBuilder(args);
var app = builder.Build();

app.MapPost("webhook", async (HttpRequest req) =>
{
    var json = await new StreamReader(req.Body).ReadToEndAsync();
    var webhookSecret = "whsec_9d75cc10168ca3f518f64a69a5015bc07222290a199b27985efe350c7c59ecde";

    // Get the event object
    Event stripeEvent;
    try
    {
        stripeEvent = EventUtility.ConstructEvent(
            json,
            req.Headers["Stripe-Signature"],
            webhookSecret
        );
        app.Logger.LogInformation($"Webhook notification with type: {stripeEvent.Type} found for {stripeEvent.Id}");
    }
    catch (Exception e)
    {
        app.Logger.LogError(e, $"Something failed while parsing the Stripe webhook event: {e.Message}.");
        return Results.BadRequest();
    }

    // Use the event type to find out what happened
    switch (stripeEvent.Type)
    {
        // If on SDK version < 46, use class Events instead of EventTypes
        case EventTypes.PaymentIntentPaymentFailed:

            // Get the object affected
            var paymentIntent = stripeEvent.Data.Object as Stripe.PaymentIntent;

            // Use stored information to get an error object
            var error = paymentIntent.LastPaymentError;

            // Use its type to choose a response
            switch(error.Type) {
                case "card_error":
                    app.Logger.LogError($"A payment error occurred: {error.Message}");
                    break;
                case "invalid_request":
                    app.Logger.LogError("An invalid request occurred.");
                    break;
                default:
                    app.Logger.LogError("Another problem occurred, maybe unrelated to Stripe.");
                    break;
            }
            break;
        default:
            break;
    }

    return Results.Ok();
});

app.Run();

```

To test how your integration responds to webhook events, you can [trigger webhook events locally](https://docs.stripe.com/webhooks.md#test-webhook). After completing the setup steps at that link, trigger a failed payment to see the resulting error message.

```bash
stripe trigger payment_intent.payment_failed
```

```bash
A payment error occurred: Your card was declined.
```

## Get stored information about failures 

Many objects store information about failures. That means that
if something already went wrong, you can retrieve the object and
examine it to learn more. In many cases, stored information is in the
form of an error object, and you can [use its type to choose a response](#error-types).

For instance:

1. Retrieve a specific payment intent.
1. Check if it experienced a payment error by determining if [last_payment_error](https://docs.stripe.com/api/payment_intents/object.md#payment_intent_object-last_payment_error) is empty.
1. If it did, log the error, including its type and the affected object.

```ruby
require 'stripe'
Stripe.api_key = '<<secret key>>'

payment_intent = Stripe::PaymentIntent.retrieve(<<paymentIntent>>)
e = payment_intent.last_payment_error
if !e.nil?
  puts "PaymentIntent #{payment_intent.id} experienced a #{e.type}."
end
```

```python
import stripe
stripe.api_key = '<<secret key>>'

payment_intent = stripe.PaymentIntent.retrieve(<<paymentIntent>>)

e = payment_intent.last_payment_error
if e:
  logging.info("PaymentIntent {} experienced a {} error.".format(
    payment_intent.id,
    e.type,
  ))
```

```php
<?php
  require 'vendor/autoload.php';

  \Stripe\Stripe::setApiKey('<<secret key>>');

  payment_intent = $stripe->paymentIntents->retrieve(% identifier type="paymentIntent" /%});

  e = payment_intent->last_payment_error
  if isset(e) {
    error_log("PaymentIntent {$payment_intent->id} experienced a {$e->getError()->type} error.")
  }
```

```java
try {
  PaymentIntent paymentIntent = PaymentIntent.retrieve("<<paymentIntent>>");
  StripeError error = paymentIntent.getLastPaymentError();
  System.out.println("PaymentIntent " + paymentIntent.getId() + " experienced a " + paymentIntent.getLastPaymentError().getType() + " error.");
} catch (StripeException e) {
  System.out.println("Failed to retrieve Stripe PaymentIntent.");
}
```

```javascript
const stripe = require('stripe')("<<secret key>>");

const payment_intent = await stripe.paymentIntents.retrieve(<<paymentIntent>>)

const e = payment_intent.last_payment_error

if (e !== null) {
  console.log(`PaymentIntent ${payment_intent.id} experienced a ${e.type} error.`)
}
```

```go
stripe.Key = "<<secret key>>"

pi, _ := paymentintent.Get(
  <<paymentIntent>>,
  nil,
)
paymentErr := pi.LastPaymentError
if paymentErr != nil {
  log.Printf("PaymentIntent %s experienced a %s error.", pi.ID, paymentErr.Type)
}

```

```dotnet
StripeConfiguration.ApiKey = "<<secret key>>";

var service = new PaymentIntentService();
var paymentIntent = service.Get(<<paymentIntent>>);
if(paymentIntent.LastPaymentError != null)
{
  Console.WriteLine($"PaymentIntent {paymentIntent.Id} experienced a {paymentIntent.LastPaymentError.Type} error.");
}

```

Here are common objects that store information about failures.

| Object                                                           | Attribute                 | Values                                                                                              |
| ---------------------------------------------------------------- | ------------------------- | --------------------------------------------------------------------------------------------------- |
| [Payment Intent](https://docs.stripe.com/api/payment_intents.md) | `last_payment_error`      | [An error object](#work-with-error-objects)                                                         |
| [Setup Intent](https://docs.stripe.com/api/setup_intents.md)     | `last_setup_error`        | [An error object](#work-with-error-objects)                                                         |
| [Invoice](https://docs.stripe.com/api/invoices.md)               | `last_finalization_error` | [An error object](#work-with-error-objects)                                                         |
| [Setup Attempt](https://docs.stripe.com/api/setup_attempts.md)   | `setup_error`             | [An error object](#work-with-error-objects)                                                         |
| [Payout](https://docs.stripe.com/api/payouts.md)                 | `failure_code`            | [A payout failure code](https://docs.stripe.com/api/payouts/failures.md)                            |
| [Refund](https://docs.stripe.com/api/refunds.md)                 | `failure_reason`          | [A refund failure code](https://docs.stripe.com/api/refunds/object.md#refund_object-failure_reason) |

To test code that uses stored information about failures, you often need to simulate failed transactions. You can often do this using [test cards](https://docs.stripe.com/testing.md) or test bank numbers. For example:

* [Simulate a declined payment](https://docs.stripe.com/testing.md#declined-payments), for creating failed Charges, PaymentIntents, SetupIntents, and so on.
* [Simulate a failed payout](https://docs.stripe.com/connect/testing.md#account-numbers).
* [Simulate a failed refund](https://docs.stripe.com/testing.md#refunds).

## Types of error and responses 

In the Stripe Ruby library, error objects belong to `stripe.error.StripeError` and its subclasses. Use the documentation for each class for advice on responding.

| Name                  |  | Description                                                                                                                                                                                                                                    |
| --------------------- |  | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Payment error         |  | An error occurred during a payment, involving one of these situations:
  * [Payment blocked for suspected fraud](#payment-blocked)
  * [Payment declined by the issuer](#payment-declined).
  * [Other payment errors](#other-payment-errors). |
| Invalid request error |  |                                                                                                                                                                                                                                                |
| API error             |  | Something went wrong on Stripe’s end. (These are rare.)                                                                                                                                                                                        |
| Idempotency error     |  | You used an [idempotency key](https://docs.stripe.com/api/idempotent_requests.md) for something unexpected, like replaying a request but passing different parameters.                                                                         |

## Payment errors 

Everything in this section also applies to non-card payments. For historical reasons, payment errors have the type . But in fact, they can represent a problem with any payment, regardless of the payment method.

Payment errors—sometimes called “card errors” for historical reasons—cover a wide range of common problems. They come in three categories:

* [Payment blocked for suspected fraud](#payment-blocked)
* [Payment declined by the issuer](#payment-declined)
* [Other payment errors](#other-payment-errors)

To distinguish these categories or get more information about how to respond, consult the [error code](https://docs.stripe.com/error-codes.md), [decline code](https://docs.stripe.com/declines/codes.md), and [charge outcome](https://docs.stripe.com/api/charges/object.md#charge_object-outcome).

(To find the charge outcome from an error object, first get the [Payment Intent that’s involved](https://docs.stripe.com/api/errors.md#errors-payment_intent) and the [latest Charge it created](https://docs.stripe.com/api/payment_intents/object.md#payment_intent_object-latest_charge). See the example below for a demonstration.)

```ruby
require 'stripe'
Stripe.api_key = '<<secret key>>'

def example_function(params)
  begin
    Stripe::PaymentIntent.create(params)
  rescue Stripe::CardError => e
    charge = Stripe::Charge.retrieve(e.error.payment_intent.latest_charge)
    if charge.outcome.type == 'blocked'
      puts 'Payment blocked for suspected fraud.'
    elsif e.code == 'card_declined'
      puts 'Payment declined by the issuer.'
    elsif e.code == 'expired_card'
      puts 'Card expired.'
    else
      puts 'Other card error.'
    end
  end
end
```

```python
import stripe, logging
stripe.api_key = <<secret key>>

def example_function(**kwargs):
  try:
    stripe.PaymentIntent.create(**kwargs)
  except stripe.CardError as e:
    charge = stripe.Charge.retrieve(e.error.payment_intent.latest_charge)
    if charge.outcome.type == 'blocked':
      logging.error("Payment blocked for suspected fraud.")
    elif e.code == 'card_declined':
      logging.error("Payment declined by the issuer.")
    elif e.code == 'expired_card':
      logging.error("Card expired.")
    else:
      logging.error("Other card error.")
```

```php
<?php
  require 'vendor/autoload.php';
  \Stripe\Stripe::setApiKey('<<secret key>>');

  function example_function($args) {
    try {
      $stripe->paymentIntents->create($args);
    } catch(\Stripe\Exception\CardException $e) {
      $charge = $stripe->charge->retrieve($e->getError()->payment_intent->latest_charge);
      if ($charge->outcome->type == 'blocked') {
        error_log('Blocked for suspected fraud.');
      } elseif ($e->getError()->code == 'expired_card') {
        error_log('Card expired.');
      } elseif ($e->getError()->code == 'card_declined') {
        error_log('Declined by the issuer.');
      } else {
        error_log('Other card error.');
      }
    }
  }
```

```java
public static void example_function(PaymentIntentCreateParams params) {
        Stripe.apiKey = "<<secret key>>";
        try {
            PaymentIntent paymentIntent = PaymentIntent.create(params);
        } catch (CardException e) {
            Charge charge = Charge.retrieve(ex.getStripeError()
                 .getPaymentIntent()
                 .getLatestCharge());
            if(charge
                 .getOutcome()
                 .getType().equals("blocked")) {
                System.out.println("Payment blocked for suspected fraud.");
            } else if(e.getCode().equals("card_declined")) {
                System.out.println("Declined by the issuer.");
            } else if(e.getCode().equals("expired_card")) {
                System.out.println("Card expired.");
            } else {
                System.out.println("Other card error.");
            }
        } catch (Exception e) {
            System.out.println("Another problem occurred, maybe unrelated to Stripe.");
        }
    }
```

```javascript
const stripe = require('stripe')('<<secret key>>');

async function exampleFunction(args) {
    try {
      const paymentIntent = await stripe.paymentIntents.create(args);
    } catch (e) {
      console.log(e)
      const charge = await stripe.charges.retrieve(e.payment_intent.latest_charge)
      if (e.type === 'StripeCardError') {
        if (charge.outcome.type === 'blocked') {
          console.log('Payment blocked for suspected fraud.')
        } else if (e.code === 'card_declined') {
          console.log('Payment declined by the issuer.')
        } else if (e.code === 'expired_card') {
          console.log('Card expired.')
        } else {
          console.log('Other card error.')
        }
      }
    }
  }
```

```go
func example_function(params *stripe.PaymentIntentParams) {
  stripe.Key = "<<secret key>>"
  _, err := paymentintent.New(params)
  if err == nil {
    log.Println("No error.")
  } else {
    if stripeErr, ok := err.(*stripe.Error); ok {
      if stripeErr.Type == stripe.ErrorTypeCard {
        charge = Charge.retrieve(stripeErr.PaymentIntent.LatestCharge)
        if charge.Outcome.Type == "blocked" {
          log.Println("Payment blocked for suspected fraud.")
        } else if stripeErr.Code == stripe.ErrorCodeCardDeclined {
          log.Println("Declined by the issuer.")
        } else if stripeErr.Code == stripe.ErrorCodeExpiredCard {
          log.Println("Card expired.")
        } else {
          log.Println("Other card error.")
        }
      }
    }
  }
}
```

```dotnet
using Stripe;
StripeConfiguration.ApiKey = Environment.GetEnvironmentVariable("STRIPE_SECRET_KEY");

static void ExampleFunction(PaymentIntentCreateOptions options)
{
	try
	{
		var service = new PaymentIntentService();
		service.Create(options);
	}
	catch (StripeException e)
	{
		if (e.StripeError.Type == "card_error")
		{
      var chargeService = new ChargeService();
      var options = new ChargeGetOptions();
      var charge = service.Get(e.StripeError.PaymentIntent.LatestChargeId, options);

			if(charge.Outcome.Type == "blocked")
			{
				Console.WriteLine("Payment blocked for suspected fraud.");
			}
			else if (e.StripeError.Code == "card_declined")
			{
				Console.WriteLine("Declined by the issuer.");
			}
			else if (e.StripeError.Code == "expired_card")
			{
				Console.WriteLine("Card expired.");
			}
			else
			{
				Console.WriteLine("Other card error.");
			}
		}
	}
}
```

Users on API version [2022-08-01](https://docs.stripe.com/upgrades.md#2022-08-01) or older:

(To find the charge outcome from an error object, first get the [Payment Intent that’s involved](https://docs.stripe.com/api/errors.md#errors-payment_intent) and the [latest Charge it created](https://docs.stripe.com/api/payment_intents/object.md#payment_intent_object-charges-data). See the example below for a demonstration.)

```ruby
require 'stripe'
Stripe.api_key = '<<secret key>>'

def example_function(params)
  begin
    Stripe::PaymentIntent.create(params)
  rescue Stripe::CardError => e
    if e.error.payment_intent.charges.data[0].outcome.type == 'blocked'
      puts 'Payment blocked for suspected fraud.'
    elsif e.code == 'card_declined'
      puts 'Payment declined by the issuer.'
    elsif e.code == 'expired_card'
      puts 'Card expired.'
    else
      puts 'Other card error.'
    end
  end
end
```

```python
import stripe, logging
stripe.api_key = <<secret key>>

def example_function(**kwargs):
  try:
    stripe.PaymentIntent.create(**kwargs)
  except stripe.error.CardError as e:
    if e.error.payment_intent.charges.data[0].outcome.type == 'blocked':
      logging.error("Payment blocked for suspected fraud.")
    elif e.code == 'card_declined':
      logging.error("Payment declined by the issuer.")
    elif e.code == 'expired_card':
      logging.error("Card expired.")
    else:
      logging.error("Other card error.")
```

```php
<?php
  require 'vendor/autoload.php';
  \Stripe\Stripe::setApiKey('<<secret key>>');

  function example_function($args) {
    try {
      $stripe->paymentIntents->create($args);
    } catch(\Stripe\Exception\CardException $e) {
      if ($e->getError()->payment_intent->charges->data[0]->outcome->type == 'blocked') {
        error_log('Blocked for suspected fraud.');
      } elseif ($e->getError()->code == 'expired_card') {
        error_log('Card expired.');
      } elseif ($e->getError()->code == 'card_declined') {
        error_log('Declined by the issuer.');
      } else {
        error_log('Other card error.');
      }
    }
  }
```

```java
public static void example_function(PaymentIntentCreateParams params) {
        Stripe.apiKey = "<<secret key>>";
        try {
            PaymentIntent paymentIntent = PaymentIntent.create(params);
        } catch (CardException e) {
            if(ex.getStripeError()
                 .getPaymentIntent()
                 .getCharges()
                 .getData()
                 .get(0)
                 .getOutcome()
                 .getType().equals("blocked")) {
                System.out.println("Payment blocked for suspected fraud.");
            } else if(e.getCode().equals("card_declined")) {
                System.out.println("Declined by the issuer.");
            } else if(e.getCode().equals("expired_card")) {
                System.out.println("Card expired.");
            } else {
                System.out.println("Other card error.");
            }
        } catch (Exception e) {
            System.out.println("Another problem occurred, maybe unrelated to Stripe.");
        }
    }
```

```javascript
const stripe = require('stripe')('<<secret key>>');

async function exampleFunction(args) {
    try {
      const paymentIntent = await stripe.paymentIntents.create(args);
    } catch (e) {
      console.log(e)
      if (e.type === 'StripeCardError') {
        if (e.payment_intent.charges.data[0].outcome.type === 'blocked') {
          console.log('Payment blocked for suspected fraud.')
        } else if (e.code === 'card_declined') {
          console.log('Payment declined by the issuer.')
        } else if (e.code === 'expired_card') {
          console.log('Card expired.')
        } else {
          console.log('Other card error.')
        }
      }
    }
  }
```

```go
func example_function(params *stripe.PaymentIntentParams) {
  stripe.Key = "<<secret key>>"
  _, err := paymentintent.New(params)
  if err == nil {
    log.Println("No error.")
  } else {
    if stripeErr, ok := err.(*stripe.Error); ok {
      if stripeErr.Type == stripe.ErrorTypeCard {
        if stripeErr.PaymentIntent.Charges.Data[0].Outcome.Type == "blocked" {
          log.Println("Payment blocked for suspected fraud.")
        } else if stripeErr.Code == stripe.ErrorCodeCardDeclined {
          log.Println("Declined by the issuer.")
        } else if stripeErr.Code == stripe.ErrorCodeExpiredCard {
          log.Println("Card expired.")
        } else {
          log.Println("Other card error.")
        }
      }
    }
  }
}
```

```dotnet
using Stripe;
StripeConfiguration.ApiKey = Environment.GetEnvironmentVariable("STRIPE_SECRET_KEY");

static void ExampleFunction(PaymentIntentCreateOptions options)
{
	try
	{
		var service = new PaymentIntentService();
		service.Create(options);
	}
	catch (StripeException e)
	{
		if (e.StripeError.Type == "card_error")
		{
			if(e.StripeError.PaymentIntent.Charges.Data[0].Outcome.Type == "blocked")
			{
				Console.WriteLine("Payment blocked for suspected fraud.");
			}
			else if (e.StripeError.Code == "card_declined")
			{
				Console.WriteLine("Declined by the issuer.");
			}
			else if (e.StripeError.Code == "expired_card")
			{
				Console.WriteLine("Card expired.");
			}
			else
			{
				Console.WriteLine("Other card error.");
			}
		}
	}
}
```

You can trigger some common kinds of payment error with test cards. Consult these lists for options:

* [Simulating payments blocked for fraud risk](https://docs.stripe.com/testing.md#fraud-prevention)
* [Simulating declined payments and other card errors](https://docs.stripe.com/testing.md#declined-payments)

The test code below demonstrates a few possibilities.

```ruby
example_function(
  currency: 'USD',
  amount: 2000,
  confirm: true,
  payment_method: 'pm_card_radarBlock',
)
```

```
Payment blocked for suspected fraud.
```

```python
example_function(
  currency='USD',
  amount=2000,
  confirm=True,
  payment_method='pm_card_radarBlock',
)
```

```
Payment blocked for suspected fraud.
```

```php
example_function([
  'currency' => 'USD',
  'amount' => 2000,
  'confirm' => True,
  'payment_method' => 'pm_card_radarBlock',
]);
```

```
Payment blocked for suspected fraud.
```

```java
PaymentIntentCreateParams params = PaymentIntentCreateParams.builder()
    .setCurrency("USD")
    .setAmount(2000L)
    .setConfirm(true)
    .setPaymentMethod("pm_card_radarBlock")
    .build();
example_function(params);
```

```
Payment blocked for suspected fraud.
```

```javascript
exampleFunction({
  currency: 'USD',
  amount: 2000,
  confirm: true,
  payment_method: 'pm_card_radarBlock',
})
```

```
Payment blocked for suspected fraud.
```

```go
params := &stripe.PaymentIntentParams{
  Amount: stripe.Int64(2000),
  Currency: stripe.String(string(stripe.CurrencyUSD)),
  Confirm: stripe.Bool(true),
  PaymentMethod: stripe.String("pm_card_radarBlock"),
}
example_function(params)
```

```
Payment blocked for suspected fraud.
```

```dotnet
var options = new PaymentIntentCreateOptions
{
  Amount = 2000,
  Currency = "USD",
  Confirm = true,
  PaymentMethod = "pm_card_radarBlock"
};
ExampleFunction(options);

```

```
Payment blocked for suspected fraud.
```

```ruby
example_function(
  currency: 'USD',
  amount: 2000,
  confirm: true,
  payment_method: 'pm_card_visa_chargeDeclined',
)
```

```
Payment declined by the issuer.
```

```python
example_function(
  currency='USD',
  amount=2000,
  confirm=True,
  payment_method: 'pm_card_visa_chargeDeclined',
)
```

```
Payment declined by the issuer.
```

```php
example_function([
  'currency' => 'USD',
  'amount' => 2000,
  'confirm' => True,
  'payment_method' => 'pm_card_visa_chargeDeclined',
]);
```

```
Payment declined by the issuer
```

```java
PaymentIntentCreateParams params = PaymentIntentCreateParams.builder()
    .setCurrency("USD")
    .setAmount(2000L)
    .setConfirm(true)
    .setPaymentMethod("pm_card_visa_chargeDeclined")
    .build();
example_function(params);
```

```
Payment declined by the issuer.
```

```javascript
exampleFunction({
  currency: 'USD',
  amount: 2000,
  confirm: true,
  payment_method: 'pm_card_visa_chargeDeclined',
})
```

```
Payment declined by the issuer.
```

```go
params := &stripe.PaymentIntentParams{
  Amount: stripe.Int64(2000),
  Currency: stripe.String(string(stripe.CurrencyUSD)),
  Confirm: stripe.Bool(true),
  PaymentMethod: stripe.String("pm_card_visa_chargeDeclined"),
}
example_function(params)
```

```
Payment declined by the issuer.
```

```dotnet
var options = new PaymentIntentCreateOptions
{
  Amount = 2000,
  Currency = "USD",
  Confirm = true,
  PaymentMethod = "pm_card_visa_chargeDeclined",
};
ExampleFunction(options);

```

```
Payment declined by the issuer.
```

```ruby
example_function(
  currency: 'USD',
  amount: 2000,
  confirm: true,
  payment_method: 'pm_card_chargeDeclinedExpiredCard',
)
```

```
Card expired.
```

```python
example_function(
  currency='USD',
  amount=2000,
  confirm=True,
  payment_method: 'pm_card_chargeDeclinedExpiredCard',
)
```

```
Card expired.
```

```php
example_function([
  'currency' => 'USD',
  'amount' => 2000,
  'confirm' => True,
  'payment_method' => 'pm_card_chargeDeclinedExpiredCard',
]);
```

```
Card expired.
```

```java
PaymentIntentCreateParams params = PaymentIntentCreateParams.builder()
    .setCurrency("USD")
    .setAmount(2000L)
    .setConfirm(true)
    .setPaymentMethod("pm_card_chargeDeclinedExpiredCard")
    .build();
example_function(params);
```

```
Card expired.
```

```javascript
exampleFunction({
  currency: 'USD',
  amount: 2000,
  confirm: true,
  payment_method: 'pm_card_chargeDeclinedExpiredCard',
})
```

```
Card expired.
```

```go
params := &stripe.PaymentIntentParams{
  Amount: stripe.Int64(2000),
  Currency: stripe.String(string(stripe.CurrencyUSD)),
  Confirm: stripe.Bool(true),
  PaymentMethod: stripe.String("pm_card_chargeDeclinedExpiredCard"),
}
example_function(params)
```

```
Card expired.
```

```dotnet
var options = new PaymentIntentCreateOptions
{
  Amount = 2000,
  Currency = "USD",
  Confirm = true,
  PaymentMethod = "pm_card_chargeDeclinedExpiredCard",
};
ExampleFunction(options);

```

```
Card expired.
```

```ruby
example_function(
  currency: 'USD',
  amount: 2000,
  confirm: true,
  payment_method: 'pm_card_chargeDeclinedProcessingError',
)
```

```
Other payment error.
```

```python
example_function(
  currency='USD',
  amount=2000,
  confirm=True,
  payment_method: 'pm_card_chargeDeclinedProcessingError',
)
```

```
Other payment error.
```

```php
example_function([
  'currency' => 'USD',
  'amount' => 2000,
  'confirm' => True,
  'payment_method' => 'pm_card_chargeDeclinedProcessingError',
]);
```

```
Other payment error.
```

```java
PaymentIntentCreateParams params = PaymentIntentCreateParams.builder()
    .setCurrency("USD")
    .setAmount(2000L)
    .setConfirm(true)
    .setPaymentMethod("pm_card_chargeDeclinedProcessingError")
    .build();
example_function(params);
```

```
Other payment error.
```

```javascript
exampleFunction({
  currency: 'USD',
  amount: 2000,
  confirm: true,
  payment_method: 'pm_card_chargeDeclinedProcessingError',
})
```

```
Other payment error.
```

```go
params := &stripe.PaymentIntentParams{
  Amount: stripe.Int64(2000),
  Currency: stripe.String(string(stripe.CurrencyUSD)),
  Confirm: stripe.Bool(true),
  PaymentMethod: stripe.String("pm_card_chargeDeclinedProcessingError"),
}
example_function(params)
```

```
Other card error.
```

```dotnet
var options = new PaymentIntentCreateOptions
{
  Amount = 2000,
  Currency = "USD",
  Confirm = true,
  PaymentMethod = "pm_card_chargeDeclinedProcessingError",
};
ExampleFunction(options);

```

```
Other payment error.
```

### Payment blocked for suspected fraud  

|  |
|  |
| **Type**      |                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| **Codes**     |                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| **Codes**     |                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| **Problem**   | Stripe’s fraud prevention system, *Radar*, blocked the payment                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| **Solutions** | This error can occur when your integration is working correctly. Catch it and prompt the customer for a different payment method.

  To block fewer legitimate payments, try these:

  * [Optimize your Radar integration](https://docs.stripe.com/radar/integration.md) to collect more detailed information.
  * Use [Payment Links](https://docs.stripe.com/payment-links.md), [Checkout](https://docs.stripe.com/payments/checkout.md), or [Stripe Elements](https://docs.stripe.com/payments/elements.md) for prebuilt optimized form elements.

  *Radar for Fraud Teams* customers have these additional options:

  * To exempt a specific payment, add it to your allowlist.
  * To change your risk tolerance, adjust your [risk settings](https://docs.stripe.com/radar/risk-settings.md).
  * To change the criteria for blocking a payment, use [custom rules](https://docs.stripe.com/radar/rules.md).

  You can test your integration’s settings with [test cards that simulate fraud](https://docs.stripe.com/radar/testing.md). If you have custom Radar rules, follow the testing advice in the [Radar documentation](https://docs.stripe.com/radar/testing.md). |

### Payment declined by the issuer  

|  |
|  |
| **Type**      |                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| **Codes**     |                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| **Problem**   | The card issuer declined the payment.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| **Solutions** | This error can occur when your integration is working correctly. It reflects an action by the issuer, and that action might be legitimate. Use the decline code to determine what next steps are appropriate. See the [documentation on decline codes](https://docs.stripe.com/declines/codes.md) for appropriate responses to each code.

  You can also:

  * [Follow recommendations to reduce issuer declines](https://docs.stripe.com/declines/card.md#reducing-bank-declines).
  * Use [Payment Links](https://docs.stripe.com/payment-links.md), [Checkout](https://docs.stripe.com/payments/checkout.md), or [Stripe Elements](https://docs.stripe.com/payments/elements.md) for prebuilt form elements that implement those recommendations.

  Test how your integration handles declines with [test cards that simulate successful and declined payments](https://docs.stripe.com/radar/testing.md). |

### Other payment errors  

|  |
|  |
| **Type**      |                                                                                                                                                                                                                                                          |
| **Problem**   | Another payment error occurred.                                                                                                                                                                                                                          |
| **Solutions** | This error can occur when your integration is working correctly. Use the error code to determine what next steps are appropriate. See the [documentation on error codes](https://docs.stripe.com/error-codes.md) for appropriate responses to each code. |

## Invalid request errors  

|  |
|  |
| **Type**      |                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| **Problem**   | You made an API call with the wrong parameters, in the wrong state, or in an invalid way.                                                                                                                                                                                                                                                                                                                                                         |
| **Solutions** | In most cases, the problem is with the request itself. Either its parameters are invalid or it can’t be carried out in your integration’s current state.
  * Consult the [error code documentation](https://docs.stripe.com/error-codes.md) for details on the problem.
  * For convenience, you can follow the link at  for documentation about the error code.
  * If the error involves a specific parameter, use 
    to determine which one. |

## Connection errors  

|  |
|  |
| **Type**      |                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| **Problem**   | There was a network problem between your server and Stripe.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| **Solutions** | Treat the result of the API call as indeterminate. That is, don’t assume that it succeeded or that it failed.

  To find out if it succeeded, you can:

  * Retrieve the relevant object from Stripe and check its status.
  * Listen for webhook notification that the operation succeeded or failed.

  To help recover from connection errors, you can:

  * When creating or updating an object, use an [idempotency key](https://docs.stripe.com/api/idempotent_requests.md). Then, if a connection error occurs, you can safely repeat the request without risk of creating a second object or performing the update twice. Repeat the request with the same idempotency key until you receive a clear success or failure. For advanced advice on this strategy, see [Low-level error handling](https://docs.stripe.com/error-low-level.md#idempotency).
  * Turn on [automatic retries.](#automatic-retries) Then, Stripe generates idempotency keys for you, and repeats requests for you when it is safe to do so.

  This error can mask others. It’s possible that when the connection error resolves, some other error becomes apparent. Check for errors in all of these solutions just as you would in the original request. |

## API errors  

|  |
|  |
| **Type**      |                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| **Problem**   | Something went wrong on Stripe’s end. (These are rare.)                                                                                                                                                                                                                                                                                                                                                                                                     |
| **Solutions** | Treat the result of the API call as indeterminate. That is, don’t assume that it succeeded or that it failed.

  Rely on *webhooks* for information about the outcome. Whenever possible, Stripe fires webhooks for any new objects we create as we solve a problem.

  To set your integration up for maximum robustness in unusual situations, see [this advanced discussion of server errors.](https://docs.stripe.com/error-low-level.md#server-errors) |

## Authentication errors  

|  |
|  |
| **Type**      |                                                                                                                                                                                   |
| **Problem**   | Stripe can’t authenticate you with the information provided.                                                                                                                      |
| **Solutions** | * Use the correct [API key](https://docs.stripe.com/keys.md).
  * Make sure you aren’t using a key that you [“rotated” or revoked](https://docs.stripe.com/keys.md#rolling-keys). |

## Idempotency errors  

|  |
|  |
| **Type**      |                                                                                                                                                                        |
| **Problem**   | You used an [idempotency key](https://docs.stripe.com/api/idempotent_requests.md) for something unexpected, like replaying a request but passing different parameters. |
| **Solutions** | * After you use an idempotency key, only reuse it for identical API calls.
  * Use idempotency keys under the limit of 255 characters.                                 |

## Permission errors  

|  |
|  |
| **Type**      |                                                                                                                                                                                                                                                                                                                          |
| **Problem**   | The API key used for this request doesn’t have the necessary permissions.                                                                                                                                                                                                                                                |
| **Solutions** | * Make sure you aren’t using a [restricted API key](https://docs.stripe.com/keys-best-practices.md#limit-access) for a service it doesn’t have access to.
  * Don’t perform actions in the Dashboard while logged in as a [user role](https://docs.stripe.com/get-started/account/teams/roles.md) that lacks permission. |

## Rate limit errors  

|  |
|  |
| **Type**      |                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| **Problem**   | You made too many API calls in too short a time.                                                                                                                                                                                                                                                                                                                                                                                                                          |
| **Solutions** | * If a single API call triggers this error, wait and try it again.
  * To handle rate-limiting automatically, retry the API call after a delay, and increase the delay exponentially if the error continues. See the documentation on [rate limits](https://docs.stripe.com/rate-limits.md) for further advice.
  * If you anticipate a large increase in traffic and want to request an increased rate limit, [contact support](https://support.stripe.com/) in advance. |

## Signature verification errors  

|  |
|  |
| **Type**      |                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| **Problem**   | You’re using *webhook* [signature verification](https://docs.stripe.com/webhooks.md#verify-events) and couldn’t verify that a webhook event is authentic.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| **Solutions** | This error can occur when your integration is working correctly. If you use webhook signature verification and a third party attempts to send you a fake or malicious webhook, then verification fails and this error is the result. Catch it and respond with a `400 Bad Request` status code.

  If you receive this error when you shouldn’t—for instance, with webhooks that you know originate with Stripe—then see the documentation on [checking webhook signatures](https://docs.stripe.com/webhooks.md#verify-events) for further advice. In particular, make sure you’re using the correct endpoint secret. This is different from your API key. |

In the Stripe Python library, error objects belong to `stripe.StripeError` and its subclasses. Use the documentation for each class for advice about how to respond.

| Name                  |  | Description                                                                                                                                                                                                                                    |
| --------------------- |  | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Payment error         |  | An error occurred during a payment, involving one of these situations:
  * [Payment blocked for suspected fraud](#payment-blocked)
  * [Payment declined by the issuer](#payment-declined).
  * [Other payment errors](#other-payment-errors). |
| Invalid request error |  |                                                                                                                                                                                                                                                |
| API error             |  | Something went wrong on Stripe’s end. (These are rare.)                                                                                                                                                                                        |
| Idempotency error     |  | You used an [idempotency key](https://docs.stripe.com/api/idempotent_requests.md) for something unexpected, like replaying a request but passing different parameters.                                                                         |

## Payment errors 

Everything in this section also applies to non-card payments. For historical reasons, payment errors have the type . But in fact, they can represent a problem with any payment, regardless of the payment method.

Payment errors—sometimes called “card errors” for historical reasons—cover a wide range of common problems. They come in three categories:

* [Payment blocked for suspected fraud](#payment-blocked)
* [Payment declined by the issuer](#payment-declined)
* [Other payment errors](#other-payment-errors)

To distinguish these categories or get more information about how to respond, consult the [error code](https://docs.stripe.com/error-codes.md), [decline code](https://docs.stripe.com/declines/codes.md), and [charge outcome](https://docs.stripe.com/api/charges/object.md#charge_object-outcome).

(To find the charge outcome from an error object, first get the [Payment Intent that’s involved](https://docs.stripe.com/api/errors.md#errors-payment_intent) and the [latest Charge it created](https://docs.stripe.com/api/payment_intents/object.md#payment_intent_object-latest_charge). See the example below for a demonstration.)

```ruby
require 'stripe'
Stripe.api_key = '<<secret key>>'

def example_function(params)
  begin
    Stripe::PaymentIntent.create(params)
  rescue Stripe::CardError => e
    charge = Stripe::Charge.retrieve(e.error.payment_intent.latest_charge)
    if charge.outcome.type == 'blocked'
      puts 'Payment blocked for suspected fraud.'
    elsif e.code == 'card_declined'
      puts 'Payment declined by the issuer.'
    elsif e.code == 'expired_card'
      puts 'Card expired.'
    else
      puts 'Other card error.'
    end
  end
end
```

```python
import stripe, logging
stripe.api_key = <<secret key>>

def example_function(**kwargs):
  try:
    stripe.PaymentIntent.create(**kwargs)
  except stripe.CardError as e:
    charge = stripe.Charge.retrieve(e.error.payment_intent.latest_charge)
    if charge.outcome.type == 'blocked':
      logging.error("Payment blocked for suspected fraud.")
    elif e.code == 'card_declined':
      logging.error("Payment declined by the issuer.")
    elif e.code == 'expired_card':
      logging.error("Card expired.")
    else:
      logging.error("Other card error.")
```

```php
<?php
  require 'vendor/autoload.php';
  \Stripe\Stripe::setApiKey('<<secret key>>');

  function example_function($args) {
    try {
      $stripe->paymentIntents->create($args);
    } catch(\Stripe\Exception\CardException $e) {
      $charge = $stripe->charge->retrieve($e->getError()->payment_intent->latest_charge);
      if ($charge->outcome->type == 'blocked') {
        error_log('Blocked for suspected fraud.');
      } elseif ($e->getError()->code == 'expired_card') {
        error_log('Card expired.');
      } elseif ($e->getError()->code == 'card_declined') {
        error_log('Declined by the issuer.');
      } else {
        error_log('Other card error.');
      }
    }
  }
```

```java
public static void example_function(PaymentIntentCreateParams params) {
        Stripe.apiKey = "<<secret key>>";
        try {
            PaymentIntent paymentIntent = PaymentIntent.create(params);
        } catch (CardException e) {
            Charge charge = Charge.retrieve(ex.getStripeError()
                 .getPaymentIntent()
                 .getLatestCharge());
            if(charge
                 .getOutcome()
                 .getType().equals("blocked")) {
                System.out.println("Payment blocked for suspected fraud.");
            } else if(e.getCode().equals("card_declined")) {
                System.out.println("Declined by the issuer.");
            } else if(e.getCode().equals("expired_card")) {
                System.out.println("Card expired.");
            } else {
                System.out.println("Other card error.");
            }
        } catch (Exception e) {
            System.out.println("Another problem occurred, maybe unrelated to Stripe.");
        }
    }
```

```javascript
const stripe = require('stripe')('<<secret key>>');

async function exampleFunction(args) {
    try {
      const paymentIntent = await stripe.paymentIntents.create(args);
    } catch (e) {
      console.log(e)
      const charge = await stripe.charges.retrieve(e.payment_intent.latest_charge)
      if (e.type === 'StripeCardError') {
        if (charge.outcome.type === 'blocked') {
          console.log('Payment blocked for suspected fraud.')
        } else if (e.code === 'card_declined') {
          console.log('Payment declined by the issuer.')
        } else if (e.code === 'expired_card') {
          console.log('Card expired.')
        } else {
          console.log('Other card error.')
        }
      }
    }
  }
```

```go
func example_function(params *stripe.PaymentIntentParams) {
  stripe.Key = "<<secret key>>"
  _, err := paymentintent.New(params)
  if err == nil {
    log.Println("No error.")
  } else {
    if stripeErr, ok := err.(*stripe.Error); ok {
      if stripeErr.Type == stripe.ErrorTypeCard {
        charge = Charge.retrieve(stripeErr.PaymentIntent.LatestCharge)
        if charge.Outcome.Type == "blocked" {
          log.Println("Payment blocked for suspected fraud.")
        } else if stripeErr.Code == stripe.ErrorCodeCardDeclined {
          log.Println("Declined by the issuer.")
        } else if stripeErr.Code == stripe.ErrorCodeExpiredCard {
          log.Println("Card expired.")
        } else {
          log.Println("Other card error.")
        }
      }
    }
  }
}
```

```dotnet
using Stripe;
StripeConfiguration.ApiKey = Environment.GetEnvironmentVariable("STRIPE_SECRET_KEY");

static void ExampleFunction(PaymentIntentCreateOptions options)
{
	try
	{
		var service = new PaymentIntentService();
		service.Create(options);
	}
	catch (StripeException e)
	{
		if (e.StripeError.Type == "card_error")
		{
      var chargeService = new ChargeService();
      var options = new ChargeGetOptions();
      var charge = service.Get(e.StripeError.PaymentIntent.LatestChargeId, options);

			if(charge.Outcome.Type == "blocked")
			{
				Console.WriteLine("Payment blocked for suspected fraud.");
			}
			else if (e.StripeError.Code == "card_declined")
			{
				Console.WriteLine("Declined by the issuer.");
			}
			else if (e.StripeError.Code == "expired_card")
			{
				Console.WriteLine("Card expired.");
			}
			else
			{
				Console.WriteLine("Other card error.");
			}
		}
	}
}
```

Users on API version [2022-08-01](https://docs.stripe.com/upgrades.md#2022-08-01) or older:

(To find the charge outcome from an error object, first get the [Payment Intent that’s involved](https://docs.stripe.com/api/errors.md#errors-payment_intent) and the [latest Charge it created](https://docs.stripe.com/api/payment_intents/object.md#payment_intent_object-charges-data). See the example below for a demonstration.)

```ruby
require 'stripe'
Stripe.api_key = '<<secret key>>'

def example_function(params)
  begin
    Stripe::PaymentIntent.create(params)
  rescue Stripe::CardError => e
    if e.error.payment_intent.charges.data[0].outcome.type == 'blocked'
      puts 'Payment blocked for suspected fraud.'
    elsif e.code == 'card_declined'
      puts 'Payment declined by the issuer.'
    elsif e.code == 'expired_card'
      puts 'Card expired.'
    else
      puts 'Other card error.'
    end
  end
end
```

```python
import stripe, logging
stripe.api_key = <<secret key>>

def example_function(**kwargs):
  try:
    stripe.PaymentIntent.create(**kwargs)
  except stripe.error.CardError as e:
    if e.error.payment_intent.charges.data[0].outcome.type == 'blocked':
      logging.error("Payment blocked for suspected fraud.")
    elif e.code == 'card_declined':
      logging.error("Payment declined by the issuer.")
    elif e.code == 'expired_card':
      logging.error("Card expired.")
    else:
      logging.error("Other card error.")
```

```php
<?php
  require 'vendor/autoload.php';
  \Stripe\Stripe::setApiKey('<<secret key>>');

  function example_function($args) {
    try {
      $stripe->paymentIntents->create($args);
    } catch(\Stripe\Exception\CardException $e) {
      if ($e->getError()->payment_intent->charges->data[0]->outcome->type == 'blocked') {
        error_log('Blocked for suspected fraud.');
      } elseif ($e->getError()->code == 'expired_card') {
        error_log('Card expired.');
      } elseif ($e->getError()->code == 'card_declined') {
        error_log('Declined by the issuer.');
      } else {
        error_log('Other card error.');
      }
    }
  }
```

```java
public static void example_function(PaymentIntentCreateParams params) {
        Stripe.apiKey = "<<secret key>>";
        try {
            PaymentIntent paymentIntent = PaymentIntent.create(params);
        } catch (CardException e) {
            if(ex.getStripeError()
                 .getPaymentIntent()
                 .getCharges()
                 .getData()
                 .get(0)
                 .getOutcome()
                 .getType().equals("blocked")) {
                System.out.println("Payment blocked for suspected fraud.");
            } else if(e.getCode().equals("card_declined")) {
                System.out.println("Declined by the issuer.");
            } else if(e.getCode().equals("expired_card")) {
                System.out.println("Card expired.");
            } else {
                System.out.println("Other card error.");
            }
        } catch (Exception e) {
            System.out.println("Another problem occurred, maybe unrelated to Stripe.");
        }
    }
```

```javascript
const stripe = require('stripe')('<<secret key>>');

async function exampleFunction(args) {
    try {
      const paymentIntent = await stripe.paymentIntents.create(args);
    } catch (e) {
      console.log(e)
      if (e.type === 'StripeCardError') {
        if (e.payment_intent.charges.data[0].outcome.type === 'blocked') {
          console.log('Payment blocked for suspected fraud.')
        } else if (e.code === 'card_declined') {
          console.log('Payment declined by the issuer.')
        } else if (e.code === 'expired_card') {
          console.log('Card expired.')
        } else {
          console.log('Other card error.')
        }
      }
    }
  }
```

```go
func example_function(params *stripe.PaymentIntentParams) {
  stripe.Key = "<<secret key>>"
  _, err := paymentintent.New(params)
  if err == nil {
    log.Println("No error.")
  } else {
    if stripeErr, ok := err.(*stripe.Error); ok {
      if stripeErr.Type == stripe.ErrorTypeCard {
        if stripeErr.PaymentIntent.Charges.Data[0].Outcome.Type == "blocked" {
          log.Println("Payment blocked for suspected fraud.")
        } else if stripeErr.Code == stripe.ErrorCodeCardDeclined {
          log.Println("Declined by the issuer.")
        } else if stripeErr.Code == stripe.ErrorCodeExpiredCard {
          log.Println("Card expired.")
        } else {
          log.Println("Other card error.")
        }
      }
    }
  }
}
```

```dotnet
using Stripe;
StripeConfiguration.ApiKey = Environment.GetEnvironmentVariable("STRIPE_SECRET_KEY");

static void ExampleFunction(PaymentIntentCreateOptions options)
{
	try
	{
		var service = new PaymentIntentService();
		service.Create(options);
	}
	catch (StripeException e)
	{
		if (e.StripeError.Type == "card_error")
		{
			if(e.StripeError.PaymentIntent.Charges.Data[0].Outcome.Type == "blocked")
			{
				Console.WriteLine("Payment blocked for suspected fraud.");
			}
			else if (e.StripeError.Code == "card_declined")
			{
				Console.WriteLine("Declined by the issuer.");
			}
			else if (e.StripeError.Code == "expired_card")
			{
				Console.WriteLine("Card expired.");
			}
			else
			{
				Console.WriteLine("Other card error.");
			}
		}
	}
}
```

You can trigger some common kinds of payment error with test cards. Consult these lists for options:

* [Simulating payments blocked for fraud risk](https://docs.stripe.com/testing.md#fraud-prevention)
* [Simulating declined payments and other card errors](https://docs.stripe.com/testing.md#declined-payments)

The test code below demonstrates a few possibilities.

```ruby
example_function(
  currency: 'USD',
  amount: 2000,
  confirm: true,
  payment_method: 'pm_card_radarBlock',
)
```

```
Payment blocked for suspected fraud.
```

```python
example_function(
  currency='USD',
  amount=2000,
  confirm=True,
  payment_method='pm_card_radarBlock',
)
```

```
Payment blocked for suspected fraud.
```

```php
example_function([
  'currency' => 'USD',
  'amount' => 2000,
  'confirm' => True,
  'payment_method' => 'pm_card_radarBlock',
]);
```

```
Payment blocked for suspected fraud.
```

```java
PaymentIntentCreateParams params = PaymentIntentCreateParams.builder()
    .setCurrency("USD")
    .setAmount(2000L)
    .setConfirm(true)
    .setPaymentMethod("pm_card_radarBlock")
    .build();
example_function(params);
```

```
Payment blocked for suspected fraud.
```

```javascript
exampleFunction({
  currency: 'USD',
  amount: 2000,
  confirm: true,
  payment_method: 'pm_card_radarBlock',
})
```

```
Payment blocked for suspected fraud.
```

```go
params := &stripe.PaymentIntentParams{
  Amount: stripe.Int64(2000),
  Currency: stripe.String(string(stripe.CurrencyUSD)),
  Confirm: stripe.Bool(true),
  PaymentMethod: stripe.String("pm_card_radarBlock"),
}
example_function(params)
```

```
Payment blocked for suspected fraud.
```

```dotnet
var options = new PaymentIntentCreateOptions
{
  Amount = 2000,
  Currency = "USD",
  Confirm = true,
  PaymentMethod = "pm_card_radarBlock"
};
ExampleFunction(options);

```

```
Payment blocked for suspected fraud.
```

```ruby
example_function(
  currency: 'USD',
  amount: 2000,
  confirm: true,
  payment_method: 'pm_card_visa_chargeDeclined',
)
```

```
Payment declined by the issuer.
```

```python
example_function(
  currency='USD',
  amount=2000,
  confirm=True,
  payment_method: 'pm_card_visa_chargeDeclined',
)
```

```
Payment declined by the issuer.
```

```php
example_function([
  'currency' => 'USD',
  'amount' => 2000,
  'confirm' => True,
  'payment_method' => 'pm_card_visa_chargeDeclined',
]);
```

```
Payment declined by the issuer
```

```java
PaymentIntentCreateParams params = PaymentIntentCreateParams.builder()
    .setCurrency("USD")
    .setAmount(2000L)
    .setConfirm(true)
    .setPaymentMethod("pm_card_visa_chargeDeclined")
    .build();
example_function(params);
```

```
Payment declined by the issuer.
```

```javascript
exampleFunction({
  currency: 'USD',
  amount: 2000,
  confirm: true,
  payment_method: 'pm_card_visa_chargeDeclined',
})
```

```
Payment declined by the issuer.
```

```go
params := &stripe.PaymentIntentParams{
  Amount: stripe.Int64(2000),
  Currency: stripe.String(string(stripe.CurrencyUSD)),
  Confirm: stripe.Bool(true),
  PaymentMethod: stripe.String("pm_card_visa_chargeDeclined"),
}
example_function(params)
```

```
Payment declined by the issuer.
```

```dotnet
var options = new PaymentIntentCreateOptions
{
  Amount = 2000,
  Currency = "USD",
  Confirm = true,
  PaymentMethod = "pm_card_visa_chargeDeclined",
};
ExampleFunction(options);

```

```
Payment declined by the issuer.
```

```ruby
example_function(
  currency: 'USD',
  amount: 2000,
  confirm: true,
  payment_method: 'pm_card_chargeDeclinedExpiredCard',
)
```

```
Card expired.
```

```python
example_function(
  currency='USD',
  amount=2000,
  confirm=True,
  payment_method: 'pm_card_chargeDeclinedExpiredCard',
)
```

```
Card expired.
```

```php
example_function([
  'currency' => 'USD',
  'amount' => 2000,
  'confirm' => True,
  'payment_method' => 'pm_card_chargeDeclinedExpiredCard',
]);
```

```
Card expired.
```

```java
PaymentIntentCreateParams params = PaymentIntentCreateParams.builder()
    .setCurrency("USD")
    .setAmount(2000L)
    .setConfirm(true)
    .setPaymentMethod("pm_card_chargeDeclinedExpiredCard")
    .build();
example_function(params);
```

```
Card expired.
```

```javascript
exampleFunction({
  currency: 'USD',
  amount: 2000,
  confirm: true,
  payment_method: 'pm_card_chargeDeclinedExpiredCard',
})
```

```
Card expired.
```

```go
params := &stripe.PaymentIntentParams{
  Amount: stripe.Int64(2000),
  Currency: stripe.String(string(stripe.CurrencyUSD)),
  Confirm: stripe.Bool(true),
  PaymentMethod: stripe.String("pm_card_chargeDeclinedExpiredCard"),
}
example_function(params)
```

```
Card expired.
```

```dotnet
var options = new PaymentIntentCreateOptions
{
  Amount = 2000,
  Currency = "USD",
  Confirm = true,
  PaymentMethod = "pm_card_chargeDeclinedExpiredCard",
};
ExampleFunction(options);

```

```
Card expired.
```

```ruby
example_function(
  currency: 'USD',
  amount: 2000,
  confirm: true,
  payment_method: 'pm_card_chargeDeclinedProcessingError',
)
```

```
Other payment error.
```

```python
example_function(
  currency='USD',
  amount=2000,
  confirm=True,
  payment_method: 'pm_card_chargeDeclinedProcessingError',
)
```

```
Other payment error.
```

```php
example_function([
  'currency' => 'USD',
  'amount' => 2000,
  'confirm' => True,
  'payment_method' => 'pm_card_chargeDeclinedProcessingError',
]);
```

```
Other payment error.
```

```java
PaymentIntentCreateParams params = PaymentIntentCreateParams.builder()
    .setCurrency("USD")
    .setAmount(2000L)
    .setConfirm(true)
    .setPaymentMethod("pm_card_chargeDeclinedProcessingError")
    .build();
example_function(params);
```

```
Other payment error.
```

```javascript
exampleFunction({
  currency: 'USD',
  amount: 2000,
  confirm: true,
  payment_method: 'pm_card_chargeDeclinedProcessingError',
})
```

```
Other payment error.
```

```go
params := &stripe.PaymentIntentParams{
  Amount: stripe.Int64(2000),
  Currency: stripe.String(string(stripe.CurrencyUSD)),
  Confirm: stripe.Bool(true),
  PaymentMethod: stripe.String("pm_card_chargeDeclinedProcessingError"),
}
example_function(params)
```

```
Other card error.
```

```dotnet
var options = new PaymentIntentCreateOptions
{
  Amount = 2000,
  Currency = "USD",
  Confirm = true,
  PaymentMethod = "pm_card_chargeDeclinedProcessingError",
};
ExampleFunction(options);

```

```
Other payment error.
```

### Payment blocked for suspected fraud  

|  |
|  |
| **Type**      |                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| **Codes**     |                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| **Codes**     |                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| **Problem**   | Stripe’s fraud prevention system, *Radar*, blocked the payment                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| **Solutions** | This error can occur when your integration is working correctly. Catch it and prompt the customer for a different payment method.

  To block fewer legitimate payments, try these:

  * [Optimize your Radar integration](https://docs.stripe.com/radar/integration.md) to collect more detailed information.
  * Use [Payment Links](https://docs.stripe.com/payment-links.md), [Checkout](https://docs.stripe.com/payments/checkout.md), or [Stripe Elements](https://docs.stripe.com/payments/elements.md) for prebuilt optimized form elements.

  *Radar for Fraud Teams* customers have these additional options:

  * To exempt a specific payment, add it to your allowlist.
  * To change your risk tolerance, adjust your [risk settings](https://docs.stripe.com/radar/risk-settings.md).
  * To change the criteria for blocking a payment, use [custom rules](https://docs.stripe.com/radar/rules.md).

  You can test your integration’s settings with [test cards that simulate fraud](https://docs.stripe.com/radar/testing.md). If you have custom Radar rules, follow the testing advice in the [Radar documentation](https://docs.stripe.com/radar/testing.md). |

### Payment declined by the issuer  

|  |
|  |
| **Type**      |                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| **Codes**     |                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| **Problem**   | The card issuer declined the payment.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| **Solutions** | This error can occur when your integration is working correctly. It reflects an action by the issuer, and that action might be legitimate. Use the decline code to determine what next steps are appropriate. See the [documentation on decline codes](https://docs.stripe.com/declines/codes.md) for appropriate responses to each code.

  You can also:

  * [Follow recommendations to reduce issuer declines](https://docs.stripe.com/declines/card.md#reducing-bank-declines).
  * Use [Payment Links](https://docs.stripe.com/payment-links.md), [Checkout](https://docs.stripe.com/payments/checkout.md), or [Stripe Elements](https://docs.stripe.com/payments/elements.md) for prebuilt form elements that implement those recommendations.

  Test how your integration handles declines with [test cards that simulate successful and declined payments](https://docs.stripe.com/radar/testing.md). |

### Other payment errors  

|  |
|  |
| **Type**      |                                                                                                                                                                                                                                                          |
| **Problem**   | Another payment error occurred.                                                                                                                                                                                                                          |
| **Solutions** | This error can occur when your integration is working correctly. Use the error code to determine what next steps are appropriate. See the [documentation on error codes](https://docs.stripe.com/error-codes.md) for appropriate responses to each code. |

## Invalid request errors  

|  |
|  |
| **Type**      |                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| **Problem**   | You made an API call with the wrong parameters, in the wrong state, or in an invalid way.                                                                                                                                                                                                                                                                                                                                                         |
| **Solutions** | In most cases, the problem is with the request itself. Either its parameters are invalid or it can’t be carried out in your integration’s current state.
  * Consult the [error code documentation](https://docs.stripe.com/error-codes.md) for details on the problem.
  * For convenience, you can follow the link at  for documentation about the error code.
  * If the error involves a specific parameter, use 
    to determine which one. |

## Connection errors  

|  |
|  |
| **Type**      |                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| **Problem**   | There was a network problem between your server and Stripe.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| **Solutions** | Treat the result of the API call as indeterminate. That is, don’t assume that it succeeded or that it failed.

  To find out if it succeeded, you can:

  * Retrieve the relevant object from Stripe and check its status.
  * Listen for webhook notification that the operation succeeded or failed.

  To help recover from connection errors, you can:

  * When creating or updating an object, use an [idempotency key](https://docs.stripe.com/api/idempotent_requests.md). Then, if a connection error occurs, you can safely repeat the request without risk of creating a second object or performing the update twice. Repeat the request with the same idempotency key until you receive a clear success or failure. For advanced advice on this strategy, see [Low-level error handling](https://docs.stripe.com/error-low-level.md#idempotency).
  * Turn on [automatic retries.](#automatic-retries) Then, Stripe generates idempotency keys for you, and repeats requests for you when it is safe to do so.

  This error can mask others. It’s possible that when the connection error resolves, some other error becomes apparent. Check for errors in all of these solutions just as you would in the original request. |

## API errors  

|  |
|  |
| **Type**      |                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| **Problem**   | Something went wrong on Stripe’s end. (These are rare.)                                                                                                                                                                                                                                                                                                                                                                                                     |
| **Solutions** | Treat the result of the API call as indeterminate. That is, don’t assume that it succeeded or that it failed.

  Rely on *webhooks* for information about the outcome. Whenever possible, Stripe fires webhooks for any new objects we create as we solve a problem.

  To set your integration up for maximum robustness in unusual situations, see [this advanced discussion of server errors.](https://docs.stripe.com/error-low-level.md#server-errors) |

## Authentication errors  

|  |
|  |
| **Type**      |                                                                                                                                                                                   |
| **Problem**   | Stripe can’t authenticate you with the information provided.                                                                                                                      |
| **Solutions** | * Use the correct [API key](https://docs.stripe.com/keys.md).
  * Make sure you aren’t using a key that you [“rotated” or revoked](https://docs.stripe.com/keys.md#rolling-keys). |

## Idempotency errors  

|  |
|  |
| **Type**      |                                                                                                                                                                        |
| **Problem**   | You used an [idempotency key](https://docs.stripe.com/api/idempotent_requests.md) for something unexpected, like replaying a request but passing different parameters. |
| **Solutions** | * After you use an idempotency key, only reuse it for identical API calls.
  * Use idempotency keys under the limit of 255 characters.                                 |

## Permission errors  

|  |
|  |
| **Type**      |                                                                                                                                                                                                                                                                                                                          |
| **Problem**   | The API key used for this request doesn’t have the necessary permissions.                                                                                                                                                                                                                                                |
| **Solutions** | * Make sure you aren’t using a [restricted API key](https://docs.stripe.com/keys-best-practices.md#limit-access) for a service it doesn’t have access to.
  * Don’t perform actions in the Dashboard while logged in as a [user role](https://docs.stripe.com/get-started/account/teams/roles.md) that lacks permission. |

## Rate limit errors  

|  |
|  |
| **Type**      |                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| **Problem**   | You made too many API calls in too short a time.                                                                                                                                                                                                                                                                                                                                                                                                                          |
| **Solutions** | * If a single API call triggers this error, wait and try it again.
  * To handle rate-limiting automatically, retry the API call after a delay, and increase the delay exponentially if the error continues. See the documentation on [rate limits](https://docs.stripe.com/rate-limits.md) for further advice.
  * If you anticipate a large increase in traffic and want to request an increased rate limit, [contact support](https://support.stripe.com/) in advance. |

## Signature verification errors  

|  |
|  |
| **Type**      |                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| **Problem**   | You’re using *webhook* [signature verification](https://docs.stripe.com/webhooks.md#verify-events) and couldn’t verify that a webhook event is authentic.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| **Solutions** | This error can occur when your integration is working correctly. If you use webhook signature verification and a third party attempts to send you a fake or malicious webhook, then verification fails and this error is the result. Catch it and respond with a `400 Bad Request` status code.

  If you receive this error when you shouldn’t—for instance, with webhooks that you know originate with Stripe—then see the documentation on [checking webhook signatures](https://docs.stripe.com/webhooks.md#verify-events) for further advice. In particular, make sure you’re using the correct endpoint secret. This is different from your API key. |

In the Stripe PHP library, each type of error belongs to its own class. Use the documentation for each class
for advice about how to respond.

| Name                  |  | Description                                                                                                                                                                                                                                    |
| --------------------- |  | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Payment error         |  | An error occurred during a payment, involving one of these situations:
  * [Payment blocked for suspected fraud](#payment-blocked)
  * [Payment declined by the issuer](#payment-declined).
  * [Other payment errors](#other-payment-errors). |
| Invalid request error |  |                                                                                                                                                                                                                                                |
| API error             |  | Something went wrong on Stripe’s end. (These are rare.)                                                                                                                                                                                        |
| Idempotency error     |  | You used an [idempotency key](https://docs.stripe.com/api/idempotent_requests.md) for something unexpected, like replaying a request but passing different parameters.                                                                         |

## Payment errors 

Everything in this section also applies to non-card payments. For historical reasons, payment errors have the type . But in fact, they can represent a problem with any payment, regardless of the payment method.

Payment errors—sometimes called “card errors” for historical reasons—cover a wide range of common problems. They come in three categories:

* [Payment blocked for suspected fraud](#payment-blocked)
* [Payment declined by the issuer](#payment-declined)
* [Other payment errors](#other-payment-errors)

To distinguish these categories or get more information about how to respond, consult the [error code](https://docs.stripe.com/error-codes.md), [decline code](https://docs.stripe.com/declines/codes.md), and [charge outcome](https://docs.stripe.com/api/charges/object.md#charge_object-outcome).

(To find the charge outcome from an error object, first get the [Payment Intent that’s involved](https://docs.stripe.com/api/errors.md#errors-payment_intent) and the [latest Charge it created](https://docs.stripe.com/api/payment_intents/object.md#payment_intent_object-latest_charge). See the example below for a demonstration.)

```ruby
require 'stripe'
Stripe.api_key = '<<secret key>>'

def example_function(params)
  begin
    Stripe::PaymentIntent.create(params)
  rescue Stripe::CardError => e
    charge = Stripe::Charge.retrieve(e.error.payment_intent.latest_charge)
    if charge.outcome.type == 'blocked'
      puts 'Payment blocked for suspected fraud.'
    elsif e.code == 'card_declined'
      puts 'Payment declined by the issuer.'
    elsif e.code == 'expired_card'
      puts 'Card expired.'
    else
      puts 'Other card error.'
    end
  end
end
```

```python
import stripe, logging
stripe.api_key = <<secret key>>

def example_function(**kwargs):
  try:
    stripe.PaymentIntent.create(**kwargs)
  except stripe.CardError as e:
    charge = stripe.Charge.retrieve(e.error.payment_intent.latest_charge)
    if charge.outcome.type == 'blocked':
      logging.error("Payment blocked for suspected fraud.")
    elif e.code == 'card_declined':
      logging.error("Payment declined by the issuer.")
    elif e.code == 'expired_card':
      logging.error("Card expired.")
    else:
      logging.error("Other card error.")
```

```php
<?php
  require 'vendor/autoload.php';
  \Stripe\Stripe::setApiKey('<<secret key>>');

  function example_function($args) {
    try {
      $stripe->paymentIntents->create($args);
    } catch(\Stripe\Exception\CardException $e) {
      $charge = $stripe->charge->retrieve($e->getError()->payment_intent->latest_charge);
      if ($charge->outcome->type == 'blocked') {
        error_log('Blocked for suspected fraud.');
      } elseif ($e->getError()->code == 'expired_card') {
        error_log('Card expired.');
      } elseif ($e->getError()->code == 'card_declined') {
        error_log('Declined by the issuer.');
      } else {
        error_log('Other card error.');
      }
    }
  }
```

```java
public static void example_function(PaymentIntentCreateParams params) {
        Stripe.apiKey = "<<secret key>>";
        try {
            PaymentIntent paymentIntent = PaymentIntent.create(params);
        } catch (CardException e) {
            Charge charge = Charge.retrieve(ex.getStripeError()
                 .getPaymentIntent()
                 .getLatestCharge());
            if(charge
                 .getOutcome()
                 .getType().equals("blocked")) {
                System.out.println("Payment blocked for suspected fraud.");
            } else if(e.getCode().equals("card_declined")) {
                System.out.println("Declined by the issuer.");
            } else if(e.getCode().equals("expired_card")) {
                System.out.println("Card expired.");
            } else {
                System.out.println("Other card error.");
            }
        } catch (Exception e) {
            System.out.println("Another problem occurred, maybe unrelated to Stripe.");
        }
    }
```

```javascript
const stripe = require('stripe')('<<secret key>>');

async function exampleFunction(args) {
    try {
      const paymentIntent = await stripe.paymentIntents.create(args);
    } catch (e) {
      console.log(e)
      const charge = await stripe.charges.retrieve(e.payment_intent.latest_charge)
      if (e.type === 'StripeCardError') {
        if (charge.outcome.type === 'blocked') {
          console.log('Payment blocked for suspected fraud.')
        } else if (e.code === 'card_declined') {
          console.log('Payment declined by the issuer.')
        } else if (e.code === 'expired_card') {
          console.log('Card expired.')
        } else {
          console.log('Other card error.')
        }
      }
    }
  }
```

```go
func example_function(params *stripe.PaymentIntentParams) {
  stripe.Key = "<<secret key>>"
  _, err := paymentintent.New(params)
  if err == nil {
    log.Println("No error.")
  } else {
    if stripeErr, ok := err.(*stripe.Error); ok {
      if stripeErr.Type == stripe.ErrorTypeCard {
        charge = Charge.retrieve(stripeErr.PaymentIntent.LatestCharge)
        if charge.Outcome.Type == "blocked" {
          log.Println("Payment blocked for suspected fraud.")
        } else if stripeErr.Code == stripe.ErrorCodeCardDeclined {
          log.Println("Declined by the issuer.")
        } else if stripeErr.Code == stripe.ErrorCodeExpiredCard {
          log.Println("Card expired.")
        } else {
          log.Println("Other card error.")
        }
      }
    }
  }
}
```

```dotnet
using Stripe;
StripeConfiguration.ApiKey = Environment.GetEnvironmentVariable("STRIPE_SECRET_KEY");

static void ExampleFunction(PaymentIntentCreateOptions options)
{
	try
	{
		var service = new PaymentIntentService();
		service.Create(options);
	}
	catch (StripeException e)
	{
		if (e.StripeError.Type == "card_error")
		{
      var chargeService = new ChargeService();
      var options = new ChargeGetOptions();
      var charge = service.Get(e.StripeError.PaymentIntent.LatestChargeId, options);

			if(charge.Outcome.Type == "blocked")
			{
				Console.WriteLine("Payment blocked for suspected fraud.");
			}
			else if (e.StripeError.Code == "card_declined")
			{
				Console.WriteLine("Declined by the issuer.");
			}
			else if (e.StripeError.Code == "expired_card")
			{
				Console.WriteLine("Card expired.");
			}
			else
			{
				Console.WriteLine("Other card error.");
			}
		}
	}
}
```

Users on API version [2022-08-01](https://docs.stripe.com/upgrades.md#2022-08-01) or older:

(To find the charge outcome from an error object, first get the [Payment Intent that’s involved](https://docs.stripe.com/api/errors.md#errors-payment_intent) and the [latest Charge it created](https://docs.stripe.com/api/payment_intents/object.md#payment_intent_object-charges-data). See the example below for a demonstration.)

```ruby
require 'stripe'
Stripe.api_key = '<<secret key>>'

def example_function(params)
  begin
    Stripe::PaymentIntent.create(params)
  rescue Stripe::CardError => e
    if e.error.payment_intent.charges.data[0].outcome.type == 'blocked'
      puts 'Payment blocked for suspected fraud.'
    elsif e.code == 'card_declined'
      puts 'Payment declined by the issuer.'
    elsif e.code == 'expired_card'
      puts 'Card expired.'
    else
      puts 'Other card error.'
    end
  end
end
```

```python
import stripe, logging
stripe.api_key = <<secret key>>

def example_function(**kwargs):
  try:
    stripe.PaymentIntent.create(**kwargs)
  except stripe.error.CardError as e:
    if e.error.payment_intent.charges.data[0].outcome.type == 'blocked':
      logging.error("Payment blocked for suspected fraud.")
    elif e.code == 'card_declined':
      logging.error("Payment declined by the issuer.")
    elif e.code == 'expired_card':
      logging.error("Card expired.")
    else:
      logging.error("Other card error.")
```

```php
<?php
  require 'vendor/autoload.php';
  \Stripe\Stripe::setApiKey('<<secret key>>');

  function example_function($args) {
    try {
      $stripe->paymentIntents->create($args);
    } catch(\Stripe\Exception\CardException $e) {
      if ($e->getError()->payment_intent->charges->data[0]->outcome->type == 'blocked') {
        error_log('Blocked for suspected fraud.');
      } elseif ($e->getError()->code == 'expired_card') {
        error_log('Card expired.');
      } elseif ($e->getError()->code == 'card_declined') {
        error_log('Declined by the issuer.');
      } else {
        error_log('Other card error.');
      }
    }
  }
```

```java
public static void example_function(PaymentIntentCreateParams params) {
        Stripe.apiKey = "<<secret key>>";
        try {
            PaymentIntent paymentIntent = PaymentIntent.create(params);
        } catch (CardException e) {
            if(ex.getStripeError()
                 .getPaymentIntent()
                 .getCharges()
                 .getData()
                 .get(0)
                 .getOutcome()
                 .getType().equals("blocked")) {
                System.out.println("Payment blocked for suspected fraud.");
            } else if(e.getCode().equals("card_declined")) {
                System.out.println("Declined by the issuer.");
            } else if(e.getCode().equals("expired_card")) {
                System.out.println("Card expired.");
            } else {
                System.out.println("Other card error.");
            }
        } catch (Exception e) {
            System.out.println("Another problem occurred, maybe unrelated to Stripe.");
        }
    }
```

```javascript
const stripe = require('stripe')('<<secret key>>');

async function exampleFunction(args) {
    try {
      const paymentIntent = await stripe.paymentIntents.create(args);
    } catch (e) {
      console.log(e)
      if (e.type === 'StripeCardError') {
        if (e.payment_intent.charges.data[0].outcome.type === 'blocked') {
          console.log('Payment blocked for suspected fraud.')
        } else if (e.code === 'card_declined') {
          console.log('Payment declined by the issuer.')
        } else if (e.code === 'expired_card') {
          console.log('Card expired.')
        } else {
          console.log('Other card error.')
        }
      }
    }
  }
```

```go
func example_function(params *stripe.PaymentIntentParams) {
  stripe.Key = "<<secret key>>"
  _, err := paymentintent.New(params)
  if err == nil {
    log.Println("No error.")
  } else {
    if stripeErr, ok := err.(*stripe.Error); ok {
      if stripeErr.Type == stripe.ErrorTypeCard {
        if stripeErr.PaymentIntent.Charges.Data[0].Outcome.Type == "blocked" {
          log.Println("Payment blocked for suspected fraud.")
        } else if stripeErr.Code == stripe.ErrorCodeCardDeclined {
          log.Println("Declined by the issuer.")
        } else if stripeErr.Code == stripe.ErrorCodeExpiredCard {
          log.Println("Card expired.")
        } else {
          log.Println("Other card error.")
        }
      }
    }
  }
}
```

```dotnet
using Stripe;
StripeConfiguration.ApiKey = Environment.GetEnvironmentVariable("STRIPE_SECRET_KEY");

static void ExampleFunction(PaymentIntentCreateOptions options)
{
	try
	{
		var service = new PaymentIntentService();
		service.Create(options);
	}
	catch (StripeException e)
	{
		if (e.StripeError.Type == "card_error")
		{
			if(e.StripeError.PaymentIntent.Charges.Data[0].Outcome.Type == "blocked")
			{
				Console.WriteLine("Payment blocked for suspected fraud.");
			}
			else if (e.StripeError.Code == "card_declined")
			{
				Console.WriteLine("Declined by the issuer.");
			}
			else if (e.StripeError.Code == "expired_card")
			{
				Console.WriteLine("Card expired.");
			}
			else
			{
				Console.WriteLine("Other card error.");
			}
		}
	}
}
```

You can trigger some common kinds of payment error with test cards. Consult these lists for options:

* [Simulating payments blocked for fraud risk](https://docs.stripe.com/testing.md#fraud-prevention)
* [Simulating declined payments and other card errors](https://docs.stripe.com/testing.md#declined-payments)

The test code below demonstrates a few possibilities.

```ruby
example_function(
  currency: 'USD',
  amount: 2000,
  confirm: true,
  payment_method: 'pm_card_radarBlock',
)
```

```
Payment blocked for suspected fraud.
```

```python
example_function(
  currency='USD',
  amount=2000,
  confirm=True,
  payment_method='pm_card_radarBlock',
)
```

```
Payment blocked for suspected fraud.
```

```php
example_function([
  'currency' => 'USD',
  'amount' => 2000,
  'confirm' => True,
  'payment_method' => 'pm_card_radarBlock',
]);
```

```
Payment blocked for suspected fraud.
```

```java
PaymentIntentCreateParams params = PaymentIntentCreateParams.builder()
    .setCurrency("USD")
    .setAmount(2000L)
    .setConfirm(true)
    .setPaymentMethod("pm_card_radarBlock")
    .build();
example_function(params);
```

```
Payment blocked for suspected fraud.
```

```javascript
exampleFunction({
  currency: 'USD',
  amount: 2000,
  confirm: true,
  payment_method: 'pm_card_radarBlock',
})
```

```
Payment blocked for suspected fraud.
```

```go
params := &stripe.PaymentIntentParams{
  Amount: stripe.Int64(2000),
  Currency: stripe.String(string(stripe.CurrencyUSD)),
  Confirm: stripe.Bool(true),
  PaymentMethod: stripe.String("pm_card_radarBlock"),
}
example_function(params)
```

```
Payment blocked for suspected fraud.
```

```dotnet
var options = new PaymentIntentCreateOptions
{
  Amount = 2000,
  Currency = "USD",
  Confirm = true,
  PaymentMethod = "pm_card_radarBlock"
};
ExampleFunction(options);

```

```
Payment blocked for suspected fraud.
```

```ruby
example_function(
  currency: 'USD',
  amount: 2000,
  confirm: true,
  payment_method: 'pm_card_visa_chargeDeclined',
)
```

```
Payment declined by the issuer.
```

```python
example_function(
  currency='USD',
  amount=2000,
  confirm=True,
  payment_method: 'pm_card_visa_chargeDeclined',
)
```

```
Payment declined by the issuer.
```

```php
example_function([
  'currency' => 'USD',
  'amount' => 2000,
  'confirm' => True,
  'payment_method' => 'pm_card_visa_chargeDeclined',
]);
```

```
Payment declined by the issuer
```

```java
PaymentIntentCreateParams params = PaymentIntentCreateParams.builder()
    .setCurrency("USD")
    .setAmount(2000L)
    .setConfirm(true)
    .setPaymentMethod("pm_card_visa_chargeDeclined")
    .build();
example_function(params);
```

```
Payment declined by the issuer.
```

```javascript
exampleFunction({
  currency: 'USD',
  amount: 2000,
  confirm: true,
  payment_method: 'pm_card_visa_chargeDeclined',
})
```

```
Payment declined by the issuer.
```

```go
params := &stripe.PaymentIntentParams{
  Amount: stripe.Int64(2000),
  Currency: stripe.String(string(stripe.CurrencyUSD)),
  Confirm: stripe.Bool(true),
  PaymentMethod: stripe.String("pm_card_visa_chargeDeclined"),
}
example_function(params)
```

```
Payment declined by the issuer.
```

```dotnet
var options = new PaymentIntentCreateOptions
{
  Amount = 2000,
  Currency = "USD",
  Confirm = true,
  PaymentMethod = "pm_card_visa_chargeDeclined",
};
ExampleFunction(options);

```

```
Payment declined by the issuer.
```

```ruby
example_function(
  currency: 'USD',
  amount: 2000,
  confirm: true,
  payment_method: 'pm_card_chargeDeclinedExpiredCard',
)
```

```
Card expired.
```

```python
example_function(
  currency='USD',
  amount=2000,
  confirm=True,
  payment_method: 'pm_card_chargeDeclinedExpiredCard',
)
```

```
Card expired.
```

```php
example_function([
  'currency' => 'USD',
  'amount' => 2000,
  'confirm' => True,
  'payment_method' => 'pm_card_chargeDeclinedExpiredCard',
]);
```

```
Card expired.
```

```java
PaymentIntentCreateParams params = PaymentIntentCreateParams.builder()
    .setCurrency("USD")
    .setAmount(2000L)
    .setConfirm(true)
    .setPaymentMethod("pm_card_chargeDeclinedExpiredCard")
    .build();
example_function(params);
```

```
Card expired.
```

```javascript
exampleFunction({
  currency: 'USD',
  amount: 2000,
  confirm: true,
  payment_method: 'pm_card_chargeDeclinedExpiredCard',
})
```

```
Card expired.
```

```go
params := &stripe.PaymentIntentParams{
  Amount: stripe.Int64(2000),
  Currency: stripe.String(string(stripe.CurrencyUSD)),
  Confirm: stripe.Bool(true),
  PaymentMethod: stripe.String("pm_card_chargeDeclinedExpiredCard"),
}
example_function(params)
```

```
Card expired.
```

```dotnet
var options = new PaymentIntentCreateOptions
{
  Amount = 2000,
  Currency = "USD",
  Confirm = true,
  PaymentMethod = "pm_card_chargeDeclinedExpiredCard",
};
ExampleFunction(options);

```

```
Card expired.
```

```ruby
example_function(
  currency: 'USD',
  amount: 2000,
  confirm: true,
  payment_method: 'pm_card_chargeDeclinedProcessingError',
)
```

```
Other payment error.
```

```python
example_function(
  currency='USD',
  amount=2000,
  confirm=True,
  payment_method: 'pm_card_chargeDeclinedProcessingError',
)
```

```
Other payment error.
```

```php
example_function([
  'currency' => 'USD',
  'amount' => 2000,
  'confirm' => True,
  'payment_method' => 'pm_card_chargeDeclinedProcessingError',
]);
```

```
Other payment error.
```

```java
PaymentIntentCreateParams params = PaymentIntentCreateParams.builder()
    .setCurrency("USD")
    .setAmount(2000L)
    .setConfirm(true)
    .setPaymentMethod("pm_card_chargeDeclinedProcessingError")
    .build();
example_function(params);
```

```
Other payment error.
```

```javascript
exampleFunction({
  currency: 'USD',
  amount: 2000,
  confirm: true,
  payment_method: 'pm_card_chargeDeclinedProcessingError',
})
```

```
Other payment error.
```

```go
params := &stripe.PaymentIntentParams{
  Amount: stripe.Int64(2000),
  Currency: stripe.String(string(stripe.CurrencyUSD)),
  Confirm: stripe.Bool(true),
  PaymentMethod: stripe.String("pm_card_chargeDeclinedProcessingError"),
}
example_function(params)
```

```
Other card error.
```

```dotnet
var options = new PaymentIntentCreateOptions
{
  Amount = 2000,
  Currency = "USD",
  Confirm = true,
  PaymentMethod = "pm_card_chargeDeclinedProcessingError",
};
ExampleFunction(options);

```

```
Other payment error.
```

### Payment blocked for suspected fraud  

|  |
|  |
| **Type**      |                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| **Codes**     |                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| **Codes**     |                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| **Problem**   | Stripe’s fraud prevention system, *Radar*, blocked the payment                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| **Solutions** | This error can occur when your integration is working correctly. Catch it and prompt the customer for a different payment method.

  To block fewer legitimate payments, try these:

  * [Optimize your Radar integration](https://docs.stripe.com/radar/integration.md) to collect more detailed information.
  * Use [Payment Links](https://docs.stripe.com/payment-links.md), [Checkout](https://docs.stripe.com/payments/checkout.md), or [Stripe Elements](https://docs.stripe.com/payments/elements.md) for prebuilt optimized form elements.

  *Radar for Fraud Teams* customers have these additional options:

  * To exempt a specific payment, add it to your allowlist.
  * To change your risk tolerance, adjust your [risk settings](https://docs.stripe.com/radar/risk-settings.md).
  * To change the criteria for blocking a payment, use [custom rules](https://docs.stripe.com/radar/rules.md).

  You can test your integration’s settings with [test cards that simulate fraud](https://docs.stripe.com/radar/testing.md). If you have custom Radar rules, follow the testing advice in the [Radar documentation](https://docs.stripe.com/radar/testing.md). |

### Payment declined by the issuer  

|  |
|  |
| **Type**      |                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| **Codes**     |                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| **Problem**   | The card issuer declined the payment.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| **Solutions** | This error can occur when your integration is working correctly. It reflects an action by the issuer, and that action might be legitimate. Use the decline code to determine what next steps are appropriate. See the [documentation on decline codes](https://docs.stripe.com/declines/codes.md) for appropriate responses to each code.

  You can also:

  * [Follow recommendations to reduce issuer declines](https://docs.stripe.com/declines/card.md#reducing-bank-declines).
  * Use [Payment Links](https://docs.stripe.com/payment-links.md), [Checkout](https://docs.stripe.com/payments/checkout.md), or [Stripe Elements](https://docs.stripe.com/payments/elements.md) for prebuilt form elements that implement those recommendations.

  Test how your integration handles declines with [test cards that simulate successful and declined payments](https://docs.stripe.com/radar/testing.md). |

### Other payment errors  

|  |
|  |
| **Type**      |                                                                                                                                                                                                                                                          |
| **Problem**   | Another payment error occurred.                                                                                                                                                                                                                          |
| **Solutions** | This error can occur when your integration is working correctly. Use the error code to determine what next steps are appropriate. See the [documentation on error codes](https://docs.stripe.com/error-codes.md) for appropriate responses to each code. |

## Invalid request errors  

|  |
|  |
| **Type**      |                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| **Problem**   | You made an API call with the wrong parameters, in the wrong state, or in an invalid way.                                                                                                                                                                                                                                                                                                                                                         |
| **Solutions** | In most cases, the problem is with the request itself. Either its parameters are invalid or it can’t be carried out in your integration’s current state.
  * Consult the [error code documentation](https://docs.stripe.com/error-codes.md) for details on the problem.
  * For convenience, you can follow the link at  for documentation about the error code.
  * If the error involves a specific parameter, use 
    to determine which one. |

## Connection errors  

|  |
|  |
| **Type**      |                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| **Problem**   | There was a network problem between your server and Stripe.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| **Solutions** | Treat the result of the API call as indeterminate. That is, don’t assume that it succeeded or that it failed.

  To find out if it succeeded, you can:

  * Retrieve the relevant object from Stripe and check its status.
  * Listen for webhook notification that the operation succeeded or failed.

  To help recover from connection errors, you can:

  * When creating or updating an object, use an [idempotency key](https://docs.stripe.com/api/idempotent_requests.md). Then, if a connection error occurs, you can safely repeat the request without risk of creating a second object or performing the update twice. Repeat the request with the same idempotency key until you receive a clear success or failure. For advanced advice on this strategy, see [Low-level error handling](https://docs.stripe.com/error-low-level.md#idempotency).
  * Turn on [automatic retries.](#automatic-retries) Then, Stripe generates idempotency keys for you, and repeats requests for you when it is safe to do so.

  This error can mask others. It’s possible that when the connection error resolves, some other error becomes apparent. Check for errors in all of these solutions just as you would in the original request. |

## API errors  

|  |
|  |
| **Type**      |                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| **Problem**   | Something went wrong on Stripe’s end. (These are rare.)                                                                                                                                                                                                                                                                                                                                                                                                     |
| **Solutions** | Treat the result of the API call as indeterminate. That is, don’t assume that it succeeded or that it failed.

  Rely on *webhooks* for information about the outcome. Whenever possible, Stripe fires webhooks for any new objects we create as we solve a problem.

  To set your integration up for maximum robustness in unusual situations, see [this advanced discussion of server errors.](https://docs.stripe.com/error-low-level.md#server-errors) |

## Authentication errors  

|  |
|  |
| **Type**      |                                                                                                                                                                                   |
| **Problem**   | Stripe can’t authenticate you with the information provided.                                                                                                                      |
| **Solutions** | * Use the correct [API key](https://docs.stripe.com/keys.md).
  * Make sure you aren’t using a key that you [“rotated” or revoked](https://docs.stripe.com/keys.md#rolling-keys). |

## Idempotency errors  

|  |
|  |
| **Type**      |                                                                                                                                                                        |
| **Problem**   | You used an [idempotency key](https://docs.stripe.com/api/idempotent_requests.md) for something unexpected, like replaying a request but passing different parameters. |
| **Solutions** | * After you use an idempotency key, only reuse it for identical API calls.
  * Use idempotency keys under the limit of 255 characters.                                 |

## Permission errors  

|  |
|  |
| **Type**      |                                                                                                                                                                                                                                                                                                                          |
| **Problem**   | The API key used for this request doesn’t have the necessary permissions.                                                                                                                                                                                                                                                |
| **Solutions** | * Make sure you aren’t using a [restricted API key](https://docs.stripe.com/keys-best-practices.md#limit-access) for a service it doesn’t have access to.
  * Don’t perform actions in the Dashboard while logged in as a [user role](https://docs.stripe.com/get-started/account/teams/roles.md) that lacks permission. |

## Rate limit errors  

|  |
|  |
| **Type**      |                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| **Problem**   | You made too many API calls in too short a time.                                                                                                                                                                                                                                                                                                                                                                                                                          |
| **Solutions** | * If a single API call triggers this error, wait and try it again.
  * To handle rate-limiting automatically, retry the API call after a delay, and increase the delay exponentially if the error continues. See the documentation on [rate limits](https://docs.stripe.com/rate-limits.md) for further advice.
  * If you anticipate a large increase in traffic and want to request an increased rate limit, [contact support](https://support.stripe.com/) in advance. |

## Signature verification errors  

|  |
|  |
| **Type**      |                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| **Problem**   | You’re using *webhook* [signature verification](https://docs.stripe.com/webhooks.md#verify-events) and couldn’t verify that a webhook event is authentic.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| **Solutions** | This error can occur when your integration is working correctly. If you use webhook signature verification and a third party attempts to send you a fake or malicious webhook, then verification fails and this error is the result. Catch it and respond with a `400 Bad Request` status code.

  If you receive this error when you shouldn’t—for instance, with webhooks that you know originate with Stripe—then see the documentation on [checking webhook signatures](https://docs.stripe.com/webhooks.md#verify-events) for further advice. In particular, make sure you’re using the correct endpoint secret. This is different from your API key. |

In the Stripe Java library, each type of error belongs to its own class. Use the documentation for each class
for advice about how to respond.

| Name                  |  | Description                                                                                                                                                                                                                                    |
| --------------------- |  | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Payment error         |  | An error occurred during a payment, involving one of these situations:
  * [Payment blocked for suspected fraud](#payment-blocked)
  * [Payment declined by the issuer](#payment-declined).
  * [Other payment errors](#other-payment-errors). |
| Invalid request error |  |                                                                                                                                                                                                                                                |
| API error             |  | Something went wrong on Stripe’s end. (These are rare.)                                                                                                                                                                                        |
| Idempotency error     |  | You used an [idempotency key](https://docs.stripe.com/api/idempotent_requests.md) for something unexpected, like replaying a request but passing different parameters.                                                                         |

## Payment errors 

Everything in this section also applies to non-card payments. For historical reasons, payment errors have the type . But in fact, they can represent a problem with any payment, regardless of the payment method.

Payment errors—sometimes called “card errors” for historical reasons—cover a wide range of common problems. They come in three categories:

* [Payment blocked for suspected fraud](#payment-blocked)
* [Payment declined by the issuer](#payment-declined)
* [Other payment errors](#other-payment-errors)

To distinguish these categories or get more information about how to respond, consult the [error code](https://docs.stripe.com/error-codes.md), [decline code](https://docs.stripe.com/declines/codes.md), and [charge outcome](https://docs.stripe.com/api/charges/object.md#charge_object-outcome).

(To find the charge outcome from an error object, first get the [Payment Intent that’s involved](https://docs.stripe.com/api/errors.md#errors-payment_intent) and the [latest Charge it created](https://docs.stripe.com/api/payment_intents/object.md#payment_intent_object-latest_charge). See the example below for a demonstration.)

```ruby
require 'stripe'
Stripe.api_key = '<<secret key>>'

def example_function(params)
  begin
    Stripe::PaymentIntent.create(params)
  rescue Stripe::CardError => e
    charge = Stripe::Charge.retrieve(e.error.payment_intent.latest_charge)
    if charge.outcome.type == 'blocked'
      puts 'Payment blocked for suspected fraud.'
    elsif e.code == 'card_declined'
      puts 'Payment declined by the issuer.'
    elsif e.code == 'expired_card'
      puts 'Card expired.'
    else
      puts 'Other card error.'
    end
  end
end
```

```python
import stripe, logging
stripe.api_key = <<secret key>>

def example_function(**kwargs):
  try:
    stripe.PaymentIntent.create(**kwargs)
  except stripe.CardError as e:
    charge = stripe.Charge.retrieve(e.error.payment_intent.latest_charge)
    if charge.outcome.type == 'blocked':
      logging.error("Payment blocked for suspected fraud.")
    elif e.code == 'card_declined':
      logging.error("Payment declined by the issuer.")
    elif e.code == 'expired_card':
      logging.error("Card expired.")
    else:
      logging.error("Other card error.")
```

```php
<?php
  require 'vendor/autoload.php';
  \Stripe\Stripe::setApiKey('<<secret key>>');

  function example_function($args) {
    try {
      $stripe->paymentIntents->create($args);
    } catch(\Stripe\Exception\CardException $e) {
      $charge = $stripe->charge->retrieve($e->getError()->payment_intent->latest_charge);
      if ($charge->outcome->type == 'blocked') {
        error_log('Blocked for suspected fraud.');
      } elseif ($e->getError()->code == 'expired_card') {
        error_log('Card expired.');
      } elseif ($e->getError()->code == 'card_declined') {
        error_log('Declined by the issuer.');
      } else {
        error_log('Other card error.');
      }
    }
  }
```

```java
public static void example_function(PaymentIntentCreateParams params) {
        Stripe.apiKey = "<<secret key>>";
        try {
            PaymentIntent paymentIntent = PaymentIntent.create(params);
        } catch (CardException e) {
            Charge charge = Charge.retrieve(ex.getStripeError()
                 .getPaymentIntent()
                 .getLatestCharge());
            if(charge
                 .getOutcome()
                 .getType().equals("blocked")) {
                System.out.println("Payment blocked for suspected fraud.");
            } else if(e.getCode().equals("card_declined")) {
                System.out.println("Declined by the issuer.");
            } else if(e.getCode().equals("expired_card")) {
                System.out.println("Card expired.");
            } else {
                System.out.println("Other card error.");
            }
        } catch (Exception e) {
            System.out.println("Another problem occurred, maybe unrelated to Stripe.");
        }
    }
```

```javascript
const stripe = require('stripe')('<<secret key>>');

async function exampleFunction(args) {
    try {
      const paymentIntent = await stripe.paymentIntents.create(args);
    } catch (e) {
      console.log(e)
      const charge = await stripe.charges.retrieve(e.payment_intent.latest_charge)
      if (e.type === 'StripeCardError') {
        if (charge.outcome.type === 'blocked') {
          console.log('Payment blocked for suspected fraud.')
        } else if (e.code === 'card_declined') {
          console.log('Payment declined by the issuer.')
        } else if (e.code === 'expired_card') {
          console.log('Card expired.')
        } else {
          console.log('Other card error.')
        }
      }
    }
  }
```

```go
func example_function(params *stripe.PaymentIntentParams) {
  stripe.Key = "<<secret key>>"
  _, err := paymentintent.New(params)
  if err == nil {
    log.Println("No error.")
  } else {
    if stripeErr, ok := err.(*stripe.Error); ok {
      if stripeErr.Type == stripe.ErrorTypeCard {
        charge = Charge.retrieve(stripeErr.PaymentIntent.LatestCharge)
        if charge.Outcome.Type == "blocked" {
          log.Println("Payment blocked for suspected fraud.")
        } else if stripeErr.Code == stripe.ErrorCodeCardDeclined {
          log.Println("Declined by the issuer.")
        } else if stripeErr.Code == stripe.ErrorCodeExpiredCard {
          log.Println("Card expired.")
        } else {
          log.Println("Other card error.")
        }
      }
    }
  }
}
```

```dotnet
using Stripe;
StripeConfiguration.ApiKey = Environment.GetEnvironmentVariable("STRIPE_SECRET_KEY");

static void ExampleFunction(PaymentIntentCreateOptions options)
{
	try
	{
		var service = new PaymentIntentService();
		service.Create(options);
	}
	catch (StripeException e)
	{
		if (e.StripeError.Type == "card_error")
		{
      var chargeService = new ChargeService();
      var options = new ChargeGetOptions();
      var charge = service.Get(e.StripeError.PaymentIntent.LatestChargeId, options);

			if(charge.Outcome.Type == "blocked")
			{
				Console.WriteLine("Payment blocked for suspected fraud.");
			}
			else if (e.StripeError.Code == "card_declined")
			{
				Console.WriteLine("Declined by the issuer.");
			}
			else if (e.StripeError.Code == "expired_card")
			{
				Console.WriteLine("Card expired.");
			}
			else
			{
				Console.WriteLine("Other card error.");
			}
		}
	}
}
```

Users on API version [2022-08-01](https://docs.stripe.com/upgrades.md#2022-08-01) or older:

(To find the charge outcome from an error object, first get the [Payment Intent that’s involved](https://docs.stripe.com/api/errors.md#errors-payment_intent) and the [latest Charge it created](https://docs.stripe.com/api/payment_intents/object.md#payment_intent_object-charges-data). See the example below for a demonstration.)

```ruby
require 'stripe'
Stripe.api_key = '<<secret key>>'

def example_function(params)
  begin
    Stripe::PaymentIntent.create(params)
  rescue Stripe::CardError => e
    if e.error.payment_intent.charges.data[0].outcome.type == 'blocked'
      puts 'Payment blocked for suspected fraud.'
    elsif e.code == 'card_declined'
      puts 'Payment declined by the issuer.'
    elsif e.code == 'expired_card'
      puts 'Card expired.'
    else
      puts 'Other card error.'
    end
  end
end
```

```python
import stripe, logging
stripe.api_key = <<secret key>>

def example_function(**kwargs):
  try:
    stripe.PaymentIntent.create(**kwargs)
  except stripe.error.CardError as e:
    if e.error.payment_intent.charges.data[0].outcome.type == 'blocked':
      logging.error("Payment blocked for suspected fraud.")
    elif e.code == 'card_declined':
      logging.error("Payment declined by the issuer.")
    elif e.code == 'expired_card':
      logging.error("Card expired.")
    else:
      logging.error("Other card error.")
```

```php
<?php
  require 'vendor/autoload.php';
  \Stripe\Stripe::setApiKey('<<secret key>>');

  function example_function($args) {
    try {
      $stripe->paymentIntents->create($args);
    } catch(\Stripe\Exception\CardException $e) {
      if ($e->getError()->payment_intent->charges->data[0]->outcome->type == 'blocked') {
        error_log('Blocked for suspected fraud.');
      } elseif ($e->getError()->code == 'expired_card') {
        error_log('Card expired.');
      } elseif ($e->getError()->code == 'card_declined') {
        error_log('Declined by the issuer.');
      } else {
        error_log('Other card error.');
      }
    }
  }
```

```java
public static void example_function(PaymentIntentCreateParams params) {
        Stripe.apiKey = "<<secret key>>";
        try {
            PaymentIntent paymentIntent = PaymentIntent.create(params);
        } catch (CardException e) {
            if(ex.getStripeError()
                 .getPaymentIntent()
                 .getCharges()
                 .getData()
                 .get(0)
                 .getOutcome()
                 .getType().equals("blocked")) {
                System.out.println("Payment blocked for suspected fraud.");
            } else if(e.getCode().equals("card_declined")) {
                System.out.println("Declined by the issuer.");
            } else if(e.getCode().equals("expired_card")) {
                System.out.println("Card expired.");
            } else {
                System.out.println("Other card error.");
            }
        } catch (Exception e) {
            System.out.println("Another problem occurred, maybe unrelated to Stripe.");
        }
    }
```

```javascript
const stripe = require('stripe')('<<secret key>>');

async function exampleFunction(args) {
    try {
      const paymentIntent = await stripe.paymentIntents.create(args);
    } catch (e) {
      console.log(e)
      if (e.type === 'StripeCardError') {
        if (e.payment_intent.charges.data[0].outcome.type === 'blocked') {
          console.log('Payment blocked for suspected fraud.')
        } else if (e.code === 'card_declined') {
          console.log('Payment declined by the issuer.')
        } else if (e.code === 'expired_card') {
          console.log('Card expired.')
        } else {
          console.log('Other card error.')
        }
      }
    }
  }
```

```go
func example_function(params *stripe.PaymentIntentParams) {
  stripe.Key = "<<secret key>>"
  _, err := paymentintent.New(params)
  if err == nil {
    log.Println("No error.")
  } else {
    if stripeErr, ok := err.(*stripe.Error); ok {
      if stripeErr.Type == stripe.ErrorTypeCard {
        if stripeErr.PaymentIntent.Charges.Data[0].Outcome.Type == "blocked" {
          log.Println("Payment blocked for suspected fraud.")
        } else if stripeErr.Code == stripe.ErrorCodeCardDeclined {
          log.Println("Declined by the issuer.")
        } else if stripeErr.Code == stripe.ErrorCodeExpiredCard {
          log.Println("Card expired.")
        } else {
          log.Println("Other card error.")
        }
      }
    }
  }
}
```

```dotnet
using Stripe;
StripeConfiguration.ApiKey = Environment.GetEnvironmentVariable("STRIPE_SECRET_KEY");

static void ExampleFunction(PaymentIntentCreateOptions options)
{
	try
	{
		var service = new PaymentIntentService();
		service.Create(options);
	}
	catch (StripeException e)
	{
		if (e.StripeError.Type == "card_error")
		{
			if(e.StripeError.PaymentIntent.Charges.Data[0].Outcome.Type == "blocked")
			{
				Console.WriteLine("Payment blocked for suspected fraud.");
			}
			else if (e.StripeError.Code == "card_declined")
			{
				Console.WriteLine("Declined by the issuer.");
			}
			else if (e.StripeError.Code == "expired_card")
			{
				Console.WriteLine("Card expired.");
			}
			else
			{
				Console.WriteLine("Other card error.");
			}
		}
	}
}
```

You can trigger some common kinds of payment error with test cards. Consult these lists for options:

* [Simulating payments blocked for fraud risk](https://docs.stripe.com/testing.md#fraud-prevention)
* [Simulating declined payments and other card errors](https://docs.stripe.com/testing.md#declined-payments)

The test code below demonstrates a few possibilities.

```ruby
example_function(
  currency: 'USD',
  amount: 2000,
  confirm: true,
  payment_method: 'pm_card_radarBlock',
)
```

```
Payment blocked for suspected fraud.
```

```python
example_function(
  currency='USD',
  amount=2000,
  confirm=True,
  payment_method='pm_card_radarBlock',
)
```

```
Payment blocked for suspected fraud.
```

```php
example_function([
  'currency' => 'USD',
  'amount' => 2000,
  'confirm' => True,
  'payment_method' => 'pm_card_radarBlock',
]);
```

```
Payment blocked for suspected fraud.
```

```java
PaymentIntentCreateParams params = PaymentIntentCreateParams.builder()
    .setCurrency("USD")
    .setAmount(2000L)
    .setConfirm(true)
    .setPaymentMethod("pm_card_radarBlock")
    .build();
example_function(params);
```

```
Payment blocked for suspected fraud.
```

```javascript
exampleFunction({
  currency: 'USD',
  amount: 2000,
  confirm: true,
  payment_method: 'pm_card_radarBlock',
})
```

```
Payment blocked for suspected fraud.
```

```go
params := &stripe.PaymentIntentParams{
  Amount: stripe.Int64(2000),
  Currency: stripe.String(string(stripe.CurrencyUSD)),
  Confirm: stripe.Bool(true),
  PaymentMethod: stripe.String("pm_card_radarBlock"),
}
example_function(params)
```

```
Payment blocked for suspected fraud.
```

```dotnet
var options = new PaymentIntentCreateOptions
{
  Amount = 2000,
  Currency = "USD",
  Confirm = true,
  PaymentMethod = "pm_card_radarBlock"
};
ExampleFunction(options);

```

```
Payment blocked for suspected fraud.
```

```ruby
example_function(
  currency: 'USD',
  amount: 2000,
  confirm: true,
  payment_method: 'pm_card_visa_chargeDeclined',
)
```

```
Payment declined by the issuer.
```

```python
example_function(
  currency='USD',
  amount=2000,
  confirm=True,
  payment_method: 'pm_card_visa_chargeDeclined',
)
```

```
Payment declined by the issuer.
```

```php
example_function([
  'currency' => 'USD',
  'amount' => 2000,
  'confirm' => True,
  'payment_method' => 'pm_card_visa_chargeDeclined',
]);
```

```
Payment declined by the issuer
```

```java
PaymentIntentCreateParams params = PaymentIntentCreateParams.builder()
    .setCurrency("USD")
    .setAmount(2000L)
    .setConfirm(true)
    .setPaymentMethod("pm_card_visa_chargeDeclined")
    .build();
example_function(params);
```

```
Payment declined by the issuer.
```

```javascript
exampleFunction({
  currency: 'USD',
  amount: 2000,
  confirm: true,
  payment_method: 'pm_card_visa_chargeDeclined',
})
```

```
Payment declined by the issuer.
```

```go
params := &stripe.PaymentIntentParams{
  Amount: stripe.Int64(2000),
  Currency: stripe.String(string(stripe.CurrencyUSD)),
  Confirm: stripe.Bool(true),
  PaymentMethod: stripe.String("pm_card_visa_chargeDeclined"),
}
example_function(params)
```

```
Payment declined by the issuer.
```

```dotnet
var options = new PaymentIntentCreateOptions
{
  Amount = 2000,
  Currency = "USD",
  Confirm = true,
  PaymentMethod = "pm_card_visa_chargeDeclined",
};
ExampleFunction(options);

```

```
Payment declined by the issuer.
```

```ruby
example_function(
  currency: 'USD',
  amount: 2000,
  confirm: true,
  payment_method: 'pm_card_chargeDeclinedExpiredCard',
)
```

```
Card expired.
```

```python
example_function(
  currency='USD',
  amount=2000,
  confirm=True,
  payment_method: 'pm_card_chargeDeclinedExpiredCard',
)
```

```
Card expired.
```

```php
example_function([
  'currency' => 'USD',
  'amount' => 2000,
  'confirm' => True,
  'payment_method' => 'pm_card_chargeDeclinedExpiredCard',
]);
```

```
Card expired.
```

```java
PaymentIntentCreateParams params = PaymentIntentCreateParams.builder()
    .setCurrency("USD")
    .setAmount(2000L)
    .setConfirm(true)
    .setPaymentMethod("pm_card_chargeDeclinedExpiredCard")
    .build();
example_function(params);
```

```
Card expired.
```

```javascript
exampleFunction({
  currency: 'USD',
  amount: 2000,
  confirm: true,
  payment_method: 'pm_card_chargeDeclinedExpiredCard',
})
```

```
Card expired.
```

```go
params := &stripe.PaymentIntentParams{
  Amount: stripe.Int64(2000),
  Currency: stripe.String(string(stripe.CurrencyUSD)),
  Confirm: stripe.Bool(true),
  PaymentMethod: stripe.String("pm_card_chargeDeclinedExpiredCard"),
}
example_function(params)
```

```
Card expired.
```

```dotnet
var options = new PaymentIntentCreateOptions
{
  Amount = 2000,
  Currency = "USD",
  Confirm = true,
  PaymentMethod = "pm_card_chargeDeclinedExpiredCard",
};
ExampleFunction(options);

```

```
Card expired.
```

```ruby
example_function(
  currency: 'USD',
  amount: 2000,
  confirm: true,
  payment_method: 'pm_card_chargeDeclinedProcessingError',
)
```

```
Other payment error.
```

```python
example_function(
  currency='USD',
  amount=2000,
  confirm=True,
  payment_method: 'pm_card_chargeDeclinedProcessingError',
)
```

```
Other payment error.
```

```php
example_function([
  'currency' => 'USD',
  'amount' => 2000,
  'confirm' => True,
  'payment_method' => 'pm_card_chargeDeclinedProcessingError',
]);
```

```
Other payment error.
```

```java
PaymentIntentCreateParams params = PaymentIntentCreateParams.builder()
    .setCurrency("USD")
    .setAmount(2000L)
    .setConfirm(true)
    .setPaymentMethod("pm_card_chargeDeclinedProcessingError")
    .build();
example_function(params);
```

```
Other payment error.
```

```javascript
exampleFunction({
  currency: 'USD',
  amount: 2000,
  confirm: true,
  payment_method: 'pm_card_chargeDeclinedProcessingError',
})
```

```
Other payment error.
```

```go
params := &stripe.PaymentIntentParams{
  Amount: stripe.Int64(2000),
  Currency: stripe.String(string(stripe.CurrencyUSD)),
  Confirm: stripe.Bool(true),
  PaymentMethod: stripe.String("pm_card_chargeDeclinedProcessingError"),
}
example_function(params)
```

```
Other card error.
```

```dotnet
var options = new PaymentIntentCreateOptions
{
  Amount = 2000,
  Currency = "USD",
  Confirm = true,
  PaymentMethod = "pm_card_chargeDeclinedProcessingError",
};
ExampleFunction(options);

```

```
Other payment error.
```

### Payment blocked for suspected fraud  

|  |
|  |
| **Type**      |                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| **Codes**     |                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| **Codes**     |                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| **Problem**   | Stripe’s fraud prevention system, *Radar*, blocked the payment                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| **Solutions** | This error can occur when your integration is working correctly. Catch it and prompt the customer for a different payment method.

  To block fewer legitimate payments, try these:

  * [Optimize your Radar integration](https://docs.stripe.com/radar/integration.md) to collect more detailed information.
  * Use [Payment Links](https://docs.stripe.com/payment-links.md), [Checkout](https://docs.stripe.com/payments/checkout.md), or [Stripe Elements](https://docs.stripe.com/payments/elements.md) for prebuilt optimized form elements.

  *Radar for Fraud Teams* customers have these additional options:

  * To exempt a specific payment, add it to your allowlist.
  * To change your risk tolerance, adjust your [risk settings](https://docs.stripe.com/radar/risk-settings.md).
  * To change the criteria for blocking a payment, use [custom rules](https://docs.stripe.com/radar/rules.md).

  You can test your integration’s settings with [test cards that simulate fraud](https://docs.stripe.com/radar/testing.md). If you have custom Radar rules, follow the testing advice in the [Radar documentation](https://docs.stripe.com/radar/testing.md). |

### Payment declined by the issuer  

|  |
|  |
| **Type**      |                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| **Codes**     |                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| **Problem**   | The card issuer declined the payment.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| **Solutions** | This error can occur when your integration is working correctly. It reflects an action by the issuer, and that action might be legitimate. Use the decline code to determine what next steps are appropriate. See the [documentation on decline codes](https://docs.stripe.com/declines/codes.md) for appropriate responses to each code.

  You can also:

  * [Follow recommendations to reduce issuer declines](https://docs.stripe.com/declines/card.md#reducing-bank-declines).
  * Use [Payment Links](https://docs.stripe.com/payment-links.md), [Checkout](https://docs.stripe.com/payments/checkout.md), or [Stripe Elements](https://docs.stripe.com/payments/elements.md) for prebuilt form elements that implement those recommendations.

  Test how your integration handles declines with [test cards that simulate successful and declined payments](https://docs.stripe.com/radar/testing.md). |

### Other payment errors  

|  |
|  |
| **Type**      |                                                                                                                                                                                                                                                          |
| **Problem**   | Another payment error occurred.                                                                                                                                                                                                                          |
| **Solutions** | This error can occur when your integration is working correctly. Use the error code to determine what next steps are appropriate. See the [documentation on error codes](https://docs.stripe.com/error-codes.md) for appropriate responses to each code. |

## Invalid request errors  

|  |
|  |
| **Type**      |                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| **Problem**   | You made an API call with the wrong parameters, in the wrong state, or in an invalid way.                                                                                                                                                                                                                                                                                                                                                         |
| **Solutions** | In most cases, the problem is with the request itself. Either its parameters are invalid or it can’t be carried out in your integration’s current state.
  * Consult the [error code documentation](https://docs.stripe.com/error-codes.md) for details on the problem.
  * For convenience, you can follow the link at  for documentation about the error code.
  * If the error involves a specific parameter, use 
    to determine which one. |

## Connection errors  

|  |
|  |
| **Type**      |                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| **Problem**   | There was a network problem between your server and Stripe.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| **Solutions** | Treat the result of the API call as indeterminate. That is, don’t assume that it succeeded or that it failed.

  To find out if it succeeded, you can:

  * Retrieve the relevant object from Stripe and check its status.
  * Listen for webhook notification that the operation succeeded or failed.

  To help recover from connection errors, you can:

  * When creating or updating an object, use an [idempotency key](https://docs.stripe.com/api/idempotent_requests.md). Then, if a connection error occurs, you can safely repeat the request without risk of creating a second object or performing the update twice. Repeat the request with the same idempotency key until you receive a clear success or failure. For advanced advice on this strategy, see [Low-level error handling](https://docs.stripe.com/error-low-level.md#idempotency).
  * Turn on [automatic retries.](#automatic-retries) Then, Stripe generates idempotency keys for you, and repeats requests for you when it is safe to do so.

  This error can mask others. It’s possible that when the connection error resolves, some other error becomes apparent. Check for errors in all of these solutions just as you would in the original request. |

## API errors  

|  |
|  |
| **Type**      |                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| **Problem**   | Something went wrong on Stripe’s end. (These are rare.)                                                                                                                                                                                                                                                                                                                                                                                                     |
| **Solutions** | Treat the result of the API call as indeterminate. That is, don’t assume that it succeeded or that it failed.

  Rely on *webhooks* for information about the outcome. Whenever possible, Stripe fires webhooks for any new objects we create as we solve a problem.

  To set your integration up for maximum robustness in unusual situations, see [this advanced discussion of server errors.](https://docs.stripe.com/error-low-level.md#server-errors) |

## Authentication errors  

|  |
|  |
| **Type**      |                                                                                                                                                                                   |
| **Problem**   | Stripe can’t authenticate you with the information provided.                                                                                                                      |
| **Solutions** | * Use the correct [API key](https://docs.stripe.com/keys.md).
  * Make sure you aren’t using a key that you [“rotated” or revoked](https://docs.stripe.com/keys.md#rolling-keys). |

## Idempotency errors  

|  |
|  |
| **Type**      |                                                                                                                                                                        |
| **Problem**   | You used an [idempotency key](https://docs.stripe.com/api/idempotent_requests.md) for something unexpected, like replaying a request but passing different parameters. |
| **Solutions** | * After you use an idempotency key, only reuse it for identical API calls.
  * Use idempotency keys under the limit of 255 characters.                                 |

## Permission errors  

|  |
|  |
| **Type**      |                                                                                                                                                                                                                                                                                                                          |
| **Problem**   | The API key used for this request doesn’t have the necessary permissions.                                                                                                                                                                                                                                                |
| **Solutions** | * Make sure you aren’t using a [restricted API key](https://docs.stripe.com/keys-best-practices.md#limit-access) for a service it doesn’t have access to.
  * Don’t perform actions in the Dashboard while logged in as a [user role](https://docs.stripe.com/get-started/account/teams/roles.md) that lacks permission. |

## Rate limit errors  

|  |
|  |
| **Type**      |                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| **Problem**   | You made too many API calls in too short a time.                                                                                                                                                                                                                                                                                                                                                                                                                          |
| **Solutions** | * If a single API call triggers this error, wait and try it again.
  * To handle rate-limiting automatically, retry the API call after a delay, and increase the delay exponentially if the error continues. See the documentation on [rate limits](https://docs.stripe.com/rate-limits.md) for further advice.
  * If you anticipate a large increase in traffic and want to request an increased rate limit, [contact support](https://support.stripe.com/) in advance. |

## Signature verification errors  

|  |
|  |
| **Type**      |                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| **Problem**   | You’re using *webhook* [signature verification](https://docs.stripe.com/webhooks.md#verify-events) and couldn’t verify that a webhook event is authentic.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| **Solutions** | This error can occur when your integration is working correctly. If you use webhook signature verification and a third party attempts to send you a fake or malicious webhook, then verification fails and this error is the result. Catch it and respond with a `400 Bad Request` status code.

  If you receive this error when you shouldn’t—for instance, with webhooks that you know originate with Stripe—then see the documentation on [checking webhook signatures](https://docs.stripe.com/webhooks.md#verify-events) for further advice. In particular, make sure you’re using the correct endpoint secret. This is different from your API key. |

In the Stripe Node.js library, each error object has a `type` attribute. Use the documentation for each type
for advice about how to respond.

| Name                  |  | Description                                                                                                                                                                                                                                    |
| --------------------- |  | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Payment error         |  | An error occurred during a payment, involving one of these situations:
  * [Payment blocked for suspected fraud](#payment-blocked)
  * [Payment declined by the issuer](#payment-declined).
  * [Other payment errors](#other-payment-errors). |
| Invalid request error |  |                                                                                                                                                                                                                                                |
| API error             |  | Something went wrong on Stripe’s end. (These are rare.)                                                                                                                                                                                        |
| Idempotency error     |  | You used an [idempotency key](https://docs.stripe.com/api/idempotent_requests.md) for something unexpected, like replaying a request but passing different parameters.                                                                         |

## Payment errors 

Everything in this section also applies to non-card payments. For historical reasons, payment errors have the type . But in fact, they can represent a problem with any payment, regardless of the payment method.

Payment errors—sometimes called “card errors” for historical reasons—cover a wide range of common problems. They come in three categories:

* [Payment blocked for suspected fraud](#payment-blocked)
* [Payment declined by the issuer](#payment-declined)
* [Other payment errors](#other-payment-errors)

To distinguish these categories or get more information about how to respond, consult the [error code](https://docs.stripe.com/error-codes.md), [decline code](https://docs.stripe.com/declines/codes.md), and [charge outcome](https://docs.stripe.com/api/charges/object.md#charge_object-outcome).

(To find the charge outcome from an error object, first get the [Payment Intent that’s involved](https://docs.stripe.com/api/errors.md#errors-payment_intent) and the [latest Charge it created](https://docs.stripe.com/api/payment_intents/object.md#payment_intent_object-latest_charge). See the example below for a demonstration.)

```ruby
require 'stripe'
Stripe.api_key = '<<secret key>>'

def example_function(params)
  begin
    Stripe::PaymentIntent.create(params)
  rescue Stripe::CardError => e
    charge = Stripe::Charge.retrieve(e.error.payment_intent.latest_charge)
    if charge.outcome.type == 'blocked'
      puts 'Payment blocked for suspected fraud.'
    elsif e.code == 'card_declined'
      puts 'Payment declined by the issuer.'
    elsif e.code == 'expired_card'
      puts 'Card expired.'
    else
      puts 'Other card error.'
    end
  end
end
```

```python
import stripe, logging
stripe.api_key = <<secret key>>

def example_function(**kwargs):
  try:
    stripe.PaymentIntent.create(**kwargs)
  except stripe.CardError as e:
    charge = stripe.Charge.retrieve(e.error.payment_intent.latest_charge)
    if charge.outcome.type == 'blocked':
      logging.error("Payment blocked for suspected fraud.")
    elif e.code == 'card_declined':
      logging.error("Payment declined by the issuer.")
    elif e.code == 'expired_card':
      logging.error("Card expired.")
    else:
      logging.error("Other card error.")
```

```php
<?php
  require 'vendor/autoload.php';
  \Stripe\Stripe::setApiKey('<<secret key>>');

  function example_function($args) {
    try {
      $stripe->paymentIntents->create($args);
    } catch(\Stripe\Exception\CardException $e) {
      $charge = $stripe->charge->retrieve($e->getError()->payment_intent->latest_charge);
      if ($charge->outcome->type == 'blocked') {
        error_log('Blocked for suspected fraud.');
      } elseif ($e->getError()->code == 'expired_card') {
        error_log('Card expired.');
      } elseif ($e->getError()->code == 'card_declined') {
        error_log('Declined by the issuer.');
      } else {
        error_log('Other card error.');
      }
    }
  }
```

```java
public static void example_function(PaymentIntentCreateParams params) {
        Stripe.apiKey = "<<secret key>>";
        try {
            PaymentIntent paymentIntent = PaymentIntent.create(params);
        } catch (CardException e) {
            Charge charge = Charge.retrieve(ex.getStripeError()
                 .getPaymentIntent()
                 .getLatestCharge());
            if(charge
                 .getOutcome()
                 .getType().equals("blocked")) {
                System.out.println("Payment blocked for suspected fraud.");
            } else if(e.getCode().equals("card_declined")) {
                System.out.println("Declined by the issuer.");
            } else if(e.getCode().equals("expired_card")) {
                System.out.println("Card expired.");
            } else {
                System.out.println("Other card error.");
            }
        } catch (Exception e) {
            System.out.println("Another problem occurred, maybe unrelated to Stripe.");
        }
    }
```

```javascript
const stripe = require('stripe')('<<secret key>>');

async function exampleFunction(args) {
    try {
      const paymentIntent = await stripe.paymentIntents.create(args);
    } catch (e) {
      console.log(e)
      const charge = await stripe.charges.retrieve(e.payment_intent.latest_charge)
      if (e.type === 'StripeCardError') {
        if (charge.outcome.type === 'blocked') {
          console.log('Payment blocked for suspected fraud.')
        } else if (e.code === 'card_declined') {
          console.log('Payment declined by the issuer.')
        } else if (e.code === 'expired_card') {
          console.log('Card expired.')
        } else {
          console.log('Other card error.')
        }
      }
    }
  }
```

```go
func example_function(params *stripe.PaymentIntentParams) {
  stripe.Key = "<<secret key>>"
  _, err := paymentintent.New(params)
  if err == nil {
    log.Println("No error.")
  } else {
    if stripeErr, ok := err.(*stripe.Error); ok {
      if stripeErr.Type == stripe.ErrorTypeCard {
        charge = Charge.retrieve(stripeErr.PaymentIntent.LatestCharge)
        if charge.Outcome.Type == "blocked" {
          log.Println("Payment blocked for suspected fraud.")
        } else if stripeErr.Code == stripe.ErrorCodeCardDeclined {
          log.Println("Declined by the issuer.")
        } else if stripeErr.Code == stripe.ErrorCodeExpiredCard {
          log.Println("Card expired.")
        } else {
          log.Println("Other card error.")
        }
      }
    }
  }
}
```

```dotnet
using Stripe;
StripeConfiguration.ApiKey = Environment.GetEnvironmentVariable("STRIPE_SECRET_KEY");

static void ExampleFunction(PaymentIntentCreateOptions options)
{
	try
	{
		var service = new PaymentIntentService();
		service.Create(options);
	}
	catch (StripeException e)
	{
		if (e.StripeError.Type == "card_error")
		{
      var chargeService = new ChargeService();
      var options = new ChargeGetOptions();
      var charge = service.Get(e.StripeError.PaymentIntent.LatestChargeId, options);

			if(charge.Outcome.Type == "blocked")
			{
				Console.WriteLine("Payment blocked for suspected fraud.");
			}
			else if (e.StripeError.Code == "card_declined")
			{
				Console.WriteLine("Declined by the issuer.");
			}
			else if (e.StripeError.Code == "expired_card")
			{
				Console.WriteLine("Card expired.");
			}
			else
			{
				Console.WriteLine("Other card error.");
			}
		}
	}
}
```

Users on API version [2022-08-01](https://docs.stripe.com/upgrades.md#2022-08-01) or older:

(To find the charge outcome from an error object, first get the [Payment Intent that’s involved](https://docs.stripe.com/api/errors.md#errors-payment_intent) and the [latest Charge it created](https://docs.stripe.com/api/payment_intents/object.md#payment_intent_object-charges-data). See the example below for a demonstration.)

```ruby
require 'stripe'
Stripe.api_key = '<<secret key>>'

def example_function(params)
  begin
    Stripe::PaymentIntent.create(params)
  rescue Stripe::CardError => e
    if e.error.payment_intent.charges.data[0].outcome.type == 'blocked'
      puts 'Payment blocked for suspected fraud.'
    elsif e.code == 'card_declined'
      puts 'Payment declined by the issuer.'
    elsif e.code == 'expired_card'
      puts 'Card expired.'
    else
      puts 'Other card error.'
    end
  end
end
```

```python
import stripe, logging
stripe.api_key = <<secret key>>

def example_function(**kwargs):
  try:
    stripe.PaymentIntent.create(**kwargs)
  except stripe.error.CardError as e:
    if e.error.payment_intent.charges.data[0].outcome.type == 'blocked':
      logging.error("Payment blocked for suspected fraud.")
    elif e.code == 'card_declined':
      logging.error("Payment declined by the issuer.")
    elif e.code == 'expired_card':
      logging.error("Card expired.")
    else:
      logging.error("Other card error.")
```

```php
<?php
  require 'vendor/autoload.php';
  \Stripe\Stripe::setApiKey('<<secret key>>');

  function example_function($args) {
    try {
      $stripe->paymentIntents->create($args);
    } catch(\Stripe\Exception\CardException $e) {
      if ($e->getError()->payment_intent->charges->data[0]->outcome->type == 'blocked') {
        error_log('Blocked for suspected fraud.');
      } elseif ($e->getError()->code == 'expired_card') {
        error_log('Card expired.');
      } elseif ($e->getError()->code == 'card_declined') {
        error_log('Declined by the issuer.');
      } else {
        error_log('Other card error.');
      }
    }
  }
```

```java
public static void example_function(PaymentIntentCreateParams params) {
        Stripe.apiKey = "<<secret key>>";
        try {
            PaymentIntent paymentIntent = PaymentIntent.create(params);
        } catch (CardException e) {
            if(ex.getStripeError()
                 .getPaymentIntent()
                 .getCharges()
                 .getData()
                 .get(0)
                 .getOutcome()
                 .getType().equals("blocked")) {
                System.out.println("Payment blocked for suspected fraud.");
            } else if(e.getCode().equals("card_declined")) {
                System.out.println("Declined by the issuer.");
            } else if(e.getCode().equals("expired_card")) {
                System.out.println("Card expired.");
            } else {
                System.out.println("Other card error.");
            }
        } catch (Exception e) {
            System.out.println("Another problem occurred, maybe unrelated to Stripe.");
        }
    }
```

```javascript
const stripe = require('stripe')('<<secret key>>');

async function exampleFunction(args) {
    try {
      const paymentIntent = await stripe.paymentIntents.create(args);
    } catch (e) {
      console.log(e)
      if (e.type === 'StripeCardError') {
        if (e.payment_intent.charges.data[0].outcome.type === 'blocked') {
          console.log('Payment blocked for suspected fraud.')
        } else if (e.code === 'card_declined') {
          console.log('Payment declined by the issuer.')
        } else if (e.code === 'expired_card') {
          console.log('Card expired.')
        } else {
          console.log('Other card error.')
        }
      }
    }
  }
```

```go
func example_function(params *stripe.PaymentIntentParams) {
  stripe.Key = "<<secret key>>"
  _, err := paymentintent.New(params)
  if err == nil {
    log.Println("No error.")
  } else {
    if stripeErr, ok := err.(*stripe.Error); ok {
      if stripeErr.Type == stripe.ErrorTypeCard {
        if stripeErr.PaymentIntent.Charges.Data[0].Outcome.Type == "blocked" {
          log.Println("Payment blocked for suspected fraud.")
        } else if stripeErr.Code == stripe.ErrorCodeCardDeclined {
          log.Println("Declined by the issuer.")
        } else if stripeErr.Code == stripe.ErrorCodeExpiredCard {
          log.Println("Card expired.")
        } else {
          log.Println("Other card error.")
        }
      }
    }
  }
}
```

```dotnet
using Stripe;
StripeConfiguration.ApiKey = Environment.GetEnvironmentVariable("STRIPE_SECRET_KEY");

static void ExampleFunction(PaymentIntentCreateOptions options)
{
	try
	{
		var service = new PaymentIntentService();
		service.Create(options);
	}
	catch (StripeException e)
	{
		if (e.StripeError.Type == "card_error")
		{
			if(e.StripeError.PaymentIntent.Charges.Data[0].Outcome.Type == "blocked")
			{
				Console.WriteLine("Payment blocked for suspected fraud.");
			}
			else if (e.StripeError.Code == "card_declined")
			{
				Console.WriteLine("Declined by the issuer.");
			}
			else if (e.StripeError.Code == "expired_card")
			{
				Console.WriteLine("Card expired.");
			}
			else
			{
				Console.WriteLine("Other card error.");
			}
		}
	}
}
```

You can trigger some common kinds of payment error with test cards. Consult these lists for options:

* [Simulating payments blocked for fraud risk](https://docs.stripe.com/testing.md#fraud-prevention)
* [Simulating declined payments and other card errors](https://docs.stripe.com/testing.md#declined-payments)

The test code below demonstrates a few possibilities.

```ruby
example_function(
  currency: 'USD',
  amount: 2000,
  confirm: true,
  payment_method: 'pm_card_radarBlock',
)
```

```
Payment blocked for suspected fraud.
```

```python
example_function(
  currency='USD',
  amount=2000,
  confirm=True,
  payment_method='pm_card_radarBlock',
)
```

```
Payment blocked for suspected fraud.
```

```php
example_function([
  'currency' => 'USD',
  'amount' => 2000,
  'confirm' => True,
  'payment_method' => 'pm_card_radarBlock',
]);
```

```
Payment blocked for suspected fraud.
```

```java
PaymentIntentCreateParams params = PaymentIntentCreateParams.builder()
    .setCurrency("USD")
    .setAmount(2000L)
    .setConfirm(true)
    .setPaymentMethod("pm_card_radarBlock")
    .build();
example_function(params);
```

```
Payment blocked for suspected fraud.
```

```javascript
exampleFunction({
  currency: 'USD',
  amount: 2000,
  confirm: true,
  payment_method: 'pm_card_radarBlock',
})
```

```
Payment blocked for suspected fraud.
```

```go
params := &stripe.PaymentIntentParams{
  Amount: stripe.Int64(2000),
  Currency: stripe.String(string(stripe.CurrencyUSD)),
  Confirm: stripe.Bool(true),
  PaymentMethod: stripe.String("pm_card_radarBlock"),
}
example_function(params)
```

```
Payment blocked for suspected fraud.
```

```dotnet
var options = new PaymentIntentCreateOptions
{
  Amount = 2000,
  Currency = "USD",
  Confirm = true,
  PaymentMethod = "pm_card_radarBlock"
};
ExampleFunction(options);

```

```
Payment blocked for suspected fraud.
```

```ruby
example_function(
  currency: 'USD',
  amount: 2000,
  confirm: true,
  payment_method: 'pm_card_visa_chargeDeclined',
)
```

```
Payment declined by the issuer.
```

```python
example_function(
  currency='USD',
  amount=2000,
  confirm=True,
  payment_method: 'pm_card_visa_chargeDeclined',
)
```

```
Payment declined by the issuer.
```

```php
example_function([
  'currency' => 'USD',
  'amount' => 2000,
  'confirm' => True,
  'payment_method' => 'pm_card_visa_chargeDeclined',
]);
```

```
Payment declined by the issuer
```

```java
PaymentIntentCreateParams params = PaymentIntentCreateParams.builder()
    .setCurrency("USD")
    .setAmount(2000L)
    .setConfirm(true)
    .setPaymentMethod("pm_card_visa_chargeDeclined")
    .build();
example_function(params);
```

```
Payment declined by the issuer.
```

```javascript
exampleFunction({
  currency: 'USD',
  amount: 2000,
  confirm: true,
  payment_method: 'pm_card_visa_chargeDeclined',
})
```

```
Payment declined by the issuer.
```

```go
params := &stripe.PaymentIntentParams{
  Amount: stripe.Int64(2000),
  Currency: stripe.String(string(stripe.CurrencyUSD)),
  Confirm: stripe.Bool(true),
  PaymentMethod: stripe.String("pm_card_visa_chargeDeclined"),
}
example_function(params)
```

```
Payment declined by the issuer.
```

```dotnet
var options = new PaymentIntentCreateOptions
{
  Amount = 2000,
  Currency = "USD",
  Confirm = true,
  PaymentMethod = "pm_card_visa_chargeDeclined",
};
ExampleFunction(options);

```

```
Payment declined by the issuer.
```

```ruby
example_function(
  currency: 'USD',
  amount: 2000,
  confirm: true,
  payment_method: 'pm_card_chargeDeclinedExpiredCard',
)
```

```
Card expired.
```

```python
example_function(
  currency='USD',
  amount=2000,
  confirm=True,
  payment_method: 'pm_card_chargeDeclinedExpiredCard',
)
```

```
Card expired.
```

```php
example_function([
  'currency' => 'USD',
  'amount' => 2000,
  'confirm' => True,
  'payment_method' => 'pm_card_chargeDeclinedExpiredCard',
]);
```

```
Card expired.
```

```java
PaymentIntentCreateParams params = PaymentIntentCreateParams.builder()
    .setCurrency("USD")
    .setAmount(2000L)
    .setConfirm(true)
    .setPaymentMethod("pm_card_chargeDeclinedExpiredCard")
    .build();
example_function(params);
```

```
Card expired.
```

```javascript
exampleFunction({
  currency: 'USD',
  amount: 2000,
  confirm: true,
  payment_method: 'pm_card_chargeDeclinedExpiredCard',
})
```

```
Card expired.
```

```go
params := &stripe.PaymentIntentParams{
  Amount: stripe.Int64(2000),
  Currency: stripe.String(string(stripe.CurrencyUSD)),
  Confirm: stripe.Bool(true),
  PaymentMethod: stripe.String("pm_card_chargeDeclinedExpiredCard"),
}
example_function(params)
```

```
Card expired.
```

```dotnet
var options = new PaymentIntentCreateOptions
{
  Amount = 2000,
  Currency = "USD",
  Confirm = true,
  PaymentMethod = "pm_card_chargeDeclinedExpiredCard",
};
ExampleFunction(options);

```

```
Card expired.
```

```ruby
example_function(
  currency: 'USD',
  amount: 2000,
  confirm: true,
  payment_method: 'pm_card_chargeDeclinedProcessingError',
)
```

```
Other payment error.
```

```python
example_function(
  currency='USD',
  amount=2000,
  confirm=True,
  payment_method: 'pm_card_chargeDeclinedProcessingError',
)
```

```
Other payment error.
```

```php
example_function([
  'currency' => 'USD',
  'amount' => 2000,
  'confirm' => True,
  'payment_method' => 'pm_card_chargeDeclinedProcessingError',
]);
```

```
Other payment error.
```

```java
PaymentIntentCreateParams params = PaymentIntentCreateParams.builder()
    .setCurrency("USD")
    .setAmount(2000L)
    .setConfirm(true)
    .setPaymentMethod("pm_card_chargeDeclinedProcessingError")
    .build();
example_function(params);
```

```
Other payment error.
```

```javascript
exampleFunction({
  currency: 'USD',
  amount: 2000,
  confirm: true,
  payment_method: 'pm_card_chargeDeclinedProcessingError',
})
```

```
Other payment error.
```

```go
params := &stripe.PaymentIntentParams{
  Amount: stripe.Int64(2000),
  Currency: stripe.String(string(stripe.CurrencyUSD)),
  Confirm: stripe.Bool(true),
  PaymentMethod: stripe.String("pm_card_chargeDeclinedProcessingError"),
}
example_function(params)
```

```
Other card error.
```

```dotnet
var options = new PaymentIntentCreateOptions
{
  Amount = 2000,
  Currency = "USD",
  Confirm = true,
  PaymentMethod = "pm_card_chargeDeclinedProcessingError",
};
ExampleFunction(options);

```

```
Other payment error.
```

### Payment blocked for suspected fraud  

|  |
|  |
| **Type**      |                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| **Codes**     |                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| **Codes**     |                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| **Problem**   | Stripe’s fraud prevention system, *Radar*, blocked the payment                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| **Solutions** | This error can occur when your integration is working correctly. Catch it and prompt the customer for a different payment method.

  To block fewer legitimate payments, try these:

  * [Optimize your Radar integration](https://docs.stripe.com/radar/integration.md) to collect more detailed information.
  * Use [Payment Links](https://docs.stripe.com/payment-links.md), [Checkout](https://docs.stripe.com/payments/checkout.md), or [Stripe Elements](https://docs.stripe.com/payments/elements.md) for prebuilt optimized form elements.

  *Radar for Fraud Teams* customers have these additional options:

  * To exempt a specific payment, add it to your allowlist.
  * To change your risk tolerance, adjust your [risk settings](https://docs.stripe.com/radar/risk-settings.md).
  * To change the criteria for blocking a payment, use [custom rules](https://docs.stripe.com/radar/rules.md).

  You can test your integration’s settings with [test cards that simulate fraud](https://docs.stripe.com/radar/testing.md). If you have custom Radar rules, follow the testing advice in the [Radar documentation](https://docs.stripe.com/radar/testing.md). |

### Payment declined by the issuer  

|  |
|  |
| **Type**      |                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| **Codes**     |                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| **Problem**   | The card issuer declined the payment.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| **Solutions** | This error can occur when your integration is working correctly. It reflects an action by the issuer, and that action might be legitimate. Use the decline code to determine what next steps are appropriate. See the [documentation on decline codes](https://docs.stripe.com/declines/codes.md) for appropriate responses to each code.

  You can also:

  * [Follow recommendations to reduce issuer declines](https://docs.stripe.com/declines/card.md#reducing-bank-declines).
  * Use [Payment Links](https://docs.stripe.com/payment-links.md), [Checkout](https://docs.stripe.com/payments/checkout.md), or [Stripe Elements](https://docs.stripe.com/payments/elements.md) for prebuilt form elements that implement those recommendations.

  Test how your integration handles declines with [test cards that simulate successful and declined payments](https://docs.stripe.com/radar/testing.md). |

### Other payment errors  

|  |
|  |
| **Type**      |                                                                                                                                                                                                                                                          |
| **Problem**   | Another payment error occurred.                                                                                                                                                                                                                          |
| **Solutions** | This error can occur when your integration is working correctly. Use the error code to determine what next steps are appropriate. See the [documentation on error codes](https://docs.stripe.com/error-codes.md) for appropriate responses to each code. |

## Invalid request errors  

|  |
|  |
| **Type**      |                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| **Problem**   | You made an API call with the wrong parameters, in the wrong state, or in an invalid way.                                                                                                                                                                                                                                                                                                                                                         |
| **Solutions** | In most cases, the problem is with the request itself. Either its parameters are invalid or it can’t be carried out in your integration’s current state.
  * Consult the [error code documentation](https://docs.stripe.com/error-codes.md) for details on the problem.
  * For convenience, you can follow the link at  for documentation about the error code.
  * If the error involves a specific parameter, use 
    to determine which one. |

## Connection errors  

|  |
|  |
| **Type**      |                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| **Problem**   | There was a network problem between your server and Stripe.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| **Solutions** | Treat the result of the API call as indeterminate. That is, don’t assume that it succeeded or that it failed.

  To find out if it succeeded, you can:

  * Retrieve the relevant object from Stripe and check its status.
  * Listen for webhook notification that the operation succeeded or failed.

  To help recover from connection errors, you can:

  * When creating or updating an object, use an [idempotency key](https://docs.stripe.com/api/idempotent_requests.md). Then, if a connection error occurs, you can safely repeat the request without risk of creating a second object or performing the update twice. Repeat the request with the same idempotency key until you receive a clear success or failure. For advanced advice on this strategy, see [Low-level error handling](https://docs.stripe.com/error-low-level.md#idempotency).
  * Turn on [automatic retries.](#automatic-retries) Then, Stripe generates idempotency keys for you, and repeats requests for you when it is safe to do so.

  This error can mask others. It’s possible that when the connection error resolves, some other error becomes apparent. Check for errors in all of these solutions just as you would in the original request. |

## API errors  

|  |
|  |
| **Type**      |                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| **Problem**   | Something went wrong on Stripe’s end. (These are rare.)                                                                                                                                                                                                                                                                                                                                                                                                     |
| **Solutions** | Treat the result of the API call as indeterminate. That is, don’t assume that it succeeded or that it failed.

  Rely on *webhooks* for information about the outcome. Whenever possible, Stripe fires webhooks for any new objects we create as we solve a problem.

  To set your integration up for maximum robustness in unusual situations, see [this advanced discussion of server errors.](https://docs.stripe.com/error-low-level.md#server-errors) |

## Authentication errors  

|  |
|  |
| **Type**      |                                                                                                                                                                                   |
| **Problem**   | Stripe can’t authenticate you with the information provided.                                                                                                                      |
| **Solutions** | * Use the correct [API key](https://docs.stripe.com/keys.md).
  * Make sure you aren’t using a key that you [“rotated” or revoked](https://docs.stripe.com/keys.md#rolling-keys). |

## Idempotency errors  

|  |
|  |
| **Type**      |                                                                                                                                                                        |
| **Problem**   | You used an [idempotency key](https://docs.stripe.com/api/idempotent_requests.md) for something unexpected, like replaying a request but passing different parameters. |
| **Solutions** | * After you use an idempotency key, only reuse it for identical API calls.
  * Use idempotency keys under the limit of 255 characters.                                 |

## Permission errors  

|  |
|  |
| **Type**      |                                                                                                                                                                                                                                                                                                                          |
| **Problem**   | The API key used for this request doesn’t have the necessary permissions.                                                                                                                                                                                                                                                |
| **Solutions** | * Make sure you aren’t using a [restricted API key](https://docs.stripe.com/keys-best-practices.md#limit-access) for a service it doesn’t have access to.
  * Don’t perform actions in the Dashboard while logged in as a [user role](https://docs.stripe.com/get-started/account/teams/roles.md) that lacks permission. |

## Rate limit errors  

|  |
|  |
| **Type**      |                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| **Problem**   | You made too many API calls in too short a time.                                                                                                                                                                                                                                                                                                                                                                                                                          |
| **Solutions** | * If a single API call triggers this error, wait and try it again.
  * To handle rate-limiting automatically, retry the API call after a delay, and increase the delay exponentially if the error continues. See the documentation on [rate limits](https://docs.stripe.com/rate-limits.md) for further advice.
  * If you anticipate a large increase in traffic and want to request an increased rate limit, [contact support](https://support.stripe.com/) in advance. |

## Signature verification errors  

|  |
|  |
| **Type**      |                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| **Problem**   | You’re using *webhook* [signature verification](https://docs.stripe.com/webhooks.md#verify-events) and couldn’t verify that a webhook event is authentic.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| **Solutions** | This error can occur when your integration is working correctly. If you use webhook signature verification and a third party attempts to send you a fake or malicious webhook, then verification fails and this error is the result. Catch it and respond with a `400 Bad Request` status code.

  If you receive this error when you shouldn’t—for instance, with webhooks that you know originate with Stripe—then see the documentation on [checking webhook signatures](https://docs.stripe.com/webhooks.md#verify-events) for further advice. In particular, make sure you’re using the correct endpoint secret. This is different from your API key. |

In the Stripe Go library, each error object has a `Type` attribute. Use the documentation for each
type for advice about how to respond.

| Name                  |  | Description                                                                                                                                                                                                                                    |
| --------------------- |  | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Payment error         |  | An error occurred during a payment, involving one of these situations:
  * [Payment blocked for suspected fraud](#payment-blocked)
  * [Payment declined by the issuer](#payment-declined).
  * [Other payment errors](#other-payment-errors). |
| Invalid request error |  |                                                                                                                                                                                                                                                |
| API error             |  | Something went wrong on Stripe’s end. (These are rare.)                                                                                                                                                                                        |
| Idempotency error     |  | You used an [idempotency key](https://docs.stripe.com/api/idempotent_requests.md) for something unexpected, like replaying a request but passing different parameters.                                                                         |

## Card errors 

Everything in this section also applies to non-card payments. For historical reasons, payment errors have the type . But in fact, they can represent a problem with any payment, regardless of the payment method.

Payment errors—sometimes called “card errors” for historical reasons—cover a wide range of common problems. They come in three categories:

* [Payment blocked for suspected fraud](#payment-blocked)
* [Payment declined by the issuer](#payment-declined)
* [Other payment errors](#other-payment-errors)

To distinguish these categories or get more information about how to respond, consult the [error code](https://docs.stripe.com/error-codes.md), [decline code](https://docs.stripe.com/declines/codes.md), and [charge outcome](https://docs.stripe.com/api/charges/object.md#charge_object-outcome).

(To find the charge outcome from an error object, first get the [Payment Intent that’s involved](https://docs.stripe.com/api/errors.md#errors-payment_intent) and the [latest Charge it created](https://docs.stripe.com/api/payment_intents/object.md#payment_intent_object-latest_charge). See the example below for a demonstration.)

```ruby
require 'stripe'
Stripe.api_key = '<<secret key>>'

def example_function(params)
  begin
    Stripe::PaymentIntent.create(params)
  rescue Stripe::CardError => e
    charge = Stripe::Charge.retrieve(e.error.payment_intent.latest_charge)
    if charge.outcome.type == 'blocked'
      puts 'Payment blocked for suspected fraud.'
    elsif e.code == 'card_declined'
      puts 'Payment declined by the issuer.'
    elsif e.code == 'expired_card'
      puts 'Card expired.'
    else
      puts 'Other card error.'
    end
  end
end
```

```python
import stripe, logging
stripe.api_key = <<secret key>>

def example_function(**kwargs):
  try:
    stripe.PaymentIntent.create(**kwargs)
  except stripe.CardError as e:
    charge = stripe.Charge.retrieve(e.error.payment_intent.latest_charge)
    if charge.outcome.type == 'blocked':
      logging.error("Payment blocked for suspected fraud.")
    elif e.code == 'card_declined':
      logging.error("Payment declined by the issuer.")
    elif e.code == 'expired_card':
      logging.error("Card expired.")
    else:
      logging.error("Other card error.")
```

```php
<?php
  require 'vendor/autoload.php';
  \Stripe\Stripe::setApiKey('<<secret key>>');

  function example_function($args) {
    try {
      $stripe->paymentIntents->create($args);
    } catch(\Stripe\Exception\CardException $e) {
      $charge = $stripe->charge->retrieve($e->getError()->payment_intent->latest_charge);
      if ($charge->outcome->type == 'blocked') {
        error_log('Blocked for suspected fraud.');
      } elseif ($e->getError()->code == 'expired_card') {
        error_log('Card expired.');
      } elseif ($e->getError()->code == 'card_declined') {
        error_log('Declined by the issuer.');
      } else {
        error_log('Other card error.');
      }
    }
  }
```

```java
public static void example_function(PaymentIntentCreateParams params) {
        Stripe.apiKey = "<<secret key>>";
        try {
            PaymentIntent paymentIntent = PaymentIntent.create(params);
        } catch (CardException e) {
            Charge charge = Charge.retrieve(ex.getStripeError()
                 .getPaymentIntent()
                 .getLatestCharge());
            if(charge
                 .getOutcome()
                 .getType().equals("blocked")) {
                System.out.println("Payment blocked for suspected fraud.");
            } else if(e.getCode().equals("card_declined")) {
                System.out.println("Declined by the issuer.");
            } else if(e.getCode().equals("expired_card")) {
                System.out.println("Card expired.");
            } else {
                System.out.println("Other card error.");
            }
        } catch (Exception e) {
            System.out.println("Another problem occurred, maybe unrelated to Stripe.");
        }
    }
```

```javascript
const stripe = require('stripe')('<<secret key>>');

async function exampleFunction(args) {
    try {
      const paymentIntent = await stripe.paymentIntents.create(args);
    } catch (e) {
      console.log(e)
      const charge = await stripe.charges.retrieve(e.payment_intent.latest_charge)
      if (e.type === 'StripeCardError') {
        if (charge.outcome.type === 'blocked') {
          console.log('Payment blocked for suspected fraud.')
        } else if (e.code === 'card_declined') {
          console.log('Payment declined by the issuer.')
        } else if (e.code === 'expired_card') {
          console.log('Card expired.')
        } else {
          console.log('Other card error.')
        }
      }
    }
  }
```

```go
func example_function(params *stripe.PaymentIntentParams) {
  stripe.Key = "<<secret key>>"
  _, err := paymentintent.New(params)
  if err == nil {
    log.Println("No error.")
  } else {
    if stripeErr, ok := err.(*stripe.Error); ok {
      if stripeErr.Type == stripe.ErrorTypeCard {
        charge = Charge.retrieve(stripeErr.PaymentIntent.LatestCharge)
        if charge.Outcome.Type == "blocked" {
          log.Println("Payment blocked for suspected fraud.")
        } else if stripeErr.Code == stripe.ErrorCodeCardDeclined {
          log.Println("Declined by the issuer.")
        } else if stripeErr.Code == stripe.ErrorCodeExpiredCard {
          log.Println("Card expired.")
        } else {
          log.Println("Other card error.")
        }
      }
    }
  }
}
```

```dotnet
using Stripe;
StripeConfiguration.ApiKey = Environment.GetEnvironmentVariable("STRIPE_SECRET_KEY");

static void ExampleFunction(PaymentIntentCreateOptions options)
{
	try
	{
		var service = new PaymentIntentService();
		service.Create(options);
	}
	catch (StripeException e)
	{
		if (e.StripeError.Type == "card_error")
		{
      var chargeService = new ChargeService();
      var options = new ChargeGetOptions();
      var charge = service.Get(e.StripeError.PaymentIntent.LatestChargeId, options);

			if(charge.Outcome.Type == "blocked")
			{
				Console.WriteLine("Payment blocked for suspected fraud.");
			}
			else if (e.StripeError.Code == "card_declined")
			{
				Console.WriteLine("Declined by the issuer.");
			}
			else if (e.StripeError.Code == "expired_card")
			{
				Console.WriteLine("Card expired.");
			}
			else
			{
				Console.WriteLine("Other card error.");
			}
		}
	}
}
```

Users on API version [2022-08-01](https://docs.stripe.com/upgrades.md#2022-08-01) or older:

(To find the charge outcome from an error object, first get the [Payment Intent that’s involved](https://docs.stripe.com/api/errors.md#errors-payment_intent) and the [latest Charge it created](https://docs.stripe.com/api/payment_intents/object.md#payment_intent_object-charges-data). See the example below for a demonstration.)

```ruby
require 'stripe'
Stripe.api_key = '<<secret key>>'

def example_function(params)
  begin
    Stripe::PaymentIntent.create(params)
  rescue Stripe::CardError => e
    if e.error.payment_intent.charges.data[0].outcome.type == 'blocked'
      puts 'Payment blocked for suspected fraud.'
    elsif e.code == 'card_declined'
      puts 'Payment declined by the issuer.'
    elsif e.code == 'expired_card'
      puts 'Card expired.'
    else
      puts 'Other card error.'
    end
  end
end
```

```python
import stripe, logging
stripe.api_key = <<secret key>>

def example_function(**kwargs):
  try:
    stripe.PaymentIntent.create(**kwargs)
  except stripe.error.CardError as e:
    if e.error.payment_intent.charges.data[0].outcome.type == 'blocked':
      logging.error("Payment blocked for suspected fraud.")
    elif e.code == 'card_declined':
      logging.error("Payment declined by the issuer.")
    elif e.code == 'expired_card':
      logging.error("Card expired.")
    else:
      logging.error("Other card error.")
```

```php
<?php
  require 'vendor/autoload.php';
  \Stripe\Stripe::setApiKey('<<secret key>>');

  function example_function($args) {
    try {
      $stripe->paymentIntents->create($args);
    } catch(\Stripe\Exception\CardException $e) {
      if ($e->getError()->payment_intent->charges->data[0]->outcome->type == 'blocked') {
        error_log('Blocked for suspected fraud.');
      } elseif ($e->getError()->code == 'expired_card') {
        error_log('Card expired.');
      } elseif ($e->getError()->code == 'card_declined') {
        error_log('Declined by the issuer.');
      } else {
        error_log('Other card error.');
      }
    }
  }
```

```java
public static void example_function(PaymentIntentCreateParams params) {
        Stripe.apiKey = "<<secret key>>";
        try {
            PaymentIntent paymentIntent = PaymentIntent.create(params);
        } catch (CardException e) {
            if(ex.getStripeError()
                 .getPaymentIntent()
                 .getCharges()
                 .getData()
                 .get(0)
                 .getOutcome()
                 .getType().equals("blocked")) {
                System.out.println("Payment blocked for suspected fraud.");
            } else if(e.getCode().equals("card_declined")) {
                System.out.println("Declined by the issuer.");
            } else if(e.getCode().equals("expired_card")) {
                System.out.println("Card expired.");
            } else {
                System.out.println("Other card error.");
            }
        } catch (Exception e) {
            System.out.println("Another problem occurred, maybe unrelated to Stripe.");
        }
    }
```

```javascript
const stripe = require('stripe')('<<secret key>>');

async function exampleFunction(args) {
    try {
      const paymentIntent = await stripe.paymentIntents.create(args);
    } catch (e) {
      console.log(e)
      if (e.type === 'StripeCardError') {
        if (e.payment_intent.charges.data[0].outcome.type === 'blocked') {
          console.log('Payment blocked for suspected fraud.')
        } else if (e.code === 'card_declined') {
          console.log('Payment declined by the issuer.')
        } else if (e.code === 'expired_card') {
          console.log('Card expired.')
        } else {
          console.log('Other card error.')
        }
      }
    }
  }
```

```go
func example_function(params *stripe.PaymentIntentParams) {
  stripe.Key = "<<secret key>>"
  _, err := paymentintent.New(params)
  if err == nil {
    log.Println("No error.")
  } else {
    if stripeErr, ok := err.(*stripe.Error); ok {
      if stripeErr.Type == stripe.ErrorTypeCard {
        if stripeErr.PaymentIntent.Charges.Data[0].Outcome.Type == "blocked" {
          log.Println("Payment blocked for suspected fraud.")
        } else if stripeErr.Code == stripe.ErrorCodeCardDeclined {
          log.Println("Declined by the issuer.")
        } else if stripeErr.Code == stripe.ErrorCodeExpiredCard {
          log.Println("Card expired.")
        } else {
          log.Println("Other card error.")
        }
      }
    }
  }
}
```

```dotnet
using Stripe;
StripeConfiguration.ApiKey = Environment.GetEnvironmentVariable("STRIPE_SECRET_KEY");

static void ExampleFunction(PaymentIntentCreateOptions options)
{
	try
	{
		var service = new PaymentIntentService();
		service.Create(options);
	}
	catch (StripeException e)
	{
		if (e.StripeError.Type == "card_error")
		{
			if(e.StripeError.PaymentIntent.Charges.Data[0].Outcome.Type == "blocked")
			{
				Console.WriteLine("Payment blocked for suspected fraud.");
			}
			else if (e.StripeError.Code == "card_declined")
			{
				Console.WriteLine("Declined by the issuer.");
			}
			else if (e.StripeError.Code == "expired_card")
			{
				Console.WriteLine("Card expired.");
			}
			else
			{
				Console.WriteLine("Other card error.");
			}
		}
	}
}
```

You can trigger some common kinds of payment error with test cards. Consult these lists for options:

* [Simulating payments blocked for fraud risk](https://docs.stripe.com/testing.md#fraud-prevention)
* [Simulating declined payments and other card errors](https://docs.stripe.com/testing.md#declined-payments)

The test code below demonstrates a few possibilities.

```ruby
example_function(
  currency: 'USD',
  amount: 2000,
  confirm: true,
  payment_method: 'pm_card_radarBlock',
)
```

```
Payment blocked for suspected fraud.
```

```python
example_function(
  currency='USD',
  amount=2000,
  confirm=True,
  payment_method='pm_card_radarBlock',
)
```

```
Payment blocked for suspected fraud.
```

```php
example_function([
  'currency' => 'USD',
  'amount' => 2000,
  'confirm' => True,
  'payment_method' => 'pm_card_radarBlock',
]);
```

```
Payment blocked for suspected fraud.
```

```java
PaymentIntentCreateParams params = PaymentIntentCreateParams.builder()
    .setCurrency("USD")
    .setAmount(2000L)
    .setConfirm(true)
    .setPaymentMethod("pm_card_radarBlock")
    .build();
example_function(params);
```

```
Payment blocked for suspected fraud.
```

```javascript
exampleFunction({
  currency: 'USD',
  amount: 2000,
  confirm: true,
  payment_method: 'pm_card_radarBlock',
})
```

```
Payment blocked for suspected fraud.
```

```go
params := &stripe.PaymentIntentParams{
  Amount: stripe.Int64(2000),
  Currency: stripe.String(string(stripe.CurrencyUSD)),
  Confirm: stripe.Bool(true),
  PaymentMethod: stripe.String("pm_card_radarBlock"),
}
example_function(params)
```

```
Payment blocked for suspected fraud.
```

```dotnet
var options = new PaymentIntentCreateOptions
{
  Amount = 2000,
  Currency = "USD",
  Confirm = true,
  PaymentMethod = "pm_card_radarBlock"
};
ExampleFunction(options);

```

```
Payment blocked for suspected fraud.
```

```ruby
example_function(
  currency: 'USD',
  amount: 2000,
  confirm: true,
  payment_method: 'pm_card_visa_chargeDeclined',
)
```

```
Payment declined by the issuer.
```

```python
example_function(
  currency='USD',
  amount=2000,
  confirm=True,
  payment_method: 'pm_card_visa_chargeDeclined',
)
```

```
Payment declined by the issuer.
```

```php
example_function([
  'currency' => 'USD',
  'amount' => 2000,
  'confirm' => True,
  'payment_method' => 'pm_card_visa_chargeDeclined',
]);
```

```
Payment declined by the issuer
```

```java
PaymentIntentCreateParams params = PaymentIntentCreateParams.builder()
    .setCurrency("USD")
    .setAmount(2000L)
    .setConfirm(true)
    .setPaymentMethod("pm_card_visa_chargeDeclined")
    .build();
example_function(params);
```

```
Payment declined by the issuer.
```

```javascript
exampleFunction({
  currency: 'USD',
  amount: 2000,
  confirm: true,
  payment_method: 'pm_card_visa_chargeDeclined',
})
```

```
Payment declined by the issuer.
```

```go
params := &stripe.PaymentIntentParams{
  Amount: stripe.Int64(2000),
  Currency: stripe.String(string(stripe.CurrencyUSD)),
  Confirm: stripe.Bool(true),
  PaymentMethod: stripe.String("pm_card_visa_chargeDeclined"),
}
example_function(params)
```

```
Payment declined by the issuer.
```

```dotnet
var options = new PaymentIntentCreateOptions
{
  Amount = 2000,
  Currency = "USD",
  Confirm = true,
  PaymentMethod = "pm_card_visa_chargeDeclined",
};
ExampleFunction(options);

```

```
Payment declined by the issuer.
```

```ruby
example_function(
  currency: 'USD',
  amount: 2000,
  confirm: true,
  payment_method: 'pm_card_chargeDeclinedExpiredCard',
)
```

```
Card expired.
```

```python
example_function(
  currency='USD',
  amount=2000,
  confirm=True,
  payment_method: 'pm_card_chargeDeclinedExpiredCard',
)
```

```
Card expired.
```

```php
example_function([
  'currency' => 'USD',
  'amount' => 2000,
  'confirm' => True,
  'payment_method' => 'pm_card_chargeDeclinedExpiredCard',
]);
```

```
Card expired.
```

```java
PaymentIntentCreateParams params = PaymentIntentCreateParams.builder()
    .setCurrency("USD")
    .setAmount(2000L)
    .setConfirm(true)
    .setPaymentMethod("pm_card_chargeDeclinedExpiredCard")
    .build();
example_function(params);
```

```
Card expired.
```

```javascript
exampleFunction({
  currency: 'USD',
  amount: 2000,
  confirm: true,
  payment_method: 'pm_card_chargeDeclinedExpiredCard',
})
```

```
Card expired.
```

```go
params := &stripe.PaymentIntentParams{
  Amount: stripe.Int64(2000),
  Currency: stripe.String(string(stripe.CurrencyUSD)),
  Confirm: stripe.Bool(true),
  PaymentMethod: stripe.String("pm_card_chargeDeclinedExpiredCard"),
}
example_function(params)
```

```
Card expired.
```

```dotnet
var options = new PaymentIntentCreateOptions
{
  Amount = 2000,
  Currency = "USD",
  Confirm = true,
  PaymentMethod = "pm_card_chargeDeclinedExpiredCard",
};
ExampleFunction(options);

```

```
Card expired.
```

```ruby
example_function(
  currency: 'USD',
  amount: 2000,
  confirm: true,
  payment_method: 'pm_card_chargeDeclinedProcessingError',
)
```

```
Other payment error.
```

```python
example_function(
  currency='USD',
  amount=2000,
  confirm=True,
  payment_method: 'pm_card_chargeDeclinedProcessingError',
)
```

```
Other payment error.
```

```php
example_function([
  'currency' => 'USD',
  'amount' => 2000,
  'confirm' => True,
  'payment_method' => 'pm_card_chargeDeclinedProcessingError',
]);
```

```
Other payment error.
```

```java
PaymentIntentCreateParams params = PaymentIntentCreateParams.builder()
    .setCurrency("USD")
    .setAmount(2000L)
    .setConfirm(true)
    .setPaymentMethod("pm_card_chargeDeclinedProcessingError")
    .build();
example_function(params);
```

```
Other payment error.
```

```javascript
exampleFunction({
  currency: 'USD',
  amount: 2000,
  confirm: true,
  payment_method: 'pm_card_chargeDeclinedProcessingError',
})
```

```
Other payment error.
```

```go
params := &stripe.PaymentIntentParams{
  Amount: stripe.Int64(2000),
  Currency: stripe.String(string(stripe.CurrencyUSD)),
  Confirm: stripe.Bool(true),
  PaymentMethod: stripe.String("pm_card_chargeDeclinedProcessingError"),
}
example_function(params)
```

```
Other card error.
```

```dotnet
var options = new PaymentIntentCreateOptions
{
  Amount = 2000,
  Currency = "USD",
  Confirm = true,
  PaymentMethod = "pm_card_chargeDeclinedProcessingError",
};
ExampleFunction(options);

```

```
Other payment error.
```

### Blocked for suspected fraud 

|  |
|  |
| **Type**      |                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| **Codes**     |                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| **Codes**     |                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| **Problem**   | Stripe’s fraud prevention system, *Radar*, blocked the payment                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| **Solutions** | This error can occur when your integration is working correctly. Catch it and prompt the customer for a different payment method.

  To block fewer legitimate payments, try these:

  * [Optimize your Radar integration](https://docs.stripe.com/radar/integration.md) to collect more detailed information.
  * Use [Payment Links](https://docs.stripe.com/payment-links.md), [Checkout](https://docs.stripe.com/payments/checkout.md), or [Stripe Elements](https://docs.stripe.com/payments/elements.md) for prebuilt optimized form elements.

  *Radar for Fraud Teams* customers have these additional options:

  * To exempt a specific payment, add it to your allowlist.
  * To change your risk tolerance, adjust your [risk settings](https://docs.stripe.com/radar/risk-settings.md).
  * To change the criteria for blocking a payment, use [custom rules](https://docs.stripe.com/radar/rules.md).

  You can test your integration’s settings with [test cards that simulate fraud](https://docs.stripe.com/radar/testing.md). If you have custom Radar rules, follow the testing advice in the [Radar documentation](https://docs.stripe.com/radar/testing.md). |

### Declined by the issuer 

|  |
|  |
| **Type**      |                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| **Codes**     |                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| **Problem**   | The card issuer declined the payment.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| **Solutions** | This error can occur when your integration is working correctly. It reflects an action by the issuer, and that action might be legitimate. Use the decline code to determine what next steps are appropriate. See the [documentation on decline codes](https://docs.stripe.com/declines/codes.md) for appropriate responses to each code.

  You can also:

  * [Follow recommendations to reduce issuer declines](https://docs.stripe.com/declines/card.md#reducing-bank-declines).
  * Use [Payment Links](https://docs.stripe.com/payment-links.md), [Checkout](https://docs.stripe.com/payments/checkout.md), or [Stripe Elements](https://docs.stripe.com/payments/elements.md) for prebuilt form elements that implement those recommendations.

  Test how your integration handles declines with [test cards that simulate successful and declined payments](https://docs.stripe.com/radar/testing.md). |

### Other payment errors 

|  |
|  |
| **Type**      |                                                                                                                                                                                                                                                          |
| **Problem**   | Another payment error occurred.                                                                                                                                                                                                                          |
| **Solutions** | This error can occur when your integration is working correctly. Use the error code to determine what next steps are appropriate. See the [documentation on error codes](https://docs.stripe.com/error-codes.md) for appropriate responses to each code. |

## Invalid request errors 

Invalid request errors cover a range of situations. The most common one is when the API request has invalid
parameters or isn’t allowed in your integration’s current state. Use the error code (`stripeErr.Code`)
and consult the [error code documentation](https://docs.stripe.com/error-codes.md) to find a solution. A few error codes require a special response:

* `rate_limit` and `lock_timeout` reflect [rate limit errors](#rate-limit-errors)
* `secret_key_required` reflects an [authentication error](#authentication-errors)
* Other error codes reflect [invalid parameters or state](#other-invalid-request-errors)

### Rate limit errors 

|  |
|  |
| **Type**      |                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| **Problem**   | You made too many API calls in too short a time.                                                                                                                                                                                                                                                                                                                                                                                                                          |
| **Solutions** | * If a single API call triggers this error, wait and try it again.
  * To handle rate-limiting automatically, retry the API call after a delay, and increase the delay exponentially if the error continues. See the documentation on [rate limits](https://docs.stripe.com/rate-limits.md) for further advice.
  * If you anticipate a large increase in traffic and want to request an increased rate limit, [contact support](https://support.stripe.com/) in advance. |

### Authentication errors 

|  |
|  |
| **Type**      |                                                                                                                                                                                   |
| **Problem**   | Stripe can’t authenticate you with the information provided.                                                                                                                      |
| **Solutions** | * Use the correct [API key](https://docs.stripe.com/keys.md).
  * Make sure you aren’t using a key that you [“rotated” or revoked](https://docs.stripe.com/keys.md#rolling-keys). |

### Invalid parameters or state 

|  |
|  |
| **Type**      |                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| **Problem**   | You made an API call with the wrong parameters, in the wrong state, or in an invalid way.                                                                                                                                                                                                                                                                                                                                                         |
| **Solutions** | In most cases, the problem is with the request itself. Either its parameters are invalid or it can’t be carried out in your integration’s current state.
  * Consult the [error code documentation](https://docs.stripe.com/error-codes.md) for details on the problem.
  * For convenience, you can follow the link at  for documentation about the error code.
  * If the error involves a specific parameter, use 
    to determine which one. |

## API errors 

|  |
|  |
| **Type**      |                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| **Problem**   | Something went wrong on Stripe’s end. (These are rare.)                                                                                                                                                                                                                                                                                                                                                                                                     |
| **Solutions** | Treat the result of the API call as indeterminate. That is, don’t assume that it succeeded or that it failed.

  Rely on *webhooks* for information about the outcome. Whenever possible, Stripe fires webhooks for any new objects we create as we solve a problem.

  To set your integration up for maximum robustness in unusual situations, see [this advanced discussion of server errors.](https://docs.stripe.com/error-low-level.md#server-errors) |

## Idempotency errors 

|  |
|  |
| **Type**      |                                                                                                                                                                        |
| **Problem**   | You used an [idempotency key](https://docs.stripe.com/api/idempotent_requests.md) for something unexpected, like replaying a request but passing different parameters. |
| **Solutions** | * After you use an idempotency key, only reuse it for identical API calls.
  * Use idempotency keys under the limit of 255 characters.                                 |

In the Stripe .NET library, each error object has a `type` attribute. Use the documentation for each type
for advice about how to respond.

| Name                  |  | Description                                                                                                                                                                                                                                    |
| --------------------- |  | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Payment error         |  | An error occurred during a payment, involving one of these situations:
  * [Payment blocked for suspected fraud](#payment-blocked)
  * [Payment declined by the issuer](#payment-declined).
  * [Other payment errors](#other-payment-errors). |
| Invalid request error |  |                                                                                                                                                                                                                                                |
| API error             |  | Something went wrong on Stripe’s end. (These are rare.)                                                                                                                                                                                        |
| Idempotency error     |  | You used an [idempotency key](https://docs.stripe.com/api/idempotent_requests.md) for something unexpected, like replaying a request but passing different parameters.                                                                         |

## Payment errors 

Everything in this section also applies to non-card payments. For historical reasons, payment errors have the type . But in fact, they can represent a problem with any payment, regardless of the payment method.

Payment errors—sometimes called “card errors” for historical reasons—cover a wide range of common problems. They come in three categories:

* [Payment blocked for suspected fraud](#payment-blocked)
* [Payment declined by the issuer](#payment-declined)
* [Other payment errors](#other-payment-errors)

To distinguish these categories or get more information about how to respond, consult the [error code](https://docs.stripe.com/error-codes.md), [decline code](https://docs.stripe.com/declines/codes.md), and [charge outcome](https://docs.stripe.com/api/charges/object.md#charge_object-outcome).

(To find the charge outcome from an error object, first get the [Payment Intent that’s involved](https://docs.stripe.com/api/errors.md#errors-payment_intent) and the [latest Charge it created](https://docs.stripe.com/api/payment_intents/object.md#payment_intent_object-latest_charge). See the example below for a demonstration.)

```ruby
require 'stripe'
Stripe.api_key = '<<secret key>>'

def example_function(params)
  begin
    Stripe::PaymentIntent.create(params)
  rescue Stripe::CardError => e
    charge = Stripe::Charge.retrieve(e.error.payment_intent.latest_charge)
    if charge.outcome.type == 'blocked'
      puts 'Payment blocked for suspected fraud.'
    elsif e.code == 'card_declined'
      puts 'Payment declined by the issuer.'
    elsif e.code == 'expired_card'
      puts 'Card expired.'
    else
      puts 'Other card error.'
    end
  end
end
```

```python
import stripe, logging
stripe.api_key = <<secret key>>

def example_function(**kwargs):
  try:
    stripe.PaymentIntent.create(**kwargs)
  except stripe.CardError as e:
    charge = stripe.Charge.retrieve(e.error.payment_intent.latest_charge)
    if charge.outcome.type == 'blocked':
      logging.error("Payment blocked for suspected fraud.")
    elif e.code == 'card_declined':
      logging.error("Payment declined by the issuer.")
    elif e.code == 'expired_card':
      logging.error("Card expired.")
    else:
      logging.error("Other card error.")
```

```php
<?php
  require 'vendor/autoload.php';
  \Stripe\Stripe::setApiKey('<<secret key>>');

  function example_function($args) {
    try {
      $stripe->paymentIntents->create($args);
    } catch(\Stripe\Exception\CardException $e) {
      $charge = $stripe->charge->retrieve($e->getError()->payment_intent->latest_charge);
      if ($charge->outcome->type == 'blocked') {
        error_log('Blocked for suspected fraud.');
      } elseif ($e->getError()->code == 'expired_card') {
        error_log('Card expired.');
      } elseif ($e->getError()->code == 'card_declined') {
        error_log('Declined by the issuer.');
      } else {
        error_log('Other card error.');
      }
    }
  }
```

```java
public static void example_function(PaymentIntentCreateParams params) {
        Stripe.apiKey = "<<secret key>>";
        try {
            PaymentIntent paymentIntent = PaymentIntent.create(params);
        } catch (CardException e) {
            Charge charge = Charge.retrieve(ex.getStripeError()
                 .getPaymentIntent()
                 .getLatestCharge());
            if(charge
                 .getOutcome()
                 .getType().equals("blocked")) {
                System.out.println("Payment blocked for suspected fraud.");
            } else if(e.getCode().equals("card_declined")) {
                System.out.println("Declined by the issuer.");
            } else if(e.getCode().equals("expired_card")) {
                System.out.println("Card expired.");
            } else {
                System.out.println("Other card error.");
            }
        } catch (Exception e) {
            System.out.println("Another problem occurred, maybe unrelated to Stripe.");
        }
    }
```

```javascript
const stripe = require('stripe')('<<secret key>>');

async function exampleFunction(args) {
    try {
      const paymentIntent = await stripe.paymentIntents.create(args);
    } catch (e) {
      console.log(e)
      const charge = await stripe.charges.retrieve(e.payment_intent.latest_charge)
      if (e.type === 'StripeCardError') {
        if (charge.outcome.type === 'blocked') {
          console.log('Payment blocked for suspected fraud.')
        } else if (e.code === 'card_declined') {
          console.log('Payment declined by the issuer.')
        } else if (e.code === 'expired_card') {
          console.log('Card expired.')
        } else {
          console.log('Other card error.')
        }
      }
    }
  }
```

```go
func example_function(params *stripe.PaymentIntentParams) {
  stripe.Key = "<<secret key>>"
  _, err := paymentintent.New(params)
  if err == nil {
    log.Println("No error.")
  } else {
    if stripeErr, ok := err.(*stripe.Error); ok {
      if stripeErr.Type == stripe.ErrorTypeCard {
        charge = Charge.retrieve(stripeErr.PaymentIntent.LatestCharge)
        if charge.Outcome.Type == "blocked" {
          log.Println("Payment blocked for suspected fraud.")
        } else if stripeErr.Code == stripe.ErrorCodeCardDeclined {
          log.Println("Declined by the issuer.")
        } else if stripeErr.Code == stripe.ErrorCodeExpiredCard {
          log.Println("Card expired.")
        } else {
          log.Println("Other card error.")
        }
      }
    }
  }
}
```

```dotnet
using Stripe;
StripeConfiguration.ApiKey = Environment.GetEnvironmentVariable("STRIPE_SECRET_KEY");

static void ExampleFunction(PaymentIntentCreateOptions options)
{
	try
	{
		var service = new PaymentIntentService();
		service.Create(options);
	}
	catch (StripeException e)
	{
		if (e.StripeError.Type == "card_error")
		{
      var chargeService = new ChargeService();
      var options = new ChargeGetOptions();
      var charge = service.Get(e.StripeError.PaymentIntent.LatestChargeId, options);

			if(charge.Outcome.Type == "blocked")
			{
				Console.WriteLine("Payment blocked for suspected fraud.");
			}
			else if (e.StripeError.Code == "card_declined")
			{
				Console.WriteLine("Declined by the issuer.");
			}
			else if (e.StripeError.Code == "expired_card")
			{
				Console.WriteLine("Card expired.");
			}
			else
			{
				Console.WriteLine("Other card error.");
			}
		}
	}
}
```

Users on API version [2022-08-01](https://docs.stripe.com/upgrades.md#2022-08-01) or older:

(To find the charge outcome from an error object, first get the [Payment Intent that’s involved](https://docs.stripe.com/api/errors.md#errors-payment_intent) and the [latest Charge it created](https://docs.stripe.com/api/payment_intents/object.md#payment_intent_object-charges-data). See the example below for a demonstration.)

```ruby
require 'stripe'
Stripe.api_key = '<<secret key>>'

def example_function(params)
  begin
    Stripe::PaymentIntent.create(params)
  rescue Stripe::CardError => e
    if e.error.payment_intent.charges.data[0].outcome.type == 'blocked'
      puts 'Payment blocked for suspected fraud.'
    elsif e.code == 'card_declined'
      puts 'Payment declined by the issuer.'
    elsif e.code == 'expired_card'
      puts 'Card expired.'
    else
      puts 'Other card error.'
    end
  end
end
```

```python
import stripe, logging
stripe.api_key = <<secret key>>

def example_function(**kwargs):
  try:
    stripe.PaymentIntent.create(**kwargs)
  except stripe.error.CardError as e:
    if e.error.payment_intent.charges.data[0].outcome.type == 'blocked':
      logging.error("Payment blocked for suspected fraud.")
    elif e.code == 'card_declined':
      logging.error("Payment declined by the issuer.")
    elif e.code == 'expired_card':
      logging.error("Card expired.")
    else:
      logging.error("Other card error.")
```

```php
<?php
  require 'vendor/autoload.php';
  \Stripe\Stripe::setApiKey('<<secret key>>');

  function example_function($args) {
    try {
      $stripe->paymentIntents->create($args);
    } catch(\Stripe\Exception\CardException $e) {
      if ($e->getError()->payment_intent->charges->data[0]->outcome->type == 'blocked') {
        error_log('Blocked for suspected fraud.');
      } elseif ($e->getError()->code == 'expired_card') {
        error_log('Card expired.');
      } elseif ($e->getError()->code == 'card_declined') {
        error_log('Declined by the issuer.');
      } else {
        error_log('Other card error.');
      }
    }
  }
```

```java
public static void example_function(PaymentIntentCreateParams params) {
        Stripe.apiKey = "<<secret key>>";
        try {
            PaymentIntent paymentIntent = PaymentIntent.create(params);
        } catch (CardException e) {
            if(ex.getStripeError()
                 .getPaymentIntent()
                 .getCharges()
                 .getData()
                 .get(0)
                 .getOutcome()
                 .getType().equals("blocked")) {
                System.out.println("Payment blocked for suspected fraud.");
            } else if(e.getCode().equals("card_declined")) {
                System.out.println("Declined by the issuer.");
            } else if(e.getCode().equals("expired_card")) {
                System.out.println("Card expired.");
            } else {
                System.out.println("Other card error.");
            }
        } catch (Exception e) {
            System.out.println("Another problem occurred, maybe unrelated to Stripe.");
        }
    }
```

```javascript
const stripe = require('stripe')('<<secret key>>');

async function exampleFunction(args) {
    try {
      const paymentIntent = await stripe.paymentIntents.create(args);
    } catch (e) {
      console.log(e)
      if (e.type === 'StripeCardError') {
        if (e.payment_intent.charges.data[0].outcome.type === 'blocked') {
          console.log('Payment blocked for suspected fraud.')
        } else if (e.code === 'card_declined') {
          console.log('Payment declined by the issuer.')
        } else if (e.code === 'expired_card') {
          console.log('Card expired.')
        } else {
          console.log('Other card error.')
        }
      }
    }
  }
```

```go
func example_function(params *stripe.PaymentIntentParams) {
  stripe.Key = "<<secret key>>"
  _, err := paymentintent.New(params)
  if err == nil {
    log.Println("No error.")
  } else {
    if stripeErr, ok := err.(*stripe.Error); ok {
      if stripeErr.Type == stripe.ErrorTypeCard {
        if stripeErr.PaymentIntent.Charges.Data[0].Outcome.Type == "blocked" {
          log.Println("Payment blocked for suspected fraud.")
        } else if stripeErr.Code == stripe.ErrorCodeCardDeclined {
          log.Println("Declined by the issuer.")
        } else if stripeErr.Code == stripe.ErrorCodeExpiredCard {
          log.Println("Card expired.")
        } else {
          log.Println("Other card error.")
        }
      }
    }
  }
}
```

```dotnet
using Stripe;
StripeConfiguration.ApiKey = Environment.GetEnvironmentVariable("STRIPE_SECRET_KEY");

static void ExampleFunction(PaymentIntentCreateOptions options)
{
	try
	{
		var service = new PaymentIntentService();
		service.Create(options);
	}
	catch (StripeException e)
	{
		if (e.StripeError.Type == "card_error")
		{
			if(e.StripeError.PaymentIntent.Charges.Data[0].Outcome.Type == "blocked")
			{
				Console.WriteLine("Payment blocked for suspected fraud.");
			}
			else if (e.StripeError.Code == "card_declined")
			{
				Console.WriteLine("Declined by the issuer.");
			}
			else if (e.StripeError.Code == "expired_card")
			{
				Console.WriteLine("Card expired.");
			}
			else
			{
				Console.WriteLine("Other card error.");
			}
		}
	}
}
```

You can trigger some common kinds of payment error with test cards. Consult these lists for options:

* [Simulating payments blocked for fraud risk](https://docs.stripe.com/testing.md#fraud-prevention)
* [Simulating declined payments and other card errors](https://docs.stripe.com/testing.md#declined-payments)

The test code below demonstrates a few possibilities.

```ruby
example_function(
  currency: 'USD',
  amount: 2000,
  confirm: true,
  payment_method: 'pm_card_radarBlock',
)
```

```
Payment blocked for suspected fraud.
```

```python
example_function(
  currency='USD',
  amount=2000,
  confirm=True,
  payment_method='pm_card_radarBlock',
)
```

```
Payment blocked for suspected fraud.
```

```php
example_function([
  'currency' => 'USD',
  'amount' => 2000,
  'confirm' => True,
  'payment_method' => 'pm_card_radarBlock',
]);
```

```
Payment blocked for suspected fraud.
```

```java
PaymentIntentCreateParams params = PaymentIntentCreateParams.builder()
    .setCurrency("USD")
    .setAmount(2000L)
    .setConfirm(true)
    .setPaymentMethod("pm_card_radarBlock")
    .build();
example_function(params);
```

```
Payment blocked for suspected fraud.
```

```javascript
exampleFunction({
  currency: 'USD',
  amount: 2000,
  confirm: true,
  payment_method: 'pm_card_radarBlock',
})
```

```
Payment blocked for suspected fraud.
```

```go
params := &stripe.PaymentIntentParams{
  Amount: stripe.Int64(2000),
  Currency: stripe.String(string(stripe.CurrencyUSD)),
  Confirm: stripe.Bool(true),
  PaymentMethod: stripe.String("pm_card_radarBlock"),
}
example_function(params)
```

```
Payment blocked for suspected fraud.
```

```dotnet
var options = new PaymentIntentCreateOptions
{
  Amount = 2000,
  Currency = "USD",
  Confirm = true,
  PaymentMethod = "pm_card_radarBlock"
};
ExampleFunction(options);

```

```
Payment blocked for suspected fraud.
```

```ruby
example_function(
  currency: 'USD',
  amount: 2000,
  confirm: true,
  payment_method: 'pm_card_visa_chargeDeclined',
)
```

```
Payment declined by the issuer.
```

```python
example_function(
  currency='USD',
  amount=2000,
  confirm=True,
  payment_method: 'pm_card_visa_chargeDeclined',
)
```

```
Payment declined by the issuer.
```

```php
example_function([
  'currency' => 'USD',
  'amount' => 2000,
  'confirm' => True,
  'payment_method' => 'pm_card_visa_chargeDeclined',
]);
```

```
Payment declined by the issuer
```

```java
PaymentIntentCreateParams params = PaymentIntentCreateParams.builder()
    .setCurrency("USD")
    .setAmount(2000L)
    .setConfirm(true)
    .setPaymentMethod("pm_card_visa_chargeDeclined")
    .build();
example_function(params);
```

```
Payment declined by the issuer.
```

```javascript
exampleFunction({
  currency: 'USD',
  amount: 2000,
  confirm: true,
  payment_method: 'pm_card_visa_chargeDeclined',
})
```

```
Payment declined by the issuer.
```

```go
params := &stripe.PaymentIntentParams{
  Amount: stripe.Int64(2000),
  Currency: stripe.String(string(stripe.CurrencyUSD)),
  Confirm: stripe.Bool(true),
  PaymentMethod: stripe.String("pm_card_visa_chargeDeclined"),
}
example_function(params)
```

```
Payment declined by the issuer.
```

```dotnet
var options = new PaymentIntentCreateOptions
{
  Amount = 2000,
  Currency = "USD",
  Confirm = true,
  PaymentMethod = "pm_card_visa_chargeDeclined",
};
ExampleFunction(options);

```

```
Payment declined by the issuer.
```

```ruby
example_function(
  currency: 'USD',
  amount: 2000,
  confirm: true,
  payment_method: 'pm_card_chargeDeclinedExpiredCard',
)
```

```
Card expired.
```

```python
example_function(
  currency='USD',
  amount=2000,
  confirm=True,
  payment_method: 'pm_card_chargeDeclinedExpiredCard',
)
```

```
Card expired.
```

```php
example_function([
  'currency' => 'USD',
  'amount' => 2000,
  'confirm' => True,
  'payment_method' => 'pm_card_chargeDeclinedExpiredCard',
]);
```

```
Card expired.
```

```java
PaymentIntentCreateParams params = PaymentIntentCreateParams.builder()
    .setCurrency("USD")
    .setAmount(2000L)
    .setConfirm(true)
    .setPaymentMethod("pm_card_chargeDeclinedExpiredCard")
    .build();
example_function(params);
```

```
Card expired.
```

```javascript
exampleFunction({
  currency: 'USD',
  amount: 2000,
  confirm: true,
  payment_method: 'pm_card_chargeDeclinedExpiredCard',
})
```

```
Card expired.
```

```go
params := &stripe.PaymentIntentParams{
  Amount: stripe.Int64(2000),
  Currency: stripe.String(string(stripe.CurrencyUSD)),
  Confirm: stripe.Bool(true),
  PaymentMethod: stripe.String("pm_card_chargeDeclinedExpiredCard"),
}
example_function(params)
```

```
Card expired.
```

```dotnet
var options = new PaymentIntentCreateOptions
{
  Amount = 2000,
  Currency = "USD",
  Confirm = true,
  PaymentMethod = "pm_card_chargeDeclinedExpiredCard",
};
ExampleFunction(options);

```

```
Card expired.
```

```ruby
example_function(
  currency: 'USD',
  amount: 2000,
  confirm: true,
  payment_method: 'pm_card_chargeDeclinedProcessingError',
)
```

```
Other payment error.
```

```python
example_function(
  currency='USD',
  amount=2000,
  confirm=True,
  payment_method: 'pm_card_chargeDeclinedProcessingError',
)
```

```
Other payment error.
```

```php
example_function([
  'currency' => 'USD',
  'amount' => 2000,
  'confirm' => True,
  'payment_method' => 'pm_card_chargeDeclinedProcessingError',
]);
```

```
Other payment error.
```

```java
PaymentIntentCreateParams params = PaymentIntentCreateParams.builder()
    .setCurrency("USD")
    .setAmount(2000L)
    .setConfirm(true)
    .setPaymentMethod("pm_card_chargeDeclinedProcessingError")
    .build();
example_function(params);
```

```
Other payment error.
```

```javascript
exampleFunction({
  currency: 'USD',
  amount: 2000,
  confirm: true,
  payment_method: 'pm_card_chargeDeclinedProcessingError',
})
```

```
Other payment error.
```

```go
params := &stripe.PaymentIntentParams{
  Amount: stripe.Int64(2000),
  Currency: stripe.String(string(stripe.CurrencyUSD)),
  Confirm: stripe.Bool(true),
  PaymentMethod: stripe.String("pm_card_chargeDeclinedProcessingError"),
}
example_function(params)
```

```
Other card error.
```

```dotnet
var options = new PaymentIntentCreateOptions
{
  Amount = 2000,
  Currency = "USD",
  Confirm = true,
  PaymentMethod = "pm_card_chargeDeclinedProcessingError",
};
ExampleFunction(options);

```

```
Other payment error.
```

### Payment blocked for suspected fraud  

|  |
|  |
| **Type**      |                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| **Codes**     |                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| **Codes**     |                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| **Problem**   | Stripe’s fraud prevention system, *Radar*, blocked the payment                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| **Solutions** | This error can occur when your integration is working correctly. Catch it and prompt the customer for a different payment method.

  To block fewer legitimate payments, try these:

  * [Optimize your Radar integration](https://docs.stripe.com/radar/integration.md) to collect more detailed information.
  * Use [Payment Links](https://docs.stripe.com/payment-links.md), [Checkout](https://docs.stripe.com/payments/checkout.md), or [Stripe Elements](https://docs.stripe.com/payments/elements.md) for prebuilt optimized form elements.

  *Radar for Fraud Teams* customers have these additional options:

  * To exempt a specific payment, add it to your allowlist.
  * To change your risk tolerance, adjust your [risk settings](https://docs.stripe.com/radar/risk-settings.md).
  * To change the criteria for blocking a payment, use [custom rules](https://docs.stripe.com/radar/rules.md).

  You can test your integration’s settings with [test cards that simulate fraud](https://docs.stripe.com/radar/testing.md). If you have custom Radar rules, follow the testing advice in the [Radar documentation](https://docs.stripe.com/radar/testing.md). |

### Payment declined by the issuer  

|  |
|  |
| **Type**      |                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| **Codes**     |                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| **Problem**   | The card issuer declined the payment.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| **Solutions** | This error can occur when your integration is working correctly. It reflects an action by the issuer, and that action might be legitimate. Use the decline code to determine what next steps are appropriate. See the [documentation on decline codes](https://docs.stripe.com/declines/codes.md) for appropriate responses to each code.

  You can also:

  * [Follow recommendations to reduce issuer declines](https://docs.stripe.com/declines/card.md#reducing-bank-declines).
  * Use [Payment Links](https://docs.stripe.com/payment-links.md), [Checkout](https://docs.stripe.com/payments/checkout.md), or [Stripe Elements](https://docs.stripe.com/payments/elements.md) for prebuilt form elements that implement those recommendations.

  Test how your integration handles declines with [test cards that simulate successful and declined payments](https://docs.stripe.com/radar/testing.md). |

### Other payment errors  

|  |
|  |
| **Type**      |                                                                                                                                                                                                                                                          |
| **Problem**   | Another payment error occurred.                                                                                                                                                                                                                          |
| **Solutions** | This error can occur when your integration is working correctly. Use the error code to determine what next steps are appropriate. See the [documentation on error codes](https://docs.stripe.com/error-codes.md) for appropriate responses to each code. |

## Invalid request errors  

|  |
|  |
| **Type**      |                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| **Problem**   | You made an API call with the wrong parameters, in the wrong state, or in an invalid way.                                                                                                                                                                                                                                                                                                                                                         |
| **Solutions** | In most cases, the problem is with the request itself. Either its parameters are invalid or it can’t be carried out in your integration’s current state.
  * Consult the [error code documentation](https://docs.stripe.com/error-codes.md) for details on the problem.
  * For convenience, you can follow the link at  for documentation about the error code.
  * If the error involves a specific parameter, use 
    to determine which one. |

## Connection errors  

|  |
|  |
| **Type**      |                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| **Problem**   | There was a network problem between your server and Stripe.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| **Solutions** | Treat the result of the API call as indeterminate. That is, don’t assume that it succeeded or that it failed.

  To find out if it succeeded, you can:

  * Retrieve the relevant object from Stripe and check its status.
  * Listen for webhook notification that the operation succeeded or failed.

  To help recover from connection errors, you can:

  * When creating or updating an object, use an [idempotency key](https://docs.stripe.com/api/idempotent_requests.md). Then, if a connection error occurs, you can safely repeat the request without risk of creating a second object or performing the update twice. Repeat the request with the same idempotency key until you receive a clear success or failure. For advanced advice on this strategy, see [Low-level error handling](https://docs.stripe.com/error-low-level.md#idempotency).
  * Turn on [automatic retries.](#automatic-retries) Then, Stripe generates idempotency keys for you, and repeats requests for you when it is safe to do so.

  This error can mask others. It’s possible that when the connection error resolves, some other error becomes apparent. Check for errors in all of these solutions just as you would in the original request. |

## API errors  

|  |
|  |
| **Type**      |                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| **Problem**   | Something went wrong on Stripe’s end. (These are rare.)                                                                                                                                                                                                                                                                                                                                                                                                     |
| **Solutions** | Treat the result of the API call as indeterminate. That is, don’t assume that it succeeded or that it failed.

  Rely on *webhooks* for information about the outcome. Whenever possible, Stripe fires webhooks for any new objects we create as we solve a problem.

  To set your integration up for maximum robustness in unusual situations, see [this advanced discussion of server errors.](https://docs.stripe.com/error-low-level.md#server-errors) |

## Authentication errors  

|  |
|  |
| **Type**      |                                                                                                                                                                                   |
| **Problem**   | Stripe can’t authenticate you with the information provided.                                                                                                                      |
| **Solutions** | * Use the correct [API key](https://docs.stripe.com/keys.md).
  * Make sure you aren’t using a key that you [“rotated” or revoked](https://docs.stripe.com/keys.md#rolling-keys). |

## Idempotency errors  

|  |
|  |
| **Type**      |                                                                                                                                                                        |
| **Problem**   | You used an [idempotency key](https://docs.stripe.com/api/idempotent_requests.md) for something unexpected, like replaying a request but passing different parameters. |
| **Solutions** | * After you use an idempotency key, only reuse it for identical API calls.
  * Use idempotency keys under the limit of 255 characters.                                 |

## Permission errors  

|  |
|  |
| **Type**      |                                                                                                                                                                                                                                                                                                                          |
| **Problem**   | The API key used for this request doesn’t have the necessary permissions.                                                                                                                                                                                                                                                |
| **Solutions** | * Make sure you aren’t using a [restricted API key](https://docs.stripe.com/keys-best-practices.md#limit-access) for a service it doesn’t have access to.
  * Don’t perform actions in the Dashboard while logged in as a [user role](https://docs.stripe.com/get-started/account/teams/roles.md) that lacks permission. |

## Rate limit errors  

|  |
|  |
| **Type**      |                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| **Problem**   | You made too many API calls in too short a time.                                                                                                                                                                                                                                                                                                                                                                                                                          |
| **Solutions** | * If a single API call triggers this error, wait and try it again.
  * To handle rate-limiting automatically, retry the API call after a delay, and increase the delay exponentially if the error continues. See the documentation on [rate limits](https://docs.stripe.com/rate-limits.md) for further advice.
  * If you anticipate a large increase in traffic and want to request an increased rate limit, [contact support](https://support.stripe.com/) in advance. |

## Signature verification errors  

|  |
|  |
| **Type**      |                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| **Problem**   | You’re using *webhook* [signature verification](https://docs.stripe.com/webhooks.md#verify-events) and couldn’t verify that a webhook event is authentic.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| **Solutions** | This error can occur when your integration is working correctly. If you use webhook signature verification and a third party attempts to send you a fake or malicious webhook, then verification fails and this error is the result. Catch it and respond with a `400 Bad Request` status code.

  If you receive this error when you shouldn’t—for instance, with webhooks that you know originate with Stripe—then see the documentation on [checking webhook signatures](https://docs.stripe.com/webhooks.md#verify-events) for further advice. In particular, make sure you’re using the correct endpoint secret. This is different from your API key. |