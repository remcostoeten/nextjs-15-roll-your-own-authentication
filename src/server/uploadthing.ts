import { createUploadthing, type FileRouter } from 'uploadthing/next'
import { getUser } from '../services/auth/get-user'

const f = createUploadthing()

export const uploadRouter = {
	profileImage: f({ image: { maxFileSize: '1MB' } })
		.middleware(async () => {
			const user = await getUser()
			if (!user) throw new Error('Unauthorized')
			return { userId: user.id }
		})
		.onUploadComplete(async ({ metadata, file }) => {
			console.log('Upload complete for userId:', metadata.userId)
			return { fileUrl: file.url }
		})
} satisfies FileRouter

export type OurFileRouter = typeof uploadRouter
