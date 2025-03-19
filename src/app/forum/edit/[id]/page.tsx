import { editPostMetadata } from '@/core/config/metadata/forum-metadata'
import { notFound, redirect } from 'next/navigation'
import { EditPostView } from '@/views/forum/edit-post-view'
import { getCurrentUser } from '@/modules/authentication/api/queries/get-current-user'
import { getPost } from '@/modules/posts/api/queries'
import { headers } from 'next/headers'
import { User } from '@/server/db/schemas/users'

export const metadata = editPostMetadata

interface EditPostPageProps {
	params: {
		id: string
	}
}

export default async function EditPostPage({ params }: EditPostPageProps) {
	// Get current user (if logged in)
	const userResponse = await getCurrentUser()

	// Redirect to login if not authenticated
	if (!userResponse.success || !userResponse.user) {
		redirect('/login?callbackUrl=/forum/edit/' + params.id)
	}

	// Get post by ID
	try {
		const headersList = headers()
		const userAgent = headersList.get('user-agent') || ''
		const ip = headersList.get('x-forwarded-for') || '127.0.0.1'

		// Fetch user data from database to get the full User type
		// This is a workaround since getCurrentUser returns a simplified user object
		const db = (await import('@/server/db')).db
		const { eq } = await import('drizzle-orm')
		const { users } = await import('@/server/db/schemas')

		const fullUser = (await db.query.users.findFirst({
			where: eq(users.id, userResponse.user.id),
		})) as User

		if (!fullUser) {
			return redirect('/login?callbackUrl=/forum/edit/' + params.id)
		}

		const post = await getPost(params.id, {
			userId: fullUser.id,
			ipAddress: ip,
			userAgent,
		})

		if (!post) {
			return notFound()
		}

		// Check if user is authorized to edit this post
		if (post.authorId !== fullUser.id) {
			// User is not the author, redirect to view
			redirect(`/forum/post/${params.id}`)
		}

		return (
			<EditPostView
				post={post}
				user={fullUser}
			/>
		)
	} catch (error) {
		console.error('Error fetching post for editing:', error)
		return notFound()
	}
}
