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
