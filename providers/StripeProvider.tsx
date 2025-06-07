import React, { createContext, useContext, PropsWithChildren } from 'react'
import {
  createCustomer,
  createSetupIntent,
  createProduct as apiCreateProduct,
  createPrice as apiCreatePrice,
  listProducts as apiListProducts,
  listPrices as apiListPrices,
  createPaymentMethod,
  attachPaymentMethod,
  createPaymentIntent,
  confirmPaymentIntent,
  capturePaymentIntent as apiCapturePaymentIntent,
  cancelPaymentIntent as apiCancelPaymentIntent,
  updatePaymentIntent as apiUpdatePaymentIntent,
  searchPaymentIntents as apiSearchPaymentIntents,
  retrievePrice,
  createSubscription as apiCreateSubscription,
  cancelSubscription as apiCancelSubscription,
  createEphemeralKey as apiCreateEphemeralKey,
  listPaymentIntents as apiListPaymentIntents,
  listCharges as apiListCharges,
  listAllCharges as apiListAllCharges,
  applyCustomerBalance as apiApplyCustomerBalance,
  incrementAuthorization as apiIncrementAuthorization,
  verifyMicrodeposits as apiVerifyMicrodeposits,
  listAllPaymentIntents as apiListAllPaymentIntents,
} from '../services/stripe/http'

interface StripeContextType {
  customerId: string | null
  clientSecret: string | null
  error: string | null
  createProduct: (name: string) => Promise<any>
  createPrice: (
    amount: number,
    currency: string,
    productId: string,
    interval?: 'day' | 'week' | 'month' | 'year',
  ) => Promise<any>
  listProducts: (limit?: number) => Promise<any>
  listPrices: (limit?: number) => Promise<any>
  purchasePrice: (priceId: string) => Promise<any>
  createSubscription: (priceId: string) => Promise<any>
  cancelSubscription: (id: string) => Promise<any>
  createEphemeralKey: (version?: string) => Promise<any>
  listPaymentIntents: (limit?: number) => Promise<any>
  listCharges: (limit?: number) => Promise<any>
  capturePaymentIntent: (id: string) => Promise<any>
  cancelPaymentIntent: (id: string) => Promise<any>
  updatePaymentIntent: (
    id: string,
    params: Record<string, string>,
    metadata?: Record<string, string>,
  ) => Promise<any>
  searchPaymentIntents: (query: string, limit?: number) => Promise<any>
  applyCustomerBalance: (id: string) => Promise<any>
  incrementAuthorization: (id: string, amount: number) => Promise<any>
  verifyMicrodeposits: (id: string, amounts: [number, number]) => Promise<any>
  listAllPaymentIntents: () => Promise<any[]>
  listAllCharges: () => Promise<any[]>
}

const StripeContext = createContext<StripeContextType | null>(null)

export async function StripeProvider({ children }: PropsWithChildren) {
  let customerId: string | null = null
  let clientSecret: string | null = null
  let error: string | null = null

  try {
    const customer = await createCustomer()
    const intent = await createSetupIntent(customer.id)
    customerId = customer.id
    clientSecret = intent.client_secret
  } catch (err: any) {
    error = err.message || 'Stripe setup failed'
  }

  const createProduct = async (name: string) => {
    return apiCreateProduct(name)
  }

  const createPrice = async (
    amount: number,
    currency: string,
    productId: string,
    interval?: 'day' | 'week' | 'month' | 'year',
  ) => {
    return apiCreatePrice(amount, currency, productId, interval)
  }

  const listProducts = async (limit?: number) => {
    return apiListProducts(limit)
  }

  const listPrices = async (limit?: number) => {
    return apiListPrices(limit)
  }

  const purchasePrice = async (priceId: string) => {
    if (!customerId) throw new Error('customer not ready')
    const price = await retrievePrice(priceId)
    const pm = await createPaymentMethod('tok_visa')
    await attachPaymentMethod(pm.id, customerId)
    const intent = await createPaymentIntent(
      price.unit_amount,
      price.currency,
      customerId,
    )
    return confirmPaymentIntent(intent.id, pm.id)
  }

  const createSubscription = async (priceId: string) => {
    if (!customerId) throw new Error('customer not ready')
    const pm = await createPaymentMethod('tok_visa')
    await attachPaymentMethod(pm.id, customerId)
    return apiCreateSubscription(customerId, priceId, pm.id)
  }

  const cancelSubscription = async (id: string) => {
    return apiCancelSubscription(id)
  }

  const createEphemeralKey = async (version: string = '2023-10-16') => {
    if (!customerId) throw new Error('customer not ready')
    return apiCreateEphemeralKey(customerId, version)
  }

  const listPaymentIntents = async (limit?: number) => {
    return apiListPaymentIntents(limit)
  }

  const listAllPaymentIntents = async () => {
    return apiListAllPaymentIntents()
  }

  const listCharges = async (limit?: number) => {
    return apiListCharges(limit)
  }

  const listAllCharges = async () => {
    return apiListAllCharges()
  }

  const capturePaymentIntent = async (id: string) => {
    return apiCapturePaymentIntent(id)
  }

  const cancelPaymentIntent = async (id: string) => {
    return apiCancelPaymentIntent(id)
  }

  const updatePaymentIntent = async (
    id: string,
    params: Record<string, string>,
    metadata?: Record<string, string>,
  ) => {
    return apiUpdatePaymentIntent(id, params, metadata)
  }

  const searchPaymentIntents = async (query: string, limit?: number) => {
    return apiSearchPaymentIntents(query, limit)
  }

  const applyCustomerBalance = async (id: string) => {
    return apiApplyCustomerBalance(id)
  }

  const incrementAuthorization = async (id: string, amount: number) => {
    return apiIncrementAuthorization(id, amount)
  }

  const verifyMicrodeposits = async (
    id: string,
    amounts: [number, number],
  ) => {
    return apiVerifyMicrodeposits(id, amounts)
  }



  return (
    <StripeContext.Provider
      value={{
        customerId,
        clientSecret,
        error,
        createProduct,
        createPrice,
        listProducts,
        listPrices,
        purchasePrice,
        createSubscription,
        cancelSubscription,
        createEphemeralKey,
        listPaymentIntents,
        listAllPaymentIntents,
        listCharges,
        listAllCharges,
        capturePaymentIntent,
        cancelPaymentIntent,
        updatePaymentIntent,
        searchPaymentIntents,
        applyCustomerBalance,
        incrementAuthorization,
        verifyMicrodeposits,
      }}
    >
      {children}
    </StripeContext.Provider>
  )
}

export const useStripe = () => {
  const context = useContext(StripeContext)
  if (!context) throw new Error('useStripe must be used within StripeProvider')
  return context
}
