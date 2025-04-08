import { notFound } from "next/navigation"
import { formatDistanceToNow } from "date-fns"
import { getSnippetByShareId } from "@/modules/snippets/api/queries"
import { Badge } from "@/components/ui/badge"
import { SnippetSyntaxHighlighter } from "@/modules/snippets/components/snippet-syntax-highlighter"
import type { Metadata } from "next"
import { CopyButton } from "@/modules/snippets/components/copy-button"

interface SharedSnippetPageProps {
  params: {
    shareId: string
  }
}

export async function generateMetadata({ params }: SharedSnippetPageProps): Promise<Metadata> {
  const snippet = await getSnippetByShareId(params.shareId)

  if (!snippet) {
    return {
      title: "Snippet Not Found",
    }
  }

  return {
    title: `${snippet.title} | Shared Snippet`,
    description: `Shared code snippet: ${snippet.title}`,
  }
}

export default async function SharedSnippetPage({ params }: SharedSnippetPageProps) {
  const snippet = await getSnippetByShareId(params.shareId)

  if (!snippet) {
    notFound()
  }

  // Format the date
  const formattedDate = formatDistanceToNow(new Date(snippet.updatedAt), { addSuffix: true })

  return (
    <div className="container max-w-4xl py-10">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{snippet.title}</h1>
          <p className="text-muted-foreground mt-2">Last updated {formattedDate}</p>
        </div>

        <div className="rounded-lg border overflow-hidden">
          <div className="bg-muted px-4 py-2 flex items-center justify-between">
            <div className="text-sm font-medium">{snippet.language}</div>
            <CopyButton text={snippet.content} />
          </div>
          <SnippetSyntaxHighlighter code={snippet.content} language={snippet.language} />
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

