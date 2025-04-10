import type React from 'react'
import { DocsSidebar } from '@/modules/docs/components/docs-sidebar'
import { DocsSearch } from '@/modules/docs/components/docs-searc'
import { ScrollArea } from '@/components/ui/scroll-area'
import type { Metadata } from 'next'
import { Logo } from '@/shared/components/logo'

export const metadata: Metadata = {
	title: 'Documentation | JWT Authentication',
	description: 'Documentation for JWT Authentication system',
}

export default function DocsLayout({
	children,
}: {
	children: React.ReactNode
}) {
	return (
		<div className="flex min-h-screen flex-col">
			<header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
				<div className="container flex h-14 items-center">
					<div className="mr-4 hidden md:flex">
						<a
							href="/"
							className="mr-6 flex items-center space-x-2"
						>
							<Logo className="h-7 w-7" />
						</a>
						<nav className="flex items-center space-x-6 text-sm font-medium">
							<a
								href="/docs"
								className="transition-colors hover:text-foreground/80 text-foreground"
							>
								Documentation
							</a>
							<a
								href="/dashboard"
								className="transition-colors hover:text-foreground/80 text-muted-foreground"
							>
								Dashboard
							</a>
							<a
								href="https://github.com/yourusername/jwt-auth"
								className="transition-colors hover:text-foreground/80 text-muted-foreground"
								target="_blank"
								rel="noreferrer"
							>
								GitHub
							</a>
						</nav>
					</div>
					<div className="flex flex-1 items-center space-x-2 md:justify-end">
						<div className="w-full md:w-80">
							<DocsSearch />
						</div>
					</div>
				</div>
			</header>
			<div className="container flex-1 items-start md:grid md:grid-cols-[220px_minmax(0,1fr)] md:gap-6 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-10">
				<aside className="fixed top-14 z-30 -ml-2 hidden h-[calc(100vh-3.5rem)] w-full shrink-0 md:sticky md:block">
					<ScrollArea className="h-full py-6 pr-6 lg:py-8">
						<DocsSidebar />
					</ScrollArea>
				</aside>
				<main className="relative py-6 lg:gap-10 lg:py-8">
					<div className="mx-auto w-full min-w-0">{children}</div>
				</main>
			</div>
			<footer className="border-t py-6 md:py-0">
				<div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
					<p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
						Built with Next.js, Tailwind CSS, and shadcn/ui.
					</p>
				</div>
			</footer>
		</div>
	)
}
