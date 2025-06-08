import React, { createContext, PropsWithChildren, useContext } from 'react'

interface CustomerIOContextType {
  identifyUser: (userId: string, attributes?: Record<string, unknown>) => Promise<void>
  triggerEvent: (
    userId: string,
    name: string,
    attributes?: Record<string, unknown>,
  ) => Promise<{ status: number; data: any }>
}

const CustomerIOContext = createContext<CustomerIOContextType | null>(null)

export function CustomerIOProvider({ children }: PropsWithChildren) {
  if (typeof window !== 'undefined') {
    throw new Error('CustomerIOProvider can only be used on the server')
  }

  const siteId = process.env.CUSTOMERIO_SITE_ID
  const apiKey = process.env.CUSTOMERIO_API_KEY
  if (!siteId || !apiKey) {
    throw new Error('CUSTOMERIO_SITE_ID and CUSTOMERIO_API_KEY must be set')
  }

  const identify = async (_userId: string, _attrs: Record<string, unknown> = {}) => {}

  const trigger = async (
    _userId: string,
    _name: string,
    _attributes: Record<string, unknown> = {},
  ): Promise<{ status: number; data: any }> => {
    return { status: 200, data: null }
  }

  return (
    <CustomerIOContext.Provider value={{ identifyUser: identify, triggerEvent: trigger }}>
      {children}
    </CustomerIOContext.Provider>
  )
}

export const useCustomerIO = () => {
  const context = useContext(CustomerIOContext)
  if (!context) throw new Error('useCustomerIO must be used within CustomerIOProvider')
  return context
}
