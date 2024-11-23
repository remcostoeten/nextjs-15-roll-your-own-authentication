'use client'

import { showToast } from '@/lib/toast'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function useAvatarUpload() {
	const [isLoading, setIsLoading] = useState(false)
	const [error, setError] = useState<string | null>(null)
	const router = useRouter()

	const handleImageChange = async (
		e: React.ChangeEvent<HTMLInputElement>
	) => {
		const file = e.target.files?.[0]
		if (!file) return

		setIsLoading(true)
		setError(null)

		const formData = new FormData()
		formData.append('file', file)

		try {
			const response = await fetch('/api/upload', {
				method: 'POST',
				body: formData
			})

			const data = await response.json()

			if (!response.ok) {
				throw new Error(data.error || 'Failed to upload image')
			}

			showToast.success('Avatar updated successfully!')
			router.refresh()
			return data.url
		} catch (err) {
			const message =
				err instanceof Error ? err.message : 'Failed to upload image'
			setError(message)
			showToast.error(message)
			return null
		} finally {
			setIsLoading(false)
		}
	}

	return {
		handleImageChange,
		isLoading,
		error
	}
}
