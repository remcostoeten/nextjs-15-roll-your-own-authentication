'use client'

import GuideSidebar from '@/features/guides/components/guide-sidebar'
import { GuideSection } from '@/features/guides/types/guide'
import CodeBlock from '@/shared/_docs/code-block/code-block'
import { Code, Lock, Server, Shield, Webhook } from 'lucide-react'

const sections: GuideSection[] = [
	{
		id: 'overview',
		label: 'Overview',
		icon: Server
	},
	{
		id: 'auth',
		label: 'Authentication',
		icon: Lock,
		subsections: [
			{
				id: 'auth-middleware',
				label: 'Middleware Protection',
				icon: Shield
			},
			{
				id: 'auth-utils',
				label: 'Auth Utilities',
				icon: Code
			}
		]
	},
	{
		id: 'api',
		label: 'API Integration',
		icon: Webhook,
		subsections: [
			{
				id: 'api-routes',
				label: 'API Routes',
			},
			{
				id: 'api-handlers',
				label: 'Route Handlers',
			}
		]
	}
]

const middlewareCode = `import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getSession } from './auth/session'
 
export async function middleware(request: NextRequest) {
  const session = await getSession()
  
  if (!session) {
    return NextResponse.redirect(new URL('/sign-in', request.url))
  }
  if (!session) {
    return NextResponse.redirect(new URL('/sign-in', request.url))
  }
  
  return NextRespoif (!session) {
    return NextResponse.redirect(new URL('/sign-in', request.url))
  }
  
  return NextRespoif (!session) {
    return NextResponse.redirect(new URL('/sign-in', request.url))
  }
  
  return NextRespoif (!session) {
    return NextResponse.redirect(new URL('/sign-in', request.url))
  }
  
  return NextRespoif (!session) {
    return NextResponse.redirect(new URL('/sign-in', request.url))
  }
  
  return NextRespo
  return NextResponse.next()
}`

const authUtilsCode = `export async function getSession() {
  const session = await auth()
  if (!session) return null
  
  return {
    user: session.user,
    expires: session.expires
  }
}

export async function getCurrentUser() {
  const session = await getSession()
  if (!session) return null
  
  return session.user
}`

const routeHandlerCode = `import { NextResponse } from 'next/server'
import { getSession } from '@/auth/session'
 
export async function GET() {
  const session = await getSession()
  if (!session) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    )
  }
  
  // Your protected API logic here
  return NextResponse.json({ data: 'Protected Data' })
}`

