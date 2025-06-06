'use client'
import React, { createContext, useContext, useEffect, useState, PropsWithChildren } from 'react'
import { createCustomer, createSetupIntent } from '../services/stripe/http'

interface StripeContextType {
  customerId: string | null
  clientSecret: string | null
  error: string | null
}

const StripeContext = createContext<StripeContextType | null>(null)

export const StripeProvider = ({ children }: PropsWithChildren) => {
  const [customerId, setCustomerId] = useState<string | null>(null)
  const [clientSecret, setClientSecret] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

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
    <StripeContext.Provider value={{ customerId, clientSecret, error }}>
      {children}
    </StripeContext.Provider>
  )
}

export const useStripe = () => {
  const context = useContext(StripeContext)
  if (!context) throw new Error('useStripe must be used within StripeProvider')
  return context
}
