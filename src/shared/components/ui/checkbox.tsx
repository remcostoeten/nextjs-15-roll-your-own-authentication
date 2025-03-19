'use client'

import * as React from 'react'
import { cn } from '@/shared/utils/helpers'
import styles from '@/styles/modules/checkbox.module.css'

export interface CheckboxProps
	extends React.InputHTMLAttributes<HTMLInputElement> {
	label?: string
	labelClassName?: string
	error?: string
	size?: number
}

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
	({ className, label, labelClassName, error, size = 1, ...props }, ref) => {
		const [showError, setShowError] = React.useState(false)
		const inputId = props.id || React.useId()
		const errorId = error ? `${inputId}-error` : undefined

		// Handle error animation
		React.useEffect(() => {
			if (error) {
				setShowError(true)
			} else {
				setShowError(false)
			}
		}, [error])

		const checkboxStyle = {
			'--size': size.toString(),
			...(showError
				? {
						'--brdr': '#b91c1c',
						'--brdr-actv': '#ef4444',
						'--brdr-hovr': '#dc2626',
					}
				: {}),
		} as React.CSSProperties

		return (
			<div className={cn('flex flex-col', className)}>
				<div className="flex items-center gap-2">
					<div className={styles['checkbox-wrapper-30']}>
						<span
							className={cn(
								styles.checkbox,
								showError
									? 'transition-all duration-300 animate-pulse'
									: 'transition-all duration-300'
							)}
							style={checkboxStyle}
						>
							<input
								type="checkbox"
								id={inputId}
								ref={ref}
								aria-invalid={!!error}
								aria-describedby={errorId}
								className={cn(showError ? 'border-2' : '')}
								{...props}
							/>
							<svg>
								<use
									xlinkHref="#checkbox-30"
									className={styles.checkbox}
								></use>
							</svg>
						</span>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							style={{ display: 'none' }}
						>
							<symbol
								id="checkbox-30"
								viewBox="0 0 22 22"
							>
								<path
									fill="none"
									stroke="currentColor"
									d="M5.5,11.3L9,14.8L20.2,3.3l0,0c-0.5-1-1.5-1.8-2.7-1.8h-13c-1.7,0-3,1.3-3,3v13c0,1.7,1.3,3,3,3h13
c1.7,0,3-1.3,3-3v-13c0-0.4-0.1-0.8-0.3-1.2"
								/>
							</symbol>
						</svg>
					</div>

					{label && (
						<label
							htmlFor={inputId}
							className={cn(
								'text-zinc-500 cursor-pointer',
								labelClassName
							)}
						>
							{label}
						</label>
					)}
				</div>

				{error && (
					<span
						id={errorId}
						className={cn(
							'text-red-500 text-sm mt-1 block transition-all duration-500 ease-in-out',
							showError
								? 'opacity-100 translate-y-0'
								: 'opacity-0 -translate-y-1'
						)}
						style={{ transitionDelay: '200ms' }}
					>
						{error}
					</span>
				)}
			</div>
		)
	}
)

Checkbox.displayName = 'Checkbox'

export { Checkbox }
