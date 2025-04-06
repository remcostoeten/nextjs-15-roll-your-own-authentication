'use client'

import type React from 'react'
import type { Table } from '@tanstack/react-table'
import { X } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { DataTableViewOptions } from './data-table-view-options'

interface DataTableToolbarProps<TData> {
	table: Table<TData>
	filterableColumns?: {
		id: string
		title: string
		options: {
			label: string
			value: string
			icon?: React.ComponentType<{ className?: string }>
		}[]
	}[]
	searchableColumns?: {
		id: string
		title: string
	}[]
	advancedFilter?: boolean
}

export function DataTableToolbar<TData>({
	table,
	filterableColumns = [],
	searchableColumns = [],
	advancedFilter = false,
}: DataTableToolbarProps<TData>) {
	const isFiltered = table.getState().columnFilters.length > 0
	const globalFilter = table.getState().globalFilter

	return (
		<div className="flex flex-col gap-4 py-4">
			<div className="flex flex-wrap items-center justify-between gap-2">
				<div className="flex flex-1 items-center space-x-2">
					<Input
						placeholder="Search all columns..."
						value={globalFilter ?? ''}
						onChange={(event) =>
							table.setGlobalFilter(event.target.value)
						}
						className="h-9 w-[150px] lg:w-[250px]"
					/>
					{isFiltered && (
						<Button
							variant="ghost"
							onClick={() => {
								table.resetColumnFilters()
								table.setGlobalFilter('')
							}}
							className="h-9 px-2 lg:px-3"
						>
							Reset
							<X className="ml-2 h-4 w-4" />
						</Button>
					)}
				</div>
				<DataTableViewOptions table={table} />
			</div>
			{advancedFilter && filterableColumns.length > 0 && (
				<div className="flex flex-wrap gap-2">
					{filterableColumns.map(
						(column) =>
							table.getColumn(column.id) && (
								<DataTableFacetedFilter
									key={column.id}
									column={table.getColumn(column.id)}
									title={column.title}
									options={column.options}
								/>
							)
					)}
				</div>
			)}
		</div>
	)
}
