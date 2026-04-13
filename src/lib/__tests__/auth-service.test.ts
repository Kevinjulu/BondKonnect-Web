import { describe, it, expect, vi, beforeEach } from 'vitest'
import { AuthService } from '../auth-service.client'

// Mock document.cookie
const mockDocument = {
  cookie: ''
}
Object.defineProperty(document, 'cookie', {
  get: () => mockDocument.cookie,
  set: (value) => { mockDocument.cookie = value }
})

describe('AuthService', () => {
  beforeEach(() => {
    mockDocument.cookie = ''
    vi.clearAllMocks()
  })

  it('gets user role from cookie', () => {
    mockDocument.cookie = 'userRole=admin; other=value'
    
    const role = AuthService.getUserRole()
    expect(role).toBe('admin')
  })

  it('returns null when user role cookie not present', () => {
    mockDocument.cookie = 'other=value'
    
    const role = AuthService.getUserRole()
    expect(role).toBeNull()
  })

  it('sets user role cookie', () => {
    AuthService.setUserRole('admin', 1)
    
    expect(mockDocument.cookie).toContain('userRole=admin')
  })

  it('clears all cookies', () => {
    const removeSpy = vi.spyOn(AuthService, 'removeClientCookie')
    
    AuthService.clearAll()
    
    // Should have called removeClientCookie for each AUTH_KEY
    expect(removeSpy).toHaveBeenCalledWith('userRole')
    expect(removeSpy).toHaveBeenCalledWith('currentSponsor')
    expect(removeSpy).toHaveBeenCalledWith('lastPath')
  })
})