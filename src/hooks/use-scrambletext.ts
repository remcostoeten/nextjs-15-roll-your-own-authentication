'use client'

import { useState, useRef, useCallback, useEffect } from 'react'

const CHARS =
	'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789?!@#$%^&*()'
const SCRAMBLE_SPEED_MS = 50 // How often characters change
const REVEAL_DELAY_MS = 60 // Delay between revealing each character

export function useScrambleText(text: string) {
	const [displayText, setDisplayText] = useState(text)
	const intervalRef = useRef<NodeJS.Timeout | null>(null)
	const timeoutRef = useRef<NodeJS.Timeout | null>(null)
	const revealedChars = useRef<number>(0)
	const isScrambling = useRef<boolean>(false)

	const clearTimers = useCallback(() => {
		if (intervalRef.current) clearInterval(intervalRef.current)
		if (timeoutRef.current) clearTimeout(timeoutRef.current)
		intervalRef.current = null
		timeoutRef.current = null
		isScrambling.current = false
	}, [])

	const scramble = useCallback(() => {
		if (isScrambling.current) return
		isScrambling.current = true
		revealedChars.current = 0
		clearTimers()

		intervalRef.current = setInterval(() => {
			setDisplayText((prev) => {
				let scrambled = ''
				for (let i = 0; i < text.length; i++) {
					if (i < revealedChars.current) {
						scrambled += text[i]
					} else {
						scrambled +=
							CHARS[Math.floor(Math.random() * CHARS.length)]
					}
				}
				return scrambled
			})

			if (revealedChars.current < text.length) {
				timeoutRef.current = setTimeout(() => {
					revealedChars.current++
				}, REVEAL_DELAY_MS)
			} else {
				clearTimers()
				setDisplayText(text)
				isScrambling.current = false
			}
		}, SCRAMBLE_SPEED_MS)
	}, [text, clearTimers])

	const reset = useCallback(() => {
		clearTimers()
		setDisplayText(text)
		isScrambling.current = false
	}, [text, clearTimers])

	useEffect(() => {
		return () => clearTimers()
	}, [clearTimers])

	return {
		displayText,
		scramble,
		reset
	}
}
