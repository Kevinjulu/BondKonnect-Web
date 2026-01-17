import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { pollMpesaStatus } from '../payment-utils'
import * as apiActions from '@/lib/actions/api.actions'

// Mock the API actions
vi.mock('@/lib/actions/api.actions', () => ({
  checkMpesaStatus: vi.fn(),
}))

describe('pollMpesaStatus logic', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('calls callback with "completed" when status is completed', async () => {
    const callback = vi.fn()
    ;(apiActions.checkMpesaStatus as any).mockResolvedValue({ status: 'completed' })

    pollMpesaStatus('checkout_123', callback)

    // Advance timers to trigger the first interval
    await vi.advanceTimersByTimeAsync(3000)

    expect(apiActions.checkMpesaStatus).toHaveBeenCalledWith('checkout_123')
    expect(callback).toHaveBeenCalledWith('completed')
  })

  it('calls callback with "timeout" after the specified limit', async () => {
    const callback = vi.fn()
    ;(apiActions.checkMpesaStatus as any).mockResolvedValue({ status: 'pending' })

    pollMpesaStatus('checkout_123', callback, 10000) // 10s timeout

    // Advance timers by 10s
    await vi.advanceTimersByTimeAsync(10000)

    expect(callback).toHaveBeenCalledWith('timeout')
  })
})
