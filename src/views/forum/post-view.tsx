"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { formatDistanceToNow } from "date-fns"
import { ArrowLeft, Edit, Heart, MessageCircle, Share2, Trash2 } from "lucide-react"
import { User } from "@/server/db/schemas/users"
import { deletePost } from "@/modules/posts/api/mutations"
import { Post } from "@/modules/posts/models/z.post"
import { CommentSection } from "@/modules/posts/components/comment-section"
import { createCommentsTable } from "@/modules/posts/api/queries"

interface PostViewProps {
    post: Post & { author: User }
    currentUser: User | null
}

export function PostView({ post, currentUser }: PostViewProps) {
    const router = useRouter()
    const [isDeleting, setIsDeleting] = useState(false)
    const [error, setError] = useState<string | null>(null)

    // Ensure the comments table exists
    useState(() => {
        createCommentsTable().catch(console.error)
    })

    const isAuthor = currentUser?.id === post.authorId
    const canEdit = isAuthor
    const canDelete = isAuthor

    const handleDelete = async () => {
        if (!confirm("Are you sure you want to delete this post?")) return

        try {
            setIsDeleting(true)
            setError(null)

            await deletePost(post.id, {
                userId: currentUser?.id,
                userAgent: navigator.userAgent,
                ipAddress: "client-side"
            })

            router.push("/forum")
        } catch (err) {
            console.error("Error deleting post:", err)
            setError("Failed to delete post. Please try again.")
            setIsDeleting(false)
        }
    }

    const formattedDate = formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })

    return (
        <div className="max-w-3xl mx-auto">
            <div className="flex items-center mb-6">
                <Link
                    href="/forum"
                    className="flex items-center text-button hover:text-title-light mr-4"
                >
                    <ArrowLeft className="h-5 w-5 mr-1" />
                    <span>Back</span>
                </Link>
            </div>

            {error && (
                <div className="bg-red-900/20 border border-red-900/50 text-red-400 px-4 py-3 rounded-md mb-6">
                    {error}
                </div>
            )}

            <article className="bg-background-lighter border border-button-border rounded-lg overflow-hidden mb-8">
                <div className="p-6">
                    <header className="mb-4">
                        <h1 className="text-2xl font-bold text-title-light mb-2">
                            {post.title}
                        </h1>

                        <div className="flex items-center text-sm text-button">
                            <div className="flex items-center">
                                <div className="h-8 w-8 rounded-full bg-gradient-to-br from-[#3a6d10] to-[#4e9815] mr-2"></div>
                                <span className="font-medium text-button-hover">{post.author.firstName} {post.author.lastName}</span>
                            </div>
                            <span className="mx-2">•</span>
                            <time>{formattedDate}</time>

                            {post.sensitive && (
                                <>
                                    <span className="mx-2">•</span>
                                    <span className="text-orange-400 text-xs uppercase font-semibold">
                                        Sensitive Content
                                    </span>
                                </>
                            )}
                        </div>
                    </header>

                    <div className="prose prose-invert max-w-none text-button-hover">
                        {post.content.split('\n').map((paragraph, idx) => (
                            <p key={idx}>{paragraph}</p>
                        ))}
                    </div>
                </div>

                <div className="flex items-center px-6 py-4 border-t border-button-border">
                    <div className="flex items-center space-x-6">
                        <button className="flex items-center text-button hover:text-title-light">
                            <Heart className="h-5 w-5 mr-1" />
                            <span>Like</span>
                        </button>

                        <a href="#comments" className="flex items-center text-button hover:text-title-light">
                            <MessageCircle className="h-5 w-5 mr-1" />
                            <span>Comment</span>
                        </a>

                        <button className="flex items-center text-button hover:text-title-light">
                            <Share2 className="h-5 w-5 mr-1" />
                            <span>Share</span>
                        </button>
                    </div>

                    <div className="ml-auto flex items-center space-x-2">
                        {canEdit && (
                            <Link
                                href={`/forum/edit/${post.id}`}
                                className="p-2 text-button hover:text-title-light hover:bg-background rounded-full"
                            >
                                <Edit className="h-5 w-5" />
                            </Link>
                        )}

                        {canDelete && (
                            <button
                                onClick={handleDelete}
                                disabled={isDeleting}
                                className="p-2 text-red-400 hover:text-red-300 hover:bg-background rounded-full disabled:opacity-50"
                            >
                                <Trash2 className="h-5 w-5" />
                            </button>
                        )}
                    </div>
                </div>
            </article>

            <section id="comments">
                <CommentSection postId={post.id} currentUser={currentUser} />
            </section>
        </div>
    )
} 