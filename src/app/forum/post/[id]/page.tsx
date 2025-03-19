"use server"

import { viewPostMetadata } from "@/core/config/metadata/forum-metadata"
import { notFound } from "next/navigation"
import { PostView } from "@/views/forum/post-view"
import { getCurrentUser } from "@/modules/authentication/api/queries/get-current-user"
import { getPost } from "@/modules/posts/api/queries"
import { headers } from "next/headers"

export const metadata = viewPostMetadata

interface PostPageProps {
    params: {
        id: string
    }
}

export default async function PostPage({ params }: PostPageProps) {
    // Get current user (if logged in)
    const user = await getCurrentUser()

    // Get post by ID
    try {
        // Log view activity
        const userAgent = headers().get("user-agent") || "unknown"
        const ip = headers().get("x-forwarded-for") || "unknown"

        const post = await getPost(params.id, {
            userId: user?.id,
            userAgent,
            ipAddress: ip,
        })

        if (!post) {
            return notFound()
        }

        return <PostView post={post} currentUser={user} />
    } catch (error) {
        console.error("Error fetching post:", error)
        return notFound()
    }
} 