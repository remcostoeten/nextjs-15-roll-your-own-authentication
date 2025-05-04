import { useEffect, useCallback } from 'react'

type KeyboardShortcut = {
	key: string
	callback: () => void
	ctrlKey?: boolean
	altKey?: boolean
	shiftKey?: boolean
}

function useKeyboardShortcuts(shortcuts: KeyboardShortcut[]) {
	const handleKeyPress = useCallback(
		(event: KeyboardEvent) => {
			shortcuts.forEach(
				({ key, callback, ctrlKey, altKey, shiftKey }) => {
					if (
						event.key.toLowerCase() === key.toLowerCase() &&
						(!ctrlKey || event.ctrlKey) &&
						(!altKey || event.altKey) &&
						(!shiftKey || event.shiftKey)
					) {
						event.preventDefault()
						callback()
					}
				}
			)
		},
		[shortcuts]
	)

	useEffect(() => {
		window.addEventListener('keydown', handleKeyPress)
		return () => window.removeEventListener('keydown', handleKeyPress)
	}, [handleKeyPress])
}
