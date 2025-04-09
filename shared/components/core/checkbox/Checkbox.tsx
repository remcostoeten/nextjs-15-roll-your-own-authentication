'use client'

import React, { useState, useEffect, useRef, InputHTMLAttributes } from 'react'
import styles from './checkbox.module.css'

interface CheckboxProps
	extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'onChange'> {
	round?: boolean
	checked?: boolean
	label?: string
	disabled?: boolean
	required?: boolean
	color?: string
	hoverColor?: string
	activeColor?: string
	disabledColor?: string
	size?: number
	animationDuration?: number
	onChange?: (checked: boolean) => void
}

const Checkbox: React.FC<CheckboxProps> = ({
	round = false,
	checked = false,
	label,
	disabled = false,
	required = false,
	color = '#00aa8d',
	hoverColor = '#00bf92',
	activeColor = '#008975',
	disabledColor = '#9b9b9b',
	size = 20,
	animationDuration = 250,
	onChange,
	id: externalId,
	className,
	...props
}) => {
	const [isChecked, setIsChecked] = useState<boolean>(checked)
	const [uniqueId] = useState<string>(
		`checkbox-${Math.random().toString(36).substring(2, 11)}`
	)
	const inputRef = useRef<HTMLInputElement>(null)
	const id = externalId || uniqueId

	useEffect(() => {
		setIsChecked(checked)
	}, [checked])

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (!disabled) {
			const newChecked = e.target.checked
			setIsChecked(newChecked)
			onChange && onChange(newChecked)
		}
	}

	const inlineStyles = {
		'--checkbox-size': `${size}px`,
		'--checkbox-color': color,
		'--checkbox-hover-color': hoverColor,
		'--checkbox-active-color': activeColor,
		'--checkbox-disabled-color': disabledColor,
		'--checkbox-animation-duration': `${animationDuration}ms`,
	} as React.CSSProperties

	return (
		<label
			className={`${styles.checkbox} ${round ? styles.round : ''} ${
				disabled ? styles.disabled : ''
			} ${className || ''}`}
			htmlFor={id}
			style={inlineStyles}
			aria-disabled={disabled}
		>
			<input
				ref={inputRef}
				id={id}
				type="checkbox"
				className={styles.input}
				onChange={handleChange}
				disabled={disabled}
				required={required}
				checked={isChecked}
				aria-checked={isChecked}
				aria-required={required}
				{...props}
			/>
			<div className={styles.indicator}>
				<div className={styles.background}></div>
				<svg
					className={styles.checkmark}
					viewBox="0 0 14 14"
					aria-hidden="true"
				>
					<path
						d="M1.42420783 6.03075103 5.00322799 9.5725669 12.5960318 2.01301652"
						className={styles.checkmarkPath}
					/>
				</svg>
				<div className={styles.ripple}></div>
			</div>
			{label && (
				<span className={styles.label}>
					{label}
					{required && <span className={styles.required}>*</span>}
				</span>
			)}
		</label>
	)
}

export default Checkbox
