import axios from 'axios';
import { getBaseApiUrl, isSelfCalling } from '@/lib/utils/url-resolver';
import { toast } from '@/hooks/use-toast';

const API_URL = getBaseApiUrl();

// Global connectivity state tracking
let consecutiveFailures = 0;
const FAILURE_THRESHOLD = 3;
let isMaintenanceMode = false;

// Log API URL at module load to help debugging
if (typeof window !== 'undefined') {
  console.log("Central API URL configured to:", API_URL);
  
  if (isSelfCalling(API_URL)) {
    const errorMsg = "CRITICAL CONFIG ERROR: The API_URL is pointing to the FRONTEND origin.";
    console.error(
      `${errorMsg} Check your NEXT_PUBLIC_API_URL environment variable in Railway.`
    );
    
    // Immediate toast for developer/admin
    setTimeout(() => {
      toast({
        title: "Configuration Error",
        description: errorMsg,
        variant: "destructive",
      });
    }, 1000);
  }
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
    // 1. Connectivity Guard: Prevent self-calling
    if (typeof window !== 'undefined' && config.baseURL && isSelfCalling(config.baseURL)) {
      const errorMsg = `BLOCKED REQUEST: Attempting to call frontend origin as API: ${config.baseURL}${config.url}`;
      console.error(errorMsg);
      
      toast({
        title: "Blocked Request",
        description: "The application is trying to call its own frontend as an API. Check configuration.",
        variant: "destructive"
      });
      
      return Promise.reject(new Error(errorMsg));
    }

    // 2. Log every request for debugging
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
    // Reset failure counter on any successful response
    consecutiveFailures = 0;
    if (isMaintenanceMode) {
      isMaintenanceMode = false;
      toast({
        title: "Connection Restored",
        description: "Communication with the backend has been re-established.",
        variant: "default"
      });
    }

    // Log successful responses
    if (typeof window !== 'undefined') {
      console.log(`[API Response] ${response.status} ${response.config.url}`, response.data);
    }
    return response;
  },
  (error) => {
    // Increment failure counter for connection-related issues
    const isConnError = error.code === 'ERR_NETWORK' || 
                        error.code === 'ECONNREFUSED' || 
                        error.message?.includes('HTML instead of JSON');
    
    if (isConnError) {
      consecutiveFailures++;
      if (consecutiveFailures >= FAILURE_THRESHOLD && !isMaintenanceMode) {
        isMaintenanceMode = true;
        toast({
          title: "System Maintenance",
          description: "The backend servers appear to be offline. We are attempting to reconnect.",
          variant: "destructive"
        });
      }
    }

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

    // 4. Enhanced Connectivity Detection: Detect if we got an HTML response instead of JSON
    // (Common on Railway if redirected or if the backend is down/unconfigured)
    const contentType = error.response?.headers?.['content-type'] || '';
    const isHtml = contentType.includes('text/html') || (typeof errorData === 'string' && errorData.includes('<!DOCTYPE html>'));

    if (isHtml) {
      let diagnosticMessage = "Server returned HTML instead of JSON. Check API configuration.";
      
      // Signature Scanning: Identify the source of the HTML
      if (typeof errorData === 'string') {
        if (errorData.includes('railway.app') || errorData.includes('Railway')) {
          diagnosticMessage = "RAILWAY ERROR: The backend service might be offline or the URL is incorrect.";
        } else if (errorData.includes('Next.js') || errorData.includes('__next')) {
          diagnosticMessage = "FRONTEND LOOP: The request hit the frontend's own 404 page. Check API_URL.";
        } else if (errorData.includes('404 Not Found')) {
          diagnosticMessage = "404 ERROR: The endpoint does not exist on the backend.";
        }
      }

      console.error(`[Connectivity Diagnostic] ${diagnosticMessage}`, {
        url: error.config?.url,
        status: status,
        contentType: contentType
      });

      // Avoid spamming toasts if already in maintenance mode
      if (!isMaintenanceMode) {
        toast({
          title: "Connection Issue",
          description: diagnosticMessage,
          variant: "destructive"
        });
      }

      return Promise.reject({
        message: diagnosticMessage,
        status: status,
        isHtmlResponse: true,
        originalError: errorData
      });
    }

    // 5. Detect Network/DNS Errors (Server completely unreachable)
    if (error.code === 'ERR_NETWORK' || error.code === 'ECONNREFUSED') {
       console.error("[Connectivity Diagnostic] Backend is UNREACHABLE. Possible DNS issue or server is down.");
       
       if (!isMaintenanceMode) {
         toast({
           title: "Network Error",
           description: "Unable to reach BondKonnect servers. Check your connection.",
           variant: "destructive"
         });
       }

       return Promise.reject({
         message: "Unable to connect to BondKonnect servers. Please check your internet connection.",
         isNetworkError: true
       });
    }

    return Promise.reject(errorData || 'An unexpected error occurred');
  }
);

export default axiosServices;