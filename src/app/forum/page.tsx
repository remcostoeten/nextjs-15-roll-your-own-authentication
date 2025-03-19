import { forumMetadata } from "@/core/config/metadata/forum-metadata"
import { ForumView } from "@/views/forum/forum-view"
import { getPosts } from "@/modules/posts/api/queries"
import { getCurrentUser } from "@/modules/authentication/api/queries/get-current-user"
import { headers } from "next/headers"
import { User } from "@/server/db/schemas/users"

export const metadata = forumMetadata

export default async function ForumPage({
    searchParams
}: {
    searchParams: { page?: string; tab?: string }
}) {
    // Get current user (if logged in)
    const userResponse = await getCurrentUser()
    const user = userResponse.success ? userResponse.user : null

    // Handle pagination
    const page = Number(searchParams.page) || 1
    const limit = 10

    // Log user activity
    const headersList = headers()
    const userAgent = headersList.get("user-agent") || "unknown"
    const ip = headersList.get("x-forwarded-for") || "unknown"

    // Fetch posts
    const postsData = await getPosts({
        page,
        limit,
        includeDrafts: false
    }, {
        userId: user?.id || "",
        userAgent,
        ipAddress: ip,
    })

    // Get the full user if available
    let fullUser: User | null = null
    if (user) {
        const db = (await import('@/server/db')).db
        const { eq } = await import('drizzle-orm')
        const { users } = await import('@/server/db/schemas')

        fullUser = await db.query.users.findFirst({
            where: eq(users.id, user.id)
        }) as User
    }

    return (
        <ForumView
            posts={postsData.posts}
            currentPage={page}
            totalPages={postsData.pagination.totalPages}
            currentUser={fullUser}
        />
    )
} 