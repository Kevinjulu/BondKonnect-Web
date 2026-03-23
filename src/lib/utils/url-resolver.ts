// src/lib/utils/url-resolver.ts

/**
 * Retrieves the base API URL from environment variables.
 * In production, it MUST be the Railway backend URL.
 */
export function getBaseApiUrl(): string {
  // 1. Server-side resolution (Next.js Server Components / Actions)
  if (typeof window === "undefined") {
    const internalUrl = process.env.INTERNAL_API_URL?.trim();
    const publicUrl = process.env.NEXT_PUBLIC_API_URL?.trim();

    // Use internal URL if available (faster/more secure within Railway network)
    if (internalUrl) return internalUrl;
    
    // Fallback to public URL for SSR if internal is not provided
    if (publicUrl) return publicUrl;

    console.error("CRITICAL: Both INTERNAL_API_URL and NEXT_PUBLIC_API_URL are undefined on the server!");
    throw new Error("API configuration missing. Check environment variables.");
  }

  // 2. Client-side resolution
  const apiUrl = process.env.NEXT_PUBLIC_API_URL?.trim();

  if (!apiUrl) {
    console.error("CRITICAL: NEXT_PUBLIC_API_URL is undefined on the client!");
    // In browser, we can't throw without crashing the UI, so we return a dummy string 
    // to trigger network errors that the axios interceptors can catch.
    return "/CONFIG_ERROR_MISSING_API_URL";
  }

  // Safety check: warn if it points to the frontend origin instead of backend
  if (typeof window !== "undefined" && apiUrl.includes(window.location.host)) {
    console.warn(
      "WARNING: API URL is pointing to the FRONTEND origin. " +
      "Ensure NEXT_PUBLIC_API_URL is set in your Railway dashboard to the backend service URL."
    );
  }

  return apiUrl;
}

/**
 * Retrieves the base URL (without /api) from the environment.
 */
export function getBaseUrl(): string {
  const apiUrl = getBaseApiUrl();
  return apiUrl.split('/api')[0];
}

/**
 * Detects if the provided URL points to the frontend origin.
 * Used to prevent "self-calling" loops where the frontend tries to 
 * fetch data from its own static routes.
 */
export function isSelfCalling(url: string): boolean {
  if (typeof window === "undefined") return false;
  
  try {
    const origin = window.location.origin;
    // Check if URL is relative or matches the current origin
    return url.startsWith("/") || url.startsWith(origin);
  } catch (e) {
    return false;
  }
}

/**
 * Retrieves the WebSocket URL for Pusher authentication.
 */
export function getWebSocketUrl(): string {
  const wsUrl = process.env.NEXT_PUBLIC_WEBSOCKET_URL?.trim();

  if (!wsUrl) {
    console.warn("WARNING: NEXT_PUBLIC_WEBSOCKET_URL is undefined. Using empty string.");
    return "";
  }

  return wsUrl;
}
