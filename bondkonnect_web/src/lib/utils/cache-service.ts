
export interface CacheEntry<T> {
    data: T;
    expiresAt: number;
}

export class CacheService {
    private static instance: CacheService;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private cache: Map<string, CacheEntry<any>>;

    private constructor() {
        this.cache = new Map();
    }

    static getInstance(): CacheService {
        if (!CacheService.instance) {
            CacheService.instance = new CacheService();
        }
        return CacheService.instance;
    }

    set<T>(key: string, data: T, ttlMinutes: number): void {
        this.cache.set(key, {
            data,
            expiresAt: Date.now() + ttlMinutes * 60 * 1000,
        });
    }

    get<T>(key: string): T | null {
        const entry = this.cache.get(key);
        if (!entry) return null;

        if (Date.now() > entry.expiresAt) {
            this.cache.delete(key);
            return null;
        }

        return entry.data;
    }

    delete(key: string): void {
        this.cache.delete(key);
    }

    clear(): void {
        this.cache.clear();
    }

    isExpired(key: string): boolean {
        const entry = this.cache.get(key);
        if (!entry) return true;
        return Date.now() > entry.expiresAt;
    }

    getTimeToExpiry(key: string): number {
        const entry = this.cache.get(key);
        if (!entry) return 0;
        return Math.max(0, entry.expiresAt - Date.now());
    }
}
