const { exec } = require('child_process')

const STRIPE_URL = 'https://api.stripe.com/v1'

interface RequestOptions {
  method?: string
  body?: URLSearchParams
  headers?: Record<string, string>
}

async function fetchWithFallback(endpoint: string, options: RequestOptions = {}) {
  const sk = process.env.STRIPE_SK
  if (!sk) throw new Error('STRIPE_SK not set')
  const url = `${STRIPE_URL}${endpoint}`
  const method = options.method || 'GET'
  const body = options.body ? options.body.toString() : undefined

  console.info('stripe request', { method, url, body })

  try {
    const res = await fetch(url, {
      method,
      headers: {
        Authorization: `Bearer ${sk}`,
        'Content-Type': 'application/x-www-form-urlencoded',
        ...(options.headers || {}),
      },
      body,
    })
    console.info('stripe response', { status: res.status })
    return await res.json()
  } catch (err) {
    console.warn('fetch failed, using curl fallback', err)
    return new Promise((resolve, reject) => {
      let cmd = `curl -s "${url}" -u ${sk}:`
      if (method !== 'GET') {
        cmd += ` -X ${method}`
        if (body) cmd += ` -d "${body}"`
      }
      if (options.headers) {
        for (const [k, v] of Object.entries(options.headers)) {
          cmd += ` -H "${k}: ${v}"`
        }
      }
      console.info('curl command', cmd)
      exec(cmd, (error, stdout, stderr) => {
        if (error) return reject(error)
        if (stderr) console.error(stderr)
        try {
          resolve(JSON.parse(stdout))
        } catch (e) {
          reject(e)
        }
      })
    })
  }
}

export async function createCustomer() {
  return fetchWithFallback('/customers', { method: 'POST' })
}

export async function createSetupIntent(customerId: string) {
  return fetchWithFallback('/setup_intents', {
    method: 'POST',
    body: new URLSearchParams({ customer: customerId, usage: 'off_session' }),
  })
}

export async function listCharges(limit: number = 1) {
  return fetchWithFallback(`/charges?limit=${limit}`)
}

export async function createPaymentIntent(
  amount: number,
  currency: string,
  customerId?: string
) {
  const body = new URLSearchParams({
    amount: amount.toString(),
    currency,
  })
  if (customerId) body.append('customer', customerId)
  body.append('payment_method_types[]', 'card')
  return fetchWithFallback('/payment_intents', { method: 'POST', body })
}

export async function retrievePaymentIntent(id: string) {
  return fetchWithFallback(`/payment_intents/${id}`)
}

export async function retrieveCustomer(id: string) {
  return fetchWithFallback(`/customers/${id}`)
}

export async function listCustomers(limit: number = 3) {
  return fetchWithFallback(`/customers?limit=${limit}`)
}

export async function createPaymentMethod(token: string) {
  const body = new URLSearchParams({
    type: 'card',
    'card[token]': token,
  })
  return fetchWithFallback('/payment_methods', { method: 'POST', body })
}

export async function attachPaymentMethod(
  paymentMethodId: string,
  customerId: string
) {
  const body = new URLSearchParams({ customer: customerId })
  return fetchWithFallback(`/payment_methods/${paymentMethodId}/attach`, {
    method: 'POST',
    body,
  })
}

export async function listPaymentMethods(
  customerId: string,
  type: string = 'card'
) {
  const params = new URLSearchParams({ customer: customerId, type })
  return fetchWithFallback(`/payment_methods?${params.toString()}`)
}

export async function updateCustomer(
  customerId: string,
  params: Record<string, string>
) {
  const body = new URLSearchParams(params)
  return fetchWithFallback(`/customers/${customerId}`, { method: 'POST', body })
}

export async function deleteCustomer(customerId: string) {
  return fetchWithFallback(`/customers/${customerId}`, { method: 'DELETE' })
}

export async function listPrices(limit: number = 1) {
  return fetchWithFallback(`/prices?limit=${limit}`)
}

export async function createProduct(name: string) {
  const body = new URLSearchParams({ name })
  return fetchWithFallback('/products', { method: 'POST', body })
}

export async function createPrice(
  unitAmount: number,
  currency: string,
  productId: string
) {
  const body = new URLSearchParams({
    unit_amount: unitAmount.toString(),
    currency,
    product: productId,
  })
  return fetchWithFallback('/prices', { method: 'POST', body })
}

export async function createEphemeralKey(
  customerId: string,
  stripeVersion: string = '2023-10-16'
) {
  const body = new URLSearchParams({ customer: customerId })
  return fetchWithFallback('/ephemeral_keys', {
    method: 'POST',
    body,
    headers: { 'Stripe-Version': stripeVersion },
  } as any)
}

export async function createSubscription(
  customerId: string,
  priceId: string
) {
  const body = new URLSearchParams({ customer: customerId, 'items[0][price]': priceId })
  return fetchWithFallback('/subscriptions', { method: 'POST', body })
}

export async function cancelSubscription(id: string) {
  return fetchWithFallback(`/subscriptions/${id}`, { method: 'DELETE' })
}
