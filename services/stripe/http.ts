const { exec } = require('child_process')

const STRIPE_URL = 'https://api.stripe.com/v1'

interface RequestOptions {
  method?: string
  body?: URLSearchParams
}

async function fetchWithFallback(endpoint: string, options: RequestOptions = {}) {
  const sk = process.env.STRIPE_SK
  if (!sk) throw new Error('STRIPE_SK not set')
  const url = `${STRIPE_URL}${endpoint}`
  const method = options.method || 'GET'
  const body = options.body ? options.body.toString() : undefined

  try {
    const res = await fetch(url, {
      method,
      headers: {
        Authorization: `Bearer ${sk}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body,
    })
    return await res.json()
  } catch (err) {
    return new Promise((resolve, reject) => {
      let cmd = `curl -s ${url} -u ${sk}:`
      if (method === 'POST') {
        cmd += ' -X POST'
        if (body) cmd += ` -d "${body}"`
      }
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
