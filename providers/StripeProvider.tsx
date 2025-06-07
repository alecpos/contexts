'use client'
import React, { createContext, useContext, useEffect, useState, PropsWithChildren } from 'react'
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
  retrievePrice,
  createSubscription as apiCreateSubscription,
  cancelSubscription as apiCancelSubscription,
  createEphemeralKey as apiCreateEphemeralKey,
  listPaymentIntents as apiListPaymentIntents,
  listCharges as apiListCharges,
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
}

const StripeContext = createContext<StripeContextType | null>(null)

export const StripeProvider = ({ children }: PropsWithChildren) => {
  const [customerId, setCustomerId] = useState<string | null>(null)
  const [clientSecret, setClientSecret] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

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

  const listCharges = async (limit?: number) => {
    return apiListCharges(limit)
  }

  useEffect(() => {
    const createCustomerAndIntent = async () => {
      try {
        const customer = await createCustomer()
        const intent = await createSetupIntent(customer.id)
        setCustomerId(customer.id)
        setClientSecret(intent.client_secret)
      } catch (err: any) {
        setError(err.message || 'Stripe setup failed')
      }
    }

    createCustomerAndIntent()
  }, [])

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
        listCharges,
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
