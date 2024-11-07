'use client'

import { useEffect } from 'react'

type ShortcutConfig = {
	key: string
	action: () => void
	enabled?: boolean
}

type KeyboardShortcutProps = {
	shortcuts: ShortcutConfig[]
}

export default function useKeyboardShortcut({
	shortcuts
}: KeyboardShortcutProps) {
	useEffect(() => {
		const handleKeyPress = (event: KeyboardEvent) => {
			const key = event.key.toLowerCase()

			shortcuts.forEach((shortcut) => {
				if (
					shortcut.key.toLowerCase() === key &&
					shortcut.enabled !== false &&
					!event.repeat &&
					!event.ctrlKey &&
					!event.altKey &&
					!event.metaKey &&
					!event.shiftKey
				) {
					event.preventDefault()
					shortcut.action()
				}
			})
		}

		window.addEventListener('keydown', handleKeyPress)
		return () => window.removeEventListener('keydown', handleKeyPress)
	}, [shortcuts])
}
