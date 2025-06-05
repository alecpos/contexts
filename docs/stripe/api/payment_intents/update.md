# Update a PaymentIntent

Updates properties on a PaymentIntent object without confirming.

Depending on which properties you update, you might need to confirm the
PaymentIntent again. For example, updating the `payment_method`
always requires you to confirm the PaymentIntent again. If you prefer to
update and confirm at the same time, we recommend updating properties through
the [confirm API](https://docs.stripe.com/docs/api/payment_intents/confirm.md) instead.

Returns a PaymentIntent object.

- `application_fee_amount` (integer, optional)
  The amount of the application fee (if any) that will be requested to be applied to the payment and transferred to the application owner’s Stripe account. The amount of the application fee collected will be capped at the total amount captured. For more information, see the PaymentIntents [use case for connected accounts](https://docs.stripe.com/docs/payments/connected-accounts.md).

- `capture_method` (enum, optional)
  Controls when the funds will be captured from the customer’s account.

  Stripe automatically captures funds when the customer authorizes the payment.

  (Default) Stripe asynchronously captures funds when the customer authorizes the payment. Recommended over `capture_method=automatic` due to improved latency. Read the [integration guide](https://docs.stripe.com/docs/payments/payment-intents/asynchronous-capture.md) for more information.

  Place a hold on the funds when the customer authorizes the payment, but [don’t capture the funds until later](https://docs.stripe.com/docs/payments/capture-later.md). (Not all payment methods support this.)

- `customer` (string, optional)
  ID of the Customer this PaymentIntent belongs to, if one exists.

  Payment methods attached to other Customers cannot be used with this PaymentIntent.

  If [setup_future_usage](#payment_intent_object-setup_future_usage) is set and this PaymentIntent’s payment method is not `card_present`, then the payment method attaches to the Customer after the PaymentIntent has been confirmed and any required actions from the user are complete. If the payment method is `card_present` and isn’t a digital wallet, then a [generated_card](https://docs.stripe.com/api/charges/object#charge_object-payment_method_details-card_present-generated_card) payment method representing the card is created and attached to the Customer instead.

- `description` (string, optional)
  An arbitrary string attached to the object. Often useful for displaying to users.

- `metadata` (object, optional)
  Set of [key-value pairs](https://docs.stripe.com/docs/api/metadata.md) that you can attach to an object. This can be useful for storing additional information about the object in a structured format. Individual keys can be unset by posting an empty value to them. All keys can be unset by posting an empty value to `metadata`.

- `payment_method` (string, optional)
  ID of the payment method (a PaymentMethod, Card, or [compatible Source](https://docs.stripe.com/docs/payments/payment-methods/transitioning.md#compatibility) object) to attach to this PaymentIntent. To unset this field to null, pass in an empty string.

- `payment_method_configuration` (string, optional)
  The ID of the [payment method configuration](https://docs.stripe.com/docs/api/payment_method_configurations.md) to use with this PaymentIntent.

- `payment_method_data` (object, optional)
  If provided, this hash will be used to create a PaymentMethod. The new PaymentMethod will appear
  in the [payment_method](https://docs.stripe.com/docs/api/payment_intents/object.md#payment_intent_object-payment_method)
  property on the PaymentIntent.

  - `payment_method_data.type` (enum, optional)
    The type of the PaymentMethod. An additional hash is included on the PaymentMethod with a name matching this value. It contains additional information specific to the PaymentMethod type.

  - `payment_method_data.acss_debit` (object, optional)
    If this is an `acss_debit` PaymentMethod, this hash contains details about the ACSS Debit payment method.

    - `payment_method_data.acss_debit.account_number` (string, optional)
      Customer’s bank account number.

    - `payment_method_data.acss_debit.institution_number` (string, optional)
      Institution number of the customer’s bank.

    - `payment_method_data.acss_debit.transit_number` (string, optional)
      Transit number of the customer’s bank.

  - `payment_method_data.affirm` (object, optional)
    If this is an `affirm` PaymentMethod, this hash contains details about the Affirm payment method.

  - `payment_method_data.afterpay_clearpay` (object, optional)
    If this is an `AfterpayClearpay` PaymentMethod, this hash contains details about the AfterpayClearpay payment method.

  - `payment_method_data.alipay` (object, optional)
    If this is an `Alipay` PaymentMethod, this hash contains details about the Alipay payment method.

  - `payment_method_data.allow_redisplay` (enum, optional)
    This field indicates whether this payment method can be shown again to its customer in a checkout flow. Stripe products such as Checkout and Elements use this field to determine whether a payment method can be shown as a saved payment method in a checkout flow. The field defaults to `unspecified`.

    Use `always` to indicate that this payment method can always be shown to a customer in a checkout flow.

    Use `limited` to indicate that this payment method can’t always be shown to a customer in a checkout flow. For example, it can only be shown in the context of a specific subscription.

    This is the default value for payment methods where `allow_redisplay` wasn’t set.

  - `payment_method_data.alma` (object, optional)
    If this is a Alma PaymentMethod, this hash contains details about the Alma payment method.

  - `payment_method_data.amazon_pay` (object, optional)
    If this is a AmazonPay PaymentMethod, this hash contains details about the AmazonPay payment method.

  - `payment_method_data.au_becs_debit` (object, optional)
    If this is an `au_becs_debit` PaymentMethod, this hash contains details about the bank account.

    - `payment_method_data.au_becs_debit.account_number` (string, required)
      The account number for the bank account.

    - `payment_method_data.au_becs_debit.bsb_number` (string, required)
      Bank-State-Branch number of the bank account.

  - `payment_method_data.bacs_debit` (object, optional)
    If this is a `bacs_debit` PaymentMethod, this hash contains details about the Bacs Direct Debit bank account.

    - `payment_method_data.bacs_debit.account_number` (string, optional)
      Account number of the bank account that the funds will be debited from.

    - `payment_method_data.bacs_debit.sort_code` (string, optional)
      Sort code of the bank account. (e.g., `10-20-30`)

  - `payment_method_data.bancontact` (object, optional)
    If this is a `bancontact` PaymentMethod, this hash contains details about the Bancontact payment method.

  - `payment_method_data.billie` (object, optional)
    If this is a `billie` PaymentMethod, this hash contains details about the Billie payment method.

  - `payment_method_data.billing_details` (object, optional)
    Billing information associated with the PaymentMethod that may be used or required by particular types of payment methods.

    - `payment_method_data.billing_details.address` (object, optional)
      Billing address.

      - `payment_method_data.billing_details.address.city` (string, optional)
        City, district, suburb, town, or village.

      - `payment_method_data.billing_details.address.country` (string, optional)
        Two-letter country code ([ISO 3166-1 alpha-2](https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2)).

      - `payment_method_data.billing_details.address.line1` (string, optional)
        Address line 1 (e.g., street, PO Box, or company name).

      - `payment_method_data.billing_details.address.line2` (string, optional)
        Address line 2 (e.g., apartment, suite, unit, or building).

      - `payment_method_data.billing_details.address.postal_code` (string, optional)
        ZIP or postal code.

      - `payment_method_data.billing_details.address.state` (string, optional)
        State, county, province, or region.

    - `payment_method_data.billing_details.email` (string, optional)
      Email address.

    - `payment_method_data.billing_details.name` (string, optional)
      Full name.

    - `payment_method_data.billing_details.phone` (string, optional)
      Billing phone number (including extension).

    - `payment_method_data.billing_details.tax_id` (string, optional)
      Taxpayer identification number. Used only for transactions between LATAM buyers and non-LATAM sellers.

  - `payment_method_data.blik` (object, optional)
    If this is a `blik` PaymentMethod, this hash contains details about the BLIK payment method.

  - `payment_method_data.boleto` (object, optional)
    If this is a `boleto` PaymentMethod, this hash contains details about the Boleto payment method.

    - `payment_method_data.boleto.tax_id` (string, required)
      The tax ID of the customer (CPF for individual consumers or CNPJ for businesses consumers)

  - `payment_method_data.cashapp` (object, optional)
    If this is a `cashapp` PaymentMethod, this hash contains details about the Cash App Pay payment method.

  - `payment_method_data.customer_balance` (object, optional)
    If this is a `customer_balance` PaymentMethod, this hash contains details about the CustomerBalance payment method.

  - `payment_method_data.eps` (object, optional)
    If this is an `eps` PaymentMethod, this hash contains details about the EPS payment method.

    - `payment_method_data.eps.bank` (string, optional)
      The customer’s bank.

  - `payment_method_data.fpx` (object, optional)
    If this is an `fpx` PaymentMethod, this hash contains details about the FPX payment method.

    - `payment_method_data.fpx.bank` (string, required)
      The customer’s bank.

  - `payment_method_data.giropay` (object, optional)
    If this is a `giropay` PaymentMethod, this hash contains details about the Giropay payment method.

  - `payment_method_data.grabpay` (object, optional)
    If this is a `grabpay` PaymentMethod, this hash contains details about the GrabPay payment method.

  - `payment_method_data.ideal` (object, optional)
    If this is an `ideal` PaymentMethod, this hash contains details about the iDEAL payment method.

    - `payment_method_data.ideal.bank` (string, optional)
      The customer’s bank. Only use this parameter for existing customers. Don’t use it for new customers.

  - `payment_method_data.kakao_pay` (object, optional)
    If this is a `kakao_pay` PaymentMethod, this hash contains details about the Kakao Pay payment method.

  - `payment_method_data.klarna` (object, optional)
    If this is a `klarna` PaymentMethod, this hash contains details about the Klarna payment method.

    - `payment_method_data.klarna.dob` (object, optional)
      Customer’s date of birth

      - `payment_method_data.klarna.dob.day` (integer, required)
        The day of birth, between 1 and 31.

      - `payment_method_data.klarna.dob.month` (integer, required)
        The month of birth, between 1 and 12.

      - `payment_method_data.klarna.dob.year` (integer, required)
        The four-digit year of birth.

  - `payment_method_data.konbini` (object, optional)
    If this is a `konbini` PaymentMethod, this hash contains details about the Konbini payment method.

  - `payment_method_data.kr_card` (object, optional)
    If this is a `kr_card` PaymentMethod, this hash contains details about the Korean Card payment method.

  - `payment_method_data.link` (object, optional)
    If this is an `Link` PaymentMethod, this hash contains details about the Link payment method.

  - `payment_method_data.metadata` (object, optional)
    Set of [key-value pairs](https://docs.stripe.com/docs/api/metadata.md) that you can attach to an object. This can be useful for storing additional information about the object in a structured format. Individual keys can be unset by posting an empty value to them. All keys can be unset by posting an empty value to `metadata`.

  - `payment_method_data.mobilepay` (object, optional)
    If this is a `mobilepay` PaymentMethod, this hash contains details about the MobilePay payment method.

  - `payment_method_data.multibanco` (object, optional)
    If this is a `multibanco` PaymentMethod, this hash contains details about the Multibanco payment method.

  - `payment_method_data.naver_pay` (object, optional)
    If this is a `naver_pay` PaymentMethod, this hash contains details about the Naver Pay payment method.

    - `payment_method_data.naver_pay.funding` (enum, optional)
      Whether to use Naver Pay points or a card to fund this transaction. If not provided, this defaults to `card`.

      Use a card to fund this transaction.

      Use Naver Pay points to fund this transaction.

  - `payment_method_data.nz_bank_account` (object, optional)
    If this is an nz_bank_account PaymentMethod, this hash contains details about the nz_bank_account payment method.

    - `payment_method_data.nz_bank_account.account_number` (string, required)
      The account number for the bank account.

    - `payment_method_data.nz_bank_account.bank_code` (string, required)
      The numeric code for the bank account’s bank.

    - `payment_method_data.nz_bank_account.branch_code` (string, required)
      The numeric code for the bank account’s bank branch.

    - `payment_method_data.nz_bank_account.suffix` (string, required)
      The suffix of the bank account number.

    - `payment_method_data.nz_bank_account.account_holder_name` (string, optional)
      The name on the bank account. Only required if the account holder name is different from the name of the authorized signatory collected in the PaymentMethod’s billing details.

  - `payment_method_data.oxxo` (object, optional)
    If this is an `oxxo` PaymentMethod, this hash contains details about the OXXO payment method.

  - `payment_method_data.p24` (object, optional)
    If this is a `p24` PaymentMethod, this hash contains details about the P24 payment method.

    - `payment_method_data.p24.bank` (enum, optional)
      The customer’s bank.

  - `payment_method_data.pay_by_bank` (object, optional)
    If this is a `pay_by_bank` PaymentMethod, this hash contains details about the PayByBank payment method.

  - `payment_method_data.payco` (object, optional)
    If this is a `payco` PaymentMethod, this hash contains details about the PAYCO payment method.

  - `payment_method_data.paynow` (object, optional)
    If this is a `paynow` PaymentMethod, this hash contains details about the PayNow payment method.

  - `payment_method_data.paypal` (object, optional)
    If this is a `paypal` PaymentMethod, this hash contains details about the PayPal payment method.

  - `payment_method_data.pix` (object, optional)
    If this is a `pix` PaymentMethod, this hash contains details about the Pix payment method.

  - `payment_method_data.promptpay` (object, optional)
    If this is a `promptpay` PaymentMethod, this hash contains details about the PromptPay payment method.

  - `payment_method_data.radar_options` (object, optional)
    Options to configure Radar. See [Radar Session](https://docs.stripe.com/docs/radar/radar-session.md) for more information.

    - `payment_method_data.radar_options.session` (string, optional)
      A [Radar Session](https://docs.stripe.com/docs/radar/radar-session.md) is a snapshot of the browser metadata and device details that help Radar make more accurate predictions on your payments.

  - `payment_method_data.revolut_pay` (object, optional)
    If this is a `revolut_pay` PaymentMethod, this hash contains details about the Revolut Pay payment method.

  - `payment_method_data.samsung_pay` (object, optional)
    If this is a `samsung_pay` PaymentMethod, this hash contains details about the SamsungPay payment method.

  - `payment_method_data.satispay` (object, optional)
    If this is a `satispay` PaymentMethod, this hash contains details about the Satispay payment method.

  - `payment_method_data.sepa_debit` (object, optional)
    If this is a `sepa_debit` PaymentMethod, this hash contains details about the SEPA debit bank account.

    - `payment_method_data.sepa_debit.iban` (string, required)
      IBAN of the bank account.

  - `payment_method_data.sofort` (object, optional)
    If this is a `sofort` PaymentMethod, this hash contains details about the SOFORT payment method.

    - `payment_method_data.sofort.country` (enum, required)
      Two-letter ISO code representing the country the bank account is located in.

      Austria

      Belgium

      Germany

      Spain

      Italy

      Netherlands

  - `payment_method_data.swish` (object, optional)
    If this is a `swish` PaymentMethod, this hash contains details about the Swish payment method.

  - `payment_method_data.twint` (object, optional)
    If this is a TWINT PaymentMethod, this hash contains details about the TWINT payment method.

  - `payment_method_data.us_bank_account` (object, optional)
    If this is an `us_bank_account` PaymentMethod, this hash contains details about the US bank account payment method.

    - `payment_method_data.us_bank_account.account_holder_type` (enum, optional)
      Account holder type: individual or company.

      Account belongs to a company

      Account belongs to an individual

    - `payment_method_data.us_bank_account.account_number` (string, optional)
      Account number of the bank account.

    - `payment_method_data.us_bank_account.account_type` (enum, optional)
      Account type: checkings or savings. Defaults to checking if omitted.

      Bank account type is checking

      Bank account type is savings

    - `payment_method_data.us_bank_account.financial_connections_account` (string, optional)
      The ID of a Financial Connections Account to use as a payment method.

    - `payment_method_data.us_bank_account.routing_number` (string, optional)
      Routing number of the bank account.

  - `payment_method_data.wechat_pay` (object, optional)
    If this is an `wechat_pay` PaymentMethod, this hash contains details about the wechat_pay payment method.

  - `payment_method_data.zip` (object, optional)
    If this is a `zip` PaymentMethod, this hash contains details about the Zip payment method.

- `payment_method_options` (object, optional)
  Payment-method-specific configuration for this PaymentIntent.

  - `payment_method_options.acss_debit` (object, optional)
    If this is a `acss_debit` PaymentMethod, this sub-hash contains details about the ACSS Debit payment method options.

    - `payment_method_options.acss_debit.mandate_options` (object, optional)
      Additional fields for Mandate creation

      - `payment_method_options.acss_debit.mandate_options.custom_mandate_url` (string, optional)
        A URL for custom mandate text to render during confirmation step.
        The URL will be rendered with additional GET parameters `payment_intent` and `payment_intent_client_secret` when confirming a Payment Intent,
        or `setup_intent` and `setup_intent_client_secret` when confirming a Setup Intent.

      - `payment_method_options.acss_debit.mandate_options.interval_description` (string, optional)
        Description of the mandate interval. Only required if ‘payment_schedule’ parameter is ‘interval’ or ‘combined’.

      - `payment_method_options.acss_debit.mandate_options.payment_schedule` (enum, optional)
        Payment schedule for the mandate.

        Payments can be initiated at a pre-defined interval or sporadically

        Payments are initiated at a regular pre-defined interval

        Payments are initiated sporadically

      - `payment_method_options.acss_debit.mandate_options.transaction_type` (enum, optional)
        Transaction type of the mandate.

        Transactions are made for business reasons

        Transactions are made for personal reasons

    - `payment_method_options.acss_debit.setup_future_usage` (enum, optional)
      Indicates that you intend to make future payments with this PaymentIntent’s payment method.

      If you provide a Customer with the PaymentIntent, you can use this parameter to [attach the payment method](https://docs.stripe.com/payments/save-during-payment.md) to the Customer after the PaymentIntent is confirmed and the customer completes any required actions. If you don’t provide a Customer, you can still [attach](https://docs.stripe.com/api/payment_methods/attach.md) the payment method to a Customer after the transaction completes.

      If the payment method is `card_present` and isn’t a digital wallet, Stripe creates and attaches a [generated_card](https://docs.stripe.com/api/charges/object.md#charge_object-payment_method_details-card_present-generated_card) payment method representing the card to the Customer instead.

      When processing card payments, Stripe uses `setup_future_usage` to help you comply with regional legislation and network rules, such as [SCA](https://docs.stripe.com/strong-customer-authentication.md).

      If you’ve already set `setup_future_usage` and you’re performing a request using a publishable key, you can only update the value from `on_session` to `off_session`.

      Use `none` if you do not intend to reuse this payment method and want to override the top-level `setup_future_usage` value for this payment method.

      Use `off_session` if your customer may or may not be present in your checkout flow.

      Use `on_session` if you intend to only reuse the payment method when your customer is present in your checkout flow.

    - `payment_method_options.acss_debit.target_date` (string, optional)
      Controls when Stripe will attempt to debit the funds from the customer’s account. The date must be a string in YYYY-MM-DD format. The date must be in the future and between 3 and 15 calendar days from now.

    - `payment_method_options.acss_debit.verification_method` (enum, optional)
      Bank account verification method.

      Instant verification with fallback to microdeposits.

      Instant verification.

      Verification using microdeposits.

  - `payment_method_options.affirm` (object, optional)
    If this is an `affirm` PaymentMethod, this sub-hash contains details about the Affirm payment method options.

    - `payment_method_options.affirm.capture_method` (enum, optional)
      Controls when the funds are captured from the customer’s account.

      If provided, this parameter overrides the behavior of the top-level [capture_method](https://docs.stripe.com/api/payment_intents/update.md#update_payment_intent-capture_method) for this payment method type when finalizing the payment with this payment method type.

      If `capture_method` is already set on the PaymentIntent, providing an empty value for this parameter unsets the stored value for this payment method type.

      Use `manual` if you intend to place the funds on hold and want to override the top-level `capture_method` value for this payment method.

    - `payment_method_options.affirm.preferred_locale` (string, optional)
      Preferred language of the Affirm authorization page that the customer is redirected to.

    - `payment_method_options.affirm.setup_future_usage` (enum, optional)
      Indicates that you intend to make future payments with this PaymentIntent’s payment method.

      If you provide a Customer with the PaymentIntent, you can use this parameter to [attach the payment method](https://docs.stripe.com/payments/save-during-payment.md) to the Customer after the PaymentIntent is confirmed and the customer completes any required actions. If you don’t provide a Customer, you can still [attach](https://docs.stripe.com/api/payment_methods/attach.md) the payment method to a Customer after the transaction completes.

      If the payment method is `card_present` and isn’t a digital wallet, Stripe creates and attaches a [generated_card](https://docs.stripe.com/api/charges/object.md#charge_object-payment_method_details-card_present-generated_card) payment method representing the card to the Customer instead.

      When processing card payments, Stripe uses `setup_future_usage` to help you comply with regional legislation and network rules, such as [SCA](https://docs.stripe.com/strong-customer-authentication.md).

      If you’ve already set `setup_future_usage` and you’re performing a request using a publishable key, you can only update the value from `on_session` to `off_session`.

      Use `none` if you do not intend to reuse this payment method and want to override the top-level `setup_future_usage` value for this payment method.

  - `payment_method_options.afterpay_clearpay` (object, optional)
    If this is a `afterpay_clearpay` PaymentMethod, this sub-hash contains details about the Afterpay Clearpay payment method options.

    - `payment_method_options.afterpay_clearpay.capture_method` (enum, optional)
      Controls when the funds are captured from the customer’s account.

      If provided, this parameter overrides the behavior of the top-level [capture_method](https://docs.stripe.com/api/payment_intents/update.md#update_payment_intent-capture_method) for this payment method type when finalizing the payment with this payment method type.

      If `capture_method` is already set on the PaymentIntent, providing an empty value for this parameter unsets the stored value for this payment method type.

      Use `manual` if you intend to place the funds on hold and want to override the top-level `capture_method` value for this payment method.

    - `payment_method_options.afterpay_clearpay.reference` (string, optional)
      An internal identifier or reference that this payment corresponds to. You must limit the identifier to 128 characters, and it can only contain letters, numbers, underscores, backslashes, and dashes.
      This field differs from the statement descriptor and item name.

    - `payment_method_options.afterpay_clearpay.setup_future_usage` (enum, optional)
      Indicates that you intend to make future payments with this PaymentIntent’s payment method.

      If you provide a Customer with the PaymentIntent, you can use this parameter to [attach the payment method](https://docs.stripe.com/payments/save-during-payment.md) to the Customer after the PaymentIntent is confirmed and the customer completes any required actions. If you don’t provide a Customer, you can still [attach](https://docs.stripe.com/api/payment_methods/attach.md) the payment method to a Customer after the transaction completes.

      If the payment method is `card_present` and isn’t a digital wallet, Stripe creates and attaches a [generated_card](https://docs.stripe.com/api/charges/object.md#charge_object-payment_method_details-card_present-generated_card) payment method representing the card to the Customer instead.

      When processing card payments, Stripe uses `setup_future_usage` to help you comply with regional legislation and network rules, such as [SCA](https://docs.stripe.com/strong-customer-authentication.md).

      If you’ve already set `setup_future_usage` and you’re performing a request using a publishable key, you can only update the value from `on_session` to `off_session`.

      Use `none` if you do not intend to reuse this payment method and want to override the top-level `setup_future_usage` value for this payment method.

  - `payment_method_options.alipay` (object, optional)
    If this is a `alipay` PaymentMethod, this sub-hash contains details about the Alipay payment method options.

    - `payment_method_options.alipay.setup_future_usage` (enum, optional)
      Indicates that you intend to make future payments with this PaymentIntent’s payment method.

      If you provide a Customer with the PaymentIntent, you can use this parameter to [attach the payment method](https://docs.stripe.com/payments/save-during-payment.md) to the Customer after the PaymentIntent is confirmed and the customer completes any required actions. If you don’t provide a Customer, you can still [attach](https://docs.stripe.com/api/payment_methods/attach.md) the payment method to a Customer after the transaction completes.

      If the payment method is `card_present` and isn’t a digital wallet, Stripe creates and attaches a [generated_card](https://docs.stripe.com/api/charges/object.md#charge_object-payment_method_details-card_present-generated_card) payment method representing the card to the Customer instead.

      When processing card payments, Stripe uses `setup_future_usage` to help you comply with regional legislation and network rules, such as [SCA](https://docs.stripe.com/strong-customer-authentication.md).

      If you’ve already set `setup_future_usage` and you’re performing a request using a publishable key, you can only update the value from `on_session` to `off_session`.

      Use `none` if you do not intend to reuse this payment method and want to override the top-level `setup_future_usage` value for this payment method.

      Use `off_session` if your customer may or may not be present in your checkout flow.

  - `payment_method_options.alma` (object, optional)
    If this is a `alma` PaymentMethod, this sub-hash contains details about the Alma payment method options.

    - `payment_method_options.alma.capture_method` (enum, optional)
      Controls when the funds are captured from the customer’s account.

      If provided, this parameter overrides the behavior of the top-level [capture_method](https://docs.stripe.com/api/payment_intents/update.md#update_payment_intent-capture_method) for this payment method type when finalizing the payment with this payment method type.

      If `capture_method` is already set on the PaymentIntent, providing an empty value for this parameter unsets the stored value for this payment method type.

      Use `manual` if you intend to place the funds on hold and want to override the top-level `capture_method` value for this payment method.

  - `payment_method_options.amazon_pay` (object, optional)
    If this is a `amazon_pay` PaymentMethod, this sub-hash contains details about the Amazon Pay payment method options.

    - `payment_method_options.amazon_pay.capture_method` (enum, optional)
      Controls when the funds are captured from the customer’s account.

      If provided, this parameter overrides the behavior of the top-level [capture_method](https://docs.stripe.com/api/payment_intents/update.md#update_payment_intent-capture_method) for this payment method type when finalizing the payment with this payment method type.

      If `capture_method` is already set on the PaymentIntent, providing an empty value for this parameter unsets the stored value for this payment method type.

      Use `manual` if you intend to place the funds on hold and want to override the top-level `capture_method` value for this payment method.

    - `payment_method_options.amazon_pay.setup_future_usage` (enum, optional)
      Indicates that you intend to make future payments with this PaymentIntent’s payment method.

      If you provide a Customer with the PaymentIntent, you can use this parameter to [attach the payment method](https://docs.stripe.com/payments/save-during-payment.md) to the Customer after the PaymentIntent is confirmed and the customer completes any required actions. If you don’t provide a Customer, you can still [attach](https://docs.stripe.com/api/payment_methods/attach.md) the payment method to a Customer after the transaction completes.

      If the payment method is `card_present` and isn’t a digital wallet, Stripe creates and attaches a [generated_card](https://docs.stripe.com/api/charges/object.md#charge_object-payment_method_details-card_present-generated_card) payment method representing the card to the Customer instead.

      When processing card payments, Stripe uses `setup_future_usage` to help you comply with regional legislation and network rules, such as [SCA](https://docs.stripe.com/strong-customer-authentication.md).

      Use `none` if you do not intend to reuse this payment method and want to override the top-level `setup_future_usage` value for this payment method.

      Use `off_session` if your customer may or may not be present in your checkout flow.

  - `payment_method_options.au_becs_debit` (object, optional)
    If this is a `au_becs_debit` PaymentMethod, this sub-hash contains details about the AU BECS Direct Debit payment method options.

    - `payment_method_options.au_becs_debit.setup_future_usage` (enum, optional)
      Indicates that you intend to make future payments with this PaymentIntent’s payment method.

      If you provide a Customer with the PaymentIntent, you can use this parameter to [attach the payment method](https://docs.stripe.com/payments/save-during-payment.md) to the Customer after the PaymentIntent is confirmed and the customer completes any required actions. If you don’t provide a Customer, you can still [attach](https://docs.stripe.com/api/payment_methods/attach.md) the payment method to a Customer after the transaction completes.

      If the payment method is `card_present` and isn’t a digital wallet, Stripe creates and attaches a [generated_card](https://docs.stripe.com/api/charges/object.md#charge_object-payment_method_details-card_present-generated_card) payment method representing the card to the Customer instead.

      When processing card payments, Stripe uses `setup_future_usage` to help you comply with regional legislation and network rules, such as [SCA](https://docs.stripe.com/strong-customer-authentication.md).

      If you’ve already set `setup_future_usage` and you’re performing a request using a publishable key, you can only update the value from `on_session` to `off_session`.

      Use `none` if you do not intend to reuse this payment method and want to override the top-level `setup_future_usage` value for this payment method.

      Use `off_session` if your customer may or may not be present in your checkout flow.

      Use `on_session` if you intend to only reuse the payment method when your customer is present in your checkout flow.

    - `payment_method_options.au_becs_debit.target_date` (string, optional)
      Controls when Stripe will attempt to debit the funds from the customer’s account. The date must be a string in YYYY-MM-DD format. The date must be in the future and between 3 and 15 calendar days from now.

  - `payment_method_options.bacs_debit` (object, optional)
    If this is a `bacs_debit` PaymentMethod, this sub-hash contains details about the BACS Debit payment method options.

    - `payment_method_options.bacs_debit.mandate_options` (object, optional)
      Additional fields for Mandate creation

    - `payment_method_options.bacs_debit.setup_future_usage` (enum, optional)
      Indicates that you intend to make future payments with this PaymentIntent’s payment method.

      If you provide a Customer with the PaymentIntent, you can use this parameter to [attach the payment method](https://docs.stripe.com/payments/save-during-payment.md) to the Customer after the PaymentIntent is confirmed and the customer completes any required actions. If you don’t provide a Customer, you can still [attach](https://docs.stripe.com/api/payment_methods/attach.md) the payment method to a Customer after the transaction completes.

      If the payment method is `card_present` and isn’t a digital wallet, Stripe creates and attaches a [generated_card](https://docs.stripe.com/api/charges/object.md#charge_object-payment_method_details-card_present-generated_card) payment method representing the card to the Customer instead.

      When processing card payments, Stripe uses `setup_future_usage` to help you comply with regional legislation and network rules, such as [SCA](https://docs.stripe.com/strong-customer-authentication.md).

      If you’ve already set `setup_future_usage` and you’re performing a request using a publishable key, you can only update the value from `on_session` to `off_session`.

      Use `none` if you do not intend to reuse this payment method and want to override the top-level `setup_future_usage` value for this payment method.

      Use `off_session` if your customer may or may not be present in your checkout flow.

      Use `on_session` if you intend to only reuse the payment method when your customer is present in your checkout flow.

    - `payment_method_options.bacs_debit.target_date` (string, optional)
      Controls when Stripe will attempt to debit the funds from the customer’s account. The date must be a string in YYYY-MM-DD format. The date must be in the future and between 3 and 15 calendar days from now.

  - `payment_method_options.bancontact` (object, optional)
    If this is a `bancontact` PaymentMethod, this sub-hash contains details about the Bancontact payment method options.

    - `payment_method_options.bancontact.preferred_language` (enum, optional)
      Preferred language of the Bancontact authorization page that the customer is redirected to.

      German

      English

      French

      Dutch

    - `payment_method_options.bancontact.setup_future_usage` (enum, optional)
      Indicates that you intend to make future payments with this PaymentIntent’s payment method.

      If you provide a Customer with the PaymentIntent, you can use this parameter to [attach the payment method](https://docs.stripe.com/payments/save-during-payment.md) to the Customer after the PaymentIntent is confirmed and the customer completes any required actions. If you don’t provide a Customer, you can still [attach](https://docs.stripe.com/api/payment_methods/attach.md) the payment method to a Customer after the transaction completes.

      If the payment method is `card_present` and isn’t a digital wallet, Stripe creates and attaches a [generated_card](https://docs.stripe.com/api/charges/object.md#charge_object-payment_method_details-card_present-generated_card) payment method representing the card to the Customer instead.

      When processing card payments, Stripe uses `setup_future_usage` to help you comply with regional legislation and network rules, such as [SCA](https://docs.stripe.com/strong-customer-authentication.md).

      If you’ve already set `setup_future_usage` and you’re performing a request using a publishable key, you can only update the value from `on_session` to `off_session`.

      Use `none` if you do not intend to reuse this payment method and want to override the top-level `setup_future_usage` value for this payment method.

      Use `off_session` if your customer may or may not be present in your checkout flow.

  - `payment_method_options.billie` (object, optional)
    If this is a `billie` PaymentMethod, this sub-hash contains details about the Billie payment method options.

    - `payment_method_options.billie.capture_method` (enum, optional)
      Controls when the funds are captured from the customer’s account.

      If provided, this parameter overrides the behavior of the top-level [capture_method](https://docs.stripe.com/api/payment_intents/update.md#update_payment_intent-capture_method) for this payment method type when finalizing the payment with this payment method type.

      If `capture_method` is already set on the PaymentIntent, providing an empty value for this parameter unsets the stored value for this payment method type.

      Use `manual` if you intend to place the funds on hold and want to override the top-level `capture_method` value for this payment method.

  - `payment_method_options.blik` (object, optional)
    If this is a `blik` PaymentMethod, this sub-hash contains details about the BLIK payment method options.

    - `payment_method_options.blik.code` (string, optional)
      The 6-digit BLIK code that a customer has generated using their banking application. Can only be set on confirmation.

    - `payment_method_options.blik.setup_future_usage` (enum, optional)
      Indicates that you intend to make future payments with this PaymentIntent’s payment method.

      If you provide a Customer with the PaymentIntent, you can use this parameter to [attach the payment method](https://docs.stripe.com/payments/save-during-payment.md) to the Customer after the PaymentIntent is confirmed and the customer completes any required actions. If you don’t provide a Customer, you can still [attach](https://docs.stripe.com/api/payment_methods/attach.md) the payment method to a Customer after the transaction completes.

      If the payment method is `card_present` and isn’t a digital wallet, Stripe creates and attaches a [generated_card](https://docs.stripe.com/api/charges/object.md#charge_object-payment_method_details-card_present-generated_card) payment method representing the card to the Customer instead.

      When processing card payments, Stripe uses `setup_future_usage` to help you comply with regional legislation and network rules, such as [SCA](https://docs.stripe.com/strong-customer-authentication.md).

      If you’ve already set `setup_future_usage` and you’re performing a request using a publishable key, you can only update the value from `on_session` to `off_session`.

      Use `none` if you do not intend to reuse this payment method and want to override the top-level `setup_future_usage` value for this payment method.

  - `payment_method_options.boleto` (object, optional)
    If this is a `boleto` PaymentMethod, this sub-hash contains details about the Boleto payment method options.

    - `payment_method_options.boleto.expires_after_days` (integer, optional)
      The number of calendar days before a Boleto voucher expires. For example, if you create a Boleto voucher on Monday and you set expires_after_days to 2, the Boleto invoice will expire on Wednesday at 23:59 America/Sao_Paulo time.

    - `payment_method_options.boleto.setup_future_usage` (enum, optional)
      Indicates that you intend to make future payments with this PaymentIntent’s payment method.

      If you provide a Customer with the PaymentIntent, you can use this parameter to [attach the payment method](https://docs.stripe.com/payments/save-during-payment.md) to the Customer after the PaymentIntent is confirmed and the customer completes any required actions. If you don’t provide a Customer, you can still [attach](https://docs.stripe.com/api/payment_methods/attach.md) the payment method to a Customer after the transaction completes.

      If the payment method is `card_present` and isn’t a digital wallet, Stripe creates and attaches a [generated_card](https://docs.stripe.com/api/charges/object.md#charge_object-payment_method_details-card_present-generated_card) payment method representing the card to the Customer instead.

      When processing card payments, Stripe uses `setup_future_usage` to help you comply with regional legislation and network rules, such as [SCA](https://docs.stripe.com/strong-customer-authentication.md).

      If you’ve already set `setup_future_usage` and you’re performing a request using a publishable key, you can only update the value from `on_session` to `off_session`.

      Use `none` if you do not intend to reuse this payment method and want to override the top-level `setup_future_usage` value for this payment method.

      Use `off_session` if your customer may or may not be present in your checkout flow.

      Use `on_session` if you intend to only reuse the payment method when your customer is present in your checkout flow.

  - `payment_method_options.card` (object, optional)
    Configuration for any card payments attempted on this PaymentIntent.

    - `payment_method_options.card.capture_method` (enum, optional)
      Controls when the funds are captured from the customer’s account.

      If provided, this parameter overrides the behavior of the top-level [capture_method](https://docs.stripe.com/api/payment_intents/update.md#update_payment_intent-capture_method) for this payment method type when finalizing the payment with this payment method type.

      If `capture_method` is already set on the PaymentIntent, providing an empty value for this parameter unsets the stored value for this payment method type.

      Use `manual` if you intend to place the funds on hold and want to override the top-level `capture_method` value for this payment method.

    - `payment_method_options.card.cvc_token` (string, optional)
      A single-use `cvc_update` Token that represents a card CVC value. When provided, the CVC value will be verified during the card payment attempt. This parameter can only be provided during confirmation.

    - `payment_method_options.card.installments` (object, optional)
      Installment configuration for payments attempted on this PaymentIntent (Mexico Only).

      For more information, see the [installments integration guide](https://docs.stripe.com/docs/payments/installments.md).

      - `payment_method_options.card.installments.enabled` (boolean, optional)
        Setting to true enables installments for this PaymentIntent.
        This will cause the response to contain a list of available installment plans.
        Setting to false will prevent any selected plan from applying to a charge.

      - `payment_method_options.card.installments.plan` (object, optional)
        The selected installment plan to use for this payment attempt.
        This parameter can only be provided during confirmation.

        - `payment_method_options.card.installments.plan.type` (enum, required)
          Type of installment plan, one of `fixed_count`.

        - `payment_method_options.card.installments.plan.count` (integer, optional)
          For `fixed_count` installment plans, this is required. It represents the number of installment payments your customer will make to their credit card.

        - `payment_method_options.card.installments.plan.interval` (enum, optional)
          For `fixed_count` installment plans, this is required. It represents the interval between installment payments your customer will make to their credit card.
          One of `month`.

    - `payment_method_options.card.mandate_options` (object, optional)
      Configuration options for setting up an eMandate for cards issued in India.

      - `payment_method_options.card.mandate_options.amount` (integer, required)
        Amount to be charged for future payments.

      - `payment_method_options.card.mandate_options.amount_type` (enum, required)
        One of `fixed` or `maximum`. If `fixed`, the `amount` param refers to the exact amount to be charged in future payments. If `maximum`, the amount charged can be up to the value passed for the `amount` param.

      - `payment_method_options.card.mandate_options.interval` (enum, required)
        Specifies payment frequency. One of `day`, `week`, `month`, `year`, or `sporadic`.

      - `payment_method_options.card.mandate_options.reference` (string, required)
        Unique identifier for the mandate or subscription.

      - `payment_method_options.card.mandate_options.start_date` (timestamp, required)
        Start date of the mandate or subscription. Start date should not be lesser than yesterday.

      - `payment_method_options.card.mandate_options.description` (string, optional)
        A description of the mandate or subscription that is meant to be displayed to the customer.

      - `payment_method_options.card.mandate_options.end_date` (timestamp, optional)
        End date of the mandate or subscription. If not provided, the mandate will be active until canceled. If provided, end date should be after start date.

      - `payment_method_options.card.mandate_options.interval_count` (integer, optional)
        The number of intervals between payments. For example, `interval=month` and `interval_count=3` indicates one payment every three months. Maximum of one year interval allowed (1 year, 12 months, or 52 weeks). This parameter is optional when `interval=sporadic`.

      - `payment_method_options.card.mandate_options.supported_types` (array of enums, optional)
        Specifies the type of mandates supported. Possible values are `india`.

    - `payment_method_options.card.network` (string, optional)
      Selected network to process this PaymentIntent on. Depends on the available networks of the card attached to the PaymentIntent. Can be only set confirm-time.

    - `payment_method_options.card.request_extended_authorization` (enum, optional)
      Request ability to [capture beyond the standard authorization validity window](https://docs.stripe.com/docs/payments/extended-authorization.md) for this PaymentIntent.

      Use `if_available` if you want to extend the capture window when eligible for extended authorization.

      Use `never` if you don’t want to extend the capture window.

    - `payment_method_options.card.request_incremental_authorization` (enum, optional)
      Request ability to [increment the authorization](https://docs.stripe.com/docs/payments/incremental-authorization.md) for this PaymentIntent.

      Use `if_available` if you want to increment the authorization on the PaymentIntent when eligible.

      Use `never` if you don’t want to increment the authorization on the PaymentIntent.

    - `payment_method_options.card.request_multicapture` (enum, optional)
      Request ability to make [multiple captures](https://docs.stripe.com/docs/payments/multicapture.md) for this PaymentIntent.

      Use `if_available` if you want to use multicapture when eligible.

      Use `never` if you don’t want to use multicapture.

    - `payment_method_options.card.request_overcapture` (enum, optional)
      Request ability to [overcapture](https://docs.stripe.com/docs/payments/overcapture.md) for this PaymentIntent.

      Use `if_available` if you want to overcapture the payment when eligible.

      Use `never` if you don’t want to overcapture the payment.

    - `payment_method_options.card.request_three_d_secure` (enum, optional)
      We strongly recommend that you rely on our SCA Engine to automatically prompt your customers for authentication based on risk level and [other requirements](https://docs.stripe.com/docs/strong-customer-authentication.md). However, if you wish to request 3D Secure based on logic from your own fraud engine, provide this option. If not provided, this value defaults to `automatic`. Read our guide on [manually requesting 3D Secure](https://docs.stripe.com/docs/payments/3d-secure/authentication-flow.md#manual-three-ds) for more information on how this configuration interacts with Radar and our SCA Engine.

      Use `any` to manually request 3DS with a preference for a `frictionless` flow, increasing the likelihood of the authentication being completed without any additional input from the customer.
      3DS will always be attempted if it is supported for the card, but Stripe can’t guarantee your preference because the issuer determines the ultimate authentication flow.
      To learn more about 3DS flows, read our [guide](https://stripe.com/guides/3d-secure-2#frictionless-authentication).

      (Default) Our SCA Engine automatically prompts your customers for authentication based on risk level and other requirements.

      Use `challenge` to request 3DS with a preference for a `challenge` flow, where the customer must respond to a prompt for active authentication. Stripe can’t guarantee your preference because the issuer determines the ultimate authentication flow. To learn more about 3DS flows, read our [guide](https://stripe.com/guides/3d-secure-2#frictionless-authentication).

    - `payment_method_options.card.require_cvc_recollection` (boolean, optional)
      When enabled, using a card that is attached to a customer will require the CVC to be provided again (i.e. using the cvc_token parameter).

    - `payment_method_options.card.setup_future_usage` (enum, optional)
      Indicates that you intend to make future payments with this PaymentIntent’s payment method.

      If you provide a Customer with the PaymentIntent, you can use this parameter to [attach the payment method](https://docs.stripe.com/payments/save-during-payment.md) to the Customer after the PaymentIntent is confirmed and the customer completes any required actions. If you don’t provide a Customer, you can still [attach](https://docs.stripe.com/api/payment_methods/attach.md) the payment method to a Customer after the transaction completes.

      If the payment method is `card_present` and isn’t a digital wallet, Stripe creates and attaches a [generated_card](https://docs.stripe.com/api/charges/object.md#charge_object-payment_method_details-card_present-generated_card) payment method representing the card to the Customer instead.

      When processing card payments, Stripe uses `setup_future_usage` to help you comply with regional legislation and network rules, such as [SCA](https://docs.stripe.com/strong-customer-authentication.md).

      If you’ve already set `setup_future_usage` and you’re performing a request using a publishable key, you can only update the value from `on_session` to `off_session`.

      Use `none` if you do not intend to reuse this payment method and want to override the top-level `setup_future_usage` value for this payment method.

      Use `off_session` if your customer may or may not be present in your checkout flow.

      Use `on_session` if you intend to only reuse the payment method when your customer is present in your checkout flow.

    - `payment_method_options.card.statement_descriptor_suffix_kana` (string, optional)
      Provides information about a card payment that customers see on their statements. Concatenated with the Kana prefix (shortened Kana descriptor) or Kana statement descriptor that’s set on the account to form the complete statement descriptor. Maximum 22 characters. On card statements, the *concatenation* of both prefix and suffix (including separators) will appear truncated to 22 characters.

    - `payment_method_options.card.statement_descriptor_suffix_kanji` (string, optional)
      Provides information about a card payment that customers see on their statements. Concatenated with the Kanji prefix (shortened Kanji descriptor) or Kanji statement descriptor that’s set on the account to form the complete statement descriptor. Maximum 17 characters. On card statements, the *concatenation* of both prefix and suffix (including separators) will appear truncated to 17 characters.

    - `payment_method_options.card.three_d_secure` (object, optional)
      If 3D Secure authentication was performed with a third-party provider,
      the authentication details to use for this payment.

      - `payment_method_options.card.three_d_secure.cryptogram` (string, required)
        The cryptogram, also known as the “authentication value” (AAV, CAVV or
        AEVV). This value is 20 bytes, base64-encoded into a 28-character string.
        (Most 3D Secure providers will return the base64-encoded version, which
        is what you should specify here.)

      - `payment_method_options.card.three_d_secure.transaction_id` (string, required)
        For 3D Secure 1, the XID. For 3D Secure 2, the Directory Server
        Transaction ID (dsTransID).

      - `payment_method_options.card.three_d_secure.version` (enum, required)
        The version of 3D Secure that was performed.

      - `payment_method_options.card.three_d_secure.ares_trans_status` (enum, optional)
        The `transStatus` returned from the card Issuer’s ACS in the ARes.

        Attempts processing performed; Not authenticated/verified, but a proof of attempted authentication/verification is provided.

        Challenge required; Additional authentication is required.

        Informational only; 3DS Requestor challenge preference acknowledged.

        Not authenticated/Account not verified; Transaction denied.

        Authentication/Account verification rejected; Issuer is rejecting authentication/verification and request that authorisation not be attempted.

        Authentication/Account verification could not be performed; Technical or other problem.

        Authentication verification successful.

      - `payment_method_options.card.three_d_secure.electronic_commerce_indicator` (enum, optional)
        The Electronic Commerce Indicator (ECI) is returned by your 3D Secure
        provider and indicates what degree of authentication was performed.

        **Mastercard variant:** Attempt acknowledged.

        **Mastercard variant:** Fully authenticated.

        Fully authenticated. The customer likely proved their identity to the
        issuing bank.

        Attempt acknowledged. The customer, or the entire issuing bank, is not
        set up for 3D Secure. Or the issuing bank is experiencing an outage.

        **Mastercard variant:** Acquirer SCA exemption.

        **Mastercard variant:** Fully authenticated recurring transaction.

      - `payment_method_options.card.three_d_secure.exemption_indicator` (enum, optional)
        The exemption requested via 3DS and accepted by the issuer at authentication time.

        Transaction Risk Analysis (TRA) was performed, a low risk exemption was requested via 3DS and granted by the issuer.

        No exemption was requested via 3DS; or, if requested, it was not granted by the issuer.

      - `payment_method_options.card.three_d_secure.network_options` (object, optional)
        Network specific 3DS fields. Network specific arguments require an
        explicit card brand choice. The parameter `payment_method_options.card.network``
        must be populated accordingly

        - `payment_method_options.card.three_d_secure.network_options.cartes_bancaires` (object, optional)
          Cartes Bancaires-specific 3DS fields.

          - `payment_method_options.card.three_d_secure.network_options.cartes_bancaires.cb_avalgo` (enum, required)
            The cryptogram calculation algorithm used by the card Issuer’s ACS
            to calculate the Authentication cryptogram. Also known as `cavvAlgorithm`.
            messageExtension: CB-AVALGO

            HMAC

            CVV

            CVV with ATN

            Mastercard SPA

            American Express SafeKey 1

            AV-CB

          - `payment_method_options.card.three_d_secure.network_options.cartes_bancaires.cb_exemption` (string, optional)
            The exemption indicator returned from Cartes Bancaires in the ARes.
            message extension: CB-EXEMPTION; string (4 characters)
            This is a 3 byte bitmap (low significant byte first and most significant
            bit first) that has been Base64 encoded

          - `payment_method_options.card.three_d_secure.network_options.cartes_bancaires.cb_score` (integer, optional)
            The risk score returned from Cartes Bancaires in the ARes.
            message extension: CB-SCORE; numeric value 0-99

      - `payment_method_options.card.three_d_secure.requestor_challenge_indicator` (string, optional)
        The challenge indicator (`threeDSRequestorChallengeInd`) which was requested in the
        AReq sent to the card Issuer’s ACS. A string containing 2 digits from 01-99.

  - `payment_method_options.card_present` (object, optional)
    If this is a `card_present` PaymentMethod, this sub-hash contains details about the Card Present payment method options.

    - `payment_method_options.card_present.request_extended_authorization` (boolean, optional)
      Request ability to capture this payment beyond the standard [authorization validity window](https://docs.stripe.com/docs/terminal/features/extended-authorizations.md#authorization-validity)

    - `payment_method_options.card_present.request_incremental_authorization_support` (boolean, optional)
      Request ability to [increment](https://docs.stripe.com/docs/terminal/features/incremental-authorizations.md) this PaymentIntent if the combination of MCC and card brand is eligible. Check [incremental_authorization_supported](https://docs.stripe.com/docs/api/charges/object.md#charge_object-payment_method_details-card_present-incremental_authorization_supported) in the [Confirm](https://docs.stripe.com/docs/api/payment_intents/confirm.md) response to verify support.

    - `payment_method_options.card_present.routing` (object, optional)
      Network routing priority on co-branded EMV cards supporting domestic debit and international card schemes.

      - `payment_method_options.card_present.routing.requested_priority` (enum, optional)
        Routing requested priority

        Prioritize domestic debit network routing on payment method collection

        Prioritize international network routing on payment method collection

  - `payment_method_options.cashapp` (object, optional)
    If this is a `cashapp` PaymentMethod, this sub-hash contains details about the Cash App Pay payment method options.

    - `payment_method_options.cashapp.capture_method` (enum, optional)
      Controls when the funds are captured from the customer’s account.

      If provided, this parameter overrides the behavior of the top-level [capture_method](https://docs.stripe.com/api/payment_intents/update.md#update_payment_intent-capture_method) for this payment method type when finalizing the payment with this payment method type.

      If `capture_method` is already set on the PaymentIntent, providing an empty value for this parameter unsets the stored value for this payment method type.

      Use `manual` if you intend to place the funds on hold and want to override the top-level `capture_method` value for this payment method.

    - `payment_method_options.cashapp.setup_future_usage` (enum, optional)
      Indicates that you intend to make future payments with this PaymentIntent’s payment method.

      If you provide a Customer with the PaymentIntent, you can use this parameter to [attach the payment method](https://docs.stripe.com/payments/save-during-payment.md) to the Customer after the PaymentIntent is confirmed and the customer completes any required actions. If you don’t provide a Customer, you can still [attach](https://docs.stripe.com/api/payment_methods/attach.md) the payment method to a Customer after the transaction completes.

      If the payment method is `card_present` and isn’t a digital wallet, Stripe creates and attaches a [generated_card](https://docs.stripe.com/api/charges/object.md#charge_object-payment_method_details-card_present-generated_card) payment method representing the card to the Customer instead.

      When processing card payments, Stripe uses `setup_future_usage` to help you comply with regional legislation and network rules, such as [SCA](https://docs.stripe.com/strong-customer-authentication.md).

      If you’ve already set `setup_future_usage` and you’re performing a request using a publishable key, you can only update the value from `on_session` to `off_session`.

      Use `none` if you do not intend to reuse this payment method and want to override the top-level `setup_future_usage` value for this payment method.

      Use `off_session` if your customer may or may not be present in your checkout flow.

      Use `on_session` if you intend to only reuse the payment method when your customer is present in your checkout flow.

  - `payment_method_options.customer_balance` (object, optional)
    If this is a `customer balance` PaymentMethod, this sub-hash contains details about the customer balance payment method options.

    - `payment_method_options.customer_balance.bank_transfer` (object, optional)
      Configuration for the bank transfer funding type, if the `funding_type` is set to `bank_transfer`.

      - `payment_method_options.customer_balance.bank_transfer.type` (enum, required)
        The list of bank transfer types that this PaymentIntent is allowed to use for funding Permitted values include: `eu_bank_transfer`, `gb_bank_transfer`, `jp_bank_transfer`, `mx_bank_transfer`, or `us_bank_transfer`.

        eu_bank_transfer bank transfer type

        gb_bank_transfer bank transfer type

        jp_bank_transfer bank transfer type

        mx_bank_transfer bank transfer type

        us_bank_transfer bank transfer type

      - `payment_method_options.customer_balance.bank_transfer.eu_bank_transfer` (object, optional)
        Configuration for the eu_bank_transfer funding type.

        - `payment_method_options.customer_balance.bank_transfer.eu_bank_transfer.country` (string, required)
          The desired country code of the bank account information. Permitted values include: `BE`, `DE`, `ES`, `FR`, `IE`, or `NL`.

      - `payment_method_options.customer_balance.bank_transfer.requested_address_types` (array of enums, optional)
        List of address types that should be returned in the financial_addresses response. If not specified, all valid types will be returned.

        Permitted values include: `sort_code`, `zengin`, `iban`, or `spei`.

        aba bank account address type

        iban bank account address type

        sepa bank account address type

        sort_code bank account address type

        spei bank account address type

        swift bank account address type

        zengin bank account address type

    - `payment_method_options.customer_balance.funding_type` (enum, optional)
      The funding method type to be used when there are not enough funds in the customer balance. Permitted values include: `bank_transfer`.

    - `payment_method_options.customer_balance.setup_future_usage` (enum, optional)
      Indicates that you intend to make future payments with this PaymentIntent’s payment method.

      If you provide a Customer with the PaymentIntent, you can use this parameter to [attach the payment method](https://docs.stripe.com/payments/save-during-payment.md) to the Customer after the PaymentIntent is confirmed and the customer completes any required actions. If you don’t provide a Customer, you can still [attach](https://docs.stripe.com/api/payment_methods/attach.md) the payment method to a Customer after the transaction completes.

      If the payment method is `card_present` and isn’t a digital wallet, Stripe creates and attaches a [generated_card](https://docs.stripe.com/api/charges/object.md#charge_object-payment_method_details-card_present-generated_card) payment method representing the card to the Customer instead.

      When processing card payments, Stripe uses `setup_future_usage` to help you comply with regional legislation and network rules, such as [SCA](https://docs.stripe.com/strong-customer-authentication.md).

      If you’ve already set `setup_future_usage` and you’re performing a request using a publishable key, you can only update the value from `on_session` to `off_session`.

      Use `none` if you do not intend to reuse this payment method and want to override the top-level `setup_future_usage` value for this payment method.

  - `payment_method_options.eps` (object, optional)
    If this is a `eps` PaymentMethod, this sub-hash contains details about the EPS payment method options.

    - `payment_method_options.eps.setup_future_usage` (enum, optional)
      Indicates that you intend to make future payments with this PaymentIntent’s payment method.

      If you provide a Customer with the PaymentIntent, you can use this parameter to [attach the payment method](https://docs.stripe.com/payments/save-during-payment.md) to the Customer after the PaymentIntent is confirmed and the customer completes any required actions. If you don’t provide a Customer, you can still [attach](https://docs.stripe.com/api/payment_methods/attach.md) the payment method to a Customer after the transaction completes.

      If the payment method is `card_present` and isn’t a digital wallet, Stripe creates and attaches a [generated_card](https://docs.stripe.com/api/charges/object.md#charge_object-payment_method_details-card_present-generated_card) payment method representing the card to the Customer instead.

      When processing card payments, Stripe uses `setup_future_usage` to help you comply with regional legislation and network rules, such as [SCA](https://docs.stripe.com/strong-customer-authentication.md).

      If you’ve already set `setup_future_usage` and you’re performing a request using a publishable key, you can only update the value from `on_session` to `off_session`.

      Use `none` if you do not intend to reuse this payment method and want to override the top-level `setup_future_usage` value for this payment method.

  - `payment_method_options.fpx` (object, optional)
    If this is a `fpx` PaymentMethod, this sub-hash contains details about the FPX payment method options.

    - `payment_method_options.fpx.setup_future_usage` (enum, optional)
      Indicates that you intend to make future payments with this PaymentIntent’s payment method.

      If you provide a Customer with the PaymentIntent, you can use this parameter to [attach the payment method](https://docs.stripe.com/payments/save-during-payment.md) to the Customer after the PaymentIntent is confirmed and the customer completes any required actions. If you don’t provide a Customer, you can still [attach](https://docs.stripe.com/api/payment_methods/attach.md) the payment method to a Customer after the transaction completes.

      If the payment method is `card_present` and isn’t a digital wallet, Stripe creates and attaches a [generated_card](https://docs.stripe.com/api/charges/object.md#charge_object-payment_method_details-card_present-generated_card) payment method representing the card to the Customer instead.

      When processing card payments, Stripe uses `setup_future_usage` to help you comply with regional legislation and network rules, such as [SCA](https://docs.stripe.com/strong-customer-authentication.md).

      If you’ve already set `setup_future_usage` and you’re performing a request using a publishable key, you can only update the value from `on_session` to `off_session`.

      Use `none` if you do not intend to reuse this payment method and want to override the top-level `setup_future_usage` value for this payment method.

  - `payment_method_options.giropay` (object, optional)
    If this is a `giropay` PaymentMethod, this sub-hash contains details about the Giropay payment method options.

    - `payment_method_options.giropay.setup_future_usage` (enum, optional)
      Indicates that you intend to make future payments with this PaymentIntent’s payment method.

      If you provide a Customer with the PaymentIntent, you can use this parameter to [attach the payment method](https://docs.stripe.com/payments/save-during-payment.md) to the Customer after the PaymentIntent is confirmed and the customer completes any required actions. If you don’t provide a Customer, you can still [attach](https://docs.stripe.com/api/payment_methods/attach.md) the payment method to a Customer after the transaction completes.

      If the payment method is `card_present` and isn’t a digital wallet, Stripe creates and attaches a [generated_card](https://docs.stripe.com/api/charges/object.md#charge_object-payment_method_details-card_present-generated_card) payment method representing the card to the Customer instead.

      When processing card payments, Stripe uses `setup_future_usage` to help you comply with regional legislation and network rules, such as [SCA](https://docs.stripe.com/strong-customer-authentication.md).

      If you’ve already set `setup_future_usage` and you’re performing a request using a publishable key, you can only update the value from `on_session` to `off_session`.

      Use `none` if you do not intend to reuse this payment method and want to override the top-level `setup_future_usage` value for this payment method.

  - `payment_method_options.grabpay` (object, optional)
    If this is a `grabpay` PaymentMethod, this sub-hash contains details about the Grabpay payment method options.

    - `payment_method_options.grabpay.setup_future_usage` (enum, optional)
      Indicates that you intend to make future payments with this PaymentIntent’s payment method.

      If you provide a Customer with the PaymentIntent, you can use this parameter to [attach the payment method](https://docs.stripe.com/payments/save-during-payment.md) to the Customer after the PaymentIntent is confirmed and the customer completes any required actions. If you don’t provide a Customer, you can still [attach](https://docs.stripe.com/api/payment_methods/attach.md) the payment method to a Customer after the transaction completes.

      If the payment method is `card_present` and isn’t a digital wallet, Stripe creates and attaches a [generated_card](https://docs.stripe.com/api/charges/object.md#charge_object-payment_method_details-card_present-generated_card) payment method representing the card to the Customer instead.

      When processing card payments, Stripe uses `setup_future_usage` to help you comply with regional legislation and network rules, such as [SCA](https://docs.stripe.com/strong-customer-authentication.md).

      If you’ve already set `setup_future_usage` and you’re performing a request using a publishable key, you can only update the value from `on_session` to `off_session`.

      Use `none` if you do not intend to reuse this payment method and want to override the top-level `setup_future_usage` value for this payment method.

  - `payment_method_options.ideal` (object, optional)
    If this is a `ideal` PaymentMethod, this sub-hash contains details about the Ideal payment method options.

    - `payment_method_options.ideal.setup_future_usage` (enum, optional)
      Indicates that you intend to make future payments with this PaymentIntent’s payment method.

      If you provide a Customer with the PaymentIntent, you can use this parameter to [attach the payment method](https://docs.stripe.com/payments/save-during-payment.md) to the Customer after the PaymentIntent is confirmed and the customer completes any required actions. If you don’t provide a Customer, you can still [attach](https://docs.stripe.com/api/payment_methods/attach.md) the payment method to a Customer after the transaction completes.

      If the payment method is `card_present` and isn’t a digital wallet, Stripe creates and attaches a [generated_card](https://docs.stripe.com/api/charges/object.md#charge_object-payment_method_details-card_present-generated_card) payment method representing the card to the Customer instead.

      When processing card payments, Stripe uses `setup_future_usage` to help you comply with regional legislation and network rules, such as [SCA](https://docs.stripe.com/strong-customer-authentication.md).

      If you’ve already set `setup_future_usage` and you’re performing a request using a publishable key, you can only update the value from `on_session` to `off_session`.

      Use `none` if you do not intend to reuse this payment method and want to override the top-level `setup_future_usage` value for this payment method.

      Use `off_session` if your customer may or may not be present in your checkout flow.

  - `payment_method_options.kakao_pay` (object, optional)
    If this is a `kakao_pay` PaymentMethod, this sub-hash contains details about the Kakao Pay payment method options.

    - `payment_method_options.kakao_pay.capture_method` (enum, optional)
      Controls when the funds are captured from the customer’s account.

      If provided, this parameter overrides the behavior of the top-level [capture_method](https://docs.stripe.com/api/payment_intents/update.md#update_payment_intent-capture_method) for this payment method type when finalizing the payment with this payment method type.

      If `capture_method` is already set on the PaymentIntent, providing an empty value for this parameter unsets the stored value for this payment method type.

      Use `manual` if you intend to place the funds on hold and want to override the top-level `capture_method` value for this payment method.

    - `payment_method_options.kakao_pay.setup_future_usage` (enum, optional)
      Indicates that you intend to make future payments with this PaymentIntent’s payment method.

      If you provide a Customer with the PaymentIntent, you can use this parameter to [attach the payment method](https://docs.stripe.com/payments/save-during-payment.md) to the Customer after the PaymentIntent is confirmed and the customer completes any required actions. If you don’t provide a Customer, you can still [attach](https://docs.stripe.com/api/payment_methods/attach.md) the payment method to a Customer after the transaction completes.

      If the payment method is `card_present` and isn’t a digital wallet, Stripe creates and attaches a [generated_card](https://docs.stripe.com/api/charges/object.md#charge_object-payment_method_details-card_present-generated_card) payment method representing the card to the Customer instead.

      When processing card payments, Stripe uses `setup_future_usage` to help you comply with regional legislation and network rules, such as [SCA](https://docs.stripe.com/strong-customer-authentication.md).

      Use `none` if you do not intend to reuse this payment method and want to override the top-level `setup_future_usage` value for this payment method.

      Use `off_session` if your customer may or may not be present in your checkout flow.

  - `payment_method_options.klarna` (object, optional)
    If this is a `klarna` PaymentMethod, this sub-hash contains details about the Klarna payment method options.

    - `payment_method_options.klarna.capture_method` (enum, optional)
      Controls when the funds are captured from the customer’s account.

      If provided, this parameter overrides the behavior of the top-level [capture_method](https://docs.stripe.com/api/payment_intents/update.md#update_payment_intent-capture_method) for this payment method type when finalizing the payment with this payment method type.

      If `capture_method` is already set on the PaymentIntent, providing an empty value for this parameter unsets the stored value for this payment method type.

      Use `manual` if you intend to place the funds on hold and want to override the top-level `capture_method` value for this payment method.

    - `payment_method_options.klarna.preferred_locale` (enum, optional)
      Preferred language of the Klarna authorization page that the customer is redirected to

      Czech - Czechia

      Danish - Denmark

      German - Austria

      German - Switzerland

      German - Germany

      Greek - Greece

      English - Austria

      English - Australia

      English - Belgium

      English - Canada

      English - Switzerland

      English - Czechia

      English - Germany

      English - Denmark

      English - Spain

      English - Finland

      English - France

      English - United Kingdom

      English - Greece

      English - Ireland

      English - Italy

      English - Netherlands

      English - Norway

      English - New Zealand

      English - Poland

      English - Portugal

      English - Romania

      English - Sweden

      English - United States of America

      Spanish - Spain

      Spanish - United States of America

      Finnish - Finland

      French - Belgium

      French - Canada

      French - Switzerland

      French - France

      Italy - Switzerland

      Italian - Italy

      Norwegian - Norway

      Dutch - Belgium

      Dutch - Netherlands

      Polish - Poland

      Portugese - Portugal

      Romanian - Romania

      Swedish - Finland

      Swedish - Sweden

    - `payment_method_options.klarna.setup_future_usage` (enum, optional)
      Indicates that you intend to make future payments with this PaymentIntent’s payment method.

      If you provide a Customer with the PaymentIntent, you can use this parameter to [attach the payment method](https://docs.stripe.com/payments/save-during-payment.md) to the Customer after the PaymentIntent is confirmed and the customer completes any required actions. If you don’t provide a Customer, you can still [attach](https://docs.stripe.com/api/payment_methods/attach.md) the payment method to a Customer after the transaction completes.

      If the payment method is `card_present` and isn’t a digital wallet, Stripe creates and attaches a [generated_card](https://docs.stripe.com/api/charges/object.md#charge_object-payment_method_details-card_present-generated_card) payment method representing the card to the Customer instead.

      When processing card payments, Stripe uses `setup_future_usage` to help you comply with regional legislation and network rules, such as [SCA](https://docs.stripe.com/strong-customer-authentication.md).

      If you’ve already set `setup_future_usage` and you’re performing a request using a publishable key, you can only update the value from `on_session` to `off_session`.

      Use `none` if you do not intend to reuse this payment method and want to override the top-level `setup_future_usage` value for this payment method.

  - `payment_method_options.konbini` (object, optional)
    If this is a `konbini` PaymentMethod, this sub-hash contains details about the Konbini payment method options.

    - `payment_method_options.konbini.confirmation_number` (string, optional)
      An optional 10 to 11 digit numeric-only string determining the confirmation code at applicable convenience stores. Must not consist of only zeroes and could be rejected in case of insufficient uniqueness. We recommend to use the customer’s phone number.

    - `payment_method_options.konbini.expires_after_days` (integer, optional)
      The number of calendar days (between 1 and 60) after which Konbini payment instructions will expire. For example, if a PaymentIntent is confirmed with Konbini and `expires_after_days` set to 2 on Monday JST, the instructions will expire on Wednesday 23:59:59 JST. Defaults to 3 days.

    - `payment_method_options.konbini.expires_at` (timestamp, optional)
      The timestamp at which the Konbini payment instructions will expire. Only one of `expires_after_days` or `expires_at` may be set.

    - `payment_method_options.konbini.product_description` (string, optional)
      A product descriptor of up to 22 characters, which will appear to customers at the convenience store.

    - `payment_method_options.konbini.setup_future_usage` (enum, optional)
      Indicates that you intend to make future payments with this PaymentIntent’s payment method.

      If you provide a Customer with the PaymentIntent, you can use this parameter to [attach the payment method](https://docs.stripe.com/payments/save-during-payment.md) to the Customer after the PaymentIntent is confirmed and the customer completes any required actions. If you don’t provide a Customer, you can still [attach](https://docs.stripe.com/api/payment_methods/attach.md) the payment method to a Customer after the transaction completes.

      If the payment method is `card_present` and isn’t a digital wallet, Stripe creates and attaches a [generated_card](https://docs.stripe.com/api/charges/object.md#charge_object-payment_method_details-card_present-generated_card) payment method representing the card to the Customer instead.

      When processing card payments, Stripe uses `setup_future_usage` to help you comply with regional legislation and network rules, such as [SCA](https://docs.stripe.com/strong-customer-authentication.md).

      If you’ve already set `setup_future_usage` and you’re performing a request using a publishable key, you can only update the value from `on_session` to `off_session`.

      Use `none` if you do not intend to reuse this payment method and want to override the top-level `setup_future_usage` value for this payment method.

  - `payment_method_options.kr_card` (object, optional)
    If this is a `kr_card` PaymentMethod, this sub-hash contains details about the KR Card payment method options.

    - `payment_method_options.kr_card.capture_method` (enum, optional)
      Controls when the funds are captured from the customer’s account.

      If provided, this parameter overrides the behavior of the top-level [capture_method](https://docs.stripe.com/api/payment_intents/update.md#update_payment_intent-capture_method) for this payment method type when finalizing the payment with this payment method type.

      If `capture_method` is already set on the PaymentIntent, providing an empty value for this parameter unsets the stored value for this payment method type.

      Use `manual` if you intend to place the funds on hold and want to override the top-level `capture_method` value for this payment method.

    - `payment_method_options.kr_card.setup_future_usage` (enum, optional)
      Indicates that you intend to make future payments with this PaymentIntent’s payment method.

      If you provide a Customer with the PaymentIntent, you can use this parameter to [attach the payment method](https://docs.stripe.com/payments/save-during-payment.md) to the Customer after the PaymentIntent is confirmed and the customer completes any required actions. If you don’t provide a Customer, you can still [attach](https://docs.stripe.com/api/payment_methods/attach.md) the payment method to a Customer after the transaction completes.

      If the payment method is `card_present` and isn’t a digital wallet, Stripe creates and attaches a [generated_card](https://docs.stripe.com/api/charges/object.md#charge_object-payment_method_details-card_present-generated_card) payment method representing the card to the Customer instead.

      When processing card payments, Stripe uses `setup_future_usage` to help you comply with regional legislation and network rules, such as [SCA](https://docs.stripe.com/strong-customer-authentication.md).

      Use `none` if you do not intend to reuse this payment method and want to override the top-level `setup_future_usage` value for this payment method.

      Use `off_session` if your customer may or may not be present in your checkout flow.

  - `payment_method_options.link` (object, optional)
    If this is a `link` PaymentMethod, this sub-hash contains details about the Link payment method options.

    - `payment_method_options.link.capture_method` (enum, optional)
      Controls when the funds are captured from the customer’s account.

      If provided, this parameter overrides the behavior of the top-level [capture_method](https://docs.stripe.com/api/payment_intents/update.md#update_payment_intent-capture_method) for this payment method type when finalizing the payment with this payment method type.

      If `capture_method` is already set on the PaymentIntent, providing an empty value for this parameter unsets the stored value for this payment method type.

      Use `manual` if you intend to place the funds on hold and want to override the top-level `capture_method` value for this payment method.

    - `payment_method_options.link.setup_future_usage` (enum, optional)
      Indicates that you intend to make future payments with this PaymentIntent’s payment method.

      If you provide a Customer with the PaymentIntent, you can use this parameter to [attach the payment method](https://docs.stripe.com/payments/save-during-payment.md) to the Customer after the PaymentIntent is confirmed and the customer completes any required actions. If you don’t provide a Customer, you can still [attach](https://docs.stripe.com/api/payment_methods/attach.md) the payment method to a Customer after the transaction completes.

      If the payment method is `card_present` and isn’t a digital wallet, Stripe creates and attaches a [generated_card](https://docs.stripe.com/api/charges/object.md#charge_object-payment_method_details-card_present-generated_card) payment method representing the card to the Customer instead.

      When processing card payments, Stripe uses `setup_future_usage` to help you comply with regional legislation and network rules, such as [SCA](https://docs.stripe.com/strong-customer-authentication.md).

      If you’ve already set `setup_future_usage` and you’re performing a request using a publishable key, you can only update the value from `on_session` to `off_session`.

      Use `none` if you do not intend to reuse this payment method and want to override the top-level `setup_future_usage` value for this payment method.

      Use `off_session` if your customer may or may not be present in your checkout flow.

  - `payment_method_options.mobilepay` (object, optional)
    If this is a `MobilePay` PaymentMethod, this sub-hash contains details about the MobilePay payment method options.

    - `payment_method_options.mobilepay.capture_method` (enum, optional)
      Controls when the funds are captured from the customer’s account.

      If provided, this parameter overrides the behavior of the top-level [capture_method](https://docs.stripe.com/api/payment_intents/update.md#update_payment_intent-capture_method) for this payment method type when finalizing the payment with this payment method type.

      If `capture_method` is already set on the PaymentIntent, providing an empty value for this parameter unsets the stored value for this payment method type.

      Use `manual` if you intend to place the funds on hold and want to override the top-level `capture_method` value for this payment method.

    - `payment_method_options.mobilepay.setup_future_usage` (enum, optional)
      Indicates that you intend to make future payments with this PaymentIntent’s payment method.

      If you provide a Customer with the PaymentIntent, you can use this parameter to [attach the payment method](https://docs.stripe.com/payments/save-during-payment.md) to the Customer after the PaymentIntent is confirmed and the customer completes any required actions. If you don’t provide a Customer, you can still [attach](https://docs.stripe.com/api/payment_methods/attach.md) the payment method to a Customer after the transaction completes.

      If the payment method is `card_present` and isn’t a digital wallet, Stripe creates and attaches a [generated_card](https://docs.stripe.com/api/charges/object.md#charge_object-payment_method_details-card_present-generated_card) payment method representing the card to the Customer instead.

      When processing card payments, Stripe uses `setup_future_usage` to help you comply with regional legislation and network rules, such as [SCA](https://docs.stripe.com/strong-customer-authentication.md).

      If you’ve already set `setup_future_usage` and you’re performing a request using a publishable key, you can only update the value from `on_session` to `off_session`.

      Use `none` if you do not intend to reuse this payment method and want to override the top-level `setup_future_usage` value for this payment method.

  - `payment_method_options.multibanco` (object, optional)
    If this is a `multibanco` PaymentMethod, this sub-hash contains details about the Multibanco payment method options.

    - `payment_method_options.multibanco.setup_future_usage` (enum, optional)
      Indicates that you intend to make future payments with this PaymentIntent’s payment method.

      If you provide a Customer with the PaymentIntent, you can use this parameter to [attach the payment method](https://docs.stripe.com/payments/save-during-payment.md) to the Customer after the PaymentIntent is confirmed and the customer completes any required actions. If you don’t provide a Customer, you can still [attach](https://docs.stripe.com/api/payment_methods/attach.md) the payment method to a Customer after the transaction completes.

      If the payment method is `card_present` and isn’t a digital wallet, Stripe creates and attaches a [generated_card](https://docs.stripe.com/api/charges/object.md#charge_object-payment_method_details-card_present-generated_card) payment method representing the card to the Customer instead.

      When processing card payments, Stripe uses `setup_future_usage` to help you comply with regional legislation and network rules, such as [SCA](https://docs.stripe.com/strong-customer-authentication.md).

      If you’ve already set `setup_future_usage` and you’re performing a request using a publishable key, you can only update the value from `on_session` to `off_session`.

      Use `none` if you do not intend to reuse this payment method and want to override the top-level `setup_future_usage` value for this payment method.

  - `payment_method_options.naver_pay` (object, optional)
    If this is a `naver_pay` PaymentMethod, this sub-hash contains details about the Naver Pay payment method options.

    - `payment_method_options.naver_pay.capture_method` (enum, optional)
      Controls when the funds are captured from the customer’s account.

      If provided, this parameter overrides the behavior of the top-level [capture_method](https://docs.stripe.com/api/payment_intents/update.md#update_payment_intent-capture_method) for this payment method type when finalizing the payment with this payment method type.

      If `capture_method` is already set on the PaymentIntent, providing an empty value for this parameter unsets the stored value for this payment method type.

      Use `manual` if you intend to place the funds on hold and want to override the top-level `capture_method` value for this payment method.

    - `payment_method_options.naver_pay.setup_future_usage` (enum, optional)
      Indicates that you intend to make future payments with this PaymentIntent’s payment method.

      If you provide a Customer with the PaymentIntent, you can use this parameter to [attach the payment method](https://docs.stripe.com/payments/save-during-payment.md) to the Customer after the PaymentIntent is confirmed and the customer completes any required actions. If you don’t provide a Customer, you can still [attach](https://docs.stripe.com/api/payment_methods/attach.md) the payment method to a Customer after the transaction completes.

      If the payment method is `card_present` and isn’t a digital wallet, Stripe creates and attaches a [generated_card](https://docs.stripe.com/api/charges/object.md#charge_object-payment_method_details-card_present-generated_card) payment method representing the card to the Customer instead.

      When processing card payments, Stripe uses `setup_future_usage` to help you comply with regional legislation and network rules, such as [SCA](https://docs.stripe.com/strong-customer-authentication.md).

      Use `none` if you do not intend to reuse this payment method and want to override the top-level `setup_future_usage` value for this payment method.

      Use `off_session` if your customer may or may not be present in your checkout flow.

  - `payment_method_options.nz_bank_account` (object, optional)
    If this is a `nz_bank_account` PaymentMethod, this sub-hash contains details about the NZ BECS Direct Debit payment method options.

    - `payment_method_options.nz_bank_account.setup_future_usage` (enum, optional)
      Indicates that you intend to make future payments with this PaymentIntent’s payment method.

      If you provide a Customer with the PaymentIntent, you can use this parameter to [attach the payment method](https://docs.stripe.com/payments/save-during-payment.md) to the Customer after the PaymentIntent is confirmed and the customer completes any required actions. If you don’t provide a Customer, you can still [attach](https://docs.stripe.com/api/payment_methods/attach.md) the payment method to a Customer after the transaction completes.

      If the payment method is `card_present` and isn’t a digital wallet, Stripe creates and attaches a [generated_card](https://docs.stripe.com/api/charges/object.md#charge_object-payment_method_details-card_present-generated_card) payment method representing the card to the Customer instead.

      When processing card payments, Stripe uses `setup_future_usage` to help you comply with regional legislation and network rules, such as [SCA](https://docs.stripe.com/strong-customer-authentication.md).

      If you’ve already set `setup_future_usage` and you’re performing a request using a publishable key, you can only update the value from `on_session` to `off_session`.

      Use `none` if you do not intend to reuse this payment method and want to override the top-level `setup_future_usage` value for this payment method.

      Use `off_session` if your customer may or may not be present in your checkout flow.

      Use `on_session` if you intend to only reuse the payment method when your customer is present in your checkout flow.

    - `payment_method_options.nz_bank_account.target_date` (string, optional)
      Controls when Stripe will attempt to debit the funds from the customer’s account. The date must be a string in YYYY-MM-DD format. The date must be in the future and between 3 and 15 calendar days from now.

  - `payment_method_options.oxxo` (object, optional)
    If this is a `oxxo` PaymentMethod, this sub-hash contains details about the OXXO payment method options.

    - `payment_method_options.oxxo.expires_after_days` (integer, optional)
      The number of calendar days before an OXXO voucher expires. For example, if you create an OXXO voucher on Monday and you set expires_after_days to 2, the OXXO invoice will expire on Wednesday at 23:59 America/Mexico_City time.

    - `payment_method_options.oxxo.setup_future_usage` (enum, optional)
      Indicates that you intend to make future payments with this PaymentIntent’s payment method.

      If you provide a Customer with the PaymentIntent, you can use this parameter to [attach the payment method](https://docs.stripe.com/payments/save-during-payment.md) to the Customer after the PaymentIntent is confirmed and the customer completes any required actions. If you don’t provide a Customer, you can still [attach](https://docs.stripe.com/api/payment_methods/attach.md) the payment method to a Customer after the transaction completes.

      If the payment method is `card_present` and isn’t a digital wallet, Stripe creates and attaches a [generated_card](https://docs.stripe.com/api/charges/object.md#charge_object-payment_method_details-card_present-generated_card) payment method representing the card to the Customer instead.

      When processing card payments, Stripe uses `setup_future_usage` to help you comply with regional legislation and network rules, such as [SCA](https://docs.stripe.com/strong-customer-authentication.md).

      If you’ve already set `setup_future_usage` and you’re performing a request using a publishable key, you can only update the value from `on_session` to `off_session`.

      Use `none` if you do not intend to reuse this payment method and want to override the top-level `setup_future_usage` value for this payment method.

  - `payment_method_options.p24` (object, optional)
    If this is a `p24` PaymentMethod, this sub-hash contains details about the Przelewy24 payment method options.

    - `payment_method_options.p24.setup_future_usage` (enum, optional)
      Indicates that you intend to make future payments with this PaymentIntent’s payment method.

      If you provide a Customer with the PaymentIntent, you can use this parameter to [attach the payment method](https://docs.stripe.com/payments/save-during-payment.md) to the Customer after the PaymentIntent is confirmed and the customer completes any required actions. If you don’t provide a Customer, you can still [attach](https://docs.stripe.com/api/payment_methods/attach.md) the payment method to a Customer after the transaction completes.

      If the payment method is `card_present` and isn’t a digital wallet, Stripe creates and attaches a [generated_card](https://docs.stripe.com/api/charges/object.md#charge_object-payment_method_details-card_present-generated_card) payment method representing the card to the Customer instead.

      When processing card payments, Stripe uses `setup_future_usage` to help you comply with regional legislation and network rules, such as [SCA](https://docs.stripe.com/strong-customer-authentication.md).

      If you’ve already set `setup_future_usage` and you’re performing a request using a publishable key, you can only update the value from `on_session` to `off_session`.

      Use `none` if you do not intend to reuse this payment method and want to override the top-level `setup_future_usage` value for this payment method.

    - `payment_method_options.p24.tos_shown_and_accepted` (boolean, optional)
      Confirm that the payer has accepted the P24 terms and conditions.

  - `payment_method_options.pay_by_bank` (object, optional)
    If this is a `pay_by_bank` PaymentMethod, this sub-hash contains details about the PayByBank payment method options.

  - `payment_method_options.payco` (object, optional)
    If this is a `payco` PaymentMethod, this sub-hash contains details about the PAYCO payment method options.

    - `payment_method_options.payco.capture_method` (enum, optional)
      Controls when the funds are captured from the customer’s account.

      If provided, this parameter overrides the behavior of the top-level [capture_method](https://docs.stripe.com/api/payment_intents/update.md#update_payment_intent-capture_method) for this payment method type when finalizing the payment with this payment method type.

      If `capture_method` is already set on the PaymentIntent, providing an empty value for this parameter unsets the stored value for this payment method type.

      Use `manual` if you intend to place the funds on hold and want to override the top-level `capture_method` value for this payment method.

  - `payment_method_options.paynow` (object, optional)
    If this is a `paynow` PaymentMethod, this sub-hash contains details about the PayNow payment method options.

    - `payment_method_options.paynow.setup_future_usage` (enum, optional)
      Indicates that you intend to make future payments with this PaymentIntent’s payment method.

      If you provide a Customer with the PaymentIntent, you can use this parameter to [attach the payment method](https://docs.stripe.com/payments/save-during-payment.md) to the Customer after the PaymentIntent is confirmed and the customer completes any required actions. If you don’t provide a Customer, you can still [attach](https://docs.stripe.com/api/payment_methods/attach.md) the payment method to a Customer after the transaction completes.

      If the payment method is `card_present` and isn’t a digital wallet, Stripe creates and attaches a [generated_card](https://docs.stripe.com/api/charges/object.md#charge_object-payment_method_details-card_present-generated_card) payment method representing the card to the Customer instead.

      When processing card payments, Stripe uses `setup_future_usage` to help you comply with regional legislation and network rules, such as [SCA](https://docs.stripe.com/strong-customer-authentication.md).

      If you’ve already set `setup_future_usage` and you’re performing a request using a publishable key, you can only update the value from `on_session` to `off_session`.

      Use `none` if you do not intend to reuse this payment method and want to override the top-level `setup_future_usage` value for this payment method.

  - `payment_method_options.paypal` (object, optional)
    If this is a `paypal` PaymentMethod, this sub-hash contains details about the PayPal payment method options.

    - `payment_method_options.paypal.capture_method` (enum, optional)
      Controls when the funds will be captured from the customer’s account.

      Use `manual` if you intend to place the funds on hold and want to override the top-level `capture_method` value for this payment method.

    - `payment_method_options.paypal.preferred_locale` (enum, optional)
      [Preferred locale](https://docs.stripe.com/docs/payments/paypal/supported-locales.md) of the PayPal checkout page that the customer is redirected to.

      Czech - The Czech Republic

      Danish - Denmark

      German - Austria

      German - Germany

      German - Luxembourg

      Greek - Greece

      English - United Kingdom

      English - United States of America

      Spanish - Spain

      Finnish - Finland

      French - Belgium

      French - France

      French - Luxembourg

      Hungarian - Hungary

      Italian - Italy

      Dutch - Belgium

      Dutch - Netherlands

      Polish - Poland

      Portuguese - Portugal

      Slovak - Slovakia

      Swedish - Sweden

    - `payment_method_options.paypal.reference` (string, optional)
      A reference of the PayPal transaction visible to customer which is mapped to PayPal’s invoice ID. This must be a globally unique ID if you have configured in your PayPal settings to block multiple payments per invoice ID.

    - `payment_method_options.paypal.risk_correlation_id` (string, optional)
      The risk correlation ID for an on-session payment using a saved PayPal payment method.

    - `payment_method_options.paypal.setup_future_usage` (enum, optional)
      Indicates that you intend to make future payments with this PaymentIntent’s payment method.

      If you provide a Customer with the PaymentIntent, you can use this parameter to [attach the payment method](https://docs.stripe.com/payments/save-during-payment.md) to the Customer after the PaymentIntent is confirmed and the customer completes any required actions. If you don’t provide a Customer, you can still [attach](https://docs.stripe.com/api/payment_methods/attach.md) the payment method to a Customer after the transaction completes.

      If the payment method is `card_present` and isn’t a digital wallet, Stripe creates and attaches a [generated_card](https://docs.stripe.com/api/charges/object.md#charge_object-payment_method_details-card_present-generated_card) payment method representing the card to the Customer instead.

      When processing card payments, Stripe uses `setup_future_usage` to help you comply with regional legislation and network rules, such as [SCA](https://docs.stripe.com/strong-customer-authentication.md).

      If you’ve already set `setup_future_usage` and you’re performing a request using a publishable key, you can only update the value from `on_session` to `off_session`.

      Use `none` if you do not intend to reuse this payment method and want to override the top-level `setup_future_usage` value for this payment method.

      Use `off_session` if your customer may or may not be present in your checkout flow.

  - `payment_method_options.pix` (object, optional)
    If this is a `pix` PaymentMethod, this sub-hash contains details about the Pix payment method options.

    - `payment_method_options.pix.expires_after_seconds` (integer, optional)
      The number of seconds (between 10 and 1209600) after which Pix payment will expire. Defaults to 86400 seconds.

    - `payment_method_options.pix.expires_at` (timestamp, optional)
      The timestamp at which the Pix expires (between 10 and 1209600 seconds in the future). Defaults to 1 day in the future.

    - `payment_method_options.pix.setup_future_usage` (enum, optional)
      Indicates that you intend to make future payments with this PaymentIntent’s payment method.

      If you provide a Customer with the PaymentIntent, you can use this parameter to [attach the payment method](https://docs.stripe.com/payments/save-during-payment.md) to the Customer after the PaymentIntent is confirmed and the customer completes any required actions. If you don’t provide a Customer, you can still [attach](https://docs.stripe.com/api/payment_methods/attach.md) the payment method to a Customer after the transaction completes.

      If the payment method is `card_present` and isn’t a digital wallet, Stripe creates and attaches a [generated_card](https://docs.stripe.com/api/charges/object.md#charge_object-payment_method_details-card_present-generated_card) payment method representing the card to the Customer instead.

      When processing card payments, Stripe uses `setup_future_usage` to help you comply with regional legislation and network rules, such as [SCA](https://docs.stripe.com/strong-customer-authentication.md).

      If you’ve already set `setup_future_usage` and you’re performing a request using a publishable key, you can only update the value from `on_session` to `off_session`.

      Use `none` if you do not intend to reuse this payment method and want to override the top-level `setup_future_usage` value for this payment method.

  - `payment_method_options.promptpay` (object, optional)
    If this is a `promptpay` PaymentMethod, this sub-hash contains details about the PromptPay payment method options.

    - `payment_method_options.promptpay.setup_future_usage` (enum, optional)
      Indicates that you intend to make future payments with this PaymentIntent’s payment method.

      If you provide a Customer with the PaymentIntent, you can use this parameter to [attach the payment method](https://docs.stripe.com/payments/save-during-payment.md) to the Customer after the PaymentIntent is confirmed and the customer completes any required actions. If you don’t provide a Customer, you can still [attach](https://docs.stripe.com/api/payment_methods/attach.md) the payment method to a Customer after the transaction completes.

      If the payment method is `card_present` and isn’t a digital wallet, Stripe creates and attaches a [generated_card](https://docs.stripe.com/api/charges/object.md#charge_object-payment_method_details-card_present-generated_card) payment method representing the card to the Customer instead.

      When processing card payments, Stripe uses `setup_future_usage` to help you comply with regional legislation and network rules, such as [SCA](https://docs.stripe.com/strong-customer-authentication.md).

      If you’ve already set `setup_future_usage` and you’re performing a request using a publishable key, you can only update the value from `on_session` to `off_session`.

      Use `none` if you do not intend to reuse this payment method and want to override the top-level `setup_future_usage` value for this payment method.

  - `payment_method_options.revolut_pay` (object, optional)
    If this is a `revolut_pay` PaymentMethod, this sub-hash contains details about the Revolut Pay payment method options.

    - `payment_method_options.revolut_pay.capture_method` (enum, optional)
      Controls when the funds are captured from the customer’s account.

      If provided, this parameter overrides the behavior of the top-level [capture_method](https://docs.stripe.com/api/payment_intents/update.md#update_payment_intent-capture_method) for this payment method type when finalizing the payment with this payment method type.

      If `capture_method` is already set on the PaymentIntent, providing an empty value for this parameter unsets the stored value for this payment method type.

      Use `manual` if you intend to place the funds on hold and want to override the top-level `capture_method` value for this payment method.

    - `payment_method_options.revolut_pay.setup_future_usage` (enum, optional)
      Indicates that you intend to make future payments with this PaymentIntent’s payment method.

      If you provide a Customer with the PaymentIntent, you can use this parameter to [attach the payment method](https://docs.stripe.com/payments/save-during-payment.md) to the Customer after the PaymentIntent is confirmed and the customer completes any required actions. If you don’t provide a Customer, you can still [attach](https://docs.stripe.com/api/payment_methods/attach.md) the payment method to a Customer after the transaction completes.

      If the payment method is `card_present` and isn’t a digital wallet, Stripe creates and attaches a [generated_card](https://docs.stripe.com/api/charges/object.md#charge_object-payment_method_details-card_present-generated_card) payment method representing the card to the Customer instead.

      When processing card payments, Stripe uses `setup_future_usage` to help you comply with regional legislation and network rules, such as [SCA](https://docs.stripe.com/strong-customer-authentication.md).

      Use `none` if you do not intend to reuse this payment method and want to override the top-level `setup_future_usage` value for this payment method.

      Use `off_session` if your customer may or may not be present in your checkout flow.

  - `payment_method_options.samsung_pay` (object, optional)
    If this is a `samsung_pay` PaymentMethod, this sub-hash contains details about the Samsung Pay payment method options.

    - `payment_method_options.samsung_pay.capture_method` (enum, optional)
      Controls when the funds are captured from the customer’s account.

      If provided, this parameter overrides the behavior of the top-level [capture_method](https://docs.stripe.com/api/payment_intents/update.md#update_payment_intent-capture_method) for this payment method type when finalizing the payment with this payment method type.

      If `capture_method` is already set on the PaymentIntent, providing an empty value for this parameter unsets the stored value for this payment method type.

      Use `manual` if you intend to place the funds on hold and want to override the top-level `capture_method` value for this payment method.

  - `payment_method_options.satispay` (object, optional)
    If this is a `satispay` PaymentMethod, this sub-hash contains details about the Satispay payment method options.

    - `payment_method_options.satispay.capture_method` (enum, optional)
      Controls when the funds are captured from the customer’s account.

      If provided, this parameter overrides the behavior of the top-level [capture_method](https://docs.stripe.com/api/payment_intents/update.md#update_payment_intent-capture_method) for this payment method type when finalizing the payment with this payment method type.

      If `capture_method` is already set on the PaymentIntent, providing an empty value for this parameter unsets the stored value for this payment method type.

      Use `manual` if you intend to place the funds on hold and want to override the top-level `capture_method` value for this payment method.

  - `payment_method_options.sepa_debit` (object, optional)
    If this is a `sepa_debit` PaymentIntent, this sub-hash contains details about the SEPA Debit payment method options.

    - `payment_method_options.sepa_debit.mandate_options` (object, optional)
      Additional fields for Mandate creation

    - `payment_method_options.sepa_debit.setup_future_usage` (enum, optional)
      Indicates that you intend to make future payments with this PaymentIntent’s payment method.

      If you provide a Customer with the PaymentIntent, you can use this parameter to [attach the payment method](https://docs.stripe.com/payments/save-during-payment.md) to the Customer after the PaymentIntent is confirmed and the customer completes any required actions. If you don’t provide a Customer, you can still [attach](https://docs.stripe.com/api/payment_methods/attach.md) the payment method to a Customer after the transaction completes.

      If the payment method is `card_present` and isn’t a digital wallet, Stripe creates and attaches a [generated_card](https://docs.stripe.com/api/charges/object.md#charge_object-payment_method_details-card_present-generated_card) payment method representing the card to the Customer instead.

      When processing card payments, Stripe uses `setup_future_usage` to help you comply with regional legislation and network rules, such as [SCA](https://docs.stripe.com/strong-customer-authentication.md).

      If you’ve already set `setup_future_usage` and you’re performing a request using a publishable key, you can only update the value from `on_session` to `off_session`.

      Use `none` if you do not intend to reuse this payment method and want to override the top-level `setup_future_usage` value for this payment method.

      Use `off_session` if your customer may or may not be present in your checkout flow.

      Use `on_session` if you intend to only reuse the payment method when your customer is present in your checkout flow.

    - `payment_method_options.sepa_debit.target_date` (string, optional)
      Controls when Stripe will attempt to debit the funds from the customer’s account. The date must be a string in YYYY-MM-DD format. The date must be in the future and between 3 and 15 calendar days from now.

  - `payment_method_options.sofort` (object, optional)
    If this is a `sofort` PaymentMethod, this sub-hash contains details about the SOFORT payment method options.

    - `payment_method_options.sofort.preferred_language` (enum, optional)
      Language shown to the payer on redirect.

      German

      English

      Spanish

      French

      Italian

      Dutch

      Polish

    - `payment_method_options.sofort.setup_future_usage` (enum, optional)
      Indicates that you intend to make future payments with this PaymentIntent’s payment method.

      If you provide a Customer with the PaymentIntent, you can use this parameter to [attach the payment method](https://docs.stripe.com/payments/save-during-payment.md) to the Customer after the PaymentIntent is confirmed and the customer completes any required actions. If you don’t provide a Customer, you can still [attach](https://docs.stripe.com/api/payment_methods/attach.md) the payment method to a Customer after the transaction completes.

      If the payment method is `card_present` and isn’t a digital wallet, Stripe creates and attaches a [generated_card](https://docs.stripe.com/api/charges/object.md#charge_object-payment_method_details-card_present-generated_card) payment method representing the card to the Customer instead.

      When processing card payments, Stripe uses `setup_future_usage` to help you comply with regional legislation and network rules, such as [SCA](https://docs.stripe.com/strong-customer-authentication.md).

      If you’ve already set `setup_future_usage` and you’re performing a request using a publishable key, you can only update the value from `on_session` to `off_session`.

      Use `none` if you do not intend to reuse this payment method and want to override the top-level `setup_future_usage` value for this payment method.

      Use `off_session` if your customer may or may not be present in your checkout flow.

  - `payment_method_options.swish` (object, optional)
    If this is a `Swish` PaymentMethod, this sub-hash contains details about the Swish payment method options.

    - `payment_method_options.swish.reference` (string, optional)
      A reference for this payment to be displayed in the Swish app.

    - `payment_method_options.swish.setup_future_usage` (enum, optional)
      Indicates that you intend to make future payments with this PaymentIntent’s payment method.

      If you provide a Customer with the PaymentIntent, you can use this parameter to [attach the payment method](https://docs.stripe.com/payments/save-during-payment.md) to the Customer after the PaymentIntent is confirmed and the customer completes any required actions. If you don’t provide a Customer, you can still [attach](https://docs.stripe.com/api/payment_methods/attach.md) the payment method to a Customer after the transaction completes.

      If the payment method is `card_present` and isn’t a digital wallet, Stripe creates and attaches a [generated_card](https://docs.stripe.com/api/charges/object.md#charge_object-payment_method_details-card_present-generated_card) payment method representing the card to the Customer instead.

      When processing card payments, Stripe uses `setup_future_usage` to help you comply with regional legislation and network rules, such as [SCA](https://docs.stripe.com/strong-customer-authentication.md).

      If you’ve already set `setup_future_usage` and you’re performing a request using a publishable key, you can only update the value from `on_session` to `off_session`.

      Use `none` if you do not intend to reuse this payment method and want to override the top-level `setup_future_usage` value for this payment method.

  - `payment_method_options.twint` (object, optional)
    If this is a `twint` PaymentMethod, this sub-hash contains details about the TWINT payment method options.

    - `payment_method_options.twint.setup_future_usage` (enum, optional)
      Indicates that you intend to make future payments with this PaymentIntent’s payment method.

      If you provide a Customer with the PaymentIntent, you can use this parameter to [attach the payment method](https://docs.stripe.com/payments/save-during-payment.md) to the Customer after the PaymentIntent is confirmed and the customer completes any required actions. If you don’t provide a Customer, you can still [attach](https://docs.stripe.com/api/payment_methods/attach.md) the payment method to a Customer after the transaction completes.

      If the payment method is `card_present` and isn’t a digital wallet, Stripe creates and attaches a [generated_card](https://docs.stripe.com/api/charges/object.md#charge_object-payment_method_details-card_present-generated_card) payment method representing the card to the Customer instead.

      When processing card payments, Stripe uses `setup_future_usage` to help you comply with regional legislation and network rules, such as [SCA](https://docs.stripe.com/strong-customer-authentication.md).

      If you’ve already set `setup_future_usage` and you’re performing a request using a publishable key, you can only update the value from `on_session` to `off_session`.

      Use `none` if you do not intend to reuse this payment method and want to override the top-level `setup_future_usage` value for this payment method.

  - `payment_method_options.us_bank_account` (object, optional)
    If this is a `us_bank_account` PaymentMethod, this sub-hash contains details about the US bank account payment method options.

    - `payment_method_options.us_bank_account.financial_connections` (object, optional)
      Additional fields for Financial Connections Session creation

      - `payment_method_options.us_bank_account.financial_connections.filters` (object, optional)
        Provide filters for the linked accounts that the customer can select for the payment method.

        - `payment_method_options.us_bank_account.financial_connections.filters.account_subcategories` (array of strings, optional)
          The account subcategories to use to filter for selectable accounts. Valid subcategories are `checking` and `savings`.

      - `payment_method_options.us_bank_account.financial_connections.permissions` (array of strings, optional)
        The list of permissions to request. If this parameter is passed, the `payment_method` permission must be included. Valid permissions include: `balances`, `ownership`, `payment_method`, and `transactions`.

      - `payment_method_options.us_bank_account.financial_connections.prefetch` (array of enums, optional)
        List of data features that you would like to retrieve upon account creation.

        Requests to prefetch balance data on accounts collected in this session.

        Requests to prefetch ownership data on accounts collected in this session.

        Requests to prefetch transaction data on accounts collected in this session.

      - `payment_method_options.us_bank_account.financial_connections.return_url` (string, optional)
        For webview integrations only. Upon completing OAuth login in the native browser, the user will be redirected to this URL to return to your app.

    - `payment_method_options.us_bank_account.mandate_options` (object, optional)
      Additional fields for Mandate creation

      - `payment_method_options.us_bank_account.mandate_options.collection_method` (enum, optional)
        The method used to collect offline mandate customer acceptance.

        Mandate customer acceptance was collected using a paper document

    - `payment_method_options.us_bank_account.networks` (object, optional)
      Additional fields for network related functions

      - `payment_method_options.us_bank_account.networks.requested` (array of enums, optional)
        Triggers validations to run across the selected networks

    - `payment_method_options.us_bank_account.preferred_settlement_speed` (enum, optional)
      Preferred transaction settlement speed

      Prefer fastest available settlement

      Prefer standard settlement

    - `payment_method_options.us_bank_account.setup_future_usage` (enum, optional)
      Indicates that you intend to make future payments with this PaymentIntent’s payment method.

      If you provide a Customer with the PaymentIntent, you can use this parameter to [attach the payment method](https://docs.stripe.com/payments/save-during-payment.md) to the Customer after the PaymentIntent is confirmed and the customer completes any required actions. If you don’t provide a Customer, you can still [attach](https://docs.stripe.com/api/payment_methods/attach.md) the payment method to a Customer after the transaction completes.

      If the payment method is `card_present` and isn’t a digital wallet, Stripe creates and attaches a [generated_card](https://docs.stripe.com/api/charges/object.md#charge_object-payment_method_details-card_present-generated_card) payment method representing the card to the Customer instead.

      When processing card payments, Stripe uses `setup_future_usage` to help you comply with regional legislation and network rules, such as [SCA](https://docs.stripe.com/strong-customer-authentication.md).

      If you’ve already set `setup_future_usage` and you’re performing a request using a publishable key, you can only update the value from `on_session` to `off_session`.

      Use `none` if you do not intend to reuse this payment method and want to override the top-level `setup_future_usage` value for this payment method.

      Use `off_session` if your customer may or may not be present in your checkout flow.

      Use `on_session` if you intend to only reuse the payment method when your customer is present in your checkout flow.

    - `payment_method_options.us_bank_account.target_date` (string, optional)
      Controls when Stripe will attempt to debit the funds from the customer’s account. The date must be a string in YYYY-MM-DD format. The date must be in the future and between 3 and 15 calendar days from now.

    - `payment_method_options.us_bank_account.verification_method` (enum, optional)
      Bank account verification method.

      Instant verification with fallback to microdeposits.

      Instant verification only.

      Verification using microdeposits. Cannot be used with Stripe Checkout, Hosted Invoices, or Payment Element.

  - `payment_method_options.wechat_pay` (object, optional)
    If this is a `wechat_pay` PaymentMethod, this sub-hash contains details about the WeChat Pay payment method options.

    - `payment_method_options.wechat_pay.app_id` (string, optional)
      The app ID registered with WeChat Pay. Only required when client is ios or android.

    - `payment_method_options.wechat_pay.client` (enum, optional)
      The client type that the end customer will pay from

      The end customer will pay from an Android app

      The end customer will pay from an iOS app

      The end customer will pay from web browser

    - `payment_method_options.wechat_pay.setup_future_usage` (enum, optional)
      Indicates that you intend to make future payments with this PaymentIntent’s payment method.

      If you provide a Customer with the PaymentIntent, you can use this parameter to [attach the payment method](https://docs.stripe.com/payments/save-during-payment.md) to the Customer after the PaymentIntent is confirmed and the customer completes any required actions. If you don’t provide a Customer, you can still [attach](https://docs.stripe.com/api/payment_methods/attach.md) the payment method to a Customer after the transaction completes.

      If the payment method is `card_present` and isn’t a digital wallet, Stripe creates and attaches a [generated_card](https://docs.stripe.com/api/charges/object.md#charge_object-payment_method_details-card_present-generated_card) payment method representing the card to the Customer instead.

      When processing card payments, Stripe uses `setup_future_usage` to help you comply with regional legislation and network rules, such as [SCA](https://docs.stripe.com/strong-customer-authentication.md).

      If you’ve already set `setup_future_usage` and you’re performing a request using a publishable key, you can only update the value from `on_session` to `off_session`.

      Use `none` if you do not intend to reuse this payment method and want to override the top-level `setup_future_usage` value for this payment method.

  - `payment_method_options.zip` (object, optional)
    If this is a `zip` PaymentMethod, this sub-hash contains details about the Zip payment method options.

    - `payment_method_options.zip.setup_future_usage` (enum, optional)
      Indicates that you intend to make future payments with this PaymentIntent’s payment method.

      If you provide a Customer with the PaymentIntent, you can use this parameter to [attach the payment method](https://docs.stripe.com/payments/save-during-payment.md) to the Customer after the PaymentIntent is confirmed and the customer completes any required actions. If you don’t provide a Customer, you can still [attach](https://docs.stripe.com/api/payment_methods/attach.md) the payment method to a Customer after the transaction completes.

      If the payment method is `card_present` and isn’t a digital wallet, Stripe creates and attaches a [generated_card](https://docs.stripe.com/api/charges/object.md#charge_object-payment_method_details-card_present-generated_card) payment method representing the card to the Customer instead.

      When processing card payments, Stripe uses `setup_future_usage` to help you comply with regional legislation and network rules, such as [SCA](https://docs.stripe.com/strong-customer-authentication.md).

      If you’ve already set `setup_future_usage` and you’re performing a request using a publishable key, you can only update the value from `on_session` to `off_session`.

      Use `none` if you do not intend to reuse this payment method and want to override the top-level `setup_future_usage` value for this payment method.

- `payment_method_types` (array of strings, optional)
  The list of payment method types (for example, card) that this PaymentIntent can use. Use `automatic_payment_methods` to manage payment methods from the [Stripe Dashboard](https://dashboard.stripe.com/settings/payment_methods). A list of valid payment method types can be found [here](https://docs.stripe.com/api/payment_methods/object#payment_method_object-type).

- `receipt_email` (string, optional)
  Email address that the receipt for the resulting payment will be sent to. If `receipt_email` is specified for a payment in live mode, a receipt will be sent regardless of your [email settings](https://dashboard.stripe.com/account/emails).

- `setup_future_usage` (enum, optional)
  Indicates that you intend to make future payments with this PaymentIntent’s payment method.

  If you provide a Customer with the PaymentIntent, you can use this parameter to [attach the payment method](https://docs.stripe.com/payments/save-during-payment.md) to the Customer after the PaymentIntent is confirmed and the customer completes any required actions. If you don’t provide a Customer, you can still [attach](https://docs.stripe.com/api/payment_methods/attach.md) the payment method to a Customer after the transaction completes.

  If the payment method is `card_present` and isn’t a digital wallet, Stripe creates and attaches a [generated_card](https://docs.stripe.com/api/charges/object.md#charge_object-payment_method_details-card_present-generated_card) payment method representing the card to the Customer instead.

  When processing card payments, Stripe uses `setup_future_usage` to help you comply with regional legislation and network rules, such as [SCA](https://docs.stripe.com/strong-customer-authentication.md).

  If you’ve already set `setup_future_usage` and you’re performing a request using a publishable key, you can only update the value from `on_session` to `off_session`.

  Use `off_session` if your customer may or may not be present in your checkout flow.

  Use `on_session` if you intend to only reuse the payment method when your customer is present in your checkout flow.

- `shipping` (object, optional)
  Shipping information for this PaymentIntent.

  - `shipping.address` (object, required)
    Shipping address.

    - `shipping.address.city` (string, optional)
      City, district, suburb, town, or village.

    - `shipping.address.country` (string, optional)
      Two-letter country code ([ISO 3166-1 alpha-2](https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2)).

    - `shipping.address.line1` (string, optional)
      Address line 1 (e.g., street, PO Box, or company name).

    - `shipping.address.line2` (string, optional)
      Address line 2 (e.g., apartment, suite, unit, or building).

    - `shipping.address.postal_code` (string, optional)
      ZIP or postal code.

    - `shipping.address.state` (string, optional)
      State, county, province, or region.

  - `shipping.name` (string, required)
    Recipient name.

  - `shipping.carrier` (string, optional)
    The delivery service that shipped a physical product, such as Fedex, UPS, USPS, etc.

  - `shipping.phone` (string, optional)
    Recipient phone (including extension).

  - `shipping.tracking_number` (string, optional)
    The tracking number for a physical product, obtained from the delivery service. If multiple tracking numbers were generated for this purchase, please separate them with commas.

- `statement_descriptor` (string, optional)
  Text that appears on the customer’s statement as the statement descriptor for a non-card charge. This value overrides the account’s default statement descriptor. For information about requirements, including the 22-character limit, see [the Statement Descriptor docs](https://docs.stripe.com/get-started/account/statement-descriptors).

  Setting this value for a card charge returns an error. For card charges, set the [statement_descriptor_suffix](https://docs.stripe.com/get-started/account/statement-descriptors#dynamic) instead.

- `statement_descriptor_suffix` (string, optional)
  Provides information about a card charge. Concatenated to the account’s [statement descriptor prefix](https://docs.stripe.com/get-started/account/statement-descriptors#static) to form the complete statement descriptor that appears on the customer’s statement.

- `transfer_data` (object, optional)
  Use this parameter to automatically create a Transfer when the payment succeeds. Learn more about the [use case for connected accounts](https://docs.stripe.com/docs/payments/connected-accounts.md).

  - `transfer_data.amount` (integer, optional)
    The amount that will be transferred automatically when a charge succeeds.

- `transfer_group` (string, optional)
  A string that identifies the resulting payment as part of a group. You can only provide `transfer_group` if it hasn’t been set. Learn more about the [use case for connected accounts](https://docs.stripe.com/docs/payments/connected-accounts.md).

```dotnet
StripeConfiguration.ApiKey = "<<secret key>>";

var options = new PaymentIntentUpdateOptions
{
    Metadata = new Dictionary<string, string> { { "order_id", "6735" } },
};
var service = new PaymentIntentService();
PaymentIntent paymentIntent = service.Update("pi_3MtwBwLkdIwHu7ix28a3tqPa", options);
```

```go
stripe.Key = "<<secret key>>"

params := &stripe.PaymentIntentParams{};
params.AddMetadata("order_id", "6735")
result, err := paymentintent.Update("pi_3MtwBwLkdIwHu7ix28a3tqPa", params);
```

```java
Stripe.apiKey = "<<secret key>>";

PaymentIntent resource = PaymentIntent.retrieve("pi_3MtwBwLkdIwHu7ix28a3tqPa");

PaymentIntentUpdateParams params =
  PaymentIntentUpdateParams.builder().putMetadata("order_id", "6735").build();

PaymentIntent paymentIntent = resource.update(params);
```

```node
const stripe = require('stripe')('<<secret key>>');

const paymentIntent = await stripe.paymentIntents.update(
  'pi_3MtwBwLkdIwHu7ix28a3tqPa',
  {
    metadata: {
      order_id: '6735',
    },
  }
);
```

```python
import stripe
stripe.api_key = "<<secret key>>"

payment_intent = stripe.PaymentIntent.modify(
  "pi_3MtwBwLkdIwHu7ix28a3tqPa",
  metadata={"order_id": "6735"},
)
```

```php
$stripe = new \Stripe\StripeClient('<<secret key>>');

$paymentIntent = $stripe->paymentIntents->update(
  'pi_3MtwBwLkdIwHu7ix28a3tqPa',
  ['metadata' => ['order_id' => '6735']]
);
```

```ruby
Stripe.api_key = '<<secret key>>'

payment_intent = Stripe::PaymentIntent.update(
  'pi_3MtwBwLkdIwHu7ix28a3tqPa',
  {metadata: {order_id: '6735'}},
)
```

### Response

```json
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
  "metadata": {
    "order_id": "6735"
  },
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
```