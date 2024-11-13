'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { Toaster } from 'react-hot-toast'

type DarkModeContextType = {
	isDarkMode: boolean
	toggleDarkMode: () => void
}

const DarkModeContext = createContext<DarkModeContextType | undefined>(
	undefined
)

export const DarkModeProvider: React.FC<{ children: React.ReactNode }> = ({
	children
}) => {
	const [isDarkMode, setIsDarkMode] = useState(false)

	useEffect(() => {
		const darkModePreference = window.matchMedia(
			'(prefers-color-scheme: dark)'
		).matches
		setIsDarkMode(darkModePreference)
	}, [])

	const toggleDarkMode = () => {
		setIsDarkMode((prevMode) => !prevMode)
	}

	useEffect(() => {
		if (isDarkMode) {
			document.documentElement.classList.add('dark')
		} else {
			document.documentElement.classList.remove('dark')
		}
	}, [isDarkMode])

	return (
		<DarkModeContext.Provider value={{ isDarkMode, toggleDarkMode }}>
			{children}
			<Toaster
				position="top-right"
				toastOptions={{
					style: {
						borderRadius: '8px',
						background: isDarkMode ? '#333' : '#fff',
						color: isDarkMode ? '#fff' : '#333'
					}
				}}
			/>
		</DarkModeContext.Provider>
	)
}

export const useDarkMode = () => {
	const context = useContext(DarkModeContext)
	if (!context) {
		throw new Error('useDarkMode must be used within a DarkModeProvider')
	}
	return context
}
