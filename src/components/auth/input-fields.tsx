'use client'

import { motion } from 'framer-motion'
import * as React from 'react'
import { itemAnimation } from './animations'
import type { InputFieldProps } from './types'

function InputField({
	label,
	placeholder,
	type = 'text',
	icon,
	helperText,
	index,
	value,
	onChange,
	required
}: InputFieldProps) {
	const [showPassword, setShowPassword] = React.useState(false)
	const inputType = type === 'password' && showPassword ? 'text' : type

	return (
		<motion.div
			custom={index}
			variants={itemAnimation}
			className="flex flex-col flex-1 shrink justify-center w-full basis-0 group"
		>
			<label className="font-medium text-white">{label}</label>
			<div className="relative mt-2.5">
				<input
					type={inputType}
					placeholder={placeholder}
					value={value}
					onChange={(e) => onChange(e.target.value)}
					required={required}
					className="w-full px-4 py-3 text-[0.9375rem] text-white bg-[#1A1A1A] rounded-xl placeholder:text-gray-500 focus:outline-none transition-colors duration-200 hover:bg-[#222] focus:bg-[#222]"
					aria-label={label}
				/>
				{icon && type === 'password' && (
					<button
						type="button"
						onClick={() => setShowPassword(!showPassword)}
						className="absolute right-5 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-all duration-200 hover:scale-110 active:scale-95"
						aria-label={showPassword ? 'Hide password' : 'Show password'}
					>
						{icon}
					</button>
				)}
			</div>
			{helperText && (
				<p className="mt-2 text-sm text-white text-opacity-70">
					{helperText}
				</p>
			)}
		</motion.div>
	)
}

export default InputField
