/**
 * Centralized API URL resolver
 */
export const getBaseApiUrl = () => {
  // Always prioritize the explicit API URL if set (usually for consistency)
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL;
  }

  // Fallback for local development if nothing else is provided
  if (process.env.NODE_ENV === 'development') {
    return "http://localhost:8000/api";
  }

  // Production fallback (last resort)
  return "https://api.bondkonnect.com/api";
};

export const getWebSocketBaseUrl = () => {
  // Prioritize explicit WebSocket URL or extract from API URL
  if (process.env.NEXT_PUBLIC_WEBSOCKET_URL) {
    return process.env.NEXT_PUBLIC_WEBSOCKET_URL;
  }

  const apiUrl = getBaseApiUrl();
  try {
    const url = new URL(apiUrl);
    // Remove /api from the end for WebSocket base
    return `${url.protocol}//${url.host}`;
  } catch (e) {
    return apiUrl.replace('/api', '');
  }
};
