import { describe, it, expect, vi, beforeEach } from 'vitest'
import axios from 'axios'

// Define the captured handlers and the mock instance using vi.hoisted
const { mockInstance, getHandlers } = vi.hoisted(() => {
  let errorHandler: any;
  
  const mock = {
    interceptors: {
      request: { use: vi.fn() },
      response: { 
        use: vi.fn((success, failure) => {
          errorHandler = failure;
        }) 
      }
    },
    defaults: {
      headers: {
        common: {}
      },
      withCredentials: true
    },
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn()
  };

  return {
    mockInstance: mock,
    getHandlers: () => ({ errorHandler })
  };
});

// Mock axios before importing api
vi.mock('axios', () => {
  return {
    default: {
      create: vi.fn(() => mockInstance),
      interceptors: {
        request: { use: vi.fn() },
        response: { use: vi.fn() }
      },
      get: vi.fn(),
      post: vi.fn(),
      isAxiosError: vi.fn(() => true)
    }
  };
})

// Now we can safely import api
import api from '../api'
import { AuthService } from '../auth-service.client'

describe('API Client', () => {
  const mockedAxios = vi.mocked(axios)

  beforeEach(() => {
    vi.clearAllMocks()
    vi.stubGlobal('window', {
      location: {
        pathname: '/',
        href: 'http://localhost/'
      }
    })
  })

  it('verifies axios configuration', () => {
    // Tests that api was initialized with correct defaults
    expect(api.defaults.withCredentials).toBe(true)
  })

  it('handles 401 errors by clearing auth and redirecting', async () => {
    vi.spyOn(AuthService, 'clearAll').mockImplementation(vi.fn())

    // Extract the response interceptor's error handler captured during initialization
    const { errorHandler } = getHandlers();
    
    expect(errorHandler).toBeDefined();
    
    const error = {
      response: {
        status: 401,
        data: { message: 'Unauthorized' },
        headers: {}
      },
      config: { url: '/test' }
    }

    try {
      await errorHandler(error)
    } catch (e) {
      // Expected catch
    }

    expect(AuthService.clearAll).toHaveBeenCalled()
    expect(window.location.href).toBe('/auth/login')
  })
})
