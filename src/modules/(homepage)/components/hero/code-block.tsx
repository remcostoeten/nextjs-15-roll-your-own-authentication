'use client'

import { useState, useEffect, useRef, JSXElementConstructor, Key, ReactElement, ReactNode, ReactPortal } from 'react'
import { Copy, Check } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { USER_CREATION_CODE } from './data/syntax-highlighting'

const getRawCode = (activeTab: string) => {
	const codeExample = activeTab === 'jwt-handler.ts' ? USER_CREATION_CODE : USER_LOGIN_CODE
	return codeExample
		.map((line: { content: any[] }) => line.content.map((token: { content: any }) => token.content).join(''))
		.join('\n')
}

export function CodeBlock() {
	const [activeTab, setActiveTab] = useState('jwt-handler.ts')
	const [copied, setCopied] = useState(false)
	const [visibleLines, setVisibleLines] = useState(0)
	const codeContainerRef = useRef<HTMLDivElement>(null)

	const copyCode = () => {
		navigator.clipboard.writeText(getRawCode(activeTab))
		setCopied(true)
		setTimeout(() => setCopied(false), 2000)
	}

	// Reset visible lines when tab changes
	useEffect(() => {
		setVisibleLines(0)
	}, [activeTab])

	useEffect(() => {
		// Animate code lines appearing one by one
		const codeExample = activeTab === 'jwt-handler.ts' ? USER_CREATION_CODE : USER_LOGIN_CODE

		if (visibleLines < codeExample.length) {
			const timer = setTimeout(() => {
				setVisibleLines((prev) => prev + 1)
			}, 50)

			return () => clearTimeout(timer)
		}
	}, [visibleLines, activeTab])

	// Get the current code example based on active tab
	const currentCodeExample = activeTab === 'jwt-handler.ts' ? USER_CREATION_CODE : USER_LOGIN_CODE

	return (
		<motion.div
			className="w-full rounded-lg border border-[#1E1E1E] bg-[#0D0C0C] overflow-hidden shadow-lg sticky-code-block"
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.5, delay: 0.2 }}
		>
			{/* Tab header */}
			<motion.div
				className="flex items-center justify-between border-b border-[#1E1E1E] bg-[#0D0C0C] px-4 py-2"
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				transition={{ duration: 0.3, delay: 0.3 }}
			>
				<div className="flex">
					{['jwt-handler.ts', 'password-utils.ts'].map((tab, index) => (
						<motion.button
							key={tab}
							className={`relative px-4 py-2 text-sm font-medium transition-all duration-200 ${
								index === 0 ? '' : 'ml-1'
							} ${
								activeTab === tab
									? 'text-[#F2F0ED] after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:bg-[#4e9815]'
									: 'text-[#8C877D] hover:text-[#ADADAD]'
							}`}
							onClick={() => setActiveTab(tab)}
						>
							{tab}
						</motion.button>
					))}
				</div>
				<motion.button
					onClick={copyCode}
					className="rounded-full p-1.5 hover:bg-[#1E1E1E] transition-colors duration-200"
					aria-label={copied ? 'Copied' : 'Copy code'}
					whileHover={{ scale: 1.05 }}
					whileTap={{ scale: 0.95 }}
				>
					<AnimatePresence
						mode="wait"
						initial={false}
					>
						{copied ? (
							<motion.div
								key="check"
								initial={{ scale: 0.8, opacity: 0 }}
								animate={{ scale: 1, opacity: 1 }}
								exit={{ scale: 0.8, opacity: 0 }}
								transition={{ duration: 0.15 }}
							>
								<Check className="h-4 w-4 text-[#4e9815]" />
							</motion.div>
						) : (
							<motion.div
								key="copy"
								initial={{ scale: 0.8, opacity: 0 }}
								animate={{ scale: 1, opacity: 1 }}
								exit={{ scale: 0.8, opacity: 0 }}
								transition={{ duration: 0.15 }}
							>
								<Copy className="h-4 w-4 text-[#8C877D]" />
							</motion.div>
						)}
					</AnimatePresence>
				</motion.button>
			</motion.div>

			{/* Code content */}
			<div className="relative h-[400px] overflow-hidden">
				<div
					ref={codeContainerRef}
					className="absolute inset-0 overflow-y-auto overflow-x-hidden"
				>
					<table className="w-full border-collapse">
						<tbody>
							{currentCodeExample.map((line: { lineNumber: any; content: any[] }, index: number) => (
								<motion.tr
									key={`${activeTab}-${line.lineNumber}`}
									initial={{ opacity: 0, y: -5 }}
									animate={{
										opacity: index < visibleLines ? 1 : 0,
										y: index < visibleLines ? 0 : -5,
									}}
									transition={{ duration: 0.2, delay: index * 0.05 }}
								>
									<td className="w-12 pr-4 text-right font-mono text-xs text-[#444] select-none bg-[#0A0A0A] border-r border-[#1E1E1E]">
										{String(line.lineNumber).padStart(2, '0')}
									</td>
									<td className="pl-4 font-mono text-sm">
										{line.content.map(
											(
												token: {
													type: any
													content:
														| string
														| number
														| bigint
														| boolean
														| ReactElement<unknown, string | JSXElementConstructor<any>>
														| Iterable<ReactNode>
														| ReactPortal
														| Promise<
																| string
																| number
																| bigint
																| boolean
																| ReactPortal
																| ReactElement<
																		unknown,
																		string | JSXElementConstructor<any>
																  >
																| Iterable<ReactNode>
																| null
																| undefined
														  >
														| null
														| undefined
												},
												i: Key | null | undefined
											) => (
												<span
													key={i}
													className={`token ${token.type}`}
												>
													{token.content}
												</span>
											)
										)}
									</td>
								</motion.tr>
							))}
						</tbody>
					</table>
				</div>
			</div>

			{/* Status bar */}
			<div className="border-t border-[#1E1E1E] bg-[#0D0C0C] px-4 py-2 text-xs text-[#444] font-mono">
				{activeTab === 'jwt-handler.ts' ? 'auth/jwt-handler.ts' : 'auth/password-utils.ts'}
			</div>
		</motion.div>
	)
}
