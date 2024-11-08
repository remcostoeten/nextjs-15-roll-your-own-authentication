'use server'

import { Octokit } from '@octokit/rest'

export type GitHubCommit = {
	sha: string
	commit: {
		message: string
		author: {
			name: string | null
			email: string | null
			date: string | null
		}
	}
	stats: {
		additions: number
		deletions: number
		total: number
	}
	files: Array<{
		filename: string
		additions: number
		deletions: number
		changes: number
		status: string
		patch?: string
	}>
	parents: Array<{ sha: string }>
	merge?: {
		fromBranch: string
		intoBranch: string
	}
}

export type VercelDeployment = {
	uid: string
	name: string
	url: string
	created: number
	state: string
}

type VercelDeploymentResponse = {
	uid: string
	name: string
	url: string
	created: number
	state: string
	meta?: {
		[key: string]: unknown
	}
}

export async function getGithubCommits(): Promise<GitHubCommit[]> {
	try {
		const octokit = new Octokit({
			auth: process.env.GITHUB_PAT
		})

		// First, get the list of commits
		const commitsResponse = await octokit.repos.listCommits({
			owner: 'remcostoeten',
			repo: 'nextjs-15-roll-your-own-authentication',
			per_page: 10
		})

		// Then, get detailed information for each commit including patches
		const detailedCommits = await Promise.all(
			commitsResponse.data.map(async (commit) => {
				const detail = await octokit.repos.getCommit({
					owner: 'remcostoeten',
					repo: 'nextjs-15-roll-your-own-authentication',
					ref: commit.sha
				})

				// Extract branch information from merge commit message
				let merge
				if (commit.parents.length > 1) {
					// Typical merge commit message format: "Merge branch 'feature/xyz' into 'main'"
					const mergeMatch = commit.commit.message.match(
						/Merge (?:branch|pull request) '([^']+)' into '?([^'\n]+)'?/
					)
					if (mergeMatch) {
						merge = {
							fromBranch: mergeMatch[1],
							intoBranch: mergeMatch[2]
						}
					}
				}

				return {
					sha: commit.sha,
					commit: {
						message: commit.commit.message,
						author: {
							name: commit.commit.author?.name || null,
							email: commit.commit.author?.email || null,
							date: commit.commit.author?.date || null
						}
					},
					stats: {
						additions: detail.data.stats?.additions || 0,
						deletions: detail.data.stats?.deletions || 0,
						total: detail.data.stats?.total || 0
					},
					files:
						detail.data.files?.map((file) => ({
							filename: file.filename,
							additions: file.additions || 0,
							deletions: file.deletions || 0,
							changes: file.changes || 0,
							status: file.status || 'modified',
							patch: file.patch
						})) || [],
					parents: commit.parents || [],
					merge
				}
			})
		)

		return detailedCommits
	} catch (error) {
		console.error('Error fetching GitHub commits:', error)
		throw new Error('Failed to fetch commits')
	}
}

export async function getVercelDeployments(): Promise<VercelDeployment[]> {
	try {
		if (!process.env.VERCEL_TOKEN || !process.env.VERCEL_PROJECT_ID) {
			console.error('Missing Vercel credentials:', {
				hasToken: !!process.env.VERCEL_TOKEN,
				hasProjectId: !!process.env.VERCEL_PROJECT_ID
			})
			return [] // Return empty array instead of throwing
		}

		const response = await fetch(
			`https://api.vercel.com/v6/deployments?teamId=${process.env.VERCEL_TEAM_ID}&projectId=${process.env.VERCEL_PROJECT_ID}&limit=10&state=READY`,
			{
				headers: {
					Authorization: `Bearer ${process.env.VERCEL_TOKEN}`,
					'Content-Type': 'application/json'
				},
				next: {
					revalidate: 60,
					tags: ['vercel-deployments']
				}
			}
		)

		if (!response.ok) {
			const errorData = await response.json().catch(() => ({}))
			console.error('Vercel API Error:', {
				status: response.status,
				statusText: response.statusText,
				error: errorData
			})
			return [] // Return empty array on error
		}

		const data = await response.json()

		if (!data.deployments) {
			console.error('Unexpected Vercel API response:', {
				hasDeployments: false,
				responseData: data
			})
			return []
		}

		return data.deployments
			.filter((d: VercelDeploymentResponse) => d.state === 'READY')
			.map((deployment: VercelDeploymentResponse) => ({
				uid: deployment.uid || '',
				name: deployment.name || 'Unnamed Deployment',
				url: deployment.url || '',
				created: deployment.created || Date.now(),
				state: deployment.state?.toLowerCase() || 'unknown'
			}))
			.slice(0, 10) // Limit to 10 deployments
	} catch (error) {
		console.error('Error fetching Vercel deployments:', {
			error: error instanceof Error ? error.message : 'Unknown error',
			stack: error instanceof Error ? error.stack : undefined
		})
		return [] // Return empty array on error
	}
}

export type CommitStats = {
	totalCommits: number
	totalAdditions: number
	totalDeletions: number
	topContributors: Array<{
		name: string
		commits: number
	}>
	mostChangedFiles: Array<{
		filename: string
		changes: number
	}>
	languageDistribution: Record<string, number>
	commitFrequency: {
		hour: Record<string, number>
		dayOfWeek: Record<string, number>
	}
}

export async function getCommitStats(): Promise<CommitStats> {
	const commits = await getGithubCommits()
	const stats: CommitStats = {
		totalCommits: commits.length,
		totalAdditions: 0,
		totalDeletions: 0,
		topContributors: [],
		mostChangedFiles: [],
		languageDistribution: {},
		commitFrequency: {
			hour: {},
			dayOfWeek: {}
		}
	}

	// Calculate stats from commits
	const contributors = new Map<string, number>()
	const files = new Map<string, number>()
	const languages = new Map<string, number>()

	commits.forEach((commit) => {
		// Contributors
		const author = commit.commit.author?.name || 'Unknown'
		contributors.set(author, (contributors.get(author) || 0) + 1)

		// Files and Languages
		commit.files?.forEach((file) => {
			files.set(
				file.filename,
				(files.get(file.filename) || 0) + file.changes
			)
			const ext = file.filename.split('.').pop() || 'unknown'
			languages.set(ext, (languages.get(ext) || 0) + file.changes)
		})

		// Commit frequency
		const date = new Date(commit.commit.author?.date || '')
		const hour = date.getHours().toString()
		const dayOfWeek = date.toLocaleDateString('en-US', { weekday: 'long' })

		stats.commitFrequency.hour[hour] =
			(stats.commitFrequency.hour[hour] || 0) + 1
		stats.commitFrequency.dayOfWeek[dayOfWeek] =
			(stats.commitFrequency.dayOfWeek[dayOfWeek] || 0) + 1

		// Additions and Deletions
		stats.totalAdditions += commit.stats.additions
		stats.totalDeletions += commit.stats.deletions
	})

	// Convert Maps to sorted arrays
	stats.topContributors = Array.from(contributors.entries())
		.map(([name, commits]) => ({ name, commits }))
		.sort((a, b) => b.commits - a.commits)

	stats.mostChangedFiles = Array.from(files.entries())
		.map(([filename, changes]) => ({ filename, changes }))
		.sort((a, b) => b.changes - a.changes)

	stats.languageDistribution = Object.fromEntries(languages)

	return stats
}
