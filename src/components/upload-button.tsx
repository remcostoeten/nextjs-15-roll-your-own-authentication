'use client'

import { UploadButton as UTUploadButton } from '@uploadthing/react'
import { useCallback } from 'react'
import { toast } from 'react-toastify'
import { OurFileRouter } from '../server/uploadthing'

type UploadThingButtonProps = {
	endpoint: keyof OurFileRouter
	onClientUploadComplete?: (fileUrl: string) => void
	className?: string
	onUploadError?: (error: Error) => void
}

export default function UploadThingButton({
	endpoint,
	onClientUploadComplete,
	className,
	onUploadError
}: UploadThingButtonProps) {
	const handleUploadComplete = useCallback(
		(res: { fileUrl: string }[] | any) => {
			const fileUrl = res[0]?.fileUrl
			if (fileUrl && onClientUploadComplete) {
				onClientUploadComplete(fileUrl)
			}
		},
		[onClientUploadComplete]
	)

	const handleUploadError = useCallback(
		(error: Error) => {
			toast.error(`Upload failed: ${error.message}`)
			if (onUploadError) {
				onUploadError(error)
			}
		},
		[onUploadError]
	)

	return (
		<UTUploadButton<OurFileRouter, typeof endpoint>
			endpoint={endpoint}
			onClientUploadComplete={handleUploadComplete}
			onUploadError={handleUploadError}
			className={className}
		/>
	)
}
