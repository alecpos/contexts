import {
  createCustomer,
  createSetupIntent,
  createPaymentIntent,
  retrievePaymentIntent,
  retrieveCustomer,
  listCustomers,
  listCharges
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
})
