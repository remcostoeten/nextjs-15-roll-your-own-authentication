import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface Member {
  id: string
  name: string
  email: string
  role: string
  avatarUrl?: string
}

interface DashboardMembersProps {
  members: Member[]
}

export function DashboardMembers({ members }: DashboardMembersProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Team Members</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {members.map((member) => (
            <div key={member.id} className="flex items-center gap-4">
              <Avatar>
                <AvatarImage src={member.avatarUrl} alt={member.name} />
                <AvatarFallback>{member.name.slice(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium leading-none">{member.name}</p>
                <p className="text-sm text-muted-foreground">{member.email}</p>
              </div>
              <div className="flex items-center">
                <span className="text-sm text-muted-foreground capitalize">{member.role}</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
} 