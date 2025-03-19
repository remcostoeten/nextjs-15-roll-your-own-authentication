"use client"

import { useCallback, useState } from "react"
import Link from "next/link"
import { PlusCircle } from "lucide-react"
import { PostTabs } from "@/modules/posts/components/post-tabs"
import { PaginationControls } from "@/modules/posts/components/pagination-controls"
import { PostCard } from "@/modules/posts/components/post-card"
import { PostWithAuthor } from "@/modules/posts/models/z.post"
import { User } from "@/server/db/schemas/users"

interface ForumViewProps {
    posts: PostWithAuthor[]
    currentPage: number
    totalPages: number
    currentUser: User | null
}

type Tab = "following" | "featured" | "rising"

export function ForumView({ posts, currentPage, totalPages, currentUser }: ForumViewProps) {
    const [activeTab, setActiveTab] = useState<Tab>("featured")

    const handleTabChange = useCallback((tab: Tab) => {
        setActiveTab(tab)
        // In a real implementation, this would trigger a new data fetch
    }, [])

    return (
        <div className="max-w-3xl mx-auto">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold text-title-light">Forum</h1>

                {currentUser && (
                    <Link
                        href="/forum/new"
                        className="flex items-center gap-2 px-4 py-2 rounded-md bg-[#4e9815]/10 border border-[#4e9815]/30 text-[#4e9815] hover:bg-[#4e9815]/20 transition-colors"
                    >
                        <PlusCircle className="h-4 w-4" />
                        <span>New Post</span>
                    </Link>
                )}
            </div>

            <div className="mb-6">
                <PostTabs activeTab={activeTab} onChange={handleTabChange} />
            </div>

            {posts.length === 0 ? (
                <div className="bg-background-lighter border border-button-border rounded-lg p-10 text-center">
                    <p className="text-button mb-4">No posts found</p>
                    {currentUser ? (
                        <Link
                            href="/forum/new"
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-[#4e9815]/10 border border-[#4e9815]/30 text-[#4e9815] hover:bg-[#4e9815]/20 transition-colors"
                        >
                            <PlusCircle className="h-4 w-4" />
                            <span>Create the first post</span>
                        </Link>
                    ) : (
                        <Link
                            href="/login?callbackUrl=/forum/new"
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-button/10 border border-button/30 text-button hover:bg-button/20 transition-colors"
                        >
                            <span>Login to post</span>
                        </Link>
                    )}
                </div>
            ) : (
                <div className="space-y-4">
                    {posts.map((post) => (
                        <PostCard
                            key={post.id}
                            post={post}
                            currentUserId={currentUser?.id}
                        />
                    ))}
                </div>
            )}

            {totalPages > 1 && (
                <div className="mt-8">
                    <PaginationControls
                        currentPage={currentPage}
                        totalPages={totalPages}
                        basePath="/forum"
                    />
                </div>
            )}
        </div>
    )
} 