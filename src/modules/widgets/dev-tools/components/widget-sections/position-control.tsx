import { Button } from "@/shared/components/ui/button"
import { CornerLeftUp, CornerRightUp, CornerLeftDown, CornerRightDown } from "lucide-react"
import type { WidgetPosition } from "../types"

interface PositionControlProps {
    widgetPosition: WidgetPosition
    setPresetPosition: (position: WidgetPosition) => void
}

export function PositionControl({ widgetPosition, setPresetPosition }: PositionControlProps) {
    return (
        <div className="mb-3">
            <div className="flex justify-between items-center mb-1">
                <span className="text-xs text-gray-600 dark:text-zinc-400">Position</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPresetPosition("top-left")}
                    className={\`h-8 text-xs \${widgetPosition === "top-left" ? "bg-gray-200 dark:bg-zinc-800" : ""}\`}
                >
                    <CornerLeftUp className="h-3.5 w-3.5 mr-1.5" /> Top Left
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPresetPosition("top-right")}
                    className={\`h-8 text-xs \${widgetPosition === "top-right" ? "bg-gray-200 dark:bg-zinc-800" : ""}\`}
                >
                    <CornerRightUp className="h-3.5 w-3.5 mr-1.5" /> Top Right
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPresetPosition("bottom-left")}
                    className={\`h-8 text-xs \${widgetPosition === "bottom-left" ? "bg-gray-200 dark:bg-zinc-800" : ""}\`}
                >
                    <CornerLeftDown className="h-3.5 w-3.5 mr-1.5" /> Bottom Left
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPresetPosition("bottom-right")}
                    className={\`h-8 text-xs \${widgetPosition === "bottom-right" ? "bg-gray-200 dark:bg-zinc-800" : ""}\`}
                >
                    <CornerRightDown className="h-3.5 w-3.5 mr-1.5" /> Bottom Right
                </Button>
            </div>
        </div>
    )
} 