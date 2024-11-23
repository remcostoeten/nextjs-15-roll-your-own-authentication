'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import UploadButton from '@/components/upload-button'
import { showToast } from '@/lib/toast'
import { updateProfile } from '@/mutations/profile'
import { useState } from 'react'

type ProfileFormProps = {
	user: {
		id: number
		email: string
		role: string
		createdAt: Date | null
		avatar?: string | null
	}
}

export default function ProfileForm({ user }: ProfileFormProps) {
	const [isEditing, setIsEditing] = useState(false)
	const [isChangingPassword, setIsChangingPassword] = useState(false)
	const [formData, setFormData] = useState({
		email: user?.email || '',
		createdAt: user?.createdAt || new Date()
	})
	const [passwordData, setPasswordData] = useState({
		currentPassword: '',
		newPassword: '',
		confirmPassword: ''
	})

	async function handlePasswordChange(e: React.FormEvent) {
		e.preventDefault()
		if (passwordData.newPassword !== passwordData.confirmPassword) {
			showToast.error('New passwords do not match')
			return
		}

		try {
			const form = new FormData()
			form.append('userId', String(user.id))
			form.append('currentPassword', passwordData.currentPassword)
			form.append('newPassword', passwordData.newPassword)

			const response = await fetch('/api/auth/change-password', {
				method: 'POST',
				body: form
			})

			const result = await response.json()

			if (result.error) {
				showToast.error(result.error)
			} else {
				showToast.success('Password updated successfully')
				setIsChangingPassword(false)
				setPasswordData({
					currentPassword: '',
					newPassword: '',
					confirmPassword: ''
				})
			}
		} catch (error) {
			showToast.error('Failed to update password')
		}
	}

	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault()
		try {
			const form = new FormData()
			form.append('userId', String(user.id))

			const result = await updateProfile(form)

			if (result.error) {
				showToast.error(result.error)
			} else {
				showToast.success(result.message || 'Profile updated')
				setIsEditing(false)
			}
		} catch (error) {
			showToast.error('Failed to update profile')
		}
	}

	return (
		<div className="space-y-8">
			<form onSubmit={handleSubmit} className="space-y-4">
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
						value={new Date(
							formData.createdAt
						).toLocaleDateString()}
						disabled
						className="bg-muted/50"
					/>
				</div>

				<div className="space-y-2">
					<label className="text-sm font-medium">
						Profile Picture
					</label>
					<div className="flex items-center space-x-4">
						<Avatar className="h-24 w-24">
							<AvatarImage
								src={user?.avatar || ''}
								alt="Profile picture"
							/>
							<AvatarFallback>
								{user?.email?.charAt(0).toUpperCase()}
							</AvatarFallback>
						</Avatar>

						<UploadButton
							endpoint="profileImage"
							onClientUploadComplete={() => {
								showToast.success(
									'Avatar updated successfully!'
								)
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
					<form onSubmit={handlePasswordChange} className="space-y-4">
						<div className="space-y-2">
							<label className="text-sm font-medium">
								Current Password
							</label>
							<Input
								type="password"
								value={passwordData.currentPassword}
								onChange={(e) =>
									setPasswordData({
										...passwordData,
										currentPassword: e.target.value
									})
								}
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
								onChange={(e) =>
									setPasswordData({
										...passwordData,
										newPassword: e.target.value
									})
								}
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
								onChange={(e) =>
									setPasswordData({
										...passwordData,
										confirmPassword: e.target.value
									})
								}
								required
							/>
						</div>

						<div className="flex justify-end gap-4">
							<Button
								type="button"
								variant="outline"
								onClick={() => {
									setIsChangingPassword(false)
									setPasswordData({
										currentPassword: '',
										newPassword: '',
										confirmPassword: ''
									})
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
