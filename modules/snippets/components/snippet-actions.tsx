"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Copy, ExternalLink, MoreHorizontal, Pencil, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useToast } from "@/hooks/use-toast"
import { deleteSnippet } from "@/modules/snippets/api/mutations"
import { EditSnippetDialog } from "./edit-snippet-dialog"

interface SnippetActionsProps {
  snippet: {
    id: string
    title: string
    content: string
    language: string
    isPublic: boolean
    shareId: string | null
    category: {
      id: string
      name: string
    } | null
    labels: {
      id: string
      name: string
      color: string
    }[]
  }
  workspaceSlug: string
}

export function SnippetActions({ snippet, workspaceSlug }: SnippetActionsProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  // Handle copy to clipboard
  const handleCopy = () => {
    navigator.clipboard.writeText(snippet.content)
    toast({
      title: "Copied to clipboard",
      description: "Snippet content has been copied to your clipboard",
    })
  }

  // Handle delete
  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this snippet?")) {
      setIsDeleting(true)

      try {
        const result = await deleteSnippet(snippet.id)

        if (result.error) {
          toast({
            title: "Error",
            description: result.error,
            variant: "destructive",
          })
        } else {
          toast({
            title: "Success",
            description: "Snippet deleted successfully",
          })

          router.push(`/dashboard/workspaces/${workspaceSlug}/snippets`)
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to delete snippet",
          variant: "destructive",
        })
      } finally {
        setIsDeleting(false)
      }
    }
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm">
            <MoreHorizontal className="h-4 w-4 mr-2" />
            Actions
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => setIsEditDialogOpen(true)}>
            <Pencil className="mr-2 h-4 w-4" />
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleCopy}>
            <Copy className="mr-2 h-4 w-4" />
            Copy to clipboard
          </DropdownMenuItem>
          {snippet.isPublic && snippet.shareId && (
            <DropdownMenuItem asChild>
              <a href={`/s/${snippet.shareId}`} target="_blank" rel="noreferrer">
                <ExternalLink className="mr-2 h-4 w-4" />
                Open shared link
              </a>
            </DropdownMenuItem>
          )}
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleDelete} disabled={isDeleting} className="text-red-600">
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <EditSnippetDialog snippet={snippet} open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen} />
    </>
  )
}

