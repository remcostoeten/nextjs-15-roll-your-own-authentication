'use client'

import { useEffect, useCallback } from 'react'

type KeyCombo = {
  key: string
  ctrl?: boolean
  shift?: boolean
  alt?: boolean
  meta?: boolean
}

export function useKeyboardShortcut(
  keyCombo: KeyCombo | KeyCombo[],
  callback: () => void,
  options: { 
    preventDefault?: boolean 
    enabled?: boolean
  } = {}
) {
  const { preventDefault = true, enabled = true } = options

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      const combos = Array.isArray(keyCombo) ? keyCombo : [keyCombo]
      
      const matchesCombo = combos.some(combo => {
        const keyMatch = event.key.toLowerCase() === combo.key.toLowerCase()
        const ctrlMatch = !!combo.ctrl === event.ctrlKey
        const shiftMatch = !!combo.shift === event.shiftKey
        const altMatch = !!combo.alt === event.altKey
        const metaMatch = !!combo.meta === event.metaKey

        return keyMatch && ctrlMatch && shiftMatch && altMatch && metaMatch
      })

      if (matchesCombo && enabled) {
        if (preventDefault) {
          event.preventDefault()
        }
        callback()
      }
    },
    [callback, enabled, keyCombo, preventDefault]
  )

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])
} 