import React from 'react'
import { SupabaseProvider } from '../SupabaseProvider'

describe('SupabaseProvider', () => {
  it('fails without env vars', () => {
    const url = process.env.SUPABASE_URL
    const key = process.env.SUPABASE_SERVICE_KEY
    const origWindow = (global as any).window
    delete (global as any).window
    delete process.env.SUPABASE_URL
    delete process.env.SUPABASE_SERVICE_KEY
    expect(() =>
      SupabaseProvider({ children: React.createElement('div') })
    ).toThrow('SUPABASE_URL and SUPABASE_SERVICE_KEY must be set')
    if (url) process.env.SUPABASE_URL = url
    if (key) process.env.SUPABASE_SERVICE_KEY = key
    ;(global as any).window = origWindow
  })

  it('fails on the client', () => {
    const orig = (global as any).window
    ;(global as any).window = {}
    process.env.SUPABASE_URL = 'https://example.supabase.co'
    process.env.SUPABASE_SERVICE_KEY = 'test-key'
    expect(() =>
      SupabaseProvider({ children: React.createElement('div') })
    ).toThrow('SupabaseProvider can only be used on the server')
    if (orig === undefined) delete (global as any).window
    else (global as any).window = orig
  })
})
