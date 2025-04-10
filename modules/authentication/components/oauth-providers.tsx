'use client'

import type React from 'react'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Github, ChevronDown, ChevronUp } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { OAuthButtons } from './oauth-buttons'

type TProps = {
	showMoreProviders: boolean
	onToggleMoreProvidersAction: () => void
}

export function OAuthProviders({
	showMoreProviders,
	onToggleMoreProvidersAction,
}: TProps) {
	// Define OAuth providers
	const mainProviders = [
		{
			id: 'github',
			name: 'GitHub',
			icon: 'github',
			color: '#24292e',
		},
		{
			id: 'google',
			name: 'Google',
			icon: 'google',
			color: '#4285F4',
		},
	]

	const additionalProviders = [
		{
			id: 'discord',
			name: 'Discord',
			icon: 'discord',
			color: '#5865F2',
		},
	]

	return (
		<div className="space-y-3">
			<OAuthButtons
				mainProviders={mainProviders}
				additionalProviders={additionalProviders}
			/>
		</div>
	)
}
