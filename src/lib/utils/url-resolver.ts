// src/lib/utils/url-resolver.ts
import { env } from "@/app/config/env";

function normalizeUrl(url: string): string {
  const trimmed = url.trim();
  return trimmed.replace(/\/+$|^\s+|\s+$/g, '').replace(/\/+$/g, '');
}

/**
 * Retrieves the configured API URL from environment variables.
 * This should be the actual API root used by the client,
 * for example https://api.example.com or https://api.example.com/api.
 * 
 * Server-side (SSR) prefers INTERNAL_API_URL if available.
 */
export function getBaseApiUrl(): string {
  const isServer = typeof window === 'undefined';
  const forcePublic = env.FORCE_PUBLIC_API === true || env.FORCE_PUBLIC_API === 'true';
  
  let baseUrl = env.NEXT_PUBLIC_API_URL;

  // Server-side preference for internal mesh URL
  if (isServer && !forcePublic && env.INTERNAL_API_URL) {
    baseUrl = env.INTERNAL_API_URL;
  }

  if (!baseUrl) {
    console.error("CRITICAL: NEXT_PUBLIC_API_URL is undefined!");
    return "/CONFIG_ERROR_MISSING_API_URL";
  }

  // Warning: If API URL matches current frontend origin in browser
  if (!isServer && baseUrl) {
    try {
      const apiOrigin = new URL(baseUrl, window.location.origin).origin;
      if (apiOrigin === window.location.origin) {
        console.warn(`[Connectivity] WARNING: API URL is pointing to the FRONTEND origin (${apiOrigin}). Requests might loop back to Next.js instead of reaching the backend.`);
      }
    } catch (e) {
      // Ignore URL parsing errors here
    }
  }

  return normalizeUrl(baseUrl);
}

/**
 * Retrieves the backend root URL from the configured API URL.
 * If the API URL includes /api, that suffix is stripped.
 */
export function getBaseUrl(): string {
  const apiUrl = getBaseApiUrl();
  return apiUrl.replace(/\/api\/?$/, '');
}

/**
 * Detects whether a URL targets the current frontend origin.
 * Relative paths like /api/v1 are treated as self-calling.
 */
export function isSelfCalling(url: string): boolean {
  if (typeof window === "undefined") return false;

  try {
    const urlObj = new URL(url, window.location.origin);
    return urlObj.origin === window.location.origin;
  } catch {
    return false;
  }
}

/**
 * Retrieves the WebSocket URL for Pusher authentication.
 */
export function getWebSocketUrl(): string {
  const wsUrl = env.NEXT_PUBLIC_WEBSOCKET_URL;
  const baseUrl = getBaseUrl();
  const selectedUrl = normalizeUrl(wsUrl || baseUrl || '');

  if (!selectedUrl) {
    console.warn("WARNING: Both NEXT_PUBLIC_WEBSOCKET_URL and base URL are undefined. Using empty string.");
    return "";
  }

  return selectedUrl;
}
