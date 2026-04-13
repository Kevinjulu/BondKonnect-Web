import axios from 'axios'
import { AuthService } from './auth-service.client'
import { getBaseApiUrl, getBaseUrl, isSelfCalling } from './utils/url-resolver'

const api = axios.create({
  baseURL: getBaseApiUrl(),
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    // Sanctum reads the CSRF token from this header name
    'X-Requested-With': 'XMLHttpRequest',
  },
  // Tell axios to read the XSRF-TOKEN cookie and forward it as X-XSRF-TOKEN
  xsrfCookieName: 'XSRF-TOKEN',
  xsrfHeaderName: 'X-XSRF-TOKEN',
})

api.interceptors.request.use(async (config) => {
  // 1. Connectivity Guard: Prevent self-calling in the browser
  if (typeof window !== 'undefined' && config.baseURL && isSelfCalling(config.baseURL)) {
     const errorMsg = `BLOCKED REQUEST: Attempting to call frontend origin as API: ${config.baseURL}${config.url}`;
     console.error(errorMsg);
     return Promise.reject(new Error(errorMsg));
  }

  // Authentication handled via cookies (Sanctum)
  
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
 * Initializes CSRF protection for Sanctum.
 *
 * Hits the /sanctum/csrf-cookie endpoint which causes Laravel to set the
 * XSRF-TOKEN cookie. We explicitly wait for the response (and therefore the
 * Set-Cookie header) before returning so callers can be sure the cookie is
 * present before they attempt a login request.
 *
 * Returns true when the XSRF-TOKEN cookie is confirmed present, false otherwise.
 */
export const getCsrf = async (): Promise<boolean> => {
  const baseURL = getBaseUrl();

  try {
    await axios.get(`${baseURL}/sanctum/csrf-cookie`, {
      withCredentials: true,
      headers: {
        'Accept': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
      },
      // Ensure axios forwards the XSRF-TOKEN cookie on subsequent requests
      xsrfCookieName: 'XSRF-TOKEN',
      xsrfHeaderName: 'X-XSRF-TOKEN',
    });

    // Verify the cookie was actually set by the browser
    const hasCsrf = AuthService.hasCsrfToken();
    if (hasCsrf) {
      console.debug('[CSRF] XSRF-TOKEN cookie confirmed present after /sanctum/csrf-cookie.');
    } else {
      console.warn(
        '[CSRF] /sanctum/csrf-cookie responded but XSRF-TOKEN cookie was NOT found. ' +
        'Check CORS, SameSite, and Secure cookie settings on the backend.'
      );
    }

    return hasCsrf;
  } catch (err) {
    console.error('[CSRF] Failed to fetch /sanctum/csrf-cookie:', err);
    return false;
  }
}

export default api

