import Link from 'next/link'
import { motion } from 'framer-motion'
import { TextScrambler } from '@/shared/components/effects'
const logoVariants = {
	hidden: { opacity: 0, scale: 0.95 },
	visible: {
		opacity: 1,
		scale: 1,
		transition: {
			type: 'spring',
			damping: 12,
			stiffness: 100,
		},
	},
}

export function NavLogo() {
	return (
		<motion.div
			variants={logoVariants}
			initial="hidden"
			animate="visible"
		>
			<div className="flex items-center gap-2 group">
				<Link
					href="/"
					className="relative h-5 w-5 flex items-center justify-center group-hover:scale-110 transition-transform duration-300"
				>
					<div className="absolute inset-0 rounded bg-white opacity-80 group-hover:opacity-90 transition-opacity duration-300"></div>
					<div className="absolute inset-[2px] rounded bg-[#0D0C0C]"></div>
					<div className="absolute inset-[4px] rounded bg-[#4e9815] opacity-70 group-hover:opacity-80 group-hover:animate-pulse transition-opacity duration-300"></div>
					<div className="absolute inset-[6px] rounded bg-[#0D0C0C]"></div>
					<div className="absolute inset-[8px] rounded bg-white opacity-90 group-hover:opacity-100 transition-opacity duration-300"></div>
				</Link>
				<TextScrambler
					href="/"
					text="ROLL-YOUR-OWN-AUTH"
					isActive={true}
				/>
			</div>
		</motion.div>
	)
}
