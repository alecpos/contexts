# Stripe Testing Best Practices

Use Stripe's **test mode** to simulate real payment flows without charging real cards. The test keys defined in `.env`—`STRIPE_PK` and `STRIPE_SK`—should be used for all development and automated tests.

## Test mode vs live mode

- Keys beginning with `pk_test_` and `sk_test_` operate in *test mode*.
- Keys beginning with `pk_live_` and `sk_live_` operate in *live mode*.
- Never commit your live secret key to version control.

Switch keys in your environment when you are ready to process live transactions.

## Common curl examples

### Create a customer
```bash
curl https://api.stripe.com/v1/customers \
  -u $STRIPE_SK: \
  -d email="test@example.com" \
  -d name="Test User"
```

### Create a product
```bash
curl https://api.stripe.com/v1/products \
  -u $STRIPE_SK: \
  -d name="Demo Product"
```

### Create a price
```bash
curl https://api.stripe.com/v1/prices \
  -u $STRIPE_SK: \
  -d unit_amount=1000 \
  -d currency=usd \
  -d product=prod_123
```

### Create a payment intent
```bash
curl https://api.stripe.com/v1/payment_intents \
  -u $STRIPE_SK: \
  -d amount=1000 \
  -d currency=usd \
  -d customer=cus_123
```

### Create a subscription
```bash
curl https://api.stripe.com/v1/subscriptions \
  -u $STRIPE_SK: \
  -d customer=cus_123 \
  -d items[0][price]=price_123 \
  -d default_payment_method=pm_123
```

## Test tokens

Use the token `tok_visa` for successful card payments in test mode. Review the [Stripe testing docs](stripe/testing.md) for additional tokens and scenarios.

## Cleanup example

Delete any test customer when finished:
```bash
curl https://api.stripe.com/v1/customers/cus_123 \
  -u $STRIPE_SK: \
  -X DELETE
```
