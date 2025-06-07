/// <reference types="node" />
import { exec } from 'child_process'
import { appendFileSync, existsSync, mkdirSync } from 'fs'

declare const process: {
  env: {
    STRIPE_SK?: string;
  };
};

const STRIPE_URL = 'https://api.stripe.com/v1'

interface RequestOptions {
  method?: string
  body?: URLSearchParams
  headers?: Record<string, string>
  retry?: number
}

interface StripeError {
  error: { type: string; code?: string; message?: string }
}

function logStripeError(context: any, err: any) {
  logEntry({
    time: new Date().toISOString(),
    error: err,
    context,
  })
}

async function handleRateLimitRetry(
  endpoint: string,
  options: RequestOptions,
  res: Response,
): Promise<any> {
  const retryAfter = Number(res.headers.get('Retry-After') || '1') * 1000
  console.warn('rate limited, retrying after', retryAfter)
  await new Promise((resolve) => setTimeout(resolve, retryAfter))
  const attempts = (options.retry || 0) + 1
  return fetchWithFallback(endpoint, { ...options, retry: attempts })
}

function logEntry(entry: any) {
  if (!existsSync('logs')) {
    mkdirSync('logs')
  }
  appendFileSync('logs/stripe.log', JSON.stringify(entry) + '\n')
}

export async function autoPaginate(endpoint: string) {
  let url = endpoint
  const all: any[] = []
  while (url) {
    const page = await fetchWithFallback(url)
    if (Array.isArray(page.data)) {
      all.push(...page.data)
      if (page.has_more && page.data.length > 0) {
        const last = page.data[page.data.length - 1].id
        url = `${endpoint}${endpoint.includes('?') ? '&' : '?'}starting_after=${last}`
      } else {
        url = ''
      }
    } else {
      url = ''
    }
  }
  return all
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
    if (res.status === 429) {
      return handleRateLimitRetry(endpoint, options, res)
    }
    const json = await res.json()
    if (!res.ok) {
      logStripeError({ method, url }, json)
      throw new Error(json.error?.message || 'Stripe request failed')
    }
    logEntry({ time: new Date().toISOString(), method, url, status: res.status })
    return json
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
        if (error) {
          console.error('curl error:', error)
          return reject(error)
        }
        if (stderr) {
          console.error('curl stderr:', stderr)
        }
        if (!stdout) {
          console.error('curl returned empty response')
          return reject(new Error('Empty response from curl'))
        }
        try {
          console.info('curl response:', stdout)
          const parsed = JSON.parse(stdout)
          if (parsed.error) {
            logStripeError({ method, url }, parsed)
          }
          logEntry({ time: new Date().toISOString(), method, url, status: 'curl', response: parsed })
          resolve(parsed)
        } catch (e) {
          console.error('Failed to parse curl response:', e)
          console.error('Raw response:', stdout)
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

export async function listPaymentIntents(limit: number = 5) {
  return fetchWithFallback(`/payment_intents?limit=${limit}`)
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
  productId: string,
  interval?: 'day' | 'week' | 'month' | 'year'
) {
  const body = new URLSearchParams({
    unit_amount: unitAmount.toString(),
    currency,
    product: productId,
  })
  if (interval) {
    body.append('recurring[interval]', interval)
  }
  return fetchWithFallback('/prices', { method: 'POST', body })
}

export async function retrieveProduct(productId: string) {
  return fetchWithFallback(`/products/${productId}`)
}

export async function retrievePrice(priceId: string) {
  return fetchWithFallback(`/prices/${priceId}`)
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
  priceId: string,
  paymentMethodId?: string
) {
  const body = new URLSearchParams({ customer: customerId, 'items[0][price]': priceId })
  if (paymentMethodId) {
    body.append('default_payment_method', paymentMethodId)
  }
  return fetchWithFallback('/subscriptions', { method: 'POST', body })
}

export async function cancelSubscription(id: string) {
  return fetchWithFallback(`/subscriptions/${id}`, { method: 'DELETE' })
}

export async function listProducts(limit: number = 3) {
  return fetchWithFallback(`/products?limit=${limit}`)
}

export async function confirmPaymentIntent(
  id: string,
  paymentMethodId: string,
) {
  const body = new URLSearchParams({ payment_method: paymentMethodId })
  return fetchWithFallback(`/payment_intents/${id}/confirm`, {
    method: 'POST',
    body,
  })
}

export async function capturePaymentIntent(id: string) {
  return fetchWithFallback(`/payment_intents/${id}/capture`, { method: 'POST' })
}

export async function cancelPaymentIntent(id: string) {
  return fetchWithFallback(`/payment_intents/${id}/cancel`, { method: 'POST' })
}

export async function updatePaymentIntent(
  id: string,
  params: Record<string, string>,
) {
  const body = new URLSearchParams(params)
  return fetchWithFallback(`/payment_intents/${id}`, { method: 'POST', body })
}

export async function searchPaymentIntents(query: string, limit: number = 10) {
  const params = new URLSearchParams({ query, limit: String(limit) })
  return fetchWithFallback(`/payment_intents/search?${params.toString()}`)
}
