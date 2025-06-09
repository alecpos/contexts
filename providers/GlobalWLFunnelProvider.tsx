import React, { createContext, PropsWithChildren, useContext } from 'react'
import {
  saveGoalWeight,
  getMedicationOptions,
  selectMedication,
  finalizeOrder
} from '../services/global-wl/http'

interface GlobalWLFunnelContextType {
  saveGoalWeight: typeof saveGoalWeight
  getMedicationOptions: typeof getMedicationOptions
  selectMedication: typeof selectMedication
  finalizeOrder: typeof finalizeOrder
}

const GlobalWLFunnelContext = createContext<GlobalWLFunnelContextType | null>(null)

export function GlobalWLFunnelProvider({ children }: PropsWithChildren) {
  if (typeof window !== 'undefined') {
    throw new Error('GlobalWLFunnelProvider can only be used on the server')
  }

  return (
    <GlobalWLFunnelContext.Provider
      value={{ saveGoalWeight, getMedicationOptions, selectMedication, finalizeOrder }}
    >
      {children}
    </GlobalWLFunnelContext.Provider>
  )
}

export const useGlobalWLFunnel = () => {
  const ctx = useContext(GlobalWLFunnelContext)
  if (!ctx) throw new Error('useGlobalWLFunnel must be used within GlobalWLFunnelProvider')
  return ctx
}
