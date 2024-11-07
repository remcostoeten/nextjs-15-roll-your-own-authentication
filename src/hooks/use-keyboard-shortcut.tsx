'use client'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

type Shortcut = {
	key: string
	href: string
}

type KeyboardShortcutProps = {
	shortcuts: Shortcut[]
}

export default function useKeyboardShortcut({
	shortcuts
}: KeyboardShortcutProps) {
	const router = useRouter()

	useEffect(() => {
		const handleKeyDown = (event: KeyboardEvent) => {
			// Ignore shortcuts if focused on input elements
			if (
				document.activeElement?.tagName === 'INPUT' ||
				document.activeElement?.tagName === 'TEXTAREA' ||
				document.activeElement?.getAttribute('contenteditable') ===
					'true'
			) {
				return
			}

			const shortcut = shortcuts.find(
				(s) => s.key.toLowerCase() === event.key.toLowerCase()
			)

			if (shortcut && (event.metaKey || event.ctrlKey)) {
				event.preventDefault()
				router.push(shortcut.href)
			}
		}

		window.addEventListener('keydown', handleKeyDown)
		return () => window.removeEventListener('keydown', handleKeyDown)
	}, [shortcuts, router])
}
