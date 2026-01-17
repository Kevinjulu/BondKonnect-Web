import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { SubscriptionsListing } from '../Subscriptions'
import * as apiActions from '@/lib/actions/api.actions'

// Mock the API actions
vi.mock('@/lib/actions/api.actions', () => ({
  getAllSubscriptionPlans: vi.fn(),
  getAllFeatures: vi.fn(),
  getAllFeatureCategories: vi.fn(),
  initiateMpesaStkPush: vi.fn(),
  checkMpesaStatus: vi.fn(),
}))

// Mock the Toast hook
vi.mock('@/hooks/use-toast', () => ({
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
        billingDetails: [
          { Id: 1, Name: 'Daily', Days: 1, UnitPrice: 1 },
          { Id: 2, Name: 'Weekly', Days: 7, UnitPrice: 5 },
          { Id: 3, Name: 'Monthly', Days: 30, UnitPrice: 10 }
        ],
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
      // Use getAllByText and check for existence
      const elements = screen.getAllByText('Basic Plan')
      expect(elements.length).toBeGreaterThan(0)
    })
  })

  it('opens payment modal with M-Pesa fields', async () => {
    render(<SubscriptionsListing userDetails={mockUserDetails} />)
    
    await waitFor(() => {
      const subscribeBtn = screen.getAllByText(/Subscribe Now/i)[0]
      fireEvent.click(subscribeBtn)
    })

    expect(screen.getByText(/Complete your subscription/i)).toBeInTheDocument()
    expect(screen.getByText(/M-Pesa Phone Number/i)).toBeInTheDocument()
  })

  it('polls for M-Pesa status and succeeds when status is completed', async () => {
    vi.useFakeTimers()
    
    // ... rest of test
  }, 10000)
})
