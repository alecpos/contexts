'use client'
import React, { createContext, useContext, useEffect, useState, PropsWithChildren } from 'react'
import { createClient, SupabaseClient, Session } from '@supabase/supabase-js'

interface SupabaseContextType {
  client: SupabaseClient
  session: Session | null
}

const SupabaseContext = createContext<SupabaseContextType | null>(null)

export const SupabaseProvider = ({ children }: PropsWithChildren) => {
  const [client] = useState(() => {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    if (!url || !anonKey) throw new Error('Supabase env vars not set')
    return createClient(url, anonKey)
  })
  const [session, setSession] = useState<Session | null>(null)

  useEffect(() => {
    client.auth.getSession().then(({ data }) => setSession(data.session))
    const { data: listener } = client.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })
    return () => {
      listener.subscription.unsubscribe()
    }
  }, [client])

  return (
    <SupabaseContext.Provider value={{ client, session }}>
      {children}
    </SupabaseContext.Provider>
  )
}

export const useSupabaseContext = () => {
  const context = useContext(SupabaseContext)
  if (!context) throw new Error('useSupabaseContext must be used within SupabaseProvider')
  return context
}
