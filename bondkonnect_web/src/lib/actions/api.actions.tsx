// This is a barrel file. We remove "use server" here because it only re-exports 
// from other files that already have "use server" defined.
// This prevents "Only async functions are allowed" errors when types/constants are exported.

export * from './auth.actions';
export * from './market.actions';
export * from './portfolio.actions';
export * from './communication.actions';
export * from './payment.actions';
export * from './sms.actions';
export * from './user.check';

/**
 * Legacy utility functions maintained for backward compatibility
 */
export const getCurrentApiUrl = async () => {
  const APP_ENVIRONMENT = process.env.APP_ENV;
  let BASE_URL = "";

  if (APP_ENVIRONMENT === "production") {
    BASE_URL = process.env.NEXT_PUBLIC_BK_PROD_API_URL ?? "";
  } else if (APP_ENVIRONMENT === "uat") {
    BASE_URL = process.env.NEXT_PUBLIC_BK_UAT_API_URL ?? "";
  } else {
    BASE_URL = process.env.NEXT_PUBLIC_BK_DEV_API_URL ?? "";
  }

  if (!BASE_URL) {
    throw new Error("API URL not found");
  }

  return BASE_URL;
};

export const getIPAddress = async () => {
  try {
    const response = await fetch("https://api.ipify.org?format=json");
    const data = await response.json();
    return data.ip;
  } catch (error) {
    console.error("Error fetching IP address:", error);
    return "nairobi";
  }
};