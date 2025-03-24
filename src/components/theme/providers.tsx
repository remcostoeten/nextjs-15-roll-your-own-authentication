'use client'

import * as React from 'react'
import { ThemeProvider as NextThemesProvider } from 'next-themes'

export function ThemeProvider({ children, ...props }: React.ComponentProps<typeof NextThemesProvider>) {
	return (
		<NextThemesProvider
			attribute="class"
			defaultTheme="dark"
			enableSystem={true}
			disableTransitionOnChange
			storageKey="ryoa-theme"
			{...props}
		>
			{children}
		</NextThemesProvider>
	)
}
