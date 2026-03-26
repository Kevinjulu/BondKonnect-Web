import axios from 'axios'
import { AuthService } from './auth-service.client'
import { getBaseApiUrl, getBaseUrl } from './utils/url-resolver'

const api = axios.create({
  baseURL: getBaseApiUrl(),
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  }
})

api.interceptors.request.use(async (config) => {
  // 1. Connectivity Guard: Prevent self-calling in the browser
  if (typeof window !== 'undefined' && config.baseURL && config.baseURL.includes(window.location.host)) {
     // Optional: you could block here like in axios.ts, but let's keep it simple for now
  }

  // 2. Use AuthService to get the token (works on both server and client)
  const token = await AuthService.getToken()
  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        // Clear all session data using AuthService
        AuthService.clearAll()
        
        // Only redirect if we are not already on the login page
        if (!window.location.pathname.includes('/auth/login')) {
          window.location.href = '/auth/login'
        }
      }
    }
    return Promise.reject(error)
  }
)

/**
 * Initializes CSRF protection for Sanctum
 */
export const getCsrf = async () => {
  const baseURL = getBaseUrl();
  return axios.get(`${baseURL}/sanctum/csrf-cookie`, {
    withCredentials: true
  })
}

export default api

