/**
 * AuthService (Server Side)
 * 
 * Provides server-side authentication helpers that use 'next/headers'.
 * This file is for use in Server Components, Route Handlers, and Server Actions only.
 */

import { cookies } from 'next/headers';
import { AUTH_KEYS } from './auth-service';

export const AuthService = {
  /**
   * GET token (Server side only)
   */
  async getToken(): Promise<string | null> {
    const cookieStore = await cookies();
    return cookieStore.get(AUTH_KEYS.TOKEN)?.value || null;
  },

  /**
   * GET user role (Server side only)
   */
  async getUserRole(): Promise<string | null> {
    const cookieStore = await cookies();
    return cookieStore.get(AUTH_KEYS.USER_ROLE)?.value || null;
  },

  /**
   * GET current sponsor (Server side only)
   */
  async getCurrentSponsor(): Promise<any | null> {
    const cookieStore = await cookies();
    const rawValue = cookieStore.get(AUTH_KEYS.CURRENT_SPONSOR)?.value || null;
    if (!rawValue) return null;
    try {
      return JSON.parse(decodeURIComponent(rawValue));
    } catch (e) {
      console.error('Failed to parse sponsor data from cookie', e);
      return null;
    }
  }
};
