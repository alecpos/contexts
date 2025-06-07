'use client'
import React, { createContext, useContext, useEffect, useState, PropsWithChildren } from 'react'
import {
  createCustomer,
  createSetupIntent,
  createProduct as apiCreateProduct,
  createPrice as apiCreatePrice,
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
  ) => Promise<any>
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
  ) => {
    return apiCreatePrice(amount, currency, productId)
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
