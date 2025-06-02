import type { TUtmParams } from '../types';

export function parseUtmParams(url: string): TUtmParams {
	try {
		const urlObj = new URL(url);
		const params = urlObj.searchParams;

		return {
			utmSource: params.get('utm_source') || undefined,
			utmMedium: params.get('utm_medium') || undefined,
			utmCampaign: params.get('utm_campaign') || undefined,
			utmTerm: params.get('utm_term') || undefined,
			utmContent: params.get('utm_content') || undefined,
		};
	} catch {
		return {};
	}
}

export function hasUtmParams(utmParams: TUtmParams): boolean {
	return Object.values(utmParams).some((value) => value !== undefined);
}
