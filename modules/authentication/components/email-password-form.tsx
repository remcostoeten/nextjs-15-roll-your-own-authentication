'use client'
import { useState } from 'react'
import { useFormStatus } from 'react-dom'
import { Loader2 } from 'lucide-react'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'
import { PasswordInput } from './password-input'
import Checkbox from '@/shared/components/core/checkbox/Checkbox'
import { Flex } from '@/shared/components/flexer'
import { MinimalEllipsis } from '@/shared/components/effects/minimal-ellipsis'
import { PurpleGlareEffect } from '@/shared/components/effects/purple-glare-effect'

type TProps = {
	type: 'login' | 'register'
}

export function EmailPasswordForm({ type }: TProps) {
	const { pending } = useFormStatus()
	const [isHovered, setIsHovered] = useState(false)

	return (
		<div className="space-y-4">
			<div className="space-y-2">
				<Label
					htmlFor="email"
					className="text-sm font-medium"
				>
					Email
				</Label>
				<div className="relative">
					<Input
						id="email"
						name="email"
						type="email"
						autoComplete="email"
						required
						placeholder="name@example.com"
						className="bg-[#0d0d0d] border-[#1a1d23] focus-visible:ring-0 focus-visible:border-[#252a33] transition-colors duration-300 rounded-sm"
					/>
				</div>
			</div>

			<div className="space-y-2">
				<Label
					htmlFor="password"
					className="text-sm font-medium"
				>
					Password
				</Label>
				<PasswordInput
					id="password"
					name="password"
					autoComplete={
						type === 'login' ? 'current-password' : 'new-password'
					}
					required
				/>
			</div>

			{type === 'login' && (
				<div className="flex items-center space-x-2">
					<Checkbox
						id="remember"
						name="remember"
						color="#00aa8d"
						hoverColor="#00bf92"
						activeColor="#008975"
					/>
					<Label
						htmlFor="remember"
						className="text-sm font-normal text-muted-foreground leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
					>
						Remember me
					</Label>
				</div>
			)}

			<div className="relative">
				<Button
					type="submit"
					className="w-full bg-[#0d0d0d] hover:bg-[#111316] border border-[#1a1d23] hover:border-[#252a33] transition-all duration-500 relative overflow-hidden group"
					disabled={pending}
					onMouseEnter={() => setIsHovered(true)}
					onMouseLeave={() => setIsHovered(false)}
				>
					<PurpleGlareEffect isHovered={isHovered} />

					<span className="relative z-10">
						{pending ? (
							<Flex className="items-center justify-center">
								<Loader2 className="mr-2 h-4 w-4 animate-spin transition-bezier-3 duration-1000 bezier-2" />
								<Flex
									gap="xs"
									className="items-center justify-center"
								>
									{type === 'login'
										? 'Signing in'
										: 'Creating account'}
									<MinimalEllipsis />
								</Flex>
							</Flex>
						) : (
							<>
								{type === 'login'
									? 'Sign in'
									: 'Create account'}
							</>
						)}
					</span>

					<motion.div
						initial={{ x: '-100%' }}
						whileHover={{ x: '0%' }}
						transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
						className="absolute inset-0 bg-gradient-to-r from-[#1a1d23]/0 via-[#252a33]/20 to-[#1a1d23]/0"
					/>
				</Button>
			</div>
		</div>
	)
}
