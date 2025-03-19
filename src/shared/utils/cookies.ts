type CookieOptions = {
	maxAge?: number
	expires?: Date
	path?: string
	domain?: string
	secure?: boolean
	sameSite?: 'strict' | 'lax' | 'none'
	httpOnly?: boolean
}

/**
 * Get a cookie value
 */
export function getCookie(name: string): string | undefined {
	if (typeof window === 'undefined') {
		return undefined // Server-side, use environment variable fallback
	}

	const cookies = document.cookie.split('; ')
	const cookie = cookies.find((c) => c.startsWith(name + '='))

	if (!cookie) {
		return undefined
	}

	return decodeURIComponent(cookie.split('=')[1])
}

/**
 * Set a cookie
 */
export function setCookie(
	name: string,
	value: string,
	options: CookieOptions = {}
): void {
	if (typeof window === 'undefined') {
		return // Server-side, no cookies
	}

	const {
		maxAge,
		expires,
		path = '/',
		domain,
		secure,
		sameSite = 'lax',
		httpOnly = false,
	} = options

	let cookieString = `${encodeURIComponent(name)}=${encodeURIComponent(value)}`

	if (maxAge) cookieString += `; Max-Age=${maxAge}`
	if (expires) cookieString += `; Expires=${expires.toUTCString()}`
	if (path) cookieString += `; Path=${path}`
	if (domain) cookieString += `; Domain=${domain}`
	if (secure) cookieString += `; Secure`
	if (sameSite) cookieString += `; SameSite=${sameSite}`
	if (httpOnly) cookieString += `; HttpOnly`

	document.cookie = cookieString
}

/**
 * Delete a cookie
 */
export function deleteCookie(name: string, path = '/'): void {
	if (typeof window === 'undefined') {
		return // Server-side, no cookies
	}

	document.cookie = `${encodeURIComponent(name)}=; Path=${path}; Expires=Thu, 01 Jan 1970 00:00:01 GMT;`
}

/**
 * Get all cookies as an object
 */
export function getAllCookies(): Record<string, string> {
	if (typeof window === 'undefined') {
		return {} // Server-side, no cookies
	}

	return document.cookie
		.split('; ')
		.reduce((acc: Record<string, string>, cookie) => {
			if (cookie) {
				const [name, value] = cookie.split('=')
				acc[decodeURIComponent(name)] = decodeURIComponent(value)
			}
			return acc
		}, {})
}
