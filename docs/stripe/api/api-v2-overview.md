# API v2 overview

Understand the behavior of APIs in the v2 namespace.

The Stripe API provides two namespaces that contain different sets of endpoints:

- **API v1:** The /v1 namespace includes most of the existing Stripe API today.
- **API v2:** The /v2 namespace includes endpoints that use /v2 design patterns.

## Key differences between the v1 and v2 namespace

|                                          | API v1                                                                                                                                                                                                           | API v2                                                                                                                                                                                                                                                                        |
| ---------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Access APIs**                          | Use secret and restricted access keys to access APIs in the /v1 namespace.                                                                                                                                       | You can only access APIs in the /v2 namespace with secret keys.                                                                                                                                                                                                               |
| **Send data to the API**                 | Requests use form encoding (`application/x-www-form-urlencoded`), and responses use JSON encoding (`application/json`).                                                                                          | Request and responses use JSON encoding (`application/json`).                                                                                                                                                                                                                 |
| **Test your integration**                | Validate APIs in the /v1 namespace using Sandboxes, an isolated environment. Additionally, you can use [test mode](https://docs.stripe.com/testing-use-cases.md) to test your integration.                       | Validate APIs in the /v2 namespace using Sandboxes, an isolated environment. Test mode is unsupported.

  **Read more:** [Sandboxes](https://docs.stripe.com/sandboxes.md)                                                                                                    |
| **Send idempotent requests**             | When providing the `Idempotency-Key` header with a unique identifier, if the API already processed the request, it returns the previously stored request.                                                        | When providing the `Idempotency-Key` header with a unique identifier, the API retries any failed requests without producing side effects (any extraneous change or observable behavior that occurs as a result of an API call).

  **Read more:** [Idempotency](#idempotency) |
| **Receive events from Stripe**           | Most events emitted from APIs in the /v1 namespace include a snapshot of an API object in their payload. Some APIs in the /v1 namespace generate thin events, which include a minimal, unversioned push payload. | Events emitted from APIs in the /v2 namespace are [thin events](https://docs.stripe.com/event-destinations.md#events-overview).

  **Read more:** [Event destinations](https://docs.stripe.com/event-destinations.md)                                                         |
| **Paginating through a list**            | Specify an object’s ID as the starting element for list API requests. Use the `starting_after`, `ending_before`, and `has_more` properties from the API response to paginate through a list.                     | Specify the `page` token for list API requests. Use the `previous_page_url` and `next_page_url` properties in the API response to paginate through a list.

  **Read more:** [List pagination](#list-pagination)                                                              |
| **Consistency guarantees for lists**     | Top-level lists are immediately consistent (with higher latency to render). Some sublists are eventually consistent.                                                                                             | Lists are eventually consistent by default and lower-latency.                                                                                                                                                                                                                 |
| **Fetch additional data with expansion** | Use the `expand` parameter to replace IDs for related API objects with fully-expanded child objects.

  **Read more:** [Expanding responses](https://docs.stripe.com/expand.md)                                  | The `expand` parameter isn’t supported. Some APIs in this namespace might provide additional fields in their responses by using the include parameter.                                                                                                                        |
| **Manage metadata**                      | Remove a key-value pair by setting the value to an empty string.                                                                                                                                                 | Remove a key-value pair by setting the value to `null`.                                                                                                                                                                                                                       |

## SDKs that support API v2

All [server-side SDKs](https://docs.stripe.com/sdks.md#server-side-libraries) support APIs in the /v2 namespace.

### Using API v2 with the Stripe CLI

Use stripe trigger and stripe listen to test your integration’s event handling. You can’t access APIs in the /v2 namespace using the Stripe CLI.

## SDK, CLI, and API versioning 

SDKs and the Stripe CLI automatically include an API version for all requests. After you update your SDK or CLI version, Stripe simultaneously updates the API version of your requests and responses.

#### Include Stripe-Version without SDK or CLI 

All API requests to the API /v2 namespace must include the `Stripe-Version` header to specify the underlying API version.

For example, a curl request using API version `2024-09-30.acacia` looks like:

```bash
curl -G https://api.stripe.com/v2/core/events \
  -H "Authorization: Bearer {{YOUR_API_KEY}}" \
  -H "Stripe-Version: 2024-09-30.acacia" \
  -d object_id=fa_123
```

## Using APIs from the v1 and v2 namespaces in the same integration

You can use any combination of APIs in the /v1 or /v2 namespace in the same integration.

```java
import com.stripe.StripeClient;

StripeClient stripe = new StripeClient("{{YOUR_API_KEY}}");

// Call a v2 API
Event event = stripe.v2().core().events().retrieve("evt_123");

// Call a v1 API
Customer customer = stripe.customers().retrieve("cus_123");
```

```javascript
import Stripe from '@stripe/stripe'

const stripe = new Stripe('{{YOUR_API_KEY}}');

// Call a v2 API
const event = await stripe.v2.core.events.retrieve('evt_123');

// Call a v1 API
const customer = await stripe.customers.retrieve('cus_123');
```

```python
import stripe

client = stripe.StripeClient('{{YOUR_API_KEY}}')

# Call a v2 API
event = client.v2.core.events.retrieve('evt_123')

# Call a v1 API
customer = client.customers.retrieve('cus_123')
```

```dotnet
StripeClient stripe = new StripeClient("{{YOUR__API_KEY}}");

# Call a v2 API
var event = stripe.V2.Core.Events.Retrieve("evt_123");

# Call a v1 API
var customer = stripe.V1.Customers.Retrieve("cus_123");
```

```ruby
require 'stripe'

client = Stripe::StripeClient('{{YOUR_API_KEY}}')

# Call a v2 API
event = client.v2.core.events.retrieve('evt_123')

# Call a v1 API
customer = client.v1.customers.retrieve('cus_123')
```

```php
$client = new \Stripe\StripeClient('{{YOUR_API_KEY}}');

// Call a v2 API
$event = $client->v2->core->events->retrieve('evt_123');

// Call a v1 API
$customer = $client->customers->retrieve('cus_123');
```

```go
sc := stripe.NewClient("{{YOUR_API_KEY}}")

// Call a v2 API
event, err := sc.V2CoreEvents.Retrieve(context.TODO(), "evt_123", nil)

// Call a v1 API
customer, err := sc.V1Customers.Retrieve(context.TODO(), "cus_123", nil)
```

If you’re not using an official SDK or the CLI, always include the namespace in the URL path for your API calls. For example:

```bash
\# Call a v2 API
curl https://api.stripe.com/v2/core/events?object_id=mtr_123

# Call a v1 API
curl https://api.stripe.com/v1/charges -d amount=2000 -d currency=usd
```

## List pagination

APIs within the /v2 namespace (for example, `GET /v2/core/events`) contain a different pagination interface compared to those in the /v1 namespace.

* The `previous_page_url` property returns a URL to fetch the previous page of the list. If there are no previous pages, the value is `null`.
* The `next_page_url` property returns a URL to fetch the next page of the list. If there are no more pages, the value is `null`.

You can use these URLs to make requests without using our SDKs. Conversely, when you use our SDKs, you don’t need to use these URLs because the SDKs handle auto-pagination automatically.

You can’t change list filters after the first request.

```java
StripeClient stripe = new StripeClient("{{YOUR_API_KEY}}");

EventListParams params =
  EventListParams.builder()
    .setObjectId("mtr_123")
    .build();

for (Event event : stripe.v2().core().events().list(params).autoPagingIterable()) {
  // process event object
}
```

```javascript
const stripe = new Stripe('{{YOUR_API_KEY}}');

stripe.v2.core.events.list({
  object_id: 'mtr_123',
}).autoPagingEach((evt) => {
  // process event object
});
```

```python
client = stripe.StripeClient('{{YOUR_API_KEY}}')

for evt in client.v2.core.events.list({
  "object_id": "mtr_123",
}).auto_paging_iter():
  # process event object
```

```dotnet
StripeClient stripe = new StripeClient("{{YOUR_API_KEY}}");

var options = new Stripe.V2.Core.EventListOptions
{
  ObjectId = "mtr_123",
};

foreach (Stripe.V2.Core.Events evt in stripe.V2.Core.Events.ListAutoPaging(options)) {
  // process event object
}
```

```ruby
client = Stripe::StripeClient('{{YOUR_API_KEY}}')

client.v2.core.events.list({
  object_id: 'mtr_123',
}).auto_paging_each do |event|
  # process event object
end
```

```php
$client = new \Stripe\StripeClient('{{YOUR_API_KEY}}');

foreach($client->v2->core->events->all([
  'object_id' => 'mtr_123',
])->autoPagingIterator() as $event) {
  // process event object
}
```

```go
sc := stripe.NewClient("{{YOUR_API_KEY}}")

params := &stripe.V2CoreEventListParams{ObjectID: stripe.String("mtr_123")}
for event, err := range sc.V2CoreEvents.List(context.TODO(), params) {
  // handle err
  // process event object
}
```

## Idempotency

APIs in the /v2 namespace provide improved support for idempotency behavior, preventing unintended side effects when requests are performed multiple times using the same idempotency key. When the API receives two requests with the same idempotency key:

* If the first request succeeded, the API skips making new changes and returns an updated response.
* If the first request failed (or partially failed), the API re-executes the failed requests and returns the new response.
* In the rare event that it’s no longer possible for an idempotent replay to succeed, the API returns an error explaining why.

Two requests are considered idempotent if the following are all true:

* Use the same idempotency key for the same API
* Occur in the scope of the same account or sandbox
* Occur within the last 30 days of each other

To specify an idempotency key, use the `Idempotency-Key` header and provide a unique value to represent the operation (we recommend a UUID). If no key is provided, Stripe automatically generates a UUID for you.

All `POST` and `DELETE` API v2 requests accept idempotency keys and behave idempotently. `GET` requests are idempotent by definition, so sending an idempotency key has no effect.

## Idempotency differences between API v1 and API v2

API v1 and API v2 idempotency have a few key differences:

* API v1 only supports idempotent replay for `POST` requests. API v2 supports all `POST` and `DELETE` requests.
* Two requests are considered idempotent for:
  - API v1 if they use the same idempotency key and occur within 24 hours of each other.
  - API v2 if they use the same idempotency key, are made to the same API, occur within the scope of the account or sandbox, and are made within 30 days of each other.
* When you provide the same idempotency key for two requests:
  - API v1 always returns the previously-saved response of the first API request, even if it was an error.
  - API v2 attempts to retry any failed requests without producing side effects (any extraneous change or observable behavior that occurs as a result of an API call) and provide an updated response.

### Making idempotent requests

Using the SDK, provide an idempotency key with the `idempotencyKey` property in API requests.

For example, to make an API request with a specific idempotency key:

```java
StripeClient stripe = new StripeClient("{{YOUR_API_KEY}}");

String idempotencyKey = "unique-idempotency-key";
Example result = stripe.v2().examples().create(
        ExampleCreateParams.builder()
          .setName("My example")
          .build(),

        RequestOptions.builder()
          .setIdempotencyKey(idempotencyKey)
          .build());
```

```javascript
const stripe = new Stripe('{{YOUR_API_KEY}}');

const idempotencyKey = 'unique-idempotency-key';
const result = await stripe.v2.examples.create({
    name: 'My example'
}, {idempotencyKey: idempotencyKey});
```

```python
client = stripe.StripeClient('{{YOUR_API_KEY}}')

idempotency_key = 'unique-idempotency-key'
example = client.v2.examples.create(
    { 'name': 'My example' },
    { 'idempotency_key': idempotency_key },
)
```

```dotnet
StripeClient stripe = new StripeClient("{{YOUR_API_KEY}}");

string idempotencyKey = "unique-idempotency-key";
var result = stripe.V2.Example.Create(
  new Stripe.V2.ExampleCreateOptions { Name = "My example" },
  new RequestOptions { IdempotencyKey = idempotencyKey };
);
```

```ruby
client = Stripe::StripeClient('{{YOUR_API_KEY}}')

idempotency_key = 'unique-idempotency-key'
result = client.v2.examples.create(
    { 'name': 'My example' },
    { 'idempotency_key': idempotency_key },
)
```

```php
$client = new \Stripe\StripeClient('{{YOUR_API_KEY}}');

$idempotencyKey = 'unique-idempotency-key';
$example = $client->v2->examples->create(
    [ 'name' => 'My example' ],
    [ 'idempotency_key' => $idempotencyKey ],
);
```

```go
sc := stripe.NewClient("{{YOUR_API_KEY}}")

idempotencyKey := "unique-idempotency-key"
sc.V2Examples.Create(context.TODO(), &stripe.V2ExampleCreateParams{
  Name: stripe.String("My example"),
  Params: stripe.Params{
    IdempotencyKey: stripe.String(idempotencyKey),
  },
})
```

If you’re not using a SDK or the CLI, requests can include the `Idempotency-Key` header:

```bash
curl https://api.stripe.com/v2/examples \
  -H "Authorization: Bearer {{YOUR_API_KEY}}" \
  -H "Stripe-Version: {{STRIPE_API_VERSION}}" \
  -H "Idempotency-Key: unique-idempotency-key" \
  -d <JSON request body>
```

## Limitations

- Test mode doesn’t support /v2; however, you can use a sandbox to test within this namespace.
- Currently, Stripe only generates thin events using /v2 endpoints and resources.
- You can only see request logs generated by API v2 in [Workbench](https://docs.stripe.com/workbench.md), not in the Developers Dashboard.