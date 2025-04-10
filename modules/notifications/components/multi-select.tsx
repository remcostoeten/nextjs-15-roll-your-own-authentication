'use client'

import * as React from 'react'
import { X } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Command, CommandGroup, CommandItem } from '@/components/ui/command'
import { Command as CommandPrimitive } from 'cmdk'

interface MultiSelectProps {
	options: { value: string; label: string }[]
	selected: string[]
	onChange: (selected: string[]) => void
	placeholder?: string
	disabled?: boolean
}

export function MultiSelect({
	options,
	selected,
	onChange,
	placeholder = 'Select options',
	disabled = false,
}: MultiSelectProps) {
	const inputRef = React.useRef<HTMLInputElement>(null)
	const [open, setOpen] = React.useState(false)
	const [inputValue, setInputValue] = React.useState('')

	const handleUnselect = (value: string) => {
		onChange(selected.filter((s) => s !== value))
	}

	const handleSelect = (value: string) => {
		if (selected.includes(value)) {
			onChange(selected.filter((s) => s !== value))
		} else {
			onChange([...selected, value])
		}
	}

	const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
		const input = inputRef.current
		if (input) {
			if (e.key === 'Delete' || e.key === 'Backspace') {
				if (input.value === '' && selected.length > 0) {
					onChange(selected.slice(0, -1))
				}
			}
			if (e.key === 'Escape') {
				input.blur()
			}
		}
	}

	const selectables = options.filter(
		(option) => !selected.includes(option.value)
	)

	return (
		<Command
			onKeyDown={handleKeyDown}
			className="overflow-visible bg-transparent"
			shouldFilter={false}
		>
			<div
				className="group border border-input px-3 py-2 text-sm ring-offset-background rounded-md focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2"
				onClick={() => {
					inputRef.current?.focus()
				}}
			>
				<div className="flex flex-wrap gap-1">
					{selected.map((value) => {
						const option = options.find((o) => o.value === value)
						return (
							<Badge
								key={value}
								variant="secondary"
								className="rounded-sm px-1 py-0"
							>
								{option?.label || value}
								<button
									className="ml-1 rounded-full outline-none ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2"
									onKeyDown={(e) => {
										if (e.key === 'Enter') {
											handleUnselect(value)
										}
									}}
									onMouseDown={(e) => {
										e.preventDefault()
										e.stopPropagation()
									}}
									onClick={() => handleUnselect(value)}
									disabled={disabled}
								>
									<X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
								</button>
							</Badge>
						)
					})}
					<CommandPrimitive.Input
						ref={inputRef}
						value={inputValue}
						onValueChange={setInputValue}
						onBlur={() => setOpen(false)}
						onFocus={() => setOpen(true)}
						placeholder={
							selected.length === 0 ? placeholder : undefined
						}
						className="ml-2 flex-1 bg-transparent outline-none placeholder:text-muted-foreground"
						disabled={disabled}
					/>
				</div>
			</div>
			<div className="relative">
				{open && selectables.length > 0 ? (
					<div className="absolute top-0 z-10 w-full rounded-md border bg-popover text-popover-foreground shadow-md outline-none animate-in">
						<CommandGroup className="h-full overflow-auto max-h-[200px]">
							{selectables.map((option) => {
								return (
									<CommandItem
										key={option.value}
										onMouseDown={(e) => {
											e.preventDefault()
											e.stopPropagation()
										}}
										onSelect={() => {
											handleSelect(option.value)
											setInputValue('')
										}}
										className="cursor-pointer"
									>
										{option.label}
									</CommandItem>
								)
							})}
						</CommandGroup>
					</div>
				) : null}
			</div>
		</Command>
	)
}
