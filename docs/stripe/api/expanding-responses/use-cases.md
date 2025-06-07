# Use cases for expanding responses

Learn how the expand attribute helps you perform common tasks.

## See the Stripe fee for a given payment 

You can check the processing fees for a payment after the payment is processed and the balance transaction is created. Stripe automatically creates this [balance transaction](https://docs.stripe.com/api/balance_transactions/object.md#balance_transaction_object-fee_details) in the background. The `charge.updated` event includes a reference to the balance transaction through the `balance_transaction` property (for example, `txn_123`), indicating that the balance transaction has been created and is ready for use.

Instead of looking up the balance transaction separately, you can retrieve it in a single call using `expand`. For example:

```bash
curl https://api.stripe.com/v1/payment_intents/pi_1Gpl8kLHughnNhxyIb1RvRTu \
  -u <<secret key>>: \
  -d "expand[]"="latest_charge.balance_transaction" \
  -G
```

```ruby
<<setup key>>

payment_intent = Stripe::PaymentIntent.retrieve({
  id: 'pi_1Gpl8kLHughnNhxyIb1RvRTu',
  expand: ['latest_charge.balance_transaction'],
})

fee_details = payment_intent.latest_charge.balance_transaction.fee_details
```

```python
<<setup key>>

payment_intent = stripe.PaymentIntent.retrieve(
  'pi_1Gpl8kLHughnNhxyIb1RvRTu',
  expand=['latest_charge.balance_transaction'],
)

fee_details = payment_intent.latest_charge.balance_transaction.fee_details
```

```php
<<setup key>>

$paymentIntent = \Stripe\PaymentIntent::retrieve([
  'id' => 'pi_1Gpl8kLHughnNhxyIb1RvRTu',
  'expand' => ['latest_charge.balance_transaction'],
]);

$feeDetails = $paymentIntent->latest_charge->balance_transaction->fee_details;
```

```java
<<setup key>>

PaymentIntentRetrieveParams params =
  PaymentIntentRetrieveParams.builder()
    .addExpand("latest_charge.balance_transaction")
    .build();

PaymentIntent paymentIntent = PaymentIntent.retrieve("pi_1Gpl8kLHughnNhxyIb1RvRTu", params, null);

List<BalanceTransaction.Fee> feeDetails = paymentIntent.getLatestCharge().getBalanceTransactionObject().getFeeDetails();
```

```javascript
<<setup key>>

const paymentIntent = await stripe.paymentIntents.retrieve(
  'pi_1Gpl8kLHughnNhxyIb1RvRTu',
  {
    expand: ['latest_charge.balance_transaction'],
  }
);

const feeDetails = paymentIntent.latest_charge.balance_transaction.fee_details;
```

```go
<<setup key>>

params := &stripe.PaymentIntentParams{}
params.AddExpand("latest_charge.balance_transaction")

pi, _ := paymentintent.Get("pi_1Gpl8kLHughnNhxyIb1RvRTu", params)

feeDetails := pi.LatestCharge.BalanceTransaction.FeeDetails
```

```dotnet
<<setup key>>

var options = new PaymentIntentGetOptions();
options.AddExpand("latest_charge.balance_transaction");

var service = new PaymentIntentService();
PaymentIntent paymentIntent = service.Get("pi_1Gpl8kLHughnNhxyIb1RvRTu", options);

List<BalanceTransactionFeeDetail> feeDetails = paymentIntent.LatestCharge.BalanceTransaction.FeeDetails;
```

Users on API version [2022-08-01](https://docs.stripe.com/upgrades.md#2022-08-01) or older:

```bash
curl https://api.stripe.com/v1/payment_intents/pi_1Gpl8kLHughnNhxyIb1RvRTu \
  -u <<secret key>>: \
  -d "expand[]"="charges.data.balance_transaction" \
  -G
```

```ruby
<<setup key>>

payment_intent = Stripe::PaymentIntent.retrieve({
  id: 'pi_1Gpl8kLHughnNhxyIb1RvRTu',
  expand: ['charges.data.balance_transaction'],
})

fee_details = payment_intent.charges.data[0].balance_transaction.fee_details
```

```python
<<setup key>>

payment_intent = stripe.PaymentIntent.retrieve(
  'pi_1Gpl8kLHughnNhxyIb1RvRTu',
  expand=['charges.data.balance_transaction'],
)

fee_details = payment_intent.charges.data[0].balance_transaction.fee_details
```

```php
<<setup key>>

$paymentIntent = \Stripe\PaymentIntent::retrieve([
  'id' => 'pi_1Gpl8kLHughnNhxyIb1RvRTu',
  'expand' => ['charges.data.balance_transaction'],
]);

$feeDetails = $paymentIntent->charges->data[0]->balance_transaction->fee_details;
```

```java
<<setup key>>

PaymentIntentRetrieveParams params =
  PaymentIntentRetrieveParams.builder()
    .addExpand("charges.data.balance_transaction")
    .build();

PaymentIntent paymentIntent = PaymentIntent.retrieve("pi_1Gpl8kLHughnNhxyIb1RvRTu", params, null);

List<BalanceTransaction.Fee> feeDetails = paymentIntent.getCharges().getData().get(0).getBalanceTransactionObject().getFeeDetails();
```

```javascript
<<setup key>>

const paymentIntent = await stripe.paymentIntents.retrieve(
  'pi_1Gpl8kLHughnNhxyIb1RvRTu',
  {
    expand: ['charges.data.balance_transaction'],
  }
);

const feeDetails = paymentIntent.charges.data[0].balance_transaction.fee_details;
```

```go
<<setup key>>

params := &stripe.PaymentIntentParams{}
params.AddExpand("charges.data.balance_transaction")

pi, _ := paymentintent.Get("pi_1Gpl8kLHughnNhxyIb1RvRTu", params)

feeDetails := pi.Charges.Data[0].BalanceTransaction.FeeDetails
```

```dotnet
<<setup key>>

var options = new PaymentIntentGetOptions();
options.AddExpand("charges.data.balance_transaction");

var service = new PaymentIntentService();
PaymentIntent paymentIntent = service.Get("pi_1Gpl8kLHughnNhxyIb1RvRTu", options);

List<BalanceTransactionFeeDetail> feeDetails = paymentIntent.Charges.Data[0].BalanceTransaction.FeeDetails;
```

A payment intent must be [captured](https://docs.stripe.com/payments/place-a-hold-on-a-payment-method.md#capture-funds) and have a [status](https://docs.stripe.com/api/payment_intents/object.md#payment_intent_object-status) of `succeeded` for the Stripe fees to be available.

## See the charges included in a payout 

Every automatic *payout* is tied to historical changes to the balance of your Stripe account. The API records these historical changes as [balance transactions](https://docs.stripe.com/api/balance_transactions/object.md), which you can retrieve using [List Balance Transactions](https://docs.stripe.com/api/balance_transactions/list.md). From a list of balance transactions, you can expand the [source](https://docs.stripe.com/api/balance_transactions/object.md#balance_transaction_object-source) property to gather information on what triggered the change to the account balance (Charge, Refund, Transfer, and so on). For example:

```bash
curl https://api.stripe.com/v1/balance_transactions \
  -u <<secret key>>: \
  -d payout=po_1Gl3ZLLHughnNhxyDrOia0vI \
  -d type=charge \
  -d "expand[]"="data.source" \
  -G
```

```ruby
<<setup key>>

balance_transactions = Stripe::BalanceTransaction.list({
  payout: 'po_1Gl3ZLLHughnNhxyDrOia0vI',
  type: 'charge',
  expand: ['data.source'],
})

balance_transactions.data.each do |txn|
  charge = txn.source
  puts "\#{charge.id} \#{charge.amount} \#{charge.currency}"
end
```

```python
<<setup key>>

balance_transactions = stripe.BalanceTransaction.list(
  payout='po_1Gl3ZLLHughnNhxyDrOia0vI',
  type='charge',
  expand=['data.source'],
)

for txn in balance_transactions.data:
  charge = txn.source
  print(charge.id, charge.amount, charge.currency)
```

```php
<<setup key>>

$balanceTransactions = \Stripe\BalanceTransaction::all([
  'payout' => 'po_1Gl3ZLLHughnNhxyDrOia0vI',
  'type' => 'charge',
  'expand' => ['data.source'],
]);

foreach ($balanceTransactions->data as $txn) {
  $charge = $txn->source;
  echo "{$charge->id} {$charge->amount} {$charge->currency}\\n";
}
```

```java
<<setup key>>

BalanceTransactionListParams params =
  BalanceTransactionListParams.builder()
    .setPayout("po_1Gl3ZLLHughnNhxyDrOia0vI")
    .setType("charge")
    .addExpand("data.source")
    .build();

BalanceTransactionCollection balanceTransactions = BalanceTransaction.list(params);

for (BalanceTransaction txn : balanceTransactions.getData()) {
  Charge charge = (Charge) txn.getSourceObject();
  System.out.printf("%s %s %s\\n", charge.getId(), charge.getAmount(), charge.getCurrency());
}
```

```javascript
<<setup key>>

const balanceTransactions = await stripe.balanceTransactions.list({
  payout: 'po_1Gl3ZLLHughnNhxyDrOia0vI',
  type: 'charge',
  expand: ['data.source'],
});

const charges = balanceTransactions.data.map((txn) => txn.source);
```

```go
<<setup key>>

params := &stripe.BalanceTransactionListParams{
  Payout: stripe.String("po_1Gl3ZLLHughnNhxyDrOia0vI"),
  Type:   stripe.String(string(stripe.BalanceTransactionTypeCharge)),
}
params.AddExpand("data.source")

i := balancetransaction.List(params)
for i.Next() {
  bt := i.BalanceTransaction()
  ch := bt.Source.Charge

  fmt.Println(ch.ID, ch.Amount, ch.Currency)
}
```

```dotnet
<<setup key>>

var options = new BalanceTransactionListOptions
{
  Payout = "po_1Gl3ZLLHughnNhxyDrOia0vI",
  Type = "charge",
};
options.AddExpand("data.source");

var service = new BalanceTransactionService();
StripeList<BalanceTransaction> balanceTransactions = service.List(options);

foreach (BalanceTransaction txn in balanceTransactions.Data)
{
  Charge charge = (Charge)txn.Source;
  Console.WriteLine($"{charge.Id} {charge.Amount} {charge.Currency}");
}
```

You can only retrieve balance transaction history on _automatic_ payouts. If you have manual payouts enabled, you must track transaction history on your own.

Learn more about [payout reconciliation](https://docs.stripe.com/payouts/reconciliation.md).

If you’re using *Connect* with destination charges, you can retrieve the same information on behalf of your connected accounts. One difference is that destination charges involve both a transfer and a linked payment (in the form of a Charge object) to move funds to a connected account. So when listing the balance transactions bundled in your connected account’s payouts, each balance transaction’s source is linked to the transfer’s payment rather than the originating Charge. To retrieve the originating Charge, you need to expand a payment’s linked transfer through the [source_transfer](https://docs.stripe.com/api/charges/object.md#charge_object-source_transfer) property; and from there, expand the transfer’s [source_transaction](https://docs.stripe.com/api/transfers/object.md#transfer_object-source_transaction) property:

```bash
curl https://api.stripe.com/v1/balance_transactions \
  -u <<secret key>>: \
  -d payout=po_1G7bnaD2wdkPsFGzdVOqU44u \
  -d type=payment \
  -d "expand[]"="data.source.source_transfer.source_transaction" \
  -H "Stripe-Account: acct_1G7PaoD2wdkPsFGz" \
  -G
```

```ruby
<<setup key>>

balance_transactions = Stripe::BalanceTransaction.list({
  payout: 'po_1G7bnaD2wdkPsFGzdVOqU44u',
  type: 'payment',
  expand: ['data.source.source_transfer.source_transaction'],
}, {
  stripe_account: 'acct_1G7PaoD2wdkPsFGz',
})

balance_transactions.data.each do |txn|
  charge = txn.source.source_transfer.source_transaction
  puts "\#{charge.id} \#{charge.amount} \#{charge.currency}"
end
```

```python
<<setup key>>

balance_transactions = stripe.BalanceTransaction.list(
  payout='po_1G7bnaD2wdkPsFGzdVOqU44u',
  type='payment',
  expand=['data.source.source_transfer.source_transaction'],
  stripe_account='acct_1G7PaoD2wdkPsFGz',
)

for txn in balance_transactions.data:
  charge = txn.source.source_transfer.source_transaction
  print(charge.id, charge.amount, charge.currency)
```

```php
<<setup key>>

$balanceTransactions = \Stripe\BalanceTransaction::all([
  'payout' => 'po_1G7bnaD2wdkPsFGzdVOqU44u',
  'type' => 'payment',
  'expand' => ['data.source.source_transfer.source_transaction'],
], [
  'stripe_account' => 'acct_1G7PaoD2wdkPsFGz',
]);

foreach ($balanceTransactions->data as $txn) {
  $charge = $txn->source->source_transfer->source_transaction;
  echo "{$charge->id} {$charge->amount} {$charge->currency}\\n";
}
```

```java
<<setup key>>

BalanceTransactionListParams params =
  BalanceTransactionListParams.builder()
    .setPayout("po_1G7bnaD2wdkPsFGzdVOqU44u")
    .setType("payment")
    .addExpand("data.source.source_transfer.source_transaction")
    .build();

RequestOptions requestOptions =
  RequestOptions.builder()
    .setStripeAccount("acct_1G7PaoD2wdkPsFGz")
    .build();

BalanceTransactionCollection balanceTransactions = BalanceTransaction.list(params, requestOptions);

for (BalanceTransaction txn : balanceTransactions.getData()) {
  Charge payment = (Charge) txn.getSourceObject();
  Transfer sourceTransfer = payment.getSourceTransferObject();
  Charge charge = (Charge) sourceTransfer.getSourceTransactionObject();
  System.out.printf("%s %s %s\\n", charge.getId(), charge.getAmount(), charge.getCurrency());
}
```

```javascript
<<setup key>>

const balanceTransactions = await stripe.balanceTransactions.list(
  {
    payout: 'po_1G7bnaD2wdkPsFGzdVOqU44u',
    type: 'payment',
    expand: ['data.source.source_transfer.source_transaction'],
  },
  {
    stripeAccount: 'acct_1G7PaoD2wdkPsFGz',
  }
);

const charges = balanceTransactions.data.map(
  (txn) => txn.source.source_transfer.source_transaction
);
```

```go
<<setup key>>

params := &stripe.BalanceTransactionListParams{
  Payout: stripe.String("po_1G7bnaD2wdkPsFGzdVOqU44u"),
  Type:   stripe.String(string(stripe.BalanceTransactionTypePayment)),
}
params.AddExpand("data.source.source_transfer.source_transaction")
params.SetStripeAccount("acct_1G7PaoD2wdkPsFGz")

i := balancetransaction.List(params)
for i.Next() {
  bt := i.BalanceTransaction()
  ch := bt.Source.Charge.SourceTransfer.SourceTransaction.Charge

  fmt.Println(ch.ID, ch.Amount, ch.Currency)
}
```

```dotnet
<<setup key>>

var options = new BalanceTransactionListOptions
{
  Payout = "po_1G7bnaD2wdkPsFGzdVOqU44u",
  Type = "payment",
};
options.AddExpand("data.source.source_transfer.source_transaction");

var requestOptions = new RequestOptions
{
  StripeAccount = "acct_1G7PaoD2wdkPsFGz",
};

var service = new BalanceTransactionService();
StripeList<BalanceTransaction> balanceTransactions = service.List(
  options,
  requestOptions
);

foreach (BalanceTransaction txn in balanceTransactions.Data)
{
  Charge payment = (Charge)txn.Source;
  Transfer sourceTransfer = (Transfer)payment.SourceTransfer;
  Charge charge = (Charge)sourceTransfer.SourceTransaction;
  Console.WriteLine($"{charge.Id} {charge.Amount} {charge.Currency}");
}
```