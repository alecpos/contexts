import {
  createCustomer,
  createSetupIntent,
  createPaymentIntent,
  retrievePaymentIntent,
  retrieveCustomer,
  listCustomers,
  listCharges,
  listPaymentIntents,
  createPaymentMethod,
  attachPaymentMethod,
  listPaymentMethods,
  updateCustomer,
  deleteCustomer,
  confirmPaymentIntent,
  capturePaymentIntent,
  cancelPaymentIntent,
  updatePaymentIntent,
  searchPaymentIntents,
  createEphemeralKey,
  listPrices,
  createProduct,
  createPrice,
  retrieveProduct,
  retrievePrice,
  listAllPaymentIntents,
  applyCustomerBalance,
  incrementAuthorization,
  createCoupon,
  retrieveCoupon,
  deleteCoupon,
  retrieveBalance,
  listEvents,
  createCharge,
  createRefund,
  retrieveRefund,
  createWebhookEndpoint,
  retrieveWebhookEndpoint,
  deleteWebhookEndpoint,
  retrieveAccount,
  listPayouts,
  listDisputes,
  listReviews,
  listApplicationFees,
} from '../http'

jest.setTimeout(120000)

describe('stripe http api', () => {
  it('creates and retrieves a payment intent', async () => {
    const customer = await createCustomer({ test: 'pi' })
    const pi = await createPaymentIntent(200, 'usd', customer.id, { order: '123' }, ['customer'])
    expect(pi.id).toMatch(/^pi_/)
    expect(pi.metadata.order).toBe('123')
    expect(typeof pi.customer).toBe('object')
    const fetched = await retrievePaymentIntent(pi.id, ['customer'])
    expect(fetched.id).toBe(pi.id)
    expect(fetched.metadata.order).toBe('123')
    expect(fetched.customer.id).toBe(customer.id)
  }, 30000)

  it('creates and retrieves a customer', async () => {
    const customer = await createCustomer({ tier: 'gold' })
    expect(customer.metadata.tier).toBe('gold')
    const retrieved = await retrieveCustomer(customer.id, ['tax_ids'])
    expect(retrieved.id).toBe(customer.id)
    expect(retrieved.metadata.tier).toBe('gold')
    expect(retrieved.tax_ids).toBeDefined()
  }, 30000)

  it('lists customers', async () => {
    const res = await listCustomers(1)
    expect(Array.isArray(res.data)).toBe(true)
    expect(res.data.length).toBeGreaterThan(0)
  }, 30000)

  it('lists charges', async () => {
    const charges = await listCharges(1)
    expect(Array.isArray(charges.data)).toBe(true)
  }, 30000)

  it('lists payment intents', async () => {
    const pi = await createPaymentIntent(100, 'usd')
    const list = await listPaymentIntents(3)
    expect(Array.isArray(list.data)).toBe(true)
    const found = list.data.find((p: any) => p.id === pi.id)
    expect(found).toBeTruthy()
  }, 30000)

  it('captures and cancels a payment intent', async () => {
    const customer = await createCustomer()
    const pm = await createPaymentMethod('tok_visa')
    await attachPaymentMethod(pm.id, customer.id)
    const pi = await createPaymentIntent(250, 'usd', customer.id, undefined, undefined, 'manual')
    await confirmPaymentIntent(pi.id, pm.id)
    const captured = await capturePaymentIntent(pi.id)
    expect(captured.status).toBe('succeeded')
    const cancelPi = await createPaymentIntent(260, 'usd')
    const canceled = await cancelPaymentIntent(cancelPi.id)
    expect(canceled.status).toBe('canceled')
  }, 60000)

  it('updates and searches payment intents', async () => {
    const pi = await createPaymentIntent(300, 'usd', undefined, { tag: 'demo' })
    const updated = await updatePaymentIntent(pi.id, { description: 'test' })
    expect(updated.description).toBe('test')
    const results = await searchPaymentIntents(`metadata['tag']:'demo'`, 1)
    expect(results.object).toBe('search_result')
  }, 60000)

  it('creates and attaches a payment method', async () => {
    const customer = await createCustomer()
    const pm = await createPaymentMethod('tok_visa')
    expect(pm.id).toMatch(/^pm_/)
    const attached = await attachPaymentMethod(pm.id, customer.id)
    expect(attached.customer).toBe(customer.id)
    const methods = await listPaymentMethods(customer.id)
    const found = methods.data.find((m: any) => m.id === pm.id)
    expect(found).toBeTruthy()
  }, 30000)

  it('updates and deletes a customer', async () => {
    const customer = await createCustomer()
    const updated = await updateCustomer(customer.id, { description: 'updated' })
    expect(updated.description).toBe('updated')
    const deleted = await deleteCustomer(customer.id)
    expect(deleted.deleted).toBe(true)
  }, 30000)

  it('creates an ephemeral key', async () => {
    const customer = await createCustomer()
    const key = await createEphemeralKey(customer.id)
    expect(key.secret).toBeDefined()
  }, 30000)


  it('creates and retrieves a product and price', async () => {
    const product = await createProduct('Test Product')
    expect(product.id).toMatch(/^prod_/)
    const price = await createPrice(1500, 'usd', product.id)
    expect(price.unit_amount).toBe(1500)
    expect(price.product).toBe(product.id)


    const fetchedProduct = await retrieveProduct(product.id)
    expect(fetchedProduct.name).toBe('Test Product')

    const fetchedPrice = await retrievePrice(price.id)
    expect(fetchedPrice.currency).toBe('usd')
    expect(fetchedPrice.product).toBe(product.id)

  }, 30000)

  it('auto paginates payment intents', async () => {
    const all = await listAllPaymentIntents(5)
    expect(Array.isArray(all)).toBe(true)
  }, 60000)

  it('handles advanced payment intent actions', async () => {
    const pi = await createPaymentIntent(400, 'usd')
    await expect(applyCustomerBalance(pi.id)).rejects.toThrow()
    await expect(incrementAuthorization(pi.id, 100)).rejects.toThrow()
  }, 30000)

  it('creates and retrieves a coupon', async () => {
    const coupon = await createCoupon({ percent_off: '10', duration: 'once' })
    expect(coupon.id).toBeDefined()
    const fetched = await retrieveCoupon(coupon.id)
    expect(fetched.id).toBe(coupon.id)
    await deleteCoupon(coupon.id)
  }, 30000)

  it('retrieves balance and lists events', async () => {
    const balance = await retrieveBalance()
    expect(balance.object).toBe('balance')
    const events = await listEvents(1)
    expect(Array.isArray(events.data)).toBe(true)
  }, 30000)

  it('creates a charge and refund', async () => {
    const charge = await createCharge(250, 'usd', 'tok_visa')
    expect(charge.id).toMatch(/^ch_/)
    const refund = await createRefund({ charge: charge.id })
    expect(refund.charge).toBe(charge.id)
    const fetched = await retrieveRefund(refund.id)
    expect(fetched.id).toBe(refund.id)
  }, 60000)

  it('manages webhook endpoints', async () => {
    const webhook = await createWebhookEndpoint('https://example.com', ['charge.succeeded'])
    expect(webhook.id).toMatch(/^we_/)
    const fetched = await retrieveWebhookEndpoint(webhook.id)
    expect(fetched.id).toBe(webhook.id)
    const del = await deleteWebhookEndpoint(webhook.id)
    expect(del.deleted).toBe(true)
  }, 30000)

  it('retrieves account information', async () => {
    const account = await retrieveAccount()
    expect(account.id).toMatch(/^acct_/)
    expect(account.object).toBe('account')
  }, 30000)

  it('lists payouts', async () => {
    const payouts = await listPayouts(1)
    expect(Array.isArray(payouts.data)).toBe(true)
  }, 30000)

  it('lists disputes', async () => {
    const disputes = await listDisputes(1)
    expect(Array.isArray(disputes.data)).toBe(true)
  }, 30000)

  it('lists reviews', async () => {
    const reviews = await listReviews(1)
    expect(Array.isArray(reviews.data)).toBe(true)
  }, 30000)

  it('lists application fees', async () => {
    const fees = await listApplicationFees(1)
    expect(Array.isArray(fees.data)).toBe(true)
  }, 30000)

  it('creates a setup intent', async () => {
    const customer = await createCustomer()
    const intent = await createSetupIntent(customer.id)
    expect(intent.id).toMatch(/^seti_/)
    expect(intent.customer).toBe(customer.id)
    expect(intent.usage).toBe('off_session')
  }, 30000)

  it('lists prices', async () => {
    const product = await createProduct('Price List Test')
    await createPrice(2000, 'usd', product.id)
    const prices = await listPrices(5)
    expect(Array.isArray(prices.data)).toBe(true)
    expect(prices.data.length).toBeGreaterThan(0)
    const found = prices.data.find((p: any) => p.product === product.id)
    expect(found).toBeTruthy()
    expect(found.unit_amount).toBe(2000)
  }, 30000)

})
