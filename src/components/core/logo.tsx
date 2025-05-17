'use client';

import { siteConfig } from 'core/site-config';
import { motion } from 'framer-motion';
import Link from 'next/link';

const LogoIcon = () => {
	const pathVariants = {
		hidden: { pathLength: 0, opacity: 0 },
		visible: {
			pathLength: 1,
			opacity: 1,
			transition: {
				pathLength: { duration: 1, ease: [0.76, 0, 0.24, 1] },
				opacity: { duration: 0.5 },
			},
		},
	};

	const circleVariants = {
		hidden: { scale: 0, opacity: 0 },
		visible: {
			scale: 1,
			opacity: 1,
			transition: {
				duration: 0.3,
				ease: [0.76, 0, 0.24, 1],
			},
		},
	};

	const streamVariants = {
		hidden: { opacity: 0, pathLength: 0 },
		visible: {
			opacity: 1,
			pathLength: 1,
			transition: {
				duration: 0.5,
				ease: [0.76, 0, 0.24, 1],
			},
		},
	};

	return (
		<motion.svg
			viewBox="0 0 32 32"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			className="h-8 w-8 transition-all duration-300 group-hover:scale-110"
			initial="hidden"
			animate="visible"
		>
			<title>{siteConfig.name}</title>
			<motion.path
				d="M16 2L28 9V23L16 30L4 23V9L16 2Z"
				className="fill-primary/10 stroke-primary"
				strokeWidth="1"
				variants={pathVariants}
			/>

			{/* Animated data streams with staggered fade-in */}
			<motion.g
				variants={{
					hidden: { opacity: 0 },
					visible: {
						opacity: 1,
						transition: {
							delayChildren: 0.15,
							staggerChildren: 0.1,
						},
					},
				}}
				className="animate-[slideUp_3s_linear_infinite]"
			>
				<motion.path
					d="M8 18L16 22L24 18"
					className="stroke-primary"
					strokeWidth="1"
					strokeLinecap="round"
					variants={streamVariants}
				/>
				<motion.path
					d="M8 14L16 18L24 14"
					className="stroke-primary"
					strokeWidth="1"
					strokeLinecap="round"
					variants={streamVariants}
				/>
				<motion.path
					d="M8 10L16 14L24 10"
					className="stroke-primary"
					strokeWidth="1"
					strokeLinecap="round"
					variants={streamVariants}
				/>
			</motion.g>

			{/* Accent lines with delayed fade-in */}
			<motion.g
				variants={{
					hidden: { opacity: 0 },
					visible: {
						opacity: 1,
						transition: {
							delay: 0.8,
							duration: 0.5,
						},
					},
				}}
			>
				<path
					d="M16 2V30"
					className="stroke-primary/40"
					strokeWidth="0.75"
					strokeDasharray="2 2"
				/>
				<path
					d="M4 9L28 9"
					className="stroke-primary/40"
					strokeWidth="0.75"
					strokeDasharray="2 2"
				/>
				<path
					d="M4 23L28 23"
					className="stroke-primary/40"
					strokeWidth="0.75"
					strokeDasharray="2 2"
				/>
			</motion.g>

			{/* Highlight points with staggered pop-in */}
			<motion.g
				variants={{
					hidden: { opacity: 0 },
					visible: {
						opacity: 1,
						transition: {
							delayChildren: 1,
							staggerChildren: 0.1,
						},
					},
				}}
			>
				<motion.circle
					cx="16"
					cy="2"
					r="1.5"
					className="fill-primary"
					variants={circleVariants}
				/>
				<motion.circle
					cx="28"
					cy="9"
					r="1.5"
					className="fill-primary"
					variants={circleVariants}
				/>
				<motion.circle
					cx="28"
					cy="23"
					r="1.5"
					className="fill-primary"
					variants={circleVariants}
				/>
				<motion.circle
					cx="16"
					cy="30"
					r="1.5"
					className="fill-primary"
					variants={circleVariants}
				/>
				<motion.circle
					cx="4"
					cy="23"
					r="1.5"
					className="fill-primary"
					variants={circleVariants}
				/>
				<motion.circle
					cx="4"
					cy="9"
					r="1.5"
					className="fill-primary"
					variants={circleVariants}
				/>
			</motion.g>
		</motion.svg>
	);
};

export function Logo() {
	return (
		<div className="flex items-center justify-center py-4">
			<Link href="/dashboard">
				<motion.div
					className="group relative flex h-14 w-14 items-center justify-center"
					initial={{ opacity: 0, scale: 0.9 }}
					animate={{ opacity: 1, scale: 1 }}
					transition={{
						duration: 0.3,
						ease: [0.76, 0, 0.24, 1],
						delay: 0.2,
					}}
				>
					{/* Animated background gradient */}
					<motion.div
						className="absolute inset-0 rounded-xl bg-gradient-to-br from-primary/20 via-primary/15 to-primary/10"
						initial={{ opacity: 0 }}
						animate={{ opacity: 0.9 }}
						transition={{ delay: 0.3, duration: 0.5 }}
					/>

					{/* Glowing effect */}
					<motion.div
						className="absolute inset-0 rounded-xl bg-primary/5 blur-xl"
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{ delay: 0.4, duration: 0.5 }}
					/>

					{/* Main icon container with animated border */}
					<div className="relative flex h-full w-full items-center justify-center">
						{/* Animated border */}
						<motion.div
							className="absolute inset-0 rounded-xl overflow-hidden"
							initial={{ opacity: 1 }}
							animate={{ opacity: 1 }}
						>
							{/* Top border */}
							<motion.div
								className="absolute top-0 left-0 right-0 h-[1px] bg-primary/60"
								initial={{ scaleX: 0, transformOrigin: 'left' }}
								animate={{ scaleX: 1 }}
								transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1], delay: 0.5 }}
							/>

							{/* Right border */}
							<motion.div
								className="absolute top-0 right-0 bottom-0 w-[1px] bg-primary/60"
								initial={{ scaleY: 0, transformOrigin: 'top' }}
								animate={{ scaleY: 1 }}
								transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1], delay: 1.1 }}
							/>

							{/* Bottom border */}
							<motion.div
								className="absolute bottom-0 left-0 right-0 h-[1px] bg-primary/60"
								initial={{ scaleX: 0, transformOrigin: 'right' }}
								animate={{ scaleX: 1 }}
								transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1], delay: 1.7 }}
							/>

							{/* Left border */}
							<motion.div
								className="absolute top-0 left-0 bottom-0 w-[1px] bg-primary/60"
								initial={{ scaleY: 0, transformOrigin: 'bottom' }}
								animate={{ scaleY: 1 }}
								transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1], delay: 2.3 }}
							/>
						</motion.div>

						{/* Background and content */}
						<motion.div
							className="relative flex h-full w-full items-center justify-center rounded-xl bg-gradient-to-br from-background/80 to-background/60 backdrop-blur-sm shadow-lg"
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							transition={{ delay: 0.5, duration: 0.5 }}
						>
							<LogoIcon />
						</motion.div>
					</div>

					{/* Tooltip */}
					<motion.span
						className="absolute left-full ml-3 hidden rounded-md bg-popover/90 backdrop-blur-sm px-3 py-1.5 text-sm font-medium text-popover-foreground shadow-lg group-hover:block border border-border/50"
						initial={{ opacity: 0, x: -10 }}
						animate={{ opacity: 1, x: 0 }}
						transition={{ delay: 0.6, duration: 0.3 }}
					>
						Database Palace
					</motion.span>
				</motion.div>
			</Link>
		</div>
	);
}
