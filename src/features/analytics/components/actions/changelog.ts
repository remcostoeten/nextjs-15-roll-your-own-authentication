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
	state: 'ready' | 'error' | 'building' | 'canceled'
	meta?: {
		branch?: string
		commit?: {
			sha?: string
			message?: string
		}
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
	const VERCEL_TOKEN = process.env.VERCEL_TOKEN
	const PROJECT_ID = process.env.VERCEL_PROJECT_ID
	const TEAM_ID = process.env.VERCEL_TEAM_ID

	if (!VERCEL_TOKEN || !PROJECT_ID) {
		throw new Error('Vercel configuration missing')
	}

	try {
		const response = await fetch(
			`https://api.vercel.com/v6/deployments?projectId=${PROJECT_ID}${TEAM_ID ? `&teamId=${TEAM_ID}` : ''}`,
			{
				headers: {
					Authorization: `Bearer ${VERCEL_TOKEN}`,
					'Content-Type': 'application/json'
				}
			}
		)

		if (!response.ok) {
			throw new Error(
				`Failed to fetch deployments: ${response.statusText}`
			)
		}

		const data = await response.json()
		return data.deployments
	} catch (error) {
		console.error('Error fetching Vercel deployments:', error)
		return []
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
	averageCommitsPerDay: number
	commitTrend: Array<{
		date: string
		commits: number
	}>
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
		},
		averageCommitsPerDay: 0,
		commitTrend: []
	}

	// Calculate stats from commits
	const contributors = new Map<string, number>()
	const files = new Map<string, number>()
	const languages = new Map<string, number>()
	const commitsByDate = new Map<string, number>()

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

		// Track commits by date for trend analysis
		const dateStr = date.toISOString().split('T')[0]
		commitsByDate.set(dateStr, (commitsByDate.get(dateStr) || 0) + 1)
	})

	// Calculate average commits per day
	const uniqueDays = commitsByDate.size
	stats.averageCommitsPerDay = stats.totalCommits / (uniqueDays || 1)

	// Generate commit trend data
	stats.commitTrend = Array.from(commitsByDate.entries())
		.sort(([a], [b]) => a.localeCompare(b))
		.map(([date, commits]) => ({ date, commits }))

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
