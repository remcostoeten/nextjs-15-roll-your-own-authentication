import React from 'react'
import { TextAnimate } from './effects/text-animate'

type HeadingLevel = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'

interface TitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
	level?: 1 | 2 | 3 | 4 | 5 | 6
	children: React.ReactNode
	className?: string
	id?: string
	animate?: boolean
	animation?:
		| 'fadeIn'
		| 'blurIn'
		| 'blurInUp'
		| 'blurInDown'
		| 'slideUp'
		| 'slideDown'
		| 'slideLeft'
		| 'slideRight'
		| 'scaleUp'
		| 'scaleDown'
	by?: 'text' | 'word' | 'character' | 'line'
	delay?: number
	duration?: number
}

/**
 * Title Component: A modular and accessible title component for Next.js applications.
 * Optionally supports text animation using TextAnimate.
 *
 * @param {TitleProps} props - The props object.
 * @param {1 | 2 | 3 | 4 | 5 | 6} [props.level=1] - The heading level (h1-h6). Defaults to h1.
 * @param {React.ReactNode} props.children - The content to display inside the title.
 * @param {string} [props.className] - Optional CSS class names to apply.
 * @param {string} [props.id] - Optional ID for the title element.
 * @param {boolean} [props.animate=false] - Whether to animate the text.
 * @param {string} [props.animation='fadeIn'] - The animation type to use.
 * @param {string} [props.by='word'] - How to split the text for animation.
 * @param {number} [props.delay=0] - Delay before animation starts.
 * @param {number} [props.duration=0.3] - Duration of the animation.
 * @param {React.HTMLAttributes<HTMLHeadingElement>} props.rest - Other HTML attributes to pass to the heading element.
 *
 * @returns {JSX.Element} A title element with the specified level and content.
 *
 * @example
 * // Basic usage:
 * <Title level={2} className="text-2xl font-bold">
 *   Section Title
 * </Title>
 *
 * // With animation:
 * <Title
 *   level={1}
 *   animate
 *   animation="blurInUp"
 *   by="word"
 *   delay={0.2}
 * >
 *   Animated Title
 * </Title>
 */
const Title: React.FC<TitleProps> = ({
	level = 1,
	children,
	className,
	id,
	animate = false,
	animation = 'fadeIn',
	by = 'word',
	delay = 0,
	duration = 0.3,
	...rest
}) => {
	const headingTag = `h${level}` as HeadingLevel

	if (animate && typeof children === 'string') {
		return (
			<div
				id={id}
				{...rest}
			>
				<TextAnimate
					as={headingTag}
					className={className}
					animation={animation}
					by={by}
					delay={delay}
					duration={duration}
				>
					{children}
				</TextAnimate>
			</div>
		)
	}

	const Component = headingTag
	return (
		<Component
			id={id}
			className={className}
			{...rest}
		>
			{children}
		</Component>
	)
}

export default Title
