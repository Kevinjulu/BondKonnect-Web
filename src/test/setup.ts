import '@testing-library/jest-dom'
import { vi } from 'vitest'

// Global mocks
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
    back: vi.fn(),
  }),
  usePathname: () => '/',
  useSearchParams: () => new URLSearchParams(),
}))

vi.mock('@/hooks/use-toast', () => ({
  useToast: () => ({
    toast: vi.fn(),
  }),
}))

vi.mock('@/lib/actions/user.check', () => ({
  getCurrentUserDetails: vi.fn(() => Promise.resolve({ email: 'test@example.com' })),
}))
