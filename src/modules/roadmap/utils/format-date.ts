export function formatDate(dateString: string): string {
	const date = new Date(dateString)
	return new Intl.DateTimeFormat('en-US', {
		year: 'numeric',
		month: 'short',
		day: 'numeric',
	}).format(date)
}

export function formatRelativeTime(dateString: string): string {
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
