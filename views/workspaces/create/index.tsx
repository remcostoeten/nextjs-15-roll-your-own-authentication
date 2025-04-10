import { Button } from 'ui'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { CreateWorkspaceForm } from '@/components/workspaces/create-workspace-form'

export default function CreateWorkspaceView() {
	return (
		<div className="container py-6">
			<div className="max-w-2xl mx-auto">
				<Link
					href="/dashboard/workspaces"
					className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6"
				>
					<ArrowLeft className="w-4 h-4 mr-2" />
					Back to Workspaces
				</Link>

				<div className="space-y-6">
					<div>
						<h1 className="text-3xl font-bold">Create Workspace</h1>
						<p className="text-muted-foreground mt-1">
							Create a new workspace to collaborate with your team
						</p>
					</div>

					<CreateWorkspaceForm />
				</div>
			</div>
		</div>
	)
}
