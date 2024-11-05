'use client'

import { useCallback, useState } from 'react'

type LoadingState<T> = {
	loading: boolean
	data: T | null
	error: Error | null
	execute: () => Promise<T | void>
	reset: () => void
}

/**
 * A generic hook for handling async operations with loading, data, and error states
 * @template T The type of data that will be returned by the async function
 * @param asyncFunction The async function to execute
 * @returns LoadingState object containing loading status, data, error, and control functions
 */
export function useLoading<T>(
	asyncFunction: () => Promise<T>
): LoadingState<T> {
	const [loading, setLoading] = useState(false)
	const [data, setData] = useState<T | null>(null)
	const [error, setError] = useState<Error | null>(null)

	const reset = useCallback(() => {
		setLoading(false)
		setData(null)
		setError(null)
	}, [])

	const execute = useCallback(async () => {
		try {
			setLoading(true)
			setError(null)
			const result = await asyncFunction()
			setData(result)
			return result
		} catch (err) {
			const error =
				err instanceof Error ? err : new Error('An error occurred')
			setError(error)
			throw error
		} finally {
			setLoading(false)
		}
	}, [asyncFunction])

	return { loading, data, error, execute, reset }
}
/*
 * @example
 * ```typescript
 * const { loading, data, error, execute } = useLoading(async () => {
 *   const response = await fetch('/api/data');
 *   return response.json();
 * });
 *
 * useEffect(() => {
 *   execute();
 * }, [execute]);
 * */
