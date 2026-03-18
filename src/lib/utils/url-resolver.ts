/**
 * Centralized API URL resolver
 */
export const getBaseApiUrl = () => {
  // Always prioritize the explicit API URL if set (usually for consistency)
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL;
  }

  // Then prioritize Railway or Render if we are in a deployed environment
  if (process.env.NEXT_PUBLIC_BK_RAILWAY_API_URL && process.env.NODE_ENV === 'production') {
    return process.env.NEXT_PUBLIC_BK_RAILWAY_API_URL;
  }
  
  if (process.env.NEXT_PUBLIC_BK_RENDER_API_URL && process.env.NODE_ENV === 'production') {
    return process.env.NEXT_PUBLIC_BK_RENDER_API_URL;
  }

  const appEnv = process.env.APP_ENV || process.env.NEXT_PUBLIC_APP_ENV;

  if (appEnv === "production") {
    return process.env.NEXT_PUBLIC_BK_PROD_API_URL || "https://api.bondkonnect.com/api";
  } else if (appEnv === "uat") {
    return process.env.NEXT_PUBLIC_BK_UAT_API_URL || "https://api-uat.bondkonnect.com/api";
  }

  // Default to local development
  return process.env.NEXT_PUBLIC_BK_DEV_API_URL || "http://localhost:8000/api";
};

export const getWebSocketBaseUrl = () => {
  if (process.env.NEXT_PUBLIC_BK_RAILWAY_WEBSOCKET_API_URL && process.env.NODE_ENV === 'production') {
    return process.env.NEXT_PUBLIC_BK_RAILWAY_WEBSOCKET_API_URL;
  }

  if (process.env.NEXT_PUBLIC_BK_RENDER_WEBSOCKET_API_URL && process.env.NODE_ENV === 'production') {
    return process.env.NEXT_PUBLIC_BK_RENDER_WEBSOCKET_API_URL;
  }

  const appEnv = process.env.APP_ENV || process.env.NEXT_PUBLIC_APP_ENV;

  if (appEnv === "production") {
    return process.env.NEXT_PUBLIC_BK_PROD_WEBSOCKET_API_URL || "https://api.bondkonnect.com";
  } else if (appEnv === "uat") {
    return process.env.NEXT_PUBLIC_BK_UAT_WEBSOCKET_API_URL || "https://api-uat.bondkonnect.com";
  }

  return process.env.NEXT_PUBLIC_BK_DEV_WEBSOCKET_API_URL || "http://localhost:8000";
};
