"use server"

import { editPostMetadata } from "@/core/config/metadata/forum-metadata"
import { notFound, redirect } from "next/navigation"
import { EditPostView } from "@/views/forum/edit-post-view"
import { getCurrentUser } from "@/modules/authentication/api/queries/get-current-user"
import { getPost } from "@/modules/posts/api/queries"

export const metadata = editPostMetadata

interface EditPostPageProps {
    params: {
        id: string
    }
}

export default async function EditPostPage({ params }: EditPostPageProps) {
    // Get current user (if logged in)
    const user = await getCurrentUser()

    // Redirect to login if not authenticated
    if (!user) {
        redirect("/login?callbackUrl=/forum/edit/" + params.id)
    }

    // Get post by ID
    try {
        const post = await getPost(params.id)

        if (!post) {
            return notFound()
        }

        // Check if user is authorized to edit this post
        if (post.authorId !== user.id) {
            // User is not the author, redirect to view
            redirect(`/forum/post/${params.id}`)
        }

        return <EditPostView post={post} user={user} />
    } catch (error) {
        console.error("Error fetching post for editing:", error)
        return notFound()
    }
} 