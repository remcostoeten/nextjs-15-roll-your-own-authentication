import { useState } from 'react'
import { fetchLatestCommits } from '@/app/actions/github'

type UseGithubCommitProps = {
	initialCommit?: any
	repo?: string
	branch?: string
}

export function useGithubCommit({
	initialCommit,
	repo = 'remcostoeten/nextjs-15-roll-your-own-authentication',
	branch = 'main',
}: UseGithubCommitProps = {}) {
	const [commit, setCommit] = useState(initialCommit)
	const [isLoading, setIsLoading] = useState(!initialCommit)
	const [error, setError] = useState<string | null>(null)

	const refresh = async () => {
		try {
			setIsLoading(true)
			const result = await fetchLatestCommits(repo, branch, 1)
			setCommit(result.commits[0])
			setError(null)
		} catch (err) {
			setError(
				err instanceof Error ? err.message : 'Failed to fetch commit'
			)
			setCommit(null)
		} finally {
			setIsLoading(false)
		}
	}

	return {
		commit,
		isLoading,
		error,
		refresh,
	}
}
