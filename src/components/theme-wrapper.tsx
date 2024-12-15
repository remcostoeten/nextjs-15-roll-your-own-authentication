'use client'

import * as React from 'react'
import { ThemeProvider as NextThemesProvider } from 'next-themes'
import { TooltipProvider } from '@/shared/components/ui/tooltip'

export function ThemeProvider({
	children,
	...props
}: React.ComponentProps<typeof NextThemesProvider>) {
	return (
		<NextThemesProvider
			attribute="class"
			defaultTheme="dark"
			forcedTheme="dark"
			{...props}
		>
			<TooltipProvider delayDuration={50}>
				<div className="min-h-screen max-h-screen bg-background text-foreground">
					{children}
				</div>
			</TooltipProvider>
		</NextThemesProvider>
	)
}
