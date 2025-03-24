export function formatDate(dateString: string): string {
	const date = new Date(dateString)
	return date.toLocaleString('en-US', {
		month: 'long',
		day: 'numeric',
		year: 'numeric',
		hour: '2-digit',
		minute: '2-digit',
		second: '2-digit',
		timeZoneName: 'short',
	})
}

/**
 * Calculate relative time (e.g., "3 days ago")
 */
export function getRelativeTime(dateString: string): string {
	const date = new Date(dateString)
	const now = new Date()
	const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

	if (diffInSeconds < 60) return `${diffInSeconds} seconds ago`
	if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`
	if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`
	if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)} days ago`
	if (diffInSeconds < 31536000) return `${Math.floor(diffInSeconds / 2592000)} months ago`
	return `${Math.floor(diffInSeconds / 31536000)} years ago`
}

/**
 * Format commit message to extract title and description
 */
export function formatCommitMessage(message: string): { title: string; description: string[] } {
	const lines = message.split('\n').filter((line) => line.trim() !== '')
	const title = lines[0]
	const description = lines.slice(1).map((line) => line.trim())
	return { title, description }
}
