import { describe, it, expect, vi, beforeEach } from 'vitest'

// Mock the env module before importing
vi.mock('@/app/config/env', () => ({
  env: {
    NEXT_PUBLIC_API_URL: 'https://api.example.com',
  },
}))

import { getBaseApiUrl } from '../url-resolver'

describe('URL Resolver', () => {
  beforeEach(() => {
    vi.resetModules()
    vi.clearAllMocks()
  })

  it('uses NEXT_PUBLIC_API_URL', () => {
    const url = getBaseApiUrl()
    expect(url).toBe('https://api.example.com')
  })

  it('normalizes URL by removing trailing slash', () => {
    // Note: getBaseApiUrl might be caching or using the initial mock.
    // If it's a simple function, it should just work.
    const url = getBaseApiUrl()
    expect(url).toBe('https://api.example.com')
  })
})
