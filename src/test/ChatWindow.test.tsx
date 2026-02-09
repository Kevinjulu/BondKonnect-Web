import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { ChatWindow } from '@/app/(dashboard)/components/apps/ai/ChatWindow'
import { vi, describe, it, expect, beforeEach } from 'vitest'

// Mock next/navigation
vi.mock('next/navigation', () => ({
  usePathname: () => '/apps/bond-stats',
}))

// Mock fetch
const mockFetch = vi.fn()
global.fetch = mockFetch

describe('ChatWindow', () => {
  beforeEach(() => {
    mockFetch.mockClear()
  })

  it('renders initial assistant message', () => {
    render(<ChatWindow onClose={() => {}} />)
    expect(screen.getByText(/I'm your BondKonnect AI/i)).toBeInTheDocument()
  })

  it('updates input field when typing', () => {
    render(<ChatWindow onClose={() => {}} />)
    const input = screen.getByPlaceholderText(/Ask about Kenyan Bonds/i) as HTMLInputElement
    fireEvent.change(input, { target: { value: 'What is YTM?' } })
    expect(input.value).toBe('What is YTM?')
  })

  it('sends message and displays AI response', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        success: true,
        data: 'YTM stands for Yield to Maturity.'
      }),
    })

    render(<ChatWindow onClose={() => {}} />)
    const input = screen.getByPlaceholderText(/Ask about Kenyan Bonds/i)
    const sendButton = screen.getByLabelText(/Send message/i)

    fireEvent.change(input, { target: { value: 'What is YTM?' } })
    fireEvent.click(sendButton)

    // Check if user message is in the document
    expect(screen.getByText('What is YTM?')).toBeInTheDocument()

    // Wait for AI response
    await waitFor(() => {
      expect(screen.getByText('YTM stands for Yield to Maturity.')).toBeInTheDocument()
    })

    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining('/V1/ai/chat'),
      expect.objectContaining({
        method: 'POST',
        body: expect.stringContaining('What is YTM?')
      })
    )
  })

  it('handles API failure gracefully', async () => {
    mockFetch.mockRejectedValueOnce(new Error('API Down'))

    render(<ChatWindow onClose={() => {}} />)
    const input = screen.getByPlaceholderText(/Ask about Kenyan Bonds/i)
    const sendButton = screen.getByLabelText(/Send message/i)

    fireEvent.change(input, { target: { value: 'Error test' } })
    fireEvent.click(sendButton)

    await waitFor(() => {
      expect(screen.getByText(/Connection error/i)).toBeInTheDocument()
    })
  })
})
