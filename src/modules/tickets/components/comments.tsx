"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/shared/components/ui/avatar"
import { Button } from "@/shared/components/ui/button"
import { Textarea } from "@/shared/components/ui/textarea"
import { formatDistanceToNow } from "date-fns"
import { MessageSquare } from "lucide-react"
import { useComments } from "../hooks/use-comments"
import type { TicketComment } from "../types"

interface CommentsProps {
  ticketId: string
  comments: {
    comment: TicketComment
    user: {
      id: string
      name: string | null
      avatar: string | null
    }
  }[]
  onCommentAdded?: () => void
}

export function Comments({ ticketId, comments, onCommentAdded }: CommentsProps) {
  const { comment, setComment, isAddingComment, handleAddComment } = useComments()

  const handleSubmit = async () => {
    const result = await handleAddComment(ticketId)
    if (result && onCommentAdded) {
      onCommentAdded()
    }
  }

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium flex items-center gap-2">
        <MessageSquare className="h-5 w-5" />
        Comments
      </h3>

      <div className="space-y-4">
        {comments && comments.length > 0 ? (
          comments.map(({ comment, user }) => (
            <div key={comment.id} className="flex gap-3">
              <Avatar className="h-8 w-8">
                <AvatarImage src={user.avatar || ""} alt={user.name || ""} />
                <AvatarFallback>{user.name?.charAt(0) || "U"}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{user.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                  </span>
                </div>
                <p className="mt-1 whitespace-pre-line">{comment.content}</p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-muted-foreground italic">No comments yet</p>
        )}
      </div>

      <div className="space-y-2">
        <Textarea
          placeholder="Add a comment..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="min-h-[100px]"
        />
        <div className="flex justify-end">
          <Button onClick={handleSubmit} disabled={isAddingComment || !comment.trim()}>
            {isAddingComment ? "Adding..." : "Add Comment"}
          </Button>
        </div>
      </div>
    </div>
  )
}
