import axios from 'axios';
import { getBaseApiUrl } from '@/lib/utils/url-resolver';

const API_URL = getBaseApiUrl();

// Log API URL at module load to help debugging
if (typeof window !== 'undefined') {
  console.log("Central API URL configured to:", API_URL);
}

const axiosServices = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Request Interceptor
axiosServices.interceptors.request.use(
  (config) => {
    // 1. Log every request for debugging
    if (typeof window !== 'undefined') {
      console.log(`[API Request] ${config.method?.toUpperCase()} ${config.url}`, {
        baseURL: config.baseURL,
        fullURL: `${config.baseURL}${config.url}`,
        payload: config.data
      });
    }

    // 2. Validate API URL
    if (!config.baseURL) {
      console.error("CRITICAL: API baseURL is undefined! Check environment variables.");
    }

    // 3. Handle auth token for client-side requests
    if (typeof window !== 'undefined') {
      const token = document.cookie
        .split('; ')
        .find(row => row.startsWith('k-o-t='))
        ?.split('=')[1];

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    console.error("[API Request Error]", error);
    return Promise.reject(error);
  }
);

// Response Interceptor
axiosServices.interceptors.response.use(
  (response) => {
    // Log successful responses
    if (typeof window !== 'undefined') {
      console.log(`[API Response] ${response.status} ${response.config.url}`, response.data);
    }
    return response;
  },
  (error) => {
    // Log error details
    const errorData = (error.response && error.response.data) || 'Unknown error';
    const status = error.response ? error.response.status : 'Network/Connection Error';
    
    console.error(`[API Error] ${status} ${error.config?.url}`, {
      message: error.message,
      data: errorData
    });

    if (error.response && error.response.status === 401) {
      // Handle unauthorized session
      if (typeof window !== 'undefined') {
        // Only redirect if we are not already on the login page to avoid loops
        if (!window.location.pathname.includes('/auth/login')) {
          document.cookie = 'k-o-t=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
          window.location.href = '/auth/login';
        }
      }
    }

    // Detect if we got an HTML response instead of JSON (common on Railway if redirected)
    if (typeof errorData === 'string' && errorData.includes('<!DOCTYPE html>')) {
      console.error("RECEIVED HTML INSTEAD OF JSON! This usually indicates a redirect or wrong API URL.");
      return Promise.reject({
        message: "Server returned an invalid response (HTML). Check API configuration.",
        status: status,
        isHtmlResponse: true
      });
    }

    return Promise.reject(errorData || 'An unexpected error occurred');
  }
);

export default axiosServices;