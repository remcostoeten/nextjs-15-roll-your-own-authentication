export const ADVANCED_EXAMPLES = {
	mediaManager: {
		title: 'Media Asset Manager',
		description:
			'Professional media file management system with previews, metadata, and organization features',
		features: [
			'Image/video previews',
			'File metadata',
			'Quick view',
			'Drag and drop organization'
		],
		structure: {
			Projects: {
				'Website Redesign': {
					Images: {
						'hero-banner.jpg': null,
						'about-section.png': null,
						team: {
							'john.jpg': null,
							'sarah.jpg': null,
							'mike.jpg': null
						}
					},
					Videos: {
						'product-demo.mp4': null,
						'background-loop.mp4': null
					}
				},
				'Marketing Campaign': {
					'Social Media': {
						'instagram-posts': {
							'post1.jpg': null,
							'post2.jpg': null,
							'post3.jpg': null
						},
						'facebook-ads': {
							'ad1.jpg': null,
							'ad2.jpg': null
						}
					},
					'Email Assets': {
						'header.jpg': null,
						'footer.png': null
					}
				}
			},
			'Stock Assets': {
				Icons: {
					'ui-icons.svg': null,
					'social-icons.svg': null
				},
				Templates: {
					'presentation.pptx': null,
					'document.docx': null
				}
			}
		},
		code: `
import { useState } from 'react'
import { FileTree } from '@/components/file-tree'
import { formatBytes, getFileType } from 'helpers'

interface MediaMetadata {
  type: 'image' | 'video' | 'document'
  size: number
  dimensions?: string
  duration?: string
  lastModified: string
  preview?: string
  tags: string[]
}

export function MediaManager() {
  const [metadata, setMetadata] = useState<Record<string, MediaMetadata>>({
    'Projects/Website Redesign/Images/hero-banner.jpg': {
      type: 'image',
      size: 2048576, // 2MB
      dimensions: '1920x1080',
      lastModified: '2024-03-15',
      preview: '/previews/hero-banner.jpg',
      tags: ['hero', 'website', 'banner']
    },
    'Projects/Website Redesign/Videos/product-demo.mp4': {
      type: 'video',
      size: 15728640, // 15MB
      dimensions: '1920x1080',
      duration: '2:30',
      lastModified: '2024-03-14',
      preview: '/previews/product-demo.jpg',
      tags: ['product', 'demo', 'marketing']
    }
  })

  const [selectedFiles, setSelectedFiles] = useState<string[]>([])
  const [previewFile, setPreviewFile] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState<'all' | 'image' | 'video' | 'document'>('all')

  const handleFileSelect = (path: string) => {
    setSelectedFiles(prev => {
      const newSelection = prev.includes(path)
        ? prev.filter(p => p !== path)
        : [...prev, path]
      return newSelection
    })
  }

  const handleFileMove = async (source: string, target: string) => {
    // Update metadata when files are moved
    setMetadata(prev => {
      const newMetadata = { ...prev }
      const fileMetadata = newMetadata[source]
      delete newMetadata[source]
      newMetadata[target] = {
        ...fileMetadata,
        lastModified: new Date().toString()
      }
      return newMetadata
    })
  }

  const handlePreview = (path: string) => {
    const meta = metadata[path]
    if (!meta) return null

    return (
      <div className="p-4 space-y-4">
        {meta.preview && (
          <div className="relative aspect-video rounded-lg overflow-hidden bg-black">
            {meta.type === 'video' ? (
              <video
                src={\`/api/files/\${path}\`}
                poster={meta.preview}
                controls
                className="w-full h-full object-contain"
              />
            ) : (
              <img
                src={meta.preview}
                alt={path.split('/').pop()}
                className="w-full h-full object-contain"
              />
            )}
          </div>
        )}
        
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <div className="text-zinc-400">Type</div>
            <div className="font-medium">{meta.type}</div>
          </div>
          <div>
            <div className="text-zinc-400">Size</div>
            <div className="font-medium">{formatBytes(meta.size)}</div>
          </div>
          {meta.dimensions && (
            <div>
              <div className="text-zinc-400">Dimensions</div>
              <div className="font-medium">{meta.dimensions}</div>
            </div>
          )}
          {meta.duration && (
            <div>
              <div className="text-zinc-400">Duration</div>
              <div className="font-medium">{meta.duration}</div>
            </div>
          )}
          <div>
            <div className="text-zinc-400">Last Modified</div>
            <div className="font-medium">
              {new Date(meta.lastModified).toLocaleDateString()}
            </div>
          </div>
        </div>

        <div>
          <div className="text-zinc-400 mb-2">Tags</div>
          <div className="flex flex-wrap gap-2">
            {meta.tags.map(tag => (
              <Badge key={tag} variant="secondary">
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-[1fr,300px] gap-4">
      <FileTree
        structure={structure}
        selectedFiles={selectedFiles}
        onSelectionChange={setSelectedFiles}
        enableMultiSelect
        enableDragAndDrop
        onMove={handleFileMove}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        renderFile={(path) => {
          const meta = metadata[path]
          if (!meta) return null
          
          return (
            <div className="flex items-center gap-4 py-1">
              {meta.preview ? (
                <img
                  src={meta.preview}
                  alt={path.split('/').pop()}
                  className="w-8 h-8 rounded object-cover"
                />
              ) : (
                <div className="w-8 h-8 rounded bg-zinc-800 flex items-center justify-center">
                  <FileIcon type={meta.type} />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <div className="truncate">{path.split('/').pop()}</div>
                <div className="text-xs text-zinc-400">
                  {formatBytes(meta.size)} • {meta.type}
                </div>
              </div>
            </div>
          )
        }}
        contextMenuItems={[
          {
            label: 'Preview',
            action: (path) => setPreviewFile(path)
          },
          {
            label: 'Download',
            action: (path) => window.open(\`/api/files/\${path}\`, '_blank')
          },
          {
            label: 'Share',
            action: (path) => {
              // Share implementation
            }
          },
          {
            label: 'Delete',
            action: (path) => {
              // Delete implementation
            }
          }
        ]}
      />

      <div className="border-l border-zinc-800 pl-4">
        {previewFile ? (
          handlePreview(previewFile)
        ) : (
          <div className="text-center p-8 text-zinc-400">
            Select a file to preview
          </div>
        )}
      </div>
    </div>
  )
}`
	},

	gitBrowser: {
		title: 'Git Repository Browser',
		description:
			'Feature-rich Git repository browser with file status, diff viewer, and commit history',
		features: [
			'File status indicators',
			'Inline diff viewer',
			'Commit history',
			'Branch management'
		],
		structure: {
			src: {
				components: {
					ui: {
						'Button.tsx': null,
						'Input.tsx': null,
						'Card.tsx': null,
						'Dialog.tsx': null
					},
					layout: {
						'Header.tsx': null,
						'Sidebar.tsx': null,
						'Footer.tsx': null
					},
					features: {
						auth: {
							'LoginForm.tsx': null,
							'AuthContext.tsx': null
						},
						dashboard: {
							'Overview.tsx': null,
							'Stats.tsx': null
						}
					}
				},
				lib: {
					api: {
						'client.ts': null,
						'types.ts': null
					},
					utils: {
						'format.ts': null,
						'validate.ts': null
					}
				},
				pages: {
					'index.tsx': null,
					'login.tsx': null,
					'dashboard.tsx': null
				}
			},
			tests: {
				components: {
					'Button.test.tsx': null,
					'Input.test.tsx': null
				},
				utils: {
					'format.test.ts': null
				}
			},
			'.gitignore': null,
			'package.json': null,
			'tsconfig.json': null,
			'README.md': null
		},
		code: `
import { useState, useEffect } from 'react'
import { FileTree } from '@/components/file-tree'

interface GitStatus {
  status: 'modified' | 'added' | 'deleted' | 'renamed' | 'untracked'
  stagedChanges: number
  unstagedChanges: number
  lastCommit: {
    hash: string
    message: string
    author: string
    date: string
  }
}

// ... rest of the interfaces ...

export function GitBrowser() {
  // ... existing state declarations ...

  const [fileStatus, setFileStatus] = useState<Record<string, GitStatus>>({
    'src/components/ui/Button.tsx': {
      status: 'modified',
      stagedChanges: 5,
      unstagedChanges: 2,
      lastCommit: {
        hash: 'abc123',
        message: 'Update button styles',
        author: 'John Doe',
        date: '2024-03-15'
      }
    }
  })

  // ... rest of component logic ...

  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-2">
        <Plus className="w-4 h-4 text-green-500" />
        <span>
          {Object.values(fileStatus).reduce((acc: number, status) => 
            acc + status.stagedChanges, 0)} staged
        </span>
      </div>
      <div className="flex items-center gap-2">
        <Circle className="w-4 h-4 text-yellow-500" />
        <span>
          {Object.values(fileStatus).reduce((acc: number, status) => 
            acc + status.unstagedChanges, 0)} unstaged
        </span>
      </div>
    </div>
  )
}
`
	}
}
