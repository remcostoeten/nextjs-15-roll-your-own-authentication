import { Slider } from '@/shared/components/ui/slider'

interface OpacityControlProps {
	widgetOpacity: number
	updateOpacity: (value: number) => void
}

export function OpacityControl({
	widgetOpacity,
	updateOpacity,
}: OpacityControlProps) {
	return (
		<div className="mb-3">
			<div className="flex justify-between items-center mb-1">
				<span className="text-xs text-gray-600 dark:text-zinc-400">
					Opacity
				</span>
				<span className="text-xs font-mono text-gray-600 dark:text-zinc-400">
					{Math.round(widgetOpacity * 100)}%
				</span>
			</div>
			<Slider
				defaultValue={[widgetOpacity * 100]}
				max={100}
				min={20}
				step={5}
				onValueChange={(values) => updateOpacity(values[0] / 100)}
				className="py-1"
			/>
		</div>
	)
}
