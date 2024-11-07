import { db } from '@/db'
import { analyticsPageViews } from '@/features/analytics/db'
import { getSession } from '@/features/auth/session'
import { isAdmin } from '@/shared/utilities/get-admin'
import { NextRequest } from 'next/server'

async function getGeoData(ip: string) {
	try {
		const response = await fetch(`http://ip-api.com/json/${ip}`)
		return await response.json()
	} catch {
		return null
	}
}

async function parseUserAgent(ua: string) {
	const browser =
		ua.match(
			/(chrome|safari|firefox|opera|msie|trident(?=\/))\/?\s*(\d+)/i
		) || []
	const os = ua.match(/(windows|mac|linux|android|ios|iphone|ipad)/i) || []
	const device = ua.match(/(mobile|tablet|desktop)/i) || []

	return {
		browser: browser[1] || 'unknown',
		browserVersion: browser[2] || 'unknown',
		os: os[1] || 'unknown',
		device: device[1] || 'desktop'
	}
}

export async function GET() {
	// Protect the GET endpoint
	const adminStatus = await isAdmin()

	if (!adminStatus) {
		return new Response('Unauthorized', { status: 403 })
	}

	try {
		// ... handle GET request ...
	} catch (error) {
		return new Response('Internal Server Error', { status: 500 })
	}
}

export async function POST(request: NextRequest) {
	try {
		const session = await getSession()
		const { pathname, domain, referrer, userAgent } = await request.json()

		// Allow page view tracking for all users
		// but protect the analytics viewing

		const ip =
			request.headers.get('x-forwarded-for')?.split(',')[0] ||
			request.headers.get('x-real-ip') ||
			'unknown'

		const geoData = await getGeoData(ip)
		const deviceInfo = await parseUserAgent(userAgent)

		await db.insert(analyticsPageViews).values({
			pathname,
			domain,
			referrer,
			userAgent,
			userId: session?.userId || null,
			sessionId: null,
			createdAt: new Date().toISOString(),
			// Additional metrics
			browser: deviceInfo.browser,
			browserVersion: deviceInfo.browserVersion,
			os: deviceInfo.os,
			device: deviceInfo.device,
			country: geoData?.country || null,
			city: geoData?.city || null,
			region: geoData?.regionName || null,
			timezone: geoData?.timezone || null,
			language: request.headers.get('accept-language') || null,
			screenSize: null,
			viewportSize: null,
			connectionType: request.headers.get('connection-type') || null
		})

		return new Response(null, { status: 201 })
	} catch (error) {
		console.error('Failed to track page view:', error)
		return new Response('Failed to track page view', { status: 500 })
	}
}
