'use server'

export async function isMobileDevice(
	userAgent: string | null
): Promise<boolean> {
	if (!userAgent) return false
	return /Mobile|Android|iP(hone|od|ad)/.test(userAgent)
}
