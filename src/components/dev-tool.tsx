import React from 'react'
import { Resizable } from '@/shared/components/ui/resizable'

export const DevTool: React.FC = () => {
	return (
		<Resizable
			className="bg-todo-hover rounded-lg p-4"
			minWidth={300}
			minHeight={200}
			defaultWidth={400}
			defaultHeight={300}
		>
			<div className="w-full h-full flex flex-col gap-4 text-sm">
				<div className="space-y-2">
					<h3 className="font-semibold">Environment</h3>
					<div className="grid grid-cols-2 gap-2">
						<div>NODE_ENV:</div>
						<div>{process.env.NODE_ENV}</div>
						<div>Database Type:</div>
						<div>{process.env.DATABASE_TYPE}</div>
					</div>
				</div>

				<div className="space-y-2">
					<h3 className="font-semibold">Authentication</h3>
					<div className="grid grid-cols-2 gap-2">
						<div>Debug Auth:</div>
						<div>
							{process.env.DEBUG_AUTH ? 'Enabled' : 'Disabled'}
						</div>
					</div>
				</div>

				<div className="space-y-2">
					<h3 className="font-semibold">Features</h3>
					<div className="grid grid-cols-2 gap-2">
						<div>Floating Todo:</div>
						<div>
							{process.env.NEXT_PUBLIC_ENABLE_FLOATING_TODO
								? 'Enabled'
								: 'Disabled'}
						</div>
					</div>
				</div>
			</div>
		</Resizable>
	)
}
