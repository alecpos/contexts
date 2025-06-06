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
  listPaymentIntents,
  retrieveSetupIntent,
  detachPaymentMethod,
  capturePaymentIntent,
  updatePaymentIntent,
  main
} from '../http'

describe('stripe http api', () => {
  it('handles payment intent lifecycle', async () => {
    const pi = await createPaymentIntent(200, 'usd', { capture_method: 'manual' })
    console.log('createPaymentIntent', pi)
    expect(pi.id).toMatch(/^pi_/)

    const updated = await updatePaymentIntent(pi.id, { 'metadata[order_id]': '123' })
    console.log('updatePaymentIntent', updated)
    expect(updated.metadata.order_id).toBe('123')

    const fetched = await retrievePaymentIntent(pi.id)
    console.log('retrievePaymentIntent', fetched)
    expect(fetched.id).toBe(pi.id)

    const capture = await capturePaymentIntent(pi.id)
    console.log('capturePaymentIntent', capture)
    expect(capture.error).toBeDefined()

    const list = await listPaymentIntents(1)
    console.log('listPaymentIntents', list)
    expect(Array.isArray(list.data)).toBe(true)
  }, 30000)

  it('creates, fetches and removes a customer with payment method', async () => {
    const customer = await createCustomer()
    console.log('createCustomer', customer)

    const setup = await createSetupIntent(customer.id)
    console.log('createSetupIntent', setup)
    const si = await retrieveSetupIntent(setup.id)
    console.log('retrieveSetupIntent', si)
    expect(si.id).toBe(setup.id)

    const pm = await createPaymentMethod('tok_visa')
    console.log('createPaymentMethod', pm)
    expect(pm.id).toMatch(/^pm_/)

    const attached = await attachPaymentMethod(pm.id, customer.id)
    console.log('attachPaymentMethod', attached)
    expect(attached.customer).toBe(customer.id)

    const methods = await listPaymentMethods(customer.id)
    console.log('listPaymentMethods', methods)
    const found = methods.data.find((m: any) => m.id === pm.id)
    expect(found).toBeTruthy()

    const detached = await detachPaymentMethod(pm.id)
    console.log('detachPaymentMethod', detached)
    expect(detached.id).toBe(pm.id)

    const updated = await updateCustomer(customer.id, { description: 'updated' })
    console.log('updateCustomer', updated)
    expect(updated.description).toBe('updated')

    const deleted = await deleteCustomer(customer.id)
    console.log('deleteCustomer', deleted)
    expect(deleted.deleted).toBe(true)
  }, 30000)

  it('lists customers and charges', async () => {
    const res = await listCustomers(1)
    console.log('listCustomers', res)
    expect(Array.isArray(res.data)).toBe(true)
    const charges = await listCharges(1)
    console.log('listCharges', charges)
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
})
