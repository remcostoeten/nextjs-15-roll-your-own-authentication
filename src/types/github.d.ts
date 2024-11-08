export type GitHubCommit = {
	id: string
	message: string
	date: string
	status: string
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
	author: {
		name: string
		email: string
	}
	merge?: {
		fromBranch: string
		intoBranch: string
	}
}
