import React, { createContext, PropsWithChildren, useContext } from 'react'
import { chatCompletion, ChatMessage } from '../services/openai/http'

interface OpenAIContextType {
  generateChat: (messages: ChatMessage[], model?: string) => Promise<any>
}

const OpenAIContext = createContext<OpenAIContextType | null>(null)

export function OpenAIProvider({ children }: PropsWithChildren) {
  if (typeof window !== 'undefined') {
    throw new Error('OpenAIProvider can only be used on the server')
  }

  if (!process.env.OPENAI_API_KEY) {
    throw new Error('OPENAI_API_KEY not set')
  }

  const generateChat = (messages: ChatMessage[], model?: string) =>
    chatCompletion(messages, model)

  return (
    <OpenAIContext.Provider value={{ generateChat }}>
      {children}
    </OpenAIContext.Provider>
  )
}

export const useOpenAI = () => {
  const context = useContext(OpenAIContext)
  if (!context) throw new Error('useOpenAI must be used within OpenAIProvider')
  return context
}
