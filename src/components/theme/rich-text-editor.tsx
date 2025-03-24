import React from 'react'
import { useEditor, EditorContent, Editor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import { Bold, Italic, List, ListOrdered } from 'lucide-react'
import { Resizable } from '@/shared/components/ui/resizable'

interface RichTextEditorProps {
	content: string
	onChange: (content: string) => void
	placeholder?: string
}

interface MenuBarProps {
	editor: Editor | null
}

const MenuBar = ({ editor }: MenuBarProps) => {
	if (!editor) {
		return null
	}

	return (
		<div className="flex space-x-2 mb-1.5 p-1 bg-todo-hover rounded-md">
			<button
				type="button"
				onClick={() => editor.chain().focus().toggleBold().run()}
				className={`p-1.5 rounded ${editor.isActive('bold') ? 'bg-todo-accent text-white' : 'text-gray-400 hover:text-white hover:bg-todo-hover'}`}
				title="Bold"
			>
				<Bold size={14} />
			</button>
			<button
				type="button"
				onClick={() => editor.chain().focus().toggleItalic().run()}
				className={`p-1.5 rounded ${editor.isActive('italic') ? 'bg-todo-accent text-white' : 'text-gray-400 hover:text-white hover:bg-todo-hover'}`}
				title="Italic"
			>
				<Italic size={14} />
			</button>
			<button
				type="button"
				onClick={() => editor.chain().focus().toggleBulletList().run()}
				className={`p-1.5 rounded ${editor.isActive('bulletList') ? 'bg-todo-accent text-white' : 'text-gray-400 hover:text-white hover:bg-todo-hover'}`}
				title="Bullet List"
			>
				<List size={14} />
			</button>
			<button
				type="button"
				onClick={() => editor.chain().focus().toggleOrderedList().run()}
				className={`p-1.5 rounded ${editor.isActive('orderedList') ? 'bg-todo-accent text-white' : 'text-gray-400 hover:text-white hover:bg-todo-hover'}`}
				title="Numbered List"
			>
				<ListOrdered size={14} />
			</button>
		</div>
	)
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({ content, onChange, placeholder = 'Add notes...' }) => {
	const editor = useEditor({
		extensions: [
			StarterKit,
			Placeholder.configure({
				placeholder,
			}),
		],
		content,
		onUpdate: ({ editor }) => {
			onChange(editor.getHTML())
		},
	})

	return (
		<Resizable
			className="bg-todo-hover rounded-lg p-2"
			minWidth={250}
			minHeight={150}
			defaultWidth={400}
			defaultHeight={250}
		>
			<div className="w-full h-full flex flex-col">
				<MenuBar editor={editor} />
				<EditorContent
					editor={editor}
					className="tiptap flex-1 overflow-auto"
				/>
			</div>
		</Resizable>
	)
}

export default RichTextEditor
