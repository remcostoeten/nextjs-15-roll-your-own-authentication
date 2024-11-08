'use client'

import { useCallback, useEffect, useRef } from 'react'

type ModifierKey = 'ctrl' | 'alt' | 'shift' | 'meta'
type KeyCombo = {
	key: string
	modifiers?: ModifierKey[]
}

type ShortcutConfig = {
	combo: KeyCombo
	action: () => void
	enabled?: boolean
	preventDefault?: boolean
}

export default function useKeyboardShortcut(shortcuts: ShortcutConfig[]) {
	const activeShortcuts = useRef<ShortcutConfig[]>(shortcuts)

	const handleKeyPress = useCallback((event: KeyboardEvent) => {
		if (!Array.isArray(activeShortcuts.current)) return

		const matchingShortcut = activeShortcuts.current.find((shortcut) => {
			if (shortcut.enabled === false) return false

			const modifiersMatch =
				shortcut.combo.modifiers?.every(
					(mod) => event[`${mod}Key`] as boolean
				) ?? true

			return (
				modifiersMatch &&
				event.key.toLowerCase() === shortcut.combo.key.toLowerCase()
			)
		})

		if (matchingShortcut) {
			if (matchingShortcut.preventDefault) {
				event.preventDefault()
			}
			matchingShortcut.action()
		}
	}, [])

	useEffect(() => {
		activeShortcuts.current = shortcuts
	}, [shortcuts])

	useEffect(() => {
		window.addEventListener('keydown', handleKeyPress)
		return () => window.removeEventListener('keydown', handleKeyPress)
	}, [handleKeyPress])
}

// @author @remcosoteten
