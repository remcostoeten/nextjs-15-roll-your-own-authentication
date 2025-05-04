import { memo } from 'react'
import Link from 'next/link'
import { Github } from 'lucide-react'
import { motion } from 'framer-motion'
import { NavItem } from './nav-item'
import { For } from '@/components/ui/core/for'
import { MOBILE_MENU_VARIANTS } from '../../constants'
import { LoginButton } from './login-button'

type TMobileMenuProps = {
	navItems: Array<{ name: string; href: string }>
	demoItems: Array<{
		name: string
		href: string
		description: string
		soon?: boolean
	}>
	pathname: string
	toggleMenu: () => void
}

function MobileMenuComponent({
	navItems,
	demoItems,
	pathname,
	toggleMenu
}: TMobileMenuProps) {
	const matrixBgStyles = {
		backgroundImage:
			"url(\"data:image/svg+xml,%3Csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3Cpattern id='matrix' width='20' height='20' patternUnits='userSpaceOnUse'%3E%3Ctext x='0' y='15' fontFamily='monospace' fontSize='15' fill='%230f0' opacity='0.3'%3E0%3C/text%3E%3Ctext x='10' y='10' fontFamily='monospace' fontSize='10' fill='%230f0' opacity='0.3'%3E1%3C/text%3E%3C/pattern%3E%3C/defs%3E%3Crect width='100%25' height='100%25' fill='url(%23matrix)'/%3E%3C/svg%3E\")",
		backgroundSize: '50px 50px',
		animation: 'matrix-rain 20s linear infinite'
	}

	return (
		<motion.div
			className='fixed inset-0 top-16 z-40 bg-[#0D0C0C]/95 backdrop-blur-md md:hidden'
			variants={MOBILE_MENU_VARIANTS}
			initial='hidden'
			animate='visible'
			exit='exit'
		>
			{/* Matrix code background */}
			<div
				className='absolute inset-0 opacity-5'
				style={matrixBgStyles}
			/>

			<div className='relative z-10 flex h-full flex-col items-center justify-center'>
				<nav className='flex flex-col items-center gap-8 py-8'>
					<For
						each={navItems}
						keyExtractor={(item) => item.name}
						memoizeChildren={true}
					>
						{(item, index) => (
							<motion.div
								className='flex items-center justify-center'
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{
									delay: index * 0.1,
									duration: 0.3
								}}
							>
								<NavItem
									href={item.href}
									name={item.name}
									isActive={pathname === item.href}
								/>
							</motion.div>
						)}
					</For>

					<motion.div
						className='flex items-center justify-center'
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{
							delay: navItems.length * 0.1,
							duration: 0.3
						}}
					>
						<div className='flex flex-col items-center'>
							<div className='mb-2 font-mono text-[#4e9815]'>
								_demos
							</div>
							<div className='flex flex-col gap-2'>
								<For
									each={demoItems}
									keyExtractor={(item) => item.name}
									memoizeChildren={true}
								>
									{(item) => (
										<Link
											href={item.href}
											className='text-center text-sm text-[#8C877D] transition-colors hover:text-white'
											onClick={toggleMenu}
										>
											{item.name}
										</Link>
									)}
								</For>
							</div>
						</div>
					</motion.div>

					<motion.a
						href='https://github.com/remcostoeten/nextjs-15-roll-your-own-authentication'
						target='_blank'
						rel='noopener noreferrer'
						className='group relative mt-4 flex items-center justify-center'
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{
							delay: (navItems.length + 1) * 0.1,
							duration: 0.3
						}}
					>
						<Github className='h-6 w-6 text-[#8C877D] transition-colors duration-200 group-hover:text-white' />
						<span className='absolute -inset-4 rounded-full bg-[#4e9815] blur opacity-0 transition-opacity duration-300 group-hover:opacity-20'></span>
					</motion.a>

					<motion.div
						className='mt-6'
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{
							delay: (navItems.length + 2) * 0.1,
							duration: 0.3
						}}
					>
						<LoginButton />
					</motion.div>
				</nav>
			</div>
		</motion.div>
	)
}

export const MobileMenu = memo(MobileMenuComponent)
