type DateFormat = 'long' | 'short' | 'relative'

export function formatDate(
	date: Date | null | undefined,
	format: DateFormat = 'short'
): string {
	if (!date) return 'N/A'

	const now = new Date()
	const target = new Date(date)

	if (format === 'relative') {
		const diff = now.getTime() - target.getTime()
		const minutes = Math.floor(diff / 60000)
		const hours = Math.floor(minutes / 60)
		const days = Math.floor(hours / 24)

		if (minutes < 1) return 'Just now'
		if (minutes < 60) return `${minutes}m ago`
		if (hours < 24) return `${hours}h ago`
		if (days < 7) return `${days}d ago`
	}

	if (format === 'long') {
		return target.toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'long',
			day: 'numeric',
			hour: '2-digit',
			minute: '2-digit'
		})
	}

	return target.toLocaleDateString('en-US', {
		year: 'numeric',
		month: 'short',
		day: 'numeric'
	})
}
