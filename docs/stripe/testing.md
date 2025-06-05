# Testing

Simulate payments to test your integration.

To confirm that your integration works correctly, simulate transactions without moving any money using special values while in *test mode* or *Sandboxes*.

Test cards function as fake credit cards and let you simulate several scenarios:

* Successful payments by [card brand](#cards) or [country](#international-cards)
* Card errors due to [declines](#declined-payments), [fraud](#fraud-prevention), or [invalid data](#invalid-data)
* [Disputes](#disputes) and [refunds](https://docs.stripe.com/testing.md#refunds)
* Authentication with [3D Secure](#regulatory-cards) and [PINs](#terminal)

Testing non-card payments works similarly. [Each payment method](#non-card-payments) has its own special values. Because of [rate limits](https://docs.stripe.com/testing.md#rate-limits), we don’t recommend that you use testing environments to load-test your integration. Instead, see [load testing](https://docs.stripe.com/rate-limits.md#load-testing).

## How to use test cards 

Any time you work with a test card, use [test API keys](https://docs.stripe.com/keys.md#obtain-api-keys) in all API calls. This is true whether you’re serving a payment form to test interactively or writing test code.

Don’t use real card details. The [Stripe Services Agreement](https://stripe.com/legal/ssa#1-your-stripe-account) prohibits testing in live mode using real payment method details. Use your test API keys and the card numbers below.

### Testing interactively

When testing interactively, use a card number, such as [4242 4242 4242 4242](https://docs.stripe.com/testing.md?testing-method=card-numbers#visa).  Enter the card number in the Dashboard or in any payment form.

* Use a valid future date, such as **12/34**.
* Use any three-digit CVC (four digits for American Express cards).
* Use any value you like for other form fields.

![An example payment form showing how to enter a test card number. The card number is "4242 4242 4242 4242", the expiration date is "12/34", and the CVC is "567". Other fields have arbitrary values. For instance, the email address is "test@example.com"](images/docs-core/test-card.jpg)
Testing a form interactively with the test card number 4242 4242 4242 4242


### Test code

When writing test code, use a `PaymentMethod` such as [pm_card_visa](https://docs.stripe.com/testing.md?testing-method=payment-methods#visa) instead of a card number. We don’t recommend using card numbers directly in API calls or server-side code, even in testing environments. If you do use them, your code might not be PCI-compliant when you go live. By default, a `PaymentMethod` isn’t attached to a *Customer*.

```dotnet
StripeConfiguration.ApiKey = "<<secret key>>";

var options = new PaymentIntentCreateOptions
{
    Amount = 500,
    Currency = "gbp",
    PaymentMethod = "pm_card_visa",
    PaymentMethodTypes = new List<string> { "card" },
};
var service = new PaymentIntentService();
PaymentIntent paymentIntent = service.Create(options);
```

```go
stripe.Key = "<<secret key>>"

params := &stripe.PaymentIntentParams{
  Amount: stripe.Int64(500),
  Currency: stripe.String(string(stripe.CurrencyGBP)),
  PaymentMethod: stripe.String("pm_card_visa"),
  PaymentMethodTypes: []*string{stripe.String("card")},
};
result, err := paymentintent.New(params);
```

```java
Stripe.apiKey = "<<secret key>>";

PaymentIntentCreateParams params =
  PaymentIntentCreateParams.builder()
    .setAmount(500L)
    .setCurrency("gbp")
    .setPaymentMethod("pm_card_visa")
    .addPaymentMethodType("card")
    .build();

PaymentIntent paymentIntent = PaymentIntent.create(params);
```

```node
const stripe = require('stripe')('<<secret key>>');

const paymentIntent = await stripe.paymentIntents.create({
  amount: 500,
  currency: 'gbp',
  payment_method: 'pm_card_visa',
  payment_method_types: ['card'],
});
```

```python
import stripe
stripe.api_key = "<<secret key>>"

payment_intent = stripe.PaymentIntent.create(
  amount=500,
  currency="gbp",
  payment_method="pm_card_visa",
  payment_method_types=["card"],
)
```

```php
$stripe = new \Stripe\StripeClient('<<secret key>>');

$paymentIntent = $stripe->paymentIntents->create([
  'amount' => 500,
  'currency' => 'gbp',
  'payment_method' => 'pm_card_visa',
  'payment_method_types' => ['card'],
]);
```

```ruby
Stripe.api_key = '<<secret key>>'

payment_intent = Stripe::PaymentIntent.create({
  amount: 500,
  currency: 'gbp',
  payment_method: 'pm_card_visa',
  payment_method_types: ['card'],
})
```

Most integrations don’t use Tokens anymore, but we make test Tokens such as [tok_visa](https://docs.stripe.com/testing.md?testing-method=tokens#visa) available if you need them.

When you’re ready to take your integration live, replace your test publishable and secret [API keys](https://docs.stripe.com/keys.md) with live ones. You can’t process live payments if your integration is still using your test API keys.

## Cards by brand 

To simulate a successful payment for a specific card brand, use test cards from the following list.

Cross-border fees are assessed based on the country of the card issuer. Cards where the issuer country isn’t the US (such as JCB and UnionPay) might be subject to a cross-border fee, even in testing environments.

| Brand                       | Number              | CVC          | Date            |
| --------------------------- | ------------------- | ------------ | --------------- |
| Visa                        | 4242424242424242    | Any 3 digits | Any future date |
| Visa (debit)                | 4000056655665556    | Any 3 digits | Any future date |
| Mastercard                  | 5555555555554444    | Any 3 digits | Any future date |
| Mastercard (2-series)       | 2223003122003222    | Any 3 digits | Any future date |
| Mastercard (debit)          | 5200828282828210    | Any 3 digits | Any future date |
| Mastercard (prepaid)        | 5105105105105100    | Any 3 digits | Any future date |
| American Express            | 378282246310005     | Any 4 digits | Any future date |
| American Express            | 371449635398431     | Any 4 digits | Any future date |
| Discover                    | 6011111111111117    | Any 3 digits | Any future date |
| Discover                    | 6011000990139424    | Any 3 digits | Any future date |
| Discover (debit)            | 6011981111111113    | Any 3 digits | Any future date |
| Diners Club                 | 3056930009020004    | Any 3 digits | Any future date |
| Diners Club (14-digit card) | 36227206271667      | Any 3 digits | Any future date |
| BCcard and DinaCard         | 6555900000604105    | Any 3 digits | Any future date |
| JCB                         | 3566002020360505    | Any 3 digits | Any future date |
| UnionPay                    | 6200000000000005    | Any 3 digits | Any future date |
| UnionPay (debit)            | 6200000000000047    | Any 3 digits | Any future date |
| UnionPay (19-digit card)    | 6205500000000000004 | Any 3 digits | Any future date |

| Brand                | PaymentMethod                |
| -------------------- | ---------------------------- |
| Visa                 | `pm_card_visa`               |
| Visa (debit)         | `pm_card_visa_debit`         |
| Mastercard           | `pm_card_mastercard`         |
| Mastercard (debit)   | `pm_card_mastercard_debit`   |
| Mastercard (prepaid) | `pm_card_mastercard_prepaid` |
| American Express     | `pm_card_amex`               |
| Discover             | `pm_card_discover`           |
| Diners Club          | `pm_card_diners`             |
| JCB                  | `pm_card_jcb`                |
| UnionPay             | `pm_card_unionpay`           |

| Brand                | Token                    |
| -------------------- | ------------------------ |
| Visa                 | `tok_visa`               |
| Visa (debit)         | `tok_visa_debit`         |
| Mastercard           | `tok_mastercard`         |
| Mastercard (debit)   | `tok_mastercard_debit`   |
| Mastercard (prepaid) | `tok_mastercard_prepaid` |
| American Express     | `tok_amex`               |
| Discover             | `tok_discover`           |
| Diners Club          | `tok_diners`             |
| JCB                  | `tok_jcb`                |
| UnionPay             | `tok_unionpay`           |

Most Cartes Bancaires and eftpos cards are co-branded with either Visa or Mastercard. The test cards in the following table simulate successful payments with co-branded cards.

| Brand/Co-brand              | Number           | CVC          | Date            |
| --------------------------- | ---------------- | ------------ | --------------- |
| Cartes Bancaires/Visa       | 4000002500001001 | Any 3 digits | Any future date |
| Cartes Bancaires/Mastercard | 5555552500001001 | Any 3 digits | Any future date |
| eftpos Australia/Visa       | 4000050360000001 | Any 3 digits | Any future date |
| eftpos Australia/Mastercard | 5555050360000080 | Any 3 digits | Any future date |

| Brand                       | PaymentMethod                                |
| --------------------------- | -------------------------------------------- |
| Cartes Bancaires/Visa       | `pm_card_visa_cartesBancaires`               |
| Cartes Bancaires/Mastercard | `pm_card_mastercard_cartesBancaires`         |
| eftpos Australia/Visa       | `pm_card_visa_debit_eftposAuCoBranded`       |
| eftpos Australia/Mastercard | `pm_card_mastercard_debit_eftposAuCoBranded` |

| Brand                       | Token                                    |
| --------------------------- | ---------------------------------------- |
| Cartes Bancaires/Visa       | `tok_visa_cartesBancaires`               |
| Cartes Bancaires/Mastercard | `tok_mastercard_cartesBancaires`         |
| eftpos Australia/Visa       | `tok_visa_debit_eftposAuCoBranded`       |
| eftpos Australia/Mastercard | `tok_mastercard_debit_eftposAuCoBranded` |

## Cards by country 

To simulate successful payments from specific countries, use test cards from the following sections.

| Country                                                                                                                                                                                                                                                                                                                                                                                                             | Number           | Brand         |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------- | ------------- |
| **AMERICAS**                                                                                                                                                                                                                                                                                                                                                                                                        |
| United States (US)                                                                                                                                                                                                                                                                                                                                                                                                  | 4242424242424242 | Visa          |
| Argentina (AR)                                                                                                                                                                                                                                                                                                                                                                                                      | 4000000320000021 | Visa          |
| Brazil (BR)                                                                                                                                                                                                                                                                                                                                                                                                         | 4000000760000002 | Visa          |
| Canada (CA)                                                                                                                                                                                                                                                                                                                                                                                                         | 4000001240000000 | Visa          |
| Chile (CL)                                                                                                                                                                                                                                                                                                                                                                                                          | 4000001520000001 | Visa          |
| Colombia (CO)                                                                                                                                                                                                                                                                                                                                                                                                       | 4000001700000003 | Visa          |
| Costa Rica (CR)                                                                                                                                                                                                                                                                                                                                                                                                     | 4000001880000005 | Visa          |
| Ecuador (EC)                                                                                                                                                                                                                                                                                                                                                                                                        | 4000002180000000 | Visa          |
| Mexico (MX)                                                                                                                                                                                                                                                                                                                                                                                                         | 4000004840008001 | Visa          |
| Mexico (MX)                                                                                                                                                                                                                                                                                                                                                                                                         | 5062210000000009 | Carnet        |
| Panama (PA)                                                                                                                                                                                                                                                                                                                                                                                                         | 4000005910000000 | Visa          |
| Paraguay (PY)                                                                                                                                                                                                                                                                                                                                                                                                       | 4000006000000066 | Visa          |
| Peru (PE)                                                                                                                                                                                                                                                                                                                                                                                                           | 4000006040000068 | Visa          |
| Uruguay (UY)                                                                                                                                                                                                                                                                                                                                                                                                        | 4000008580000003 | Visa          |
| **EUROPE and MIDDLE EAST**  
  *Strong Customer Authentication* regulations require *3D Secure* authentication for online payments within the *European Economic Area*. The test cards in this section simulate a payment that succeeds without authentication. We recommend also testing scenarios that involve authentication, using [3D Secure test cards](https://docs.stripe.com/testing.md#regulatory-cards). |
| Austria (AT)                                                                                                                                                                                                                                                                                                                                                                                                        | 4000000400000008 | Visa          |
| Belgium (BE)                                                                                                                                                                                                                                                                                                                                                                                                        | 4000000560000004 | Visa          |
| Bulgaria (BG)                                                                                                                                                                                                                                                                                                                                                                                                       | 4000001000000000 | Visa          |
| Belarus (BY)                                                                                                                                                                                                                                                                                                                                                                                                        | 4000001120000005 | Visa          |
| Cyprus (CY)                                                                                                                                                                                                                                                                                                                                                                                                         | 4000001960000008 | Visa          |
| Czech Republic (CZ)                                                                                                                                                                                                                                                                                                                                                                                                 | 4000002030000002 | Visa          |
| Denmark (DK)                                                                                                                                                                                                                                                                                                                                                                                                        | 4000002080000001 | Visa          |
| Finland (FI)                                                                                                                                                                                                                                                                                                                                                                                                        | 4000002460000001 | Visa          |
| France (FR)                                                                                                                                                                                                                                                                                                                                                                                                         | 4000002500000003 | Visa          |
| Germany (DE)                                                                                                                                                                                                                                                                                                                                                                                                        | 4000002760000016 | Visa          |
| Greece (GR)                                                                                                                                                                                                                                                                                                                                                                                                         | 4000003000000030 | Visa          |
| Hungary (HU)                                                                                                                                                                                                                                                                                                                                                                                                        | 4000003480000005 | Visa          |
| Ireland (IE)                                                                                                                                                                                                                                                                                                                                                                                                        | 4000003720000005 | Visa          |
| Italy (IT)                                                                                                                                                                                                                                                                                                                                                                                                          | 4000003800000008 | Visa          |
| Latvia (LV)                                                                                                                                                                                                                                                                                                                                                                                                         | 4000004280000005 | Visa          |
| Lithuania (LT)                                                                                                                                                                                                                                                                                                                                                                                                      | 4000004400000000 | Visa          |
| Luxembourg (LU)                                                                                                                                                                                                                                                                                                                                                                                                     | 4000004420000006 | Visa          |
| Malta (MT)                                                                                                                                                                                                                                                                                                                                                                                                          | 4000004700000007 | Visa          |
| Netherlands (NL)                                                                                                                                                                                                                                                                                                                                                                                                    | 4000005280000002 | Visa          |
| Norway (NO)                                                                                                                                                                                                                                                                                                                                                                                                         | 4000005780000007 | Visa          |
| Poland (PL)                                                                                                                                                                                                                                                                                                                                                                                                         | 4000006160000005 | Visa          |
| Portugal (PT)                                                                                                                                                                                                                                                                                                                                                                                                       | 4000006200000007 | Visa          |
| Romania (RO)                                                                                                                                                                                                                                                                                                                                                                                                        | 4000006420000001 | Visa          |
| Saudi Arabia (SA)                                                                                                                                                                                                                                                                                                                                                                                                   | 4000006820000007 | Visa          |
| Slovenia (SI)                                                                                                                                                                                                                                                                                                                                                                                                       | 4000007050000006 | Visa          |
| Slovakia (SK)                                                                                                                                                                                                                                                                                                                                                                                                       | 4000007030000001 | Visa          |
| Spain (ES)                                                                                                                                                                                                                                                                                                                                                                                                          | 4000007240000007 | Visa          |
| Sweden (SE)                                                                                                                                                                                                                                                                                                                                                                                                         | 4000007520000008 | Visa          |
| Switzerland (CH)                                                                                                                                                                                                                                                                                                                                                                                                    | 4000007560000009 | Visa          |
| United Kingdom (GB)                                                                                                                                                                                                                                                                                                                                                                                                 | 4000008260000000 | Visa          |
| United Kingdom (GB)                                                                                                                                                                                                                                                                                                                                                                                                 | 4000058260000005 | Visa (debit)  |
| United Kingdom (GB)                                                                                                                                                                                                                                                                                                                                                                                                 | 5555558265554449 | Mastercard    |
| **ASIA PACIFIC**  
  To test subscriptions that require mandates and pre-debit notifications, see [India recurring payments](https://docs.stripe.com/india-recurring-payments.md?integration=paymentIntents-setupIntents#testing).                                                                                                                                                                                  |
| Australia (AU)                                                                                                                                                                                                                                                                                                                                                                                                      | 4000000360000006 | Visa          |
| China (CN)                                                                                                                                                                                                                                                                                                                                                                                                          | 4000001560000002 | Visa          |
| Hong Kong (HK)                                                                                                                                                                                                                                                                                                                                                                                                      | 4000003440000004 | Visa          |
| India (IN)                                                                                                                                                                                                                                                                                                                                                                                                          | 4000003560000008 | Visa          |
| Japan (JP)                                                                                                                                                                                                                                                                                                                                                                                                          | 4000003920000003 | Visa          |
| Japan (JP)                                                                                                                                                                                                                                                                                                                                                                                                          | 3530111333300000 | JCB           |
| Malaysia (MY)                                                                                                                                                                                                                                                                                                                                                                                                       | 4000004580000002 | Visa          |
| New Zealand (NZ)                                                                                                                                                                                                                                                                                                                                                                                                    | 4000005540000008 | Visa          |
| Singapore (SG)                                                                                                                                                                                                                                                                                                                                                                                                      | 4000007020000003 | Visa          |
| Taiwan (TW)                                                                                                                                                                                                                                                                                                                                                                                                         | 4000001580000008 | Visa          |
| Thailand (TH)                                                                                                                                                                                                                                                                                                                                                                                                       | 4000007640000003 | Visa (credit) |
| Thailand (TH)                                                                                                                                                                                                                                                                                                                                                                                                       | 4000057640000008 | Visa (debit)  |

| Country                                                                                                                                                                                                                                                                                                                                                                                                             | PaymentMethod           | Brand         |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------- | ------------- |
| **AMERICAS**                                                                                                                                                                                                                                                                                                                                                                                                        |
| United States (US)                                                                                                                                                                                                                                                                                                                                                                                                  | `pm_card_us`            | Visa          |
| Argentina (AR)                                                                                                                                                                                                                                                                                                                                                                                                      | `pm_card_ar`            | Visa          |
| Brazil (BR)                                                                                                                                                                                                                                                                                                                                                                                                         | `pm_card_br`            | Visa          |
| Canada (CA)                                                                                                                                                                                                                                                                                                                                                                                                         | `pm_card_ca`            | Visa          |
| Chile (CL)                                                                                                                                                                                                                                                                                                                                                                                                          | `pm_card_cl`            | Visa          |
| Colombia (CO)                                                                                                                                                                                                                                                                                                                                                                                                       | `pm_card_co`            | Visa          |
| Costa Rica (CR)                                                                                                                                                                                                                                                                                                                                                                                                     | `pm_card_cr`            | Visa          |
| Ecuador (EC)                                                                                                                                                                                                                                                                                                                                                                                                        | `pm_card_ec`            | Visa          |
| Mexico (MX)                                                                                                                                                                                                                                                                                                                                                                                                         | `pm_card_mx`            | Visa          |
| Panama (PA)                                                                                                                                                                                                                                                                                                                                                                                                         | `pm_card_pa`            | Visa          |
| Paraguay (PY)                                                                                                                                                                                                                                                                                                                                                                                                       | `pm_card_py`            | Visa          |
| Peru (PE)                                                                                                                                                                                                                                                                                                                                                                                                           | `pm_card_pe`            | Visa          |
| Uruguay (UY)                                                                                                                                                                                                                                                                                                                                                                                                        | `pm_card_uy`            | Visa          |
| **EUROPE and MIDDLE EAST**  
  *Strong Customer Authentication* regulations require *3D Secure* authentication for online payments within the *European Economic Area*. The test cards in this section simulate a payment that succeeds without authentication. We recommend also testing scenarios that involve authentication, using [3D Secure test cards](https://docs.stripe.com/testing.md#regulatory-cards). |
| Austria (AT)                                                                                                                                                                                                                                                                                                                                                                                                        | `pm_card_at`            | Visa          |
| Belgium (BE)                                                                                                                                                                                                                                                                                                                                                                                                        | `pm_card_be`            | Visa          |
| Bulgaria (BG)                                                                                                                                                                                                                                                                                                                                                                                                       | `pm_card_bg`            | Visa          |
| Belarus (BY)                                                                                                                                                                                                                                                                                                                                                                                                        | `pm_card_by`            | Visa          |
| Cyprus (CY)                                                                                                                                                                                                                                                                                                                                                                                                         | `pm_card_cy`            | Visa          |
| Czech Republic (CZ)                                                                                                                                                                                                                                                                                                                                                                                                 | `pm_card_cz`            | Visa          |
| Denmark (DK)                                                                                                                                                                                                                                                                                                                                                                                                        | `pm_card_dk`            | Visa          |
| Finland (FI)                                                                                                                                                                                                                                                                                                                                                                                                        | `pm_card_fi`            | Visa          |
| France (FR)                                                                                                                                                                                                                                                                                                                                                                                                         | `pm_card_fr`            | Visa          |
| Germany (DE)                                                                                                                                                                                                                                                                                                                                                                                                        | `pm_card_de`            | Visa          |
| Greece (GR)                                                                                                                                                                                                                                                                                                                                                                                                         | `pm_card_gr`            | Visa          |
| Hungary (HU)                                                                                                                                                                                                                                                                                                                                                                                                        | `pm_card_hu`            | Visa          |
| Ireland (IE)                                                                                                                                                                                                                                                                                                                                                                                                        | `pm_card_ie`            | Visa          |
| Italy (IT)                                                                                                                                                                                                                                                                                                                                                                                                          | `pm_card_it`            | Visa          |
| Latvia (LV)                                                                                                                                                                                                                                                                                                                                                                                                         | `pm_card_lv`            | Visa          |
| Lithuania (LT)                                                                                                                                                                                                                                                                                                                                                                                                      | `pm_card_lt`            | Visa          |
| Luxembourg (LU)                                                                                                                                                                                                                                                                                                                                                                                                     | `pm_card_lu`            | Visa          |
| Malta (MT)                                                                                                                                                                                                                                                                                                                                                                                                          | `pm_card_mt`            | Visa          |
| Netherlands (NL)                                                                                                                                                                                                                                                                                                                                                                                                    | `pm_card_nl`            | Visa          |
| Norway (NO)                                                                                                                                                                                                                                                                                                                                                                                                         | `pm_card_no`            | Visa          |
| Poland (PL)                                                                                                                                                                                                                                                                                                                                                                                                         | `pm_card_pl`            | Visa          |
| Portugal (PT)                                                                                                                                                                                                                                                                                                                                                                                                       | `pm_card_pt`            | Visa          |
| Romania (RO)                                                                                                                                                                                                                                                                                                                                                                                                        | `pm_card_ro`            | Visa          |
| Slovenia (SI)                                                                                                                                                                                                                                                                                                                                                                                                       | `pm_card_si`            | Visa          |
| Slovakia (SK)                                                                                                                                                                                                                                                                                                                                                                                                       | `pm_card_sk`            | Visa          |
| Spain (ES)                                                                                                                                                                                                                                                                                                                                                                                                          | `pm_card_es`            | Visa          |
| Sweden (SE)                                                                                                                                                                                                                                                                                                                                                                                                         | `pm_card_se`            | Visa          |
| Switzerland (CH)                                                                                                                                                                                                                                                                                                                                                                                                    | `pm_card_ch`            | Visa          |
| United Kingdom (GB)                                                                                                                                                                                                                                                                                                                                                                                                 | `pm_card_gb`            | Visa          |
| United Kingdom (GB)                                                                                                                                                                                                                                                                                                                                                                                                 | `pm_card_gb_debit`      | Visa (debit)  |
| United Kingdom (GB)                                                                                                                                                                                                                                                                                                                                                                                                 | `pm_card_gb_mastercard` | Mastercard    |
| **ASIA PACIFIC** 2  
  To test subscriptions that require mandates and pre-debit notifications, see [India recurring payments](https://docs.stripe.com/india-recurring-payments.md?integration=paymentIntents-setupIntents#testing).                                                                                                                                                                                |
| Australia (AU)                                                                                                                                                                                                                                                                                                                                                                                                      | `pm_card_au`            | Visa          |
| China (CN)                                                                                                                                                                                                                                                                                                                                                                                                          | `pm_card_cn`            | Visa          |
| Hong Kong (HK)                                                                                                                                                                                                                                                                                                                                                                                                      | `pm_card_hk`            | Visa          |
| India (IN)                                                                                                                                                                                                                                                                                                                                                                                                          | `pm_card_in`            | Visa          |
| Japan (JP)                                                                                                                                                                                                                                                                                                                                                                                                          | `pm_card_jp`            | Visa          |
| Japan (JP)                                                                                                                                                                                                                                                                                                                                                                                                          | `pm_card_jcb`           | JCB           |
| Malaysia (my)                                                                                                                                                                                                                                                                                                                                                                                                       | `pm_card_my`            | Visa          |
| New Zealand (NZ)                                                                                                                                                                                                                                                                                                                                                                                                    | `pm_card_nz`            | Visa          |
| Singapore (SG)                                                                                                                                                                                                                                                                                                                                                                                                      | `pm_card_sg`            | Visa          |
| Taiwan (TW)                                                                                                                                                                                                                                                                                                                                                                                                         | `pm_card_tw`            | Visa          |
| Thailand (TH)                                                                                                                                                                                                                                                                                                                                                                                                       | `pm_card_th_credit`     | Visa (credit) |
| Thailand (TH)                                                                                                                                                                                                                                                                                                                                                                                                       | `pm_card_th_debit`      | Visa (debit)  |

| Country                                                                                                                                                                                                                                                                                                                                                                                                             | Token               | Brand         |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------- | ------------- |
| **AMERICAS**                                                                                                                                                                                                                                                                                                                                                                                                        |
| United States (US)                                                                                                                                                                                                                                                                                                                                                                                                  | `tok_us`            | Visa          |
| Argentina (AR)                                                                                                                                                                                                                                                                                                                                                                                                      | `tok_ar`            | Visa          |
| Brazil (BR)                                                                                                                                                                                                                                                                                                                                                                                                         | `tok_br`            | Visa          |
| Canada (CA)                                                                                                                                                                                                                                                                                                                                                                                                         | `tok_ca`            | Visa          |
| Chile (CL)                                                                                                                                                                                                                                                                                                                                                                                                          | `tok_cl`            | Visa          |
| Colombia (CO)                                                                                                                                                                                                                                                                                                                                                                                                       | `tok_co`            | Visa          |
| Costa Rica (CR)                                                                                                                                                                                                                                                                                                                                                                                                     | `tok_cr`            | Visa          |
| Ecuador (EC)                                                                                                                                                                                                                                                                                                                                                                                                        | `tok_ec`            | Visa          |
| Mexico (MX)                                                                                                                                                                                                                                                                                                                                                                                                         | `tok_mx`            | Visa          |
| Panama (PA)                                                                                                                                                                                                                                                                                                                                                                                                         | `tok_pa`            | Visa          |
| Paraguay (PY)                                                                                                                                                                                                                                                                                                                                                                                                       | `tok_py`            | Visa          |
| Peru (PE)                                                                                                                                                                                                                                                                                                                                                                                                           | `tok_pe`            | Visa          |
| Uruguay (UY)                                                                                                                                                                                                                                                                                                                                                                                                        | `tok_uy`            | Visa          |
| **EUROPE and MIDDLE EAST**  
  *Strong Customer Authentication* regulations require *3D Secure* authentication for online payments within the *European Economic Area*. The test cards in this section simulate a payment that succeeds without authentication. We recommend also testing scenarios that involve authentication, using [3D Secure test cards](https://docs.stripe.com/testing.md#regulatory-cards). |
| Austria (AT)                                                                                                                                                                                                                                                                                                                                                                                                        | `tok_at`            | Visa          |
| Belgium (BE)                                                                                                                                                                                                                                                                                                                                                                                                        | `tok_be`            | Visa          |
| Bulgaria (BG)                                                                                                                                                                                                                                                                                                                                                                                                       | `tok_bg`            | Visa          |
| Belarus (BY)                                                                                                                                                                                                                                                                                                                                                                                                        | `tok_by`            | Visa          |
| Cyprus (CY)                                                                                                                                                                                                                                                                                                                                                                                                         | `tok_cy`            | Visa          |
| Czech Republic (CZ)                                                                                                                                                                                                                                                                                                                                                                                                 | `tok_cz`            | Visa          |
| Denmark (DK)                                                                                                                                                                                                                                                                                                                                                                                                        | `tok_dk`            | Visa          |
| Finland (FI)                                                                                                                                                                                                                                                                                                                                                                                                        | `tok_fi`            | Visa          |
| France (FR)                                                                                                                                                                                                                                                                                                                                                                                                         | `tok_fr`            | Visa          |
| Germany (DE)                                                                                                                                                                                                                                                                                                                                                                                                        | `tok_de`            | Visa          |
| Greece (GR)                                                                                                                                                                                                                                                                                                                                                                                                         | `tok_gr`            | Visa          |
| Hungary (HU)                                                                                                                                                                                                                                                                                                                                                                                                        | `tok_hu`            | Visa          |
| Ireland (IE)                                                                                                                                                                                                                                                                                                                                                                                                        | `tok_ie`            | Visa          |
| Italy (IT)                                                                                                                                                                                                                                                                                                                                                                                                          | `tok_it`            | Visa          |
| Latvia (LV)                                                                                                                                                                                                                                                                                                                                                                                                         | `tok_lv`            | Visa          |
| Lithuania (LT)                                                                                                                                                                                                                                                                                                                                                                                                      | `tok_lt`            | Visa          |
| Luxembourg (LU)                                                                                                                                                                                                                                                                                                                                                                                                     | `tok_lu`            | Visa          |
| Malta (MT)                                                                                                                                                                                                                                                                                                                                                                                                          | `tok_mt`            | Visa          |
| Netherlands (NL)                                                                                                                                                                                                                                                                                                                                                                                                    | `tok_nl`            | Visa          |
| Norway (NO)                                                                                                                                                                                                                                                                                                                                                                                                         | `tok_no`            | Visa          |
| Poland (PL)                                                                                                                                                                                                                                                                                                                                                                                                         | `tok_pl`            | Visa          |
| Portugal (PT)                                                                                                                                                                                                                                                                                                                                                                                                       | `tok_pt`            | Visa          |
| Romania (RO)                                                                                                                                                                                                                                                                                                                                                                                                        | `tok_ro`            | Visa          |
| Slovenia (SI)                                                                                                                                                                                                                                                                                                                                                                                                       | `tok_si`            | Visa          |
| Slovakia (SK)                                                                                                                                                                                                                                                                                                                                                                                                       | `tok_sk`            | Visa          |
| Spain (ES)                                                                                                                                                                                                                                                                                                                                                                                                          | `tok_es`            | Visa          |
| Sweden (SE)                                                                                                                                                                                                                                                                                                                                                                                                         | `tok_se`            | Visa          |
| Switzerland (CH)                                                                                                                                                                                                                                                                                                                                                                                                    | `tok_ch`            | Visa          |
| United Kingdom (GB)                                                                                                                                                                                                                                                                                                                                                                                                 | `tok_gb`            | Visa          |
| United Kingdom (GB)                                                                                                                                                                                                                                                                                                                                                                                                 | `tok_gb_debit`      | Visa (debit)  |
| United Kingdom (GB)                                                                                                                                                                                                                                                                                                                                                                                                 | `tok_gb_mastercard` | Mastercard    |
| **ASIA PACIFIC**  
  To test subscriptions that require mandates and pre-debit notifications, see [India recurring payments](https://docs.stripe.com/india-recurring-payments.md?integration=paymentIntents-setupIntents#testing).                                                                                                                                                                                  |
| Australia (AU)                                                                                                                                                                                                                                                                                                                                                                                                      | `tok_au`            | Visa          |
| China (CN)                                                                                                                                                                                                                                                                                                                                                                                                          | `tok_cn`            | Visa          |
| Hong Kong (HK)                                                                                                                                                                                                                                                                                                                                                                                                      | `tok_hk`            | Visa          |
| India (IN)                                                                                                                                                                                                                                                                                                                                                                                                          | `tok_in`            | Visa          |
| Japan (JP)                                                                                                                                                                                                                                                                                                                                                                                                          | `tok_jp`            | Visa          |
| Japan (JP)                                                                                                                                                                                                                                                                                                                                                                                                          | `tok_jcb`           | JCB           |
| Malaysia (my)                                                                                                                                                                                                                                                                                                                                                                                                       | `tok_my`            | Visa          |
| New Zealand (NZ)                                                                                                                                                                                                                                                                                                                                                                                                    | `tok_nz`            | Visa          |
| Singapore (SG)                                                                                                                                                                                                                                                                                                                                                                                                      | `tok_sg`            | Visa          |
| Taiwan (TW)                                                                                                                                                                                                                                                                                                                                                                                                         | `tok_tw`            | Visa          |
| Thailand (TH)                                                                                                                                                                                                                                                                                                                                                                                                       | `tok_th_credit`     | Visa (credit) |
| Thailand (TH)                                                                                                                                                                                                                                                                                                                                                                                                       | `tok_th_debit`      | Visa (debit)  |

## HSA and FSA test cards 

Below are test card numbers for simulating transactions using Health Savings Accounts (HSA) and Flexible Spending Accounts (FSA). These accounts are commonly used for medical expenses, and testing with them ensures proper handling of healthcare-related transactions within your application.

| Brand/Type     | Number           | CVC          | Date            |
| -------------- | ---------------- | ------------ | --------------- |
| Visa FSA       | 4000051230000072 | Any 3 digits | Any future date |
| Visa HSA       | 4000051230000072 | Any 3 digits | Any future date |
| Mastercard FSA | 5200828282828897 | Any 3 digits | Any future date |

| Brand/Type     | PaymentMethod                                       |
| -------------- | --------------------------------------------------- |
| Visa FSA       | `pm_card_debit_visaFsaProductCode`                  |
| Visa HSA       | `pm_card_debit_visaHsaProductCode`                  |
| Mastercard FSA | `pm_card_mastercard_debit_mastercardFsaProductCode` |

## Declined payments

To test your integration’s error-handling logic by simulating payments that the issuer declines for various reasons, use test cards from this section. Using one of these cards results in a [card error](https://docs.stripe.com/error-handling.md#payment-errors) with the given [error code](https://docs.stripe.com/error-codes.md) and [decline code](https://docs.stripe.com/declines/codes.md).

To simulate an incorrect CVC, you must provide one using any three-digit number. If you don’t provide a CVC, Stripe doesn’t perform the CVC check, so the check can’t fail.

| Description                      | Number           | Error code                                                                  | Decline code                                                                               |
| -------------------------------- | ---------------- | --------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------ |
| Generic decline                  | 4000000000000002 | [card_declined](https://docs.stripe.com/error-codes.md#card-declined)       | [generic_decline](https://docs.stripe.com/declines/codes.md#generic_decline)               |
| Insufficient funds decline       | 4000000000009995 | [card_declined](https://docs.stripe.com/error-codes.md#card-declined)       | [insufficient_funds](https://docs.stripe.com/declines/codes.md#insufficient_funds)         |
| Lost card decline                | 4000000000009987 | [card_declined](https://docs.stripe.com/error-codes.md#card-declined)       | [lost_card](https://docs.stripe.com/declines/codes.md#lost_card)                           |
| Stolen card decline              | 4000000000009979 | [card_declined](https://docs.stripe.com/error-codes.md#card-declined)       | [stolen_card](https://docs.stripe.com/declines/codes.md#stolen_card)                       |
| Expired card decline             | 4000000000000069 | [expired_card](https://docs.stripe.com/error-codes.md#expired-card)         | n/a                                                                                        |
| Incorrect CVC decline            | 4000000000000127 | [incorrect_cvc](https://docs.stripe.com/error-codes.md#incorrect-cvc)       | n/a                                                                                        |
| Processing error decline         | 4000000000000119 | [processing_error](https://docs.stripe.com/error-codes.md#processing-error) | n/a                                                                                        |
| Incorrect number decline         | 4242424242424241 | [incorrect_number](https://docs.stripe.com/error-codes.md#incorrect-number) | n/a                                                                                        |
| Exceeding velocity limit decline | 4000000000006975 | [card_declined](https://docs.stripe.com/error-codes.md#card-declined)       | [card_velocity_exceeded](https://docs.stripe.com/declines/codes.md#card_velocity_exceeded) |

The cards in the previous table can’t be attached to a Customer object. To simulate a declined payment with a successfully attached card, use the next one.

| Description             | Number           | Details                                                                                                                                  |
| ----------------------- | ---------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| Decline after attaching | 4000000000000341 | Attaching this card to a [Customer](https://docs.stripe.com/api/customers.md) object succeeds, but attempts to charge the customer fail. |

| Description                      | Number                                             | Error code         | Decline code             |
| -------------------------------- | -------------------------------------------------- | ------------------ | ------------------------ |
| Generic decline                  | `pm_card_visa_chargeDeclined`                      | `card_declined`    | `generic_decline`        |
| Insufficient funds decline       | `pm_card_visa_chargeDeclinedInsufficientFunds`     | `card_declined`    | `insufficient_funds`     |
| Lost card decline                | `pm_card_visa_chargeDeclinedLostCard`              | `card_declined`    | `lost_card`              |
| Stolen card decline              | `pm_card_visa_chargeDeclinedStolenCard`            | `card_declined`    | `stolen_card`            |
| Expired card decline             | `pm_card_chargeDeclinedExpiredCard`                | `expired_card`     | n/a                      |
| Incorrect CVC decline            | `pm_card_chargeDeclinedIncorrectCvc`               | `incorrect_cvc`    | n/a                      |
| Processing error decline         | `pm_card_chargeDeclinedProcessingError`            | `processing_error` | n/a                      |
| Exceeding velocity limit decline | `pm_card_visa_chargeDeclinedVelocityLimitExceeded` | `card_declined`    | `card_velocity_exceeded` |

The cards in the previous table can’t be attached to a Customer object. To simulate a declined payment with a successfully attached card, use the next one.

| Description             | PaymentMethod                | Details                                                                                                                                  |
| ----------------------- | ---------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| Decline after attaching | `pm_card_chargeCustomerFail` | Attaching this card to a [Customer](https://docs.stripe.com/api/customers.md) object succeeds, but attempts to charge the customer fail. |

| Description                      | Number                                           | Error code         | Decline code             |
| -------------------------------- | ------------------------------------------------ | ------------------ | ------------------------ |
| Generic decline                  | `tok_visa_chargeDeclined`                        | `card_declined`    | `generic_decline`        |
| Insufficient funds decline       | `tok_visa_chargeDeclinedInsufficientFunds`       | `card_declined`    | `insufficient_funds`     |
| Insufficient debit funds decline | `tok_visa_debit_chargeDeclinedInsufficientFunds` | `card_declined`    | `insufficient_funds`     |
| Lost card decline                | `tok_visa_chargeDeclinedLostCard`                | `card_declined`    | `lost_card`              |
| Stolen card decline              | `tok_visa_chargeDeclinedStolenCard`              | `card_declined`    | `stolen_card`            |
| Expired card decline             | `tok_chargeDeclinedExpiredCard`                  | `expired_card`     | n/a                      |
| Expired card decline             | `tok_visa_chargeDeclinedExpiredCard`             | `expired_card`     | n/a                      |
| Fraudulent card decline          | `tok_visa_chargeDeclinedFraudulent`              | `expired_card`     | n/a                      |
| Incorrect CVC decline            | `tok_chargeDeclinedIncorrectCvc`                 | `incorrect_cvc`    | n/a                      |
| Incorrect CVC decline            | `tok_visa_chargeDeclinedIncorrectCvc`            | `incorrect_cvc`    | n/a                      |
| Processing error decline         | `tok_chargeDeclinedProcessingError`              | `processing_error` | n/a                      |
| Processing error decline         | `tok_visa_chargeDeclinedProcessingError`         | `processing_error` | n/a                      |
| Exceeding velocity limit decline | `tok_visa_chargeDeclinedVelocityLimitExceeded`   | `card_declined`    | `card_velocity_exceeded` |

The cards in the previous table can’t be attached to a Customer object. To simulate a declined payment with a successfully attached card, use the next one.

| Description                                | Token                                   | Details                                                                                                                                                       |
| ------------------------------------------ | --------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Decline after attaching                    | `tok_chargeCustomerFail`                | Attaching this card to a [Customer](https://docs.stripe.com/api/customers.md) object succeeds, but attempts to charge the customer fail.                      |
| Decline after attaching                    | `tok_visa_chargeCustomerFail`           | Attaching this card to a [Customer](https://docs.stripe.com/api/customers.md) object succeeds, but attempts to charge the customer fail.                      |
| Decline after attaching due to lost card   | `tok_visa_chargeCustomerFailLostCard`   | Attaching this card to a [Customer](https://docs.stripe.com/api/customers.md) object succeeds, but attempts to charge the customer fail due to a lost card.   |
| Decline after attaching due to stolen card | `tok_visa_chargeCustomerFailStolenCard` | Attaching this card to a [Customer](https://docs.stripe.com/api/customers.md) object succeeds, but attempts to charge the customer fail due to a stolen card. |

## Fraud prevention

Stripe’s fraud prevention system, Radar, can block payments when they have a high risk level or fail verification checks. You can use the cards in this section to test your Radar settings. You can also use them to test how your integration responds to blocked payments.

Each card simulates specific risk factors. Your Radar settings determine which risk factors cause it to block a payment. Blocked payments result in [card errors with an error code of fraud](https://docs.stripe.com/error-handling.md).

To simulate a failed CVC check, you must provide a CVC using any three-digit number. To simulate a failed postal code check, you must provide any valid postal code. If you don’t provide those values, Radar doesn’t perform the corresponding checks, so the checks can’t fail.

| Description                                | Number           | Details                                                                                                                                                                                                                                                                           |
| ------------------------------------------ | ---------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Always blocked                             | 4100000000000019 | The charge has a [risk level of “highest”](https://docs.stripe.com/radar/risk-evaluation.md#high-risk)

  Radar always blocks it.                                                                                                                                                 |
| Highest risk                               | 4000000000004954 | The charge has a [risk level of “highest”](https://docs.stripe.com/radar/risk-evaluation.md#high-risk)

  Radar might block it [depending on your settings](https://docs.stripe.com/radar/risk-settings.md).                                                                      |
| Elevated risk                              | 4000000000009235 | The charge has a [risk level of “elevated”](https://docs.stripe.com/radar/risk-evaluation.md#elevated-risk)

  If you use Radar for Fraud Teams, Radar might [queue it for review](https://docs.stripe.com/radar/reviews.md).                                                     |
| CVC check fails                            | 4000000000000101 | If you provide a CVC number, the CVC check fails.

  Radar might block it [depending on your settings.](https://docs.stripe.com/radar/rules.md#traditional-bank-checks)                                                                                                           |
| Postal code check fails                    | 4000000000000036 | If you provide a postal code, the postal code check fails.

  Radar might block it [depending on your settings.](https://docs.stripe.com/radar/rules.md#traditional-bank-checks)                                                                                                  |
| CVC check fails with elevated risk         | 4000058400307872 | If you provide a CVC number, the CVC check fails with a [risk level of “elevated”](https://docs.stripe.com/radar/risk-evaluation.md#elevated-risk)

  Radar might block it [depending on your settings.](https://docs.stripe.com/radar/rules.md#traditional-bank-checks)          |
| Postal code check fails with elevated risk | 4000058400306072 | If you provide a postal code, the postal code check fails with a [risk level of “elevated”](https://docs.stripe.com/radar/risk-evaluation.md#elevated-risk)

  Radar might block it [depending on your settings](https://docs.stripe.com/radar/rules.md#traditional-bank-checks). |
| Line1 check fails                          | 4000000000000028 | The address line 1 check fails.

  The payment succeeds unless you [block it with a custom Radar rule](https://docs.stripe.com/radar/rules/reference.md#post-authorization-attributes).                                                                                           |
| Address checks fail                        | 4000000000000010 | The address postal code check and address line 1 check both fail.

  Radar might block it [depending on your settings.](https://docs.stripe.com/radar/rules.md#traditional-bank-checks)                                                                                           |
| Address unavailable                        | 4000000000000044 | The address postal code check and address line 1 check are both unavailable.

  The payment succeeds unless you [block it with a custom Radar rule](https://docs.stripe.com/radar/rules/reference.md#post-authorization-attributes).                                              |

| Description                                | PaymentMethod                      | Details                                                                                                                                                                                                                                                                           |
| ------------------------------------------ | ---------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Always blocked                             | `pm_card_radarBlock`               | The charge has a [risk level of “highest”](https://docs.stripe.com/radar/risk-evaluation.md#high-risk)

  Radar always blocks it.                                                                                                                                                 |
| Highest risk                               | `pm_card_riskLevelHighest`         | The charge has a [risk level of “highest”](https://docs.stripe.com/radar/risk-evaluation.md#high-risk)

  Radar might block it depending on your settings.                                                                                                                        |
| Elevated risk                              | `pm_card_riskLevelElevated`        | The charge has a [risk level of “elevated”](https://docs.stripe.com/radar/risk-evaluation.md#elevated-risk)

  If you use Radar for Fraud Teams, Radar might [queue it for review](https://docs.stripe.com/radar/reviews.md).                                                     |
| CVC check fails                            | `pm_card_cvcCheckFail`             | If you provide a CVC number, the CVC check fails.

  Radar might block it [depending on your settings.](https://docs.stripe.com/radar/rules.md#traditional-bank-checks)                                                                                                           |
| Postal code check fails                    | `pm_card_avsZipFail`               | If you provide a postal code, the postal code check fails.

  Radar might block it [depending on your settings.](https://docs.stripe.com/radar/rules.md#traditional-bank-checks)                                                                                                  |
| CVC check fails with elevated risk         | `pm_card_cvcCheckFailElevatedRisk` | If you provide a CVC number, the CVC check fails with a [risk level of “elevated”](https://docs.stripe.com/radar/risk-evaluation.md#elevated-risk)

  Radar might block it [depending on your settings](https://docs.stripe.com/radar/rules.md#traditional-bank-checks).          |
| Postal code check fails with elevated risk | `pm_card_avsZipFailElevatedRisk`   | If you provide a postal code, the postal code check fails with a [risk level of “elevated”](https://docs.stripe.com/radar/risk-evaluation.md#elevated-risk)

  Radar might block it [depending on your settings](https://docs.stripe.com/radar/rules.md#traditional-bank-checks). |
| Line1 check fails                          | `pm_card_avsLine1Fail`             | The address line 1 check fails.

  The payment succeeds unless you [block it with a custom Radar rule](https://docs.stripe.com/radar/rules/reference.md#post-authorization-attributes).                                                                                           |
| Address checks fail                        | `pm_card_avsFail`                  | The address postal code check and address line 1 check both fail.

  Radar might block it [depending on your settings.](https://docs.stripe.com/radar/rules.md#traditional-bank-checks)                                                                                           |
| Address unavailable                        | `pm_card_avsUnchecked`             | The address postal code check and address line 1 check are both unavailable.

  The payment succeeds unless you [block it with a custom Radar rule](https://docs.stripe.com/radar/rules/reference.md#post-authorization-attributes).                                              |

| Description                                | Token                          | Details                                                                                                                                                                                                                                                                           |
| ------------------------------------------ | ------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Always blocked                             | `tok_radarBlock`               | The charge has a [risk level of “highest”](https://docs.stripe.com/radar/risk-evaluation.md#high-risk)

  Radar always blocks it.                                                                                                                                                 |
| Highest risk                               | `tok_riskLevelHighest`         | The charge has a [risk level of “highest”](https://docs.stripe.com/radar/risk-evaluation.md#high-risk)

  Radar might block it depending on your settings.                                                                                                                        |
| Elevated risk                              | `tok_riskLevelElevated`        | The charge has a [risk level of “elevated”](https://docs.stripe.com/radar/risk-evaluation.md#elevated-risk)

  If you use Radar for Fraud Teams, Radar might [queue it for review](https://docs.stripe.com/radar/reviews.md).                                                     |
| CVC check fails                            | `tok_cvcCheckFail`             | If you provide a CVC number, the CVC check fails.

  Radar might block it [depending on your settings.](https://docs.stripe.com/radar/rules.md#traditional-bank-checks)                                                                                                           |
| Postal code check fails                    | `tok_avsZipFail`               | If you provide a postal code, the postal code check fails.

  Radar might block it [depending on your settings.](https://docs.stripe.com/radar/rules.md#traditional-bank-checks)                                                                                                  |
| CVC check fails with elevated risk         | `tok_cvcCheckFailElevatedRisk` | If you provide a CVC number, the CVC check fails with a [risk level of “elevated”](https://docs.stripe.com/radar/risk-evaluation.md#elevated-risk)

  Radar might block it [depending on your settings](https://docs.stripe.com/radar/rules.md#traditional-bank-checks).          |
| Postal code check fails with elevated risk | `tok_avsZipFailElevatedRisk`   | If you provide a postal code, the postal code check fails with a [risk level of “elevated”](https://docs.stripe.com/radar/risk-evaluation.md#elevated-risk)

  Radar might block it [depending on your settings](https://docs.stripe.com/radar/rules.md#traditional-bank-checks). |
| Line1 check fails                          | `tok_avsLine1Fail`             | The address line 1 check fails.

  The payment succeeds unless you [block it with a custom Radar rule](https://docs.stripe.com/radar/rules/reference.md#post-authorization-attributes).                                                                                           |
| Address checks fail                        | `tok_avsFail`                  | The address postal code check and address line 1 check both fail.

  Radar might block it [depending on your settings.](https://docs.stripe.com/radar/rules.md#traditional-bank-checks)                                                                                           |
| Address unavailable                        | `tok_avsUnchecked`             | The address postal code check and address line 1 check are both unavailable.

  The payment succeeds unless you [block it with a custom Radar rule](https://docs.stripe.com/radar/rules/reference.md#post-authorization-attributes).                                              |

## Invalid data

To test errors resulting from invalid data, provide invalid details. You don’t need a special test card for this. Any invalid value works. For instance:

* [invalid_expiry_month](https://docs.stripe.com/error-codes.md#invalid-expiry-month): Use an invalid month, such as **13**.
* [invalid_expiry_year](https://docs.stripe.com/error-codes.md#invalid-expiry-year): Use a year up to 50 years in the past, such as **95**.
* [invalid_cvc](https://docs.stripe.com/error-codes.md#invalid-cvc): Use a two-digit number, such as **99**.
* [incorrect_number](https://docs.stripe.com/error-codes.md#incorrect-number): Use a card number that fails the [Luhn check](https://en.wikipedia.org/wiki/Luhn_algorithm), such as 4242424242424241.

## Disputes 

To simulate a [disputed transaction](https://docs.stripe.com/disputes.md), use the test cards in this section. Then, to simulate winning or losing the dispute, provide [winning or losing evidence](#evidence).

| Description                  | Number           | Details                                                                                                                                                                                                                                                                                                    |
| ---------------------------- | ---------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Fraudulent                   | 4000000000000259 | With default account settings, charge succeeds, only to be disputed as [fraudulent](https://docs.stripe.com/disputes/categories.md). This type of dispute is [protected](https://docs.stripe.com/payments/3d-secure/authentication-flow.md#disputed-payments) after 3D Secure authentication.              |
| Not received                 | 4000000000002685 | With default account settings, charge succeeds, only to be disputed as [product not received](https://docs.stripe.com/disputes/categories.md). This type of dispute [isn’t protected](https://docs.stripe.com/payments/3d-secure/authentication-flow.md#disputed-payments) after 3D Secure authentication. |
| Inquiry                      | 4000000000001976 | With default account settings, charge succeeds, only to be disputed as [an inquiry](https://docs.stripe.com/disputes/how-disputes-work.md#inquiries).                                                                                                                                                      |
| Warning                      | 4000000000005423 | With default account settings, charge succeeds, only to receive [an early fraud warning](https://docs.stripe.com/disputes/how-disputes-work.md#early-fraud-warnings).                                                                                                                                      |
| Multiple disputes            | 4000000404000079 | With default account settings, charge succeeds, only to be disputed [multiple times](https://docs.stripe.com/disputes/how-disputes-work.md#multiple-disputes).                                                                                                                                             |
| Visa Compelling Evidence 3.0 | 4000000404000038 | With default account settings, charge succeeds, only to be disputed as a [Visa Compelling Evidence 3.0 eligible dispute](https://docs.stripe.com/disputes/api/visa-ce3.md#testing).                                                                                                                        |
| Visa compliance              | 4000008400000779 | With default account settings, charge succeeds, only to be disputed as a [Visa compliance dispute](https://docs.stripe.com/disputes/api/visa-compliance.md#testing).                                                                                                                                       |

| Description                  | PaymentMethod                             | Details                                                                                                                                                                                                                                                                                                    |
| ---------------------------- | ----------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Fraudulent                   | `pm_card_createDispute`                   | With default account settings, charge succeeds, only to be disputed as [fraudulent](https://docs.stripe.com/disputes/categories.md). This type of dispute is [protected](https://docs.stripe.com/payments/3d-secure/authentication-flow.md#disputed-payments) after 3D Secure authentication.              |
| Not received                 | `pm_card_createDisputeProductNotReceived` | With default account settings, charge succeeds, only to be disputed as [product not received](https://docs.stripe.com/disputes/categories.md). This type of dispute [isn’t protected](https://docs.stripe.com/payments/3d-secure/authentication-flow.md#disputed-payments) after 3D Secure authentication. |
| Inquiry                      | `pm_card_createDisputeInquiry`            | With default account settings, charge succeeds, only to be disputed as [an inquiry](https://docs.stripe.com/disputes/how-disputes-work.md#inquiries).                                                                                                                                                      |
| Warning                      | `pm_card_createIssuerFraudRecord`         | With default account settings, charge succeeds, only to receive [an early fraud warning](https://docs.stripe.com/disputes/how-disputes-work.md#early-fraud-warnings).                                                                                                                                      |
| Multiple disputes            | `pm_card_createMultipleDisputes`          | With default account settings, charge succeeds, only to be disputed [multiple times](https://docs.stripe.com/disputes/how-disputes-work.md#multiple-disputes).                                                                                                                                             |
| Visa Compelling Evidence 3.0 | `pm_card_createCe3EligibleDispute`        | With default account settings, charge succeeds, only to be disputed as a [Visa Compelling Evidence 3.0 eligible dispute](https://docs.stripe.com/disputes/api/visa-ce3.md#testing).                                                                                                                        |
| Visa compliance              | `pm_card_createComplianceDispute`         | With default account settings, charge succeeds, only to be disputed as a [Visa compliance dispute](https://docs.stripe.com/disputes/api/visa-compliance.md#testing).                                                                                                                                       |

| Description                  | Token                                 | Details                                                                                                                                                                                                                                                                                                    |
| ---------------------------- | ------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Fraudulent                   | `tok_createDispute`                   | With default account settings, charge succeeds, only to be disputed as [fraudulent](https://docs.stripe.com/disputes/categories.md). This type of dispute is [protected](https://docs.stripe.com/payments/3d-secure/authentication-flow.md#disputed-payments) after 3D Secure authentication.              |
| Not received                 | `tok_createDisputeProductNotReceived` | With default account settings, charge succeeds, only to be disputed as [product not received](https://docs.stripe.com/disputes/categories.md). This type of dispute [isn’t protected](https://docs.stripe.com/payments/3d-secure/authentication-flow.md#disputed-payments) after 3D Secure authentication. |
| Inquiry                      | `tok_createDisputeInquiry`            | With default account settings, charge succeeds, only to be disputed as [an inquiry](https://docs.stripe.com/disputes/how-disputes-work.md#inquiries).                                                                                                                                                      |
| Warning                      | `tok_createIssuerFraudRecord`         | With default account settings, charge succeeds, only to receive [an early fraud warning](https://docs.stripe.com/disputes/how-disputes-work.md#early-fraud-warnings).                                                                                                                                      |
| Multiple disputes            | `tok_createMultipleDisputes`          | With default account settings, charge succeeds, only to be disputed [multiple times](https://docs.stripe.com/disputes/how-disputes-work.md#multiple-disputes).                                                                                                                                             |
| Visa Compelling Evidence 3.0 | `tok_createCe3EligibleDispute`        | With default account settings, charge succeeds, only to be disputed as a [Visa Compelling Evidence 3.0 eligible dispute](https://docs.stripe.com/disputes/api/visa-ce3.md#testing).                                                                                                                        |
| Visa compliance              | `tok_createComplianceDispute`         | With default account settings, charge succeeds, only to be disputed as a [Visa compliance dispute](https://docs.stripe.com/disputes/api/visa-compliance.md#testing).                                                                                                                                       |

### Evidence 

To simulate winning or losing the dispute, respond with one of the evidence values from the table below.

* If you [respond using the API](https://docs.stripe.com/disputes/api.md), pass the value from the table as [uncategorized_text](https://docs.stripe.com/api/disputes/update.md#update_dispute-evidence-uncategorized_text).
* If you [respond in the Dashboard](https://docs.stripe.com/disputes/responding.md), enter the value from the table in the **Additional information** field. Then, click **Submit evidence**.

| Evidence           | Description                                                                                                  |
| ------------------ | ------------------------------------------------------------------------------------------------------------ |
| `winning_evidence` | The dispute is closed and marked as won. Your account is credited the amount of the charge and related fees. |
| `losing_evidence`  | The dispute is closed and marked as lost. Your account isn’t credited.                                       |

## Refunds

In live mode, refunds are asynchronous: a refund can appear to succeed and later fail, or can appear as `pending` at first and later succeed. To simulate refunds with those behaviors, use the test cards in this section. (With all other test cards, refunds succeed immediately and don’t change status after that.)

| Description          | Number           | Details                                                                                                                                                                                                                                               |
| -------------------- | ---------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Asynchronous success | 4000000000007726 | The charge succeeds. If you initiate a refund, its status begins as `pending`. Some time
  later, its status transitions to `succeeded` and sends a `refund.updated` [event](https://docs.stripe.com/api/events/types.md#event_types-refund.updated). |
| Asynchronous failure | 4000000000005126 | The charge succeeds. If you initiate a refund, its status begins as `succeeded`. Some time
  later, its status transitions to `failed` and sends a `refund.failed` [event](https://docs.stripe.com/api/events/types.md#event_types-refund.failed).    |

| Description          | PaymentMethod           | Details                                                                                                                                                                                                                                               |
| -------------------- | ----------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Asynchronous success | `pm_card_pendingRefund` | The charge succeeds. If you initiate a refund, its status begins as `pending`. Some time
  later, its status transitions to `succeeded` and sends a `refund.updated` [event](https://docs.stripe.com/api/events/types.md#event_types-refund.updated). |
| Asynchronous failure | `pm_card_refundFail`    | The charge succeeds. If you initiate a refund, its status begins as `succeeded`. Some time
  later, its status transitions to `failed` and sends a `refund.failed` [event](https://docs.stripe.com/api/events/types.md#event_types-refund.failed).    |

| Description          | Token               | Details                                                                                                                                                                                                                                               |
| -------------------- | ------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Asynchronous success | `tok_pendingRefund` | The charge succeeds. If you initiate a refund, its status begins as `pending`. Some time
  later, its status transitions to `succeeded` and sends a `refund.updated` [event](https://docs.stripe.com/api/events/types.md#event_types-refund.updated). |
| Asynchronous failure | `tok_refundFail`    | The charge succeeds. If you initiate a refund, its status begins as `succeeded`. Some time
  later, its status transitions to `failed` and sends a `refund.failed` [event](https://docs.stripe.com/api/events/types.md#event_types-refund.failed).    |

You can cancel a card refund only by using the Dashboard. In live mode, you can cancel a card refund within a short but nonspecific period of time. Testing environments simulate that period by allowing you to cancel a card refund within 30 minutes.

## Available balance

To send the funds from a test transaction directly to your available balance, use the test cards in this section. Other test cards send funds from a successful payment to your pending balance.

| Description            | Number           | Details                                                                                                                |
| ---------------------- | ---------------- | ---------------------------------------------------------------------------------------------------------------------- |
| Bypass pending balance | 4000000000000077 | The US charge succeeds. Funds are added directly to your available balance, bypassing your pending balance.            |
| Bypass pending balance | 4000003720000278 | The international charge succeeds. Funds are added directly to your available balance, bypassing your pending balance. |

| Description            | PaymentMethod                        | Details                                                                                                                |
| ---------------------- | ------------------------------------ | ---------------------------------------------------------------------------------------------------------------------- |
| Bypass pending balance | `pm_card_bypassPending`              | The US charge succeeds. Funds are added directly to your available balance, bypassing your pending balance.            |
| Bypass pending balance | `pm_card_bypassPendingInternational` | The international charge succeeds. Funds are added directly to your available balance, bypassing your pending balance. |

| Description            | Token                            | Details                                                                                                                |
| ---------------------- | -------------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| Bypass pending balance | `tok_bypassPending`              | The US charge succeeds. Funds are added directly to your available balance, bypassing your pending balance.            |
| Bypass pending balance | `tok_bypassPendingInternational` | The international charge succeeds. Funds are added directly to your available balance, bypassing your pending balance. |

## 3D Secure authentication 

3D Secure requires an additional layer of authentication for credit card transactions. The test cards in this section allow you to simulate triggering authentication in different payment flows.

Only cards in this section effectively test your 3D Secure integration by simulating defined 3DS behavior, such as a challenge flow or an unsupported card. Other Stripe testing cards might still trigger 3DS, but we return `attempt_acknowledged` to bypass the additional steps since 3DS testing isn’t the objective for those cards.

3D Secure redirects won’t occur for payments created directly in the Stripe Dashboard. Instead, use your integration’s own frontend or an API call.

### Authentication and setup

To simulate payment flows that include authentication, use the test cards in this section. Some of these cards can also be [set up](https://docs.stripe.com/payments/save-and-reuse.md) for future payments, or have already been.

| Description                | Number           | Details                                                                                                                                                                                                                                                                                                                                                                                                                 |
| -------------------------- | ---------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Authenticate unless set up | 4000002500003155 | This card requires authentication for off-session payments unless you [set it up](https://docs.stripe.com/payments/save-and-reuse.md) for future payments. After you set it up, off-session payments no longer require authentication. However, on-session payments with this card always require authentication.                                                                                                       |
| Always authenticate        | 4000002760003184 | This card requires authentication on all transactions, regardless of how the card is set up.                                                                                                                                                                                                                                                                                                                            |
| Already set up             | 4000003800000446 | This card is already set up for off-session use. It requires authentication for [one-time](https://docs.stripe.com/payments/accept-a-payment.md?platform=web) and other [on-session](https://docs.stripe.com/payments/save-during-payment.md#web-submit-payment) payments. However, all *off-session payments* succeed as if the card has been previously [set up](https://docs.stripe.com/payments/save-and-reuse.md). |
| Insufficient funds         | 4000008260003178 | This card requires authentication for [one-time payments](https://docs.stripe.com/payments/accept-a-payment.md?platform=web). All payments are declined with an `insufficient_funds` failure code even after being successfully authenticated or previously [set up](https://docs.stripe.com/payments/save-and-reuse.md).                                                                                               |

| Description                | PaymentMethod                                                   | Details                                                                                                                                                                                                                                                                                                                                                                                                               |
| -------------------------- | --------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Authenticate unless set up | `pm_card_authenticationRequiredOnSetup`                         | This card requires authentication for every payment unless you [set it up](https://docs.stripe.com/payments/save-and-reuse.md) for future payments. After you set it up, it no longer requires authentication.                                                                                                                                                                                                        |
| Always authenticate        | `pm_card_authenticationRequired`                                | This card requires authentication on all transactions, regardless of how the card is set up.                                                                                                                                                                                                                                                                                                                          |
| Already set up             | `pm_card_authenticationRequiredSetupForOffSession`              | This card is already set up for off-session use. It requires authentication for [one-time](https://docs.stripe.com/payments/accept-a-payment.md?platform=web) and other [on-session](https://docs.stripe.com/payments/save-during-payment.md#web-submit-payment) payments. However, all off-session payments succeed as if the card has been previously [set up](https://docs.stripe.com/payments/save-and-reuse.md). |
| Insufficient funds         | `pm_card_authenticationRequiredChargeDeclinedInsufficientFunds` | This card requires authentication for [one-time payments](https://docs.stripe.com/payments/accept-a-payment.md?platform=web). All payments are declined with an `insufficient_funds` failure code even after being successfully authenticated or previously [set up](https://docs.stripe.com/payments/save-and-reuse.md).                                                                                             |

### Support and availability 

Stripe requests authentication when required by regulation or when triggered by your Radar rules or custom code. Even if authentication is requested, it can’t always be performed—for instance, the customer’s card might not be enrolled, or an error might occur. Use the test cards in this section to simulate various combinations of these factors.

All 3DS references indicate [3D Secure 2](https://stripe.com/guides/3d-secure-2).

| 3D Secure usage   | Outcome         | Number                                                                                                                                      | Details                                                                                                                                                                                                                                                             |
| ----------------- | --------------- | ------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 3DS Required      | OK              | 4000000000003220                                                                                                                            | 3D Secure authentication must be completed for the payment to be successful.
  By default, your Radar rules request 3D Secure authentication for this card.                                                                                                         |
| 3DS Required      | Declined        | 4000008400001629                                                                                                                            | 3D Secure authentication is required, but payments are declined
  with a `card_declined` failure code after authentication.
  By default, your Radar rules request 3D Secure authentication for this card.                                                          |
| 3DS Required      | Error           | 4000008400001280                                                                                                                            | 3D Secure authentication is required, but the 3D Secure lookup request fails with a processing error.
  Payments are declined with a `card_declined` failure code.
  By default, your Radar rules request 3D Secure authentication for this card.                   |
| 3DS Supported     | OK              | 4000000000003055                                                                                                                            | 3D Secure authentication might still be performed, but isn’t required.
  By default, your Radar rules don’t request 3D Secure authentication for this card.                                                                                                         |
| 3DS Supported     | Error           | 4000000000003097                                                                                                                            | 3D Secure authentication might still be performed, but isn’t required.
  However, attempts to perform 3D Secure result in a processing error.
  By default, your Radar rules don’t request 3D Secure authentication for this card.                                  |
| 3DS Supported     | Unenrolled      | 4242424242424242                                                                                                                            | 3D Secure is supported for this card, but this card isn’t enrolled in 3D Secure.
  Even if your Radar rules request 3D Secure, the customer won’t be prompted to authenticate.
  By default, your Radar rules don’t request 3D Secure authentication for this card. |
| 3DS Not supported | 378282246310005 | 3D Secure isn’t supported on this card and can’t be invoked.
  The PaymentIntent or SetupIntent proceeds without performing authentication. |

| 3D Secure usage | Outcome    | PaymentMethod                                 | Details                                                                                                                                                                                                                                                             |
| --------------- | ---------- | --------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Required        | OK         | `pm_card_threeDSecure2Required`               | 3D Secure authentication must be completed for the payment to be successful.
  By default, your Radar rules request 3D Secure authentication for this card.                                                                                                         |
| Required        | Declined   | `pm_card_threeDSecureRequiredChargeDeclined`  | 3D Secure authentication is required, but payments are declined
  with a `card_declined` failure code after authentication.
  By default, your Radar rules request 3D Secure authentication for this card.                                                          |
| Required        | Error      | `pm_card_threeDSecureRequiredProcessingError` | 3D Secure authentication is required, but the 3D Secure lookup request fails with a processing error.
  Payments are declined with a `card_declined` failure code.
  By default, your Radar rules request 3D Secure authentication for this card.                   |
| Supported       | OK         | `pm_card_threeDSecureOptional`                | 3D Secure authentication might still be performed, but isn’t required.
  By default, your Radar rules don’t request 3D Secure authentication for this card.                                                                                                         |
| Supported       | Error      | `pm_card_threeDSecureOptionalProcessingError` | 3D Secure authentication might still be performed, but isn’t required.
  However, attempts to perform 3D Secure result in a processing error.
  By default, your Radar rules don’t request 3D Secure authentication for this card.                                  |
| Supported       | Unenrolled | `pm_card_visa`                                | 3D Secure is supported for this card, but this card isn’t enrolled in 3D Secure.
  Even if your Radar rules request 3D Secure, the customer won’t be prompted to authenticate.
  By default, your Radar rules don’t request 3D Secure authentication for this card. |
| Not supported   |            | `pm_card_amex_threeDSecureNotSupported`       | 3D Secure isn’t supported on this card and can’t be invoked.
  The PaymentIntent or SetupIntent proceeds without performing authentication.                                                                                                                         |

| 3D Secure usage | Outcome    | Token                                     | Details                                                                                                                                                                                                                                                             |
| --------------- | ---------- | ----------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Required        | OK         | `tok_threeDSecure2Required`               | 3D Secure authentication must be completed for the payment to be successful.
  By default, your Radar rules request 3D Secure authentication for this card.                                                                                                         |
| Required        | Declined   | `tok_threeDSecureRequiredChargeDeclined`  | 3D Secure authentication is required, but payments are declined
  with a `card_declined` failure code after authentication.
  By default, your Radar rules request 3D Secure authentication for this card.                                                          |
| Required        | Error      | `tok_threeDSecureRequiredProcessingError` | 3D Secure authentication is required, but the 3D Secure lookup request fails with a processing error.
  Payments are declined with a `card_declined` failure code.
  By default, your Radar rules request 3D Secure authentication for this card.                   |
| Supported       | OK         | `tok_threeDSecureOptional`                | 3D Secure authentication might still be performed, but isn’t required.
  By default, your Radar rules don’t request 3D Secure authentication for this card.                                                                                                         |
| Supported       | Error      | `tok_threeDSecureOptionalProcessingError` | 3D Secure authentication might still be performed, but isn’t required.
  However, attempts to perform 3D Secure result in a processing error.
  By default, your Radar rules don’t request 3D Secure authentication for this card.                                  |
| Supported       | Unenrolled | `tok_visa`                                | 3D Secure is supported for this card, but this card isn’t enrolled in 3D Secure.
  Even if your Radar rules request 3D Secure, the customer won’t be prompted to authenticate.
  By default, your Radar rules don’t request 3D Secure authentication for this card. |
| Not supported   |            | `tok_amex_threeDSecureNotSupported`       | 3D Secure isn’t supported on this card and can’t be invoked.
  The PaymentIntent proceeds without performing authentication.                                                                                                                                        |

### 3D Secure mobile challenge flows

In a mobile payment, several challenge flows for authentication—where the customer has to interact with prompts in the UI—are available. Use the test cards in this section to trigger a specific challenge flow for test purposes. These cards aren’t useful in browser-based payment forms or in API calls. In those environments, they work but don’t trigger any special behavior. Because they’re not useful in API calls, we don’t provide any `PaymentMethod` or `Token` values to test with.

| Challenge flow    | Number           | Details                                                                                                                  |
| ----------------- | ---------------- | ------------------------------------------------------------------------------------------------------------------------ |
| Out of band       | 4000582600000094 | 3D Secure 2 authentication must be completed on all transactions. Triggers the challenge flow with Out of Band UI.       |
| One time passcode | 4000582600000045 | 3D Secure 2 authentication must be completed on all transactions. Triggers the challenge flow with One Time Passcode UI. |
| Single select     | 4000582600000102 | 3D Secure 2 authentication must be completed on all transactions. Triggers the challenge flow with single-select UI.     |
| Multi select      | 4000582600000110 | 3D Secure 2 authentication must be completed on all transactions. Triggers the challenge flow with multi-select UI.      |

## Captcha challenge 

To prevent fraud, Stripe might display a captcha challenge to the user on the payment page. Use the test cards below to simulate this flow.

| Description       | Number           | Details                                                                  |
| ----------------- | ---------------- | ------------------------------------------------------------------------ |
| Captcha challenge | 4000000000001208 | The charge succeeds if the user correctly answers the captcha challenge. |
| Captcha challenge | 4000000000003725 | The charge succeeds if the user correctly answers the captcha challenge. |

## Payments with PINs 

Use the test cards in this section to simulate successful in-person payments where a PIN is involved. There are many other options for testing in-person payments, including a simulated reader and physical test cards. See [Test Stripe Terminal](https://docs.stripe.com/terminal/references/testing.md) for more information.

| Description       | Number           | Details                                                                                                                                                                                                                                                                                                                                                                                                      |
| ----------------- | ---------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Offline PIN       | 4001007020000002 | This card simulates a payment where the cardholder is prompted for and enters an *offline PIN*. The resulting charge has [cardholder_verification_method](https://docs.stripe.com/api/charges/object.md#charge_object-payment_method_details-card_present-receipt-cardholder_verification_method) set to `offline_pin`.                                                                                      |
| Offline PIN retry | 4000008260000075 | Simulates an SCA-triggered retry flow where a cardholder’s initial contactless charge fails and the reader then prompts the user to insert their card and enter their *offline PIN*. The resulting charge has [cardholder_verification_method](https://docs.stripe.com/api/charges/object.md#charge_object-payment_method_details-card_present-receipt-cardholder_verification_method) set to `offline_pin`. |
| Online PIN        | 4001000360000005 | This card simulates a payment where the cardholder is prompted for and enters an *online PIN*. The resulting charge has [cardholder_verification_method](https://docs.stripe.com/api/charges/object.md#charge_object-payment_method_details-card_present-receipt-cardholder_verification_method) set to `online_pin`.                                                                                        |
| Online PIN retry  | 4000002760000008 | Simulates an SCA-triggered retry flow where a cardholder’s initial contactless charge fails and the reader then prompts the user to insert their card and enter their *online PIN*. The resulting charge has [cardholder_verification_method](https://docs.stripe.com/api/charges/object.md#charge_object-payment_method_details-card_present-receipt-cardholder_verification_method) set to `online_pin`.   |

| Description       | Number                  | Details                                                                                                                                                                                                                                                                                                                                                                                                      |
| ----------------- | ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Offline PIN       | `offline_pin_cvm`       | This card simulates a payment where the cardholder is prompted for and enters an *offline PIN*. The resulting charge has [cardholder_verification_method](https://docs.stripe.com/api/charges/object.md#charge_object-payment_method_details-card_present-receipt-cardholder_verification_method) set to `offline_pin`.                                                                                      |
| Offline PIN retry | `offline_pin_sca_retry` | Simulates an SCA-triggered retry flow where a cardholder’s initial contactless charge fails and the reader then prompts the user to insert their card and enter their *offline PIN*. The resulting charge has [cardholder_verification_method](https://docs.stripe.com/api/charges/object.md#charge_object-payment_method_details-card_present-receipt-cardholder_verification_method) set to `offline_pin`. |
| Online PIN        | `online_pin_cvm`        | This card simulates a payment where the cardholder is prompted for and enters an *online PIN*. The resulting charge has [cardholder_verification_method](https://docs.stripe.com/api/charges/object.md#charge_object-payment_method_details-card_present-receipt-cardholder_verification_method) set to `online_pin`.                                                                                        |
| Online PIN retry  | `online_pin_sca_retry`  | Simulates an SCA-triggered retry flow where a cardholder’s initial contactless charge fails and the reader then prompts the user to insert their card and enter their *online PIN*. The resulting charge has [cardholder_verification_method](https://docs.stripe.com/api/charges/object.md#charge_object-payment_method_details-card_present-receipt-cardholder_verification_method) set to `online_pin`.   |

## Event destinations 

To test your webhook endpoint or [event destination](https://docs.stripe.com/event-destinations.md), choose one of these two options:

1. Perform actions in a sandbox that send legitimate events to your event destination. For example, to trigger the [charge.succeeded](https://docs.stripe.com/api.md#event_types-charge.succeeded) event, you can use a [test card that produces a successful charge](#cards).
1. [Trigger events using the Stripe CLI](https://docs.stripe.com/webhooks.md#test-webhook) or [using Stripe for Visual Studio Code](https://docs.stripe.com/stripe-vscode.md#webhooks).

## Rate limits

If your requests in your testing environments begin to receive `429` HTTP errors, make them less frequently. These errors come from our [rate limiter](https://docs.stripe.com/rate-limits.md), which is more strict in testing environments than in live mode.

We don’t recommend load testing your integration using the Stripe API in testing environments. Because the load limiter is stricter in testing environments, you might see errors that you wouldn’t see in production. See [load testing](https://docs.stripe.com/rate-limits.md#load-testing) for an alternative approach.

## Non-card payments

Any time you use a test non-card payment method, use [test API keys](https://docs.stripe.com/keys.md#obtain-api-keys) in all API calls. This is true whether you’re serving a payment form you can test interactively or writing test code.

Different payment methods have different test procedures:

Learn how to test scenarios with instant verifications using [Financial Connections](https://docs.stripe.com/financial-connections/testing.md#web-how-to-use-test-accounts).

### Send transaction emails in a sandbox

After you collect the bank account details and accept a mandate, send the mandate confirmation and microdeposit verification emails in a *sandbox*.

If your domain is “example.com,” use an email format such as **info+testing@example.com** for testing non-card payments. You can replace “info” with a standard local term such as “support.” This format ensures emails are routed correctly.

You need to [activate your Stripe account](https://docs.stripe.com/get-started/account/activate.md) before you can trigger these emails while testing.

### Test account numbers

Stripe provides several test account numbers and corresponding tokens you can use to make sure your integration for manually-entered bank accounts is ready for production.

| Account number | Token                                  | Routing number | Behavior                                                                                                                                              |
| -------------- | -------------------------------------- | -------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| `000123456789` | `pm_usBankAccount_success`             | `110000000`    | The payment succeeds.                                                                                                                                 |
| `000111111113` | `pm_usBankAccount_accountClosed`       | `110000000`    | The payment fails because the account is closed.                                                                                                      |
| `000000004954` | `pm_usBankAccount_riskLevelHighest`    | `110000000`    | The payment is blocked by Radar due to a [high risk of fraud](https://docs.stripe.com/radar/risk-evaluation.md#high-risk).                            |
| `000111111116` | `pm_usBankAccount_noAccount`           | `110000000`    | The payment fails because no account is found.                                                                                                        |
| `000222222227` | `pm_usBankAccount_insufficientFunds`   | `110000000`    | The payment fails due to insufficient funds.                                                                                                          |
| `000333333335` | `pm_usBankAccount_debitNotAuthorized`  | `110000000`    | The payment fails because debits aren’t authorized.                                                                                                   |
| `000444444440` | `pm_usBankAccount_invalidCurrency`     | `110000000`    | The payment fails due to invalid currency.                                                                                                            |
| `000666666661` | `pm_usBankAccount_failMicrodeposits`   | `110000000`    | The payment fails to send microdeposits.                                                                                                              |
| `000555555559` | `pm_usBankAccount_dispute`             | `110000000`    | The payment triggers a dispute.                                                                                                                       |
| `000000000009` | `pm_usBankAccount_processing`          | `110000000`    | The payment stays in processing indefinitely. Useful for testing [PaymentIntent cancellation](https://docs.stripe.com/api/payment_intents/cancel.md). |
| `000777777771` | `pm_usBankAccount_weeklyLimitExceeded` | `110000000`    | The payment fails due to payment amount causing the account to exceed its weekly payment volume limit.                                                |

Before test transactions can complete, you need to verify all test accounts that automatically succeed or fail the payment. To do so, use the test microdeposit amounts or descriptor codes below.

### Test microdeposit amounts and descriptor codes

To mimic different scenarios, use these microdeposit amounts *or* 0.01 descriptor code values.

| Microdeposit values | 0.01 descriptor code values | Scenario                                                         |
| ------------------- | --------------------------- | ---------------------------------------------------------------- |
| `32` and `45`       | SM11AA                      | Simulates verifying the account.                                 |
| `10` and `11`       | SM33CC                      | Simulates exceeding the number of allowed verification attempts. |
| `40` and `41`       | SM44DD                      | Simulates a microdeposit timeout.                                |

### Test settlement behavior

Test transactions settle instantly and are added to your available test balance. This behavior differs from livemode, where transactions can take [multiple days](#timing) to settle in your available balance.

Create a test `PaymentIntent` that either succeeds or fails by doing the following:

1. Create a test *PaymentMethod* with a test account number.
1. Use the resulting `PaymentMethod` in a `confirmSepaDebitPayment` request to create the test charge.

There are several [test bank account numbers](https://docs.stripe.com/keys.md#test-live-modes) you can use in a *sandbox* to make sure this integration is ready.

You can test using any of the account numbers provided above. However, because Bacs Direct Debit payments take several days to process, use the test account numbers that operate on a three-minute delay to better simulate the behavior of live payments.

By default, Stripe automatically sends [emails](https://docs.stripe.com/payments/payment-methods/bacs-debit.md#debit-notifications) to the customer when payment details are initially collected and each time a debit will be made on their account. These notifications aren’t sent in sandboxes.

You can create a test `PaymentIntent` that either succeeds or fails by doing the following:

Create a test *PaymentMethod* with the test `BSB 000-000` and a test account number from the list below.
Use the resulting `PaymentMethod` in a `confirmAuBecsDebitPayment` request to create the test charge.

### Test account numbers 

With other payment methods, testing information is included with the documentation. [Find your payment method](https://docs.stripe.com/payments/payment-methods/overview.md) and read the associated guide to accept and test payments.

## Link

Don’t store real user data in *sandbox* Link accounts. Treat them as if they’re publicly available, because these test accounts are associated with your publishable key.

Currently, Link only works with credit cards, debit cards, and qualified US bank account purchases. Link requires [domain registration](https://docs.stripe.com/payments/payment-methods/pmd-registration.md).

You can create sandbox accounts for Link using any valid email address. The following table shows the fixed one-time passcode values that Stripe accepts for authenticating sandbox accounts:

| Value                               | Outcome                      |
| ----------------------------------- | ---------------------------- |
| Any other 6 digits not listed below | Success                      |
| 000001                              | Error, code invalid          |
| 000002                              | Error, code expired          |
| 000003                              | Error, max attempts exceeded |

### Multiple funding sources

As Stripe adds additional funding source support, you don’t need to update your integration. Stripe automatically supports them with the same transaction settlement time and guarantees as card and bank account payments.

## Redirects

To test your integration’s redirect-handling logic by simulating a payment that uses a redirect flow (for example, iDEAL), use a supported payment method that [requires redirects](https://docs.stripe.com/payments/payment-methods/payment-method-support.md#additional-api-supportability).

To create a test `PaymentIntent` that either succeeds or fails:

1. Navigate to the [payment methods settings in the Dashboard](https://dashboard.stripe.com/settings/payment_methods) and enable a supported payment method by clicking **Turn on** in your testing environment.
1. Collect payment details.
1. Submit the payment to Stripe.
1. Authorize or fail the test payment.

Make sure that the page (corresponding to `return_url`) on your website provides the status of the payment.

## See Also

* [Testing your Connect integration](https://docs.stripe.com/connect/testing.md)
* [Testing your Billing integration](https://docs.stripe.com/billing/testing.md)
* [Testing your Terminal integration](https://docs.stripe.com/terminal/references/testing.md)
* [Load testing](https://docs.stripe.com/rate-limits.md#load-testing)