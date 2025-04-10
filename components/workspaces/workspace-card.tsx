import Link from 'next/link'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Users, Settings } from 'lucide-react'
import { Workspace } from '../dashboard/sidebar/workspace-switcher'
interface WorkspaceCardProps {
	workspace: Workspace
	role: string
}

export function WorkspaceCard({ workspace, role }: WorkspaceCardProps) {
	return (
		<Link href={`/dashboard/workspaces/${workspace.slug}`}>
			<Card className="h-full hover:bg-accent/50 transition-colors">
				<CardHeader>
					<div className="flex items-center justify-between">
						<h3 className="font-semibold">{workspace.name}</h3>
						{role === 'owner' && (
							<Link
								href={`/dashboard/workspaces/${workspace.slug}/settings`}
								onClick={(e) => e.stopPropagation()}
								className="text-muted-foreground hover:text-foreground"
							>
								<Settings className="w-4 h-4" />
							</Link>
						)}
					</div>
					{workspace.description && (
						<p className="text-sm text-muted-foreground mt-1">
							{workspace.description}
						</p>
					)}
				</CardHeader>
				<CardContent>
					<div className="flex items-center text-sm text-muted-foreground">
						<Users className="w-4 h-4 mr-2" />
						<span>Workspace</span>
					</div>
				</CardContent>
				<CardFooter className="text-xs text-muted-foreground">
					Created {new Date(workspace.createdAt).toLocaleDateString()}
				</CardFooter>
			</Card>
		</Link>
	)
}
