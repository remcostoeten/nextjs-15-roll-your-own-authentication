import React from 'react'

interface TitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
	level?: 1 | 2 | 3 | 4 | 5 | 6
	children: React.ReactNode
	className?: string
	id?: string
}

/**
 * Title Component: A modular and accessible title component for Next.js applications.
 *
 * @param {TitleProps} props - The props object.
 * @param {1 | 2 | 3 | 4 | 5 | 6} [props.level=1] - The heading level (h1-h6). Defaults to h1.
 * @param {React.ReactNode} props.children - The content to display inside the title.
 * @param {string} [props.className] - Optional CSS class names to apply.
 * @param {string} [props.id] - Optional ID for the title element.
 * @param {React.HTMLAttributes<HTMLHeadingElement>} props.rest - Other HTML attributes to pass to the heading element.
 *
 * @returns {JSX.Element} A title element with the specified level and content.
 *
 * @example
 * // Usage example:
 * <Title level={2} className="text-2xl font-bold">
 *   Section Title
 * </Title>
 */
const Title: React.FC<TitleProps> = ({
	level = 1,
	children,
	className,
	id,
	...rest
}) => {
	const HeadingTag = `h${level}` as keyof React.ReactHTML

	return (
		<HeadingTag
			id={id}
			className={className}
			{...rest}
		>
			{children}
		</HeadingTag>
	)
}

export default Title
