'use client'

import Link from 'next/link'
import { Plus } from 'lucide-react'
import { motion } from 'framer-motion'

export function Features() {
	const features = [
		{
			title: 'Framework Agnostic',
			subtitle: 'Supports for popular frameworks.',
			description:
				'Supports popular frameworks, including React, Vue, Svelte, Astro, Solid, Next.js, Nuxt, Tanstack Start, Hono, and more.',
			link: '/docs/frameworks',
		},
		{
			title: 'Authentication',
			subtitle: 'Email & Password Authentication.',
			description:
				'Built-in support for email and password authentication, with session and account management features.',
			link: '/docs/authentication',
		},
		{
			title: 'Social Sign-on',
			subtitle: 'Support multiple OAuth providers.',
			description:
				'Allow users to sign in with their accounts, including GitHub, Google, Discord, Twitter, and more.',
			link: '/docs/oauth',
		},
	]

	const container = {
		hidden: { opacity: 0 },
		show: {
			opacity: 1,
			transition: {
				staggerChildren: 0.1,
				delayChildren: 0.8, // Start after matrix grid animations
			},
		},
	}

	const item = {
		hidden: { opacity: 0, y: 20 },
		show: {
			opacity: 1,
			y: 0,
			transition: {
				type: 'spring',
				stiffness: 100,
				damping: 15,
			},
		},
	}

	return (
		<motion.div
			className="grid grid-cols-3 gap-px bg-[#1E1E1E] px-6"
			variants={container}
			initial="hidden"
			animate="show"
		>
			{features.map((feature, index) => (
				<motion.div
					key={index}
					className="relative bg-[#0D0C0C] p-8"
					variants={item}
					whileHover={{ y: -3, transition: { duration: 0.2 } }}
				>
					<Plus className="absolute right-4 top-4 h-4 w-4 text-[#1E1E1E]" />
					<div className="mb-2 text-sm text-[#8C877D]">
						{feature.title}
					</div>
					<h3 className="mb-4 text-xl font-normal">
						{feature.subtitle.split(' ').slice(0, -1).join(' ')}{' '}
						<span className="font-medium">
							{feature.subtitle.split(' ').pop()}
						</span>
					</h3>
					<p className="mb-4 text-sm text-[#8C877D]">
						{feature.description}
					</p>
					<Link
						href={feature.link}
						className="text-sm text-[#CF9C2] hover:underline transition-colors duration-200"
					>
						Learn more
					</Link>
				</motion.div>
			))}
		</motion.div>
	)
}
