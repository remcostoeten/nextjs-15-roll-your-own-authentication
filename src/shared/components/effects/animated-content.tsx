'use client';

import { type Variants, motion } from 'framer-motion';
import type { ReactNode } from 'react';

export const SHARED_ANIMATION_CONFIG = {
	fadeInUp: {
		initial: { opacity: 0, y: 20 },
		animate: { opacity: 1, y: 0 },
		transition: { duration: 0.5 },
	},
	textSlideIn: {
		initial: { opacity: 0, x: -20 },
		animate: { opacity: 1, x: 0 },
		transition: { duration: 0.6, delay: 0.3 },
	},
	numberFlow: {
		transform: { duration: 2500, easing: 'cubic-bezier(0.65, 0, 0.35, 1)' },
		spin: { duration: 2500, easing: 'cubic-bezier(0.65, 0, 0.35, 1)' },
		opacity: { duration: 2000, easing: 'ease-in-out' },
	},
} as const;

type TAnimatedContentProps = {
	children: ReactNode;
	variants?: Variants;
	className?: string;
	delay?: number;
	type?: keyof typeof SHARED_ANIMATION_CONFIG;
};

export function AnimatedContent({
	children,
	variants,
	className = '',
	delay = 0,
	type = 'fadeInUp',
}: TAnimatedContentProps) {
	return (
		<motion.div
			className={className}
			initial="initial"
			animate="animate"
			variants={variants || SHARED_ANIMATION_CONFIG[type]}
			transition={{ delay }}
		>
			{children}
		</motion.div>
	);
}

type TAnimatedTextProps = {
	children: ReactNode;
	className?: string;
	delay?: number;
};

export function AnimatedText({ children, className = '', delay = 0 }: TAnimatedTextProps) {
	return (
		<AnimatedContent type="textSlideIn" className={className} delay={delay}>
			{children}
		</AnimatedContent>
	);
}
