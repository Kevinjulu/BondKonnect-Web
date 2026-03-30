/**
 * AuthService (Client Side)
 * 
 * Provides client-safe authentication helpers that do not rely on 
 * 'next/headers' or server-side APIs.
 */

import { AUTH_KEYS } from './auth-constants';

export const AuthService = {
  /**
   * GET token (Client side only)
   */
  getToken(): string | null {
    return this.getClientCookie(AUTH_KEYS.TOKEN);
  },

  /**
   * GET user role (Client side only)
   */
  getUserRole(): string | null {
    return this.getClientCookie(AUTH_KEYS.USER_ROLE);
  },

  /**
   * SET token (Client side only)
   */
  setToken(token: string, days: number = 1): void {
    this.setClientCookie(AUTH_KEYS.TOKEN, token, days);
  },

  /**
   * SET user role (Client side only)
   */
  setUserRole(role: string, days: number = 1): void {
    this.setClientCookie(AUTH_KEYS.USER_ROLE, role, days);
  },

  /**
   * SET current sponsor (Client side only)
   */
  setCurrentSponsor(sponsorData: any, days: number = 1): void {
    const encodedData = encodeURIComponent(JSON.stringify(sponsorData));
    this.setClientCookie(AUTH_KEYS.CURRENT_SPONSOR, encodedData, days);
  },

  /**
   * GET current sponsor (Client side only)
   */
  getCurrentSponsor(): any | null {
    const rawValue = this.getClientCookie(AUTH_KEYS.CURRENT_SPONSOR);
    if (!rawValue) return null;
    try {
      return JSON.parse(decodeURIComponent(rawValue));
    } catch (e) {
      console.error('Failed to parse sponsor data from cookie', e);
      return null;
    }
  },

  /**
   * CLEAR all session data (Client side only)
   */
  clearAll(): void {
    const keys = Object.values(AUTH_KEYS);
    keys.forEach(key => {
      this.removeClientCookie(key);
    });

    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    localStorage.removeItem('lastActiveTime');
    localStorage.removeItem('lastPath');
    localStorage.removeItem('lastSponsor');
  },

  // Private helpers
  getClientCookie(name: string): string | null {
    if (typeof window === 'undefined') return null;
    const nameEQ = name + "=";
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) === ' ') c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
  },

  setClientCookie(name: string, value: string, days: number): void {
    if (typeof window === 'undefined') return;
    let expires = "";
    if (days) {
      const date = new Date();
      date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
      expires = "; expires=" + date.toUTCString();
    }
    document.cookie = `${name}=${value || ""}${expires}; path=/; SameSite=Lax`;
  },

  removeClientCookie(name: string): void {
    if (typeof window === 'undefined') return;
    document.cookie = `${name}=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT; SameSite=Lax`;
  }
};
