'use client'

import { useState, useEffect } from 'react'
import { DevToolsWidget } from '@/modules/widgets/dev-tools/components/dev-tools-widget'
import { Button } from '@/shared/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card'
import { devToolsConfig } from '@/modules/widgets/dev-tools/ config'

export default function Home() {
	const [isAuthenticated, setIsAuthenticated] = useState(false)
	const [user, setUser] = useState<{
		name: string
		email: string
		createdAt: Date
		isOnline: boolean
	} | null>(null)

	// Set up some demo localStorage and sessionStorage items
	useEffect(() => {
		// Local storage demo items
		localStorage.setItem('theme', 'dark')
		localStorage.setItem('language', 'en-US')
		localStorage.setItem('lastVisit', new Date().toISOString())

		// Session storage demo items
		sessionStorage.setItem('sessionId', 'sess_' + Math.random().toString(36).substring(2, 15))
		sessionStorage.setItem('pageViews', '1')

		return () => {
			// Clean up is optional for demo purposes
		}
	}, [])

	// Mock login function
	const handleLogin = () => {
		setIsAuthenticated(true)
		setUser({
			name: 'John Doe',
			email: 'john@example.com',
			createdAt: new Date('2023-01-15'),
			isOnline: true,
		})
	}

	// Mock logout function
	const handleLogout = () => {
		setIsAuthenticated(false)
		setUser(null)
	}

	return (
		<main className="flex min-h-screen flex-col items-center justify-center p-8">
			<div className="z-10 max-w-5xl w-full items-center justify-center font-mono text-sm flex flex-col gap-8">
				<h1 className="text-4xl font-bold">Developer Tools Widget</h1>

				<div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl">
					<Card>
						<CardHeader>
							<CardTitle>Authentication Demo</CardTitle>
							<CardDescription>Login to see JWT information in the developer tools</CardDescription>
						</CardHeader>
						<CardContent className="flex flex-col items-center gap-4">
							<p className="text-xl">
								Current status: {isAuthenticated ? 'Authenticated' : 'Not Authenticated'}
							</p>

							<Button
								onClick={isAuthenticated ? handleLogout : handleLogin}
								variant={isAuthenticated ? 'destructive' : 'default'}
							>
								{isAuthenticated ? 'Logout' : 'Login'}
							</Button>
						</CardContent>
					</Card>

					<Card>
						<CardHeader>
							<CardTitle>Storage Demo</CardTitle>
							<CardDescription>
								Use the developer tools to view and manage browser storage
							</CardDescription>
						</CardHeader>
						<CardContent className="flex flex-col gap-4">
							<div className="text-sm space-y-2">
								<p>The developer tools widget provides access to:</p>
								<ul className="list-disc pl-5 space-y-1">
									<li>Local Storage - view, edit, add, and delete items</li>
									<li>Session Storage - view, edit, add, and delete items</li>
									<li>JWT Decoder - view and decode JWT tokens</li>
								</ul>
							</div>

							<Button
								onClick={() => {
									localStorage.setItem(`demo_${Date.now()}`, Math.random().toString(36).substring(2))
									alert('Added new random item to localStorage!')
								}}
								variant="outline"
								size="sm"
							>
								Add Random localStorage Item
							</Button>
						</CardContent>
					</Card>
				</div>

				<div className="mt-8 text-center max-w-md">
					<p className="text-muted-foreground">
						The developer tools widget can be dragged anywhere on the screen. Its position will be
						remembered between page refreshes. Click the gear icon to open the tools panel.
					</p>
				</div>
			</div>

			<DevToolsWidget
				allowDrag={devToolsConfig.allowDrag}
				showInProduction={devToolsConfig.showInProduction}
				authInfo={{
					isAuthenticated,
					user: user || undefined,
					token: isAuthenticated
						? 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJleHAiOjE2MTYyMzkwMjIsImVtYWlsIjoiam9obkBleGFtcGxlLmNvbSIsInJvbGUiOiJ1c2VyIn0.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c'
						: undefined,
					onLogout: handleLogout,
					onTokenRefresh: () => alert('Token refresh functionality would go here'),
				}}
			/>
		</main>
	)
}
