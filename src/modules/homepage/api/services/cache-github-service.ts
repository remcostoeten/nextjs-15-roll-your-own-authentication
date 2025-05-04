const CACHE_DURATION = 1000 * 60 * 10

interface CacheItem<T> {
	data: T
	timestamp: number
}

const cache: Record<string, CacheItem<any>> = {}

function getCache<T>(key: string): T | null {
	const item = cache[key]
	if (!item) return null

	const now = Date.now()
	if (now - item.timestamp > CACHE_DURATION) {
		delete cache[key]
		return null
	}

	return item.data as T
}

function setCache<T>(key: string, data: T): void {
	cache[key] = {
		data,
		timestamp: Date.now()
	}
}

export { getCache, setCache }
