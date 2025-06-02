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
