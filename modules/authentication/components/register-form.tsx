'use client'

import { useFormStatus } from 'react-dom'
import { Loader2 } from 'lucide-react'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'
import { PasswordInput } from './password-input'
import { Flex } from '@/shared/components/flexer'

export function RegisterForm() {
	const { pending } = useFormStatus()

	return (
		<div className="space-y-4">
			<div className="grid grid-cols-2 gap-4">
				<Flex gap="md">
					<div className="space-y-2">
						<Label
							htmlFor="firstName"
							className="text-sm font-medium"
						>
							First name
						</Label>
						<Input
							id="firstName"
							name="firstName"
							required
							placeholder="John"
							className="bg-[#0d0d0d] border-[#1a1d23] focus-visible:ring-0 focus-visible:border-[#252a33] transition-colors duration-300 rounded-sm"
						/>
					</div>

					<div className="space-y-2">
						<Label
							htmlFor="lastName"
							className="text-sm font-medium"
						>
							Last name
						</Label>
						<Input
							id="lastName"
							name="lastName"
							required
							placeholder="Doe"
							className="bg-[#0d0d0d] border-[#1a1d23] focus-visible:ring-0 focus-visible:border-[#252a33] transition-colors duration-300 rounded-sm"
						/>
					</div>
				</Flex>
			</div>

			<div className="space-y-2">
				<Label
					htmlFor="username"
					className="text-sm font-medium"
				>
					Username
				</Label>
				<Input
					id="username"
					name="username"
					required
					placeholder="johndoe"
					className="bg-[#0d0d0d] border-[#1a1d23] focus-visible:ring-0 focus-visible:border-[#252a33] transition-colors duration-300 rounded-sm"
				/>
			</div>

			<div className="space-y-2">
				<Label
					htmlFor="email"
					className="text-sm font-medium"
				>
					Email
				</Label>
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

			<div className="space-y-2">
				<Label
					htmlFor="phone"
					className="text-sm font-medium"
				>
					Phone (optional)
				</Label>
				<Input
					id="phone"
					name="phone"
					type="tel"
					placeholder="+1 (555) 123-4567"
					className="bg-[#0d0d0d] border-[#1a1d23] focus-visible:ring-0 focus-visible:border-[#252a33] transition-colors duration-300 rounded-sm"
				/>
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
					autoComplete="new-password"
					required
				/>
			</div>

			<Button
				type="submit"
				className="w-full bg-[#0d0d0d] hover:bg-[#111316] border border-[#1a1d23] hover:border-[#252a33] transition-all duration-500 relative overflow-hidden group"
				disabled={pending}
			>
				<span className="relative z-10">
					{pending ? (
						<>
							<Loader2 className="mr-2 h-4 w-4 animate-spin" />
							Creating account...
						</>
					) : (
						<>Create account</>
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
	)
}
