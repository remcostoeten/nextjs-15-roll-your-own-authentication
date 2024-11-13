export async function getBrowserInfo(
	userAgent: string | null
): Promise<string> {
	if (!userAgent) return 'unknown'

	if (userAgent.includes('Firefox')) return 'Firefox'
	if (userAgent.includes('Chrome')) return 'Chrome'
	if (userAgent.includes('Safari')) return 'Safari'
	if (userAgent.includes('Edge')) return 'Edge'
	if (userAgent.includes('Opera')) return 'Opera'

	return 'unknown'
}
