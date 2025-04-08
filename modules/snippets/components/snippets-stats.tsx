import { getWorkspaceSnippetStats } from "@/modules/snippets/api/queries"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BookmarkIcon, FileCode, Hash, Tag } from "lucide-react"

interface SnippetsStatsProps {
  workspaceId: string
}

export async function SnippetsStats({ workspaceId }: SnippetsStatsProps) {
  const stats = await getWorkspaceSnippetStats(workspaceId)

  if (!stats) {
    return null
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">Snippet Stats</CardTitle>
        <CardDescription>Overview of your snippets</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
              <FileCode className="h-4 w-4 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium">{stats.totalSnippets}</p>
              <p className="text-xs text-muted-foreground">Snippets</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
              <Hash className="h-4 w-4 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium">{stats.totalCategories}</p>
              <p className="text-xs text-muted-foreground">Categories</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
              <Tag className="h-4 w-4 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium">{stats.totalLabels}</p>
              <p className="text-xs text-muted-foreground">Labels</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
              <BookmarkIcon className="h-4 w-4 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium">{stats.totalPublic}</p>
              <p className="text-xs text-muted-foreground">Public</p>
            </div>
          </div>
        </div>

        {stats.languageDistribution.length > 0 && (
          <div className="mt-4">
            <h4 className="text-sm font-medium mb-2">Top Languages</h4>
            <div className="space-y-2">
              {stats.languageDistribution.slice(0, 5).map((lang) => (
                <div key={lang.language} className="flex items-center justify-between">
                  <span className="text-xs">{lang.language}</span>
                  <span className="text-xs text-muted-foreground">{lang.count}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

