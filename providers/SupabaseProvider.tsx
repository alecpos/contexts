import React, { createContext, PropsWithChildren, useContext } from 'react'
import {
  selectFrom,
  insertInto,
  updateTable,
  deleteFrom,
} from '../services/supabase/http'

interface SupabaseContextType {
  select: (table: string, limit?: number) => Promise<any>
  insert: (table: string, values: Record<string, any>) => Promise<any>
  update: (
    table: string,
    values: Record<string, any>,
    filter: { column: string; value: string },
  ) => Promise<any>
  remove: (
    table: string,
    filter: { column: string; value: string },
  ) => Promise<any>
}

const SupabaseContext = createContext<SupabaseContextType | null>(null)

export function SupabaseProvider({ children }: PropsWithChildren) {
  if (typeof window !== 'undefined') {
    throw new Error('SupabaseProvider can only be used on the server')
  }

  const url = process.env.SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_KEY
  if (!url || !key) {
    throw new Error('SUPABASE_URL and SUPABASE_SERVICE_KEY must be set')
  }

  const select = (table: string, limit?: number) => selectFrom(table, limit)
  const insert = (table: string, values: Record<string, any>) =>
    insertInto(table, values)
  const update = (
    table: string,
    values: Record<string, any>,
    filter: { column: string; value: string },
  ) => updateTable(table, values, filter)
  const remove = (
    table: string,
    filter: { column: string; value: string },
  ) => deleteFrom(table, filter)

  return (
    <SupabaseContext.Provider
      value={{ select, insert, update, remove }}
    >
      {children}
    </SupabaseContext.Provider>
  )
}

export const useSupabase = () => {
  const context = useContext(SupabaseContext)
  if (!context) throw new Error('useSupabase must be used within SupabaseProvider')
  return context
}
