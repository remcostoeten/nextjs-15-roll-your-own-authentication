import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ChevronDown, ClipboardCopy, Users } from "lucide-react"
import type { User } from "@/server/db"
import { EditPersonalInfoForm } from "./edit-personal-info-form"
import { EditContactInfoForm } from "./edit-contact-info-form"
import { EditUsernameForm } from "./edit-username-form"
import Link from "next/link"

type UserProfileProps = {
  user: User
  sessionData: {
    lastIp: string
    signInCount: number
    lastSignIn: Date
  }
}

export function UserProfile({ user, sessionData }: UserProfileProps) {
  const fullName = `${user.firstName || ""} ${user.lastName || ""}`.trim() || user.username
  const initials =
    fullName
      .split(" ")
      .map((name) => name[0] || "")
      .join("")
      .toUpperCase()
      .substring(0, 2) || user.username.substring(0, 2).toUpperCase()

  // Format dates
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    }).format(date)
  }

  const signUpDate = formatDate(user.createdAt)
  const lastUpdated = formatDate(user.updatedAt)
  const lastSignIn = formatDate(sessionData.lastSignIn)

  // Calculate time since last sign in
  const getTimeSince = (date: Date) => {
    const now = new Date()
    const diffInMs = now.getTime() - date.getTime()
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24))

    if (diffInDays < 1) return "today"
    if (diffInDays === 1) return "yesterday"
    if (diffInDays < 30) return `${diffInDays} days ago`
    if (diffInDays < 60) return "1 month ago"
    if (diffInDays < 365) return `${Math.floor(diffInDays / 30)} months ago`
    return `${Math.floor(diffInDays / 365)} years ago`
  }

  const lastSignInRelative = getTimeSince(sessionData.lastSignIn)

  return (
    <div className="container flex-1 px-4 py-6 sm:px-6">
      <div className="mb-6 flex items-center gap-2">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/dashboard">
            <Users className="mr-2 h-4 w-4" />
            Dashboard
          </Link>
        </Button>
        <span className="text-muted-foreground">/</span>
        <span className="text-muted-foreground">User Details</span>
        <span className="text-muted-foreground">/</span>
        <span>{fullName}</span>
      </div>

      <div className="grid gap-6">
        {/* Personal Information */}
        <div>
          <div className="mb-2 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-medium">Personal Information</h2>
              <p className="text-sm text-muted-foreground">Manage personal information settings</p>
            </div>
          </div>

          <Card className="overflow-hidden bg-card border-border">
            <CardContent className="p-6">
              <div className="mb-6 flex items-center gap-4">
                <Avatar className="h-12 w-12 bg-neutral-800">
                  <AvatarFallback className="bg-neutral-800">{initials}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-lg font-medium">{fullName}</h3>
                  <p className="text-sm text-muted-foreground">Last signed {lastSignInRelative}</p>
                </div>
              </div>

              <EditPersonalInfoForm user={user} />
            </CardContent>
          </Card>
        </div>

        {/* Basic Information */}
        <div>
          <div className="mb-2 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-medium">Basic Information</h2>
              <p className="text-sm text-muted-foreground">Manage personal information settings</p>
            </div>
          </div>

          <Card className="overflow-hidden bg-card border-border">
            <CardContent className="p-6">
              <div className="space-y-6">
                <div>
                  <p className="text-sm text-muted-foreground">User ID</p>
                  <div className="flex items-center gap-2">
                    <p className="font-mono text-sm">{user.id}</p>
                    <Button variant="ghost" size="icon" className="h-6 w-6">
                      <ClipboardCopy className="h-3 w-3" />
                      <span className="sr-only">Copy</span>
                    </Button>
                  </div>
                </div>

                <EditContactInfoForm user={user} />

                <EditUsernameForm user={user} />

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Sign-Up Date</p>
                    <p>{signUpDate}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Last Updated</p>
                    <p>{lastUpdated}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Last Sign-In IP</p>
                    <p>{sessionData.lastIp}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Last Sign-In Count</p>
                    <p>{sessionData.signInCount}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Role</p>
                    <p className="capitalize">{user.isAdmin ? "admin" : "user"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Status</p>
                    <p>{user.isActive ? "Active" : "Inactive"}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* User Claims */}
        <div>
          <div className="mb-2 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-medium">User Claims</h2>
              <p className="text-sm text-muted-foreground">Manage personal information settings</p>
            </div>
          </div>

          <Card className="overflow-hidden bg-card border-border">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <h3 className="font-medium">Claims</h3>
                <Button variant="ghost" size="sm">
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </div>

              <div className="mt-4 rounded-md bg-black p-4">
                <pre className="text-xs text-green-500">
                  <code>
                    <span className="text-muted-foreground">1</span> <span className="text-purple-400">"email"</span>:{" "}
                    <span className="text-green-400">"{user.email}"</span>,{"\n"}
                    <span className="text-muted-foreground">2</span>{" "}
                    <span className="text-purple-400">"email_verified"</span>:{" "}
                    <span className="text-blue-400">true</span>,{"\n"}
                    <span className="text-muted-foreground">3</span> <span className="text-purple-400">"sub"</span>:{" "}
                    <span className="text-green-400">"{user.id}\"</span>,{"
"}
                    <span className="text-muted-foreground">4</span> <span className="text-purple-400">"role"</span>:{" "}
                    <span className="text-green-400">"{user.isAdmin ? "admin" : "user"}"</span>,
                  </code>
                </pre>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Connected Providers */}
        <div>
          <div className="mb-2 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-medium">Connected Providers</h2>
              <p className="text-sm text-muted-foreground">Manage personal information settings</p>
            </div>
          </div>

          <Card className="overflow-hidden bg-card border-border">
            <CardContent className="p-6">
              <p className="text-sm text-muted-foreground">No connected providers</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

