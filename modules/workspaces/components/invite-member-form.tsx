'use client'

import type React from 'react'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'
import { inviteWorkspaceMember } from '@/modules/workspaces/api/mutations'
import { useToast } from '@/hooks/use-toast'
import { Loader2 } from 'lucide-react'

type TProps = {
	workspaceId: string
}

export function InviteMemberForm({ workspaceId }: TProps) {
	const router = useRouter()
	const { toast } = useToast()
	const [email, setEmail] = useState('')
	const [role, setRole] = useState('member')
	const [isSubmitting, setIsSubmitting] = useState(false)

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		setIsSubmitting(true)

		const formData = new FormData()
		formData.append('email', email)
		formData.append('role', role)

		try {
			const result = await inviteWorkspaceMember(workspaceId, formData)

			if (result.error) {
				toast({
					variant: 'destructive',
					title: 'Failed to invite member',
					description: result.error,
				})
			} else {
				toast({
					title: 'Member invited',
					description: 'The user has been added to the workspace.',
				})
				setEmail('')
				setRole('member')
				router.refresh()
			}
		} catch (error) {
			toast({
				variant: 'destructive',
				title: 'Something went wrong',
				description: 'Please try again later.',
			})
		} finally {
			setIsSubmitting(false)
		}
	}

	return (
		<form
			onSubmit={handleSubmit}
			className="space-y-4"
		>
			<div className="space-y-2">
				<Label htmlFor="email">Email Address</Label>
				<Input
					id="email"
					type="email"
					placeholder="user@example.com"
					value={email}
					onChange={(e) => setEmail(e.target.value)}
					required
					disabled={isSubmitting}
				/>
			</div>
			<div className="space-y-2">
				<Label htmlFor="role">Role</Label>
				<Select
					value={role}
					onValueChange={setRole}
					disabled={isSubmitting}
				>
					<SelectTrigger id="role">
						<SelectValue placeholder="Select a role" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="member">Member</SelectItem>
						<SelectItem value="admin">Admin</SelectItem>
					</SelectContent>
				</Select>
			</div>
			<Button
				type="submit"
				className="w-full"
				disabled={isSubmitting}
			>
				{isSubmitting ? (
					<>
						<Loader2 className="mr-2 h-4 w-4 animate-spin" />
						Inviting...
					</>
				) : (
					'Invite Member'
				)}
			</Button>
		</form>
	)
}
