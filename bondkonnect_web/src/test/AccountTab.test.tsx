import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { vi } from 'vitest'
import { AccountTab } from '../app/(dashboard)/components/apps/account/AccountTab'
import axios from '../utils/axios'

// Mock axios
vi.mock('../utils/axios', () => ({
  default: {
    post: vi.fn(),
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
    name: 'John Doe',
    email: 'john@example.com',
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders with user data', () => {
    render(<AccountTab user={mockUser} />)
    
    // Using id to be absolutely sure
    const nameInput = document.getElementById('name') as HTMLInputElement
    const surnameInput = document.getElementById('surname') as HTMLInputElement
    const emailInput = document.getElementById('email') as HTMLInputElement

    expect(nameInput.value).toBe('John')
    expect(surnameInput.value).toBe('Doe')
    expect(emailInput.value).toBe('john@example.com')
  })

  it('calls update profile api on save', async () => {
    render(<AccountTab user={mockUser} />)
    
    // Change name
    const nameInput = document.getElementById('name') as HTMLInputElement
    fireEvent.change(nameInput, { target: { value: 'Jane' } })
    
    // Click save
    const saveButton = screen.getByText('Save changes')
    fireEvent.click(saveButton)
    
    // Verify loading state
    expect(screen.getByText('Saving...')).toBeInTheDocument()
    
    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith('/V1/auth/update-profile', {
        first_name: 'Jane',
        last_name: 'Doe'
      })
    })
  })
})
