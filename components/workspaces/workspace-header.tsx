import { Button } from '@/components/ui/button'
import { Settings, Users } from 'lucide-react'
import Link from 'next/link'
import { type workspaces } from '@/server/db/schema'

interface WorkspaceHeaderProps {
	workspace: typeof workspaces.$inferSelect
	role: string
}

export function WorkspaceHeader({ workspace, role }: WorkspaceHeaderProps) {
	return (
		<div className="border-b">
			<div className="container py-4">
				<div className="flex items-center justify-between">
					<div>
						<h1 className="text-2xl font-bold">{workspace.name}</h1>
						{workspace.description && (
							<p className="text-muted-foreground mt-1">
								{workspace.description}
							</p>
						)}
					</div>
					<div className="flex items-center gap-2">
						<Link
							href={`/dashboard/workspaces/${workspace.slug}/members`}
						>
							<Button
								variant="outline"
								size="sm"
							>
								<Users className="w-4 h-4 mr-2" />
								Members
							</Button>
						</Link>
						{role === 'owner' && (
							<Link
								href={`/dashboard/workspaces/${workspace.slug}/settings`}
							>
								<Button
									variant="outline"
									size="sm"
								>
									<Settings className="w-4 h-4 mr-2" />
									Settings
								</Button>
							</Link>
						)}
					</div>
				</div>
			</div>
		</div>
	)
}
