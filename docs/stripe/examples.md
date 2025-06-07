# Stripe Request Examples

The following snippets show how to call each implemented Stripe endpoint using `curl`. Export your API key as `STRIPE_SK` so requests don't contain hard-coded secrets.

```bash
export STRIPE_SK=sk_test_yourKey
```

## Customers

### Create a customer
```bash
curl https://api.stripe.com/v1/customers \
  -u "$STRIPE_SK:" \
  -d email=user@example.com
```

### Retrieve a customer
```bash
curl https://api.stripe.com/v1/customers/cus_123 \
  -u "$STRIPE_SK:"
```

### Update a customer
```bash
curl https://api.stripe.com/v1/customers/cus_123 \
  -u "$STRIPE_SK:" \
  -X POST \
  -d description="updated"
```

### Delete a customer
```bash
curl https://api.stripe.com/v1/customers/cus_123 \
  -u "$STRIPE_SK:" \
  -X DELETE
```

### List customers
```bash
curl "https://api.stripe.com/v1/customers?limit=3" \
  -u "$STRIPE_SK:"
```

## Payment Intents

### Create a PaymentIntent
```bash
curl https://api.stripe.com/v1/payment_intents \
  -u "$STRIPE_SK:" \
  -d amount=200 \
  -d currency=usd \
  -d payment_method_types[]=card
```

### Retrieve a PaymentIntent
```bash
curl https://api.stripe.com/v1/payment_intents/pi_123 \
  -u "$STRIPE_SK:"
```

### Confirm a PaymentIntent
```bash
curl https://api.stripe.com/v1/payment_intents/pi_123/confirm \
  -u "$STRIPE_SK:" \
  -X POST \
  -d payment_method=pm_card_visa
```

### Capture a PaymentIntent
```bash
curl https://api.stripe.com/v1/payment_intents/pi_123/capture \
  -u "$STRIPE_SK:" \
  -X POST
```

### Cancel a PaymentIntent
```bash
curl https://api.stripe.com/v1/payment_intents/pi_123/cancel \
  -u "$STRIPE_SK:" \
  -X POST
```

### Update a PaymentIntent
```bash
curl https://api.stripe.com/v1/payment_intents/pi_123 \
  -u "$STRIPE_SK:" \
  -X POST \
  -d description="new"
```

### List PaymentIntents
```bash
curl "https://api.stripe.com/v1/payment_intents?limit=5" \
  -u "$STRIPE_SK:"
```

### Search PaymentIntents
```bash
curl "https://api.stripe.com/v1/payment_intents/search?query=status:'succeeded'" \
  -u "$STRIPE_SK:"
```

## Payment Methods

### Create a PaymentMethod
```bash
curl https://api.stripe.com/v1/payment_methods \
  -u "$STRIPE_SK:" \
  -d type=card \
  -d card[token]=tok_visa
```

### Attach a PaymentMethod
```bash
curl https://api.stripe.com/v1/payment_methods/pm_123/attach \
  -u "$STRIPE_SK:" \
  -X POST \
  -d customer=cus_123
```

### List PaymentMethods
```bash
curl "https://api.stripe.com/v1/payment_methods?customer=cus_123&type=card" \
  -u "$STRIPE_SK:"
```

## Setup Intents

### Create a SetupIntent
```bash
curl https://api.stripe.com/v1/setup_intents \
  -u "$STRIPE_SK:" \
  -d customer=cus_123 \
  -d usage=off_session
```

## Products and Prices

### Create a Product
```bash
curl https://api.stripe.com/v1/products \
  -u "$STRIPE_SK:" \
  -d name="Gold Plan"
```

### Retrieve a Product
```bash
curl https://api.stripe.com/v1/products/prod_123 \
  -u "$STRIPE_SK:"
```

### List Products
```bash
curl "https://api.stripe.com/v1/products?limit=3" \
  -u "$STRIPE_SK:"
```

### Create a Price
```bash
curl https://api.stripe.com/v1/prices \
  -u "$STRIPE_SK:" \
  -d unit_amount=1000 \
  -d currency=usd \
  -d product=prod_123
```

### Retrieve a Price
```bash
curl https://api.stripe.com/v1/prices/price_123 \
  -u "$STRIPE_SK:"
```

### List Prices
```bash
curl "https://api.stripe.com/v1/prices?limit=1" \
  -u "$STRIPE_SK:"
```

## Subscriptions

### Create a Subscription
```bash
curl https://api.stripe.com/v1/subscriptions \
  -u "$STRIPE_SK:" \
  -d customer=cus_123 \
  -d items[0][price]=price_123
```

### Cancel a Subscription
```bash
curl https://api.stripe.com/v1/subscriptions/sub_123 \
  -u "$STRIPE_SK:" \
  -X DELETE
```

## Miscellaneous

### List Charges
```bash
curl "https://api.stripe.com/v1/charges?limit=1" \
  -u "$STRIPE_SK:"
```

### Create an Ephemeral Key
```bash
curl https://api.stripe.com/v1/ephemeral_keys \
  -u "$STRIPE_SK:" \
  -H "Stripe-Version: 2023-10-16" \
  -d customer=cus_123
```

### Apply Customer Balance
```bash
curl https://api.stripe.com/v1/payment_intents/pi_123/apply_customer_balance \
  -u "$STRIPE_SK:" \
  -X POST
```

### Increment Authorization
```bash
curl https://api.stripe.com/v1/payment_intents/pi_123/increment_authorization \
  -u "$STRIPE_SK:" \
  -X POST \
  -d amount=100
```

### Verify Microdeposits
```bash
curl https://api.stripe.com/v1/payment_intents/pi_123/verify_microdeposits \
  -u "$STRIPE_SK:" \
  -X POST \
  -d amounts[0]=32 \
  -d amounts[1]=45
```

### List All PaymentIntents (auto pagination)
```bash
# Repeat requests using starting_after to fetch all pages
curl "https://api.stripe.com/v1/payment_intents?limit=100" \
  -u "$STRIPE_SK:"
```
