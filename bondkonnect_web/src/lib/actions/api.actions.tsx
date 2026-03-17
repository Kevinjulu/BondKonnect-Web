// This is a barrel file. We remove "use server" here because it only re-exports 
// from other files that already have "use server" defined.
// This prevents "Only async functions are allowed" errors when types/constants are exported.

import { getBaseApiUrl } from '../utils/url-resolver';

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
  return getBaseApiUrl();
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