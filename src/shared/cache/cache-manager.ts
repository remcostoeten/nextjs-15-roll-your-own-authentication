export type CacheStorage = {
    get: <T>(key: string) => Promise<T | null>;
    set: <T>(key: string, value: T, ttl?: number) => Promise<void>;
    delete: (key: string) => Promise<void>;
    clear: () => Promise<void>;
};

export const createMemoryStorage = (): CacheStorage => {
    const cache = new Map<string, { value: unknown; expires?: number }>();

    return {
        get: async <T>(key: string): Promise<T | null> => {
            const item = cache.get(key);
            if (!item) return null;

            if (item.expires && item.expires < Date.now()) {
                cache.delete(key);
                return null;
            }

            return item.value as T;
        },

        set: async <T>(key: string, value: T, ttl?: number): Promise<void> => {
            cache.set(key, {
                value,
                expires: ttl ? Date.now() + ttl : undefined,
            });
        },

        delete: async (key: string): Promise<void> => {
            cache.delete(key);
        },

        clear: async (): Promise<void> => {
            cache.clear();
        },
    };
};

export const createLocalStorageCache = (): CacheStorage => {
    return {
        get: async <T>(key: string): Promise<T | null> => {
            if (typeof window === 'undefined') return null;

            const item = localStorage.getItem(key);
            if (!item) return null;

            const { value, expires } = JSON.parse(item);
            if (expires && expires < Date.now()) {
                localStorage.removeItem(key);
                return null;
            }

            return value as T;
        },

        set: async <T>(key: string, value: T, ttl?: number): Promise<void> => {
            if (typeof window === 'undefined') return;

            localStorage.setItem(
                key,
                JSON.stringify({
                    value,
                    expires: ttl ? Date.now() + ttl : undefined,
                })
            );
        },

        delete: async (key: string): Promise<void> => {
            if (typeof window === 'undefined') return;
            localStorage.removeItem(key);
        },

        clear: async (): Promise<void> => {
            if (typeof window === 'undefined') return;
            localStorage.clear();
        },
    };
};

export type CacheManager = CacheStorage & {
    getStorage: () => CacheStorage;
};

let cacheManagerInstance: CacheManager | null = null;

export const createCacheManager = (storage: CacheStorage = createMemoryStorage()): CacheManager => {
    if (cacheManagerInstance) {
        return cacheManagerInstance;
    }

    cacheManagerInstance = {
        ...storage,
        getStorage: () => storage,
    };

    return cacheManagerInstance;
};

// Export instances with different storage strategies
export const memoryCache = createCacheManager(createMemoryStorage());
export const localStorageCache = createCacheManager(createLocalStorageCache()); 