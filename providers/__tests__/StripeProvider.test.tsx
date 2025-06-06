import { createCustomer, createSetupIntent } from '../../services/stripe/http'

describe('StripeProvider', () => {
  it('initializes a customer and setup intent via API', async () => {
    const customer = await createCustomer()
    expect(customer.id).toMatch(/^cus_/)
    const intent = await createSetupIntent(customer.id)
    expect(intent.client_secret).toMatch(/^seti_/)
  }, 30000)

  it('fails if STRIPE_SK is missing', async () => {
    const orig = process.env.STRIPE_SK
    delete process.env.STRIPE_SK
    await expect(createCustomer()).rejects.toThrow('STRIPE_SK not set')
    process.env.STRIPE_SK = orig
  })
})
