import {
  saveGoalWeight,
  getMedicationOptions,
  selectMedication,
  finalizeOrder
} from '../http'

describe('global wl http', () => {
  it('handles error responses', async () => {
    const origFetch = global.fetch
    global.fetch = jest.fn().mockResolvedValue({ ok: false, status: 500, text: () => Promise.resolve('err') }) as any
    await expect(saveGoalWeight('u1', 200)).rejects.toThrow('saveGoalWeight failed')
    global.fetch = origFetch
  })
})
