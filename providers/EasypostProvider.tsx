import React, { createContext, PropsWithChildren, useContext } from 'react'

interface EasypostContextType {
  createTracker: (
    orderId: string,
    trackingNumber: string,
    carrier: string,
    pharmacy: string,
  ) => Promise<void>
  createTrackerForCustomOrders: (
    customOrderId: string,
    trackingNumber: string,
    carrier: string,
    pharmacy: string,
  ) => Promise<void>
}

const EasypostContext = createContext<EasypostContextType | null>(null)

export function EasypostProvider({ children }: PropsWithChildren) {
  if (typeof window !== 'undefined') {
    throw new Error('EasypostProvider can only be used on the server')
  }

  if (!process.env.EASYPOST_API_KEY) {
    throw new Error('EASYPOST_API_KEY not set')
  }

  const createTrackerFn: EasypostContextType['createTracker'] = async (
    orderId,
    trackingNumber,
    carrier,
    pharmacy,
  ) => {
    const mod = await import('../bioverse-client/app/services/easypost/easypost-tracker')
    return mod.createTracker(orderId, trackingNumber, carrier, pharmacy)
  }

  const createTrackerForCustomOrdersFn: EasypostContextType['createTrackerForCustomOrders'] = async (
    customOrderId,
    trackingNumber,
    carrier,
    pharmacy,
  ) => {
    const mod = await import('../bioverse-client/app/services/easypost/easypost-tracker')
    return mod.createTrackerForCustomOrders(customOrderId, trackingNumber, carrier, pharmacy)
  }

  return (
    <EasypostContext.Provider
      value={{
        createTracker: createTrackerFn,
        createTrackerForCustomOrders: createTrackerForCustomOrdersFn,
      }}
    >
      {children}
    </EasypostContext.Provider>
  )
}

export const useEasypost = () => {
  const context = useContext(EasypostContext)
  if (!context) throw new Error('useEasypost must be used within EasypostProvider')
  return context
}
