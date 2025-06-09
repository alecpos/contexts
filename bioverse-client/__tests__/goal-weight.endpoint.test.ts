import { Response } from 'node-fetch'
jest.mock('next/server', () => ({
  NextResponse: { json: (b: any, init?: any) => new Response(JSON.stringify(b), { status: init?.status ?? 200 }) }
}))
import { POST } from '../app/api/patient/goal-weight/route'
import { writeQuestionnaireAnswer } from '../app/utils/database/controller/questionnaires/questionnaire'

jest.mock('../app/utils/database/controller/questionnaires/questionnaire', () => ({
  writeQuestionnaireAnswer: jest.fn()
}))

describe('goal-weight endpoint', () => {
  it('returns 400 on invalid payload', async () => {
    const req: any = { json: jest.fn().mockResolvedValue({}) }
    const res = await POST(req)
    expect(res.status).toBe(400)
  })

  it('stores goal weight', async () => {
    const req: any = { json: jest.fn().mockResolvedValue({ user_id: 'u1', weight: 200 }) }
    const res = await POST(req)
    expect(writeQuestionnaireAnswer).toHaveBeenCalledWith('u1', 2303, { formData: [200] }, 1)
    expect(res.status).toBe(200)
    await expect(res.json()).resolves.toEqual({ success: true })
  })
})
