import { useState } from 'react'
import { BlockEditor } from './block-editor'
import { motion, AnimatePresence } from 'framer-motion'

export function PostEditor({
  initialTitle = '',
  initialContent = '',
  onSave
}: {
  initialTitle?: string
  initialContent?: any
  onSave: (data: { title: string; content: any }) => void
}) {
  const [title, setTitle] = useState(initialTitle)
  const [content, setContent] = useState(initialContent)
  const [markdown, setMarkdown] = useState('')
  const [showPreview, setShowPreview] = useState(false)

  return (
    <form
      onSubmit={e => {
        e.preventDefault()
        onSave({ title, content })
      }}
      className="space-y-4"
    >
      <div>
        <input
          className="w-full border rounded px-3 py-2"
          placeholder="Title"
          value={title}
          onChange={e => setTitle(e.target.value)}
        />
      </div>
      <div>
        <BlockEditor
          value={content}
          onChange={(json, md) => {
            setContent(json)
            setMarkdown(md)
          }}
        />
      </div>
      <div>
        <button type="button" className="px-3 py-1 bg-gray-200 rounded mr-2" onClick={() => setShowPreview(v => !v)}>
          {showPreview ? 'Hide' : 'Show'} Preview
        </button>
        <button type="submit" className="px-4 py-2 bg-primary text-white rounded">
          Save
        </button>
      </div>
      <AnimatePresence>
        {showPreview && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.2 }}
            className="border rounded p-4 bg-gray-50 mt-2"
          >
            <div dangerouslySetInnerHTML={{ __html: markdown }} />
          </motion.div>
        )}
      </AnimatePresence>
    </form>
  )
} 