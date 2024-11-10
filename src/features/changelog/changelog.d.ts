/**
 * @description A configuration (flag) file which allows with a simple boolean flag to toggle functionallities on or off sidewide.
 * 
 */

/**
 * @description A configuration (flag) file which allows with a simple boolean flag to toggle functionallities on or off sidewide.
 * 
 */

/**
 * @description A configuration (flag) file which allows with a simple boolean flag to toggle functionallities on or off sidewide.
 * 
 */

export type DiffViewProps = {
	filename: string
	additions: number
	deletions: number
	patch?: string
	status: string
	branch: string
	commitSha: string
}

export type ChangelogProps = {
	className?: string
}

export type CommitType =
	| 'feature'
	| 'fix'
	| 'chore'
	| 'docs'
	| 'refactor'
	| 'style'
	| 'test'

export type MergeInfo = {
	fromBranch: string
	intoBranch: string
}

export type FileFilter = {
	search: string
	status: string[]
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


/**
 * @example
 * 
 */
