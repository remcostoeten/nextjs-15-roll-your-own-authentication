'use client'

import * as TooltipPrimitive from '@radix-ui/react-tooltip'
import * as React from 'react'

export type TooltipProps = React.ComponentPropsWithoutRef<
	typeof TooltipPrimitive.Content
>

export const TooltipProvider = TooltipPrimitive.Provider
export const Tooltip = TooltipPrimitive.Root
export const TooltipTrigger = TooltipPrimitive.Trigger
export const TooltipContent = TooltipPrimitive.Content
