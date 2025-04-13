'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Github, Mail } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Flex } from '@/shared/components/flexer'
import { BlurFade } from '@/shared/components/effects/blur-fade'
import { cn } from '@/shared/helpers'

type AuthMethod = 'email' | 'github' | 'both'

interface AuthMethodBadgeProps {
	currentMethod: AuthMethod
	onConnectGithub?: () => void
}

export function AuthMethodBadge({
	currentMethod,
	onConnectGithub,
}: AuthMethodBadgeProps) {
	const [isHovered, setIsHovered] = useState(false)

	const getMethodDetails = (method: AuthMethod) => {
		switch (method) {
			case 'email':
				return {
					icon: <Mail className="h-4 w-4" />,
					label: 'Email',
					color: 'text-blue-400',
					bg: 'bg-blue-400/10',
					border: 'border-blue-400/20',
				}
			case 'github':
				return {
					icon: <Github className="h-4 w-4" />,
					label: 'GitHub',
					color: 'text-purple-400',
					bg: 'bg-purple-400/10',
					border: 'border-purple-400/20',
				}
			case 'both':
				return {
					icon: (
						<Flex
							gap="xs"
							className="items-center"
						>
							<Mail className="h-3 w-3" />
							<Github className="h-3 w-3" />
						</Flex>
					),
					label: 'Email & GitHub',
					color: 'text-green-400',
					bg: 'bg-green-400/10',
					border: 'border-green-400/20',
				}
		}
	}

	const details = getMethodDetails(currentMethod)

	return (
		<BlurFade className="w-full">
			<div className="flex items-center justify-between p-4 rounded-lg border bg-[#0d0d0d]">
				<Flex
					gap="md"
					className="items-center"
				>
					<div
						className={cn(
							'p-2 rounded-md',
							details.bg,
							details.border,
							'border'
						)}
					>
						{details.icon}
					</div>
					<div>
						<p className="text-sm font-medium">
							Authentication Method
						</p>
						<p className={cn('text-sm', details.color)}>
							{details.label}
						</p>
					</div>
				</Flex>

				{currentMethod === 'email' && onConnectGithub && (
					<motion.div
						initial={{ opacity: 0, x: 10 }}
						animate={{ opacity: 1, x: 0 }}
						transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
					>
						<Button
							variant="outline"
							size="sm"
							className="gap-2"
							onClick={onConnectGithub}
							onMouseEnter={() => setIsHovered(true)}
							onMouseLeave={() => setIsHovered(false)}
						>
							<Github className="h-4 w-4" />
							Connect GitHub
							<motion.div
								initial={{ x: '-100%' }}
								animate={{ x: isHovered ? '0%' : '-100%' }}
								transition={{
									duration: 0.5,
									ease: [0.22, 1, 0.36, 1],
								}}
								className="absolute inset-0 bg-gradient-to-r from-[#1a1d23]/0 via-[#252a33]/20 to-[#1a1d23]/0"
							/>
						</Button>
					</motion.div>
				)}
			</div>
		</BlurFade>
	)
}
