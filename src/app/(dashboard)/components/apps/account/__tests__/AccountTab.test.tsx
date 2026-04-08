import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { vi, describe, it, expect, beforeEach } from 'vitest'
import { AccountTab } from '../AccountTab'
import api from '@/lib/api'

// Mock api
vi.mock('@/lib/api', () => ({
  default: {
    post: vi.fn(() => Promise.resolve({ success: true })),
  },
}))

// Mock useToast
vi.mock('@/hooks/use-toast', () => ({
  useToast: () => ({
    toast: vi.fn(),
  }),
}))

describe('AccountTab', () => {
  const mockUser = {
    first_name: 'John',
    other_names: 'Doe',
    email: 'john@example.com',
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders with user data', () => {
    render(<AccountTab user={mockUser} />)
    
    // Using id to match the component
    const nameInput = document.getElementById('firstName') as HTMLInputElement
    const surnameInput = document.getElementById('lastName') as HTMLInputElement
    const emailInput = document.getElementById('email') as HTMLInputElement

    expect(nameInput.value).toBe('John')
    expect(surnameInput.value).toBe('Doe')
    expect(emailInput.value).toBe('john@example.com')
  })

  it('calls update profile api on save', async () => {
    render(<AccountTab user={mockUser} />)
    
    // Change name
    const nameInput = document.getElementById('firstName') as HTMLInputElement
    fireEvent.change(nameInput, { target: { value: 'Jane' } })
    
    // Click save
    const saveButton = screen.getByText(/Save Changes/i)
    fireEvent.click(saveButton)
    
    // Verify loading state
    expect(screen.getByText('Saving...')).toBeInTheDocument()
    
    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith('/V1/auth/update-profile', {
        first_name: 'Jane',
        last_name: 'Doe',
        phone: ''
      })
    })
  })
})
