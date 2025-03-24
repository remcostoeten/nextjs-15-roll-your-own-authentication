'use client'

import * as React from 'react'
import { CoreButton } from '@/shared/components/core/core-button'

interface SocialAuthButtonProps {
	icon: React.ReactNode
	onClick: () => void
	children: React.ReactNode
}

export function SocialAuthButton({ icon, onClick, children }: SocialAuthButtonProps) {
	return (
		<CoreButton
			variant="sso"
			fullWidth
			icon={icon}
			onClick={onClick}
		>
			{children}
		</CoreButton>
	)
}
