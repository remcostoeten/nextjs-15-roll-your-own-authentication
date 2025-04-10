'use client'
type TProps = {
	color?: string
	fillColor?: string
	size?: number
	speed?: number
	strokeWidth?: number
}

export function HeartbeatLoader({
	color = '#ff4d4f',
	fillColor = 'none',
	size = 64,
	speed = 1.4,
	strokeWidth = 3,
}: TProps) {
	const strokeDashArray = size * 1.5
	const strokeDashOffset = strokeDashArray

	return (
		<div
			className="loading"
			style={{ width: size, height: size * 0.75 }}
		>
			<svg
				width={`${size}px`}
				height={`${size * 0.75}px`}
				viewBox="0 0 64 48"
				xmlns="http://www.w3.org/2000/svg"
			>
				<polyline
					points="0.157 23.954, 14 23.954, 21.843 48, 43 0, 50 24, 64 24"
					id="back"
					style={{
						fill: fillColor,
						strokeWidth: strokeWidth,
						stroke: `${color}33`,
					}}
				></polyline>
				<polyline
					points="0.157 23.954, 14 23.954, 21.843 48, 43 0, 50 24, 64 24"
					id="front"
					style={{
						fill: fillColor,
						strokeWidth: strokeWidth,
						stroke: color,
						strokeDasharray: strokeDashArray,
						strokeDashoffset: strokeDashOffset,
						animation: `dash_682 ${speed}s linear infinite`,
					}}
				></polyline>
			</svg>

			<style jsx>{`
				@keyframes dash_682 {
					72.5% {
						opacity: 0;
					}
					to {
						stroke-dashoffset: 0;
					}
				}
			`}</style>
		</div>
	)
}
