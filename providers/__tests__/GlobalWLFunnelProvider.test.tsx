import React from 'react'
import { GlobalWLFunnelProvider } from '../GlobalWLFunnelProvider'

describe('GlobalWLFunnelProvider', () => {
  it('fails on the client', () => {
    ;(global as any).window = {}
    expect(() =>
      GlobalWLFunnelProvider({ children: React.createElement('div') })
    ).toThrow('GlobalWLFunnelProvider can only be used on the server')
    delete (global as any).window
  })
})
