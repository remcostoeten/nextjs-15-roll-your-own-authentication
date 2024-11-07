'use client'

import { useFeatureConfig } from '@/hooks/use-feature-config'
import { Toaster, ToasterProps } from 'sonner'

const toastOptions: ToasterProps['toastOptions'] = {
	style: {
		background: '#09090b',
		border: '1px solid rgba(63, 63, 70, 0.8)',
		color: '#fff',
		padding: '10px 16px',
		minWidth: 'auto',
		maxWidth: '320px',
		width: 'fit-content',
		minHeight: '40px',
		display: 'flex',
		alignItems: 'center',
		gap: '8px',
		borderRadius: '6px',
		boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)'
	},
	className: 'text-sm font-medium whitespace-nowrap'
}

export default function ToastProvider() {
	const config = useFeatureConfig()

	if (!config.showToasts) return null

	return (
		<Toaster
			position="top-center"
			toastOptions={toastOptions}
			closeButton
			richColors
			expand={false}
		/>
	)
}
