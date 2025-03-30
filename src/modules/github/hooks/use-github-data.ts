'use client'

import { useState, useEffect } from 'react'
import { 
	getRepoInfo, 
	getLatestCommits, 
	getRepoLanguages, 
	getRepoContributors, 
	getRepoBranches 
} from '../api/queries'
import type { 
	GithubRepo, 
	GithubCommit, 
	GithubLanguages, 
	GithubContributor, 
	GithubBranch 
} from '../types/github'

interface UseGithubDataOptions {
	owner: string
	repo: string
	commitsCount?: number
}

interface UseGithubDataReturn {
	repo: GithubRepo | null
	commits: GithubCommit[]
	languages: GithubLanguages | null
	contributors: GithubContributor[]
	branches: GithubBranch[]
	isLoading: boolean
	error: string | null
	source: 'api' | 'cache' | 'fallback'
}

export function useGithubData({
	owner,
	repo,
	commitsCount = 5
}: UseGithubDataOptions): UseGithubDataReturn {
	const [data, setData] = useState<UseGithubDataReturn>({
		repo: null,
		commits: [],
		languages: null,
		contributors: [],
		branches: [],
		isLoading: true,
		error: null,
		source: 'api'
	})

	useEffect(() => {
		async function fetchData() {
			try {
				setData(prev => ({ ...prev, isLoading: true }))

				const [repoInfo, commits, languages, contributors, branches] = await Promise.all([
					getRepoInfo(owner, repo),
					getLatestCommits(owner, repo, commitsCount),
					getRepoLanguages(owner, repo),
					getRepoContributors(owner, repo),
					getRepoBranches(owner, repo)
				])

				// Determine the overall source (fallback if any data is fallback)
				const source = [repoInfo, commits, languages, contributors, branches].some(
					r => r.source === 'fallback'
				) ? 'fallback' : 'api'

				// Collect all errors
				const errors = [repoInfo, commits, languages, contributors, branches]
					.map(r => r.error)
					.filter(Boolean)

				setData({
					repo: repoInfo.data,
					commits: commits.data || [],
					languages: languages.data,
					contributors: contributors.data || [],
					branches: branches.data || [],
					isLoading: false,
					error: errors.length > 0 ? errors.join(', ') : null,
					source
				})
			} catch (error) {
				setData(prev => ({
					...prev,
					isLoading: false,
					error: error instanceof Error ? error.message : 'An error occurred while fetching data',
					source: 'fallback'
				}))
			}
		}

		fetchData()
	}, [owner, repo, commitsCount])

	return data
}

// Individual hooks for more granular control
export function useGithubRepo(owner: string, repo: string) {
	const [data, setData] = useState<GithubRepo | null>(null)
	const [isLoading, setIsLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)
	const [source, setSource] = useState<'api' | 'cache' | 'fallback'>('api')

	useEffect(() => {
		async function fetchRepo() {
			try {
				setIsLoading(true)
				const response = await getRepoInfo(owner, repo)
				setData(response.data)
				setError(response.error)
				setSource(response.source)
			} catch (error) {
				setError(error instanceof Error ? error.message : 'Failed to fetch repository data')
				setSource('fallback')
			} finally {
				setIsLoading(false)
			}
		}

		fetchRepo()
	}, [owner, repo])

	return { data, isLoading, error, source }
}

export function useGithubCommits(owner: string, repo: string, count: number = 5) {
	const [data, setData] = useState<GithubCommit[]>([])
	const [isLoading, setIsLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)
	const [source, setSource] = useState<'api' | 'cache' | 'fallback'>('api')

	useEffect(() => {
		async function fetchCommits() {
			try {
				setIsLoading(true)
				const response = await getLatestCommits(owner, repo, count)
				setData(response.data || [])
				setError(response.error)
				setSource(response.source)
			} catch (error) {
				setError(error instanceof Error ? error.message : 'Failed to fetch commits')
				setSource('fallback')
			} finally {
				setIsLoading(false)
			}
		}

		fetchCommits()
	}, [owner, repo, count])

	return { data, isLoading, error, source }
}
