'use client'

import type { ColumnDef } from '@tanstack/react-table'
import { ArrowUpDown, MoreHorizontal, Shield, ShieldAlert } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Checkbox from '@/shared/components/core/checkbox/Checkbox'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { formatDistanceToNow } from 'date-fns'

// This should match your actual user data structure
export type User = {
	id: string
	name: string
	email: string
	username?: string
	isAdmin: boolean
	createdAt: string
	updatedAt: string
	sessionCount?: number
}

export const columns: ColumnDef<User>[] = [
	{
		id: 'select',
		header: ({ table }) => (
			<Checkbox
				checked={
					table.getIsAllPageRowsSelected() ||
					(table.getIsSomePageRowsSelected() && 'indeterminate')
				}
				onCheckedChange={(value) =>
					table.toggleAllPageRowsSelected(!!value)
				}
				aria-label="Select all"
				className="translate-y-[2px]"
			/>
		),
		cell: ({ row }) => (
			<Checkbox
				checked={row.getIsSelected()}
				onCheckedChange={(value) => row.toggleSelected(!!value)}
				aria-label="Select row"
				className="translate-y-[2px]"
			/>
		),
		enableSorting: false,
		enableHiding: false,
	},
	{
		accessorKey: 'name',
		header: ({ column }) => {
			return (
				<Button
					variant="ghost"
					onClick={() =>
						column.toggleSorting(column.getIsSorted() === 'asc')
					}
					className="pl-0"
				>
					User
					<ArrowUpDown className="ml-2 h-4 w-4" />
				</Button>
			)
		},
		cell: ({ row }) => {
			const user = row.original
			const initials = user.name
				.split(' ')
				.map((n) => n[0])
				.join('')
				.toUpperCase()

			return (
				<div className="flex items-center gap-2">
					<Avatar className="h-8 w-8">
						<AvatarImage
							src={`https://avatar.vercel.sh/${
								user.username || user.email
							}`}
							alt={user.name}
						/>
						<AvatarFallback>{initials}</AvatarFallback>
					</Avatar>
					<div className="flex flex-col">
						<span className="font-medium">{user.name}</span>
						<span className="text-xs text-muted-foreground">
							{user.email}
						</span>
					</div>
				</div>
			)
		},
	},
	{
		accessorKey: 'isAdmin',
		header: ({ column }) => {
			return (
				<Button
					variant="ghost"
					onClick={() =>
						column.toggleSorting(column.getIsSorted() === 'asc')
					}
				>
					Role
					<ArrowUpDown className="ml-2 h-4 w-4" />
				</Button>
			)
		},
		cell: ({ row }) => {
			const isAdmin = row.original.isAdmin

			return (
				<div className="flex items-center gap-2">
					{isAdmin ? (
						<>
							<ShieldAlert className="h-4 w-4 text-destructive" />
							<span>Admin</span>
						</>
					) : (
						<>
							<Shield className="h-4 w-4 text-muted-foreground" />
							<span>User</span>
						</>
					)}
				</div>
			)
		},
		filterFn: (row, id, value) => {
			return value.includes(String(row.getValue(id)))
		},
	},
	{
		accessorKey: 'createdAt',
		header: ({ column }) => {
			return (
				<Button
					variant="ghost"
					onClick={() =>
						column.toggleSorting(column.getIsSorted() === 'asc')
					}
				>
					Created
					<ArrowUpDown className="ml-2 h-4 w-4" />
				</Button>
			)
		},
		cell: ({ row }) => {
			const date = new Date(row.original.createdAt)
			const formattedDate = date.toLocaleDateString()
			const relativeTime = formatDistanceToNow(date, { addSuffix: true })

			return (
				<div className="flex flex-col">
					<span>{formattedDate}</span>
					<span className="text-xs text-muted-foreground">
						{relativeTime}
					</span>
				</div>
			)
		},
	},
	{
		accessorKey: 'sessionCount',
		header: ({ column }) => {
			return (
				<Button
					variant="ghost"
					onClick={() =>
						column.toggleSorting(column.getIsSorted() === 'asc')
					}
				>
					Sessions
					<ArrowUpDown className="ml-2 h-4 w-4" />
				</Button>
			)
		},
		cell: ({ row }) => {
			const count = row.original.sessionCount || 0

			return (
				<Badge variant={count > 0 ? 'default' : 'outline'}>
					{count}
				</Badge>
			)
		},
	},
	{
		id: 'actions',
		cell: ({ row }) => {
			const user = row.original

			return (
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button
							variant="ghost"
							className="h-8 w-8 p-0"
						>
							<span className="sr-only">Open menu</span>
							<MoreHorizontal className="h-4 w-4" />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end">
						<DropdownMenuLabel>Actions</DropdownMenuLabel>
						<DropdownMenuItem
							onClick={() =>
								navigator.clipboard.writeText(user.id)
							}
						>
							Copy user ID
						</DropdownMenuItem>
						<DropdownMenuSeparator />
						<DropdownMenuItem>View user details</DropdownMenuItem>
						<DropdownMenuItem>Edit user</DropdownMenuItem>
						<DropdownMenuSeparator />
						<DropdownMenuItem className="text-destructive">
							Delete user
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			)
		},
	},
]
