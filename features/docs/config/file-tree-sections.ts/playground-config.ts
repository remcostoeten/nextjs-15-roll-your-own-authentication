import { FileStructure } from '../../components/file-tree'

// src/features/docs/config/playground-config.ts
export interface PlaygroundConfig {
	theme: {
		label: string
		type: 'radio'
		options: ['light', 'dark', 'custom']
		default: 'dark'
	}
	enableFileIcons: {
		label: string
		type: 'boolean'
		default: true
	}
	showIndentationLines: {
		label: string
		type: 'boolean'
		default: true
	}
	indentationWidth: {
		label: string
		type: 'number'
		min: 8
		max: 32
		step: 4
		default: 24
	}
	enableDragAndDrop: {
		label: string
		type: 'boolean'
		default: false
	}
	enableMultiSelect: {
		label: string
		type: 'boolean'
		default: false
	}
	enableSearch: {
		label: string
		type: 'boolean'
		default: false
	}
	animations: {
		label: string
		type: 'select'
		options: ['none', 'minimal', 'full']
		default: 'minimal'
	}
}

export const PLAYGROUND_CONFIG: PlaygroundConfig = {
	theme: {
		label: 'Theme',
		type: 'radio',
		options: ['light', 'dark', 'custom'],
		default: 'dark'
	},
	enableFileIcons: {
		label: 'File Icons',
		type: 'boolean',
		default: true
	},
	showIndentationLines: {
		label: 'Indentation Lines',
		type: 'boolean',
		default: true
	},
	indentationWidth: {
		label: 'Indentation Width',
		type: 'number',
		min: 8,
		max: 32,
		step: 4,
		default: 24
	},
	enableDragAndDrop: {
		label: 'Drag and Drop',
		type: 'boolean',
		default: false
	},
	enableMultiSelect: {
		label: 'Multi Select',
		type: 'boolean',
		default: false
	},
	enableSearch: {
		label: 'Search',
		type: 'boolean',
		default: false
	},
	animations: {
		label: 'Animations',
		type: 'select',
		options: ['none', 'minimal', 'full'],
		default: 'minimal'
	}
}

export const PLAYGROUND_STRUCTURE: FileStructure = {
	src: {
		app: {
			'layout.tsx': null,
			'page.tsx': null,
			'(auth)': {
				login: {
					'page.tsx': null
				},
				register: {
					'page.tsx': null
				}
			}
		},
		components: {
			ui: {
				'button.tsx': null,
				'input.tsx': null,
				'card.tsx': null
			},
			forms: {
				'login-form.tsx': null,
				'register-form.tsx': null
			}
		},
		lib: {
			'utils.ts': null,
			'types.ts': null
		}
	},
	public: {
		images: {
			'logo.svg': null,
			'hero.png': null
		}
	},
	'package.json': null,
	'tsconfig.json': null,
	'README.md': null
}

export default { PLAYGROUND_CONFIG, PLAYGROUND_STRUCTURE }
