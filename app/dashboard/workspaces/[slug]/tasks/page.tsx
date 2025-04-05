import { getWorkspaceBySlug, getWorkspaceMembers, getWorkspaceTasks } from "@/modules/workspaces/api/queries"
import { TaskList } from "@/modules/workspaces/components/task-list"
import type { Metadata } from "next"

interface TasksPageProps {
  params: {
    slug: string
  }
}

export async function generateMetadata({ params }: TasksPageProps): Promise<Metadata> {
  const workspace = await getWorkspaceBySlug(params.slug)

  if (!workspace) {
    return {
      title: "Tasks Not Found",
    }
  }

  return {
    title: `${workspace.name} - Tasks`,
    description: `Tasks for workspace: ${workspace.name}`,
  }
}

export default async function TasksPage({ params }: TasksPageProps) {
  const workspace = await getWorkspaceBySlug(params.slug)

  if (!workspace) {
    return null // This will be handled by the WorkspaceLayout
  }

  const members = await getWorkspaceMembers(workspace.id)
  const tasks = await getWorkspaceTasks(workspace.id)

  return (
    <div className="container py-8">
      <TaskList workspaceId={workspace.id} tasks={tasks} members={members} />
    </div>
  )
}

