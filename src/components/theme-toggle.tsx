'use client'

import { Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'
import { Button } from '../shared/components/ui/button'

export function ThemeToggle() {
	const { theme, setTheme } = useTheme()

	return (
		<Button
			variant="theme"
			size="theme"
			className="relative transition-colors duration-200"
			onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
		>
			<Sun className="rotate-0 scale-100 transition-transform dark:-rotate-90 dark:scale-0" />
			<Moon className="absolute rotate-90 scale-0 transition-transform dark:rotate-0 dark:scale-100" />
			<span className="sr-only">Toggle theme</span>
		</Button>
	)
}
