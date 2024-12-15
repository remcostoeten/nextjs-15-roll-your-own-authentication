'use client'

import { useState, useEffect } from 'react'
import { createCustomTheme, SUPABASE_GREEN } from '@/lib/themes'

export type UseThemeAccentReturn = {
	accentColor: string
	setAccentColor: (color: string) => void
	resetToDefault: () => void
}

export const useThemeAccent = (): UseThemeAccentReturn => {
	const [accentColor, setAccentColor] = useState(SUPABASE_GREEN)

	useEffect(() => {
		// Load saved accent color from localStorage
		const savedColor = localStorage.getItem('theme-accent-color')
		if (savedColor) {
			handleSetAccentColor(savedColor)
		} else {
			handleSetAccentColor(SUPABASE_GREEN)
		}
	}, [])

	const handleSetAccentColor = (color: string) => {
		setAccentColor(color)
		localStorage.setItem('theme-accent-color', color)
		const newTheme = createCustomTheme(color)

		// Apply theme colors to CSS variables
		Object.entries(newTheme.colors).forEach(([key, value]) => {
			document.documentElement.style.setProperty(`--${key}`, value)
			// Also set the Tailwind CSS variable format
			document.documentElement.style.setProperty(
				`--${key}-rgb`,
				hexToRgb(value)
			)
		})
	}

	const resetToDefault = () => {
		handleSetAccentColor(SUPABASE_GREEN)
	}

	return {
		accentColor,
		setAccentColor: handleSetAccentColor,
		resetToDefault
	}
}

// Helper function to convert hex to RGB format
function hexToRgb(hex: string): string {
	// Remove the hash if present
	hex = hex.replace('#', '')

	// Parse the hex values
	const r = parseInt(hex.substring(0, 2), 16)
	const g = parseInt(hex.substring(2, 4), 16)
	const b = parseInt(hex.substring(4, 6), 16)

	// Return RGB format
	return `${r} ${g} ${b}`
}
