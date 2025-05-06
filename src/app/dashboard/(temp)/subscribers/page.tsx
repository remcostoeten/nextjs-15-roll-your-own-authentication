import { PageLayout } from "@/components/page-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Download, UserPlus } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function SubscribersPage() {
  const subscribers = [
    { id: 1, name: "Olivia Martin", email: "olivia@example.com", status: "Active", date: "2023-06-12" },
    { id: 2, name: "Jackson Lee", email: "jackson@example.com", status: "Active", date: "2023-06-10" },
    { id: 3, name: "Isabella Nguyen", email: "isabella@example.com", status: "Inactive", date: "2023-06-08" },
    { id: 4, name: "William Kim", email: "will@example.com", status: "Active", date: "2023-06-05" },
    { id: 5, name: "Sofia Davis", email: "sofia@example.com", status: "Inactive", date: "2023-06-01" },
  ]

  return (
    <PageLayout
      heading="Subscribers"
      description="Manage your newsletter subscribers"
      actions={
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button>
            <UserPlus className="mr-2 h-4 w-4" />
            Add Subscriber
          </Button>
        </div>
      }
    >
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Subscribers</CardTitle>
              <CardDescription>You have {subscribers.length} subscribers</CardDescription>
            </div>
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search subscribers..." className="pl-8 w-[250px]" />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="border rounded-md">
            <div className="grid grid-cols-4 p-3 bg-muted/50 text-sm font-medium">
              <div>Name</div>
              <div>Status</div>
              <div>Date</div>
              <div></div>
            </div>

            {subscribers.map((subscriber) => (
              <div key={subscriber.id} className="grid grid-cols-4 p-3 border-t items-center">
                <div className="flex items-center gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={`/placeholder.svg?height=32&width=32`} alt={subscriber.name} />
                    <AvatarFallback>
                      {subscriber.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">{subscriber.name}</div>
                    <div className="text-sm text-muted-foreground">{subscriber.email}</div>
                  </div>
                </div>
                <div>
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      subscriber.status === "Active"
                        ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-500"
                        : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-500"
                    }`}
                  >
                    {subscriber.status}
                  </span>
                </div>
                <div className="text-muted-foreground text-sm">{new Date(subscriber.date).toLocaleDateString()}</div>
                <div className="flex justify-end">
                  <Button variant="ghost" size="sm">
                    Edit
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </PageLayout>
  )
}
