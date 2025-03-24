import { NextResponse } from 'next/server'
import { getGeolocationFromIP, extractIPFromRequest } from '@/lib/geolocation/server-geolocation'

export async function GET(request: Request) {
	try {
		// Extract IP from request headers
		const ip = extractIPFromRequest(request)

		// Get geolocation data
		const geoData = await getGeolocationFromIP(ip)

		return NextResponse.json(geoData)
	} catch (error) {
		console.error('Error in geolocation API:', error)
		return NextResponse.json({ error: 'Failed to get geolocation data' }, { status: 500 })
	}
}
