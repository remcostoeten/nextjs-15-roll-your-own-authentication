'use client'

import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/shared/utils/cn'

const badgeVariants = cva(
    'inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset transition-colors',
    {
        variants: {
            variant: {
                default:
                    'bg-primary/10 text-primary ring-primary/20',
                secondary:
                    'bg-secondary/10 text-secondary ring-secondary/20',
                destructive:
                    'bg-destructive/10 text-destructive ring-destructive/20',
                outline: 'text-foreground',
            },
        },
        defaultVariants: {
            variant: 'default',
        },
    }
)

export interface BadgeProps
    extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> { }

function Badge({ className, variant, ...props }: BadgeProps) {
    return (
        <div className={cn(badgeVariants({ variant }), className)} {...props} />
    )
}

export { Badge, badgeVariants } 