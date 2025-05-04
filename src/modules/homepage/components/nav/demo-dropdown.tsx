'use client'

import { memo } from 'react'
import { ChevronDown } from 'lucide-react'
import { motion } from 'framer-motion'
import { For } from '@/components/ui/core/for'
import { MATRIX_BACKGROUND } from '../../constants'
import Link from 'next/link'

interface DemoItem {
	name: string
	href: string
	description: string
	soon?: boolean
}

interface DemoDropdownProps {
	demoItems: DemoItem[]
}

function DemoItemComponent({ item }: { item: DemoItem }) {
	return (
		<Link
			href={item.href}
			className='block px-4 py-2 text-sm text-[#8C877D] transition-colors duration-200 hover:bg-[#1E1E1E] hover:text-white'
		>
			<div className='flex items-center justify-between font-medium'>
				{item.name}
				{item.soon && (
					<span className='rounded border border-[#2D2D2D] bg-[#1E1E1E] px-1.5 py-0.5 text-xs text-[#8C877D]'>
						Soon
					</span>
				)}
			</div>
			{item.description && (
				<div className='mt-0.5 text-xs text-[#8C877D]'>
					{item.description}
				</div>
			)}
		</Link>
	)
}

const MemoizedDemoItem = memo(DemoItemComponent)

function DemoDropdownComponent({ demoItems }: DemoDropdownProps) {
	return (
		<div className='group relative'>
			<div className='flex cursor-pointer items-center gap-1 text-[#8C877D] transition-colors duration-200 hover:text-white'>
				<span className='font-mono'>_demos</span>
				<motion.div
					initial={{ rotate: 0 }}
					className='inline-flex h-4 w-4 items-center justify-center transition-colors duration-200 group-hover:text-[#4e9815]'
				>
					<ChevronDown className='h-4 w-4 transition-transform duration-300 group-hover:rotate-180' />
				</motion.div>
			</div>

			<div className='invisible absolute left-0 mt-2 w-56 translate-y-[-8px] transform opacity-0 transition-all duration-200 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100'>
				<div className='overflow-hidden rounded-md border border-[#1E1E1E] bg-[#0D0C0C]/95 backdrop-blur-md shadow-lg'>
					{/* Matrix code background */}
					<div
						className='absolute inset-0 overflow-hidden rounded-md opacity-5'
						style={MATRIX_BACKGROUND}
					/>

					<div className='relative z-10 py-1'>
						<For
							each={demoItems}
							keyExtractor={(item) => item.name}
							memoizeChildren={true}
						>
							{(item) => <MemoizedDemoItem item={item} />}
						</For>
					</div>
				</div>
			</div>
		</div>
	)
}

export const DemoDropdown = memo(DemoDropdownComponent)
