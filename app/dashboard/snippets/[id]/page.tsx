import { notFound } from "next/navigation"
import { formatDistanceToNow } from "date-fns"
import { getSnippetById } from "@/modules/snippets/api/queries"
import { requireAuth } from "@/modules/authentication/utilities/auth"
import { Badge } from "@/components/ui/badge"
import { SnippetActions } from "@/modules/snippets/components/snippet-actions"

interface SnippetPageProps {
  params: {
    id: string
  }
}

export default async function SnippetPage({ params }: SnippetPageProps) {
  // Require authentication
  await requireAuth()

  const snippet = await getSnippetById(params.id)

  if (!snippet) {
    notFound()
  }

  // Format the date
  const formattedDate = formatDistanceToNow(new Date(snippet.updatedAt), { addSuffix: true })

  return (
    <div className="container max-w-4xl py-6">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">{snippet.title}</h1>
            <p className="text-muted-foreground mt-1">Last updated {formattedDate}</p>
          </div>

          <SnippetActions snippet={snippet} />
        </div>

        <div className="rounded-lg border overflow-hidden">
          <div className="bg-muted px-4 py-2 flex items-center justify-between">
            <div className="text-sm font-medium">{snippet.language}</div>
          </div>
          <pre className="p-4 overflow-x-auto text-sm">
            <code>{snippet.content}</code>
          </pre>
        </div>

        <div className="flex flex-wrap gap-2">
          {snippet.category && <Badge variant="secondary">{snippet.category.name}</Badge>}

          {snippet.labels.map((label) => (
            <Badge
              key={label.id}
              style={{
                backgroundColor: `${label.color}20`,
                color: label.color,
                borderColor: `${label.color}40`,
              }}
              variant="outline"
            >
              {label.name}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  )
}

