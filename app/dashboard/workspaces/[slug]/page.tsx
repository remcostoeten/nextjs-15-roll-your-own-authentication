import WorkspaceView from '@/views/workspaces/[slug]'

interface WorkspacePageProps {
	params: {
		slug: string
	}
}

export default function WorkspacePage({ params }: WorkspacePageProps) {
	return <WorkspaceView params={params} />
}
