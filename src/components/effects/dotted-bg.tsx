import React, { useEffect, useMemo, useRef } from 'react';

interface DottedBackgroundProps {
	// Style props
	dotColor?: string;
	backgroundColor?: string;
	dotSize?: number;
	dotSpacing?: number;

	// Effects props
	enableVignette?: boolean;
	vignetteColor?: string;
	enableInnerGlow?: boolean;
	innerGlowColor?: string;
	enableHoverEffect?: boolean;
	hoverColor?: string;
	hoverRadius?: number;

	// New aesthetic props
	enableSubtleAnimation?: boolean;
	enableDepthEffect?: boolean;
	intensity?: number;

	// Container props
	className?: string;
	style?: React.CSSProperties;
}

const DottedBackground: React.FC<DottedBackgroundProps> = ({
	dotColor = '#215769',
	backgroundColor = 'transparent',
	dotSize = 0.6,
	dotSpacing = 16,
	enableVignette = false,
	vignetteColor = 'rgb(0,0,0)',
	enableInnerGlow = false,
	innerGlowColor = 'rgb(0,0,0)',
	enableHoverEffect = true,
	hoverColor = '#4a9eff',
	hoverRadius = 80,
	enableSubtleAnimation = true,
	enableDepthEffect = true,
	intensity = 0.4,
	className = '',
	style = {},
}) => {
	const svgRef = useRef<SVGSVGElement>(null);
	const mousePosition = useRef({ x: 0, y: 0 });
	const requestRef = useRef<number | null>(null);
	const previousTimeRef = useRef<number | null>(null);

	const ids = useMemo(() => {
		const baseId = `dotted-bg-${Math.random().toString(36).substr(2, 9)}`;
		return {
			pattern: `${baseId}-pattern`,
			patternSecondary: `${baseId}-pattern-secondary`,
			vignette: `${baseId}-vignette`,
			innerGlow: `${baseId}-inner-glow`,
			hoverGradient: `${baseId}-hover-gradient`,
			subtleGradient: `${baseId}-subtle-gradient`,
			depthGradient: `${baseId}-depth-gradient`,
		};
	}, []);

	useEffect(() => {
		if (!enableHoverEffect) return;

		const handleMouseMove = (event: MouseEvent) => {
			if (!svgRef.current) return;
			const rect = svgRef.current.getBoundingClientRect();
			mousePosition.current = {
				x: event.clientX - rect.left,
				y: event.clientY - rect.top,
			};
		};

		const animate = (time: number) => {
			if (previousTimeRef.current !== null) {
				if (svgRef.current) {
					const hoverGradient = svgRef.current.querySelector(`#${ids.hoverGradient}`);
					if (hoverGradient) {
						(hoverGradient as SVGElement).setAttribute(
							'cx',
							mousePosition.current.x.toString()
						);
						(hoverGradient as SVGElement).setAttribute(
							'cy',
							mousePosition.current.y.toString()
						);
					}
				}
			}
			previousTimeRef.current = time;
			requestRef.current = requestAnimationFrame(animate);
		};

		window.addEventListener('mousemove', handleMouseMove);
		requestRef.current = requestAnimationFrame(animate);

		return () => {
			window.removeEventListener('mousemove', handleMouseMove);
			if (requestRef.current) {
				cancelAnimationFrame(requestRef.current);
			}
		};
	}, [enableHoverEffect, ids.hoverGradient]);

	return (
		<div className={`w-full h-full ${className}`} style={style}>
			<svg
				ref={svgRef}
				width="100%"
				height="100%"
				preserveAspectRatio="xMidYMid slice"
				xmlns="http://www.w3.org/2000/svg"
			>
				<defs>
					{/* Primary Pattern - smaller, more subtle dots */}
					<pattern
						id={ids.pattern}
						x="0"
						y="0"
						width={dotSpacing}
						height={dotSpacing}
						patternUnits="userSpaceOnUse"
					>
						<circle
							cx={dotSpacing / 2}
							cy={dotSpacing / 2}
							r={dotSize}
							fill={dotColor}
							opacity={intensity * 0.6}
						>
							{enableSubtleAnimation && (
								<animate
									attributeName="opacity"
									values={`${intensity * 0.4};${intensity * 0.8};${
										intensity * 0.4
									}`}
									dur="4s"
									repeatCount="indefinite"
								/>
							)}
						</circle>
					</pattern>

					{/* Secondary Pattern - even smaller dots for depth */}
					{enableDepthEffect && (
						<pattern
							id={ids.patternSecondary}
							x={dotSpacing / 2}
							y={dotSpacing / 2}
							width={dotSpacing}
							height={dotSpacing}
							patternUnits="userSpaceOnUse"
						>
							<circle
								cx={dotSpacing / 2}
								cy={dotSpacing / 2}
								r={dotSize * 0.4}
								fill={dotColor}
								opacity={intensity * 0.3}
							>
								{enableSubtleAnimation && (
									<animate
										attributeName="opacity"
										values={`${intensity * 0.2};${intensity * 0.5};${
											intensity * 0.2
										}`}
										dur="6s"
										repeatCount="indefinite"
									/>
								)}
							</circle>
						</pattern>
					)}

					{/* Subtle Center Glow */}
					<radialGradient
						id={ids.subtleGradient}
						cx="50%"
						cy="50%"
						r="60%"
						fx="50%"
						fy="50%"
					>
						<stop offset="0%" stopColor={hoverColor} stopOpacity={intensity * 0.1} />
						<stop offset="70%" stopColor={hoverColor} stopOpacity={intensity * 0.05} />
						<stop offset="100%" stopColor={hoverColor} stopOpacity="0" />
					</radialGradient>

					{/* Depth Gradient for layered effect */}
					{enableDepthEffect && (
						<radialGradient
							id={ids.depthGradient}
							cx="50%"
							cy="30%"
							r="80%"
							fx="50%"
							fy="30%"
						>
							<stop offset="0%" stopColor={hoverColor} stopOpacity="0" />
							<stop
								offset="40%"
								stopColor={hoverColor}
								stopOpacity={intensity * 0.08}
							/>
							<stop offset="100%" stopColor={hoverColor} stopOpacity="0" />
						</radialGradient>
					)}

					{/* Vignette Gradient */}
					{enableVignette && (
						<radialGradient
							id={ids.vignette}
							cx="50%"
							cy="50%"
							r="50%"
							fx="50%"
							fy="50%"
						>
							<stop offset="40%" stopColor={vignetteColor} stopOpacity="0" />
							<stop offset="100%" stopColor={vignetteColor} stopOpacity="1" />
						</radialGradient>
					)}

					{/* Inner Glow Gradient */}
					{enableInnerGlow && (
						<radialGradient
							id={ids.innerGlow}
							cx="50%"
							cy="50%"
							r="50%"
							fx="50%"
							fy="50%"
						>
							<stop offset="50%" stopColor={innerGlowColor} stopOpacity="0.7" />
							<stop offset="100%" stopColor={innerGlowColor} stopOpacity="0" />
						</radialGradient>
					)}

					{/* Refined Hover Effect Gradient */}
					{enableHoverEffect && (
						<radialGradient
							id={ids.hoverGradient}
							cx="50%"
							cy="50%"
							r={hoverRadius}
							fx="50%"
							fy="50%"
						>
							<stop
								offset="0%"
								stopColor={hoverColor}
								stopOpacity={intensity * 0.15}
							/>
							<stop
								offset="30%"
								stopColor={hoverColor}
								stopOpacity={intensity * 0.08}
							/>
							<stop
								offset="70%"
								stopColor={hoverColor}
								stopOpacity={intensity * 0.03}
							/>
							<stop offset="100%" stopColor={hoverColor} stopOpacity="0" />
						</radialGradient>
					)}
				</defs>

				{/* Background */}
				<rect x="0" y="0" width="100%" height="100%" fill={backgroundColor} stroke="none" />

				{/* Subtle center glow first */}
				<rect
					x="0"
					y="0"
					width="100%"
					height="100%"
					fill={`url(#${ids.subtleGradient})`}
					stroke="none"
				/>

				{/* Depth gradient layer */}
				{enableDepthEffect && (
					<rect
						x="0"
						y="0"
						width="100%"
						height="100%"
						fill={`url(#${ids.depthGradient})`}
						stroke="none"
					/>
				)}

				{/* Secondary dot pattern for depth */}
				{enableDepthEffect && (
					<rect
						x="0"
						y="0"
						width="100%"
						height="100%"
						fill={`url(#${ids.patternSecondary})`}
						stroke="none"
					/>
				)}

				{/* Primary dot pattern */}
				<rect
					x="0"
					y="0"
					width="100%"
					height="100%"
					fill={`url(#${ids.pattern})`}
					stroke="none"
				/>

				{/* Vignette */}
				{enableVignette && (
					<rect
						x="0"
						y="0"
						width="100%"
						height="100%"
						fill={`url(#${ids.vignette})`}
						stroke="none"
					/>
				)}

				{/* Inner Glow */}
				{enableInnerGlow && (
					<circle
						cx="50%"
						cy="50%"
						r="25%"
						fill={`url(#${ids.innerGlow})`}
						stroke="none"
					/>
				)}

				{/* Refined Hover Effect */}
				{enableHoverEffect && (
					<rect
						x="0"
						y="0"
						width="100%"
						height="100%"
						fill={`url(#${ids.hoverGradient})`}
						stroke="none"
					/>
				)}
			</svg>
		</div>
	);
};

export { DottedBackground };
