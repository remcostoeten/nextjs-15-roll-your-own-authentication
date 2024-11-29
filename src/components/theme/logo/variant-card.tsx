"use client"

import { Button } from "@/shared/ui/button"
import { Card } from "@/shared/ui/card"
import { cn } from "helpers"
import { RefreshCw } from 'lucide-react'
import { useState } from "react"
import { CodeBlock } from "./code-block"
import { ShieldLogo } from "./shield-logo"

interface VariantCardProps {
    variant: AnimationVariant
    customColors?: {
        fill?: string
        fillOutline?: string
        fillTop?: string
        fillLeft?: string
        fillRight?: string
    }
    variantCode: string
    description?: string
    className?: string
}

export function VariantCard({
    variant,
    customColors,
    variantCode,
    description,
    className
}: VariantCardProps) {
    const [key, setKey] = useState(0)

    const handleReplay = () => {
        setKey(k => k + 1)
    }

    return (
        <Card className={cn(
            "flex flex-col gap-4 p-6 transition-colors duration-300",
            className
        )}>
            <div className="flex flex-col items-center gap-4">
                <div className="relative">
                    <ShieldLogo
                        key={key}
                        size="lg"
                        animated
                        animationVariant={variant}
                        hasTooltip
                        tooltipContent={description || `${variant} animation`}
                        {...customColors}
                    />
                    <Button
                        size="icon"
                        variant="ghost"
                        className="absolute -top-2 -right-2 h-8 w-8"
                        onClick={handleReplay}
                    >
                        <RefreshCw className="h-4 w-4" />
                        <span className="sr-only">Replay animation</span>
                    </Button>
                </div>
                <div className="text-center">
                    <span className="text-sm font-medium capitalize">{variant}</span>
                    {description && (
                        <p className="mt-1 text-xs text-muted-foreground">{description}</p>
                    )}
                </div>
            </div>
            <CodeBlock
                title={variant}
                code={variantCode}
                className="border-t pt-4"
                onReplay={handleReplay}
            />
        </Card>
    )
}

