import React from 'react'
import { VariantProps, cva } from 'class-variance-authority'
import { cn } from '@/shared/utils/cn'
import Link from 'next/link'
import { Slot } from '@radix-ui/react-slot'

// Text/Paragraph component variants
const textVariants = cva('text-title-light', {
	variants: {
		variant: {
			default: 'text-title-light',
			muted: 'text-button text-sm',
			lead: 'text-xl text-title-light/90',
			large: 'text-lg font-semibold text-title-light',
			small: 'text-sm font-medium leading-none',
			subtle: 'text-sm text-button/80',
		},
		size: {
			default: 'text-base',
			sm: 'text-sm',
			xs: 'text-xs',
			lg: 'text-lg',
			xl: 'text-xl',
			'2xl': 'text-2xl',
		},
		weight: {
			default: 'font-normal',
			medium: 'font-medium',
			semibold: 'font-semibold',
			bold: 'font-bold',
			light: 'font-light',
		},
		align: {
			left: 'text-left',
			center: 'text-center',
			right: 'text-right',
		},
		display: {
			default: 'block',
			inline: 'inline',
			inlineBlock: 'inline-block',
		},
	},
	defaultVariants: {
		variant: 'default',
		size: 'default',
		weight: 'default',
		align: 'left',
		display: 'default',
	},
})

// Heading component variants
const headingVariants = cva('text-title-light tracking-tight', {
	variants: {
		level: {
			h1: 'text-4xl font-extrabold lg:text-5xl',
			h2: 'text-3xl font-bold lg:text-4xl',
			h3: 'text-2xl font-bold lg:text-3xl',
			h4: 'text-xl font-semibold',
			h5: 'text-lg font-semibold',
			h6: 'text-base font-semibold',
		},
		variant: {
			default: 'text-title-light',
			subtle: 'text-title-light/80',
			muted: 'text-button',
			gradient: 'text-[#F2F0ED]',
		},
		align: {
			left: 'text-left',
			center: 'text-center',
			right: 'text-right',
		},
		hasMargin: {
			true: 'mb-3',
			false: '',
		},
		pageTitle: {
			true: 'text-4xl font-bold lg:text-5xl mb-6',
			false: '',
		},
	},
	defaultVariants: {
		level: 'h2',
		variant: 'default',
		align: 'left',
		hasMargin: true,
		pageTitle: false,
	},
})

// Flex container variants
const flexVariants = cva('flex', {
	variants: {
		direction: {
			row: 'flex-row',
			col: 'flex-col',
			rowReverse: 'flex-row-reverse',
			colReverse: 'flex-col-reverse',
		},
		items: {
			start: 'items-start',
			center: 'items-center',
			end: 'items-end',
			baseline: 'items-baseline',
			stretch: 'items-stretch',
		},
		justify: {
			start: 'justify-start',
			center: 'justify-center',
			end: 'justify-end',
			between: 'justify-between',
			around: 'justify-around',
			evenly: 'justify-evenly',
		},
		wrap: {
			noWrap: 'flex-nowrap',
			wrap: 'flex-wrap',
			wrapReverse: 'flex-wrap-reverse',
		},
		gap: {
			0: 'gap-0',
			1: 'gap-1',
			2: 'gap-2',
			3: 'gap-3',
			4: 'gap-4',
			5: 'gap-5',
			6: 'gap-6',
			8: 'gap-8',
			10: 'gap-10',
		},
	},
	defaultVariants: {
		direction: 'row',
		items: 'start',
		justify: 'start',
		wrap: 'noWrap',
		gap: 0,
	},
})

interface TextProps
	extends React.HTMLAttributes<HTMLParagraphElement>,
		VariantProps<typeof textVariants> {
	asChild?: boolean
	as?: React.ElementType
	hasLink?: boolean
	linkHref?: string
	isExternal?: boolean
	linkClassName?: string
}

const Text = React.forwardRef<HTMLParagraphElement, TextProps>(
	(
		{
			className,
			variant,
			size,
			weight,
			align,
			display,
			asChild = false,
			as: Tag = 'p',
			hasLink = false,
			linkHref = '#',
			isExternal = false,
			linkClassName = '',
			children,
			...props
		},
		ref
	) => {
		const Component = asChild ? Slot : Tag

		const content = hasLink ? (
			<Link
				href={linkHref}
				className={cn('hover:underline', linkClassName)}
				{...(isExternal
					? {
							target: '_blank',
							rel: 'noopener noreferrer',
						}
					: {})}
			>
				{children}
			</Link>
		) : (
			children
		)

		return (
			<Component
				ref={ref}
				className={cn(
					textVariants({
						variant,
						size,
						weight,
						align,
						display,
						className,
					})
				)}
				{...props}
			>
				{content}
			</Component>
		)
	}
)
Text.displayName = 'Text'

interface HeadingProps
	extends React.HTMLAttributes<HTMLHeadingElement>,
		VariantProps<typeof headingVariants> {
	asChild?: boolean
	hasLink?: boolean
	linkHref?: string
	isExternal?: boolean
	linkClassName?: string
	iconBefore?: React.ReactNode
	iconAfter?: React.ReactNode
}

const Heading = React.forwardRef<HTMLHeadingElement, HeadingProps>(
	(
		{
			className,
			level = 'h2',
			variant,
			align,
			hasMargin,
			pageTitle,
			asChild = false,
			hasLink = false,
			linkHref = '#',
			isExternal = false,
			linkClassName = '',
			iconBefore,
			iconAfter,
			children,
			...props
		},
		ref
	) => {
		const HeadingTag = asChild ? Slot : (level as React.ElementType)

		const content = (
			<>
				{iconBefore && (
					<span className="inline-flex mr-2">{iconBefore}</span>
				)}
				{hasLink ? (
					<Link
						href={linkHref}
						className={cn('hover:underline', linkClassName)}
						{...(isExternal
							? {
									target: '_blank',
									rel: 'noopener noreferrer',
								}
							: {})}
					>
						{children}
					</Link>
				) : (
					children
				)}
				{iconAfter && (
					<span className="inline-flex ml-2">{iconAfter}</span>
				)}
			</>
		)

		return (
			<HeadingTag
				ref={ref}
				className={cn(
					headingVariants({
						level,
						variant,
						align,
						hasMargin,
						pageTitle,
						className,
					})
				)}
				{...props}
			>
				{content}
			</HeadingTag>
		)
	}
)
Heading.displayName = 'Heading'

interface FlexProps
	extends React.HTMLAttributes<HTMLDivElement>,
		VariantProps<typeof flexVariants> {
	as?: React.ElementType
}

const Flex = React.forwardRef<HTMLDivElement, FlexProps>(
	(
		{
			className,
			direction,
			items,
			justify,
			wrap,
			gap,
			as: Component = 'div',
			children,
			...props
		},
		ref
	) => {
		return (
			<Component
				ref={ref}
				className={cn(
					flexVariants({
						direction,
						items,
						justify,
						wrap,
						gap,
						className,
					})
				)}
				{...props}
			>
				{children}
			</Component>
		)
	}
)
Flex.displayName = 'Flex'

// Export interfaces and components
export { Text, Heading, Flex, textVariants, headingVariants, flexVariants }
export type { TextProps, HeadingProps, FlexProps }
