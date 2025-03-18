export type RateLimitConfig = {
    windowMs: number;  // Time window in milliseconds
    maxRequests: number;  // Maximum number of requests allowed in the window
};

export type RateLimitInfo = {
    remaining: number;  // Remaining requests in current window
    reset: number;     // Timestamp when the current window resets
};

export type RateLimiter = {
    checkLimit: (key: string) => Promise<RateLimitInfo>;
    consumeToken: (key: string) => Promise<boolean>;
};

export const createRateLimiter = (config: RateLimitConfig): RateLimiter => {
    const requests = new Map<string, { timestamps: number[] }>();

    const cleanup = (key: string): void => {
        const now = Date.now();
        const windowStart = now - config.windowMs;

        const record = requests.get(key);
        if (record) {
            record.timestamps = record.timestamps.filter(timestamp => timestamp > windowStart);
            if (record.timestamps.length === 0) {
                requests.delete(key);
            }
        }
    };

    const checkLimit = async (key: string): Promise<RateLimitInfo> => {
        cleanup(key);

        const now = Date.now();
        const record = requests.get(key) || { timestamps: [] };

        const remaining = Math.max(0, config.maxRequests - record.timestamps.length);
        const reset = Math.max(...record.timestamps, now) + config.windowMs;

        return { remaining, reset };
    };

    return {
        checkLimit,
        consumeToken: async (key: string): Promise<boolean> => {
            const { remaining } = await checkLimit(key);

            if (remaining === 0) {
                return false;
            }

            const record = requests.get(key) || { timestamps: [] };
            record.timestamps.push(Date.now());
            requests.set(key, record);

            return true;
        },
    };
};

// Create rate limiters with different configurations
export const apiRateLimiter = createRateLimiter({
    windowMs: 60 * 1000,  // 1 minute
    maxRequests: 60       // 60 requests per minute
});

export const authRateLimiter = createRateLimiter({
    windowMs: 15 * 60 * 1000,  // 15 minutes
    maxRequests: 5             // 5 attempts per 15 minutes
}); 