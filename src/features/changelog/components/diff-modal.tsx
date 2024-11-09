'use client'

import CodeBlock from '@/shared/_docs/code-block/code-block'
import { Dialog, DialogContent } from 'ui'
type DiffModalProps = {
	isOpen: boolean
	onClose: () => void
	diffContent: string
}

export default function DiffModal({
	isOpen,
	onClose,
	diffContent
}: DiffModalProps) {
	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent className="max-w-4xl max-h-[80vh] overflow-auto">
				<CodeBlock
					code={diffContent}
					language="diff"
					isDiff={true}
					showLineNumbers={true}
					showMetaInfo={false}
					className="w-full"
				/>
			</DialogContent>
		</Dialog>
	)
}
