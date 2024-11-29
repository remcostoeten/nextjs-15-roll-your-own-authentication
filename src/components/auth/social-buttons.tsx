'use client'

import { motion } from 'framer-motion'
import { itemAnimation } from './animations'
import type { SocialButtonProps } from './types'

function SocialButton({ icon, label, index }: SocialButtonProps) {
	return (
		<motion.button
			custom={index}
			variants={itemAnimation}
			className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-[#222] rounded-xl hover:bg-[#333] hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 focus:outline-none"
			type="button"
		>
			<span className="text-gray-400 group-hover:text-white transition-colors">
				{icon}
			</span>
			{label}
		</motion.button>
	)
}

export default SocialButton
