/**
 * @experimental Experiemtnal hook for handling async operations with loading, data, and error states
 * but implemtntation is probably not correct or makes any sense.
 */

'use client'

import { useCallback, useState } from 'react'

type LoadingState<T, E = Error> = {
	loading: boolean
	data: T | null
	error: E | null
	execute: () => Promise<void>
}

/**
 * A generic hook for handling async operations with loading, data, and error states
 * @template T The type of data that will be returned by the async function
 * @template E The type of error that can be thrown by the async function
 * @param asyncFunction The async function to execute
 * @returns LoadingState object containing loading status, data, error, and control functions
 */
export function useLoading<T>(
	asyncFunction: () => Promise<T>
): LoadingState<T> {
	const [loading, setLoading] = useState<boolean>(true)
	const [data, setData] = useState<T | null>(null)
	const [error, setError] = useState<Error | null>(null)

	const execute = useCallback(async (): Promise<void> => {
		setLoading(true)
		setError(null)
		try {
			const result = await asyncFunction()
			setData(result)
		} catch (err) {
			const error =
				err instanceof Error ? err : new Error('Unknown error')
			setError(error)
		} finally {
			setLoading(false)
		}
	}, [asyncFunction])

	return { loading, data, error, execute }
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
