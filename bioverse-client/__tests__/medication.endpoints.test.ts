jest.mock('next/server', () => ({
  NextResponse: { json: (b: any, init?: any) => new Response(JSON.stringify(b), { status: init?.status ?? 200 }) }
}))
import { POST as createPrescription } from '../app/api/prescriptions/medication/route'
import { GET as getOptions } from '../app/api/products/weight-loss/route'
import axios from 'axios'
jest.mock('../app/services/dosespot/v1/token/token', () => ({ getToken: jest.fn() }))

jest.mock('axios')

describe('medication endpoints', () => {
  it('returns medication list', async () => {
    const res = await getOptions()
    await expect(res.json()).resolves.toEqual({ medications: ['Ozempic', 'Mounjaro', 'Zepbound', 'BIOVERSE Weight Loss Capsule'] })
  })

  it('rejects invalid payload', async () => {
    const req: any = { json: jest.fn().mockResolvedValue({}) }
    const res = await createPrescription(req)
    expect(res.status).toBe(400)
  })

  it('creates prescription with valid payload', async () => {
    const req: any = { json: jest.fn().mockResolvedValue({ user_id: 'u1', medication: 'Ozempic' }) }
    const res = await createPrescription(req)
    expect(res.status).toBe(200)
    await expect(res.json()).resolves.toEqual({ success: true })
  })
})
