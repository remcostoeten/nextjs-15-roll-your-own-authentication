"use server"

import { Metadata } from "next"
import { NewPostView } from "@/views/forum/new-post-view"
import { getCurrentUser } from "@/modules/authentication/api/queries/get-current-user"
import { redirect } from "next/navigation"

export const metadata: Metadata = {
    title: "Create New Post | Forum | RAIOA",
    description: "Share your thoughts with the community",
}

export default async function NewPostPage() {
    const user = await getCurrentUser()

    // Redirect to login if not authenticated
    if (!user) {
        redirect("/login?callbackUrl=/forum/new")
    }

    return <NewPostView user={user} />
} 