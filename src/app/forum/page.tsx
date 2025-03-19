"use server"

import { forumMetadata } from "@/core/config/metadata/forum-metadata"
import { ForumView } from "@/views/forum/forum-view"
import { getPosts } from "@/modules/posts/api/queries"
import { getCurrentUser } from "@/modules/authentication/api/queries/get-current-user"
import { cookies, headers } from "next/headers"

export const metadata = forumMetadata

export default async function ForumPage({
    searchParams
}: {
    searchParams: { page?: string; tab?: string }
}) {
    // Get current user (if logged in)
    const user = await getCurrentUser()

    // Handle pagination
    const page = Number(searchParams.page) || 1
    const limit = 10

    // Log user activity
    const userAgent = headers().get("user-agent") || "unknown"
    const ip = headers().get("x-forwarded-for") || "unknown"

    // Fetch posts
    const postsData = await getPosts({
        page,
        limit,
        userId: user?.id,
        userAgent,
        ipAddress: ip,
    })

    return (
        <ForumView
            posts={postsData.posts}
            currentPage={page}
            totalPages={postsData.pagination.totalPages}
            currentUser={user}
        />
    )
} 