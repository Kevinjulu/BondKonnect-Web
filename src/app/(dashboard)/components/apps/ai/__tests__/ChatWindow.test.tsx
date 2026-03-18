import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { ChatWindow } from '../ChatWindow'
import { vi, describe, it, expect, beforeEach } from 'vitest'

// Mock next/navigation
vi.mock('next/navigation', () => ({
  usePathname: () => '/apps/bond-stats',
}))

// Mock user check
vi.mock('@/lib/actions/user.check', () => ({
  getCurrentUserDetails: vi.fn(() => Promise.resolve({ email: 'test@example.com' })),
}))

describe('ChatWindow', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders initial assistant message', () => {
    render(<ChatWindow onClose={() => {}} />)
    expect(screen.getByText(/I'm your/i)).toBeInTheDocument()
    expect(screen.getByText(/BondKonnect AI Concierge/i)).toBeInTheDocument()
  })

  it('updates input field when typing', () => {
    render(<ChatWindow onClose={() => {}} />)
    const input = screen.getByPlaceholderText(/Search platform features/i) as HTMLInputElement
    fireEvent.change(input, { target: { value: 'What is YTM?' } })
    expect(input.value).toBe('What is YTM?')
  })

  it('sends message and displays AI response', async () => {
    render(<ChatWindow onClose={() => {}} />)
    const input = screen.getByPlaceholderText(/Search platform features/i)
    const form = input.closest('form')!

    fireEvent.change(input, { target: { value: 'What is YTM?' } })
    fireEvent.submit(form)

    // Check if user message is in the document
    expect(screen.getByText('What is YTM?')).toBeInTheDocument()

    // Wait for AI response
    await waitFor(() => {
      expect(screen.getByText('YTM stands for Yield to Maturity.')).toBeInTheDocument()
    }, { timeout: 5000 })
  })

  it('handles API failure gracefully', async () => {
    render(<ChatWindow onClose={() => {}} />)
    const input = screen.getByPlaceholderText(/Search platform features/i)
    const form = input.closest('form')!

    fireEvent.change(input, { target: { value: 'Error test' } })
    fireEvent.submit(form)

    await waitFor(() => {
      expect(screen.getByText(/Connection error/i)).toBeInTheDocument()
    }, { timeout: 5000 })
  })
})
