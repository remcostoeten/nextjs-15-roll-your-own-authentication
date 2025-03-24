'use client'

import React, { createContext, ReactNode, useContext, useState, useEffect } from 'react'
import DevToolsWidget from '@/modules/widgets/dev-tools/components/dev-tools-widget'

type WidgetContextType = {
	isDevToolVisible: boolean
	toggleDevTool: () => void
}

const WidgetContext = createContext<WidgetContextType | undefined>(undefined)

export const useWidgets = () => {
	const context = useContext(WidgetContext)
	if (!context) {
		throw new Error('useWidgets must be used within a WidgetProvider')
	}
	return context
}

export function WidgetProvider({ children }: { children: ReactNode }) {
	const [isDevToolVisible, setIsDevToolVisible] = useState(true)
	const [isInitialized, setIsInitialized] = useState(false)

	// Only log when the state actually changes, not on every render
	useEffect(() => {
		console.log('Widget visibility changed:', isDevToolVisible)
	}, [isDevToolVisible])

	// Initialize once on mount
	useEffect(() => {
		setIsInitialized(true)
	}, [])

	const toggleDevTool = () => {
		setIsDevToolVisible((prev) => !prev)
	}

	return (
		<WidgetContext.Provider
			value={{
				isDevToolVisible,
				toggleDevTool,
			}}
		>
			{children}

			{isDevToolVisible && isInitialized && (
				<div className="fixed inset-0 z-[9998] pointer-events-none">
					<div className="relative pointer-events-auto">
						<DevToolsWidget
							allowDrag
							showInProduction
						/>
					</div>
				</div>
			)}
		</WidgetContext.Provider>
	)
}
