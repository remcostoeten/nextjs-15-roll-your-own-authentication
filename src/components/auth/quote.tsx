'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'

export default function AuthQuote() {
	return (
		<motion.div 
			className="hidden lg:flex bg-[#1C1C1C] relative overflow-hidden"
			initial={{ opacity: 0, x: 20 }}
			animate={{ opacity: 1, x: 0 }}
			transition={{ duration: 0.7, delay: 0.5 }}
		>
			<div className="relative flex items-center w-full">
				<motion.div 
					className="relative px-12 py-24"
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.7, delay: 0.8 }}
				>
					<figure className="space-y-6 max-w-lg">
						<motion.blockquote 
							className="text-3xl text-white/90"
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							transition={{ duration: 0.7, delay: 1 }}
						>
							&apos;I&apos;m trying @supabase, Firebase alternative that uses PostgreSQL (and you can use GraphQL too) in the cloud. It&apos;s incredible 🤩&apos;
						</motion.blockquote>
						<motion.figcaption 
							className="flex items-center gap-4"
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							transition={{ duration: 0.7, delay: 1.2 }}
						>
							<Image
								src="https://avatars.githubusercontent.com/u/11247099"
								alt="@JP_Gallegos"
								width={48}
								height={48}
								className="rounded-full"
							/>
							<div className="flex flex-col gap-1">
								<cite className="text-white/90 font-medium not-italic">
									@JP_Gallegos
								</cite>
								<a
									href="https://twitter.com/JP_Gallegos"
									target="_blank"
									rel="noopener noreferrer"
									className="text-sm text-white/50 hover:text-white/70 transition-colors"
								>
									View tweet
								</a>
							</div>
						</motion.figcaption>
					</figure>
				</motion.div>
			</div>
		</motion.div>
	)
}