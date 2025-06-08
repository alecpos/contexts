import React from 'react'
import { EasypostProvider } from '../EasypostProvider'

describe('EasypostProvider', () => {
  it('fails without env var', () => {
    const key = process.env.EASYPOST_API_KEY
    const origWindow = (global as any).window
    delete (global as any).window
    delete process.env.EASYPOST_API_KEY
    expect(() =>
      EasypostProvider({ children: React.createElement('div') })
    ).toThrow('EASYPOST_API_KEY not set')
    if (key) process.env.EASYPOST_API_KEY = key
    ;(global as any).window = origWindow
  })

  it('fails on the client', () => {
    const key = process.env.EASYPOST_API_KEY
    ;(global as any).window = {}
    process.env.EASYPOST_API_KEY = 'test'
    expect(() =>
      EasypostProvider({ children: React.createElement('div') })
    ).toThrow('EasypostProvider can only be used on the server')
    if (key) process.env.EASYPOST_API_KEY = key
    else delete process.env.EASYPOST_API_KEY
    delete (global as any).window
  })
})
