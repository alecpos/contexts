# How pagination works

Learn how to paginate results for list and search endpoints.

To learn about pagination with video tutorials, see [this playlist](https://www.youtube.com/playlist?list=PLy1nL-pvL2M7AvG4xrF6gmbSUW2FBUl9p).

The Stripe API has list and search endpoints that can return multiple objects, such as listing Customers or searching for PaymentIntents. To mitigate negative impacts to performance, these endpoints don’t return all results at once. Instead, Stripe returns one page of results per API call, with each page containing up to 10 results by default. Use the [limit](https://docs.stripe.com/api/pagination.md#pagination-limit) parameter to change the number of results per page.

For example, this is an API request to list Customers, with a `limit` of 3:

```dotnet
StripeConfiguration.ApiKey = "<<secret key>>";

var options = new CustomerListOptions { Limit = 3 };
var service = new CustomerService();
StripeList<Customer> customers = service.List(options);
```

```go
stripe.Key = "<<secret key>>"

params := &stripe.CustomerListParams{};
params.Limit = stripe.Int64(3)
result := customer.List(params);
```

```java
Stripe.apiKey = "<<secret key>>";

CustomerListParams params = CustomerListParams.builder().setLimit(3L).build();

CustomerCollection customers = Customer.list(params);
```

```node
const stripe = require('stripe')('<<secret key>>');

const customers = await stripe.customers.list({
  limit: 3,
});
```

```python
import stripe
stripe.api_key = "<<secret key>>"

customers = stripe.Customer.list(limit=3)
```

```php
$stripe = new \Stripe\StripeClient('<<secret key>>');

$customers = $stripe->customers->all(['limit' => 3]);
```

```ruby
Stripe.api_key = '<<secret key>>'

customers = Stripe::Customer.list({limit: 3})
```

The response from Stripe contains one page with 3 results:

```json
{
  "data": [
    {
      "id": "cus_005",
      "object": "customer",
      "name": "John Doe",
    },
    {
      "id": "cus_004",
      "object": "customer",
      "name": "Jane Doe",
    },
    {
      "id": "cus_003",
      "object": "customer",
      "name": "Jenny Rosen",
    },
  ],
  "has_more": true,
  /* ... */
}
```

Keep in mind the following details when using these endpoints:

- Objects are inside the `data` property.
- Objects are in reverse chronological order, meaning the most recently created object is the first one.
- The `has_more` property indicates if there are additional objects that weren’t returned in this request.

Instead of looping over the `data` array to go through objects, you should paginate results. This prevents you from missing some objects when the [has_more](https://docs.stripe.com/api/pagination.md#pagination-has_more) parameter is `true`.

## Auto-pagination

To retrieve all objects, use the auto-pagination feature. This automatically makes multiple API calls until `has_more` becomes `false`.

```ruby
customers = Stripe::Customer.list()

customers.auto_paging_each do |customer|
    # Do something with customer
end
```

```python
customers = stripe.Customer.list()

for customer in customers.auto_paging_iter():
    # Do something with customer
```

```php
$customers = $stripe->customers->all();

foreach ($customers->autoPagingIterator() as $customer) {
    // Do something with customer
}
```

```java
Map<String, Object> customerParams = new HashMap<>();
Iterable<Customers> itCustomers = Customer.list(customerParams).autoPagingIterable();

for (Customer customer : itCustomers) {
    // Do something with customer
}
```

```javascript
const customers = stripe.customers.list();

// In Node 10+:
for await (const customer of customers) {
    // Do something with customer
}
// In other environments:
customers.autoPagingEach(customer => {
    // Do something with customer
});
```

```go
params := &stripe.CustomerListParams{}
i := customer.List(params)

for i.Next() {
    // Do something with customer
}
```

```dotnet
var service = new CustomerService();

// Synchronously paginate
foreach (var customer in service.ListAutoPaging()) {
    // Do something with customer
}

// Asynchronously paginate
await foreach (var customer in service.ListAutoPagingAsync()) {
    // Do something with customer
}
```

When using auto-pagination with a list endpoint and setting [ending_before](https://docs.stripe.com/api/pagination.md#pagination-ending_before), the results are in chronological order, meaning the most recently created customer is the last one.

## Manual pagination

Follow these steps to manually paginate results. This process is different when calling a list endpoint or a search endpoint.

1. Make an API call to list the objects that you want to find.

```dotnet
StripeConfiguration.ApiKey = "<<secret key>>";

var service = new CustomerService();
StripeList<Customer> customers = service.List();
```

```go
stripe.Key = "<<secret key>>"

params := &stripe.CustomerListParams{};
result := customer.List(params);
```

```java
Stripe.apiKey = "<<secret key>>";

CustomerListParams params = CustomerListParams.builder().build();

CustomerCollection customers = Customer.list(params);
```

```node
const stripe = require('stripe')('<<secret key>>');

const customers = await stripe.customers.list();
```

```python
import stripe
stripe.api_key = "<<secret key>>"

customers = stripe.Customer.list()
```

```php
$stripe = new \Stripe\StripeClient('<<secret key>>');

$customers = $stripe->customers->all([]);
```

```ruby
Stripe.api_key = '<<secret key>>'

customers = Stripe::Customer.list()
```

2. In the response, check the value of [has_more](https://docs.stripe.com/api/pagination.md#pagination-has_more):

- If the value is `false`, you’ve retrieved all the objects.
- If the value is `true`, get the ID of the last object returned, and make a new API call with the [starting_after](https://docs.stripe.com/api/pagination.md#pagination-starting_after) parameter set.

Repeat this step until you’ve retrieved all of the objects that you want to find.

```dotnet
StripeConfiguration.ApiKey = "<<secret key>>";

var options = new CustomerListOptions { StartingAfter = "{{LAST_CUSTOMER_ID}}" };
var service = new CustomerService();
StripeList<Customer> customers = service.List(options);
```

```go
stripe.Key = "<<secret key>>"

params := &stripe.CustomerListParams{};
params.StartingAfter = stripe.String("{{LAST_CUSTOMER_ID}}")
result := customer.List(params);
```

```java
Stripe.apiKey = "<<secret key>>";

CustomerListParams params =
  CustomerListParams.builder().setStartingAfter("{{LAST_CUSTOMER_ID}}").build();

CustomerCollection customers = Customer.list(params);
```

```node
const stripe = require('stripe')('<<secret key>>');

const customers = await stripe.customers.list({
  starting_after: '{{LAST_CUSTOMER_ID}}',
});
```

```python
import stripe
stripe.api_key = "<<secret key>>"

customers = stripe.Customer.list(starting_after="{{LAST_CUSTOMER_ID}}")
```

```php
$stripe = new \Stripe\StripeClient('<<secret key>>');

$customers = $stripe->customers->all(['starting_after' => '{{LAST_CUSTOMER_ID}}']);
```

```ruby
Stripe.api_key = '<<secret key>>'

customers = Stripe::Customer.list({starting_after: '{{LAST_CUSTOMER_ID}}'})
```

1. Make an API call to list the objects that you want to find.

```dotnet
StripeConfiguration.ApiKey = "<<secret key>>";

var options = new CustomerSearchOptions { Query = "metadata['foo']:'bar'" };
var service = new CustomerService();
StripeSearchResult<Customer> customers = service.Search(options);
```

```go
stripe.Key = "<<secret key>>"

params := &stripe.CustomerSearchParams{
  SearchParams: stripe.SearchParams{Query: "metadata['foo']:'bar'"},
};
result := customer.Search(params);
```

```java
Stripe.apiKey = "<<secret key>>";

CustomerSearchParams params =
  CustomerSearchParams.builder().setQuery("metadata['foo']:'bar'").build();

CustomerSearchResult customers = Customer.search(params);
```

```node
const stripe = require('stripe')('<<secret key>>');

const customers = await stripe.customers.search({
  query: 'metadata[\'foo\']:\'bar\'',
});
```

```python
import stripe
stripe.api_key = "<<secret key>>"

customers = stripe.Customer.search(query="metadata['foo']:'bar'")
```

```php
$stripe = new \Stripe\StripeClient('<<secret key>>');

$customers = $stripe->customers->search(['query' => 'metadata[\'foo\']:\'bar\'']);
```

```ruby
Stripe.api_key = '<<secret key>>'

customers = Stripe::Customer.search({query: 'metadata[\'foo\']:\'bar\''})
```

2. In the response, check the value of [has_more](https://docs.stripe.com/api/pagination/search.md#search_pagination-has_more):

- If the value is `false`, you retrieved all the objects.
- If the value is `true`, get the `next_page` property from the response, and make a new API call with the [page](https://docs.stripe.com/api/pagination/search.md#search_pagination-page) parameter set.

Repeat this step until you’ve retrieved all of the objects that you want to find.

```dotnet
StripeConfiguration.ApiKey = "<<secret key>>";

var options = new CustomerSearchOptions
{
    Query = "metadata['foo']:'bar'",
    Page = "{{NEXT_PAGE_ID}}",
};
var service = new CustomerService();
StripeSearchResult<Customer> customers = service.Search(options);
```

```go
stripe.Key = "<<secret key>>"

params := &stripe.CustomerSearchParams{
  Page: stripe.String("{{NEXT_PAGE_ID}}"),
  SearchParams: stripe.SearchParams{Query: "metadata['foo']:'bar'"},
};
result := customer.Search(params);
```

```java
Stripe.apiKey = "<<secret key>>";

CustomerSearchParams params =
  CustomerSearchParams.builder()
    .setQuery("metadata['foo']:'bar'")
    .setPage("{{NEXT_PAGE_ID}}")
    .build();

CustomerSearchResult customers = Customer.search(params);
```

```node
const stripe = require('stripe')('<<secret key>>');

const customers = await stripe.customers.search({
  query: 'metadata[\'foo\']:\'bar\'',
  page: '{{NEXT_PAGE_ID}}',
});
```

```python
import stripe
stripe.api_key = "<<secret key>>"

customers = stripe.Customer.search(
  query="metadata['foo']:'bar'",
  page="{{NEXT_PAGE_ID}}",
)
```

```php
$stripe = new \Stripe\StripeClient('<<secret key>>');

$customers = $stripe->customers->search([
  'query' => 'metadata[\'foo\']:\'bar\'',
  'page' => '{{NEXT_PAGE_ID}}',
]);
```

```ruby
Stripe.api_key = '<<secret key>>'

customers = Stripe::Customer.search({
  query: 'metadata[\'foo\']:\'bar\'',
  page: '{{NEXT_PAGE_ID}}',
})
```