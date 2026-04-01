import axios from 'axios'
import { AuthService } from './auth-service.client'
import { getBaseApiUrl, isSelfCalling } from './utils/url-resolver'

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
  if (typeof window !== 'undefined' && config.baseURL && isSelfCalling(config.baseURL)) {
     const errorMsg = `BLOCKED REQUEST: Attempting to call frontend origin as API: ${config.baseURL}${config.url}`;
     console.error(errorMsg);
     return Promise.reject(new Error(errorMsg));
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
    // Enhanced Connectivity Detection: Detect if we got an HTML response instead of JSON
    const errorData = error.response?.data;
    const contentType = error.response?.headers?.['content-type'] || '';
    const isHtml = contentType.includes('text/html') || (typeof errorData === 'string' && errorData.includes('<!DOCTYPE html>'));

    if (isHtml) {
      let diagnosticMessage = "Server returned HTML instead of JSON. Check API configuration.";
      
      // Identify the source of the HTML
      if (typeof errorData === 'string') {
        if (errorData.includes('railway.app') || errorData.includes('Railway')) {
          diagnosticMessage = "RAILWAY ERROR: Backend service might be offline or internal URL is incorrect.";
        } else if (errorData.includes('Next.js') || errorData.includes('__next')) {
          diagnosticMessage = "FRONTEND LOOP: Request hit frontend origin. Check API_URL.";
        }
      }

      console.error(`[API Connection Error] ${diagnosticMessage}`, {
        url: error.config?.url,
        status: error.response?.status,
        internal: typeof window === "undefined"
      });

      return Promise.reject({
        message: diagnosticMessage,
        status: error.response?.status,
        isHtmlResponse: true,
        data: errorData
      });
    }

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
  const baseURL = getBaseApiUrl();
  return axios.get(`${baseURL}/sanctum/csrf-cookie`, {
    withCredentials: true
  })
}

export default api

