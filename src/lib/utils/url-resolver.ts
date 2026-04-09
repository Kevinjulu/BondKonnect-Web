// src/lib/utils/url-resolver.ts
import { env } from "@/app/config/env";

/**
 * Normalizes a URL to ensure it has the /api suffix if missing.
 */
function normalizeApiUrl(url: string | undefined): string | null {
  if (!url) return null;
  // Remove trailing slash
  const cleanUrl = url.endsWith('/') ? url.slice(0, -1) : url;
  // Append /api if missing
  return cleanUrl.includes('/api') ? cleanUrl : `${cleanUrl}/api`;
}

/**
 * Retrieves the base API URL from environment variables.
 * In production, it MUST be the Railway backend URL.
 */
export function getBaseApiUrl(): string {
  // 1. Server-side resolution (Next.js Server Components / Actions)
  if (typeof window === "undefined") {
    const internalUrl = normalizeApiUrl(env.INTERNAL_API_URL);
    const publicUrl = normalizeApiUrl(env.NEXT_PUBLIC_API_URL);
    const forcePublic = env.FORCE_PUBLIC_API;

    // Debug: print resolution at runtime (server-side only). Remove after verification.
    try {
      // eslint-disable-next-line no-console
      console.info("API resolver (server): internalUrl=", internalUrl, "publicUrl=", publicUrl, "forcePublic=", forcePublic);
    } catch (e) {
      // swallow logging errors in constrained runtimes
    }

    // Use internal URL if available and NOT forced to public
    if (internalUrl && !forcePublic) return internalUrl;
    
    // Fallback to public URL for SSR
    if (publicUrl) return publicUrl;

    console.error("CRITICAL: Both INTERNAL_API_URL and NEXT_PUBLIC_API_URL are undefined on the server!");
    throw new Error("API configuration missing. Check environment variables.");
  }

  // 2. Client-side resolution
  const apiUrl = normalizeApiUrl(env.NEXT_PUBLIC_API_URL);

  if (!apiUrl) {
    console.error("CRITICAL: NEXT_PUBLIC_API_URL is undefined on the client!");
    return "/CONFIG_ERROR_MISSING_API_URL";
  }

  // Safety check: warn if it points to the frontend origin instead of backend
  if (typeof window !== "undefined" && apiUrl.includes(window.location.host)) {
    console.warn(
      "WARNING: API URL is pointing to the FRONTEND origin. " +
      "Ensure NEXT_PUBLIC_API_URL is set correctly."
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
 * Falls back to the base URL if NEXT_PUBLIC_WEBSOCKET_URL is missing.
 */
export function getWebSocketUrl(): string {
  const wsUrl = env.NEXT_PUBLIC_WEBSOCKET_URL;
  const baseUrl = getBaseUrl();

  // Prefer the explicit websocket URL, fallback to base URL (backend root)
  const selectedUrl = wsUrl || baseUrl;

  if (!selectedUrl) {
    console.warn("WARNING: Both NEXT_PUBLIC_WEBSOCKET_URL and base URL are undefined. Using empty string.");
    return "";
  }

  // Remove trailing slash for consistency
  return selectedUrl.endsWith('/') ? selectedUrl.slice(0, -1) : selectedUrl;
}
