import serverCache from './server-cache';

interface TokenCache {
  token: string;
  expiresAt: number;
}

class TokenManager {
  private static instance: TokenManager;
  private retryCountMap: Map<string, number> = new Map();
  private readonly maxRetries: number = 3;

  private constructor() { }

  static getInstance(): TokenManager {
    if (!TokenManager.instance) {
      TokenManager.instance = new TokenManager();
    }
    return TokenManager.instance;
  }

  getToken(cacheKey: string): TokenCache | null {
    const cached = serverCache.get<TokenCache>(cacheKey);
    if (!cached) return null;

    // Check if token is expired
    if (Date.now() > cached.expiresAt) {
      this.clearToken(cacheKey);
      return null;
    }

    return cached;
  }

  setToken(cacheKey: string, token: string, expiresAt: number): void {
    serverCache.set(
      cacheKey,
      { token, expiresAt },
      Math.floor((expiresAt - Date.now()) / 1000) // TTL in seconds
    );
    this.retryCountMap.set(cacheKey, 0);
  }

  clearToken(cacheKey: string): void {
    serverCache.del(cacheKey);
    this.retryCountMap.set(cacheKey, 0);
  }

  incrementRetry(cacheKey: string): number {
    const currentCount = this.retryCountMap.get(cacheKey) || 0;
    const newCount = currentCount + 1;
    this.retryCountMap.set(cacheKey, newCount);
    return newCount;
  }

  getRetryCount(cacheKey: string): number {
    return this.retryCountMap.get(cacheKey) || 0;
  }

  getMaxRetries(): number {
    return this.maxRetries;
  }

  isTokenExpired(cacheKey: string): boolean {
    const cached = this.getToken(cacheKey);
    return !cached || Date.now() > cached.expiresAt;
  }

  getTimeToExpiry(cacheKey: string): number {
    const cached = this.getToken(cacheKey);
    if (!cached) return 0;
    return Math.max(0, cached.expiresAt - Date.now());
  }
}

export default TokenManager;
