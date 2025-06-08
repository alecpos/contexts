import React from 'react'
import { CustomerIOProvider } from '../CustomerIOProvider'

describe('CustomerIOProvider', () => {
  it('fails without env vars', () => {
    const site = process.env.CUSTOMERIO_SITE_ID
    const key = process.env.CUSTOMERIO_API_KEY
    const origWindow = (global as any).window
    delete (global as any).window
    delete process.env.CUSTOMERIO_SITE_ID
    delete process.env.CUSTOMERIO_API_KEY
    expect(() =>
      CustomerIOProvider({ children: React.createElement('div') })
    ).toThrow('CUSTOMERIO_SITE_ID and CUSTOMERIO_API_KEY must be set')
    if (site) process.env.CUSTOMERIO_SITE_ID = site
    if (key) process.env.CUSTOMERIO_API_KEY = key
    ;(global as any).window = origWindow
  })

  it('fails on the client', () => {
    const site = process.env.CUSTOMERIO_SITE_ID
    const key = process.env.CUSTOMERIO_API_KEY
    ;(global as any).window = {}
    process.env.CUSTOMERIO_SITE_ID = 'id'
    process.env.CUSTOMERIO_API_KEY = 'key'
    expect(() =>
      CustomerIOProvider({ children: React.createElement('div') })
    ).toThrow('CustomerIOProvider can only be used on the server')
    if (site) process.env.CUSTOMERIO_SITE_ID = site
    else delete process.env.CUSTOMERIO_SITE_ID
    if (key) process.env.CUSTOMERIO_API_KEY = key
    else delete process.env.CUSTOMERIO_API_KEY
    delete (global as any).window
  })
})
