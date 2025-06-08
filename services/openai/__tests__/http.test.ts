import { chatCompletion } from '../http'

describe('openai http', () => {
  it('fails without api key', async () => {
    const orig = process.env.OPENAI_API_KEY
    delete process.env.OPENAI_API_KEY
    await expect(chatCompletion([])).rejects.toThrow('OPENAI_API_KEY not set')
    if (orig) process.env.OPENAI_API_KEY = orig
  })

  it('calls openai api', async () => {
    const origFetch = global.fetch
    process.env.OPENAI_API_KEY = 'test'
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ id: 'abc' }),
    } as any)
    const res = await chatCompletion([{ role: 'user', content: 'hi' }])
    expect(res.id).toBe('abc')
    expect((global.fetch as any).mock.calls.length).toBe(1)
    global.fetch = origFetch
  })
})
