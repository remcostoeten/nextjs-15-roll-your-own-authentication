'use client'

import { useState, useEffect } from 'react'
import { DataTable } from './data-table/data-table'
import { columns } from './data-table/columns'
import { ShieldAlert, ShieldQuestion } from 'lucide-react'
import { getAllUsers } from '@/modules/admin/api/queries'

export function UserTable() {
	const [users, setUsers] = useState([])
	const [loading, setLoading] = useState(true)

	useEffect(() => {
		const fetchUsers = async () => {
			try {
				const fetchedUsers = await getAllUsers()
				setUsers(fetchedUsers)
			} catch (error) {
				console.error('Error fetching users:', error)
			} finally {
				setLoading(false)
			}
		}

		fetchUsers()
	}, [])

	const filterableColumns = [
		{
			id: 'isAdmin',
			title: 'Role',
			options: [
				{
					label: 'Admin',
					value: 'true',
					icon: ShieldAlert,
				},
				{
					label: 'User',
					value: 'false',
					icon: ShieldQuestion,
				},
			],
		},
	]

	const searchableColumns = [
		{
			id: 'name',
			title: 'Name',
		},
		{
			id: 'email',
			title: 'Email',
		},
		{
			id: 'username',
			title: 'Username',
		},
	]

	if (loading) {
		return <div>Loading users...</div>
	}

	return (
		<DataTable
			columns={columns}
			data={users}
			filterableColumns={filterableColumns}
			searchableColumns={searchableColumns}
			advancedFilter={true}
		/>
	)
}
