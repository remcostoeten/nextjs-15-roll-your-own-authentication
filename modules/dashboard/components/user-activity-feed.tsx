import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface UserActivityFeedProps {
  userId: string;
}

export function UserActivityFeed({ userId }: UserActivityFeedProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Activity</CardTitle>
        <CardDescription>Your recent actions and events</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center gap-4 rounded-lg border p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-5 w-5 text-primary"
              >
                <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                <polyline points="14 2 14 8 20 8" />
              </svg>
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium">Logged in successfully</p>
              <p className="text-sm text-muted-foreground">Just now</p>
            </div>
          </div>
          <p className="text-sm text-muted-foreground text-center py-4">
            Activity tracking is currently disabled
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
