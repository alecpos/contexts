import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SK as string, {
  apiVersion: '2022-11-15',
})

export interface CheckoutSessionOptions {
  priceId: string
  quantity: number
  successUrl: string
  cancelUrl: string
}

export async function createCheckoutSessionServer(options: CheckoutSessionOptions) {
  return stripe.checkout.sessions.create({
    line_items: [{ price: options.priceId, quantity: options.quantity }],
    mode: 'payment',
    success_url: options.successUrl,
    cancel_url: options.cancelUrl,
  })
}
