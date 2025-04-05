import { getWorkspaceBySlug, getWorkspaceMembers, getWorkspaceTasks } from "@/modules/workspaces/api/queries"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Briefcase, Users, CheckSquare, Clock, Plus } from "lucide-react"
import Link from "next/link"
import { format } from "date-fns"
import type { Metadata } from "next"

interface WorkspacePageProps {
  params: {
    slug: string
  }
}

export async function generateMetadata({ params }: WorkspacePageProps): Promise<Metadata> {
  const workspace = await getWorkspaceBySlug(params.slug)

  if (!workspace) {
    return {
      title: "Workspace Not Found",
    }
  }

  return {
    title: workspace.name,
    description: workspace.description || `Workspace: ${workspace.name}`,
  }
}

export default async function WorkspacePage({ params }: WorkspacePageProps) {
  const workspace = await getWorkspaceBySlug(params.slug)

  if (!workspace) {
    return null // This will be handled by the WorkspaceLayout
  }

  const members = await getWorkspaceMembers(workspace.id)
  const tasks = await getWorkspaceTasks(workspace.id)

  // Count tasks by status
  const todoCount = tasks.filter((task) => task.status === "todo").length
  const inProgressCount = tasks.filter((task) => task.status === "in-progress").length
  const doneCount = tasks.filter((task) => task.status === "done").length

  return (
    <div className="container py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">{workspace.name}</h1>
          <p className="text-muted-foreground mt-1">{workspace.description}</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Members
            </CardTitle>
            <CardDescription>
              {workspace.memberCount} {workspace.memberCount === 1 ? "member" : "members"} in this workspace
            </CardDescription>
          </CardHeader>
          <CardContent className="pb-2">
            <div className="flex items-center text-sm text-muted-foreground">
              <Clock className="mr-2 h-4 w-4" />
              <span>Created {format(new Date(workspace.createdAt), "PPP")}</span>
            </div>
          </CardContent>
          <CardContent className="pt-0">
            <Button asChild variant="outline" className="w-full">
              <Link href={`/dashboard/workspaces/${params.slug}/members`}>View Members</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2">
              <CheckSquare className="h-5 w-5" />
              Tasks
            </CardTitle>
            <CardDescription>
              {workspace.taskCount} {workspace.taskCount === 1 ? "task" : "tasks"} in this workspace
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm">To Do</span>
              <span className="text-sm font-medium">{todoCount}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">In Progress</span>
              <span className="text-sm font-medium">{inProgressCount}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Done</span>
              <span className="text-sm font-medium">{doneCount}</span>
            </div>
          </CardContent>
          <CardContent className="pt-0">
            <Button asChild variant="outline" className="w-full">
              <Link href={`/dashboard/workspaces/${params.slug}/tasks`}>View Tasks</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2">
              <Briefcase className="h-5 w-5" />
              Quick Actions
            </CardTitle>
            <CardDescription>Common actions for this workspace</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button asChild variant="outline" className="w-full justify-start">
              <Link href={`/dashboard/workspaces/${params.slug}/tasks`}>
                <Plus className="mr-2 h-4 w-4" />
                New Task
              </Link>
            </Button>

            {(workspace.role === "owner" || workspace.role === "admin") && (
              <Button asChild variant="outline" className="w-full justify-start">
                <Link href={`/dashboard/workspaces/${params.slug}/members`}>
                  <Users className="mr-2 h-4 w-4" />
                  Invite Members
                </Link>
              </Button>
            )}

            {(workspace.role === "owner" || workspace.role === "admin") && (
              <Button asChild variant="outline" className="w-full justify-start">
                <Link href={`/dashboard/workspaces/${params.slug}/settings`}>
                  <Briefcase className="mr-2 h-4 w-4" />
                  Workspace Settings
                </Link>
              </Button>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

