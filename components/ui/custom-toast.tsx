'use client'

import { useEffect, useState } from 'react'
import { toast, Toaster, type ToastOptions } from 'react-hot-toast'
import { CheckCircle, XCircle, Info, AlertTriangle } from 'lucide-react'
import { cn } from '@/lib/utils'

// Custom toast types
export type ToastType = 'success' | 'error' | 'info' | 'warning'

// Custom toast options
interface CustomToastOptions extends Partial<ToastOptions> {
	type?: ToastType
	title?: string
	description?: string
}

// Toast component with bezier curves and dark pattern
const ToastContent = ({
	type = 'info',
	title,
	description,
}: {
	type: ToastType
	title?: string
	description?: string
}) => {
	const [mounted, setMounted] = useState(false)

	useEffect(() => {
		setMounted(true)
		return () => setMounted(false)
	}, [])

	const icons = {
		success: <CheckCircle className="h-5 w-5 text-emerald-500" />,
		error: <XCircle className="h-5 w-5 text-rose-500" />,
		info: <Info className="h-5 w-5 text-blue-500" />,
		warning: <AlertTriangle className="h-5 w-5 text-amber-500" />,
	}

	const bgPatterns = {
		success:
			'bg-[radial-gradient(#1a2e1a_1px,transparent_1px)] bg-[length:20px_20px]',
		error: 'bg-[radial-gradient(#2e1a1a_1px,transparent_1px)] bg-[length:20px_20px]',
		info: 'bg-[radial-gradient(#1a1a2e_1px,transparent_1px)] bg-[length:20px_20px]',
		warning:
			'bg-[radial-gradient(#2e2e1a_1px,transparent_1px)] bg-[length:20px_20px]',
	}

	const borderColors = {
		success: 'border-emerald-500/20',
		error: 'border-rose-500/20',
		info: 'border-blue-500/20',
		warning: 'border-amber-500/20',
	}

	return (
		<div
			className={cn(
				'flex items-start gap-3 rounded-lg border p-4 shadow-lg',
				'bg-background/95 backdrop-blur-sm',
				borderColors[type],
				bgPatterns[type],
				'transform transition-all duration-500 ease-out',
				mounted
					? 'translate-y-0 opacity-100'
					: 'translate-y-2 opacity-0',
				'relative overflow-hidden'
			)}
		>
			{/* Bezier curve decoration */}
			<div
				className={cn(
					'absolute -right-4 -top-4 h-16 w-16 rounded-full opacity-20',
					type === 'success'
						? 'bg-emerald-500'
						: type === 'error'
						? 'bg-rose-500'
						: type === 'warning'
						? 'bg-amber-500'
						: 'bg-blue-500'
				)}
			/>
			<div
				className={cn(
					'absolute -left-4 -bottom-4 h-16 w-16 rounded-full opacity-20',
					type === 'success'
						? 'bg-emerald-500'
						: type === 'error'
						? 'bg-rose-500'
						: type === 'warning'
						? 'bg-amber-500'
						: 'bg-blue-500'
				)}
			/>

			<div className="z-10 flex-shrink-0">{icons[type]}</div>
			<div className="z-10 flex-1">
				{title && <h4 className="font-medium">{title}</h4>}
				{description && (
					<p className="text-sm text-muted-foreground">
						{description}
					</p>
				)}
			</div>
		</div>
	)
}

// Custom toast provider
export function CustomToaster() {
	return (
		<Toaster
			position="top-right"
			toastOptions={{
				duration: 5000,
				style: {
					background: 'transparent',
					boxShadow: 'none',
					padding: 0,
					margin: 0,
				},
			}}
		/>
	)
}

// Custom toast functions
export function showToast({
	type = 'info',
	title,
	description,
	...options
}: CustomToastOptions = {}) {
	return toast.custom(
		(t) => (
			<ToastContent
				type={type}
				title={title}
				description={description}
			/>
		),
		{
			...options,
		}
	)
}

export const customToast = {
	success: (options: Omit<CustomToastOptions, 'type'>) =>
		showToast({ ...options, type: 'success' }),
	error: (options: Omit<CustomToastOptions, 'type'>) =>
		showToast({ ...options, type: 'error' }),
	info: (options: Omit<CustomToastOptions, 'type'>) =>
		showToast({ ...options, type: 'info' }),
	warning: (options: Omit<CustomToastOptions, 'type'>) =>
		showToast({ ...options, type: 'warning' }),
}
