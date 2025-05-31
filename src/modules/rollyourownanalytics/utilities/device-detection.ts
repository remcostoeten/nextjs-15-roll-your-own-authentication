import type { TDeviceInfo } from '../types';

export function getDeviceInfo(): TDeviceInfo {
	if (typeof window === 'undefined') {
		return {
			device: 'desktop',
			browser: 'unknown',
			os: 'unknown',
			screenWidth: 0,
			screenHeight: 0,
			viewportWidth: 0,
			viewportHeight: 0,
		};
	}

	const userAgent = navigator.userAgent;

	const device = getDeviceType(userAgent);
	const browser = getBrowser(userAgent);
	const os = getOperatingSystem(userAgent);

	return {
		device,
		browser,
		os,
		screenWidth: screen.width,
		screenHeight: screen.height,
		viewportWidth: window.innerWidth,
		viewportHeight: window.innerHeight,
	};
}

function getDeviceType(userAgent: string): 'desktop' | 'mobile' | 'tablet' {
	if (/tablet|ipad|playbook|silk/i.test(userAgent)) {
		return 'tablet';
	}
	if (
		/mobile|iphone|ipod|android|blackberry|opera|mini|windows\sce|palm|smartphone|iemobile/i.test(
			userAgent
		)
	) {
		return 'mobile';
	}
	return 'desktop';
}

function getBrowser(userAgent: string): string {
	if (userAgent.includes('Firefox')) return 'Firefox';
	if (userAgent.includes('Chrome') && !userAgent.includes('Chromium')) return 'Chrome';
	if (userAgent.includes('Safari') && !userAgent.includes('Chrome')) return 'Safari';
	if (userAgent.includes('Edge')) return 'Edge';
	if (userAgent.includes('Opera')) return 'Opera';
	if (userAgent.includes('Chromium')) return 'Chromium';
	return 'Unknown';
}

function getOperatingSystem(userAgent: string): string {
	if (userAgent.includes('Windows NT 10.0')) return 'Windows 10';
	if (userAgent.includes('Windows NT 6.3')) return 'Windows 8.1';
	if (userAgent.includes('Windows NT 6.2')) return 'Windows 8';
	if (userAgent.includes('Windows NT 6.1')) return 'Windows 7';
	if (userAgent.includes('Windows NT')) return 'Windows';
	if (userAgent.includes('Mac OS X')) return 'macOS';
	if (userAgent.includes('Android')) return 'Android';
	if (userAgent.includes('iPhone')) return 'iOS';
	if (userAgent.includes('iPad')) return 'iPadOS';
	if (userAgent.includes('Linux')) return 'Linux';
	return 'Unknown';
}

// src/modules/rollyourownanalytics/lib/geo-location.ts

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
