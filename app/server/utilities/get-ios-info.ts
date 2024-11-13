export async function getOSInfo(userAgent: string | null): Promise<string> {
	if (!userAgent) return 'unknown'
	if (userAgent.includes('Windows')) return 'Windows'
	if (userAgent.includes('Mac OS')) return 'MacOS'
	if (userAgent.includes('Linux')) return 'Linux'
	if (userAgent.includes('Android')) return 'Android'
	if (userAgent.includes('iOS')) return 'iOS'

	return 'unknown'
}
