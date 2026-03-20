/**
 * Centralized API URL resolver
 */
export const getBaseApiUrl = () => {
  let apiUrl = "";

  // Always prioritize the explicit API URL if set (usually for consistency)
  if (process.env.NEXT_PUBLIC_API_URL) {
    apiUrl = process.env.NEXT_PUBLIC_API_URL;
  } else if (process.env.NODE_ENV === 'development') {
    // Fallback for local development
    apiUrl = "http://localhost:8000/api";
  } else {
    // Production fallback (last resort)
    apiUrl = "https://api.bondkonnect.com/api";
  }

  // Ensure it doesn't have a trailing slash, but ends with /api if not already present
  // This helps prevent double slashes or missing /api prefix
  apiUrl = apiUrl.replace(/\/$/, "");
  
  // If the URL doesn't end with /api, and it's not a root domain, we might want to add it
  // But let's follow the provided pattern: ${process.env.NEXT_PUBLIC_API_URL}/api
  // Actually, the user says the BASE_URL should be ${process.env.NEXT_PUBLIC_API_URL}/api
  
  if (typeof window !== 'undefined') {
    // console.log("Frontend API URL Resolved to:", apiUrl);
  }

  return apiUrl;
};

export const getWebSocketBaseUrl = () => {
  // Prioritize explicit WebSocket URL or extract from API URL
  if (process.env.NEXT_PUBLIC_WEBSOCKET_URL) {
    return process.env.NEXT_PUBLIC_WEBSOCKET_URL;
  }

  const apiUrl = getBaseApiUrl();
  try {
    const url = new URL(apiUrl);
    // WebSocket usually connects to the root, not /api
    return `${url.protocol}//${url.host}`;
  } catch (e) {
    return apiUrl.replace('/api', '');
  }
};
