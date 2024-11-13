// src/features/docs/components/examples-section.tsx
'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { CodeBlock } from './code-block/code-block'

const examples = {
	registration: {
		title: 'User Registration',
		description: 'Example of registering a new user',
		code: `
// Client-side registration form submission
async function handleRegister(event) {
	event.preventDefault();
	
	const formData = new FormData(event.currentTarget);
	const response = await fetch('/api/auth/register', {
		method: 'POST',
		body: JSON.stringify({
			name: formData.get('name'),
			email: formData.get('email'),
			password: formData.get('password'),
		}),
	});

	const data = await response.json();
	if (data.success) {
		// Handle successful registration
	}
}`
	},
	login: {
		title: 'User Login',
		description: 'Example of user authentication',
		code: `
// Client-side login implementation
async function handleLogin(email: string, password: string) {
	try {
		const result = await login(email, password);
		
		if (result.success) {
			router.push('/dashboard');
		} else {
			setError(result.error);
		}
	} catch (error) {
		console.error('Login failed:', error);
	}
}`
	},
	activityLogging: {
		title: 'Activity Logging',
		description: 'Example of logging user activities',
		code: `
// Using the activity logger
import { logActivity } from '@/features/authentication/helpers/log-activity';

// Log a successful login
await logActivity({
	userId: user.id,
	type: 'login',
	status: 'success',
	message: 'User logged in successfully',
	metadata: {
		browser: deviceInfo.browser,
		os: deviceInfo.os,
		isMobile: deviceInfo.isMobile,
	},
});`
	},
	sessionManagement: {
		title: 'Session Management',
		description: 'Example of managing user sessions',
		code: `
// Creating a new session
const session = await createSession({
	userId: user.id,
	token: jwt,
	expiresAt: new Date(Date.now() + sessionDuration),
	deviceInfo: {
		browser: getBrowserInfo(userAgent),
		os: getOSInfo(userAgent),
		isMobile: isMobileDevice(userAgent),
	},
});`
	}
}

export default function AuthExamples() {
	return (
		<div className="container mx-auto py-10">
			<Tabs defaultValue="registration" className="space-y-4">
				<TabsList>
					{Object.keys(examples).map((key) => (
						<TabsTrigger
							key={key}
							value={key}
							className="capitalize"
						>
							{key}
						</TabsTrigger>
					))}
				</TabsList>

				{Object.entries(examples).map(([key, example]) => (
					<TabsContent key={key} value={key}>
						<Card>
							<CardHeader>
								<CardTitle>{example.title}</CardTitle>
								<p className="text-sm text-muted-foreground">
									{example.description}
								</p>
							</CardHeader>
							<CardContent>
								<CodeBlock
									code={example.code}
									language="typescript"
									showLineNumbers
								/>
							</CardContent>
						</Card>
					</TabsContent>
				))}
			</Tabs>
		</div>
	)
}
