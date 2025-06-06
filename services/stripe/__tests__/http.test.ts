import {
  createCustomer,
  createSetupIntent,
  createPaymentIntent,
  retrievePaymentIntent,
  retrieveCustomer,
  listCustomers,
  listCharges,
  createPaymentMethod,
  attachPaymentMethod,
  listPaymentMethods,
  updateCustomer,
  deleteCustomer,
  createEphemeralKey,
  listPrices,
  createProduct,
  createPrice,
  retrieveProduct,
  retrievePrice
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

})
