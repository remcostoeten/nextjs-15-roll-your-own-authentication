'use client'

import UploadButton from '@/components/upload-button'
import { showToast } from '@/lib/toast'
import { changePasswordMutation } from '@/mutations/auth'
import { updateProfile } from '@/mutations/profile'
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/ui/avatar'
import { Button } from '@/shared/ui/button'
import { Input } from '@/shared/ui/input'
import { Separator } from '@/shared/ui/separator'
import { useState } from 'react'
import { z } from 'zod'
import type { ProfileUser } from './profile'

const passwordSchema = z.object({
	currentPassword: z.string().min(1, 'Current password is required'),
	newPassword: z.string().min(8, 'Password must be at least 8 characters'),
	confirmPassword: z.string()
}).refine((data) => data.newPassword === data.confirmPassword, {
	message: "Passwords don't match",
	path: ["confirmPassword"]
})

type PasswordData = z.infer<typeof passwordSchema>

const INITIAL_PASSWORD_STATE: PasswordData = {
	currentPassword: '',
	newPassword: '',
	confirmPassword: ''
}

type ProfileFormProps = {
	initialData: ProfileUser
}

export default function ProfileForm({ initialData }: ProfileFormProps) {
	const [isEditing, setIsEditing] = useState(false)
	const [isChangingPassword, setIsChangingPassword] = useState(false)
	const [formData, setFormData] = useState({
		email: initialData?.name || '',
		createdAt: initialData?.createdAt || new Date()
	})
	const [passwordData, setPasswordData] = useState<PasswordData>(INITIAL_PASSWORD_STATE)

	async function handleProfileSubmit(e: React.FormEvent) {
		e.preventDefault()
		try {
			const form = new FormData()
			form.append('userId', String(initialData.id))

			const result = await updateProfile(form)

			if (result.error) {
				showToast.error(result.error)
				return
			}

			showToast.success(result.message || 'Profile updated')
			setIsEditing(false)
		} catch (error) {
			showToast.error('Failed to update profile')
		}
	}

	async function handlePasswordSubmit(e: React.FormEvent) {
		e.preventDefault()

		try {
			const validatedData = passwordSchema.parse(passwordData)

			const form = new FormData()
			form.append('currentPassword', validatedData.currentPassword)
			form.append('newPassword', validatedData.newPassword)

			const result = await changePasswordMutation(form)

			if (result.error) {
				showToast.error(result.error)
				return
			}

			showToast.success('Password updated successfully')
			setIsChangingPassword(false)
			setPasswordData(INITIAL_PASSWORD_STATE)
		} catch (error) {
			if (error instanceof z.ZodError) {
				showToast.error(error.errors[0].message)
				return
			}
			showToast.error('Failed to update password')
		}
	}

	function handlePasswordInputChange(field: keyof PasswordData) {
		return (e: React.ChangeEvent<HTMLInputElement>) => {
			setPasswordData(prev => ({
				...prev,
				[field]: e.target.value
			}))
		}
	}

	return (
		<div className="space-y-8">
			<form onSubmit={handleProfileSubmit} className="space-y-4">
				<div className="space-y-2">
					<label className="text-sm font-medium">Email</label>
					<Input
						value={formData.email}
						disabled
						className="bg-muted/50"
					/>
				</div>

				<div className="space-y-2">
					<label className="text-sm font-medium">Member Since</label>
					<Input
						value={new Date(formData.createdAt).toLocaleDateString()}
						disabled
						className="bg-muted/50"
					/>
				</div>

				<div className="space-y-2">
					<label className="text-sm font-medium">Profile Picture</label>
					<div className="flex items-center space-x-4">
						<Avatar className="h-24 w-24">
							<AvatarImage
								src={initialData?.avatar || ''}
								alt="Profile picture"
							/>
							<AvatarFallback>
								{initialData?.name?.charAt(0).toUpperCase()}
							</AvatarFallback>
						</Avatar>

						<UploadButton
							endpoint="profileImage"
							onClientUploadComplete={() => {
								showToast.success('Avatar updated successfully!')
							}}
							onUploadError={(error: Error) => {
								showToast.error(error.message)
							}}
						/>
					</div>
				</div>
			</form>

			<Separator />

			<div className="space-y-4">
				<h2 className="text-lg font-semibold">Change Password</h2>
				{!isChangingPassword ? (
					<Button
						variant="outline"
						onClick={() => setIsChangingPassword(true)}
					>
						Change Password
					</Button>
				) : (
					<form onSubmit={handlePasswordSubmit} className="space-y-4">
						<div className="space-y-2">
							<label className="text-sm font-medium">
								Current Password
							</label>
							<Input
								type="password"
								value={passwordData.currentPassword}
								onChange={handlePasswordInputChange('currentPassword')}
								required
							/>
						</div>

						<div className="space-y-2">
							<label className="text-sm font-medium">
								New Password
							</label>
							<Input
								type="password"
								value={passwordData.newPassword}
								onChange={handlePasswordInputChange('newPassword')}
								required
							/>
						</div>

						<div className="space-y-2">
							<label className="text-sm font-medium">
								Confirm New Password
							</label>
							<Input
								type="password"
								value={passwordData.confirmPassword}
								onChange={handlePasswordInputChange('confirmPassword')}
								required
							/>
						</div>

						<div className="flex justify-end gap-4">
							<Button
								type="button"
								variant="outline"
								onClick={() => {
									setIsChangingPassword(false)
									setPasswordData(INITIAL_PASSWORD_STATE)
								}}
							>
								Cancel
							</Button>
							<Button type="submit">Update Password</Button>
						</div>
					</form>
				)}
			</div>
		</div>
	)
}
