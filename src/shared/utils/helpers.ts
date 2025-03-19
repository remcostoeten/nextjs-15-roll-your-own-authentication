/**
 * Common helper utilities used across the application
 */

/**
 * Combines multiple class names into a single string, filtering out falsy values
 */
export function cn(...classes: (string | boolean | undefined | null)[]): string {
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
        day: 'numeric'
    }
): string {
    const date = typeof dateString === 'string' ? new Date(dateString) : dateString
    return new Intl.DateTimeFormat('en-US', options).format(date)
}

/**
 * Truncates a string to the specified length and adds an ellipsis
 */
export function truncateString(str: string, maxLength: number): string {
    if (str.length <= maxLength) return str
    return str.substring(0, maxLength) + '...'
}

/**
 * Capitalizes the first letter of a string
 */
export function capitalizeFirstLetter(string: string): string {
    if (!string) return string
    return string.charAt(0).toUpperCase() + string.slice(1)
}

/**
 * Generates a random string of the specified length
 */
export function generateRandomString(length: number): string {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    let result = ''
    const charactersLength = characters.length
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength))
    }
    return result
}

/**
 * Checks if the current environment is a browser
 */
export const isBrowser = typeof window !== 'undefined'

/**
 * Safely parses JSON with error handling
 */
export function safeJsonParse<T>(str: string, fallback: T): T {
    try {
        return JSON.parse(str) as T
    } catch (e) {
        return fallback
    }
}

/**
 * Creates a delay using promises
 */
export function delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
} 