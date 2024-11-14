'use client'

import { updateProfile } from '@/app/server/mutations/update-profile'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'react-hot-toast'

type ProfileFormData = {
	avatar?: string
	bio?: string
	phoneNumber?: string
	location?: string
	website?: string
	company?: string
	jobTitle?: string
	twitter?: string
	github?: string
	linkedin?: string
}

export default function EditProfilePage() {
	const router = useRouter()
	const [isLoading, setIsLoading] = useState(false)
	const [error, setError] = useState<string>()

	async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault()
		setIsLoading(true)
		setError(undefined)

		const formData = new FormData(event.currentTarget)
		const profileData: ProfileFormData = {
			avatar: formData.get('avatar') as string,
			bio: formData.get('bio') as string,
			phoneNumber: formData.get('phoneNumber') as string,
			location: formData.get('location') as string,
			website: formData.get('website') as string,
			company: formData.get('company') as string,
			jobTitle: formData.get('jobTitle') as string,
			twitter: formData.get('twitter') as string,
			github: formData.get('github') as string,
			linkedin: formData.get('linkedin') as string
		}

		try {
			const result = await updateProfile(profileData)

			if (result.success) {
				toast.success('Profile updated successfully!')
				router.push('/profile')
				router.refresh()
			} else {
				setError(result.error)
				toast.error(result.error || 'Failed to update profile')
			}
		} catch (err) {
			console.error('Profile update error:', err)
			setError('An unexpected error occurred')
		} finally {
			setIsLoading(false)
		}
	}

	return (
		<div className="container max-w-2xl py-8">
			<Card>
				<CardHeader>
					<CardTitle>Edit Profile</CardTitle>
				</CardHeader>
				<CardContent>
					<form onSubmit={onSubmit} className="space-y-6">
						<div className="space-y-2">
							<Label htmlFor="avatar">Profile Picture URL</Label>
							<Input id="avatar" name="avatar" type="url" />
						</div>

						<div className="space-y-2">
							<Label htmlFor="bio">Bio</Label>
							<Textarea id="bio" name="bio" />
						</div>

						<div className="space-y-2">
							<Label htmlFor="phoneNumber">Phone Number</Label>
							<Input
								id="phoneNumber"
								name="phoneNumber"
								type="tel"
							/>
						</div>

						<div className="space-y-2">
							<Label htmlFor="location">Location</Label>
							<Input id="location" name="location" type="text" />
						</div>

						<div className="space-y-2">
							<Label htmlFor="website">Website</Label>
							<Input id="website" name="website" type="url" />
						</div>

						<div className="space-y-2">
							<Label htmlFor="company">Company</Label>
							<Input id="company" name="company" type="text" />
						</div>

						<div className="space-y-2">
							<Label htmlFor="jobTitle">Job Title</Label>
							<Input id="jobTitle" name="jobTitle" type="text" />
						</div>

						<div className="space-y-2">
							<Label htmlFor="twitter">Twitter</Label>
							<Input id="twitter" name="twitter" type="url" />
						</div>

						<div className="space-y-2">
							<Label htmlFor="github">GitHub</Label>
							<Input id="github" name="github" type="url" />
						</div>

						<div className="space-y-2">
							<Label htmlFor="linkedin">LinkedIn</Label>
							<Input id="linkedin" name="linkedin" type="url" />
						</div>

						<div className="space-y-2">
							<Button type="submit" disabled={isLoading}>
								{isLoading ? 'Updating...' : 'Update Profile'}
							</Button>
						</div>
					</form>
				</CardContent>
			</Card>
		</div>
	)
}
