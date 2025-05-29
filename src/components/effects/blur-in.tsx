'use client';

import { motion, type MotionProps, type Variants } from 'framer-motion';
import { type ElementType, type ReactNode } from 'react';
import { cn } from 'utilities';

type TProps = {
	children: ReactNode;
	delay?: number;
	duration?: number;
	variants?: Variants;
	startOnView?: boolean;
	once?: boolean;
	TComponent?: ElementType;
	className?: string;
} & MotionProps;

const defaultVariants: Variants = {
	hidden: { opacity: 0, filter: 'blur(10px)' },
	show: {
		opacity: 1,
		filter: 'blur(0px)',
		transition: {
			duration: 0.3,
			ease: 'easeOut',
		},
	},
	exit: {
		opacity: 0,
		filter: 'blur(10px)',
		transition: {
			duration: 0.3,
			ease: 'easeOut',
		},
	},
};

export function BlurIn({
	children,
	delay = 0,
	duration = 0.3,
	variants,
	startOnView = true,
	once = false,
	className,
	TComponent = motion.div,
	...props
}: TProps) {
	const finalVariants: Variants = variants ?? {
		hidden: defaultVariants.hidden,
		show: {
			...defaultVariants.show,
			transition: {
				duration,
				delay,
				ease: 'easeOut',
			},
		},
		exit: {
			...defaultVariants.exit,
			transition: {
				duration,
				ease: 'easeOut',
			},
		},
	};

	const MotionComponent = TComponent as ElementType;

	return (
		<MotionComponent
			className={cn(className)}
			variants={finalVariants}
			initial="hidden"
			whileInView={startOnView ? 'show' : undefined}
			animate={startOnView ? undefined : 'show'}
			exit="exit"
			viewport={{ once }}
			{...props}
		>
			{children}
		</MotionComponent>
	);
}
