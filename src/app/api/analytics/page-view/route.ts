import { db } from '@/db'
import { analyticsPageViews } from '@/features/analytics/db'
import { getSession } from '@/features/auth/session'
import { isAdmin } from '@/shared/utilities/get-admin'
import { NextRequest } from 'next/server'

/**
 * Represents the structure of geolocation data from IP-API
 */
type GeoData = {
	country: string | null
	city: string | null
	regionName: string | null
	timezone: string | null
}

/**
 * Represents the parsed user agent information
 */
type UserAgentInfo = {
	browser: string
	browserVersion: string
	os: string
	device: string
}

/**
 * Represents the required fields for a page view event
 */
type PageViewPayload = {
	pathname: string
	domain: string
	referrer: string
	userAgent: string
}

/**
 * Custom error type for geo data fetching
 */
type GeoError = {
	message: string
	status?: number
}

/**
 * Fetches geolocation data for a given IP address
 * @param ip - The IP address to lookup
 * @returns Promise<GeoData | null> - Geolocation data or null if the request fails
 */
async function getGeoData(ip: string): Promise<GeoData | null> {
	try {
		const response = await fetch(`http://ip-api.com/json/${ip}`)
		if (!response.ok) {
			throw new Error(
				`Failed to fetch geo data: ${response.statusText}`
			) as GeoError
		}
		const data = await response.json()
		return {
			country: data.country || null,
			city: data.city || null,
			regionName: data.regionName || null,
			timezone: data.timezone || null
		}
	} catch (error) {
		const err = error as GeoError
		console.error('Error fetching geo data:', err.message)
		return null
	}
}

/**
 * Parses user agent string to extract browser, OS, and device information
 * @param ua - User agent string to parse
 * @returns UserAgentInfo - Parsed user agent information
 */
function parseUserAgent(ua: string): UserAgentInfo {
	const browser =
		ua.match(
			/(chrome|safari|firefox|opera|msie|trident(?=\/))\/?\s*(\d+)/i
		) || []
	const os = ua.match(/(windows|mac|linux|android|ios|iphone|ipad)/i) || []
	const device = ua.match(/(mobile|tablet|desktop)/i) || []

	return {
		browser: browser[1]?.toLowerCase() || 'unknown',
		browserVersion: browser[2] || 'unknown',
		os: os[1]?.toLowerCase() || 'unknown',
		device: device[1]?.toLowerCase() || 'desktop'
	}
}

/**
 * Validates the page view payload
 * @param payload - The payload to validate
 * @returns boolean - Whether the payload is valid
 */
function isValidPageViewPayload(payload: unknown): payload is PageViewPayload {
	if (!payload || typeof payload !== 'object') return false

	const payloadObject = payload as Record<string, unknown>

	const requiredFields: (keyof PageViewPayload)[] = [
		'pathname',
		'domain',
		'referrer',
		'userAgent'
	]
	return requiredFields.every(
		(field) =>
			field in payloadObject && typeof payloadObject[field] === 'string'
	)
}

/**
 * GET handler for analytics data
 * Protected endpoint that requires admin access
 */
export async function GET() {
	const adminStatus = await isAdmin()

	if (!adminStatus) {
		return new Response('Unauthorized', { status: 403 })
	}

	try {
		const pageViews = await db
			.select()
			.from(analyticsPageViews)
			.orderBy(analyticsPageViews.createdAt)

		return new Response(JSON.stringify(pageViews), {
			status: 200,
			headers: {
				'Content-Type': 'application/json'
			}
		})
	} catch (error) {
		console.error('Failed to fetch analytics:', error)
		return new Response('Internal Server Error', { status: 500 })
	}
}

/**
 * POST handler for analytics data
 * Protected endpoint that requires admin access
 */
export async function POST(request: NextRequest) {
	try {
		const session = await getSession()
		const payload = await request.json()

		if (!isValidPageViewPayload(payload)) {
			return new Response('Invalid payload', { status: 400 })
		}

		const { pathname, domain, referrer, userAgent } = payload
		const deviceInfo = parseUserAgent(userAgent)
		const geoData = await getGeoData(
			request.headers.get('x-forwarded-for')?.split(',')[0] ||
				request.headers.get('x-real-ip') ||
				'unknown'
		)

		await db.insert(analyticsPageViews).values({
			path: pathname,
			domain: domain,
			created_at: new Date().toISOString(),
			user_id: session?.userId || null,
			user_agent: userAgent,
			referrer_url: referrer,
			browser_name: deviceInfo.browser,
			browser_version: deviceInfo.browserVersion,
			operating_system: deviceInfo.os,
			device_type: deviceInfo.device,
			country: geoData?.country || null,
			city: geoData?.city || null,
			region: geoData?.regionName || null,
			timezone: geoData?.timezone || null
		})

		return new Response(null, { status: 201 })
	} catch (error) {
		console.error('Failed to track page view:', error)
		return new Response('Failed to track page view', { status: 500 })
	}
}
