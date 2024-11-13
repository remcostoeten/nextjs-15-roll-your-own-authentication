import { ThemeSwitcher } from '@/components/theme-switcher'
import Link from 'next/link'

export function DocsHeader() {
	return (
		<header className="flex items-center justify-between p-4 border-b bg-white dark:bg-neutral-900 dark:bg-gray-800">
			<Link href="/" className="text-2xl font-bold">
				Auth System Docs
			</Link>
			<ThemeSwitcher />
		</header>
	)
}
