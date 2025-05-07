import { useEditor, EditorContent, BubbleMenu, NodeViewWrapper, NodeViewContent, ReactNodeViewRenderer } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import Heading from '@tiptap/extension-heading'
import Link from '@tiptap/extension-link'
import Mention from '@tiptap/extension-mention'
import TaskList from '@tiptap/extension-task-list'
import TaskItem from '@tiptap/extension-task-item'
import MarkdownIt from 'markdown-it'
import { useEffect, useState } from 'react'
import { generateWithGemini } from '@/shared/utils/gemini-ai'

function generateBlockId() {
  return 'block-' + Math.random().toString(36).slice(2, 10)
}

// Block handle NodeView wrapper with anchor link, now as a factory
const createBlockHandle = (postId: string | number | undefined) => (props: any) => {
  const { node, updateAttributes } = props
  const [copied, setCopied] = useState(false)
  // Assign a blockId if not present
  useEffect(() => {
    if (!node.attrs.blockId) {
      updateAttributes({ blockId: generateBlockId() })
    }
  }, [])
  const blockId = node.attrs.blockId
  const blockUrl = postId && blockId ? `/posts/${postId}#${blockId}` : ''
  return (
    <NodeViewWrapper as="div" className="group flex items-start relative hover:bg-gray-50 focus-within:bg-gray-50">
      <span className="block-handle opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity duration-150 w-6 flex-shrink-0 flex items-center justify-center cursor-pointer select-none relative">
        {blockUrl && (
          <button
            type="button"
            className="text-gray-400 hover:text-primary focus:outline-none"
            onClick={() => {
              navigator.clipboard.writeText(window.location.origin + blockUrl)
              setCopied(true)
              setTimeout(() => setCopied(false), 1200)
            }}
            tabIndex={-1}
            aria-label="Copy block link"
          >
            <span className="w-2 h-2 bg-gray-400 rounded-full inline-block"></span>
            {copied && (
              <span className="absolute left-6 bg-black text-white text-xs rounded px-2 py-1 ml-2 z-10">Copied!</span>
            )}
          </button>
        )}
      </span>
      <div className="flex-1 min-w-0">
        <NodeViewContent />
      </div>
    </NodeViewWrapper>
  )
}

export function BlockEditor({
  value,
  onChange,
  postLinks = [],
  postId
}: {
  value?: any
  onChange?: (json: any, markdown: string) => void
  postLinks?: { id: number; title: string }[]
  postId?: number | string
}) {
  const [aiPrompt, setAiPrompt] = useState('')
  const [aiModal, setAiModal] = useState(false)
  const [aiLoading, setAiLoading] = useState(false)
  const [aiError, setAiError] = useState('')

  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({ placeholder: 'Type "/" for commands, [[ for links...' }),
      Heading,
      Link,
      Mention.configure({
        HTMLAttributes: { class: 'mention' },
        suggestion: {
          items: ({ query }: { query: string }) =>
            postLinks.filter(p => p.title.toLowerCase().includes(query.toLowerCase())).slice(0, 5),
          render: () => {
            let component: any
            let popup: HTMLDivElement
            return {
              onStart: (props: any) => {
                component = document.createElement('div')
                component.className = 'bg-white border rounded shadow p-2'
                component.innerHTML = props.items.map((item: any) => `<div>${item.title}</div>`).join('')
                popup = component
                document.body.appendChild(popup)
              },
              onUpdate: (props: any) => {
                component.innerHTML = props.items.map((item: any) => `<div>${item.title}</div>`).join('')
              },
              onKeyDown: () => false,
              onExit: () => {
                if (popup) document.body.removeChild(popup)
              }
            }
          }
        }
      }),
      TaskList,
      TaskItem.configure({ nested: true, HTMLAttributes: { class: 'tiptap-task-item' } }).extend({
        addNodeView() {
          return ReactNodeViewRenderer(createBlockHandle(postId))
        },
        addAttributes() {
          return {
            blockId: {
              default: null
            }
          }
        }
      })
    ],
    content: value || '',
    onUpdate({ editor }) {
      onChange?.(editor.getJSON(), editor.getHTML())
    },
    onTransaction({ editor }) {
      // Detect /ai command
      const text = editor.state.doc.textBetween(0, editor.state.doc.content.size, '\n')
      if (text.endsWith('/ai')) {
        setAiModal(true)
        setTimeout(() => editor.commands.deleteRange({ from: editor.state.selection.from - 3, to: editor.state.selection.from }), 0)
      }
    }
  })

  useEffect(() => {
    if (editor && value) editor.commands.setContent(value)
  }, [editor, value])

  async function handleAiSubmit(e: React.FormEvent) {
    e.preventDefault()
    setAiLoading(true)
    setAiError('')
    try {
      const result = await generateWithGemini(aiPrompt)
      editor?.commands.insertContent(result)
      setAiModal(false)
      setAiPrompt('')
    } catch (err: any) {
      setAiError(err.message || 'AI error')
    } finally {
      setAiLoading(false)
    }
  }

  return (
    <div className="prose max-w-none border rounded p-4 bg-white relative">
      <EditorContent editor={editor} />
      {aiModal && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <form onSubmit={handleAiSubmit} className="bg-white rounded shadow-lg p-6 w-full max-w-md space-y-4">
            <div className="font-bold text-lg">AI Command</div>
            <input
              className="w-full border rounded px-3 py-2"
              placeholder="Ask Gemini anything..."
              value={aiPrompt}
              onChange={e => setAiPrompt(e.target.value)}
              disabled={aiLoading}
              autoFocus
            />
            {aiError && <div className="text-red-500 text-sm">{aiError}</div>}
            <div className="flex gap-2">
              <button type="button" className="px-3 py-1 bg-gray-200 rounded" onClick={() => setAiModal(false)} disabled={aiLoading}>Cancel</button>
              <button type="submit" className="px-4 py-2 bg-primary text-white rounded" disabled={aiLoading}>
                {aiLoading ? 'Thinking...' : 'Generate'}
              </button>
            </div>
          </form>
        </div>
      )}
      {/* BubbleMenu for /ai or formatting can go here */}
    </div>
  )
} 