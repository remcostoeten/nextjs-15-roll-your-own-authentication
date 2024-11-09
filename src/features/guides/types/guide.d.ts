export type GuideSection = {
	id: string
	label: string
	icon?: React.ComponentType<{ className?: string }>
	subsections?: GuideSection[]
}

export type GuideMetadata = {
	title: string
	description: string
	sections: GuideSection[]
	lastUpdated?: string
	author?: string
}
