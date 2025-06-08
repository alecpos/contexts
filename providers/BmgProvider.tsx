import React, { createContext, PropsWithChildren, useContext } from 'react'

interface BmgContextType {
  sendEvent: (
    orderId: number,
    state: string,
    event: string,
    value: string,
    sentAt: string,
    currency: string,
    utmSource: string,
    contentName: string,
    careSelection: string,
    utmCampaign: string,
    utmMedium: string,
    utmContent: string,
    utmTerm: string,
    userId?: string,
  ) => Promise<any>
}

const BmgContext = createContext<BmgContextType | null>(null)

export function BmgProvider({ children }: PropsWithChildren) {
  if (typeof window !== 'undefined') {
    throw new Error('BmgProvider can only be used on the server')
  }

  if (!process.env.BMG_API_KEY) {
    throw new Error('BMG_API_KEY not set')
  }

  const sendEvent: BmgContextType['sendEvent'] = async (
    orderId,
    state,
    event,
    value,
    sentAt,
    currency,
    utmSource,
    contentName,
    careSelection,
    utmCampaign,
    utmMedium,
    utmContent,
    utmTerm,
    userId,
  ) => {
    const { sendEventDataToBMG } = await import('../bioverse-client/app/services/bmg/bmg_functions')
    return sendEventDataToBMG(
      orderId,
      state,
      event,
      value,
      sentAt,
      currency,
      utmSource,
      contentName,
      careSelection,
      utmCampaign,
      utmMedium,
      utmContent,
      utmTerm,
      userId,
    )
  }

  return <BmgContext.Provider value={{ sendEvent }}>{children}</BmgContext.Provider>
}

export const useBmg = () => {
  const context = useContext(BmgContext)
  if (!context) throw new Error('useBmg must be used within BmgProvider')
  return context
}
