import {
  createCustomer,
  createSetupIntent,
  createProduct,
  createPrice,
  retrievePrice,
  createPaymentMethod,
  attachPaymentMethod,
  createPaymentIntent,
  confirmPaymentIntent,
  capturePaymentIntent,
  cancelPaymentIntent,
  updatePaymentIntent,
  searchPaymentIntents,
  createSubscription,
  cancelSubscription,
  createEphemeralKey,
  applyCustomerBalance,
  incrementAuthorization,
  listAllPaymentIntents,
} from '../../services/stripe/http'
import { readFileSync } from 'fs'

jest.setTimeout(120000)

describe('StripeProvider', () => {
  it('initializes a customer and setup intent via API', async () => {
    const customer = await createCustomer()
    expect(customer.id).toMatch(/^cus_/)
    const intent = await createSetupIntent(customer.id)
    expect(intent.client_secret).toMatch(/^seti_/)
    const log = readFileSync('logs/stripe.log', 'utf8')
    expect(log).toContain('https://api.stripe.com')
  }, 30000)

  it('fails if STRIPE_SK is missing', async () => {
    const orig = process.env.STRIPE_SK
    delete process.env.STRIPE_SK
    await expect(createCustomer()).rejects.toThrow('STRIPE_SK not set')
    process.env.STRIPE_SK = orig
  })

  it('creates a product, price and completes a test payment', async () => {
    const customer = await createCustomer()
    const product = await createProduct('Test Prod')
    expect(product.id).toMatch(/^prod_/)
    const price = await createPrice(500, 'usd', product.id)
    const priceInfo = await retrievePrice(price.id)
    const pm = await createPaymentMethod('tok_visa')
    await attachPaymentMethod(pm.id, customer.id)
    const intent = await createPaymentIntent(
      priceInfo.unit_amount,
      priceInfo.currency,
      customer.id,
    )
    const confirmed = await confirmPaymentIntent(intent.id, pm.id)
    expect(confirmed.status).toBe('succeeded')
  }, 60000)

  it('creates and cancels a subscription', async () => {
    const customer = await createCustomer()
    const product = await createProduct('Sub Prod')
    const price = await createPrice(999, 'usd', product.id, 'month')
    const pm = await createPaymentMethod('tok_visa')
    await attachPaymentMethod(pm.id, customer.id)
    const sub = await createSubscription(customer.id, price.id, pm.id)
    expect(sub.id).toMatch(/^sub_/)
    const canceled = await cancelSubscription(sub.id)
    expect(canceled.status).toBe('canceled')
  }, 60000)

  it('captures and cancels a payment intent', async () => {
    const customer = await createCustomer()
    const pm = await createPaymentMethod('tok_visa')
    await attachPaymentMethod(pm.id, customer.id)
    const pi = await createPaymentIntent(120, 'usd', customer.id, undefined, undefined, 'manual')
    await confirmPaymentIntent(pi.id, pm.id)
    const captured = await capturePaymentIntent(pi.id)
    expect(captured.status).toBe('succeeded')
    const cancelPi = await createPaymentIntent(130, 'usd')
    const canceled = await cancelPaymentIntent(cancelPi.id)
    expect(canceled.status).toBe('canceled')
  }, 60000)

  it('updates and searches payment intents', async () => {
    const pi = await createPaymentIntent(150, 'usd')
    const updated = await updatePaymentIntent(pi.id, { description: 'test' }, { tag: 'demo' })
    expect(updated.id).toBe(pi.id)
    const results = await searchPaymentIntents(`metadata['tag']:'demo'`, 1)
    expect(results.object).toBe('search_result')
  }, 60000)

  it('creates an ephemeral key for a customer', async () => {
    const customer = await createCustomer()
    const key = await createEphemeralKey(customer.id)
    expect(key.secret).toBeDefined()
  }, 30000)

  it('lists all payment intents via pagination helper', async () => {
    const all = await listAllPaymentIntents(5)
    expect(Array.isArray(all)).toBe(true)
  }, 60000)

  it('supports advanced payment intent helpers', async () => {
    const pi = await createPaymentIntent(175, 'usd')
    await expect(applyCustomerBalance(pi.id)).rejects.toThrow()
    await expect(incrementAuthorization(pi.id, 50)).rejects.toThrow()
  }, 30000)
})
