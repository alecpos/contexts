import React from 'react'
import { RudderStackProvider } from '../RudderStackProvider'

jest.mock('@rudderstack/rudder-sdk-node', () => {
  return jest.fn().mockImplementation(() => ({
    track: jest.fn().mockResolvedValue(undefined),
    identify: jest.fn().mockResolvedValue(undefined),
    alias: jest.fn().mockResolvedValue(undefined),
  }))
})

describe('RudderStackProvider', () => {
  it('fails without env vars', () => {
    const api = process.env.RUDDERSTACK_API_KEY
    const url = process.env.RUDDERSTACK_DATA_PLANE_URL
    const origWindow = (global as any).window
    delete (global as any).window
    delete process.env.RUDDERSTACK_API_KEY
    delete process.env.RUDDERSTACK_DATA_PLANE_URL
    expect(() =>
      RudderStackProvider({ children: React.createElement('div') })
    ).toThrow('RUDDERSTACK_API_KEY and RUDDERSTACK_DATA_PLANE_URL must be set')
    if (api) process.env.RUDDERSTACK_API_KEY = api
    if (url) process.env.RUDDERSTACK_DATA_PLANE_URL = url
    ;(global as any).window = origWindow
  })

  it('fails on the client', () => {
    const api = process.env.RUDDERSTACK_API_KEY
    const url = process.env.RUDDERSTACK_DATA_PLANE_URL
    ;(global as any).window = {}
    process.env.RUDDERSTACK_API_KEY = 'test'
    process.env.RUDDERSTACK_DATA_PLANE_URL = 'https://example.com'
    expect(() =>
      RudderStackProvider({ children: React.createElement('div') })
    ).toThrow('RudderStackProvider can only be used on the server')
    if (api) process.env.RUDDERSTACK_API_KEY = api
    else delete process.env.RUDDERSTACK_API_KEY
    if (url) process.env.RUDDERSTACK_DATA_PLANE_URL = url
    else delete process.env.RUDDERSTACK_DATA_PLANE_URL
    delete (global as any).window
  })
})
