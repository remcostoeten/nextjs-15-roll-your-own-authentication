import { useState, useEffect } from 'react'
import { fetchLatestCommits, fetchRepoMetadata } from '@/app/actions/github'

interface UseGithubDataOptions {
	owner: string
	repo: string
	branch?: string
	commitsCount?: number
}

interface Commit {
	sha: string
	message: string
	author: string
	authorAvatar: string
	date: string
	url: string
}

interface RepoData {
	name: string
	description: string
	created_at: string
	updated_at: string
	stars: number
	forks: number
	branches: number
	contributors: number
	languages: Array<{ name: string; percentage: string }>
}

interface UseGithubDataReturn {
	commits: Commit[]
	repoData: RepoData | null
	isLoading: boolean
	error: string | null
	refresh: () => Promise<void>
}

const CACHE_KEY_PREFIX = 'github-data'
const CACHE_DURATION = 60 * 60 * 1000 // 1 hour

export function useGithubData({
	owner,
	repo,
	branch = 'main',
	commitsCount = 5,
}: UseGithubDataOptions): UseGithubDataReturn {
	const [commits, setCommits] = useState<Commit[]>([])
	const [repoData, setRepoData] = useState<RepoData | null>(null)
	const [isLoading, setIsLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)

	const cacheKey = `${CACHE_KEY_PREFIX}-${owner}-${repo}`
	const cacheExpiryKey = `${cacheKey}-expiry`

	const fetchData = async () => {
		try {
			setIsLoading(true)
			setError(null)

			// Check cache first
			if (typeof window !== 'undefined') {
				const cachedData = localStorage.getItem(cacheKey)
				const cacheExpiry = localStorage.getItem(cacheExpiryKey)

				if (cachedData && cacheExpiry && Date.now() < Number(cacheExpiry)) {
					const { commits: cachedCommits, repoData: cachedRepoData } = JSON.parse(cachedData)
					setCommits(cachedCommits)
					setRepoData(cachedRepoData)
					setIsLoading(false)
					return
				}
			}

			// Fetch fresh data
			const [commitsResult, repoResult] = await Promise.all([
				fetchLatestCommits(`${owner}/${repo}`, branch, commitsCount),
				fetchRepoMetadata(`${owner}/${repo}`),
			])

			if (commitsResult.success && repoResult.success) {
				setCommits(commitsResult.commits)
				setRepoData(repoResult.data)

				// Cache the results
				if (typeof window !== 'undefined') {
					localStorage.setItem(
						cacheKey,
						JSON.stringify({
							commits: commitsResult.commits,
							repoData: repoResult.data,
						})
					)
					localStorage.setItem(cacheExpiryKey, String(Date.now() + CACHE_DURATION))
				}
			}
		} catch (err) {
			setError(err instanceof Error ? err.message : 'Failed to fetch GitHub data')
			console.error('Error fetching GitHub data:', err)
		} finally {
			setIsLoading(false)
		}
	}

	useEffect(() => {
		fetchData()
	}, [owner, repo, branch, commitsCount])

	const refresh = async () => {
		// Clear cache
		if (typeof window !== 'undefined') {
			localStorage.removeItem(cacheKey)
			localStorage.removeItem(cacheExpiryKey)
		}
		await fetchData()
	}

	return {
		commits,
		repoData,
		isLoading,
		error,
		refresh,
	}
}
