"use client"

import Link from "next/link"
import { formatDistanceToNow } from "date-fns"
import { Heart, MessageCircle, Share2 } from "lucide-react"
import { PostWithAuthor } from "../models/z.post"

interface PostCardProps {
    post: PostWithAuthor
    currentUserId?: string
}

export function PostCard({ post, currentUserId }: PostCardProps) {
    const formattedDate = formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })

    return (
        <article className="bg-background-lighter border border-button-border rounded-lg overflow-hidden mb-4 transition-all hover:border-[#4e9815]/30">
            <Link href={`/forum/post/${post.id}`} className="block p-6">
                <header className="mb-3">
                    <h2 className="text-xl font-semibold text-title-light mb-2 line-clamp-2">
                        {post.title}
                    </h2>

                    <div className="flex items-center text-sm text-button">
                        <div className="flex items-center">
                            <div className="h-6 w-6 rounded-full bg-gradient-to-br from-[#3a6d10] to-[#4e9815] mr-2"></div>
                            <span className="font-medium text-button-hover">
                                {post.author.name || post.author.username || "Anonymous"}
                            </span>
                        </div>
                        <span className="mx-2">•</span>
                        <time>{formattedDate}</time>

                        {post.sensitive && (
                            <>
                                <span className="mx-2">•</span>
                                <span className="text-orange-400 text-xs uppercase font-semibold">
                                    Sensitive
                                </span>
                            </>
                        )}
                    </div>
                </header>

                <div className="text-button-hover line-clamp-3 mb-4">
                    {post.content}
                </div>
            </Link>

            <div className="flex items-center px-6 py-3 border-t border-button-border">
                <div className="flex items-center space-x-6">
                    <button className="flex items-center text-button hover:text-title-light">
                        <Heart className="h-4 w-4 mr-1" />
                        <span className="text-sm">Like</span>
                    </button>

                    <Link
                        href={`/forum/post/${post.id}#comments`}
                        className="flex items-center text-button hover:text-title-light"
                    >
                        <MessageCircle className="h-4 w-4 mr-1" />
                        <span className="text-sm">Comment</span>
                    </Link>

                    <button className="flex items-center text-button hover:text-title-light">
                        <Share2 className="h-4 w-4 mr-1" />
                        <span className="text-sm">Share</span>
                    </button>
                </div>

                {post.authorId === currentUserId && (
                    <div className="ml-auto">
                        <Link
                            href={`/forum/edit/${post.id}`}
                            className="text-sm text-[#4e9815] hover:underline"
                        >
                            Edit
                        </Link>
                    </div>
                )}
            </div>
        </article>
    )
} 