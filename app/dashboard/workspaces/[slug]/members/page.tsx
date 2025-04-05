import { getWorkspaceBySlug, getWorkspaceMembers } from "@/modules/workspaces/api/queries"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Users, UserPlus } from "lucide-react"
import { format } from "date-fns"
import type { Metadata } from "next"

interface MembersPageProps {
  params: {
    slug: string
  }
}

export async function generateMetadata({ params }: MembersPageProps): Promise<Metadata> {
  const workspace = await getWorkspaceBySlug(params.slug)

  if (!workspace) {
    return {
      title: "Members Not Found",
    }
  }

  return {
    title: `${workspace.name} - Members`,
    description: `Members of workspace: ${workspace.name}`,
  }
}

export default async function MembersPage({ params }: MembersPageProps) {
  const workspace = await getWorkspaceBySlug(params.slug)

  if (!workspace) {
    return null // This will be handled by the WorkspaceLayout
  }

  const members = await getWorkspaceMembers(workspace.id)

  // Get initials from name
  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName[0]}${lastName[0]}`.toUpperCase()
  }

  // Get role badge
  const getRoleBadge = (role: string) => {
    switch (role) {
      case "owner":
        return <Badge>Owner</Badge>
      case "admin":
        return <Badge variant="default">Admin</Badge>
      default:
        return <Badge variant="outline">Member</Badge>
    }
  }

  return (
    <div className="container py-8">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-2">
          <Users className="h-6 w-6" />
          <h1 className="text-2xl font-bold">Members</h1>
        </div>

        {(workspace.role === "owner" || workspace.role === "admin") && (
          <Button>
            <UserPlus className="mr-2 h-4 w-4" />
            Invite Member
          </Button>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Workspace Members</CardTitle>
          <CardDescription>
            {members.length} {members.length === 1 ? "member" : "members"} in this workspace
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {members.map((member) => (
              <div key={member.id} className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Avatar>
                    <AvatarFallback>{getInitials(member.user.firstName, member.user.lastName)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">
                      {member.user.firstName} {member.user.lastName}
                    </p>
                    <p className="text-sm text-muted-foreground">{member.user.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-sm text-muted-foreground">Joined {format(new Date(member.joinedAt), "PPP")}</div>
                  {getRoleBadge(member.role)}
                </div>
              </div>
            ))}

            {members.length === 0 && (
              <div className="text-center py-6">
                <p className="text-muted-foreground">No members found</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

