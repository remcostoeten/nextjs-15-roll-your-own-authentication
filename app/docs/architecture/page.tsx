import { Metadata } from 'next'

export const metadata: Metadata = {
	title: 'Architecture | Auth System Docs'
}

export default function ArchitecturePage() {
	return (
		<article className="max-w-3xl mx-auto">
			<h1 className="text-3xl font-bold mb-6">Architecture Overview</h1>

			<section className="mb-8">
				<h2 className="text-2xl font-semibold mb-4">
					Project Structure
				</h2>
				<p className="mb-4">
					Our authentication system follows a feature-based
					architecture, strictly adhering to SOLID principles:
				</p>
				<pre className="bg-gray-100 p-4 rounded-md overflow-x-auto">
					{`/
├── app/
├── components/
├── features/
│   ├── auth/
│   │   ├── schema.ts
│   │   ├── actions.ts
│   │   └── utils.ts
│   ├── users/
│   ├── roles/
│   ├── permissions/
│   ├── sessions/
│   ├── socialAccounts/
│   ├── apiKeys/
│   ├── activityLogs/
│   ├── tenants/
│   ├── oauth/
│   ├── rateLimit/
│   └── events/
├── shared/
│   ├── db.ts
│   └── types.ts
└── middleware.ts`}
				</pre>
			</section>

			<section className="mb-8">
				<h2 className="text-2xl font-semibold mb-4">Key Concepts</h2>
				<ul className="list-disc pl-5">
					<li>
						Each feature is self-contained with its own schema,
						actions, and utilities
					</li>
					<li>
						Shared code and types are located in the shared
						directory
					</li>
					<li>
						The main database schema is composed of individual
						feature schemas
					</li>
					<li>Server actions are used for database operations</li>
					<li>
						React Server Components are used for server-side
						rendering
					</li>
					<li>
						Event-driven architecture allows for decoupled, scalable
						design
					</li>
				</ul>
			</section>

			<section className="mb-8">
				<h2 className="text-2xl font-semibold mb-4">
					SOLID Principles Application
				</h2>
				<ul className="list-disc pl-5">
					<li>
						<strong>Single Responsibility:</strong> Each feature
						module handles one aspect of the system
					</li>
					<li>
						<strong>Open/Closed:</strong> New features can be added
						without modifying existing ones
					</li>
					<li>
						<strong>Liskov Substitution:</strong> Modular structure
						allows easy substitution of implementations
					</li>
					<li>
						<strong>Interface Segregation:</strong> Each feature has
						its own interfaces, preventing unnecessary dependencies
					</li>
					<li>
						<strong>Dependency Inversion:</strong> High-level
						modules depend on abstractions, not concrete
						implementations
					</li>
				</ul>
			</section>
		</article>
	)
}
