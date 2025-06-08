import React, { createContext, PropsWithChildren, useContext } from 'react'
import RudderAnalytics from '@rudderstack/rudder-sdk-node'

interface RudderStackContextType {
  track: (event: string, properties?: Record<string, any>) => Promise<void>
  identify: (userId: string, traits?: Record<string, any>) => Promise<void>
  alias: (newUserId: string, anonymousId: string) => Promise<void>
}

const RudderStackContext = createContext<RudderStackContextType | null>(null)

export function RudderStackProvider({ children }: PropsWithChildren) {
  if (typeof window !== 'undefined') {
    throw new Error('RudderStackProvider can only be used on the server')
  }

  const apiKey = process.env.RUDDERSTACK_API_KEY
  const dataPlaneUrl = process.env.RUDDERSTACK_DATA_PLANE_URL

  if (!apiKey || !dataPlaneUrl) {
    throw new Error('RUDDERSTACK_API_KEY and RUDDERSTACK_DATA_PLANE_URL must be set')
  }

  const client = new RudderAnalytics(apiKey, { dataPlaneUrl })

  const track = async (event: string, properties: Record<string, any> = {}) => {
    await client.track({ event, properties, anonymousId: 'server' })
  }

  const identify = async (userId: string, traits: Record<string, any> = {}) => {
    await client.identify({ userId, traits })
  }

  const alias = async (newUserId: string, anonymousId: string) => {
    await client.alias({ userId: newUserId, previousId: anonymousId })
  }

  return (
    <RudderStackContext.Provider value={{ track, identify, alias }}>
      {children}
    </RudderStackContext.Provider>
  )
}

export const useRudderStack = () => {
  const context = useContext(RudderStackContext)
  if (!context) throw new Error('useRudderStack must be used within RudderStackProvider')
  return context
}
