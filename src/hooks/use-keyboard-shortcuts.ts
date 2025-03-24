'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export function useKeyboardShortcuts() {
	const router = useRouter()

	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			// Ctrl+L shortcut for login
			if ((e.ctrlKey || e.metaKey) && e.key === 'l') {
				e.preventDefault()
				router.push('/login')
			}
		}

		window.addEventListener('keydown', handleKeyDown)
		return () => window.removeEventListener('keydown', handleKeyDown)
	}, [router])
}
