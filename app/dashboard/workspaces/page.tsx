import { redirect } from "next/navigation"
import { getUserWorkspaces } from "@/modules/workspaces/api/queries"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Briefcase, Plus, Clock } from "lucide-react"
import Link from "next/link"
import { format } from "date-fns"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Workspaces",
  description: "Manage your workspaces",
}

export default async function WorkspacesPage() {
  const workspaces = await getUserWorkspaces()

  // If user has only one workspace, redirect to it
  if (workspaces.length === 1) {
    redirect(`/dashboard/workspaces/${workspaces[0].slug}`)
  }

  return (
    <div className="container py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Workspaces</h1>
        <Button asChild>
          <Link href="/dashboard/workspaces/create">
            <Plus className="mr-2 h-4 w-4" />
            New Workspace
          </Link>
        </Button>
      </div>

      {workspaces.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {workspaces.map((workspace) => (
            <Card key={workspace.id} className="overflow-hidden">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2">
                  <Briefcase className="h-5 w-5" />
                  {workspace.name}
                </CardTitle>
                <CardDescription className="line-clamp-2">{workspace.description || "No description"}</CardDescription>
              </CardHeader>
              <CardContent className="pb-2">
                <div className="flex items-center text-sm text-muted-foreground">
                  <Clock className="mr-2 h-4 w-4" />
                  <span>Created {format(new Date(workspace.createdAt), "PPP")}</span>
                </div>
              </CardContent>
              <CardFooter>
                <Button asChild className="w-full">
                  <Link href={`/dashboard/workspaces/${workspace.slug}`}>Open Workspace</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-12">
          <div className="text-center">
            <Briefcase className="mx-auto h-12 w-12 text-muted-foreground" />
            <h2 className="mt-4 text-lg font-medium">No workspaces found</h2>
            <p className="mt-2 text-sm text-muted-foreground">Get started by creating your first workspace.</p>
            <Button asChild className="mt-4">
              <Link href="/dashboard/workspaces/create">
                <Plus className="mr-2 h-4 w-4" />
                New Workspace
              </Link>
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

