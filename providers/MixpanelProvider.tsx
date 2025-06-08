import React, { createContext, PropsWithChildren, useContext } from 'react'

interface MixpanelContextType {
  track: (eventName: string, payload: any) => Promise<void>
}

const MixpanelContext = createContext<MixpanelContextType | null>(null)

export function MixpanelProvider({ children }: PropsWithChildren) {
  if (typeof window !== 'undefined') {
    throw new Error('MixpanelProvider can only be used on the server')
  }

  if (!process.env.MIXPANEL_PROD_PROJECT_TOKEN) {
    throw new Error('MIXPANEL_PROD_PROJECT_TOKEN not set')
  }

  const track = async (_eventName: string, _payload: any) => {
    // actual implementation lives in bioverse-client services
  }

  return (
    <MixpanelContext.Provider value={{ track }}>
      {children}
    </MixpanelContext.Provider>
  )
}

export const useMixpanel = () => {
  const context = useContext(MixpanelContext)
  if (!context) throw new Error('useMixpanel must be used within MixpanelProvider')
  return context
}
