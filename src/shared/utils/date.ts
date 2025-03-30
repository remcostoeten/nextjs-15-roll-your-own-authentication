export function formatDate(dateString: string): string {
    try {
        const date = new Date(dateString)
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        })
    } catch (e) {
        return dateString
    }
}

export function getRelativeTime(dateString: string): string {
    try {
        const date = new Date(dateString)
        const now = new Date()
        const diff = now.getTime() - date.getTime()

        const seconds = Math.floor(diff / 1000)
        const minutes = Math.floor(seconds / 60)
        const hours = Math.floor(minutes / 60)
        const days = Math.floor(hours / 24)
        const months = Math.floor(days / 30)
        const years = Math.floor(months / 12)

        if (years > 0) return `${years} year${years === 1 ? '' : 's'} ago`
        if (months > 0) return `${months} month${months === 1 ? '' : 's'} ago`
        if (days > 0) return `${days} day${days === 1 ? '' : 's'} ago`
        if (hours > 0) return `${hours} hour${hours === 1 ? '' : 's'} ago`
        if (minutes > 0) return `${minutes} minute${minutes === 1 ? '' : 's'} ago`
        return `${seconds} second${seconds === 1 ? '' : 's'} ago`
    } catch (e) {
        return 'Invalid date'
    }
}

export function formatCommitMessage(message: string): { title: string; description: string[] } {
    const lines = message.split('\n').map(line => line.trim())
    const title = lines[0]
    const description = lines.slice(2).filter(line => line.length > 0)

    return { title, description }
} 