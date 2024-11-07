'use client'

import { CodeBlock } from '@/shared/_docs/code-block/code-block'
import { motion } from 'framer-motion'
import { usePathname } from 'next/navigation'
import { useState } from 'react'

type NavItem = {
	name: string
	href: string
}

export default function Component() {
	const [searchQuery, setSearchQuery] = useState('')
	const pathname = usePathname()

	const navigation = [
		{ name: 'All Posts', href: '/changelog' },
		{ name: 'Engineering', href: '/changelog/engineering' },
		{ name: 'Community', href: '/changelog/community' },
		{ name: 'Company News', href: '/changelog/news' },
		{ name: 'Customers', href: '/changelog/customers' },
		{ name: 'Changelog', href: '/changelog/product' },
		{ name: 'Press', href: '/changelog/press' }
	]

	const projectStats = {
		stars: 1250,
		forks: 320,
		contributors: 45,
		openIssues: 23,
		closedIssues: 578,
		pullRequests: 12,
		commits: 2345,
		releases: 15,
		languages: [
			{ name: 'TypeScript', percentage: 68 },
			{ name: 'JavaScript', percentage: 20 },
			{ name: 'CSS', percentage: 10 },
			{ name: 'HTML', percentage: 2 }
		]
	}

	const changes = [
		{
			date: 'Nov 6, 2023',
			title: 'Added Lucia Authentication Integration',
			description:
				'Implemented secure authentication using Lucia, providing a robust system for user management and session handling.',
			content: `
        Key improvements include:

        • Secure session management with Lucia
        • OAuth integration with multiple providers
        • Type-safe authentication flows
        • Improved security measures
      `,
			image: '/placeholder.svg?height=400&width=800',
			gitInfo: {
				type: 'merge',
				message: 'Merge pull request #123 from feature/lucia-auth',
				branch: 'main',
				author: 'Jane Doe',
				commitHash: 'a1b2c3d',
				changedFiles: 15,
				additions: 523,
				deletions: 128
			},
			codeSnippet: `
import { auth } from '@/lib/lucia'
import { OAuthRequestError } from '@lucia-auth/oauth'

export const POST = async (request: Request) => {
  const formData = await request.formData()
  const code = formData.get('code')
  
  try {
    const { existingUser, providerUser, createUser } =
      await auth.validateOAuth2Code('github', code)
    // ...
  } catch (e) {
    if (e instanceof OAuthRequestError) {
      // invalid code
      return new Response(null, {
        status: 400
      })
    }
    return new Response(null, {
      status: 500
    })
  }
}
      `,
			performance: {
				beforeAuthTime: '1.2s',
				afterAuthTime: '0.8s',
				improvementPercentage: 33
			}
		},
		{
			date: 'Nov 1, 2023',
			title: 'PostgreSQL Database Implementation',
			description:
				'Integrated Neon PostgreSQL database with Drizzle ORM for improved data management and type safety.',
			content: `
        Major updates include:

        • Serverless PostgreSQL setup with Neon
        • Type-safe queries with Drizzle ORM
        • Automated database migrations
        • Improved data relationships
      `,
			gitInfo: {
				type: 'commit',
				message: 'Implement Neon PostgreSQL and Drizzle ORM',
				branch: 'feature/db-integration',
				author: 'John Smith',
				commitHash: 'e5f6g7h',
				changedFiles: 8,
				additions: 342,
				deletions: 56
			},
			codeSnippet: `
import { drizzle } from 'drizzle-orm/neon-serverless'
import { neon } from '@neondatabase/serverless'

const sql = neon(process.env.DATABASE_URL!)
export const db = drizzle(sql)

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  name: text('name'),
  email: text('email').notNull().unique(),
  createdAt: timestamp('created_at').defaultNow().notNull()
})
      `,
			performance: {
				beforeQueryTime: '150ms',
				afterQueryTime: '50ms',
				improvementPercentage: 67
			}
		}
	]

	return (
		<div className="flex min-h-screen flex-col">
			<main className="flex-1">
				<div className="container mx-auto max-w-4xl py-6 px-4 lg:py-10">
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.5 }}
						className="flex flex-col items-start gap-4 md:flex-row md:justify-between md:gap-8"
					>
						<div className="flex-1 space-y-4">
							<h1 className="text-4xl font-bold tracking-tight lg:text-5xl">
								Changelog
							</h1>
							<p className="text-xl text-gray-400">
								Latest updates and improvements
							</p>
						</div>
					</motion.div>

					<div className="mt-8 rounded-lg p-6 shadow-lg">
						<h2 className="mb-4 text-2xl font-semibold">
							Project Statistics
						</h2>
						<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
							<div className="flex items-center space-x-2">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									className="h-5 w-5 text-yellow-500"
									viewBox="0 0 20 20"
									fill="currentColor"
								>
									<path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
								</svg>
								<span>{projectStats.stars} Stars</span>
							</div>
							<div className="flex items-center space-x-2">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									className="h-5 w-5 text-blue-500"
									viewBox="0 0 20 20"
									fill="currentColor"
								>
									<path
										fillRule="evenodd"
										d="M7.707 3.293a1 1 0 010 1.414L5.414 7H11a7 7 0 017 7v2a1 1 0 11-2 0v-2a5 5 0 00-5-5H5.414l2.293 2.293a1 1 0 11-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
										clipRule="evenodd"
									/>
								</svg>
								<span>{projectStats.forks} Forks</span>
							</div>
							<div className="flex items-center space-x-2">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									className="h-5 w-5 text-green-500"
									viewBox="0 0 20 20"
									fill="currentColor"
								>
									<path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
								</svg>
								<span>
									{projectStats.contributors} Contributors
								</span>
							</div>
							<div className="flex items-center space-x-2">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									className="h-5 w-5 text-purple-500"
									viewBox="0 0 20 20"
									fill="currentColor"
								>
									<path
										fillRule="evenodd"
										d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z"
										clipRule="evenodd"
									/>
								</svg>
								<span>{projectStats.commits} Commits</span>
							</div>
						</div>
						<div className="mt-6">
							<h3 className="mb-2 text-lg font-semibold">
								Language Distribution
							</h3>
							<div className="space-y-2">
								{projectStats.languages.map((lang) => (
									<div
										key={lang.name}
										className="flex items-center space-x-2"
									>
										<span className="w-20">
											{lang.name}
										</span>
										<div className="flex-1 bg-gray-700 rounded-full h-2.5">
											<div
												className="bg-blue-600 h-2.5 rounded-full"
												style={{
													width: `${lang.percentage}%`
												}}
											></div>
										</div>
										<span>{lang.percentage}%</span>
									</div>
								))}
							</div>
						</div>
					</div>

					<div className="my-8 h-px bg-gray-800" />

					<div className="relative flex flex-col gap-4">
						<div className="absolute left-0 top-0 bottom-0 w-px bg-gray-800" />
						{changes.map((change, index) => (
							<motion.article
								key={index}
								initial={{ opacity: 0, x: -20 }}
								animate={{ opacity: 1, x: 0 }}
								transition={{
									duration: 0.5,
									delay: index * 0.2
								}}
								className="group relative flex flex-col space-y-4 pl-8"
							>
								<div className="absolute -left-1.5 top-0 h-3 w-3 rounded-full border-2 border-blue-500 bg-gray-900" />
								<div className="flex items-center space-x-4">
									<time className="text-sm text-gray-400">
										{change.date}
									</time>
									<div className="h-4 w-px bg-gray-700" />
									<span className="text-sm font-medium text-gray-300">
										{change.description}
									</span>
								</div>
								<h2 className="text-2xl font-bold text-blue-500">
									{change.title}
								</h2>
								{change.image && (
									<motion.img
										src={change.image}
										alt={change.title}
										className="rounded-lg border border-gray-700 bg-gray-800 transition-colors"
										width={800}
										height={400}
										initial={{ opacity: 0, scale: 0.8 }}
										animate={{ opacity: 1, scale: 1 }}
										transition={{ duration: 0.5 }}
									/>
								)}
								<motion.div
									className="prose prose-invert max-w-none"
									initial={{ opacity: 0 }}
									animate={{ opacity: 1 }}
									transition={{ duration: 0.5, delay: 0.2 }}
								>
									<div className="whitespace-pre-line">
										{change.content}
									</div>
								</motion.div>
								<div className="mt-4 flex items-center space-x-2">
									{change.gitInfo.type === 'merge' && (
										<svg
											xmlns="http://www.w3.org/2000/svg"
											className="h-5 w-5 text-green-500"
											viewBox="0 0 20 20"
											fill="currentColor"
										>
											<path
												fillRule="evenodd"
												d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 1.414L10.586 9H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z"
												clipRule="evenodd"
											/>
										</svg>
									)}
									{change.gitInfo.type === 'commit' && (
										<svg
											xmlns="http://www.w3.org/2000/svg"
											className="h-5 w-5 text-blue-500"
											viewBox="0 0 20 20"
											fill="currentColor"
										>
											<path
												fillRule="evenodd"
												d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
												clipRule="evenodd"
											/>
										</svg>
									)}
									{change.gitInfo.type === 'pull-request' && (
										<svg
											xmlns="http://www.w3.org/2000/svg"
											className="h-5 w-5 text-purple-500"
											viewBox="0 0 20 20"
											fill="currentColor"
										>
											<path
												fillRule="evenodd"
												d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z"
												clipRule="evenodd"
											/>
										</svg>
									)}
									<span className="text-sm font-medium">
										{change.gitInfo.message}
									</span>
									<span className="rounded-full bg-gray-700 px-2 py-1 text-xs font-medium text-gray-300">
										{change.gitInfo.branch}
									</span>
									<span className="text-sm text-gray-400">
										by {change.gitInfo.author}
									</span>
								</div>
								<div className="mt-2 text-sm text-gray-400">
									<span>
										Commit: {change.gitInfo.commitHash} |{' '}
									</span>
									<span>
										Changed Files:{' '}
										{change.gitInfo.changedFiles} |{' '}
									</span>
									<span className="text-green-500">
										+{change.gitInfo.additions}
									</span>
									<span className="text-red-500">
										{' '}
										-{change.gitInfo.deletions}
									</span>
								</div>
								<div className="mt-4">
									<h3 className="mb-2 text-lg font-semibold">
										Code Snippet
									</h3>
									<CodeBlock
										code={change.codeSnippet}
										language="typescript"
										showLineNumbers
										enableLineHighlight
										showMetaInfo
										fileName={
											change.gitInfo.type === 'merge'
												? 'feature/lucia-auth/auth.ts'
												: 'lib/db.ts'
										}
										badges={[
											{
												text: change.gitInfo.type,
												variant:
													change.gitInfo.type ===
													'merge'
														? 'success'
														: 'primary'
											},
											{
												text: `+${change.gitInfo.additions} -${change.gitInfo.deletions}`,
												variant: 'default'
											}
										]}
									/>
								</div>
								<div className="mt-4">
									<h3 className="mb-2 text-lg font-semibold">
										Performance Impact
									</h3>
									<div className="flex items-center space-x-4">
										<div>
											<span className="text-sm text-gray-400">
												Before:{' '}
											</span>
											<span>
												{change.performance
													.beforeAuthTime ||
													change.performance
														.beforeQueryTime}
											</span>
										</div>
										<div>
											<span className="text-sm text-gray-400">
												After:{' '}
											</span>
											<span>
												{change.performance
													.afterAuthTime ||
													change.performance
														.afterQueryTime}
											</span>
										</div>
										<div>
											<span className="text-sm text-green-500">
												{
													change.performance
														.improvementPercentage
												}
												% improvement
											</span>
										</div>
									</div>
								</div>
							</motion.article>
						))}
					</div>
				</div>
			</main>
		</div>
	)
}
