import type { TGeoLocation } from '../types';

export async function getGeoLocation(request: Request): Promise<TGeoLocation> {
	try {
		// Try to get location from Vercel headers first
		const country = request.headers.get('x-vercel-ip-country');
		const city = request.headers.get('x-vercel-ip-city');
		const region = request.headers.get('x-vercel-ip-country-region');
		const timezone = request.headers.get('x-vercel-ip-timezone');

		if (country) {
			return {
				country: decodeURIComponent(country),
				city: city ? decodeURIComponent(city) : undefined,
				region: region ? decodeURIComponent(region) : undefined,
				timezone: timezone ? decodeURIComponent(timezone) : undefined,
			};
		}

		// Fallback to IP-based geolocation
		const ip = getClientIp(request);
		if (ip && ip !== '127.0.0.1' && ip !== '::1') {
			return await getLocationFromIp(ip);
		}

		return {};
	} catch (error) {
		console.error('Error getting geo location:', error);
		return {};
	}
}

function getClientIp(request: Request): string | null {
	const xForwardedFor = request.headers.get('x-forwarded-for');
	if (xForwardedFor) {
		return xForwardedFor.split(',')[0].trim();
	}

	const xRealIp = request.headers.get('x-real-ip');
	if (xRealIp) {
		return xRealIp;
	}

	return null;
}

async function getLocationFromIp(ip: string): Promise<TGeoLocation> {
	// This is a simple implementation using a free IP geolocation service
	// In production, you might want to use a more reliable service or local database
	try {
		const response = await fetch(
			`http://ip-api.com/json/${ip}?fields=status,country,regionName,city,timezone`
		);
		const data = await response.json();

		if (data.status === 'success') {
			return {
				country: data.country,
				city: data.city,
				region: data.regionName,
				timezone: data.timezone,
			};
		}
	} catch (error) {
		console.error('Error fetching IP location:', error);
	}

	return {};
}
