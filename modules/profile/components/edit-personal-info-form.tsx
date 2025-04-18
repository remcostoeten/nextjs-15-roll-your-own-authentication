'use client'

import { useState } from 'react'
import type { User } from '@/server/db'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useToast } from '@/components/ui/use-toast'
import { updatePersonalInfo } from '@/modules/profile/api/mutations'
import { Pencil, Check, X } from 'lucide-react'

interface EditPersonalInfoFormProps {
	user: User
}

export function EditPersonalInfoForm({ user }: EditPersonalInfoFormProps) {
	const [isEditing, setIsEditing] = useState(false)
	const [isLoading, setIsLoading] = useState(false)
	const { toast } = useToast()

	async function handleSubmit(formData: FormData) {
		setIsLoading(true)

		try {
			const result = await updatePersonalInfo(formData)

			if (result.error) {
				toast({
					variant: 'destructive',
					title: 'Update failed',
					description: result.error,
				})
			} else {
				toast({
					title: 'Personal information updated',
					description:
						'Your personal information has been updated successfully.',
				})
				setIsEditing(false)
			}
		} catch (error) {
			toast({
				variant: 'destructive',
				title: 'Something went wrong',
				description: 'Please try again later.',
			})
		} finally {
			setIsLoading(false)
		}
	}

	if (!isEditing) {
		return (
			<div className="space-y-4">
				<div>
					<p className="text-sm text-muted-foreground">Name</p>
					<div className="flex items-center justify-between">
						<p>
							{user.firstName} {user.lastName}
						</p>
						<Button
							variant="ghost"
							size="sm"
							onClick={() => setIsEditing(true)}
							className="h-8 w-8 p-0"
						>
							<Pencil className="h-4 w-4" />
							<span className="sr-only">Edit</span>
						</Button>
					</div>
				</div>

				<div className="grid grid-cols-2 gap-4">
					<div>
						<p className="text-sm text-muted-foreground">
							First Name
						</p>
						<p>{user.firstName}</p>
					</div>
					<div>
						<p className="text-sm text-muted-foreground">
							Last Name
						</p>
						<p>{user.lastName}</p>
					</div>
				</div>
			</div>
		)
	}

	return (
		<form
			action={handleSubmit}
			className="space-y-4"
		>
			<div>
				<div className="flex items-center justify-between mb-2">
					<p className="text-sm text-muted-foreground">Name</p>
					<div className="flex items-center gap-2">
						<Button
							type="button"
							variant="ghost"
							size="sm"
							onClick={() => setIsEditing(false)}
							className="h-8 w-8 p-0"
							disabled={isLoading}
						>
							<X className="h-4 w-4" />
							<span className="sr-only">Cancel</span>
						</Button>
						<Button
							type="submit"
							variant="ghost"
							size="sm"
							className="h-8 w-8 p-0"
							disabled={isLoading}
						>
							<Check className="h-4 w-4" />
							<span className="sr-only">Save</span>
						</Button>
					</div>
				</div>
			</div>

			<div className="grid grid-cols-2 gap-4">
				<div className="space-y-2">
					<Label htmlFor="firstName">First Name</Label>
					<Input
						id="firstName"
						name="firstName"
						defaultValue={user.firstName}
						required
						disabled={isLoading}
					/>
				</div>
				<div className="space-y-2">
					<Label htmlFor="lastName">Last Name</Label>
					<Input
						id="lastName"
						name="lastName"
						defaultValue={user.lastName}
						required
						disabled={isLoading}
					/>
				</div>
			</div>
		</form>
	)
}