export default function ServerGuidePage() {
	return (
		<div className="flex gap-12">
			<aside className="w-64 hidden lg:block">
				<GuideSidebar 
					sections={sections} 
					defaultOpenSections={['auth', 'api']}
				/>
			</aside>
			
			<main className="flex-1 max-w-4xl space-y-12">
				<section id="overview">
					<h1 className="text-3xl font-bold mb-4">Server-Side Authentication</h1>
					<p className="text-neutral-400 text-lg mb-6">
						Learn how to implement secure server-side authentication using Next.js middleware and API routes.		Learn how to implement secure server-side authentication using Next.js middleware and API routes.		Learn how to implement secure server-side authentication using Next.js middleware and API routes.

						<br/><br/><br/>
						Learn how to implement secure server-side authentication using Next.js middleware and API routes.		Learn how to implement secure server-side authentication using Next.js middleware and API routes.		Learn how to implement secure server-side authentication using Next.js middleware and API routes.
						<br/><br/><br/>
						Learn how to implement secure server-side authentication using Next.js middleware and API routes.		Learn how to implement secure server-side authentication using Next.js middleware and API routes.		Learn how to implement secure server-side authentication using Next.js middleware and API routes.

						<br/><br/><br/>
						Learn how to implement secure server-side authentication using Next.js middleware and API routes.		Learn how to implement secure server-side authentication using Next.js middleware and API routes.		Learn how to implement secure server-side authentication using Next.js middleware and API routes.

						<br/><br/><br/>
						Learn how to implement secure server-side authentication using Next.js middleware and API routes.		Learn how to implement secure server-side authentication using Next.js middleware and API routes.		Learn how to implement secure server-side authentication using Next.js middleware and API routes.

						<br/><br/><br/>
						Learn how to implement secure server-side authentication using Next.js middleware and API routes.		Learn how to implement secure server-side authentication using Next.js middleware and API routes.		Learn how to implement secure server-side authentication using Next.js middleware and API routes.
					</p>
					<div className="p-4 bg-neutral-900/50 border border-neutral-800 rounded-lg">
						<h4 className="text-sm font-medium text-neutral-200 mb-2">Prerequisites</h4>
						<ul className="list-disc list-inside text-sm text-neutral-400 space-y-1">
							<li>Understanding of Next.js App Router</li>
							<li>Basic knowledge of authentication concepts</li>
							<li>Familiarity with TypeScript</li>	<li>Understanding of Next.js App Router</li>
							<li>Basic knowledge of authentication concepts</li>
							<li>Familiarity with TypeScript</li>	<li>Understanding of Next.js App Router</li>
							<li>Basic knowledge of authentication concepts</li>
							<li>Familiarity with TypeScript</li>	<li>Understanding of Next.js App Router</li>
							<li>Basic knowledge of authentication concepts</li>
							<li>Familiarity with TypeScript</li>	<li>Understanding of Next.js App Router</li>
							<li>Basic knowledge of authentication concepts</li>
							<li>Familiarity with TypeScript</li>
						</ul>
					</div>
				</section>

				<section id="auth" className="space-y-8">
					<h2 className="text-2xl font-semibold">Authentication</h2>
					
					<div id="auth-middleware" className="space-y-4">
						<h3 className="text-xl font-medium">Middleware Protection</h3>
						<p className="text-neutral-400">
							Protect your routes using Next.js middleware to check authentication status before rendering pages:	Protect your routes using Next.js middleware to check authentication status before rendering pages:	Protect your routes using Next.js middleware to check authentication status before rendering pages:	Protect your routes using Next.js middleware to check authentication status before rendering pages:
						</p>
						<CodeBlock 
							code={middlewareCode}
							language="typescript"
							fileName="middleware.ts"
						/>			<CodeBlock 
							code={middlewareCode}
							language="typescript"
							fileName="middleware.ts"
						/>			<CodeBlock 
							code={middlewareCode}
							language="typescript"
							fileName="middleware.ts"
						/>
					</div>

					<div id="auth-utils" className="space-y-4">
						<h3 className="text-xl font-medium">Auth Utilities</h3>
						<p className="text-neutral-400">
								Common utility functions for handling authentication state and user data:
						</p>
						<CodeBlock 
							code={authUtilsCode}
							language="typescript"
							fileName="auth/utils.ts"
						/>
					</div>
				</section>

				<section id="api" className="space-y-8">
					<h2 className="text-2xl font-semibold">API Integration</h2>
					
					<div id="api-routes" className="space-y-4">
						<h3 className="text-xl font-medium">API Routes</h3>
						<p className="text-neutral-400">
							Create protected API routes that check authentication status before processing requests:	Create protected API routes that check authentication status before processing requests:	Create protected API routes that check authentication status before processing requests:	Create protected API routes that check authentication status before processing requests:
							Create protected API routes that check authentication status before processing requests:	Create protected API routes that check authentication status before processing requests:	Create protected API routes that check authentication status before processing requests:	Create protected API routes that check authentication status before processing requests:
							Create protected API routes that check authentication status before processing requests:	Create protected API routes that check authentication status before processing requests:	Create protected API routes that check authentication status before processing requests:	Create protected API routes that check authentication status before processing requests:

<br/>
							Create protected API routes that check authentication status before processing requests:	Create protected API routes that check authentication status before processing requests:	Create protected API routes that check authentication status before processing requests:	Create protected API routes that check authentication status before processing requests:
<br/><br/>
							Create protected API routes that check authentication status before processing requests:	Create protected API routes that check authentication status before processing requests:	Create protected API routes that check authentication status before processing requests:	Create protected API routes that check authentication status before processing requests:
					</p>
						<CodeBlock 
							code={routeHandlerCode}
							language="typescript"
							fileName="app/api/protected/route.ts"
						/>
					</div>

					<div id="api-handlers" className="space-y-4">
						<h3 className="text-xl font-medium">Route Handlers</h3>
						<p className="text-neutral-400">
							Route handlers provide a modern way to handle API requests in Next.js, with built-in support for:
						</p>
						<ul className="list-disc list-inside text-neutral-400 space-y-2">
							<li>Type-safe request/response handling</li>
							<li>Automatic response parsing</li>
							<li>Built-in CORS configuration</li>
							<li>Edge runtime support</li>
						</ul>
					</div>
				</section>
			</main>
		</div>
	)
}
