import React from 'react'
import { BmgProvider } from '../BmgProvider'

describe('BmgProvider', () => {
  it('fails without env var', () => {
    const key = process.env.BMG_API_KEY
    const origWindow = (global as any).window
    delete (global as any).window
    delete process.env.BMG_API_KEY
    expect(() =>
      BmgProvider({ children: React.createElement('div') })
    ).toThrow('BMG_API_KEY not set')
    if (key) process.env.BMG_API_KEY = key
    ;(global as any).window = origWindow
  })

  it('fails on the client', () => {
    const key = process.env.BMG_API_KEY
    ;(global as any).window = {}
    process.env.BMG_API_KEY = 'test'
    expect(() =>
      BmgProvider({ children: React.createElement('div') })
    ).toThrow('BmgProvider can only be used on the server')
    if (key) process.env.BMG_API_KEY = key
    else delete process.env.BMG_API_KEY
    delete (global as any).window
  })
})
