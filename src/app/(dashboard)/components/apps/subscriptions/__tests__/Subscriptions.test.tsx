import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { SubscriptionsListing } from '../Subscriptions'
import * as apiActions from '@/app/lib/actions/api.actions'

// Mock the API actions
vi.mock('@/app/lib/actions/api.actions', () => ({
  getAllSubscriptionPlans: vi.fn(),
  getAllFeatures: vi.fn(),
  getAllFeatureCategories: vi.fn(),
  initiateMpesaStkPush: vi.fn(),
  checkMpesaStatus: vi.fn(),
}))

// Mock the Toast hook
vi.mock('@/app/hooks/use-toast', () => ({
  useToast: () => ({
    toast: vi.fn(),
  }),
}))

describe('SubscriptionsListing Component', () => {
  const mockUserDetails = {
    email: 'test@example.com',
    phone: '0712345678',
  }

  const mockPlans = {
    success: true,
    data: [
      {
        Id: 1,
        Name: 'Basic Plan',
        Description: 'Basic subscription',
        billingDetails: [{ Id: 1, Days: 30, UnitPrice: 10 }],
        features: [],
      }
    ]
  }

  beforeEach(() => {
    vi.clearAllMocks()
    ;(apiActions.getAllSubscriptionPlans as any).mockResolvedValue(mockPlans)
    ;(apiActions.getAllFeatures as any).mockResolvedValue({ success: true, data: [] })
    ;(apiActions.getAllFeatureCategories as any).mockResolvedValue({ success: true, data: [] })
  })

  it('renders subscription plans after loading', async () => {
    render(<SubscriptionsListing userDetails={mockUserDetails} />)
    
    expect(screen.getByText(/Loading subscription plans.../i)).toBeInTheDocument()
    
    await waitFor(() => {
      expect(screen.getByText('Basic Plan')).toBeInTheDocument()
    })
  })

  it('opens payment modal with M-Pesa selected by default', async () => {
    render(<SubscriptionsListing userDetails={mockUserDetails} />)
    
    await waitFor(() => {
      const subscribeBtn = screen.getByRole('button', { name: /Subscribe Now/i })
      fireEvent.click(subscribeBtn)
    })

    expect(screen.getByText(/Complete your subscription/i)).toBeInTheDocument()
    expect(screen.getByText(/M-Pesa Phone Number/i)).toBeInTheDocument()
  })

  it('polls for M-Pesa status and succeeds when status is completed', async () => {
    vi.useFakeTimers()
    
    // 1. Setup mocks for successful initiation
    ;(apiActions.initiateMpesaStkPush as any).mockResolvedValue({
      success: true,
      checkout_id: 'ws_123'
    })

    // 2. Setup mocks for polling (Pending -> Completed)
    ;(apiActions.checkMpesaStatus as any)
      .mockResolvedValueOnce({ status: 'pending' })
      .mockResolvedValueOnce({ status: 'completed' })

    render(<SubscriptionsListing userDetails={mockUserDetails} />)
    
    // 3. Open modal and click Pay
    await waitFor(() => {
      fireEvent.click(screen.getByRole('button', { name: /Subscribe Now/i }))
    })
    
    const payBtn = screen.getByRole('button', { name: /Pay \$10.00 via M-Pesa/i })
    fireEvent.click(payBtn)

    // 4. Fast-forward timers to trigger intervals
    await vi.advanceTimersByTimeAsync(3000) // First poll (pending)
    await vi.advanceTimersByTimeAsync(3000) // Second poll (completed)

    // 5. Verify outcome
    await waitFor(() => {
      expect(apiActions.checkMpesaStatus).toHaveBeenCalledTimes(2)
    })

    vi.useRealTimers()
  })
})
