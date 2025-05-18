import { cache } from 'react';

// Define a simple in-memory cache with expiration
const memoryCache: {
	[key: string]: {
		data: any;
		timestamp: number;
	};
} = {};

// Cache duration in milliseconds (e.g., 5 minutes)
const CACHE_DURATION = 5 * 60 * 1000;

/**
 * Enhanced caching function that includes time-based expiration
 * and persists between render cycles
 */
export function enhancedCache<T>(
	key: string,
	fetchFn: () => Promise<T>,
	duration: number = CACHE_DURATION
): () => Promise<T> {
	return cache(async () => {
		const now = Date.now();

		// Check if we have a valid cached response
		if (memoryCache[key] && memoryCache[key].timestamp + duration > now) {
			console.log(`Cache hit for ${key}`);
			return memoryCache[key].data;
		}

		// Otherwise, fetch fresh data
		console.log(`Cache miss for ${key}, fetching fresh data`);
		try {
			const data = await fetchFn();

			// Store in cache
			memoryCache[key] = {
				data,
				timestamp: now,
			};

			return data;
		} catch (error) {
			// If we get rate limited but have stale data, return that
			if (
				error instanceof Error &&
				error.message.includes('rate limit') &&
				memoryCache[key]
			) {
				console.log(`Rate limited, returning stale data for ${key}`);
				return memoryCache[key].data;
			}

			throw error;
		}
	});
}
