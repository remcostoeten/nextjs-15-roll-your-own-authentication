import { viewPostMetadata } from "@/core/config/metadata/forum-metadata"
import { notFound } from "next/navigation"
import { PostView } from "@/views/forum/post-view"
import { getCurrentUser } from "@/modules/authentication/api/queries/get-current-user"
import { getPost } from "@/modules/posts/api/queries"
import { headers } from "next/headers"
import { User } from "@/server/db/schemas/users"

export const metadata = viewPostMetadata

interface PostPageProps {
    params: {
        id: string
    }
}

export default async function PostPage({ params }: PostPageProps) {
    // Get current user (if logged in)
    const userResponse = await getCurrentUser()
    const userData = userResponse.success ? userResponse.user : null

    // Get full user object if available
    let fullUser: User | null = null
    if (userData) {
        const db = (await import('@/server/db')).db
        const { eq } = await import('drizzle-orm')
        const { users } = await import('@/server/db/schemas')

        fullUser = await db.query.users.findFirst({
            where: eq(users.id, userData.id)
        }) as User
    }

    // Get post by ID
    try {
        // Log view activity
        const headersList = headers()
        const userAgent = headersList.get("user-agent") || "unknown"
        const ip = headersList.get("x-forwarded-for") || "unknown"

        const post = await getPost(params.id, {
            userId: userData?.id || "",
            userAgent,
            ipAddress: ip,
        })

        if (!post) {
            return notFound()
        }

        return <PostView post={post} currentUser={fullUser} />
    } catch (error) {
        console.error("Error fetching post:", error)
        return notFound()
    }
} 