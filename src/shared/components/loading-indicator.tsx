/**
 * @author Remco Stoeten
 * @usage <LoadingIndicator loading={isLoading}>content</LoadingIndicator>
 */

import React from 'react'
import { Loader } from 'lucide-react'

type LoadingIndicatorProps = {
	loading: boolean
	children: React.ReactNode
}

const LoadingIndicator = ({ loading, children }: LoadingIndicatorProps) => {
	if (!loading) return <>{children}</>

	return (
		<div className="flex justify-center items-center w-full h-full min-h-[100px]">
			<Loader className="h-6 w-6 text-zinc-500 animate-spin" />
		</div>
	)
}

export default LoadingIndicator
