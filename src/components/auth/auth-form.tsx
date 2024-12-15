'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/shared/components/ui/button'
import { Input } from '@/shared/components/ui/input'
import { toast } from 'sonner'
import Spinner from '@/shared/components/effects/spinner'
import { EyeIcon, EyeOffIcon } from 'lucide-react'
import { featureFlags } from '@/core/config'
import { PasswordStrengthIndicator } from './password-strenght-indicator'

type AuthFormProps = {
	type: 'login' | 'register'
	action: (data: FormData) => Promise<void>
}

const baseSchema = {
	email: z.string().email('Please enter a valid email'),
	password: z
		.string()
		.min(8, 'Password must be at least 8 characters')
		.regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
		.regex(/[a-z]/, 'Password must contain at least one lowercase letter')
		.regex(/[0-9]/, 'Password must contain at least one number')
		.regex(
			/[^A-Za-z0-9]/,
			'Password must contain at least one special character'
		)
}

const loginSchema = z.object({
	...baseSchema,
	rememberMe: z.boolean().optional()
})

const registerSchema = z
	.object({
		...baseSchema,
		firstName: z
			.string()
			.min(2, 'First name must be at least 2 characters'),
		lastName: z.string().min(2, 'Last name must be at least 2 characters'),
		confirmPassword: z.string()
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: "Passwords don't match",
		path: ['confirmPassword']
	})

export default function AuthForm({ type, action }: AuthFormProps) {
	const [showPassword, setShowPassword] = useState(false)
	const [showConfirmPassword, setShowConfirmPassword] = useState(false)
	const [isLoading, setIsLoading] = useState(false)
	const forgotPasswordEnabled = featureFlags['FORGOT_PASSWORD']

	const schema = type === 'login' ? loginSchema : registerSchema

	const {
		register,
		handleSubmit,
		watch,
		formState: { errors }
	} = useForm({
		resolver: zodResolver(schema),
		defaultValues:
			type === 'login'
				? { email: '', password: '', rememberMe: false }
				: {
						email: '',
						password: '',
						firstName: '',
						lastName: '',
						confirmPassword: ''
					}
	})

	const password = watch('password', '')

	const handleFormSubmit = async (data: z.infer<typeof schema>) => {
		try {
			setIsLoading(true)
			const formData = new FormData()
			Object.entries(data).forEach(([key, value]) => {
				if (value !== undefined) {
					formData.append(key, value?.toString() ?? '')
				}
			})
			await action(formData)
		} catch (error) {
			toast.error(
				error instanceof Error ? error.message : 'Something went wrong'
			)
		} finally {
			setIsLoading(false)
		}
	}

	return (
		<form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
			{type === 'register' && (
				<div className="grid gap-4 grid-cols-2">
					<div className="space-y-2">
						<Input
							{...register('firstName')}
							placeholder="First Name"
							autoComplete="given-name"
							error={
								type === 'register'
									? errors.firstName?.message
									: undefined
							}
						/>
					</div>
					<div className="space-y-2">
						<Input
							{...register('lastName')}
							placeholder="Last Name"
							autoComplete="family-name"
							error={
								type === 'register'
									? errors.lastName?.message
									: undefined
							}
						/>
					</div>
				</div>
			)}

			<div className="space-y-2">
				<Input
					{...register('email')}
					type="email"
					placeholder="Email"
					autoComplete="email"
					error={errors.email?.message}
				/>
			</div>

			<div className="space-y-2">
				<div className="relative">
					<Input
						{...register('password')}
						type={showPassword ? 'text' : 'password'}
						placeholder="Password"
						autoComplete={
							type === 'login'
								? 'current-password'
								: 'new-password'
						}
						error={errors.password?.message}
					/>
					<button
						type="button"
						onClick={() => setShowPassword(!showPassword)}
						className="absolute right-3 top-1/2 -translate-y-1/2"
					>
						{showPassword ? (
							<EyeOffIcon className="h-4 w-4" />
						) : (
							<EyeIcon className="h-4 w-4" />
						)}
					</button>
				</div>
				{type === 'register' && (
					<PasswordStrengthIndicator password={password} />
				)}
			</div>

			{type === 'register' && (
				<div className="space-y-2">
					<div className="relative">
						<Input
							{...register('confirmPassword')}
							type={showConfirmPassword ? 'text' : 'password'}
							placeholder="Confirm Password"
							autoComplete="new-password"
							error={
								type === 'register'
									? errors.confirmPassword?.message
									: undefined
							}
						/>
						<button
							type="button"
							onClick={() =>
								setShowConfirmPassword(!showConfirmPassword)
							}
							className="absolute right-3 top-1/2 -translate-y-1/2"
						>
							{showConfirmPassword ? (
								<EyeOffIcon className="h-4 w-4" />
							) : (
								<EyeIcon className="h-4 w-4" />
							)}
						</button>
					</div>
				</div>
			)}

			{type === 'login' && (
				<div className="flex items-center justify-between">
					<label className="flex items-center space-x-2">
						<input
							type="checkbox"
							{...register('rememberMe')}
							className="form-checkbox"
						/>
						<span>Remember me</span>
					</label>

					{forgotPasswordEnabled && (
						<button
							type="button"
							className="text-sm text-primary hover:underline"
							onClick={() => {
								/* Handle forgot password */
							}}
						>
							Forgot password?
						</button>
					)}
				</div>
			)}

			<Button type="submit" className="w-full" disabled={isLoading}>
				{isLoading && <Spinner />}
				<span className="ml-2">
					{type === 'login' ? 'Sign In' : 'Create Account'}
				</span>
			</Button>
		</form>
	)
}
