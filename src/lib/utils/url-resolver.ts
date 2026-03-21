// src/lib/utils/url-resolver.ts

/**
 * Retrieves the base API URL from environment variables.
 * In production, it MUST be the Railway backend URL.
 */
export function getBaseApiUrl(): string {
  const apiUrl = (
    process.env.NEXT_PUBLIC_API_URL
  )?.trim();

  // Log configuration to help debugging (only in browser)
  if (typeof window !== 'undefined') {
    if (!apiUrl) {
      console.warn("CRITICAL: NEXT_PUBLIC_API_URL is UNDEFINED!");
    } else {
      console.log("Connecting to API at:", apiUrl);
      
      // Safety check: warn if it points to the frontend origin instead of backend
      if (apiUrl.includes(window.location.host)) {
        console.warn("WARNING: API URL is pointing to the FRONTEND origin. Ensure NEXT_PUBLIC_API_URL is set in your Railway dashboard.");
      }
    }
  }

  // Strictly enforce an API URL in all environments to prevent accidental self-connection
  if (!apiUrl) {
     // Return the expected Railway URL as a hard default if the variable is missing
     return 'https://bondkonnect-backend-production.up.railway.app/api';
  }

  return apiUrl;
}

/**
 * Retrieves the WebSocket URL for Pusher authentication.
 */
export function getWebSocketUrl(): string {
  const wsUrl = (
    process.env.NEXT_PUBLIC_WEBSOCKET_URL
  )?.trim();

  if (typeof window !== 'undefined') {
    console.log("WebSocket auth endpoint set to:", wsUrl || 'https://bondkonnect-backend-production.up.railway.app');
  }

  // Strictly enforce the WebSocket URL
  return wsUrl || 'https://bondkonnect-backend-production.up.railway.app';
}
