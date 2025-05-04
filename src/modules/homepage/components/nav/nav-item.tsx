import { memo } from 'react'
import Link from 'next/link'
import type { LinkProps } from 'next/link'
import { motion } from 'framer-motion'
import { Github } from 'lucide-react'

interface NavItemProps extends Omit<LinkProps, 'href'> {
	name: string
	href: string
	isActive?: boolean
}

export const NavItem = memo(function NavItem({
	name,
	href,
	isActive,
	...props
}: NavItemProps) {
	return (
		<motion.div
			className='relative'
			initial={false}
			animate={{ opacity: 1, y: 0 }}
			exit={{ opacity: 0, y: 20 }}
		>
			<Link
				href={href}
				className={`font-mono text-sm transition-colors duration-200 ${
					isActive ? 'text-white' : 'text-[#8C877D] hover:text-white'
				}`}
				{...props}
			>
				{name}
			</Link>
		</motion.div>
	)
})

function GithubLinkComponent() {
	return (
		<a
			href='https://github.com/remcostoeten/nextjs-15-roll-your-own-authentication'
			target='_blank'
			rel='noopener noreferrer'
			className='relative group flex items-center justify-center'
			aria-label='GitHub Repository'
		>
			<Github className='h-5 w-5 text-[#8C877D] group-hover:text-white transition-colors duration-200' />
			<span className='absolute -inset-2 bg-[#4e9815] rounded-full blur opacity-0 group-hover:opacity-20 transition-opacity duration-300'></span>
		</a>
	)
}

export const GithubLink = memo(GithubLinkComponent)
