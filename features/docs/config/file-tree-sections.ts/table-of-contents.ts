import { Section } from './sections'

type TableOfContents = {
	sections: Section[]
}

export const TABLE_OF_CONTENTS = {
	sections: [
		{
			title: 'Introduction',
			id: 'introduction',
			items: [
				{ title: 'Overview', id: 'overview' },
				{ title: 'Key Features', id: 'key-features' },
				{ title: 'Browser Support', id: 'browser-support' },
				{ title: 'Accessibility', id: 'accessibility' }
			]
		},
		{
			title: 'Getting Started',
			id: 'getting-started',
			items: [
				{ title: 'Installation', id: 'installation' },
				{ title: 'Quick Start', id: 'quick-start' },
				{ title: 'Basic Usage', id: 'basic-usage' },
				{ title: 'TypeScript Setup', id: 'typescript-setup' }
			]
		},
		{
			title: 'Core Concepts',
			id: 'core-concepts',
			items: [
				{ title: 'File Structure Format', id: 'file-structure' },
				{ title: 'Component Architecture', id: 'architecture' },
				{ title: 'Event System', id: 'events' },
				{ title: 'State Management', id: 'state' }
			]
		},
		{
			title: 'Styling & Theming',
			id: 'styling',
			items: [
				{ title: 'Default Themes', id: 'default-themes' },
				{ title: 'Custom Themes', id: 'custom-themes' },
				{ title: 'Dark Mode', id: 'dark-mode' },
				{ title: 'CSS Customization', id: 'css' },
				{ title: 'Icon System', id: 'icons' }
			]
		},
		{
			title: 'Basic Features',
			id: 'basic-features',
			items: [
				{ title: 'File Icons', id: 'file-icons' },
				{ title: 'Collapsible Folders', id: 'collapsible' },
				{ title: 'Selection', id: 'selection' },
				{ title: 'Indentation', id: 'indentation' },
				{ title: 'File Preview', id: 'preview' }
			]
		},
		{
			title: 'Advanced Features',
			id: 'advanced-features',
			items: [
				{ title: 'Drag and Drop', id: 'dnd' },
				{ title: 'Multi-Selection', id: 'multi-select' },
				{ title: 'Search & Filter', id: 'search' },
				{ title: 'Context Menu', id: 'context-menu' },
				{ title: 'Keyboard Navigation', id: 'keyboard' },
				{ title: 'Virtual Scrolling', id: 'virtual-scroll' },
				{ title: 'File Operations', id: 'file-operations' }
			]
		},
		{
			title: 'Interactive Examples',
			id: 'examples',
			items: [
				{ title: 'Basic Tree', id: 'basic-example' },
				{ title: 'File Manager', id: 'file-manager' },
				{ title: 'Project Explorer', id: 'project-explorer' },
				{ title: 'Asset Browser', id: 'asset-browser' }
			]
		},
		{
			title: 'API Reference',
			id: 'api',
			items: [
				{
					title: 'Props',
					id: 'props',
					subitems: [
						{ title: 'Core Props', id: 'core-props' },
						{ title: 'Styling Props', id: 'styling-props' },
						{ title: 'Feature Props', id: 'feature-props' },
						{ title: 'Event Props', id: 'event-props' }
					]
				},
				{
					title: 'Methods',
					id: 'methods',
					subitems: [
						{ title: 'Tree Operations', id: 'tree-methods' },
						{ title: 'Selection Methods', id: 'selection-methods' },
						{ title: 'Search Methods', id: 'search-methods' }
					]
				},
				{ title: 'TypeScript Types', id: 'types' },
				{ title: 'Custom Hooks', id: 'hooks' }
			]
		},
		{
			title: 'Advanced Usage',
			id: 'advanced-usage',
			items: [
				{ title: 'Custom Renderers', id: 'custom-renderers' },
				{ title: 'Plugin System', id: 'plugins' },
				{ title: 'State Persistence', id: 'persistence' },
				{ title: 'Performance Optimization', id: 'performance' },
				{ title: 'Server Integration', id: 'server' }
			]
		},
		{
			title: 'Recipes & Patterns',
			id: 'recipes',
			items: [
				{ title: 'Lazy Loading', id: 'lazy-loading' },
				{ title: 'Remote Data', id: 'remote-data' },
				{ title: 'Undo/Redo', id: 'undo-redo' },
				{ title: 'File Upload', id: 'file-upload' },
				{ title: 'Real-time Updates', id: 'real-time' }
			]
		},
		{
			title: 'Integration Guides',
			id: 'integration',
			items: [
				{ title: 'Next.js', id: 'nextjs' },
				{ title: 'Vite', id: 'vite' },
				{ title: 'Redux', id: 'redux' },
				{ title: 'React Query', id: 'react-query' }
			]
		},
		{
			title: 'Customization',
			id: 'customization',
			items: [
				{ title: 'Custom Icons', id: 'custom-icons' },
				{ title: 'Custom Themes', id: 'custom-themes' },
				{ title: 'Custom Renderers', id: 'custom-renderers' },
				{ title: 'Custom Actions', id: 'custom-actions' }
			]
		},
		{
			title: 'Development',
			id: 'development',
			items: [
				{ title: 'Contributing', id: 'contributing' },
				{ title: 'Plugin Development', id: 'plugin-dev' },
				{ title: 'Testing', id: 'testing' },
				{ title: 'Performance', id: 'performance' }
			]
		},
		{
			title: 'Troubleshooting',
			id: 'troubleshooting',
			items: [
				{ title: 'Common Issues', id: 'common-issues' },
				{ title: 'Performance Issues', id: 'perf-issues' },
				{ title: 'TypeScript Errors', id: 'ts-errors' },
				{ title: 'Known Limitations', id: 'limitations' }
			]
		},
		{
			title: 'Migration Guides',
			id: 'migration',
			items: [
				{ title: 'From v1 to v2', id: 'v1-to-v2' },
				{ title: 'Breaking Changes', id: 'breaking-changes' }
			]
		}
	]
}
export default function flattenTableOfContents(
	tableOfContents: TableOfContents
) {
	return tableOfContents.sections.flatMap((section) => [
		{ title: section.title, id: section.id, level: 1 },
		...(section.items || []).map((item) =>
			'subitems' in item
				? [
						{ title: item.title, id: item.id, level: 2 },
						...(item.subitems || []).map((subitem) => ({
							title: subitem.title,
							id: subitem.id,
							level: 3
						}))
					]
				: [{ title: item.title, id: item.id, level: 2 }]
		)
	])
}
