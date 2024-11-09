'use client'

import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { ScrollArea } from 'ui'

type CommitDiffProps = {
	filename: string
	patch?: string
}

export default function CommitDiff({ filename, patch }: CommitDiffProps) {
	const getLanguage = (filename: string) => {
		const ext = filename.split('.').pop()?.toLowerCase()
		const languageMap: Record<string, string> = {
			ts: 'typescript',
			tsx: 'typescript',
			js: 'javascript',
			jsx: 'javascript',
			css: 'css',
			html: 'html',
			json: 'json'
		}
		return languageMap[ext || ''] || 'text'
	}

	return (
		<ScrollArea className="h-full max-h-[500px]">
			<div className="p-4">
				<div className="text-sm font-medium mb-2">{filename}</div>
				<SyntaxHighlighter
					language={getLanguage(filename)}
					style={oneDark}
					showLineNumbers
					customStyle={{
						margin: 0,
						borderRadius: '6px',
						background: 'rgba(0,0,0,0.3)'
					}}
				>
					{patch || ''}
				</SyntaxHighlighter>
			</div>
		</ScrollArea>
	)
}
