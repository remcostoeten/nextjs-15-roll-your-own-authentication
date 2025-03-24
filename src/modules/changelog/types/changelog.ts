export type ChangelogCategory =
	| 'feature'
	| 'improvement'
	| 'bugfix'
	| 'security'
	| 'performance'
	| 'documentation'
	| 'breaking'

export interface ChangelogEntry {
	id: string
	title: string
	date: string // ISO format date string
	description: string
	categories: ChangelogCategory[]
	version?: string
	author?: string
	githubUrl?: string
	votes?: number // Add votes field
}

export interface ChangelogGroup {
	month: string
	year: string
	entries: ChangelogEntry[]
}
