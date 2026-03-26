/**
 * AuthService
 * 
 * A unified abstraction for managing authentication state and session data
 * across both client-side and server-side (SSR) environments.
 * 
 * This service replaces direct localStorage access with secure, environment-aware
 * cookie operations to ensure compatibility with Next.js App Router and 
 * prevent hydration mismatches.
 */

// Constants for session keys
export const AUTH_KEYS = {
  TOKEN: 'k-o-t',
  USER_ROLE: 'userRole',
  CURRENT_SPONSOR: 'currentSponsor',
  LAST_PATH: 'lastPath',
} as const;

export class AuthService {
  /**
   * Environment detection
   */
  private static isServer(): boolean {
    return typeof window === 'undefined';
  }

  /**
   * Internal helper to safely get server-side cookies
   */
  private static async getServerCookies() {
    if (!this.isServer()) return null;
    try {
      // In a real server environment, we would use:
      // const { cookies } = require('next/headers');
      // But to be completely safe against Webpack, we handle this in a separate server-only module.
      // This is a temporary workaround.
      return null;
    } catch (e) {
      console.error('Failed to access server cookies:', e);
      return null;
    }
  }

  /**
   * GET token (Server & Client aware)
   */
  static async getToken(): Promise<string | null> {
    if (this.isServer()) {
      const cookieStore = await this.getServerCookies();
      return cookieStore?.get(AUTH_KEYS.TOKEN)?.value || null;
    } else {
      return this.getClientCookie(AUTH_KEYS.TOKEN);
    }
  }

  /**
   * GET user role (Server & Client aware)
   */
  static async getUserRole(): Promise<string | null> {
    if (this.isServer()) {
      const cookieStore = await this.getServerCookies();
      return cookieStore?.get(AUTH_KEYS.USER_ROLE)?.value || null;
    } else {
      return this.getClientCookie(AUTH_KEYS.USER_ROLE);
    }
  }

  /**
   * SET token (Client side only)
   * Note: For server-side setting, use Next.js response headers or Server Actions
   */
  static setToken(token: string, days: number = 1): void {
    if (this.isServer()) return;
    this.setClientCookie(AUTH_KEYS.TOKEN, token, days);
  }

  /**
   * SET user role (Client side only)
   */
  static setUserRole(role: string, days: number = 1): void {
    if (this.isServer()) return;
    this.setClientCookie(AUTH_KEYS.USER_ROLE, role, days);
  }

  /**
   * SET current sponsor (Client side only)
   */
  static setCurrentSponsor(sponsorData: any, days: number = 1): void {
    if (this.isServer()) return;
    const encodedData = encodeURIComponent(JSON.stringify(sponsorData));
    this.setClientCookie(AUTH_KEYS.CURRENT_SPONSOR, encodedData, days);
  }

  /**
   * GET current sponsor (Server & Client aware)
   */
  static async getCurrentSponsor(): Promise<any | null> {
    let rawValue: string | null = null;
    
    if (this.isServer()) {
      const cookieStore = await this.getServerCookies();
      rawValue = cookieStore?.get(AUTH_KEYS.CURRENT_SPONSOR)?.value || null;
    } else {
      rawValue = this.getClientCookie(AUTH_KEYS.CURRENT_SPONSOR);
    }

    if (!rawValue) return null;
    try {
      return JSON.parse(decodeURIComponent(rawValue));
    } catch (e) {
      console.error('Failed to parse sponsor data from cookie', e);
      return null;
    }
  }

  /**
   * CLEAR all session data (Client side only)
   */
  static clearAll(): void {
    if (this.isServer()) return;
    
    const keys = Object.values(AUTH_KEYS);
    keys.forEach(key => {
      this.removeClientCookie(key);
    });

    // Also clear localStorage to be thorough during transition
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    localStorage.removeItem('lastActiveTime');
    localStorage.removeItem('lastPath');
    localStorage.removeItem('lastSponsor');
  }

  /**
   * Client-side cookie helpers
   */
  private static getClientCookie(name: string): string | null {
    if (this.isServer()) return null;
    
    const nameEQ = name + "=";
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) === ' ') c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
  }

  private static setClientCookie(name: string, value: string, days: number): void {
    if (this.isServer()) return;
    
    let expires = "";
    if (days) {
      const date = new Date();
      date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
      expires = "; expires=" + date.toUTCString();
    }
    document.cookie = `${name}=${value || ""}${expires}; path=/; SameSite=Lax`;
  }

  private static removeClientCookie(name: string): void {
    if (this.isServer()) return;
    document.cookie = `${name}=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT; SameSite=Lax`;
  }
}
