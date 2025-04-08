"use client"

import { useState, useEffect } from "react"
import { formatDistanceToNow } from "date-fns"
import { getSnippetVersions } from "@/modules/snippets/api/queries"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { SnippetSyntaxHighlighter } from "./snippet-syntax-highlighter"
import { Skeleton } from "@/components/ui/skeleton"
import { History } from "lucide-react"

interface SnippetVersionHistoryProps {
  snippetId: string
  language: string
}

export function SnippetVersionHistory({ snippetId, language }: SnippetVersionHistoryProps) {
  const [versions, setVersions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedVersion, setSelectedVersion] = useState<string | null>(null)
  const [selectedContent, setSelectedContent] = useState<string | null>(null)

  useEffect(() => {
    const fetchVersions = async () => {
      try {
        const versionsData = await getSnippetVersions(snippetId)
        setVersions(versionsData)
        if (versionsData.length > 0) {
          setSelectedVersion(versionsData[0].id)
          setSelectedContent(versionsData[0].content)
        }
      } catch (error) {
        console.error("Error fetching versions:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchVersions()
  }, [snippetId])

  const handleVersionSelect = (versionId: string) => {
    const version = versions.find((v) => v.id === versionId)
    if (version) {
      setSelectedVersion(versionId)
      setSelectedContent(version.content)
    }
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <History className="h-4 w-4" />
          <h3 className="text-lg font-medium">Version History</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-1">
            <Skeleton className="h-[300px] w-full" />
          </div>
          <div className="md:col-span-3">
            <Skeleton className="h-[300px] w-full" />
          </div>
        </div>
      </div>
    )
  }

  if (versions.length === 0) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <History className="h-4 w-4" />
          <h3 className="text-lg font-medium">Version History</h3>
        </div>
        <div className="border rounded-md p-4 text-center">
          <p className="text-muted-foreground">No version history available</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <History className="h-4 w-4" />
        <h3 className="text-lg font-medium">Version History</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="md:col-span-1 border rounded-md">
          <ScrollArea className="h-[300px]">
            <div className="p-2">
              {versions.map((version) => (
                <Button
                  key={version.id}
                  variant={selectedVersion === version.id ? "default" : "ghost"}
                  className="w-full justify-start text-left mb-1"
                  onClick={() => handleVersionSelect(version.id)}
                >
                  <div>
                    <div className="text-sm">
                      {formatDistanceToNow(new Date(version.createdAt), { addSuffix: true })}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {version.creatorFirstName} {version.creatorLastName}
                    </div>
                  </div>
                </Button>
              ))}
            </div>
          </ScrollArea>
        </div>

        <div className="md:col-span-3 border rounded-md overflow-hidden">
          {selectedContent && <SnippetSyntaxHighlighter code={selectedContent} language={language} />}
        </div>
      </div>
    </div>
  )
}

