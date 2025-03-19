import { createPostMetadata } from "@/core/config/metadata/forum-metadata"
import { NewPostView } from "@/views/forum/new-post-view"
import { getCurrentUser } from "@/modules/authentication/api/queries/get-current-user"
import { redirect } from "next/navigation"
import { User } from "@/server/db/schemas/users"

export const metadata = createPostMetadata

export default async function NewPostPage() {
    // Get current user (if logged in)
    const userResponse = await getCurrentUser()

    // Redirect to login if not authenticated
    if (!userResponse.success || !userResponse.user) {
        redirect("/login?callbackUrl=/forum/new")
    }

    // Get the full user from the database
    const db = (await import('@/server/db')).db
    const { eq } = await import('drizzle-orm')
    const { users } = await import('@/server/db/schemas')

    const fullUser = await db.query.users.findFirst({
        where: eq(users.id, userResponse.user.id)
    }) as User

    if (!fullUser) {
        redirect("/login?callbackUrl=/forum/new")
    }

    return <NewPostView user={fullUser} />
} 