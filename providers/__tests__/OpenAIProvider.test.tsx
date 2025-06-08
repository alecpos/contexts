import React from 'react'
import { OpenAIProvider } from '../OpenAIProvider'

describe('OpenAIProvider', () => {
  it('fails without env var', () => {
    const key = process.env.OPENAI_API_KEY
    const origWindow = (global as any).window
    delete (global as any).window
    delete process.env.OPENAI_API_KEY
    expect(() =>
      OpenAIProvider({ children: React.createElement('div') })
    ).toThrow('OPENAI_API_KEY not set')
    if (key) process.env.OPENAI_API_KEY = key
    ;(global as any).window = origWindow
  })

  it('fails on the client', () => {
    const key = process.env.OPENAI_API_KEY
    ;(global as any).window = {}
    process.env.OPENAI_API_KEY = 'test'
    expect(() =>
      OpenAIProvider({ children: React.createElement('div') })
    ).toThrow('OpenAIProvider can only be used on the server')
    if (key) process.env.OPENAI_API_KEY = key
    else delete process.env.OPENAI_API_KEY
    delete (global as any).window
  })
})
