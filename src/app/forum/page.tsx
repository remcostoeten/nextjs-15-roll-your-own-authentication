"use server"

import { Metadata } from "next"
import { ForumView } from "@/views/forum/forum-view"
import { getPosts } from "@/modules/posts/api/queries"
import { getCurrentUser } from "@/modules/authentication/api/queries/get-current-user"
import { cookies } from "next/headers"
import { headers } from "next/headers"

export const metadata: Metadata = {
    title: "Forum | RAIOA",
    description: "Join the discussion and share your thoughts with the community",
}

export default async function ForumPage({
    searchParams,
}: {
    searchParams: { page?: string }
}) {
    const user = await getCurrentUser()
    const page = searchParams.page ? parseInt(searchParams.page) : 1
    const cookieStore = cookies()
    const headersList = headers()

    // Get user IP and agent for activity logging
    const userAgent = headersList.get("user-agent") || undefined
    const ip = headersList.get("x-forwarded-for") ||
        headersList.get("x-real-ip") || undefined

    // Get posts with context for activity logging
    const postsData = await getPosts(
        {
            page,
            limit: 10,
            includeDrafts: !!user // Show user's drafts if logged in
        },
        {
            userId: user?.id || "",
            userAgent,
            ipAddress: ip
        }
    )

    return <ForumView posts={postsData.posts} pagination={postsData.pagination} user={user} />
} 