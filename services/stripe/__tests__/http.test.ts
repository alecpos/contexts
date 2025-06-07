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
} from '../http'

describe('stripe http api', () => {
  it('creates and retrieves a payment intent', async () => {
    const pi = await createPaymentIntent(200, 'usd')
    expect(pi.id).toMatch(/^pi_/)
    const fetched = await retrievePaymentIntent(pi.id)
    expect(fetched.id).toBe(pi.id)
  }, 30000)

  it('creates and retrieves a customer', async () => {
    const customer = await createCustomer()
    const retrieved = await retrieveCustomer(customer.id)
    expect(retrieved.id).toBe(customer.id)
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
    const pi = await createPaymentIntent(250, 'usd')
    const captured = await capturePaymentIntent(pi.id)
    expect(captured.status === 'succeeded' || captured.status === 'requires_capture').toBe(true)
    const canceled = await cancelPaymentIntent(pi.id)
    expect(canceled.status).toBe('canceled')
  }, 60000)

  it('updates and searches payment intents', async () => {
    const pi = await createPaymentIntent(300, 'usd')
    const updated = await updatePaymentIntent(pi.id, { description: 'test' })
    expect(updated.description).toBe('test')
    const results = await searchPaymentIntents(`payment_intent:"${pi.id}"`, 1)
    expect(results.data[0].id).toBe(pi.id)
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
    const all = await listAllPaymentIntents()
    expect(Array.isArray(all)).toBe(true)
  }, 30000)

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

})
