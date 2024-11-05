'use client'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

type Shortcut = {
	key: string
	href: string
}

export default function useKeyboardShortcuts({
	shortcuts
}: {
	shortcuts: Shortcut[]
}) {
	const router = useRouter()

	useEffect(() => {
		function handleKeyDown(event: KeyboardEvent) {
			const shortcut = shortcuts.find(
				(s) =>
					event.key.toLowerCase() === s.key.toLowerCase() &&
					(event.metaKey || event.ctrlKey)
			)

			if (shortcut) {
				event.preventDefault()
				router.push(shortcut.href)
			}
		}

		window.addEventListener('keydown', handleKeyDown)
		return () => window.removeEventListener('keydown', handleKeyDown)
	}, [shortcuts, router])
}
