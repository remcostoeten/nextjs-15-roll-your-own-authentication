'use client';

import type { CSSProperties, ElementType, ReactNode } from 'react';
import { cn } from 'utilities';
import { TextAnimate } from './effects/text-animate';

type TextSize = 'base' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl';

type AnimationType = 'text' | 'word' | 'character' | 'line';
type AnimationVariant =
	| 'fadeIn'
	| 'blurIn'
	| 'blurInUp'
	| 'blurInDown'
	| 'slideUp'
	| 'slideDown'
	| 'slideLeft'
	| 'slideRight'
	| 'scaleUp'
	| 'scaleDown';

type TProps = {
	/**
	 * The text content to render. Can be a string or React nodes.
	 */
	children: ReactNode;
	/**
	 * Apply a gradient text style. Defaults to false.
	 */
	hasGradient?: boolean;
	/**
	 * The size of the text. Defaults to 'base'.
	 */
	size?: TextSize;
	/**
	 * Custom inline styles.
	 */
	style?: CSSProperties;
	/**
	 * Additional CSS classes.
	 */
	className?: string;
	/**
	 * Apply hyphenation and text-pretty styles. Defaults to false.
	 */
	hyphens?: boolean;
	/**
	 * The language for hyphenation. Used with the 'hyphens' prop. Defaults to 'en'.
	 */
	lang?: 'en' | 'nl';
	/**
	 * Enable text animation using the TextAnimate component. Defaults to false.
	 */
	animate?: boolean;
	/**
	 * The type of animation to apply (word, character, etc.). Used with the 'animate' prop. Defaults to 'character'.
	 */
	animationBy?: AnimationType;
	/**
	 * The animation preset to use (fadeIn, slideUp, etc.). Used with the 'animate' prop. Defaults to 'blurIn'.
	 */
	animationVariant?: AnimationVariant;
	/**
	 * The delay before the animation starts. Used with the 'animate' prop. Defaults to 0.
	 */
	animationDelay?: number;
	/**
	 * The duration of the animation. Used with the 'animate' prop. Defaults to 0.3.
	 */
	animationDuration?: number;
	/**
	 * Custom motion variants for the animation. Used with the 'animate' prop.
	 */
	animationVariants?: any; // Use 'any' for simplicity, you could define a more specific Variants type
	/**
	 * Whether to start animation when component enters viewport. Used with the 'animate' prop. Defaults to true.
	 */
	animationStartOnView?: boolean;
	/**
	 * Whether to animate only once. Used with the 'animate' prop. Defaults to false.
	 */
	animationOnce?: boolean;
	/**
	 * The HTML element type to render. Defaults to 'p'.
	 */
	as?: ElementType;
	/**
	 * Class name applied to each animated segment. Used with the 'animate' prop.
	 */
	animationSegmentClassName?: string;
};

// Map text sizes to Tailwind CSS classes
const textSizeClasses: Record<TextSize, string> = {
	base: 'text-base',
	lg: 'text-lg',
	xl: 'text-xl',
	'2xl': 'text-2xl',
	'3xl': 'text-3xl',
	'4xl': 'text-4xl',
	'5xl': 'text-5xl',
};

// Default gradient classes
const gradientClasses =
	'from-zinc-200 via-zinc-300 to-zinc-400 bg-clip-text text-transparent animate-gradient-x';

export default function Text({
	children,
	hasGradient = false,
	size = 'base',
	style,
	className,
	hyphens = false,
	lang = 'en',
	animate = false,
	animationBy = 'character',
	animationVariant = 'blurIn',
	animationDelay = 0,
	animationDuration = 0.3,
	animationVariants,
	animationStartOnView = true,
	animationOnce = false,
	animationSegmentClassName,
	as = 'p',
	...props
}: TProps) {
	const baseClasses = textSizeClasses[size];
	const gradientStyle = hasGradient ? gradientClasses : '';
	const hyphenationClasses = hyphens ? 'text-pretty hyphens-auto' : '';
	const langAttribute = hyphens ? lang : undefined;

	const textContent = typeof children === 'string' ? children : undefined;
	const nonStringContent = typeof children !== 'string' ? children : undefined;

	const combinedClasses = cn(baseClasses, gradientStyle, hyphenationClasses, className);

	if (animate && textContent) {
		return (
			<TextAnimate
				as={as}
				className={combinedClasses}
				style={style}
				by={animationBy}
				animation={animationVariant}
				delay={animationDelay}
				duration={animationDuration}
				variants={animationVariants}
				startOnView={animationStartOnView}
				once={animationOnce}
				segmentClassName={animationSegmentClassName}
				{...props} // Pass any additional motion props
			>
				{textContent}
			</TextAnimate>
		);
	}

	// Render a regular element if no animation is requested or if children are not a string
	const Element = as as ElementType;
	return (
		<Element className={combinedClasses} style={style} lang={langAttribute} {...props}>
			{children}
		</Element>
	);
}
