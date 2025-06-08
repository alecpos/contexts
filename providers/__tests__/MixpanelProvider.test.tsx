import React from 'react'
import { MixpanelProvider } from '../MixpanelProvider'

describe('MixpanelProvider', () => {
  it('fails without env var', () => {
    const token = process.env.MIXPANEL_PROD_PROJECT_TOKEN
    const origWindow = (global as any).window
    delete (global as any).window
    delete process.env.MIXPANEL_PROD_PROJECT_TOKEN
    expect(() =>
      MixpanelProvider({ children: React.createElement('div') })
    ).toThrow('MIXPANEL_PROD_PROJECT_TOKEN not set')
    if (token) process.env.MIXPANEL_PROD_PROJECT_TOKEN = token
    ;(global as any).window = origWindow
  })

  it('fails on the client', () => {
    const token = process.env.MIXPANEL_PROD_PROJECT_TOKEN
    ;(global as any).window = {}
    process.env.MIXPANEL_PROD_PROJECT_TOKEN = 'test'
    expect(() =>
      MixpanelProvider({ children: React.createElement('div') })
    ).toThrow('MixpanelProvider can only be used on the server')
    if (token) process.env.MIXPANEL_PROD_PROJECT_TOKEN = token
    else delete process.env.MIXPANEL_PROD_PROJECT_TOKEN
    delete (global as any).window
  })
})
