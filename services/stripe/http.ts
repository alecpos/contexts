/// <reference types="node" />
import { exec } from 'child_process'
import { appendFileSync, existsSync, mkdirSync } from 'fs'

declare const process: {
  env: {
    STRIPE_SK?: string;
    NODE_ENV?: string;
  };
};

const STRIPE_URL = 'https://api.stripe.com/v1'

interface RequestOptions {
  method?: string
  body?: URLSearchParams
  headers?: Record<string, string>
  retry?: number
  query?: Record<string, string>
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

export async function autoPaginate(endpoint: string, maxPages: number = Infinity) {
  let url = endpoint
  const all: any[] = []
  let pages = 0
  while (url && pages < maxPages) {
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
    pages++
  }
  return all
}

async function fetchWithFallback(endpoint: string, options: RequestOptions = {}) {
  const sk = process.env.STRIPE_SK
  if (!sk) throw new Error('STRIPE_SK not set')
  if (process.env.NODE_ENV === 'production' && sk.startsWith('sk_test')) {
    throw new Error('STRIPE_SK must be a live key in production')
  }
  const qs = options.query
    ? `?${new URLSearchParams(options.query).toString()}`
    : ''
  const url = `${STRIPE_URL}${endpoint}${qs}`
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
    logEntry({ time: new Date().toISOString(), method, url, status: res.status, body })
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
            return reject(new Error(parsed.error.message || 'Stripe request failed'))
          }
          logEntry({ time: new Date().toISOString(), method, url, status: 'curl', body, response: parsed })
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

export async function createCustomer(
  metadata?: Record<string, string>,
  expand?: string[],
) {
  const body = new URLSearchParams()
  if (metadata) {
    Object.entries(metadata).forEach(([k, v]) => body.append(`metadata[${k}]`, v))
  }
  expand?.forEach((e) => body.append('expand[]', e))
  return fetchWithFallback('/customers', { method: 'POST', body })
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

export async function listAllCharges(limit: number = 100, maxPages: number = 2) {
  return autoPaginate(`/charges?limit=${limit}`, maxPages)
}

export async function createPaymentIntent(
  amount: number,
  currency: string,
  customerId?: string,
  metadata?: Record<string, string>,
  expand?: string[],
  captureMethod: 'automatic' | 'manual' = 'automatic',
) {
  const body = new URLSearchParams({
    amount: amount.toString(),
    currency,
    capture_method: captureMethod,
  })
  if (customerId) body.append('customer', customerId)
  body.append('payment_method_types[]', 'card')
  if (metadata) {
    Object.entries(metadata).forEach(([k, v]) => body.append(`metadata[${k}]`, v))
  }
  expand?.forEach((e) => body.append('expand[]', e))
  return fetchWithFallback('/payment_intents', { method: 'POST', body })
}

export async function retrievePaymentIntent(id: string, expand?: string[]) {
  const params = new URLSearchParams()
  expand?.forEach((e) => params.append('expand[]', e))
  const query = params.toString()
  const path = `/payment_intents/${id}${query ? '?' + query : ''}`
  return fetchWithFallback(path)
}

export async function retrieveCustomer(id: string, expand?: string[]) {
  const params = new URLSearchParams()
  expand?.forEach((e) => params.append('expand[]', e))
  const query = params.toString()
  const path = `/customers/${id}${query ? '?' + query : ''}`
  return fetchWithFallback(path)
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

export async function createProduct(
  name: string,
  metadata?: Record<string, string>,
  expand?: string[],
) {
  const body = new URLSearchParams({ name })
  if (metadata) {
    Object.entries(metadata).forEach(([k, v]) => body.append(`metadata[${k}]`, v))
  }
  expand?.forEach((e) => body.append('expand[]', e))
  return fetchWithFallback('/products', { method: 'POST', body })
}

export async function createPrice(
  unitAmount: number,
  currency: string,
  productId: string,
  interval?: 'day' | 'week' | 'month' | 'year',
  metadata?: Record<string, string>,
  expand?: string[],
) {
  const body = new URLSearchParams({
    unit_amount: unitAmount.toString(),
    currency,
    product: productId,
  })
  if (interval) {
    body.append('recurring[interval]', interval)
  }
  if (metadata) {
    Object.entries(metadata).forEach(([k, v]) => body.append(`metadata[${k}]`, v))
  }
  expand?.forEach((e) => body.append('expand[]', e))
  return fetchWithFallback('/prices', { method: 'POST', body })
}

export async function retrieveProduct(productId: string, expand?: string[]) {
  const params = new URLSearchParams()
  expand?.forEach((e) => params.append('expand[]', e))
  const query = params.toString()
  const path = `/products/${productId}${query ? '?' + query : ''}`
  return fetchWithFallback(path)
}

export async function retrievePrice(priceId: string, expand?: string[]) {
  const params = new URLSearchParams()
  expand?.forEach((e) => params.append('expand[]', e))
  const query = params.toString()
  const path = `/prices/${priceId}${query ? '?' + query : ''}`
  return fetchWithFallback(path)
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
  metadata?: Record<string, string>,
) {
  const body = new URLSearchParams(params)
  if (metadata) {
    Object.entries(metadata).forEach(([k, v]) => body.append(`metadata[${k}]`, v))
  }
  return fetchWithFallback(`/payment_intents/${id}`, { method: 'POST', body })
}

export async function searchPaymentIntents(query: string, limit: number = 10) {
  const params = new URLSearchParams({ query, limit: String(limit) })
  return fetchWithFallback(`/payment_intents/search?${params.toString()}`)
}

export async function applyCustomerBalance(id: string) {
  return fetchWithFallback(`/payment_intents/${id}/apply_customer_balance`, {
    method: 'POST',
  })
}

export async function incrementAuthorization(id: string, amount: number) {
  const body = new URLSearchParams({ amount: amount.toString() })
  return fetchWithFallback(`/payment_intents/${id}/increment_authorization`, {
    method: 'POST',
    body,
  })
}

export async function verifyMicrodeposits(
  id: string,
  amounts: [number, number],
) {
  const body = new URLSearchParams({
    'amounts[0]': amounts[0].toString(),
    'amounts[1]': amounts[1].toString(),
  })
  return fetchWithFallback(`/payment_intents/${id}/verify_microdeposits`, {
    method: 'POST',
    body,
  })
}

export async function listAllPaymentIntents(limit: number = 100, maxPages: number = 2) {
  return autoPaginate(`/payment_intents?limit=${limit}`, maxPages)
}

export async function retrieveSetupIntent(id: string) {
  return fetchWithFallback(`/setup_intents/${id}`)
}

export async function confirmSetupIntent(id: string, params: Record<string, string> = {}) {
  const body = new URLSearchParams(params)
  return fetchWithFallback(`/setup_intents/${id}/confirm`, { method: 'POST', body })
}

export async function cancelSetupIntent(id: string) {
  return fetchWithFallback(`/setup_intents/${id}/cancel`, { method: 'POST' })
}

export async function listSetupIntents(limit: number = 10) {
  return fetchWithFallback(`/setup_intents?limit=${limit}`)
}

export async function retrieveSubscription(id: string) {
  return fetchWithFallback(`/subscriptions/${id}`)
}

export async function updateSubscription(id: string, params: Record<string, string>) {
  const body = new URLSearchParams(params)
  return fetchWithFallback(`/subscriptions/${id}`, { method: 'POST', body })
}

export async function listSubscriptions(limit: number = 10) {
  return fetchWithFallback(`/subscriptions?limit=${limit}`)
}

export async function createInvoice(params: Record<string, string>) {
  const body = new URLSearchParams(params)
  return fetchWithFallback('/invoices', { method: 'POST', body })
}

export async function retrieveInvoice(id: string) {
  return fetchWithFallback(`/invoices/${id}`)
}

export async function updateInvoice(id: string, params: Record<string, string>) {
  const body = new URLSearchParams(params)
  return fetchWithFallback(`/invoices/${id}`, { method: 'POST', body })
}

export async function listInvoices(limit: number = 10) {
  return fetchWithFallback(`/invoices?limit=${limit}`)
}

export async function deleteInvoice(id: string) {
  return fetchWithFallback(`/invoices/${id}`, { method: 'DELETE' })
}

export async function retrievePaymentMethod(id: string) {
  return fetchWithFallback(`/payment_methods/${id}`)
}

export async function detachPaymentMethod(id: string) {
  return fetchWithFallback(`/payment_methods/${id}/detach`, { method: 'POST' })
}

export async function updateProduct(id: string, params: Record<string, string>) {
  const body = new URLSearchParams(params)
  return fetchWithFallback(`/products/${id}`, { method: 'POST', body })
}

export async function deleteProduct(id: string) {
  return fetchWithFallback(`/products/${id}`, { method: 'DELETE' })
}

export async function updatePrice(id: string, params: Record<string, string>) {
  const body = new URLSearchParams(params)
  return fetchWithFallback(`/prices/${id}`, { method: 'POST', body })
}

export async function createCoupon(params: Record<string, string>) {
  const body = new URLSearchParams(params)
  return fetchWithFallback('/coupons', { method: 'POST', body })
}

export async function retrieveCoupon(id: string) {
  return fetchWithFallback(`/coupons/${id}`)
}

export async function updateCoupon(id: string, params: Record<string, string>) {
  const body = new URLSearchParams(params)
  return fetchWithFallback(`/coupons/${id}`, { method: 'POST', body })
}

export async function listCoupons(limit: number = 10) {
  return fetchWithFallback(`/coupons?limit=${limit}`)
}

export async function deleteCoupon(id: string) {
  return fetchWithFallback(`/coupons/${id}`, { method: 'DELETE' })
}

export async function createPromotionCode(params: Record<string, string>) {
  const body = new URLSearchParams(params)
  return fetchWithFallback('/promotion_codes', { method: 'POST', body })
}

export async function retrievePromotionCode(id: string) {
  return fetchWithFallback(`/promotion_codes/${id}`)
}

export async function updatePromotionCode(id: string, params: Record<string, string>) {
  const body = new URLSearchParams(params)
  return fetchWithFallback(`/promotion_codes/${id}`, { method: 'POST', body })
}

export async function listPromotionCodes(limit: number = 10) {
  return fetchWithFallback(`/promotion_codes?limit=${limit}`)
}

export async function createTaxRate(params: Record<string, string>) {
  const body = new URLSearchParams(params)
  return fetchWithFallback('/tax_rates', { method: 'POST', body })
}

export async function retrieveTaxRate(id: string) {
  return fetchWithFallback(`/tax_rates/${id}`)
}

export async function updateTaxRate(id: string, params: Record<string, string>) {
  const body = new URLSearchParams(params)
  return fetchWithFallback(`/tax_rates/${id}`, { method: 'POST', body })
}

export async function listTaxRates(limit: number = 10) {
  return fetchWithFallback(`/tax_rates?limit=${limit}`)
}

export async function createWebhookEndpoint(url: string, events: string[]) {
  const body = new URLSearchParams({ url })
  events.forEach((e) => body.append('enabled_events[]', e))
  return fetchWithFallback('/webhook_endpoints', { method: 'POST', body })
}

export async function retrieveWebhookEndpoint(id: string) {
  return fetchWithFallback(`/webhook_endpoints/${id}`)
}

export async function updateWebhookEndpoint(id: string, params: Record<string, string>) {
  const body = new URLSearchParams(params)
  return fetchWithFallback(`/webhook_endpoints/${id}`, { method: 'POST', body })
}

export async function listWebhookEndpoints(limit: number = 10) {
  return fetchWithFallback(`/webhook_endpoints?limit=${limit}`)
}

export async function deleteWebhookEndpoint(id: string) {
  return fetchWithFallback(`/webhook_endpoints/${id}`, { method: 'DELETE' })
}

export async function retrieveEvent(id: string) {
  return fetchWithFallback(`/events/${id}`)
}

export async function listEvents(limit: number = 10) {
  return fetchWithFallback(`/events?limit=${limit}`)
}

export async function createCharge(amount: number, currency: string, source: string) {
  const body = new URLSearchParams({ amount: amount.toString(), currency, source })
  return fetchWithFallback('/charges', { method: 'POST', body })
}

export async function retrieveCharge(id: string) {
  return fetchWithFallback(`/charges/${id}`)
}

export async function updateCharge(id: string, params: Record<string, string>) {
  const body = new URLSearchParams(params)
  return fetchWithFallback(`/charges/${id}`, { method: 'POST', body })
}

export async function createRefund(params: Record<string, string>) {
  const body = new URLSearchParams(params)
  return fetchWithFallback('/refunds', { method: 'POST', body })
}

export async function retrieveRefund(id: string) {
  return fetchWithFallback(`/refunds/${id}`)
}

export async function updateRefund(id: string, params: Record<string, string>) {
  const body = new URLSearchParams(params)
  return fetchWithFallback(`/refunds/${id}`, { method: 'POST', body })
}

export async function listRefunds(limit: number = 10) {
  return fetchWithFallback(`/refunds?limit=${limit}`)
}

export async function retrieveDispute(id: string) {
  return fetchWithFallback(`/disputes/${id}`)
}

export async function updateDispute(id: string, params: Record<string, string>) {
  const body = new URLSearchParams(params)
  return fetchWithFallback(`/disputes/${id}`, { method: 'POST', body })
}

export async function listDisputes(limit: number = 10) {
  return fetchWithFallback(`/disputes?limit=${limit}`)
}

export async function createAccount(params: Record<string, string>) {
  const body = new URLSearchParams(params)
  return fetchWithFallback('/accounts', { method: 'POST', body })
}

export async function retrieveAccount(id?: string) {
  const path = id ? `/accounts/${id}` : '/account'
  return fetchWithFallback(path)
}

export async function updateAccount(id: string, params: Record<string, string>) {
  const body = new URLSearchParams(params)
  return fetchWithFallback(`/accounts/${id}`, { method: 'POST', body })
}

export async function listAccounts(limit: number = 10) {
  return fetchWithFallback(`/accounts?limit=${limit}`)
}

export async function deleteAccount(id: string) {
  return fetchWithFallback(`/accounts/${id}`, { method: 'DELETE' })
}

export async function retrieveApplicationFee(id: string) {
  return fetchWithFallback(`/application_fees/${id}`)
}

export async function listApplicationFees(limit: number = 10) {
  return fetchWithFallback(`/application_fees?limit=${limit}`)
}

export async function retrieveBalance() {
  return fetchWithFallback('/balance')
}

export async function createPayout(params: Record<string, string>) {
  const body = new URLSearchParams(params)
  return fetchWithFallback('/payouts', { method: 'POST', body })
}

export async function retrievePayout(id: string) {
  return fetchWithFallback(`/payouts/${id}`)
}

export async function updatePayout(id: string, params: Record<string, string>) {
  const body = new URLSearchParams(params)
  return fetchWithFallback(`/payouts/${id}`, { method: 'POST', body })
}

export async function listPayouts(limit: number = 10) {
  return fetchWithFallback(`/payouts?limit=${limit}`)
}

export async function cancelPayout(id: string) {
  return fetchWithFallback(`/payouts/${id}/cancel`, { method: 'POST' })
}

export async function retrieveReview(id: string) {
  return fetchWithFallback(`/reviews/${id}`)
}

export async function approveReview(id: string) {
  return fetchWithFallback(`/reviews/${id}/approve`, { method: 'POST' })
}

export async function listReviews(limit: number = 10) {
  return fetchWithFallback(`/reviews?limit=${limit}`)
}

