import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import * as React from 'react'

import { cn } from '@/lib/utils'

const buttonVariants = cva(
	'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0',
	{
		variants: {
			variant: {
				default:
					'bg-[#e3e4e6] text-[#000000] hover:bg-[#969799] dark:bg-zinc-900 dark:text-zinc-200 dark:hover:bg-zinc-800',
				destructive:
					'bg-red-500/10 text-red-500 hover:bg-red-500/20 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/30',
				outline:
					'border border-[#e3e4e6] bg-transparent hover:bg-[#e3e4e6]/10 hover:text-[#000000] dark:border-zinc-800 dark:hover:bg-zinc-800 dark:hover:text-zinc-200',
				secondary:
					'bg-[#969799] text-[#000000] hover:bg-[#e3e4e6] dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-700',
				ghost: 'hover:bg-[#e3e4e6]/10 hover:text-[#000000] dark:hover:bg-zinc-800 dark:hover:text-zinc-200',
				link: 'text-[#000000] underline-offset-4 hover:underline dark:text-zinc-200'
			},
			size: {
				default: 'h-9 px-4 py-2',
				sm: 'h-8 rounded-md px-3 text-xs',
				lg: 'h-10 rounded-md px-8',
				icon: 'h-9 w-9'
			}
		},
		defaultVariants: {
			variant: 'default',
			size: 'default'
		}
	}
)

export interface ButtonProps
	extends React.ButtonHTMLAttributes<HTMLButtonElement>,
		VariantProps<typeof buttonVariants> {
	asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
	({ className, variant, size, asChild = false, ...props }, ref) => {
		const Comp = asChild ? Slot : 'button'
		return (
			<Comp
				className={cn(buttonVariants({ variant, size, className }))}
				ref={ref}
				{...props}
			/>
		)
	}
)
Button.displayName = 'Button'

export { Button, buttonVariants }
