'use server'

import { GitHubApi } from '@/modules/github/api/github-api'

interface GitHubCommit {
	sha: string
	commit: {
		message: string
		author: {
			name: string
			date: string
		}
	}
	html_url: string
	author: {
		login: string
		avatar_url: string
	}
}

interface GitHubRepoMetadata {
	name: string
	description: string
	created_at: string
	updated_at: string
	stargazers_count: number
	forks_count: number
	default_branch: string
	language: string
	languages_url: string
}

export async function fetchLatestCommits(
	repo: string,
	branch = 'main',
	count = 5
) {
	try {
		console.log(`Fetching commits for ${repo} on branch ${branch}...`)
		const [owner, repository] = repo.split('/')
		const github = GitHubApi.getInstance()
		const commits = await github.getCommits(
			owner,
			repository,
			branch,
			count
		)

		return {
			success: true,
			commits: commits.map((commit) => ({
				sha: commit.sha,
				message: commit.commit.message,
				author: commit.author?.login || commit.commit.author.name,
				authorAvatar: commit.author?.avatar_url || '',
				date: commit.commit.author.date,
				url: commit.html_url,
			})),
			source: 'api',
		}
	} catch (error) {
		console.error('Error fetching commits:', error)
		throw error instanceof Error
			? error
			: new Error('Failed to fetch commits')
	}
}

export async function fetchRepoMetadata(repo: string) {
	try {
		console.log(`Fetching repository metadata for ${repo}...`)
		const [owner, repository] = repo.split('/')
		const github = GitHubApi.getInstance()

		const [repoData, languages, branches, contributors] = await Promise.all(
			[
				github.getRepository(owner, repository),
				github.getLanguages(owner, repository),
				github.getBranches(owner, repository),
				github.getContributors(owner, repository),
			]
		)

		// Calculate language percentages
		const totalBytes = Object.values(languages).reduce((a, b) => a + b, 0)
		const languagePercentages = Object.entries(languages).map(
			([name, bytes]) => ({
				name,
				percentage: ((bytes / totalBytes) * 100).toFixed(1),
			})
		)

		return {
			success: true,
			data: {
				name: repoData.name,
				description: repoData.description,
				created_at: repoData.created_at,
				updated_at: repoData.updated_at,
				stars: repoData.stargazers_count,
				forks: repoData.forks_count,
				branches: branches.length,
				contributors: contributors.length,
				languages: languagePercentages,
			},
			source: 'api',
		}
	} catch (error) {
		console.error('Error fetching repository metadata:', error)
		throw error instanceof Error
			? error
			: new Error('Failed to fetch repository metadata')
	}
}
