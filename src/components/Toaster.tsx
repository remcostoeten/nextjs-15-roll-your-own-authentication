'use client'

import { useFeatureConfig } from '@/hooks/use-feature-config'
import { toast, Toaster } from 'sonner'

const VercelToaster = () => {
	return (
		<Toaster
			position="top-center"
			theme="dark"
			className="dark:bg-black"
			toastOptions={{
				className:
					'!bg-black !text-white w-fit-content !border-gray-800',
				descriptionClassName: 'text-gray-400'
			}}
		/>
	)
}

export default function TostiKaas() {
	const featureConfig = useFeatureConfig()

	if (!featureConfig.showToasts.enabled) return null

	const showDefaultToast = () => {
		toast('Deploy successful', {
			description: 'Your project is now live on Vercel'
		})
	}

	const showSuccessToast = () => {
		toast.success('Build completed', {
			description: 'Your project was built successfully in 2.3s'
		})
	}

	const showErrorToast = () => {
		toast.error('Build failed', {
			description: 'Check your deployment logs for more information'
		})
	}

	const showLoadingToast = () => {
		toast.loading('Deploying to production...', {
			description: 'This might take a few minutes'
		})
	}

	return (
		<div className="flex flex-col gap-4 items-center p-8">
			<VercelToaster />
			<div className="flex flex-wrap gap-4 justify-center">
				<button
					onClick={showDefaultToast}
					className="px-4 py-2 bg-white text-black rounded-md hover:bg-gray-100"
				>
					Default Toast
				</button>
				<button
					onClick={showSuccessToast}
					className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
				>
					Success Toast
				</button>
				<button
					onClick={showErrorToast}
					className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
				>
					Error Toast
				</button>
				<button
					onClick={showLoadingToast}
					className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
				>
					Loading Toast
				</button>
			</div>
		</div>
	)
}
