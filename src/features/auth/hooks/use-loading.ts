/**
 * @description This hook manages the state of an asynchronous operation, including loading, data, and error states.
 * @author Remco Stoeten
 */

'use client'

import { useCallback, useState } from 'react'

export function useLoading<T>(asyncFunction: () => Promise<T>) {
	const [loading, setLoading] = useState(true)
	const [data, setData] = useState<T | null>(null)
	const [error, setError] = useState<Error | null>(null)

	const execute = useCallback(async () => {
		setLoading(true)
		try {
			const result = await asyncFunction()
			setData(result)
		} catch (err) {
			setError(err as Error)
		} finally {
			setLoading(false)
		}
	}, [asyncFunction])

	return { loading, data, error, execute }
}
