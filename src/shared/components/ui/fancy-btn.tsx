'use client'

import React, { useState, useRef, CSSProperties } from 'react'

interface FancyButtonProps
	extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	children: React.ReactNode
	shortcut?: string
	variant?: 'light' | 'dark'
}

export const FancyButton = React.forwardRef<
	HTMLButtonElement,
	FancyButtonProps
>(({ children, shortcut, variant = 'light', className, ...props }, ref) => {
	const [coords, setCoords] = useState({ x: 0, y: 0 })
	const buttonRef = useRef<HTMLButtonElement>(null)

	const handlePointerMove = (
		event: React.PointerEvent<HTMLButtonElement>
	) => {
		if (buttonRef.current) {
			const rect = buttonRef.current.getBoundingClientRect()
			const centerX = rect.left + rect.width / 2
			const centerY = rect.top + rect.height / 2
			const x = event.clientX - centerX
			const y = centerY - event.clientY
			setCoords({ x, y })
		}
	}

	const handlePointerLeave = () => {
		setCoords({ x: 0, y: 0 })
	}

	const buttonStyle: CSSProperties = {
		all: 'unset',
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-expect-error
		'--coord-y': `${coords.y}px`,
		'--coord-x': `${coords.x}px`,
		'--button-shadow-opacity': '0',
		'--button-shadow-spread': '0',
		'--button-bg-opacity': '0',
		'--button-after-opacity': '0',
		cursor: 'pointer',
		color: variant === 'light' ? 'hsl(359deg 1% 35%)' : 'hsl(0deg 0% 66%)',
		borderRadius: '0.80em',
		fontWeight: 600,
		boxShadow:
			'0 8px calc(var(--button-shadow-spread) * 1px) -8px rgb(0 0 0 / calc(var(--button-shadow-opacity) * 1%))',
		border:
			variant === 'light'
				? '1px solid transparent'
				: '1px solid rgb(255 255 255 / 5%)',
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		position: 'relative',
		overflow: 'hidden',
		backgroundColor: 'rgb(0 0 0 / 6%)',
		backgroundImage: `conic-gradient(from 180deg, 
      hsl(3 93% 48% / var(--button-bg-opacity)) 0%,
      hsl(26 91% 52% / var(--button-bg-opacity)) 10%,
      hsl(65 89% 46% / var(--button-bg-opacity)) 20%,
      hsl(122 86% 48% / var(--button-bg-opacity)) 30%,
      hsl(181 78% 50% / var(--button-bg-opacity)) 40%,
      hsl(193 76% 53% / var(--button-bg-opacity)) 50%,
      hsl(219 95% 56% / var(--button-bg-opacity)) 60%,
      hsl(269 95% 56% / var(--button-bg-opacity)) 70%,
      hsl(292 93% 47% / var(--button-bg-opacity)) 80%,
      hsl(327 96% 47% / var(--button-bg-opacity)) 90%,
      hsl(3 93% 48% / var(--button-bg-opacity)) 100%
    )`,
		backgroundSize: 'calc(100% + 2px)',
		backgroundPosition: '-1px -1px',
		transition:
			'--coord-y 0.075s linear, --coord-x 0.075s linear, --button-shadow-opacity 0.3s ease, --button-shadow-spread 0.3s ease, --button-bg-opacity 0.3s ease, --button-after-opacity 0.3s ease, opacity 0.3s ease, box-shadow 0.3s ease, background-image 0.3s ease'
	}

	const innerStyle: CSSProperties = {
		padding: '0.55em 0.85em',
		background:
			variant === 'light' ? 'hsl(179deg 7% 97%)' : 'hsl(0deg 0% 10%)',
		borderRadius: '0.70em',
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		gap: '12px',
		boxShadow:
			variant === 'light'
				? 'inset 0 2px 1px rgb(255 255 255 / 90%), inset 0 -2px 3px rgb(0 0 0 / 3%)'
				: 'inset 0 2px 3px rgb(255 255 255 / 1%), inset 0 -2px 3px rgb(0 0 0 / 25%)'
	}

	const shortcutStyle: CSSProperties = {
		pointerEvents: 'none',
		fontSize: '0.85em',
		padding: '4px',
		border:
			variant === 'light'
				? '1px solid rgb(0 0 0 / 10%)'
				: '1px solid rgb(255 255 255 / 10%)',
		borderRadius: '6px',
		fontWeight: 400
	}

	const afterStyle: CSSProperties = {
		content: '""',
		display: 'block',
		position: 'absolute',
		width: '180%',
		height: '180%',
		backgroundImage: 'inherit',
		filter: 'saturate(2) blur(5px)',
		transform: `translate(calc(calc(var(--coord-x)/1.5) * 1px), calc(calc(var(--coord-y)/1.5) * -1px))`,
		opacity: 'calc(var(--button-after-opacity) / 3)',
		transition: 'inherit'
	}

	return (
		<button
			ref={ref}
			onPointerMove={handlePointerMove}
			onPointerLeave={handlePointerLeave}
			style={buttonStyle}
			onMouseEnter={(e) => {
				e.currentTarget.style.setProperty(
					'--button-shadow-opacity',
					'16'
				)
				e.currentTarget.style.setProperty(
					'--button-shadow-spread',
					'16'
				)
				e.currentTarget.style.setProperty(
					'--button-after-opacity',
					'0.7'
				)
				e.currentTarget.style.setProperty('--button-bg-opacity', '0.15')
			}}
			onMouseLeave={(e) => {
				e.currentTarget.style.setProperty(
					'--button-shadow-opacity',
					'0'
				)
				e.currentTarget.style.setProperty('--button-shadow-spread', '0')
				e.currentTarget.style.setProperty('--button-after-opacity', '0')
				e.currentTarget.style.setProperty('--button-bg-opacity', '0')
			}}
			className={className}
			{...props}
		>
			<div style={innerStyle}>
				{children}
				{shortcut && <span style={shortcutStyle}>{shortcut}</span>}
			</div>
			<div style={afterStyle} />
		</button>
	)
})

FancyButton.displayName = 'FancyButton'
