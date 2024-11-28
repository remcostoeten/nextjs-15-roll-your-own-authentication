/**
 * @author Remco Stoeten
 * @description Creates a debounced function that delays its execution until after the wait period has elapsed since the last time it was invoked.
 */

export default function debounce<T extends (...args: any[]) => void>(
	func: T,
	wait: number
) {
	let timeout: NodeJS.Timeout
	return function (this: ThisParameterType<T>, ...args: Parameters<T>) {
		clearTimeout(timeout)
		timeout = setTimeout(() => func.apply(this, args), wait)
	}
}
