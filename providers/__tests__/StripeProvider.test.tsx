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
} from '../../services/stripe/http'
import { readFileSync } from 'fs'

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
})
