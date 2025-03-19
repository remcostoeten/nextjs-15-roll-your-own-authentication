/**
 * Common helper utilities used across the application
 */

/**
 * Combines multiple class names into a single string, filtering out falsy values
 */
export function cn(
	...classes: (string | boolean | undefined | null)[]
): string {
	return classes.filter(Boolean).join(' ')
}

/**
 * Creates a debounced function that delays invoking the provided function
 * until after the specified wait time has elapsed since the last time it was invoked.
 */
export function debounce<T extends (...args: any[]) => any>(
	func: T,
	wait: number
): (...args: Parameters<T>) => void {
	let timeout: ReturnType<typeof setTimeout> | null = null

	return function (this: any, ...args: Parameters<T>) {
		const context = this

		if (timeout) clearTimeout(timeout)

		timeout = setTimeout(() => {
			timeout = null
			func.apply(context, args)
		}, wait)
	}
}

/**
 * Formats a date string into a human-readable format
 */
export function formatDate(
	dateString: string | Date,
	options: Intl.DateTimeFormatOptions = {
		year: 'numeric',
		month: 'long',
		day: 'numeric',
	}
): string {
	const date =
		typeof dateString === 'string' ? new Date(dateString) : dateString
	return new Intl.DateTimeFormat('en-US', options).format(date)
}

/**
 * Truncates a string to the specified length and adds an ellipsis
 */
export function truncateString(str: string, maxLength: number): string {
	if (str.length <= maxLength) return str
	return str.substring(0, maxLength) + '...'
}
