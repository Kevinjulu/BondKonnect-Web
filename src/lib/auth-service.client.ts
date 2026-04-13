/**
 * AuthService (Client Side)
 *
 * Provides client-safe authentication helpers that do not rely on
 * 'next/headers' or server-side APIs.
 */

import { AUTH_KEYS } from './auth-constants';

/** Sanctum sets this cookie name after a successful /sanctum/csrf-cookie call. */
const SANCTUM_CSRF_COOKIE = 'XSRF-TOKEN';

/** Sanctum sets this cookie name after a successful login (session-based auth). */
const SANCTUM_SESSION_COOKIE = 'laravel_session';

export const AuthService = {
  /**
   * GET user role (Client side only)
   */
  getUserRole(): string | null {
    return this.getClientCookie(AUTH_KEYS.USER_ROLE);
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
   * Check whether Sanctum's XSRF-TOKEN cookie is present in the browser.
   * Call this after getCsrf() to confirm the cookie was actually set.
   */
  hasCsrfToken(): boolean {
    return this.getClientCookie(SANCTUM_CSRF_COOKIE) !== null;
  },

  /**
   * Return the raw XSRF-TOKEN value (URL-decoded) or null if absent.
   * Useful for manually attaching the token to a request header.
   */
  getCsrfToken(): string | null {
    const raw = this.getClientCookie(SANCTUM_CSRF_COOKIE);
    if (!raw) return null;
    try {
      return decodeURIComponent(raw);
    } catch {
      return raw;
    }
  },

  /**
   * Check whether Sanctum's laravel_session cookie is present.
   * A truthy result means the user has an active server-side session.
   */
  hasSessionCookie(): boolean {
    return this.getClientCookie(SANCTUM_SESSION_COOKIE) !== null;
  },

  /**
   * CLEAR all session data (Client side only)
   */
  clearAll(): void {
    const keys = Object.values(AUTH_KEYS);
    keys.forEach(key => {
      this.removeClientCookie(key);
    });

    // Clear localStorage items that may have been set previously
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
    // In production the frontend and backend are on different Railway domains, so
    // cookies must use SameSite=None; Secure to be sent in cross-site requests.
    // In development (HTTP) we fall back to SameSite=Lax to avoid the Secure requirement.
    const isProduction = window.location.protocol === 'https:';
    const sameSite = isProduction ? 'SameSite=None; Secure' : 'SameSite=Lax';
    document.cookie = `${name}=${value || ""}${expires}; path=/; ${sameSite}`;
  },

  removeClientCookie(name: string): void {
    if (typeof window === 'undefined') return;
    const isProduction = window.location.protocol === 'https:';
    const sameSite = isProduction ? 'SameSite=None; Secure' : 'SameSite=Lax';
    document.cookie = `${name}=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT; ${sameSite}`;
  }
};
