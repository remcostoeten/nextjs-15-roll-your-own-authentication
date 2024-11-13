export interface Section {
	items?: Array<{
		title: string
		id: string
		subitems?: Array<{ title: string; id: string }>
	}>
	id: string
	title: string
	description?: string
	subsections: {
		id: string
		title: string
		description?: string
	}[]
}

export const SECTIONS: Section[] = [
	{
		id: 'getting-started',
		title: 'Getting Started',
		description:
			'Everything you need to start using FileTree in your project',
		subsections: [
			{
				id: 'installation',
				title: 'Installation',
				description: 'How to install and set up FileTree'
			},
			{
				id: 'quick-start',
				title: 'Quick Start',
				description: 'Build your first file tree in minutes'
			},
			{
				id: 'basic-usage',
				title: 'Basic Usage',
				description: 'Core concepts and basic examples'
			}
		]
	},
	{
		id: 'core-concepts',
		title: 'Core Concepts',
		description: 'Understanding how FileTree works',
		subsections: [
			{
				id: 'file-structure',
				title: 'File Structure',
				description: 'How to structure your file tree data'
			},
			{
				id: 'theming',
				title: 'Theming System',
				description: 'Customizing the look and feel'
			},
			{
				id: 'icons',
				title: 'Icon System',
				description: 'Working with file and folder icons'
			},
			{
				id: 'events',
				title: 'Event Handling',
				description: 'Responding to user interactions'
			}
		]
	}
]

export default SECTIONS
