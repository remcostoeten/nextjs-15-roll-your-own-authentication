'use client'

import { useState, useMemo, ChangeEvent } from 'react'
import { User } from '@/server/db/schemas/users'
import { userMetrics } from '@/server/db/schemas/user-metrics'
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/shared/components/ui/table'
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/shared/components/ui/card'
import {
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu'
import { Button } from '@/shared/components/ui/button'
import { Input } from '@/shared/components/ui/input'
import { Eye, Search, ArrowUpDown, Pencil, Trash2 } from 'lucide-react'

type UserWithMetrics = User & Partial<typeof userMetrics>

type Column = {
	id: string
	label: string
	sortable?: boolean
	render: (user: UserWithMetrics) => React.ReactNode
}

export function UserTable({ users }: { users: UserWithMetrics[] }) {
	// State for column visibility
	const [visibleColumns, setVisibleColumns] = useState<string[]>([
		'id',
		'email',
		'firstName',
		'lastName',
		'role',
		'createdAt',
		'loginCount',
		'lastLogin',
		'actions',
	])

	// State for search/filter
	const [searchTerm, setSearchTerm] = useState('')

	// State for sorting
	const [sortConfig, setSortConfig] = useState<{
		key: string
		direction: 'asc' | 'desc'
	} | null>(null)

	// Define columns
	const columns: Column[] = useMemo(
		() => [
			{
				id: 'id',
				label: 'ID',
				sortable: true,
				render: (user) => (
					<span className="font-mono text-xs">
						{user.id.substring(0, 8)}...
					</span>
				),
			},
			{
				id: 'email',
				label: 'Email',
				sortable: true,
				render: (user) => user.email,
			},
			{
				id: 'firstName',
				label: 'First Name',
				sortable: true,
				render: (user) => user.firstName || '-',
			},
			{
				id: 'lastName',
				label: 'Last Name',
				sortable: true,
				render: (user) => user.lastName || '-',
			},
			{
				id: 'role',
				label: 'Role',
				sortable: true,
				render: (user) => (
					<span
						className={`px-2 py-1 rounded-full text-xs ${user.role === 'admin' ? 'bg-purple-900 text-purple-100' : 'bg-blue-900 text-blue-100'}`}
					>
						{user.role}
					</span>
				),
			},
			{
				id: 'createdAt',
				label: 'Created At',
				sortable: true,
				render: (user) => new Date(user.createdAt).toLocaleDateString(),
			},
			{
				id: 'loginCount',
				label: 'Login Count',
				sortable: true,
				render: (user) => Number(user.loginCount || 0),
			},
			{
				id: 'lastLogin',
				label: 'Last Login',
				sortable: true,
				render: (user) =>
					user.lastLogin
						? new Date(user.lastLogin).toLocaleDateString()
						: 'Never',
			},
			{
				id: 'actions',
				label: 'Actions',
				render: (user) => (
					<div className="flex items-center gap-2">
						<Button
							variant="outline"
							size="icon"
							title="Edit User"
						>
							<Pencil className="h-4 w-4" />
						</Button>
						<Button
							variant="outline"
							size="icon"
							title="Delete User"
						>
							<Trash2 className="h-4 w-4" />
						</Button>
					</div>
				),
			},
		],
		[]
	)

	// Toggle column visibility
	const toggleColumnVisibility = (columnId: string) => {
		setVisibleColumns((prev) =>
			prev.includes(columnId)
				? prev.filter((id) => id !== columnId)
				: [...prev, columnId]
		)
	}

	// Handle sorting
	const handleSort = (columnId: string) => {
		setSortConfig((prev) => {
			if (prev?.key === columnId) {
				return {
					key: columnId,
					direction: prev.direction === 'asc' ? 'desc' : 'asc',
				}
			}
			return { key: columnId, direction: 'asc' }
		})
	}

	// Filter and sort users
	const filteredAndSortedUsers = useMemo(() => {
		// First filter
		let result = users.filter((user) => {
			const searchLower = searchTerm.toLowerCase()
			return (
				user.id.toLowerCase().includes(searchLower) ||
				user.email.toLowerCase().includes(searchLower) ||
				(user.firstName?.toLowerCase() || '').includes(searchLower) ||
				(user.lastName?.toLowerCase() || '').includes(searchLower) ||
				user.role.toLowerCase().includes(searchLower)
			)
		})

		// Then sort
		if (sortConfig) {
			result = [...result].sort((a, b) => {
				// Handle different column types
				let aValue: any = a[sortConfig.key as keyof UserWithMetrics]
				let bValue: any = b[sortConfig.key as keyof UserWithMetrics]

				// Handle undefined values
				if (aValue === undefined) aValue = null
				if (bValue === undefined) bValue = null

				// Compare based on type
				if (aValue === null && bValue === null) return 0
				if (aValue === null)
					return sortConfig.direction === 'asc' ? -1 : 1
				if (bValue === null)
					return sortConfig.direction === 'asc' ? 1 : -1

				// String comparison
				if (typeof aValue === 'string' && typeof bValue === 'string') {
					return sortConfig.direction === 'asc'
						? aValue.localeCompare(bValue)
						: bValue.localeCompare(aValue)
				}

				// Number or Date comparison
				return sortConfig.direction === 'asc'
					? aValue > bValue
						? 1
						: -1
					: aValue < bValue
						? 1
						: -1
			})
		}

		return result
	}, [users, searchTerm, sortConfig])

	// Get visible columns
	const visibleColumnsData = useMemo(
		() => columns.filter((col) => visibleColumns.includes(col.id)),
		[columns, visibleColumns]
	)

	return (
		<Card className="w-full">
			<CardHeader className="flex flex-row items-center justify-between">
				<div>
					<CardTitle>User Management</CardTitle>
					<CardDescription>
						View and manage all users in the system
					</CardDescription>
				</div>
				<div className="flex items-center gap-4">
					<div className="relative">
						<Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
						<Input
							type="search"
							placeholder="Search users..."
							className="pl-8 w-[250px]"
							value={searchTerm}
							onChange={(e: ChangeEvent<HTMLInputElement>) =>
								setSearchTerm(e.target.value)
							}
						/>
					</div>
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button
								variant="outline"
								size="sm"
							>
								<Eye className="mr-2 h-4 w-4" />
								Columns
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent
							align="end"
							className="w-[200px]"
						>
							{columns.map((column) => (
								<DropdownMenuCheckboxItem
									key={column.id}
									checked={visibleColumns.includes(column.id)}
									onCheckedChange={() =>
										toggleColumnVisibility(column.id)
									}
								>
									{column.label}
								</DropdownMenuCheckboxItem>
							))}
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
			</CardHeader>
			<CardContent>
				<div className="rounded-md border">
					<Table>
						<TableHeader>
							<TableRow>
								{visibleColumnsData.map((column) => (
									<TableHead key={column.id}>
										{column.sortable ? (
											<Button
												variant="ghost"
												onClick={() =>
													handleSort(column.id)
												}
												className="flex items-center gap-1 p-0 font-medium"
											>
												{column.label}
												{sortConfig?.key ===
													column.id && (
													<ArrowUpDown className="h-4 w-4" />
												)}
											</Button>
										) : (
											column.label
										)}
									</TableHead>
								))}
							</TableRow>
						</TableHeader>
						<TableBody>
							{filteredAndSortedUsers.length === 0 ? (
								<TableRow>
									<TableCell
										colSpan={visibleColumnsData.length}
										className="h-24 text-center"
									>
										No users found.
									</TableCell>
								</TableRow>
							) : (
								filteredAndSortedUsers.map((user) => (
									<TableRow key={user.id}>
										{visibleColumnsData.map((column) => (
											<TableCell
												key={`${user.id}-${column.id}`}
											>
												{column.render(user)}
											</TableCell>
										))}
									</TableRow>
								))
							)}
						</TableBody>
					</Table>
				</div>
				<div className="mt-4 text-sm text-muted-foreground">
					Showing {filteredAndSortedUsers.length} of {users.length}{' '}
					users
				</div>
			</CardContent>
		</Card>
	)
}
