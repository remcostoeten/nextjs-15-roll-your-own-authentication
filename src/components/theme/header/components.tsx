import { AnimatePresence, motion } from 'framer-motion'
import { Search, X } from 'lucide-react'
import Link from 'next/link'
import { Avatar, AvatarFallback, AvatarImage } from 'ui'
import type { DropdownItem } from './header.d'

/**
 * Search modal component
 * @author Remco Stoeten
 */
export function SearchModal({
	isOpen,
	onClose
}: {
	isOpen: boolean
	onClose: () => void
}) {
	return (
		<AnimatePresence>
			{isOpen && (
				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0 }}
					className="fixed inset-0 z-50"
				>
					<div
						className="absolute inset-0 bg-black/60 backdrop-blur-sm"
						onClick={onClose}
					/>
					<motion.div
						initial={{ scale: 0.95, opacity: 0 }}
						animate={{ scale: 1, opacity: 1 }}
						exit={{ scale: 0.95, opacity: 0 }}
						className="relative max-w-2xl mx-auto mt-[15vh]"
					>
						<div className="m-4 bg-background border border-border rounded-xl shadow-2xl overflow-hidden">
							<div className="flex items-center p-4 border-b border-border">
								<Search className="w-5 h-5 text-muted-foreground" />
								<input
									autoFocus
									placeholder="Search..."
									className="flex-1 ml-3 bg-transparent border-none outline-none text-foreground placeholder-muted-foreground"
								/>
								<kbd className="hidden sm:inline-flex items-center px-2 py-1 text-xs text-muted-foreground bg-muted rounded">
									ESC
								</kbd>
							</div>
							<div className="p-4">
								<div className="text-sm text-muted-foreground">
									No recent searches
								</div>
							</div>
						</div>
					</motion.div>
				</motion.div>
			)}
		</AnimatePresence>
	)
}

/**
 * Dropdown menu component
 * @author Remco Stoeten
 */
export function DropdownMenu({
	items,
	isOpen,
	onClose
}: {
	items: DropdownItem[]
	isOpen: boolean
	onClose: () => void
}) {
	return (
		<AnimatePresence>
			{isOpen && (
				<>
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						className="fixed inset-0 z-30"
						onClick={onClose}
					/>
					<motion.div
						initial={{ opacity: 0, y: 8, scale: 0.96 }}
						animate={{ opacity: 1, y: 0, scale: 1 }}
						exit={{ opacity: 0, y: 8, scale: 0.96 }}
						className="absolute top-[120%] left-0 min-w-[320px] p-2 bg-background border border-border rounded-xl shadow-xl z-40"
					>
						{items.map((item) => (
							<Link
								key={item.label}
								href={item.href}
								onClick={onClose}
								className="relative flex flex-col gap-0.5 px-4 py-3 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent group"
							>
								<span className="font-medium text-[14px]">
									{item.label}
								</span>
								{item.description && (
									<span className="text-[13px] text-muted-foreground/70 group-hover:text-muted-foreground">
										{item.description}
									</span>
								)}
							</Link>
						))}
					</motion.div>
				</>
			)}
		</AnimatePresence>
	)
}

/**
 * Mobile menu component
 * @author Remco Stoeten
 */
export function MobileMenu({
	isOpen,
	onClose,
	user,
	onSignOut
}: {
	isOpen: boolean
	onClose: () => void
	user: any
	onSignOut: () => void
}) {
	return (
		<AnimatePresence>
			{isOpen && (
				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0 }}
					className="fixed inset-0 z-50"
				>
					<div
						className="absolute inset-0 bg-black/50 backdrop-blur-sm"
						onClick={onClose}
					/>
					<motion.div
						initial={{ x: '100%' }}
						animate={{ x: 0 }}
						exit={{ x: '100%' }}
						className="absolute right-0 top-0 bottom-0 w-3/4 max-w-sm bg-background border-l border-border"
					>
						<div className="flex flex-col h-full">
							<div className="flex items-center justify-between p-4 border-b border-border">
								<span className="text-lg font-medium">
									Menu
								</span>
								<button
									onClick={onClose}
									className="p-2 text-muted-foreground hover:text-foreground"
								>
									<X className="w-5 h-5" />
								</button>
							</div>

							<nav className="flex-1 overflow-y-auto p-4">
								<div className="space-y-1">
									<Link
										href="/dashboard"
										className="block px-4 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-accent rounded-lg"
										onClick={onClose}
									>
										Dashboard
									</Link>
									<Link
										href="/settings"
										className="block px-4 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-accent rounded-lg"
										onClick={onClose}
									>
										Settings
									</Link>
								</div>
							</nav>

							<div className="p-4 border-t border-border">
								{user ? (
									<div className="space-y-3">
										<div className="flex items-center gap-3">
											<Avatar>
												<AvatarImage
													src={user.avatar}
												/>
												<AvatarFallback>
													{user.name[0]}
												</AvatarFallback>
											</Avatar>
											<div>
												<p className="text-sm font-medium">
													{user.name}
												</p>
												<p className="text-xs text-muted-foreground">
													{user.email}
												</p>
											</div>
										</div>
										<button
											onClick={() => {
												onSignOut()
												onClose()
											}}
											className="w-full px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent rounded-lg"
										>
											Sign out
										</button>
									</div>
								) : (
									<Link
										href="/login"
										className="w-full px-4 py-2 text-sm font-medium text-foreground bg-primary hover:bg-primary/90 rounded-lg text-center"
										onClick={onClose}
									>
										Sign in
									</Link>
								)}
							</div>
						</div>
					</motion.div>
				</motion.div>
			)}
		</AnimatePresence>
	)
}
