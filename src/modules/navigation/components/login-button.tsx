import { motion } from 'framer-motion'
import { LogIn } from 'lucide-react'
import { Button } from 'ui'
import { navAnimations } from '../animations/nav-animations'

export function LoginButton() {
	return (
		<Button
			variant="ghost"
			size="sm"
			className="flex items-center gap-2"
			asChild
		>
			<motion.a
				href="/login"
				variants={navAnimations.item}
				whileHover={{ scale: 1.05 }}
				whileTap={{ scale: 0.95 }}
			>
				<LogIn className="w-4 h-4" />
				<span>Login</span>
			</motion.a>
		</Button>
	)
}
