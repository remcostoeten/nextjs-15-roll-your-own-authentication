"use server"

import { createPostMetadata } from "@/core/config/metadata/forum-metadata"
import { NewPostView } from "@/views/forum/new-post-view"
import { getCurrentUser } from "@/modules/authentication/api/queries/get-current-user"
import { redirect } from "next/navigation"

export const metadata = createPostMetadata

export default async function NewPostPage() {
    // Get current user (if logged in)
    const user = await getCurrentUser()

    // Redirect to login if not authenticated
    if (!user) {
        redirect("/login?callbackUrl=/forum/new")
    }

    return <NewPostView user={user} />
} 